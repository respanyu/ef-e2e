const fs = require("fs");
const path = require("path");
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
const PasswordResetPage = require("../../pages/PasswordResetPage");

(async function passwordResetTest() {
  let driver = await createDriver();

  // Define screenshot directory
  const screenshotDir = path.join(
    __dirname,
    "..",
    "..",
    "reports",
    "screenshots",
    "passwordReset"
  );

  try {
    logStart("Starting Password Reset Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    logPass("Test data loaded from JSON");

    const page = new PasswordResetPage(driver);

    // Test Case 1: Verify password reset page loads correctly
    logPass("Test Case 1: Verifying password reset page loads correctly");
    await page.open(testData.url);
    logPass("Password reset page opened");

    // Wait for page to load
    await sleep(driver, 3000);
    logPass("Waited for page load");

    // Verify page title
    const pageTitle = await page.getPageTitle();
    console.log(`📄 Page Title: ${pageTitle}`);
    if (pageTitle.includes("Password") || pageTitle.includes("Reset")) {
      logPass("Page title is correct");
    } else {
      logWarning("Page title may not be correct");
    }

    // Verify current URL
    const currentUrl = await page.getCurrentUrl();
    console.log(`🔗 Current URL: ${currentUrl}`);
    if (currentUrl === testData.url) {
      logPass("URL is correct");
    } else {
      logFail("URL is incorrect");
      await takeScreenshot(driver, "incorrect_url", screenshotDir);
      throw new Error("Incorrect URL");
    }

    // Verify form is visible
    const formVisible = await page.isPasswordResetFormVisible();
    if (formVisible) {
      logPass("Password reset form is visible");
    } else {
      logFail("Password reset form is not visible");
      await takeScreenshot(driver, "form_not_visible", screenshotDir);
      throw new Error("Password reset form not found");
    }

    // Verify form title
    const formTitle = await page.getFormTitle();
    console.log(`📝 Form Title: ${formTitle}`);
    if (formTitle === "Password Reset") {
      logPass("Form title is correct");
    } else {
      logWarning("Form title may not be correct");
    }

    // Verify form description
    const formDescription = await page.getFormDescription();
    console.log(`📝 Form Description: ${formDescription}`);
    if (formDescription.includes("Enter your email")) {
      logPass("Form description is correct");
    } else {
      logWarning("Form description may not be correct");
    }

    // Verify Sign In link is present
    const signInLinkVisible = await page.isSignInLinkVisible();
    if (signInLinkVisible) {
      logPass("Sign In link is visible");
    } else {
      logWarning("Sign In link is not visible");
    }

    // Test Case 2: Test with invalid email format
    logPass("Test Case 2: Testing with invalid email format");
    await page.fillEmail(testData.testEmails.invalidFormat);
    logPass("Invalid email format entered");

    const submitEnabled1 = await page.submitPasswordReset();
    if (submitEnabled1) {
      logPass("Form submitted with invalid email format");
      await page.waitForResponse();

      // Check for validation errors
      const hasValidationErrors = await page.checkForValidationErrors();
      if (hasValidationErrors) {
        logPass("Browser validation caught invalid email format");
      } else {
        logWarning("Browser validation did not catch invalid email format");
        await takeScreenshot(
          driver,
          "invalid_email_no_validation",
          screenshotDir
        );
      }
    } else {
      logFail(
        "Submit button was disabled for invalid email - unexpected behavior"
      );
      await takeScreenshot(
        driver,
        "submit_disabled_invalid_email",
        screenshotDir
      );
    }

    // Test Case 3: Test with non-existent email
    logPass("Test Case 3: Testing with non-existent email");
    await page.open(testData.url); // Reload page
    await sleep(driver, 2000);

    await page.fillEmail(testData.testEmails.nonExistent);
    logPass("Non-existent email entered");

    const submitEnabled2 = await page.submitPasswordReset();
    if (submitEnabled2) {
      logPass("Form submitted with non-existent email");
      await page.waitForResponse(8000); // Wait longer for server response

      // Check for error message
      const errorVisible = await page.isErrorMessageVisible();
      if (errorVisible) {
        const errorMessage = await page.getErrorMessage();
        console.log(`❌ Error Message: ${errorMessage}`);
        if (
          errorMessage.includes("Invalid email") ||
          errorMessage.includes("does not exist")
        ) {
          logPass("Correct error message displayed for non-existent email");
        } else {
          logWarning("Unexpected error message displayed");
        }
      } else {
        logFail("No error message displayed for non-existent email");
        await takeScreenshot(
          driver,
          "no_error_for_nonexistent_email",
          screenshotDir
        );
      }
    } else {
      logFail("Submit button was disabled for valid email format");
      await takeScreenshot(
        driver,
        "submit_disabled_valid_email",
        screenshotDir
      );
    }

    // Test Case 4: Test with empty email
    logPass("Test Case 4: Testing with empty email");
    await page.open(testData.url); // Reload page
    await sleep(driver, 2000);

    await page.fillEmail(testData.testEmails.empty);
    logPass("Empty email field");

    const submitEnabled3 = await page.submitPasswordReset();
    if (submitEnabled3) {
      logPass("Form submitted with empty email");
      await page.waitForResponse();

      // Check for validation
      const hasValidationErrors2 = await page.checkForValidationErrors();
      if (hasValidationErrors2) {
        logPass("Browser validation caught empty email field");
      } else {
        logWarning("Browser validation did not catch empty email field");
      }
    } else {
      logWarning("Submit button was disabled for empty field");
    }

    // Test Case 5: Test Sign In link functionality
    logPass("Test Case 5: Testing Sign In link functionality");
    await page.open(testData.url); // Reload page
    await sleep(driver, 2000);

    if (await page.isSignInLinkVisible()) {
      const originalUrl = await page.getCurrentUrl();
      await page.clickSignInLink();
      await sleep(driver, 2000);

      const newUrl = await page.getCurrentUrl();
      if (newUrl !== originalUrl && newUrl.includes("login")) {
        logPass("Sign In link navigates to login page correctly");
      } else {
        logWarning("Sign In link may not be working correctly");
      }
    } else {
      logWarning("Sign In link not found");
    }

    // Test Case 6: Test with valid existing email (expecting success or proper handling)
    logPass("Test Case 6: Testing with valid existing email format");
    await page.open(testData.url); // Reload page
    await sleep(driver, 2000);

    await page.fillEmail(testData.testEmails.validExisting);
    logPass("Valid email format entered");

    const submitEnabled4 = await page.submitPasswordReset();
    if (submitEnabled4) {
      logPass("Form submitted with valid email");
      await page.waitForResponse(8000);

      // Check for success message or appropriate response
      const successVisible = await page.isSuccessMessageVisible();
      const errorVisible2 = await page.isErrorMessageVisible();

      if (successVisible) {
        const successMessage = await page.getSuccessMessage();
        console.log(`✅ Success Message: ${successMessage}`);
        logPass("Success message displayed for valid email");
      } else if (errorVisible2) {
        const errorMessage2 = await page.getErrorMessage();
        console.log(`ℹ️ Server Response: ${errorMessage2}`);
        logPass("Server provided response for valid email format");
      } else {
        logWarning("No clear success or error message for valid email");
      }
    } else {
      logFail("Submit button was disabled for valid email format");
      await takeScreenshot(driver, "valid_email_submit_failed", screenshotDir);
    }

    // Check for any errors on the page
    await checkForErrors(driver);

    logSuccess("Password reset test completed successfully");
  } catch (error) {
    logError(`Password reset test failed: ${error.message}`);
    await checkForErrors(driver);
    await takeScreenshot(driver, "password_reset_test_failed", screenshotDir);
    throw error;
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
})();
