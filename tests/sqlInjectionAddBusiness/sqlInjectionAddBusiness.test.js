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
const AddBusinessPage = require("../../pages/AddBusinessPage");

(async function sqlInjectionAddBusinessTest() {
  let driver = await createDriver();

  try {
    logStart("Starting SQL Injection Add Business Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    logPass("Test data loaded from JSON");

    const page = new AddBusinessPage(driver);

    // Test SQL injection in business name field
    logStart("Testing SQL injection in business name field...");
    for (let i = 0; i < testData.sqlPayloads.length; i++) {
      const payload = testData.sqlPayloads[i];
      logStart(
        `Attempt ${i + 1}: Testing payload "${payload}" in business name`
      );

      // Open website
      await page.open(testData.url);

      // Scroll to Add Business section
      await page.scrollToAddBusinessSection();
      logPass("Scrolled to Add Business section");

      // Fill Business Name with payload
      await page.fillBusinessName(payload);
      logPass("Business name filled with SQL payload");

      // Fill other fields with normal values
      await page.fillTelephone(testData.normalPhone);
      await page.selectCity(testData.normalCity);
      await page.fillEmail(testData.normalEmail);
      await page.selectBusinessCategory(testData.normalCategory);
      logPass("Other fields filled with normal values");

      // Submit form
      const submitted = await page.submitForm();
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
        "sqlInjectionAddBusiness"
      );
      await takeScreenshot(
        driver,
        `sql_injection_business_name_attempt_${i + 1}`,
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
          currentUrl.includes("thank")
        ) {
          logFail(
            `SQL Injection add business succeeded with payload "${payload}" - CRITICAL SECURITY VULNERABILITY`
          );
        } else {
          logWarning(
            `Form submitted but add business failed with payload "${payload}" - Still a security issue`
          );
        }
      }
    }

    // Test SQL injection in phone field
    logStart("Testing SQL injection in phone field...");
    for (let i = 0; i < testData.sqlPayloads.length; i++) {
      const payload = testData.sqlPayloads[i];
      logStart(`Attempt ${i + 1}: Testing payload "${payload}" in phone`);

      // Open website
      await page.open(testData.url);

      // Scroll to Add Business section
      await page.scrollToAddBusinessSection();
      logPass("Scrolled to Add Business section");

      // Fill Business Name with normal
      await page.fillBusinessName(testData.normalBusiness);
      logPass("Business name filled with normal value");

      // Fill Phone with payload
      await page.fillTelephone(payload);
      logPass("Phone filled with SQL payload");

      // Fill other fields
      await page.selectCity(testData.normalCity);
      await page.fillEmail(testData.normalEmail);
      await page.selectBusinessCategory(testData.normalCategory);
      logPass("Other fields filled with normal values");

      // Submit form
      const submitted = await page.submitForm();
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
        "sqlInjectionAddBusiness"
      );
      await takeScreenshot(
        driver,
        `sql_injection_phone_attempt_${i + 1}`,
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
          currentUrl.includes("thank")
        ) {
          logFail(
            `SQL Injection add business succeeded with payload "${payload}" - CRITICAL SECURITY VULNERABILITY`
          );
        } else {
          logWarning(
            `Form submitted but add business failed with payload "${payload}" - Still a security issue`
          );
        }
      }
    }

    // Test SQL injection in email field
    logStart("Testing SQL injection in email field...");
    for (let i = 0; i < testData.sqlPayloads.length; i++) {
      const payload = testData.sqlPayloads[i];
      logStart(`Attempt ${i + 1}: Testing payload "${payload}" in email`);

      // Open website
      await page.open(testData.url);

      // Scroll to Add Business section
      await page.scrollToAddBusinessSection();
      logPass("Scrolled to Add Business section");

      // Fill Business Name and Phone with normal
      await page.fillBusinessName(testData.normalBusiness);
      await page.fillTelephone(testData.normalPhone);
      await page.selectCity(testData.normalCity);
      logPass("Business name, phone, and city filled with normal values");

      // Fill Email with payload
      await page.fillEmail(payload);
      logPass("Email filled with SQL payload");

      // Fill category
      await page.selectBusinessCategory(testData.normalCategory);
      logPass("Category filled with normal value");

      // Submit form
      const submitted = await page.submitForm();
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
        "sqlInjectionAddBusiness"
      );
      await takeScreenshot(
        driver,
        `sql_injection_email_attempt_${i + 1}`,
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
          currentUrl.includes("thank")
        ) {
          logFail(
            `SQL Injection add business succeeded with payload "${payload}" - CRITICAL SECURITY VULNERABILITY`
          );
        } else {
          logWarning(
            `Form submitted but add business failed with payload "${payload}" - Still a security issue`
          );
        }
      }
    }

    logSuccess("SQL Injection Add Business Test completed");
  } catch (error) {
    logError(`SQL Injection Add Business Test failed: ${error}`);
    // Take screenshot on error
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "sqlInjectionAddBusiness"
    );
    await takeScreenshot(
      driver,
      "sql_injection_add_business_error_screenshot",
      screenshotDir
    );
  } finally {
    await driver.quit();
  }
})();
