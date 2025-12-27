const { By, until } = require("selenium-webdriver");

class CategoriesPage {
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

  async waitForCategoriesToLoad(timeout = 10000) {
    try {
      // Wait for category listings to appear
      await this.driver.wait(
        until.elementLocated(
          By.css(
            ".column.is-one-third, .category-card, [class*='category'], .p-3"
          )
        ),
        timeout
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  async getCategoriesCount() {
    try {
      const categories = await this.driver.findElements(
        By.css(".column.is-one-third, .category-card, [class*='category']")
      );
      const subcategories = await this.getSubcategoriesCount();
      return {
        categories: categories.length,
        subcategories: subcategories,
      };
    } catch (error) {
      return {
        categories: 0,
        subcategories: 0,
      };
    }
  }

  async getCategoryTitles() {
    try {
      // Try multiple selectors for category titles
      const selectors = [
        ".column.is-one-third strong p, .category-card h3, .category-card .title, [class*='category'] strong, [class*='category'] h3",
      ];

      for (let selector of selectors) {
        try {
          const titleElements = await this.driver.findElements(
            By.css(selector)
          );
          const titles = [];
          for (let element of titleElements.slice(0, 20)) {
            // Check first 20 elements
            const title = await element.getText();
            if (title && title.trim().length > 2 && title.trim().length < 100) {
              titles.push(title.trim());
            }
          }
          if (titles.length > 0) {
            console.log(`📋 Found category titles using selector: ${selector}`);
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

  async getSubcategoriesCount() {
    try {
      const subcategories = await this.driver.findElements(
        By.css(".menu-list li, .subcategory, [class*='subcategory']")
      );
      return subcategories.length;
    } catch (error) {
      return 0;
    }
  }

  async getSubcategoryDetails() {
    try {
      const subcategoryElements = await this.driver.findElements(
        By.css(".menu-list li a, .subcategory a, [class*='subcategory'] a")
      );

      const subcategories = [];
      for (let element of subcategoryElements.slice(0, 50)) {
        // Check first 50
        try {
          const text = await element.getText();
          const href = await element.getAttribute("href");

          // Extract name and count from format like "Category Name (count)"
          const match = text.match(/^(.+?)\s*\((\d+)\)$/);
          if (match) {
            subcategories.push({
              name: match[1].trim(),
              count: parseInt(match[2]),
              link: href,
            });
          }
        } catch (error) {
          continue;
        }
      }

      return subcategories;
    } catch (error) {
      return [];
    }
  }

  async checkCategoriesDisplay() {
    try {
      const categories = await this.driver.findElements(
        By.css(".column.is-one-third, .category-card, [class*='category']")
      );

      if (categories.length === 0) {
        return {
          displayed: false,
          count: 0,
          message: "No category listings found",
        };
      }

      // Check if categories have proper structure
      let validCategories = 0;
      for (let category of categories.slice(0, 10)) {
        // Check first 10 categories
        try {
          const text = await category.getText();
          if (text && text.length > 10) {
            // Basic check for meaningful content
            validCategories++;
          }
        } catch (error) {
          continue;
        }
      }

      return {
        displayed: validCategories > 0,
        count: categories.length,
        validCount: validCategories,
        message:
          validCategories > 0
            ? "Categories displayed properly"
            : "Categories found but may be malformed",
      };
    } catch (error) {
      return {
        displayed: false,
        count: 0,
        message: `Error checking categories display: ${error.message}`,
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

  async getPageLoadMetrics() {
    const metrics = await this.driver.executeScript(`
      const timing = performance.timing;
      return {
        navigationStart: timing.navigationStart,
        loadEventEnd: timing.loadEventEnd,
        domContentLoadedEventEnd: timing.domContentLoadedEventEnd,
        responseStart: timing.responseStart,
        responseEnd: timing.responseEnd,
        totalLoadTime: timing.loadEventEnd - timing.navigationStart,
        domReadyTime: timing.domContentLoadedEventEnd - timing.navigationStart,
        responseTime: timing.responseEnd - timing.responseStart
      };
    `);
    return metrics;
  }

  async validateCategoryStructure() {
    try {
      const categories = await this.driver.findElements(
        By.css(".column.is-one-third")
      );

      let validStructure = 0;
      let totalCategories = 0;

      for (let category of categories.slice(0, 5)) {
        // Check first 5 categories
        totalCategories++;
        try {
          // Check if category has title
          const titleElement = await category.findElement(
            By.css("strong p, h3, .title")
          );
          const title = await titleElement.getText();

          // Check if category has subcategories
          const subcategories = await category.findElements(
            By.css(".menu-list li")
          );

          if (title && title.trim() && subcategories.length > 0) {
            validStructure++;
          }
        } catch (error) {
          continue;
        }
      }

      return {
        totalCategories,
        validStructure,
        isValid: validStructure === totalCategories && totalCategories > 0,
      };
    } catch (error) {
      return { totalCategories: 0, validStructure: 0, isValid: false };
    }
  }

  async getPageSize() {
    const pageSize = await this.driver.executeScript(`
      const resources = performance.getEntriesByType('resource');
      let totalSize = 0;
      resources.forEach(resource => {
        if (resource.transferSize) {
          totalSize += resource.transferSize;
        }
      });
      return totalSize;
    `);
    return pageSize;
  }

  async getCurrentUrl() {
    return await this.driver.getCurrentUrl();
  }

  async navigate() {
    const url = "https://ethiofind.com/categories";
    await this.open(url);
  }

  async validateCategoriesLoaded() {
    try {
      // Wait for categories to load
      await this.waitForCategoriesToLoad(15000);

      // Check if categories are displayed
      const displayResult = await this.checkCategoriesDisplay();
      return displayResult.displayed && displayResult.count > 0;
    } catch (error) {
      return false;
    }
  }

  async validateSubcategoriesPresent() {
    try {
      const subcategories = await this.getSubcategoriesCount();
      return subcategories > 0;
    } catch (error) {
      return false;
    }
  }
}

module.exports = CategoriesPage;
