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

(async function loginThenDeleteAccountTest() {
  let driver = await createDriver();

  try {
    logStart("Starting Login Then Delete Account Test...");

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
      "loginThenDeleteAccount"
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

    // Step 2: Navigate to user profile page
    logPass("Step 2: Navigating to User Profile Page");
    await driver.get(testData.profileUrl);
    logPass(`Navigated to: ${testData.profileUrl}`);

    // Wait for profile page to load
    await sleep(driver, 3000);
    logPass("Waited for profile page to load");

    // Take screenshot of profile page
    await takeScreenshot(driver, "profile_page_loaded", screenshotDir);

    // Step 3: Look for delete account button
    logPass("Step 3: Searching for Delete Account Button");

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
      logPass(`Delete account button found using selector: ${foundSelector}`);

      // Take screenshot before clicking delete button
      await takeScreenshot(driver, "before_delete_click", screenshotDir);

      // Step 4: Click the delete account button
      logPass("Step 4: Clicking Delete Account Button");
      await deleteButton.click();
      logPass("Delete account button clicked");

      // Wait for any confirmation dialog or page change
      await sleep(driver, 2000);

      // Take screenshot after clicking delete button
      await takeScreenshot(driver, "after_delete_click", screenshotDir);

      // Step 5: Check for confirmation dialog or page changes
      logPass("Step 5: Checking for Confirmation Dialog or Page Changes");

      // Check current URL after clicking delete
      const currentUrl = await driver.getCurrentUrl();
      logPass(`Current URL after delete click: ${currentUrl}`);

      // Check if redirected to a confirmation/delete page
      if (
        !currentUrl.includes("/user/profile") ||
        currentUrl.includes("/delete") ||
        currentUrl.includes("/confirm")
      ) {
        logPass(
          "Redirect to confirmation page detected - looking for final confirmation elements"
        );

        // Take screenshot of confirmation page
        await takeScreenshot(driver, "delete_confirmation_page", screenshotDir);

        // Step 6: Look for "Yes" option and final "Delete Account" button
        logPass(
          "Step 6: Looking for Yes option and final Delete Account button"
        );

        // First, look for "Yes" option (radio button, checkbox, or selection)
        const yesSelectors = [
          "input[type='radio'][value='yes']",
          "input[type='radio'][value='Yes']",
          "input[type='checkbox'][value='yes']",
          "input[type='checkbox'][value='Yes']",
          "input[name*='confirm'][value='yes']",
          "input[name*='confirm'][value='Yes']",
          "#yes",
          ".yes-option",
          "label:contains('Yes')",
        ];

        let yesElement = null;
        for (const selector of yesSelectors) {
          try {
            if (selector.includes(":contains")) {
              const xpathSelector = selector
                .replace("label:contains('", "//label[contains(text(),'")
                .replace("')", "')]");
              yesElement = await driver.findElement(By.xpath(xpathSelector));
            } else {
              yesElement = await driver.findElement(By.css(selector));
            }
            logPass(`Yes option found using selector: ${selector}`);
            break;
          } catch (error) {
            continue;
          }
        }

        if (yesElement) {
          // Click the Yes option
          await yesElement.click();
          logPass("Yes option selected");
          await sleep(driver, 1000);
        } else {
          logWarning(
            "Yes option not found - proceeding to look for delete button"
          );
        }

        // Now look for the final "Delete Account" button
        const finalDeleteSelectors = [
          "button:contains('Delete Account')",
          "button:contains('Delete My Account')",
          "button:contains('Confirm Delete')",
          "input[type='submit'][value*='Delete Account']",
          "input[type='submit'][value*='Delete']",
          ".delete-account-btn",
          "#delete-account-btn",
          ".btn-danger",
          ".confirm-delete",
        ];

        let finalDeleteButton = null;
        let finalDeleteSelector = null;

        for (const selector of finalDeleteSelectors) {
          try {
            if (selector.includes(":contains")) {
              const xpathSelector = selector
                .replace("button:contains('", "//button[contains(text(),'")
                .replace("')", "')]");
              const inputXpathSelector = selector
                .replace("input:contains('", "//input[contains(@value,'")
                .replace("')", "')]");
              try {
                finalDeleteButton = await driver.findElement(
                  By.xpath(xpathSelector)
                );
                finalDeleteSelector = xpathSelector;
              } catch (xpathError) {
                finalDeleteButton = await driver.findElement(
                  By.xpath(inputXpathSelector)
                );
                finalDeleteSelector = inputXpathSelector;
              }
            } else {
              finalDeleteButton = await driver.findElement(By.css(selector));
              finalDeleteSelector = selector;
            }
            logPass(
              `Final delete button found using selector: ${finalDeleteSelector}`
            );
            break;
          } catch (error) {
            continue;
          }
        }

        if (finalDeleteButton) {
          // Take screenshot before final delete click
          await takeScreenshot(
            driver,
            "before_final_delete_click",
            screenshotDir
          );

          // Step 7: Click the final delete account button
          logPass("Step 7: Clicking Final Delete Account Button");
          await finalDeleteButton.click();
          logPass("Final delete account button clicked");

          // Wait for deletion to complete
          await sleep(driver, 3000);

          // Take screenshot after final delete
          await takeScreenshot(driver, "after_final_delete", screenshotDir);

          // Check final result
          const finalUrl = await driver.getCurrentUrl();
          logPass(`Final URL after deletion: ${finalUrl}`);
        } else {
          logFail("Final delete account button not found on confirmation page");

          // List all buttons on confirmation page for debugging
          logPass("Listing all buttons found on confirmation page:");
          const allButtons = await driver.findElements(
            By.css("button, input[type='submit'], input[type='button']")
          );
          for (let i = 0; i < allButtons.length; i++) {
            try {
              const buttonText = await allButtons[i].getText();
              const buttonValue = await allButtons[i].getAttribute("value");
              const buttonClass = await allButtons[i].getAttribute("class");
              const buttonId = await allButtons[i].getAttribute("id");
              logPass(
                `Button ${
                  i + 1
                }: Text="${buttonText}", Value="${buttonValue}", Class="${buttonClass}", ID="${buttonId}"`
              );
            } catch (error) {
              logWarning(`Could not read button ${i + 1} details`);
            }
          }
        }
      } else {
        // Check if a confirmation dialog appeared
        try {
          const confirmDialog = await driver.findElement(
            By.css(".modal, .dialog, .confirm, .alert")
          );
          logPass("Confirmation dialog detected");

          // Look for confirm/yes button
          const confirmButtons = await driver.findElements(
            By.css(
              "button:contains('Yes'), button:contains('Confirm'), button:contains('Delete'), .confirm-yes"
            )
          );
          if (confirmButtons.length > 0) {
            logPass(
              "Confirmation button found - clicking to confirm account deletion"
            );
            await confirmButtons[0].click();
            await sleep(driver, 2000);

            // Take screenshot after confirmation
            await takeScreenshot(driver, "after_confirmation", screenshotDir);
          } else {
            logWarning("Confirmation button not found in dialog");
          }
        } catch (error) {
          logPass(
            "No confirmation dialog appeared - checking for direct deletion"
          );
        }
      }

      // Step 6: Check for success/error messages
      logPass("Step 6: Checking for Success/Error Messages");

      // Check current URL
      const finalUrl = await driver.getCurrentUrl();
      logPass(`Current URL after delete attempt: ${finalUrl}`);

      // Check for success messages
      const pageText = await driver.findElement(By.tagName("body")).getText();
      const pageTextLower = pageText.toLowerCase();

      if (
        pageTextLower.includes("account deleted") ||
        pageTextLower.includes("successfully deleted") ||
        pageTextLower.includes("account has been deleted")
      ) {
        logSuccess("Account deletion appears to have succeeded");
      } else if (
        pageTextLower.includes("cannot delete") ||
        pageTextLower.includes("error") ||
        pageTextLower.includes("failed")
      ) {
        logFail("Account deletion failed with error message");
      } else if (currentUrl.includes("login") || currentUrl.includes("home")) {
        logPass("User was redirected after delete attempt - possible success");
      } else {
        logWarning(
          "Unable to determine account deletion result from page content"
        );
      }

      // Take final screenshot
      await takeScreenshot(driver, "final_result", screenshotDir);
    } else {
      logFail("Delete account button not found on profile page");

      // Take screenshot of profile page to show what was available
      await takeScreenshot(driver, "no_delete_button_found", screenshotDir);

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

    // Step 7: Check for errors
    const errorDetected = await checkForErrors(driver);
    if (errorDetected) {
      logFail("Errors detected during account deletion test");
    } else {
      logPass("No errors detected during account deletion test");
    }

    logSuccess("Login Then Delete Account Test completed");
  } catch (error) {
    logError(`Login Then Delete Account Test failed: ${error.message}`);
    // Take error screenshot
    try {
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "loginThenDeleteAccount"
      );
      await takeScreenshot(driver, "login_delete_account_error", screenshotDir);
    } catch (screenshotError) {
      logError(`Failed to take error screenshot: ${screenshotError.message}`);
    }
  } finally {
    await driver.quit();
  }
})();
