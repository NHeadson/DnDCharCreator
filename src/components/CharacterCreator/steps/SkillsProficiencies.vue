<template>
  <v-card flat>
    <v-card-title class="text-h4 text-center mb-4">🧠 Skills & Proficiencies</v-card-title>
    <v-card-subtitle class="text-center mb-4">
      What your character knows how to do
    </v-card-subtitle>

    <!-- Quick Reference Stats -->
    <v-row class="mb-6">
      <v-col cols="12" md="4">
        <v-card color="error-lighten-4" variant="outlined">
          <v-card-title class="text-center">❤️ Hit Points</v-card-title>
          <v-card-text class="text-center">
            <div class="text-h3 text-error">{{ calculateHitPoints }}</div>
            <div class="text-caption">Maximum HP</div>
            <div class="text-body-2 mt-2">
              <strong>Base:</strong> {{ getFormattedHPCalculation }}
            </div>
            <!-- Weapon Proficiencies -->
            <div class="mt-3">
              <div v-if="hasWeaponProficiencies">
                <div class="text-caption text-medium-emphasis mb-1">Weapon Training</div>
                <div class="d-flex flex-wrap justify-center ga-1" style="min-height: 32px; align-items: center;">
                  <v-chip v-for="weapon in character.weaponProficiencies" :key="weapon" color="red" size="small"
                    variant="tonal">
                    {{ weapon }}
                  </v-chip>
                </div>
              </div>
              <div v-else>
                <div class="text-caption text-medium-emphasis mb-1">Weapon Training</div>
                <div class="d-flex justify-center" style="min-height: 32px; align-items: center;">
                  <div class="text-body-2 text-disabled">No weapon proficiencies</div>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card color="blue-lighten-4" variant="outlined">
          <v-card-title class="text-center">🛡️ Armor Class</v-card-title>
          <v-card-text class="text-center">
            <div class="text-h3 text-blue">{{ calculateArmorClass }}</div>
            <div class="text-caption">AC</div>
            <div class="text-body-2 mt-2">
              <strong>Base:</strong> {{ getFormattedACCalculation }}
            </div>
            <!-- Armor Proficiencies -->
            <div class="mt-3">
              <div v-if="hasArmorProficiencies">
                <div class="text-caption text-medium-emphasis mb-1">Armor Training</div>
                <div class="d-flex flex-wrap justify-center ga-1" style="min-height: 32px; align-items: center;">
                  <v-chip v-if="character.armorTraining.light" color="blue" size="small" variant="tonal">Light</v-chip>
                  <v-chip v-if="character.armorTraining.medium" color="blue" size="small"
                    variant="tonal">Medium</v-chip>
                  <v-chip v-if="character.armorTraining.heavy" color="blue" size="small" variant="tonal">Heavy</v-chip>
                  <v-chip v-if="character.armorTraining.shields" color="blue" size="small"
                    variant="tonal">Shields</v-chip>
                </div>
              </div>
              <div v-else>
                <div class="text-caption text-medium-emphasis mb-1">Armor Training</div>
                <div class="d-flex justify-center" style="min-height: 32px; align-items: center;">
                  <div class="text-body-2 text-disabled">No armor proficiencies</div>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card color="purple-lighten-4" variant="outlined">
          <v-card-title class="text-center">⚖️ Proficiency</v-card-title>
          <v-card-text class="text-center">
            <div class="text-h3 text-purple">+{{ character.proficiencyBonus }}</div>
            <div class="text-caption">Bonus</div>
            <div class="text-body-2 mt-2">
              Added to proficient skills
            </div>
            <!-- Proficiency Applications -->
            <div class="mt-3">
              <div class="text-caption text-medium-emphasis mb-1">Applied To</div>
              <div class="d-flex flex-wrap justify-center ga-1" style="min-height: 32px; align-items: center;">
                <v-chip color="purple" size="small" variant="tonal">Skills</v-chip>
                <v-chip color="purple" size="small" variant="tonal">Saves</v-chip>
                <v-chip color="purple" size="small" variant="tonal">Attacks</v-chip>
                <v-chip color="purple" size="small" variant="tonal">Spells</v-chip>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Skills Section -->
    <v-card class="mb-6" variant="outlined">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2" color="green">mdi-brain</v-icon>
        Skill Proficiencies
        <v-spacer />
        <v-tooltip text="This represents knowledge and training - not physical items">
          <template #activator="{ props }">
            <v-chip color="info" size="small" variant="tonal" v-bind="props">Knowledge</v-chip>
          </template>
        </v-tooltip>
      </v-card-title>
      <v-card-subtitle class="text-body-2">
        Skills your character has learned and can perform well
      </v-card-subtitle>

      <v-card-text>
        <!-- Static Proficiencies (what you already have) -->
        <div
          v-if="getBackgroundSkills.length || getSpeciesSkillProficiencies.length || (character.selectedClassSkills && character.selectedClassSkills.length) || (character.selectedExpertise && character.selectedExpertise.length)"
          class="mb-6">
          <h3 class="text-h6 mb-3 text-success">Current Proficiencies</h3>

          <!-- Class Skills (selected) -->
          <div v-if="character.selectedClassSkills && character.selectedClassSkills.length" class="ml-4 mb-3">
            <div class="text-body-2 text-medium-emphasis mb-2 d-flex align-center">
              <v-icon class="mr-2" color="primary" size="small">mdi-school</v-icon>
              From Your Class
            </div>
            <div class="ml-6 d-flex flex-wrap ga-2">
              <v-chip v-for="skill in character.selectedClassSkills" :key="skill" color="primary" variant="tonal">
                <v-icon size="x-small" start>mdi-brain</v-icon>
                {{ skill }}
              </v-chip>
            </div>
          </div>

          <!-- Background Skills -->
          <div v-if="getBackgroundSkills.length" class="ml-4 mb-3">
            <div class="text-body-2 text-medium-emphasis mb-2 d-flex align-center">
              <v-icon class="mr-2" color="orange" size="small">mdi-briefcase</v-icon>
              From Your Background
            </div>
            <div class="ml-6 d-flex flex-wrap ga-2">
              <v-chip v-for="skill in getBackgroundSkills" :key="skill" color="orange" variant="tonal">
                <v-icon size="x-small" start>mdi-brain</v-icon>
                {{ skill }}
              </v-chip>
            </div>
          </div>

          <!-- Species Skills -->
          <div v-if="getSpeciesSkillProficiencies.length" class="ml-4 mb-3">
            <div class="text-body-2 text-medium-emphasis mb-2 d-flex align-center">
              <v-icon class="mr-2" color="purple" size="small">mdi-dna</v-icon>
              From Your Species
            </div>
            <div class="ml-6 d-flex flex-wrap ga-2">
              <v-chip v-for="skill in getSpeciesSkillProficiencies" :key="skill" color="purple" variant="tonal">
                <v-icon size="x-small" start>mdi-brain</v-icon>
                {{ skill }}
              </v-chip>
            </div>
          </div>

          <!-- Expertise Skills (selected) -->
          <div v-if="character.selectedExpertise && character.selectedExpertise.length" class="ml-4 mb-3">
            <div class="text-body-2 text-medium-emphasis mb-2 d-flex align-center">
              <v-icon class="mr-2" color="success" size="small">mdi-star-circle</v-icon>
              Expertise (Double Proficiency)
            </div>
            <div class="ml-6 d-flex flex-wrap ga-2">
              <v-chip v-for="skill in character.selectedExpertise" :key="skill" color="success" variant="tonal">
                <v-icon size="x-small" start>mdi-star</v-icon>
                {{ skill }}
              </v-chip>
            </div>
          </div>
        </div>

        <!-- Selections Required -->
        <div v-if="hasClassSkillChoices || hasExpertiseChoices">
          <h3 class="text-h6 mb-3 text-warning">Selections Required</h3>

          <!-- Class Skills Selection -->
          <div v-if="hasClassSkillChoices" class="ml-4 mb-4">
            <div class="text-body-2 text-medium-emphasis mb-2 d-flex align-center">
              <v-icon class="mr-2" color="primary" size="small">mdi-school</v-icon>
              Choose Class Skills ({{ (character.selectedClassSkills?.length || 0) }}/{{ getClassSkillChoices }})
            </div>
            <div class="ml-6">
              <div class="d-flex flex-wrap ga-2">
                <v-chip v-for="skill in getClassSkillOptions" :key="skill.name" clickable
                  :color="character.selectedClassSkills?.includes(skill.name) ? 'primary' : 'default'"
                  :variant="character.selectedClassSkills?.includes(skill.name) ? 'elevated' : 'outlined'"
                  @click="toggleClassSkill(skill.name)">
                  <v-icon size="x-small" start>mdi-brain</v-icon>
                  {{ skill.name }}
                </v-chip>
              </div>
            </div>
          </div>

          <!-- Expertise Selection -->
          <div v-if="hasExpertiseChoices" class="ml-4 mb-4">
            <div class="text-body-2 text-medium-emphasis mb-2 d-flex align-center">
              <v-icon class="mr-2" color="success" size="small">mdi-star-circle</v-icon>
              Choose Expertise ({{ (character.selectedExpertise?.length || 0) }}/{{ expertiseChoices }})
            </div>
            <div class="ml-6">
              <div class="d-flex flex-wrap ga-2">
                <v-chip v-for="skill in getAllSkillProficiencies" :key="skill.name" clickable
                  :color="character.selectedExpertise?.includes(skill.name) ? 'success' : 'default'"
                  :variant="character.selectedExpertise?.includes(skill.name) ? 'elevated' : 'outlined'"
                  @click="toggleExpertise(skill.name)">
                  <v-icon size="x-small" start>mdi-star</v-icon>
                  {{ skill.name }}
                </v-chip>
              </div>
            </div>
          </div>
        </div>

        <!-- No Skills Message -->
        <div v-else-if="!character.backgroundDetails" class="text-center py-6">
          <v-icon class="mb-2" color="grey" size="large">mdi-information-outline</v-icon>
          <div class="text-body-2 text-medium-emphasis">
            Skill proficiencies will appear here once you complete character creation steps.
          </div>
        </div>

        <!-- Reset Button for Skills -->
        <div
          v-if="(character.selectedClassSkills && character.selectedClassSkills.length) || (character.selectedExpertise && character.selectedExpertise.length)"
          class="d-flex justify-end mt-4">
          <v-btn color="warning" prepend-icon="mdi-refresh" size="small" variant="outlined"
            @click="resetAllSkillSelections">
            Reset
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- Tool Proficiencies Section -->
    <v-card class="mb-6" variant="outlined">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2" color="amber">mdi-tools</v-icon>
        Tool Proficiencies
        <v-spacer />
        <v-tooltip text="This represents knowledge of how to use tools - not owning the actual tools">
          <template #activator="{ props }">
            <v-chip color="info" size="small" variant="tonal" v-bind="props">Knowledge</v-chip>
          </template>
        </v-tooltip>
      </v-card-title>
      <v-card-subtitle class="text-body-2">
        Tools and equipment your character knows how to use effectively
      </v-card-subtitle>

      <v-card-text>
        <!-- Static Proficiencies (what you already have) -->
        <div v-if="classToolProficiencies.length || backgroundToolProficiencies.length" class="mb-6">
          <h3 class="text-h6 mb-3 text-success">Current Proficiencies</h3>

          <!-- Class Tools -->
          <div v-if="classToolProficiencies.length" class="ml-4 mb-3">
            <div class="text-body-2 text-medium-emphasis mb-2 d-flex align-center">
              <v-icon class="mr-2" color="primary" size="small">mdi-school</v-icon>
              From Your Class
            </div>
            <div class="ml-6 d-flex flex-wrap ga-2">
              <v-chip v-for="tool in classToolProficiencies" :key="tool" color="primary" variant="tonal">
                <v-icon size="x-small" start>mdi-brain</v-icon>
                {{ tool }}
              </v-chip>
            </div>
          </div>

          <!-- Background Tools -->
          <div v-if="backgroundToolProficiencies.length" class="ml-4 mb-3">
            <div class="text-body-2 text-medium-emphasis mb-2 d-flex align-center">
              <v-icon class="mr-2" color="orange" size="small">mdi-briefcase</v-icon>
              From Your Background
            </div>
            <div class="ml-6 d-flex flex-wrap ga-2">
              <v-chip v-for="tool in backgroundToolProficiencies" :key="tool" color="orange" variant="tonal">
                <v-icon size="x-small" start>mdi-brain</v-icon>
                {{ tool }}
              </v-chip>
            </div>
          </div>
        </div>

        <!-- Selections Needed -->
        <div v-if="hasBackgroundToolChoices">
          <h3 class="text-h6 mb-3 text-warning">Selections Required</h3>

          <div class="ml-4 mb-4">
            <div class="text-body-2 text-medium-emphasis mb-2 d-flex align-center">
              <v-icon class="mr-2" color="orange" size="small">mdi-briefcase</v-icon>
              Choose Background Tools ({{ (character.selectedBackgroundTools?.length || 0) }}/{{ backgroundToolChoices
              }})
            </div>
            <div class="ml-6">
              <div class="d-flex flex-wrap ga-2">
                <v-chip v-for="tool in backgroundToolOptions" :key="tool" clickable
                  :color="character.selectedBackgroundTools?.includes(tool) ? 'orange' : 'default'"
                  :variant="character.selectedBackgroundTools?.includes(tool) ? 'elevated' : 'outlined'"
                  @click="toggleBackgroundTool(tool)">
                  <v-icon size="x-small" start>mdi-brain</v-icon>
                  {{ tool }}
                </v-chip>
              </div>
            </div>
          </div>
        </div>

        <!-- No Tools Message -->
        <div v-else-if="!character.backgroundDetails" class="text-center py-6">
          <v-icon class="mb-2" color="grey" size="large">mdi-information-outline</v-icon>
          <div class="text-body-2 text-medium-emphasis">
            Tool proficiencies will appear here once you select a background in Step 1.
          </div>
        </div>

        <!-- Reset Button for Tools -->
        <div v-if="character.selectedBackgroundTools && character.selectedBackgroundTools.length"
          class="d-flex justify-end mt-4">
          <v-btn color="warning" prepend-icon="mdi-refresh" size="small" variant="outlined"
            @click="resetAllToolSelections">
            Reset
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- Other Proficiencies Section -->
    <v-card class="mb-6" variant="outlined">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2" color="indigo">mdi-music</v-icon>
        Other Proficiencies
        <v-spacer />
        <v-tooltip text="These represent skills and abilities you've learned - not physical possessions">
          <template #activator="{ props }">
            <v-chip color="info" size="small" variant="tonal" v-bind="props">Knowledge</v-chip>
          </template>
        </v-tooltip>
      </v-card-title>
      <v-card-subtitle class="text-body-2">
        Specialized knowledge in instruments, games, and vehicles
      </v-card-subtitle>

      <v-card-text>
        <!-- Static Proficiencies (what you already have) -->
        <div
          v-if="getInstrumentProficiencies.length || getClassGamingSets.length || getBackgroundGamingSets.length || getVehicleProficiencies.length || (character.selectedBackgroundGamingSets && character.selectedBackgroundGamingSets.length)"
          class="mb-6">
          <h3 class="text-h6 mb-3 text-success">Current Proficiencies</h3>

          <!-- Musical Instruments -->
          <div v-if="getInstrumentProficiencies.length" class="ml-4 mb-3">
            <div class="text-body-2 text-medium-emphasis mb-2 d-flex align-center">
              <v-icon class="mr-2" color="purple" size="small">mdi-music</v-icon>
              Musical Instruments
            </div>
            <div class="ml-6 d-flex flex-wrap ga-2">
              <v-chip v-for="instrument in getInstrumentProficiencies" :key="instrument" color="purple" variant="tonal">
                <v-icon size="x-small" start>mdi-brain</v-icon>
                {{ instrument }}
              </v-chip>
            </div>
          </div>

          <!-- Gaming Sets -->
          <div
            v-if="getClassGamingSets.length || getBackgroundGamingSets.length || (character.selectedBackgroundGamingSets && character.selectedBackgroundGamingSets.length)">
            <!-- Class Gaming Sets -->
            <div v-if="getClassGamingSets.length" class="ml-4 mb-3">
              <div class="text-body-2 text-medium-emphasis mb-2 d-flex align-center">
                <v-icon class="mr-2" color="primary" size="small">mdi-school</v-icon>
                Gaming Sets - From Your Class
              </div>
              <div class="ml-6 d-flex flex-wrap ga-2">
                <v-chip v-for="gameSet in getClassGamingSets" :key="gameSet" color="primary" variant="tonal">
                  <v-icon size="x-small" start>mdi-brain</v-icon>
                  {{ gameSet }}
                </v-chip>
              </div>
            </div>

            <!-- Background Gaming Sets (static) -->
            <div v-if="getBackgroundGamingSets.length" class="ml-4 mb-3">
              <div class="text-body-2 text-medium-emphasis mb-2 d-flex align-center">
                <v-icon class="mr-2" color="orange" size="small">mdi-briefcase</v-icon>
                Gaming Sets - From Your Background
              </div>
              <div class="ml-6 d-flex flex-wrap ga-2">
                <v-chip v-for="gameSet in getBackgroundGamingSets" :key="gameSet" color="orange" variant="tonal">
                  <v-icon size="x-small" start>mdi-brain</v-icon>
                  {{ gameSet }}
                </v-chip>
              </div>
            </div>

            <!-- Background Gaming Sets (selected) -->
            <div v-if="character.selectedBackgroundGamingSets && character.selectedBackgroundGamingSets.length"
              class="ml-4 mb-3">
              <div class="text-body-2 text-medium-emphasis mb-2 d-flex align-center">
                <v-icon class="mr-2" color="orange" size="small">mdi-briefcase</v-icon>
                Gaming Sets - From Your Background
              </div>
              <div class="ml-6 d-flex flex-wrap ga-2">
                <v-chip v-for="gameSet in character.selectedBackgroundGamingSets" :key="gameSet" color="orange"
                  variant="tonal">
                  <v-icon size="x-small" start>mdi-brain</v-icon>
                  {{ gameSet }}
                </v-chip>
              </div>
            </div>
          </div>

          <!-- Vehicles -->
          <div v-if="getVehicleProficiencies.length" class="ml-4 mb-3">
            <div class="text-body-2 text-medium-emphasis mb-2 d-flex align-center">
              <v-icon class="mr-2" color="blue" size="small">mdi-car</v-icon>
              Vehicle Proficiencies
            </div>
            <div class="ml-6 d-flex flex-wrap ga-2">
              <v-chip v-for="vehicle in getVehicleProficiencies" :key="vehicle" color="blue" variant="tonal">
                <v-icon size="x-small" start>mdi-brain</v-icon>
                {{ vehicle }}
              </v-chip>
            </div>
          </div>
        </div>

        <!-- Selections Required -->
        <div v-if="hasBackgroundGamingSetChoices || hasBackgroundInstrumentChoices">
          <h3 class="text-h6 mb-3 text-warning">Selections Required</h3>

          <!-- Background Instrument Selection -->
          <div v-if="hasBackgroundInstrumentChoices" class="ml-4 mb-4">
            <div class="text-body-2 text-medium-emphasis mb-2 d-flex align-center">
              <v-icon class="mr-2" color="purple" size="small">mdi-music</v-icon>
              Choose Musical Instrument ({{ (character.selectedBackgroundInstruments?.length || 0) }}/{{
                backgroundInstrumentChoices }})
            </div>
            <div class="ml-6">
              <div class="d-flex flex-wrap ga-2">
                <v-chip v-for="instrument in backgroundInstrumentOptions" :key="instrument" clickable
                  :color="character.selectedBackgroundInstruments?.includes(instrument) ? 'purple' : 'default'"
                  :variant="character.selectedBackgroundInstruments?.includes(instrument) ? 'elevated' : 'outlined'"
                  @click="toggleBackgroundInstrument(instrument)">
                  <v-icon size="x-small" start>mdi-music</v-icon>
                  {{ instrument }}
                </v-chip>
              </div>
            </div>
          </div>

          <!-- Background Gaming Set Selection -->
          <div v-if="hasBackgroundGamingSetChoices" class="ml-4 mb-4">
            <div class="text-body-2 text-medium-emphasis mb-2 d-flex align-center">
              <v-icon class="mr-2" color="orange" size="small">mdi-briefcase</v-icon>
              Choose Gaming Set ({{ (character.selectedBackgroundGamingSets?.length || 0) }}/{{
                getBackgroundGamingSetChoices }})
            </div>

            <div class="ml-6">
              <div class="d-flex flex-wrap ga-2">
                <template v-for="gamingSet in getBackgroundGamingSetOptions" :key="gamingSet">
                  <v-tooltip v-if="gamingSet === 'Playing Card Set' && character.backgroundDetails?.name === 'Soldier'"
                    location="top" max-width="300">
                    <template v-slot:activator="{ props: tooltipProps }">
                      <v-chip v-bind="tooltipProps" clickable
                        :color="character.selectedBackgroundGamingSets?.includes(gamingSet) ? 'orange' : 'primary'"
                        :variant="character.selectedBackgroundGamingSets?.includes(gamingSet) ? 'elevated' : 'tonal'"
                        @click="toggleBackgroundGamingSet(gamingSet)" :prepend-icon="'mdi-star-outline'">
                        <v-icon size="x-small" start>mdi-cards-playing</v-icon>
                        {{ gamingSet }}
                      </v-chip>
                    </template>
                    <template v-slot:default>
                      <div class="text-caption">
                        <div class="font-weight-bold text-primary mb-1">💡 Recommended Choice</div>
                        <div>Your Soldier background includes a <strong>Deck of Cards</strong> in your starting
                          equipment.</div>
                        <div>Choosing this matches what you already own!</div>
                      </div>
                    </template>
                  </v-tooltip>
                  <v-chip v-else clickable
                    :color="character.selectedBackgroundGamingSets?.includes(gamingSet) ? 'orange' : 'default'"
                    :variant="character.selectedBackgroundGamingSets?.includes(gamingSet) ? 'elevated' : 'outlined'"
                    @click="toggleBackgroundGamingSet(gamingSet)">
                    <v-icon size="x-small" start>mdi-dice-multiple</v-icon>
                    {{ gamingSet }}
                  </v-chip>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- Show message when no other proficiencies exist -->
        <div
          v-else-if="!getInstrumentProficiencies.length && !getClassGamingSets.length && !getBackgroundGamingSets.length && !getVehicleProficiencies.length && !(character.selectedBackgroundGamingSets && character.selectedBackgroundGamingSets.length)"
          class="text-center py-6">
          <v-icon class="mb-2" color="grey" size="large">mdi-information-outline</v-icon>
          <div class="text-body-2 text-medium-emphasis">
            No additional proficiencies from your background or species
          </div>
        </div>

        <!-- Reset Button for Gaming Sets -->
        <div v-if="character.selectedBackgroundGamingSets && character.selectedBackgroundGamingSets.length"
          class="d-flex justify-end mt-4">
          <v-btn color="warning" prepend-icon="mdi-refresh" size="small" variant="outlined"
            @click="resetAllOtherProficiencySelections">
            Reset
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- Languages Section -->
    <v-card class="mb-6" variant="outlined">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2" color="teal">mdi-translate</v-icon>
        Languages
        <v-spacer />
        <v-tooltip text="These are languages you can speak and understand - not physical books or scrolls">
          <template #activator="{ props }">
            <v-chip color="info" size="small" variant="tonal" v-bind="props">Knowledge</v-chip>
          </template>
        </v-tooltip>
      </v-card-title>
      <v-card-subtitle class="text-body-2">
        Languages your character can speak and understand
      </v-card-subtitle>

      <v-card-text>
        <!-- Current Languages (what you already have) -->
        <div v-if="getCommonLanguage.length || getSpeciesLanguages.length || getBackgroundLanguages.length"
          class="mb-6">
          <h3 class="text-h6 mb-3 text-success">Current Languages</h3>

          <!-- Common Language -->
          <div class="ml-4 mb-3">
            <div class="text-body-2 text-medium-emphasis mb-2 d-flex align-center">
              <v-icon class="mr-2" color="grey" size="small">mdi-earth</v-icon>
              Universal
            </div>
            <div class="ml-6 d-flex flex-wrap ga-2">
              <v-chip v-for="language in getCommonLanguage" :key="language" color="grey" variant="tonal">
                <v-icon size="x-small" start>mdi-translate</v-icon>
                {{ language }}
              </v-chip>
            </div>
          </div>

          <!-- Species Languages -->
          <div v-if="getSpeciesLanguages.length" class="ml-4 mb-3">
            <div class="text-body-2 text-medium-emphasis mb-2 d-flex align-center">
              <v-icon class="mr-2" color="purple" size="small">mdi-dna</v-icon>
              From Your Species
            </div>
            <div class="ml-6 d-flex flex-wrap ga-2">
              <v-chip v-for="language in getSpeciesLanguages" :key="language" color="purple" variant="tonal">
                <v-icon size="x-small" start>mdi-translate</v-icon>
                {{ language }}
              </v-chip>
            </div>
          </div>

          <!-- Background Languages -->
          <div v-if="getBackgroundLanguages.length" class="ml-4 mb-3">
            <div class="text-body-2 text-medium-emphasis mb-2 d-flex align-center">
              <v-icon class="mr-2" color="orange" size="small">mdi-briefcase</v-icon>
              From Your Background
            </div>
            <div class="ml-6 d-flex flex-wrap ga-2">
              <v-chip v-for="language in getBackgroundLanguages" :key="language" color="orange" variant="tonal">
                <v-icon size="x-small" start>mdi-translate</v-icon>
                {{ language }}
              </v-chip>
            </div>
          </div>

          <!-- Selected Background Languages -->
          <div v-if="getSelectedBackgroundLanguagesCount > 0" class="ml-4 mb-3">
            <div class="text-body-2 text-medium-emphasis mb-2 d-flex align-center">
              <v-icon class="mr-2" color="orange" size="small">mdi-briefcase</v-icon>
              Languages Chosen From Background
            </div>
            <div class="ml-6 d-flex flex-wrap ga-2">
              <v-chip v-for="language in character.selectedBackgroundLanguages" :key="language" color="orange"
                variant="tonal">
                <v-icon size="x-small" start>mdi-translate</v-icon>
                {{ language }}
              </v-chip>
            </div>
          </div>
        </div>

        <!-- Selections Required -->
        <div v-if="hasBackgroundLanguageChoices && getSelectedBackgroundLanguagesCount < getBackgroundLanguageChoices">
          <h3 class="text-h6 mb-3 text-warning">Selections Required</h3>

          <!-- Background Language Selection -->
          <div class="ml-4 mb-4">
            <div class="text-body-2 text-medium-emphasis mb-2 d-flex align-center">
              <v-icon class="mr-2" color="orange" size="small">mdi-briefcase</v-icon>
              Choose Language ({{ getSelectedBackgroundLanguagesCount }}/{{ getBackgroundLanguageChoices }})
            </div>
            <div class="ml-6">
              <div class="d-flex flex-wrap ga-2">
                <v-chip v-for="language in getAvailableLanguageChoices" :key="language" clickable
                  :color="isLanguageSelected(language) ? 'orange' : 'default'"
                  :variant="isLanguageSelected(language) ? 'elevated' : 'outlined'"
                  @click="toggleBackgroundLanguage(language)">
                  <v-icon size="x-small" start>mdi-translate</v-icon>
                  {{ language }}
                </v-chip>
              </div>
            </div>
          </div>
        </div>

        <!-- No Languages Message (fallback) -->
        <div
          v-else-if="!getCommonLanguage.length && !getSpeciesLanguages.length && !getBackgroundLanguages.length && !getSelectedBackgroundLanguagesCount"
          class="text-center py-6">
          <v-icon class="mb-2" color="grey" size="large">mdi-information-outline</v-icon>
          <div class="text-body-2 text-medium-emphasis">
            No additional languages beyond Common
          </div>
        </div>

        <!-- Reset Button for Languages -->
        <div v-if="getSelectedBackgroundLanguagesCount > 0" class="d-flex justify-end mt-4">
          <v-btn color="warning" prepend-icon="mdi-refresh" size="small" variant="outlined"
            @click="resetBackgroundLanguages">
            Reset
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-card>
</template>

