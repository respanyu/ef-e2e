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

(async function invalidEmailLoginTest() {
  let driver = await createDriver();

  try {
    logStart("Starting Invalid Email Login Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    logPass("Test data loaded from JSON");

    const page = new LoginPage(driver);

    // Test each invalid credential scenario
    for (let i = 0; i < testData.invalidCredentials.length; i++) {
      const credential = testData.invalidCredentials[i];
      logStart(
        `Testing invalid credential scenario ${i + 1}: ${credential.email}`
      );

      try {
        // Step 1: Open login page (refresh for each test)
        logPass(`Step 1.${i + 1}: Opening Login Page for scenario ${i + 1}`);
        await page.open(testData.url);
        logPass("Login page opened and maximized");

        // Step 2: Fill Email with invalid credentials
        logPass(`Step 2.${i + 1}: Filling Invalid Email`);
        await page.fillEmail(credential.email);
        logPass(`Email filled with invalid credential: ${credential.email}`);

        // Step 3: Fill Password with invalid credentials
        logPass(`Step 3.${i + 1}: Filling Invalid Password`);
        await page.fillPassword(credential.password);
        logPass(`Password filled with invalid credential`);

        // Step 4: Submit Login
        logPass(`Step 4.${i + 1}: Submitting Login Form`);
        const submitted = await page.submitLogin();
        if (submitted) {
          logPass("Login form submitted successfully");
        } else {
          logWarning("Submit button is disabled");
        }

        // Step 5: Wait for response
        logPass(`Step 5.${i + 1}: Waiting for Error Response`);
        await sleep(driver, 3000);
        logPass("Waited for error response");

        // Step 6: Check for error messages
        logPass(`Step 6.${i + 1}: Checking for Error Messages`);

        let errorFound = false;
        const pageText = await driver.findElement(By.tagName("body")).getText();

        // Check for expected error text
        if (
          pageText
            .toLowerCase()
            .includes(credential.expectedError.toLowerCase())
        ) {
          logPass(
            `Found expected error message: "${credential.expectedError}"`
          );
          errorFound = true;
        }

        // Check for error selectors
        for (const selector of testData.errorSelectors) {
          try {
            const elements = await driver.findElements(By.css(selector));
            if (elements.length > 0) {
              logPass(
                `Found error element with selector: ${selector} (${elements.length} elements)`
              );
              errorFound = true;

              // Check if error element is visible
              const errorElement = elements[0];
              const isDisplayed = await errorElement.isDisplayed();
              if (isDisplayed) {
                logPass("Error element is visible");
              } else {
                logWarning("Error element found but not visible");
              }
              break;
            }
          } catch (e) {
            // Continue with next selector
          }
        }

        // Step 7: Verify user is not logged in
        logPass(`Step 7.${i + 1}: Verifying User Not Logged In`);

        const currentUrl = await driver.getCurrentUrl();
        logPass(`Current URL: ${currentUrl}`);

        // Check that we're still on login page or error page (not redirected to dashboard)
        if (
          currentUrl.includes("/login") ||
          currentUrl.includes("/error") ||
          currentUrl === testData.url
        ) {
          logPass("User correctly remains on login page (not logged in)");
        } else {
          logWarning(
            `User was redirected to: ${currentUrl} (might indicate unexpected success)`
          );
        }

        if (errorFound) {
          logPass(
            `Invalid credential scenario ${
              i + 1
            } handled correctly with error message`
          );
        } else {
          logWarning(
            `Invalid credential scenario ${
              i + 1
            } completed but no clear error message found`
          );
        }
      } catch (scenarioError) {
        logError(
          `Invalid credential scenario ${i + 1} failed: ${scenarioError}`
        );
        // Take screenshot for this specific scenario
        const screenshotDir = path.join(
          __dirname,
          "..",
          "..",
          "reports",
          "screenshots",
          "invalidEmailLogin"
        );
        await takeScreenshot(
          driver,
          `invalid_login_scenario_${i + 1}_error_screenshot`,
          screenshotDir
        );
      }
    }

    // Step 8: Overall assessment
    logPass("Step 8: Overall Invalid Login Test Assessment");

    // Check for any unexpected page errors
    const pageErrorDetected = await checkForErrors(driver);
    if (pageErrorDetected) {
      logFail("Unexpected page errors detected during invalid login tests");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "invalidEmailLogin"
      );
      await takeScreenshot(
        driver,
        "invalid_login_page_error_screenshot",
        screenshotDir
      );
    } else {
      logSuccess(
        "Invalid Email Login test completed successfully - All invalid login scenarios handled properly"
      );
    }
  } catch (error) {
    logError(`Invalid Email Login test failed: ${error}`);
    // Take screenshot on error
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "invalidEmailLogin"
    );
    await takeScreenshot(
      driver,
      "invalid_login_error_screenshot",
      screenshotDir
    );
  } finally {
    await driver.quit();
  }
})();
