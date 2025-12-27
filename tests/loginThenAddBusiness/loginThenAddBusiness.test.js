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
const AddBusinessPage = require("../../pages/AddBusinessPage");

(async function loginThenAddBusinessTest() {
  let driver = await createDriver();

  try {
    logStart("Starting Login Then Add Business Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    logPass("Test data loaded from JSON");

    const loginPage = new LoginPage(driver);
    const addBusinessPage = new AddBusinessPage(driver);

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
        "loginThenAddBusiness"
      );
      await takeScreenshot(driver, "login_error_screenshot", screenshotDir);
      return; // Exit if login fails
    } else {
      logPass("Login completed successfully");
    }

    // Step 2: Navigate to Add Business
    logPass("Step 2: Navigating to Add Business");

    // Assuming after login, we can go to home page for add business
    await addBusinessPage.open(testData.homeUrl);
    logPass("Home page opened after login");

    // 7️⃣ Scroll to Add Business section
    await addBusinessPage.scrollToAddBusinessSection();
    logPass("Scrolled to Add Business section");

    // Step 3: Fill Add Business Form
    logPass("Step 3: Filling Add Business Form");

    // 8️⃣ Fill Business Name
    await addBusinessPage.fillBusinessName(testData.business);
    logPass("Business Name filled");

    // 9️⃣ Fill Telephone
    await addBusinessPage.fillTelephone(testData.phone);
    logPass("Telephone filled");

    // 10️⃣ Select City
    await addBusinessPage.selectCity(testData.city);
    logPass("City selected");

    // 11️⃣ Fill Email
    await addBusinessPage.fillEmail(testData.businessEmail);
    logPass("Business Email filled");

    // 12️⃣ Select Business Category
    await addBusinessPage.selectBusinessCategory(testData.category);
    logPass("Business Category selected");

    // 13️⃣ Submit Add Business Form
    const businessSubmitted = await addBusinessPage.submitForm();
    if (businessSubmitted) {
      logPass("Add Business form submitted successfully");
    } else {
      logWarning("Add Business submit button is disabled");
    }

    // 14️⃣ Wait for response
    await sleep(driver, 3000);
    logPass("Waited for add business response");

    // 15️⃣ Check for add business errors
    const businessErrorDetected = await checkForErrors(driver);

    // Take screenshot if error detected
    if (businessErrorDetected) {
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "loginThenAddBusiness"
      );
      await takeScreenshot(
        driver,
        "add_business_api_error_screenshot",
        screenshotDir
      );
    }

    if (businessErrorDetected) {
      logFail("Add Business test completed with errors detected");
    } else {
      logSuccess("Login and Add Business test completed successfully");
    }
  } catch (error) {
    logError(`Login Then Add Business test failed: ${error}`);
    // Take screenshot on error
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "loginThenAddBusiness"
    );
    await takeScreenshot(driver, "error_screenshot", screenshotDir);
  } finally {
    await driver.quit();
  }
})();
