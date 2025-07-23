<template>
  <div class="characters-page">
    <v-container class="pa-4">
      <!-- Header Section -->
      <div class="page-header text-center mb-4">
        <h1 class="display-1 font-weight-bold text-primary mb-2">🎭 My Characters</h1>
        <p class="text-h6 text-grey-darken-1">Your collection of heroes and adventurers</p>
        <v-divider class="mx-auto mt-4" style="max-width: 200px;" />
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center pa-8">
        <v-progress-circular size="64" width="6" color="primary" indeterminate class="mb-4" />
        <h3 class="text-h5 text-grey-darken-1">Loading your characters...</h3>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center pa-8">
        <v-icon size="64" color="error" class="mb-4">mdi-alert-circle</v-icon>
        <v-alert type="error" variant="tonal" class="mb-4 mx-auto" style="max-width: 600px;">
          <v-alert-title>Something went wrong</v-alert-title>
          {{ error }}
        </v-alert>
        <v-btn color="primary" variant="elevated" @click="loadCharacters" prepend-icon="mdi-refresh">
          Try Again
        </v-btn>
      </div>

      <!-- Empty State -->
      <div v-else-if="characters.length === 0" class="empty-state text-center pa-8">
        <v-card class="mx-auto pa-8" style="max-width: 600px;" variant="tonal" color="primary-lighten-5">
          <v-icon size="80" color="primary-lighten-1" class="mb-4">mdi-sword-cross</v-icon>
          <h2 class="text-h4 font-weight-bold text-primary mb-3">Your Adventure Awaits</h2>
          <p class="text-h6 text-grey-darken-1 mb-6">
            You haven't created any characters yet. Start your legendary journey today!
          </p>
          <v-btn color="#822522" size="large" variant="elevated" to="/character-form" prepend-icon="mdi-plus-circle"
            class="text-white">
            Create Your First Character
          </v-btn>
        </v-card>
      </div>

      <!-- Characters Grid -->
      <div v-else>
        <!-- Quick Actions Bar -->
        <v-card variant="outlined" class="mb-6 pa-4">
          <v-row align="center">
            <v-col cols="12" md="4">
              <div class="d-flex align-center">
                <v-icon color="primary" class="me-2">mdi-information</v-icon>
                <span class="text-subtitle-1">
                  <strong>{{ characters.length }}</strong> character{{ characters.length !== 1 ? 's' : '' }} in your
                  collection
                </span>
              </div>
            </v-col>
            <v-col cols="12" md="4" class="text-center">
              <!-- Admin Status Indicator -->
              <div v-if="isAuthenticated" class="d-flex align-center justify-center">
                <v-chip color="success" variant="elevated" prepend-icon="mdi-shield-check" class="me-2">
                  Admin Access Active
                </v-chip>
                <v-btn variant="text" size="small" color="grey" @click="logout" title="Logout from admin">
                  <v-icon size="small">mdi-logout</v-icon>
                </v-btn>
              </div>
              <!-- Admin Login Button -->
              <div v-else class="d-flex flex-column align-center">
                <v-btn 
                  color="warning" 
                  variant="elevated" 
                  @click="showAdminLogin" 
                  prepend-icon="mdi-shield-key"
                  size="small"
                  class="mb-1"
                  data-admin-login
                >
                  Admin Login
                </v-btn>
                <div class="text-caption text-grey">
                  <v-icon size="small" class="me-1">mdi-shield-off-outline</v-icon>
                  For editing/deleting characters
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="4" class="text-md-end">
              <v-btn color="#822522" variant="elevated" to="/character-form" prepend-icon="mdi-plus" class="text-white">
                Create New Character
              </v-btn>
            </v-col>
          </v-row>
        </v-card>

        <!-- Admin Information Alert -->
        <v-alert v-if="!isAuthenticated" type="info" variant="tonal" class="mb-6" border="start">
          <v-alert-title class="d-flex align-center">
            <v-icon class="me-2">mdi-shield-key</v-icon>
            Protected Character Management
          </v-alert-title>
          <div class="mt-2">
            Editing and deleting characters requires admin authentication to prevent accidental changes.
            Only the Dungeon Master and authorized users have access to these functions.
            <div class="mt-2 text-caption">
              <v-icon size="small" class="me-1">mdi-key</v-icon>
              <strong>DMs:</strong> Use the "Admin Login" button above or click any Edit/Delete button to authenticate.
            </div>
            <div class="mt-1 text-caption">
              <v-icon size="small" class="me-1">mdi-information-outline</v-icon>
              <strong>Players:</strong> Contact your DM if you need a character edited or deleted.
            </div>
          </div>
        </v-alert>

        <!-- Character Cards -->
        <v-row>
          <v-col v-for="character in characters" :key="character.id" cols="12" md="6" lg="4">
            <v-card class="character-card h-100" elevation="4" hover>
              <!-- Character Header with Background -->
              <div class="character-header" :style="getCharacterHeaderStyle(character)">
                <div class="character-overlay pa-4">
                  <div class="d-flex align-center mb-2">
                    <v-avatar size="48" color="white" class="me-3 elevation-2">
                      <v-icon size="32" :color="getClassColor(character.classDetails?.name)">
                        {{ getClassIcon(character.classDetails?.name) }}
                      </v-icon>
                    </v-avatar>
                    <div class="character-title">
                      <h3 class="text-h5 font-weight-bold text-white mb-0">
                        {{ character.name || 'Unnamed Character' }}
                      </h3>
                      <p class="text-subtitle-2 text-white opacity-90 mb-0">
                        {{ character.userName || 'Unknown Player' }}
                      </p>
                    </div>
                  </div>

                  <div class="character-subtitle">
                    <v-chip color="rgba(255,255,255,0.9)" size="small" class="me-2" dark>
                      Level {{ character.level || 1 }}
                    </v-chip>
                    <v-chip color="rgba(255,255,255,0.8)" size="small" variant="outlined" dark>
                      {{ character.classDetails?.name || 'Unknown Class' }}
                    </v-chip>
                  </div>
                </div>
              </div>

              <!-- Character Details -->
              <v-card-text class="pa-4">
                <!-- Basic Info Row -->
                <div class="character-info mb-3">
                  <v-row dense>
                    <v-col cols="6">
                      <v-card variant="tonal" color="blue-lighten-5" class="pa-2 mb-2">
                        <div class="d-flex align-center">
                          <v-icon color="blue-darken-2" size="small" class="me-2">mdi-dna</v-icon>
                          <div>
                            <div class="text-caption text-blue-darken-2 font-weight-bold">Species</div>
                            <div class="text-body-2 font-weight-medium">
                              {{ character.speciesDetails?.name || 'Unknown' }}
                              <span v-if="getLineageName(character)" class="text-caption text-grey ms-1">
                                ({{ getLineageName(character) }})
                              </span>
                            </div>
                          </div>
                        </div>
                      </v-card>
                      <v-card variant="tonal" color="green-lighten-5" class="pa-2">
                        <div class="d-flex align-center">
                          <v-icon color="green-darken-2" size="small" class="me-2">mdi-book-open-page-variant</v-icon>
                          <div>
                            <div class="text-caption text-green-darken-2 font-weight-bold">Background</div>
                            <div class="text-body-2 font-weight-medium">{{ character.backgroundDetails?.name ||
                              'Unknown' }}</div>
                          </div>
                        </div>
                      </v-card>
                    </v-col>
                    <v-col cols="6">
                      <v-card variant="tonal" color="purple-lighten-5" class="pa-2 mb-2">
                        <div class="d-flex align-center">
                          <v-icon color="purple-darken-2" size="small" class="me-2">mdi-compass</v-icon>
                          <div>
                            <div class="text-caption text-purple-darken-2 font-weight-bold">Alignment</div>
                            <div class="text-body-2 font-weight-medium">{{ character.alignment || 'Neutral' }}</div>
                          </div>
                        </div>
                      </v-card>
                      <v-card variant="tonal" color="orange-lighten-5" class="pa-2">
                        <div class="d-flex align-center">
                          <v-icon color="orange-darken-2" size="small" class="me-2">mdi-star-outline</v-icon>
                          <div>
                            <div class="text-caption text-orange-darken-2 font-weight-bold">Proficiency</div>
                            <div class="text-body-2 font-weight-medium">+{{ Math.ceil(character.level / 4) + 1 }}</div>
                          </div>
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>

                <!-- Core Stats Row -->
                <div class="core-stats mb-3">
                  <v-row dense>
                    <v-col cols="3">
                      <v-card variant="tonal" color="red-lighten-4" class="pa-2 text-center">
                        <v-icon color="red-darken-2" size="small" class="mb-1">mdi-heart</v-icon>
                        <div class="text-caption font-weight-bold">HP</div>
                        <div class="text-h6 font-weight-bold">
                          {{ (character.level * 8) + (character.abilityScores?.constitution?.modifier || 0) }}
                        </div>
                      </v-card>
                    </v-col>
                    <v-col cols="3">
                      <v-card variant="tonal" color="blue-lighten-4" class="pa-2 text-center">
                        <v-icon color="blue-darken-2" size="small" class="mb-1">mdi-shield</v-icon>
                        <div class="text-caption font-weight-bold">AC</div>
                        <div class="text-h6 font-weight-bold">
                          {{ 10 + (character.abilityScores?.dexterity?.modifier || 0) }}
                        </div>
                      </v-card>
                    </v-col>
                    <v-col cols="3">
                      <v-card variant="tonal" color="green-lighten-4" class="pa-2 text-center">
                        <v-icon color="green-darken-2" size="small" class="mb-1">mdi-run-fast</v-icon>
                        <div class="text-caption font-weight-bold">Speed</div>
                        <div class="text-h6 font-weight-bold">
                          {{ character.speciesDetails?.speed || 30 }}
                        </div>
                      </v-card>
                    </v-col>
                    <v-col cols="3">
                      <v-card variant="tonal" color="purple-lighten-4" class="pa-2 text-center">
                        <v-icon color="purple-darken-2" size="small" class="mb-1">mdi-sword-cross</v-icon>
                        <div class="text-caption font-weight-bold">Init</div>
                        <div class="text-h6 font-weight-bold">
                          {{ (character.abilityScores?.dexterity?.modifier || 0) >= 0 ? '+' : '' }}{{
                            character.abilityScores?.dexterity?.modifier || 0 }}
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>

                <!-- Primary Ability Scores (Top 3) -->
                <div class="primary-abilities mb-3">
                  <h4 class="text-subtitle-2 font-weight-bold mb-2 d-flex align-center">
                    <v-icon color="primary" size="small" class="me-2">mdi-chart-box</v-icon>
                    Key Abilities
                  </h4>
                  <v-row dense>
                    <v-col v-for="(ability, name) in getTopAbilities(character.abilityScores)" :key="name" cols="4">
                      <v-card variant="outlined" class="pa-2 text-center">
                        <div class="text-caption font-weight-bold text-primary">{{ name.toUpperCase() }}</div>
                        <div class="text-h6 font-weight-bold">{{ ability.score }}</div>
                        <div class="text-caption" :class="ability.modifier >= 0 ? 'text-success' : 'text-error'">
                          {{ ability.modifier >= 0 ? '+' : '' }}{{ ability.modifier }}
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>

                <!-- Notable Features -->
                <div class="notable-features mb-3" v-if="getNotableFeatures(character).length > 0">
                  <h4 class="text-subtitle-2 font-weight-bold mb-2 d-flex align-center">
                    <v-icon color="amber-darken-2" size="small" class="me-2">mdi-star-circle</v-icon>
                    Notable Features
                  </h4>
                  <div class="d-flex flex-wrap" style="gap: 4px;">
                    <v-chip v-for="feature in getNotableFeatures(character).slice(0, 3)" :key="feature" size="x-small"
                      color="amber-lighten-4" variant="tonal">
                      {{ feature }}
                    </v-chip>
                    <v-chip v-if="getNotableFeatures(character).length > 3" size="x-small" color="grey-lighten-2"
                      variant="tonal">
                      +{{ getNotableFeatures(character).length - 3 }} more
                    </v-chip>
                  </div>
                </div>

                <!-- Character Choices & Features Dropdown -->
                <div v-if="getCharacterChoicesCount(character) > 0" class="character-choices mb-3">
                  <v-expansion-panels variant="accordion" class="character-choices-panels">
                    <v-expansion-panel>
                      <v-expansion-panel-title class="pa-2">
                        <div class="d-flex align-center w-100">
                          <v-icon color="purple-darken-2" size="small" class="me-2">mdi-format-list-checks</v-icon>
                          <span class="text-caption font-weight-bold">Character Choices</span>
                          <v-spacer />
                          <v-badge :content="getCharacterChoicesCount(character)" color="purple" inline />
                        </div>
                      </v-expansion-panel-title>
                      <v-expansion-panel-text class="pa-2">
                        <v-row dense>
                          <!-- Lineage/Subrace -->
                          <v-col v-if="character.speciesLineage && character.speciesDetails?.lineages" cols="12"
                            class="mb-1">
                            <div class="d-flex align-center">
                              <v-icon color="blue-darken-2" size="x-small" class="me-2">mdi-dna</v-icon>
                              <span class="text-caption font-weight-bold text-blue-darken-2 me-2">Lineage:</span>
                              <v-chip color="blue-lighten-4" size="x-small" variant="tonal">
                                {{ getLineageName(character) }}
                              </v-chip>
                            </div>
                          </v-col>

                          <!-- Languages -->
                          <v-col v-if="getCharacterLanguages(character).length > 0" cols="12" class="mb-1">
                            <div class="d-flex align-center flex-wrap">
                              <v-icon color="purple-darken-2" size="x-small" class="me-2">mdi-translate</v-icon>
                              <span class="text-caption font-weight-bold text-purple-darken-2 me-2">Languages:</span>
                              <div class="d-flex flex-wrap" style="gap: 2px;">
                                <v-chip v-for="lang in getCharacterLanguages(character)" :key="lang"
                                  color="purple-lighten-4" size="x-small" variant="tonal">
                                  {{ lang }}
                                </v-chip>
                              </div>
                            </div>
                          </v-col>

                          <!-- Tools -->
                          <v-col v-if="getCharacterTools(character).length > 0" cols="12" class="mb-1">
                            <div class="d-flex align-center flex-wrap">
                              <v-icon color="orange-darken-2" size="x-small" class="me-2">mdi-tools</v-icon>
                              <span class="text-caption font-weight-bold text-orange-darken-2 me-2">Tools:</span>
                              <div class="d-flex flex-wrap" style="gap: 2px;">
                                <v-chip v-for="tool in getCharacterTools(character)" :key="tool"
                                  color="orange-lighten-4" size="x-small" variant="tonal">
                                  {{ tool }}
                                </v-chip>
                              </div>
                            </div>
                          </v-col>

                          <!-- Skills -->
                          <v-col v-if="getCharacterSkills(character).length > 0" cols="12">
                            <div class="d-flex align-center flex-wrap">
                              <v-icon color="green-darken-2" size="x-small" class="me-2">mdi-brain</v-icon>
                              <span class="text-caption font-weight-bold text-green-darken-2 me-2">Skills:</span>
                              <div class="d-flex flex-wrap" style="gap: 2px;">
                                <v-chip v-for="skill in getCharacterSkills(character).slice(0, 4)" :key="skill"
                                  color="green-lighten-4" size="x-small" variant="tonal">
                                  {{ skill }}
                                </v-chip>
                                <v-chip v-if="getCharacterSkills(character).length > 4" color="grey-lighten-2"
                                  size="x-small" variant="tonal">
                                  +{{ getCharacterSkills(character).length - 4 }}
                                </v-chip>
                              </div>
                            </div>
                          </v-col>
                        </v-row>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </div>
              </v-card-text>

              <!-- Actions -->
              <v-card-actions class="pa-4 pt-0">
                <v-row dense>
                  <v-col cols="8">
                    <v-btn variant="elevated" :color="isAuthenticated ? 'primary' : 'grey'" block
                      @click="editCharacter(character)" size="large" class="admin-action-btn"
                      :class="{ 'admin-protected': !isAuthenticated }">
                      <template #prepend>
                        <v-icon>{{ isAuthenticated ? 'mdi-pencil' : 'mdi-shield-key' }}</v-icon>
                      </template>
                      {{ isAuthenticated ? 'Edit Character' : 'Edit (Admin)' }}
                    </v-btn>
                  </v-col>
                  <v-col cols="4">
                    <v-btn variant="outlined" :color="isAuthenticated ? 'error' : 'grey'" block
                      @click="confirmDelete(character)" size="large" class="admin-action-btn"
                      :class="{ 'admin-protected': !isAuthenticated }"
                      :title="isAuthenticated ? 'Delete Character' : 'Delete (Admin Only)'">
                      <v-icon>{{ isAuthenticated ? 'mdi-delete' : 'mdi-shield-key' }}</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>

    <!-- Enhanced Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="480">
      <v-card>
        <v-card-title class="d-flex align-center text-h5">
          <v-icon color="error" class="me-2">mdi-alert-circle</v-icon>
          Delete Character
        </v-card-title>
        <v-card-text class="text-body-1">
          <p class="mb-3">
            Are you sure you want to delete <strong>"{{ selectedCharacter?.name }}"</strong>?
          </p>
          <v-alert type="warning" variant="tonal" class="mb-0">
            This action cannot be undone. All character data will be permanently lost.
          </v-alert>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="outlined" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="elevated" @click="deleteCharacter" prepend-icon="mdi-delete">
            Delete Forever
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Admin Authentication Dialog -->
    <AdminAuthDialog />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFirestore } from '@/composables/useFirestore'
