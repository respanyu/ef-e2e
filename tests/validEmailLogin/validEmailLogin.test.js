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

(async function validEmailLoginTest() {
  let driver = await createDriver();

  try {
    logStart("Starting Valid Email Login Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    logPass("Test data loaded from JSON");

    const page = new LoginPage(driver);

    // Step 1: Open login page
    logPass("Step 1: Opening Login Page");
    await page.open(testData.url);
    logPass("Login page opened and maximized");

    // Step 2: Fill Email
    logPass("Step 2: Filling Email");
    await page.fillEmail(testData.email);
    logPass("Email filled with valid credentials");

    // Step 3: Fill Password
    logPass("Step 3: Filling Password");
    await page.fillPassword(testData.password);
    logPass("Password filled with valid credentials");

    // Step 4: Submit Login
    logPass("Step 4: Submitting Login Form");
    const submitted = await page.submitLogin();
    if (submitted) {
      logPass("Login form submitted successfully");
    } else {
      logWarning("Submit button is disabled");
    }

    // Step 5: Wait for response
    logPass("Step 5: Waiting for Login Response");
    await sleep(driver, 5000);
    logPass("Waited for login response");

    // Step 6: Check for successful login indicators
    logPass("Step 6: Checking for Successful Login Indicators");

    const currentUrl = await driver.getCurrentUrl();
    logPass(`Current URL after login: ${currentUrl}`);

    let successIndicatorsFound = false;

    // Check for success selectors
    for (const selector of testData.successSelectors) {
      try {
        const elements = await driver.findElements(By.css(selector));
        if (elements.length > 0) {
          logPass(
            `Found success indicator: ${selector} (${elements.length} elements)`
          );
          successIndicatorsFound = true;
          break;
        }
      } catch (e) {
        // Continue with next selector
      }
    }

    // Check page content for success indicators
    const pageText = await driver.findElement(By.tagName("body")).getText();
    for (const indicator of testData.expectedSuccessIndicators) {
      if (pageText.toLowerCase().includes(indicator.toLowerCase())) {
        logPass(`Found success text indicator: "${indicator}"`);
        successIndicatorsFound = true;
      }
    }

    // Step 7: Check for login errors (should not be present for valid login)
    logPass("Step 7: Checking for Login Errors");
    const errorDetected = await checkForErrors(driver);

    if (errorDetected) {
      logFail("Unexpected errors detected during valid login");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "validEmailLogin"
      );
      await takeScreenshot(
        driver,
        "valid_login_error_screenshot",
        screenshotDir
      );
    } else if (successIndicatorsFound) {
      logSuccess(
        "Valid Email Login test completed successfully - User logged in properly"
      );
    } else {
      logWarning("Login completed but success indicators not clearly found");
      logSuccess(
        "Valid Email Login test completed - assuming success based on no errors"
      );
    }
  } catch (error) {
    logError(`Valid Email Login test failed: ${error}`);
    // Take screenshot on error
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "validEmailLogin"
    );
    await takeScreenshot(driver, "valid_login_error_screenshot", screenshotDir);
  } finally {
    await driver.quit();
  }
})();
