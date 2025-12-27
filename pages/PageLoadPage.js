const { By } = require("selenium-webdriver");

class PageLoadPage {
  constructor(driver) {
    this.driver = driver;
  }

  async open(url) {
    const startTime = Date.now();
    await this.driver.get(url);
    await this.driver.manage().window().maximize();
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    return loadTime;
  }

  async getPageTitle() {
    return await this.driver.getTitle();
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
}

module.exports = PageLoadPage;