<script setup>
import { computed, toRefs } from 'vue'

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

// Fix missing background details by populating from backgroundData
if (!character.value.backgroundDetails && character.value.background && characterData.value?.backgroundData) {
  const selectedBackground = characterData.value.backgroundData.find(bg => bg.id === character.value.background)
  if (selectedBackground) {
    character.value.backgroundDetails = selectedBackground
  }
}

// Core stats calculations
const calculateHitPoints = computed(() => {
  if (!character.value.classDetails) return 0
  const hitDie = character.value.classDetails.hit_die || 6
  const constitution = character.value.abilityScores?.constitution?.score || 10
  const conModifier = Math.floor((constitution - 10) / 2)
  return hitDie + conModifier
})

const calculateArmorClass = computed(() => {
  const dexterity = character.value.abilityScores?.dexterity?.score || 10
  const dexModifier = Math.floor((dexterity - 10) / 2)
  return 10 + dexModifier
})

const getClassHitDie = computed(() => {
  return `d${character.value.classDetails?.hit_die || 6}`
})

const getConModifier = computed(() => {
  const constitution = character.value.abilityScores?.constitution?.score || 10
  return Math.floor((constitution - 10) / 2)
})

const getDexModifier = computed(() => {
  const dexterity = character.value.abilityScores?.dexterity?.score || 10
  return Math.floor((dexterity - 10) / 2)
})

