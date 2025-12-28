const { By, Key } = require("selenium-webdriver");

class LoginPage {
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

  async fillEmail(email) {
    await this.driver.findElement(By.name("email")).sendKeys(email);
  }

  async fillPassword(password) {
    await this.driver.findElement(By.name("password")).sendKeys(password);
  }

  async submitLogin() {
    const submitBtn = await this.driver.findElement(
      By.xpath("//button[contains(text(),'Sign In')]")
    );
    const isEnabled = await submitBtn.isEnabled();
    if (isEnabled) {
      await submitBtn.click();
    }
    return isEnabled;
  }

  async submitLoginWithEnter() {
    // Press Enter key in the password field to submit
    const passwordField = await this.driver.findElement(By.name("password"));
    await passwordField.sendKeys(Key.RETURN);
    return true; // Enter key is always "pressed"
  }

  async checkForLoginErrors() {
    // Similar to checkForErrors in addBusiness
  }
}

module.exports = LoginPage;
