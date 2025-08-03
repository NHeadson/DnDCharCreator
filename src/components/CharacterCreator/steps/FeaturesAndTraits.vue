<template>
  <v-card flat>
    <v-card-title class="text-h4 text-center mb-4">🎯 Features & Traits</v-card-title>
    <v-card-subtitle class="text-center mb-4">
      Configure your character's abilities, proficiencies, and special features
    </v-card-subtitle>
    <v-card-text>

      <!-- Core Combat Stats -->
      <v-row class="mb-6">
        <v-col cols="12" md="4">
          <v-card color="red-lighten-4" variant="outlined">
            <v-card-title class="text-center">❤️ Hit Points</v-card-title>
            <v-card-text>
              <div class="text-center">
                <div class="text-h3 text-red">{{ calculateHitPoints }}</div>
                <div class="text-caption">Maximum HP</div>
                <v-divider class="my-2" />
                <div class="text-body-2">
                  <strong>Base:</strong> {{ getClassHitDie }} + {{ getConModifier }} (Con)
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card color="blue-lighten-4" variant="outlined">
            <v-card-title class="text-center">🛡️ Armor Class</v-card-title>
            <v-card-text>
              <div class="text-center">
                <div class="text-h3 text-blue">{{ calculateArmorClass }}</div>
                <div class="text-caption">AC</div>
                <v-divider class="my-2" />
                <div class="text-body-2">
                  <strong>Base:</strong> 10 + {{ getDexModifier }} (Dex)
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card color="green-lighten-4" variant="outlined">
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
                    <v-chip :color="getDexModifier >= 0 ? 'green' : 'red'" size="small">
                      {{ getDexModifier >= 0 ? '+' : '' }}{{ getDexModifier }}
                    </v-chip>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Species Features -->
      <v-card v-if="character.speciesDetails" class="mb-6" variant="outlined">
        <v-card-title class="text-h6">🧬 Species Features ({{ character.speciesDetails.name }})</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <div class="mb-4">
                <h4>📏 Size & Speed</h4>
                <v-chip-group>
                  <v-chip color="primary" size="small">Size: {{ character.speciesDetails.size || 'Medium' }}</v-chip>
                  <v-chip color="secondary" size="small">Speed: {{ character.speciesDetails.speed || 30 }} ft</v-chip>
                </v-chip-group>
              </div>

              <div v-if="character.speciesDetails.ability_bonuses?.length" class="mb-4">
                <h4>💪 Ability Score Increases</h4>
                <v-chip-group>
                  <v-chip v-for="bonus in character.speciesDetails.ability_bonuses" :key="bonus.ability_score?.name"
                    color="success" size="small">
                    {{ bonus.ability_score?.name }}: +{{ bonus.bonus }}
                  </v-chip>
                </v-chip-group>
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <div v-if="character.speciesDetails.languages?.length" class="mb-4">
                <h4>🗣️ Languages</h4>
                <v-chip-group>
                  <v-chip v-for="lang in character.speciesDetails.languages" :key="lang.index || lang.name" color="info"
                    size="small">
                    {{ typeof lang === 'string' ? lang : lang.name }}
                  </v-chip>
                </v-chip-group>
              </div>



              <div v-if="speciesTraitsWithDetails.length" class="mb-4">
                <h4>✨ Special Traits</h4>
                <div class="trait-accordion">
                  <v-card v-for="(trait, index) in speciesTraitsWithDetails" :key="trait.name || trait.index"
                    class="mb-2" variant="outlined">
                    <v-card-title class="pa-3 cursor-pointer trait-header" @click="toggleTrait(index)"
                      :class="{ 'trait-expanded': expandedTraits[index] }">
                      <v-icon class="mr-2">{{ expandedTraits[index] ? 'mdi-chevron-down' : 'mdi-chevron-right'
                      }}</v-icon>
                      {{ trait.name || 'Unknown Trait' }}
                    </v-card-title>
                    <v-expand-transition>
                      <v-card-text v-if="expandedTraits[index]" class="pt-0">
                        <v-divider class="mb-3"></v-divider>
                        <div v-if="Array.isArray(trait.desc) && trait.desc.length">
                          <p v-for="(desc, descIndex) in trait.desc" :key="descIndex" class="mb-2">
                            {{ desc }}
                          </p>
                        </div>
                        <div v-else-if="trait.desc">
                          <p>{{ trait.desc }}</p>
                        </div>
                        <div v-else class="text-caption text-grey">
                          Loading trait details...
                        </div>
                      </v-card-text>
                    </v-expand-transition>
                  </v-card>
                </div>
              </div>

              <!-- Show this if no traits are found -->
              <div v-else-if="character.speciesDetails" class="mb-4">
                <h4>✨ Special Traits</h4>
                <p class="text-caption">No traits found for {{ character.speciesDetails.name }}.</p>
                <pre
                  class="text-caption">{{ JSON.stringify(character.speciesDetails, null, 2).substring(0, 500) }}...</pre>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Class Features -->
      <v-card v-if="character.classDetails" class="mb-6" variant="outlined">
        <v-card-title class="text-h6">⚔️ Class Features ({{ character.classDetails.name }})</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <div class="mb-4">
                <h4>🎲 Hit Die & Proficiencies</h4>
                <v-chip-group>
                  <v-chip color="red" size="small">Hit Die: d{{ character.classDetails.hit_die ||
                    character.classDetails.hpDie?.replace('D', '') || '8' }}</v-chip>
                  <v-chip color="primary" size="small">Primary: {{
                    Array.isArray(character.classDetails.primary_ability)
                      ? character.classDetails.primary_ability.join(', ')
                      : character.classDetails.primaryAbility || character.classDetails.primary_ability || 'Varies'
                  }}</v-chip>
                </v-chip-group>
              </div>

              <div v-if="character.classDetails.saving_throws?.length || character.classDetails.savingThrows?.length"
                class="mb-4">
                <h4>🛡️ Saving Throw Proficiencies</h4>
                <v-chip-group>
                  <v-chip
                    v-for="save in (character.classDetails.saving_throws || character.classDetails.savingThrows || [])"
                    :key="typeof save === 'string' ? save : save.name" color="warning" size="small">
                    {{ typeof save === 'string' ? save : save.name }}
                  </v-chip>
                </v-chip-group>
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <div v-if="availableClassSkills.length" class="mb-4">
                <h4>📚 Choose Class Skills</h4>
                <p class="text-caption mb-2">Select {{ getClassSkillChoices }} skills from your class list:</p>
                <v-chip-group v-model="selectedClassSkills" multiple>
                  <v-chip v-for="skill in availableClassSkills" :key="skill" :value="skill" filter color="blue"
                    size="small">
                    {{ skill }}
                  </v-chip>
                </v-chip-group>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Background Features -->
      <v-card v-if="character.backgroundDetails" class="mb-6" variant="outlined">
        <v-card-title class="text-h6">📜 Background Features ({{ character.backgroundDetails.name }})</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <div v-if="character.backgroundDetails.skill_proficiencies?.length" class="mb-4">
                <h4>🎯 Background Skills</h4>
                <v-chip-group>
                  <v-chip v-for="skill in character.backgroundDetails.skill_proficiencies" :key="skill.name"
                    color="purple" size="small">
                    {{ skill.name }}
                  </v-chip>
                </v-chip-group>
              </div>

              <div v-if="character.backgroundDetails.languages?.length" class="mb-4">
                <h4>🗣️ Additional Languages</h4>
                <v-chip-group>
                  <v-chip v-for="lang in character.backgroundDetails.languages" :key="lang.index || lang.name"
                    color="info" size="small">
                    {{ typeof lang === 'string' ? lang : lang.name }}
                  </v-chip>
                </v-chip-group>
              </div>

              <!-- Language Choices -->
              <div v-if="backgroundLanguageChoices > 0" class="mb-4">
                <h4>🌍 Choose Additional Languages</h4>
                <p class="text-caption mb-2">Select {{ backgroundLanguageChoices }} additional languages:</p>
                <v-autocomplete v-model="selectedLanguages" :items="availableLanguageChoices"
                  :label="`Choose ${backgroundLanguageChoices} languages`" multiple chips
                  :counter="backgroundLanguageChoices"
                  :rules="[v => v.length <= backgroundLanguageChoices || `Select up to ${backgroundLanguageChoices}`]" />
              </div>

              <!-- Tool Choices -->
              <div v-if="backgroundToolChoices > 0" class="mb-4">
                <h4>🔧 Choose Tools</h4>
                <p class="text-caption mb-2">Select {{ backgroundToolChoices }} tool proficiencies:</p>
                <v-autocomplete v-model="selectedTools" :items="availableToolChoices"
                  :label="`Choose ${backgroundToolChoices} tools`" multiple chips :counter="backgroundToolChoices"
                  :rules="[v => v.length <= backgroundToolChoices || `Select up to ${backgroundToolChoices}`]" />
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <div v-if="character.backgroundDetails.feature" class="mb-4">
                <h4>✨ Background Feature</h4>
                <v-card color="grey-lighten-4" variant="tonal">
                  <v-card-title class="text-h6">{{ character.backgroundDetails.feature.name }}</v-card-title>
                  <v-card-text>
                    <div v-if="character.backgroundDetails.feature.desc">
                      <div v-for="(desc, index) in character.backgroundDetails.feature.desc" :key="index" class="mb-2">
                        {{ desc }}
                      </div>
                    </div>
                    <div v-else>
                      {{ character.backgroundDetails.feature.description || character.backgroundDetails.feature }}
                    </div>
                  </v-card-text>
                </v-card>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Feature Choices & Customization -->
      <v-card class="mb-6" variant="outlined">
        <v-card-title class="text-h6">⚙️ Feature Choices & Customization</v-card-title>
        <v-card-subtitle>Make choices that customize your character's abilities</v-card-subtitle>
        <v-card-text>

          <!-- Debug info (temporary) -->
          <div v-if="false" class="mb-4 pa-2 bg-grey-lighten-4">
            <small>Debug - Class: {{ character.class }} | Class Details: {{ character.classDetails?.name }} | Index: {{
              character.classDetails?.index }}</small>
          </div>

          <!-- Show message if no choices available -->
          <div v-if="!hasFightingStyle && !hasExpertise && !isWarlock && !isDruid && !isCleric"
            class="text-center py-4">
            <v-icon size="48" color="grey">mdi-cog-outline</v-icon>
            <p class="text-h6 mt-2">No Feature Choices Available</p>
            <p class="text-body-2 text-grey">
              Select a class to see available feature customization options.
              <br>
              <small>Current class: {{ character.class || character.classDetails?.name || 'None selected' }}</small>
            </p>
          </div>

          <!-- Fighting Style (for Fighters, Rangers, Paladins) -->
          <div v-if="hasFightingStyle" class="mb-4">
            <h4>⚔️ Fighting Style</h4>
            <p class="text-caption mb-2">Choose a fighting style that defines your combat approach:</p>
            <v-radio-group v-model="selectedFightingStyle" inline>
              <v-radio v-for="style in fightingStyles" :key="style.value" :label="style.title" :value="style.value">
                <template #label>
                  <div>
                    <strong>{{ style.title }}</strong>
                    <div class="text-caption">{{ style.description }}</div>
                  </div>
                </template>
              </v-radio>
            </v-radio-group>
          </div>

          <!-- Expertise (for Rogues, Bards) -->
          <div v-if="hasExpertise" class="mb-4">
            <h4>🎯 Expertise</h4>
            <p class="text-caption mb-2">Choose {{ expertiseChoices }} skills to double your proficiency bonus:</p>
            <v-chip-group v-model="selectedExpertiseSkills" multiple>
              <v-chip v-for="skill in availableExpertiseSkills" :key="skill" :value="skill" filter
                color="yellow-darken-2" size="small">
                {{ skill }}
              </v-chip>
            </v-chip-group>
          </div>

          <!-- Warlock Patron (for Warlocks) -->
          <div v-if="isWarlock" class="mb-4">
            <h4>👁️ Otherworldly Patron</h4>
            <p class="text-caption mb-2">Choose the entity that grants you power:</p>
            <v-select v-model="selectedPatron" :items="warlockPatrons" item-title="name" item-value="value"
              label="Select your patron">
              <template #item="{ props, item }">
                <v-list-item v-bind="props">
                  <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ item.raw.description }}</v-list-item-subtitle>
                </v-list-item>
              </template>
            </v-select>
          </div>

          <!-- Druid Circle (for Druids) -->
          <div v-if="isDruid" class="mb-4">
            <h4>🌿 Druidic Circle</h4>
            <p class="text-caption mb-2">Choose your connection to nature:</p>
            <v-select v-model="selectedCircle" :items="druidCircles" item-title="name" item-value="value"
              label="Select your circle">
              <template #item="{ props, item }">
                <v-list-item v-bind="props">
                  <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ item.raw.description }}</v-list-item-subtitle>
                </v-list-item>
              </template>
            </v-select>
          </div>

          <!-- Cleric Domain (for Clerics) -->
          <div v-if="isCleric" class="mb-4">
            <h4>✨ Divine Domain</h4>
            <p class="text-caption mb-2">Choose your deity's sphere of influence:</p>
            <v-select v-model="selectedDomain" :items="clericDomains" item-title="name" item-value="value"
              label="Select your domain">
              <template #item="{ props, item }">
                <v-list-item v-bind="props">
                  <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ item.raw.description }}</v-list-item-subtitle>
                </v-list-item>
              </template>
            </v-select>
          </div>

        </v-card-text>
      </v-card>

      <!-- All Skill Proficiencies Summary -->
      <v-card class="mb-6" variant="outlined">
        <v-card-title class="text-h6">📋 All Skill Proficiencies</v-card-title>
        <v-card-text>
          <v-row v-if="getAllSkillProficiencies.length">
            <v-col v-for="skill in getAllSkillProficiencies" :key="skill.name" cols="12" md="4" sm="6">
              <v-card class="skill-card" color="blue-lighten-5" variant="tonal">
                <v-card-text class="py-2">
                  <div class="d-flex align-center">
                    <strong>{{ skill.name }}</strong>
                    <v-spacer />
                    <v-chip color="primary" size="x-small">
                      {{ skill.ability }}
                    </v-chip>
                    <v-chip class="ml-1" color="success" size="x-small">
                      +{{ calculateSkillBonus(skill) }}
                    </v-chip>
                  </div>
                  <div class="text-caption text-grey-darken-1">
                    {{ skill.source }}
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <div v-else class="text-center text-medium-emphasis py-4">
            Select a class and background to see available skills.
          </div>
        </v-card-text>
      </v-card>

      <!-- Spell Selection for Spellcasters (Tabbed UI) -->
      <v-card v-if="isSpellcaster" class="mb-6" variant="outlined">
        <v-card-title class="text-h6">🪄 Spell Selection</v-card-title>
        <v-card-text>
          <div v-if="characterStore.isLoadingSpells">
            <v-progress-circular indeterminate color="accent" /> Loading spells...
          </div>
          <div v-else>
            <v-tabs v-model="spellTab" grow class="mb-2" color="accent">
              <v-tab v-if="cantripsKnown > 0" color="accent">Cantrips</v-tab>
              <v-tab v-if="spellsKnown > 0" color="accent">1st-level Spells</v-tab>
            </v-tabs>
            <v-window v-model="spellTab">
              <!-- Cantrips Tab -->
              <v-window-item v-if="cantripsKnown > 0" :value="0">
                <v-autocomplete v-model="selectedCantrips" :items="characterStore.availableCantrips" item-title="name"
                  item-value="index" :label="`Choose up to ${cantripsKnown} cantrips`" multiple chips
                  :counter="cantripsKnown" :rules="[v => v.length <= cantripsKnown || `Select up to ${cantripsKnown}`]"
                  class="mb-2" @update:modelValue="onCantripSelect" />
                <v-list v-if="selectedCantrips.length">
                  <v-list-item v-for="spell in selectedCantripsDetails" :key="spell.index"
                    @click="selectedCantripDetail = spell.index" :active="selectedCantripDetail === spell.index">
                    <v-list-item-title>{{ spell.name }}</v-list-item-title>
                  </v-list-item>
                </v-list>
                <v-expand-transition>
                  <div v-if="selectedCantripDetailObj">
                    <v-card class="mt-2" color="grey-lighten-4" variant="tonal">
                      <v-card-title>{{ selectedCantripDetailObj.name }}</v-card-title>
                      <v-card-text style="white-space: pre-line">{{ selectedCantripDetailObj.desc?.join('\n')
                      }}</v-card-text>
                    </v-card>
                  </div>
                </v-expand-transition>
              </v-window-item>
              <!-- 1st-level Spells Tab -->
              <v-window-item v-if="spellsKnown > 0" :value="1">
                <v-autocomplete v-model="selectedSpells" :items="characterStore.availableSpells" item-title="name"
                  item-value="index" :label="`Choose up to ${spellsKnown} 1st-level spells`" multiple chips
                  :counter="spellsKnown" :rules="[v => v.length <= spellsKnown || `Select up to ${spellsKnown}`]"
                  class="mb-2" @update:modelValue="onSpellSelect" />
                <v-list v-if="selectedSpells.length">
                  <v-list-item v-for="spell in selectedSpellsDetails" :key="spell.index"
                    @click="selectedSpellDetail = spell.index" :active="selectedSpellDetail === spell.index">
                    <v-list-item-title>{{ spell.name }}</v-list-item-title>
                  </v-list-item>
                </v-list>
                <v-expand-transition>
                  <div v-if="selectedSpellDetailObj">
                    <v-card class="mt-2" color="grey-lighten-4" variant="tonal">
                      <v-card-title>{{ selectedSpellDetailObj.name }}</v-card-title>
                      <v-card-text style="white-space: pre-line">{{ selectedSpellDetailObj.desc?.join('\n')
                      }}</v-card-text>
                    </v-card>
                  </div>
                </v-expand-transition>
              </v-window-item>
            </v-window>
          </div>
        </v-card-text>
      </v-card>

    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, watch, toRefs } from 'vue'
