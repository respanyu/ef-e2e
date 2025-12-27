const fs = require("fs");
const path = require("path");
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
const HeaderPage = require("../../pages/HeaderPage");

(async function logoutTest() {
  let driver = await createDriver();

  try {
    logStart("Starting Logout Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    logPass("Test data loaded from JSON");

    const loginPage = new LoginPage(driver);
    const headerPage = new HeaderPage(driver);

    // 1️⃣ Open login page and login
    await loginPage.open(testData.url);
    logPass("Login page opened and maximized");

    // Fill Email
    await loginPage.fillEmail(testData.email);
    logPass("Email filled");

    // Fill Password
    await loginPage.fillPassword(testData.password);
    logPass("Password filled");

    // Submit Login
    const submitted = await loginPage.submitLogin();
    if (submitted) {
      logPass("Login form submitted successfully");
    } else {
      logWarning("Submit button is disabled");
    }

    // Wait for login to complete
    await sleep(driver, 3000);
    logPass("Waited for login response");

    // Check for login errors
    const loginErrorDetected = await checkForErrors(driver);
    if (loginErrorDetected) {
      logFail("Login failed with errors");
      throw new Error("Login error detected");
    }

    // 2️⃣ Now, click logout in header
    const logoutClicked = await headerPage.clickLogout();
    if (logoutClicked) {
      logPass("Logout button clicked successfully");
    } else {
      logFail("Logout button not found or not clickable");
      throw new Error("Logout button not found");
    }

    // Wait for logout to complete
    await sleep(driver, 2000);
    logPass("Waited for logout response");

    // Check if redirected to login page or logged out
    const currentUrl = await driver.getCurrentUrl();
    if (
      currentUrl.includes("login") ||
      currentUrl === "https://ethiofind.com/"
    ) {
      logSuccess(
        "Logout test completed successfully - redirected to login or home"
      );
    } else {
      logWarning("Logout may not have completed - still on same page");
    }
  } catch (error) {
    logError(`Logout test failed: ${error}`);
    // Take screenshot on error
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "logout"
    );
    await takeScreenshot(driver, "logout_error_screenshot", screenshotDir);
  } finally {
    await driver.quit();
  }
})();
