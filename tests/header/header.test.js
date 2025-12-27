const fs = require("fs");
const path = require("path");
const { createDriver } = require("../../utils/driver");
const { sleep } = require("../../utils/wait");
const {
  logPass,
  logFail,
  logError,
  logSuccess,
  logStart,
} = require("../../utils/logger");
const { takeScreenshot } = require("../../utils/screenshot");
const HeaderPage = require("../../pages/HeaderPage");

(async function headerTest() {
  let driver = await createDriver();

  try {
    logStart("Starting Header Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    logPass("Test data loaded from JSON");

    const page = new HeaderPage(driver);

    // Open main page
    await page.open(testData.url);
    logPass("Main page opened and maximized");

    // Wait for page to load
    await sleep(driver, 2000);
    logPass("Waited for page load");

    // Check if header is loaded
    const headerLoaded = await page.isHeaderLoaded();
    if (headerLoaded) {
      logPass("Header elements loaded successfully");

      // Get header text
      const headerText = await page.getHeaderText();
      console.log(`📄 Header Content: ${headerText.substring(0, 100)}...`);
      logPass("Header content retrieved");
    } else {
      logFail("Header elements not found");
      throw new Error("Header not loaded");
    }

    logSuccess("Header test completed successfully");
  } catch (error) {
    logError(`Header test failed: ${error}`);
    // Take screenshot on error
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "header"
    );
    await takeScreenshot(driver, "header_error_screenshot", screenshotDir);
  } finally {
    await driver.quit();
  }
})();
