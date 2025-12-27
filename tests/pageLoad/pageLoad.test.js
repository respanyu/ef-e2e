const { createDriver } = require("../../utils/driver");
const { loadTestData } = require("../../utils/testData");
const {
  logPass,
  logError,
  logStart,
  logSuccess,
} = require("../../utils/logger");
const { takeScreenshot } = require("../../utils/screenshot");
const path = require("path");
const PageLoadPage = require("../../pages/PageLoadPage");

(async function pageLoadTest() {
  let driver = await createDriver();

  try {
    logStart("Starting Page Load Test...");

    // Load test data from JSON
    const testData = loadTestData();
    logPass("Test data loaded from JSON");

    const page = new PageLoadPage(driver);

    // Open website and measure load time
    const loadTime = await page.open(testData.url);
    console.log(`⏱️  Page load time: ${loadTime} ms`);
    logPass(`Website opened and maximized in ${loadTime} ms`);

    // Get and log page title
    const title = await page.getPageTitle();
    console.log(`📄 Page Title: ${title}`);
    logPass(`Page title retrieved: ${title}`);

    // Get load metrics
    const metrics = await page.getPageLoadMetrics();
    console.log(`📊 Load Metrics:`);
    console.log(`   - Total Load Time: ${metrics.totalLoadTime} ms`);
    console.log(`   - DOM Ready Time: ${metrics.domReadyTime} ms`);
    console.log(`   - Response Time: ${metrics.responseTime} ms`);
    logPass(`Load metrics retrieved`);

    // Get page size
    const pageSize = await page.getPageSize();
    console.log(`📏 Page Size: ${pageSize} bytes`);
    logPass(`Page size: ${pageSize} bytes`);

    // Get current URL
    const currentUrl = await page.getCurrentUrl();
    console.log(`🔗 Current URL: ${currentUrl}`);
    logPass(`Current URL: ${currentUrl}`);

    logSuccess("Page load test completed successfully");
  } catch (error) {
    logError(`Page load test failed: ${error}`);
    // Take screenshot on error
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "pageload"
    );
    await takeScreenshot(driver, "page_load_error_screenshot", screenshotDir);
  } finally {
    await driver.quit();
  }
})();
