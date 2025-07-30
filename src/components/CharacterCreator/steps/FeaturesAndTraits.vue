<template>
  <v-card flat>
    <v-card-title class="text-h4 text-center mb-4">🎯 Features & Choices</v-card-title>
    <v-card-subtitle class="text-center mb-4">
      Make important decisions about your character's abilities and proficiencies
    </v-card-subtitle>
    <v-card-text>
      <!-- Core Stats Cards -->
      <v-row class="mb-6">
        <v-col cols="12" md="4">
          <v-card color="primary" variant="outlined">
            <v-card-title class="text-center">⚔️ Combat Stats</v-card-title>
            <v-card-text>
              <v-list density="compact">
                <v-list-item>
                  <v-list-item-title>Proficiency Bonus</v-list-item-title>
                  <template #append>
                    <v-chip color="primary" size="small">+{{ character.proficiencyBonus }}</v-chip>
                  </template>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Initiative</v-list-item-title>
                  <template #append>
                    <v-chip :color="character.initiative >= 0 ? 'green' : 'red'" size="small">
                      {{ character.initiative >= 0 ? '+' : '' }}{{ character.initiative }}
                    </v-chip>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Skill Selection -->
      <v-card class="mb-6" variant="outlined">
        <v-card-title class="text-h6">📋 Skill Proficiencies</v-card-title>
        <v-card-text>
          <v-row>
            <v-col
              v-for="skill in getProficientSkills"
              :key="skill.name"
              cols="12"
              md="4"
              sm="6"
            >
              <v-card class="skill-card" color="blue-lighten-5" variant="tonal">
                <v-card-text class="py-2">
                  <div class="d-flex align-center">
                    {{ skill.name }}
                    <v-spacer />
                    <v-chip color="primary" size="x-small">
                      {{ skill.ability }}
                    </v-chip>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script setup>
  import { computed } from 'vue'

  defineProps({
    character: {
      type: Object,
      required: true,
    },
    characterData: {
      type: Object,
      required: true,
    },
  })

  const getProficientSkills = computed(() => {
    // Implementation
    return []
  })
</script>

<style scoped>
.skill-card {
  transition: all 0.3s ease;
}
</style>
