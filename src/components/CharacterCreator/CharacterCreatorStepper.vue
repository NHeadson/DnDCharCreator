<template>
  <div>
    <div v-if="!characterData" class="text-center pa-4">
      <v-progress-circular indeterminate />
      <p>Loading character creator...</p>
    </div>

    <template v-else>
      <v-alert v-if="characterData.speciesError?.value" class="ma-4" type="warning">
        <v-alert-title>API Warning</v-alert-title>
        Failed to load races from API: {{ characterData.speciesError.value }}
        <br />
        Using fallback data instead.
      </v-alert>

      <v-stepper v-model="localCurrentStep" elevation="2" :items="stepItems" :mobile="$vuetify.display.mdAndDown">
        <template #actions="{ next, prev }">
          <div class="navigation-buttons" :class="{ 'mobile-nav': $vuetify.display.smAndDown }">
            <v-btn v-if="localCurrentStep > 1" :size="$vuetify.display.smAndDown ? 'small' : 'default'" variant="text" @click="prev">
              <v-icon v-if="$vuetify.display.smAndDown" icon="mdi-chevron-left" />
              <span v-else>Previous</span>
            </v-btn>
            <v-spacer />

            <!-- Validation error message -->
            <v-alert v-if="validationError && localCurrentStep < 5" class="validation-error-alert" density="compact" type="warning" variant="tonal">
              {{ validationError }}
            </v-alert>

            <v-spacer />
            <v-btn v-if="localCurrentStep < 5" color="primary" :disabled="!canProceedToNext" :size="$vuetify.display.smAndDown ? 'small' : 'default'" variant="elevated" @click="handleNext(next)">
              <span v-if="!$vuetify.display.smAndDown">Next</span>
              <v-icon v-else icon="mdi-chevron-right" />
            </v-btn>
            <v-btn
              v-else-if="localCurrentStep === 5"
              class="save-character-btn-centered"
              color="success"
              :prepend-icon="$vuetify.display.smAndDown ? undefined : 'mdi-content-save'"
              :size="$vuetify.display.smAndDown ? 'default' : 'x-large'"
              variant="elevated"
              @click="saveCharacter"
            >
              <v-icon v-if="$vuetify.display.smAndDown" class="me-2" icon="mdi-content-save" />
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

        <!-- Step 3: Skills & Proficiencies -->
        <template #item.3>
          <div>
            <SkillsProficiencies :character="character" :character-data="characterData" />
          </div>
        </template>

        <!-- Step 4: Inventory & Equipment -->
        <template #item.4>
          <div>
            <InventoryEquipment :character="character" :character-data="characterData" />
          </div>
        </template>

        <!-- Step 5: Summary -->
        <template #item.5>
          <div>
            <CharacterSummary :character="character" :character-data="characterData" />
          </div>
        </template>
      </v-stepper>
    </template>
    <!-- Removed extra navigation buttons; only stepper navigation remains -->
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import AbilityScores from './steps/AbilityScores.vue'
import CharacterInformation from './steps/CharacterInformation.vue'
import CharacterSummary from './steps/CharacterSummary.vue'
import InventoryEquipment from './steps/InventoryEquipment.vue'
import SkillsProficiencies from './steps/SkillsProficiencies.vue'

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
const validationError = ref('')

// Validation functions for each step
const validateStep1 = () => {
  // Step 1: Character Information - must have name, portrait, player name, species, class, background, and alignment
  if (!props.character.name || props.character.name.trim() === '') {
    return 'Please enter a character name'
  }
  if (!props.character.portrait) {
    return 'Please select a character portrait'
  }
  if (!props.character.playerName || props.character.playerName.trim() === '') {
    return 'Please enter a player name'
  }
  if (!props.character.species) {
    return 'Please select a species'
  }
  if (!props.character.class) {
    return 'Please select a class'
  }
  if (!props.character.background) {
    return 'Please select a background'
  }
  if (!props.character.alignment) {
    return 'Please select an alignment'
  }
  return null
}

const validateStep2 = () => {
  // Step 2: Ability Scores - must have all 6 ability scores assigned
  const abilities = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']
  for (const ability of abilities) {
    const score = props.character.abilityScores?.[ability]?.score
    if (score === null || score === undefined || score < 1) {
      return `Please assign a value to ${ability.charAt(0).toUpperCase() + ability.slice(1)}`
    }
  }
  return null
}

