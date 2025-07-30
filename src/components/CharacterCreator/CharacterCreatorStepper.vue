<template>
  <div>
    <div v-if="!characterData" class="text-center pa-4">
      <v-progress-circular indeterminate />
      <p>Loading character creator...</p>
    </div>

    <v-alert v-else-if="characterData.speciesError?.value" class="ma-4" type="warning">
      <v-alert-title>API Warning</v-alert-title>
      Failed to load races from API: {{ characterData.speciesError.value }}
      <br>Using fallback data instead.
    </v-alert>

    <v-stepper v-else v-model="localCurrentStep" elevation="2" :items="stepItems">
      <!-- Step 1: Character Information -->
      <template #item.1>
        <character-information :character="character" :character-data="characterData" />
      </template>

      <!-- Step 2: Ability Scores -->
      <template #item.2>
        <ability-scores :character="character" :character-data="characterData" />
      </template>

      <!-- Step 3: Features -->
      <template #item.3>
        <features-and-traits :character="character" :character-data="characterData" />
      </template>

      <!-- Step 4: Equipment -->
      <template #item.4>
        <equipment-and-gear :character="character" :character-data="characterData" />
      </template>

      <!-- Step 5: Summary -->
      <template #item.5>
        <character-summary :character="character" :character-data="characterData" />
      </template>
    </v-stepper>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import AbilityScores from './steps/AbilityScores.vue'
  import CharacterInformation from './steps/CharacterInformation.vue'
  import CharacterSummary from './steps/CharacterSummary.vue'
  import EquipmentAndGear from './steps/EquipmentAndGear.vue'
  import FeaturesAndTraits from './steps/FeaturesAndTraits.vue'

  defineProps({
    character: {
      type: Object,
      required: true,
    },
    characterData: {
      type: Object,
      required: true,
    },
    currentStep: {
      type: Number,
      default: 1,
    },
  })

  defineEmits(['update:current-step'])

  const localCurrentStep = ref(1)

  const stepItems = [
    { title: 'Character', value: 1 },
    { title: 'Abilities', value: 2 },
    { title: 'Features', value: 3 },
    { title: 'Equipment', value: 4 },
    { title: 'Summary', value: 5 },
  ]
</script>

<style scoped>
.ability-card-enhanced {
  transition: all 0.3s ease;
}

.skill-card {
  transition: all 0.3s ease;
}

.equipment-category-header-compact {
  padding: 8px 16px;
}
</style>
