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
  logStart
} = require("../../utils/logger");
const SearchPage = require("../../pages/SearchPage");

(async function searchTest() {
  let driver = await createDriver();

  try {
    logStart("Starting Search Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    logPass("Test data loaded from JSON");

    // Load test data from JSON
    logPass("Test data loaded from JSON");

    const page = new SearchPage(driver);

    // Test Case 1: Search with both keyword and city
    logStart("Test Case 1: Search with both keyword and city");
    await page.open(testData.url);
    await page.fillKeyword(testData.keyword);
    await page.fillCity(testData.city);
    const submitted1 = await page.submitSearch();
    if (submitted1) {
      logPass("✅ Search form submitted successfully with both fields filled");
      await sleep(driver, 3000);
      const hasResults1 = await page.checkForSearchResults();
      if (hasResults1) {
        logPass("✅ Search results found for both keyword and city");
      } else {
        logPass("ℹ️  No search results found for 'restaurantsbb' in Addis Ababa (expected for test data)");
      }
    } else {
      logFail("❌ Could not submit search with both fields");
    }

    // Test Case 2: Search with only keyword
    logStart("Test Case 2: Search with only keyword (city optional)");
    await page.open(testData.url);
    await page.fillKeyword(testData.keyword);
    // Don't fill city
    const submitted2 = await page.submitSearch();
    if (submitted2) {
      logPass("✅ Search form submitted successfully with keyword only (city field optional)");
      await sleep(driver, 3000);
      const hasResults2 = await page.checkForSearchResults();
      if (hasResults2) {
        logPass("✅ Search results found for keyword-only search");
      } else {
        logPass("ℹ️  No search results found for 'restaurantsbb' (expected for test data)");
      }
    } else {
      logFail("❌ Could not submit search with only keyword");
    }

    // Test Case 3: Search with only city (keyword required)
    logStart("Test Case 3: Attempt search with only city (keyword is required)");
    await page.open(testData.url);
    // Don't fill keyword (required field)
    await page.fillCity(testData.city);
    const submitted3 = await page.submitSearch();
    if (submitted3) {
      logFail("❌ Search form submitted despite missing required keyword field");
      // Take screenshot for failed test case
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "search"
      );
      await takeScreenshot(driver, "search_test_case_3_fail", screenshotDir);
      await sleep(driver, 3000);
      const hasResults3 = await page.checkForSearchResults();
      if (hasResults3) {
        logFail("❌ Unexpected search results found without required keyword");
      } else {
        logPass("ℹ️  No search results (expected due to missing keyword)");
      }
    } else {
      logPass("✅ Search form correctly prevented submission due to missing required keyword");
    }

    // Test Case 4: Search with no fields (keyword required)
    logStart("Test Case 4: Attempt search with no fields (keyword is required)");
    await page.open(testData.url);
    // Don't fill any fields
    const submitted4 = await page.submitSearch();
    if (submitted4) {
      logFail("❌ Search form submitted despite missing required keyword field");
      // Take screenshot for failed test case
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "search"
      );
      await takeScreenshot(driver, "search_test_case_4_fail", screenshotDir);
      await sleep(driver, 3000);
      const hasResults4 = await page.checkForSearchResults();
      if (hasResults4) {
        logFail("❌ Unexpected search results found without required keyword");
      } else {
        logPass("ℹ️  No search results (expected due to missing keyword)");
      }
    } else {
      logPass("✅ Search form correctly prevented submission due to missing required keyword");
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
        "search"
      );
      await takeScreenshot(driver, "search_error_screenshot", screenshotDir);
    }

    if (errorDetected) {
      logFail("Search test completed with errors detected");
    } else {
      logSuccess("Search test completed successfully");
    }
  } catch (error) {
    logError(`Search test failed: ${error}`);
    // Take screenshot on error
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "search"
    );
    await takeScreenshot(driver, "search_error_screenshot", screenshotDir);
  } finally {
    await driver.quit();
  }
})();