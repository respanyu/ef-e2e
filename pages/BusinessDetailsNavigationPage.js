const { By, until } = require("selenium-webdriver");
const BusinessListingPage = require("./BusinessListingPage");

class BusinessDetailsNavigationPage extends BusinessListingPage {
  constructor(driver) {
    super(driver);
  }

  async clickOnFirstBusiness() {
    try {
      // Try multiple selectors for clickable business elements
      const selectors = [
        ".business-card a",
        ".business-listing a",
        "[class*='business'] a",
        ".card a",
        "a[href*='business']",
        ".business-name",
        "[class*='name']",
      ];

      for (let selector of selectors) {
        try {
          const businessLinks = await this.driver.findElements(
            By.css(selector)
          );
          if (businessLinks.length > 0) {
            // Click on the first business link
            await businessLinks[0].click();
            console.log(`🔗 Clicked on business using selector: ${selector}`);
            return true;
          }
        } catch (error) {
          continue;
        }
      }

      // If no links found, try clicking on the business card itself
      const businessCards = await this.driver.findElements(
        By.css(".business-card, .business-listing, [class*='business'], .card")
      );
      if (businessCards.length > 0) {
        await businessCards[0].click();
        console.log("🔗 Clicked on first business card");
        return true;
      }

      return false;
    } catch (error) {
      console.error(`Error clicking on business: ${error.message}`);
      return false;
    }
  }

  async waitForBusinessDetailsPage(timeout = 10000) {
    try {
      // Wait for URL to change to business details page
      await this.driver.wait(
        async () => {
          const currentUrl = await this.driver.getCurrentUrl();
          return (
            currentUrl.includes("/business/") &&
            !currentUrl.includes("/business/add")
          );
        },
        timeout,
        "Business details page did not load within timeout"
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  async getBusinessDetailsTitle() {
    try {
      // Try multiple selectors for business details title
      const selectors = [
        "h1",
        ".business-title",
        ".business-name",
        "[class*='title']",
        ".card-title",
      ];

      for (let selector of selectors) {
        try {
          const titleElement = await this.driver.findElement(By.css(selector));
          const title = await titleElement.getText();
          if (title && title.trim().length > 0) {
            return title.trim();
          }
        } catch (error) {
          continue;
        }
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  async checkBusinessDetailsElements() {
    const elements = {
      title: false,
      description: false,
      contact: false,
      address: false,
    };

    try {
      // Check for business title
      const title = await this.getBusinessDetailsTitle();
      elements.title = title !== null;

      // Check for description
      const descriptionSelectors = [
        ".description",
        ".business-description",
        "[class*='description']",
        "p",
      ];

      for (let selector of descriptionSelectors) {
        try {
          const descElements = await this.driver.findElements(By.css(selector));
          if (descElements.length > 0) {
            const descText = await descElements[0].getText();
            if (descText && descText.trim().length > 10) {
              elements.description = true;
              break;
            }
          }
        } catch (error) {
          continue;
        }
      }

      // Check for contact information
      const contactSelectors = [
        ".contact",
        ".phone",
        ".email",
        "[class*='contact']",
        "[class*='phone']",
        "[class*='email']",
      ];

      for (let selector of contactSelectors) {
        try {
          const contactElements = await this.driver.findElements(
            By.css(selector)
          );
          if (contactElements.length > 0) {
            elements.contact = true;
            break;
          }
        } catch (error) {
          continue;
        }
      }

      // Check for address
      const addressSelectors = [
        ".address",
        ".location",
        "[class*='address']",
        "[class*='location']",
      ];

      for (let selector of addressSelectors) {
        try {
          const addressElements = await this.driver.findElements(
            By.css(selector)
          );
          if (addressElements.length > 0) {
            elements.address = true;
            break;
          }
        } catch (error) {
          continue;
        }
      }
    } catch (error) {
      console.error(
        `Error checking business details elements: ${error.message}`
      );
    }

    return elements;
  }

  async goBackToHomePage() {
    try {
      await this.driver.navigate().back();
      return true;
    } catch (error) {
      console.error(`Error navigating back: ${error.message}`);
      return false;
    }
  }
}

module.exports = BusinessDetailsNavigationPage;
