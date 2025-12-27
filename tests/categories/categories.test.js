const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const CategoriesPage = require("../../pages/CategoriesPage");
const { createDriver } = require("../../utils/driver");
const {
  logStart,
  logSuccess,
  logPass,
  logError,
} = require("../../utils/logger");
const { checkForErrors } = require("../../utils/errors");
const { takeScreenshot } = require("../../utils/screenshot");

async function testCategoriesContent() {
  let driver;
  const testName = "Categories Content Validation";

  try {
    logStart(`Starting ${testName}...`);

    // Initialize driver
    driver = await createDriver();
    const categoriesPage = new CategoriesPage(driver);

    logPass("Driver initialized successfully");

    logPass("Navigating to categories page");
    await categoriesPage.navigate();

    logPass("Waiting for page to load completely");
    await driver.wait(until.elementLocated(By.css("body")), 10000);

    logPass("Validating categories are loaded from API");
    const categoriesLoaded = await categoriesPage.validateCategoriesLoaded();
    if (!categoriesLoaded) {
      throw new Error("Categories failed to load from API");
    }
    logPass("Categories loaded successfully from API");

    logPass("Validating category structure and data");
    const categoriesValid = await categoriesPage.validateCategoryStructure();
    if (!categoriesValid.isValid) {
      throw new Error("Category structure validation failed");
    }
    logPass("Category structure validation passed");

    logPass("Validating subcategories are present");
    const subcategoriesPresent =
      await categoriesPage.validateSubcategoriesPresent();
    if (!subcategoriesPresent) {
      throw new Error("Subcategories validation failed");
    }
    logPass("Subcategories validation passed");

    logPass("Counting total categories and subcategories");
    const countResult = await categoriesPage.getCategoriesCount();
    console.log(
      `Found ${countResult.categories} categories and ${countResult.subcategories} subcategories`
    );
    logSuccess(
      `Categories content validation completed: ${countResult.categories} categories, ${countResult.subcategories} subcategories`
    );
  } catch (error) {
    logError(`${testName} failed: ${error.message}`);
    await checkForErrors(driver);
    await takeScreenshot(driver, testName);
    throw error;
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

module.exports = { testCategoriesContent };

// Run the test if this file is executed directly
if (require.main === module) {
  testCategoriesContent().catch(console.error);
}
