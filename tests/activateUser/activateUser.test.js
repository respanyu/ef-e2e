const fs = require("fs");
const path = require("path");
const https = require("https");
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
const LoginPage = require("../../pages/LoginPage");

// Helper function to fetch content from URL
function fetchUrlContent(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    };
    https
      .get(url, options, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve(data);
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

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

    // Step 2: Read verification link from ethiofind.com/auth.txt
    logPass("Step 2: Reading Verification Link from ethiofind.com/auth.txt");

    let verificationLink = null;
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts && !verificationLink) {
      try {
        const fileContent = await fetchUrlContent(testData.authUrl);

        // Log the full contents of auth.txt
        logPass(`Full contents of ${testData.authUrl}:`);
        console.log("📄 AUTH.TXT CONTENT START");
        console.log(fileContent);
        console.log("📄 AUTH.TXT CONTENT END");

        // Extract URL from the content (assuming it's a simple text file with the link)
        const urlMatch = fileContent.match(/https?:\/\/[^\s]+/);
        if (urlMatch) {
          verificationLink = urlMatch[0];
          logPass(`Verification link found: ${verificationLink}`);
        } else {
          logWarning(
            `No URL found in auth.txt content, attempt ${
              attempts + 1
            }/${maxAttempts}`
          );
        }
      } catch (error) {
        logWarning(`Error fetching auth URL: ${error.message}`);
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

    // Step 5: Attempt to login with the activated account
    if (activationSuccess && !activationErrorDetected) {
      logPass("Step 5: Attempting to Login with Activated Account");

      const loginPage = new LoginPage(driver);

      // Open login page
      await loginPage.open(testData.loginUrl);
      logPass("Login page opened");

      // Fill login form
      await loginPage.fillEmail(testData.email);
      logPass("Email filled for login");

      await loginPage.fillPassword(testData.password);
      logPass("Password filled for login");

      // Submit login
      const loggedIn = await loginPage.submitLogin();
      if (loggedIn) {
        logPass("Login form submitted");
      } else {
        logWarning("Login submit button is disabled");
      }

      // Wait for login response
      await sleep(driver, 3000);
      logPass("Waited for login response");

      // Check for login errors
      const loginErrorDetected = await checkForErrors(driver);
      if (loginErrorDetected) {
        logFail("Login failed with errors detected");
        const screenshotDir = path.join(
          __dirname,
          "..",
          "..",
          "reports",
          "screenshots",
          "activateUser"
        );
        await takeScreenshot(driver, "login_error_screenshot", screenshotDir);
      } else {
        logSuccess("Login successful after activation");
      }
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