import { useAdminAuth } from '@/composables/useAdminAuth'
import AdminAuthDialog from '@/components/AdminAuthDialog.vue'

const router = useRouter()
const { getCharacters, deleteCharacter: deleteFromFirestore } = useFirestore()
const { requireAuth, isAuthenticated, extendSession, logout, showAuthDialog } = useAdminAuth()

// Reactive data
const characters = ref([])
const loading = ref(true)
const error = ref(null)
const deleteDialog = ref(false)
const selectedCharacter = ref(null)

// Helper functions for styling
const getCharacterHeaderStyle = (character) => {
  const classColors = {
    'Barbarian': 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
    'Bard': 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    'Cleric': 'linear-gradient(135deg, #87CEEB 0%, #4682B4 100%)',
    'Druid': 'linear-gradient(135deg, #228B22 0%, #32CD32 100%)',
    'Fighter': 'linear-gradient(135deg, #B22222 0%, #DC143C 100%)',
    'Monk': 'linear-gradient(135deg, #8A2BE2 0%, #9370DB 100%)',
    'Paladin': 'linear-gradient(135deg, #FFD700 0%, #F0E68C 100%)',
    'Ranger': 'linear-gradient(135deg, #006400 0%, #228B22 100%)',
    'Rogue': 'linear-gradient(135deg, #2F4F4F 0%, #696969 100%)',
    'Sorcerer': 'linear-gradient(135deg, #FF4500 0%, #FF6347 100%)',
    'Warlock': 'linear-gradient(135deg, #4B0082 0%, #8A2BE2 100%)',
    'Wizard': 'linear-gradient(135deg, #191970 0%, #4169E1 100%)'
  }

  const className = character.classDetails?.name
  const background = classColors[className] || 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'

  return {
    background,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative'
  }
}

