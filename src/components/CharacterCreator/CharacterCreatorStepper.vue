<template>
  <div v-if="!characterData" class="text-center pa-4">
    <v-progress-circular indeterminate />
    <p>Loading character creator...</p>
  </div>

  <v-alert v-else-if="characterData.speciesError?.value" type="warning" class="ma-4">
    <v-alert-title>API Warning</v-alert-title>
    Failed to load races from API: {{ characterData.speciesError.value }}
    <br>Using fallback data instead.
  </v-alert>

  <v-stepper v-else v-model="localCurrentStep" elevation="2" :items="stepItems">
    <!-- Step 1: Basic Info -->
    <template #item.1>
      <v-card flat>
        <v-card-title class="text-h4 text-center mb-4">🎭 Who is your character?</v-card-title>
        <v-card-text>
          <!-- Character Name -->
          <v-row class="mb-4" justify="center">
            <v-col cols="12" md="6" lg="5">
              <v-text-field v-model="character.name" label="Character Name" variant="outlined"
                placeholder="e.g., Thorin Ironbeard, Luna Silverleaf..." prepend-inner-icon="mdi-account"
                class="name-field">
                <template #append>
                  <v-btn icon variant="flat" color="primary" size="default" @click="generateRandomName"
                    :loading="isGeneratingName" class="name-randomizer-btn">
                    <v-icon>mdi-dice-6</v-icon>
                    <v-tooltip activator="parent" location="top">Generate random name</v-tooltip>
                  </v-btn>
                </template>
              </v-text-field>
            </v-col>
          </v-row>

          <!-- Species Selection with Preview -->
          <v-row class="mb-6">
            <v-col cols="12" lg="5">
              <v-card variant="outlined">
                <v-card-title class="text-h6">🧬 Choose Your Species</v-card-title>
                <v-card-text>
                  <v-select v-model="character.species" :items="characterData?.speciesOptions?.value || []"
                    item-title="name" item-value="id" label="Species" variant="outlined"
                    @update:model-value="(value) => { character.species = value; characterData?.updateSpeciesTraits(); }"
                    prepend-inner-icon="mdi-dna" />
                  <v-progress-linear v-if="characterData?.isLoadingSpecies?.value" indeterminate color="primary"
                    class="mb-2" />
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" lg="7">
              <!-- Species Preview Card -->
              <v-card v-if="character.speciesDetails" variant="tonal" color="blue-grey-lighten-5"
                class="species-preview-card">
                <v-card-title class="d-flex align-center pa-3">
                  <v-icon color="blue-grey-darken-2" class="me-2" size="small">mdi-dna</v-icon>
                  <span class="text-subtitle-1 font-weight-bold">{{ character.speciesDetails.name }}</span>
                </v-card-title>
                <v-divider />
                <v-card-text class="pa-3">
                  <!-- Description -->
                  <div v-if="character.speciesDetails.description" class="mb-3">
                    <p class="text-caption text-grey-darken-1 line-height-relaxed">
                      {{ character.speciesDetails.description.substring(0, 80) }}{{
                        character.speciesDetails.description.length > 80 ? '...' : '' }}
                    </p>
                  </div>

                  <!-- Physical Attributes -->
                  <div class="mb-2">
                    <h5 class="text-caption text-blue-grey-darken-2 mb-1 font-weight-bold">Physical Attributes</h5>
                    <div class="ms-2">
                      <v-row dense>
                        <v-col cols="4">
                          <div class="text-center">
                            <div class="text-overline text-grey-darken-1">Size</div>
                            <div class="text-caption font-weight-bold">{{ character.speciesDetails.size }}</div>
                          </div>
                        </v-col>
                        <v-col cols="4">
                          <div class="text-center">
                            <div class="text-overline text-grey-darken-1">Speed</div>
                            <div class="text-caption font-weight-bold">{{ character.speciesDetails.speed }} ft</div>
                          </div>
                        </v-col>
                        <v-col v-if="character.speciesDetails.darkvision" cols="4">
                          <div class="text-center">
                            <div class="text-overline text-grey-darken-1">Darkvision</div>
                            <div class="text-caption font-weight-bold text-purple">{{
                              character.speciesDetails.darkvision
                            }} ft</div>
                          </div>
                        </v-col>
                      </v-row>
                    </div>
                  </div>

                  <!-- Special Traits -->
                  <div v-if="character.speciesDetails.traits && character.speciesDetails.traits.length">
                    <h5 class="text-caption text-blue-grey-darken-2 mb-1 font-weight-bold">Special Traits</h5>
                    <div class="text-caption ms-2">
                      <span v-for="(trait, index) in character.speciesDetails.traits" :key="trait.name">
                        <span class="font-weight-bold text-primary">{{ trait.name }}</span><span
                          v-if="index < character.speciesDetails.traits.length - 1">, </span>
                      </span>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
              <v-card v-else variant="outlined" color="grey-lighten-4">
                <v-card-text class="text-center text-grey">
                  <v-icon size="48" class="mb-2">mdi-help-circle-outline</v-icon>
                  <br>Select a species to see details
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Class Selection with Preview -->
          <v-row class="mb-6">
            <v-col cols="12" lg="5">
              <v-card variant="outlined">
                <v-card-title class="text-h6">⚔️ Choose Your Class</v-card-title>
                <v-card-text>
                  <v-select v-model="character.class" :items="characterData?.classOptions?.value || []"
                    item-title="name" item-value="id" label="Class" variant="outlined"
                    @update:model-value="(value) => { character.class = value; characterData?.updateClassTraits(); }"
                    prepend-inner-icon="mdi-sword" />
                  <v-progress-linear v-if="characterData?.isLoadingClasses?.value" indeterminate color="secondary"
                    class="mb-2" />
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" lg="7">
              <!-- Class Preview Card -->
              <v-card v-if="character.classDetails" variant="tonal" color="red-lighten-5" class="class-preview-card">
                <v-card-title class="d-flex align-center pa-3">
                  <v-icon color="red-darken-2" class="me-2" size="small">mdi-sword</v-icon>
                  <span class="text-subtitle-1 font-weight-bold">{{ character.classDetails.name }}</span>
                </v-card-title>
                <v-divider />
                <v-card-text class="pa-2">
                  <!-- Description -->
                  <div v-if="character.classDetails.description" class="mb-1">
                    <p class="text-caption text-grey-darken-1 line-height-relaxed">
                      {{ character.classDetails.description.substring(0, 80) }}{{
                        character.classDetails.description.length > 80 ? '...' : '' }}
                    </p>
                  </div>

                  <!-- Core Stats -->
                  <div class="mb-1">
                    <h5 class="text-caption text-red-darken-2 mb-1 font-weight-bold">Core Stats</h5>
                    <div class="ms-2">
                      <div class="d-flex justify-space-between text-caption mb-1">
                        <span v-if="character.classDetails.hpDie || character.classDetails.hitDie">
                          <span class="text-overline text-grey-darken-1">Hit Die: </span>
                          <span class="font-weight-bold text-red">{{ character.classDetails.hpDie ||
                            character.classDetails.hitDie }}</span>
                        </span>
                        <span v-if="character.classDetails.primaryAbility">
                          <span class="text-overline text-grey-darken-1">Primary: </span>
                          <span class="font-weight-bold text-orange">{{ character.classDetails.primaryAbility }}</span>
                        </span>
                      </div>
                      <!-- All Skills -->
                      <div v-if="character.classDetails.skills && character.classDetails.skills.length"
                        class="text-caption mb-1">
                        <span class="text-overline text-grey-darken-1">Choose {{ character.classDetails.skillChoices ||
                          2
                        }} Skills:</span>
                        {{ character.classDetails.skills.join(', ') }}
                      </div>
                    </div>
                  </div>

                  <!-- Proficiencies -->
                  <div>
                    <h5 class="text-caption text-red-darken-2 mb-1 font-weight-bold">Proficiencies</h5>
                    <div class="ms-2">
                      <!-- Saving Throws -->
                      <div v-if="character.classDetails.savingThrows && character.classDetails.savingThrows.length"
                        class="text-caption mb-1">
                        <span class="text-overline text-grey-darken-1">Saves: </span>{{
                          character.classDetails.savingThrows.join(', ') }}
                      </div>

                      <!-- Weapon Proficiencies -->
                      <div
                        v-if="character.classDetails.weaponProficiencies && character.classDetails.weaponProficiencies.length"
                        class="text-caption mb-1">
                        <span class="text-overline text-grey-darken-1">Weapons: </span>{{
                          character.classDetails.weaponProficiencies.slice(0, 3).join(', ') }}{{
                          character.classDetails.weaponProficiencies.length > 3 ? `
                        +${character.classDetails.weaponProficiencies.length - 3}` : '' }}
                      </div>

                      <!-- Armor Training -->
                      <div
                        v-if="character.classDetails.armorTraining && (character.classDetails.armorTraining.light || character.classDetails.armorTraining.medium || character.classDetails.armorTraining.heavy || character.classDetails.armorTraining.shields)"
                        class="text-caption">
                        <span class="text-overline text-grey-darken-1">Armor: </span><template
                          v-if="character.classDetails.armorTraining.light">Light</template><template
                          v-if="character.classDetails.armorTraining.medium"><template
                            v-if="character.classDetails.armorTraining.light">, </template>Medium</template><template
                          v-if="character.classDetails.armorTraining.heavy"><template
                            v-if="character.classDetails.armorTraining.light || character.classDetails.armorTraining.medium">,
                          </template>Heavy</template><template
                          v-if="character.classDetails.armorTraining.shields"><template
                            v-if="character.classDetails.armorTraining.light || character.classDetails.armorTraining.medium || character.classDetails.armorTraining.heavy">,
                          </template>Shields</template>
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
              <v-card v-else variant="outlined" color="grey-lighten-4">
                <v-card-text class="text-center text-grey">
                  <v-icon size="48" class="mb-2">mdi-help-circle-outline</v-icon>
                  <br>Select a class to see details
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Background Selection with Preview -->
          <v-row class="mb-6">
            <v-col cols="12" lg="5">
              <v-card variant="outlined">
                <v-card-title class="text-h6">📚 Choose Your Background</v-card-title>
                <v-card-text>
                  <v-select v-model="character.background" :items="characterData?.backgroundOptions?.value || []"
                    item-title="name" item-value="id" label="Background" variant="outlined"
                    @update:model-value="(value) => { character.background = value; characterData?.updateBackgroundTraits(); }"
                    prepend-inner-icon="mdi-book-open-page-variant" />
                  <v-progress-linear v-if="characterData?.isLoadingBackgrounds?.value" indeterminate color="success"
                    class="mb-2" />
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" lg="7">
              <!-- Background Preview Card -->
              <v-card v-if="character.backgroundDetails" variant="tonal" color="green-lighten-5"
                class="background-preview-card">
                <v-card-title class="d-flex align-center pa-3">
                  <v-icon color="green-darken-2" class="me-2" size="small">mdi-book-open-page-variant</v-icon>
                  <span class="text-subtitle-1 font-weight-bold">{{ character.backgroundDetails.name }}</span>
                </v-card-title>
                <v-divider />
                <v-card-text class="pa-3">
                  <!-- Description -->
                  <div v-if="character.backgroundDetails.description" class="mb-3">
                    <p class="text-caption text-grey-darken-1 line-height-relaxed">
                      {{ character.backgroundDetails.description.substring(0, 80) }}{{
                        character.backgroundDetails.description.length > 80 ? '...' : '' }}
                    </p>
                  </div>

                  <!-- Proficiencies -->
                  <div class="mb-2">
                    <h5 class="text-caption text-green-darken-2 mb-1 font-weight-bold">Proficiencies</h5>
                    <div class="ms-2">
                      <!-- Skill Proficiencies -->
                      <div
                        v-if="character.backgroundDetails.skillProficiencies || character.backgroundDetails.skillProfs"
                        class="mb-1">
                        <div class="text-overline text-grey-darken-1">Skills</div>
                        <div class="text-caption">
                          {{ (character.backgroundDetails.skillProficiencies || character.backgroundDetails.skillProfs
                            ||
                            []).join(', ') }}
                        </div>
                      </div>

                      <!-- Tool Proficiencies -->
                      <div v-if="character.backgroundDetails.toolProficiencies || character.backgroundDetails.toolProf"
                        class="mb-1">
                        <div class="text-overline text-grey-darken-1">Tools</div>
                        <div class="text-caption">
                          {{ Array.isArray(character.backgroundDetails.toolProficiencies) ?
                            character.backgroundDetails.toolProficiencies.join(', ') :
                            character.backgroundDetails.toolProf
                          }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Special Feature -->
                  <div v-if="character.backgroundDetails.feature">
                    <h5 class="text-caption text-green-darken-2 mb-1 font-weight-bold">Feature</h5>
                    <div class="ms-2">
                      <div class="text-caption font-weight-bold text-primary">
                        {{ character.backgroundDetails.feature.name }}
                      </div>
                      <div class="text-overline text-grey-darken-1">
                        {{ character.backgroundDetails.feature.description }}
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
              <v-card v-else variant="outlined" color="grey-lighten-4">
                <v-card-text class="text-center text-grey">
                  <v-icon size="48" class="mb-2">mdi-help-circle-outline</v-icon>
                  <br>Select a background to see details
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Level and Alignment -->
          <v-row justify="center">
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model.number="character.level" label="Character Level" type="number" min="1" max="20"
                variant="outlined" prepend-inner-icon="mdi-trending-up" hint="Most new characters start at level 1"
                persistent-hint />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-select v-model="character.alignment" :items="characterData?.alignmentOptions || []" label="Alignment"
                variant="outlined" prepend-inner-icon="mdi-compass" hint="Your character's moral and ethical outlook"
                persistent-hint />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </template>

    <!-- Step 2: Ability Scores -->
    <template #item.2>
      <v-card flat>
        <!-- Title Row with Inline Cards -->
        <v-row class="mb-1" align="center" justify="space-between" no-gutters>
          <!-- Quick Start Options -->
          <v-col cols="12" lg="3" class="d-flex justify-start">
            <v-card variant="tonal" color="primary-lighten-5" class="compact-card">
              <v-card-title class="text-subtitle-1 d-flex align-center pa-2">
                <v-icon class="me-1" size="small">mdi-lightning-bolt</v-icon>
                Quick Start
              </v-card-title>
              <v-card-text class="pa-3">
                <div class="tips-content">
                  <div class="text-caption mb-2">
                    <strong>Quick Setup Options</strong>
                  </div>
                  <div class="d-flex align-center mb-2">
                    <v-btn size="small" variant="elevated" color="primary" @click="setStandardArray"
                      prepend-icon="mdi-format-list-numbered" class="flex-grow-1">
                      Standard Array
                    </v-btn>
                  </div>
                  <div class="d-flex align-center mb-2">
                    <v-btn size="small" variant="elevated" color="secondary" @click="rollAbilityScores"
                      prepend-icon="mdi-dice-6" class="flex-grow-1">
                      Roll 4d6
                    </v-btn>
                  </div>
                  <div class="text-caption mt-1" style="color: rgba(var(--v-theme-on-surface), 0.6);">
                    Choose a method to generate ability scores
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Centered Title -->
          <v-col cols="12" lg="6" class="text-center">
            <h2 class="text-h4 mb-2">⚡ Set Your Abilities</h2>
            <p class="text-subtitle-1 text-grey">
              These numbers determine your character's basic capabilities
            </p>
          </v-col>

          <!-- Class Recommendations -->
          <v-col cols="12" lg="3" class="d-flex justify-end">
            <v-card v-if="character.classDetails" variant="tonal" color="primary-lighten-5" class="compact-card">
              <v-card-title class="text-subtitle-1 d-flex align-center pa-2">
                <v-icon class="me-1" size="small">mdi-target</v-icon>
                {{ character.classDetails.name }} Tips
              </v-card-title>
              <v-card-text class="pa-3">
                <div class="tips-content">
                  <div class="text-caption mb-2">
                    <strong>{{ character.classDetails.name }} Focus</strong>
                  </div>
                  <div class="d-flex align-center mb-2">
                    <span class="text-caption font-weight-bold text-primary me-2">Primary Ability:</span>
                    <v-chip size="small" color="primary" variant="elevated">
                      {{ character.classDetails.primaryAbility }}
                    </v-chip>
                  </div>
                  <div v-if="character.classDetails.savingThrows" class="d-flex align-center mb-2">
                    <span class="text-caption font-weight-bold text-secondary me-2">Saving Throws:</span>
                    <div class="d-flex gap-1">
                      <v-chip v-for="save in character.classDetails.savingThrows?.slice(0, 2)" :key="save" size="small"
                        color="secondary" variant="elevated">
                        {{ save.substring(0, 3).toUpperCase() }}
                      </v-chip>
                    </div>
                  </div>
                  <div class="text-caption mt-1" style="color: rgba(var(--v-theme-on-surface), 0.6);">
                    Prioritize these abilities for your class
                  </div>
                </div>
              </v-card-text>
            </v-card>
            <v-card v-else variant="outlined" color="grey-lighten-4" class="compact-card">
              <v-card-text class="text-center text-grey pa-3">
                <v-icon size="small" class="mb-1">mdi-help-circle-outline</v-icon>
                <div class="text-caption">Select a class for tips</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-card-text>
          <!-- Score Assignment Section -->
          <v-row v-if="isAssigningScores" class="mb-6">
            <v-col cols="12">
              <v-card variant="tonal" color="secondary-lighten-5">
                <v-card-title class="text-h6 d-flex align-center justify-space-between">
                  <div class="d-flex align-center">
                    <v-icon class="me-2">mdi-target</v-icon>
                    Assign Your Scores
                  </div>
                  <v-btn variant="text" color="error" @click="clearAssignments" size="small">
                    Clear All
                  </v-btn>
                </v-card-title>
                <v-card-text>
                  <div class="mb-3">
                    <div class="text-body-2 mb-2">Available Scores: Click to select, then click an ability card to
                      assign it</div>
                    <v-chip-group v-model="selectedScore" class="mb-3" mandatory>
                      <v-chip v-for="score in availableScores" :key="`available-${score}`" size="large" color="primary"
                        variant="outlined" class="score-chip" :value="score">
                        {{ score }}
                      </v-chip>
                    </v-chip-group>
                    <div v-if="availableScores.length === 0" class="text-success text-center">
                      ✅ All scores assigned! Click on any ability score to reassign it.
                    </div>
                    <div v-else-if="selectedScore" class="text-info text-center text-caption">
                      Selected: {{ selectedScore }} - Now click on an ability to assign it
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Ability Scores Grid -->
          <v-row class="mb-6">
            <v-col v-for="(statName) in (characterData?.abilityNames || [])" :key="statName" cols="12" sm="6" lg="4">
              <v-card variant="outlined" class="ability-card-enhanced" :class="{
                'ability-primary': isClassPrimaryAbility(statName),
                'ability-assignable': isAssigningScores && selectedScore && character.abilityScores[statName].score === 0,
                'ability-assigned': isAssigningScores && character.abilityScores[statName].score > 0
              }" @click="() => {
                if (isAssigningScores && selectedScore && character.abilityScores[statName].score === 0) {
                  assignScore(statName)
                }
              }"
                :style="{ cursor: isAssigningScores && selectedScore && character.abilityScores[statName].score === 0 ? 'pointer' : 'default' }">
                <v-card-title class="d-flex align-center justify-space-between pa-3">
                  <div class="d-flex align-center">
                    <span class="ability-icon me-2">{{ getAbilityIcon(statName) }}</span>
                    <span class="text-h6">{{ statName.toUpperCase() }}</span>
                    <span v-if="isClassPrimaryAbility(statName)"
                      class="text-caption text-primary ms-2 font-weight-bold">
                      (PRIMARY)
                    </span>
                  </div>
                  <v-chip :color="getModifierColor(getTotalAbilityModifier(statName))" size="small" label>
                    {{ getTotalAbilityModifier(statName) >= 0 ? '+' : '' }}{{ getTotalAbilityModifier(statName) }}
                  </v-chip>
                </v-card-title>

                <v-divider />

                <v-card-text class="pa-3">
                  <!-- Base Score Input -->
                  <div class="mb-3">
                    <!-- Assignment Mode -->
                    <div v-if="isAssigningScores" class="text-center">
                      <div class="text-h4 font-weight-bold mb-2"
                        :class="character.abilityScores[statName].score > 0 ? 'text-primary' : 'text-grey'"
                        style="cursor: pointer;" @click="() => {
                          if (character.abilityScores[statName].score > 0) {
                            const currentScore = character.abilityScores[statName].score;
                            availableScores.push(currentScore);
                            availableScores.sort((a, b) => b - a);
                            character.abilityScores[statName].score = 0;
                            characterData?.updateAbilityModifier?.(statName);
                          }
                        }">
                        {{ character.abilityScores[statName].score || '?' }}
                      </div>
                      <div class="text-caption" :class="getAssignmentStatusColor(statName)">
                        {{ getAssignmentStatusText(statName) }}
                      </div>
                    </div>

                    <!-- Manual Input Mode -->
                    <v-text-field v-else v-model.number="character.abilityScores[statName].score" type="number"
                      variant="outlined" density="compact" min="1" max="20" label="Base Score"
                      @input="characterData?.updateAbilityModifier?.(statName)" class="text-center base-score-field">
                    </v-text-field>
                  </div>

                  <!-- Bonus Breakdown -->
                  <div class="bonus-breakdown">
                    <!-- Species Bonus -->
                    <div v-if="getSpeciesAbilityBonus(statName)" class="d-flex justify-space-between text-caption mb-1">
                      <span class="text-blue-darken-2">
                        <v-icon size="x-small" class="me-1">mdi-dna</v-icon>
                        {{ character.speciesDetails?.name || 'Species' }}:
                      </span>
                      <span class="font-weight-bold text-blue">+{{ getSpeciesAbilityBonus(statName) }}</span>
                    </div>

                    <!-- Class Bonus -->
                    <div v-if="getClassAbilityBonus(statName)" class="d-flex justify-space-between text-caption mb-1">
                      <span class="text-red-darken-2">
                        <v-icon size="x-small" class="me-1">mdi-sword</v-icon>
                        {{ character.classDetails?.name || 'Class' }}:
                      </span>
                      <span class="font-weight-bold text-red">+{{ getClassAbilityBonus(statName) }}</span>
                    </div>

                    <!-- Background Bonus -->
                    <div v-if="getBackgroundAbilityBonus(statName)"
                      class="d-flex justify-space-between text-caption mb-1">
                      <span class="text-green-darken-2">
                        <v-icon size="x-small" class="me-1">mdi-book-open-page-variant</v-icon>
                        {{ character.backgroundDetails?.name || 'Background' }}:
                      </span>
                      <span class="font-weight-bold text-green">+{{ getBackgroundAbilityBonus(statName) }}</span>
                    </div>

                    <!-- Total Line -->
                    <v-divider class="my-2" />
                    <div class="d-flex justify-space-between text-subtitle-2 font-weight-bold">
                      <span>Total Score:</span>
                      <span>{{ getTotalAbilityScore(statName) }}</span>
                    </div>
                  </div>

                  <!-- Ability Description -->
                  <div class="text-caption text-center text-grey mt-2">
                    {{ getAbilityDescription(statName) }}
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Ability Score Reference -->
          <v-expansion-panels variant="accordion">
            <v-expansion-panel>
              <v-expansion-panel-title>
                <v-icon class="me-2">mdi-help-circle</v-icon>
                Ability Score Reference Guide
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-row>
                  <!-- Score Ranges -->
                  <v-col cols="12" lg="4">
                    <v-card variant="outlined" class="h-100">
                      <v-card-title class="text-h6 d-flex align-center">
                        <v-icon class="me-2" color="primary">mdi-chart-line</v-icon>
                        Score Ranges
                      </v-card-title>
                      <v-card-text>
                        <div class="score-range-list">
                          <div class="score-range-item">
                            <v-chip size="small" color="green" class="me-2">18-20</v-chip>
                            <div>
                              <div class="font-weight-bold text-green">Legendary</div>
                              <div class="text-caption">World-class, superhuman</div>
                            </div>
                          </div>
                          <div class="score-range-item">
                            <v-chip size="small" color="light-green" class="me-2">15-17</v-chip>
                            <div>
                              <div class="font-weight-bold text-light-green">Excellent</div>
                              <div class="text-caption">Professional, highly skilled</div>
                            </div>
                          </div>
                          <div class="score-range-item">
                            <v-chip size="small" color="blue" class="me-2">12-14</v-chip>
                            <div>
                              <div class="font-weight-bold text-blue">Good</div>
                              <div class="text-caption">Above average, talented</div>
                            </div>
                          </div>
                          <div class="score-range-item">
                            <v-chip size="small" color="grey" class="me-2">9-11</v-chip>
                            <div>
                              <div class="font-weight-bold">Average</div>
                              <div class="text-caption">Typical for most people</div>
                            </div>
                          </div>
                          <div class="score-range-item">
                            <v-chip size="small" color="orange" class="me-2">6-8</v-chip>
                            <div>
                              <div class="font-weight-bold text-orange">Poor</div>
                              <div class="text-caption">Below average, limited</div>
                            </div>
                          </div>
                          <div class="score-range-item">
                            <v-chip size="small" color="red" class="me-2">3-5</v-chip>
                            <div>
                              <div class="font-weight-bold text-red">Terrible</div>
                              <div class="text-caption">Severely impaired</div>
                            </div>
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <!-- Modifier Calculation -->
                  <v-col cols="12" lg="4">
                    <v-card variant="outlined" class="h-100">
                      <v-card-title class="text-h6 d-flex align-center">
                        <v-icon class="me-2" color="secondary">mdi-calculator</v-icon>
                        Modifier Calculation
                      </v-card-title>
                      <v-card-text>
                        <div class="mb-3">
                          <p class="text-body-2 mb-2">
                            Modifiers are added to dice rolls:
                          </p>
                          <v-alert type="info" variant="tonal" class="mb-3">
                            <code class="text-h6">(Score - 10) ÷ 2</code>
                            <div class="text-caption mt-1">(rounded down)</div>
                          </v-alert>
                        </div>

                        <div class="modifier-table">
                          <div class="d-flex justify-space-between align-center py-1"
                            v-for="example in modifierExamples" :key="example.score">
                            <span class="font-weight-bold">{{ example.score }}</span>
                            <v-icon small class="mx-2">mdi-arrow-right</v-icon>
                            <v-chip size="small" :color="getModifierColor(example.modifier)">
                              {{ example.modifier >= 0 ? '+' : '' }}{{ example.modifier }}
                            </v-chip>
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <!-- Ability Descriptions -->
                  <v-col cols="12" lg="4">
                    <v-card variant="outlined" class="h-100">
                      <v-card-title class="text-h6 d-flex align-center">
                        <v-icon class="me-2" color="success">mdi-book-open-page-variant</v-icon>
                        What Each Ability Does
                      </v-card-title>
                      <v-card-text>
                        <div class="ability-descriptions">
                          <div v-for="ability in abilityDescriptions" :key="ability.name" class="ability-desc-item">
                            <div class="d-flex align-center mb-1">
                              <span class="ability-icon me-2">{{ ability.icon }}</span>
                              <span class="font-weight-bold text-capitalize">{{ ability.name }}</span>
                            </div>
                            <div class="text-caption text-grey mb-2 ms-4">
                              {{ ability.description }}
                            </div>
                            <div class="text-overline text-primary ms-4">
                              {{ ability.uses }}
                            </div>
                            <v-divider v-if="ability !== abilityDescriptions[abilityDescriptions.length - 1]"
                              class="my-2" />
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>

                <!-- Additional Tips -->
                <v-row class="mt-4">
                  <v-col cols="12">
                    <v-card variant="tonal" color="primary-lighten-5">
                      <v-card-title class="text-h6 d-flex align-center">
                        <v-icon class="me-2">mdi-lightbulb</v-icon>
                        Pro Tips for Ability Scores
                      </v-card-title>
                      <v-card-text>
                        <v-row>
                          <v-col cols="12" md="6">
                            <div class="tip-section">
                              <h6 class="text-subtitle-1 mb-2">🎯 Character Building</h6>
                              <ul class="tip-list">
                                <li>Put your highest score in your class's primary ability</li>
                                <li>Constitution is important for all characters (more hit points)</li>
                                <li>Consider your character's role in the party</li>
                                <li>Don't neglect mental stats for roleplay opportunities</li>
                              </ul>
                            </div>
                          </v-col>
                          <v-col cols="12" md="6">
                            <div class="tip-section">
                              <h6 class="text-subtitle-1 mb-2">📊 Score Distribution</h6>
                              <ul class="tip-list">
                                <li>A 15 in your main stat is a great start</li>
                                <li>Avoid having too many low scores (8 or below)</li>
                                <li>Even scores give the same modifier as the odd number below</li>
                                <li>Your species bonuses will improve your final scores</li>
                              </ul>
                            </div>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
      </v-card>
    </template>

    <!-- Step 3: Features & Skills -->
    <template #item.3>
      <v-card flat>
        <v-card-title class="text-h4 text-center mb-4">🎯 Your Character's Abilities</v-card-title>
        <v-card-subtitle class="text-center mb-4">
          These are automatically calculated based on your choices above
        </v-card-subtitle>
        <v-card-text>
          <!-- Core Stats -->
          <v-row class="mb-6">
            <v-col cols="12" md="4">
              <v-card variant="outlined" color="primary">
                <v-card-title class="text-center">⚔️ Combat Stats</v-card-title>
                <v-card-text>
                  <v-list density="compact">
                    <v-list-item>
                      <v-list-item-title>Proficiency Bonus</v-list-item-title>
                      <template #append>
                        <v-chip size="small" color="primary">+{{ character.proficiencyBonus }}</v-chip>
                      </template>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>Initiative</v-list-item-title>
                      <template #append>
                        <v-chip size="small" :color="character.initiative >= 0 ? 'green' : 'red'">
                          {{ character.initiative >= 0 ? '+' : '' }}{{ character.initiative }}
                        </v-chip>
                      </template>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>Passive Perception</v-list-item-title>
                      <template #append>
                        <v-chip size="small" color="purple">{{ character.passivePerception }}</v-chip>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="4">
              <v-card variant="outlined" color="secondary">
                <v-card-title class="text-center">🏃‍♂️ Physical Stats</v-card-title>
                <v-card-text>
                  <v-list density="compact">
                    <v-list-item>
                      <v-list-item-title>Size</v-list-item-title>
                      <template #append>
                        <v-chip size="small" color="secondary">{{ character.size || 'Medium' }}</v-chip>
                      </template>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>Speed</v-list-item-title>
                      <template #append>
                        <v-chip size="small" color="blue">{{ character.speed || 30 }} ft</v-chip>
                      </template>
                    </v-list-item>
                    <v-list-item v-if="character.speciesDetails?.darkvision">
                      <v-list-item-title>Darkvision</v-list-item-title>
                      <template #append>
                        <v-chip size="small" color="purple">{{ character.speciesDetails.darkvision }} ft</v-chip>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="4">
              <v-card variant="outlined" color="success">
                <v-card-title class="text-center">🛡️ Armor Training</v-card-title>
                <v-card-text>
                  <v-chip-group>
                    <v-chip v-if="character.armorTraining?.light" size="small" color="green">Light Armor</v-chip>
                    <v-chip v-if="character.armorTraining?.medium" size="small" color="orange">Medium Armor</v-chip>
                    <v-chip v-if="character.armorTraining?.heavy" size="small" color="red">Heavy Armor</v-chip>
                    <v-chip v-if="character.armorTraining?.shields" size="small" color="blue">Shields</v-chip>
                  </v-chip-group>
                  <div v-if="!hasAnyArmorTraining" class="text-grey text-caption">No armor training</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Skills Section -->
          <v-card variant="outlined" class="mb-6">
            <v-card-title class="text-h6">🎯 Skill Proficiencies</v-card-title>
            <v-card-text>
              <v-row>
                <v-col v-for="skill in getProficientSkills" :key="skill.name" cols="12" sm="6" md="4">
                  <v-card variant="tonal" color="blue-lighten-5" class="skill-card">
                    <v-card-text class="py-2">
                      <div class="d-flex align-center">
                        <div class="flex-grow-1">
                          <div class="font-weight-bold">{{ skill.name }}</div>
                          <div class="text-caption text-grey">{{ skill.ability }} based</div>
                          <div class="text-caption">{{ skill.exampleUse }}</div>
                        </div>
                        <v-chip size="small" color="primary">
                          {{ getSkillModifier(skill.name) >= 0 ? '+' : '' }}{{ getSkillModifier(skill.name) }}
                        </v-chip>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
              <div v-if="getProficientSkills.length === 0" class="text-center text-grey py-4">
                No skill proficiencies yet - select a class and background to gain skills!
              </div>
            </v-card-text>
          </v-card>

          <!-- Tool Proficiencies -->
          <v-card v-if="character.toolProficiencies && character.toolProficiencies.length" variant="outlined"
            class="mb-6">
            <v-card-title class="text-h6">🔧 Tool Proficiencies</v-card-title>
            <v-card-text>
              <v-chip-group>
                <v-chip v-for="tool in character.toolProficiencies" :key="tool" size="small" color="orange">
                  {{ tool }}
                </v-chip>
              </v-chip-group>
            </v-card-text>
          </v-card>

          <!-- Special Features -->
          <v-card v-if="character.speciesDetails?.traits || character.backgroundDetails?.feature" variant="outlined">
            <v-card-title class="text-h6">✨ Special Features</v-card-title>
            <v-card-text>
              <!-- Species Traits -->
              <div v-if="character.speciesDetails?.traits" class="mb-4">
                <h6 class="text-h6 mb-2">{{ character.speciesDetails.name }} Traits:</h6>
                <v-expansion-panels variant="accordion">
                  <v-expansion-panel v-for="trait in character.speciesDetails.traits.slice(0, 3)" :key="trait.name">
                    <v-expansion-panel-title>{{ trait.name }}</v-expansion-panel-title>
                    <v-expansion-panel-text>{{ trait.description }}</v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </div>

              <!-- Background Feature -->
              <div v-if="character.backgroundDetails?.feature">
                <h6 class="text-h6 mb-2">Background Feature:</h6>
                <v-card variant="tonal" color="green-lighten-5">
                  <v-card-title class="text-subtitle-1">{{ character.backgroundDetails.feature.name }}</v-card-title>
                  <v-card-text>{{ character.backgroundDetails.feature.description }}</v-card-text>
                </v-card>
              </div>
            </v-card-text>
          </v-card>
        </v-card-text>
      </v-card>
    </template>

    <!-- Step 4: Equipment & Wealth -->
    <template #item.4>
      <v-card flat>
        <v-card-title class="text-h4 text-center mb-4">💰 Equipment & Coins</v-card-title>
        <v-card-subtitle class="text-center mb-4">
          Manage your character's possessions and wealth
        </v-card-subtitle>
        <v-card-text>
          <!-- Coin Purse -->
          <v-card variant="outlined" class="mb-6">
            <v-card-title class="text-h6">💰 Coin Purse</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="6" sm="3">
                  <v-text-field v-model.number="character.coins.cp" label="Copper (CP)" type="number" min="0"
                    variant="outlined" prepend-inner-icon="mdi-circle" color="brown" />
                </v-col>
                <v-col cols="6" sm="3">
                  <v-text-field v-model.number="character.coins.sp" label="Silver (SP)" type="number" min="0"
                    variant="outlined" prepend-inner-icon="mdi-circle" color="grey" />
                </v-col>
                <v-col cols="6" sm="3">
                  <v-text-field v-model.number="character.coins.gp" label="Gold (GP)" type="number" min="0"
                    variant="outlined" prepend-inner-icon="mdi-circle" color="yellow-darken-2" />
                </v-col>
                <v-col cols="6" sm="3">
                  <v-text-field v-model.number="character.coins.pp" label="Platinum (PP)" type="number" min="0"
                    variant="outlined" prepend-inner-icon="mdi-circle" color="blue-grey" />
                </v-col>
              </v-row>
              <v-alert type="info" variant="tonal" class="mt-4">
                <strong>Total Value:</strong> {{ formatCoins(totalGP) }} GP equivalent
                <br><strong>Coin Values:</strong> 1 PP = 10 GP = 100 SP = 1,000 CP
              </v-alert>
            </v-card-text>
          </v-card>

          <!-- Starting Equipment -->
          <v-card variant="outlined" class="mb-6">
            <v-card-title class="text-h6">🎒 Starting Equipment</v-card-title>
            <v-card-text>
              <div v-if="character.equipment && character.equipment.length">
                <v-row>
                  <v-col v-for="(item, index) in character.equipment" :key="index" cols="12" sm="6" md="4">
                    <v-card variant="tonal" color="blue-grey-lighten-5" class="equipment-card">
                      <v-card-text class="py-2">
                        <div class="d-flex align-center">
                          <div class="flex-grow-1">
                            <div class="font-weight-bold">{{ item.name }}</div>
                            <div v-if="item.quantity && item.quantity > 1" class="text-caption">
                              Quantity: {{ item.quantity }}
                            </div>
                            <div v-if="item.weight" class="text-caption text-grey">
                              Weight: {{ item.weight }} lbs
                            </div>
                            <div v-if="item.cost" class="text-caption text-grey">
                              Value: {{ item.cost }} GP
                            </div>
                          </div>
                          <v-icon color="blue-grey">mdi-package-variant</v-icon>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </div>
              <div v-else class="text-center text-grey py-4">
                <v-icon size="48" class="mb-2">mdi-package-variant-closed</v-icon>
                <br>No starting equipment yet
                <br><small>Select a class and background to get starting gear!</small>
              </div>
            </v-card-text>
          </v-card>

          <!-- Carrying Capacity -->
          <v-card variant="outlined" class="mb-6">
            <v-card-title class="text-h6">🏋️‍♂️ Carrying Capacity</v-card-title>
            <v-card-text>
              <v-progress-linear :model-value="(totalWeight / carryingCapacity) * 100"
                :color="getEncumbranceColor(totalWeight, carryingCapacity)" height="20" class="mb-2">
                <strong>{{ totalWeight }} / {{ carryingCapacity }} lbs</strong>
              </v-progress-linear>
              <div class="text-caption text-center">
                <span v-if="totalWeight <= carryingCapacity" class="text-green">✅ Carrying normally</span>
                <span v-else class="text-red">⚠️ Overloaded! Movement reduced.</span>
              </div>
              <v-alert v-if="totalWeight > carryingCapacity" type="warning" variant="tonal" class="mt-2">
                Your character is carrying too much! Consider dropping some items or increasing your Strength.
              </v-alert>
            </v-card-text>
          </v-card>

          <!-- Equipment from API -->
          <v-card v-if="characterData?.equipmentData?.value && characterData.equipmentData.value.length"
            variant="outlined">
            <v-card-title class="text-h6">🛍️ Available Equipment</v-card-title>
            <v-card-subtitle>Equipment from the D&D API (first 12 items shown)</v-card-subtitle>
            <v-card-text>
              <v-row>
                <v-col v-for="item in characterData.equipmentData.value.slice(0, 12)" :key="item.id" cols="12" sm="6"
                  md="4">
                  <v-card variant="outlined" class="equipment-api-card" hover>
                    <v-card-text class="py-2">
                      <div class="font-weight-bold">{{ item.name }}</div>
                      <div v-if="item.equipment_category" class="text-caption text-primary">
                        {{ item.equipment_category }}
                      </div>
                      <div v-if="item.cost" class="text-caption">
                        Cost: {{ item.cost.quantity }} {{ item.cost.unit }}
                      </div>
                      <div v-if="item.weight" class="text-caption">
                        Weight: {{ item.weight }} lbs
                      </div>
                      <div v-if="item.armor_class" class="text-caption text-blue">
                        AC: {{ item.armor_class.base }}{{ item.armor_class.dex_bonus ? ' + Dex' : '' }}
                      </div>
                      <div v-if="item.damage" class="text-caption text-red">
                        Damage: {{ item.damage.damage_dice }} {{ item.damage.damage_type }}
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

    <!-- Step 5: Final Details & Review -->
    <template #item.5>
      <v-card flat>
        <v-card-title class="text-h4 text-center mb-4">📋 Review & Finalize</v-card-title>
        <v-card-subtitle class="text-center mb-4">
          Review your character and add any final details
        </v-card-subtitle>
        <v-card-text>
          <!-- Character Summary -->
          <v-card variant="tonal" color="primary-lighten-5" class="mb-6">
            <v-card-title class="text-h5">{{ character.name || 'Unnamed Character' }}</v-card-title>
            <v-card-subtitle>
              Level {{ character.level }} {{ character.speciesDetails?.name || 'Unknown Species' }} {{
                character.classDetails?.name || 'Unknown Class' }}
              <br>{{ character.backgroundDetails?.name || 'Unknown Background' }} • {{ character.alignment || 'No Alignment' }}
            </v-card-subtitle>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <h6 class="text-h6 mb-2">Ability Scores:</h6>
                  <v-chip-group>
                    <v-chip v-for="(stat, name) in character.abilityScores" :key="name" size="small"
                      :color="getModifierColor(stat.modifier)">
                      {{ name.toUpperCase() }}: {{ stat.score }} ({{ stat.modifier >= 0 ? '+' : '' }}{{ stat.modifier
                      }})
                    </v-chip>
                  </v-chip-group>
                </v-col>
                <v-col cols="12" md="6">
                  <h6 class="text-h6 mb-2">Key Stats:</h6>
                  <v-list density="compact">
                    <v-list-item>
                      <v-list-item-title>Proficiency Bonus: +{{ character.proficiencyBonus }}</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>Initiative: {{ character.initiative >= 0 ? '+' : '' }}{{ character.initiative
                      }}</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>Passive Perception: {{ character.passivePerception }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Backstory -->
          <v-card variant="outlined" class="mb-6">
            <v-card-title class="text-h6">📖 Character Backstory</v-card-title>
            <v-card-text>
              <v-textarea v-model="character.backstory" label="Tell your character's story..." variant="outlined"
                auto-grow rows="3"
                placeholder="Where did your character come from? What drives them? What are their goals and fears?"
                hint="This helps bring your character to life during roleplay!" persistent-hint />
            </v-card-text>
          </v-card>

          <!-- Notes -->
          <v-card variant="outlined" class="mb-6">
            <v-card-title class="text-h6">📝 Additional Notes</v-card-title>
            <v-card-text>
              <v-textarea v-model="character.notes" label="Any additional notes..." variant="outlined" auto-grow
                rows="2" placeholder="House rules, special considerations, reminders, etc." />
            </v-card-text>
          </v-card>

          <!-- Validation Warnings -->
          <v-alert v-if="getValidationWarnings().length" type="warning" variant="tonal" class="mb-6">
            <v-alert-title>⚠️ Character Needs Attention</v-alert-title>
            <ul>
              <li v-for="warning in getValidationWarnings()" :key="warning">{{ warning }}</li>
            </ul>
          </v-alert>

          <!-- Success Message -->
          <v-alert v-else type="success" variant="tonal" class="mb-6">
            <v-alert-title>✅ Character Ready</v-alert-title>
            Your character looks complete and ready for adventure!
          </v-alert>

          <!-- Submit Button -->
          <v-row justify="center">
            <v-col cols="12" sm="8" md="6">
              <v-btn block size="large" color="primary" variant="elevated" prepend-icon="mdi-content-save"
                @click="$emit('submit-character')"
                :disabled="!character.name || !character.species || !character.class || !character.background">
                Save Character to Collection
              </v-btn>
              <div class="text-center text-caption text-grey mt-2">
                This will save your character to your personal collection
              </div>
            </v-col>
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
import { inject, computed, ref } from 'vue'

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

// Reactive state for name generation
const isGeneratingName = ref(false)

// Ability score assignment system
const availableScores = ref([])
const isAssigningScores = ref(false)
const selectedScore = ref(null)

// Step configuration
const stepItems = [
  { title: 'Character Info', value: 1 },
  { title: 'Ability Scores', value: 2 },
  { title: 'Features & Skills', value: 3 },
  { title: 'Equipment', value: 4 },
  { title: 'Review & Save', value: 5 }
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

// Random name generation
const generateRandomName = async () => {
  isGeneratingName.value = true

  // Fantasy name components
  const firstNames = [
    'Aerdrie', 'Ahvak', 'Aramil', 'Aranea', 'Berris', 'Cithreth', 'Dayereth', 'Enna', 'Galinndan', 'Hadarai',
    'Halimath', 'Heian', 'Himo', 'Immeral', 'Ivellios', 'Korfel', 'Lamlis', 'Laucian', 'Mindartis', 'Naal',
    'Nutae', 'Paelynn', 'Peren', 'Quarion', 'Riardon', 'Rolen', 'Soveliss', 'Suhnaal', 'Thamior', 'Theriatis',
    'Theriovan', 'Thervan', 'Uthemar', 'Vanuath', 'Varis', 'Adrie', 'Ahvna', 'Aramil', 'Aranea', 'Berris',
    'Caelynn', 'Dayereth', 'Enna', 'Galinndan', 'Hadarai', 'Halimath', 'Heian', 'Himo', 'Immeral', 'Ivellios',
    'Korfel', 'Lamlis', 'Laucian', 'Mindartis', 'Naal', 'Nutae', 'Paelynn', 'Peren', 'Quarion', 'Riardon',
    'Thorin', 'Balin', 'Dwalin', 'Gloin', 'Nori', 'Dori', 'Ori', 'Oin', 'Bifur', 'Bofur', 'Bombur', 'Fili', 'Kili',
    'Aragorn', 'Legolas', 'Gimli', 'Boromir', 'Faramir', 'Eomer', 'Eowyn', 'Theoden', 'Gandalf', 'Radagast',
    'Elrond', 'Arwen', 'Galadriel', 'Celeborn', 'Thranduil', 'Tauriel', 'Haldir', 'Lindir', 'Figwit', 'Glorfindel'
  ]

  const lastNames = [
    'Amakir', 'Amakiei', 'Galanodel', 'Holimion', 'Liadon', 'Meliamne', 'Nailo', 'Siannodel', 'Xiloscient',
    'Alderleaf', 'Brushgather', 'Goodbarrel', 'Greenbottle', 'High-hill', 'Hilltopple', 'Leagallow', 'Tealeaf',
    'Thorngage', 'Tosscobble', 'Underbough', 'Axebreaker', 'Battlehammer', 'Brawnanvil', 'Dankil', 'Fireforge',
    'Frostbeard', 'Gorunn', 'Holderhek', 'Ironfist', 'Loderr', 'Lutgehr', 'Rumnaheim', 'Strakeln', 'Torunn',
    'Ungart', 'Vondal', 'Ironforge', 'Stormhammer', 'Goldbeard', 'Silverbane', 'Dragonbane', 'Shadowbane',
    'Lightbringer', 'Dawnbreaker', 'Nightfall', 'Starweaver', 'Moonwhisper', 'Sunblade', 'Frostborn', 'Flameheart',
    'Windwalker', 'Earthshaker', 'Stormbringer', 'Mistwalker', 'Shadowdancer', 'Brightblade', 'Swiftstrike'
  ]

  // Add a small delay for better UX
  await new Promise(resolve => setTimeout(resolve, 300))

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]

  props.character.name = `${firstName} ${lastName}`
  isGeneratingName.value = false
}

// Helper methods for UI
const getAbilityIcon = (abilityName) => {
  const icons = {
    strength: '💪',
    dexterity: '🤸',
    constitution: '❤️',
    intelligence: '🧠',
    wisdom: '👁️',
    charisma: '😊'
  }
  return icons[abilityName] || '⭐'
}

const getAbilityDescription = (abilityName) => {
  const descriptions = {
    strength: 'Physical power, jumping, carrying',
    dexterity: 'Agility, stealth, reflexes',
    constitution: 'Health, stamina, vitality',
    intelligence: 'Reasoning, memory, analytics',
    wisdom: 'Perception, insight, intuition',
    charisma: 'Force of personality, leadership'
  }
  return descriptions[abilityName] || 'Core ability'
}

// Enhanced reference guide data
const modifierExamples = [
  { score: 20, modifier: 5 },
  { score: 18, modifier: 4 },
  { score: 15, modifier: 2 },
  { score: 13, modifier: 1 },
  { score: 10, modifier: 0 },
  { score: 8, modifier: -1 },
  { score: 6, modifier: -2 },
  { score: 3, modifier: -4 }
]

const abilityDescriptions = [
  {
    name: 'strength',
    icon: '💪',
    description: 'Measures physical power and athletic ability',
    uses: 'Attack rolls (melee), damage (melee), Athletics, jumping, carrying capacity'
  },
  {
    name: 'dexterity',
    icon: '🤸',
    description: 'Measures agility, reflexes, and balance',
    uses: 'Attack rolls (ranged), AC (light armor), initiative, Stealth, Acrobatics'
  },
  {
    name: 'constitution',
    icon: '❤️',
    description: 'Measures health, stamina, and vital force',
    uses: 'Hit points, concentration saves, resisting poison and disease'
  },
  {
    name: 'intelligence',
    icon: '🧠',
    description: 'Measures reasoning, memory, and analytical thinking',
    uses: 'Investigation, History, Arcana, Nature, spell attacks (Wizard)'
  },
  {
    name: 'wisdom',
    icon: '👁️',
    description: 'Measures awareness, intuition, and insight',
    uses: 'Perception, Insight, Survival, Animal Handling, spell attacks (Cleric/Druid)'
  },
  {
    name: 'charisma',
    icon: '😊',
    description: 'Measures force of personality and leadership',
    uses: 'Persuasion, Deception, Intimidation, Performance, spell attacks (Bard/Sorcerer)'
  }
]

const getModifierColor = (modifier) => {
  if (modifier >= 3) return 'green'
  if (modifier >= 1) return 'light-green'
  if (modifier >= 0) return 'grey'
  if (modifier >= -1) return 'orange'
  return 'red'
}

// Ability Score Enhancement Methods
const setStandardArray = () => {
  availableScores.value = [15, 14, 13, 12, 10, 8]
  isAssigningScores.value = true

  // Clear any existing assigned scores
  const abilityNames = characterData?.abilityNames?.value || ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']
  abilityNames.forEach((ability) => {
    if (props.character.abilityScores[ability]) {
      props.character.abilityScores[ability].score = 0
      characterData?.updateAbilityModifier?.(ability)
    }
  })
}

const rollAbilityScores = () => {
  const rolledScores = []

  // Roll 6 sets of 4d6, drop lowest for each
  for (let i = 0; i < 6; i++) {
    const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1)
    rolls.sort((a, b) => b - a) // Sort descending
    const score = rolls.slice(0, 3).reduce((sum, roll) => sum + roll, 0) // Take top 3
    rolledScores.push(score)
  }

  // Sort the scores descending for easier assignment
  rolledScores.sort((a, b) => b - a)

  availableScores.value = rolledScores
  isAssigningScores.value = true

  // Clear any existing assigned scores
  const abilityNames = characterData?.abilityNames?.value || ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']
  abilityNames.forEach((ability) => {
    if (props.character.abilityScores[ability]) {
      props.character.abilityScores[ability].score = 0
      characterData?.updateAbilityModifier?.(ability)
    }
  })
}