// Formatted display versions
const getFormattedHPCalculation = computed(() => {
  const hitDie = getClassHitDie.value
  const conMod = getConModifier.value
  const conModText = conMod >= 0 ? `+${conMod}` : `${conMod}`
  return `${hitDie} ${conModText} (Con)`
})

const getFormattedACCalculation = computed(() => {
  const dexMod = getDexModifier.value
  const dexModText = dexMod >= 0 ? `+${dexMod}` : `${dexMod}`
  return `10 ${dexModText} (Dex)`
})

// Skill-related computeds
const hasClassSkillChoices = computed(() => {
  // Check both API structure and fallback structure
  const totalChoices = character.value.classDetails?.skillProficiencies?.count ||
    character.value.classDetails?.skillChoices || 0
  const selectedCount = character.value.selectedClassSkills?.length || 0
  return totalChoices > 0 && selectedCount < totalChoices
})

const getClassSkillChoices = computed(() => {
  // Check both API structure and fallback structure
  return character.value.classDetails?.skillProficiencies?.count ||
    character.value.classDetails?.skillChoices || 0
})

const getClassSkillOptions = computed(() => {
  let allClassSkills = []

  // Check API structure first
  if (character.value.classDetails?.skillProficiencies?.from) {
    allClassSkills = character.value.classDetails.skillProficiencies.from.map(skill => ({
      name: skill.replace('Skill: ', ''),
      ability_score: { name: 'Unknown' }, // Would need skill lookup table
    }))
  }
  // Check fallback structure (skills array)
  else if (character.value.classDetails?.skills) {
    allClassSkills = character.value.classDetails.skills.map(skill => ({
      name: skill,
      ability_score: { name: 'Unknown' }, // Would need skill lookup table
    }))
  }

  // Filter out skills already provided by background or species
  const backgroundSkillNames = getBackgroundSkills.value
  const speciesSkillNames = getSpeciesSkillProficiencies.value

  const existingSkills = new Set([
    ...backgroundSkillNames,
    ...speciesSkillNames,
  ])

  return allClassSkills.filter(skill => !existingSkills.has(skill.name))
})