const getClassIcon = (className) => {
  const classIcons = {
    'Barbarian': 'mdi-axe',
    'Bard': 'mdi-music',
    'Cleric': 'mdi-cross',
    'Druid': 'mdi-leaf',
    'Fighter': 'mdi-sword',
    'Monk': 'mdi-hand-peace',
    'Paladin': 'mdi-shield-sword',
    'Ranger': 'mdi-bow-arrow',
    'Rogue': 'mdi-knife',
    'Sorcerer': 'mdi-fire',
    'Warlock': 'mdi-eye',
    'Wizard': 'mdi-hat-fedora'
  }
  return classIcons[className] || 'mdi-account'
}

const getClassColor = (className) => {
  const classColors = {
    'Barbarian': '#8B4513',
    'Bard': '#FFD700',
    'Cleric': '#4682B4',
    'Druid': '#228B22',
    'Fighter': '#B22222',
    'Monk': '#8A2BE2',
    'Paladin': '#FFD700',
    'Ranger': '#006400',
    'Rogue': '#2F4F4F',
    'Sorcerer': '#FF4500',
    'Warlock': '#4B0082',
    'Wizard': '#191970'
  }
  return classColors[className] || '#6366f1'
}

const getAbilityColor = (modifier) => {
  if (modifier >= 4) return 'green-lighten-4'
  if (modifier >= 2) return 'blue-lighten-4'
  if (modifier >= 0) return 'grey-lighten-3'
  if (modifier >= -2) return 'orange-lighten-4'
  return 'red-lighten-4'
}