const assignScore = (abilityName, score = null) => {
  const scoreToAssign = score || selectedScore.value
  if (!scoreToAssign || !availableScores.value.includes(scoreToAssign)) return

  // Remove the score from available scores
  const scoreIndex = availableScores.value.indexOf(scoreToAssign)
  availableScores.value.splice(scoreIndex, 1)

  // If this ability already had a score, put it back in available scores
  const currentScore = props.character.abilityScores[abilityName]?.score
  if (currentScore && currentScore > 0) {
    availableScores.value.push(currentScore)
    availableScores.value.sort((a, b) => b - a)
  }

  // Assign the new score
  if (props.character.abilityScores[abilityName]) {
    props.character.abilityScores[abilityName].score = scoreToAssign
    characterData?.updateAbilityModifier?.(abilityName)
  }

  // Clear the selected score
  selectedScore.value = null

  // Check if all scores are assigned
  if (availableScores.value.length === 0) {
    isAssigningScores.value = false
  }
}

const clearAssignments = () => {
  const abilityNames = characterData?.abilityNames?.value || ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']

  // Collect all currently assigned scores
  const assignedScores = []
  abilityNames.forEach((ability) => {
    const score = props.character.abilityScores[ability]?.score
    if (score && score > 0) {
      assignedScores.push(score)
      props.character.abilityScores[ability].score = 0
      characterData?.updateAbilityModifier?.(ability)
    }
  })

  // Put all scores back in available scores
  availableScores.value = [...availableScores.value, ...assignedScores]
  availableScores.value.sort((a, b) => b - a)

  // Clear selected score
  selectedScore.value = null
}

