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
          <v-row class="mb-4">
            <v-col cols="12">
              <v-text-field v-model="character.name" label="Character Name" variant="outlined"
                placeholder="e.g., Thorin Ironbeard, Luna Silverleaf..." prepend-inner-icon="mdi-account"
                density="comfortable" class="text-h6" />
            </v-col>
          </v-row>

          <!-- Species Selection with Preview -->
          <v-row class="mb-6">
            <v-col cols="12" md="6">
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
            <v-col cols="12" md="6">
              <!-- Species Preview Card -->
              <v-card v-if="character.speciesDetails" variant="tonal" color="blue-grey-lighten-5">
                <v-card-title class="text-h6">{{ character.speciesDetails.name }}</v-card-title>
                <v-card-text>
                  <div v-if="character.speciesDetails.description" class="mb-3">
                    <strong>Description:</strong> {{ character.speciesDetails.description }}
                  </div>
                  <v-chip-group class="mb-2">
                    <v-chip size="small" color="primary">Size: {{ character.speciesDetails.size }}</v-chip>
                    <v-chip size="small" color="green">Speed: {{ character.speciesDetails.speed }} ft</v-chip>
                    <v-chip v-if="character.speciesDetails.darkvision" size="small" color="purple">
                      Darkvision {{ character.speciesDetails.darkvision }} ft
                    </v-chip>
                  </v-chip-group>
                  <div v-if="character.speciesDetails.traits && character.speciesDetails.traits.length" class="mt-2">
                    <strong>Special Traits:</strong>
                    <ul class="mt-1">
                      <li v-for="trait in character.speciesDetails.traits.slice(0, 2)" :key="trait.name"
                        class="text-caption">
                        <strong>{{ trait.name }}:</strong> {{ trait.description?.substring(0, 100) }}...
                      </li>
                    </ul>
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
            <v-col cols="12" md="6">
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
            <v-col cols="12" md="6">
              <!-- Class Preview Card -->
              <v-card v-if="character.classDetails" variant="tonal" color="red-lighten-5">
                <v-card-title class="text-h6">{{ character.classDetails.name }}</v-card-title>
                <v-card-text>
                  <div v-if="character.classDetails.description" class="mb-3">
                    <strong>Description:</strong> {{ character.classDetails.description }}
                  </div>
                  <v-chip-group class="mb-2">
                    <v-chip v-if="character.classDetails.hpDie || character.classDetails.hitDie" size="small"
                      color="red">
                      {{ character.classDetails.hpDie || character.classDetails.hitDie }} Hit Die
                    </v-chip>
                    <v-chip v-if="character.classDetails.primaryAbility" size="small" color="orange">
                      {{ character.classDetails.primaryAbility }}
                    </v-chip>
                  </v-chip-group>
                  <div v-if="character.classDetails.savingThrows && character.classDetails.savingThrows.length"
                    class="mb-2">
                    <strong>Saving Throws:</strong> {{ character.classDetails.savingThrows.join(', ') }}
                  </div>
                  <div v-if="character.classDetails.skills && character.classDetails.skills.length" class="mb-2">
                    <strong>Skill Options:</strong> Choose {{ character.classDetails.skillChoices || 2 }} from {{
                      character.classDetails.skills.slice(0, 4).join(', ') }}{{ character.classDetails.skills.length > 4 ?
                      '...' : '' }}
                  </div>
                  <div v-if="character.classDetails.armorTraining" class="text-caption">
                    <strong>Armor Training:</strong>
                    <span v-if="character.classDetails.armorTraining.light">Light</span>
                    <span v-if="character.classDetails.armorTraining.medium">, Medium</span>
                    <span v-if="character.classDetails.armorTraining.heavy">, Heavy</span>
                    <span v-if="character.classDetails.armorTraining.shields">, Shields</span>
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
            <v-col cols="12" md="6">
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
            <v-col cols="12" md="6">
              <!-- Background Preview Card -->
              <v-card v-if="character.backgroundDetails" variant="tonal" color="green-lighten-5">
                <v-card-title class="text-h6">{{ character.backgroundDetails.name }}</v-card-title>
                <v-card-text>
                  <div v-if="character.backgroundDetails.description" class="mb-3">
                    <strong>Background:</strong> {{ character.backgroundDetails.description }}
                  </div>
                  <div v-if="character.backgroundDetails.skillProficiencies || character.backgroundDetails.skillProfs"
                    class="mb-2">
                    <strong>Skill Proficiencies:</strong>
                    {{ (character.backgroundDetails.skillProficiencies || character.backgroundDetails.skillProfs ||
                      []).join(', ') }}
                  </div>
                  <div v-if="character.backgroundDetails.toolProficiencies || character.backgroundDetails.toolProf"
                    class="mb-2">
                    <strong>Tool Proficiencies:</strong>
                    {{ Array.isArray(character.backgroundDetails.toolProficiencies) ?
                      character.backgroundDetails.toolProficiencies.join(', ') : character.backgroundDetails.toolProf }}
                  </div>
                  <div v-if="character.backgroundDetails.feature" class="text-caption">
                    <strong>{{ character.backgroundDetails.feature.name }}:</strong> {{
                      character.backgroundDetails.feature.description?.substring(0, 100) }}...
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
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model.number="character.level" label="Character Level" type="number" min="1" max="20"
                variant="outlined" prepend-inner-icon="mdi-trending-up" hint="Most new characters start at level 1"
                persistent-hint />
            </v-col>
            <v-col cols="12" md="6">
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
        <v-card-title class="text-h4 text-center mb-4">⚡ Set Your Abilities</v-card-title>
        <v-card-subtitle class="text-center mb-4">
          These numbers determine your character's basic capabilities. Higher scores are better!
        </v-card-subtitle>
        <v-card-text>
          <v-alert type="info" variant="tonal" class="mb-6">
            <v-alert-title>💡 New Player Tip</v-alert-title>
            <strong>Standard scores:</strong> 15, 14, 13, 12, 10, 8 - Assign your highest scores to abilities your class
            uses most!
            <br><strong>Ability Modifiers:</strong> Every 2 points above 10 gives +1 bonus, every 2 below gives -1
            penalty.
          </v-alert>

          <v-row justify="center">
            <v-col v-for="(statName, index) in (characterData?.abilityNames || [])" :key="statName" cols="12" sm="6"
              md="4">
              <v-card variant="outlined" class="ability-card">
                <v-card-title class="text-h6 text-center">
                  {{ getAbilityIcon(statName) }} {{ statName.toUpperCase() }}
                </v-card-title>
                <v-card-text>
                  <v-text-field v-model.number="character.abilityScores[statName].score" type="number"
                    variant="outlined" density="comfortable" min="1" max="20"
                    @input="characterData?.updateAbilityModifier?.(statName)" class="text-center score-field">
                    <template #append>
                      <v-chip :color="getModifierColor(character.abilityScores[statName].modifier)" size="large" label>
                        {{ character.abilityScores[statName].modifier >= 0 ? '+' : '' }}{{
                          character.abilityScores[statName].modifier }}
                      </v-chip>
                    </template>
                  </v-text-field>
                  <div class="text-caption text-center text-grey">
                    {{ getAbilityDescription(statName) }}
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Quick Reference Card -->
          <v-card variant="tonal" color="blue-grey-lighten-5" class="mt-6">
            <v-card-title class="text-h6">📖 Quick Reference</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <strong>Ability Score Guidelines:</strong>
                  <ul class="mt-2">
                    <li><strong>18-20:</strong> Legendary (Olympic athlete level)</li>
                    <li><strong>15-17:</strong> Excellent (Professional level)</li>
                    <li><strong>12-14:</strong> Good (Above average)</li>
                    <li><strong>9-11:</strong> Average (Most people)</li>
                    <li><strong>6-8:</strong> Poor (Below average)</li>
                    <li><strong>3-5:</strong> Terrible (Significant impairment)</li>
                  </ul>
                </v-col>
                <v-col cols="12" md="6">
                  <strong>Class Recommendations:</strong>
                  <div v-if="character.classDetails" class="mt-2">
                    <v-chip size="small" color="primary" class="mr-1 mb-1">
                      Primary: {{ character.classDetails.primaryAbility }}
                    </v-chip>
                    <div v-if="character.classDetails.savingThrows" class="mt-2">
                      <small><strong>Important saves:</strong> {{ character.classDetails.savingThrows.join(', ')
                      }}</small>
                    </div>
                  </div>
                  <div v-else class="text-grey">
                    Select a class to see recommendations
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
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

const getModifierColor = (modifier) => {
  if (modifier >= 3) return 'green'
  if (modifier >= 1) return 'light-green'
  if (modifier >= 0) return 'grey'
  if (modifier >= -1) return 'orange'
  return 'red'
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
</style>
