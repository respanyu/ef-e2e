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
const BusinessListingPage = require("../../pages/BusinessListingPage");

(async function businessListingTest() {
  let driver = await createDriver();

  try {
    logStart("Starting Business Listing Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    logPass("Test data loaded from JSON");

    const page = new BusinessListingPage(driver);

    // Test Case: Business listing loads properly from API
    logStart("Test Case: Verify businesses load from API on page load");
    await page.open(testData.url);
    logPass("✅ Page opened successfully");

    // Wait for businesses to load from API
    const businessesLoaded = await page.waitForBusinessesToLoad(
      testData.timeout
    );
    if (businessesLoaded) {
      logPass("✅ Business listings loaded from API");
    } else {
      logFail("❌ Business listings failed to load from API within timeout");
      // Take screenshot for failed loading
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "businessListing"
      );
      await takeScreenshot(driver, "business_listing_load_fail", screenshotDir);
    }

    // Check business display
    const displayResult = await page.checkBusinessDisplay();
    console.log(`📊 Business Display Check: ${displayResult.message}`);
    console.log(`   - Total businesses found: ${displayResult.count}`);
    console.log(`   - Valid businesses: ${displayResult.validCount || 0}`);

    if (displayResult.displayed) {
      logPass("✅ Businesses are displayed properly on the page");

      // Check minimum expected businesses
      if (displayResult.count >= testData.expectedMinBusinesses) {
        logPass(
          `✅ At least ${testData.expectedMinBusinesses} businesses displayed (expected minimum)`
        );
      } else {
        logFail(
          `❌ Only ${displayResult.count} businesses displayed, expected at least ${testData.expectedMinBusinesses}`
        );
        // Take screenshot for insufficient businesses
        const screenshotDir = path.join(
          __dirname,
          "..",
          "..",
          "reports",
          "screenshots",
          "businessListing"
        );
        await takeScreenshot(
          driver,
          "business_listing_insufficient",
          screenshotDir
        );
      }

      // Get and log some business titles for verification
      const businessTitles = await page.getBusinessTitles();
      if (businessTitles.length > 0) {
        console.log(
          `📋 Sample business titles: ${businessTitles.slice(0, 3).join(", ")}`
        );
        logPass("✅ Business titles retrieved successfully");
      } else {
        logFail("❌ No business titles found");
      }
    } else {
      logFail(`❌ ${displayResult.message}`);
      // Take screenshot for display failure
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "businessListing"
      );
      await takeScreenshot(
        driver,
        "business_listing_display_fail",
        screenshotDir
      );
    }

    // Check for loading indicators (should be gone after loading)
    const hasLoadingIndicator = await page.checkForLoadingIndicator();
    if (hasLoadingIndicator) {
      logFail(
        "❌ Loading indicator still visible after businesses should have loaded"
      );
      // Take screenshot for loading indicator issue
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "businessListing"
      );
      await takeScreenshot(
        driver,
        "business_listing_loading_stuck",
        screenshotDir
      );
    } else {
      logPass(
        "✅ No loading indicators visible (businesses loaded successfully)"
      );
    }

    // Check for error messages
    const errorMessage = await page.checkForErrorMessages();
    if (errorMessage) {
      logFail(`❌ Error message found on page: ${errorMessage}`);
      // Take screenshot for error message
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "businessListing"
      );
      await takeScreenshot(
        driver,
        "business_listing_error_message",
        screenshotDir
      );
    } else {
      logPass("✅ No error messages found on the page");
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
        "businessListing"
      );
      await takeScreenshot(
        driver,
        "business_listing_error_screenshot",
        screenshotDir
      );
    }

    if (errorDetected) {
      logFail("Business listing test completed with errors detected");
    } else {
      logSuccess("Business listing test completed successfully");
    }
  } catch (error) {
    logError(`Business listing test failed: ${error}`);
    // Take screenshot on error
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "businessListing"
    );
    await takeScreenshot(
      driver,
      "business_listing_error_screenshot",
      screenshotDir
    );
  } finally {
    await driver.quit();
  }
})();
