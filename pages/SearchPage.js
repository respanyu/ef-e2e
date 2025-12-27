const { By } = require("selenium-webdriver");

class SearchPage {
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

  async fillKeyword(keyword) {
    await this.driver.findElement(By.name("keyword")).sendKeys(keyword);
  }

  async fillCity(city) {
    await this.driver.findElement(By.name("city")).sendKeys(city);
  }

  async submitSearch() {
    const submitBtn = await this.driver.findElement(
      By.xpath("//button[contains(text(),'Find')]")
    );
    const isEnabled = await submitBtn.isEnabled();
    if (isEnabled) {
      await submitBtn.click();
    }
    return isEnabled;
  }

  async checkForSearchResults() {
    try {
      // Check for search results
      const results = await this.driver.findElements(
        By.css(".search-result, .business-card, [class*='result']")
      );
      return results.length > 0;
    } catch (error) {
      return false;
    }
  }

  async getNoResultsMessage() {
    try {
      const noResults = await this.driver.findElement(
        By.xpath(
          "//*[contains(text(),'No results found') or contains(text(),'no results')]"
        )
      );
      return await noResults.getText();
    } catch (error) {
      return "";
    }
  }
}

module.exports = SearchPage;
