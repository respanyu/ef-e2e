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
const RegisterPage = require("../../pages/RegisterPage");

(async function activateUserTest() {
  let driver = await createDriver();

  try {
    logStart("Starting Activate User Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    let testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));

    // Replace timestamp placeholder with actual timestamp
    const timestamp = Date.now();
    testData.email = testData.email.replace("{timestamp}", timestamp);

    logPass("Test data loaded from JSON");

    const registerPage = new RegisterPage(driver);

    // Step 1: Register a new user
    logPass("Step 1: Registering New User");

    // 1️⃣ Open register page
    await registerPage.open(testData.registerUrl);
    logPass("Register page opened and maximized");

    // 2️⃣ Fill registration form
    await registerPage.fillUsername(testData.name);
    logPass("Username filled");

    await registerPage.fillEmail(testData.email);
    logPass("Email filled");

    await registerPage.fillPassword(testData.password);
    logPass("Password filled");

    await registerPage.fillPasswordRepeat(testData.password);
    logPass("Password repeat filled");

    // 3️⃣ Submit registration
    const registered = await registerPage.submitRegister();
    if (registered) {
      logPass("Registration form submitted successfully");
    } else {
      logWarning("Registration submit button is disabled");
    }

    // 4️⃣ Wait for registration response
    await sleep(driver, 5000);
    logPass("Waited for registration response");

    // 5️⃣ Check for registration errors
    const registerErrorDetected = await checkForErrors(driver);
    if (registerErrorDetected) {
      logFail("Registration failed with errors detected");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "activateUser"
      );
      await takeScreenshot(
        driver,
        "registration_error_screenshot",
        screenshotDir
      );
      return; // Exit if registration fails
    } else {
      logPass("Registration completed successfully");
    }

    // Step 2: Read verification link from auth.txt
    logPass("Step 2: Reading Verification Link");

    let verificationLink = null;
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts && !verificationLink) {
      try {
        if (fs.existsSync(testData.authFilePath)) {
          const fileContent = fs.readFileSync(testData.authFilePath, "utf8");
          // Extract URL from the file (assuming it's a simple text file with the link)
          const urlMatch = fileContent.match(/https?:\/\/[^\s]+/);
          if (urlMatch) {
            verificationLink = urlMatch[0];
            logPass(`Verification link found: ${verificationLink}`);
          }
        } else {
          logWarning(
            `Auth file not found at ${testData.authFilePath}, attempt ${
              attempts + 1
            }/${maxAttempts}`
          );
        }
      } catch (error) {
        logWarning(`Error reading auth file: ${error.message}`);
      }

      if (!verificationLink) {
        attempts++;
        await sleep(driver, 2000); // Wait 2 seconds before retrying
      }
    }

    if (!verificationLink) {
      logFail(
        "Failed to read verification link from auth.txt after multiple attempts"
      );
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "activateUser"
      );
      await takeScreenshot(
        driver,
        "no_verification_link_screenshot",
        screenshotDir
      );
      return;
    }

    // Step 3: Access verification link
    logPass("Step 3: Accessing Verification Link");

    await driver.get(verificationLink);
    logPass("Verification link accessed");

    // 6️⃣ Wait for activation response
    await sleep(driver, 3000);
    logPass("Waited for activation response");

    // Step 4: Verify activation
    logPass("Step 4: Verifying Account Activation");

    const pageText = await driver.findElement(By.tagName("body")).getText();
    const activationSuccess =
      pageText.toLowerCase().includes("activated") ||
      pageText.toLowerCase().includes("verified") ||
      pageText.toLowerCase().includes("success") ||
      pageText.toLowerCase().includes("account activated") ||
      pageText.toLowerCase().includes("email verified");

    const activationError =
      pageText.toLowerCase().includes("error") ||
      pageText.toLowerCase().includes("failed") ||
      pageText.toLowerCase().includes("invalid") ||
      pageText.toLowerCase().includes("expired");

    // 7️⃣ Check for activation errors
    const activationErrorDetected = await checkForErrors(driver);

    if (activationSuccess && !activationErrorDetected) {
      logSuccess("Account activation completed successfully");
    } else if (activationError || activationErrorDetected) {
      logFail("Account activation failed");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "activateUser"
      );
      await takeScreenshot(
        driver,
        "activation_error_screenshot",
        screenshotDir
      );
    } else {
      logWarning(
        "Activation status unclear - page loaded but success confirmation not found"
      );
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "activateUser"
      );
      await takeScreenshot(
        driver,
        "unclear_activation_screenshot",
        screenshotDir
      );
    }
  } catch (error) {
    logError(`Activate User test failed: ${error}`);
    // Take screenshot on error
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "activateUser"
    );
    await takeScreenshot(driver, "error_screenshot", screenshotDir);
  } finally {
    await driver.quit();
  }
})();