import { useCharacterStore } from '@/stores/characterStore'

const props = defineProps({
  character: {
    type: Object,
    required: true,
  },
  characterData: {
    type: Object,
    required: true,
  },
})

// Destructure for template access while maintaining reactivity
const { character, characterData } = toRefs(props)

const characterStore = useCharacterStore()

const selectedCantrips = ref([])
const selectedSpells = ref([])
const selectedClassSkills = ref([])
const selectedLanguages = ref([])
const selectedTools = ref([])
const selectedFightingStyle = ref(null)
const selectedExpertiseSkills = ref([])
const selectedPatron = ref(null)
const selectedCircle = ref(null)
const selectedDomain = ref(null)
const spellTab = ref(0)
const selectedCantripDetail = ref(null)
const selectedSpellDetail = ref(null)
const traitDetails = ref({})
const expandedTraits = ref({})

// Toggle function for custom trait accordion
const toggleTrait = (index) => {
  expandedTraits.value[index] = !expandedTraits.value[index]
}

// Ability score modifiers
const getAbilityModifier = (abilityKey) => {
  const score = character.value.abilityScores?.[abilityKey]?.score || 10
  return Math.floor((score - 10) / 2)
}

const getStrModifier = computed(() => getAbilityModifier('strength'))
const getDexModifier = computed(() => getAbilityModifier('dexterity'))
const getConModifier = computed(() => getAbilityModifier('constitution'))
const getIntModifier = computed(() => getAbilityModifier('intelligence'))
const getWisModifier = computed(() => getAbilityModifier('wisdom'))
const getChaModifier = computed(() => getAbilityModifier('charisma'))

