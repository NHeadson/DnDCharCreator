<template>
  <v-container class="character-creator" fluid>
    <div class="text-center mb-6">
      <h1 class="text-h4 text-md-h3">🧝‍♀️ D&D Character {{ isEditing ? 'Editor' : 'Creator' }}</h1>
      <h2 class="text-h6 text-md-h5 mb-6">{{ isEditing ? 'Edit your Character' : 'Create your Character - Choose wisely...' }}</h2>
    </div>

    <!-- Only the parent page should render the access dialog. No access dialog here. -->
    <CharacterCreatorStepper :character="character" :character-data="characterStore" :current-step="currentStep"
      :is-editing="isEditing" @submit-character="handleSubmitCharacter" @update:character="updateCharacter"
      @update:current-step="currentStep = $event" />

    <!-- Success Dialog with Create Another Option -->
    <v-dialog v-model="showSuccessDialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="d-flex align-center text-h5">
          <v-icon class="me-2" color="success">mdi-check-circle</v-icon>
          Character {{ isEditing ? 'Updated' : 'Created' }}!
        </v-card-title>
        <v-card-text class="text-body-1">
          <p class="mb-3">
            <strong>"{{ character.name }}"</strong> has been {{ isEditing ? 'updated' : 'created' }} successfully!
          </p>
          <v-alert class="mb-0" type="success" variant="tonal">
            {{ isEditing ? 'Your changes have been saved.' : 'Your character is now ready for adventure!' }}
          </v-alert>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-btn variant="outlined" @click="viewCharacters">
            View All Characters
          </v-btn>
          <v-spacer />
          <v-btn v-if="!isEditing" color="primary" prepend-icon="mdi-plus" variant="elevated" @click="createAnother">
            Create Another
          </v-btn>
          <v-btn v-else color="primary" variant="elevated" @click="viewCharacters">
            Done
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { computed, onMounted, provide, ref, watch } from 'vue'
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

// Reactive data
const showSuccessDialog = ref(false)

// Check if we're editing an existing character
const isEditing = ref(false)
const editingCharacterId = ref(null)

// Watch for class details changes and update class traits
watch(
  () => character.classDetails,
  newDetails => {
    if (newDetails) {
      characterStore.updateClassTraits();
    }
  }
)

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

        // Initialize loaded character data structures
        characterStore.initializeFromLoadedData()

        // Update species, class, and background details if needed
        if (character.species) characterStore.updateSpeciesTraits()
        if (character.class) characterStore.updateClassTraits()
        if (character.background) characterStore.updateBackgroundTraits()

        // Restore calculated states if they exist
        if (existingCharacter.finalAbilityScores) {
          Object.keys(existingCharacter.finalAbilityScores).forEach(ability => {
            if (character.abilityScores[ability]) {
              Object.assign(character.abilityScores[ability], existingCharacter.finalAbilityScores[ability]);
            }
          });
        }

        if (existingCharacter.allTraits) {
          character.derivedTraits = character.derivedTraits || { species: [], lineage: [], class: [], background: [], combined: [] };
          character.derivedTraits.combined = existingCharacter.allTraits;
        }

        // Validate and recalculate to ensure consistency
        const validation = characterStore.validateAndRecalculate();
        if (!validation.isValid) {
          console.warn('Loaded character has validation issues:', validation.issues);
          console.log('Re-running trait calculations...');

          // Force recalculation of all traits and bonuses
          if (character.species) characterStore.updateSpeciesTraits();
          if (character.class) characterStore.updateClassTraits();
          if (character.background) characterStore.updateBackgroundTraits();
        }

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
  // Add the update functions
  updateSpeciesTraits: characterStore.updateSpeciesTraits,
  updateClassTraits: characterStore.updateClassTraits,
  updateBackgroundTraits: characterStore.updateBackgroundTraits,
  updateLineageTraits: characterStore.updateLineageTraits,
})

// Handle character updates
const updateCharacter = updatedCharacter => {
  console.log('Updating character:', updatedCharacter)
  // Merge the updated character properties
  Object.assign(character, updatedCharacter)
}

// Utility: Ensure all ability scores are numbers before saving
function normalizeAbilityScores(char) {
  const statKeys = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']
  for (const key of statKeys) {
    if (char[key] !== undefined && char[key] !== null && typeof char[key] !== 'number') {
      char[key] = Number(char[key])
    }
  }
}

// Handle character submission
const handleSubmitCharacter = async () => {
  try {
    // Validate required fields
    if (!character.name.trim()) {
      alert('Please enter a character name')
      return
    }

    if (!character.playerName.trim()) {
      alert('Please enter your name (player name)')
      return
    }

    if (!character.species || !character.class || !character.background) {
      alert('Please select species, class, and background')
      return
    }

    // Validate and recalculate all bonuses before saving
    const validation = characterStore.validateAndRecalculate();
    if (!validation.isValid) {
      console.warn('Character validation issues found:', validation.issues);
      // Log issues but don't block save (might be expected edge cases)
    }

    // Convert ability scores to numbers before saving
    normalizeAbilityScores(character)

    // Prepare enhanced character data for persistence
    const characterData = {
      ...character,
      // Include calculated values
      finalAbilityScores: Object.fromEntries(
        Object.entries(character.abilityScores).map(([key, value]) => [
          key,
          {
            ...value,
            finalScore: value.finalScore || value.score,
            totalBonuses: Object.values(value.bonuses || {}).reduce((sum, bonus) => sum + bonus, 0)
          }
        ])
      ),
      // Include combined traits
      allTraits: character.derivedTraits?.combined || [],
      // Metadata for restoration
      calculationMetadata: {
        lastCalculated: new Date().toISOString(),
        validation: validation,
        speciesAbilityBonuses: character.speciesDetails?.abilityBonus || [],
        lineageAbilityBonuses: character.speciesDetails?.lineages?.find(
          l => l.id === character.speciesLineage
        )?.abilityBonus || []
      }
    };

    console.log('Saving enhanced character to Firestore...', characterData)

    let result
    if (isEditing.value && editingCharacterId.value) {
      // Update existing character
      result = await updateExistingCharacter(editingCharacterId.value, characterData)

      if (result.success) {
        console.log('Character updated with ID:', editingCharacterId.value)
        showSuccessDialog.value = true
      } else {
        throw new Error(result.error)
      }
    } else {
      // Save new character
      result = await saveCharacter(characterData)

      if (result.success) {
        console.log('Character saved with ID:', result.id)
        showSuccessDialog.value = true
      } else {
        throw new Error(result.error)
      }
    }
  } catch (error) {
    console.error('Error saving character:', error)
    alert('Error saving character: ' + error.message)
  }
}

// Dialog actions
const viewCharacters = () => {
  showSuccessDialog.value = false
  // Force page refresh to clear form state
  window.location.href = '/characters'
}

const createAnother = () => {
  showSuccessDialog.value = false
  // Force page refresh to completely clear the form
  window.location.reload()
}
</script>

<style scoped>
.character-creator {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
}

/* Mobile responsive adjustments */
@media (max-width: 960px) {
  .character-creator {
    padding: 8px;
  }

  .character-creator h1 {
    font-size: 2rem !important;
  }

  .character-creator h2 {
    font-size: 1.25rem !important;
  }
}

@media (max-width: 600px) {
  .character-creator {
    padding: 4px;
  }

  .character-creator h1 {
    font-size: 1.75rem !important;
  }

  .character-creator h2 {
    font-size: 1.1rem !important;
  }
}
</style>
