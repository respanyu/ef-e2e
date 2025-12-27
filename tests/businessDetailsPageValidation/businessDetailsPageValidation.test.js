const fs = require("fs");
const path = require("path");
const { By, until } = require("selenium-webdriver");
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

(async function businessDetailsPageValidationTest() {
  let driver = await createDriver();

  try {
    logStart("Starting Business Details Page Validation Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    logPass("Test data loaded from JSON");

    // Step 1: Navigate to home page
    logPass("Step 1: Navigating to Home Page");
    await driver.get(testData.homeUrl);
    await driver.manage().window().maximize();
    logPass("Home page opened");

    // Step 2: Wait for business listings to load
    logPass("Step 2: Waiting for Business Listings to Load");
    await sleep(driver, 3000);

    // Find business listings
    const businessListings = await driver.findElements(
      By.css(testData.selectors.businessListings)
    );
    if (businessListings.length === 0) {
      logFail("No business listings found on home page");
      return;
    }
    logPass(`Found ${businessListings.length} business listings on home page`);

    // Step 3: Click on the first business listing
    logPass("Step 3: Clicking on First Business Listing");
    const firstBusiness = businessListings[0];
    await firstBusiness.click();
    logPass("Clicked on first business listing");

    // Step 4: Wait for business details page to load
    logPass("Step 4: Waiting for Business Details Page to Load");
    await sleep(driver, 5000);
    logPass("Waited for business details page to load");

    // Verify we're on a business details page
    const currentUrl = await driver.getCurrentUrl();
    if (!currentUrl.includes("/business/")) {
      logFail(`Not on business details page. Current URL: ${currentUrl}`);
      return;
    }
    logPass(`Successfully navigated to business details page: ${currentUrl}`);

    // Step 5: Check main content structure
    logPass("Step 5: Validating Main Content Structure");
    const mainContent = await driver.findElements(
      By.css(testData.selectors.mainContent)
    );
    if (mainContent.length > 0) {
      logPass("Main content container (.column.is-10.main-content) is present");
    } else {
      logFail("Main content container not found");
    }

    // Step 6: Check business title
    logPass("Step 6: Validating Business Title");
    const businessTitle = await driver.findElements(
      By.css(testData.selectors.businessTitle)
    );
    if (businessTitle.length > 0) {
      const titleText = await businessTitle[0].getText();
      logPass(`Business title found: "${titleText}"`);
    } else {
      logFail("Business title not found");
    }

    // Step 7: Check breadcrumb navigation
    logPass("Step 7: Validating Breadcrumb Navigation");
    const breadcrumb = await driver.findElements(
      By.css(testData.selectors.breadcrumb)
    );
    if (breadcrumb.length > 0) {
      logPass("Breadcrumb navigation is present");
    } else {
      logFail("Breadcrumb navigation not found");
    }

    // Step 8: Check business details (City, Email, Phone, Address)
    logPass("Step 8: Validating Business Details");

    // Check City
    const pageText = await driver.findElement(By.tagName("body")).getText();
    if (pageText.includes("City:")) {
      logPass("City information is present");
    } else {
      logWarning("City information not found");
    }

    // Check Email
    if (pageText.includes("Email:")) {
      logPass("Email information is present");
    } else {
      logWarning("Email information not found");
    }

    // Check Phone
    if (pageText.includes("Phone:")) {
      logPass("Phone information is present");
    } else {
      logWarning("Phone information not found");
    }

    // Check Address
    if (pageText.includes("Address:")) {
      logPass("Address information is present");
    } else {
      logWarning("Address information not found");
    }

    // Step 9: Check Products and Services section
    logPass("Step 9: Validating Products and Services Section");
    if (pageText.includes("Products and Services:")) {
      logPass("Products and Services section is present");

      // Check for product tags
      const productTags = await driver.findElements(
        By.css(testData.selectors.productTags)
      );
      if (productTags.length >= testData.expectedContent.minProductTags) {
        logPass(
          `${productTags.length} product/service tags found (minimum required: ${testData.expectedContent.minProductTags})`
        );
      } else {
        logWarning(
          `Only ${productTags.length} product tags found (minimum required: ${testData.expectedContent.minProductTags})`
        );
      }
    } else {
      logFail("Products and Services section not found");
    }

    // Step 10: Check website link
    logPass("Step 10: Validating Website Link");
    if (pageText.includes("Website:")) {
      logPass("Website section is present");

      const websiteLinks = await driver.findElements(
        By.css(testData.selectors.websiteLink)
      );
      if (websiteLinks.length > 0) {
        logPass("Website link is present");
      } else {
        logWarning("Website link element not found");
      }
    } else {
      logWarning("Website section not found");
    }

    // Step 11: Check description
    logPass("Step 11: Validating Description Section");
    if (pageText.includes("Description:")) {
      logPass("Description section is present");
    } else {
      logFail("Description section not found");
    }

    // Step 12: Check claim business link
    logPass("Step 12: Validating Claim Business Link");
    const claimLinks = await driver.findElements(
      By.css(testData.selectors.claimBusiness)
    );
    if (claimLinks.length > 0) {
      logPass("Claim business link is present");
    } else {
      logWarning("Claim business link not found");
    }

    // Step 13: Check business logo
    logPass("Step 13: Validating Business Logo");
    const logoImages = await driver.findElements(
      By.css(testData.selectors.businessLogo)
    );
    if (logoImages.length > 0) {
      logPass("Business logo image is present");
    } else {
      logWarning("Business logo not found");
    }

    // Step 14: Check contact form
    logPass("Step 14: Validating Contact Form");
    const contactForms = await driver.findElements(
      By.css(testData.selectors.contactForm)
    );
    if (contactForms.length > 0) {
      logPass("Contact form is present");

      // Check form elements
      const subjectField = await driver.findElements(
        By.css(testData.selectors.contactSubject)
      );
      const messageField = await driver.findElements(
        By.css(testData.selectors.contactMessage)
      );
      const submitButton = await driver.findElements(
        By.css(testData.selectors.contactSubmit)
      );

      if (subjectField.length > 0) logPass("Subject field is present");
      if (messageField.length > 0) logPass("Message field is present");
      if (submitButton.length > 0) logPass("Submit button is present");
    } else {
      logFail("Contact form not found");
    }

    // Step 15: Check similar businesses section
    logPass("Step 15: Validating Similar Businesses Section");
    if (pageText.includes("Similar Businesses")) {
      logPass("Similar businesses section is present");

      const similarBusinessCards = await driver.findElements(
        By.css(testData.selectors.similarBusinessCards)
      );
      if (
        similarBusinessCards.length >=
        testData.expectedContent.minSimilarBusinesses
      ) {
        logPass(
          `${similarBusinessCards.length} similar businesses found (minimum required: ${testData.expectedContent.minSimilarBusinesses})`
        );
      } else {
        logWarning(
          `Only ${similarBusinessCards.length} similar businesses found (minimum required: ${testData.expectedContent.minSimilarBusinesses})`
        );
      }
    } else {
      logFail("Similar businesses section not found");
    }

    // Step 16: Check for page errors
    logPass("Step 16: Checking for Page Errors");
    const pageErrorDetected = await checkForErrors(driver);
    if (pageErrorDetected) {
      logFail("Page errors detected on business details page");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "businessDetailsPageValidation"
      );
      await takeScreenshot(driver, "page_errors_screenshot", screenshotDir);
    } else {
      logSuccess(
        "Business Details Page Validation test completed successfully - All page elements loaded properly after clicking business from home page"
      );
    }
  } catch (error) {
    logError(`Business Details Page Validation test failed: ${error}`);
    // Take screenshot on error
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "businessDetailsPageValidation"
    );
    await takeScreenshot(driver, "error_screenshot", screenshotDir);
  } finally {
    await driver.quit();
  }
})();
