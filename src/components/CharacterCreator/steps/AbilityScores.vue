<template>
  <v-card flat class="ability-score-section-card">
    <v-card-text>
      <ability-score-header :character="character" :character-data="characterData"
        :is-assigning-scores="isAssigningScores" @roll-ability-scores="rollAbilityScores"
        @set-standard-array="setStandardArray" />

      <div v-if="isAssigningScores && availableScores.length" class="mb-4 d-flex justify-center">
        <v-card class="rolled-array-card pa-3" variant="tonal" elevation="2">
          <div class="mb-2 text-center">
            <span class="text-subtitle-1 font-weight-bold">Rolled Array</span>
            <span class="text-caption text-grey-darken-1 ms-2">(Drag a number onto an ability)</span>
          </div>
          <div class="d-flex flex-wrap justify-center align-center">
            <v-chip v-for="(score, idx) in availableScores" :key="score + '-' + idx" color="primary"
              class="ma-2 px-6 py-3 rolled-chip" draggable="true" @dragstart="onDragStart(score, idx)"
              style="font-size:2rem;font-weight:600;cursor:grab;box-shadow:0 2px 8px rgba(0,0,0,0.10);">
              {{ score }}
            </v-chip>
          </div>
        </v-card>
      </div>

      <ability-score-grid :available-scores="availableScores" :character="character" :character-data="characterData"
        :is-assigning-scores="isAssigningScores" @assign-score="assignScore" />

      <ability-score-reference />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
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

const isAssigningScores = ref(false)
const availableScores = ref([])
const assignedStats = ref({})
const statKeys = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']

const setStandardArray = () => {
  isAssigningScores.value = true
  availableScores.value = [15, 14, 13, 12, 10, 8]
  assignedStats.value = {}
  // Reset character scores
  statKeys.forEach(key => {
    if (props.character[key] !== undefined) props.character[key] = null
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
    if (props.character[key] !== undefined) props.character[key] = null
  })
}

let draggedScore = null
let draggedIdx = null

const onDragStart = (score, idx) => {
  draggedScore = score
  draggedIdx = idx
}

const assignScore = statName => {
  if (!isAssigningScores.value) return
  // If a score is being dragged, assign it
  if (draggedScore !== null && draggedIdx !== null) {
    props.character[statName] = draggedScore
    availableScores.value.splice(draggedIdx, 1)
    draggedScore = null
    draggedIdx = null
    // If all scores assigned, stop assigning
    const allAssigned = statKeys.every(key => props.character[key] !== null && props.character[key] !== undefined)
    if (allAssigned) {
      isAssigningScores.value = false
    }
    return
  }
  // Fallback: assign next available score (for click)
  const alreadyAssigned = statKeys.map(key => props.character[key]).filter(v => v !== null && v !== undefined)
  const nextScore = availableScores.value.find(score => !alreadyAssigned.includes(score))
  if (nextScore !== undefined) {
    props.character[statName] = nextScore
    const idx = availableScores.value.indexOf(nextScore)
    if (idx !== -1) availableScores.value.splice(idx, 1)
  }
  const allAssigned = statKeys.every(key => props.character[key] !== null && props.character[key] !== undefined)
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
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.10);
  padding: 10px 18px;
}
</style>