// Combat calculations
const getClassHitDie = computed(() => {
  if (!character.value.classDetails) return 8
  return character.value.classDetails.hit_die || 8
})

const calculateHitPoints = computed(() => {
  const baseHP = getClassHitDie.value
  const conBonus = getConModifier.value
  return Math.max(1, baseHP + conBonus)
})

const calculateArmorClass = computed(() => {
  return 10 + getDexModifier.value
})

// Class skills
const availableClassSkills = computed(() => {
  if (!character.value.classDetails?.proficiency_choices) return []

  const skillChoice = character.value.classDetails.proficiency_choices.find(
    choice => choice.type === 'proficiencies' && choice.from?.some(opt => opt.proficiency?.type === 'skills')
  )

  if (!skillChoice) return []

  return skillChoice.from
    ?.filter(opt => opt.proficiency?.type === 'skills')
    ?.map(opt => opt.proficiency.name.replace('Skill: ', '')) || []
})

const getClassSkillChoices = computed(() => {
  if (!character.value.classDetails?.proficiency_choices) return 0

  const skillChoice = character.value.classDetails.proficiency_choices.find(
    choice => choice.type === 'proficiencies' && choice.from?.some(opt => opt.proficiency?.type === 'skills')
  )

  return skillChoice?.choose || 0
})

