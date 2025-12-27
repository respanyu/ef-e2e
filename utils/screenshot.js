const fs = require("fs");
const path = require("path");
const { logScreenshot } = require("./logger");

async function takeScreenshot(driver, filename, screenshotDir) {
  try {
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
    const screenshot = await driver.takeScreenshot();
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const screenshotPath = path.join(
      screenshotDir,
      `${filename}_${timestamp}.png`
    );
    fs.writeFileSync(screenshotPath, screenshot, "base64");
    logScreenshot(`Screenshot saved: ${screenshotPath}`);
    return screenshotPath;
  } catch (error) {
    console.error("Failed to take screenshot:", error);
    return null;
  }
}

module.exports = { takeScreenshot };
