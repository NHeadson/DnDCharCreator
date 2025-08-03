// Test script to check if character creator is working
console.log("🧪 Testing Character Creator Functionality...");

// Test if we can navigate to step 2
setTimeout(() => {
  console.log("📍 Current URL:", window.location.href);

  // Check if stepper exists
  const stepper = document.querySelector(".v-stepper");
  if (stepper) {
    console.log("✅ Stepper component found");

    // Look for step 2 button
    const stepButtons = document.querySelectorAll(
      ".v-stepper-header .v-stepper-item"
    );
    console.log(`📊 Found ${stepButtons.length} steps`);

    if (stepButtons.length >= 2) {
      console.log("✅ Step 2 exists, attempting to click...");

      // Try to click step 2
      const step2Button = stepButtons[1];
      if (step2Button) {
        step2Button.click();
        console.log("🖱️ Clicked step 2");

        // Check if ability scores section loads
        setTimeout(() => {
          const abilityScoreSection = document.querySelector(
            ".ability-score-section-card"
          );
          if (abilityScoreSection) {
            console.log("✅ Ability scores section loaded successfully!");

            // Check for ability score grid
            const abilityGrid = document.querySelector(
              ".ability-score-grid-container"
            );
            if (abilityGrid) {
              console.log("✅ Ability score grid found");

              // Count ability score cards
              const abilityCards = document.querySelectorAll(
                ".ability-card-enhanced"
              );
              console.log(
                `⚡ Found ${abilityCards.length} ability score cards`
              );

              if (abilityCards.length === 6) {
                console.log(
                  "🎉 ALL TESTS PASSED! Character creator is working correctly."
                );
              }
            } else {
              console.log("❌ Ability score grid not found");
            }
          } else {
            console.log("❌ Ability scores section failed to load");
          }
        }, 500);
      }
    } else {
      console.log("❌ Step 2 not found");
    }
  } else {
    console.log("❌ Stepper component not found");
  }
}, 1000);
