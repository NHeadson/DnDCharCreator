<template>
  <v-card class="compact-card w-100" color="secondary-lighten-5" variant="tonal">
    <v-card-title class="text-subtitle-1 d-flex align-center pa-2">
      <v-icon class="me-2" size="small">mdi-lightbulb-on</v-icon>
      Class Tips
    </v-card-title>
    <v-card-text class="pa-3">
      <div class="tips-content">
        <div class="text-caption mb-2 indent-1">
          <strong>Recommended Abilities</strong>
        </div>
        <div v-if="character.class" class="text-body-2">
          <div v-for="(ability, index) in getRecommendedAbilities(character.class)" :key="index" class="mb-1 indent-2">
            <v-chip class="me-2" color="secondary" size="x-small">{{ index + 1 }}</v-chip>
            {{ ability }}
          </div>
        </div>
        <div v-else class="text-caption text-grey">
          Select a class to see recommendations
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
defineProps({
  character: {
    type: Object,
    required: true,
  },
})

function getRecommendedAbilities(characterClass) {
  const recommendations = {
    barbarian: ['Strength', 'Constitution', 'Dexterity'],
    bard: ['Charisma', 'Dexterity', 'Constitution'],
    cleric: ['Wisdom', 'Constitution', 'Strength'],
    druid: ['Wisdom', 'Constitution', 'Dexterity'],
    fighter: ['Strength/Dexterity', 'Constitution', 'Intelligence/Wisdom'],
    monk: ['Dexterity', 'Wisdom', 'Constitution'],
    paladin: ['Strength', 'Charisma', 'Constitution'],
    ranger: ['Dexterity', 'Wisdom', 'Constitution'],
    rogue: ['Dexterity', 'Intelligence/Charisma', 'Constitution'],
    sorcerer: ['Charisma', 'Constitution', 'Dexterity'],
    warlock: ['Charisma', 'Constitution', 'Dexterity'],
    wizard: ['Intelligence', 'Constitution', 'Dexterity'],
  }

  return recommendations[characterClass] || []
}
</script>

<style scoped>
.compact-card {
  transition: all 0.3s ease;
}

.tips-content {
  min-height: 120px;
}

.indent-1 {
  margin-left: 2em;
}

.indent-2 {
  margin-left: 3em;
}
</style>