// All skill proficiencies
const getAllSkillProficiencies = computed(() => {
  const skills = []

  // Add class skills (from proficiencies array)
  if (character.value.classDetails?.proficiencies) {
    character.value.classDetails.proficiencies
      .filter(prof => prof.type === 'skills' || prof.name?.includes('Skill:'))
      .forEach(prof => {
        const skillName = prof.name.replace('Skill: ', '')
        const skillData = allSkills.find(s => s.name === skillName)
        if (skillData) {
          skills.push({
            ...skillData,
            source: 'Class'
          })
        }
      })
  }

  // Add selected class skills
  selectedClassSkills.value.forEach(skillName => {
    if (!skills.find(s => s.name === skillName)) {
      const skillData = allSkills.find(s => s.name === skillName)
      if (skillData) {
        skills.push({
          ...skillData,
          source: 'Class Choice'
        })
      }
    }
  })

  // Add background skills
  if (character.value.backgroundDetails?.skill_proficiencies) {
    character.value.backgroundDetails.skill_proficiencies.forEach(prof => {
      const skillName = prof.name?.replace('Skill: ', '') || prof
      if (!skills.find(s => s.name === skillName)) {
        const skillData = allSkills.find(s => s.name === skillName)
        if (skillData) {
          skills.push({
            ...skillData,
            source: 'Background'
          })
        }
      }
    })
  }

  // Add background skills from skillProficiencies array (fallback format)
  if (character.value.backgroundDetails?.skillProficiencies) {
    character.value.backgroundDetails.skillProficiencies.forEach(skillName => {
      if (!skills.find(s => s.name === skillName)) {
        const skillData = allSkills.find(s => s.name === skillName)
        if (skillData) {
          skills.push({
            ...skillData,
            source: 'Background'
          })
        }
      }
    })
  }

  // Add some default skills if none are found (for testing/fallback)
  if (skills.length === 0 && character.value.classDetails) {
    // Add a few common skills based on class
    const classSkillDefaults = {
      'fighter': ['Athletics', 'Intimidation'],
      'rogue': ['Stealth', 'Sleight of Hand'],
      'wizard': ['Arcana', 'Investigation'],
      'cleric': ['Medicine', 'Religion'],
      'ranger': ['Survival', 'Nature'],
      'barbarian': ['Athletics', 'Survival']
    }

    const defaultSkills = classSkillDefaults[character.value.class] || ['Perception']
    defaultSkills.forEach(skillName => {
      const skillData = allSkills.find(s => s.name === skillName)
      if (skillData) {
        skills.push({
          ...skillData,
          source: 'Default'
        })
      }
    })
  }

  return skills
})

