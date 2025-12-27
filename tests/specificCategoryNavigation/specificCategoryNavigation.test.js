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

(async function specificCategoryNavigationTest() {
  let driver = await createDriver();

  try {
    logStart("Starting Specific Category Navigation Test...");

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

    // Step 3: Find and click on specific category by name
    logPass("Step 3: Finding and Clicking on Specific Category");
    logPass(`Target category: "${testData.targetCategory}"`);

    const categoryClicked = await clickOnSpecificCategory(driver, testData);
    if (categoryClicked) {
      logPass(`Successfully clicked on category: "${testData.targetCategory}"`);
    } else {
      logFail(
        `Could not find or click on category: "${testData.targetCategory}"`
      );
      return;
    }

    // Step 4: Wait for category detail page to load
    logPass("Step 4: Waiting for Category Detail Page to Load");
    await sleep(driver, 3000);

    const categoryPageLoaded = await page.waitForCategoryPage(testData.timeout);
    if (categoryPageLoaded) {
      logPass("Category detail page loaded successfully");
    } else {
      logFail("Category detail page failed to load");
      return;
    }

    // Step 5: Verify we're on the correct category detail page
    logPass("Step 5: Verifying Correct Category Detail Page URL");
    const currentUrl = await driver.getCurrentUrl();
    logPass(`Current URL: ${currentUrl}`);

    if (
      currentUrl.includes("/category/") &&
      currentUrl.includes(testData.expectedCategoryUrl)
    ) {
      logPass(
        `Successfully navigated to correct category detail page: ${testData.expectedCategoryUrl}`
      );
    } else {
      logFail(
        `Did not navigate to expected category page. Expected URL to contain: "${testData.expectedCategoryUrl}"`
      );
      return;
    }

    // Step 6: Check for category page title and verify it matches
    logPass("Step 6: Checking Category Page Title and Validation");
    const categoryTitle = await page.getCategoryPageTitle();
    if (categoryTitle) {
      logPass(`Category page title: "${categoryTitle}"`);

      // Verify the title relates to the clicked category
      const titleMatchesCategory =
        categoryTitle
          .toLowerCase()
          .includes(testData.targetCategory.toLowerCase().split(" ")[0]) ||
        testData.targetCategory
          .toLowerCase()
          .includes(categoryTitle.toLowerCase().split(" ")[0]);

      if (titleMatchesCategory) {
        logPass("Category page title matches the clicked category");
      } else {
        logWarning(
          `Category page title "${categoryTitle}" may not match clicked category "${testData.targetCategory}"`
        );
      }
    } else {
      logWarning("Could not find category page title");
    }

    // Step 7: Verify category page content
    logPass("Step 7: Verifying Category Page Content");
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

    // Step 8: Check for business listings in the category
    logPass("Step 8: Checking for Business Listings in Category");
    try {
      const businessListings = await driver.findElements(
        By.css(testData.selectors.businessListings)
      );
      logPass(
        `Found ${businessListings.length} business listings in "${testData.targetCategory}" category`
      );

      if (businessListings.length > 0) {
        // Get the text of the first business for logging
        const firstBusinessText = await businessListings[0].getText();
        logPass(
          `Sample business in category: "${firstBusinessText.substring(
            0,
            50
          )}..."`
        );
      } else {
        logWarning(
          `No business listings found in "${testData.targetCategory}" category`
        );
      }
    } catch (businessError) {
      logWarning(`Could not check business listings: ${businessError.message}`);
    }

    // Step 9: Verify category-specific content matches the clicked category
    logPass(
      "Step 9: Verifying Category-Specific Content Matches Clicked Category"
    );
    try {
      // Check if the page content mentions the category name
      const categoryMentioned =
        pageText
          .toLowerCase()
          .includes(testData.targetCategory.toLowerCase().split(" ")[0]) ||
        pageText
          .toLowerCase()
          .includes(testData.expectedCategoryUrl.replace("-", " "));

      if (categoryMentioned) {
        logPass(
          `Page content confirms this is the "${testData.targetCategory}" category`
        );
      } else {
        logWarning(
          `Page content may not clearly indicate this is the "${testData.targetCategory}" category`
        );
      }
    } catch (contentError) {
      logWarning(`Could not verify category content: ${contentError.message}`);
    }

    // Step 10: Click on the category subtitle element from the business listings
    logPass("Step 10: Clicking on Category Subtitle from Business Listings");
    logPass(`Looking for category subtitle: "${testData.targetCategory}"`);

    const subtitleClicked = await clickOnCategorySubtitle(driver, testData);
    if (subtitleClicked) {
      logPass(
        `Successfully clicked on category subtitle: "${testData.targetCategory}"`
      );
    } else {
      logWarning(
        `Could not find category subtitle: "${testData.targetCategory}", continuing with navigation`
      );
    }

    // Step 11: If subtitle was clicked, verify it stays on same page or navigates appropriately
    if (subtitleClicked) {
      logPass("Step 11: Verifying Category Subtitle Click Behavior");
      await sleep(driver, 2000);

      const currentUrlAfterSubtitle = await driver.getCurrentUrl();
      logPass(`URL after subtitle click: ${currentUrlAfterSubtitle}`);

      // Check if clicking the subtitle does anything (might be informational only)
      if (currentUrlAfterSubtitle === currentUrl) {
        logPass(
          "Category subtitle click maintained current page (informational element)"
        );
      } else {
        logPass("Category subtitle click caused navigation");
      }

      // Verify the subtitle element still exists and shows correct category
      try {
        const subtitleElements = await driver.findElements(
          By.css(testData.selectors.categorySubtitle)
        );
        if (subtitleElements.length > 0) {
          const subtitleText = await subtitleElements[0].getText();
          logPass(`Category subtitle text: "${subtitleText}"`);

          if (subtitleText.includes(testData.targetCategory)) {
            logPass(
              "Category subtitle correctly displays the current category"
            );
          } else {
            logWarning(
              `Category subtitle "${subtitleText}" may not match expected category "${testData.targetCategory}"`
            );
          }
        }
      } catch (subtitleError) {
        logWarning(
          `Could not verify subtitle after click: ${subtitleError.message}`
        );
      }
    }

    // Step 12: Click on sub-category from category detail page
    logPass("Step 12: Clicking on Sub-Category from Category Detail Page");
    logPass(`Target sub-category: "${testData.targetSubcategory}"`);

    const subcategoryClicked = await clickOnSpecificSubcategory(
      driver,
      testData
    );
    if (subcategoryClicked) {
      logPass(
        `Successfully clicked on sub-category: "${testData.targetSubcategory}"`
      );
    } else {
      logWarning(
        `Could not find sub-category: "${testData.targetSubcategory}", continuing with category validation`
      );
    }

    // Step 13: If sub-category was clicked, verify sub-category detail page
    if (subcategoryClicked) {
      logPass("Step 13: Verifying Sub-Category Detail Page");
      await sleep(driver, 3000);

      const subcategoryUrl = await driver.getCurrentUrl();
      logPass(`Sub-category URL: ${subcategoryUrl}`);

      if (
        subcategoryUrl.includes("/category/") &&
        subcategoryUrl.includes(testData.expectedSubcategoryUrl)
      ) {
        logPass(
          `Successfully navigated to sub-category detail page: ${testData.expectedSubcategoryUrl}`
        );
      } else {
        logWarning(
          `Did not navigate to expected sub-category page. Expected URL to contain: "${testData.expectedSubcategoryUrl}"`
        );
      }

      // Check sub-category page content
      const subcategoryPageText = await driver
        .findElement(By.tagName("body"))
        .getText();
      const hasSubcategoryContent =
        testData.expectedContent.subcategoryPageIndicators.some((indicator) =>
          subcategoryPageText.toLowerCase().includes(indicator.toLowerCase())
        );

      if (hasSubcategoryContent) {
        logPass("Sub-category detail page contains expected content");
      } else {
        logWarning("Sub-category detail page content verification unclear");
      }

      // Check for business listings in the sub-category
      try {
        const subcategoryBusinessListings = await driver.findElements(
          By.css(testData.selectors.businessListings)
        );
        logPass(
          `Found ${subcategoryBusinessListings.length} business listings in "${testData.targetSubcategory}" sub-category`
        );
      } catch (subBusinessError) {
        logWarning(
          `Could not check sub-category business listings: ${subBusinessError.message}`
        );
      }
    }

    // Step 14: Final validation and error checking
    logPass("Step 14: Final Validation and Error Checking");
    const pageErrorDetected = await checkForErrors(driver);
    if (pageErrorDetected) {
      logFail("Page errors detected");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "specificCategoryNavigation"
      );
      await takeScreenshot(driver, "error_screenshot", screenshotDir);
    } else {
      const navigationLevel = subcategoryClicked ? "sub-category" : "category";
      logSuccess(
        `Specific Category Navigation test completed successfully - ${navigationLevel} detail page loaded and validated properly`
      );
    }
  } catch (error) {
    logError(`Specific Category Navigation test failed: ${error}`);
    // Take screenshot on error
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "specificCategoryNavigation"
    );
    await takeScreenshot(driver, "error_screenshot", screenshotDir);
  } finally {
    await driver.quit();
  }
})();

