<template>
  <div v-if="!characterData" class="text-center pa-4">
    <v-progress-circular indeterminate />
    <p>Loading character creator...</p>
  </div>

  <v-stepper v-else v-model="localCurrentStep" elevation="2" :items="stepItems">
    <!-- Step 1: Basic Info -->
    <template #item.1>
      <v-card class="px-8" flat>
        <v-card-title class="text-h5">Basic Info</v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field v-model="character.name" density="comfortable" label="Character Name" variant="outlined" />
            </v-col>
            <v-col>
              <v-select v-model="character.species" density="comfortable" item-title="name" item-value="id"
                :items="characterData?.speciesOptions?.value || []" label="Species" variant="outlined"
                @update:model-value="characterData?.updateSpeciesTraits" />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-select v-model="character.class" density="comfortable" item-title="name" item-value="id"
                :items="characterData?.classOptions?.value || []" label="Class" variant="outlined"
                @update:model-value="characterData?.updateClassTraits" />
            </v-col>
            <v-col>
              <v-select v-model="character.background" density="comfortable" item-title="name" item-value="id"
                :items="characterData?.backgroundOptions?.value || []" label="Background" variant="outlined"
                @update:model-value="characterData?.updateBackgroundTraits" />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field v-model.number="character.level" density="comfortable" label="Level" max="20" min="1"
            type="number" variant="outlined" />
            </v-col>
            <v-col>
              <v-select v-model="character.alignment" density="comfortable" :items="characterData?.alignmentOptions || []"
            label="Alignment" variant="outlined" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </template>

    <!-- Step 2: Ability Scores -->
    <template #item.2>
      <v-card class="px-6" flat>
        <v-card-title class="text-h5 pb-10">Ability Scores</v-card-title>
        <v-card-text>
          <v-row class="px-16 mx-16">
            <v-col v-for="statName in (characterData?.abilityNames || [])" :key="statName" cols="12" sm="6">
              <v-text-field v-model.number="character.abilityScores[statName].score" density="comfortable"
                :label="statName.toUpperCase()" type="number" variant="outlined"
                @input="characterData?.updateAbilityModifier?.(statName)">
                <template #append>
                  <v-chip class="ms-1 me-5" label size="small">
                    {{ character.abilityScores[statName].modifier >= 0 ? '+' : '' }}{{
                      character.abilityScores[statName].modifier }}
                  </v-chip>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </template>

    <!-- Step 3: Features -->
    <template #item.3>
      <v-card class="pa-6" flat>
        <v-card-title class="text-h5">Features & Proficiencies</v-card-title>
        <v-card-text>
          <p>Proficiency Bonus: +{{ character.proficiencyBonus }}</p>
          <p>Initiative: {{ character.initiative >= 0 ? '+' : '' }}{{ character.initiative }}</p>
          <p>Passive Perception: {{ character.passivePerception }}</p>
        </v-card-text>
      </v-card>
    </template>

    <!-- Step 4: Equipment -->
    <template #item.4>
      <v-card class="pa-6" flat>
        <v-card-title class="text-h5">Equipment & Coins</v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col cols="6" sm="3">
              <v-text-field v-model.number="character.coins.cp" density="comfortable" label="CP" min="0" type="number"
                variant="outlined" />
            </v-col>
            <v-col cols="6" sm="3">
              <v-text-field v-model.number="character.coins.sp" density="comfortable" label="SP" min="0" type="number"
                variant="outlined" />
            </v-col>
            <v-col cols="6" sm="3">
              <v-text-field v-model.number="character.coins.gp" density="comfortable" label="GP" min="0" type="number"
                variant="outlined" />
            </v-col>
            <v-col cols="6" sm="3">
              <v-text-field v-model.number="character.coins.pp" density="comfortable" label="PP" min="0" type="number"
                variant="outlined" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </template>

    <!-- Step 5: Final Details -->
    <template #item.5>
      <v-card class="pa-6" flat>
        <v-card-title class="text-h5">Final Details</v-card-title>
        <v-card-text>
          <v-textarea v-model="character.notes" auto-grow density="comfortable" label="Notes" rows="3"
            variant="outlined" />
          <v-row justify="end">
            <v-btn flex class="mt-4 mr-3" color="#822522" @click="$emit('submit-character')">
              Submit Character
            </v-btn>
          </v-row>
        </v-card-text>
      </v-card>
    </template>

    <!-- Navigation Actions -->
    <template #actions>
      <v-row justify="end">
        <v-btn v-if="localCurrentStep > 1" class="me-10 mb-10" variant="elevated" @click="previousStep">Back</v-btn>
      <v-btn v-if="localCurrentStep < 5" class="me-10 mb-10" variant="elevated" color="#822522"
        @click="nextStep">Next</v-btn>
      </v-row>
    </template>
  </v-stepper>
</template>

<script setup>
import { inject, computed } from 'vue'

const props = defineProps({
  character: {
    type: Object,
    required: true
  },
  currentStep: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update:current-step', 'submit-character'])

// Inject character data from parent
const characterData = inject('characterData')

// Step configuration
const stepItems = [
  { title: 'Basic Info', value: 1 },
  { title: 'Ability Scores', value: 2 },
  { title: 'Features', value: 3 },
  { title: 'Equipment', value: 4 },
  { title: 'Final Details', value: 5 }
]

// Two-way binding for current step
const localCurrentStep = computed({
  get: () => props.currentStep,
  set: (value) => emit('update:current-step', value)
})

// Navigation methods
const nextStep = () => {
  if (localCurrentStep.value < 5) {
    localCurrentStep.value++
  }
}

const previousStep = () => {
  if (localCurrentStep.value > 1) {
    localCurrentStep.value--
  }
}
</script>

<style scoped>
.v-card-title {
  font-weight: bold;
}
</style>
