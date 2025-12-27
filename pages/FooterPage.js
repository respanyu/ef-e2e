const { By } = require("selenium-webdriver");

class FooterPage {
  constructor(driver) {
    this.driver = driver;
  }

  async open(url) {
    await this.driver.get(url);
    await this.driver.manage().window().maximize();
  }

  async isFooterLoaded() {
    try {
      // Check for common footer elements
      const footer = await this.driver.findElement(By.css("footer, .footer"));
      const links = await this.driver.findElements(By.css("footer a"));
      return links.length > 0;
    } catch (error) {
      return false;
    }
  }

  async getFooterText() {
    try {
      const footer = await this.driver.findElement(By.css("footer, .footer"));
      return await footer.getText();
    } catch (error) {
      return "";
    }
  }

  async getFooterLinks() {
    try {
      const links = await this.driver.findElements(
        By.css("footer a, .footer a")
      );
      const linkData = [];

      for (let link of links) {
        try {
          const text = await link.getText();
          const href = await link.getAttribute("href");
          const isVisible = await link.isDisplayed();

          if (text && text.trim() && href && isVisible) {
            linkData.push({
              text: text.trim(),
              href: href,
              element: link,
            });
          }
        } catch (error) {
          // Skip links that can't be processed
          continue;
        }
      }

      return linkData;
    } catch (error) {
      return [];
    }
  }

  async clickFooterLink(linkElement, linkText) {
    try {
      // Scroll to the link to ensure it's clickable
      await this.driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        linkElement
      );
      await this.driver.sleep(500); // Wait for scroll

      // Click the link
      await linkElement.click();
      await this.driver.sleep(2000); // Wait for navigation

      // Get the current URL after click
      const currentUrl = await this.driver.getCurrentUrl();

      return {
        success: true,
        currentUrl: currentUrl,
        expectedNavigation: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        linkText: linkText,
      };
    }
  }

  async validateFooterLink(linkData) {
    const results = [];

    for (let link of linkData) {
      try {
        console.log(`🔗 Testing footer link: "${link.text}" -> ${link.href}`);

        // Store current URL before clicking
        const originalUrl = await this.driver.getCurrentUrl();

        // Click the link
        const clickResult = await this.clickFooterLink(link.element, link.text);

        if (clickResult.success) {
          // Check if URL changed (navigation occurred)
          const newUrl = clickResult.currentUrl;

          if (newUrl !== originalUrl) {
            results.push({
              linkText: link.text,
              href: link.href,
              status: "SUCCESS",
              navigation: true,
              newUrl: newUrl,
            });
          } else {
            // URL didn't change - might be a same-page anchor or JavaScript action
            results.push({
              linkText: link.text,
              href: link.href,
              status: "SUCCESS",
              navigation: false,
              note: "Same page or JavaScript action",
            });
          }

          // Navigate back if we changed pages
          if (newUrl !== originalUrl) {
            await this.driver.navigate().back();
            await this.driver.sleep(1000);
          }
        } else {
          results.push({
            linkText: link.text,
            href: link.href,
            status: "FAILED",
            error: clickResult.error,
          });
        }
      } catch (error) {
        results.push({
          linkText: link.text,
          href: link.href,
          status: "ERROR",
          error: error.message,
        });
      }
    }

    return results;
  }

  async getFooterButtons() {
    try {
      const buttons = await this.driver.findElements(
        By.css(
          "footer button, .footer button, footer input[type='submit'], .footer input[type='submit']"
        )
      );
      const buttonData = [];

      for (let button of buttons) {
        try {
          const text = await button.getText();
          const type = (await button.getAttribute("type")) || "button";
          const isVisible = await button.isDisplayed();

          if (isVisible) {
            buttonData.push({
              text: text || "Button",
              type: type,
              element: button,
            });
          }
        } catch (error) {
          continue;
        }
      }

      return buttonData;
    } catch (error) {
      return [];
    }
  }

  async clickFooterButton(buttonElement, buttonText) {
    try {
      // Scroll to the button
      await this.driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        buttonElement
      );
      await this.driver.sleep(500);

      // Click the button
      await buttonElement.click();
      await this.driver.sleep(2000); // Wait for any action

      return {
        success: true,
        buttonText: buttonText,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        buttonText: buttonText,
      };
    }
  }
}

module.exports = FooterPage;
