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

(async function categoriesPageLoadTest() {
  let driver = await createDriver();

  try {
    logStart("Starting Categories Page Load Test...");

    // Load test data from JSON
    const testData = loadTestData();
    // Override URL for categories page
    testData.url = "https://ethiofind.com/categories";
    logPass("Test data loaded from JSON");

    const page = new PageLoadPage(driver);

    // Open categories page and measure load time
    const loadTime = await page.open(testData.url);
    console.log(`⏱️  Categories page load time: ${loadTime} ms`);
    logPass(`Categories page opened and maximized in ${loadTime} ms`);

    // Check load time
    if (loadTime > 10000) {
      logFail(
        `❌ Categories page load time (${loadTime}ms) exceeds 10 seconds`
      );
    } else {
      logPass(`✅ Categories page load time (${loadTime}ms) is acceptable`);
    }

    // Get and log page title
    const title = await page.getPageTitle();
    console.log(`📄 Categories Page Title: ${title}`);
    logPass(`Page title retrieved: ${title}`);

    // Get load metrics
    const metrics = await page.getPageLoadMetrics();
    console.log(`📊 Categories Page Load Metrics:`);
    console.log(`   - Total Load Time: ${metrics.totalLoadTime} ms`);
    console.log(`   - DOM Ready Time: ${metrics.domReadyTime} ms`);
    console.log(`   - Response Time: ${metrics.responseTime} ms`);
    logPass(`Load metrics retrieved`);

    // Check response time
    if (metrics.responseTime > 2000) {
      logFail(`❌ Response time (${metrics.responseTime}ms) is too slow`);
    } else {
      logPass(`✅ Response time (${metrics.responseTime}ms) is acceptable`);
    }

    // Get page size
    const pageSize = await page.getPageSize();
    console.log(`📏 Categories Page Size: ${pageSize} bytes`);
    logPass(`Page size: ${pageSize} bytes`);

    // Get current URL
    const currentUrl = await page.getCurrentUrl();
    console.log(`🔗 Current URL: ${currentUrl}`);
    logPass(`Current URL: ${currentUrl}`);

    // Check URL
    if (currentUrl.includes("/categories")) {
      logPass(`✅ URL contains categories path`);
    } else {
      logFail(`❌ URL does not contain categories path`);
    }

    logSuccess("Categories page load test completed successfully");
  } catch (error) {
    logError(`Categories page load test failed: ${error}`);
    // Take screenshot on error
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "categoriesPageLoad"
    );
    await takeScreenshot(
      driver,
      "categories_page_load_error_screenshot",
      screenshotDir
    );
  } finally {
    await driver.quit();
  }
})();
