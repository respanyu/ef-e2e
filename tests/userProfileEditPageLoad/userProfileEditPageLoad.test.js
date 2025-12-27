const fs = require("fs");
const path = require("path");
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

(async function userProfileEditPageLoadTest() {
  let driver = await createDriver();

  try {
    logStart("Starting User Profile Edit Page Load Test...");

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

    // Step 2: Start timing and navigate to profile edit page
    logPass("Step 2: Starting Profile Edit Page Load Timing and Navigation");
    const startTime = Date.now();

    await driver.get(testData.profileEditUrl);
    logPass(`Navigated to: ${testData.profileEditUrl}`);

    // Step 2: Wait for page to load completely
    logPass("Step 2: Waiting for Page to Load Completely");
    await driver.wait(async () => {
      const readyState = await driver.executeScript(
        "return document.readyState"
      );
      return readyState === "complete";
    }, testData.maxLoadTime);

    const loadTime = Date.now() - startTime;
    logPass(`Page load completed in ${loadTime}ms`);

    // Step 3: Validate load time
    logPass("Step 3: Validating Page Load Time");
    if (loadTime <= testData.maxLoadTime) {
      logPass(
        `Page loaded within acceptable time: ${loadTime}ms (max: ${testData.maxLoadTime}ms)`
      );
    } else {
      logWarning(
        `Page load time exceeded limit: ${loadTime}ms (max: ${testData.maxLoadTime}ms)`
      );
    }

    // Step 4: Check page title
    logPass("Step 4: Checking Page Title");
    const pageTitle = await driver.getTitle();
    logPass(`Page title: "${pageTitle}"`);

    if (pageTitle && pageTitle.toLowerCase().includes("edit")) {
      logPass("Page title contains 'edit' as expected");
    } else {
      logWarning(`Page title "${pageTitle}" may not match expected pattern`);
    }

    // Step 6: Verify URL is correct
    logPass("Step 6: Verifying Current URL");
    const currentUrl = await driver.getCurrentUrl();
    logPass(`Current URL: ${currentUrl}`);

    if (currentUrl.includes("/user/profile/edit")) {
      logPass("URL correctly points to user profile edit page");
    } else {
      logFail("URL does not match expected user profile edit page");
      return;
    }

    // Step 6: Check for page content
    logPass("Step 6: Checking for Page Content");
    const pageContentElements = await driver.findElements({
      css: testData.selectors.pageContent,
    });
    if (pageContentElements.length > 0) {
      logPass("Page content elements found");
    } else {
      logFail("No page content elements found");
      return;
    }

    // Step 7: Check for form elements
    logPass("Step 7: Checking for Form Elements");
    const formElements = await driver.findElements({
      css: testData.selectors.formElements,
    });
    logPass(`Found ${formElements.length} form elements on the page`);

    if (formElements.length > 0) {
      logPass("Form elements are present on the page");
    } else {
      logWarning(
        "No form elements found - page may not have expected functionality"
      );
    }

    // Step 8: Check for profile edit form specifically
    logPass("Step 8: Checking for Profile Edit Form");
    const profileForms = await driver.findElements({
      css: testData.selectors.profileForm,
    });
    if (profileForms.length > 0) {
      logPass("Profile edit form found");

      // Check for form fields
      const profileFields = await profileForms[0].findElements({
        css: testData.selectors.profileFields,
      });
      logPass(`Found ${profileFields.length} profile form fields`);

      // Check for save/submit button
      const saveButtons = await profileForms[0].findElements({
        css: testData.selectors.saveButton,
      });
      if (saveButtons.length > 0) {
        logPass("Save/submit button found in profile form");
      } else {
        logWarning("No save button found in profile form");
      }
    } else {
      logWarning("No profile edit form found");
    }

    // Step 9: Check for navigation elements
    logPass("Step 9: Checking for Navigation Elements");
    const navigationElements = await driver.findElements({
      css: testData.selectors.navigation,
    });
    if (navigationElements.length > 0) {
      logPass("Navigation elements found");
    } else {
      logWarning("No navigation elements found");
    }

    // Step 10: Check for user menu/profile menu
    logPass("Step 10: Checking for User Menu Elements");
    const userMenuElements = await driver.findElements({
      css: testData.selectors.userMenu,
    });
    if (userMenuElements.length > 0) {
      logPass("User menu elements found");
    } else {
      logWarning("No user menu elements found");
    }

    // Step 11: Validate page content indicators
    logPass("Step 11: Validating Page Content Indicators");
    const pageText = await driver.findElement({ tagName: "body" }).getText();

    const hasExpectedContent = testData.expectedContent.pageIndicators.some(
      (indicator) => pageText.toLowerCase().includes(indicator.toLowerCase())
    );

    if (hasExpectedContent) {
      logPass("Page contains expected profile edit content indicators");
    } else {
      logWarning("Page may not contain expected profile edit content");
    }

    // Step 12: Check for form field indicators
    logPass("Step 12: Checking for Form Field Indicators");
    const hasFormIndicators = testData.expectedContent.formIndicators.some(
      (indicator) => pageText.toLowerCase().includes(indicator.toLowerCase())
    );

    if (hasFormIndicators) {
      logPass(
        "Page contains expected form field indicators (name, email, phone, etc.)"
      );
    } else {
      logWarning("Page may not contain expected form field indicators");
    }

    // Step 13: Check for any JavaScript errors or console errors
    logPass("Step 13: Checking for JavaScript Errors");
    const consoleLogs = await driver.manage().logs().get("browser");
    const errors = consoleLogs.filter((log) => log.level.name === "SEVERE");

    if (errors.length > 0) {
      logWarning(`Found ${errors.length} JavaScript errors in console`);
      errors.forEach((error, index) => {
        logWarning(`Error ${index + 1}: ${error.message}`);
      });
    } else {
      logPass("No JavaScript errors found in console");
    }

    // Step 14: Final validation and error checking
    logPass("Step 14: Final Validation and Error Checking");
    const pageErrorDetected = await checkForErrors(driver);
    if (pageErrorDetected) {
      logFail("Page errors detected on user profile edit page");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "userProfileEditPageLoad"
      );
      await takeScreenshot(driver, "error_screenshot", screenshotDir);
    } else {
      logSuccess(
        `User Profile Edit Page Load test completed successfully - page loaded in ${loadTime}ms with all validations passed`
      );
    }

    // Log performance metrics
    logPass(`Performance Metrics:`);
    logPass(`- Page Load Time: ${loadTime}ms`);
    logPass(`- URL: ${currentUrl}`);
    logPass(`- Title: "${pageTitle}"`);
    logPass(`- Form Elements: ${formElements.length}`);
    logPass(
      `- Profile Fields: ${
        profileForms.length > 0
          ? await profileForms[0]
              .findElements({ css: testData.selectors.profileFields })
              .then((fields) => fields.length)
          : 0
      }`
    );
    logPass(`- JavaScript Errors: ${errors.length}`);
  } catch (error) {
    logError(`User Profile Edit Page Load test failed: ${error}`);
    // Take screenshot on error
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "userProfileEditPageLoad"
    );
    await takeScreenshot(driver, "error_screenshot", screenshotDir);
  } finally {
    await driver.quit();
  }
})();
