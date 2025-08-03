<template>
  <div class="characters-page theme-background theme-aware">
    <v-container class="pa-4">
      <!-- Header Section -->
      <div class="page-header text-center mb-4">
        <h1 class="display-1 font-weight-bold text-primary mb-2">🎭 My Characters</h1>
        <p class="text-h6 text-grey-darken-1">Your collection of heroes and adventurers</p>
        <v-divider class="mx-auto mt-4" style="max-width: 200px; border-color: var(--theme-accent);" />
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center pa-8">
        <v-progress-circular class="mb-4" color="accent" indeterminate size="64" width="6" />
        <h3 class="text-h5 text-grey-darken-1">Loading your characters...</h3>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center pa-8">
        <v-icon class="mb-4" color="error" size="64">mdi-alert-circle</v-icon>
        <v-alert class="mb-4 mx-auto" style="max-width: 600px;" type="error" variant="tonal">
          <v-alert-title>Something went wrong</v-alert-title>
          {{ error }}
        </v-alert>
        <v-btn color="accent" prepend-icon="mdi-refresh" variant="elevated" @click="loadCharacters">
          Try Again
        </v-btn>
      </div>

      <!-- Empty State -->
      <div v-else-if="characters.length === 0" class="empty-state text-center pa-8">
        <v-card class="mx-auto pa-8" style="max-width: 600px; background: var(--theme-card-bg);" variant="tonal">
          <v-icon class="mb-4" color="primary-lighten-1" size="80">mdi-sword-cross</v-icon>
          <h2 class="text-h4 font-weight-bold text-primary mb-3">Your Adventure Awaits</h2>
          <p class="text-h6 text-grey-darken-1 mb-6">
            You haven't created any characters yet. Start your legendary journey today!
          </p>
          <v-btn v-if="hasAccess" class="create-character-btn" color="accent" prepend-icon="mdi-plus-circle"
            size="large" variant="elevated" @click="requireAccessForCreation">
            Create Your First Character
          </v-btn>
          <v-btn v-else class="create-character-btn" color="grey" prepend-icon="mdi-lock" size="large"
            variant="outlined" @click="requireAccessForCreation">
            Get Access to Create Characters
          </v-btn>
        </v-card>
      </div>

      <!-- Characters Grid -->
      <div v-else>
        <!-- Quick Actions Bar -->
        <v-card class="mb-6 pa-4" variant="outlined">
          <v-row align="center">
            <v-col cols="12" md="3">
              <div class="d-flex align-center">
                <v-icon class="me-2" color="accent">mdi-information</v-icon>
                <span class="text-subtitle-1 theme-secondary">
                  <strong>{{ characters.length }}</strong> character{{ characters.length !== 1 ? 's' : '' }} in your
                  collection
                </span>
              </div>
            </v-col>

            <!-- Access Status -->
            <v-col class="text-center" cols="12" md="3">
              <div v-if="hasAccess" class="d-flex flex-column align-center">
                <v-chip class="mb-1" color="accent" prepend-icon="mdi-account-check" size="small" variant="elevated">
                  Group Access Active
                </v-chip>
                <div class="text-caption text-grey">
                  {{ getRemainingAccessTime }} minutes remaining
                </div>
              </div>
              <div v-else class="text-center">
                <v-chip color="grey" prepend-icon="mdi-lock" size="small" variant="outlined">
                  Access Required
                </v-chip>
              </div>
            </v-col>

            <!-- Admin Status -->
            <v-col class="text-center" cols="12" md="3">
              <div v-if="isAuthenticated" class="d-flex flex-column align-center">
                <div class="d-flex align-center justify-center mb-2">
                  <v-chip class="me-2" color="accent" prepend-icon="mdi-shield-check" size="small" variant="elevated">
                    Admin Active
                  </v-chip>
                  <v-btn color="grey" size="small" title="Logout from admin" variant="text" @click="logout">
                    <v-icon size="small">mdi-logout</v-icon>
                  </v-btn>
                </div>
                <!-- Theme Switcher - Admin Only -->
                <ThemeSwitcher />
              </div>
              <!-- Admin Login Button -->
              <div v-else-if="hasAccess" class="d-flex flex-column align-center">
                <v-btn class="mb-1" color="warning" data-admin-login prepend-icon="mdi-shield-key" size="small"
                  variant="elevated" @click="showAdminLogin">
                  Admin Login
                </v-btn>
                <div class="text-caption text-grey">
                  For editing/deleting
                </div>
              </div>
              <div v-else class="text-caption text-grey">
                Admin requires access first
              </div>
            </v-col>

            <v-col class="text-md-end" cols="12" md="3">
              <v-btn v-if="hasAccess" class="text-white create-character-btn" color="accent" prepend-icon="mdi-plus"
                variant="elevated" @click="requireAccessForCreation">
                Create New Character
              </v-btn>
              <v-btn v-else class="create-character-btn" color="grey" prepend-icon="mdi-lock" variant="outlined"
                @click="requireAccessForCreation">
                Create Character (Access Required)
              </v-btn>
            </v-col>
          </v-row>
        </v-card>

        <!-- Character Cards -->
        <v-row>
          <v-col v-for="character in characters" :key="character.id" cols="12" lg="4" md="4" sm="6" xl="4">
            <v-card class="character-card h-100" elevation="4" hover :style="{ background: 'var(--theme-surface)' }">
              <!-- Character Header with Background -->
              <div class="character-header" :style="getCharacterHeaderStyle(character)">
                <div class="character-overlay pa-3">
                  <div class="d-flex align-center mb-2">
                    <v-avatar class="me-3 elevation-2" color="white" size="48">
                      <v-icon :color="getClassColor(character.classDetails?.name)" size="32">
                        {{ getClassIcon(character.classDetails?.name) }}
                      </v-icon>
                    </v-avatar>
                    <div class="character-title">
                      <h3 class="text-h5 font-weight-bold text-white mb-0">
                        {{ character.name || 'Unnamed Character' }}
                      </h3>
                      <p class="text-subtitle-2 text-white opacity-90 mb-0">
                        {{ character.playerName || 'Unknown Player' }}
                      </p>
                    </div>
                  </div>

                  <div class="character-subtitle">
                    <v-chip class="me-2"
                      style="background: var(--theme-card-bg); color: var(--theme-text-primary); font-weight: 600;"
                      size="small">
                      Level {{ character.level || 1 }}
                    </v-chip>
                    <v-chip class="me-2"
                      style="background: var(--theme-card-bg); color: var(--theme-text-primary); font-weight: 600;"
                      size="small">
                      XP {{ character.xp || 0 }}
                    </v-chip>
                    <v-chip color="accent" text-color="black" size="small" variant="elevated">
                      {{ character.classDetails?.name || 'Unknown Class' }}
                    </v-chip>
                  </div>
                </div>
              </div>

              <!-- Character Details -->
              <v-card-text class="pa-3">
                <!-- Essential Combat Stats (Always Visible) -->
                <div class="essential-stats mb-3">
                  <v-row dense>
                    <v-col cols="3">
                      <v-card class="pa-2 text-center" style="background: var(--theme-surface);" variant="tonal">
                        <v-icon class="mb-1" color="red-darken-2" size="small">mdi-heart</v-icon>
                        <div class="text-caption font-weight-bold">HP</div>
                        <div class="text-h6 font-weight-bold">
                          {{ (character.level * 8) + (character.abilityScores?.constitution?.modifier || 0) }}
                        </div>
                      </v-card>
                    </v-col>
                    <v-col cols="3">
                      <v-card class="pa-2 text-center" style="background: var(--theme-surface);" variant="tonal">
                        <v-icon class="mb-1" color="blue-darken-2" size="small">mdi-shield</v-icon>
                        <div class="text-caption font-weight-bold">AC</div>
                        <div class="text-h6 font-weight-bold">
                          {{ 10 + (character.abilityScores?.dexterity?.modifier || 0) }}
                        </div>
                      </v-card>
                    </v-col>
                    <v-col cols="3">
                      <v-card class="pa-2 text-center" style="background: var(--theme-surface);" variant="tonal">
                        <v-icon class="mb-1" color="green-darken-2" size="small">mdi-run-fast</v-icon>
                        <div class="text-caption font-weight-bold">Speed</div>
                        <div class="text-h6 font-weight-bold">
                          {{ character.speciesDetails?.speed || 30 }}
                        </div>
                      </v-card>
                    </v-col>
                    <v-col cols="3">
                      <v-card class="pa-2 text-center" style="background: var(--theme-surface);" variant="tonal">
                        <v-icon class="mb-1" color="purple-darken-2" size="small">mdi-sword-cross</v-icon>
                        <div class="text-caption font-weight-bold">Init</div>
                        <div class="text-h6 font-weight-bold">
                          {{ (character.abilityScores?.dexterity?.modifier || 0) >= 0 ? '+' : '' }}{{
                            character.abilityScores?.dexterity?.modifier || 0 }}
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>

                <!-- Core Character Info (Always Visible) -->
                <div class="core-character-info mb-3">
                  <v-row dense>
                    <v-col cols="6">
                      <div class="d-flex align-center mb-2">
                        <v-icon class="me-2" color="blue-darken-2" size="small">mdi-dna</v-icon>
                        <span class="text-caption font-weight-bold text-blue-darken-2 me-2">Species:</span>
                        <span class="text-body-2 font-weight-medium">
                          {{ character.speciesDetails?.name || 'Unknown' }}
                          <span v-if="getLineageName(character)" class="text-caption text-grey ms-1">
                            ({{ getLineageName(character) }})
                          </span>
                        </span>
                      </div>
                      <div class="d-flex align-center">
                        <v-icon class="me-2" color="green-darken-2" size="small">mdi-book-open-page-variant</v-icon>
                        <span class="text-caption font-weight-bold text-green-darken-2 me-2">Background:</span>
                        <span class="text-body-2 font-weight-medium">{{ getBackgroundName(character) }}</span>
                      </div>
                    </v-col>
                    <v-col cols="6">
                      <div class="d-flex align-center mb-2">
                        <v-icon class="me-2" color="purple-darken-2" size="small">mdi-compass</v-icon>
                        <span class="text-caption font-weight-bold text-purple-darken-2 me-2">Alignment:</span>
                        <span class="text-body-2 font-weight-medium">{{ character.alignment || 'Neutral' }}</span>
                      </div>
                      <div class="d-flex align-center">
                        <v-icon class="me-2" color="orange-darken-2" size="small">mdi-star-outline</v-icon>
                        <span class="text-caption font-weight-bold text-orange-darken-2 me-2">Proficiency:</span>
                        <span class="text-body-2 font-weight-medium">+{{ Math.ceil(character.level / 4) + 1 }}</span>
                      </div>
                    </v-col>
                  </v-row>
                </div>

                <!-- Ability Scores (Always Visible) -->
                <div class="ability-scores-main mb-3">
                  <h4 class="text-subtitle-2 font-weight-bold mb-2 d-flex align-center">
                    <v-icon class="me-2" color="primary" size="small">mdi-chart-box</v-icon>
                    Ability Scores
                  </h4>
                  <v-row dense>
                    <v-col
                      v-for="abilityKey in ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']"
                      :key="abilityKey" cols="4" lg="2" md="2" sm="4">
                      <v-card class="pa-2 text-center ability-score-card-main" variant="outlined">
                        <div class="text-caption font-weight-bold text-primary">
                          {{ ({
                            strength: 'STR', dexterity: 'DEX', constitution: 'CON', intelligence: 'INT', wisdom: 'WIS',
                            charisma: 'CHA'
                          })[abilityKey] }}
                        </div>
                        <div class="text-h6 font-weight-bold">{{ character.abilityScores?.[abilityKey]?.score ?? '-' }}
                        </div>
                        <div class="text-caption"
                          :class="(character.abilityScores?.[abilityKey]?.modifier ?? 0) >= 0 ? 'text-success' : 'text-error'">
                          {{ (character.abilityScores?.[abilityKey]?.modifier ?? 0) >= 0 ? '+' : '' }}{{
                            character.abilityScores?.[abilityKey]?.modifier ?? 0 }}
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>

                <!-- Show More Details Expansion -->
                <v-expansion-panels class="character-details-expansion" variant="accordion">
                  <v-expansion-panel>
                    <v-expansion-panel-title class="pa-2">
                      <div class="d-flex align-center w-100">
                        <v-icon class="me-2" color="primary" size="small">mdi-information-outline</v-icon>
                        <span class="text-subtitle-2 font-weight-bold">Show More Details</span>
                        <v-spacer />
                        <v-chip color="primary" size="x-small" variant="tonal">
                          {{ getCharacterDetailsCount(character) }} items
                        </v-chip>
                      </div>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text class="pa-3">

                      <!-- Notable Features -->
                      <div v-if="getNotableFeatures(character).length > 0" class="notable-features mb-4">
                        <h4 class="text-subtitle-2 font-weight-bold mb-2 d-flex align-center">
                          <v-icon class="me-2" color="amber-darken-2" size="small">mdi-star-circle</v-icon>
                          Notable Features
                        </h4>
                        <div class="d-flex flex-wrap" style="gap: 4px;">
                          <v-chip v-for="feature in getNotableFeatures(character)" :key="feature" color="accent"
                            size="small" variant="elevated">
                            {{ feature }}
                          </v-chip>
                        </div>
                      </div>

                      <!-- Skills -->
                      <div v-if="getCharacterSkills(character).length > 0" class="character-skills mb-4">
                        <h4 class="text-subtitle-2 font-weight-bold mb-2 d-flex align-center">
                          <v-icon class="me-2" color="green-darken-2" size="small">mdi-brain</v-icon>
                          Skill Proficiencies
                        </h4>
                        <div class="d-flex flex-wrap" style="gap: 4px;">
                          <v-chip v-for="skill in getCharacterSkills(character)" :key="skill" color="green-lighten-4"
                            size="small" variant="tonal">
                            {{ skill }}
                          </v-chip>
                        </div>
                      </div>

                      <!-- Languages -->
                      <div v-if="getCharacterLanguages(character).length > 0" class="character-languages mb-4">
                        <h4 class="text-subtitle-2 font-weight-bold mb-2 d-flex align-center">
                          <v-icon class="me-2" color="purple-darken-2" size="small">mdi-translate</v-icon>
                          Languages
                        </h4>
                        <div class="d-flex flex-wrap" style="gap: 4px;">
                          <v-chip v-for="lang in getCharacterLanguages(character)" :key="lang" color="purple-lighten-4"
                            size="small" variant="tonal">
                            {{ lang }}
                          </v-chip>
                        </div>
                      </div>

                      <!-- Tools -->
                      <div v-if="getCharacterTools(character).length > 0" class="character-tools">
                        <h4 class="text-subtitle-2 font-weight-bold mb-2 d-flex align-center">
                          <v-icon class="me-2" color="orange-darken-2" size="small">mdi-tools</v-icon>
                          Tool Proficiencies
                        </h4>
                        <div class="d-flex flex-wrap" style="gap: 4px;">
                          <v-chip v-for="tool in getCharacterTools(character)" :key="tool" color="orange-lighten-4"
                            size="small" variant="tonal">
                            {{ tool }}
                          </v-chip>
                        </div>
                      </div>

                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-card-text>

              <!-- Actions -->
              <v-card-actions class="pa-4 pt-0">
                <v-row dense>
                  <v-col cols="8">
                    <v-btn block class="admin-action-btn" :class="{ 'admin-protected': !isAuthenticated }"
                      :color="isAuthenticated ? 'primary' : 'grey'" size="large" variant="elevated"
                      @click="editCharacter(character)">
                      <template #prepend>
                        <v-icon>{{ isAuthenticated ? 'mdi-pencil' : 'mdi-shield-key' }}</v-icon>
                      </template>
                      {{ isAuthenticated ? 'Edit Character' : 'Edit (Admin)' }}
                    </v-btn>
                  </v-col>
                  <v-col cols="4">
                    <v-btn block class="admin-action-btn" :class="{ 'admin-protected': !isAuthenticated }"
                      :color="isAuthenticated ? 'error' : 'grey'" size="large"
                      :title="isAuthenticated ? 'Delete Character' : 'Delete (Admin Only)'" variant="outlined"
                      @click="confirmDelete(character)">
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
          <v-icon class="me-2" color="error">mdi-alert-circle</v-icon>
          Delete Character
        </v-card-title>
        <v-card-text class="text-body-1">
          <p class="mb-3">
            Are you sure you want to delete <strong>"{{ selectedCharacter?.name }}"</strong>?
          </p>
          <v-alert class="mb-0" type="warning" variant="tonal">
            This action cannot be undone. All character data will be permanently lost.
          </v-alert>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="outlined" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" prepend-icon="mdi-delete" variant="elevated" @click="deleteCharacter">
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
import { onMounted, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import AdminAuthDialog from '@/components/AdminAuthDialog.vue'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
import { useAdminStore } from '@/stores/adminStore'
import { useAdminAuth } from '@/composables/useAdminAuth'
import { useFirestore } from '@/composables/useFirestore'

const router = useRouter()
const { getCharacters, deleteCharacter: deleteFromFirestore } = useFirestore()
const adminStore = useAdminStore()
const {
  isAuthenticated,
  showAuthDialog,
  requireAuth,
  logout,
  extendSession
} = useAdminAuth()
// Synchronize admin access between adminStore and useAdminAuth
watch(
  () => adminStore.accessType,
  (newType) => {
    if (newType === 'admin' && !isAuthenticated.value) {
      isAuthenticated.value = true
      extendSession()
    } else if (newType !== 'admin' && isAuthenticated.value) {
      logout()
    }
  },
  { immediate: true }
)
const hasAccess = computed(() => adminStore.isAccessValid)
const requireAccess = adminStore.requireAccess
const extendAccessSession = adminStore.extendAccessSession
const getRemainingAccessTime = adminStore.getRemainingAccessTime

// Reactive data
const characters = ref([])
const loading = ref(true)
const error = ref(null)
const deleteDialog = ref(false)
const selectedCharacter = ref(null)

// Helper functions for styling
const getCharacterHeaderStyle = character => {
  const classColors = {
    Barbarian: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
    Bard: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    Cleric: 'linear-gradient(135deg, #87CEEB 0%, #4682B4 100%)',
    Druid: 'linear-gradient(135deg, #228B22 0%, #32CD32 100%)',
    Fighter: 'linear-gradient(135deg, #B22222 0%, #DC143C 100%)',
    Monk: 'linear-gradient(135deg, #8A2BE2 0%, #9370DB 100%)',
    Paladin: 'linear-gradient(135deg, #FFD700 0%, #F0E68C 100%)',
    Ranger: 'linear-gradient(135deg, #006400 0%, #228B22 100%)',
    Rogue: 'linear-gradient(135deg, #2F4F4F 0%, #696969 100%)',
    Sorcerer: 'linear-gradient(135deg, #FF4500 0%, #FF6347 100%)',
    Warlock: 'linear-gradient(135deg, #4B0082 0%, #8A2BE2 100%)',
    Wizard: 'linear-gradient(135deg, #191970 0%, #4169E1 100%)',
  }

  const className = character.classDetails?.name
  const background = classColors[className] || 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'

  return {
    background,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
  }
}

const getClassIcon = className => {
  const classIcons = {
    Barbarian: 'mdi-axe',
    Bard: 'mdi-music',
    Cleric: 'mdi-cross',
    Druid: 'mdi-leaf',
    Fighter: 'mdi-sword',
    Monk: 'mdi-hand-peace',
    Paladin: 'mdi-shield-sword',
    Ranger: 'mdi-bow-arrow',
    Rogue: 'mdi-knife',
    Sorcerer: 'mdi-fire',
    Warlock: 'mdi-eye',
    Wizard: 'mdi-hat-fedora',
  }
  return classIcons[className] || 'mdi-account'
}

const getClassColor = className => {
  const classColors = {
    Barbarian: '#8B4513',
    Bard: '#FFD700',
    Cleric: '#4682B4',
    Druid: '#228B22',
    Fighter: '#B22222',
    Monk: '#8A2BE2',
    Paladin: '#FFD700',
    Ranger: '#006400',
    Rogue: '#2F4F4F',
    Sorcerer: '#FF4500',
    Warlock: '#4B0082',
    Wizard: '#191970',
  }
  return classColors[className] || '#6366f1'
}

const getAbilityColor = modifier => {
  if (modifier >= 4) return 'green-lighten-4'
  if (modifier >= 2) return 'blue-lighten-4'
  if (modifier >= 0) return 'grey-lighten-3'
  if (modifier >= -2) return 'orange-lighten-4'
  return 'red-lighten-4'
}

// Get top 3 ability scores for a character
const getTopAbilities = abilityScores => {
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
const getNotableFeatures = character => {
  const features = []

  // Add racial traits
  if (character.speciesDetails?.traits) {
    for (const trait of character.speciesDetails.traits) {
      features.push(trait.name)
    }
  }

  // Add class features (placeholder - would need actual class data)
  if (character.classDetails?.name) {
    const classFeatures = {
      Barbarian: ['Rage', 'Unarmored Defense'],
      Bard: ['Bardic Inspiration', 'Spellcasting'],
      Cleric: ['Divine Domain', 'Spellcasting'],
      Druid: ['Druidcraft', 'Spellcasting'],
      Fighter: ['Fighting Style', 'Second Wind'],
      Monk: ['Martial Arts', 'Ki'],
      Paladin: ['Divine Sense', 'Lay on Hands'],
      Ranger: ['Favored Enemy', 'Natural Explorer'],
      Rogue: ['Sneak Attack', 'Thieves\' Cant'],
      Sorcerer: ['Spellcasting', 'Sorcerous Origin'],
      Warlock: ['Otherworldly Patron', 'Pact Magic'],
      Wizard: ['Spellcasting', 'Arcane Recovery'],
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
const getCharacterChoicesCount = character => {
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

// Helper function for character details expansion count
const getCharacterDetailsCount = character => {
  let count = 0

  // Count notable features
  count += getNotableFeatures(character).length

  // Count skills
  count += getCharacterSkills(character).length

  // Count languages
  count += getCharacterLanguages(character).length

  // Count tools
  count += getCharacterTools(character).length

  return count
}

const getLineageName = character => {
  if (!character.speciesLineage || !character.speciesDetails?.lineages) return ''
  const lineage = character.speciesDetails.lineages.find(l => l.id === character.speciesLineage)
  return lineage?.name || character.speciesLineage
}

const getSpeciesDisplayName = character => {
  const speciesName = character.speciesDetails?.name || 'Unknown'
  const lineageName = getLineageName(character)

  if (lineageName) {
    return `${speciesName} (${lineageName})`
  }

  return speciesName
}

const getBackgroundName = character => {
  // If backgroundDetails exists, use it
  if (character.backgroundDetails?.name) {
    return character.backgroundDetails.name
  }

  // Otherwise, look up the name from the background ID
  if (character.background) {
    const backgroundMap = {
      'acolyte': 'Acolyte',
      'criminal': 'Criminal',
      'folk-hero': 'Folk Hero',
      'noble': 'Noble',
      'sage': 'Sage',
      'soldier': 'Soldier',
      'hermit': 'Hermit',
      'entertainer': 'Entertainer',
      'guild-artisan': 'Guild Artisan',
      'outlander': 'Outlander'
    }
    return backgroundMap[character.background] || character.background
  }

  return 'Unknown'
}

const getCharacterLanguages = character => {
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
      'Tiefling': ['Infernal'],
    }
    const speciesLangs = speciesLanguages[character.speciesDetails.name] || []
    languages.push(...speciesLangs)
  }

  // Add additional selected languages if available
  if (character.additionalLanguages) {
    languages.push(...character.additionalLanguages.filter(Boolean))
  }

  return [...new Set(languages)] // Remove duplicates
}

const getCharacterTools = character => {
  const tools = []

  // Add background tools (common examples)
  if (character.backgroundDetails?.name) {
    const backgroundTools = {
      'Acolyte': [],
      'Criminal': ['Thieves\' Tools'],
      'Folk Hero': ['Smith\'s Tools', 'Vehicles (Land)'],
      'Noble': ['Gaming Set'],
      'Sage': [],
      'Soldier': ['Gaming Set', 'Vehicles (Land)'],
    }
    const bgTools = backgroundTools[character.backgroundDetails.name] || []
    tools.push(...bgTools)
  }

  // Add selected tools if available
  if (character.selectedTools) {
    tools.push(...character.selectedTools.filter(Boolean))
  }

  return [...new Set(tools)] // Remove duplicates
}

const getCharacterSkills = character => {
  const skills = []

  // Add background skills (common examples)
  if (character.backgroundDetails?.name) {
    const backgroundSkills = {
      'Acolyte': ['Insight', 'Religion'],
      'Criminal': ['Deception', 'Stealth'],
      'Folk Hero': ['Animal Handling', 'Survival'],
      'Noble': ['History', 'Persuasion'],
      'Sage': ['Arcana', 'History'],
      'Soldier': ['Athletics', 'Intimidation'],
    }
    const bgSkills = backgroundSkills[character.backgroundDetails.name] || []
    skills.push(...bgSkills)
  }

  // Add class skills if selected/saved
  if (character.selectedSkills) {
    skills.push(...character.selectedSkills.filter(Boolean))
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
  } catch (error_) {
    error.value = error_.message
    console.error('Error loading characters:', error_)
  } finally {
    loading.value = false
  }
}

// Edit character - requires admin authentication
const editCharacter = character => {
  requireAuth(() => {
    router.push({
      name: 'CharacterForm',
      query: { edit: character.id },
    })
  })
}

// Confirm character deletion - requires admin authentication
const confirmDelete = character => {
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
  } catch (error_) {
    alert('Error deleting character: ' + error_.message)
    console.error('Error deleting character:', error_)
  } finally {
    deleteDialog.value = false
    selectedCharacter.value = null
  }
}

// Show admin login dialog
const showAdminLogin = () => {
  showAuthDialog.value = true
}

// Require access for character creation
const requireAccessForCreation = () => {
  requireAccess(() => {
    // Navigate to character form
    router.push('/character-form')
  })
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
  color: #000000 !important;
  box-shadow: 0 2px 8px rgba(255, 152, 0, 0.3);
  transition: all 0.3s ease;
  animation: gentle-pulse 3s ease-in-out infinite;
}

.v-btn[data-admin-login]:hover {
  background: linear-gradient(135deg, #FFB74D 0%, #FFA726 100%) !important;
  color: #000000 !important;
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.4);
  transform: translateY(-1px);
  animation: none;
}

@keyframes gentle-pulse {

  0%,
  100% {
    box-shadow: 0 2px 8px rgba(255, 152, 0, 0.3);
  }

  50% {
    box-shadow: 0 4px 16px rgba(255, 152, 0, 0.5);
  }
}

/* Create Character button styles */
.create-character-btn {
  color: #000000 !important;
}

.create-character-btn:hover {
  color: #000000 !important;
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

/* Character details expansion styling */
.character-details-expansion {
  border: none !important;
  box-shadow: none !important;
}

.character-details-expansion .v-expansion-panel {
  background: transparent !important;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12) !important;
  border-radius: 8px !important;
  margin-bottom: 0 !important;
}

.character-details-expansion .v-expansion-panel-title {
  font-size: 0.875rem !important;
  background: rgba(var(--v-theme-primary), 0.05) !important;
  border-radius: 8px 8px 0 0 !important;
}

.character-details-expansion .v-expansion-panel-title:hover {
  background: rgba(var(--v-theme-primary), 0.1) !important;
}

.character-details-expansion .v-expansion-panel-text {
  background: var(--v-theme-surface) !important;
  border-radius: 0 0 8px 8px !important;
}

/* Enhanced core character info layout */
.core-character-info .d-flex {
  align-items: flex-start;
}

.essential-stats .v-card {
  transition: all 0.2s ease;
}

.essential-stats .v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

/* Ability scores on main card styling */
.ability-scores-main .ability-score-card-main {
  transition: all 0.2s ease;
  border: 1px solid rgba(var(--v-theme-primary), 0.2) !important;
  background: rgba(var(--v-theme-primary), 0.02) !important;
}

.ability-scores-main .ability-score-card-main:hover {
  transform: translateY(-1px);
  border-color: rgba(var(--v-theme-primary), 0.4) !important;
  background: rgba(var(--v-theme-primary), 0.05) !important;
  box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.15) !important;
}

.ability-scores-main h4 {
  color: rgb(var(--v-theme-primary)) !important;
}
</style>
