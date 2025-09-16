<template>
  <v-card flat>
    <v-card-title class="text-h4 text-center mb-4">⚔️ Skills & Proficiencies</v-card-title>
    <v-card-subtitle class="text-center mb-6">
      Develop your character's expertise and combat readiness
    </v-card-subtitle>
    <v-card-text>

      <!-- Core Stats Row -->
      <v-row class="mb-6">
        <!-- Hit Points -->
        <v-col cols="12" md="4">
          <v-card class="skill-card pa-4 text-center" color="error" variant="outlined">
            <v-icon size="large" class="mb-2" color="error">mdi-heart</v-icon>
            <div class="text-h6 mb-2">Hit Points</div>
            <div class="text-h3 text-error">{{ calculateHitPoints }}</div>
            <div class="text-body-2 mt-2">
              <strong>Base:</strong> {{ getFormattedHPCalculation }}
            </div>
            <!-- Weapon Proficiencies -->
            <div class="mt-4 text-left">
              <div class="text-body-2 text-medium-emphasis mb-1">Weapon Proficiencies</div>
              <div v-if="hasWeaponProficiencies">
                <div class="d-flex align-center">
                  <v-icon size="small" class="mr-1" color="success">mdi-check-circle</v-icon>
                  <div class="text-body-2">{{ character.weaponProficiencies?.length || 0 }} proficiencies</div>
                </div>
              </div>
              <div v-else>
                <div class="d-flex align-center">
                  <v-icon size="small" class="mr-1" color="warning">mdi-alert-circle</v-icon>
                  <div class="text-body-2">No weapon proficiencies</div>
                </div>
              </div>
            </div>
          </v-card>
        </v-col>

        <!-- Armor Class -->
        <v-col cols="12" md="4">
          <v-card class="skill-card pa-4 text-center" color="primary" variant="outlined">
            <v-icon size="large" class="mb-2" color="primary">mdi-shield</v-icon>
            <div class="text-h6 mb-2">Armor Class</div>
            <div class="text-h3 text-blue">{{ calculateArmorClass }}</div>
            <div class="text-body-2 mt-2">
              <strong>Base:</strong> {{ getFormattedACCalculation }}
            </div>
            <!-- Armor Proficiencies -->
            <div class="mt-4 text-left">
              <div class="text-body-2 text-medium-emphasis mb-1">Armor Training</div>
              <div v-if="hasArmorProficiencies">
                <div class="d-flex align-center">
                  <v-icon size="small" class="mr-1" color="success">mdi-check-circle</v-icon>
                  <div class="text-body-2">Armor proficiencies available</div>
                </div>
              </div>
              <div v-else>
                <div class="d-flex align-center">
                  <v-icon size="small" class="mr-1" color="warning">mdi-alert-circle</v-icon>
                  <div class="text-body-2">Limited armor training</div>
                </div>
              </div>
            </div>
          </v-card>
        </v-col>

        <!-- Proficiency Bonus -->
        <v-col cols="12" md="4">
          <v-card class="skill-card pa-4 text-center" color="purple" variant="outlined">
            <v-icon size="large" class="mb-2" color="purple">mdi-star</v-icon>
            <div class="text-h6 mb-2">Proficiency Bonus</div>
            <div class="text-h3 text-purple">+{{ character.proficiencyBonus }}</div>
            <div class="text-body-2 mt-2">
              <strong>Level {{ character.level || 1 }}</strong>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Skills Section -->
      <v-card class="mb-6" variant="outlined">
        <v-card-title class="text-h6">🎯 Skill Proficiencies</v-card-title>
        <v-card-subtitle class="text-body-2 mb-4">
          Your character's trained abilities and areas of expertise
        </v-card-subtitle>

        <v-card-text>
          <!-- Current Proficiencies Display -->
          <div class="mb-4">
            <h3 class="text-subtitle-1 mb-3 text-success">Current Skill Proficiencies</h3>
            <div class="ml-4">
              <div class="d-flex flex-wrap ga-2">
                <v-chip v-for="skill in getAllSkillProficiencies" :key="skill" color="success" variant="tonal">
                  <v-icon size="x-small" start>mdi-check</v-icon>
                  {{ skill }}
                </v-chip>
              </div>
              <div v-if="getAllSkillProficiencies.length === 0" class="text-body-2 text-medium-emphasis">
                No skill proficiencies yet
              </div>
            </div>
          </div>

          <!-- Class Skill Choices -->
          <div v-if="hasClassSkillChoices">
            <h3 class="text-subtitle-1 mb-3 text-primary">Choose Class Skills</h3>
            <div class="text-body-2 text-medium-emphasis mb-3">
              Select {{ getClassSkillChoices }} skill(s) from your class options
              ({{ character.selectedClassSkills?.length || 0 }}/{{ getClassSkillChoices }} selected)
            </div>

            <v-tooltip location="top" text="Skills available to your class">
              <template #activator="{ props }">
                <v-btn v-bind="props" variant="outlined" size="small" class="mb-3" prepend-icon="mdi-information">
                  Show Available Skills
                </v-btn>
              </template>
            </v-tooltip>

            <div class="ml-4">
              <div class="d-flex flex-wrap ga-2">
                <v-chip v-for="skill in getClassSkillOptions" :key="skill.name" clickable
                  :color="character.selectedClassSkills?.includes(skill.name) ? 'primary' : 'default'"
                  :variant="character.selectedClassSkills?.includes(skill.name) ? 'elevated' : 'outlined'"
                  @click="toggleClassSkill(skill.name)">
                  <v-icon size="x-small" start>mdi-school</v-icon>
                  {{ skill.name }}
                </v-chip>
              </div>
            </div>
          </div>

          <!-- Expertise Choices -->
          <div v-if="hasExpertiseChoices">
            <h3 class="text-subtitle-1 mb-3 mt-4 text-orange">Choose Expertise</h3>
            <div class="text-body-2 text-medium-emphasis mb-3">
              Double your proficiency bonus for these skills
              ({{ character.selectedExpertise?.length || 0 }}/2 selected)
            </div>

            <div class="ml-4">
              <div class="d-flex flex-wrap ga-2">
                <v-chip v-for="skill in getAllSkillProficiencies" :key="skill" clickable
                  :color="character.selectedExpertise?.includes(skill) ? 'orange' : 'default'"
                  :variant="character.selectedExpertise?.includes(skill) ? 'elevated' : 'outlined'"
                  @click="toggleExpertise(skill)">
                  <v-icon size="x-small" start>mdi-star</v-icon>
                  {{ skill }}
                </v-chip>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>

    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  character: {
    type: Object,
    required: true
  },
  characterData: {
    type: Object,
    required: true
  }
})

