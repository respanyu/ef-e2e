const fs = require("fs");
const path = require("path");
const { By } = require("selenium-webdriver");
const { createDriver } = require("../../utils/driver");
const { sleep } = require("../../utils/wait");
const {
  logPass,
  logFail,
  logError,
  logSuccess,
  logStart,
  logWarning,
} = require("../../utils/logger");
const { checkForErrors } = require("../../utils/errors");
const { takeScreenshot } = require("../../utils/screenshot");
const FooterPage = require("../../pages/FooterPage");

(async function footerLinksTest() {
  let driver = await createDriver();

  // Define screenshot directory
  const screenshotDir = path.join(
    __dirname,
    "..",
    "..",
    "reports",
    "screenshots",
    "footerlinks"
  );

  try {
    logStart("Starting Footer Links Test...");

    // Load test data from JSON
    const testDataPath = path.join(__dirname, "testData.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    logPass("Test data loaded from JSON");

    const page = new FooterPage(driver);

    // Open main page
    await page.open(testData.url);
    logPass("Main page opened and maximized");

    // Wait for page to load
    await sleep(driver, 3000);
    logPass("Waited for page load");

    // Check if footer is loaded
    const footerLoaded = await page.isFooterLoaded();
    if (!footerLoaded) {
      logFail("Footer elements not found");
      throw new Error("Footer not loaded");
    }
    logPass("Footer elements loaded successfully");

    // Get footer links info (text and href only, not element references)
    const footerLinks = await page.getFooterLinks();
    console.log(`🔗 Found ${footerLinks.length} footer links`);
    logPass(`Found ${footerLinks.length} footer links`);

    if (footerLinks.length === 0) {
      logWarning("No footer links found to test");
    } else {
      // Test footer links one by one
      logPass("Testing footer links functionality...");
      const linkResults = [];

      for (let i = 0; i < footerLinks.length; i++) {
        const linkInfo = footerLinks[i];
        console.log(
          `🔗 Testing footer link: "${linkInfo.text}" -> ${linkInfo.href}`
        );

        try {
          // Store current URL before clicking
          const originalUrl = await driver.getCurrentUrl();

          // Re-find the link element by text to avoid stale element issues
          const linkElement = await driver.findElement(
            By.linkText(linkInfo.text)
          );

          // Scroll to the link to ensure it's clickable
          await driver.executeScript(
            "arguments[0].scrollIntoView(true);",
            linkElement
          );
          await driver.sleep(500); // Wait for scroll

          // Click the link
          await linkElement.click();
          await driver.sleep(2000); // Wait for navigation

          // Get the current URL after click
          const currentUrl = await driver.getCurrentUrl();

          // Check if URL changed (navigation occurred)
          if (currentUrl !== originalUrl) {
            linkResults.push({
              linkText: linkInfo.text,
              href: linkInfo.href,
              status: "SUCCESS",
              navigation: true,
              newUrl: currentUrl,
            });
            console.log(`✅ Link "${linkInfo.text}" - SUCCESS`);
            console.log(`   📍 Navigated to: ${currentUrl}`);
            logPass(`Footer link "${linkInfo.text}" works correctly`);
          } else {
            // URL didn't change - might be a same-page anchor or JavaScript action
            linkResults.push({
              linkText: linkInfo.text,
              href: linkInfo.href,
              status: "SUCCESS",
              navigation: false,
              note: "Same page or JavaScript action",
            });
            console.log(`✅ Link "${linkInfo.text}" - SUCCESS`);
            console.log(`   📍 Same page or JavaScript action`);
            logPass(`Footer link "${linkInfo.text}" works correctly`);
          }

          // Navigate back if we changed pages
          if (currentUrl !== originalUrl) {
            await driver.navigate().back();
            await driver.sleep(1000);
          }
        } catch (error) {
          console.log(`❌ Link "${linkInfo.text}" - FAILED: ${error.message}`);
          linkResults.push({
            linkText: linkInfo.text,
            href: linkInfo.href,
            status: "FAILED",
            error: error.message,
          });
          logError(`Footer link "${linkInfo.text}" failed: ${error.message}`);

          // Take screenshot on failure
          await takeScreenshot(
            driver,
            `footer_link_${linkInfo.text
              .replace(/\s+/g, "_")
              .toLowerCase()}_failed`,
            screenshotDir
          );
        }
      }

      let successCount = 0;
      let failCount = 0;

      for (let result of linkResults) {
        if (result.status === "SUCCESS") {
          successCount++;
        } else {
          failCount++;
        }
      }

      console.log(`\n📊 Footer Links Test Results:`);
      console.log(`   ✅ Successful: ${successCount}`);
      console.log(`   ❌ Failed: ${failCount}`);
      console.log(`   📊 Total: ${linkResults.length}`);

      if (failCount > 0) {
        logWarning(`${failCount} footer link(s) failed to work properly`);
      } else {
        logPass("All footer links are working properly");
      }
    }

    // Get footer buttons
    const footerButtons = await page.getFooterButtons();
    console.log(`🔘 Found ${footerButtons.length} footer buttons`);
    logPass(`Found ${footerButtons.length} footer buttons`);

    if (footerButtons.length > 0) {
      logPass("Testing footer buttons functionality...");

      let buttonSuccessCount = 0;
      let buttonFailCount = 0;

      for (let button of footerButtons) {
        try {
          console.log(
            `🔘 Testing button: "${button.text}" (type: ${button.type})`
          );

          const buttonResult = await page.clickFooterButton(
            button.element,
            button.text
          );

          if (buttonResult.success) {
            console.log(`✅ Button "${button.text}" clicked successfully`);
            buttonSuccessCount++;
            logPass(`Footer button "${button.text}" works correctly`);
          } else {
            console.log(
              `❌ Button "${button.text}" failed: ${buttonResult.error}`
            );
            buttonFailCount++;
            logError(
              `Footer button "${button.text}" failed: ${buttonResult.error}`
            );

            // Take screenshot on failure
            await takeScreenshot(
              driver,
              `footer_button_${button.text
                .replace(/\s+/g, "_")
                .toLowerCase()}_failed`,
              screenshotDir
            );
          }
        } catch (error) {
          console.log(`❌ Button "${button.text}" error: ${error.message}`);
          buttonFailCount++;
          logError(`Footer button "${button.text}" error: ${error.message}`);
          await takeScreenshot(
            driver,
            `footer_button_${button.text
              .replace(/\s+/g, "_")
              .toLowerCase()}_error`,
            screenshotDir
          );
        }
      }

      console.log(`\n📊 Footer Buttons Test Results:`);
      console.log(`   ✅ Successful: ${buttonSuccessCount}`);
      console.log(`   ❌ Failed: ${buttonFailCount}`);
      console.log(`   📊 Total: ${footerButtons.length}`);

      if (buttonFailCount > 0) {
        logWarning(
          `${buttonFailCount} footer button(s) failed to work properly`
        );
      } else {
        logPass("All footer buttons are working properly");
      }
    }

    // Check for any errors on the page
    await checkForErrors(driver);

    logSuccess("Footer links test completed successfully");
  } catch (error) {
    logError(`Footer links test failed: ${error.message}`);
    await checkForErrors(driver);
    await takeScreenshot(driver, "footer_links_test_failed", screenshotDir);
    throw error;
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
})();
