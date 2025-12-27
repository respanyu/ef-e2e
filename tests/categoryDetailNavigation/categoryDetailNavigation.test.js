const fs = require("fs");
const path = require("path");
const { By } = require("selenium-webdriver");
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
  logWarning,
} = require("../../utils/logger");
const CategoryNavigationPage = require("../../pages/CategoryNavigationPage");

(async function categoryDetailNavigationTest() {
  let driver = await createDriver();

  try {
    logStart("Starting Category Detail Navigation Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    logPass("Test data loaded from JSON");

    const page = new CategoryNavigationPage(driver);

    // Step 1: Navigate to categories page
    logPass("Step 1: Navigating to Categories Page");
    await page.open(testData.categoriesUrl);
    logPass("Categories page opened successfully");

    // Step 2: Wait for categories to load
    logPass("Step 2: Waiting for Categories to Load");
    const categoriesLoaded = await page.waitForCategoriesToLoad(
      testData.timeout
    );
    if (categoriesLoaded) {
      logPass("Categories loaded successfully");
    } else {
      logFail("Categories failed to load");
      return;
    }

    // Step 3: Get categories count for logging
    logPass("Step 3: Counting Available Categories");
    const categoriesCount = await page.getCategoriesCount();
    logPass(
      `Found ${categoriesCount.categories} categories with ${categoriesCount.subcategories} total subcategories`
    );

    if (categoriesCount.categories === 0) {
      logFail("No categories found on the page");
      return;
    }

    // Step 4: Click on the first category
    logPass("Step 4: Clicking on First Category");
    const categoryClicked = await page.clickOnFirstCategory();
    if (categoryClicked) {
      logPass("Successfully clicked on first category");
    } else {
      logFail("Could not find or click on any category");
      return;
    }

    // Step 5: Wait for category detail page to load
    logPass("Step 5: Waiting for Category Detail Page to Load");
    await sleep(driver, 3000);

    const categoryPageLoaded = await page.waitForCategoryPage(testData.timeout);
    if (categoryPageLoaded) {
      logPass("Category detail page loaded successfully");
    } else {
      logFail("Category detail page failed to load");
      return;
    }

    // Step 6: Verify we're on a category detail page
    logPass("Step 6: Verifying Category Detail Page URL and Content");
    const currentUrl = await driver.getCurrentUrl();
    logPass(`Current URL: ${currentUrl}`);

    if (
      currentUrl.includes("/category/") &&
      !currentUrl.includes("/categories")
    ) {
      logPass("Successfully navigated to category detail page");
    } else {
      logFail("Did not navigate to a category detail page");
      return;
    }

    // Step 7: Check for category page title
    logPass("Step 7: Checking Category Page Title");
    const categoryTitle = await page.getCategoryPageTitle();
    if (categoryTitle) {
      logPass(`Category page title: "${categoryTitle}"`);
    } else {
      logWarning("Could not find category page title");
    }

    // Step 8: Verify category page content
    logPass("Step 8: Verifying Category Page Content");
    const pageText = await driver.findElement(By.tagName("body")).getText();

    const hasCategoryContent =
      testData.expectedContent.categoryPageIndicators.some((indicator) =>
        pageText.toLowerCase().includes(indicator.toLowerCase())
      );

    if (hasCategoryContent) {
      logPass("Category detail page contains expected content");
    } else {
      logWarning("Category detail page content verification unclear");
    }

    // Step 9: Check for business listings in the category
    logPass("Step 9: Checking for Business Listings in Category");
    try {
      const businessListings = await driver.findElements(
        By.css(testData.selectors.businessListings)
      );
      logPass(
        `Found ${businessListings.length} business listings in this category`
      );

      if (businessListings.length > 0) {
        // Get the text of the first business for logging
        const firstBusinessText = await businessListings[0].getText();
        logPass(
          `First business in category: "${firstBusinessText.substring(
            0,
            50
          )}..."`
        );
      } else {
        logWarning("No business listings found in this category");
      }
    } catch (businessError) {
      logWarning(`Could not check business listings: ${businessError.message}`);
    }

    // Step 10: Check for category-specific content
    logPass("Step 10: Checking for Category-Specific Content Elements");
    try {
      const categoryContentElements = await driver.findElements(
        By.css(testData.selectors.categoryContent)
      );
      if (categoryContentElements.length > 0) {
        logPass("Category content elements found");
      } else {
        logWarning("No category content elements found");
      }
    } catch (contentError) {
      logWarning(`Could not check category content: ${contentError.message}`);
    }

    // Step 11: Final validation and error checking
    logPass("Step 11: Final Validation and Error Checking");
    const pageErrorDetected = await checkForErrors(driver);
    if (pageErrorDetected) {
      logFail("Page errors detected on category detail page");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "categoryDetailNavigation"
      );
      await takeScreenshot(driver, "error_screenshot", screenshotDir);
    } else {
      logSuccess(
        "Category Detail Navigation test completed successfully - category detail page loaded properly"
      );
    }
  } catch (error) {
    logError(`Category Detail Navigation test failed: ${error}`);
    // Take screenshot on error
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "categoryDetailNavigation"
    );
    await takeScreenshot(driver, "error_screenshot", screenshotDir);
  } finally {
    await driver.quit();
  }
})();
