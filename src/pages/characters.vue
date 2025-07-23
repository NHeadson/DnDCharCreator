<template>
  <div class="characters-page">
    <v-container>
      <h1 class="text-center my-4">🎭 Saved Characters</h1>

      <div v-if="loading" class="text-center pa-4">
        <v-progress-circular indeterminate />
        <p>Loading characters...</p>
      </div>

      <div v-else-if="error" class="text-center pa-4">
        <v-alert type="error" class="mb-4">
          {{ error }}
        </v-alert>
        <v-btn @click="loadCharacters">Try Again</v-btn>
      </div>

      <div v-else-if="characters.length === 0" class="text-center pa-8">
        <v-icon size="64" class="mb-4">mdi-account-off</v-icon>
        <h2>No Characters Found</h2>
        <p class="mb-4">You haven't created any characters yet.</p>
        <v-btn color="#822522" to="/character-form">Create Your First Character</v-btn>
      </div>

      <v-row v-else>
        <v-col v-for="character in characters" :key="character.id" cols="12" md="6" lg="4">
          <v-card class="mb-4" elevation="2">
            <v-card-title class="d-flex align-center">
              <v-icon class="me-2">mdi-account</v-icon>
              {{ character.name || 'Unnamed Character' }}
            </v-card-title>

            <v-card-text>
              <div class="character-details">
                <p><strong>Species:</strong> {{ character.speciesDetails?.name || 'Unknown' }}</p>
                <p><strong>Class:</strong> {{ character.classDetails?.name || 'Unknown' }}</p>
                <p><strong>Background:</strong> {{ character.backgroundDetails?.name || 'Unknown' }}</p>
                <p><strong>Level:</strong> {{ character.level || 1 }}</p>
                <p><strong>Alignment:</strong> {{ character.alignment || 'Unknown' }}</p>
              </div>

              <div class="ability-scores mt-3">
                <h4>Ability Scores</h4>
                <v-row dense>
                  <v-col v-for="(ability, name) in character.abilityScores" :key="name" cols="6" sm="4">
                    <v-chip size="small" class="ma-1">
                      {{ name.toUpperCase() }}: {{ ability.score }} ({{ ability.modifier >= 0 ? '+' : '' }}{{
                        ability.modifier }})
                    </v-chip>
                  </v-col>
                </v-row>
              </div>
            </v-card-text>

            <v-card-actions>
              <v-btn variant="text" color="primary" @click="viewCharacter(character)">
                View Details
              </v-btn>
              <v-spacer />
              <v-btn variant="text" color="error" @click="confirmDelete(character)">
                Delete
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>Delete Character</v-card-title>
        <v-card-text>
          Are you sure you want to delete "{{ selectedCharacter?.name }}"? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" @click="deleteCharacter">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFirestore } from '@/composables/useFirestore'

const { getCharacters, deleteCharacter: deleteFromFirestore } = useFirestore()

// Reactive data
const characters = ref([])
const loading = ref(true)
const error = ref(null)
const deleteDialog = ref(false)
const selectedCharacter = ref(null)

// Load characters from Firestore
const loadCharacters = async () => {
  loading.value = true
  error.value = null

  try {
    const result = await getCharacters()

    if (result.success) {
      characters.value = result.data
    } else {
      throw new Error(result.error)
    }
  } catch (err) {
    error.value = err.message
    console.error('Error loading characters:', err)
  } finally {
    loading.value = false
  }
}

// View character details
const viewCharacter = (character) => {
  // For now, just log the character
  // You could create a detailed view page or modal
  console.log('Viewing character:', character)
  alert(`Character Details:\n\nName: ${character.name}\nSpecies: ${character.speciesDetails?.name}\nClass: ${character.classDetails?.name}\nLevel: ${character.level}`)
}

// Confirm character deletion
const confirmDelete = (character) => {
  selectedCharacter.value = character
  deleteDialog.value = true
}

// Delete character
const deleteCharacter = async () => {
  if (!selectedCharacter.value) return

  try {
    const result = await deleteFromFirestore(selectedCharacter.value.id)

    if (result.success) {
      // Remove from local array
      characters.value = characters.value.filter(c => c.id !== selectedCharacter.value.id)
      alert('Character deleted successfully')
    } else {
      throw new Error(result.error)
    }
  } catch (err) {
    alert('Error deleting character: ' + err.message)
    console.error('Error deleting character:', err)
  } finally {
    deleteDialog.value = false
    selectedCharacter.value = null
  }
}

// Load characters on component mount
onMounted(() => {
  loadCharacters()
})
</script>

<style scoped>
.characters-page {
  min-height: 100vh;
}

.character-details p {
  margin-bottom: 0.5rem;
}

.ability-scores h4 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}
</style>
