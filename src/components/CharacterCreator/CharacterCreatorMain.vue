<template>
  <v-container class="character-creator">
    <h1 class="text-center">🧝‍♀️ D&D Character Creator</h1>
    <h2 class="text-center mb-6">Create your Character - Choose wisely...</h2>

    <CharacterCreatorStepper :character="character" :current-step="currentStep"
      @update:current-step="currentStep = $event" @submit-character="handleSubmitCharacter" />
  </v-container>
</template>

<script setup>
import { provide } from 'vue'
import { useCharacterData } from '@/composables/useCharacterData'
import CharacterCreatorStepper from './CharacterCreatorStepper.vue'

// Use the character data composable
const {
  character,
  currentStep,
  abilityGenerationMethod,
  rolledStats,
  rolling,
  timesRerolled,
  speciesOptions,
  classOptions,
  backgroundOptions,
  totalGP,
  carryingCapacity,
  totalWeight,
  updateAbilityModifier,
  updateAbilityModifierForAll,
  updateSpeciesTraits,
  updateClassTraits,
  updateBackgroundTraits,
  initializeCharacter,
  standardLanguages,
  alignmentOptions,
  skillList,
  abilityNames,
} = useCharacterData()

// Provide character data to all child components
provide('characterData', {
  character,
  currentStep,
  abilityGenerationMethod,
  rolledStats,
  rolling,
  timesRerolled,
  speciesOptions,
  classOptions,
  backgroundOptions,
  totalGP,
  carryingCapacity,
  totalWeight,
  updateAbilityModifier,
  updateAbilityModifierForAll,
  updateSpeciesTraits,
  updateClassTraits,
  updateBackgroundTraits,
  standardLanguages,
  alignmentOptions,
  skillList,
  abilityNames,
})

// Initialize character on component mount
initializeCharacter()

// Handle character submission
const handleSubmitCharacter = () => {
  // TODO: Implement character submission logic (Firebase save)
  console.log('Submitting character:', character)

  // Here you would typically:
  // 1. Validate the character data
  // 2. Save to Firebase
  // 3. Navigate to a success page or character sheet
}
</script>

<style scoped>
.character-creator {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
