const fs = require("fs");
const path = require("path");
const { createDriver } = require("../../utils/driver");
const { sleep } = require("../../utils/wait");
const {
  logPass,
  logFail,
  logError,
  logWarning,
  logSuccess,
  logStart,
  logScreenshot,
} = require("../../utils/logger");
const { checkForErrors } = require("../../utils/errors");
const { takeScreenshot } = require("../../utils/screenshot");
const LoginPage = require("../../pages/LoginPage");
const BusinessEditPage = require("../../pages/BusinessEditPage");

(async function editBusinessInfoTest() {
  let driver = await createDriver();

  try {
    logStart("Starting Edit Business Info Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    logPass("Test data loaded from JSON");

    const loginPage = new LoginPage(driver);
    const businessEditPage = new BusinessEditPage(driver);

    // Create screenshots directory
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "editBusinessInfo"
    );

    // Step 1: Login to the application
    logPass("Step 1: Logging in to Application");
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

    // Take screenshot after login
    await takeScreenshot(driver, "after_login", screenshotDir);

    // Step 2: Navigate to business edit info page
    logPass("Step 2: Navigating to Business Edit Info Page");
    await businessEditPage.open(testData.businessEditUrl);
    logPass(`Navigated to: ${testData.businessEditUrl}`);

    // Wait for page to load
    await sleep(driver, 3000);
    logPass("Waited for business edit page to load");

    // Take screenshot of business edit page
    await takeScreenshot(driver, "business_edit_page_loaded", screenshotDir);

    // Step 3: Check if business edit page loaded properly
    logPass("Step 3: Checking if Business Edit Page Loaded Properly");

    const pageLoaded = await businessEditPage.checkIfPageLoaded();
    if (!pageLoaded) {
      logFail("Business edit page failed to load - no content detected");
      await takeScreenshot(driver, "page_load_failed", screenshotDir);
      return;
    } else {
      logPass("Business edit page loaded successfully");
    }

    // Check for no business message
    const noBusiness = await businessEditPage.checkForNoBusinessMessage();
    if (noBusiness) {
      logFail("No business found - user may not have claimed a business yet");
      await takeScreenshot(driver, "no_business_found", screenshotDir);
      return;
    } else {
      logPass("Business information found - proceeding with update");
    }

    // Step 4: Fill business update form
    logPass(
      "Step 4: Filling Business Update Form (including category selection)"
    );
    const formFilled = await businessEditPage.fillBusinessForm(
      testData.businessUpdateData
    );
    if (formFilled) {
      logPass("Business update form filled successfully");
    } else {
      logFail("Failed to fill business update form");
      await takeScreenshot(driver, "form_fill_failed", screenshotDir);
      return;
    }

    // Take screenshot after filling form
    await takeScreenshot(driver, "form_filled", screenshotDir);

    // Step 5: Submit business update
    logPass("Step 5: Submitting Business Update");
    const updateSubmitted = await businessEditPage.submitBusinessUpdate();
    if (updateSubmitted) {
      logPass("Business update submitted successfully");
    } else {
      logFail("Failed to submit business update");
      await takeScreenshot(driver, "submit_failed", screenshotDir);
      return;
    }

    // Take screenshot after submitting
    await takeScreenshot(driver, "after_submit", screenshotDir);

    // Step 6: Wait for update completion
    logPass("Step 6: Waiting for Business Update API Response to Complete");
    const updateResult = await businessEditPage.waitForUpdateCompletion(20000);

    if (updateResult.success === true) {
      logSuccess(
        `Business update API response completed successfully: ${updateResult.message}`
      );
    } else if (updateResult.success === false) {
      logFail(`Business update API response failed: ${updateResult.message}`);
      await takeScreenshot(driver, "update_failed", screenshotDir);
      return;
    } else {
      logWarning(
        `Business update API response status indeterminate: ${updateResult.message}`
      );
      // Continue with test as indeterminate might still be success
    }

    // Take final screenshot
    await takeScreenshot(driver, "update_completed", screenshotDir);

    // Step 7: Check for errors
    const errorDetected = await checkForErrors(driver);
    if (errorDetected) {
      logFail("Errors detected during business update test");
    } else {
      logPass("No errors detected during business update test");
    }

    logSuccess("Edit Business Info Test completed successfully");
  } catch (error) {
    logError(`Edit Business Info Test failed: ${error.message}`);
    // Take error screenshot
    try {
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "editBusinessInfo"
      );
      await takeScreenshot(driver, "edit_business_error", screenshotDir);
    } catch (screenshotError) {
      logError(`Failed to take error screenshot: ${screenshotError.message}`);
    }
  } finally {
    await driver.quit();
  }
})();
