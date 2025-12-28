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

(async function sqlInjectionPasswordResetTest() {
  let driver = await createDriver();

  try {
    logStart("Starting SQL Injection Password Reset Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    logPass("Test data loaded from JSON");

    const page = new PasswordResetPage(driver);

    // Test SQL injection in email field
    logStart("Testing SQL injection in password reset email field...");
    for (let i = 0; i < testData.sqlPayloads.length; i++) {
      const payload = testData.sqlPayloads[i];
      logStart(`Attempt ${i + 1}: Testing payload "${payload}" in email field`);

      // Open password reset page
      await page.open(testData.url);
      logPass("Password reset page opened");

      // Fill email with payload
      await page.fillEmail(payload);
      logPass("Email filled with SQL payload");

      // Submit form
      const submitted = await page.submitPasswordReset();
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
        "sqlInjectionPasswordReset"
      );
      await takeScreenshot(
        driver,
        `sql_injection_password_reset_attempt_${i + 1}`,
        screenshotDir
      );

      // If form was submitted (which it shouldn't be), check if it actually processed
      if (submitted) {
        // Wait for response
        await sleep(driver, 3000);

        // Check for errors or success
        const errorDetected = await checkForErrors(driver);
        const currentUrl = await driver.getCurrentUrl();

        if (
          (!errorDetected && currentUrl.includes("success")) ||
          currentUrl.includes("email") ||
          currentUrl.includes("sent")
        ) {
          logFail(
            `SQL Injection password reset succeeded with payload "${payload}" - CRITICAL SECURITY VULNERABILITY`
          );
        } else {
          logWarning(
            `Form submitted but password reset failed with payload "${payload}" - Still a security issue`
          );
        }
      }
    }

    logSuccess("SQL Injection Password Reset Test completed successfully");
  } catch (error) {
    logError(`SQL Injection Password Reset Test failed: ${error.message}`);
    // Take error screenshot
    try {
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "sqlInjectionPasswordReset"
      );
      await takeScreenshot(
        driver,
        "sql_injection_password_reset_error",
        screenshotDir
      );
    } catch (screenshotError) {
      logError(`Failed to take error screenshot: ${screenshotError.message}`);
    }
  } finally {
    await driver.quit();
  }
})();
