const { By, until, Select } = require("selenium-webdriver");

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

  async fillBusinessForm(updateData) {
    try {
      console.log("📝 Filling business update form...");

      let fieldsFilled = 0;
      let totalFields = 0;

      // Fill company/business name
      totalFields++;
      if (updateData.companyName) {
        const nameSelectors = [
          "input[name='business']",
          "input[name='company']",
          "input[name='name']",
          "input[placeholder*='name']",
          "input[placeholder*='company']",
        ];

        for (const selector of nameSelectors) {
          try {
            const elements = await this.driver.findElements(By.css(selector));
            if (elements.length > 0) {
              await elements[0].clear();
              await elements[0].sendKeys(updateData.companyName);
              console.log(`✅ Filled company name: ${updateData.companyName}`);
              fieldsFilled++;
              break;
            }
          } catch (error) {
            continue;
          }
        }
      }

      // Fill description
      totalFields++;
      if (updateData.description) {
        const descSelectors = [
          "textarea[name='description']",
          "textarea[placeholder*='description']",
          "textarea",
        ];

        for (const selector of descSelectors) {
          try {
            const elements = await this.driver.findElements(By.css(selector));
            if (elements.length > 0) {
              await elements[0].clear();
              await elements[0].sendKeys(updateData.description);
              console.log(`✅ Filled description: ${updateData.description}`);
              fieldsFilled++;
              break;
            }
          } catch (error) {
            continue;
          }
        }
      }

      // Fill phone
      totalFields++;
      if (updateData.phone) {
        const phoneSelectors = [
          "input[name='phone']",
          "input[name='telephone']",
          "input[placeholder*='phone']",
          "input[type='tel']",
        ];

        for (const selector of phoneSelectors) {
          try {
            const elements = await this.driver.findElements(By.css(selector));
            if (elements.length > 0) {
              await elements[0].clear();
              await elements[0].sendKeys(updateData.phone);
              console.log(`✅ Filled phone: ${updateData.phone}`);
              fieldsFilled++;
              break;
            }
          } catch (error) {
            continue;
          }
        }
      }

      // Fill email
      totalFields++;
      if (updateData.email) {
        const emailSelectors = [
          "input[name='email']",
          "input[type='email']",
          "input[placeholder*='email']",
        ];

        for (const selector of emailSelectors) {
          try {
            const elements = await this.driver.findElements(By.css(selector));
            if (elements.length > 0) {
              await elements[0].clear();
              await elements[0].sendKeys(updateData.email);
              console.log(`✅ Filled email: ${updateData.email}`);
              fieldsFilled++;
              break;
            }
          } catch (error) {
            continue;
          }
        }
      }

      // Fill address
      totalFields++;
      if (updateData.address) {
        const addressSelectors = [
          "input[name='address']",
          "textarea[name='address']",
          "input[placeholder*='address']",
        ];

        for (const selector of addressSelectors) {
          try {
            const elements = await this.driver.findElements(By.css(selector));
            if (elements.length > 0) {
              await elements[0].clear();
              await elements[0].sendKeys(updateData.address);
              console.log(`✅ Filled address: ${updateData.address}`);
              fieldsFilled++;
              break;
            }
          } catch (error) {
            continue;
          }
        }
      }

      // Fill city
      totalFields++;
      if (updateData.city) {
        const citySelectors = [
          "input[name='city']",
          "input[placeholder*='city']",
          "select[name='city']",
        ];

        for (const selector of citySelectors) {
          try {
            const elements = await this.driver.findElements(By.css(selector));
            if (elements.length > 0) {
              if (selector.includes("select")) {
                const select = new Select(elements[0]);
                await select.selectByVisibleText(updateData.city);
              } else {
                await elements[0].clear();
                await elements[0].sendKeys(updateData.city);
              }
              console.log(`✅ Filled city: ${updateData.city}`);
              fieldsFilled++;
              break;
            }
          } catch (error) {
            continue;
          }
        }
      }

      // Fill products and services
      totalFields++;
      if (updateData.products_or_services || updateData.products) {
        const value = updateData.products_or_services || updateData.products;
        const productsSelectors = [
          "input[name='products_or_services']",
          "input[placeholder*='products']",
          "input[placeholder*='services']",
          "textarea[name='products_or_services']",
        ];

        for (const selector of productsSelectors) {
          try {
            const elements = await this.driver.findElements(By.css(selector));
            if (elements.length > 0) {
              await elements[0].clear();
              await elements[0].sendKeys(value);
              console.log(`✅ Filled products/services: ${value}`);
              fieldsFilled++;
              break;
            }
          } catch (error) {
            continue;
          }
        }
      }

      // Fill website
      totalFields++;
      if (updateData.website) {
        const websiteSelectors = [
          "input[name='website']",
          "input[placeholder*='website']",
          "input[type='url']",
        ];

        for (const selector of websiteSelectors) {
          try {
            const elements = await this.driver.findElements(By.css(selector));
            if (elements.length > 0) {
              await elements[0].clear();
              await elements[0].sendKeys(updateData.website);
              console.log(`✅ Filled website: ${updateData.website}`);
              fieldsFilled++;
              break;
            }
          } catch (error) {
            continue;
          }
        }
      }

      // Fill subcategory (always try to select from available options)
      totalFields++;
      console.log(
        `Looking for subcategory dropdown to select from available options`
      );
      const subcategorySelectors = [
        "select[name='subcategory']",
        "select[id='category-field']",
        "#category-field",
      ];

      let subcategoryFound = false;
      for (const selector of subcategorySelectors) {
        try {
          console.log(`Trying subcategory selector: ${selector}`);
          const elements = await this.driver.findElements(By.css(selector));
          console.log(
            `Found ${elements.length} elements for selector: ${selector}`
          );
          if (elements.length > 0) {
            const select = new Select(elements[0]);

            // First, get all available options
            const options = await select.getOptions();
            console.log(`Available subcategories: ${options.length}`);
            const availableSubcategories = [];
            for (const option of options) {
              const text = await option.getText();
              const value = await option.getAttribute("value");
              if (text && text.trim() !== "") {
                availableSubcategories.push({
                  text: text.trim(),
                  value: value,
                });
                console.log(`  - ${text.trim()} (value: ${value})`);
              }
            }

            // Try to find a matching subcategory from updateData
            let selectedSubcategory = null;
            if (updateData.subcategory) {
              for (const subcategory of availableSubcategories) {
                if (
                  subcategory.text
                    .toLowerCase()
                    .includes(updateData.subcategory.toLowerCase()) ||
                  subcategory.value === updateData.subcategory
                ) {
                  selectedSubcategory = subcategory;
                  break;
                }
              }
            }

            // If no match found or no subcategory specified, select the first valid option (excluding "Choose a Subcategory")
            if (!selectedSubcategory) {
              const validOptions = availableSubcategories.filter(
                (sub) =>
                  sub.text !== "" &&
                  !sub.text.toLowerCase().includes("choose") &&
                  sub.value !== ""
              );
              if (validOptions.length > 0) {
                selectedSubcategory = validOptions[0]; // Select first valid subcategory
                console.log(
                  `✅ Selected first available subcategory: ${selectedSubcategory.text} (fallback)`
                );
              }
            }

            if (selectedSubcategory) {
              await select.selectByVisibleText(selectedSubcategory.text);
              console.log(
                `✅ Selected subcategory: ${selectedSubcategory.text} (from available choices)`
              );
              subcategoryFound = true;
              fieldsFilled++;
            }
            break;
          }
        } catch (error) {
          console.log(`Failed to select subcategory: ${error.message}`);
          continue;
        }
      }

      if (!subcategoryFound) {
        console.log(
          `⚠️ Subcategory dropdown not found or could not be selected`
        );
      }

      // Select category
      totalFields++;
      if (updateData.category) {
        console.log(
          `Looking for category dropdown to select: ${updateData.category}`
        );
        const categorySelectors = [
          "select[name='category']",
          "select[name='business_category']",
          "select[id*='category']",
          "select[placeholder*='category']",
        ];

        let categoryFound = false;
        for (const selector of categorySelectors) {
          try {
            console.log(`Trying category selector: ${selector}`);
            const elements = await this.driver.findElements(By.css(selector));
            console.log(
              `Found ${elements.length} elements for selector: ${selector}`
            );
            if (elements.length > 0) {
              const select = new Select(elements[0]);

              // First, get all available options
              const options = await select.getOptions();
              console.log(`Available categories: ${options.length}`);
              const availableCategories = [];
              for (const option of options) {
                const text = await option.getText();
                const value = await option.getAttribute("value");
                if (text && text.trim() !== "") {
                  availableCategories.push({ text: text.trim(), value: value });
                  console.log(`  - ${text.trim()} (value: ${value})`);
                }
              }

              // Try to find a matching category from available options
              let selectedCategory = null;
              for (const category of availableCategories) {
                if (
                  category.text
                    .toLowerCase()
                    .includes(updateData.category.toLowerCase()) ||
                  category.value
                    .toLowerCase()
                    .includes(updateData.category.toLowerCase())
                ) {
                  selectedCategory = category;
                  break;
                }
              }

              if (selectedCategory) {
                await select.selectByVisibleText(selectedCategory.text);
                console.log(
                  `✅ Selected category: ${selectedCategory.text} (from available choices)`
                );
                categoryFound = true;
              } else {
                // If no match found, select the first available option (excluding empty/default)
                const validOptions = availableCategories.filter(
                  (cat) =>
                    cat.text !== "" &&
                    !cat.text.toLowerCase().includes("select")
                );
                if (validOptions.length > 0) {
                  await select.selectByVisibleText(validOptions[0].text);
                  console.log(
                    `✅ Selected first available category: ${validOptions[0].text} (fallback)`
                  );
                  categoryFound = true;
                }
              }
              break;
            }
          } catch (error) {
            console.log(`Failed to select category: ${error.message}`);
            continue;
          }
        }

        if (categoryFound) {
          fieldsFilled++;
        } else {
          console.log(
            `⚠️ Category dropdown not found or could not be selected: ${updateData.category}`
          );
        }
      }

      console.log(
        `📊 Form filling summary: ${fieldsFilled}/${totalFields} fields filled successfully`
      );

      // Consider it successful if at least some fields were filled
      return fieldsFilled > 0;
    } catch (error) {
      console.error(`Error filling business form: ${error.message}`);
      return false;
    }
  }

  async submitBusinessUpdate() {
    try {
      console.log("📤 Submitting business update...");

      // First, try to find buttons within business edit forms
      const formSelectors = [
        "form[action*='edit'] button[type='submit']",
        "form[action*='update'] button[type='submit']",
        "form[method='post'] button[type='submit']",
        ".business-form button[type='submit']",
        ".edit-business button[type='submit']",
      ];

      for (const selector of formSelectors) {
        try {
          const elements = await this.driver.findElements(By.css(selector));
          if (elements.length > 0) {
            // Check button text to ensure it's an update button
            const buttonText = await elements[0].getText();
            console.log(`Found form submit button with text: "${buttonText}"`);
            if (
              buttonText.toLowerCase().includes("update") ||
              buttonText.toLowerCase().includes("save") ||
              buttonText.toLowerCase().includes("submit") ||
              buttonText === ""
            ) {
              // Empty text is common for submit buttons
              await elements[0].click();
              console.log(
                `✅ Clicked form submit button using CSS: ${selector}`
              );

              // Wait a moment for form submission to start
              await this.driver.sleep(1000);
              return true;
            }
          }
        } catch (error) {
          continue;
        }
      }

      // Fallback to general submit selectors but be more careful
      const submitSelectors = [
        "button[type='submit']:not([formaction*='search'])",
        "input[type='submit']:not([formaction*='search'])",
        "button:contains('Update')",
        "button:contains('Save')",
        "button:contains('Submit')",
        "input[value='Update']",
        "input[value='Save']",
        "input[value='Submit']",
      ];

      for (const selector of submitSelectors) {
        try {
          if (selector.includes(":contains")) {
            const xpathSelector = selector
              .replace("button:contains('", "//button[contains(text(),'")
              .replace("')]", "')]");
            const elements = await this.driver.findElements(
              By.xpath(xpathSelector)
            );
            if (elements.length > 0) {
              await elements[0].click();
              console.log(
                `✅ Clicked submit button using XPath: ${xpathSelector}`
              );

              // Wait a moment for form submission to start
              await this.driver.sleep(1000);
              return true;
            }
          } else {
            const elements = await this.driver.findElements(By.css(selector));
            if (elements.length > 0) {
              await elements[0].click();
              console.log(`✅ Clicked submit button using CSS: ${selector}`);

              // Wait a moment for form submission to start
              await this.driver.sleep(1000);
              return true;
            }
          }
        } catch (error) {
          continue;
        }
      }

      return false;
    } catch (error) {
      console.error(`Error submitting business update: ${error.message}`);
      return false;
    }
  }

  async waitForUpdateCompletion(timeout = 20000) {
    try {
      console.log("⏳ Waiting for business update API response...");

      // First, wait for any loading indicators to disappear
      console.log("Waiting for loading indicators to disappear...");
      await this.driver
        .wait(
          async () => {
            const loadingSelectors = [
              ".loading",
              ".spinner",
              "[class*='loading']",
              "[class*='spinner']",
              ".is-loading",
              "button:disabled",
              "input:disabled",
            ];

            for (const selector of loadingSelectors) {
              const elements = await this.driver.findElements(By.css(selector));
              if (elements.length > 0) {
                console.log(
                  `Still loading: found ${elements.length} loading elements`
                );
                return false; // Still loading
              }
            }
            return true; // No loading indicators found
          },
          10000, // Wait up to 10 seconds for loading to complete
          "Loading indicators did not disappear"
        )
        .catch(() => {
          console.log(
            "No loading indicators found or they disappeared quickly"
          );
        });

      // Wait a bit more for API response processing
      await this.driver.sleep(2000);

      // Check current state
      const currentUrl = await this.driver.getCurrentUrl();
      const pageText = await this.driver
        .findElement(By.tagName("body"))
        .getText();

      console.log(`Current URL after update: ${currentUrl}`);

      // Check for API success indicators
      const successIndicators = [
        "updated successfully",
        "business updated",
        "changes saved",
        "update successful",
        "saved successfully",
        "success",
        "updated",
        "saved",
        "your business has been updated",
        "changes have been saved",
        "data saved",
        "record updated",
      ];

      let successFound = false;
      for (const indicator of successIndicators) {
        if (pageText.toLowerCase().includes(indicator)) {
          console.log(`✅ Found API success indicator: "${indicator}"`);
          successFound = true;
          break;
        }
      }

      // Check for API error indicators
      const errorIndicators = [
        "error",
        "failed",
        "invalid",
        "required",
        "please fill",
        "cannot be empty",
        "api error",
        "server error",
        "network error",
        "update failed",
        "save failed",
        "validation error",
      ];

      let errorFound = false;
      for (const indicator of errorIndicators) {
        if (pageText.toLowerCase().includes(indicator)) {
          console.log(`❌ Found API error indicator: "${indicator}"`);
          errorFound = true;
        }
      }

      // Check for specific success/error elements
      const successSelectors = [
        ".alert-success",
        ".success-message",
        "[class*='success']",
        ".notification-success",
        ".toast-success",
      ];

      for (const selector of successSelectors) {
        try {
          const elements = await this.driver.findElements(By.css(selector));
          if (elements.length > 0 && (await elements[0].isDisplayed())) {
            console.log(`✅ Found success element: ${selector}`);
            successFound = true;
            break;
          }
        } catch (e) {
          // Continue
        }
      }

      const errorSelectors = [
        ".alert-danger",
        ".alert-error",
        ".error-message",
        "[class*='error']",
        "[class*='danger']",
        ".notification-error",
        ".toast-error",
      ];

      for (const selector of errorSelectors) {
        try {
          const elements = await this.driver.findElements(By.css(selector));
          if (elements.length > 0 && (await elements[0].isDisplayed())) {
            console.log(`❌ Found error element: ${selector}`);
            errorFound = true;
          }
        } catch (e) {
          // Continue
        }
      }

      // Determine result
      if (successFound && !errorFound) {
        console.log("🎉 Business update completed successfully");
        return { success: true, message: "Update successful" };
      } else if (errorFound) {
        console.log("💥 Business update failed with errors");
        return { success: false, message: "Update failed with errors" };
      } else if (currentUrl.includes("/business/edit") && !errorFound) {
        console.log(
          "📝 Still on edit page with no errors - update may have completed"
        );
        return {
          success: true,
          message: "Update completed (stayed on edit page)",
        };
      } else if (
        currentUrl.includes("/user/business") ||
        currentUrl.includes("/profile") ||
        (!currentUrl.includes("/business/edit") &&
          !currentUrl.includes("/search"))
      ) {
        console.log("🔄 URL changed - update process completed");
        return { success: true, message: "Update completed (URL changed)" };
      } else {
        console.log("❓ API response check completed - indeterminate result");
        return { success: null, message: "Update status indeterminate" };
      }
    } catch (error) {
      console.log(`API response wait failed: ${error.message}`);
      return { success: null, message: `Wait failed: ${error.message}` };
    }
  }
}

module.exports = BusinessEditPage;