const getBackgroundSkills = computed(() => {
  const skills = []

  // Extract from the correct data structure
  if (character.value.backgroundDetails?.skillProficiencies) {
    skills.push(...character.value.backgroundDetails.skillProficiencies)
  }

  // Also check skillProfs as fallback
  if (character.value.backgroundDetails?.skillProfs) {
    skills.push(...character.value.backgroundDetails.skillProfs)
  }

  return [...new Set(skills)] // Remove duplicates
})

const getAllSkillProficiencies = computed(() => {
  const skills = []

  // Add background skills - try multiple formats
  const backgroundSkills = []

  // Format 1: skill_proficiencies array
  if (character.value.backgroundDetails?.skill_proficiencies) {
    character.value.backgroundDetails.skill_proficiencies.forEach(prof => {
      const skillName = prof.name?.replace('Skill: ', '') || prof
      backgroundSkills.push(skillName)
    })
  }

  // Format 2: skillProficiencies array
  if (character.value.backgroundDetails?.skillProficiencies) {
    character.value.backgroundDetails.skillProficiencies.forEach(skillName => {
      backgroundSkills.push(skillName)
    })
  }

  // Add background skills to main skills array
  backgroundSkills.forEach(skillName => {
    if (typeof skillName === 'string') {
      skills.push({
        name: skillName,
        ability_score: { name: 'Unknown' }, // Would need skill lookup table
        source: 'Background',
      })
    } else if (skillName.name) {
      skills.push({
        ...skillName,
        source: 'Background',
      })
    }
  })

  // Add selected class skills
  if (character.value.selectedClassSkills) {
    const classSkillObjects = character.value.selectedClassSkills.map(skillName => {
      const skillOption = getClassSkillOptions.value.find(opt => opt.name === skillName)
      return skillOption || { name: skillName, ability_score: { name: 'Unknown' } }
    })
    skills.push(...classSkillObjects.map(skill => ({ ...skill, source: 'Class' })))
  }

  // Calculate modifiers
  return skills.map(skill => {
    const abilityName = skill.ability_score.name.toLowerCase()
    let abilityModifier = 0

    switch (abilityName) {
      case 'strength': abilityModifier = Math.floor(((character.value.strength || 10) - 10) / 2); break
      case 'dexterity': abilityModifier = Math.floor(((character.value.dexterity || 10) - 10) / 2); break
      case 'constitution': abilityModifier = Math.floor(((character.value.constitution || 10) - 10) / 2); break
      case 'intelligence': abilityModifier = Math.floor(((character.value.intelligence || 10) - 10) / 2); break
      case 'wisdom': abilityModifier = Math.floor(((character.value.wisdom || 10) - 10) / 2); break
      case 'charisma': abilityModifier = Math.floor(((character.value.charisma || 10) - 10) / 2); break
    }

    const proficiencyBonus = character.value.proficiencyBonus || 2
    const isExpertise = character.value.selectedExpertise?.includes(skill.name) || false
    const expertiseBonus = isExpertise ? proficiencyBonus : 0

    return {
      ...skill,
      modifier: abilityModifier + proficiencyBonus + expertiseBonus,
    }
  })
})

