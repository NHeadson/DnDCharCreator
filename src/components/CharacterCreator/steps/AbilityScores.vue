<template>
  <v-card flat class="ability-score-section-card">
    <v-card-text>

      <AbilityScoreHeader :character="character" :character-data="characterData"
        :is-assigning-scores="isAssigningScores" @roll-ability-scores="rollAbilityScores"
        @set-standard-array="setStandardArray" />

      <div class="d-flex justify-end mb-2">
        <v-btn v-if="isAssigningScores || availableScores.length" color="secondary" variant="text" size="small"
          @click="manualEntry">
          Manual Entry
        </v-btn>
      </div>

      <div v-if="isAssigningScores && availableScores.length" class="mb-4 d-flex justify-center">
        <v-card class="rolled-array-card pa-3 wide-array-card" variant="tonal" elevation="2">
          <div class="mb-2 text-center">
            <span class="text-subtitle-1 font-weight-bold">{{ arrayLabel }}</span>
            <span class="text-caption text-grey-darken-1 ms-2" v-if="!isNarrow">(Drag a number onto an ability)</span>
            <div class="text-caption text-grey-darken-1 mt-1" v-else>(Tap a number, then tap an ability)</div>
            <div class="text-caption text-primary mt-1" style="font-size: 0.98em;">
              Tip: You can also just click an attribute card to assign the highest available value.
            </div>
          </div>
          <div class="available-scores-row">
            <v-card v-for="(score, idx) in availableScores" :key="score + '-' + idx" class="array-value-card"
              variant="elevated" elevation="2" draggable="true" @dragstart="onDragStart(score, idx)"
              @click="onChipClick(score, idx)"
              :class="{ 'selected-array-value': selectedScore === score && selectedIdx === idx }">
              <span class="array-value-text">{{ score }}</span>
            </v-card>
          </div>
        </v-card>
      </div>

      <AbilityScoreGrid :available-scores="availableScores" :character="character" :character-data="characterData"
        :is-assigning-scores="isAssigningScores" @assign-score="assignScore" />

      <!-- Ability Score Reference Dropdown -->
      <div class="d-flex justify-center mt-4">
        <v-menu v-model="showReferenceMenu" :close-on-content-click="false" location="top center" offset="8">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" color="primary" variant="outlined" prepend-icon="mdi-information">
              <span v-if="!$vuetify.display.smAndDown">Ability Score Reference</span>
              <span v-else>Reference</span>
            </v-btn>
          </template>

          <v-card max-width="600" class="reference-dropdown" :class="{ 'mobile-dropdown': $vuetify.display.smAndDown }">
            <v-card-title class="d-flex align-center justify-space-between">
              <div>
                <v-icon class="me-2">mdi-information</v-icon>
                Ability Score Reference
              </div>
              <v-btn icon variant="text" size="small" @click="showReferenceMenu = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <h3 class="text-subtitle-1 mb-2">Score Meanings</h3>
                  <v-list density="compact">
                    <v-list-item>
                      <v-list-item-title>3-7: Severely Limited</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>8-9: Below Average</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>10-11: Average</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>12-13: Above Average</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>14-15: Gifted</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>16-17: Exceptional</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>18-20: Legendary</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-col>
                <v-col cols="12" md="6">
                  <h3 class="text-subtitle-1 mb-2">Quick Tips</h3>
                  <v-list density="compact">
                    <v-list-item>
                      <v-list-item-title>Most characters have at least one score of 14 or higher</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>Standard Array: 15, 14, 13, 12, 10, 8</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>Rolling: Roll 4d6, drop lowest, six times</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-menu>
      </div>
    </v-card-text>
  </v-card>
</template>



