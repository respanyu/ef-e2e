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
const LoginPage = require("../../pages/LoginPage");
const BusinessDetailsPage = require("../../pages/BusinessDetailsPage");

(async function claimBusinessFromListTest() {
  let driver = await createDriver();

  try {
    logStart("Starting Claim Business From List Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    logPass("Test data loaded from JSON");

    const loginPage = new LoginPage(driver);
    const businessDetailsPage = new BusinessDetailsPage(driver);

    // Create screenshots directory
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "claimBusinessFromList"
    );

    // Step 1: Login to the application
    logPass("Step 1: Logging in to Application");
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

    // Verify login success
    const postLoginUrl = await driver.getCurrentUrl();
    if (
      postLoginUrl.includes("/user/login") ||
      postLoginUrl.includes("login")
    ) {
      logFail("Login failed - still on login page");
      return;
    } else {
      logPass("Login successful - redirected to authenticated area");
    }

    // Take screenshot after login
    await takeScreenshot(driver, "after_login", screenshotDir);

    // Step 2: Navigate to business listing page
    logPass("Step 2: Navigating to Business Listing Page");
    await businessDetailsPage.open(
      testData.businessListUrl || "https://ethiofind.com/"
    );
    logPass(`Navigated to business listing page`);

    // Wait for businesses to load
    const businessesLoaded = await businessDetailsPage.waitForBusinessesToLoad(
      10000
    );
    if (businessesLoaded) {
      logPass("Business listings loaded successfully");
    } else {
      logFail("Business listings failed to load");
      await takeScreenshot(driver, "businesses_not_loaded", screenshotDir);
      return;
    }

    // Take screenshot of business listing
    await takeScreenshot(driver, "business_listing_loaded", screenshotDir);

    // Step 3: Click on the first business
    logPass("Step 3: Clicking on the first business in the list");
    const businessClicked = await businessDetailsPage.clickOnFirstBusiness();
    if (businessClicked) {
      logPass("Successfully clicked on first business");
    } else {
      logFail("Failed to click on any business");
      await takeScreenshot(driver, "failed_to_click_business", screenshotDir);
      return;
    }

    // Wait for business details page to load
    const detailsPageLoaded =
      await businessDetailsPage.waitForBusinessDetailsPage(10000);
    if (detailsPageLoaded) {
      logPass("Business details page loaded successfully");
    } else {
      logFail("Business details page failed to load");
      await takeScreenshot(
        driver,
        "business_details_not_loaded",
        screenshotDir
      );
      return;
    }

    // Take screenshot of business details page
    await takeScreenshot(driver, "business_details_page", screenshotDir);

    // Step 4: Click the claim business button
    logPass("Step 4: Looking for and clicking Claim Business button");
    const claimButtonClicked =
      await businessDetailsPage.clickClaimBusinessButton();
    if (claimButtonClicked) {
      logPass("Claim business button clicked successfully");
    } else {
      logFail("Claim business button not found or could not be clicked");
      await takeScreenshot(driver, "claim_button_not_found", screenshotDir);

      // List all buttons and links for debugging
      logPass("Listing all buttons and links on business details page:");
      const allButtons = await driver.findElements(
        By.css("button, input[type='submit'], input[type='button']")
      );
      for (let i = 0; i < allButtons.length; i++) {
        try {
          const buttonText = await allButtons[i].getText();
          const buttonClass = await allButtons[i].getAttribute("class");
          const buttonId = await allButtons[i].getAttribute("id");
          logPass(
            `Button ${
              i + 1
            }: Text="${buttonText}", Class="${buttonClass}", ID="${buttonId}"`
          );
        } catch (error) {
          logWarning(`Could not read button ${i + 1} details`);
        }
      }

      const allLinks = await driver.findElements(By.css("a"));
      for (let i = 0; i < allLinks.length; i++) {
        try {
          const linkText = await allLinks[i].getText();
          const linkHref = await allLinks[i].getAttribute("href");
          if (linkText && linkText.trim() !== "") {
            logPass(`Link ${i + 1}: Text="${linkText}", Href="${linkHref}"`);
          }
        } catch (error) {
          // Skip links that can't be read
        }
      }
      return;
    }

    // Take screenshot after clicking claim button
    await takeScreenshot(driver, "after_claim_button_click", screenshotDir);

    // Step 5: Handle the confirmation dialog (click "Yes")
    logPass("Step 5: Handling claim confirmation - clicking Yes");
    const confirmationHandled =
      await businessDetailsPage.handleClaimConfirmation();
    if (confirmationHandled) {
      logPass(
        "Confirmation handled successfully (clicked Yes or no confirmation needed)"
      );
    } else {
      logWarning(
        "Could not find confirmation dialog - proceeding to check claim status"
      );
    }

    // Take screenshot after confirmation
    await takeScreenshot(driver, "after_confirmation", screenshotDir);

    // Step 6: Wait for claim process to complete
    logPass("Step 6: Waiting for claim process to complete");
    const claimCompleted = await businessDetailsPage.waitForClaimProcess(15000);
    if (claimCompleted) {
      logSuccess("Business claim process completed successfully");
    } else {
      logFail("Business claim process did not complete within timeout");
      await takeScreenshot(driver, "claim_process_timeout", screenshotDir);
      return;
    }

    // Take final screenshot
    await takeScreenshot(driver, "claim_completed", screenshotDir);

    // Step 7: Check for errors
    const errorDetected = await checkForErrors(driver);
    if (errorDetected) {
      logFail("Errors detected during business claim test");
    } else {
      logPass("No errors detected during business claim test");
    }

    logSuccess("Claim Business From List Test completed successfully");
  } catch (error) {
    logError(`Claim Business From List Test failed: ${error.message}`);
    // Take error screenshot
    try {
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "claimBusinessFromList"
      );
      await takeScreenshot(driver, "claim_business_error", screenshotDir);
    } catch (screenshotError) {
      logError(`Failed to take error screenshot: ${screenshotError.message}`);
    }
  } finally {
    await driver.quit();
  }
})();
