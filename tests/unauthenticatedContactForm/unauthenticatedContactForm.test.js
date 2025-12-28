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
} = require("../../utils/logger");
const { checkForErrors } = require("../../utils/errors");
const { takeScreenshot } = require("../../utils/screenshot");

(async function unauthenticatedContactFormTest() {
  let driver = await createDriver();

  try {
    logStart("Starting Unauthenticated Contact Form Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    logPass("Test data loaded from JSON");

    // Step 1: Navigate to home page (without logging in)
    logPass("Step 1: Navigating to Home Page (Unauthenticated)");
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
    // Try to find clickable links first
    const businessLinks = await driver.findElements(
      By.css(testData.selectors.businessLinks)
    );

    if (businessLinks.length > 0) {
      await businessLinks[0].click();
      logPass("Clicked on first business link");
    } else {
      // If no links found, try clicking on the business card itself
      await businessListings[0].click();
      logPass("Clicked on first business card");
    }

    // Step 4: Wait for business details page to load
    logPass("Step 4: Waiting for Business Details Page to Load");
    await driver.wait(
      until.urlContains("/business/"),
      testData.timeout,
      "Business details page did not load within timeout"
    );
    logPass("Business details page loaded successfully");

    // Take screenshot of business details page
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "unauthenticatedContactForm"
    );
    await takeScreenshot(driver, "business_details_page", screenshotDir);

    // Step 5: Check for contact button or form
    logPass("Step 5: Checking for Contact Button or Form");
    // Try multiple ways to find contact button
    let contactButtons = await driver.findElements(
      By.css(testData.selectors.contactButton)
    );

    // Also try XPath for text-based matching
    if (contactButtons.length === 0) {
      try {
        contactButtons = await driver.findElements(
          By.xpath(
            "//button[contains(text(), 'Contact')] | //a[contains(text(), 'Contact')] | //button[contains(@class, 'contact')] | //a[contains(@class, 'contact')]"
          )
        );
      } catch (error) {
        logWarning(`XPath search failed: ${error.message}`);
      }
    }

    if (contactButtons.length > 0) {
      logPass("Contact button found - clicking to open contact form");
      await contactButtons[0].click();
      await sleep(driver, 2000); // Wait for form to appear
    } else {
      logPass("No contact button found - checking if form is directly visible");
    }

    // Now check for contact form
    const contactForms = await driver.findElements(
      By.css(testData.selectors.contactForm)
    );

    if (contactForms.length === 0) {
      logWarning("No contact form found on business details page");
      logSuccess(
        "Test completed - no contact form present for unauthenticated users"
      );
      return;
    }

    logPass("Contact form found on business details page");

    // Step 6: Check subject field
    logPass("Step 6: Checking Subject Field Status");
    const subjectFields = await driver.findElements(
      By.css(testData.selectors.contactSubject)
    );

    logPass(`Found ${subjectFields.length} subject field(s)`);

    if (subjectFields.length === 0) {
      logWarning("Subject field not found in contact form");
    } else {
      const subjectField = subjectFields[0];
      const isSubjectDisabled = await subjectField.getAttribute("disabled");
      const isSubjectReadonly = await subjectField.getAttribute("readonly");
      const subjectPlaceholder = await subjectField.getAttribute("placeholder");

      logPass(
        `Subject field: disabled="${isSubjectDisabled}", readonly="${isSubjectReadonly}", placeholder="${subjectPlaceholder}"`
      );

      if (isSubjectDisabled || isSubjectReadonly) {
        logPass(
          "Subject field is properly disabled/readonly for unauthenticated user"
        );
      } else {
        logFail(
          "Subject field is enabled for unauthenticated user - SECURITY ISSUE"
        );
      }
    }

    // Step 7: Check message/inquiry field
    logPass("Step 7: Checking Message/Inquiry Field Status");
    const messageFields = await driver.findElements(
      By.css(testData.selectors.contactMessage)
    );

    logPass(`Found ${messageFields.length} message field(s)`);

    if (messageFields.length === 0) {
      logWarning("Message field not found in contact form");
    } else {
      const messageField = messageFields[0];
      const isMessageDisabled = await messageField.getAttribute("disabled");
      const isMessageReadonly = await messageField.getAttribute("readonly");
      const messagePlaceholder = await messageField.getAttribute("placeholder");

      logPass(
        `Message field: disabled="${isMessageDisabled}", readonly="${isMessageReadonly}", placeholder="${messagePlaceholder}"`
      );

      if (isMessageDisabled || isMessageReadonly) {
        logPass(
          "Message field is properly disabled/readonly for unauthenticated user"
        );
      } else {
        logFail(
          "Message field is enabled for unauthenticated user - SECURITY ISSUE"
        );
      }
    }

    // Step 8: Check submit button
    logPass("Step 8: Checking Submit Button Status");
    const submitButtons = await driver.findElements(
      By.css(testData.selectors.contactSubmit)
    );

    logPass(`Found ${submitButtons.length} submit button(s)`);

    if (submitButtons.length === 0) {
      logWarning("Submit button not found in contact form");
    } else {
      // Check all submit buttons found
      let allButtonsDisabled = true;

      for (let i = 0; i < submitButtons.length; i++) {
        const submitButton = submitButtons[i];
        const buttonText = await submitButton.getText();
        const isSubmitDisabled = await submitButton.getAttribute("disabled");
        const isSubmitHidden = await submitButton.getAttribute("style");
        const buttonClass = await submitButton.getAttribute("class");

        logPass(
          `Submit button ${
            i + 1
          }: text="${buttonText}", disabled="${isSubmitDisabled}", class="${buttonClass}", style="${isSubmitHidden}"`
        );

        if (
          !isSubmitDisabled &&
          !(isSubmitHidden && isSubmitHidden.includes("display: none"))
        ) {
          allButtonsDisabled = false;
          logWarning(`Submit button ${i + 1} is enabled`);
        }
      }

      if (allButtonsDisabled) {
        logPass(
          "All submit buttons are properly disabled/hidden for unauthenticated user"
        );
      } else {
        logFail(
          "At least one submit button is enabled for unauthenticated user - SECURITY ISSUE"
        );
      }
    }

    // Step 9: Take final screenshot
    await takeScreenshot(
      driver,
      "contact_form_validation_complete",
      screenshotDir
    );

    // Step 10: Check for errors
    const errorDetected = await checkForErrors(driver);
    if (errorDetected) {
      logFail("Errors detected during unauthenticated contact form test");
    } else {
      logPass("No errors detected during unauthenticated contact form test");
    }

    logSuccess("Unauthenticated Contact Form Test completed successfully");
  } catch (error) {
    logError(`Unauthenticated Contact Form Test failed: ${error.message}`);
    // Take error screenshot
    try {
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "unauthenticatedContactForm"
      );
      await takeScreenshot(
        driver,
        "unauthenticated_contact_form_error",
        screenshotDir
      );
    } catch (screenshotError) {
      logError(`Failed to take error screenshot: ${screenshotError.message}`);
    }
  } finally {
    await driver.quit();
  }
})();
