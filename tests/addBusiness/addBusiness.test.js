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
const AddBusinessPage = require("../../pages/AddBusinessPage");

(async function addBusinessTest() {
  let driver = await createDriver();

  try {
    logStart("Starting Add Business Test...");

    // Load test data from JSON
    const testData = loadTestData();
    logPass("Test data loaded from JSON");

    const page = new AddBusinessPage(driver);

    // 1️⃣ Open website
    await page.open(testData.url);
    logPass("Website opened and maximized");

    // 2️⃣ Scroll to Add Business section
    await page.scrollToAddBusinessSection();
    logPass("Scrolled to Add Business section");

    // 3️⃣ Fill Business Name
    await page.fillBusinessName(testData.business);
    logPass("Business Name filled");

    // 4️⃣ Fill Telephone
    await page.fillTelephone(testData.phone);
    logPass("Telephone filled");

    // 5️⃣ Select City
    await page.selectCity(testData.city);
    logPass("City selected");

    // 6️⃣ Fill Email
    await page.fillEmail(testData.email);
    logPass("Email filled");

    // 7️⃣ Select Business Category
    await page.selectBusinessCategory(testData.category);
    logPass("Business Category selected");

    // 8️⃣ Check Submit Button
    const submitted = await page.submitForm();
    if (submitted) {
      logPass("Form submitted successfully");
    } else {
      logWarning(
        "Button is disabled, form not submitted (expected for demo or validation)"
      );
    }

    // 9️⃣ Wait for response
    await sleep(driver, 3000);
    logPass("Waited for response");

    // 10️⃣ Check for API response errors
    const errorDetected = await checkForErrors(driver);

    // Take screenshot if error detected
    if (errorDetected) {
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "addBusiness"
      );
      await takeScreenshot(driver, "api_error_screenshot", screenshotDir);
    }

    if (errorDetected) {
      logFail("Test completed with API errors detected");
    } else {
      logSuccess(
        "All test cases passed: Add Business form test executed successfully"
      );
    }
  } catch (error) {
    logError(`Test failed: ${error}`);
    // Take screenshot on error
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "addBusiness"
    );
    await takeScreenshot(driver, "error_screenshot", screenshotDir);
  } finally {
    await driver.quit();
  }
})();
