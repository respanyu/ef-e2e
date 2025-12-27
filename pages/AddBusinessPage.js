const { By } = require("selenium-webdriver");

class AddBusinessPage {
  constructor(driver) {
    this.driver = driver;
  }

  async open(url) {
    await this.driver.get(url);
    await this.driver.manage().window().maximize();
  }

  async scrollToAddBusinessSection() {
    const addBusinessSection = await this.driver.findElement(
      By.xpath("//*[contains(text(),'Add Your Business Free')]")
    );
    await this.driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      addBusinessSection
    );
  }

  async fillBusinessName(business) {
    await this.driver.findElement(By.name("business")).sendKeys(business);
  }

  async fillTelephone(phone) {
    await this.driver.findElement(By.name("phone")).sendKeys(phone);
  }

  async selectCity(city) {
    const categoryElements = await this.driver.findElements(
      By.name("category")
    );
    await categoryElements[0].sendKeys(city);
  }

  async fillEmail(email) {
    await this.driver.findElement(By.name("email")).sendKeys(email);
  }

  async selectBusinessCategory(category) {
    const categoryElements = await this.driver.findElements(
      By.name("category")
    );
    await categoryElements[1].sendKeys(category);
  }

  async submitForm() {
    const submitBtn = await this.driver.findElement(
      By.xpath("//button[contains(text(),'Add this Business')]")
    );
    const isEnabled = await submitBtn.isEnabled();
    if (isEnabled) {
      await submitBtn.click();
    }
    return isEnabled;
  }

  async getPageTitle() {
    return await this.driver.getTitle();
  }

  async checkForErrors() {
    // Implementation for error checking
    // This can be expanded based on the error detection logic
  }
}

module.exports = AddBusinessPage;
