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
const RegisterPage = require("../../pages/RegisterPage");

(async function registerTest() {
  let driver = await createDriver();

  try {
    logStart("Starting Register Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    logPass("Test data loaded from JSON");

    const page = new RegisterPage(driver);

    // 1️⃣ Open register page
    await page.open(testData.url);
    logPass("Register page opened and maximized");

    // 2️⃣ Fill Username
    await page.fillUsername(testData.username);
    logPass("Username filled");

    // 3️⃣ Fill Email
    await page.fillEmail(testData.email);
    logPass("Email filled");

    // 4️⃣ Fill Password
    await page.fillPassword(testData.password);
    logPass("Password filled");

    // 5️⃣ Fill Password Repeat
    await page.fillPasswordRepeat(testData.passwordRepeat);
    logPass("Password repeat filled");

    // 6️⃣ Submit Register
    const submitted = await page.submitRegister();
    if (submitted) {
      logPass("Register form submitted successfully");
    } else {
      logWarning("Submit button is disabled");
    }

    // 7️⃣ Wait for response
    await sleep(driver, 3000);
    logPass("Waited for response");

    // 8️⃣ Check for register errors
    const errorDetected = await checkForErrors(driver);

    // Take screenshot if error detected
    if (errorDetected) {
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "register"
      );
      await takeScreenshot(
        driver,
        "register_api_error_screenshot",
        screenshotDir
      );
    }

    if (errorDetected) {
      logFail("Register test completed with errors detected");
    } else {
      logSuccess("Register test completed successfully");
    }
  } catch (error) {
    logError(`Register test failed: ${error}`);
    // Take screenshot on error
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "register"
    );
    await takeScreenshot(driver, "register_error_screenshot", screenshotDir);
  } finally {
    await driver.quit();
  }
})();
