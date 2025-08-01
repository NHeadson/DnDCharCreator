<template>
  <v-container class="character-creator">
    <h1 class="text-center">🧝‍♀️ D&D Character {{ isEditing ? 'Editor' : 'Creator' }}</h1>
    <h2 class="text-center mb-6">{{ isEditing ? 'Edit your Character' : 'Create your Character - Choose wisely...' }}
    </h2>

    <!-- Only the parent page should render the access dialog. No access dialog here. -->
    <CharacterCreatorStepper :character="character" :character-data="characterStore" :current-step="currentStep"
      :is-editing="isEditing" @submit-character="handleSubmitCharacter" @update:character="updateCharacter"
      @update:current-step="currentStep = $event" />
  </v-container>
</template>

<script setup>
import { onMounted, provide, ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCharacterStore } from '@/stores/characterStore'
import { useFirestore } from '@/composables/useFirestore'
import CharacterCreatorStepper from './CharacterCreatorStepper.vue'

// Access control
// Access control is handled by parent (character-form.vue). No dialog logic here.

// Use the character Pinia store
const characterStore = useCharacterStore()
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
  classData,
  isLoadingClasses,
  classError,
  backgroundData,
  isLoadingBackgrounds,
  backgroundError,
  equipmentData,
  isLoadingEquipment,
  equipmentError,
  // Computed and static
  // (If you have computed properties, define them here or in the store)
} = characterStore

// Use Firestore composable
const { saveCharacter, getCharacters, updateCharacter: updateExistingCharacter } = useFirestore()

// Use router for navigation
const router = useRouter()
const route = useRoute()

// Check if we're editing an existing character
const isEditing = ref(false)
const editingCharacterId = ref(null)

// Load existing character for editing
const loadExistingCharacter = async characterId => {
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

  // Optionally: initialize character state if needed
  // characterStore.reset()

  // Load all API data in background (parallel loading)
  await characterStore.loadAllData()

  // If editing, load the existing character after API data is loaded
  if (editId) {
    await loadExistingCharacter(editId)
  }
})

// Watch for access being granted after mount
// No access dialog or access state watcher here. Only data loading and character logic.

// Provide character data to all child components
provide('characterData', {
  character: characterStore.character,
  currentStep: characterStore.currentStep,
  abilityGenerationMethod: characterStore.abilityGenerationMethod,
  rolledStats: characterStore.rolledStats,
  rolling: characterStore.rolling,
  timesRerolled: characterStore.timesRerolled,
  speciesData: characterStore.speciesData,
  isLoadingSpecies: characterStore.isLoadingSpecies,
  speciesError: characterStore.speciesError,
  classData: characterStore.classData,
  isLoadingClasses: characterStore.isLoadingClasses,
  classError: characterStore.classError,
  backgroundData: characterStore.backgroundData,
  isLoadingBackgrounds: characterStore.isLoadingBackgrounds,
  backgroundError: characterStore.backgroundError,
  equipmentData: characterStore.equipmentData,
  isLoadingEquipment: characterStore.isLoadingEquipment,
  equipmentError: characterStore.equipmentError,
  // Add computed/static as needed
})

// Handle character updates
const updateCharacter = updatedCharacter => {
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
