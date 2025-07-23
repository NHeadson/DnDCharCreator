<template>
  <v-container class="character-creator">
    <h1 class="text-center">🧝‍♀️ D&D Character {{ isEditing ? 'Editor' : 'Creator' }}</h1>
    <h2 class="text-center mb-6">{{ isEditing ? 'Edit your Character' : 'Create your Character - Choose wisely...' }}
    </h2>

    <CharacterCreatorStepper :character="character" :current-step="currentStep" :is-editing="isEditing"
      @update:current-step="currentStep = $event" @update:character="updateCharacter"
      @submit-character="handleSubmitCharacter" />
  </v-container>
</template>

<script setup>
import { provide, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
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
const { saveCharacter, getCharacters, updateCharacter: updateExistingCharacter } = useFirestore()

// Use router for navigation
const router = useRouter()
const route = useRoute()

// Check if we're editing an existing character
const isEditing = ref(false)
const editingCharacterId = ref(null)

// Load existing character for editing
const loadExistingCharacter = async (characterId) => {
  try {
    const result = await getCharacters()
    if (result.success) {
      const existingCharacter = result.data.find(c => c.id === characterId)
      if (existingCharacter) {
        // Load character data into the form
        Object.assign(character, existingCharacter)
        isEditing.value = true
        editingCharacterId.value = characterId

        // Update species, class, and background details if needed
        if (character.species) updateSpeciesTraits()
        if (character.class) updateClassTraits()
        if (character.background) updateBackgroundTraits()

        console.log('Loaded existing character for editing:', existingCharacter)
      }
    }
  } catch (error) {
    console.error('Error loading character for editing:', error)
    alert('Error loading character for editing: ' + error.message)
  }
}

// Load API data when component mounts
onMounted(async () => {
  // Check if we're editing an existing character
  const editId = route.query.edit
  if (editId) {
    isEditing.value = true
    editingCharacterId.value = editId
  }

  // Initialize character first so form shows immediately
  initializeCharacter()

  // Then load all API data in background (parallel loading)
  await Promise.all([
    loadSpeciesData(),
    loadClassData(),
    loadBackgroundData(),
    loadEquipmentData()
  ])

  // If editing, load the existing character after API data is loaded
  if (editId) {
    await loadExistingCharacter(editId)
  }
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

// Handle character updates
const updateCharacter = (updatedCharacter) => {
  console.log('Updating character:', updatedCharacter)
  // Merge the updated character properties
  Object.assign(character, updatedCharacter)
}

// Handle character submission
const handleSubmitCharacter = async () => {
  try {
    // Validate required fields
    if (!character.name.trim()) {
      alert('Please enter a character name')
      return
    }

    if (!character.userName.trim()) {
      alert('Please enter your name (player name)')
      return
    }

    if (!character.species || !character.class || !character.background) {
      alert('Please select species, class, and background')
      return
    }

    console.log('Saving character to Firestore...', character)

    let result
    if (isEditing.value && editingCharacterId.value) {
      // Update existing character
      result = await updateExistingCharacter(editingCharacterId.value, character)

      if (result.success) {
        alert(`Character "${character.name}" updated successfully!`)
        console.log('Character updated with ID:', editingCharacterId.value)
      } else {
        throw new Error(result.error)
      }
    } else {
      // Save new character
      result = await saveCharacter(character)

      if (result.success) {
        alert(`Character "${character.name}" saved successfully!`)
        console.log('Character saved with ID:', result.id)
      } else {
        throw new Error(result.error)
      }
    }

    // Navigate to characters page to see the saved character
    router.push('/characters')

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
