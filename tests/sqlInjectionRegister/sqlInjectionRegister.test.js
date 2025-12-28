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

(async function sqlInjectionRegisterTest() {
  let driver = await createDriver();

  try {
    logStart("Starting SQL Injection Register Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    logPass("Test data loaded from JSON");

    const page = new RegisterPage(driver);

    // Test SQL injection in username field
    logStart("Testing SQL injection in username field...");
    for (let i = 0; i < testData.sqlPayloads.length; i++) {
      const payload = testData.sqlPayloads[i];
      logStart(`Attempt ${i + 1}: Testing payload "${payload}" in username`);

      // Open register page
      await page.open(testData.url);

      // Fill Username with payload
      await page.fillUsername(payload);
      logPass("Username filled with SQL payload");

      // Fill other fields with normal
      await page.fillEmail(testData.normalEmail);
      await page.fillPassword(testData.normalPassword);
      await page.fillPasswordRepeat(testData.normalPassword);
      logPass("Other fields filled with normal values");

      // Submit Register
      const submitted = await page.submitRegister();
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
        "sqlInjectionRegister"
      );
      await takeScreenshot(
        driver,
        `sql_injection_username_attempt_${i + 1}`,
        screenshotDir
      );

      // If form was submitted (which it shouldn't be), check if registration actually succeeded
      if (submitted) {
        // Wait for response
        await sleep(driver, 3000);

        // Check for register errors or success
        const errorDetected = await checkForErrors(driver);
        const currentUrl = await driver.getCurrentUrl();

        if (!errorDetected && !currentUrl.includes("/user/register")) {
          logFail(
            `SQL Injection registration succeeded with payload "${payload}" - CRITICAL SECURITY VULNERABILITY`
          );
        } else {
          logWarning(
            `Form submitted but registration failed with payload "${payload}" - Still a security issue`
          );
        }
      }
    }

    // Test SQL injection in email field
    logStart("Testing SQL injection in email field...");
    for (let i = 0; i < testData.sqlPayloads.length; i++) {
      const payload = testData.sqlPayloads[i];
      logStart(`Attempt ${i + 1}: Testing payload "${payload}" in email`);

      // Open register page
      await page.open(testData.url);

      // Fill Username with normal
      await page.fillUsername(testData.normalUsername);
      logPass("Username filled with normal value");

      // Fill Email with payload
      await page.fillEmail(payload);
      logPass("Email filled with SQL payload");

      // Fill other fields
      await page.fillPassword(testData.normalPassword);
      await page.fillPasswordRepeat(testData.normalPassword);
      logPass("Other fields filled with normal values");

      // Submit Register
      const submitted = await page.submitRegister();
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
        "sqlInjectionRegister"
      );
      await takeScreenshot(
        driver,
        `sql_injection_email_attempt_${i + 1}`,
        screenshotDir
      );

      // If form was submitted (which it shouldn't be), check if registration actually succeeded
      if (submitted) {
        // Wait for response
        await sleep(driver, 3000);

        // Check for register errors or success
        const errorDetected = await checkForErrors(driver);
        const currentUrl = await driver.getCurrentUrl();

        if (!errorDetected && !currentUrl.includes("/user/register")) {
          logFail(
            `SQL Injection registration succeeded with payload "${payload}" - CRITICAL SECURITY VULNERABILITY`
          );
        } else {
          logWarning(
            `Form submitted but registration failed with payload "${payload}" - Still a security issue`
          );
        }
      }
    }

    // Test SQL injection in password field
    logStart("Testing SQL injection in password field...");
    for (let i = 0; i < testData.sqlPayloads.length; i++) {
      const payload = testData.sqlPayloads[i];
      logStart(`Attempt ${i + 1}: Testing payload "${payload}" in password`);

      // Open register page
      await page.open(testData.url);

      // Fill Username and Email with normal
      await page.fillUsername(testData.normalUsername);
      await page.fillEmail(testData.normalEmail);
      logPass("Username and Email filled with normal values");

      // Fill Password with payload
      await page.fillPassword(payload);
      await page.fillPasswordRepeat(payload);
      logPass("Password fields filled with SQL payload");

      // Submit Register
      const submitted = await page.submitRegister();
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
        "sqlInjectionRegister"
      );
      await takeScreenshot(
        driver,
        `sql_injection_password_attempt_${i + 1}`,
        screenshotDir
      );

      // If form was submitted (which it shouldn't be), check if registration actually succeeded
      if (submitted) {
        // Wait for response
        await sleep(driver, 3000);

        // Check for register errors or success
        const errorDetected = await checkForErrors(driver);
        const currentUrl = await driver.getCurrentUrl();

        if (!errorDetected && !currentUrl.includes("/user/register")) {
          logFail(
            `SQL Injection registration succeeded with payload "${payload}" - CRITICAL SECURITY VULNERABILITY`
          );
        } else {
          logWarning(
            `Form submitted but registration failed with payload "${payload}" - Still a security issue`
          );
        }
      }
    }

    logSuccess("SQL Injection Register Test completed");
  } catch (error) {
    logError(`SQL Injection Register Test failed: ${error}`);
    // Take screenshot on error
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "sqlInjectionRegister"
    );
    await takeScreenshot(
      driver,
      "sql_injection_register_error_screenshot",
      screenshotDir
    );
  } finally {
    await driver.quit();
  }
})();
