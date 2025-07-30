<template>
  <v-card flat>
    <v-card-title class="text-h4 text-center mb-4">⚡ Ability Scores</v-card-title>
    <v-card-text>
      <ability-score-header
        :character="character"
        :character-data="characterData"
        :is-assigning-scores="isAssigningScores"
        @roll-ability-scores="rollAbilityScores"
        @set-standard-array="setStandardArray"
      />

      <ability-score-grid
        :available-scores="availableScores"
        :character="character"
        :character-data="characterData"
        :is-assigning-scores="isAssigningScores"
        :selected-score="selectedScore"
        @assign-score="assignScore"
      />

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
  const selectedScore = ref(null)
  const availableScores = ref([])

  const setStandardArray = () => {
    isAssigningScores.value = true
    availableScores.value = [15, 14, 13, 12, 10, 8]
  }

  const rollAbilityScores = () => {
  // Implementation for rolling scores
  }

  const assignScore = statName => {
  // Implementation for assigning scores
  }
</script>