const getAssignmentStatusText = (abilityName) => {
  if (props.character.abilityScores[abilityName].score > 0) {
    return 'Click to unassign'
  } else if (selectedScore.value) {
    return `Click to assign ${selectedScore.value}`
  } else {
    return 'Select a score above'
  }
}

const getAssignmentStatusColor = (abilityName) => {
  if (props.character.abilityScores[abilityName].score > 0) {
    return 'text-success'
  } else if (selectedScore.value) {
    return 'text-primary'
  } else {
    return 'text-grey'
  }
}

const isClassPrimaryAbility = (abilityName) => {
  if (!props.character.classDetails?.primaryAbility) return false
  return props.character.classDetails.primaryAbility.toLowerCase().includes(abilityName.toLowerCase())
}

const getSpeciesAbilityBonus = (abilityName) => {
  // This would need to be implemented based on your species data structure
  // For now, returning 0 as placeholder - you'll need to adapt this to your data model
  if (!props.character.speciesDetails?.abilityScoreIncrease) return 0

  const bonuses = props.character.speciesDetails.abilityScoreIncrease
  if (Array.isArray(bonuses)) {
    const bonus = bonuses.find(b => b.ability?.toLowerCase() === abilityName.toLowerCase())
    return bonus?.bonus || bonus?.increase || 0
  }

  return bonuses[abilityName] || bonuses[abilityName.toLowerCase()] || 0
}