const getSpeciesSkillProficiencies = computed(() => {
  // This would need to be implemented based on species data structure
  return []
})

// Expertise related
const expertiseChoices = computed(() => {
  // This would depend on class features - rogues get expertise, etc.
  if (character.value.classDetails?.name?.toLowerCase() === 'rogue') {
    return 2
  }
  return 0
})

const hasExpertiseChoices = computed(() => {
  const totalChoices = expertiseChoices.value
  const selectedCount = character.value.selectedExpertise?.length || 0
  const availableSkills = getAllSkillProficiencies.value.length

  // For classes that get both skill choices and expertise (like Rogue),
  // require that class skills are selected first
  const classSkillChoices = getClassSkillChoices.value
  const selectedClassSkills = character.value.selectedClassSkills?.length || 0
  const classSkillsComplete = classSkillChoices === 0 || selectedClassSkills >= classSkillChoices

  // Only show expertise choices if:
  // 1. Class offers expertise (totalChoices > 0)
  // 2. Character has skill proficiencies to choose from
  // 3. Haven't selected all expertise slots yet
  // 4. Class skill selection is complete (if applicable)
  return totalChoices > 0 && availableSkills > 0 && selectedCount < totalChoices && classSkillsComplete
})

const isExpertiseSkill = skillName => {
  return character.value.selectedExpertise?.includes(skillName) || false
}

