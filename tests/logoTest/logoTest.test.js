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

(async function logoTest() {
  let driver = await createDriver();

  try {
    logStart("Starting Logo Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    logPass("Test data loaded from JSON");

    // Step 1: Open homepage
    logPass("Step 1: Opening Homepage");
    await driver.get(testData.url);
    await driver.manage().window().maximize();
    logPass("Homepage opened and maximized");

    // Step 2: Wait for page to load
    await sleep(driver, 3000);
    logPass("Waited for page to load");

    // Step 3: Check for logo element
    logPass("Step 3: Checking for Logo Element");

    const logoElements = await driver.findElements(
      By.css(testData.logoSelector)
    );
    if (logoElements.length === 0) {
      logFail("Logo image element not found on the page");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "logoTest"
      );
      await takeScreenshot(driver, "logo_not_found_screenshot", screenshotDir);
      return;
    }

    logPass(`Logo image element found (${logoElements.length} element(s))`);

    // Step 4: Check if logo image is loaded
    logPass("Step 4: Checking if Logo Image is Loaded");

    const logoElement = logoElements[0];

    // Check if image is displayed
    const isDisplayed = await logoElement.isDisplayed();
    if (!isDisplayed) {
      logFail("Logo image is not displayed (hidden or not visible)");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "logoTest"
      );
      await takeScreenshot(
        driver,
        "logo_not_displayed_screenshot",
        screenshotDir
      );
      return;
    }

    logPass("Logo image is displayed");

    // Check image source
    const imageSrc = await logoElement.getAttribute("src");
    logPass(`Logo image source: ${imageSrc}`);

    if (imageSrc !== testData.logoSrc) {
      logWarning(
        `Logo source mismatch. Expected: ${testData.logoSrc}, Found: ${imageSrc}`
      );
    }

    // Check if image is actually loaded (not broken) using JavaScript
    const isImageLoaded = await driver.executeScript(
      `
      const img = arguments[0];
      return img.complete && img.naturalWidth > 0 && img.naturalHeight > 0;
    `,
      logoElement
    );

    if (!isImageLoaded) {
      logFail("Logo image failed to load (broken image or network error)");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "logoTest"
      );
      await takeScreenshot(driver, "logo_broken_screenshot", screenshotDir);
      return;
    }

    logPass("Logo image loaded successfully");

    // Step 5: Check for any page errors
    const pageErrorDetected = await checkForErrors(driver);
    if (pageErrorDetected) {
      logFail("Page has errors that may affect logo loading");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "logoTest"
      );
      await takeScreenshot(
        driver,
        "page_error_with_logo_screenshot",
        screenshotDir
      );
    } else {
      logSuccess(
        "Logo test completed successfully - Logo is loaded and displayed properly"
      );
    }
  } catch (error) {
    logError(`Logo test failed: ${error}`);
    // Take screenshot on error
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "logoTest"
    );
    await takeScreenshot(driver, "error_screenshot", screenshotDir);
  } finally {
    await driver.quit();
  }
})();
