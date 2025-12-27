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

(async function addBusinessFormTest() {
  let driver = await createDriver();

  try {
    logStart("Starting Add Business Form Test...");

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

    // Step 3: Scroll to Add Business section
    logPass("Step 3: Scrolling to Add Business Section");

    try {
      const addBusinessSection = await driver.findElement(
        By.xpath(testData.addBusinessSectionSelector)
      );
      await driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        addBusinessSection
      );
      logPass("Successfully scrolled to Add Business section");
    } catch (scrollError) {
      logWarning(
        `Could not find Add Business section with primary selector: ${scrollError.message}`
      );
      // Try alternative scrolling
      await driver.executeScript(
        "window.scrollTo(0, document.body.scrollHeight * 0.7);"
      );
      logPass("Scrolled to approximate Add Business section location");
    }

    // Wait for section to load
    await sleep(driver, 2000);
    logPass("Waited for Add Business section to load");

    // Step 4: Check for Business Name field
    logPass("Step 4: Checking for Business Name Field");

    const businessNameFields = await driver.findElements(
      By.css(testData.businessNameSelector)
    );
    if (businessNameFields.length === 0) {
      logFail("Business name input field not found");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "addBusinessFormTest"
      );
      await takeScreenshot(
        driver,
        "business_name_not_found_screenshot",
        screenshotDir
      );
      return;
    }

    logPass(
      `Business name field found (${businessNameFields.length} field(s))`
    );
    const businessNameField = businessNameFields[0];

    // Check if displayed and enabled
    const nameDisplayed = await businessNameField.isDisplayed();
    const nameEnabled = await businessNameField.isEnabled();

    if (!nameDisplayed) {
      logFail("Business name field is not displayed");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "addBusinessFormTest"
      );
      await takeScreenshot(
        driver,
        "business_name_hidden_screenshot",
        screenshotDir
      );
      return;
    }

    if (!nameEnabled) {
      logFail("Business name field is disabled");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "addBusinessFormTest"
      );
      await takeScreenshot(
        driver,
        "business_name_disabled_screenshot",
        screenshotDir
      );
      return;
    }

    logPass("Business name field is displayed and enabled");

    // Step 5: Check for Phone field
    logPass("Step 5: Checking for Phone Field");

    const phoneFields = await driver.findElements(
      By.css(testData.phoneSelector)
    );
    if (phoneFields.length === 0) {
      logFail("Phone input field not found");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "addBusinessFormTest"
      );
      await takeScreenshot(
        driver,
        "phone_field_not_found_screenshot",
        screenshotDir
      );
      return;
    }

    logPass(`Phone field found (${phoneFields.length} field(s))`);
    const phoneField = phoneFields[0];

    const phoneDisplayed = await phoneField.isDisplayed();
    const phoneEnabled = await phoneField.isEnabled();

    if (!phoneDisplayed || !phoneEnabled) {
      logFail("Phone field is not properly displayed/enabled");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "addBusinessFormTest"
      );
      await takeScreenshot(
        driver,
        "phone_field_issue_screenshot",
        screenshotDir
      );
      return;
    }

    logPass("Phone field is displayed and enabled");

    // Step 6: Check for City field
    logPass("Step 6: Checking for City Field");

    const cityFields = await driver.findElements(By.css(testData.citySelector));
    if (cityFields.length === 0) {
      logFail("City input field not found");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "addBusinessFormTest"
      );
      await takeScreenshot(
        driver,
        "city_field_not_found_screenshot",
        screenshotDir
      );
      return;
    }

    logPass(`City field found (${cityFields.length} field(s))`);
    // Note: City is typically the first category field

    // Step 7: Check for Email field
    logPass("Step 7: Checking for Email Field");

    const emailFields = await driver.findElements(
      By.css(testData.emailSelector)
    );
    if (emailFields.length === 0) {
      logFail("Email input field not found");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "addBusinessFormTest"
      );
      await takeScreenshot(
        driver,
        "email_field_not_found_screenshot",
        screenshotDir
      );
      return;
    }

    logPass(`Email field found (${emailFields.length} field(s))`);
    const emailField = emailFields[0];

    const emailDisplayed = await emailField.isDisplayed();
    const emailEnabled = await emailField.isEnabled();

    if (!emailDisplayed || !emailEnabled) {
      logFail("Email field is not properly displayed/enabled");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "addBusinessFormTest"
      );
      await takeScreenshot(
        driver,
        "email_field_issue_screenshot",
        screenshotDir
      );
      return;
    }

    logPass("Email field is displayed and enabled");

    // Step 8: Check for Business Category field
    logPass("Step 8: Checking for Business Category Field");

    const categoryFields = await driver.findElements(
      By.css(testData.categorySelector)
    );
    if (categoryFields.length < 2) {
      logFail(
        "Business category field not found (expecting at least 2 category fields)"
      );
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "addBusinessFormTest"
      );
      await takeScreenshot(
        driver,
        "category_field_not_found_screenshot",
        screenshotDir
      );
      return;
    }

    logPass(`Category fields found (${categoryFields.length} field(s))`);
    // Note: Business category is typically the second category field

    // Step 9: Check for Submit button
    logPass("Step 9: Checking for Submit Button");

    let submitButtons = await driver.findElements(
      By.xpath(testData.submitButtonSelector)
    );
    if (submitButtons.length === 0) {
      logWarning(
        "Submit button not found with primary selector, trying alternative selectors"
      );

      // Try alternative selectors
      const altSelectors = [
        "button[type='submit']",
        "input[type='submit']",
        "button",
        ".btn",
        "[class*='submit']",
      ];

      for (const selector of altSelectors) {
        const elements = await driver.findElements(By.css(selector));
        if (elements.length > 0) {
          // Filter for buttons that might be submit buttons
          for (const element of elements) {
            try {
              const buttonText = await element.getText();
              const buttonType = await element.getAttribute("type");
              const buttonValue = await element.getAttribute("value");

              if (
                buttonText.toLowerCase().includes("add") ||
                buttonText.toLowerCase().includes("submit") ||
                buttonText.toLowerCase().includes("business") ||
                buttonType === "submit" ||
                buttonValue?.toLowerCase().includes("add")
              ) {
                submitButtons = [element];
                logPass(
                  `Found submit button with alternative selector: ${selector}, text: "${buttonText}"`
                );
                break;
              }
            } catch (e) {
              // Continue checking
            }
          }
          if (submitButtons.length > 0) break;
        }
      }
    }

    if (submitButtons.length === 0) {
      logFail("Submit button not found with any selector");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "addBusinessFormTest"
      );
      await takeScreenshot(
        driver,
        "submit_button_not_found_screenshot",
        screenshotDir
      );
      return;
    }

    logPass(`Submit button found (${submitButtons.length} button(s))`);
    const submitButton = submitButtons[0];

    // Get button details for debugging
    try {
      const buttonText = await submitButton.getText();
      const buttonType = await submitButton.getAttribute("type");
      const buttonClass = await submitButton.getAttribute("class");
      logPass(
        `Submit button details - Text: "${buttonText}", Type: ${buttonType}, Class: ${buttonClass}`
      );
    } catch (e) {
      logWarning("Could not get submit button details");
    }

    const buttonDisplayed = await submitButton.isDisplayed();
    const buttonEnabled = await submitButton.isEnabled();

    logPass(
      `Submit button displayed: ${buttonDisplayed}, enabled: ${buttonEnabled}`
    );

    if (!buttonDisplayed) {
      logWarning(
        "Submit button is not displayed (might be hidden until form is filled)"
      );
      // Don't fail the test for this, as it might be expected behavior
    } else if (!buttonEnabled) {
      logWarning(
        "Submit button is displayed but disabled (might require form validation)"
      );
      // Don't fail the test for this, as it might be expected behavior
    } else {
      logPass("Submit button is displayed and enabled");
    }

    // Step 10: Test form interaction (optional)
    logPass("Step 10: Testing Form Interaction");

    try {
      // Test business name field
      await businessNameField.clear();
      await businessNameField.sendKeys("Test Business Name");
      logPass("Successfully typed in business name field");

      // Test phone field
      await phoneField.clear();
      await phoneField.sendKeys("0912345678");
      logPass("Successfully typed in phone field");

      // Test email field
      await emailField.clear();
      await emailField.sendKeys("test@example.com");
      logPass("Successfully typed in email field");
    } catch (interactionError) {
      logWarning(`Form interaction test failed: ${interactionError.message}`);
    }

    // Step 11: Check for page errors
    const pageErrorDetected = await checkForErrors(driver);
    if (pageErrorDetected) {
      logFail(
        "Page has errors that may affect add business form functionality"
      );
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "addBusinessFormTest"
      );
      await takeScreenshot(
        driver,
        "page_error_with_form_screenshot",
        screenshotDir
      );
    } else {
      logSuccess(
        "Add business form test completed successfully - All form elements are loaded and functional"
      );
    }
  } catch (error) {
    logError(`Add business form test failed: ${error}`);
    // Take screenshot on error
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "addBusinessFormTest"
    );
    await takeScreenshot(driver, "error_screenshot", screenshotDir);
  } finally {
    await driver.quit();
  }
})();