<script setup>
import { ref, toRefs, computed, onMounted, onBeforeUnmount } from 'vue'
import AbilityScoreGrid from '../shared/AbilityScoreGrid.vue'
import AbilityScoreHeader from '../shared/AbilityScoreHeader.vue'
// Computed label for array type
const arrayLabel = computed(() => {
  const arr = availableScores.value
  // Standard array, allow any order
  const std = [15, 14, 13, 12, 10, 8]
  if (arr.length === 6 && arr.slice().sort((a, b) => b - a).join(',') === std.join(',')) {
    return 'Standard Array'
  }
  return 'Rolled Array'
})
// Custom breakpoint for tap/drag message
const isNarrow = ref(window.innerWidth <= 1117)
function handleResize() {
  isNarrow.value = window.innerWidth <= 1117
}
onMounted(() => {
  window.addEventListener('resize', handleResize)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

const props = defineProps({
  character: {
    type: Object,
    required: true,
  },
  characterData: {
    type: Object,
    required: true,
  },
})

// Destructure for template access (but keep props for script logic)
const { character, characterData } = toRefs(props)

const isAssigningScores = ref(false)
const availableScores = ref([])
const assignedStats = ref({})
const showReferenceMenu = ref(false)
const statKeys = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']

// Allow user to clear arrays and enter scores manually
const manualEntry = () => {
  isAssigningScores.value = false
  availableScores.value = []
  assignedStats.value = {}
  // Optionally clear assigned scores if desired, or leave as-is for manual editing
}

const setStandardArray = () => {
  isAssigningScores.value = true
  availableScores.value = [15, 14, 13, 12, 10, 8]
  assignedStats.value = {}
  // Reset character scores
  statKeys.forEach(key => {
    if (character.value.abilityScores[key]) {
      character.value.abilityScores[key].score = null
      character.value.abilityScores[key].modifier = 0
    }
  })
}

const rollAbilityScores = () => {
  isAssigningScores.value = true
  // Roll 4d6 drop lowest for each stat
  const rolls = []
  for (let i = 0; i < 6; i++) {
    let dice = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1)
    dice.sort((a, b) => a - b)
    dice.shift() // drop lowest
    rolls.push(dice.reduce((a, b) => a + b, 0))
  }
  availableScores.value = rolls.sort((a, b) => b - a) // highest first
  assignedStats.value = {}
  statKeys.forEach(key => {
    if (character.value.abilityScores[key]) {
      character.value.abilityScores[key].score = null
      character.value.abilityScores[key].modifier = 0
    }
  })
}

let draggedScore = null
let draggedIdx = null
let selectedScore = null
let selectedIdx = null

const onDragStart = (score, idx) => {
  draggedScore = score
  draggedIdx = idx
}

const onChipClick = (score, idx) => {
  // For mobile - select the chip on click
  if (selectedScore === score && selectedIdx === idx) {
    // Deselect if clicking the same chip
    selectedScore = null
    selectedIdx = null
  } else {
    selectedScore = score
    selectedIdx = idx
  }
}

const assignScore = statName => {
  if (!isAssigningScores.value) return

  // Prevent assigning to a stat that already has a value
  if (character.value.abilityScores[statName]?.score !== null && character.value.abilityScores[statName]?.score !== undefined) {
    return
  }

  // Handle mobile selection first
  if (selectedScore !== null && selectedIdx !== null) {
    if (!character.value.abilityScores[statName]) {
      character.value.abilityScores[statName] = { score: 0, modifier: 0 }
    }
    character.value.abilityScores[statName].score = selectedScore
    character.value.abilityScores[statName].modifier = Math.floor((selectedScore - 10) / 2)
    availableScores.value.splice(selectedIdx, 1)
    selectedScore = null
    selectedIdx = null
    // If all scores assigned, stop assigning
    const allAssigned = statKeys.every(key => character.value.abilityScores[key]?.score !== null && character.value.abilityScores[key]?.score !== undefined)
    if (allAssigned) {
      isAssigningScores.value = false
    }
    return
  }

  // Handle drag and drop
  if (draggedScore !== null && draggedIdx !== null) {
    if (!character.value.abilityScores[statName]) {
      character.value.abilityScores[statName] = { score: 0, modifier: 0 }
    }
    character.value.abilityScores[statName].score = draggedScore
    character.value.abilityScores[statName].modifier = Math.floor((draggedScore - 10) / 2)
    availableScores.value.splice(draggedIdx, 1)
    draggedScore = null
    draggedIdx = null
    // If all scores assigned, stop assigning
    const allAssigned = statKeys.every(key => character.value.abilityScores[key]?.score !== null && character.value.abilityScores[key]?.score !== undefined)
    if (allAssigned) {
      isAssigningScores.value = false
    }
    return
  }
  // Fallback: assign the first available score (works with duplicates)
  if (availableScores.value.length > 0) {
    const nextScore = availableScores.value[0]
    if (!character.value.abilityScores[statName]) {
      character.value.abilityScores[statName] = { score: 0, modifier: 0 }
    }
    character.value.abilityScores[statName].score = nextScore
    character.value.abilityScores[statName].modifier = Math.floor((nextScore - 10) / 2)
    availableScores.value.splice(0, 1)
  }
  const allAssigned = statKeys.every(key => character.value.abilityScores[key]?.score !== null && character.value.abilityScores[key]?.score !== undefined)
  if (allAssigned) {
    isAssigningScores.value = false
  }
}
</script>

<style scoped>
.ability-score-section-card {
  background: linear-gradient(135deg, var(--v-theme-surface) 70%, var(--v-theme-primary-lighten-4) 100%);
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  padding-bottom: 24px;
}

.ability-card-enhanced {
  transition: all 0.3s ease;
  cursor: pointer;
  border-radius: 16px;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px 0;
}

.ability-score-btn {
  min-width: 64px;
  min-height: 64px;
  font-size: 2rem;
  font-weight: 600;
  border-radius: 12px;
  padding: 16px 0;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rolled-array-card {
  background: var(--v-theme-surface);
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  min-width: 340px;
  max-width: 520px;
  margin: 0 auto;
}


.rolled-chip {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: grab;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.10);
  min-width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
}


/* Center the cards in the row */
.available-scores-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
}