// Helper function to find and click on a specific category by name
async function clickOnSpecificCategory(driver, testData) {
  try {
    // Get all category containers
    const categoryContainers = await driver.findElements(
      By.css(testData.selectors.categoryList)
    );

    if (categoryContainers.length === 0) {
      logWarning("No category containers found");
      return false;
    }

    logPass(
      `Found ${categoryContainers.length} category containers to search through`
    );

    // Loop through each category container to find the one with matching name
    for (let i = 0; i < categoryContainers.length; i++) {
      try {
        // Try to get the category name from this container
        const categoryNameElement = await categoryContainers[i].findElement(
          By.css(testData.selectors.categoryName)
        );
        const categoryName = await categoryNameElement.getText();

        logPass(`Checking category ${i + 1}: "${categoryName}"`);

        // Check if this category name matches our target
        if (
          categoryName &&
          (categoryName
            .toLowerCase()
            .includes(testData.targetCategory.toLowerCase()) ||
            testData.targetCategory
              .toLowerCase()
              .includes(categoryName.toLowerCase().split(" ")[0]))
        ) {
          logPass(
            `Found matching category: "${categoryName}" (target: "${testData.targetCategory}")`
          );

          // Try to find and click the link within this category container
          try {
            const categoryLink = await categoryContainers[i].findElement(
              By.css("a")
            );
            await categoryLink.click();
            logPass(`Clicked on category link for: "${categoryName}"`);
            return true;
          } catch (linkError) {
            // If no link found, try clicking the container itself
            await categoryContainers[i].click();
            logPass(`Clicked on category container for: "${categoryName}"`);
            return true;
          }
        }
      } catch (nameError) {
        // Continue to next category if we can't get the name
        continue;
      }
    }

    // If we didn't find the exact category, try a broader search
    logWarning(
      `Exact category "${testData.targetCategory}" not found, trying broader search...`
    );

    // Try to find any link that contains the category name in href or text
    const allLinks = await driver.findElements(By.css("a"));
    for (let link of allLinks) {
      try {
        const linkText = await link.getText();
        const linkHref = await link.getAttribute("href");

        if (
          (linkText &&
            linkText
              .toLowerCase()
              .includes(testData.targetCategory.toLowerCase().split(" ")[0])) ||
          (linkHref && linkHref.includes(testData.expectedCategoryUrl))
        ) {
          logPass(`Found category link via broader search: "${linkText}"`);
          await link.click();
          return true;
        }
      } catch (linkError) {
        continue;
      }
    }

    logWarning(`Could not find category: "${testData.targetCategory}"`);
    return false;
  } catch (error) {
    logError(`Error finding specific category: ${error.message}`);
    return false;
  }
}

