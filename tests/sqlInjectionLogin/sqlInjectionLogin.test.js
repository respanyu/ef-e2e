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

(async function sqlInjectionLoginTest() {
  let driver = await createDriver();

  try {
    logStart("Starting SQL Injection Login Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    logPass("Test data loaded from JSON");

    const page = new LoginPage(driver);

    // Test SQL injection in email field
    logStart("Testing SQL injection in email field...");
    for (let i = 0; i < testData.sqlPayloads.length; i++) {
      const payload = testData.sqlPayloads[i];
      logStart(`Attempt ${i + 1}: Testing payload "${payload}" in email`);

      // Open login page
      await page.open(testData.url);

      // Fill Email with payload
      await page.fillEmail(payload);
      logPass("Email filled with SQL payload");

      // Fill Password with normal
      await page.fillPassword(testData.normalPassword);
      logPass("Password filled with normal value");

      // Submit Login
      const submitted = await page.submitLogin();
      if (submitted) {
        logFail(
          `Form submitted with SQL injection payload "${payload}" - SECURITY VULNERABILITY: Form should prevent submission`
        );
      } else {
        logPass(
          `Form correctly prevented submission with SQL injection payload "${payload}"`
        );
      }

      // Take screenshot
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "sqlInjectionLogin"
      );
      await takeScreenshot(
        driver,
        `sql_injection_email_attempt_${i + 1}`,
        screenshotDir
      );

      // If form was submitted (which it shouldn't be), check if login actually succeeded
      if (submitted) {
        // Wait for response
        await sleep(driver, 3000);

        // Check for login errors or success
        const errorDetected = await checkForErrors(driver);
        const currentUrl = await driver.getCurrentUrl();

        if (!errorDetected && !currentUrl.includes("/user/login")) {
          logFail(
            `SQL Injection login succeeded with payload "${payload}" - CRITICAL SECURITY VULNERABILITY`
          );
        } else {
          logWarning(
            `Form submitted but login failed with payload "${payload}" - Still a security issue`
          );
        }
      }
    }

    // Test SQL injection in password field
    logStart("Testing SQL injection in password field...");
    for (let i = 0; i < testData.sqlPayloads.length; i++) {
      const payload = testData.sqlPayloads[i];
      logStart(`Attempt ${i + 1}: Testing payload "${payload}" in password`);

      // Open login page
      await page.open(testData.url);

      // Fill Email with normal
      await page.fillEmail(testData.normalEmail);
      logPass("Email filled with normal value");

      // Fill Password with payload
      await page.fillPassword(payload);
      logPass("Password filled with SQL payload");

      // Submit Login
      const submitted = await page.submitLogin();
      if (submitted) {
        logFail(
          `Form submitted with SQL injection payload "${payload}" - SECURITY VULNERABILITY: Form should prevent submission`
        );
      } else {
        logPass(
          `Form correctly prevented submission with SQL injection payload "${payload}"`
        );
      }

      // Take screenshot
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "sqlInjectionLogin"
      );
      await takeScreenshot(
        driver,
        `sql_injection_password_attempt_${i + 1}`,
        screenshotDir
      );

      // If form was submitted (which it shouldn't be), check if login actually succeeded
      if (submitted) {
        // Wait for response
        await sleep(driver, 3000);

        // Check for login errors or success
        const errorDetected = await checkForErrors(driver);
        const currentUrl = await driver.getCurrentUrl();

        if (!errorDetected && !currentUrl.includes("/user/login")) {
          logFail(
            `SQL Injection login succeeded with payload "${payload}" - CRITICAL SECURITY VULNERABILITY`
          );
        } else {
          logWarning(
            `Form submitted but login failed with payload "${payload}" - Still a security issue`
          );
        }
      }
    }

    logSuccess("SQL Injection Login Test completed");
  } catch (error) {
    logError(`SQL Injection Login Test failed: ${error}`);
    // Take screenshot on error
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "sqlInjectionLogin"
    );
    await takeScreenshot(
      driver,
      "sql_injection_error_screenshot",
      screenshotDir
    );
  } finally {
    await driver.quit();
  }
})();