// Get top 3 ability scores for a character
const getTopAbilities = (abilityScores) => {
  if (!abilityScores) return {}

  const abilities = Object.entries(abilityScores)
    .sort(([, a], [, b]) => b.score - a.score)
    .slice(0, 3)
    .reduce((obj, [key, value]) => {
      obj[key] = value
      return obj
    }, {})

  return abilities
}

// Get notable features for a character
const getNotableFeatures = (character) => {
  const features = []

  // Add racial traits
  if (character.speciesDetails?.traits) {
    character.speciesDetails.traits.forEach(trait => {
      features.push(trait.name)
    })
  }

  // Add class features (placeholder - would need actual class data)
  if (character.classDetails?.name) {
    const classFeatures = {
      'Barbarian': ['Rage', 'Unarmored Defense'],
      'Bard': ['Bardic Inspiration', 'Spellcasting'],
      'Cleric': ['Divine Domain', 'Spellcasting'],
      'Druid': ['Druidcraft', 'Spellcasting'],
      'Fighter': ['Fighting Style', 'Second Wind'],
      'Monk': ['Martial Arts', 'Ki'],
      'Paladin': ['Divine Sense', 'Lay on Hands'],
      'Ranger': ['Favored Enemy', 'Natural Explorer'],
      'Rogue': ['Sneak Attack', 'Thieves\' Cant'],
      'Sorcerer': ['Spellcasting', 'Sorcerous Origin'],
      'Warlock': ['Otherworldly Patron', 'Pact Magic'],
      'Wizard': ['Spellcasting', 'Arcane Recovery']
    }

    const feats = classFeatures[character.classDetails.name] || []
    features.push(...feats)
  }

  // Add background feature
  if (character.backgroundDetails?.feature?.name) {
    features.push(character.backgroundDetails.feature.name)
  }

  return features
}

