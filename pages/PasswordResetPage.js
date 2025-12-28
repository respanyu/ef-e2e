const { By, Key } = require("selenium-webdriver");

class PasswordResetPage {
  constructor(driver) {
    this.driver = driver;
  }

  async open(url) {
    await this.driver.get(url);
    await this.driver.manage().window().maximize();
  }

  async getPageTitle() {
    return await this.driver.getTitle();
  }

  async isPasswordResetFormVisible() {
    try {
      const form = await this.driver.findElement(By.css("form[method='POST']"));
      return await form.isDisplayed();
    } catch (error) {
      return false;
    }
  }

  async getFormTitle() {
    try {
      const title = await this.driver.findElement(By.css("h1.title"));
      return await title.getText();
    } catch (error) {
      return "";
    }
  }

  async getFormDescription() {
    try {
      const description = await this.driver.findElement(
        By.css("p.description")
      );
      return await description.getText();
    } catch (error) {
      return "";
    }
  }

  async fillEmail(email) {
    const emailInput = await this.driver.findElement(By.name("email"));
    await emailInput.clear();
    await emailInput.sendKeys(email);
    return true;
  }

  async submitPasswordReset() {
    const submitBtn = await this.driver.findElement(
      By.xpath("//button[contains(text(),'Reset Password')]")
    );
    const isEnabled = await submitBtn.isEnabled();
    if (isEnabled) {
      await submitBtn.click();
    }
    return isEnabled;
  }

  async submitPasswordResetWithEnter() {
    // Press Enter key in the email field to submit
    const emailField = await this.driver.findElement(By.name("email"));
    await emailField.sendKeys(Key.RETURN);
    return true; // Enter key is always "pressed"
  }

  async isErrorMessageVisible() {
    try {
      const errorMessage = await this.driver.findElement(
        By.css(".message.is-danger .message-body")
      );
      return await errorMessage.isDisplayed();
    } catch (error) {
      return false;
    }
  }

  async getErrorMessage() {
    try {
      const errorMessage = await this.driver.findElement(
        By.css(".message.is-danger .message-body")
      );
      return await errorMessage.getText();
    } catch (error) {
      return "";
    }
  }

  async isSuccessMessageVisible() {
    try {
      const successMessage = await this.driver.findElement(
        By.css(".message.is-success .message-body")
      );
      return await successMessage.isDisplayed();
    } catch (error) {
      return false;
    }
  }

  async getSuccessMessage() {
    try {
      const successMessage = await this.driver.findElement(
        By.css(".message.is-success .message-body")
      );
      return await successMessage.getText();
    } catch (error) {
      return "";
    }
  }

  async isSignInLinkVisible() {
    try {
      const signInLink = await this.driver.findElement(
        By.xpath("//a[contains(text(),'Sign In')]")
      );
      return await signInLink.isDisplayed();
    } catch (error) {
      return false;
    }
  }

  async clickSignInLink() {
    const signInLink = await this.driver.findElement(
      By.xpath("//a[contains(text(),'Sign In')]")
    );
    await signInLink.click();
  }

  async waitForResponse(timeout = 5000) {
    await this.driver.sleep(timeout);
  }

  async checkForValidationErrors() {
    try {
      // Check for HTML5 validation or other client-side errors
      const invalidInputs = await this.driver.findElements(
        By.css("input:invalid")
      );
      return invalidInputs.length > 0;
    } catch (error) {
      return false;
    }
  }

  async getCurrentUrl() {
    return await this.driver.getCurrentUrl();
  }
}

module.exports = PasswordResetPage;
