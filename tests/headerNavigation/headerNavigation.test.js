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

(async function headerNavigationTest() {
  let driver = await createDriver();

  try {
    logStart("Starting Header Navigation Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    logPass("Test data loaded from JSON");

    // Step 1: Navigate to home page
    logPass("Step 1: Navigating to Home Page");
    await driver.get(testData.url);
    await driver.manage().window().maximize();
    logPass("Home page opened successfully");

    // Step 2: Wait for page to load
    logPass("Step 2: Waiting for Page to Load");
    await sleep(driver, 3000);

    // Step 3: Verify header is present
    logPass("Step 3: Verifying Header Presence");
    const headerElements = await driver.findElements(
      By.css(testData.selectors.header)
    );
    if (headerElements.length === 0) {
      logFail("No header elements found on the page");
      return;
    }
    logPass("Header elements found");

    // Step 4: Find all navigation links in header
    logPass("Step 4: Finding All Header Navigation Links");
    const navLinks = await driver.findElements(
      By.css(testData.selectors.navLinks)
    );

    if (navLinks.length === 0) {
      logFail("No navigation links found in header");
      return;
    }

    logPass(`Found ${navLinks.length} navigation links in header`);

    // Step 5: Test each navigation link (re-finding links each time to avoid stale elements)
    logPass("Step 5: Testing Each Navigation Link");
    const navigationResults = [];
    let linkIndex = 0;
    const maxLinksToTest = 10; // Limit to avoid infinite loops

    while (linkIndex < maxLinksToTest) {
      try {
        // Re-find navigation links on each iteration to avoid stale elements
        const currentNavLinks = await driver.findElements(
          By.css(testData.selectors.navLinks)
        );

        if (linkIndex >= currentNavLinks.length) {
          logPass("All available navigation links have been tested");
          break;
        }

        // Get link details
        const linkElement = currentNavLinks[linkIndex];
        const linkText = await linkElement.getText();
        const linkHref = await linkElement.getAttribute("href");

        linkIndex++;

        // Skip links that are not actual navigation
        if (
          !linkHref ||
          testData.excludePatterns.some((pattern) => linkHref.includes(pattern))
        ) {
          logPass(
            `Skipping non-navigation link ${linkIndex}: "${linkText}" (${linkHref})`
          );
          continue;
        }

        // Skip if href is null or empty
        if (!linkHref || linkHref.trim() === "") {
          logPass(`Skipping link with empty href ${linkIndex}: "${linkText}"`);
          continue;
        }

        logPass(
          `Testing navigation link ${linkIndex}: "${linkText}" -> ${linkHref}`
        );

        // Store current URL to return to it
        const currentUrl = await driver.getCurrentUrl();

        // Click the link
        await linkElement.click();
        logPass(`Clicked on link: "${linkText}"`);

        // Wait for navigation
        await sleep(driver, 2000);

        // Check new URL
        const newUrl = await driver.getCurrentUrl();
        logPass(`Navigated to: ${newUrl}`);

        // Verify navigation was successful
        let navigationSuccessful = false;
        let expectedDestination = null;

        // Check against expected navigations
        for (const [key, expected] of Object.entries(
          testData.expectedNavigations
        )) {
          if (
            linkText.toLowerCase().includes(expected.text.toLowerCase()) ||
            linkHref.includes(expected.contains)
          ) {
            expectedDestination = expected;
            if (newUrl.includes(expected.contains) || newUrl === expected.url) {
              navigationSuccessful = true;
              logPass(`✅ Navigation successful: "${linkText}" -> ${newUrl}`);
            } else {
              logWarning(
                `⚠️  Navigation to unexpected URL: expected ${expected.url}, got ${newUrl}`
              );
            }
            break;
          }
        }

        if (!expectedDestination) {
          // For unexpected links, just check if URL changed
          if (newUrl !== currentUrl) {
            navigationSuccessful = true;
            logPass(
              `✅ Navigation successful (unexpected link): "${linkText}" -> ${newUrl}`
            );
          } else {
            logWarning(
              `⚠️  Link did not navigate: "${linkText}" stayed at ${currentUrl}`
            );
          }
        }

        // Store result
        navigationResults.push({
          linkText: linkText,
          linkHref: linkHref,
          expectedUrl: expectedDestination ? expectedDestination.url : null,
          actualUrl: newUrl,
          successful: navigationSuccessful,
        });

        // Return to home page for next test (unless we're testing home link)
        if (
          newUrl !== testData.url &&
          !linkText.toLowerCase().includes("home")
        ) {
          await driver.get(testData.url);
          await sleep(driver, 2000);
          logPass("Returned to home page for next navigation test");
        }
      } catch (linkError) {
        logError(
          `Error testing navigation link ${linkIndex}: ${linkError.message}`
        );
        navigationResults.push({
          linkText: `Link ${linkIndex}`,
          error: linkError.message,
          successful: false,
        });
        linkIndex++;
      }
    }

    // Step 6: Analyze navigation results
    logPass("Step 6: Analyzing Navigation Results");
    const successfulNavigations = navigationResults.filter(
      (result) => result.successful
    ).length;
    const totalNavigations = navigationResults.length;

    logPass(
      `Navigation Results: ${successfulNavigations}/${totalNavigations} links navigated successfully`
    );

    // Log detailed results
    for (const result of navigationResults) {
      if (result.successful) {
        logSuccess(`✅ "${result.linkText}" -> ${result.actualUrl}`);
      } else if (result.error) {
        logError(`❌ "${result.linkText}" - Error: ${result.error}`);
      } else {
        logWarning(
          `⚠️  "${result.linkText}" - Expected: ${result.expectedUrl}, Got: ${result.actualUrl}`
        );
      }
    }

    // Step 7: Check for header-specific elements
    logPass("Step 7: Checking for Header-Specific Elements");
    try {
      // Check for logo
      const logoElements = await driver.findElements(
        By.css(testData.selectors.logo)
      );
      if (logoElements.length > 0) {
        logPass("Logo element found in header");
      } else {
        logWarning("No logo element found in header");
      }

      // Check for menu items
      const menuItems = await driver.findElements(
        By.css(testData.selectors.menuItems)
      );
      logPass(`Found ${menuItems.length} menu items in header`);

      // Check for dropdowns
      const dropdowns = await driver.findElements(
        By.css(testData.selectors.dropdowns)
      );
      if (dropdowns.length > 0) {
        logPass(`Found ${dropdowns.length} dropdown menus in header`);
      }
    } catch (headerError) {
      logWarning(`Could not check header elements: ${headerError.message}`);
    }

    // Step 8: Final validation and error checking
    logPass("Step 8: Final Validation and Error Checking");
    const pageErrorDetected = await checkForErrors(driver);
    if (pageErrorDetected) {
      logFail("Page errors detected during navigation testing");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "headerNavigation"
      );
      await takeScreenshot(driver, "error_screenshot", screenshotDir);
    } else {
      logSuccess(
        `Header Navigation test completed - ${successfulNavigations}/${totalNavigations} links tested successfully`
      );
    }
  } catch (error) {
    logError(`Header Navigation test failed: ${error}`);
    // Take screenshot on error
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "headerNavigation"
    );
    await takeScreenshot(driver, "error_screenshot", screenshotDir);
  } finally {
    await driver.quit();
  }
})();
