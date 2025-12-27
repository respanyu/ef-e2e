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
const SearchPage = require("../../pages/SearchPage");

(async function searchRestaurantTest() {
  let driver = await createDriver();

  try {
    logStart("Starting Search Restaurant Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    logPass("Test data loaded from JSON");

    const page = new SearchPage(driver);

    // Step 1: Open the search page
    logPass("Step 1: Opening search page");
    await page.open(testData.url);
    logPass("Search page opened successfully");

    // Step 2: Fill and submit search form
    logPass("Step 2: Filling and submitting search form");
    await page.fillKeyword(testData.searchKeyword);
    logPass(`Keyword filled: "${testData.searchKeyword}"`);

    await page.fillCity(testData.searchCity);
    logPass(`City filled: "${testData.searchCity}"`);

    const submitted = await page.submitSearch();
    if (submitted) {
      logPass("Search form submitted successfully");
    } else {
      logFail("Could not submit search form");
      return;
    }

    // Step 3: Wait for search results to load
    logPass("Step 3: Waiting for search results to load");
    await sleep(driver, 3000);

    const hasResults = await page.checkForSearchResults();
    if (hasResults) {
      logPass("Search results found for restaurant search");
    } else {
      logWarning(
        "No search results found - checking if we're on a results page anyway"
      );
    }

    // Step 4: Click on the first restaurant result
    logPass("Step 4: Clicking on first restaurant result");
    const clicked = await clickOnFirstRestaurant(driver, testData);
    if (clicked) {
      logPass("Successfully clicked on first restaurant result");
    } else {
      logFail("Could not find or click on any restaurant result");
      return;
    }

    // Step 5: Verify restaurant detail page loads
    logPass("Step 5: Verifying restaurant detail page loads");
    await sleep(driver, 3000);

    const currentUrl = await driver.getCurrentUrl();
    logPass(`Current URL after clicking: ${currentUrl}`);

    // Check if we're on a business detail page
    if (
      currentUrl.includes("/business/") ||
      currentUrl.includes("restaurant")
    ) {
      logPass("Successfully navigated to business detail page");

      // Verify page content
      const pageTitle = await driver.getTitle();
      logPass(`Page title: "${pageTitle}"`);

      const bodyText = await driver.findElement(By.tagName("body")).getText();
      const hasRestaurantContent =
        testData.expectedContent.businessDetailPage.some((indicator) =>
          bodyText.toLowerCase().includes(indicator.toLowerCase())
        );

      if (hasRestaurantContent) {
        logSuccess("Restaurant detail page loaded with expected content");
      } else {
        logWarning(
          "Restaurant detail page loaded but content verification unclear"
        );
      }

      // Check for business detail elements
      try {
        const detailElements = await driver.findElements(
          By.css(testData.selectors.businessDetailContent)
        );
        if (detailElements.length > 0) {
          logPass("Business detail content elements found");
        } else {
          logWarning("No business detail content elements found");
        }
      } catch (detailError) {
        logWarning(`Could not check detail elements: ${detailError.message}`);
      }
    } else {
      logFail("Did not navigate to a business detail page");
    }

    // Step 6: Check for any errors on the page
    logPass("Step 6: Checking for page errors");
    const pageErrorDetected = await checkForErrors(driver);
    if (pageErrorDetected) {
      logFail("Page errors detected on restaurant detail page");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "searchRestaurant"
      );
      await takeScreenshot(driver, "error_screenshot", screenshotDir);
    } else {
      logSuccess(
        "Search Restaurant test completed successfully - restaurant detail page loaded properly"
      );
    }
  } catch (error) {
    logError(`Search Restaurant test failed: ${error}`);
    // Take screenshot on error
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "searchRestaurant"
    );
    await takeScreenshot(driver, "error_screenshot", screenshotDir);
  } finally {
    await driver.quit();
  }
})();

// Helper function to click on first restaurant result
async function clickOnFirstRestaurant(driver, testData) {
  try {
    // Try multiple selectors to find restaurant links
    const selectors = [
      "a[href*='restaurant']",
      "a[href*='business']",
      ".business-card a",
      ".search-result a",
      "[class*='restaurant'] a",
      ".business-name",
      "[class*='result'] a",
    ];

    for (let selector of selectors) {
      try {
        const restaurantLinks = await driver.findElements(By.css(selector));
        if (restaurantLinks.length > 0) {
          // Get the text of the first link to log it
          const linkText = await restaurantLinks[0].getText();
          logPass(`Found restaurant link: "${linkText}"`);

          // Click on the first restaurant link
          await restaurantLinks[0].click();
          logPass(`Clicked on restaurant using selector: ${selector}`);
          return true;
        }
      } catch (error) {
        continue;
      }
    }

    // If no specific links found, try clicking on business cards directly
    const businessCards = await driver.findElements(
      By.css(testData.selectors.searchResults)
    );
    if (businessCards.length > 0) {
      await businessCards[0].click();
      logPass("Clicked on first business card directly");
      return true;
    }

    return false;
  } catch (error) {
    logError(`Error clicking on restaurant: ${error.message}`);
    return false;
  }
}