.wide-array-card {
  min-width: 540px;
  max-width: 700px;
  margin: 0 auto;
}

/* Fixed-size square for all value cards */
/* Visually distinct, centered, draggable card */
/* Use v-card for elevation and background */
.array-value-card {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 6px 8px 6px;
  cursor: grab;
  user-select: none;
  border-radius: 12px;
  transition: background 0.2s, box-shadow 0.2s;
  /* No manual box-shadow or background, let v-card handle it */
}

@media (max-width: 700px) {
  .wide-array-card {
    min-width: 0;
    max-width: 100vw;
  }

  .available-scores-row {
    max-width: 100vw;
    padding: 0 4px;
  }

  .array-value-card {
    width: 44px;
    height: 44px;
    font-size: 1.1rem;
  }
}

.array-value-text {
  color: var(--v-theme-primary-darken-2);
  font-size: 1.4rem;
  font-weight: 600;
}

/* Mobile responsive styles */
@media (max-width: 600px) {
  .rolled-array-card {
    margin: 0 8px;
    padding: 16px 8px !important;
  }

  .mobile-chips .rolled-chip {
    margin: 4px 6px !important;
    padding: 8px 12px !important;
  }

  .mobile-chip {
    font-size: 1.5rem !important;
  }

  .ability-card-enhanced {
    min-height: 100px;
    padding: 16px 0;
  }

  .ability-score-section-card {
    margin: 0 -8px;
  }
}

.reference-dropdown {
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border-radius: 12px;
}

.reference-dropdown .v-card-title {
  background: var(--v-theme-primary-lighten-5);
  border-bottom: 1px solid var(--v-theme-primary-lighten-3);
  font-weight: 600;
}

.reference-dropdown .v-list-item-title {
  font-size: 0.875rem;
  font-weight: 500;
}

.mobile-dropdown {
  max-width: calc(100vw - 32px) !important;
  margin: 0 16px;
}

@media (max-width: 480px) {
  .mobile-dropdown {
    max-width: calc(100vw - 16px) !important;
    margin: 0 8px;
  }
}
</style>
