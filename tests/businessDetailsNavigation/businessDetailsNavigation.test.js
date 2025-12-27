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
const BusinessDetailsNavigationPage = require("../../pages/BusinessDetailsNavigationPage");

(async function businessDetailsNavigationTest() {
  let driver = await createDriver();

  try {
    logStart("Starting Business Details Navigation Test...");

    // Load test data from JSON
    const testData = loadTestData();
    logPass("Test data loaded from JSON");

    const page = new BusinessDetailsNavigationPage(driver);

    // Test Case 1: Load home page and verify businesses are displayed
    logPass("Test Case 1: Loading home page and verifying business listings");

    await page.open(testData.url);
    logPass("Home page opened successfully");

    // Wait for businesses to load
    const businessesLoaded = await page.waitForBusinessesToLoad(
      testData.timeout
    );
    if (businessesLoaded) {
      logPass("Business listings loaded successfully");
    } else {
      logFail("Business listings failed to load");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "businessDetailsNavigation"
      );
      await takeScreenshot(driver, "businesses_not_loaded", screenshotDir);
      return;
    }

    // Check business display
    const displayCheck = await page.checkBusinessDisplay();
    if (displayCheck.displayed) {
      logPass(`Business display check: ${displayCheck.message}`);
      logPass(`Total businesses found: ${displayCheck.count}`);
      logPass(`Valid businesses: ${displayCheck.validCount}`);
    } else {
      logFail(`Business display check failed: ${displayCheck.message}`);
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "businessDetailsNavigation"
      );
      await takeScreenshot(driver, "business_display_failed", screenshotDir);
      return;
    }

    // Test Case 2: Click on first business and verify navigation to details page
    logPass("Test Case 2: Testing navigation to business details page");

    // Get current URL before clicking
    const originalUrl = await driver.getCurrentUrl();
    logPass(`Original URL: ${originalUrl}`);

    // Click on the first business
    const clickSuccess = await page.clickOnFirstBusiness();
    if (clickSuccess) {
      logPass("Successfully clicked on first business");
    } else {
      logFail("Failed to click on any business");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "businessDetailsNavigation"
      );
      await takeScreenshot(driver, "click_failed", screenshotDir);
      return;
    }

    // Wait for navigation to business details page
    await sleep(driver, 2000);
    const navigationSuccess = await page.waitForBusinessDetailsPage(10000);

    if (navigationSuccess) {
      logPass("Successfully navigated to business details page");
    } else {
      logFail("Failed to navigate to business details page");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "businessDetailsNavigation"
      );
      await takeScreenshot(driver, "navigation_failed", screenshotDir);
      return;
    }

    // Check current URL after navigation
    const currentUrl = await driver.getCurrentUrl();
    logPass(`Current URL after navigation: ${currentUrl}`);

    // Verify URL contains business details pattern
    if (currentUrl.includes("/business/") && currentUrl !== originalUrl) {
      logPass("URL pattern indicates business details page");
    } else {
      logWarning("URL pattern may not indicate business details page");
    }

    // Test Case 3: Verify business details page content
    logPass("Test Case 3: Verifying business details page content");

    // Check for business title
    const businessTitle = await page.getBusinessDetailsTitle();
    if (businessTitle) {
      logPass(`Business title found: ${businessTitle}`);
    } else {
      logWarning("Business title not found on details page");
    }

    // Check for various business details elements
    const elementsCheck = await page.checkBusinessDetailsElements();
    logPass(
      `Business details elements check: Title: ${elementsCheck.title}, Description: ${elementsCheck.description}, Contact: ${elementsCheck.contact}, Address: ${elementsCheck.address}`
    );

    // Check for errors on the page
    const errorDetected = await checkForErrors(driver);
    if (errorDetected) {
      logFail("Errors detected on business details page");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "businessDetailsNavigation"
      );
      await takeScreenshot(driver, "details_page_error", screenshotDir);
    } else {
      logPass("No errors detected on business details page");
    }

    // Test Case 4: Navigate back to home page
    logPass("Test Case 4: Testing navigation back to home page");

    const backNavigation = await page.goBackToHomePage();
    if (backNavigation) {
      logPass("Successfully navigated back to home page");
    } else {
      logFail("Failed to navigate back to home page");
    }

    // Verify we're back on the home page
    await sleep(driver, 1000);
    const finalUrl = await driver.getCurrentUrl();
    if (finalUrl === originalUrl || finalUrl === testData.url) {
      logPass("Successfully returned to home page");
    } else {
      logWarning(`May not be back on home page. Current URL: ${finalUrl}`);
    }

    logSuccess("Business Details Navigation test completed successfully");
  } catch (error) {
    logError(`Test failed: ${error}`);
    // Take screenshot on error
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "businessDetailsNavigation"
    );
    await takeScreenshot(driver, "error_screenshot", screenshotDir);
  } finally {
    await driver.quit();
  }
})();
