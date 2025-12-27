const fs = require("fs");
const path = require("path");
const { By } = require("selenium-webdriver");
const { createDriver } = require("../../utils/driver");
const { sleep } = require("../../utils/wait");
const {
  logPass,
  logFail,
  logError,
  logWarning,
  logSuccess,
  logStart,
  logScreenshot,
} = require("../../utils/logger");
const { checkForErrors } = require("../../utils/errors");
const { takeScreenshot } = require("../../utils/screenshot");

(async function searchFormTest() {
  let driver = await createDriver();

  try {
    logStart("Starting Search Form Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    logPass("Test data loaded from JSON");

    // Step 1: Open homepage
    logPass("Step 1: Opening Homepage");
    await driver.get(testData.url);
    await driver.manage().window().maximize();
    logPass("Homepage opened and maximized");

    // Step 2: Wait for page to load
    await sleep(driver, 3000);
    logPass("Waited for page to load");

    // Step 3: Check for search form
    logPass("Step 3: Checking for Search Form");

    const searchForms = await driver.findElements(
      By.css(testData.searchFormSelector)
    );
    if (searchForms.length === 0) {
      logFail("Search form not found on the page");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "searchFormTest"
      );
      await takeScreenshot(
        driver,
        "search_form_not_found_screenshot",
        screenshotDir
      );
      return;
    }

    logPass(`Search form found (${searchForms.length} form(s))`);
    const searchForm = searchForms[0];

    // Check if form is displayed
    const formDisplayed = await searchForm.isDisplayed();
    if (!formDisplayed) {
      logFail("Search form is not displayed (hidden)");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "searchFormTest"
      );
      await takeScreenshot(
        driver,
        "search_form_hidden_screenshot",
        screenshotDir
      );
      return;
    }

    logPass("Search form is displayed");

    // Step 4: Check for search input field
    logPass("Step 4: Checking for Search Input Field");

    let searchInputs = await driver.findElements(
      By.css(testData.searchInputSelector)
    );
    if (searchInputs.length === 0) {
      logWarning(
        "Search input field not found with primary selector, trying alternative selectors"
      );

      // Try more general selectors
      const altSelectors = [
        "input[type='text']",
        "input[type='search']",
        "input[placeholder]",
        ".form-control",
        "input",
      ];

      for (const selector of altSelectors) {
        const elements = await driver.findElements(By.css(selector));
        if (elements.length > 0) {
          // Filter for input elements that might be search fields
          for (const element of elements) {
            try {
              const placeholder = await element.getAttribute("placeholder");
              const name = await element.getAttribute("name");
              const type = await element.getAttribute("type");

              if (
                (placeholder && placeholder.toLowerCase().includes("search")) ||
                (placeholder && placeholder.toLowerCase().includes("find")) ||
                (placeholder &&
                  placeholder.toLowerCase().includes("business")) ||
                (name && name.toLowerCase().includes("search")) ||
                (name && name.toLowerCase().includes("q")) ||
                type === "search"
              ) {
                searchInputs = [element];
                logPass(
                  `Found search input with alternative selector: ${selector}`
                );
                break;
              }
            } catch (e) {
              // Continue checking
            }
          }
          if (searchInputs.length > 0) break;
        }
      }
    }

    if (searchInputs.length === 0) {
      logFail("Search input field not found with any selector");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "searchFormTest"
      );
      await takeScreenshot(
        driver,
        "search_input_not_found_screenshot",
        screenshotDir
      );
      return;
    }

    logPass(`Search input field found (${searchInputs.length} input(s))`);
    const searchInput = searchInputs[0];

    // Check if input is displayed
    const inputDisplayed = await searchInput.isDisplayed();
    if (!inputDisplayed) {
      logFail("Search input field is not displayed");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "searchFormTest"
      );
      await takeScreenshot(
        driver,
        "search_input_hidden_screenshot",
        screenshotDir
      );
      return;
    }

    logPass("Search input field is displayed");

    // Check if input is enabled
    const inputEnabled = await searchInput.isEnabled();
    if (!inputEnabled) {
      logFail("Search input field is disabled");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "searchFormTest"
      );
      await takeScreenshot(
        driver,
        "search_input_disabled_screenshot",
        screenshotDir
      );
      return;
    }

    logPass("Search input field is enabled");

    // Check input attributes
    const inputType = await searchInput.getAttribute("type");
    const inputName = await searchInput.getAttribute("name");
    const inputPlaceholder = await searchInput.getAttribute("placeholder");

    logPass(`Input type: ${inputType}`);
    logPass(`Input name: ${inputName}`);
    logPass(`Input placeholder: ${inputPlaceholder}`);

    // Step 5: Check for search submit button
    logPass("Step 5: Checking for Search Submit Button");

    const searchButtons = await driver.findElements(
      By.css(testData.searchButtonSelector)
    );
    if (searchButtons.length === 0) {
      logWarning(
        "Search submit button not found with primary selector, trying alternative selectors"
      );

      // Try alternative selectors
      const altButtons = await driver.findElements(
        By.css("button, input[type='submit']")
      );
      const submitButtons = [];

      for (const btn of altButtons) {
        try {
          const btnText = await btn.getText();
          const btnType = await btn.getAttribute("type");
          const btnValue = await btn.getAttribute("value");

          if (
            btnText.toLowerCase().includes("search") ||
            btnValue?.toLowerCase().includes("search") ||
            btnType === "submit"
          ) {
            submitButtons.push(btn);
          }
        } catch (e) {
          // Continue
        }
      }

      if (submitButtons.length === 0) {
        logFail("Search submit button not found");
        const screenshotDir = path.join(
          __dirname,
          "..",
          "..",
          "reports",
          "screenshots",
          "searchFormTest"
        );
        await takeScreenshot(
          driver,
          "search_button_not_found_screenshot",
          screenshotDir
        );
        return;
      }

      logPass(`Search submit button found (${submitButtons.length} button(s))`);
    } else {
      logPass(`Search submit button found (${searchButtons.length} button(s))`);
    }

    // Step 6: Test form interaction (optional)
    logPass("Step 6: Testing Form Interaction");

    try {
      // Try to type in the search input
      await searchInput.clear();
      await searchInput.sendKeys("test search");
      logPass("Successfully typed in search input field");

      // Check if text was entered
      const enteredText = await searchInput.getAttribute("value");
      if (enteredText === "test search") {
        logPass("Search input field accepts text input correctly");
      } else {
        logWarning(
          `Text input may not work correctly. Expected: "test search", Got: "${enteredText}"`
        );
      }
    } catch (interactionError) {
      logWarning(`Form interaction test failed: ${interactionError.message}`);
    }

    // Step 7: Check for page errors
    const pageErrorDetected = await checkForErrors(driver);
    if (pageErrorDetected) {
      logFail("Page has errors that may affect search form functionality");
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "searchFormTest"
      );
      await takeScreenshot(
        driver,
        "page_error_with_search_form_screenshot",
        screenshotDir
      );
    } else {
      logSuccess(
        "Search form test completed successfully - Search form is loaded and functional"
      );
    }
  } catch (error) {
    logError(`Search form test failed: ${error}`);
    // Take screenshot on error
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "searchFormTest"
    );
    await takeScreenshot(driver, "error_screenshot", screenshotDir);
  } finally {
    await driver.quit();
  }
})();