const getClassAbilityBonus = (abilityName) => {
  // Placeholder for class-based ability bonuses
  // Adapt this based on your class data structure
  return 0
}

const getBackgroundAbilityBonus = (abilityName) => {
  // Placeholder for background-based ability bonuses
  // Adapt this based on your background data structure
  return 0
}

const getTotalAbilityScore = (abilityName) => {
  const baseScore = props.character.abilityScores[abilityName]?.score || 0
  const speciesBonus = getSpeciesAbilityBonus(abilityName)
  const classBonus = getClassAbilityBonus(abilityName)
  const backgroundBonus = getBackgroundAbilityBonus(abilityName)

  return baseScore + speciesBonus + classBonus + backgroundBonus
}

const getTotalAbilityModifier = (abilityName) => {
  const totalScore = getTotalAbilityScore(abilityName)
  return Math.floor((totalScore - 10) / 2)
}

const getProficientSkills = computed(() => {
  if (!props.character.skillProficiencies || !characterData?.skillList) return []

  return characterData.skillList.filter(skill =>
    props.character.skillProficiencies[skill.name]?.proficient
  )
})

const getSkillModifier = (skillName) => {
  const skill = characterData?.skillList?.find(s => s.name === skillName)
  if (!skill) return 0

  const abilityName = skill.ability.toLowerCase()
  const abilityMod = props.character.abilityScores[abilityName]?.modifier || 0
  const proficiencyBonus = props.character.skillProficiencies[skillName]?.proficient ? props.character.proficiencyBonus : 0

  return abilityMod + proficiencyBonus
}