const validateStep3 = () => {
  // Step 3: Skills & Proficiencies - must select required number of class skills
  const requiredSkills = props.character.classDetails?.skillProficiencies?.count || props.character.classDetails?.skillChoices || 0

  if (requiredSkills > 0) {
    const selectedSkills = props.character.selectedClassSkills?.length || 0
    if (selectedSkills < requiredSkills) {
      return `Please select ${requiredSkills} skill proficiencies (${selectedSkills}/${requiredSkills} selected)`
    }
  }

  return null
}

const validateStep4 = () => {
  // Step 4: Inventory & Equipment - must make all equipment choices
  // Check if using package method (standard equipment)
  const equipmentMethod = props.character.equipmentMethod || 'package'

  if (equipmentMethod === 'package') {
    // Count how many equipment choices are available
    const classEquipmentOptions = props.character.classDetails?.startingEquipmentOptions || []

    // Count choices that have multiple options (need user selection)
    let choicesNeeded = 0
    classEquipmentOptions.forEach((choice) => {
      if (choice.choose && choice.from && choice.from.options && choice.from.options.length > 1) {
        choicesNeeded++
      }
    })

    // Check how many choices have been made
    const equipmentChoices = props.character.equipmentChoices || []
    const choicesMade = equipmentChoices.filter((choice) => choice !== null && choice !== undefined).length

    if (choicesMade < choicesNeeded) {
      return `Please make all equipment selections (${choicesMade}/${choicesNeeded} selected)`
    }
  }

  return null
}

// Get validation error for current step
const getCurrentStepValidation = () => {
  switch (localCurrentStep.value) {
    case 1:
      return validateStep1()
    case 2:
      return validateStep2()
    case 3:
      return validateStep3()
    case 4:
      return validateStep4()
    default:
      return null
  }
}

// Check if we can proceed to next step
const canProceedToNext = computed(() => {
  const error = getCurrentStepValidation()
  validationError.value = error || ''
  return !error
})

// Save character function
const saveCharacter = () => {
  console.log('Save Character button clicked on step:', localCurrentStep.value)
  emit('submit-character')
}

// Watch for external currentStep changes
watch(
  () => props.currentStep,
  (newStep) => {
    console.log('External step change:', newStep)
    localCurrentStep.value = newStep
  }
)

// Watch for local step changes and emit them
watch(localCurrentStep, (newStep) => {
  console.log('Local step change to:', newStep)
  validationError.value = '' // Clear validation error when changing steps
  emit('update:current-step', newStep)
})

// Custom next function with validation
const handleNext = (defaultNext) => {
  const error = getCurrentStepValidation()
  if (error) {
    validationError.value = error
    return
  }
  validationError.value = ''
  defaultNext()
}

// Function to determine if a step should be enabled (optional validation)
const isStepEnabled = (stepValue) => {
  // Allow clicking on any step for now - you can add validation later
  // For example: return stepValue <= maxAllowedStep.value
  return true
}

