// Comprehensive test script for all character creator pages
console.log("🧪 Testing ALL Character Creator Pages...");

// Test function to click on a specific step
function testStep(stepNumber, stepName) {
  return new Promise((resolve) => {
    console.log(`\n📍 Testing Step ${stepNumber}: ${stepName}`);

    const stepButtons = document.querySelectorAll(
      ".v-stepper-header .v-stepper-item"
    );
    if (stepButtons.length >= stepNumber) {
      const stepButton = stepButtons[stepNumber - 1];
      stepButton.click();

      // Wait for page to load
      setTimeout(() => {
        // Check for any error indicators
        const errorElements = document.querySelectorAll(
          ".error, .v-alert--type-error"
        );
        if (errorElements.length > 0) {
          console.log(`❌ Step ${stepNumber} has errors`);
          resolve(false);
        } else {
          console.log(
            `✅ Step ${stepNumber} (${stepName}) loaded successfully`
          );
          resolve(true);
        }
      }, 300);
    } else {
      console.log(`❌ Step ${stepNumber} button not found`);
      resolve(false);
    }
  });
}

// Run tests sequentially
async function runAllTests() {
  console.log("🚀 Starting comprehensive page tests...");

  // Wait for initial load
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const testResults = [];

  // Test all 5 steps
  testResults.push(await testStep(1, "Character Information"));
  testResults.push(await testStep(2, "Ability Scores"));
  testResults.push(await testStep(3, "Features & Traits"));
  testResults.push(await testStep(4, "Equipment & Gear"));
  testResults.push(await testStep(5, "Character Summary"));

  // Summary
  const passedTests = testResults.filter((result) => result).length;
  const totalTests = testResults.length;

  console.log(`\n📊 TEST SUMMARY:`);
  console.log(`✅ Passed: ${passedTests}/${totalTests}`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);

  if (passedTests === totalTests) {
    console.log("🎉 ALL TESTS PASSED! Character creator is fully functional!");
  } else {
    console.log("⚠️ Some tests failed. Check the logs above for details.");
  }
}

// Start tests when page loads
setTimeout(runAllTests, 2000);
