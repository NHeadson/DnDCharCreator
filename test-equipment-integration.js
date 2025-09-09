// Test file to verify equipment integration
// This will help us test if the equipment data is being populated correctly

import { createApp } from "vue";
import { createPinia } from "pinia";
import { useCharacterStore } from "./stores/characterStore.js";
import { dndAPI } from "./services/dndAPI.js";

const app = createApp({});
const pinia = createPinia();
app.use(pinia);

const characterStore = useCharacterStore();

// Test function to verify equipment integration
async function testEquipmentIntegration() {
  console.log("Testing equipment integration...");

  try {
    // Test loading a class with equipment
    const fighterClass = await dndAPI.getClassDetails("fighter");
    console.log("Fighter class loaded:", fighterClass?.name);
    console.log("Starting equipment:", fighterClass?.startingEquipment);

    // Test loading a background with equipment
    const soldierBackground = await dndAPI.getBackgroundDetails("soldier");
    console.log("Soldier background loaded:", soldierBackground?.name);
    console.log("Starting equipment:", soldierBackground?.startingEquipment);

    // Test character store integration
    characterStore.setClass("fighter");
    characterStore.setBackground("soldier");

    console.log("Character class set to fighter");
    console.log("Character background set to soldier");

    // Check if equipment is populated
    setTimeout(() => {
      console.log(
        "Character equipment after selection:",
        characterStore.character.equipment
      );
    }, 1000);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

// Run the test
testEquipmentIntegration();

export default app;
