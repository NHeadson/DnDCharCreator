<template>
  <v-card class="compact-card w-100" color="secondary-lighten-5" variant="tonal">
    <v-card-title class="text-subtitle-1 d-flex align-center pa-2">
      <v-icon class="me-1" size="small">mdi-lightbulb-on</v-icon>
      Class Tips
    </v-card-title>
    <v-card-text class="pa-3">
      <div class="tips-content">
        <div class="text-caption mb-2">
          <strong>Recommended Abilities</strong>
        </div>
        <div v-if="character.class" class="text-body-2">
          <div v-for="(ability, index) in getRecommendedAbilities(character.class)" :key="index" class="mb-1">
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

  function getRecommendedAbilities (characterClass) {
    const recommendations = {
      Barbarian: ['Strength', 'Constitution', 'Dexterity'],
      Bard: ['Charisma', 'Dexterity', 'Constitution'],
      Cleric: ['Wisdom', 'Constitution', 'Strength'],
      Druid: ['Wisdom', 'Constitution', 'Dexterity'],
      Fighter: ['Strength/Dexterity', 'Constitution', 'Intelligence/Wisdom'],
      Monk: ['Dexterity', 'Wisdom', 'Constitution'],
      Paladin: ['Strength', 'Charisma', 'Constitution'],
      Ranger: ['Dexterity', 'Wisdom', 'Constitution'],
      Rogue: ['Dexterity', 'Intelligence/Charisma', 'Constitution'],
      Sorcerer: ['Charisma', 'Constitution', 'Dexterity'],
      Warlock: ['Charisma', 'Constitution', 'Dexterity'],
      Wizard: ['Intelligence', 'Constitution', 'Dexterity'],
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
</style>
