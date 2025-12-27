const fs = require("fs");
const path = require("path");

function loadTestData() {
  const testDataPath = path.join(__dirname, "..", "tests/addBusiness", "testData.json");
  return JSON.parse(fs.readFileSync(testDataPath, "utf8"));
}

module.exports = { loadTestData };
