const { until } = require("selenium-webdriver");

async function waitForAlert(driver, timeout = 5000) {
  return await driver.wait(until.alertIsPresent(), timeout);
}

async function sleep(driver, ms) {
  await driver.sleep(ms);
}

module.exports = { waitForAlert, sleep };
