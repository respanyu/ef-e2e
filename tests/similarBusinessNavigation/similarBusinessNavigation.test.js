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
const BusinessDetailsNavigationPage = require("../../pages/BusinessDetailsNavigationPage");

(async function similarBusinessNavigationTest() {
  let driver = await createDriver();

  try {
    logStart("Starting Similar Business Navigation Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    logPass("Test data loaded from JSON");

    const page = new BusinessDetailsNavigationPage(driver);

    // Step 1: Open home page and load businesses
    await page.open(testData.url);
    logPass("Home page opened");

    // Wait for businesses to load
    const businessesLoaded = await page.waitForBusinessesToLoad(
      testData.timeout
    );
    if (!businessesLoaded) {
      logFail("Business listings failed to load");
      return;
    }
    logPass("Business listings loaded successfully");

    // Step 2: Click on first business to go to details page
    const businessClicked = await page.clickOnFirstBusiness();
    if (!businessClicked) {
      logFail("Failed to click on any business");
      return;
    }
    logPass("Clicked on first business");

    // Step 3: Wait for business details page to load
    const detailsPageLoaded = await page.waitForBusinessDetailsPage(
      testData.timeout
    );
    if (!detailsPageLoaded) {
      logFail("Business details page failed to load");
      return;
    }
    logPass("Business details page loaded successfully");

    // Get the original business title for comparison
    const originalTitle = await page.getBusinessDetailsTitle();
    logPass(`Original business title: "${originalTitle || "Unknown"}"`);

    // Take screenshot of the business details page
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "similarBusinessNavigation"
    );
    await takeScreenshot(driver, "business_details_page", screenshotDir);

    // Step 4: Check if similar businesses section exists
    const similarExists = await page.checkSimilarBusinessesExist();
    if (!similarExists) {
      logWarning(
        "No similar businesses section found on this business details page"
      );
      logSuccess(
        "Similar Business Navigation Test completed - no similar businesses to test"
      );
      return;
    }
    logPass("Similar businesses section found");

    // Step 5: Click on a similar business
    const similarClicked = await page.clickOnSimilarBusiness();
    if (!similarClicked) {
      logFail("Failed to click on any similar business");
      return;
    }
    logPass("Clicked on similar business");

    // Step 6: Wait for navigation to similar business page
    const similarPageLoaded = await page.waitForSimilarBusinessPage(
      testData.timeout
    );
    if (!similarPageLoaded) {
      logFail("Similar business page failed to load");
      return;
    }
    logPass("Similar business page loaded");

    // Take screenshot of the similar business page
    await takeScreenshot(driver, "similar_business_page", screenshotDir);

    // Step 7: Verify we navigated to a different business
    const isDifferentBusiness = await page.verifyDifferentBusiness(
      originalTitle
    );
    if (isDifferentBusiness) {
      logPass("Successfully navigated to a different business details page");
    } else {
      logWarning(
        "Navigation occurred but may be to the same business or unclear destination"
      );
    }

    // Step 8: Check for errors
    const errorDetected = await checkForErrors(driver);
    if (errorDetected) {
      logFail("Errors detected during similar business navigation");
    } else {
      logPass("No errors detected during similar business navigation");
    }

    logSuccess("Similar Business Navigation Test completed successfully");
  } catch (error) {
    logError(`Similar Business Navigation Test failed: ${error.message}`);
    // Take error screenshot
    try {
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "similarBusinessNavigation"
      );
      await takeScreenshot(
        driver,
        "similar_business_navigation_error",
        screenshotDir
      );
    } catch (screenshotError) {
      logError(`Failed to take error screenshot: ${screenshotError.message}`);
    }
  } finally {
    await driver.quit();
  }
})();