const calculateSkillBonus = (skill) => {
  let abilityMod = 0
  switch (skill.ability) {
    case 'Strength': abilityMod = getStrModifier.value; break
    case 'Dexterity': abilityMod = getDexModifier.value; break
    case 'Constitution': abilityMod = getConModifier.value; break
    case 'Intelligence': abilityMod = getIntModifier.value; break
    case 'Wisdom': abilityMod = getWisModifier.value; break
    case 'Charisma': abilityMod = getChaModifier.value; break
  }

  return abilityMod + character.value.proficiencyBonus
}

// Species traits with detailed descriptions
const speciesTraitsWithDetails = computed(() => {
  if (!character.value.speciesDetails?.traits) return []

  return character.value.speciesDetails.traits.map(trait => {
    // If we have trait details from API, use them
    const traitDetail = traitDetails.value[trait.index]
    if (traitDetail && traitDetail.desc) {
      return {
        ...trait,
        desc: traitDetail.desc
      }
    }

    // Check if trait already has description in various possible formats
    if (trait.description) {
      return {
        ...trait,
        desc: Array.isArray(trait.description) ? trait.description : [trait.description]
      }
    }

    if (trait.desc && trait.desc.length) {
      return {
        ...trait,
        desc: trait.desc
      }
    }

    // Fallback trait descriptions for common traits (by name)
    const fallbackDescriptions = {
      'Draconic Ancestry': ['You have draconic ancestry. Choose one type of dragon from the Draconic Ancestry table. Your breath weapon and damage resistance are determined by the dragon type.'],
      'Breath Weapon': ['You can use your action to exhale destructive energy. Your draconic ancestry determines the size, shape, and damage type of the exhalation.'],
      'Damage Resistance': ['You have resistance to the damage type associated with your draconic ancestry.'],
      'Darkvision': ['You have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You cannot discern color in darkness, only shades of gray.'],
      'Fey Ancestry': ['You have advantage on saving throws against being charmed, and magic cannot put you to sleep.'],
      'Trance': ['Elves do not need to sleep. Instead, they meditate deeply, remaining semiconscious, for 4 hours a day. After resting in this way, you gain the same benefit that a human does from 8 hours of sleep.'],
      'Keen Senses': ['You have proficiency in the Perception skill.'],
      'Dwarven Resilience': ['You have advantage on saving throws against poison, and you have resistance against poison damage.'],
      'Stonecunning': ['Whenever you make an Intelligence (History) check related to the origin of stonework, you are considered proficient in the History skill and add double your proficiency bonus to the check.'],
      'Lucky': ['When you roll a 1 on the d20 for an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.'],
      'Brave': ['You have advantage on saving throws against being frightened.'],
      'Halfling Nimbleness': ['You can move through the space of any creature that is of a size larger than yours.'],
      'Hellish Resistance': ['You have resistance to fire damage.'],
      'Infernal Legacy': ['You know the thaumaturgy cantrip. When you reach 3rd level, you can cast the hellish rebuke spell as a 2nd-level spell once with this trait and regain the ability to do so when you finish a long rest.'],
      'Extra Language': ['You can speak, read, and write one extra language of your choice.'],
      'Skill Versatility': ['You gain proficiency in two skills of your choice.'],
      'Natural Armor': ['You have tough, scaly skin. When you aren\'t wearing armor, your AC is 13 + your Dex modifier.'],
      'Hungry Jaws': ['In battle, you can throw yourself into a vicious feeding frenzy. As a bonus action, you can make a special attack with your bite.'],
      'Hold Breath': ['You can hold your breath for up to 15 minutes at a time.'],
      'Swimming Speed': ['You have a swimming speed of 30 feet.']
    }

    // Get fallback description by exact name match
    const fallbackDesc = fallbackDescriptions[trait.name]

    return {
      ...trait,
      desc: fallbackDesc || [`${trait.name}: This trait provides special abilities for your character.`]
    }
  })
})

