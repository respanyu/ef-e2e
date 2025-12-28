const { By, Key } = require("selenium-webdriver");

class RegisterPage {
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

  async fillUsername(username) {
    await this.driver.findElement(By.name("username")).sendKeys(username);
  }

  async fillEmail(email) {
    await this.driver.findElement(By.name("email")).sendKeys(email);
  }

  async fillPassword(password) {
    await this.driver.findElement(By.name("password")).sendKeys(password);
  }

  async fillPasswordRepeat(passwordRepeat) {
    await this.driver
      .findElement(By.name("password_repeat"))
      .sendKeys(passwordRepeat);
  }

  async submitRegister() {
    const submitBtn = await this.driver.findElement(
      By.xpath("//button[contains(text(),'Create Account')]")
    );
    const isEnabled = await submitBtn.isEnabled();
    if (isEnabled) {
      await submitBtn.click();
    }
    return isEnabled;
  }

  async submitRegisterWithEnter() {
    // Press Enter key in the password repeat field to submit
    const passwordRepeatField = await this.driver.findElement(
      By.name("password_repeat")
    );
    await passwordRepeatField.sendKeys(Key.RETURN);
    return true; // Enter key is always "pressed"
  }

  async checkForRegisterErrors() {
    // Similar to checkForErrors
  }
}

module.exports = RegisterPage;