const hasAnyArmorTraining = computed(() => {
  const training = props.character.armorTraining
  return training?.light || training?.medium || training?.heavy || training?.shields
})

const formatCoins = (totalGP) => {
  return Math.round(totalGP * 100) / 100
}

const getEncumbranceColor = (currentWeight, maxWeight) => {
  const ratio = currentWeight / maxWeight
  if (ratio >= 1) return 'red'
  if (ratio >= 0.8) return 'orange'
  if (ratio >= 0.6) return 'yellow'
  return 'green'
}

const getValidationWarnings = () => {
  const warnings = []

  if (!props.character.name?.trim()) {
    warnings.push('Character needs a name')
  }

  if (!props.character.species) {
    warnings.push('Choose a species/race')
  }

  if (!props.character.class) {
    warnings.push('Choose a class')
  }

  if (!props.character.background) {
    warnings.push('Choose a background')
  }

  if (!props.character.alignment) {
    warnings.push('Choose an alignment')
  }

  // Check for very low ability scores
  const lowStats = Object.entries(props.character.abilityScores || {})
    .filter(([name, stat]) => stat.score < 8)
    .map(([name]) => name)

  if (lowStats.length) {
    warnings.push(`Very low ability scores: ${lowStats.join(', ')} (consider raising them)`)
  }

  return warnings
}

