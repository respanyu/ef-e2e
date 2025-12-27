const fs = require("fs");
const path = require("path");
const { By } = require("selenium-webdriver");
const { createDriver } = require("../../utils/driver");
const { sleep } = require("../../utils/wait");
const { checkForErrors } = require("../../utils/errors");
const { takeScreenshot } = require("../../utils/screenshot");
const {
  logPass,
  logFail,
  logError,
  logSuccess,
  logStart,
  logWarning,
  logInfo,
} = require("../../utils/logger");

(async function unauthenticatedProfileAccessTest() {
  let driver = await createDriver();

  try {
    logStart("Starting Unauthenticated Profile Access Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    logPass("Test data loaded from JSON");

    // Step 1: Attempt to access profile page without authentication
    logPass("Step 1: Attempting to access profile page without authentication");
    const startTime = Date.now();

    await driver.get(testData.profileUrl);
    logPass("Navigated to profile page URL");

    // Wait for page to load
    await sleep(driver, 2000);
    const loadTime = Date.now() - startTime;
    logPass(`Page load completed in ${loadTime}ms`);

    // Step 2: Check current URL to see if redirected
    logPass("Step 2: Checking if user was redirected");
    const currentUrl = await driver.getCurrentUrl();
    logInfo(`Current URL: ${currentUrl}`);

    let redirectedToLogin = false;
    let accessDenied = false;

    if (
      currentUrl.includes("/login") ||
      currentUrl === testData.expectedRedirectUrl
    ) {
      redirectedToLogin = true;
      logPass("User was correctly redirected to login page");
    } else if (currentUrl === testData.profileUrl) {
      logWarning(
        "User was not redirected - checking for access denied messages"
      );
    } else {
      logWarning(`Unexpected redirect to: ${currentUrl}`);
    }

    // Step 3: Check page title
    logPass("Step 3: Checking page title");
    const pageTitle = await driver.getTitle();
    logInfo(`Page title: "${pageTitle}"`);

    // Step 4: Check for login form elements (if redirected to login)
    logPass("Step 4: Checking for login form elements");
    try {
      const loginForm = await driver.findElements(
        By.css(testData.selectors.loginForm)
      );
      if (loginForm.length > 0) {
        logPass("Login form found - user correctly redirected to login page");
        redirectedToLogin = true;
      } else {
        logWarning("No login form found on current page");
      }
    } catch (error) {
      logWarning(`Could not check for login form: ${error.message}`);
    }

    // Step 5: Check for error messages or access denied indicators
    logPass("Step 5: Checking for error messages or access denied indicators");
    try {
      // Check for error message elements
      const errorElements = await driver.findElements(
        By.css(testData.selectors.errorMessage)
      );
      if (errorElements.length > 0) {
        for (let element of errorElements) {
          const errorText = await element.getText();
          if (errorText) {
            logInfo(`Error message found: "${errorText}"`);
            const lowerErrorText = errorText.toLowerCase();
            if (
              testData.expectedErrorMessages.some((msg) =>
                lowerErrorText.includes(msg)
              )
            ) {
              accessDenied = true;
              logPass("Access denied error message found");
              break;
            }
          }
        }
      }

      // Check for access denied specific elements
      const accessDeniedElements = await driver.findElements(
        By.css(testData.selectors.accessDenied)
      );
      if (accessDeniedElements.length > 0) {
        accessDenied = true;
        logPass("Access denied elements found on page");
      }

      // Check page content for error keywords
      const bodyText = await driver.findElement(By.tagName("body")).getText();
      const lowerBodyText = bodyText.toLowerCase();
      if (
        testData.expectedErrorMessages.some((msg) =>
          lowerBodyText.includes(msg)
        )
      ) {
        accessDenied = true;
        logPass("Access denied message found in page content");
      }
    } catch (error) {
      logWarning(`Could not check for error messages: ${error.message}`);
    }

    // Step 6: Check for profile-specific content (should not be present)
    logPass("Step 6: Checking that profile content is not accessible");
    try {
      const profileContent = await driver.findElements(
        By.css('.profile-info, .user-info, [class*="profile"]')
      );
      if (profileContent.length === 0) {
        logPass("No profile content found - access correctly restricted");
      } else {
        logWarning(
          "Profile content found - this may indicate a security issue"
        );
        // Take screenshot for investigation
        const screenshotDir = path.join(
          __dirname,
          "..",
          "..",
          "reports",
          "screenshots",
          "unauthenticatedProfileAccess"
        );
        await takeScreenshot(
          driver,
          "profile_content_found_unauthenticated",
          screenshotDir
        );
      }
    } catch (error) {
      logWarning(`Could not check for profile content: ${error.message}`);
    }

    // Step 7: Check for JavaScript errors
    logPass("Step 7: Checking for JavaScript errors");
    const jsErrors = await checkForErrors(driver);
    if (jsErrors === 0) {
      logPass("No JavaScript errors detected");
    } else {
      logWarning(`${jsErrors} JavaScript errors detected`);
    }

    // Step 8: Final validation
    logPass("Step 8: Final validation and security assessment");

    if (redirectedToLogin) {
      logSuccess(
        "SECURITY PASS: Unauthenticated user correctly redirected to login page"
      );
    } else if (accessDenied) {
      logSuccess("SECURITY PASS: Access denied message properly displayed");
    } else {
      logError(
        "SECURITY FAIL: Unauthenticated user may have accessed protected profile page"
      );
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "unauthenticatedProfileAccess"
      );
      await takeScreenshot(
        driver,
        "security_violation_profile_access",
        screenshotDir
      );
    }

    // Performance check
    if (loadTime > testData.maxLoadTime) {
      logWarning(
        `Page load time ${loadTime}ms exceeded maximum ${testData.maxLoadTime}ms`
      );
    } else {
      logPass(`Page loaded within acceptable time: ${loadTime}ms`);
    }

    logSuccess("Unauthenticated Profile Access test completed successfully");

    // Log performance metrics
    logInfo("Security Test Results:");
    logInfo(`- Redirected to Login: ${redirectedToLogin}`);
    logInfo(`- Access Denied Message: ${accessDenied}`);
    logInfo(`- Current URL: ${currentUrl}`);
    logInfo(`- Page Load Time: ${loadTime}ms`);
    logInfo(`- JavaScript Errors: ${jsErrors || 0}`);
  } catch (error) {
    logError(`Unauthenticated Profile Access test failed: ${error.message}`);
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "unauthenticatedProfileAccess"
    );
    await takeScreenshot(
      driver,
      "error_screenshot_" + new Date().toISOString().replace(/[:.]/g, "-"),
      screenshotDir
    );
    throw error;
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
})().catch(console.error);
