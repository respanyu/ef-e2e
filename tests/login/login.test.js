const fs = require("fs");
const path = require("path");
const { createDriver } = require("../../utils/driver");
const { sleep } = require("../../utils/wait");
const { loadTestData } = require("../../utils/testData");
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

(async function loginTest() {
  let driver = await createDriver();

  try {
    logStart("Starting Login Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    logPass("Test data loaded from JSON");

    const page = new LoginPage(driver);

    // 1️⃣ Open login page
    await page.open(testData.url);
    logPass("Login page opened and maximized");

    // 2️⃣ Fill Email
    await page.fillEmail(testData.email);
    logPass("Email filled");

    // 3️⃣ Fill Password
    await page.fillPassword(testData.password);
    logPass("Password filled");

    // 4️⃣ Submit Login
    const submitted = await page.submitLogin();
    if (submitted) {
      logPass("Login form submitted successfully");
    } else {
      logWarning("Submit button is disabled");
    }

    // 5️⃣ Wait for response
    await sleep(driver, 3000);
    logPass("Waited for response");

    // 6️⃣ Check for login errors
    const errorDetected = await checkForErrors(driver);

    // Take screenshot if error detected
    if (errorDetected) {
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "login"
      );
      await takeScreenshot(driver, "login_api_error_screenshot", screenshotDir);
    }

    if (errorDetected) {
      logFail("Login test completed with errors detected");
    } else {
      logSuccess("Login test completed successfully");
    }
  } catch (error) {
    logError(`Login test failed: ${error}`);
    // Take screenshot on error
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "login"
    );
    await takeScreenshot(driver, "login_error_screenshot", screenshotDir);
  } finally {
    await driver.quit();
  }
})();
