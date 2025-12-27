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
const FooterPage = require("../../pages/FooterPage");

(async function footerTest() {
  let driver = await createDriver();

  try {
    logStart("Starting Footer Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    logPass("Test data loaded from JSON");

    const page = new FooterPage(driver);

    // Open main page
    await page.open(testData.url);
    logPass("Main page opened and maximized");

    // Wait for page to load
    await sleep(driver, 2000);
    logPass("Waited for page load");

    // Check if footer is loaded
    const footerLoaded = await page.isFooterLoaded();
    if (footerLoaded) {
      logPass("Footer elements loaded successfully");

      // Get footer text
      const footerText = await page.getFooterText();
      console.log(`📄 Footer Content: ${footerText.substring(0, 100)}...`);
      logPass("Footer content retrieved");
    } else {
      logFail("Footer elements not found");
      throw new Error("Footer not loaded");
    }

    logSuccess("Footer test completed successfully");
  } catch (error) {
    logError(`Footer test failed: ${error}`);
    // Take screenshot on error
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "footer"
    );
    await takeScreenshot(driver, "footer_error_screenshot", screenshotDir);
  } finally {
    await driver.quit();
  }
})();
