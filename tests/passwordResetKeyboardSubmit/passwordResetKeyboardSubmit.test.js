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
  logWarning,
  logSuccess,
  logStart,
} = require("../../utils/logger");
const PasswordResetPage = require("../../pages/PasswordResetPage");

(async function passwordResetKeyboardSubmitTest() {
  let driver = await createDriver();

  try {
    logStart("Starting Password Reset Keyboard Submit Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    logPass("Test data loaded from JSON");

    const page = new PasswordResetPage(driver);

    // Open password reset page
    await page.open(testData.url);
    logPass("Password reset page opened and maximized");

    // Fill Email
    await page.fillEmail(testData.email);
    logPass("Email filled");

    // Submit Password Reset with Enter key
    const submitted = await page.submitPasswordResetWithEnter();
    if (submitted) {
      logPass("Password reset form submitted with Enter key");
    } else {
      logFail("Failed to submit password reset form with Enter key");
    }

    // Wait for response
    await sleep(driver, 3000);

    // Take screenshot
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "passwordResetKeyboardSubmit"
    );
    await takeScreenshot(
      driver,
      "password_reset_keyboard_submit",
      screenshotDir
    );

    // Check for errors or success
    const errorDetected = await checkForErrors(driver);
    const currentUrl = await driver.getCurrentUrl();

    if (errorDetected) {
      logFail(
        "Password reset failed with Enter key submission - errors detected"
      );
    } else if (
      currentUrl.includes("login") ||
      currentUrl.includes("success") ||
      currentUrl.includes("email")
    ) {
      logPass("Password reset succeeded with Enter key submission");
    } else {
      logWarning(
        "Password reset form submitted with Enter key but result unclear"
      );
    }

    logSuccess("Password Reset Keyboard Submit Test completed successfully");
  } catch (error) {
    logError(`Password Reset Keyboard Submit Test failed: ${error.message}`);
    // Take error screenshot
    try {
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "passwordResetKeyboardSubmit"
      );
      await takeScreenshot(
        driver,
        "password_reset_keyboard_submit_error",
        screenshotDir
      );
    } catch (screenshotError) {
      logError(`Failed to take error screenshot: ${screenshotError.message}`);
    }
  } finally {
    await driver.quit();
  }
})();
