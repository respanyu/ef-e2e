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
const CategoryNavigationPage = require("../../pages/CategoryNavigationPage");

(async function categoryNavigationTest() {
  let driver = await createDriver();

  try {
    logStart("Starting Category Navigation Test...");

    // Load test data from JSON
    const testData = loadTestData();
    logPass("Test data loaded from JSON");

    const page = new CategoryNavigationPage(driver);

    // Test Case 1: Load categories page and verify categories are displayed
    logPass(
      "Test Case 1: Loading categories page and verifying category listings"
    );

    await page.open(testData.url);
    logPass("Categories page opened successfully");

    // Wait for categories to load
    const categoriesLoaded = await page.waitForCategoriesToLoad(
      testData.timeout
    );
    if (categoriesLoaded) {
      logPass("Categories loaded successfully");
    } else {
      logFail("Categories failed to load");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "categoryNavigation"
      );
      await takeScreenshot(driver, "categories_not_loaded", screenshotDir);
      return;
    }

    // Check categories display
    const categoriesCount = await page.getCategoriesCount();
    if (categoriesCount.categories > 0) {
      logPass(
        `Categories display check: ${categoriesCount.categories} categories found`
      );
      logPass(`Subcategories: ${categoriesCount.subcategories}`);
    } else {
      logFail("No categories found on the page");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "categoryNavigation"
      );
      await takeScreenshot(driver, "no_categories_found", screenshotDir);
      return;
    }

    // Get category titles for verification
    const categoryTitles = await page.getCategoryTitles();
    if (categoryTitles.length > 0) {
      logPass(
        `Found ${categoryTitles.length} category titles: ${categoryTitles
          .slice(0, 3)
          .join(", ")}...`
      );
    } else {
      logWarning("No category titles found");
    }

    // Test Case 2: Click on first category and verify navigation to category page
    logPass("Test Case 2: Testing navigation to category page");

    // Get current URL before clicking
    const originalUrl = await driver.getCurrentUrl();
    logPass(`Original URL: ${originalUrl}`);

    // Click on the first category
    const clickSuccess = await page.clickOnFirstCategory();
    if (clickSuccess) {
      logPass("Successfully clicked on first category");
    } else {
      logFail("Failed to click on any category");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "categoryNavigation"
      );
      await takeScreenshot(driver, "click_failed", screenshotDir);
      return;
    }

    // Wait for navigation to category page
    await sleep(driver, 2000);
    const navigationSuccess = await page.waitForCategoryPage(10000);

    if (navigationSuccess) {
      logPass("Successfully navigated to category page");
    } else {
      logFail("Failed to navigate to category page");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "categoryNavigation"
      );
      await takeScreenshot(driver, "navigation_failed", screenshotDir);
      return;
    }

    // Check current URL after navigation
    const currentUrl = await driver.getCurrentUrl();
    logPass(`Current URL after navigation: ${currentUrl}`);

    // Verify URL contains category pattern
    if (currentUrl.includes("/category/") && currentUrl !== originalUrl) {
      logPass("URL pattern indicates category page");
    } else {
      logWarning("URL pattern may not indicate category page");
    }

    // Test Case 3: Verify category page content
    logPass("Test Case 3: Verifying category page content");

    // Check for category page title
    const categoryTitle = await page.getCategoryPageTitle();
    if (categoryTitle) {
      logPass(`Category page title found: ${categoryTitle}`);
    } else {
      logWarning("Category page title not found");
    }

    // Check for various category page elements
    const elementsCheck = await page.checkCategoryPageElements();
    logPass(
      `Category page elements check: Title: ${elementsCheck.title}, Businesses: ${elementsCheck.businesses}, Breadcrumb: ${elementsCheck.breadcrumb}, Filters: ${elementsCheck.filters}`
    );

    // Check business count in category
    const businessCount = await page.getBusinessCountInCategory();
    if (businessCount > 0) {
      logPass(`Found ${businessCount} businesses in this category`);
    } else {
      logWarning("No businesses found in this category");
    }

    // Check for errors on the page
    const errorDetected = await checkForErrors(driver);
    if (errorDetected) {
      logFail("Errors detected on category page");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "categoryNavigation"
      );
      await takeScreenshot(driver, "category_page_error", screenshotDir);
    } else {
      logPass("No errors detected on category page");
    }

    // Test Case 4: Navigate back to categories page
    logPass("Test Case 4: Testing navigation back to categories page");

    const backNavigation = await page.goBackToCategoriesPage();
    if (backNavigation) {
      logPass("Successfully navigated back to categories page");
    } else {
      logFail("Failed to navigate back to categories page");
    }

    // Verify we're back on the categories page
    await sleep(driver, 1000);
    const finalUrl = await driver.getCurrentUrl();
    if (finalUrl === originalUrl || finalUrl.includes("/categories")) {
      logPass("Successfully returned to categories page");
    } else {
      logWarning(
        `May not be back on categories page. Current URL: ${finalUrl}`
      );
    }

    logSuccess("Category Navigation test completed successfully");
  } catch (error) {
    logError(`Test failed: ${error}`);
    // Take screenshot on error
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "categoryNavigation"
    );
    await takeScreenshot(driver, "error_screenshot", screenshotDir);
  } finally {
    await driver.quit();
  }
})();