// Tool proficiencies
const classToolProficiencies = computed(() => {
  const tools = []

  // Add class tool proficiencies (like Thieves' Tools for Rogues)
  if (character.value.classDetails?.toolProficiencies) {
    character.value.classDetails.toolProficiencies.forEach(tool => {
      // Only include tools that are NOT gaming sets or instruments (those have their own categories)
      if (!tool.toLowerCase().includes('gaming') &&
        !tool.toLowerCase().includes('instrument') &&
        !tool.toLowerCase().includes('dice') &&
        !tool.toLowerCase().includes('cards')) {
        tools.push(tool)
      }
    })
  }

  return [...new Set(tools)] // Remove duplicates
})

const backgroundToolProficiencies = computed(() => {
  const tools = []

  // Get background tool proficiencies from the correct data structure
  if (character.value.backgroundDetails?.toolProficiencies) {
    character.value.backgroundDetails.toolProficiencies.forEach(tool => {
      // Only include tools that are NOT gaming sets, instruments, vehicles, or choice placeholders
      // Also exclude tools already in class proficiencies to avoid duplication
      if (!tool.toLowerCase().includes('gaming') &&
        !tool.toLowerCase().includes('instrument') &&
        !tool.toLowerCase().includes('dice') &&
        !tool.toLowerCase().includes('cards') &&
        !tool.toLowerCase().includes('vehicle') &&
        !tool.toLowerCase().includes('(choice)') &&
        !classToolProficiencies.value.includes(tool)) {
        tools.push(tool)
      }
    })
  }

  // Also check toolProf as fallback
  if (character.value.backgroundDetails?.toolProf) {
    const toolProf = character.value.backgroundDetails.toolProf
    if (!toolProf.toLowerCase().includes('gaming') &&
      !toolProf.toLowerCase().includes('instrument') &&
      !toolProf.toLowerCase().includes('dice') &&
      !toolProf.toLowerCase().includes('cards') &&
      !toolProf.toLowerCase().includes('vehicle') &&
      !toolProf.toLowerCase().includes('(choice)') &&
      !classToolProficiencies.value.includes(toolProf)) {
      tools.push(toolProf)
    }
  }

  // Add selected background tools (from choices like Folk Hero artisan tools)
  if (character.value.selectedBackgroundTools?.length) {
    character.value.selectedBackgroundTools.forEach(tool => {
      if (!classToolProficiencies.value.includes(tool)) {
        tools.push(tool)
      }
    })
  }

  return [...new Set(tools)] // Remove duplicates
})

const backgroundToolOptions = computed(() => {
  const toolOptions = character.value.backgroundDetails?.toolOptions
  if (!toolOptions) return []

  return toolOptions.from || []
})

const backgroundToolChoices = computed(() => {
  return character.value.backgroundDetails?.toolOptions?.choose || 0
})

const getSelectedBackgroundToolsCount = computed(() => {
  return character.value.selectedBackgroundTools?.length || 0
})

const hasBackgroundToolChoices = computed(() => {
  const toolOptions = character.value.backgroundDetails?.toolOptions
  if (!toolOptions || toolOptions.choose <= 0) return false

  const selectedCount = character.value.selectedBackgroundTools?.length || 0
  return selectedCount < toolOptions.choose
})

// Background instrument selection logic
const backgroundInstrumentOptions = computed(() => {
  const instrumentOptions = character.value.backgroundDetails?.instrumentOptions
  if (!instrumentOptions) return []

  return instrumentOptions.from || []
})

const backgroundInstrumentChoices = computed(() => {
  return character.value.backgroundDetails?.instrumentOptions?.choose || 0
})

const hasBackgroundInstrumentChoices = computed(() => {
  const instrumentOptions = character.value.backgroundDetails?.instrumentOptions
  if (!instrumentOptions || instrumentOptions.choose <= 0) return false

  const selectedCount = character.value.selectedBackgroundInstruments?.length || 0
  return selectedCount < instrumentOptions.choose
})