// Character reference
const character = props.character
const characterData = props.characterData

// Simplified computed properties to avoid errors
const calculateHitPoints = computed(() => {
  if (!character?.classDetails) return 0
  const hitDie = character.classDetails.hit_die || 6
  const constitution = character.abilityScores?.constitution?.score || 10
  const conModifier = Math.floor((constitution - 10) / 2)
  return hitDie + conModifier
})

const calculateArmorClass = computed(() => {
  const dexterity = character?.abilityScores?.dexterity?.score || 10
  const dexModifier = Math.floor((dexterity - 10) / 2)
  return 10 + dexModifier
})

const getFormattedHPCalculation = computed(() => {
  const hitDie = character?.classDetails?.hit_die || 6
  const conModifier = Math.floor(((character?.abilityScores?.constitution?.score || 10) - 10) / 2)
  const sign = conModifier >= 0 ? '+' : ''
  return `d${hitDie} ${sign}${conModifier} CON`
})

const getFormattedACCalculation = computed(() => {
  const dexModifier = Math.floor(((character?.abilityScores?.dexterity?.score || 10) - 10) / 2)
  const sign = dexModifier >= 0 ? '+' : ''
  return `10 ${sign}${dexModifier} DEX`
})

const hasWeaponProficiencies = computed(() => {
  return character?.weaponProficiencies && character.weaponProficiencies.length > 0
})

const hasArmorProficiencies = computed(() => {
  return character?.armorTraining && Object.values(character.armorTraining).some(Boolean)
})

const hasClassSkillChoices = computed(() => {
  return character?.classDetails?.skillProficiencies?.count > 0 ||
    character?.classDetails?.skillChoices > 0
})

const hasExpertiseChoices = computed(() => {
  // Simplified check for classes that get expertise (like Rogue, Bard)
  const classesWithExpertise = ['rogue', 'bard']
  return classesWithExpertise.includes(character?.class?.toLowerCase() || '')
})

const getClassSkillChoices = computed(() => {
  return character?.classDetails?.skillProficiencies?.count ||
    character?.classDetails?.skillChoices || 0
})

const getClassSkillOptions = computed(() => {
  // Return a simplified list of available skills
  const allSkills = [
    { name: 'Acrobatics' }, { name: 'Animal Handling' }, { name: 'Arcana' },
    { name: 'Athletics' }, { name: 'Deception' }, { name: 'History' },
    { name: 'Insight' }, { name: 'Intimidation' }, { name: 'Investigation' },
    { name: 'Medicine' }, { name: 'Nature' }, { name: 'Perception' },
    { name: 'Performance' }, { name: 'Persuasion' }, { name: 'Religion' },
    { name: 'Sleight of Hand' }, { name: 'Stealth' }, { name: 'Survival' }
  ]

  return allSkills
})

const getAllSkillProficiencies = computed(() => {
  const skills = []

  // Add selected class skills
  if (character?.selectedClassSkills) {
    skills.push(...character.selectedClassSkills)
  }

  return [...new Set(skills)] // Remove duplicates
})

// Functions
const toggleClassSkill = (skillName) => {
  if (!character.selectedClassSkills) {
    character.selectedClassSkills = []
  }

  const index = character.selectedClassSkills.indexOf(skillName)
  const maxChoices = getClassSkillChoices.value

  if (index > -1) {
    character.selectedClassSkills.splice(index, 1)
  } else if (character.selectedClassSkills.length < maxChoices) {
    character.selectedClassSkills.push(skillName)
  }
}

const toggleExpertise = (skillName) => {
  if (!character.selectedExpertise) {
    character.selectedExpertise = []
  }

  const index = character.selectedExpertise.indexOf(skillName)
  const maxExpertise = 2

  if (index > -1) {
    character.selectedExpertise.splice(index, 1)
  } else if (character.selectedExpertise.length < maxExpertise) {
    character.selectedExpertise.push(skillName)
  }
}
</script>

<style scoped>
.skill-card {
  height: 100%;
}

.skill-card:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}
</style>
