function logPass(message) {
  console.log(`✅ PASS: ${message}`);
}

function logFail(message) {
  console.log(`❌ FAIL: ${message}`);
}

function logError(message) {
  console.error(`❌ FAIL: ${message}`);
}

function logWarning(message) {
  console.log(`⚠️  PASS: ${message}`);
}

function logSuccess(message) {
  console.log(`🎉 ${message}`);
}

function logInfo(message) {
  console.log(`ℹ️  ${message}`);
}

function logStart(message) {
  console.log(`🚀 ${message}`);
}

function logScreenshot(message) {
  console.log(`📸 ${message}`);
}

module.exports = {
  logPass,
  logFail,
  logError,
  logWarning,
  logSuccess,
  logStart,
  logScreenshot,
  logInfo,
};
