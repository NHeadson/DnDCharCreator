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
      <template #next-text="{ next }">
        <!-- Current step: {{ localCurrentStep }} -->
        <v-btn v-if="localCurrentStep < 5" class="force-primary-btn" color="accent" variant="elevated" @click="next">
          Next
        </v-btn>
      </template>

      <template #actions="{ next, prev }">
        <div class="navigation-buttons">
          <v-btn v-if="localCurrentStep > 1" variant="text" @click="prev">
            Previous
          </v-btn>
          <v-spacer />
          <v-btn v-if="localCurrentStep < 5" class="force-primary-btn" color="accent" variant="elevated" @click="next">
            Next
          </v-btn>
          <v-btn v-else-if="localCurrentStep === 5" class="save-character-btn-centered" color="success"
            variant="elevated" size="x-large" prepend-icon="mdi-content-save" @click="saveCharacter">
            Save Character
          </v-btn>
        </div>
      </template>
      <!-- Step 1: Character Information -->
      <template #item.1>
        <div>
          <CharacterInformation :character="character" :character-data="characterData" />
        </div>
      </template>

      <!-- Step 2: Ability Scores -->
      <template #item.2>
        <div>
          <AbilityScores :character="character" :character-data="characterData" />
        </div>
      </template>

      <!-- Step 3: Features -->
      <template #item.3>
        <div>
          <FeaturesAndTraits :character="character" :character-data="characterData" />
        </div>
      </template>

      <!-- Step 4: Equipment -->
      <template #item.4>
        <div>
          <EquipmentAndGear :character="character" :character-data="characterData" />
        </div>
      </template>

      <!-- Step 5: Summary -->
      <template #item.5>
        <div>
          <CharacterSummary :character="character" :character-data="characterData" />
        </div>
      </template>
    </v-stepper>
    <!-- Removed extra navigation buttons; only stepper navigation remains -->
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import AbilityScores from './steps/AbilityScores.vue'
import CharacterInformation from './steps/CharacterInformation.vue'
import CharacterSummary from './steps/CharacterSummary.vue'
import EquipmentAndGear from './steps/EquipmentAndGear.vue'
import FeaturesAndTraits from './steps/FeaturesAndTraits.vue'

const props = defineProps({
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

const emit = defineEmits(['update:current-step', 'submit-character'])

const localCurrentStep = ref(props.currentStep)

// Save character function
const saveCharacter = () => {
  console.log('Save Character button clicked on step:', localCurrentStep.value)
  emit('submit-character')
}

// Watch for external currentStep changes
watch(() => props.currentStep, (newStep) => {
  console.log('External step change:', newStep)
  localCurrentStep.value = newStep
})

// Watch for local step changes and emit them
watch(localCurrentStep, (newStep) => {
  console.log('Local step change to:', newStep)
  emit('update:current-step', newStep)
})

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

.force-primary-btn {
  background-color: var(--v-theme-primary) !important;
  color: #fff !important;
  font-weight: 600;
  font-size: 1.1rem;
}

.save-character-btn {
  background-color: var(--v-theme-success) !important;
  color: #fff !important;
  font-weight: 700;
  font-size: 1.2rem;
  padding: 12px 24px !important;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(var(--v-theme-success), 0.3) !important;
  transition: all 0.3s ease;
}

.save-character-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(var(--v-theme-success), 0.4) !important;
}

/* Enhanced Save Button Styling */
.save-character-btn-centered {
  background: linear-gradient(135deg, rgb(var(--v-theme-success)), rgb(var(--v-theme-success-darken-1))) !important;
  color: #fff !important;
  font-weight: 700;
  font-size: 1.3rem;
  padding: 16px 48px !important;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(var(--v-theme-success), 0.4) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: none;
  letter-spacing: 0.5px;
  min-width: 250px;
  height: 60px;
  margin: 8px 16px;
}

.save-character-btn-centered:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 12px 28px rgba(var(--v-theme-success), 0.5) !important;
  background: linear-gradient(135deg, rgb(var(--v-theme-success-lighten-1)), rgb(var(--v-theme-success))) !important;
}

.save-character-btn-centered:active {
  transform: translateY(-1px) scale(1.01);
  box-shadow: 0 8px 24px rgba(var(--v-theme-success), 0.45) !important;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 24px 16px;
  margin: 16px 0;
}

/* Extra spacing for save button step */
.navigation-buttons:has(.save-character-btn-centered) {
  padding: 36px 24px;
  margin: 24px 0;
}
</style>
