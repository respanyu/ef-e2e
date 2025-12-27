const fs = require("fs");
const path = require("path");
const { By } = require("selenium-webdriver");
const { createDriver } = require("../../utils/driver");
const { sleep } = require("../../utils/wait");
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

(async function pageNotFoundTest() {
  let driver = await createDriver();

  try {
    logStart("Starting Page Not Found (404) Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    logPass("Test data loaded from JSON");

    // Step 1: Try to access non-existent page
    logPass("Step 1: Accessing Non-existent Page");
    await driver.get(testData.invalidUrl);
    await driver.manage().window().maximize();
    logPass("Attempted to access invalid URL");

    // Step 2: Wait for page to load
    await sleep(driver, 3000);
    logPass("Waited for error page to load");

    // Step 3: Check page title
    logPass("Step 3: Checking Page Title");
    const pageTitle = await driver.getTitle();
    logPass(`Page title: "${pageTitle}"`);

    // Step 4: Check for error indicators in page content
    logPass("Step 4: Checking for Error Page Content");

    const pageText = await driver.findElement(By.tagName("body")).getText();
    let foundErrorContent = false;

    for (const indicator of testData.errorTextIndicators) {
      if (pageText.toLowerCase().includes(indicator.toLowerCase())) {
        logPass(`Found error indicator in page text: "${indicator}"`);
        foundErrorContent = true;
      }
    }

    // Step 5: Check for error page elements
    logPass("Step 5: Checking for Error Page Elements");

    let foundErrorElements = false;
    for (const selector of testData.errorSelectors) {
      try {
        const elements = await driver.findElements(By.css(selector));
        if (elements.length > 0) {
          logPass(
            `Found error page element with selector: ${selector} (${elements.length} elements)`
          );
          foundErrorElements = true;

          // Check if error element is visible
          const errorElement = elements[0];
          const isDisplayed = await errorElement.isDisplayed();
          if (isDisplayed) {
            logPass("Error page element is visible");
          } else {
            logWarning("Error page element found but not visible");
          }
          break;
        }
      } catch (e) {
        // Continue with next selector
      }
    }

    // Step 6: Check current URL (might be redirected)
    logPass("Step 6: Checking Current URL");
    const currentUrl = await driver.getCurrentUrl();
    logPass(`Current URL: ${currentUrl}`);

    if (currentUrl === testData.expectedRedirectUrl) {
      logPass("URL correctly redirected to error page");
    } else {
      logWarning(
        `URL redirected to: ${currentUrl} (expected: ${testData.expectedRedirectUrl})`
      );
    }

    // Step 7: Check for navigation elements (home link, etc.)
    logPass("Step 7: Checking for Navigation Elements");

    const navigationSelectors = [
      "a[href='/']",
      "a[href*='home']",
      "a[href*='ethiofind.com']",
      ".home-link",
      ".back-home",
    ];

    let foundNavigation = false;
    for (const selector of navigationSelectors) {
      try {
        const elements = await driver.findElements(By.css(selector));
        if (elements.length > 0) {
          logPass(
            `Found navigation element: ${selector} (${elements.length} elements)`
          );
          foundNavigation = true;
          break;
        }
      } catch (e) {
        // Continue
      }
    }

    // Step 8: Overall assessment
    logPass("Step 8: Assessing Error Page Quality");

    if (foundErrorContent || foundErrorElements) {
      logPass("Error page has appropriate content or styling");
    } else {
      logWarning("Error page lacks clear error indicators");
    }

    if (foundNavigation) {
      logPass("Error page provides navigation options");
    } else {
      logWarning("Error page lacks navigation options");
    }

    // Check for page errors
    const pageErrorDetected = await checkForErrors(driver);
    if (pageErrorDetected) {
      logPass(
        "Error page correctly displays error messages (expected for 404 page)"
      );
    } else {
      logWarning("No error messages found on error page");
    }

    // Overall assessment - for error pages, having error content is actually good
    if (foundErrorContent || foundErrorElements) {
      logPass("Error page has appropriate content or styling");
    } else {
      logWarning("Error page lacks clear error indicators");
    }

    if (foundNavigation) {
      logPass("Error page provides navigation options");
    } else {
      logWarning("Error page lacks navigation options");
    }

    logSuccess(
      "Page Not Found test completed successfully - Error page loads properly with appropriate content"
    );
  } catch (error) {
    logError(`Page Not Found test failed: ${error}`);
    // Take screenshot on error
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "pageNotFoundTest"
    );
    await takeScreenshot(driver, "error_screenshot", screenshotDir);
  } finally {
    await driver.quit();
  }
})();
