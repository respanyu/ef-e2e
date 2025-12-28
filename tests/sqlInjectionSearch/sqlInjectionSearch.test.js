const fs = require("fs");
const path = require("path");
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
const SearchPage = require("../../pages/SearchPage");

(async function sqlInjectionSearchTest() {
  let driver = await createDriver();

  try {
    logStart("Starting SQL Injection Search Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    logPass("Test data loaded from JSON");

    const page = new SearchPage(driver);

    // Create screenshots directory
    const screenshotDir = path.join(
      __dirname,
      "..",
      "..",
      "reports",
      "screenshots",
      "sqlInjectionSearch"
    );

    // Test SQL injection in keyword field
    logStart("Testing SQL injection in keyword field...");
    for (let i = 0; i < testData.sqlPayloads.length; i++) {
      const payload = testData.sqlPayloads[i];
      logStart(
        `Attempt ${i + 1}: Testing payload "${payload}" in keyword field`
      );

      // Open search page
      await page.open(testData.url);
      logPass("Search page opened");

      // Fill keyword with SQL payload
      await page.fillKeyword(payload);
      logPass("Keyword field filled with SQL payload");

      // Fill city with normal value
      await page.fillCity(testData.normalCity);
      logPass("City field filled with normal value");

      // Take screenshot before submission
      try {
        await takeScreenshot(
          driver,
          `sql_injection_keyword_attempt_${i + 1}`,
          screenshotDir
        );
      } catch (screenshotError) {
        logWarning(
          `Failed to take screenshot before submission: ${screenshotError.message}`
        );
      }

      // Submit search
      const submitted = await page.submitSearch();
      if (submitted) {
        logPass("Search form submitted with SQL payload");
        await sleep(driver, 2000);

        // Check for errors or unexpected behavior
        const errorDetected = await checkForErrors(driver);
        if (errorDetected) {
          logPass(
            `SQL injection attempt ${
              i + 1
            } was blocked - proper security measures in place`
          );

          // Take screenshot after submission
          try {
            await takeScreenshot(
              driver,
              `sql_injection_keyword_result_${i + 1}`,
              screenshotDir
            );
          } catch (screenshotError) {
            logWarning(
              `Failed to take screenshot after submission: ${screenshotError.message}`
            );
          }
        } else {
          // CRITICAL SECURITY FAILURE: SQL injection payload submitted without errors
          logFail(
            `🚨 SECURITY VULNERABILITY: SQL injection payload "${payload}" was successfully submitted without errors!`
          );
          logFail(
            `🚨 This indicates the search form is vulnerable to SQL injection attacks!`
          );

          // Take screenshot of the vulnerability
          try {
            await takeScreenshot(
              driver,
              `sql_injection_vulnerability_keyword_${i + 1}`,
              screenshotDir
            );
          } catch (screenshotError) {
            logWarning(
              `Failed to take vulnerability screenshot: ${screenshotError.message}`
            );
          }

          // Stop testing immediately - we've found a critical vulnerability
          logFail(
            "🛑 STOPPING TEST: Critical security vulnerability detected in search form"
          );
          return; // Exit the test immediately
        }
      } else {
        logPass(
          `SQL injection attempt ${
            i + 1
          } was blocked at form submission level - excellent security`
        );
      }

      await sleep(driver, 1000);
    }

    // Test SQL injection in city field
    logStart("Testing SQL injection in city field...");
    for (let i = 0; i < testData.sqlPayloads.length; i++) {
      const payload = testData.sqlPayloads[i];
      logStart(`Attempt ${i + 1}: Testing payload "${payload}" in city field`);

      // Open search page
      await page.open(testData.url);
      logPass("Search page opened");

      // Fill keyword with normal value
      await page.fillKeyword(testData.normalKeyword);
      logPass("Keyword field filled with normal value");

      // Fill city with SQL payload
      await page.fillCity(payload);
      logPass("City field filled with SQL payload");

      // Take screenshot before submission
      try {
        await takeScreenshot(
          driver,
          `sql_injection_city_attempt_${i + 1}`,
          screenshotDir
        );
      } catch (screenshotError) {
        logWarning(
          `Failed to take screenshot before submission: ${screenshotError.message}`
        );
      }

      // Submit search
      const submitted = await page.submitSearch();
      if (submitted) {
        logPass("Search form submitted with SQL payload");
        await sleep(driver, 2000);

        // Check for errors or unexpected behavior
        const errorDetected = await checkForErrors(driver);
        if (errorDetected) {
          logPass(
            `SQL injection attempt ${
              i + 1
            } in city field was blocked - proper security measures in place`
          );

          // Take screenshot after submission
          try {
            await takeScreenshot(
              driver,
              `sql_injection_city_result_${i + 1}`,
              screenshotDir
            );
          } catch (screenshotError) {
            logWarning(
              `Failed to take screenshot after submission: ${screenshotError.message}`
            );
          }
        } else {
          // CRITICAL SECURITY FAILURE: SQL injection payload submitted without errors
          logFail(
            `🚨 SECURITY VULNERABILITY: SQL injection payload "${payload}" was successfully submitted in city field without errors!`
          );
          logFail(
            `🚨 This indicates the search form is vulnerable to SQL injection attacks!`
          );

          // Take screenshot of the vulnerability
          try {
            await takeScreenshot(
              driver,
              `sql_injection_vulnerability_city_${i + 1}`,
              screenshotDir
            );
          } catch (screenshotError) {
            logWarning(
              `Failed to take vulnerability screenshot: ${screenshotError.message}`
            );
          }

          // Stop testing immediately - we've found a critical vulnerability
          logFail(
            "🛑 STOPPING TEST: Critical security vulnerability detected in search form"
          );
          return; // Exit the test immediately
        }
      } else {
        logPass(
          `SQL injection attempt ${
            i + 1
          } in city field was blocked at form submission level - excellent security`
        );
      }

      await sleep(driver, 1000);
    }

    // Test combined SQL injection in both fields
    logStart(
      "Testing combined SQL injection in both keyword and city fields..."
    );
    const combinedPayload = testData.sqlPayloads[0]; // Use first payload for combined test
    logStart(`Testing combined payload "${combinedPayload}" in both fields`);

    // Open search page
    await page.open(testData.url);
    logPass("Search page opened");

    // Fill both fields with SQL payload
    await page.fillKeyword(combinedPayload);
    await page.fillCity(combinedPayload);
    logPass("Both keyword and city fields filled with SQL payload");

    // Take screenshot before submission
    try {
      await takeScreenshot(
        driver,
        "sql_injection_combined_attempt",
        screenshotDir
      );
    } catch (screenshotError) {
      logWarning(
        `Failed to take screenshot before combined submission: ${screenshotError.message}`
      );
    }

    // Submit search
    const submitted = await page.submitSearch();
    if (submitted) {
      logPass("Search form submitted with combined SQL payloads");
      await sleep(driver, 2000);

      // Check for errors or unexpected behavior
      const errorDetected = await checkForErrors(driver);
      if (errorDetected) {
        logPass(
          "Combined SQL injection attempt was blocked - proper security measures in place"
        );

        // Take screenshot after submission
        try {
          await takeScreenshot(
            driver,
            "sql_injection_combined_result",
            screenshotDir
          );
        } catch (screenshotError) {
          logWarning(
            `Failed to take screenshot after combined submission: ${screenshotError.message}`
          );
        }
      } else {
        // CRITICAL SECURITY FAILURE: Combined SQL injection payloads submitted without errors
        logFail(
          `🚨 SECURITY VULNERABILITY: Combined SQL injection payloads were successfully submitted without errors!`
        );
        logFail(
          `🚨 This indicates the search form is vulnerable to SQL injection attacks!`
        );

        // Take screenshot of the vulnerability
        try {
          await takeScreenshot(
            driver,
            "sql_injection_vulnerability_combined",
            screenshotDir
          );
        } catch (screenshotError) {
          logWarning(
            `Failed to take vulnerability screenshot: ${screenshotError.message}`
          );
        }

        // Stop testing immediately - we've found a critical vulnerability
        logFail(
          "🛑 STOPPING TEST: Critical security vulnerability detected in search form"
        );
        return; // Exit the test immediately
      }
    } else {
      logPass(
        "Combined SQL injection attempt was blocked at form submission level - excellent security"
      );
    }

    logSuccess("SQL Injection Search Test completed successfully");
  } catch (error) {
    logError(`SQL Injection Search Test failed: ${error.message}`);
    // Take error screenshot
    try {
      const screenshotDir = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "screenshots",
        "sqlInjectionSearch"
      );
      await takeScreenshot(driver, "sql_injection_search_error", screenshotDir);
    } catch (screenshotError) {
      logError(`Failed to take error screenshot: ${screenshotError.message}`);
    }
  } finally {
    await driver.quit();
  }
})();