// Helper functions for character choices dropdown
const getCharacterChoicesCount = (character) => {
  let count = 0

  // Count lineage selection
  if (character.speciesLineage) count += 1

  // Count languages
  count += getCharacterLanguages(character).length

  // Count tools
  count += getCharacterTools(character).length

  // Count skills (limit display to avoid overwhelming)
  const skills = getCharacterSkills(character)
  if (skills.length > 0) count += Math.min(skills.length, 6)

  return count
}

const getLineageName = (character) => {
  if (!character.speciesLineage || !character.speciesDetails?.lineages) return ''
  const lineage = character.speciesDetails.lineages.find(l => l.id === character.speciesLineage)
  return lineage?.name || character.speciesLineage
}

const getSpeciesDisplayName = (character) => {
  const speciesName = character.speciesDetails?.name || 'Unknown'
  const lineageName = getLineageName(character)

  if (lineageName) {
    return `${speciesName} (${lineageName})`
  }

  return speciesName
}

const getCharacterLanguages = (character) => {
  const languages = []

  // Add common/standard languages (Basic D&D assumption)
  languages.push('Common')

  // Add species languages
  if (character.speciesDetails?.name) {
    const speciesLanguages = {
      'Dragonborn': ['Draconic'],
      'Dwarf': ['Dwarvish'],
      'Elf': ['Elvish'],
      'Gnome': ['Gnomish'],
      'Half-Elf': ['Elvish'],
      'Halfling': ['Halfling'],
      'Half-Orc': ['Orc'],
      'Tiefling': ['Infernal']
    }
    const speciesLangs = speciesLanguages[character.speciesDetails.name] || []
    languages.push(...speciesLangs)
  }

  // Add additional selected languages if available
  if (character.additionalLanguages) {
    languages.push(...character.additionalLanguages.filter(lang => lang))
  }

  return [...new Set(languages)] // Remove duplicates
}

