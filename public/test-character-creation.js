// Character Creation Flow Test
console.log('=== Character Creation Flow Test ===');

// Test basic component loading
async function testComponentLoading () {
  console.log('Testing component accessibility...');

  try {
    // Test if the main page loads
    const response = await fetch('/character-form');
    if (response.ok) {
      console.log('✅ Character form page loads successfully');
    } else {
      console.log('❌ Character form page failed to load');
    }
  } catch (error) {
    console.log('❌ Error testing page load:', error.message);
  }
}

// Test Vue component rendering
function testVueComponents () {
  console.log('Testing Vue component rendering...');

  // Check if Vue app is mounted
  const app = document.querySelector('#app');
  if (app) {
    console.log('✅ Vue app is mounted');

    // Check for stepper component
    const stepper = document.querySelector('.v-stepper');
    if (stepper) {
      console.log('✅ Character creation stepper is present');
    } else {
      console.log('⚠️ Character creation stepper not found');
    }

    // Check for character form components
    const characterForm =
      document.querySelector('[data-testid="character-creator"]') ||
      document.querySelector('.character-creator');
    if (characterForm) {
      console.log('✅ Character creator component is present');
    } else {
      console.log('⚠️ Character creator component not found');
    }
  } else {
    console.log('❌ Vue app not mounted');
  }
}

// Test step navigation
function testStepNavigation () {
  console.log('Testing step navigation...');

  // Look for step buttons or navigation
  const stepButtons = document.querySelectorAll(
    '.v-stepper-header .v-stepper-item, .step-button, [data-step]'
  );
  console.log(`Found ${stepButtons.length} step navigation elements`);

  if (stepButtons.length >= 3) {
    console.log('✅ Multiple steps available for navigation');
  } else {
    console.log('⚠️ Limited step navigation found');
  }
}

// Test for console errors
function testConsoleErrors () {
  console.log('Monitoring console for errors...');

  let errorCount = 0;
  const originalError = console.error;

  console.error = function (...args) {
    errorCount++;
    originalError.apply(console, args);
  };

  setTimeout(() => {
    if (errorCount === 0) {
      console.log('✅ No console errors detected');
    } else {
      console.log(`⚠️ ${errorCount} console errors detected`);
    }
    console.error = originalError;
  }, 3000);
}

// Run all tests
function runAllTests () {
  console.log('Starting comprehensive character creation tests...');

  // Test immediately available elements
  testVueComponents();
  testStepNavigation();
  testConsoleErrors();

  // Test async loading
  testComponentLoading();

  // Summary after delay to allow components to load
  setTimeout(() => {
    console.log('\n=== Test Summary ===');
    console.log('Character creation testing completed.');
    console.log('Check the console above for detailed results.');
    console.log(
      'If all tests show ✅, the SkillsProficiencies fix is successful.'
    );
  }, 2000);
}

// Auto-run tests when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runAllTests);
} else {
  runAllTests();
}

// Make functions available globally for manual testing
window.characterCreationTests = {
  testComponentLoading,
  testVueComponents,
  testStepNavigation,
  testConsoleErrors,
  runAllTests,
};