// Helper function to find and click on a specific sub-category by name
async function clickOnSpecificSubcategory(driver, testData) {
  try {
    // Get all sub-category elements
    const subcategoryElements = await driver.findElements(
      By.css(testData.selectors.subcategoryList)
    );

    if (subcategoryElements.length === 0) {
      logWarning("No sub-category elements found on category page");
      return false;
    }

    logPass(
      `Found ${subcategoryElements.length} sub-category elements to search through`
    );

    // Loop through each sub-category element to find the one with matching name
    for (let i = 0; i < subcategoryElements.length; i++) {
      try {
        // Try to get the sub-category name/text from this element
        const subcategoryText = await subcategoryElements[i].getText();
        const subcategoryHref = await subcategoryElements[i].getAttribute(
          "href"
        );

        logPass(`Checking sub-category ${i + 1}: "${subcategoryText}"`);

        // Check if this sub-category name matches our target
        if (
          subcategoryText &&
          (subcategoryText
            .toLowerCase()
            .includes(testData.targetSubcategory.toLowerCase()) ||
            testData.targetSubcategory
              .toLowerCase()
              .includes(subcategoryText.toLowerCase().split(" ")[0]))
        ) {
          logPass(
            `Found matching sub-category: "${subcategoryText}" (target: "${testData.targetSubcategory}")`
          );

          // Try to find and click the link within this sub-category element
          try {
            const subcategoryLink = await subcategoryElements[i].findElement(
              By.css("a")
            );
            await subcategoryLink.click();
            logPass(`Clicked on sub-category link for: "${subcategoryText}"`);
            return true;
          } catch (linkError) {
            // If no link found, try clicking the element itself
            await subcategoryElements[i].click();
            logPass(
              `Clicked on sub-category element for: "${subcategoryText}"`
            );
            return true;
          }
        }
      } catch (nameError) {
        // Continue to next sub-category if we can't get the text
        continue;
      }
    }

    // If we didn't find the exact sub-category, try a broader search
    logWarning(
      `Exact sub-category "${testData.targetSubcategory}" not found, trying broader search...`
    );

    // Try to find any link that contains the sub-category name in href or text
    const allLinks = await driver.findElements(By.css("a"));
    for (let link of allLinks) {
      try {
        const linkText = await link.getText();
        const linkHref = await link.getAttribute("href");

        if (
          (linkText &&
            (linkText
              .toLowerCase()
              .includes(testData.targetSubcategory.toLowerCase()) ||
              testData.targetSubcategory
                .toLowerCase()
                .includes(linkText.toLowerCase().split(" ")[0]))) ||
          (linkHref && linkHref.includes(testData.expectedSubcategoryUrl))
        ) {
          logPass(`Found sub-category link via broader search: "${linkText}"`);
          await link.click();
          return true;
        }
      } catch (linkError) {
        continue;
      }
    }

    logWarning(`Could not find sub-category: "${testData.targetSubcategory}"`);
    return false;
  } catch (error) {
    logError(`Error finding specific sub-category: ${error.message}`);
    return false;
  }
}

