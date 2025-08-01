<template>
  <v-container class="ability-score-grid-container" fluid>
    <v-row class="justify-center">
      <v-col v-for="stat in stats" :key="stat.name" cols="12" md="4" sm="6" class="d-flex justify-center">
        <v-card :class="['ability-card-enhanced', 'pa-4', 'd-flex', 'flex-column', 'align-center']" variant="outlined">
          <v-card-title class="d-flex justify-space-between align-center mb-2">
            <span class="stat-title">{{ stat.name }}</span>
            <v-chip :color="getModifierColor(character[stat.key])" size="small">
              {{ getAbilityModifier(character[stat.key]) }}
            </v-chip>
          </v-card-title>
          <v-card-text class="text-center px-0">
            <v-btn-group rounded="lg" class="justify-center">
              <v-btn :disabled="!isAssigningScores || character[stat.key] <= 3" size="small" class="score-adjust-btn"
                @click="character[stat.key]--">
                -
              </v-btn>
              <v-btn :color="isAssigningScores ? 'primary' : undefined" :disabled="!isAssigningScores" size="large"
                variant="flat" class="ability-score-btn mx-2" @click="$emit('assign-score', stat.key)" @dragover.prevent
                @drop="$emit('assign-score', stat.key)">
                {{ character[stat.key] || '—' }}
              </v-btn>
              <v-btn :disabled="!isAssigningScores || character[stat.key] >= 20" size="small" class="score-adjust-btn"
                @click="character[stat.key]++">
                +
              </v-btn>
            </v-btn-group>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const props = defineProps({
  character: {
    type: Object,
    required: true,
  },
  characterData: {
    type: Object,
    required: true,
  },
  isAssigningScores: {
    type: Boolean,
    default: false,
  },
  selectedScore: {
    type: Number,
    default: null,
  },
  availableScores: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['assign-score'])

const stats = [
  { name: 'Strength', key: 'strength' },
  { name: 'Dexterity', key: 'dexterity' },
  { name: 'Constitution', key: 'constitution' },
  { name: 'Intelligence', key: 'intelligence' },
  { name: 'Wisdom', key: 'wisdom' },
  { name: 'Charisma', key: 'charisma' },
]

const getAbilityModifier = score => {
  if (!score) return '—'
  const modifier = Math.floor((score - 10) / 2)
  return modifier >= 0 ? `+${modifier}` : modifier.toString()
}

const getModifierColor = score => {
  if (!score) return 'grey'
  const modifier = Math.floor((score - 10) / 2)
  return modifier >= 0 ? 'success' : 'error'
}
</script>

<style scoped>
.ability-score-grid-container {
  padding-top: 12px;
  padding-bottom: 12px;
}

.ability-card-enhanced {
  transition: all 0.3s ease;
  cursor: pointer;
  border-radius: 16px;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  margin-bottom: 18px;
}

.stat-title {
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.ability-score-btn {
  min-width: 72px;
  min-height: 72px;
  font-size: 2rem;
  font-weight: 600;
  border-radius: 12px;
  padding: 18px 0;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.score-adjust-btn {
  min-width: 40px;
  min-height: 40px;
  font-size: 1.5rem;
  font-weight: 500;
  border-radius: 8px;
  margin: 0 2px;
}
</style>
