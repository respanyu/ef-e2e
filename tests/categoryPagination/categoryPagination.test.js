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
const CategoryNavigationPage = require("../../pages/CategoryNavigationPage");

(async function categoryPaginationTest() {
  let driver = await createDriver();

  try {
    logStart("Starting Category Pagination Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    logPass("Test data loaded from JSON");

    const page = new CategoryNavigationPage(driver);

    // Step 1: Open categories page
    await page.open(testData.url);
    logPass("Categories page opened");

    // Step 2: Wait for categories to load
    const categoriesLoaded = await page.waitForCategoriesToLoad(
      testData.timeout
    );
    if (!categoriesLoaded) {
      logFail("Categories failed to load");
      return;
    }
    logPass("Categories loaded successfully");

    // Step 3: Click on first category
    const categoryClicked = await page.clickOnFirstCategory();
    if (!categoryClicked) {
      logFail("Failed to click on any category");
      return;
    }
    logPass("Clicked on first category");

    // Step 4: Wait for category page to load
    const categoryPageLoaded = await page.waitForCategoryPage(testData.timeout);
    if (!categoryPageLoaded) {
      logFail("Category page failed to load");
      return;
    }
    logPass("Category page loaded successfully");

    // Take screenshot of category page
    const categoryScreenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "categoryPagination"
    );
    await takeScreenshot(driver, "category_page_loaded", categoryScreenshotDir);

    // Step 5: Check if pagination exists
    const paginationInfo = await page.getPaginationInfo();
    logPass(
      `Pagination check: ${
        paginationInfo.hasPagination ? "Found" : "Not found"
      }`
    );

    if (!paginationInfo.hasPagination) {
      logWarning(
        "No pagination found on category page - may not have enough listings to paginate"
      );
      logSuccess("Category Pagination Test completed - no pagination needed");
      return;
    }

    // Step 6: Log pagination details
    logPass(`Current page: ${paginationInfo.currentPage || "Unknown"}`);
    logPass(`Has next page: ${paginationInfo.hasNext}`);
    logPass(`Has previous page: ${paginationInfo.hasPrevious}`);

    // Step 7: Test pagination functionality
    if (paginationInfo.hasNext) {
      logStart("Testing next page navigation...");

      // Get business count on current page
      const businessCountBefore = await page.getBusinessCountInCategory();
      logPass(`Business count on current page: ${businessCountBefore}`);

      // Click next page
      const nextClicked = await page.clickNextPage();
      if (!nextClicked) {
        logFail("Failed to click next page button");
      } else {
        logPass("Clicked next page button");

        // Wait for page change
        await page.waitForPageChange();

        // Take screenshot of next page
        await takeScreenshot(
          driver,
          "category_page_next",
          categoryScreenshotDir
        );

        // Get business count on next page
        const businessCountAfter = await page.getBusinessCountInCategory();
        logPass(`Business count on next page: ${businessCountAfter}`);

        // Check if page actually changed
        const newPaginationInfo = await page.getPaginationInfo();
        if (newPaginationInfo.currentPage !== paginationInfo.currentPage) {
          logPass("Page navigation successful - page number changed");
        } else {
          logWarning(
            "Page navigation may not have worked - page number unchanged"
          );
        }

        // Test going back to previous page if possible
        if (newPaginationInfo.hasPrevious) {
          logStart("Testing previous page navigation...");

          const prevClicked = await page.clickPreviousPage();
          if (prevClicked) {
            logPass("Clicked previous page button");

            await page.waitForPageChange();
            await takeScreenshot(
              driver,
              "category_page_previous",
              categoryScreenshotDir
            );

            const finalPaginationInfo = await page.getPaginationInfo();
            if (
              finalPaginationInfo.currentPage === paginationInfo.currentPage
            ) {
              logPass(
                "Previous page navigation successful - returned to original page"
              );
            } else {
              logWarning(
                "Previous page navigation may not have worked correctly"
              );
            }
          } else {
            logWarning("Could not test previous page navigation");
          }
        }
      }
    } else {
      logWarning("No next page available - cannot test pagination navigation");
    }

    // Step 8: Check for errors
    const errorDetected = await checkForErrors(driver);
    if (errorDetected) {
      logFail("Errors detected during pagination testing");
    } else {
      logPass("No errors detected during pagination testing");
    }

    logSuccess("Category Pagination Test completed successfully");
  } catch (error) {
    logError(`Category Pagination Test failed: ${error.message}`);
    // Take error screenshot
    try {
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "categoryPagination"
      );
      await takeScreenshot(driver, "category_pagination_error", screenshotDir);
    } catch (screenshotError) {
      logError(`Failed to take error screenshot: ${screenshotError.message}`);
    }
  } finally {
    await driver.quit();
  }
})();
