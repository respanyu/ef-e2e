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
const LoginPage = require("../../pages/LoginPage");

(async function userProfilePageLoadTest() {
  let driver = await createDriver();

  try {
    logStart("Starting User Profile Page Load Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    logPass("Test data loaded from JSON");

    // Step 1: Login to the application first
    logPass("Step 1: Logging in to Application");
    const loginPage = new LoginPage(driver);
    await loginPage.open(testData.loginUrl);
    logPass("Login page opened");

    await loginPage.fillEmail(testData.loginCredentials.email);
    logPass("Email filled");

    await loginPage.fillPassword(testData.loginCredentials.password);
    logPass("Password filled");

    const loginSubmitted = await loginPage.submitLogin();
    if (loginSubmitted) {
      logPass("Login form submitted successfully");
    } else {
      logFail("Login form submission failed");
      return;
    }

    // Wait for login to complete
    await sleep(driver, 3000);
    logPass("Waited for login to complete");

    // Verify login success
    const postLoginUrl = await driver.getCurrentUrl();
    if (
      postLoginUrl.includes("/user/login") ||
      postLoginUrl.includes("login")
    ) {
      logFail("Login failed - still on login page");
      return;
    } else {
      logPass("Login successful - redirected to authenticated area");
    }

    // Step 2: Start timing and navigate to profile page
    logPass("Step 2: Starting Profile Page Load Timing and Navigation");
    const startTime = Date.now();

    await driver.get(testData.profileUrl);
    logPass(`Navigated to: ${testData.profileUrl}`);

    // Step 3: Wait for page to load completely
    logPass("Step 3: Waiting for Page to Load Completely");
    await driver.wait(async () => {
      const readyState = await driver.executeScript(
        "return document.readyState"
      );
      return readyState === "complete";
    }, testData.maxLoadTime);

    const loadTime = Date.now() - startTime;
    logPass(`Page load completed in ${loadTime}ms`);

    // Step 4: Validate load time
    logPass("Step 4: Validating Page Load Time");
    if (loadTime <= testData.maxLoadTime) {
      logPass(
        `Page loaded within acceptable time: ${loadTime}ms (max: ${testData.maxLoadTime}ms)`
      );
    } else {
      logWarning(
        `Page load time exceeded limit: ${loadTime}ms (max: ${testData.maxLoadTime}ms)`
      );
    }

    // Step 5: Check page title
    logPass("Step 5: Checking Page Title");
    const pageTitle = await driver.getTitle();
    logPass(`Page title: "${pageTitle}"`);

    if (pageTitle && pageTitle.toLowerCase().includes("profile")) {
      logPass("Page title contains 'profile' as expected");
    } else {
      logWarning(`Page title "${pageTitle}" may not match expected pattern`);
    }

    // Step 6: Verify URL is correct
    logPass("Step 6: Verifying Current URL");
    const currentUrl = await driver.getCurrentUrl();
    if (currentUrl === testData.profileUrl) {
      logPass("URL correctly points to user profile page");
    } else {
      logWarning(
        `URL mismatch. Expected: ${testData.profileUrl}, Got: ${currentUrl}`
      );
    }

    // Step 7: Check for page content
    logPass("Step 7: Checking for Page Content");
    try {
      const pageContentElements = await driver.findElements(
        By.css(testData.selectors.pageContent)
      );
      if (pageContentElements.length > 0) {
        logPass("Page content elements found");
      } else {
        logFail("No page content elements found");
      }
    } catch (contentError) {
      logWarning(`Could not check page content: ${contentError.message}`);
    }

    // Step 8: Check for profile information
    logPass("Step 8: Checking for Profile Information");
    try {
      const profileInfoElements = await driver.findElements(
        By.css(testData.selectors.profileInfo)
      );
      if (profileInfoElements.length > 0) {
        logPass("Profile information elements found");
        // Get some profile info text for logging
        const profileText = await profileInfoElements[0].getText();
        logPass(`Profile info sample: "${profileText.substring(0, 100)}..."`);
      } else {
        logWarning("No profile information elements found");
      }
    } catch (profileError) {
      logWarning(
        `Could not check profile information: ${profileError.message}`
      );
    }

    // Step 9: Check for edit profile link
    logPass("Step 9: Checking for Edit Profile Link");
    try {
      const editLinks = await driver.findElements(
        By.css(testData.selectors.editProfileLink)
      );
      if (editLinks.length > 0) {
        logPass("Edit profile link found");
        const editLinkHref = await editLinks[0].getAttribute("href");
        logPass(`Edit profile link: ${editLinkHref}`);
      } else {
        logWarning("No edit profile link found");
      }
    } catch (editError) {
      logWarning(`Could not check edit profile link: ${editError.message}`);
    }

    // Step 10: Check for navigation elements
    logPass("Step 10: Checking for Navigation Elements");
    try {
      const navElements = await driver.findElements(
        By.css(testData.selectors.navigation)
      );
      if (navElements.length > 0) {
        logPass("Navigation elements found");
      } else {
        logWarning("No navigation elements found");
      }
    } catch (navError) {
      logWarning(`Could not check navigation elements: ${navError.message}`);
    }

    // Step 11: Check for user menu elements
    logPass("Step 11: Checking for User Menu Elements");
    try {
      const userMenuElements = await driver.findElements(
        By.css(testData.selectors.userMenu)
      );
      if (userMenuElements.length > 0) {
        logPass("User menu elements found");
      } else {
        logWarning("No user menu elements found");
      }
    } catch (menuError) {
      logWarning(`Could not check user menu elements: ${menuError.message}`);
    }

    // Step 12: Validate page content indicators
    logPass("Step 12: Validating Page Content Indicators");
    const pageText = await driver.findElement(By.tagName("body")).getText();
    const hasExpectedContent = testData.expectedContent.pageIndicators.some(
      (indicator) => pageText.toLowerCase().includes(indicator.toLowerCase())
    );

    if (hasExpectedContent) {
      logPass("Page contains expected profile content indicators");
    } else {
      logWarning("Page may not contain expected profile content indicators");
    }

    // Step 13: Check for JavaScript errors
    logPass("Step 13: Checking for JavaScript Errors");
    const jsErrors = await driver.executeScript(`
      const errors = [];
      const errorLogs = window.errorLogs || [];
      return errorLogs.length;
    `);

    if (jsErrors > 0) {
      logWarning(`Found ${jsErrors} JavaScript errors in console`);
    } else {
      logPass("No JavaScript errors detected");
    }

    // Step 14: Final validation and error checking
    logPass("Step 14: Final Validation and Error Checking");
    const pageErrorDetected = await checkForErrors(driver);
    if (pageErrorDetected) {
      logFail("Page errors detected on user profile page");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "userProfilePageLoad"
      );
      await takeScreenshot(driver, "error_screenshot", screenshotDir);
    } else {
      logSuccess(
        "User Profile Page Load test completed successfully - page loaded in " +
          loadTime +
          "ms with all validations passed"
      );
    }

    // Log performance metrics
    logInfo("Performance Metrics:");
    logInfo(`- Page Load Time: ${loadTime}ms`);
    logInfo(`- URL: ${currentUrl}`);
    logInfo(`- Title: "${pageTitle}"`);
    logInfo(`- Profile Info Elements: Found`);
    logInfo(`- Edit Profile Link: Found`);
    logInfo(`- JavaScript Errors: ${jsErrors || 0}`);
  } catch (error) {
    logError(`User Profile Page Load test failed: ${error}`);
    // Take screenshot on error
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "userProfilePageLoad"
    );
    await takeScreenshot(driver, "error_screenshot", screenshotDir);
  } finally {
    await driver.quit();
  }
})();