// Available language choices for backgrounds
const availableLanguageChoices = [
  'Abyssal', 'Celestial', 'Draconic', 'Deep Speech', 'Infernal',
  'Primordial', 'Sylvan', 'Undercommon', 'Giant', 'Goblin',
  'Halfling', 'Orc', 'Gnomish', 'Dwarvish'
]

// Available tool choices
const availableToolChoices = [
  "Thieves' Tools", "Artisan's Tools", "Gaming Set", "Musical Instrument",
  "Herbalism Kit", "Poisoner's Kit", "Disguise Kit", "Forgery Kit",
  "Navigator's Tools", "Calligrapher's Supplies", "Carpenter's Tools",
  "Cobbler's Tools", "Cook's Utensils", "Glassblower's Tools",
  "Jeweler's Tools", "Leatherworker's Tools", "Mason's Tools",
  "Painter's Supplies", "Potter's Tools", "Smith's Tools",
  "Tinker's Tools", "Weaver's Tools", "Woodcarver's Tools"
]

// Background feature choices
const backgroundLanguageChoices = computed(() => {
  if (!character.value.backgroundDetails?.languageOptions) return 0
  return character.value.backgroundDetails.languageOptions.choose || 0
})

const backgroundToolChoices = computed(() => {
  // Some backgrounds let you choose tool proficiencies
  if (character.value.backgroundDetails?.name === 'Guild Artisan') return 1
  if (character.value.backgroundDetails?.name === 'Folk Hero') return 1
  return 0
})

// Class-specific feature choices
const hasFightingStyle = computed(() => {
  const fightingStyleClasses = ['fighter', 'ranger', 'paladin']
  return fightingStyleClasses.includes(character.value.class) ||
    fightingStyleClasses.includes(character.value.classDetails?.index) ||
    fightingStyleClasses.includes(character.value.classDetails?.id)
})

const hasExpertise = computed(() => {
  const expertiseClasses = ['rogue', 'bard']
  return expertiseClasses.includes(character.value.class) ||
    expertiseClasses.includes(character.value.classDetails?.index) ||
    expertiseClasses.includes(character.value.classDetails?.id)
})