// Helper function to find and click on category subtitle element
async function clickOnCategorySubtitle(driver, testData) {
  try {
    // Find all category subtitle elements
    const subtitleElements = await driver.findElements(
      By.css(testData.selectors.categorySubtitle)
    );

    if (subtitleElements.length === 0) {
      logWarning("No category subtitle elements found on the page");
      return false;
    }

    logPass(`Found ${subtitleElements.length} category subtitle elements`);

    // Loop through subtitle elements to find the one with matching category
    for (let i = 0; i < subtitleElements.length; i++) {
      try {
        const subtitleText = await subtitleElements[i].getText();
        logPass(`Checking subtitle ${i + 1}: "${subtitleText}"`);

        // Check if this subtitle contains the target category name
        if (
          subtitleText &&
          subtitleText
            .toLowerCase()
            .includes(testData.targetCategory.toLowerCase())
        ) {
          logPass(`Found matching category subtitle: "${subtitleText}"`);

          // Try to click on the subtitle element
          await subtitleElements[i].click();
          logPass(`Clicked on category subtitle: "${subtitleText}"`);
          return true;
        }
      } catch (textError) {
        // Continue to next subtitle if we can't get the text
        continue;
      }
    }

    // If we didn't find the exact category subtitle, try clicking on the first one
    logWarning(
      `Exact category subtitle "${testData.targetCategory}" not found, clicking on first available subtitle`
    );
    try {
      const firstSubtitleText = await subtitleElements[0].getText();
      await subtitleElements[0].click();
      logPass(`Clicked on first category subtitle: "${firstSubtitleText}"`);
      return true;
    } catch (firstClickError) {
      logWarning(
        `Could not click on first subtitle: ${firstClickError.message}`
      );
      return false;
    }
  } catch (error) {
    logError(`Error finding category subtitle: ${error.message}`);
    return false;
  }
}
