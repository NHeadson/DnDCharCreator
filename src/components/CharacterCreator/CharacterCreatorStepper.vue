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
          <!-- Character & Player Names Section -->
          <v-row class="mb-6" justify="center">
            <v-col cols="12" md="8" lg="6">
              <v-card variant="outlined" color="primary-lighten-5" class="pa-3">
                <v-card-title class="text-subtitle-1 text-center pb-2">
                  <v-icon class="me-2" color="primary" size="small">mdi-account-group</v-icon>
                  Character & Player Information
                </v-card-title>
                <v-divider class="mb-3" />

                <!-- Character Name -->
                <div class="mb-1">
                  <v-text-field v-model="character.name" label="Character Name" variant="outlined"
                    placeholder="e.g., Thorin Ironbeard, Luna Silverleaf..." prepend-inner-icon="mdi-account"
                    class="name-field" density="compact">
                    <template #append>
                      <v-btn icon variant="flat" color="primary" size="x-small" @click="generateRandomName"
                        :loading="isGeneratingName" class="name-randomizer-btn pa-1">
                        <v-icon size="xx-large">mdi-dice-6</v-icon>
                        <v-tooltip activator="parent" location="top">Generate random name</v-tooltip>
                      </v-btn>
                    </template>
                  </v-text-field>
                </div>

                <!-- Player Name -->
                <div class="mb-2">
                  <v-text-field v-model="character.userName" label="Your Name (Player Name)" variant="outlined"
                    placeholder="e.g., John Smith, Alex D..." prepend-inner-icon="mdi-account-circle"
                    hint="So we know whose character this is!" persistent-hint class="user-name-field"
                    density="compact" />
                </div>

                <!-- Info Alert -->
                <v-alert type="info" variant="tonal" density="compact" class="mt-2">
                  <span class="text-caption">
                    The character name is what others will see in-game, while your player name helps identify who
                    created this
                    character.
                  </span>
                </v-alert>
              </v-card>
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
                class="species-preview-card h-100"
                :class="{ 'no-subraces': !character.speciesDetails.lineages || character.speciesDetails.lineages.length === 0 }"
                :style="{ minHeight: speciesCardHeight }">
                <v-card-title class="d-flex align-center pa-3">
                  <v-icon color="blue-grey-darken-2" class="me-2" size="small">mdi-dna</v-icon>
                  <span class="text-subtitle-1 font-weight-bold">{{ character.speciesDetails.name }}</span>
                </v-card-title>
                <v-divider />
                <v-card-text class="pa-3" :style="{ maxHeight: speciesContentMaxHeight, overflowY: 'auto' }">
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
                        <v-col cols="6" sm="4">
                          <div class="text-center">
                            <div class="text-overline text-grey-darken-1">Size</div>
                            <div class="text-caption font-weight-bold">{{ character.speciesDetails.size }}</div>
                          </div>
                        </v-col>
                        <v-col cols="6" sm="4">
                          <div class="text-center">
                            <div class="text-overline text-grey-darken-1">Speed</div>
                            <div class="text-caption font-weight-bold">{{ character.speciesDetails.speed }} ft</div>
                          </div>
                        </v-col>
                        <v-col v-if="character.speciesDetails.darkvision" cols="6" sm="4">
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

                  <!-- Subraces/Lineages Preview -->
                  <div v-if="character.speciesDetails.lineages && character.speciesDetails.lineages.length > 0"
                    class="mt-3">
                    <h5 class="text-caption text-blue-grey-darken-2 mb-2 font-weight-bold">
                      <v-icon size="small" class="me-1">mdi-family-tree</v-icon>
                      Available Lineages/Subraces
                    </h5>
                    <v-tabs v-model="activeSubraceTab" color="primary" density="compact" class="mb-3 subrace-tabs" grow>
                      <v-tab v-for="(lineage, index) in character.speciesDetails.lineages" :key="lineage.id"
                        :value="index" size="small" class="text-caption">
                        {{ lineage.name }}
                      </v-tab>
                    </v-tabs>
                    <v-tabs-window v-model="activeSubraceTab">
                      <v-tabs-window-item v-for="(lineage, index) in character.speciesDetails.lineages"
                        :key="lineage.id" :value="index">
                        <v-card variant="outlined" color="grey-lighten-5" class="pa-3">
                          <div class="text-caption">
                            {{ getSubraceDescription(lineage.id, character.speciesDetails.name) }}
                          </div>
                        </v-card>
                      </v-tabs-window-item>
                    </v-tabs-window>
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
                        <span class="text-overline text-grey-darken-1">Available Skills (choose {{
                          character.classDetails.skillChoices ||
                          2
                        }}):</span>
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

                  <!-- Choices Available -->
                  <div v-if="hasBackgroundChoices(character.backgroundDetails)" class="mt-3">
                    <h5 class="text-caption text-green-darken-2 mb-1 font-weight-bold">
                      <v-icon size="small" class="me-1">mdi-hand-pointing-right</v-icon>
                      Choices Available
                    </h5>
                    <div class="ms-2">
                      <!-- Language Choices -->
                      <div
                        v-if="character.backgroundDetails.languageOptions && character.backgroundDetails.languageOptions.choose > 0"
                        class="mb-1">
                        <v-chip size="small" color="purple" variant="outlined" class="me-1">
                          {{ character.backgroundDetails.languageOptions.choose }} Language{{
                            character.backgroundDetails.languageOptions.choose > 1 ? 's' : '' }}
                        </v-chip>
                        <span class="text-caption">
                          {{ character.backgroundDetails.languageOptions.from &&
                            character.backgroundDetails.languageOptions.from[0] === 'Any'
                            ? 'from any standard language'
                            : character.backgroundDetails.languageOptions.from
                              ? `from: ${character.backgroundDetails.languageOptions.from.join(', ')}`
                              : '' }}
                        </span>
                      </div>

                      <!-- Tool Choices -->
                      <div v-if="hasToolChoices(character.backgroundDetails)" class="mb-1">
                        <v-chip size="small" color="orange" variant="outlined" class="me-1">
                          Tool Choice
                        </v-chip>
                        <span class="text-caption">{{ getToolChoiceDescription(character.backgroundDetails) }}</span>
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
        <v-row class="mb-1" align="start" justify="space-between" no-gutters>
          <!-- Quick Start Options -->
          <v-col cols="6" md="3" lg="3" xl="3" class="d-flex justify-start mb-3 mb-lg-0 pe-1 pe-lg-0" order="1"
            order-md="1" order-lg="1">
            <v-card variant="tonal" color="primary-lighten-5" class="compact-card w-100">
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

          <!-- Centered Title - appears below cards on mobile, in center on desktop -->
          <v-col cols="12" md="6" lg="6" xl="6" class="text-center mb-3 mb-lg-0 mt-4 mt-md-0" order="3" order-md="2"
            order-lg="2">
            <h2 class="text-h4 text-lg-h4 text-md-h5 text-h6 mb-2 mt-6">⚡ Set Your Abilities</h2>
            <p class="text-subtitle-1 text-grey">
              These numbers determine your character's basic capabilities
            </p>
          </v-col>

          <!-- Class Recommendations - moved to second position on mobile -->
          <v-col cols="6" md="3" lg="3" xl="3" class="d-flex justify-end mb-3 mb-lg-0 ps-1 ps-lg-0" order="2"
            order-md="3" order-lg="3">
            <v-card v-if="character.classDetails" variant="tonal" color="primary-lighten-5" class="compact-card w-100">
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
            <v-card v-else variant="outlined" color="grey-lighten-4" class="compact-card w-100">
              <v-card-text class="text-center text-grey pa-3">
                <v-icon size="small" class="mb-1">mdi-help-circle-outline</v-icon>
                <div class="text-caption">Select a class for tips</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-card-text>
          <!-- Score Assignment Section -->
          <v-row v-if="isAssigningScores" class="mb-6" justify="center">
            <v-col cols="12" md="10" lg="8" xl="6">
              <h3 class="text-h6 d-flex align-center justify-center mb-3">
                <v-icon class="me-2">mdi-target</v-icon>
                Assign Your Scores
              </h3>
              <v-card variant="tonal" color="secondary-lighten-5">
                <v-card-text class="text-center">
                  <div class="mb-3">
                    <div class="text-body-2 mb-3">Available Scores: Click to select, then click an ability card to
                      assign it</div>
                    <div class="d-flex justify-center">
                      <v-chip-group v-model="selectedScore" class="mb-3" mandatory>
                        <v-chip v-for="score in availableScores" :key="`available-${score}`" size="x-large"
                          color="primary" variant="outlined" class="score-chip ma-1 text-h6 font-weight-bold"
                          :value="score">
                          {{ score }}
                        </v-chip>
                      </v-chip-group>
                    </div>
                    <div v-if="availableScores.length === 0" class="text-success">
                      ✅ All scores assigned! Click on any ability score to reassign it.
                    </div>
                    <div v-else-if="selectedScore" class="text-info text-caption">
                      Selected: {{ selectedScore }} - Now click on an ability to assign it
                    </div>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Clear All Button positioned between available scores and ability cards - only show when at least one score is assigned -->
              <div v-if="hasAssignedScores" class="d-flex justify-center mt-4 mb-4">
                <v-btn variant="outlined" color="error" @click="clearAssignments" size="small"
                  prepend-icon="mdi-refresh">
                  Clear All Assignments
                </v-btn>
              </div>
            </v-col>
          </v-row> <!-- Ability Scores Grid -->
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
        <v-card-title class="text-h4 text-center mb-4">🎯 Features & Choices</v-card-title>
        <v-card-subtitle class="text-center mb-4">
          Make important decisions about your character's abilities and proficiencies
        </v-card-subtitle>
        <v-card-text>
          <!-- Character Choices Section -->
          <v-row class="mb-6">
            <!-- Subrace/Lineage Selection -->
            <v-col v-if="character.speciesDetails?.lineages && character.speciesDetails.lineages.length > 0" cols="12"
              md="6">
              <v-card variant="outlined" color="blue-lighten-5">
                <v-card-title class="text-h6">🧬 Choose Your Lineage</v-card-title>
                <v-card-text>
                  <v-select v-model="character.speciesLineage" :items="character.speciesDetails.lineages"
                    item-title="name" item-value="id" label="Lineage/Subrace" variant="outlined"
                    :hint="`Choose your ${character.speciesDetails.name} lineage`" persistent-hint
                    @update:model-value="handleSubraceSelection" />
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Language Selection -->
            <v-col v-if="shouldShowLanguageSelection" cols="12" md="6">
              <v-card variant="outlined" color="purple-lighten-5">
                <v-card-title class="text-h6">🗣️ Choose Languages</v-card-title>
                <v-card-text>
                  <!-- Show known languages -->
                  <div class="mb-3">
                    <div class="text-subtitle-2 mb-2">Languages You Already Know:</div>
                    <v-chip-group>
                      <v-chip v-for="lang in getKnownLanguages" :key="lang" size="small" color="green"
                        variant="outlined">
                        {{ lang }}
                      </v-chip>
                    </v-chip-group>
                  </div>

                  <v-divider class="my-3" />

                  <!-- Language selections -->
                  <div v-if="getLanguageChoices().length > 0">
                    <div class="text-subtitle-2 mb-2">Choose Additional Languages:</div>
                    <v-select v-for="(choice, index) in getLanguageChoices()" :key="`language-${index}`"
                      v-model="character.additionalLanguages[index]" :items="getAvailableLanguages"
                      :label="`Language Choice ${index + 1}`" variant="outlined" class="mb-2"
                      hint="Choose an additional language" persistent-hint
                      @update:model-value="(value) => handleLanguageSelection([...character.additionalLanguages.slice(0, index), value, ...character.additionalLanguages.slice(index + 1)])" />
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Tool Selection -->
            <v-col v-if="shouldShowToolSelection" cols="12" md="6">
              <v-card variant="outlined" color="orange-lighten-5">
                <v-card-title class="text-h6">🔧 Choose Tools</v-card-title>
                <v-card-text>
                  <div v-if="getToolChoices().length > 0">
                    <v-select v-for="(choice, index) in getToolChoices()" :key="`tool-${index}`"
                      v-model="character.selectedTools[index]" :items="choice.options" :label="choice.label"
                      variant="outlined" class="mb-2" :hint="choice.hint" persistent-hint
                      @update:model-value="(value) => handleToolSelection([...character.selectedTools.slice(0, index), value, ...character.selectedTools.slice(index + 1)])" />
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

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
              <v-card variant="outlined" color="success" class="h-100">
                <v-card-title class="text-center pa-3">🛡️ Armor Training</v-card-title>
                <v-divider />
                <v-card-text class="pa-3">
                  <div
                    v-if="character.armorTraining?.light || character.armorTraining?.medium || character.armorTraining?.heavy || character.armorTraining?.shields"
                    class="d-flex flex-wrap justify-center" style="gap: 8px;">
                    <v-chip v-if="character.armorTraining?.light" size="small" color="green" variant="elevated"
                      class="ma-1">
                      <v-icon start size="x-small">mdi-shield-outline</v-icon>
                      Light Armor
                    </v-chip>
                    <v-chip v-if="character.armorTraining?.medium" size="small" color="orange" variant="elevated"
                      class="ma-1">
                      <v-icon start size="x-small">mdi-shield</v-icon>
                      Medium Armor
                    </v-chip>
                    <v-chip v-if="character.armorTraining?.heavy" size="small" color="red" variant="elevated"
                      class="ma-1">
                      <v-icon start size="x-small">mdi-shield-plus</v-icon>
                      Heavy Armor
                    </v-chip>
                    <v-chip v-if="character.armorTraining?.shields" size="small" color="blue" variant="elevated"
                      class="ma-1">
                      <v-icon start size="x-small">mdi-shield-check</v-icon>
                      Shields
                    </v-chip>
                  </div>
                  <div v-else class="text-center text-grey py-4">
                    <v-icon size="large" class="mb-2 text-grey-lighten-1">mdi-shield-off</v-icon>
                    <div class="text-caption">No armor training</div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Class Skill Selection -->
          <v-card v-if="getAvailableClassSkills.length > 0" variant="outlined" class="mb-6" color="blue-lighten-5">
            <v-card-title class="text-h6">🎯 Choose Class Skills</v-card-title>
            <v-card-subtitle class="text-caption">
              Select {{ character.classDetails?.skillChoices || 2 }} skills from your {{ character.classDetails?.name ||
                'class'
              }} skill list
            </v-card-subtitle>
            <v-card-text>
              <div class="mb-3">
                <div class="text-body-2 font-weight-medium mb-2">
                  Selected: {{ getSelectedClassSkills.length }} / {{ character.classDetails?.skillChoices || 2 }}
                </div>
                <v-progress-linear
                  :model-value="(getSelectedClassSkills.length / (character.classDetails?.skillChoices || 2)) * 100"
                  color="primary" height="6" rounded />
              </div>

              <v-row>
                <v-col v-for="skill in getAvailableClassSkills" :key="skill.name" cols="12" sm="6" md="4">
                  <v-card variant="outlined" class="skill-selection-card" :class="{
                    'selected': isSkillSelected(skill.name),
                    'selectable': canSelectMoreSkills || isSkillSelected(skill.name)
                  }" @click="handleSkillCardClick(skill.name)"
                    :style="{ cursor: (canSelectMoreSkills || isSkillSelected(skill.name)) ? 'pointer' : 'not-allowed' }">
                    <v-card-text class="py-2">
                      <div class="d-flex align-center">
                        <v-checkbox :model-value="isSkillSelected(skill.name)"
                          :disabled="!canSelectMoreSkills && !isSkillSelected(skill.name)" readonly density="compact"
                          hide-details class="me-2" />
                        <div class="flex-grow-1">
                          <div class="font-weight-bold">{{ skill.name }}</div>
                          <div class="text-caption text-grey">{{ skill.ability }} based</div>
                          <div class="text-caption">{{ skill.exampleUse.substring(0, 60) }}{{ skill.exampleUse.length >
                            60 ? '...'
                            : '' }}</div>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Skills Section -->
          <v-card variant="outlined" class="mb-6">
            <v-card-title class="text-h6">📋 All Skill Proficiencies</v-card-title>
            <v-card-subtitle class="text-caption">Skills you are proficient with (from class selection and
              background)</v-card-subtitle>
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
          <v-card variant="outlined" class="mb-6">
            <v-card-title class="text-h6">🔧 Tool Proficiencies</v-card-title>
            <v-card-subtitle class="text-caption">Tools you are proficient with (from class, background, and
              choices)</v-card-subtitle>
            <v-card-text>
              <div v-if="getAllToolProficiencies.length > 0">
                <div class="d-flex flex-wrap" style="gap: 8px;">
                  <v-chip v-for="tool in getAllToolProficiencies" :key="tool" size="small" color="orange"
                    variant="elevated">
                    {{ tool }}
                  </v-chip>
                </div>
              </div>
              <div v-else class="text-center text-grey py-4">
                <v-icon size="48" class="mb-2">mdi-hammer-wrench</v-icon>
                <br>No tool proficiencies yet
                <br><small>Select a class and background to gain tool proficiencies!</small>
              </div>
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
                  <v-expansion-panel v-for="trait in character.speciesDetails.traits" :key="trait.name">
                    <v-expansion-panel-title>
                      <div class="d-flex align-center">
                        <v-icon class="me-2" size="small" color="blue-darken-2">mdi-star</v-icon>
                        <span class="font-weight-bold">{{ trait.name }}</span>
                        <v-spacer />
                        <v-chip v-if="trait.usage" size="x-small" color="blue" variant="outlined">
                          {{ trait.usage }}
                        </v-chip>
                      </div>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <div v-if="trait.description || getTraitDescription(trait.name)" class="trait-description">
                        <p class="text-body-2 mb-3">{{ trait.description || getTraitDescription(trait.name) }}</p>
                      </div>
                      <div v-else class="text-caption text-grey">
                        No description available for this trait.
                      </div>

                      <!-- Additional trait details if available -->
                      <div v-if="trait.damage || trait.range || trait.savingThrow" class="trait-details mt-3">
                        <v-divider class="mb-2" />
                        <div class="text-caption">
                          <div v-if="trait.damage" class="mb-1">
                            <strong>Damage:</strong> {{ trait.damage }}
                          </div>
                          <div v-if="trait.range" class="mb-1">
                            <strong>Range:</strong> {{ trait.range }}
                          </div>
                          <div v-if="trait.savingThrow" class="mb-1">
                            <strong>Saving Throw:</strong> {{ trait.savingThrow }}
                          </div>
                        </div>
                      </div>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </div>

              <!-- Background Feature -->
              <div v-if="character.backgroundDetails?.feature">
                <h6 class="text-h6 mb-2">Background Feature:</h6>
                <v-expansion-panels variant="accordion">
                  <v-expansion-panel>
                    <v-expansion-panel-title>
                      <div class="d-flex align-center">
                        <v-icon class="me-2" size="small" color="green-darken-2">mdi-book-open-page-variant</v-icon>
                        <span class="font-weight-bold">{{ character.backgroundDetails.feature.name }}</span>
                      </div>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <div v-if="character.backgroundDetails.feature.description" class="feature-description">
                        <p class="text-body-2">{{ character.backgroundDetails.feature.description }}</p>
                      </div>
                      <div v-else class="text-caption text-grey">
                        No description available for this feature.
                      </div>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </div>
            </v-card-text>
          </v-card>
        </v-card-text>
      </v-card>
    </template>

    <!-- Step 4: Equipment & Wealth -->
    <template #item.4>
      <v-card flat>
        <v-card-title class="text-h4 text-center mb-4">⚔️ Equipment & Gear</v-card-title>
        <v-card-subtitle class="text-center mb-6">
          Equip your character for adventure and combat readiness
        </v-card-subtitle>
        <v-card-text>
          <!-- Combat Readiness Overview -->
          <v-card variant="tonal" color="primary-lighten-5" class="mb-6 combat-readiness-card">
            <v-card-title class="text-h6 d-flex align-center pa-3">
              <v-icon class="me-2" color="primary" size="large">mdi-shield-sword</v-icon>
              Combat Readiness Overview
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-3">
              <v-row>
                <v-col cols="6" md="3">
                  <div class="text-center combat-stat-item">
                    <div class="combat-stat-value text-primary">{{ getCalculatedAC() }}</div>
                    <div class="combat-stat-label">Armor Class</div>
                    <div class="combat-stat-detail">{{ getACBreakdown() }}</div>
                  </div>
                </v-col>
                <v-col cols="6" md="3">
                  <div class="text-center combat-stat-item">
                    <div class="combat-stat-value text-error">{{ getCalculatedHP() }}</div>
                    <div class="combat-stat-label">Hit Points</div>
                    <div class="combat-stat-detail">{{ character.level }}d{{ character.classDetails?.hitDie || 8 }} +
                      CON</div>
                  </div>
                </v-col>
                <v-col cols="6" md="3">
                  <div class="text-center combat-stat-item">
                    <div class="combat-stat-value text-success">{{ getPrimaryWeaponAttack() }}</div>
                    <div class="combat-stat-label">Attack Bonus</div>
                    <div class="combat-stat-detail">{{ getPrimaryWeaponName() || 'Unarmed Strike' }}</div>
                  </div>
                </v-col>
                <v-col cols="6" md="3">
                  <div class="text-center combat-stat-item">
                    <div class="combat-stat-value text-warning">{{ getPrimaryWeaponDamage() }}</div>
                    <div class="combat-stat-label">Damage</div>
                    <div class="combat-stat-detail">{{ getPrimaryWeaponDamageType() || 'Bludgeoning' }}</div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Starting Equipment Section -->
          <v-card variant="outlined" class="mb-6 starting-equipment-card">
            <v-card-title class="text-h6 d-flex align-center justify-space-between pa-3">
              <div class="d-flex align-center">
                <v-icon class="me-2" color="green" size="large">mdi-auto-fix</v-icon>
                <div>
                  <div class="text-h6">Starting Equipment</div>
                  <div class="text-caption text-grey">Your character begins with class and background equipment</div>
                </div>
              </div>
              <v-btn v-if="!hasStartingEquipment" variant="elevated" color="green" @click="generateStartingEquipment"
                class="equipment-action-btn">
                <v-icon start>mdi-wand-magic</v-icon>
                Generate Starting Gear
              </v-btn>
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-3">
              <div v-if="hasStartingEquipment">
                <v-alert type="success" variant="tonal" class="mb-3" density="compact">
                  <v-alert-title class="d-flex align-center">
                    <v-icon class="me-2">mdi-check-circle</v-icon>
                    Starting Equipment Ready!
                  </v-alert-title>
                  Your {{ character.classDetails?.name }} has been equipped with standard class gear, plus equipment
                  from your {{ character.backgroundDetails?.name }} background.
                </v-alert>
                <div class="d-flex gap-2 flex-wrap">
                  <v-btn variant="outlined" color="warning" @click="clearStartingEquipment" prepend-icon="mdi-refresh"
                    size="small">
                    Reset Equipment
                  </v-btn>
                  <v-btn variant="outlined" color="info" disabled size="small">
                    <v-icon start>mdi-information</v-icon>
                    Equipment is Fixed at Character Creation
                  </v-btn>
                </div>
              </div>
              <div v-else class="text-center py-4">
                <v-icon size="48" class="mb-3 text-grey-lighten-1">mdi-package-variant-closed</v-icon>
                <div class="text-h6 mb-2">No Starting Equipment Generated</div>
                <div class="text-body-2 text-grey mb-3">
                  In D&D, your {{ character.classDetails?.name || 'class' }} starts with specific weapons, armor, and
                  gear based on their training and {{ character.backgroundDetails?.name || 'background' }} experience.
                </div>
                <v-alert type="info" variant="tonal" density="compact">
                  <v-alert-title>How Starting Equipment Works</v-alert-title>
                  <ul class="text-left mt-2 text-caption">
                    <li>Each class gets specific weapons, armor, and tools they're trained with</li>
                    <li>Your background provides additional gear and equipment packs</li>
                    <li>Starting gold is determined by your background and class</li>
                    <li>You cannot freely add equipment during character creation</li>
                  </ul>
                </v-alert>
              </div>
            </v-card-text>
          </v-card>

          <!-- Equipment Management Section -->
          <div class="mb-6">
            <div class="text-h6 mb-4 d-flex align-center">
              <v-icon class="me-2" color="primary">mdi-sword-cross</v-icon>
              Equipment Management
            </div>

            <!-- Weapons & Armor Row -->
            <v-row class="mb-4">
              <!-- Weapons -->
              <v-col cols="12" lg="6">
                <v-card variant="outlined" color="red-lighten-5" class="equipment-category-card">
                  <v-card-title class="equipment-category-header-compact">
                    <div class="d-flex align-center justify-space-between w-100">
                      <div class="d-flex align-center">
                        <v-icon class="me-2" color="red" size="default">mdi-sword</v-icon>
                        <div>
                          <div class="text-subtitle-1 font-weight-bold">Starting Weapons</div>
                          <div class="text-caption">{{ getEquipmentByCategory('weapon').length }} from class &
                            background</div>
                        </div>
                      </div>
                      <v-chip v-if="getEquipmentByCategory('weapon').length > 0" size="small" color="green"
                        variant="elevated">
                        <v-icon start size="x-small">mdi-check</v-icon>
                        Equipped
                      </v-chip>
                    </div>
                  </v-card-title>
                  <v-divider />
                  <v-card-text class="pa-0">
                    <div v-if="getEquipmentByCategory('weapon').length > 0" class="equipment-list">
                      <v-list density="compact" class="bg-transparent">
                        <v-list-item v-for="(weapon, index) in getEquipmentByCategory('weapon')"
                          :key="`weapon-${index}`" class="equipment-item-enhanced">
                          <template #prepend>
                            <v-checkbox v-model="weapon.equipped" density="compact" hide-details
                              @change="updateEquipmentStats" color="red" class="me-3" />
                          </template>

                          <div class="equipment-item-content">
                            <div class="equipment-item-title">
                              <span class="text-body-1 font-weight-bold text-white">{{ weapon.name }}</span>
                              <v-chip v-if="weapon.equipped" size="x-small" color="green" variant="elevated"
                                class="ms-2">
                                <v-icon start size="x-small">mdi-check</v-icon>
                                Equipped
                              </v-chip>
                            </div>

                            <div class="equipment-item-details mt-2">
                              <div class="d-flex flex-wrap gap-2">
                                <v-chip size="small" color="red" variant="outlined" v-if="weapon.damage"
                                  class="equipment-detail-chip">
                                  <v-icon start size="x-small">mdi-sword</v-icon>
                                  {{ weapon.damage }} {{ weapon.damageType }}
                                </v-chip>
                                <v-chip size="small" color="blue" variant="outlined"
                                  v-if="weapon.properties && weapon.properties.length" class="equipment-detail-chip">
                                  <v-icon start size="x-small">mdi-information</v-icon>
                                  {{ weapon.properties.join(', ') }}
                                </v-chip>
                                <v-chip size="small" color="green" variant="outlined" v-if="weapon.attackBonus"
                                  class="equipment-detail-chip">
                                  <v-icon start size="x-small">mdi-target</v-icon>
                                  +{{ weapon.attackBonus }} to hit
                                </v-chip>
                              </div>
                            </div>
                          </div>

                          <template #append>
                            <v-btn variant="text" size="small" color="error" @click="removeEquipment('weapon', index)"
                              class="equipment-delete-btn ms-2">
                              <v-icon size="small">mdi-delete</v-icon>
                            </v-btn>
                          </template>
                        </v-list-item>
                      </v-list>
                    </div>
                    <div v-else class="equipment-empty-state-compact">
                      <v-icon size="32" class="mb-2 text-grey-lighten-2">mdi-sword-cross</v-icon>
                      <div class="text-caption text-grey">No starting weapons</div>
                      <div class="text-caption text-grey">Generate starting equipment to get class weapons</div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- Armor -->
              <v-col cols="12" lg="6">
                <v-card variant="outlined" color="blue-lighten-5" class="equipment-category-card">
                  <v-card-title class="equipment-category-header-compact">
                    <div class="d-flex align-center justify-space-between w-100">
                      <div class="d-flex align-center">
                        <v-icon class="me-2" color="blue" size="default">mdi-shield</v-icon>
                        <div>
                          <div class="text-subtitle-1 font-weight-bold">Starting Armor</div>
                          <div class="text-caption">{{ getEquipmentByCategory('armor').length }} from class & background
                          </div>
                        </div>
                      </div>
                      <v-chip v-if="getEquipmentByCategory('armor').length > 0" size="small" color="green"
                        variant="elevated">
                        <v-icon start size="x-small">mdi-check</v-icon>
                        Equipped
                      </v-chip>
                    </div>
                  </v-card-title>
                  <v-divider />
                  <v-card-text class="pa-0">
                    <div v-if="getEquipmentByCategory('armor').length > 0" class="equipment-list">
                      <v-list density="compact" class="bg-transparent">
                        <v-list-item v-for="(armor, index) in getEquipmentByCategory('armor')" :key="`armor-${index}`"
                          class="equipment-item-enhanced">
                          <template #prepend>
                            <v-checkbox v-model="armor.equipped" density="compact" hide-details
                              @change="updateEquipmentStats" color="blue" class="me-3" />
                          </template>

                          <div class="equipment-item-content">
                            <div class="equipment-item-title">
                              <span class="text-body-1 font-weight-bold text-white">{{ armor.name }}</span>
                              <v-chip v-if="armor.equipped" size="x-small" color="green" variant="elevated"
                                class="ms-2">
                                <v-icon start size="x-small">mdi-check</v-icon>
                                Equipped
                              </v-chip>
                            </div>

                            <div class="equipment-item-details mt-2">
                              <div class="d-flex flex-wrap gap-2">
                                <v-chip size="small" color="blue" variant="outlined" v-if="armor.armorClass"
                                  class="equipment-detail-chip">
                                  <v-icon start size="x-small">mdi-shield</v-icon>
                                  AC {{ armor.armorClass }}{{ armor.dexBonus ? ' + Dex' : '' }}
                                </v-chip>
                                <v-chip size="small" color="orange" variant="outlined" v-if="armor.armorType"
                                  class="equipment-detail-chip">
                                  <v-icon start size="x-small">mdi-armor</v-icon>
                                  {{ armor.armorType }}
                                </v-chip>
                                <v-chip size="small" color="grey" variant="outlined" v-if="armor.weight"
                                  class="equipment-detail-chip">
                                  <v-icon start size="x-small">mdi-weight</v-icon>
                                  {{ armor.weight }} lbs
                                </v-chip>
                              </div>
                            </div>
                          </div>

                          <template #append>
                            <v-btn variant="text" size="small" color="error" @click="removeEquipment('armor', index)"
                              class="equipment-delete-btn ms-2">
                              <v-icon size="small">mdi-delete</v-icon>
                            </v-btn>
                          </template>
                        </v-list-item>
                      </v-list>
                    </div>
                    <div v-else class="equipment-empty-state-compact">
                      <v-icon size="32" class="mb-2 text-grey-lighten-2">mdi-shield-off</v-icon>
                      <div class="text-caption text-grey">No starting armor</div>
                      <div class="text-caption text-grey">Generate starting equipment to get class armor</div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Other Equipment Categories -->
            <v-row class="mb-4">
              <!-- Tools -->
              <v-col cols="12" md="4">
                <v-card variant="outlined" color="orange-lighten-5" class="equipment-category-card h-100">
                  <v-card-title class="equipment-category-header-compact">
                    <div class="d-flex align-center justify-space-between w-100">
                      <div class="d-flex align-center">
                        <v-icon class="me-2" color="orange">mdi-tools</v-icon>
                        <div>
                          <div class="text-subtitle-1 font-weight-bold">Starting Tools</div>
                          <div class="text-caption">{{ getEquipmentByCategory('tool').length }} from background</div>
                        </div>
                      </div>
                    </div>
                  </v-card-title>
                  <v-divider />
                  <v-card-text class="pa-3">
                    <div v-if="getEquipmentByCategory('tool').length > 0">
                      <div class="d-flex flex-wrap gap-2">
                        <v-chip v-for="(tool, index) in getEquipmentByCategory('tool')" :key="`tool-${index}`"
                          size="default" color="orange" variant="outlined" closable
                          @click:close="removeEquipment('tool', index)" class="equipment-chip-enhanced">
                          <v-icon start size="small">mdi-tools</v-icon>
                          <span class="font-weight-medium">{{ tool.name }}</span>
                        </v-chip>
                      </div>
                    </div>
                    <div v-else class="equipment-empty-state-compact">
                      <v-icon size="32" class="mb-2 text-grey-lighten-2">mdi-hammer-wrench</v-icon>
                      <div class="text-caption text-grey">No starting tools</div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- Adventuring Gear -->
              <v-col cols="12" md="4">
                <v-card variant="outlined" color="green-lighten-5" class="equipment-category-card h-100">
                  <v-card-title class="equipment-category-header-compact">
                    <div class="d-flex align-center justify-space-between w-100">
                      <div class="d-flex align-center">
                        <v-icon class="me-2" color="green">mdi-bag-personal</v-icon>
                        <div>
                          <div class="text-subtitle-1 font-weight-bold">Starting Gear</div>
                          <div class="text-caption">{{ getEquipmentByCategory('gear').length }} from class & background
                          </div>
                        </div>
                      </div>
                    </div>
                  </v-card-title>
                  <v-divider />
                  <v-card-text class="pa-3">
                    <div v-if="getEquipmentByCategory('gear').length > 0">
                      <div class="d-flex flex-wrap gap-2">
                        <v-chip v-for="(item, index) in getEquipmentByCategory('gear')" :key="`gear-${index}`"
                          size="default" color="green" variant="outlined" closable
                          @click:close="removeEquipment('gear', index)" class="equipment-chip-enhanced">
                          <v-icon start size="small">mdi-bag-personal</v-icon>
                          <span class="font-weight-medium">{{ item.name }}{{ item.quantity > 1 ? ` (${item.quantity})` :
                            ''
                            }}</span>
                        </v-chip>
                      </div>
                    </div>
                    <div v-else class="equipment-empty-state-compact">
                      <v-icon size="32" class="mb-2 text-grey-lighten-2">mdi-bag-personal-outline</v-icon>
                      <div class="text-caption text-grey">No starting gear</div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- Consumables -->
              <v-col cols="12" md="4">
                <v-card variant="outlined" color="purple-lighten-5" class="equipment-category-card h-100">
                  <v-card-title class="equipment-category-header-compact">
                    <div class="d-flex align-center justify-space-between w-100">
                      <div class="d-flex align-center">
                        <v-icon class="me-2" color="purple">mdi-bottle-tonic</v-icon>
                        <div>
                          <div class="text-subtitle-1 font-weight-bold">Starting Supplies</div>
                          <div class="text-caption">{{ getEquipmentByCategory('consumable').length }} basic supplies
                          </div>
                        </div>
                      </div>
                    </div>
                  </v-card-title>
                  <v-divider />
                  <v-card-text class="pa-3">
                    <div v-if="getEquipmentByCategory('consumable').length > 0">
                      <div class="d-flex flex-wrap gap-2">
                        <v-chip v-for="(item, index) in getEquipmentByCategory('consumable')"
                          :key="`consumable-${index}`" size="default" color="purple" variant="outlined" closable
                          @click:close="removeEquipment('consumable', index)" class="equipment-chip-enhanced">
                          <v-icon start size="small">mdi-bottle-tonic</v-icon>
                          <span class="font-weight-medium">{{ item.name }}{{ item.quantity > 1 ? ` (${item.quantity})` :
                            ''
                            }}</span>
                        </v-chip>
                      </div>
                    </div>
                    <div v-else class="equipment-empty-state-compact">
                      <v-icon size="32" class="mb-2 text-grey-lighten-2">mdi-bottle-tonic-outline</v-icon>
                      <div class="text-caption text-grey">No starting supplies</div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </div>

          <!-- Wealth & Carrying Capacity -->
          <div class="mb-4">
            <div class="text-h6 mb-3 d-flex align-center">
              <v-icon class="me-2" color="primary">mdi-wallet</v-icon>
              Wealth & Encumbrance
            </div>

            <v-row>
              <v-col cols="12" md="6">
                <v-card variant="outlined" class="wealth-card">
                  <v-card-title class="d-flex align-center pa-3">
                    <v-icon class="me-2" color="yellow-darken-2" size="default">mdi-coins</v-icon>
                    <div>
                      <div class="text-subtitle-1 font-weight-bold">Coin Purse</div>
                      <div class="text-caption text-grey">Manage your character's wealth</div>
                    </div>
                  </v-card-title>
                  <v-divider />
                  <v-card-text class="pa-3">
                    <v-row>
                      <v-col cols="6">
                        <v-text-field v-model.number="character.coins.cp" label="Copper (CP)" type="number" min="0"
                          variant="outlined" density="compact" prepend-inner-icon="mdi-circle" color="brown" />
                      </v-col>
                      <v-col cols="6">
                        <v-text-field v-model.number="character.coins.sp" label="Silver (SP)" type="number" min="0"
                          variant="outlined" density="compact" prepend-inner-icon="mdi-circle" color="grey" />
                      </v-col>
                      <v-col cols="6">
                        <v-text-field v-model.number="character.coins.gp" label="Gold (GP)" type="number" min="0"
                          variant="outlined" density="compact" prepend-inner-icon="mdi-circle"
                          color="yellow-darken-2" />
                      </v-col>
                      <v-col cols="6">
                        <v-text-field v-model.number="character.coins.pp" label="Platinum (PP)" type="number" min="0"
                          variant="outlined" density="compact" prepend-inner-icon="mdi-circle" color="blue-grey" />
                      </v-col>
                    </v-row>
                    <v-alert type="info" variant="tonal" class="mt-2" density="compact">
                      <div class="d-flex align-center">
                        <v-icon class="me-2">mdi-calculator</v-icon>
                        <strong>Total Value: {{ formatCoins(totalGP) }} GP</strong>
                      </div>
                    </v-alert>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="6">
                <v-card variant="outlined" class="encumbrance-card">
                  <v-card-title class="d-flex align-center pa-3">
                    <v-icon class="me-2" color="blue-grey" size="default">mdi-weight-lifter</v-icon>
                    <div>
                      <div class="text-subtitle-1 font-weight-bold">Carrying Capacity</div>
                      <div class="text-caption text-grey">Track your equipment weight</div>
                    </div>
                  </v-card-title>
                  <v-divider />
                  <v-card-text class="pa-3">
                    <div class="mb-3">
                      <div class="d-flex justify-space-between align-center mb-2">
                        <span class="text-body-2 font-weight-medium">Current Load</span>
                        <span class="text-body-2 font-weight-bold">{{ totalWeight }} / {{ carryingCapacity }} lbs</span>
                      </div>
                      <v-progress-linear :model-value="(totalWeight / carryingCapacity) * 100"
                        :color="getEncumbranceColor(totalWeight, carryingCapacity)" height="8" rounded class="mb-2">
                      </v-progress-linear>
                      <div class="text-center">
                        <v-chip v-if="totalWeight <= carryingCapacity" size="small" color="green" variant="elevated">
                          <v-icon start size="x-small">mdi-check-circle</v-icon>
                          Normal Load
                        </v-chip>
                        <v-chip v-else size="small" color="red" variant="elevated">
                          <v-icon start size="x-small">mdi-alert-circle</v-icon>
                          Overloaded
                        </v-chip>
                      </div>
                    </div>
                    <v-divider class="my-2" />
                    <div class="text-caption text-grey text-center">
                      <div class="mb-1"><strong>Push/Drag/Lift:</strong> {{ carryingCapacity * 2 }} lbs maximum</div>
                      <div v-if="totalWeight > carryingCapacity" class="text-warning">
                        Speed reduced by 10 feet when overloaded
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </div>
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
              <strong>Player:</strong> {{ character.userName || 'Unknown Player' }}
              <br>Level {{ character.level }} {{ character.speciesDetails?.name || 'Unknown Species' }} {{
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

            <!-- Character Choices Dropdown -->
            <v-expansion-panels variant="accordion" class="mt-4">
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <div class="d-flex align-center">
                    <v-icon class="me-2" color="purple">mdi-format-list-checks</v-icon>
                    <span class="font-weight-bold">Character Choices & Features</span>
                    <v-spacer />
                    <v-badge v-if="getSelectedChoicesCount() > 0" :content="getSelectedChoicesCount()" color="purple"
                      inline />
                  </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-row>
                    <!-- Lineage/Subrace -->
                    <v-col v-if="character.speciesLineage && character.speciesDetails?.lineages" cols="12" md="6">
                      <v-card variant="tonal" color="blue-lighten-5" class="mb-3">
                        <v-card-title class="text-subtitle-1 d-flex align-center pa-3">
                          <v-icon class="me-2" color="blue" size="small">mdi-dna</v-icon>
                          Lineage/Subrace
                        </v-card-title>
                        <v-card-text class="pt-0">
                          <v-chip color="blue" variant="elevated" size="small">
                            {{character.speciesDetails.lineages.find(l => l.id === character.speciesLineage)?.name ||
                              character.speciesLineage}}
                          </v-chip>
                        </v-card-text>
                      </v-card>
                    </v-col>

                    <!-- Languages -->
                    <v-col v-if="getAllLanguages().length > 0" cols="12" md="6">
                      <v-card variant="tonal" color="purple-lighten-5" class="mb-3">
                        <v-card-title class="text-subtitle-1 d-flex align-center pa-3">
                          <v-icon class="me-2" color="purple" size="small">mdi-translate</v-icon>
                          Languages ({{ getAllLanguages().length }})
                        </v-card-title>
                        <v-card-text class="pt-0">
                          <div class="d-flex flex-wrap gap-1">
                            <v-chip v-for="lang in getAllLanguages()" :key="lang" color="purple" variant="elevated"
                              size="small">
                              {{ lang }}
                            </v-chip>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-col>

                    <!-- Tools -->
                    <v-col v-if="getAllToolProficiencies.length > 0" cols="12" md="6">
                      <v-card variant="tonal" color="orange-lighten-5" class="mb-3">
                        <v-card-title class="text-subtitle-1 d-flex align-center pa-3">
                          <v-icon class="me-2" color="orange" size="small">mdi-tools</v-icon>
                          Tool Proficiencies ({{ getAllToolProficiencies.length }})
                        </v-card-title>
                        <v-card-text class="pt-0">
                          <div class="d-flex flex-wrap gap-1">
                            <v-chip v-for="tool in getAllToolProficiencies" :key="tool" color="orange"
                              variant="elevated" size="small">
                              {{ tool }}
                            </v-chip>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-col>

                    <!-- Skills -->
                    <v-col v-if="getProficientSkills.length > 0" cols="12" md="6">
                      <v-card variant="tonal" color="green-lighten-5" class="mb-3">
                        <v-card-title class="text-subtitle-1 d-flex align-center pa-3">
                          <v-icon class="me-2" color="green" size="small">mdi-brain</v-icon>
                          Skill Proficiencies ({{ getProficientSkills.length }})
                        </v-card-title>
                        <v-card-text class="pt-0">
                          <div class="d-flex flex-wrap gap-1">
                            <v-chip v-for="skill in getProficientSkills" :key="skill.name" color="green"
                              variant="elevated" size="small">
                              {{ skill.name }}
                            </v-chip>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-col>

                    <!-- Special Features Count -->
                    <v-col v-if="getSpecialFeaturesCount() > 0" cols="12" md="6">
                      <v-card variant="tonal" color="amber-lighten-5" class="mb-3">
                        <v-card-title class="text-subtitle-1 d-flex align-center pa-3">
                          <v-icon class="me-2" color="amber-darken-2" size="small">mdi-star</v-icon>
                          Special Features ({{ getSpecialFeaturesCount() }})
                        </v-card-title>
                        <v-card-text class="pt-0">
                          <div class="text-caption text-grey-darken-1">
                            Species traits, background features, and other special abilities
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>

                  <!-- Empty State -->
                  <div v-if="getSelectedChoicesCount() === 0" class="text-center text-grey py-4">
                    <v-icon size="48" class="mb-2">mdi-help-circle-outline</v-icon>
                    <div class="text-body-2">No character choices made yet</div>
                    <div class="text-caption">Complete Step 3 to see your character's features and choices here</div>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
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
                :disabled="!character.name || !character.userName || !character.species || !character.class || !character.background">
                {{ isEditing ? 'Update Character' : 'Save Character to Collection' }}
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
import { inject, computed, ref, watch, nextTick } from 'vue'

const props = defineProps({
  character: {
    type: Object,
    required: true
  },
  currentStep: {
    type: Number,
    required: true
  },
  isEditing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:current-step', 'submit-character', 'update:character'])

// Inject character data from parent
const characterData = inject('characterData')

// Reactive state for name generation
const isGeneratingName = ref(false)

// Active subrace tab tracking
const activeSubraceTab = ref(0)

// Ability score assignment system
const availableScores = ref([])
const isAssigningScores = ref(false)
const selectedScore = ref(null)
const isGeneratingScores = ref(false) // Flag to prevent interference during score generation

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

// Computed property for dynamic card height based on content
const speciesCardHeight = computed(() => {
  if (!props.character.speciesDetails) {
    return 'auto'
  }

  // Check if species has subraces/lineages
  const hasSubraces = props.character.speciesDetails.lineages &&
    props.character.speciesDetails.lineages.length > 0

  // Return different heights based on content - more precise heights
  return hasSubraces ? '400px' : '240px'
})

// Computed property for dynamic content max-height
const speciesContentMaxHeight = computed(() => {
  if (!props.character.speciesDetails) {
    return 'auto'
  }

  // Check if species has subraces/lineages
  const hasSubraces = props.character.speciesDetails.lineages &&
    props.character.speciesDetails.lineages.length > 0

  // Return different max-heights based on content - more precise heights
  return hasSubraces ? '350px' : '190px'
})

// Watch for species changes to reset subrace tab
watch(() => props.character.species, () => {
  activeSubraceTab.value = 0
})

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
  // Prevent multiple simultaneous generations
  if (isGeneratingScores.value) return

  // Set generation flag to prevent interference
  isGeneratingScores.value = true

  // Disable assignment mode completely
  isAssigningScores.value = false
  selectedScore.value = null

  // Clear the available scores array completely
  availableScores.value = []

  // Clear any existing assigned scores without triggering modifiers yet
  const abilityNames = characterData?.abilityNames?.value || ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']
  abilityNames.forEach((ability) => {
    if (props.character.abilityScores[ability]) {
      props.character.abilityScores[ability].score = 0
    }
  })

  // Use setTimeout to ensure all reactive updates are complete before setting new scores
  setTimeout(() => {
    // Now update all modifiers at once
    abilityNames.forEach((ability) => {
      characterData?.updateAbilityModifier?.(ability)
    })

    // Set the standard array (completely fresh array)
    availableScores.value = [15, 14, 13, 12, 10, 8]
    isAssigningScores.value = true

    // Clear generation flag
    isGeneratingScores.value = false
  }, 10)
}

const rollAbilityScores = () => {
  // Prevent multiple simultaneous generations
  if (isGeneratingScores.value) return

  // Set generation flag to prevent interference
  isGeneratingScores.value = true

  // Disable assignment mode completely
  isAssigningScores.value = false
  selectedScore.value = null

  // Clear the available scores array completely
  availableScores.value = []

  // Clear any existing assigned scores without triggering modifiers yet
  const abilityNames = characterData?.abilityNames?.value || ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']
  abilityNames.forEach((ability) => {
    if (props.character.abilityScores[ability]) {
      props.character.abilityScores[ability].score = 0
    }
  })

  // Use setTimeout to ensure all reactive updates are complete before setting new scores
  setTimeout(() => {
    // Now update all modifiers at once
    abilityNames.forEach((ability) => {
      characterData?.updateAbilityModifier?.(ability)
    })

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

    // Set the rolled scores (completely fresh array)
    availableScores.value = rolledScores
    isAssigningScores.value = true

    // Clear generation flag
    isGeneratingScores.value = false
  }, 10)
}

const assignScore = (abilityName, score = null) => {
  // Don't allow assignment during score generation
  if (isGeneratingScores.value) return

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
  // Don't allow clearing during score generation
  if (isGeneratingScores.value) return

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

  // Put all scores back in available scores (merge and sort)
  const allScores = [...availableScores.value, ...assignedScores]
  availableScores.value = allScores.sort((a, b) => b - a)

  // Clear selected score
  selectedScore.value = null

  // Stay in assignment mode if there are scores to assign
  if (availableScores.value.length > 0) {
    isAssigningScores.value = true
  }
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

// Skill selection computed properties and methods
const getAvailableClassSkills = computed(() => {
  if (!props.character.classDetails?.skills || !characterData?.skillList) return []

  return characterData.skillList.filter(skill =>
    props.character.classDetails.skills.includes(skill.name)
  )
})

const getSelectedClassSkills = computed(() => {
  if (!props.character.selectedClassSkills) return []
  return props.character.selectedClassSkills
})

const canSelectMoreSkills = computed(() => {
  const maxSkills = props.character.classDetails?.skillChoices || 2
  return getSelectedClassSkills.value.length < maxSkills
})

const isSkillSelected = (skillName) => {
  return getSelectedClassSkills.value.includes(skillName)
}

const handleSkillCardClick = (skillName) => {
  // Only proceed if we can select more skills OR if this skill is already selected (to deselect it)
  if (canSelectMoreSkills.value || isSkillSelected(skillName)) {
    toggleSkillSelection(skillName)
  }
}

const toggleSkillSelection = (skillName) => {
  const currentSelections = props.character.selectedClassSkills || []
  const maxSkills = props.character.classDetails?.skillChoices || 2

  let updatedSelections

  if (currentSelections.includes(skillName)) {
    // Remove skill
    updatedSelections = currentSelections.filter(skill => skill !== skillName)
  } else if (currentSelections.length < maxSkills) {
    // Add skill
    updatedSelections = [...currentSelections, skillName]
  } else {
    return // Don't proceed if max skills reached
  }

  // Emit the update - don't mutate props directly
  emit('update:character', {
    ...props.character,
    selectedClassSkills: updatedSelections
  })

  // Update skill proficiencies directly
  nextTick(() => {
    updateSkillProficiencies(updatedSelections)
  })
}

const updateSkillProficiencies = (selectedSkills) => {
  if (!characterData?.skillList) return

  const updatedCharacter = { ...props.character }

  // Initialize skill proficiencies if not present
  if (!updatedCharacter.skillProficiencies) {
    updatedCharacter.skillProficiencies = {}
  }

  // Reset class skill proficiencies first, then apply selected ones
  for (const skill of characterData.skillList) {
    if (props.character.classDetails?.skills?.includes(skill.name)) {
      // This is a class skill, check if it's selected
      if (!updatedCharacter.skillProficiencies[skill.name]) {
        updatedCharacter.skillProficiencies[skill.name] = {
          proficient: false,
          expertise: false,
          bonus: 0
        }
      }
      updatedCharacter.skillProficiencies[skill.name].proficient = selectedSkills.includes(skill.name)
    }
  }

  // Emit the updated character with skill proficiencies
  emit('update:character', updatedCharacter)
}

const getSkillModifier = (skillName) => {
  const skill = characterData?.skillList?.find(s => s.name === skillName)
  if (!skill) return 0

  const abilityName = skill.ability.toLowerCase()
  const abilityMod = props.character.abilityScores[abilityName]?.modifier || 0
  const proficiencyBonus = props.character.skillProficiencies[skillName]?.proficient ? props.character.proficiencyBonus : 0

  return abilityMod + proficiencyBonus
}

const getAllToolProficiencies = computed(() => {
  const allTools = new Set()

  // Add tool proficiencies from character.toolProficiencies array
  if (props.character.toolProficiencies && Array.isArray(props.character.toolProficiencies)) {
    props.character.toolProficiencies.forEach(tool => {
      if (typeof tool === 'string') {
        allTools.add(tool)
      } else if (tool && tool.type) {
        // Handle object format like { type: "Musical Instrument", choices: 3 }
        allTools.add(tool.type)
      }
    })
  }

  // Add tool proficiencies from background
  if (props.character.backgroundDetails) {
    const bg = props.character.backgroundDetails
    if (bg.toolProficiencies && Array.isArray(bg.toolProficiencies)) {
      bg.toolProficiencies.forEach(tool => allTools.add(tool))
    }
    if (bg.toolProf && !bg.toolProf.includes('(choice)')) {
      allTools.add(bg.toolProf)
    }
  }

  // Add tool proficiencies from class
  if (props.character.classDetails && props.character.classDetails.toolProficiencies) {
    const classTools = props.character.classDetails.toolProficiencies
    if (Array.isArray(classTools)) {
      classTools.forEach(tool => {
        if (typeof tool === 'string') {
          allTools.add(tool)
        } else if (tool && tool.type) {
          allTools.add(tool.type)
        }
      })
    }
  }

  return Array.from(allTools).filter(tool => tool && tool.trim().length > 0)
})

// Character choice computed properties
const shouldShowLanguageSelection = computed(() => {
  return getLanguageChoices().length > 0
})

const shouldShowToolSelection = computed(() => {
  return getToolChoices().length > 0
})

const getKnownLanguages = computed(() => {
  const knownLanguages = ['Common'] // Everyone knows Common

  // Add species language
  if (props.character.speciesDetails?.name === 'Dwarf') {
    knownLanguages.push('Dwarvish')
  } else if (props.character.speciesDetails?.name === 'Elf') {
    knownLanguages.push('Elvish')
  } else if (props.character.speciesDetails?.name === 'Halfling') {
    knownLanguages.push('Halfling')
  } else if (props.character.speciesDetails?.name === 'Gnome') {
    knownLanguages.push('Gnomish')
  } else if (props.character.speciesDetails?.name === 'Half-Orc') {
    knownLanguages.push('Orc')
  } else if (props.character.speciesDetails?.name === 'Dragonborn') {
    knownLanguages.push('Draconic')
  }

  // Add additional languages already selected
  if (props.character.additionalLanguages) {
    knownLanguages.push(...props.character.additionalLanguages.filter(lang => lang))
  }

  return [...new Set(knownLanguages)] // Remove duplicates
})

const getAvailableLanguages = computed(() => {
  const allLanguages = characterData?.standardLanguages || []
  const known = getKnownLanguages.value
  return allLanguages.filter(lang => !known.includes(lang))
})

const getLanguageChoices = () => {
  const choices = []

  // Check species for language choices
  if (props.character.speciesDetails?.bonusLanguage === 'choice') {
    choices.push({ source: 'species', count: 1 })
  }

  // Check background for language choices
  if (props.character.backgroundDetails?.languageOptions) {
    const langOpts = props.character.backgroundDetails.languageOptions
    if (langOpts.choose && langOpts.choose > 0) {
      choices.push({ source: 'background', count: langOpts.choose })
    }
  }

  return choices.reduce((total, choice) => total + choice.count, 0) > 0 ?
    Array.from({ length: choices.reduce((total, choice) => total + choice.count, 0) }, (_, i) => i) : []
}

const getToolChoices = () => {
  const choices = []

  // Check background for tool choices
  if (props.character.backgroundDetails) {
    const bg = props.character.backgroundDetails
    if (bg.toolProf && bg.toolProf.includes('(choice)')) {
      if (bg.toolProf.includes('Artisan')) {
        choices.push({
          label: 'Artisan\'s Tools',
          options: ['Smith\'s Tools', 'Brewer\'s Supplies', 'Mason\'s Tools', 'Carpenter\'s Tools', 'Leatherworker\'s Tools', 'Weaver\'s Tools'],
          hint: 'Choose one type of artisan\'s tools'
        })
      } else if (bg.toolProf.includes('Gaming')) {
        choices.push({
          label: 'Gaming Set',
          options: ['Dice Set', 'Playing Card Set', 'Chess Set', 'Three-Dragon Ante Set'],
          hint: 'Choose one type of gaming set'
        })
      } else if (bg.toolProf.includes('Musical')) {
        choices.push({
          label: 'Musical Instrument',
          options: ['Bagpipes', 'Drum', 'Dulcimer', 'Flute', 'Lute', 'Lyre', 'Horn', 'Pan Flute', 'Shawm', 'Viol'],
          hint: 'Choose one musical instrument'
        })
      }
    }
  }

  // Check class for tool choices
  if (props.character.classDetails?.toolProficiencies) {
    const classTools = props.character.classDetails.toolProficiencies
    if (Array.isArray(classTools)) {
      classTools.forEach(tool => {
        if (typeof tool === 'object' && tool.type && tool.choices) {
          if (tool.type === 'Musical Instrument') {
            choices.push({
              label: 'Musical Instrument (Class)',
              options: ['Bagpipes', 'Drum', 'Dulcimer', 'Flute', 'Lute', 'Lyre', 'Horn', 'Pan Flute', 'Shawm', 'Viol'],
              hint: `Choose ${tool.choices} musical instrument(s)`
            })
          }
        }
      })
    }
  }

  return choices
}

const hasAnyArmorTraining = computed(() => {
  const training = props.character.armorTraining
  return training?.light || training?.medium || training?.heavy || training?.shields
})

const formatCoins = (totalGP) => {
  return Math.round(totalGP * 100) / 100
}

const getTraitDescription = (traitName) => {
  // Fallback descriptions for common D&D racial traits
  const traitDescriptions = {
    // Common traits
    'Darkvision': 'You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You discern colors in darkness only as shades of gray.',
    'Keen Senses': 'You have proficiency with the Perception skill.',
    'Extra Language': 'You can speak, read, and write one extra language of your choice.',
    'Skill Versatility': 'You gain proficiency in two skills of your choice.',

    // Dragonborn traits
    'Draconic Ancestry': 'You have draconic ancestry. Choose one type of dragon from the Draconic Ancestry table. Your breath weapon and damage resistance are determined by the dragon type.',
    'Breath Weapon': 'You can use your action to exhale destructive energy. Your draconic ancestry determines the size, shape, and damage type of the exhalation.',
    'Damage Resistance': 'You have resistance to the damage type associated with your draconic ancestry.',

    // Dwarf traits
    'Dwarven Resilience': 'You have advantage on saving throws against poison, and you have resistance against poison damage.',
    'Dwarven Combat Training': 'You have proficiency with the battleaxe, handaxe, light hammer, and warhammer.',
    'Tool Proficiency': 'You gain proficiency with the artisan\'s tools of your choice: smith\'s tools, brewer\'s supplies, or mason\'s tools.',
    'Stonecunning': 'Whenever you make an Intelligence (History) check related to the origin of stonework, you are considered proficient in the History skill and add double your proficiency bonus to the check.',
    'Dwarven Toughness': 'Your hit point maximum increases by 1, and it increases by 1 every time you gain a level.',
    'Dwarven Armor Training': 'You have proficiency with light and medium armor.',

    // Elf traits
    'Fey Ancestry': 'You have advantage on saving throws against being charmed, and magic cannot put you to sleep.',
    'Trance': 'Elves don\'t need to sleep. Instead, they meditate deeply, remaining semiconscious, for 4 hours a day.',
    'Elf Weapon Training': 'You have proficiency with longswords, shortbows, longbows, and one other weapon of your choice.',
    'Cantrip': 'You know one cantrip of your choice from the wizard spell list. Intelligence is your spellcasting ability for it.',
    'Extra Language (High Elf)': 'You can speak, read, and write one extra language of your choice.',
    'Mask of the Wild': 'You can attempt to hide even when you are only lightly obscured by foliage, heavy rain, falling snow, mist, and other natural phenomena.',
    'Fleet of Foot': 'Your base walking speed increases to 35 feet.',

    // Drow traits
    'Superior Darkvision': 'Your darkvision has a radius of 120 feet.',
    'Sunlight Sensitivity': 'You have disadvantage on attack rolls and on Wisdom (Perception) checks that rely on sight when you, the target of your attack, or whatever you are trying to perceive is in direct sunlight.',
    'Drow Magic': 'You know the dancing lights cantrip. When you reach 3rd level, you can cast the faerie fire spell once per day. When you reach 5th level, you can also cast the darkness spell once per day.',
    'Drow Weapon Training': 'You have proficiency with rapiers, shortswords, and hand crossbows.',

    // Halfling traits
    'Lucky': 'When you roll a 1 on the d20 for an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.',
    'Brave': 'You have advantage on saving throws against being frightened.',
    'Halfling Nimbleness': 'You can move through the space of any creature that is of a size larger than yours.',
    'Naturally Stealthy': 'You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you.',

    // Gnome traits
    'Gnome Cunning': 'You have advantage on all Intelligence, Wisdom, and Charisma saving throws against magic.',
    'Natural Illusionist': 'You know the minor illusion cantrip. Charisma is your spellcasting ability for it.',
    'Speak with Small Beasts': 'Through sounds and gestures, you can communicate simple ideas with Small or smaller beasts.',
    'Tinker': 'You have proficiency with artisan\'s tools (tinker\'s tools). Using those tools, you can spend 1 hour and 10 gp worth of materials to construct a Tiny clockwork device.',

    // Half-Orc traits
    'Menacing': 'You gain proficiency in the Intimidation skill.',
    'Relentless Endurance': 'When you are reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead. You can\'t use this feature again until you finish a long rest.',
    'Savage Attacks': 'When you score a critical hit with a melee weapon attack, you can roll one of the weapon\'s damage dice one additional time and add it to the extra damage of the critical hit.',

    // Tiefling traits
    'Hellish Resistance': 'You have resistance to fire damage.',
    'Infernal Legacy': 'You know the thaumaturgy cantrip. When you reach 3rd level, you can cast the hellish rebuke spell as a 2nd-level spell once with this trait and regain the ability to do so when you finish a long rest.',
    'Fire Resistance': 'You have resistance to fire damage.',

    // Human traits
    'Versatile': 'You gain proficiency in one skill of your choice.',
    'Heroic': 'You can add your proficiency bonus to one ability check, attack roll, or saving throw. Once you use this trait, you can\'t use it again until you finish a long rest.',

    // Water-based races
    'Amphibious': 'You can breathe air and water.',
    'Swimming Speed': 'You have a swimming speed of 30 feet.',
    'Call to the Wave': 'You know the shape water cantrip.',

    // General skill proficiencies
    'Perception': 'You have proficiency in the Perception skill.',
    'Stealth': 'You have proficiency in the Stealth skill.',
    'Athletics': 'You have proficiency in the Athletics skill.',
    'Survival': 'You have proficiency in the Survival skill.',
    'Intimidation': 'You have proficiency in the Intimidation skill.',
    'Persuasion': 'You have proficiency in the Persuasion skill.',
    'Insight': 'You have proficiency in the Insight skill.',
    'Medicine': 'You have proficiency in the Medicine skill.',
    'Nature': 'You have proficiency in the Nature skill.',
    'Animal Handling': 'You have proficiency in the Animal Handling skill.',

    // Tool proficiencies (common ones)
    'Artisan\'s Tools': 'You gain proficiency with one set of artisan\'s tools of your choice.',
    'Smith\'s Tools': 'You have proficiency with smith\'s tools.',
    'Brewer\'s Supplies': 'You have proficiency with brewer\'s supplies.',
    'Mason\'s Tools': 'You have proficiency with mason\'s tools.',
    'Tinker\'s Tools': 'You have proficiency with tinker\'s tools.',
    'Thieves\' Tools': 'You have proficiency with thieves\' tools.',
    'Musical Instrument': 'You have proficiency with one musical instrument of your choice.',

    // Weapon proficiencies
    'Martial Weapons': 'You have proficiency with all martial weapons.',
    'Simple Weapons': 'You have proficiency with all simple weapons.',
    'Longsword': 'You have proficiency with longswords.',
    'Shortbow': 'You have proficiency with shortbows.',
    'Longbow': 'You have proficiency with longbows.',
    'Battleaxe': 'You have proficiency with battleaxes.',
    'Handaxe': 'You have proficiency with handaxes.',
    'Light Hammer': 'You have proficiency with light hammers.',
    'Warhammer': 'You have proficiency with warhammers.',
    'Rapier': 'You have proficiency with rapiers.',
    'Shortsword': 'You have proficiency with shortswords.',
    'Hand Crossbow': 'You have proficiency with hand crossbows.'
  }

  return traitDescriptions[traitName] || null
}

const getSubraceDescription = (subraceId, speciesName) => {
  const subraceDescriptions = {
    // Dwarf subraces
    'hill_dwarf': 'Hill dwarves are especially hardy and wise. They gain +1 Wisdom, +1 hit point per level, and proficiency with Wisdom (Medicine) checks.',
    'mountain_dwarf': 'Mountain dwarves are strong and resilient. They gain +2 Strength and proficiency with light and medium armor.',
    'duergar': 'Gray dwarves from the Underdark have psychic resistance and innate spellcasting abilities. They gain +1 Constitution and superior darkvision.',

    // Elf subraces  
    'high_elf': 'High elves are intelligent and magical. They gain +1 Intelligence, a wizard cantrip, and proficiency with longswords, shortbows, and longbows.',
    'wood_elf': 'Wood elves are swift and stealthy. They gain +1 Wisdom, proficiency with longswords and shortbows, and increased speed.',
    'drow': 'Dark elves from the Underdark have superior darkvision and innate spellcasting. They gain +1 Charisma but have sunlight sensitivity.',

    // Human variants
    'variant_human': 'Variant humans are highly adaptable. They gain +1 to two different ability scores, a bonus skill, and a bonus feat at 1st level.'
  }

  return subraceDescriptions[subraceId] || `A lineage of ${speciesName} with unique traits and abilities.`
}

const hasBackgroundChoices = (backgroundDetails) => {
  if (!backgroundDetails) return false

  // Check for language choices
  const hasLanguageChoices = backgroundDetails.languageOptions && backgroundDetails.languageOptions.choose > 0

  // Check for tool choices using the improved hasToolChoices function
  const hasToolOptions = hasToolChoices(backgroundDetails)

  return hasLanguageChoices || hasToolOptions
}

const hasToolChoices = (backgroundDetails) => {
  if (!backgroundDetails) return false

  const toolProfs = backgroundDetails.toolProficiencies || backgroundDetails.toolProf
  if (Array.isArray(toolProfs)) {
    return toolProfs.some(tool => tool && (tool.includes('choice') || tool.includes('(choice)')))
  }
  return toolProfs && (toolProfs.includes('choice') || toolProfs.includes('(choice)'))
}

const getToolChoiceDescription = (backgroundDetails) => {
  if (!backgroundDetails) return ''

  const toolProfs = backgroundDetails.toolProficiencies || backgroundDetails.toolProf
  if (Array.isArray(toolProfs)) {
    const choiceTools = toolProfs.filter(tool => tool && (tool.includes('choice') || tool.includes('(choice)')))
    if (choiceTools.length > 0) {
      // Parse the tool choice descriptions
      return choiceTools.map(tool => {
        if (tool.includes('Gaming')) return 'Choose from gaming sets'
        if (tool.includes('Artisan')) return 'Choose from artisan\'s tools'
        if (tool.includes('Musical')) return 'Choose from musical instruments'
        return tool
      }).join(', ')
    }
  }

  if (toolProfs && (toolProfs.includes('choice') || toolProfs.includes('(choice)'))) {
    if (toolProfs.includes('Gaming')) {
      return 'Choose from gaming sets'
    } else if (toolProfs.includes('Artisan')) {
      return 'Choose from artisan\'s tools'
    } else if (toolProfs.includes('Musical')) {
      return 'Choose from musical instruments'
    }
    return toolProfs
  }

  return ''
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

  if (!props.character.userName?.trim()) {
    warnings.push('Enter your name (player name)')
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

// Helper methods for character choices dropdown
const getAllLanguages = () => {
  const languages = []

  // Add known languages from species, background, etc.
  if (characterData?.getKnownLanguages?.value) {
    languages.push(...characterData.getKnownLanguages.value)
  }

  // Add additional selected languages
  if (props.character.additionalLanguages) {
    languages.push(...props.character.additionalLanguages.filter(lang => lang))
  }

  return [...new Set(languages)] // Remove duplicates
}

const getSpecialFeaturesCount = () => {
  let count = 0

  // Count species traits
  if (props.character.speciesDetails?.traits) {
    count += props.character.speciesDetails.traits.length
  }

  // Count background feature
  if (props.character.backgroundDetails?.feature) {
    count += 1
  }

  return count
}

const getSelectedChoicesCount = () => {
  let count = 0

  // Count lineage selection
  if (props.character.speciesLineage) {
    count += 1
  }

  // Count languages
  count += getAllLanguages().length

  // Count tools
  count += getAllToolProficiencies.length

  // Count skills
  count += getProficientSkills.length

  // Count special features
  count += getSpecialFeaturesCount()

  return count
}

// Computed properties for character data
const totalGP = computed(() => characterData?.totalGP?.value || 0)
const carryingCapacity = computed(() => characterData?.carryingCapacity?.value || 150)
const totalWeight = computed(() => characterData?.totalWeight?.value || 0)

// Check if any ability scores have been assigned
const hasAssignedScores = computed(() => {
  return Object.values(props.character.abilityScores).some(stat => stat.score > 0)
})

// Methods for handling selections
const handleSubraceSelection = (selectedSubrace) => {
  emit('update:character', {
    ...props.character,
    speciesLineage: selectedSubrace
  })
}

const handleLanguageSelection = (selectedLanguages) => {
  emit('update:character', {
    ...props.character,
    additionalLanguages: selectedLanguages
  })
}

const handleToolSelection = (selectedTools) => {
  emit('update:character', {
    ...props.character,
    selectedTools: selectedTools
  })
}

// Equipment Management Methods
const getEquipmentByCategory = (category) => {
  if (!props.character.equipment) return []
  return props.character.equipment.filter(item => item.category === category)
}

const hasStartingEquipment = computed(() => {
  return props.character.equipment && props.character.equipment.length > 0
})

const generateStartingEquipment = () => {
  const equipment = []

  // Class starting equipment
  if (props.character.classDetails) {
    const classEquipment = getClassStartingEquipment(props.character.classDetails.name)
    equipment.push(...classEquipment)
  }

  // Background starting equipment
  if (props.character.backgroundDetails) {
    const backgroundEquipment = getBackgroundStartingEquipment(props.character.backgroundDetails.name)
    equipment.push(...backgroundEquipment)
  }

  // Basic adventuring gear
  const basicGear = getBasicAdventuringGear()
  equipment.push(...basicGear)

  emit('update:character', {
    ...props.character,
    equipment: equipment
  })
}

const getClassStartingEquipment = (className) => {
  const classEquipment = {
    'Fighter': [
      { name: 'Longsword', category: 'weapon', damage: '1d8', damageType: 'slashing', properties: ['Versatile'], equipped: true, weight: 3, attackBonus: getTotalAbilityModifier('strength') + props.character.proficiencyBonus },
      { name: 'Shield', category: 'armor', armorClass: 2, armorType: 'Shield', equipped: true, weight: 6 },
      { name: 'Chain Mail', category: 'armor', armorClass: 16, armorType: 'Heavy', equipped: true, weight: 55 }
    ],
    'Rogue': [
      { name: 'Shortsword', category: 'weapon', damage: '1d6', damageType: 'piercing', properties: ['Finesse', 'Light'], equipped: true, weight: 2, attackBonus: getTotalAbilityModifier('dexterity') + props.character.proficiencyBonus },
      { name: 'Dagger', category: 'weapon', damage: '1d4', damageType: 'piercing', properties: ['Finesse', 'Light', 'Thrown'], equipped: false, weight: 1, attackBonus: getTotalAbilityModifier('dexterity') + props.character.proficiencyBonus },
      { name: 'Leather Armor', category: 'armor', armorClass: 11, dexBonus: true, armorType: 'Light', equipped: true, weight: 10 },
      { name: "Thieves' Tools", category: 'tool', weight: 1 }
    ],
    'Wizard': [
      { name: 'Quarterstaff', category: 'weapon', damage: '1d6', damageType: 'bludgeoning', properties: ['Versatile'], equipped: true, weight: 4, attackBonus: getTotalAbilityModifier('strength') + props.character.proficiencyBonus },
      { name: 'Dagger', category: 'weapon', damage: '1d4', damageType: 'piercing', properties: ['Finesse', 'Light', 'Thrown'], equipped: false, weight: 1, attackBonus: getTotalAbilityModifier('dexterity') + props.character.proficiencyBonus },
      { name: 'Spellbook', category: 'gear', weight: 3 }
    ],
    'Cleric': [
      { name: 'Mace', category: 'weapon', damage: '1d6', damageType: 'bludgeoning', properties: [], equipped: true, weight: 4, attackBonus: getTotalAbilityModifier('strength') + props.character.proficiencyBonus },
      { name: 'Shield', category: 'armor', armorClass: 2, armorType: 'Shield', equipped: true, weight: 6 },
      { name: 'Chain Mail', category: 'armor', armorClass: 16, armorType: 'Heavy', equipped: true, weight: 55 },
      { name: 'Holy Symbol', category: 'gear', weight: 1 }
    ]
  }

  return classEquipment[className] || []
}

const getBackgroundStartingEquipment = (backgroundName) => {
  const backgroundEquipment = {
    'Acolyte': [
      { name: 'Prayer Book', category: 'gear', weight: 2 },
      { name: 'Incense', category: 'consumable', quantity: 5, weight: 1 }
    ],
    'Criminal': [
      { name: 'Crowbar', category: 'tool', weight: 5 },
      { name: 'Dark Clothes', category: 'gear', weight: 3 }
    ],
    'Folk Hero': [
      { name: "Smith's Tools", category: 'tool', weight: 8 },
      { name: 'Shovel', category: 'tool', weight: 5 }
    ],
    'Noble': [
      { name: 'Signet Ring', category: 'gear', weight: 0 },
      { name: 'Fine Clothes', category: 'gear', weight: 6 }
    ],
    'Sage': [
      { name: 'Ink and Quill', category: 'gear', weight: 1 },
      { name: 'Parchment', category: 'gear', quantity: 10, weight: 1 }
    ]
  }

  return backgroundEquipment[backgroundName] || []
}

const getBasicAdventuringGear = () => {
  return [
    { name: 'Backpack', category: 'gear', weight: 5 },
    { name: 'Bedroll', category: 'gear', weight: 7 },
    { name: 'Rations', category: 'consumable', quantity: 10, weight: 20 },
    { name: 'Waterskin', category: 'gear', weight: 5 },
    { name: 'Hemp Rope', category: 'gear', weight: 10 },
    { name: 'Torch', category: 'gear', quantity: 10, weight: 10 }
  ]
}

const clearStartingEquipment = () => {
  emit('update:character', {
    ...props.character,
    equipment: []
  })
}

const addEquipment = (item) => {
  const currentEquipment = props.character.equipment || []
  emit('update:character', {
    ...props.character,
    equipment: [...currentEquipment, item]
  })
}

const removeEquipment = (category, index) => {
  const currentEquipment = props.character.equipment || []
  const categoryItems = currentEquipment.filter(item => item.category === category)
  const itemToRemove = categoryItems[index]

  const newEquipment = currentEquipment.filter(item => item !== itemToRemove)

  emit('update:character', {
    ...props.character,
    equipment: newEquipment
  })
}

const showAddEquipmentDialog = (category) => {
  // This would open a dialog to add equipment - for now just add a placeholder
  const newItem = {
    name: `New ${category}`,
    category: category,
    weight: 1,
    equipped: false
  }

  if (category === 'weapon') {
    newItem.damage = '1d6'
    newItem.damageType = 'slashing'
    newItem.properties = []
    newItem.attackBonus = getTotalAbilityModifier('strength') + props.character.proficiencyBonus
  } else if (category === 'armor') {
    newItem.armorClass = 12
    newItem.armorType = 'Light'
    newItem.dexBonus = true
  }

  addEquipment(newItem)
}

const updateEquipmentStats = () => {
  // This would recalculate AC, attack bonuses, etc. based on equipped items
  // For now, we'll just emit an update to trigger reactivity
  emit('update:character', { ...props.character })
}

// Combat Stats Calculations
const getCalculatedAC = () => {
  let baseAC = 10 + getTotalAbilityModifier('dexterity')
  const equippedArmor = getEquipmentByCategory('armor').filter(armor => armor.equipped)

  for (const armor of equippedArmor) {
    if (armor.armorType === 'Shield') {
      baseAC += armor.armorClass
    } else if (armor.armorClass) {
      const armorAC = armor.dexBonus ?
        armor.armorClass + Math.min(getTotalAbilityModifier('dexterity'), 2) :
        armor.armorClass
      baseAC = Math.max(baseAC, armorAC)
    }
  }

  return baseAC
}

const getACBreakdown = () => {
  const equippedArmor = getEquipmentByCategory('armor').filter(armor => armor.equipped && armor.armorType !== 'Shield')
  const equippedShield = getEquipmentByCategory('armor').find(armor => armor.equipped && armor.armorType === 'Shield')

  if (equippedArmor.length > 0) {
    let breakdown = equippedArmor[0].name
    if (equippedArmor[0].dexBonus) {
      breakdown += ' + Dex'
    }
    if (equippedShield) {
      breakdown += ' + Shield'
    }
    return breakdown
  }

  return equippedShield ? '10 + Dex + Shield' : '10 + Dex'
}

const getCalculatedHP = () => {
  const baseHP = props.character.classDetails?.hitDie || 8
  const conMod = getTotalAbilityModifier('constitution')
  return baseHP + (conMod * props.character.level)
}

const getPrimaryWeaponAttack = () => {
  const equippedWeapons = getEquipmentByCategory('weapon').filter(weapon => weapon.equipped)
  if (equippedWeapons.length > 0) {
    return `+${equippedWeapons[0].attackBonus || 0}`
  }
  return `+${getTotalAbilityModifier('strength') + props.character.proficiencyBonus}`
}

const getPrimaryWeaponName = () => {
  const equippedWeapons = getEquipmentByCategory('weapon').filter(weapon => weapon.equipped)
  return equippedWeapons.length > 0 ? equippedWeapons[0].name : null
}

const getPrimaryWeaponDamage = () => {
  const equippedWeapons = getEquipmentByCategory('weapon').filter(weapon => weapon.equipped)
  if (equippedWeapons.length > 0) {
    const weapon = equippedWeapons[0]
    const abilityMod = weapon.properties?.includes('Finesse') ?
      Math.max(getTotalAbilityModifier('strength'), getTotalAbilityModifier('dexterity')) :
      getTotalAbilityModifier('strength')
    return `${weapon.damage}+${abilityMod}`
  }
  return `1+${getTotalAbilityModifier('strength')}`
}

const getPrimaryWeaponDamageType = () => {
  const equippedWeapons = getEquipmentByCategory('weapon').filter(weapon => weapon.equipped)
  return equippedWeapons.length > 0 ? equippedWeapons[0].damageType : null
}
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

.skill-selection-card {
  transition: all 0.2s;
  border: 2px solid transparent;
}

.skill-selection-card.selectable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.skill-selection-card.selected {
  border-color: #1976d2;
  background-color: rgba(25, 118, 210, 0.1);
}

.skill-selection-card:not(.selectable) {
  opacity: 0.6;
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

/* Mobile responsiveness for compact cards */
@media (max-width: 600px) {
  .compact-card {
    max-width: 100% !important;
    min-height: 120px !important;
  }

  .compact-card .v-card-title {
    font-size: 0.9rem !important;
    padding: 8px 12px !important;
  }

  .compact-card .v-card-text {
    padding: 8px 12px !important;
  }

  .compact-card .v-btn {
    font-size: 0.7rem !important;
    padding: 4px 8px !important;
    min-width: auto !important;
  }

  .compact-card .text-caption {
    font-size: 0.65rem !important;
    line-height: 1.2 !important;
  }
}

/* Tablet responsiveness for compact cards */
@media (min-width: 601px) and (max-width: 960px) {
  .compact-card {
    min-height: 140px !important;
  }

  .compact-card .v-card-title {
    font-size: 1rem !important;
    padding: 10px 14px !important;
  }

  .compact-card .v-card-text {
    padding: 10px 14px !important;
  }
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

/* Subrace tabs styling */
.v-tabs.subrace-tabs .v-tab {
  min-height: 32px !important;
  padding: 0 12px !important;
  font-size: 0.75rem !important;
  text-transform: none !important;
}

.v-tabs-window-item .v-card {
  border: 1px solid rgba(var(--v-theme-primary), 0.2) !important;
  background-color: rgba(var(--v-theme-primary), 0.02) !important;
}

/* Species card without subraces - reduced bottom padding */
.species-preview-card.no-subraces .v-card-text {
  padding-bottom: 12px !important;
}

.species-preview-card.no-subraces {
  height: fit-content !important;
}

/* Character & Player Information Section Styling */
.name-field .v-field__input {
  font-weight: 500 !important;
  font-size: 1.05rem !important;
}

.user-name-field .v-field__input {
  font-weight: 400 !important;
}

.name-randomizer-btn {
  margin-left: 4px !important;
}

/* Compact card styling */
.v-card[color="primary-lighten-5"] {
  transition: box-shadow 0.3s ease !important;
}

.v-card[color="primary-lighten-5"]:hover {
  box-shadow: 0 4px 8px rgba(var(--v-theme-primary), 0.15) !important;
}

/* Reduce spacing in the info card */
.v-card[color="primary-lighten-5"] .v-field {
  margin-bottom: 0 !important;
}

.v-card[color="primary-lighten-5"] .v-alert {
  margin-top: 8px !important;
  margin-bottom: 0 !important;
}

/* Equipment Management Styles */
.equipment-item {
  border-radius: 8px;
  margin-bottom: 4px;
  transition: all 0.2s ease;
}

.equipment-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.v-theme--dark .equipment-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.equipment-card {
  transition: all 0.2s ease;
}

.equipment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Enhanced Equipment Page Styles */
.combat-readiness-card {
  border: 2px solid rgba(var(--v-theme-primary), 0.3) !important;
  background: linear-gradient(135deg, rgba(var(--v-theme-primary-lighten-5), 0.8), rgba(var(--v-theme-primary-lighten-4), 0.6));
  box-shadow: 0 8px 32px rgba(var(--v-theme-primary), 0.15);
}

.combat-stat-item {
  padding: 16px;
  transition: all 0.3s ease;
}

.combat-stat-item:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.combat-stat-value {
  font-size: 2.5rem;
  font-weight: 900;
  line-height: 1;
  margin-bottom: 4px;
}

.combat-stat-label {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}

.combat-stat-detail {
  font-size: 0.75rem;
  opacity: 0.8;
  font-weight: 500;
}

.starting-equipment-card {
  border: 2px solid rgba(var(--v-theme-success), 0.3) !important;
  background: linear-gradient(135deg, rgba(var(--v-theme-success-lighten-5), 0.9), rgba(255, 255, 255, 0.7));
  transition: all 0.3s ease;
}

.starting-equipment-card:hover {
  box-shadow: 0 6px 24px rgba(var(--v-theme-success), 0.2);
}

.equipment-category-card {
  height: 100%;
  border: 2px solid rgba(255, 255, 255, 0.8) !important;
  border-radius: 12px !important;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.equipment-category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border-color: rgba(255, 255, 255, 1) !important;
}

.equipment-category-card[color*="red"] {
  border-color: rgba(255, 255, 255, 0.8) !important;
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.1), rgba(21, 21, 21, 0.9)) !important;
}

.equipment-category-card[color*="blue"] {
  border-color: rgba(255, 255, 255, 0.8) !important;
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(21, 21, 21, 0.9)) !important;
}

.equipment-category-card[color*="orange"] {
  border-color: rgba(255, 255, 255, 0.8) !important;
  background: linear-gradient(135deg, rgba(255, 152, 0, 0.1), rgba(21, 21, 21, 0.9)) !important;
}

.equipment-category-card[color*="green"] {
  border-color: rgba(255, 255, 255, 0.8) !important;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(21, 21, 21, 0.9)) !important;
}

.equipment-category-card[color*="purple"] {
  border-color: rgba(255, 255, 255, 0.8) !important;
  background: linear-gradient(135deg, rgba(156, 39, 176, 0.1), rgba(21, 21, 21, 0.9)) !important;
}

.equipment-category-header {
  padding: 20px 24px !important;
  background: rgba(30, 30, 30, 0.95) !important;
  backdrop-filter: blur(10px);
  border-radius: 10px 10px 0 0 !important;
  margin: -2px -2px 0 -2px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.equipment-category-header-compact {
  padding: 16px 20px !important;
  background: rgba(30, 30, 30, 0.95) !important;
  backdrop-filter: blur(10px);
  border-radius: 10px 10px 0 0 !important;
  margin: -2px -2px 0 -2px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.equipment-add-btn {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.equipment-add-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.equipment-list {
  max-height: 300px;
  overflow-y: auto;
}

.equipment-item-enhanced {
  padding: 16px 20px !important;
  margin: 8px 12px;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: rgba(40, 40, 40, 0.8) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.equipment-item-enhanced:hover {
  background: rgba(50, 50, 50, 0.9) !important;
  transform: translateX(4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.2) !important;
}

.equipment-empty-state {
  padding: 40px 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.6) !important;
  background: rgba(30, 30, 30, 0.5) !important;
  border-radius: 8px;
  margin: 12px;
}

.equipment-empty-state-compact {
  padding: 24px 16px;
  text-align: center;
  color: rgba(255, 255, 255, 0.6) !important;
  background: rgba(30, 30, 30, 0.5) !important;
  border-radius: 8px;
  margin: 12px;
}

.equipment-chip {
  margin: 2px;
  transition: all 0.3s ease;
}

.equipment-chip:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.equipment-delete-btn {
  opacity: 0.7;
  transition: all 0.3s ease;
}

.equipment-delete-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

.wealth-card {
  border: 2px solid rgba(var(--v-theme-warning), 0.3) !important;
  background: linear-gradient(135deg, rgba(var(--v-theme-warning-lighten-5), 0.9), rgba(255, 255, 255, 0.8));
  transition: all 0.3s ease;
}

.wealth-card:hover {
  box-shadow: 0 6px 24px rgba(var(--v-theme-warning), 0.2);
}

.encumbrance-card {
  border: 2px solid rgba(var(--v-theme-info), 0.3) !important;
  background: linear-gradient(135deg, rgba(var(--v-theme-info-lighten-5), 0.9), rgba(255, 255, 255, 0.8));
  transition: all 0.3s ease;
}

.encumbrance-card:hover {
  box-shadow: 0 6px 24px rgba(var(--v-theme-info), 0.2);
}

.equipment-action-btn {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  text-transform: none;
  font-weight: 600;
}

.equipment-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

/* Enhanced Equipment Item Formatting */
.equipment-item-content {
  flex: 1;
  min-width: 0;
}

.equipment-item-title {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.equipment-item-details {
  margin-top: 8px;
}

.equipment-detail-chip {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: rgba(255, 255, 255, 0.9) !important;
  transition: all 0.3s ease;
}

.equipment-detail-chip:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
  transform: scale(1.05);
}

.equipment-chip-enhanced {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: rgba(255, 255, 255, 0.9) !important;
  transition: all 0.3s ease;
  padding: 8px 12px;
}

.equipment-chip-enhanced:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
  transform: scale(1.02);
}

.equipment-chip-enhanced .v-chip__close {
  color: rgba(255, 255, 255, 0.7) !important;
}

.equipment-chip-enhanced .v-chip__close:hover {
  color: rgba(255, 255, 255, 1) !important;
}

.combat-stat-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.combat-stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.equipment-category-card {
  min-height: 200px;
  transition: all 0.2s ease;
}

.equipment-category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.equipped-item {
  background: rgba(76, 175, 80, 0.1);
  border-left: 3px solid #4caf50;
}

.unequipped-item {
  background: rgba(158, 158, 158, 0.1);
  border-left: 3px solid #9e9e9e;
}
</style>