// Enhanced step items with better mobile-friendly titles
const stepItems = [
  {
    title: 'Character Info',
    subtitle: 'Species, Class, Background',
    value: 1,
    icon: 'mdi-account-edit',
  },
  {
    title: 'Abilities',
    subtitle: 'Ability Scores',
    value: 2,
    icon: 'mdi-dice-6',
  },
  {
    title: 'Skills & Proficiencies',
    subtitle: 'What You Know',
    value: 3,
    icon: 'mdi-brain',
  },
  {
    title: 'Inventory & Equipment',
    subtitle: 'What You Own',
    value: 4,
    icon: 'mdi-package-variant',
  },
  {
    title: 'Summary',
    subtitle: 'Review & Save',
    value: 5,
    icon: 'mdi-check-circle',
  },
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

.validation-error-alert {
  max-width: 400px;
  margin: 0 16px;
  animation: shake 0.5s ease-in-out;
}

.validation-error-alert :deep(.v-alert__content) {
  text-align: center;
  width: 100%;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-10px);
  }

  75% {
    transform: translateX(10px);
  }
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
  background: linear-gradient(135deg, #16a34a, #15803d, #14532d) !important;
  color: #ffffff !important;
  font-weight: 700;
  font-size: 1.3rem;
  padding: 16px 48px !important;
  border-radius: 16px;
  box-shadow:
    0 4px 12px rgba(21, 128, 61, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: none;
  letter-spacing: 0.8px;
  min-width: 280px;
  height: 64px;
  margin: 8px 16px;
  position: relative;
  overflow: hidden;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.save-character-btn-centered::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.save-character-btn-centered:hover {
  transform: translateY(-4px) scale(1.03);
  box-shadow:
    0 8px 20px rgba(21, 128, 61, 0.3),
    0 3px 10px rgba(21, 128, 61, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.2) inset !important;
  background: linear-gradient(135deg, #22c55e, #16a34a, #15803d) !important;
}

.save-character-btn-centered:hover::before {
  left: 100%;
}

.save-character-btn-centered:active {
  transform: translateY(-2px) scale(1.02);
  box-shadow:
    0 6px 18px rgba(21, 128, 61, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.15) inset !important;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 8px 16px 16px 16px;
  margin: 16px 0;
}

.mobile-nav {
  padding: 12px 8px;
  margin: 8px 0;
}

.mobile-nav .save-character-btn-centered {
  min-width: 200px;
  height: 52px;
  margin: 4px 8px;
  font-size: 1.1rem;
  padding: 12px 32px !important;
  border-radius: 14px;
}

/* Mobile responsive adjustments */
@media (max-width: 600px) {
  .navigation-buttons {
    padding: 8px 8px 16px 8px;
    margin: 12px 0;
  }

  .save-character-btn-centered {
    min-width: 240px;
    height: 56px;
    margin: 4px 8px;
    font-size: 1.2rem;
    padding: 14px 36px !important;
    border-radius: 14px;
  }

  .save-character-btn-centered:hover {
    transform: translateY(-2px) scale(1.01);
  }
}

/* Stepper header customization */
:deep(.v-stepper-header) {
  padding: 12px 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.v-stepper-item) {
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
  margin: 0 4px;
}

:deep(.v-stepper-item:hover) {
  background-color: rgba(var(--v-theme-primary), 0.08);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

:deep(.v-stepper-item--selected) {
  background-color: rgba(var(--v-theme-primary), 0.12);
  box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.2);
}

:deep(.v-stepper-item--complete) {
  background-color: rgba(var(--v-theme-success), 0.05);
}

:deep(.v-stepper-item--complete .v-stepper-item__icon) {
  background-color: var(--v-theme-success) !important;
  box-shadow: 0 2px 4px rgba(var(--v-theme-success), 0.3);
}

:deep(.v-stepper-item--selected .v-stepper-item__icon) {
  background-color: var(--v-theme-primary) !important;
  box-shadow: 0 2px 4px rgba(var(--v-theme-primary), 0.3);
}

:deep(.v-stepper-item__title) {
  font-weight: 600;
  transition: color 0.2s ease;
}

:deep(.v-stepper-item:hover .v-stepper-item__title) {
  color: var(--v-theme-primary);
}

/* Add subtle animation to icons */
:deep(.v-stepper-item__icon) {
  transition: all 0.2s ease;
}

:deep(.v-stepper-item:hover .v-stepper-item__icon) {
  transform: scale(1.05);
}

/* Mobile stepper adjustments */
@media (max-width: 600px) {
  :deep(.v-stepper-header) {
    padding: 8px 12px;
  }

  :deep(.v-stepper-item) {
    margin: 0 2px;
    min-height: 64px;
    /* Larger tap targets */
    border-radius: 12px;
  }

  :deep(.v-stepper-item:hover) {
    transform: none;
    /* Disable transform on mobile */
    background-color: rgba(var(--v-theme-primary), 0.1);
  }

  :deep(.v-stepper-item__title) {
    font-size: 0.875rem !important;
    line-height: 1.2;
  }

  :deep(.v-stepper-item__subtitle) {
    font-size: 0.75rem !important;
    line-height: 1.1;
  }

  :deep(.v-stepper-item__icon) {
    margin-bottom: 4px;
  }
}

@media (max-width: 480px) {
  :deep(.v-stepper-item__title) {
    font-size: 0.8rem !important;
  }

  :deep(.v-stepper-item__subtitle) {
    font-size: 0.7rem !important;
  }

  :deep(.v-stepper-item) {
    min-height: 56px;
    padding: 8px 4px;
  }
}

/* Extra spacing for save button step */
.navigation-buttons:has(.save-character-btn-centered) {
  padding: 36px 24px;
  margin: 24px 0;
}

@media (max-width: 960px) {
  .v-stepper {
    --v-stepper-header-padding: 1rem;
  }
}
</style>