// Other proficiencies
const getInstrumentProficiencies = computed(() => {
  const instruments = []

  // Check class tool proficiencies for instruments
  if (character.value.classDetails?.toolProficiencies) {
    character.value.classDetails.toolProficiencies.forEach(tool => {
      if (tool.toLowerCase().includes('instrument') && !tool.toLowerCase().includes('(choice)')) {
        instruments.push(tool)
      }
    })
  }

  // Check background tool proficiencies for instruments
  if (character.value.backgroundDetails?.toolProficiencies) {
    character.value.backgroundDetails.toolProficiencies.forEach(tool => {
      if (tool.toLowerCase().includes('instrument')) {
        // Only include if it's not a generic "Musical Instrument" when there are options to choose from
        const hasInstrumentOptions = character.value.backgroundDetails?.instrumentOptions?.choose > 0
        if (!hasInstrumentOptions || tool !== 'Musical Instrument') {
          instruments.push(tool)
        }
      }
    })
  }

  // Add selected background instruments
  if (character.value.selectedBackgroundInstruments?.length) {
    character.value.selectedBackgroundInstruments.forEach(instrument => {
      instruments.push(instrument)
    })
  }

  return [...new Set(instruments)] // Remove duplicates
})

const getGamingSetProficiencies = computed(() => {
  const gamingSets = []

  // Check class tool proficiencies for gaming sets
  if (character.value.classDetails?.toolProficiencies) {
    character.value.classDetails.toolProficiencies.forEach(tool => {
      if (tool.toLowerCase().includes('gaming')) {
        gamingSets.push(tool)
      }
    })
  }

  // Check background tool proficiencies for gaming sets
  if (character.value.backgroundDetails?.toolProficiencies) {
    character.value.backgroundDetails.toolProficiencies.forEach(tool => {
      if (tool.toLowerCase().includes('gaming')) {
        gamingSets.push(tool)
      }
    })
  }

  // Also check toolProf as fallback
  if (character.value.backgroundDetails?.toolProf) {
    const toolProf = character.value.backgroundDetails.toolProf
    if (toolProf.toLowerCase().includes('gaming')) {
      gamingSets.push(toolProf)
    }
  }

  return [...new Set(gamingSets)] // Remove duplicates
})

// Separate gaming sets by source for attribution
const getClassGamingSets = computed(() => {
  const gamingSets = []

  if (character.value.classDetails?.toolProficiencies) {
    character.value.classDetails.toolProficiencies.forEach(tool => {
      if (tool.toLowerCase().includes('gaming') && !tool.toLowerCase().includes('choice')) {
        gamingSets.push(tool)
      }
    })
  }

  return gamingSets
})

const getBackgroundGamingSets = computed(() => {
  const gamingSets = []

  // Only show static gaming sets if there are no choices available
  if (getBackgroundGamingSetChoices.value === 0) {
    if (character.value.backgroundDetails?.toolProficiencies) {
      character.value.backgroundDetails.toolProficiencies.forEach(tool => {
        if (tool.toLowerCase().includes('gaming') && !tool.toLowerCase().includes('choice')) {
          gamingSets.push(tool)
        }
      })
    }
  }

  return [...new Set(gamingSets)] // Remove duplicates
})

const getBackgroundGamingSetChoices = computed(() => {
  // Check if background offers gaming set choices
  let hasChoice = false

  if (character.value.backgroundDetails?.toolProf &&
    character.value.backgroundDetails.toolProf.toLowerCase().includes('gaming') &&
    character.value.backgroundDetails.toolProf.toLowerCase().includes('choice')) {
    hasChoice = true
  }

  return hasChoice ? 1 : 0 // Noble background gives 1 gaming set choice
})

const hasBackgroundGamingSetChoices = computed(() => {
  const totalChoices = getBackgroundGamingSetChoices.value
  const selectedCount = character.value.selectedBackgroundGamingSets?.length || 0
  return totalChoices > 0 && selectedCount < totalChoices
})

const getBackgroundGamingSetOptions = computed(() => {
  // Common gaming sets for D&D 5e
  return [
    'Dice Set',
    'Dragonchess Set',
    'Playing Card Set',
    'Three-Dragon Ante Set',
  ]
})

const getVehicleProficiencies = computed(() => {
  const vehicles = []

  // Check class vehicle proficiencies
  if (character.value.classDetails?.vehicleProficiencies) {
    vehicles.push(...character.value.classDetails.vehicleProficiencies)
  }

  // Check background vehicle proficiencies
  if (character.value.backgroundDetails?.vehicleProficiencies) {
    vehicles.push(...character.value.backgroundDetails.vehicleProficiencies)
  }

  // Check background tool proficiencies for vehicles
  if (character.value.backgroundDetails?.toolProficiencies) {
    character.value.backgroundDetails.toolProficiencies.forEach(tool => {
      if (tool.toLowerCase().includes('vehicle')) {
        vehicles.push(tool)
      }
    })
  }

  // Check weapon proficiencies that might include vehicles
  if (character.value.classDetails?.weaponProficiencies) {
    character.value.classDetails.weaponProficiencies.forEach(prof => {
      if (prof.toLowerCase().includes('vehicle')) {
        vehicles.push(prof)
      }
    })
  }

  return [...new Set(vehicles)] // Remove duplicates
})

const getAllLanguages = computed(() => {
  const languages = ['Common'] // Everyone knows Common

  // Add species languages
  if (character.value.speciesDetails?.languages) {
    character.value.speciesDetails.languages.forEach(lang => {
      const langName = typeof lang === 'string' ? lang : lang.name
      if (langName && langName !== 'Common') {
        languages.push(langName)
      }
    })
  }

  // Add automatic racial languages that might be missing from the data
  if (character.value.speciesDetails?.id === 'half-elf') {
    if (!languages.includes('Elvish')) {
      languages.push('Elvish')
    }
  }

  // Add background languages (from the correct data structure)
  if (character.value.backgroundDetails?.languages) {
    character.value.backgroundDetails.languages.forEach(lang => {
      const langName = typeof lang === 'string' ? lang : lang.name
      if (langName && !languages.includes(langName)) {
        languages.push(langName)
      }
    })
  }

  return [...new Set(languages)] // Remove duplicates
})

// Separate language sources for hierarchy
const getCommonLanguage = computed(() => {
  return ['Common'] // Everyone knows Common
})

const getSpeciesLanguages = computed(() => {
  const languages = []

  // Add species languages
  if (character.value.speciesDetails?.languages) {
    character.value.speciesDetails.languages.forEach(lang => {
      const langName = typeof lang === 'string' ? lang : lang.name
      if (langName && langName !== 'Common') {
        languages.push(langName)
      }
    })
  }

  // Add automatic racial languages that might be missing from the data
  if (character.value.speciesDetails?.id === 'half-elf') {
    if (!languages.includes('Elvish')) {
      languages.push('Elvish')
    }
  }

  // Add dwarf languages
  if (character.value.speciesDetails?.id === 'dwarf') {
    if (!languages.includes('Dwarvish')) {
      languages.push('Dwarvish')
    }
  }

  // Add elf languages
  if (character.value.speciesDetails?.id === 'elf') {
    if (!languages.includes('Elvish')) {
      languages.push('Elvish')
    }
  }

  // Add halfling languages
  if (character.value.speciesDetails?.id === 'halfling') {
    if (!languages.includes('Halfling')) {
      languages.push('Halfling')
    }
  }

  // Add gnome languages
  if (character.value.speciesDetails?.id === 'gnome') {
    if (!languages.includes('Gnomish')) {
      languages.push('Gnomish')
    }
  }

  // Add tiefling languages
  if (character.value.speciesDetails?.id === 'tiefling') {
    if (!languages.includes('Infernal')) {
      languages.push('Infernal')
    }
  }

  return [...new Set(languages)] // Remove duplicates
})

