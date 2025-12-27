const { By } = require("selenium-webdriver");

class HeaderPage {
  constructor(driver) {
    this.driver = driver;
  }

  async open(url) {
    await this.driver.get(url);
    await this.driver.manage().window().maximize();
  }

  async isHeaderLoaded() {
    try {
      // Check for common header elements
      const logo = await this.driver.findElement(
        By.css("header img, .logo, [class*='logo']")
      );
      const nav = await this.driver.findElement(
        By.css("nav, header nav, .navbar")
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  async getHeaderText() {
    try {
      const header = await this.driver.findElement(By.css("header"));
      return await header.getText();
    } catch (error) {
      return "";
    }
  }

  async clickLogout() {
    try {
      // Look for logout button or link
      const logoutButton = await this.driver.findElement(
        By.xpath(
          "//a[contains(text(),'Logout')] | //button[contains(text(),'Logout')] | //*[contains(@class,'logout')]"
        )
      );
      await logoutButton.click();
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = HeaderPage;