const getCharacterTools = (character) => {
  const tools = []

  // Add background tools (common examples)
  if (character.backgroundDetails?.name) {
    const backgroundTools = {
      'Acolyte': [],
      'Criminal': ['Thieves\' Tools'],
      'Folk Hero': ['Smith\'s Tools', 'Vehicles (Land)'],
      'Noble': ['Gaming Set'],
      'Sage': [],
      'Soldier': ['Gaming Set', 'Vehicles (Land)']
    }
    const bgTools = backgroundTools[character.backgroundDetails.name] || []
    tools.push(...bgTools)
  }

  // Add selected tools if available
  if (character.selectedTools) {
    tools.push(...character.selectedTools.filter(tool => tool))
  }

  return [...new Set(tools)] // Remove duplicates
}

const getCharacterSkills = (character) => {
  const skills = []

  // Add background skills (common examples)
  if (character.backgroundDetails?.name) {
    const backgroundSkills = {
      'Acolyte': ['Insight', 'Religion'],
      'Criminal': ['Deception', 'Stealth'],
      'Folk Hero': ['Animal Handling', 'Survival'],
      'Noble': ['History', 'Persuasion'],
      'Sage': ['Arcana', 'History'],
      'Soldier': ['Athletics', 'Intimidation']
    }
    const bgSkills = backgroundSkills[character.backgroundDetails.name] || []
    skills.push(...bgSkills)
  }

  // Add class skills if selected/saved
  if (character.selectedSkills) {
    skills.push(...character.selectedSkills.filter(skill => skill))
  }

  return [...new Set(skills)] // Remove duplicates
}

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