// Computed properties for character data
const totalGP = computed(() => characterData?.totalGP?.value || 0)
const carryingCapacity = computed(() => characterData?.carryingCapacity?.value || 150)
const totalWeight = computed(() => characterData?.totalWeight?.value || 0)
</script>

<style scoped>
.v-card-title {
  font-weight: bold;
}

.ability-card {
  transition: transform 0.2s;
}

.ability-card:hover {
  transform: translateY(-2px);
}

.score-field :deep(.v-field__input) {
  text-align: center;
  font-size: 1.2em;
  font-weight: bold;
}

.skill-card {
  transition: transform 0.2s;
  border-left: 4px solid #1976d2;
}

.skill-card:hover {
  transform: translateY(-1px);
}

.equipment-card {
  transition: transform 0.2s;
}

.equipment-card:hover {
  transform: translateY(-1px);
}

.equipment-api-card {
  transition: all 0.2s;
  cursor: pointer;
}

.equipment-api-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.v-stepper {
  background: transparent !important;
}

.v-stepper-item {
  padding: 24px;
}

.text-h4 {
  color: #1976d2;
  font-weight: 300;
}

.v-alert {
  border-radius: 12px;
}

.v-card {
  border-radius: 12px;
}

.v-chip {
  font-weight: 500;
}

