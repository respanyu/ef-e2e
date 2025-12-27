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
  logSuccess,
  logStart,
} = require("../../utils/logger");
const PageLoadPage = require("../../pages/PageLoadPage");
const { By } = require("selenium-webdriver");

(async function aboutTest() {
  let driver = await createDriver();

  try {
    logStart("Starting About Page Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    logPass("Test data loaded from JSON");

    const page = new PageLoadPage(driver);

    // Test Case: About page loads properly with performance metrics
    logStart(
      "Test Case: Verify about page loads with response time and content validation"
    );

    // Open about page and measure load time
    const loadTime = await page.open(testData.url);
    console.log(`⏱️  About page load time: ${loadTime} ms`);
    logPass(`About page opened and maximized in ${loadTime} ms`);

    // Check load time against maximum allowed
    if (loadTime > testData.maxLoadTime) {
      logFail(
        `❌ About page load time (${loadTime}ms) exceeds maximum allowed (${testData.maxLoadTime}ms)`
      );
    } else {
      logPass(
        `✅ About page load time (${loadTime}ms) is within acceptable range (< ${testData.maxLoadTime}ms)`
      );
    }

    // Get and log page title
    const title = await page.getPageTitle();
    console.log(`📄 About Page Title: ${title}`);
    logPass(`Page title retrieved: ${title}`);

    // Check if page loaded (basic validation)
    if (title && title.length > 0) {
      logPass(`✅ Page loaded successfully with title: "${title}"`);
    } else {
      logFail(`❌ Page title is empty or page failed to load`);
    }

    // Get load metrics
    const metrics = await page.getPageLoadMetrics();
    console.log(`📊 About Page Load Metrics:`);
    console.log(`   - Total Load Time: ${metrics.totalLoadTime} ms`);
    console.log(`   - DOM Ready Time: ${metrics.domReadyTime} ms`);
    console.log(`   - Response Time: ${metrics.responseTime} ms`);
    logPass(`Load metrics retrieved`);

    // Check response time
    if (metrics.responseTime > 1000) {
      logFail(
        `❌ Response time (${metrics.responseTime}ms) is too slow (> 1000ms)`
      );
    } else {
      logPass(`✅ Response time (${metrics.responseTime}ms) is acceptable`);
    }

    // Get page size
    const pageSize = await page.getPageSize();
    console.log(`📏 About Page Size: ${pageSize} bytes`);
    logPass(`Page size: ${pageSize} bytes`);

    // Get current URL
    const currentUrl = await page.getCurrentUrl();
    console.log(`🔗 Current URL: ${currentUrl}`);
    logPass(`Current URL: ${currentUrl}`);

    // Check if URL is correct
    if (currentUrl === testData.url) {
      logPass(`✅ URL is correct: ${currentUrl}`);
    } else {
      logFail(`❌ URL mismatch. Expected: ${testData.url}, Got: ${currentUrl}`);
    }

    // Check for about page specific content
    try {
      // Look for any meaningful content on the page
      const contentSelectors = [
        ".about-content",
        ".about-section",
        "[class*='about']",
        "h1",
        "h2",
        ".content",
        "main",
        "article",
        "p",
        "body",
      ];

      let contentFound = false;
      let contentLength = 0;

      for (let selector of contentSelectors) {
        try {
          const elements = await driver.findElements(By.css(selector));
          if (elements.length > 0) {
            for (let element of elements.slice(0, 3)) {
              const text = await element.getText();
              if (text && text.length > testData.minContentLength) {
                contentFound = true;
                contentLength = Math.max(contentLength, text.length);
                console.log(
                  `📝 Found content using selector: ${selector} (${text.length} chars)`
                );
                break;
              }
            }
            if (contentFound) break;
          }
        } catch (error) {
          continue;
        }
      }

      if (contentFound) {
        logPass(`✅ Page content found (${contentLength} characters)`);
      } else {
        logFail(
          `❌ Page content not found or too short (< ${testData.minContentLength} characters)`
        );
      }
    } catch (error) {
      logFail(`❌ Error checking page content: ${error.message}`);
    }

    // Check for any errors after all test cases
    const errorDetected = await checkForErrors(driver);

    // Take screenshot if error detected
    if (errorDetected) {
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "about"
      );
      await takeScreenshot(
        driver,
        "about_page_error_screenshot",
        screenshotDir
      );
    }

    if (errorDetected) {
      logFail("About page test completed with errors detected");
    } else {
      logSuccess("About page test completed successfully");
    }
  } catch (error) {
    logError(`About page test failed: ${error}`);
    // Take screenshot on error
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "about"
    );
    await takeScreenshot(driver, "about_page_error_screenshot", screenshotDir);
  } finally {
    await driver.quit();
  }
})();