const expertiseChoices = computed(() => {
  const className = character.value.class || character.value.classDetails?.index || character.value.classDetails?.id
  if (className === 'rogue') return 2
  if (className === 'bard') return 2
  return 0
})

const isWarlock = computed(() => {
  const className = character.value.class || character.value.classDetails?.index || character.value.classDetails?.id
  return className === 'warlock'
})
const isDruid = computed(() => {
  const className = character.value.class || character.value.classDetails?.index || character.value.classDetails?.id
  return className === 'druid'
})
const isCleric = computed(() => {
  const className = character.value.class || character.value.classDetails?.index || character.value.classDetails?.id
  return className === 'cleric'
})

// Fighting styles available to multiple classes
const fightingStyles = [
  {
    value: 'archery',
    title: 'Archery',
    description: '+2 bonus to attack rolls with ranged weapons'
  },
  {
    value: 'defense',
    title: 'Defense',
    description: '+1 bonus to AC while wearing armor'
  },
  {
    value: 'dueling',
    title: 'Dueling',
    description: '+2 damage with one-handed weapons when no other weapon is held'
  },
  {
    value: 'great-weapon-fighting',
    title: 'Great Weapon Fighting',
    description: 'Reroll 1s and 2s on damage dice for two-handed weapons'
  },
  {
    value: 'protection',
    title: 'Protection',
    description: 'Use reaction to impose disadvantage on attacks against nearby allies'
  },
  {
    value: 'two-weapon-fighting',
    title: 'Two-Weapon Fighting',
    description: 'Add ability modifier to damage of off-hand attacks'
  }
]

// Available skills for expertise
const availableExpertiseSkills = computed(() => {
  return getAllSkillProficiencies.value.map(skill => skill.name)
})

// Warlock patrons
const warlockPatrons = [
  {
    value: 'fiend',
    name: 'The Fiend',
    description: 'Devils, demons, and other fiendish entities of the Lower Planes'
  },
  {
    value: 'archfey',
    name: 'The Archfey',
    description: 'Powerful fey creatures of the Feywild'
  },
  {
    value: 'great-old-one',
    name: 'The Great Old One',
    description: 'Alien entities from the Far Realm'
  },
  {
    value: 'celestial',
    name: 'The Celestial',
    description: 'Angels, unicorns, and other celestial beings'
  }
]

// Druid circles
const druidCircles = [
  {
    value: 'land',
    name: 'Circle of the Land',
    description: 'Mystics connected to specific environments'
  },
  {
    value: 'moon',
    name: 'Circle of the Moon',
    description: 'Fierce guardians who can take powerful animal forms'
  },
  {
    value: 'stars',
    name: 'Circle of Stars',
    description: 'Druids who harness cosmic power'
  },
  {
    value: 'wildfire',
    name: 'Circle of Wildfire',
    description: 'Druids who understand destruction and renewal'
  }
]

// Cleric domains
const clericDomains = [
  {
    value: 'life',
    name: 'Life Domain',
    description: 'Healing and vitality, promoting life in all forms'
  },
  {
    value: 'light',
    name: 'Light Domain',
    description: 'Reason, knowledge, and the enemy of darkness'
  },
  {
    value: 'nature',
    name: 'Nature Domain',
    description: 'The power of nature, animals, and elemental forces'
  },
  {
    value: 'tempest',
    name: 'Tempest Domain',
    description: 'Storm, sea, and sky in all their terrifying forms'
  },
  {
    value: 'trickery',
    name: 'Trickery Domain',
    description: 'Mischief, deception, and the unexpected'
  },
  {
    value: 'war',
    name: 'War Domain',
    description: 'Battle, courage, and victory in righteous conflicts'
  }
]

// Fetch trait details from API
const fetchTraitDetails = async (traitIndex) => {
  if (traitDetails.value[traitIndex]) return traitDetails.value[traitIndex]

  try {
    const response = await fetch(`https://www.dnd5eapi.co/api/2014/traits/${traitIndex}`)
    if (response.ok) {
      const traitData = await response.json()
      traitDetails.value[traitIndex] = traitData
      return traitData
    }
  } catch (error) {
    console.warn(`Failed to fetch trait details for ${traitIndex}:`, error)
  }

  return null
}

// Load trait details when species changes
watch(
  () => character.value.speciesDetails?.traits,
  async (newTraits) => {
    if (newTraits?.length) {
      // Fetch details for all traits that have an index
      const traitPromises = newTraits.map(trait => {
        if (trait.index && !traitDetails.value[trait.index]) {
          return fetchTraitDetails(trait.index)
        }
        return Promise.resolve(null)
      })

      try {
        await Promise.all(traitPromises)
      } catch (error) {
        console.error('Error loading trait details:', error)
      }
    }
  },
  { immediate: true }
)