// Edit character - requires admin authentication
const editCharacter = (character) => {
  requireAuth(() => {
    // Navigate to character form with character ID as a query parameter
    router.push({
      name: 'CharacterForm',
      query: { edit: character.id }
    })
  })
}

// Confirm character deletion - requires admin authentication
const confirmDelete = (character) => {
  requireAuth(() => {
    selectedCharacter.value = character
    deleteDialog.value = true
  })
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

      // Extend admin session on successful action
      extendSession()
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

// Show admin login dialog
const showAdminLogin = () => {
  showAuthDialog.value = true
}

// Load characters on component mount
onMounted(() => {
  loadCharacters()
})
</script>

<style scoped>
/* Admin login button styles */
.v-btn[data-admin-login] {
  background: linear-gradient(135deg, #FFA726 0%, #FF9800 100%) !important;
  box-shadow: 0 2px 8px rgba(255, 152, 0, 0.3);
  transition: all 0.3s ease;
  animation: gentle-pulse 3s ease-in-out infinite;
}

.v-btn[data-admin-login]:hover {
  background: linear-gradient(135deg, #FFB74D 0%, #FFA726 100%) !important;
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.4);
  transform: translateY(-1px);
  animation: none;
}

@keyframes gentle-pulse {
  0%, 100% {
    box-shadow: 0 2px 8px rgba(255, 152, 0, 0.3);
  }
  50% {
    box-shadow: 0 4px 16px rgba(255, 152, 0, 0.5);
  }
}

/* Admin protection styles */
.admin-action-btn.admin-protected {
  opacity: 0.7;
  border-style: dashed !important;
}

.admin-action-btn.admin-protected:hover {
  opacity: 0.9;
  transform: scale(1.02);
}

.characters-page {
  min-height: 100vh;
  /* Remove the fixed gradient background for dark theme compatibility */
}

.page-header {
  padding: 2rem 0;
}

.character-card {
  transition: all 0.3s ease;
  border-radius: 16px !important;
  overflow: hidden;
}

.character-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
}

/* Dark theme hover effects */
.v-theme--dark .character-card:hover {
  box-shadow: 0 8px 32px rgba(255, 255, 255, 0.08) !important;
}

.character-header {
  height: 120px;
  position: relative;
  overflow: hidden;
}

.character-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(1px);
}

