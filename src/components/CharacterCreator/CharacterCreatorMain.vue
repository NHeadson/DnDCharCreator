<template>
  <v-container class="character-creator">
    <h1 class="text-center">🧝‍♀️ D&D Character Creator</h1>
    <h2 class="text-center mb-6">Create your Character - Choose wisely...</h2>

    <CharacterCreatorStepper :character="character" :current-step="currentStep"
      @update:current-step="currentStep = $event" @submit-character="handleSubmitCharacter" />
  </v-container>
</template>

<script setup>
import { provide, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCharacterData } from '@/composables/useCharacterData'
import { useFirestore } from '@/composables/useFirestore'
import CharacterCreatorStepper from './CharacterCreatorStepper.vue'

// Use the character data composable
const {
  character,
  currentStep,
  abilityGenerationMethod,
  rolledStats,
  rolling,
  timesRerolled,
  speciesData,
  isLoadingSpecies,
  speciesError,
  loadSpeciesData,
  classData,
  isLoadingClasses,
  classError,
  loadClassData,
  backgroundData,
  isLoadingBackgrounds,
  backgroundError,
  loadBackgroundData,
  equipmentData,
  isLoadingEquipment,
  equipmentError,
  loadEquipmentData,
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

// Use Firestore composable
const { saveCharacter } = useFirestore()

// Use router for navigation
const router = useRouter()

// Load API data when component mounts
onMounted(async () => {
  // Initialize character first so form shows immediately
  initializeCharacter()

  // Then load all API data in background (parallel loading)
  await Promise.all([
    loadSpeciesData(),
    loadClassData(),
    loadBackgroundData(),
    loadEquipmentData()
  ])
})

// Provide character data to all child components
provide('characterData', {
  character,
  currentStep,
  abilityGenerationMethod,
  rolledStats,
  rolling,
  timesRerolled,
  speciesData,
  isLoadingSpecies,
  speciesError,
  loadSpeciesData,
  classData,
  isLoadingClasses,
  classError,
  loadClassData,
  backgroundData,
  isLoadingBackgrounds,
  backgroundError,
  loadBackgroundData,
  equipmentData,
  isLoadingEquipment,
  equipmentError,
  loadEquipmentData,
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

// Handle character submission
const handleSubmitCharacter = async () => {
  try {
    // Validate required fields
    if (!character.name.trim()) {
      alert('Please enter a character name')
      return
    }

    if (!character.species || !character.class || !character.background) {
      alert('Please select species, class, and background')
      return
    }

    console.log('Saving character to Firestore...', character)

    // Save to Firestore using the composable
    const result = await saveCharacter(character)

    if (result.success) {
      alert(`Character "${character.name}" saved successfully!`)
      console.log('Character saved with ID:', result.id)

      // Navigate to characters page to see the saved character
      router.push('/characters')

    } else {
      throw new Error(result.error)
    }

  } catch (error) {
    console.error('Error saving character:', error)
    alert('Error saving character: ' + error.message)
  }
}
</script>

<style scoped>
.character-creator {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