.v-expansion-panel-title {
  font-weight: 600;
}

/* Progress bar styling */
.v-progress-linear {
  border-radius: 10px;
}

/* Preview Card Enhancements */
.species-preview-card,
.class-preview-card {
  transition: all 0.3s ease;
  border: 2px solid transparent;
  max-height: 320px;
  overflow: hidden;
}

.background-preview-card {
  transition: all 0.3s ease;
  border: 2px solid transparent;
  max-height: 450px;
  overflow: hidden;
}

.species-preview-card:hover {
  border-color: #546e7a;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(84, 110, 122, 0.2);
}

.class-preview-card:hover {
  border-color: #c62828;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(198, 40, 40, 0.2);
}

.background-preview-card:hover {
  border-color: #2e7d32;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(46, 125, 50, 0.2);
}

.line-height-relaxed {
  line-height: 1.4;
}

/* Custom scrollbar for equipment sections */
.equipment-scroll {
  max-height: 400px;
  overflow-y: auto;
}

.equipment-scroll::-webkit-scrollbar {
  width: 6px;
}

.equipment-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.equipment-scroll::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

.equipment-scroll::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Name field styling */
.name-field :deep(.v-field) {
  min-height: 56px !important;
}

.name-field :deep(.v-field__field) {
  height: 56px !important;
  display: flex !important;
  align-items: center !important;
  padding-left: 16px !important;
  padding-right: 4px !important;
}