// Also trigger trait loading when the component mounts
watch(
  () => character.value.species,
  () => {
    // Small delay to ensure speciesDetails is populated
    setTimeout(() => {
      if (character.value.speciesDetails?.traits?.length) {
        const traits = character.value.speciesDetails.traits
        traits.forEach(trait => {
          if (trait.index && !traitDetails.value[trait.index]) {
            fetchTraitDetails(trait.index)
          }
        })
      }
    }, 100)
  },
  { immediate: true }
)

// Get full details for selected cantrips and spells
const selectedCantripsDetails = computed(() => {
  return characterStore.availableCantrips.filter(spell => selectedCantrips.value.includes(spell.index))
})
const selectedSpellsDetails = computed(() => {
  return characterStore.availableSpells.filter(spell => selectedSpells.value.includes(spell.index))
})
const selectedCantripDetailObj = computed(() => {
  return characterStore.availableCantrips.find(spell => spell.index === selectedCantripDetail.value)
})
const selectedSpellDetailObj = computed(() => {
  return characterStore.availableSpells.find(spell => spell.index === selectedSpellDetail.value)
})

function onCantripSelect(val) {
  // If a new cantrip is selected, show its details
  if (val.length) {
    selectedCantripDetail.value = val[val.length - 1]
  } else {
    selectedCantripDetail.value = null
  }
}
function onSpellSelect(val) {
  if (val.length) {
    selectedSpellDetail.value = val[val.length - 1]
  } else {
    selectedSpellDetail.value = null
  }
}

// Watch for class change and fetch spells if spellcaster
watch(
  () => character.value.class,
  async (newClass) => {
    if (newClass && characterStore.classData.length) {
      const classInfo = characterStore.classData.find(c => c.index === newClass)
      if (classInfo && classInfo.spellcasting) {
        await characterStore.fetchSpellsForClass(newClass)
      }
    }
  },
  { immediate: true }
)

const isSpellcaster = computed(() => {
  if (!character.value.class || !characterStore.classData.length) return false
  const classInfo = characterStore.classData.find(c => c.index === character.value.class)
  return !!(classInfo && classInfo.spellcasting)
})

const cantripsKnown = computed(() => {
  if (!character.value.class || !characterStore.classData.length) return 0
  const classInfo = characterStore.classData.find(c => c.index === character.value.class)
  return classInfo?.spellcasting?.cantripsKnown || 0
})

const spellsKnown = computed(() => {
  if (!character.value.class || !characterStore.classData.length) return 0
  const classInfo = characterStore.classData.find(c => c.index === character.value.class)
  return classInfo?.spellcasting?.spellsKnown || 0
})

// Save selected spells to character object
watch(selectedCantrips, (val) => {
  character.value.cantrips = val
})
watch(selectedSpells, (val) => {
  character.value.preparedSpells = val
})

// Save selected class skills
watch(selectedClassSkills, (val) => {
  character.value.selectedClassSkills = val
})

// Save feature choices
watch(selectedLanguages, (val) => {
  character.value.additionalLanguages = val
})

watch(selectedTools, (val) => {
  character.value.selectedTools = val
})

watch(selectedFightingStyle, (val) => {
  character.value.fightingStyle = val
})

watch(selectedExpertiseSkills, (val) => {
  character.value.expertiseSkills = val
})

watch(selectedPatron, (val) => {
  character.value.warlockPatron = val
})

watch(selectedCircle, (val) => {
  character.value.druidCircle = val
})

watch(selectedDomain, (val) => {
  character.value.clericDomain = val
})

// List of all skills and their associated abilities
const allSkills = [
  { name: 'Acrobatics', ability: 'Dexterity' },
  { name: 'Animal Handling', ability: 'Wisdom' },
  { name: 'Arcana', ability: 'Intelligence' },
  { name: 'Athletics', ability: 'Strength' },
  { name: 'Deception', ability: 'Charisma' },
  { name: 'History', ability: 'Intelligence' },
  { name: 'Insight', ability: 'Wisdom' },
  { name: 'Intimidation', ability: 'Charisma' },
  { name: 'Investigation', ability: 'Intelligence' },
  { name: 'Medicine', ability: 'Wisdom' },
  { name: 'Nature', ability: 'Intelligence' },
  { name: 'Perception', ability: 'Wisdom' },
  { name: 'Performance', ability: 'Charisma' },
  { name: 'Persuasion', ability: 'Charisma' },
  { name: 'Religion', ability: 'Intelligence' },
  { name: 'Sleight of Hand', ability: 'Dexterity' },
  { name: 'Stealth', ability: 'Dexterity' },
  { name: 'Survival', ability: 'Wisdom' },
]

const getProficientSkills = computed(() => {
  // This is now replaced by getAllSkillProficiencies
  return getAllSkillProficiencies.value
})
</script>

<style scoped>
.skill-card {
  transition: all 0.3s ease;
}

.trait-header {
  transition: background-color 0.2s ease;
}

.trait-header:hover {
  background-color: rgba(var(--v-theme-primary), 0.1);
}

.trait-expanded {
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.cursor-pointer {
  cursor: pointer;
}

.trait-accordion {
  border-radius: 4px;
}
</style>
