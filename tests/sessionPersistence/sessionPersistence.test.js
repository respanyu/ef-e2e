const fs = require("fs");
const path = require("path");
const { By } = require("selenium-webdriver");
const { createDriver } = require("../../utils/driver");
const { sleep } = require("../../utils/wait");
const { loadTestData } = require("../../utils/testData");
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

(async function sessionPersistenceTest() {
  let driver = await createDriver();

  try {
    logStart("Starting Session Persistence Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    logPass("Test data loaded from JSON");

    const loginPage = new LoginPage(driver);

    // Step 1: Login to the application
    logPass("Step 1: Logging in to the application");
    await loginPage.open(testData.loginUrl);
    logPass("Login page opened");

    await loginPage.fillEmail(testData.email);
    logPass("Email filled");

    await loginPage.fillPassword(testData.password);
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

    // Verify login success by checking URL and logout button
    const currentUrl = await driver.getCurrentUrl();
    if (currentUrl.includes("/user/login") || currentUrl.includes("login")) {
      logFail("Login failed - still on login page");
      return;
    } else {
      logPass("Login successful - redirected to authenticated area");
    }

    // Check for logout button in header
    const logoutButtons = await driver.findElements(
      By.xpath(testData.selectors.logoutButtonXPath)
    );
    if (logoutButtons.length > 0) {
      logPass("Logout button found in header - user is logged in");
    } else {
      logFail("Logout button not found - login may have failed");
      return;
    }

    // Take screenshot of logged-in state
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "sessionPersistence"
    );
    await takeScreenshot(driver, "logged_in_original_tab", screenshotDir);
    logPass("Screenshot taken of logged-in state");

    // Step 2: Open new tab and navigate to home page
    logPass("Step 2: Opening new tab and testing session persistence");

    // Open new tab by sending Ctrl+T (or Cmd+T on Mac)
    await driver.executeScript("window.open('', '_blank');");
    logPass("New tab opened");

    // Switch to the new tab
    const handles = await driver.getAllWindowHandles();
    if (handles.length < 2) {
      logFail("Failed to open new tab");
      return;
    }

    await driver.switchTo().window(handles[1]);
    logPass("Switched to new tab");

    // Navigate to home page in new tab
    await driver.get(testData.homeUrl);
    logPass("Navigated to home page in new tab");

    // Wait for page to load
    await sleep(driver, 3000);

    // Step 3: Verify session persistence - check for logout button
    logPass("Step 3: Verifying session persistence in new tab");

    const logoutButtonsNewTab = await driver.findElements(
      By.xpath(testData.selectors.logoutButtonXPath)
    );
    if (logoutButtonsNewTab.length > 0) {
      logPass(
        "✅ SUCCESS: Logout button found in new tab - session persists across tabs!"
      );
    } else {
      logFail(
        "❌ FAIL: Logout button not found in new tab - session does not persist"
      );
    }

    // Check current URL in new tab
    const newTabUrl = await driver.getCurrentUrl();
    logPass(`New tab URL: ${newTabUrl}`);

    // Take screenshot of new tab
    await takeScreenshot(driver, "session_persistence_new_tab", screenshotDir);
    logPass("Screenshot taken of new tab session state");

    // Step 4: Switch back to original tab and verify session still persists
    logPass(
      "Step 4: Switching back to original tab to verify session persistence"
    );

    await driver.switchTo().window(handles[0]);
    logPass("Switched back to original tab");

    // Check logout button still exists in original tab
    const logoutButtonsOriginal = await driver.findElements(
      By.xpath(testData.selectors.logoutButtonXPath)
    );
    if (logoutButtonsOriginal.length > 0) {
      logPass("Logout button still found in original tab - session maintained");
    } else {
      logFail("Logout button not found in original tab - session lost");
    }

    // Take final screenshot
    await takeScreenshot(
      driver,
      "session_persistence_final_check",
      screenshotDir
    );
    logPass("Final screenshot taken");

    logSuccess("Session Persistence Test completed successfully");
  } catch (error) {
    logError(`Session Persistence Test failed: ${error}`);
    // Take screenshot on error
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "sessionPersistence"
    );
    await takeScreenshot(driver, "session_persistence_error", screenshotDir);
  } finally {
    await driver.quit();
  }
})();
