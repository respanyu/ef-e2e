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

(async function checkDeleteAccountButtonPresenceTest() {
  let driver = await createDriver();

  try {
    logStart("Starting Check Delete Account Button Presence Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    logPass("Test data loaded from JSON");

    const loginPage = new LoginPage(driver);

    // Create screenshots directory
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "checkDeleteAccountButtonPresence"
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
    await takeScreenshot(driver, "after_login_presence_check", screenshotDir);

    // Step 2: Navigate to user profile page
    logPass("Step 2: Navigating to User Profile Page");
    await driver.get(testData.profileUrl);
    logPass(`Navigated to: ${testData.profileUrl}`);

    // Wait for profile page to load
    await sleep(driver, 3000);
    logPass("Waited for profile page to load");

    // Take screenshot of profile page
    await takeScreenshot(
      driver,
      "profile_page_loaded_presence_check",
      screenshotDir
    );

    // Step 3: Check if delete account button is present
    logPass("Step 3: Checking for Delete Account Button Presence");

    // Try multiple selectors for delete account button/link
    const deleteButtonSelectors = [
      "button:contains('Delete Account')",
      "button:contains('Delete')",
      "a:contains('Delete Account')",
      "a:contains('Delete')",
      ".delete-account",
      "#delete-account",
      "[class*='delete']",
      "button[class*='delete']",
      "a[class*='delete']",
      ".btn-danger",
      ".button-danger",
      "button[type='submit'][value*='delete']",
      "input[type='submit'][value*='delete']",
    ];

    let deleteButton = null;
    let foundSelector = null;

    for (const selector of deleteButtonSelectors) {
      try {
        if (selector.includes(":contains")) {
          // Handle XPath-like text selectors
          const xpathSelector = selector
            .replace("button:contains('", "//button[contains(text(),'")
            .replace("')", "')]");
          const linkXpathSelector = selector
            .replace("a:contains('", "//a[contains(text(),'")
            .replace("')", "')]");

          // Try button first
          try {
            deleteButton = await driver.findElement(By.xpath(xpathSelector));
            foundSelector = xpathSelector;
            break;
          } catch (buttonError) {
            // Try link
            deleteButton = await driver.findElement(
              By.xpath(linkXpathSelector)
            );
            foundSelector = linkXpathSelector;
            break;
          }
        } else {
          // Handle CSS selectors
          deleteButton = await driver.findElement(By.css(selector));
          foundSelector = selector;
          break;
        }
      } catch (error) {
        // Selector not found, continue to next one
        continue;
      }
    }

    if (deleteButton) {
      logSuccess(
        `Delete account button found using selector: ${foundSelector}`
      );
      logPass(
        "Delete Account Button Presence Test PASSED - Button is available"
      );

      // Take screenshot showing the button
      await takeScreenshot(driver, "delete_button_found", screenshotDir);
    } else {
      logFail("Delete account button not found on profile page");
      logFail(
        "Delete Account Button Presence Test FAILED - Button is not available"
      );

      // Take screenshot for debugging
      await takeScreenshot(driver, "delete_button_not_found", screenshotDir);

      // List all buttons and links on the page for debugging
      logPass("Listing all buttons and links found on profile page:");
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
    }

    // Step 4: Check for errors
    const errorDetected = await checkForErrors(driver);
    if (errorDetected) {
      logFail("Errors detected during button presence check test");
    } else {
      logPass("No errors detected during button presence check test");
    }

    logSuccess("Check Delete Account Button Presence Test completed");
  } catch (error) {
    logError(
      `Check Delete Account Button Presence Test failed: ${error.message}`
    );
    // Take error screenshot
    try {
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "checkDeleteAccountButtonPresence"
      );
      await takeScreenshot(driver, "presence_check_error", screenshotDir);
    } catch (screenshotError) {
      logError(`Failed to take error screenshot: ${screenshotError.message}`);
    }
  } finally {
    await driver.quit();
  }
})();
