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
const LoginPage = require("../../pages/LoginPage");

(async function loginKeyboardSubmitTest() {
  let driver = await createDriver();

  try {
    logStart("Starting Login Keyboard Submit Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    logPass("Test data loaded from JSON");

    const page = new LoginPage(driver);

    // Open login page
    await page.open(testData.url);
    logPass("Login page opened and maximized");

    // Fill Email
    await page.fillEmail(testData.email);
    logPass("Email filled");

    // Fill Password
    await page.fillPassword(testData.password);
    logPass("Password filled");

    // Submit Login with Enter key
    const submitted = await page.submitLoginWithEnter();
    if (submitted) {
      logPass("Login form submitted with Enter key");
    } else {
      logFail("Failed to submit login form with Enter key");
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
      "loginKeyboardSubmit"
    );
    await takeScreenshot(driver, "login_keyboard_submit", screenshotDir);

    // Check for errors or success
    const errorDetected = await checkForErrors(driver);
    const currentUrl = await driver.getCurrentUrl();

    if (errorDetected) {
      logFail("Login failed with Enter key submission - errors detected");
    } else if (
      currentUrl.includes("dashboard") ||
      currentUrl.includes("profile")
    ) {
      logPass("Login succeeded with Enter key submission");
    } else {
      logWarning("Login form submitted with Enter key but result unclear");
    }

    logSuccess("Login Keyboard Submit Test completed successfully");
  } catch (error) {
    logError(`Login Keyboard Submit Test failed: ${error.message}`);
    // Take error screenshot
    try {
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "loginKeyboardSubmit"
      );
      await takeScreenshot(
        driver,
        "login_keyboard_submit_error",
        screenshotDir
      );
    } catch (screenshotError) {
      logError(`Failed to take error screenshot: ${screenshotError.message}`);
    }
  } finally {
    await driver.quit();
  }
})();
