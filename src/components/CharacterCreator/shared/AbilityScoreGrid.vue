<template>
  <v-container>
    <v-row>
      <v-col
        v-for="stat in stats"
        :key="stat.name"
        cols="12"
        md="4"
        sm="6"
      >
        <v-card :class="{ 'ability-card-enhanced': isAssigningScores }" variant="outlined">
          <v-card-title class="d-flex justify-space-between align-center">
            {{ stat.name }}
            <v-chip :color="getModifierColor(character[stat.key])" size="small">
              {{ getAbilityModifier(character[stat.key]) }}
            </v-chip>
          </v-card-title>
          <v-card-text class="text-center">
            <v-btn-group rounded="lg">
              <v-btn
                :disabled="!isAssigningScores || character[stat.key] <= 3"
                size="small"
                @click="character[stat.key]--"
              >
                -
              </v-btn>
              <v-btn
                :color="isAssigningScores ? 'primary' : undefined"
                :disabled="!isAssigningScores"
                size="large"
                variant="flat"
                @click="$emit('assign-score', stat.key)"
              >
                {{ character[stat.key] || '—' }}
              </v-btn>
              <v-btn
                :disabled="!isAssigningScores || character[stat.key] >= 20"
                size="small"
                @click="character[stat.key]++"
              >
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
.ability-card-enhanced {
  transition: all 0.3s ease;
  cursor: pointer;
}
</style>
