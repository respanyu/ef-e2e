const { By, until } = require("selenium-webdriver");
const CategoriesPage = require("./CategoriesPage");

class CategoryNavigationPage extends CategoriesPage {
  constructor(driver) {
    super(driver);
  }

  async clickOnFirstCategory() {
    try {
      // Try multiple selectors for clickable category elements
      const selectors = [
        ".column.is-one-third a",
        ".category-card a",
        "[class*='category'] a",
        ".p-3 a",
        "a[href*='category']",
      ];

      for (let selector of selectors) {
        try {
          const categoryLinks = await this.driver.findElements(
            By.css(selector)
          );
          if (categoryLinks.length > 0) {
            // Click on the first category link
            await categoryLinks[0].click();
            console.log(`🔗 Clicked on category using selector: ${selector}`);
            return true;
          }
        } catch (error) {
          continue;
        }
      }

      // If no links found, try clicking on the category container itself
      const categoryContainers = await this.driver.findElements(
        By.css(
          ".column.is-one-third, .category-card, [class*='category'], .p-3"
        )
      );
      if (categoryContainers.length > 0) {
        await categoryContainers[0].click();
        console.log("🔗 Clicked on first category container");
        return true;
      }

      return false;
    } catch (error) {
      console.error(`Error clicking on category: ${error.message}`);
      return false;
    }
  }

  async waitForCategoryPage(timeout = 10000) {
    try {
      // Wait for URL to change to category page
      await this.driver.wait(
        async () => {
          const currentUrl = await this.driver.getCurrentUrl();
          return (
            currentUrl.includes("/category/") &&
            !currentUrl.includes("/categories")
          );
        },
        timeout,
        "Category page did not load within timeout"
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  async getCategoryPageTitle() {
    try {
      // Try multiple selectors for category page title
      const selectors = [
        "h1",
        ".category-title",
        ".page-title",
        "[class*='title']",
        ".hero-body h1",
        ".title.is-1",
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

  async checkCategoryPageElements() {
    const elements = {
      title: false,
      businesses: false,
      breadcrumb: false,
      filters: false,
    };

    try {
      // Check for category title
      const title = await this.getCategoryPageTitle();
      elements.title = title !== null;

      // Check for business listings
      const businessSelectors = [
        ".business-card",
        ".business-listing",
        "[class*='business']",
        ".card",
        ".column.is-one-third",
      ];

      for (let selector of businessSelectors) {
        try {
          const businessElements = await this.driver.findElements(
            By.css(selector)
          );
          if (businessElements.length > 0) {
            elements.businesses = true;
            break;
          }
        } catch (error) {
          continue;
        }
      }

      // Check for breadcrumb navigation
      const breadcrumbSelectors = [
        ".breadcrumb",
        ".breadcrumb li",
        "[class*='breadcrumb']",
        ".nav",
      ];

      for (let selector of breadcrumbSelectors) {
        try {
          const breadcrumbElements = await this.driver.findElements(
            By.css(selector)
          );
          if (breadcrumbElements.length > 0) {
            elements.breadcrumb = true;
            break;
          }
        } catch (error) {
          continue;
        }
      }

      // Check for filters or search elements
      const filterSelectors = [
        ".filter",
        ".search",
        ".control",
        "[class*='filter']",
        "[class*='search']",
      ];

      for (let selector of filterSelectors) {
        try {
          const filterElements = await this.driver.findElements(
            By.css(selector)
          );
          if (filterElements.length > 0) {
            elements.filters = true;
            break;
          }
        } catch (error) {
          continue;
        }
      }
    } catch (error) {
      console.error(`Error checking category page elements: ${error.message}`);
    }

    return elements;
  }

  async getBusinessCountInCategory() {
    try {
      const businessSelectors = [
        ".business-card",
        ".business-listing",
        "[class*='business']",
        ".card",
        ".column.is-one-third",
      ];

      for (let selector of businessSelectors) {
        try {
          const businessElements = await this.driver.findElements(
            By.css(selector)
          );
          if (businessElements.length > 0) {
            return businessElements.length;
          }
        } catch (error) {
          continue;
        }
      }

      return 0;
    } catch (error) {
      return 0;
    }
  }

  async goBackToCategoriesPage() {
    try {
      await this.driver.navigate().back();
      return true;
    } catch (error) {
      console.error(`Error navigating back: ${error.message}`);
      return false;
    }
  }
}

module.exports = CategoryNavigationPage;
