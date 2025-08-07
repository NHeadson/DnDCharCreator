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
        <v-card class="rolled-array-card pa-3" variant="tonal" elevation="2">
          <div class="mb-2 text-center">
            <span class="text-subtitle-1 font-weight-bold">Rolled Array</span>
            <span class="text-caption text-grey-darken-1 ms-2" v-if="!$vuetify.display.smAndDown">(Drag a number onto an
              ability)</span>
            <div class="text-caption text-grey-darken-1 mt-1" v-else>(Tap a number, then tap an ability)</div>
          </div>
          <div class="d-flex flex-wrap justify-center align-center"
            :class="{ 'mobile-chips': $vuetify.display.smAndDown }">
            <v-chip v-for="(score, idx) in availableScores" :key="score + '-' + idx" color="primary"
              class="ma-2 px-6 py-3 rolled-chip" :class="{ 'mobile-chip': $vuetify.display.smAndDown }" draggable="true"
              @dragstart="onDragStart(score, idx)" @click="onChipClick(score, idx)"
              :style="$vuetify.display.smAndDown ? 'font-size:1.5rem;font-weight:600;cursor:pointer;' : 'font-size:2rem;font-weight:600;cursor:grab;box-shadow:0 2px 8px rgba(0,0,0,0.10);'">
              {{ score }}
            </v-chip>
          </div>
        </v-card>
      </div>

      <AbilityScoreGrid :available-scores="availableScores" :character="character" :character-data="characterData"
        :is-assigning-scores="isAssigningScores" @assign-score="assignScore" />

      <AbilityScoreReference />
    </v-card-text>
  </v-card>
</template>


<script setup>
import { ref, toRefs } from 'vue'
import AbilityScoreGrid from '../shared/AbilityScoreGrid.vue'
import AbilityScoreHeader from '../shared/AbilityScoreHeader.vue'
import AbilityScoreReference from '../shared/AbilityScoreReference.vue'

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
  // Fallback: assign next available score (for click)
  const alreadyAssigned = statKeys.map(key => character.value.abilityScores[key]?.score).filter(v => v !== null && v !== undefined)
  const nextScore = availableScores.value.find(score => !alreadyAssigned.includes(score))
  if (nextScore !== undefined) {
    if (!character.value.abilityScores[statName]) {
      character.value.abilityScores[statName] = { score: 0, modifier: 0 }
    }
    character.value.abilityScores[statName].score = nextScore
    character.value.abilityScores[statName].modifier = Math.floor((nextScore - 10) / 2)
    const idx = availableScores.value.indexOf(nextScore)
    if (idx !== -1) availableScores.value.splice(idx, 1)
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
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: grab;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.10);
  width: 96px;
  height: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
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
</style>
