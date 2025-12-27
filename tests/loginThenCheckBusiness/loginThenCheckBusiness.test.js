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
  logScreenshot,
} = require("../../utils/logger");
const { checkForErrors } = require("../../utils/errors");
const { takeScreenshot } = require("../../utils/screenshot");
const LoginPage = require("../../pages/LoginPage");
const BusinessEditPage = require("../../pages/BusinessEditPage");

(async function loginThenCheckBusinessTest() {
  let driver = await createDriver();

  try {
    logStart("Starting Login Then Check Business Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    logPass("Test data loaded from JSON");

    const loginPage = new LoginPage(driver);
    const businessEditPage = new BusinessEditPage(driver);

    // Step 1: Login
    logPass("Step 1: Starting Login Process");

    // 1️⃣ Open login page
    await loginPage.open(testData.loginUrl);
    logPass("Login page opened and maximized");

    // 2️⃣ Fill Email
    await loginPage.fillEmail(testData.email);
    logPass("Email filled");

    // 3️⃣ Fill Password
    await loginPage.fillPassword(testData.password);
    logPass("Password filled");

    // 4️⃣ Submit Login
    const loginSubmitted = await loginPage.submitLogin();
    if (loginSubmitted) {
      logPass("Login form submitted successfully");
    } else {
      logWarning("Login submit button is disabled");
    }

    // 5️⃣ Wait for login response
    await sleep(driver, 3000);
    logPass("Waited for login response");

    // 6️⃣ Check for login errors
    const loginErrorDetected = await checkForErrors(driver);
    if (loginErrorDetected) {
      logFail("Login failed with errors detected");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "loginThenCheckBusiness"
      );
      await takeScreenshot(driver, "login_error_screenshot", screenshotDir);
      return; // Exit if login fails
    } else {
      logPass("Login completed successfully");
    }

    // Step 2: Navigate to Business Edit Page
    logPass("Step 2: Navigating to Business Edit Page");

    // 7️⃣ Open business edit page
    await businessEditPage.open(testData.businessEditUrl);
    logPass("Business edit page opened");

    // 8️⃣ Wait for page to load and check if it loaded properly
    logPass("Waiting for business edit page to load completely...");
    await sleep(driver, 5000); // Wait longer for potential API calls

    // Check if page loaded by looking for basic page elements
    const pageLoaded = await businessEditPage.checkIfPageLoaded();
    if (!pageLoaded) {
      logFail("Business edit page failed to load - no content detected");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "loginThenCheckBusiness"
      );
      await takeScreenshot(driver, "page_not_loaded_screenshot", screenshotDir);
      logWarning(
        "⚠️  PAGE NOT LOADED: Business edit page did not load properly"
      );
      return; // Exit test as failed
    }

    logPass("Business edit page loaded successfully with content");

    // 9️⃣ Wait for API responses (check for dynamic content loading)
    logPass("Waiting for API responses and dynamic content...");
    await sleep(driver, 3000);

    // Check for loading indicators or API response completion
    const apiResponseReceived = await businessEditPage.checkForApiResponse();
    if (!apiResponseReceived) {
      console.log(
        "⏳ API Response Status: Still waiting or no API response detected"
      );
    } else {
      console.log("✅ API Response Status: API response received");
    }

    // Step 3: Check for Business Information
    logPass("Step 3: Checking for Business Information");

    // 9️⃣ Check if business information exists
    const hasBusinessInfo = await businessEditPage.checkForBusinessInfo();
    const hasNoBusinessMessage =
      await businessEditPage.checkForNoBusinessMessage();

    // Debug: Get page title and some content
    const pageTitle = await businessEditPage.getPageTitle();
    logPass(`Page title: ${pageTitle}`);

    // Get some page text for debugging
    try {
      const bodyText = await driver.findElement(By.tagName("body")).getText();
      const lines = bodyText
        .split("\n")
        .filter((line) => line.trim().length > 0);
      const relevantLines = lines
        .filter(
          (line) =>
            line.toLowerCase().includes("business") ||
            line.toLowerCase().includes("claim") ||
            line.toLowerCase().includes("edit") ||
            line.toLowerCase().includes("add")
        )
        .slice(0, 10); // First 10 relevant lines
      console.log("📄 Relevant page content:");
      relevantLines.forEach((line, i) =>
        console.log(`  ${i + 1}: ${line.trim()}`)
      );
    } catch (e) {
      logWarning("Could not get page content preview");
    }

    // 10️⃣ Check for page errors
    const pageErrorDetected = await checkForErrors(driver);

    if (pageErrorDetected) {
      logFail("Business edit page has errors detected");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "loginThenCheckBusiness"
      );
      await takeScreenshot(driver, "page_error_screenshot", screenshotDir);
    }

    // Determine test result
    if (hasBusinessInfo && !hasNoBusinessMessage && !pageErrorDetected) {
      logSuccess("Business information found - User has claimed a business");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "loginThenCheckBusiness"
      );
      await takeScreenshot(driver, "business_found_screenshot", screenshotDir);
    } else if (hasNoBusinessMessage && !hasBusinessInfo && !pageErrorDetected) {
      logSuccess("No business claimed - User can claim a business");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "loginThenCheckBusiness"
      );
      await takeScreenshot(driver, "no_business_screenshot", screenshotDir);
    } else if (pageErrorDetected) {
      logFail(
        "Business edit page has errors - unable to determine business status"
      );
    } else {
      logWarning(
        "Business status unclear - page loaded but business info detection ambiguous"
      );
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "loginThenCheckBusiness"
      );
      await takeScreenshot(driver, "unclear_status_screenshot", screenshotDir);
    }
  } catch (error) {
    logError(`Login Then Check Business test failed: ${error}`);
    // Take screenshot on error
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "loginThenCheckBusiness"
    );
    await takeScreenshot(driver, "error_screenshot", screenshotDir);
  } finally {
    await driver.quit();
  }
})();