.name-field :deep(.v-field__input) {
  min-height: 48px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  display: flex !important;
  align-items: center !important;
}

.name-field :deep(.v-field__input input) {
  line-height: 24px !important;
  font-size: 16px !important;
}

.name-field :deep(.v-field__append-inner) {
  margin-inline-start: 8px !important;
  padding-top: 0 !important;
  align-self: center !important;
}

.name-randomizer-btn {
  height: 40px !important;
  width: 40px !important;
  border-radius: 8px !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
}

.name-randomizer-btn:hover {
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
}

/* Enhanced Ability Card Styling */
.ability-card-enhanced {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.ability-card-enhanced:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.ability-primary {
  border-color: #1976d2 !important;
  background: rgba(25, 118, 210, 0.1) !important;
}

.ability-primary:hover {
  border-color: #1565c0 !important;
  box-shadow: 0 8px 24px rgba(25, 118, 210, 0.2);
  background: rgba(25, 118, 210, 0.15) !important;
}

/* Assignment Mode Styles */
.ability-assignable {
  border-color: #4caf50 !important;
  background: rgba(76, 175, 80, 0.1) !important;
  animation: pulse 2s infinite;
}

.ability-assignable:hover {
  border-color: #388e3c !important;
  background: rgba(76, 175, 80, 0.2) !important;
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(76, 175, 80, 0.3);
}

.ability-assigned {
  border-color: #2196f3 !important;
  background: rgba(33, 150, 243, 0.1) !important;
}

.ability-assigned:hover {
  border-color: #1976d2 !important;
  background: rgba(33, 150, 243, 0.15) !important;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4);
  }

  70% {
    box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
  }
}

.score-chip {
  cursor: pointer !important;
  transition: all 0.2s ease;
}

.score-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.ability-icon {
  font-size: 1.5em;
  line-height: 1;
}

.base-score-field :deep(.v-field__input) {
  text-align: center;
  font-size: 1.1em;
  font-weight: bold;
}

.bonus-breakdown {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  padding: 8px;
  margin-top: 4px;
}

.score-guide {
  list-style: none;
  padding: 0;
}

.score-guide li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  border-bottom: 1px solid #f0f0f0;
}

.score-guide li:last-child {
  border-bottom: none;
}

.modifier-examples {
  background: #f8f9fa;
  padding: 8px;
  border-radius: 6px;
  border-left: 3px solid #1976d2;
}

/* Enhanced Reference Guide Styles */
.score-range-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.score-range-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.02);
  transition: all 0.2s ease;
}

.score-range-item:hover {
  background: rgba(0, 0, 0, 0.05);
  transform: translateX(4px);
}

/* Dark theme support for score range items */
.v-theme--dark .score-range-item {
  background: rgba(255, 255, 255, 0.05);
}

.v-theme--dark .score-range-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.modifier-table {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 12px;
  border: 1px solid rgba(224, 224, 224, 0.5);
  backdrop-filter: blur(10px);
}

/* Dark theme support for modifier table */
.v-theme--dark .modifier-table {
  background: rgba(80, 80, 80, 0.9);
  border-color: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.87);
}

.ability-descriptions {
  max-height: 400px;
  overflow-y: auto;
}

.ability-desc-item {
  padding: 4px 0;
}

.ability-desc-item .ability-icon {
  font-size: 1.2em;
  line-height: 1;
}

.tip-section {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 16px;
  height: 100%;
  backdrop-filter: blur(10px);
}

/* Dark theme support for tip sections */
.v-theme--dark .tip-section {
  background: rgba(80, 80, 80, 0.9);
  color: rgba(255, 255, 255, 0.87);
}

.tip-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tip-list li {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
  padding-left: 20px;
  position: relative;
}

.tip-list li:before {
  content: '•';
  color: #1976d2;
  font-weight: bold;
  position: absolute;
  left: 0;
  top: 0;
}

.tip-list li:last-child {
  margin-bottom: 0;
}

/* Reference guide card styling */
.v-expansion-panel-text :deep(.v-card) {
  transition: all 0.3s ease;
}

.v-expansion-panel-text :deep(.v-card):hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* Reference guide expansion panel styling */
.v-expansion-panel {
  border: 2px solid rgba(255, 255, 255, 0.8) !important;
  border-radius: 8px !important;
  overflow: hidden !important;
}

/* Dark theme support for expansion panel */
.v-theme--dark .v-expansion-panel {
  border-color: rgba(255, 255, 255, 0.2) !important;
}

/* Reference guide expansion panel background */
.v-expansion-panel-text {
  background: rgba(0, 0, 0, 0.03) !important;
}

/* Dark theme support for expansion panel content */
.v-theme--dark .v-expansion-panel-text {
  background: rgba(255, 255, 255, 0.03) !important;
}

/* Compact card styling for inline layout */
.compact-card {
  height: auto !important;
  min-height: 200px !important;
  max-width: 280px !important;
  width: 100% !important;
}

.compact-card .v-card-title {
  font-size: 1.1rem !important;
  line-height: 1.4 !important;
  padding: 16px !important;
  white-space: normal !important;
  word-wrap: break-word !important;
}

.compact-card .v-card-text {
  padding: 12px !important;
}

.compact-card .v-btn {
  font-size: 0.75rem !important;
  padding: 8px 12px !important;
}

.compact-card .v-chip {
  margin: 2px !important;
}

/* Tips card content styling */
.tips-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tips-content .v-chip {
  font-weight: 500 !important;
  letter-spacing: 0.5px !important;
}

.tips-content .text-caption {
  color: rgba(var(--v-theme-on-surface), 0.7) !important;
  text-transform: uppercase !important;
  font-size: 0.7rem !important;
  letter-spacing: 0.8px !important;
}
</style>
