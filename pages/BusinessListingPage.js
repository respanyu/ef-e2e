const { By, until } = require("selenium-webdriver");

class BusinessListingPage {
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

  async waitForBusinessesToLoad(timeout = 10000) {
    try {
      // Wait for business listings to appear (adjust selectors based on actual page structure)
      await this.driver.wait(
        until.elementLocated(
          By.css(
            ".business-card, .business-listing, [class*='business'], .card"
          )
        ),
        timeout
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  async getBusinessCount() {
    try {
      const businesses = await this.driver.findElements(
        By.css(".business-card, .business-listing, [class*='business'], .card")
      );
      return businesses.length;
    } catch (error) {
      return 0;
    }
  }

  async getBusinessTitles() {
    try {
      // Try multiple selectors for business titles
      const selectors = [
        ".business-card h3",
        ".business-card .title",
        ".business-listing h3",
        ".business-listing .title",
        "[class*='business'] h3",
        "[class*='business'] .title",
        ".card h3",
        ".card .title",
        "h3",
        ".business-name",
        "[class*='name']",
        "a[href*='business']",
      ];

      for (let selector of selectors) {
        try {
          const titleElements = await this.driver.findElements(
            By.css(selector)
          );
          const titles = [];
          for (let element of titleElements.slice(0, 10)) {
            // Check first 10 elements
            const title = await element.getText();
            if (title && title.trim().length > 2 && title.trim().length < 100) {
              // Reasonable title length
              titles.push(title.trim());
            }
          }
          if (titles.length > 0) {
            console.log(`📋 Found titles using selector: ${selector}`);
            return titles;
          }
        } catch (error) {
          continue;
        }
      }

      return [];
    } catch (error) {
      return [];
    }
  }

  async checkBusinessDisplay() {
    try {
      const businesses = await this.driver.findElements(
        By.css(".business-card, .business-listing, [class*='business'], .card")
      );

      if (businesses.length === 0) {
        return {
          displayed: false,
          count: 0,
          message: "No business listings found",
        };
      }

      // Check if at least one business has proper content
      let validBusinesses = 0;
      for (let business of businesses.slice(0, 5)) {
        // Check first 5 businesses
        try {
          const text = await business.getText();
          if (text && text.trim().length > 10) {
            // Basic check for meaningful content
            validBusinesses++;
          }
        } catch (error) {
          continue;
        }
      }

      return {
        displayed: validBusinesses > 0,
        count: businesses.length,
        validCount: validBusinesses,
        message:
          validBusinesses > 0
            ? "Businesses displayed properly"
            : "Businesses found but may be empty or malformed",
      };
    } catch (error) {
      return {
        displayed: false,
        count: 0,
        message: `Error checking business display: ${error.message}`,
      };
    }
  }

  async checkForLoadingIndicator() {
    try {
      const loadingElements = await this.driver.findElements(
        By.css(".loading, .spinner, [class*='loading'], [class*='spinner']")
      );
      return loadingElements.length > 0;
    } catch (error) {
      return false;
    }
  }

  async checkForErrorMessages() {
    try {
      const errorElements = await this.driver.findElements(
        By.css(".error, .alert-danger, [class*='error'], [class*='alert']")
      );
      if (errorElements.length > 0) {
        const errorText = await errorElements[0].getText();
        return errorText;
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}

module.exports = BusinessListingPage;
