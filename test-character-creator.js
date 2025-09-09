// Quick test script to validate character creator functionality
// This file can be run in the browser console to test the character creator

console.log('Testing Character Creator functionality...');

// Test 1: Check if character store is properly initialized
try {
  const { useCharacterStore } = await import('/src/stores/characterStore.js');
  const characterStore = useCharacterStore();
  console.log('✅ Character store imported successfully');

  // Check if abilityScores are properly structured
  if (characterStore.character.abilityScores) {
    console.log('✅ Ability scores object exists');
    const abilities = [
      'strength',
      'dexterity',
      'constitution',
      'intelligence',
      'wisdom',
      'charisma',
    ];
    const allExist = abilities.every(
      ability => characterStore.character.abilityScores[ability]
    );
    console.log(
      allExist
        ? '✅ All ability scores initialized'
        : '❌ Missing ability scores'
    );
  } else {
    console.log('❌ Ability scores object missing');
  }
} catch (error) {
  console.log('❌ Error testing character store:', error);
}

// Test 2: Check API endpoint
try {
  const response = await fetch('https://www.dnd5eapi.co/api/2014/races');
  if (response.ok) {
    console.log('✅ D&D API endpoint is accessible');
  } else {
    console.log('❌ D&D API endpoint failed:', response.status);
  }
} catch (error) {
  console.log('❌ Error accessing D&D API:', error);
}

console.log('Character Creator test completed. Check the results above.');