const getBackgroundLanguages = computed(() => {
  const languages = []

  // Add background languages (from the correct data structure)
  if (character.value.backgroundDetails?.languages) {
    character.value.backgroundDetails.languages.forEach(lang => {
      const langName = typeof lang === 'string' ? lang : lang.name
      if (langName) {
        languages.push(langName)
      }
    })
  }

  return [...new Set(languages)] // Remove duplicates
})

// Language selection logic
const hasBackgroundLanguageChoices = computed(() => {
  const languageOptions = character.value.backgroundDetails?.languageOptions
  return languageOptions && languageOptions.choose > 0
})

const getBackgroundLanguageChoices = computed(() => {
  return character.value.backgroundDetails?.languageOptions?.choose || 0
})

const getSelectedBackgroundLanguagesCount = computed(() => {
  return character.value.selectedBackgroundLanguages?.length || 0
})

const getAvailableLanguageChoices = computed(() => {
  // Complete D&D 2024 language list (excluding Common since everyone knows it)
  const standardLanguages = [
    // Standard Languages (from Guidelines: Common table choices)
    'Draconic', 'Dwarvish', 'Elvish', 'Giant', 'Gnomish', 'Goblin', 'Halfling', 'Orc',
    // Rare Languages (from Guidelines: available if granted by features)
    'Abyssal', 'Celestial', 'Infernal',
    // Additional Languages (also commonly available)
    'Deep Speech', 'Primordial', 'Sylvan', 'Undercommon',
  ]

  const languageOptions = character.value.backgroundDetails?.languageOptions
  if (!languageOptions) return []

  // If it's "Any", use standard languages minus those already known
  if (languageOptions.from && languageOptions.from.includes('Any')) {
    const knownLanguages = [...getCommonLanguage.value, ...getSpeciesLanguages.value, ...getBackgroundLanguages.value]
    return standardLanguages.filter(lang => !knownLanguages.includes(lang))
  }

  // Otherwise use the specific languages from the background, but filter out already known languages
  const knownLanguages = [...getCommonLanguage.value, ...getSpeciesLanguages.value, ...getBackgroundLanguages.value]
  const specificLanguages = languageOptions.from || []
  return specificLanguages.filter(lang => !knownLanguages.includes(lang))
})

const isLanguageSelected = language => {
  if (!character.value.selectedBackgroundLanguages) return false
  return character.value.selectedBackgroundLanguages.includes(language)
}

// Armor and Weapon Proficiency computeds
const hasArmorProficiencies = computed(() => {
  return character.value.armorTraining?.light ||
    character.value.armorTraining?.medium ||
    character.value.armorTraining?.heavy ||
    character.value.armorTraining?.shields
})

const hasWeaponProficiencies = computed(() => {
  return character.value.weaponProficiencies?.length > 0
})// Methods for selections
const toggleClassSkill = skillName => {
  if (!character.value.selectedClassSkills) {
    character.value.selectedClassSkills = []
  }

  const index = character.value.selectedClassSkills.indexOf(skillName)
  if (index > -1) {
    character.value.selectedClassSkills.splice(index, 1)
  } else if (character.value.selectedClassSkills.length < getClassSkillChoices.value) {
    character.value.selectedClassSkills.push(skillName)
  }
}

const toggleExpertise = skillName => {
  if (!character.value.selectedExpertise) {
    character.value.selectedExpertise = []
  }

  const index = character.value.selectedExpertise.indexOf(skillName)
  if (index > -1) {
    character.value.selectedExpertise.splice(index, 1)
  } else if (character.value.selectedExpertise.length < expertiseChoices.value) {
    character.value.selectedExpertise.push(skillName)
  }
}

const toggleBackgroundTool = toolName => {
  if (!character.value.selectedBackgroundTools) {
    character.value.selectedBackgroundTools = []
  }

  const index = character.value.selectedBackgroundTools.indexOf(toolName)
  if (index > -1) {
    character.value.selectedBackgroundTools.splice(index, 1)
  } else if (character.value.selectedBackgroundTools.length < backgroundToolChoices.value) {
    character.value.selectedBackgroundTools.push(toolName)
  }
}

const toggleBackgroundInstrument = instrumentName => {
  if (!character.value.selectedBackgroundInstruments) {
    character.value.selectedBackgroundInstruments = []
  }

  const index = character.value.selectedBackgroundInstruments.indexOf(instrumentName)
  if (index > -1) {
    character.value.selectedBackgroundInstruments.splice(index, 1)
  } else if (character.value.selectedBackgroundInstruments.length < backgroundInstrumentChoices.value) {
    character.value.selectedBackgroundInstruments.push(instrumentName)
  }
}

const toggleBackgroundGamingSet = gamingSetName => {
  if (!character.value.selectedBackgroundGamingSets) {
    character.value.selectedBackgroundGamingSets = []
  }

  const index = character.value.selectedBackgroundGamingSets.indexOf(gamingSetName)
  if (index > -1) {
    character.value.selectedBackgroundGamingSets.splice(index, 1)
  } else if (character.value.selectedBackgroundGamingSets.length < getBackgroundGamingSetChoices.value) {
    character.value.selectedBackgroundGamingSets.push(gamingSetName)
  }
}

const toggleBackgroundLanguage = language => {
  if (!character.value.selectedBackgroundLanguages) {
    character.value.selectedBackgroundLanguages = []
  }

  const index = character.value.selectedBackgroundLanguages.indexOf(language)
  if (index > -1) {
    character.value.selectedBackgroundLanguages.splice(index, 1)
  } else if (character.value.selectedBackgroundLanguages.length < getBackgroundLanguageChoices.value) {
    character.value.selectedBackgroundLanguages.push(language)
  }
}

// Reset functions
const resetAllSkillSelections = () => {
  // Reset both class skills and expertise selections
  if (character.value.selectedClassSkills) {
    character.value.selectedClassSkills = []
  }
  if (character.value.selectedExpertise) {
    character.value.selectedExpertise = []
  }
}

const resetAllToolSelections = () => {
  // Reset all tool-related selections
  if (character.value.selectedBackgroundTools) {
    character.value.selectedBackgroundTools = []
  }
}

const resetAllOtherProficiencySelections = () => {
  // Reset all other proficiency selections (gaming sets, etc.)
  if (character.value.selectedBackgroundGamingSets) {
    character.value.selectedBackgroundGamingSets = []
  }
}

const resetBackgroundLanguages = () => {
  if (character.value.selectedBackgroundLanguages) {
    character.value.selectedBackgroundLanguages = []
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
