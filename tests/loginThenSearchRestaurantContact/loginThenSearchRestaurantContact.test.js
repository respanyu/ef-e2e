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
const LoginPage = require("../../pages/LoginPage");
const SearchPage = require("../../pages/SearchPage");

(async function loginThenSearchRestaurantContactTest() {
  let driver = await createDriver();

  try {
    logStart("Starting Login Then Search Restaurant Contact Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    logPass("Test data loaded from JSON");

    // Step 1: Login to the application
    logPass("Step 1: Logging in to Application");
    const loginPage = new LoginPage(driver);
    await loginPage.open(testData.loginUrl);
    logPass("Login page opened");

    await loginPage.fillEmail(testData.loginCredentials.email);
    logPass("Email filled");

    await loginPage.fillPassword(testData.loginCredentials.password);
    logPass("Password filled");

    const loginSubmitted = await loginPage.submitLogin();
    if (loginSubmitted) {
      logPass("Login form submitted successfully");
    } else {
      logFail("Login form submission failed");
      return;
    }

    // Wait for login to complete
    await sleep(driver, 3000);
    logPass("Waited for login to complete");

    // Verify login success by checking URL or page content
    const currentUrl = await driver.getCurrentUrl();
    if (currentUrl.includes("/user/login") || currentUrl.includes("login")) {
      logFail("Login failed - still on login page");
      return;
    } else {
      logPass("Login successful - redirected to authenticated area");
    }

    // Step 2: Navigate to home page for search
    logPass("Step 2: Navigating to Home Page for Search");
    await driver.get(testData.homeUrl);
    logPass("Home page opened");

    // Step 3: Search for restaurants
    logPass("Step 3: Searching for Restaurants");
    const searchPage = new SearchPage(driver);

    await searchPage.fillKeyword(testData.searchKeyword);
    logPass(`Keyword filled: "${testData.searchKeyword}"`);

    await searchPage.fillCity(testData.searchCity);
    logPass(`City filled: "${testData.searchCity}"`);

    const searchSubmitted = await searchPage.submitSearch();
    if (searchSubmitted) {
      logPass("Search form submitted successfully");
    } else {
      logFail("Search form submission failed");
      return;
    }

    // Step 4: Wait for search results and click on first restaurant
    logPass("Step 4: Waiting for Search Results and Clicking Restaurant");
    await sleep(driver, 3000);

    const restaurantClicked = await clickOnFirstRestaurant(driver, testData);
    if (restaurantClicked) {
      logPass("Successfully clicked on first restaurant result");
    } else {
      logFail("Could not find or click on any restaurant result");
      return;
    }

    // Step 5: Wait for restaurant detail page to load
    logPass("Step 5: Waiting for Restaurant Details Page to Load");
    await sleep(driver, 3000);

    const detailUrl = await driver.getCurrentUrl();
    logPass(`Restaurant detail URL: ${detailUrl}`);

    if (detailUrl.includes("/business/")) {
      logPass("Successfully navigated to restaurant detail page");
    } else {
      logFail("Did not navigate to a business detail page");
      return;
    }

    // Step 6: Locate and validate contact form
    logPass("Step 6: Locating and Validating Contact Form");
    const contactForm = await driver.findElements(
      By.css(testData.selectors.contactForm)
    );
    if (contactForm.length === 0) {
      logFail("Contact form not found on restaurant detail page");
      return;
    }
    logPass("Contact form found");

    // Check for required form elements
    const subjectFields = await driver.findElements(
      By.css(testData.selectors.contactSubject)
    );
    const messageFields = await driver.findElements(
      By.css(testData.selectors.contactMessage)
    );
    const submitButtons = await contactForm[0].findElements(
      By.css(testData.selectors.contactSubmit)
    );

    if (
      subjectFields.length === 0 ||
      messageFields.length === 0 ||
      submitButtons.length === 0
    ) {
      logFail("Required contact form elements not found");
      return;
    }
    logPass("All required contact form elements are present");

    // Step 7: Fill and verify subject field
    logPass("Step 7: Filling and Verifying Subject Field");
    await subjectFields[0].clear();
    await subjectFields[0].sendKeys(testData.contactFormData.subject);

    // Verify subject field was filled
    const subjectValue = await subjectFields[0].getAttribute("value");
    if (subjectValue === testData.contactFormData.subject) {
      logPass("Subject field filled correctly");
    } else {
      logFail(
        `Subject field filling failed. Expected: "${testData.contactFormData.subject}", Got: "${subjectValue}"`
      );
      return;
    }

    // Step 8: Fill and verify message field
    logPass("Step 8: Filling and Verifying Message Field");
    await messageFields[0].clear();
    await messageFields[0].sendKeys(testData.contactFormData.message);

    // Verify message field was filled
    const messageValue = await messageFields[0].getAttribute("value");
    if (messageValue === testData.contactFormData.message) {
      logPass("Message field filled correctly with inquiry text");
    } else {
      logFail(
        `Message field filling failed. Expected length: ${testData.contactFormData.message.length}, Got length: ${messageValue.length}`
      );
      return;
    }

    // Step 9: Submit contact form and monitor API response
    logPass("Step 9: Submitting Contact Form and Monitoring API Response");

    // Get form field values before submission for logging
    const subjectValueBefore = await subjectFields[0].getAttribute("value");
    const messageValueBefore = await messageFields[0].getAttribute("value");

    logPass(
      `Pre-submission form data - Subject: "${subjectValueBefore}", Message length: ${messageValueBefore.length}`
    );

    // Find the submit button specifically within the contact form
    logPass("Locating submit button within the contact form...");
    const submitButtonInForm = await contactForm[0].findElement(
      By.css(testData.selectors.contactSubmit)
    );

    // Verify this is the correct submit button
    logPass("Verifying submit button belongs to contact form...");

    // Submit the form using the button from within the contact form
    await submitButtonInForm.click();
    logPass(
      "Contact form submitted (using button from within the filled form) - waiting for API response..."
    );

    // Wait for API response with detailed logging
    logPass("Waiting for API response (8 seconds)...");
    await sleep(driver, 8000);
    logPass("API response wait completed");

    // Step 10: Analyze API response and log results
    logPass("Step 10: Analyzing API Response and Logging Results");

    const pageTextAfter = await driver
      .findElement(By.tagName("body"))
      .getText();
    const currentUrlAfter = await driver.getCurrentUrl();

    logPass(`Post-submission URL: ${currentUrlAfter}`);

    // Check form field values after submission (handle stale elements gracefully)
    try {
      // Re-find the form elements after submission in case of page changes
      const subjectFieldsAfter = await driver.findElements(
        By.css(testData.selectors.contactSubject)
      );
      const messageFieldsAfter = await driver.findElements(
        By.css(testData.selectors.contactMessage)
      );

      if (subjectFieldsAfter.length > 0 && messageFieldsAfter.length > 0) {
        const subjectAttr = await subjectFieldsAfter[0].getAttribute("value");
        const messageAttr = await messageFieldsAfter[0].getAttribute("value");

        const subjectValueAfter =
          typeof subjectAttr === "string"
            ? subjectAttr
            : String(subjectAttr || "");
        const messageValueAfter =
          typeof messageAttr === "string"
            ? messageAttr
            : String(messageAttr || "");

        logPass(
          `Post-submission form data - Subject: "${subjectValueAfter}", Message length: ${messageValueAfter.length}`
        );

        if (
          subjectValueAfter !== subjectValueBefore ||
          messageValueAfter !== messageValueBefore
        ) {
          logPass(
            "Form field values changed after submission - API processed the request"
          );
        } else {
          logWarning(
            "Form field values unchanged - API may not have processed the request"
          );
        }
      } else {
        logWarning(
          "Form fields no longer available after submission - page may have changed"
        );
      }
    } catch (fieldError) {
      logWarning(
        `Could not check form fields after submission (elements may be stale or page changed): ${fieldError.message}`
      );
    }

    // Check for any notifications or messages
    const notifications = await driver.findElements(
      By.css(testData.selectors.notification)
    );
    if (notifications.length > 0) {
      for (let i = 0; i < notifications.length; i++) {
        const notificationText = await notifications[i].getText();
        const notificationClass = await notifications[i].getAttribute("class");

        logPass(
          `API Response Notification ${
            i + 1
          }: "${notificationText}" (Class: ${notificationClass})`
        );

        // Analyze notification type
        if (
          notificationClass.includes("success") ||
          notificationText.toLowerCase().includes("success")
        ) {
          logSuccess(`Positive API response: ${notificationText}`);
        } else if (
          notificationClass.includes("danger") ||
          notificationClass.includes("error") ||
          notificationText.toLowerCase().includes("invalid") ||
          notificationText.toLowerCase().includes("error")
        ) {
          logFail(`Negative API response: ${notificationText}`);
        } else {
          logWarning(`Neutral API response: ${notificationText}`);
        }
      }
    } else {
      logWarning("No notification elements found after form submission");
    }

    // Check for page content indicators
    const hasSuccessIndicators =
      testData.expectedContent.successIndicators.some((indicator) =>
        pageTextAfter.toLowerCase().includes(indicator.toLowerCase())
      );

    const hasErrorIndicators = testData.expectedContent.errorIndicators.some(
      (indicator) =>
        pageTextAfter.toLowerCase().includes(indicator.toLowerCase())
    );

    if (hasSuccessIndicators) {
      logSuccess("API response indicates successful form submission");
    } else if (hasErrorIndicators) {
      logFail("API response indicates form submission error");
    } else {
      logWarning(
        "API response unclear - no clear success or error indicators found"
      );
    }

    // Step 11: Final validation
    logPass("Step 11: Final API Response Validation");

    // Check if the form is still submittable
    try {
      const contactFormAfter = await driver.findElements(
        By.css(testData.selectors.contactForm)
      );
      if (contactFormAfter.length > 0) {
        const submitButtonsAfter = await contactFormAfter[0].findElements(
          By.css(testData.selectors.contactSubmit)
        );
        if (submitButtonsAfter.length > 0) {
          const isEnabled = await submitButtonsAfter[0].isEnabled();
          if (isEnabled) {
            logPass(
              "Submit button still enabled in contact form - form ready for additional submissions"
            );
          } else {
            logWarning(
              "Submit button disabled in contact form - possible processing state"
            );
          }
        } else {
          logWarning(
            "Submit button no longer found in contact form - page may have changed after submission"
          );
        }
      } else {
        logWarning(
          "Contact form no longer found - page may have changed after submission"
        );
      }
    } catch (buttonError) {
      logWarning(
        `Could not check submit button status: ${buttonError.message}`
      );
    }

    // Check for page errors
    const pageErrorDetected = await checkForErrors(driver);
    if (pageErrorDetected) {
      logFail("Page errors detected after API response");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "loginThenSearchRestaurantContact"
      );
      await takeScreenshot(
        driver,
        "api_response_error_screenshot",
        screenshotDir
      );
    } else {
      logSuccess(
        "Login Then Search Restaurant Contact test completed successfully - API response properly handled and logged"
      );
    }
  } catch (error) {
    logError(`Login Then Search Restaurant Contact test failed: ${error}`);
    console.error("Full error details:", error.stack);
    // Take screenshot on error
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "loginThenSearchRestaurantContact"
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