.character-choices-panels {
  box-shadow: none !important;
}

.character-choices-panels .v-expansion-panel {
  background: rgba(var(--v-theme-surface), 0.02) !important;
  border: 1px solid rgba(var(--v-theme-primary), 0.12) !important;
  border-radius: 8px !important;
}

.character-choices-panels .v-expansion-panel-title {
  min-height: 32px !important;
  font-size: 0.75rem !important;
}

.character-choices-panels .v-expansion-panel-text {
  font-size: 0.7rem !important;
}

.character-title h3 {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.character-subtitle {
  margin-top: 8px;
}

.info-item {
  border-radius: 8px;
  padding: 2px 0;
}

.ability-scores .v-card {
  border-radius: 8px !important;
  transition: all 0.2s ease;
  min-height: 70px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.ability-scores .v-card:hover {
  transform: scale(1.05);
}

/* Theme-aware hover shadows */
.v-theme--light .ability-scores .v-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.v-theme--dark .ability-scores .v-card:hover {
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
}

.key-stats .v-card {
  border-radius: 8px !important;
  transition: all 0.2s ease;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.key-stats .v-card:hover {
  transform: scale(1.02);
}

/* Theme-aware hover shadows for key stats */
.v-theme--light .key-stats .v-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.v-theme--dark .key-stats .v-card:hover {
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.08);
}

.empty-state .v-card {
  border-radius: 16px !important;
}

.v-btn {
  border-radius: 8px !important;
  font-weight: 600;
}

/* Enhanced card actions */
.v-card-actions .v-btn {
  font-weight: 500;
  min-height: 48px !important;
  height: 48px !important;
}

/* Loading and error states */
.v-progress-circular {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.7;
  }

  100% {
    opacity: 1;
  }
}

/* Dialog improvements */
.v-dialog .v-card {
  border-radius: 12px !important;
}

/* Responsive improvements */
@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem !important;
  }

  .character-header {
    height: 100px;
  }

  .character-overlay {
    padding: 1rem !important;
  }
}

/* Dark theme specific adjustments */
.v-theme--dark .character-overlay {
  background: rgba(0, 0, 0, 0.4);
}

/* Ensure good contrast for character title text */
.character-title h3,
.character-title p {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}
</style>
