const { By } = require("selenium-webdriver");

class BusinessEditPage {
  constructor(driver) {
    this.driver = driver;
  }

  async open(url) {
    await this.driver.get(url);
    await this.driver.manage().window().maximize();
  }

  async checkForBusinessInfo() {
    try {
      console.log("🔍 Checking for business information...");

      // Check for various business-related form elements
      const businessSelectors = [
        "input[name='business']",
        "input[name='company']",
        "input[name='name']",
        "textarea[name='description']",
        "input[name='phone']",
        "input[name='email']",
        "select[name='category']",
        "input[name='address']",
        ".business-form",
        ".edit-business",
        ".business-info",
        "[data-business]",
        ".form-control",
      ];

      for (const selector of businessSelectors) {
        const elements = await this.driver.findElements(By.css(selector));
        if (elements.length > 0) {
          console.log(
            `📝 Found ${elements.length} elements with selector: ${selector}`
          );
          // Check if element has value or is visible
          for (const element of elements) {
            try {
              const isDisplayed = await element.isDisplayed();
              if (isDisplayed) {
                const tagName = await element.getTagName();
                console.log(`👁️  Visible ${tagName} element found`);
                if (
                  tagName === "input" ||
                  tagName === "textarea" ||
                  tagName === "select"
                ) {
                  const value = await element.getAttribute("value");
                  if (value && value.trim() !== "") {
                    console.log(
                      `💼 Business info found with value: ${value.substring(
                        0,
                        50
                      )}...`
                    );
                    return true; // Found business info with value
                  }
                } else {
                  console.log(`💼 Business-related element found`);
                  return true; // Found visible business-related element
                }
              }
            } catch (e) {
              // Continue checking other elements
            }
          }
        }
      }

      // Check for specific text indicating business exists
      const pageText = await this.driver
        .findElement(By.tagName("body"))
        .getText();
      const businessIndicators = [
        "business name",
        "company name",
        "edit business",
        "update business",
        "business information",
        "your business",
        "claimed business",
      ];

      for (const indicator of businessIndicators) {
        if (pageText.toLowerCase().includes(indicator)) {
          console.log(`📄 Found business indicator text: "${indicator}"`);
          return true;
        }
      }

      console.log("❌ No business information found");
      return false;
    } catch (error) {
      console.log(`❌ Error checking for business info: ${error.message}`);
      return false;
    }
  }

  async checkIfPageLoaded() {
    try {
      // Check for basic page elements that should be present
      const basicSelectors = ["body", "html", "head", "title"];

      for (const selector of basicSelectors) {
        const elements = await this.driver.findElements(By.css(selector));
        if (elements.length === 0) {
          console.log(`❌ Basic element '${selector}' not found`);
          return false;
        }
      }

      // Check for page title
      const title = await this.driver.getTitle();
      if (!title || title.trim() === "") {
        console.log("❌ Page title is empty");
        return false;
      }

      console.log(`📄 Page loaded with title: "${title}"`);

      // Check for minimum content length
      const bodyText = await this.driver
        .findElement(By.tagName("body"))
        .getText();
      if (bodyText.length < 50) {
        console.log(
          `❌ Page content too short (${bodyText.length} characters)`
        );
        return false;
      }

      console.log(`📏 Page content length: ${bodyText.length} characters`);
      return true;
    } catch (error) {
      console.log(`❌ Error checking if page loaded: ${error.message}`);
      return false;
    }
  }

  async getPageTitle() {
    return await this.driver.getTitle();
  }

  async checkForApiResponse() {
    try {
      // Check for common API response indicators
      const apiIndicators = [
        "business data",
        "api response",
        "loaded successfully",
        "data received",
        "fetch complete",
      ];

      const pageText = await this.driver
        .findElement(By.tagName("body"))
        .getText();

      for (const indicator of apiIndicators) {
        if (pageText.toLowerCase().includes(indicator)) {
          return true;
        }
      }

      // Check for JavaScript console messages (if available)
      // This is a basic check - in a real scenario you'd use browser dev tools

      // Check for form elements that would be populated by API
      const formElements = await this.driver.findElements(
        By.css("form input, form select, form textarea")
      );
      if (formElements.length > 0) {
        console.log(
          `📝 Found ${formElements.length} form elements (possible API data)`
        );
        return true;
      }

      return false;
    } catch (error) {
      console.log(`❌ Error checking for API response: ${error.message}`);
      return false;
    }
  }

  async checkForNoBusinessMessage() {
    try {
      console.log("🔍 Checking for no business messages...");

      const pageText = await this.driver
        .findElement(By.tagName("body"))
        .getText();
      const noBusinessIndicators = [
        "no business",
        "claim a business",
        "add business",
        "you haven't claimed",
        "no business found",
        "claim your business",
        "don't have a business",
        "add your business",
        "business not found",
        "no existing business",
      ];

      for (const indicator of noBusinessIndicators) {
        if (pageText.toLowerCase().includes(indicator)) {
          console.log(`📄 Found no-business indicator text: "${indicator}"`);
          return true;
        }
      }

      // Check for empty form or redirect messages
      const emptyFormSelectors = [
        ".empty-state",
        ".no-data",
        ".add-business",
        ".claim-business",
      ];

      for (const selector of emptyFormSelectors) {
        const elements = await this.driver.findElements(By.css(selector));
        if (elements.length > 0) {
          console.log(
            `📝 Found ${elements.length} elements with selector: ${selector}`
          );
          for (const element of elements) {
            try {
              const isDisplayed = await element.isDisplayed();
              if (isDisplayed) {
                console.log(`👁️  Visible empty state element found`);
                return true;
              }
            } catch (e) {
              // Continue
            }
          }
        }
      }

      console.log("❌ No no-business messages found");
      return false;
    } catch (error) {
      console.log(
        `❌ Error checking for no business message: ${error.message}`
      );
      return false;
    }
  }
}

module.exports = BusinessEditPage;
