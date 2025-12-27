const { By, until } = require("selenium-webdriver");
const { waitForAlert } = require("./wait");
const { logFail } = require("./logger");

async function checkForErrors(driver) {
  let errorDetected = false;
  try {
    // Check for alert
    try {
      await waitForAlert(driver);
      const alert = await driver.switchTo().alert();
      const alertText = await alert.getText();
      logFail(`Alert found: ${alertText}`);
      if (
        alertText.toLowerCase().includes("email") &&
        alertText.toLowerCase().includes("already")
      ) {
        logFail("Email already used");
        errorDetected = true;
      }
      await alert.accept();
    } catch (noAlert) {
      // No alert
    }

    // Check for error messages on page
    const errorElements = await driver.findElements(
      By.css(
        ".error, .alert-danger, [class*='error'], .alert, .message.is-danger .message-body, .notification.is-danger"
      )
    );
    if (errorElements.length > 0) {
      for (let error of errorElements) {
        const errorText = await error.getText();
        if (errorText) {
          logFail(`Error message found: ${errorText}`);
          if (
            errorText.toLowerCase().includes("email") &&
            (errorText.toLowerCase().includes("already") ||
              errorText.toLowerCase().includes("exists") ||
              errorText.toLowerCase().includes("used") ||
              errorText.toLowerCase().includes("registered"))
          ) {
            logFail("Email already exists");
            errorDetected = true;
          }
          if (
            errorText.toLowerCase().includes("company") &&
            (errorText.toLowerCase().includes("already") ||
              errorText.toLowerCase().includes("exists") ||
              errorText.toLowerCase().includes("registered"))
          ) {
            logFail("Company name already exists");
            errorDetected = true;
          }
          if (
            errorText.toLowerCase().includes("claimed") &&
            errorText.toLowerCase().includes("business")
          ) {
            logFail("Business already claimed by user");
            errorDetected = true;
          }
          if (errorText.toLowerCase().includes("only claim one business")) {
            logFail("User can only claim one business");
            errorDetected = true;
          }
          if (
            errorText.toLowerCase().includes("password") &&
            errorText.toLowerCase().includes("length")
          ) {
            logFail("Password length validation failed");
            errorDetected = true;
          }
          // Check for other common errors
          if (
            errorText.toLowerCase().includes("invalid") ||
            errorText.toLowerCase().includes("required")
          ) {
            logFail(`Validation error: ${errorText}`);
            errorDetected = true;
          }
          // Login-specific errors
          if (
            errorText.toLowerCase().includes("invalid") &&
            errorText.toLowerCase().includes("credentials")
          ) {
            logFail("Invalid login credentials");
            errorDetected = true;
          }
          if (
            errorText.toLowerCase().includes("incorrect") &&
            errorText.toLowerCase().includes("password")
          ) {
            logFail("Incorrect password");
            errorDetected = true;
          }
          if (
            errorText.toLowerCase().includes("email") &&
            errorText.toLowerCase().includes("not found")
          ) {
            logFail("Email not found");
            errorDetected = true;
          }
          if (
            errorText.toLowerCase().includes("account") &&
            errorText.toLowerCase().includes("not verified")
          ) {
            logFail("Account not verified");
            errorDetected = true;
          }
          if (
            errorText.toLowerCase().includes("invalid login") ||
            (errorText.toLowerCase().includes("email") &&
              errorText.toLowerCase().includes("password") &&
              errorText.toLowerCase().includes("incorrect"))
          ) {
            logFail("Invalid login credentials");
            errorDetected = true;
          }
        }
      }
    } else {
      // Check for specific text on page
      const pageText = await driver.findElement(By.tagName("body")).getText();
      if (
        pageText.toLowerCase().includes("email already") ||
        pageText.toLowerCase().includes("company already") ||
        pageText.toLowerCase().includes("invalid credentials") ||
        pageText.toLowerCase().includes("incorrect password") ||
        pageText.toLowerCase().includes("email not found") ||
        pageText.toLowerCase().includes("account not verified") ||
        pageText.toLowerCase().includes("invalid login") ||
        pageText.toLowerCase().includes("claimed a business") ||
        pageText.toLowerCase().includes("only claim one business")
      ) {
        logFail("Business claim error found in page text");
        errorDetected = true;
      } else {
        console.log("✅ PASS: No error messages found");
      }
    }
  } catch (checkError) {
    console.log("⚠️  Could not check for errors:", checkError.message);
  }
  return errorDetected;
}

module.exports = { checkForErrors };
