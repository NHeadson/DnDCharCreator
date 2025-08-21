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
          <v-card color="error-lighten-4" variant="outlined" class="combat-stat-card">
            <v-card-title class="text-center">❤️ Hit Points</v-card-title>
            <v-card-text class="combat-card-content">
              <div class="text-center">
                <div class="text-h3 text-error">{{ calculateHitPoints }}</div>
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
          <v-card color="blue-lighten-4" variant="outlined" class="combat-stat-card">
            <v-card-title class="text-center">🛡️ Armor Class</v-card-title>
            <v-card-text class="combat-card-content">
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
          <v-card color="green-lighten-4" variant="outlined" class="combat-stat-card">
            <v-card-title class="text-center">⚔️ Combat Stats</v-card-title>
            <v-card-text class="combat-card-content">
              <v-list class="pt-4 pb-0" density="compact">
                <v-list-item>
                  <v-list-item-title>Proficiency Bonus</v-list-item-title>
                  <template #append>
                    <v-tooltip text="Added to attack rolls, skill checks, and saving throws you're proficient in"
                      location="top">
                      <template v-slot:activator="{ props }">
                        <v-chip v-bind="props" color="primary" size="small">+{{ character.proficiencyBonus }}</v-chip>
                      </template>
                    </v-tooltip>
                  </template>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Initiative</v-list-item-title>
                  <template #append>
                    <v-tooltip text="Your Dexterity modifier - determines turn order in combat" location="top">
                      <template v-slot:activator="{ props }">
                        <v-chip v-bind="props" :color="getDexModifier >= 0 ? 'success' : 'error'" size="small">
                          {{ getDexModifier >= 0 ? '+' : '' }}{{ getDexModifier }}
                        </v-chip>
                      </template>
                    </v-tooltip>
                  </template>
                </v-list-item>
                <v-list-item class="list-item-spacer">
                  <!-- Empty spacer item to match height with other cards -->
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
          <!-- Compact overview section -->
          <div class="my-2 ml-4">
            <v-row>
              <!-- Basic stats in a more compact format -->
              <v-col cols="12" md="8">
                <div class="d-flex flex-wrap align-center ga-2 mb-3">
                  <v-tooltip text="Physical size category - affects space occupied and some mechanics" location="top">
                    <template v-slot:activator="{ props }">
                      <v-chip v-bind="props" color="primary" size="small" prepend-icon="mdi-resize">
                        {{ character.speciesDetails.size || 'Medium' }} Size
                      </v-chip>
                    </template>
                  </v-tooltip>
                  <v-tooltip text="Base walking speed in feet per round during combat" location="top">
                    <template v-slot:activator="{ props }">
                      <v-chip v-bind="props" color="secondary" size="small" prepend-icon="mdi-run-fast">
                        {{ character.speciesDetails.speed || 30 }} ft Speed
                      </v-chip>
                    </template>
                  </v-tooltip>
                  <v-tooltip v-if="character.speciesDetails.darkvision"
                    text="Can see in darkness as if it were dim light within this range" location="top">
                    <template v-slot:activator="{ props }">
                      <v-chip v-bind="props" color="purple" size="small" prepend-icon="mdi-eye">
                        {{ character.speciesDetails.darkvision }} ft Darkvision
                      </v-chip>
                    </template>
                  </v-tooltip>
                  <v-tooltip v-if="character.speciesDetails.damageResistance"
                    text="Takes half damage from these damage types" location="top">
                    <template v-slot:activator="{ props }">
                      <v-chip v-bind="props" color="orange" size="small" prepend-icon="mdi-shield">
                        {{ character.speciesDetails.damageResistance }}
                      </v-chip>
                    </template>
                  </v-tooltip>
                </div>
              </v-col>
              <v-col cols="12" md="4">
                <div v-if="character.speciesDetails.ability_bonuses?.length" class="d-flex flex-wrap align-center ga-1">
                  <strong class="text-body-2 me-2">💪 Bonuses:</strong>
                  <v-tooltip v-for="bonus in character.speciesDetails.ability_bonuses" :key="bonus.ability_score?.name"
                    :text="`Adds +${bonus.bonus} to your ${bonus.ability_score?.name} score`" location="top">
                    <template v-slot:activator="{ props }">
                      <v-chip v-bind="props" color="success" size="x-small">
                        {{ bonus.ability_score?.name }}: +{{ bonus.bonus }}
                      </v-chip>
                    </template>
                  </v-tooltip>
                </div>
              </v-col>
            </v-row>
          </div>

          <!-- Languages -->
          <div v-if="character.speciesDetails.languages?.length" class="mb-4">
            <div class="d-flex flex-wrap align-center ga-2">
              <strong class="text-body-2">🗣️ Languages:</strong>
              <v-tooltip v-for="lang in character.speciesDetails.languages" :key="lang.index || lang.name"
                :text="`You can speak, read, and write ${typeof lang === 'string' ? lang : lang.name}`" location="top">
                <template v-slot:activator="{ props }">
                  <v-chip v-bind="props" color="info" size="small">
                    {{ typeof lang === 'string' ? lang : lang.name }}
                  </v-chip>
                </template>
              </v-tooltip>
            </div>
          </div>

          <!-- Special Traits -->
          <div class="mb-4">
            <div v-if="speciesTraitsWithDetails.length">
              <h4 class="mb-3">✨ Special Traits</h4>
              <div class="trait-accordion">
                <v-card v-for="(trait, index) in speciesTraitsWithDetails" :key="trait.name || trait.index" class="mb-2"
                  variant="outlined">
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

            <!-- Human special case -->
            <div v-else-if="character.speciesDetails.name === 'Human'">
              <h4 class="mb-3">✨ Human Versatility</h4>
              <v-card color="blue-lighten-5" variant="tonal" class="pa-4">
                <div class="text-body-2 mb-3">
                  <strong>Adaptable Nature:</strong> Humans excel through versatility rather than specialized traits:
                </div>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-list density="compact">
                      <v-list-item class="pa-1">
                        <v-icon class="me-3" size="small" color="primary">mdi-account-multiple</v-icon>
                        <v-list-item-title class="text-body-2">Diverse skill development</v-list-item-title>
                      </v-list-item>
                      <v-list-item class="pa-1">
                        <v-icon class="me-3" size="small" color="primary">mdi-star</v-icon>
                        <v-list-item-title class="text-body-2">Extra ability improvements</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-list density="compact">
                      <v-list-item class="pa-1">
                        <v-icon class="me-3" size="small" color="primary">mdi-heart</v-icon>
                        <v-list-item-title class="text-body-2">Cultural adaptability</v-list-item-title>
                      </v-list-item>
                      <v-list-item class="pa-1">
                        <v-icon class="me-3" size="small" color="primary">mdi-lightning-bolt</v-icon>
                        <v-list-item-title class="text-body-2">Quick learning ability</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-col>
                </v-row>
              </v-card>
            </div>

            <!-- Fallback for other species -->
            <div v-else-if="character.speciesDetails">
              <h4 class="mb-3">✨ Special Traits</h4>
              <v-alert type="info" variant="tonal" class="text-body-2">
                No special traits found for {{ character.speciesDetails.name }}. This species may have unique abilities
                that
                aren't yet loaded.
              </v-alert>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Class Features -->
      <v-card v-if="character.classDetails" class="mb-6" variant="outlined">
        <v-card-title class="text-h6">⚔️ Class Features ({{ character.classDetails.name }})</v-card-title>
        <v-card-text>
          <!-- Compact overview section -->
          <div class="my-1 ml-4">
            <div class="d-flex flex-wrap align-center ga-2 mb-3">
              <v-tooltip text="The die used to determine hit points gained each level" location="top">
                <template v-slot:activator="{ props }">
                  <v-chip v-bind="props" color="error" size="small" prepend-icon="mdi-dice-6">
                    d{{ character.classDetails.hit_die || character.classDetails.hpDie?.replace('D', '') || '8' }} Hit
                    Die
                  </v-chip>
                </template>
              </v-tooltip>
              <v-tooltip text="The most important ability score(s) for this class" location="top">
                <template v-slot:activator="{ props }">
                  <v-chip v-bind="props" color="primary" size="small" prepend-icon="mdi-star">
                    {{ Array.isArray(character.classDetails.primary_ability)
                      ? character.classDetails.primary_ability.join(', ')
                      : character.classDetails.primaryAbility || character.classDetails.primary_ability || 'Varies' }}
                  </v-chip>
                </template>
              </v-tooltip>
              <v-tooltip
                v-for="save in (character.classDetails.saving_throws || character.classDetails.savingThrows || [])"
                :key="typeof save === 'string' ? save : save.name"
                :text="`You add your proficiency bonus to ${typeof save === 'string' ? save : save.name} saving throws`"
                location="top">
                <template v-slot:activator="{ props }">
                  <v-chip v-bind="props" color="warning" size="small" prepend-icon="mdi-shield-check">
                    {{ typeof save === 'string' ? save : save.name }}
                  </v-chip>
                </template>
              </v-tooltip>
            </div>
          </div>

          <!-- 1st Level Class Features -->
          <div v-if="character.classDetails.features?.length" class="mb-4">
            <h4 class="mb-3">✨ 1st Level Features</h4>
            <div class="class-features-accordion">
              <v-card v-for="(feature, index) in character.classDetails.features" :key="feature.name || feature.index"
                class="mb-2" variant="outlined">
                <v-card-title class="pa-3 cursor-pointer feature-header" @click="toggleClassFeature(index)"
                  :class="{ 'feature-expanded': expandedClassFeatures[index] }">
                  <v-icon class="mr-2">{{ expandedClassFeatures[index] ? 'mdi-chevron-down' : 'mdi-chevron-right'
                  }}</v-icon>
                  {{ feature.name || 'Unknown Feature' }}
                </v-card-title>
                <v-expand-transition>
                  <v-card-text v-if="expandedClassFeatures[index]" class="pt-0">
                    <v-divider class="mb-3"></v-divider>
                    <div v-if="Array.isArray(feature.desc) && feature.desc.length">
                      <p v-for="(desc, descIndex) in feature.desc" :key="descIndex" class="mb-2">
                        {{ desc }}
                      </p>
                    </div>
                    <div v-else-if="feature.desc">
                      <p>{{ typeof feature.desc === 'string' ? feature.desc : feature.desc.join(' ') }}</p>
                    </div>
                    <div v-else class="text-caption text-grey">
                      This feature provides special abilities for your {{ character.classDetails.name }}.
                    </div>
                  </v-card-text>
                </v-expand-transition>
              </v-card>
            </div>
          </div>

          <!-- Fallback if no features loaded -->
          <div v-else class="mb-4">
            <h4 class="mb-3">✨ 1st Level Features</h4>
            <v-alert type="info" variant="tonal" class="text-body-2">
              Class features are loading... Each {{ character.classDetails.name }} gets unique abilities at 1st level
              that
              define how the class plays.
            </v-alert>
          </div>
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
                  <v-tooltip v-for="skill in character.backgroundDetails.skill_proficiencies" :key="skill.name"
                    :text="`Your background grants proficiency in ${skill.name}`" location="top">
                    <template v-slot:activator="{ props }">
                      <v-chip v-bind="props" color="purple" size="small">
                        {{ skill.name }}
                      </v-chip>
                    </template>
                  </v-tooltip>
                </v-chip-group>
              </div>

              <div v-if="character.backgroundDetails.languages?.length" class="mb-4">
                <h4>🗣️ Additional Languages</h4>
                <v-chip-group>
                  <v-tooltip v-for="lang in character.backgroundDetails.languages" :key="lang.index || lang.name"
                    :text="`Your background grants knowledge of ${typeof lang === 'string' ? lang : lang.name}`"
                    location="top">
                    <template v-slot:activator="{ props }">
                      <v-chip v-bind="props" color="info" size="small">
                        {{ typeof lang === 'string' ? lang : lang.name }}
                      </v-chip>
                    </template>
                  </v-tooltip>
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

          <!-- Show message if no choices available -->
          <div v-if="!hasFightingStyle && !hasExpertise && !isWarlock && !isDruid && !isCleric"
            class="text-center py-6">
            <v-icon size="64" color="grey-lighten-2">mdi-cog-outline</v-icon>
            <div class="text-h6 mt-3 mb-2">No Feature Choices Available</div>
            <div class="text-body-2 text-medium-emphasis mb-2">
              Select a class to see available feature customization options.
            </div>
            <v-chip color="info" size="small" variant="outlined">
              Current class: {{ character.classDetails?.name || character.class || 'None selected' }}
            </v-chip>
          </div>

          <!-- Feature Choices Grid -->
          <v-row v-else>
            <!-- Fighting Style -->
            <v-col v-if="hasFightingStyle" cols="12">
              <v-card class="feature-choice-card" color="red-lighten-5" variant="tonal">
                <v-card-title class="d-flex align-center text-h6">
                  <v-icon class="me-2" color="red-darken-2">mdi-sword-cross</v-icon>
                  Fighting Style
                  <v-spacer />
                  <v-chip :color="hasFightingStyle && !selectedFightingStyle ? 'error' : 'red'" size="small"
                    variant="outlined">
                    {{ hasFightingStyle && !selectedFightingStyle ? 'Required!' : 'Required' }}
                  </v-chip>
                </v-card-title>
                <v-card-text>
                  <div class="text-body-2 mb-3 text-medium-emphasis">
                    Choose a fighting style that defines your combat approach
                  </div>
                  <v-radio-group v-model="selectedFightingStyle" density="compact">
                    <v-row>
                      <v-col v-for="style in fightingStyles" :key="style.value" cols="12" md="6">
                        <v-card class="fighting-style-option" variant="outlined"
                          :class="{ 'fighting-style-selected': selectedFightingStyle === style.value }"
                          @click="selectedFightingStyle = style.value">
                          <v-card-text class="d-flex pa-3" style="min-height: 80px;">
                            <div class="radio-container">
                              <v-radio :value="style.value" hide-details />
                            </div>
                            <div class="text-content flex-grow-1">
                              <div class="text-subtitle-2 font-weight-medium text-left">{{ style.title }}</div>
                              <div class="text-caption text-medium-emphasis text-left">{{ style.description }}</div>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-radio-group>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Expertise -->
            <v-col v-if="hasExpertise" cols="12">
              <v-card class="feature-choice-card" color="yellow-lighten-5" variant="tonal">
                <v-card-title class="d-flex align-center text-h6">
                  <v-icon class="me-2" color="yellow-darken-3">mdi-target</v-icon>
                  Expertise
                  <v-spacer />
                  <v-chip :color="selectedExpertiseSkills.length < expertiseChoices ? 'error' : 'yellow-darken-2'"
                    size="small" variant="outlined">
                    {{ selectedExpertiseSkills.length < expertiseChoices ? `Required:
                      ${selectedExpertiseSkills.length}/${expertiseChoices}` : `Choose ${expertiseChoices}` }} </v-chip>
                </v-card-title>
                <v-card-text>
                  <div class="text-body-2 mb-3 text-medium-emphasis">
                    Choose {{ expertiseChoices }} skills to double your proficiency bonus
                  </div>

                  <!-- Selected Skills Display -->
                  <div v-if="selectedExpertiseSkills.length" class="mb-3">
                    <div class="text-subtitle-2 mb-2">Selected Skills:</div>
                    <div class="d-flex flex-wrap ga-2">
                      <v-chip v-for="skill in selectedExpertiseSkills" :key="`selected-${skill}`"
                        color="yellow-darken-2" size="small" variant="outlined" closable
                        @click:close="removeExpertiseSkill(skill)">
                        {{ skill }}
                      </v-chip>
                    </div>
                  </div>

                  <!-- Skill Categories by Ability -->
                  <div class="expertise-skills-grid">
                    <!-- Strength Skills -->
                    <div v-if="strengthSkills.length > 0" class="skill-category"
                      :class="{ 'primary-ability': isImportantAbility('Strength') }">
                      <div class="skill-category-header">
                        <v-icon size="small" :color="isImportantAbility('Strength') ? 'red-darken-1' : 'red-darken-3'"
                          class="me-2">mdi-arm-flex</v-icon>
                        <span class="text-subtitle-2 font-weight-bold">Strength</span>
                        <v-chip v-if="isImportantAbility('Strength')" color="primary" size="x-small" variant="outlined"
                          class="ml-2">Key Ability</v-chip>
                        <v-spacer />
                        <span class="text-caption">{{ getAbilityModifier('strength') >= 0 ? '+' : '' }}{{
                          getAbilityModifier('strength') }}</span>
                      </div>
                      <div class="skill-chips">
                        <v-tooltip v-for="skill in strengthSkills" :key="skill"
                          :text="`Double your proficiency bonus for ${skill} checks (uses Strength)`" location="top">
                          <template v-slot:activator="{ props }">
                            <v-chip v-bind="props" :value="skill" variant="outlined" :color="selectedExpertiseSkills.includes(skill)
                              ? (isImportantAbility('Strength') ? 'red-darken-1' : 'red-lighten-1')
                              : 'grey-lighten-1'" size="small"
                              :disabled="!selectedExpertiseSkills.includes(skill) && selectedExpertiseSkills.length >= expertiseChoices"
                              @click="toggleExpertiseSkill(skill)">
                              {{ skill }}
                            </v-chip>
                          </template>
                        </v-tooltip>
                      </div>
                    </div>

                    <!-- Dexterity Skills -->
                    <div v-if="dexteritySkills.length > 0" class="skill-category"
                      :class="{ 'primary-ability': isImportantAbility('Dexterity') }">
                      <div class="skill-category-header">
                        <v-icon size="small"
                          :color="isImportantAbility('Dexterity') ? 'green-darken-1' : 'green-darken-3'"
                          class="me-2">mdi-run-fast</v-icon>
                        <span class="text-subtitle-2 font-weight-bold">Dexterity</span>
                        <v-chip v-if="isImportantAbility('Dexterity')" color="primary" size="x-small" variant="outlined"
                          class="ml-2">Key Ability</v-chip>
                        <v-spacer />
                        <span class="text-caption">{{ getAbilityModifier('dexterity') >= 0 ? '+' : '' }}{{
                          getAbilityModifier('dexterity') }}</span>
                      </div>
                      <div class="skill-chips">
                        <v-tooltip v-for="skill in dexteritySkills" :key="skill"
                          :text="`Double your proficiency bonus for ${skill} checks (uses Dexterity)`" location="top">
                          <template v-slot:activator="{ props }">
                            <v-chip v-bind="props" :value="skill" variant="outlined" :color="selectedExpertiseSkills.includes(skill)
                              ? (isImportantAbility('Dexterity') ? 'green-darken-1' : 'green-lighten-1')
                              : 'grey-lighten-1'" size="small"
                              :disabled="!selectedExpertiseSkills.includes(skill) && selectedExpertiseSkills.length >= expertiseChoices"
                              @click="toggleExpertiseSkill(skill)">
                              {{ skill }}
                            </v-chip>
                          </template>
                        </v-tooltip>
                      </div>
                    </div>

                    <!-- Intelligence Skills -->
                    <div v-if="intelligenceSkills.length > 0" class="skill-category"
                      :class="{ 'primary-ability': isImportantAbility('Intelligence') }">
                      <div class="skill-category-header">
                        <v-icon size="small"
                          :color="isImportantAbility('Intelligence') ? 'blue-darken-1' : 'blue-darken-3'"
                          class="me-2">mdi-brain</v-icon>
                        <span class="text-subtitle-2 font-weight-bold">Intelligence</span>
                        <v-chip v-if="isImportantAbility('Intelligence')" color="primary" size="x-small"
                          variant="outlined" class="ml-2">Key Ability</v-chip>
                        <v-spacer />
                        <span class="text-caption">{{ getAbilityModifier('intelligence') >= 0 ? '+' : '' }}{{
                          getAbilityModifier('intelligence') }}</span>
                      </div>
                      <div class="skill-chips">
                        <v-tooltip v-for="skill in intelligenceSkills" :key="skill"
                          :text="`Double your proficiency bonus for ${skill} checks (uses Intelligence)`"
                          location="top">
                          <template v-slot:activator="{ props }">
                            <v-chip v-bind="props" :value="skill" variant="outlined" :color="selectedExpertiseSkills.includes(skill)
                              ? (isImportantAbility('Intelligence') ? 'blue-darken-1' : 'blue-lighten-1')
                              : 'grey-lighten-1'" size="small"
                              :disabled="!selectedExpertiseSkills.includes(skill) && selectedExpertiseSkills.length >= expertiseChoices"
                              @click="toggleExpertiseSkill(skill)">
                              {{ skill }}
                            </v-chip>
                          </template>
                        </v-tooltip>
                      </div>
                    </div>

                    <!-- Wisdom Skills -->
                    <div v-if="wisdomSkills.length > 0" class="skill-category"
                      :class="{ 'primary-ability': isImportantAbility('Wisdom') }">
                      <div class="skill-category-header">
                        <v-icon size="small" :color="isImportantAbility('Wisdom') ? 'teal-darken-1' : 'teal-darken-3'"
                          class="me-2">mdi-eye</v-icon>
                        <span class="text-subtitle-2 font-weight-bold">Wisdom</span>
                        <v-chip v-if="isImportantAbility('Wisdom')" color="primary" size="x-small" variant="outlined"
                          class="ml-2">Key Ability</v-chip>
                        <v-spacer />
                        <span class="text-caption">{{ getAbilityModifier('wisdom') >= 0 ? '+' : '' }}{{
                          getAbilityModifier('wisdom') }}</span>
                      </div>
                      <div class="skill-chips">
                        <v-tooltip v-for="skill in wisdomSkills" :key="skill"
                          :text="`Double your proficiency bonus for ${skill} checks (uses Wisdom)`" location="top">
                          <template v-slot:activator="{ props }">
                            <v-chip v-bind="props" :value="skill" variant="outlined" :color="selectedExpertiseSkills.includes(skill)
                              ? (isImportantAbility('Wisdom') ? 'teal-darken-1' : 'teal-lighten-1')
                              : 'grey-lighten-1'" size="small"
                              :disabled="!selectedExpertiseSkills.includes(skill) && selectedExpertiseSkills.length >= expertiseChoices"
                              @click="toggleExpertiseSkill(skill)">
                              {{ skill }}
                            </v-chip>
                          </template>
                        </v-tooltip>
                      </div>
                    </div>

                    <!-- Charisma Skills -->
                    <!-- Charisma Skills -->
                    <div v-if="charismaSkills.length > 0" class="skill-category"
                      :class="{ 'primary-ability': isImportantAbility('Charisma') }">
                      <div class="skill-category-header">
                        <v-icon size="small"
                          :color="isImportantAbility('Charisma') ? 'purple-darken-1' : 'purple-darken-3'"
                          class="me-2">mdi-account-group</v-icon>
                        <span class="text-subtitle-2 font-weight-bold">Charisma</span>
                        <v-chip v-if="isImportantAbility('Charisma')" color="primary" size="x-small" variant="outlined"
                          class="ml-2">Key Ability</v-chip>
                        <v-spacer />
                        <span class="text-caption">{{ getAbilityModifier('charisma') >= 0 ? '+' : '' }}{{
                          getAbilityModifier('charisma') }}</span>
                      </div>
                      <div class="skill-chips">
                        <v-tooltip v-for="skill in charismaSkills" :key="skill"
                          :text="`Double your proficiency bonus for ${skill} checks (uses Charisma)`" location="top">
                          <template v-slot:activator="{ props }">
                            <v-chip v-bind="props" :value="skill" variant="outlined" :color="selectedExpertiseSkills.includes(skill)
                              ? (isImportantAbility('Charisma') ? 'purple-darken-1' : 'purple-lighten-1')
                              : 'grey-lighten-1'" size="small"
                              :disabled="!selectedExpertiseSkills.includes(skill) && selectedExpertiseSkills.length >= expertiseChoices"
                              @click="toggleExpertiseSkill(skill)">
                              {{ skill }}
                            </v-chip>
                          </template>
                        </v-tooltip>
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Subclass Choices Row -->
            <v-col cols="12">
              <v-row>
                <!-- Warlock Patron -->
                <v-col v-if="isWarlock" cols="12" md="4">
                  <v-card class="feature-choice-card h-100" color="purple-lighten-5" variant="tonal">
                    <v-card-title class="d-flex align-center text-subtitle-1">
                      <v-icon class="me-2" color="purple-darken-2">mdi-eye</v-icon>
                      Otherworldly Patron
                      <v-spacer />
                      <v-chip :color="!selectedPatron ? 'error' : 'purple-darken-2'" size="x-small" variant="outlined">
                        {{ !selectedPatron ? 'Required!' : 'Required' }}
                      </v-chip>
                    </v-card-title>
                    <v-card-text>
                      <div class="text-caption mb-3 text-medium-emphasis">
                        Choose the entity that grants you power
                      </div>
                      <v-select v-model="selectedPatron" :items="warlockPatrons" item-title="name" item-value="value"
                        label="Select your patron" density="compact" variant="outlined">
                        <template #item="{ props, item }">
                          <v-list-item v-bind="props">
                            <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
                            <v-list-item-subtitle class="text-caption">{{ item.raw.description }}</v-list-item-subtitle>
                          </v-list-item>
                        </template>
                      </v-select>
                    </v-card-text>
                  </v-card>
                </v-col>

                <!-- Druid Circle -->
                <v-col v-if="isDruid" cols="12" md="4">
                  <v-card class="feature-choice-card h-100" color="green-lighten-5" variant="tonal">
                    <v-card-title class="d-flex align-center text-subtitle-1">
                      <v-icon class="me-2" color="green-darken-2">mdi-tree</v-icon>
                      Druidic Circle
                      <v-spacer />
                      <v-chip :color="!selectedCircle ? 'error' : 'green-darken-2'" size="x-small" variant="outlined">
                        {{ !selectedCircle ? 'Required!' : 'Required' }}
                      </v-chip>
                    </v-card-title>
                    <v-card-text>
                      <div class="text-caption mb-3 text-medium-emphasis">
                        Choose your connection to nature
                      </div>
                      <v-select v-model="selectedCircle" :items="druidCircles" item-title="name" item-value="value"
                        label="Select your circle" density="compact" variant="outlined">
                        <template #item="{ props, item }">
                          <v-list-item v-bind="props">
                            <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
                            <v-list-item-subtitle class="text-caption">{{ item.raw.description }}</v-list-item-subtitle>
                          </v-list-item>
                        </template>
                      </v-select>
                    </v-card-text>
                  </v-card>
                </v-col>

                <!-- Cleric Domain -->
                <v-col v-if="isCleric" cols="12" md="4">
                  <v-card class="feature-choice-card h-100" color="blue-lighten-5" variant="tonal">
                    <v-card-title class="d-flex align-center text-subtitle-1">
                      <v-icon class="me-2" color="blue-darken-2">mdi-star-four-points</v-icon>
                      Divine Domain
                      <v-spacer />
                      <v-chip :color="!selectedDomain ? 'error' : 'blue-darken-2'" size="x-small" variant="outlined">
                        {{ !selectedDomain ? 'Required!' : 'Required' }}
                      </v-chip>
                    </v-card-title>
                    <v-card-text>
                      <div class="text-caption mb-3 text-medium-emphasis">
                        Choose your deity's sphere of influence
                      </div>
                      <v-select v-model="selectedDomain" :items="clericDomains" item-title="name" item-value="value"
                        label="Select your domain" density="compact" variant="outlined">
                        <template #item="{ props, item }">
                          <v-list-item v-bind="props">
                            <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
                            <v-list-item-subtitle class="text-caption">{{ item.raw.description }}</v-list-item-subtitle>
                          </v-list-item>
                        </template>
                      </v-select>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

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
                    <v-tooltip :text="`Based on ${skill.ability} modifier`" location="top">
                      <template v-slot:activator="{ props }">
                        <v-chip v-bind="props" color="primary" size="x-small">
                          {{ skill.ability }}
                        </v-chip>
                      </template>
                    </v-tooltip>
                    <v-tooltip :text="`Total bonus: ability modifier + proficiency bonus`" location="top">
                      <template v-slot:activator="{ props }">
                        <v-chip v-bind="props" class="ml-1" color="success" size="x-small">
                          +{{ calculateSkillBonus(skill) }}
                        </v-chip>
                      </template>
                    </v-tooltip>
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

const emit = defineEmits(['validation-changed'])

// Destructure for template access while maintaining reactivity
const { character, characterData } = toRefs(props)

const characterStore = useCharacterStore()

const selectedCantrips = ref([])
const selectedSpells = ref([])
const selectedLanguages = ref([])
const selectedTools = ref([])
const selectedFightingStyle = ref(null)
const selectedExpertiseSkills = ref([])

// Use character's selectedClassSkills instead of local ref
const selectedClassSkills = computed(() => character.value.selectedClassSkills || [])
const selectedPatron = ref(null)
const selectedCircle = ref(null)
const selectedDomain = ref(null)
const spellTab = ref(0)
const selectedCantripDetail = ref(null)
const selectedSpellDetail = ref(null)
const traitDetails = ref({})
const expandedTraits = ref({})
const expandedClassFeatures = ref({})

// Toggle function for custom trait accordion
const toggleTrait = (index) => {
  expandedTraits.value[index] = !expandedTraits.value[index]
}

// Toggle function for class features accordion
const toggleClassFeature = (index) => {
  expandedClassFeatures.value[index] = !expandedClassFeatures.value[index]
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

  // Format 3: Direct skills array
  if (character.value.backgroundDetails?.skills) {
    character.value.backgroundDetails.skills.forEach(skill => {
      const skillName = typeof skill === 'string' ? skill : skill.name
      backgroundSkills.push(skillName)
    })
  }

  // Format 4: For Soldier background specifically
  if (character.value.backgroundDetails?.name?.toLowerCase().includes('soldier') ||
    character.value.background?.toLowerCase().includes('soldier')) {
    backgroundSkills.push('Athletics', 'Intimidation')
  }

  // Add background skills to main list
  backgroundSkills.forEach(skillName => {
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

  // Add species/racial skills (Wood Elf gets Perception)
  if (character.value.speciesDetails) {
    const speciesName = character.value.speciesDetails.name || character.value.species

    // Wood Elf specific skills
    if (speciesName?.toLowerCase().includes('elf') || speciesName?.toLowerCase() === 'wood elf') {
      const perceptionSkill = allSkills.find(s => s.name === 'Perception')
      if (perceptionSkill && !skills.find(s => s.name === 'Perception')) {
        skills.push({
          ...perceptionSkill,
          source: 'Species (Wood Elf)'
        })
      }
    }
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
  // Official D&D 5e Rule: Expertise can only be chosen from skills you're already proficient in
  const currentProficiencies = getAllSkillProficiencies.value.map(skill => skill.name)

  // Return only skills the character is actually proficient in
  return currentProficiencies.sort()
})// Categorized skills by ability score (D&D 5e accurate)
const strengthSkills = computed(() => {
  const strength = ['Athletics']
  return availableExpertiseSkills.value.filter(skill => strength.includes(skill))
})

const dexteritySkills = computed(() => {
  const dexterity = ['Acrobatics', 'Sleight of Hand', 'Stealth']
  return availableExpertiseSkills.value.filter(skill => dexterity.includes(skill))
})

const intelligenceSkills = computed(() => {
  const intelligence = ['Arcana', 'History', 'Investigation', 'Nature', 'Religion']
  return availableExpertiseSkills.value.filter(skill => intelligence.includes(skill))
})

const constitutionSkills = computed(() => {
  // Constitution has no associated skills in D&D 5e
  return []
})

const wisdomSkills = computed(() => {
  const wisdom = ['Animal Handling', 'Insight', 'Medicine', 'Perception', 'Survival']
  return availableExpertiseSkills.value.filter(skill => wisdom.includes(skill))
})

const charismaSkills = computed(() => {
  const charisma = ['Deception', 'Intimidation', 'Performance', 'Persuasion']
  return availableExpertiseSkills.value.filter(skill => charisma.includes(skill))
})

// Check if an ability is important for the character's class
const isImportantAbility = (abilityName) => {
  if (!character.value.classDetails) return false

  // Get primary abilities for the class
  const primaryAbilities = character.value.classDetails.primary_ability ||
    character.value.classDetails.primaryAbility ||
    []

  // Handle both array and string formats
  const abilities = Array.isArray(primaryAbilities) ? primaryAbilities : [primaryAbilities]

  // Check if this ability is listed as primary
  return abilities.some(ability => {
    if (typeof ability === 'string') {
      return ability.toLowerCase() === abilityName.toLowerCase()
    }
    if (ability && ability.name) {
      return ability.name.toLowerCase() === abilityName.toLowerCase()
    }
    return false
  })
}

// Function to remove expertise skill
const removeExpertiseSkill = (skillToRemove) => {
  const index = selectedExpertiseSkills.value.indexOf(skillToRemove)
  if (index > -1) {
    selectedExpertiseSkills.value.splice(index, 1)
  }
}

// Function to toggle expertise skill selection
const toggleExpertiseSkill = (skill) => {
  const isSelected = selectedExpertiseSkills.value.includes(skill)

  if (isSelected) {
    // Remove the skill
    removeExpertiseSkill(skill)
  } else {
    // Add the skill if we haven't reached the limit
    if (selectedExpertiseSkills.value.length < expertiseChoices.value) {
      selectedExpertiseSkills.value.push(skill)
    }
  }
}

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

// Validation for required choices
const isValid = computed(() => {
  const errors = []

  // Fighting Style validation
  if (hasFightingStyle.value && !selectedFightingStyle.value) {
    errors.push('Fighting Style is required')
  }

  // Expertise validation
  if (hasExpertise.value && selectedExpertiseSkills.value.length < expertiseChoices.value) {
    errors.push(`Choose ${expertiseChoices.value} skills for Expertise`)
  }

  // Warlock Patron validation
  if (isWarlock.value && !selectedPatron.value) {
    errors.push('Warlock Patron is required')
  }

  // Druid Circle validation
  if (isDruid.value && !selectedCircle.value) {
    errors.push('Druid Circle is required')
  }

  // Cleric Domain validation
  if (isCleric.value && !selectedDomain.value) {
    errors.push('Cleric Domain is required')
  }

  return errors
})

const isStepValid = computed(() => isValid.value.length === 0)

// Watch for validation changes and emit to parent
watch(isStepValid, (newVal) => {
  emit('validation-changed', {
    step: 3,
    isValid: newVal,
    errors: isValid.value
  })
}, { immediate: true })

// Also watch individual selections to trigger validation updates
watch([selectedFightingStyle, selectedExpertiseSkills, selectedPatron, selectedCircle, selectedDomain], () => {
  // Force validation re-computation
}, { deep: true })
</script>

<style scoped>
.combat-stat-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.combat-card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 140px;
}

.list-item-spacer {
  opacity: 0;
  pointer-events: none;
}

.skill-selection {
  max-width: 100%;
}

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

.feature-header {
  transition: background-color 0.2s ease;
}

.feature-header:hover {
  background-color: rgba(var(--v-theme-primary), 0.1);
}

.feature-expanded {
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.class-features-accordion {
  border-radius: 4px;
}

.cursor-pointer {
  cursor: pointer;
}

.feature-choice-card {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.feature-choice-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.fighting-style-option {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.fighting-style-option .v-card-text {
  text-align: left !important;
  justify-content: flex-start !important;
}

.fighting-style-option .v-card-text>div {
  text-align: left !important;
}

.fighting-style-option .text-subtitle-2,
.fighting-style-option .text-caption {
  text-align: left !important;
}

.fighting-style-option .v-radio {
  margin: 0 !important;
  padding: 0 !important;
  min-width: auto !important;
  width: auto !important;
}

.fighting-style-option :deep(.v-selection-control) {
  margin: 0 !important;
  padding: 0 !important;
  min-height: auto !important;
  align-items: flex-start !important;
}

.fighting-style-option :deep(.v-selection-control__wrapper) {
  margin: 0 !important;
  padding: 0 !important;
  height: 20px !important;
  width: 20px !important;
}

.fighting-style-option .radio-container {
  width: 40px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: stretch;
}

.fighting-style-option .text-content {
  text-align: left;
  padding-left: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.fighting-style-option:hover {
  border-color: rgba(var(--v-theme-primary), 0.3);
  background-color: rgba(var(--v-theme-primary), 0.02);
}

.fighting-style-selected {
  border-color: var(--v-theme-primary) !important;
  background-color: rgba(var(--v-theme-primary), 0.05) !important;
}

.fighting-style-radios :deep(.v-selection-control-group) {
  flex-direction: column;
}

.expertise-skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.25rem;
  width: 100%;
}

.skill-category {
  padding: 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  overflow: hidden;
  min-width: 0;
  width: 100%;
}

.skill-category.primary-ability {
  border: 2px solid rgba(var(--v-theme-primary), 0.4);
  background-color: rgba(var(--v-theme-primary), 0.08);
  box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.15);
  transform: translateY(-1px);
}

.skill-category-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.skill-chips :deep(.v-chip-group) {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 8px;
  flex-direction: row !important;
}

.skill-chips :deep(.v-chip) {
  margin: 0 6px 0 0 !important;
  margin-bottom: 6px !important;
  flex-shrink: 0;
}

.skill-chips :deep(.v-selection-control-group) {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 8px;
  flex-direction: row !important;
}

/* Prevent horizontal scrolling */
.skill-chips {
  overflow: hidden;
  width: 100%;
}

/* Override Vuetify's default column behavior */
.skill-chips :deep(.v-chip-group--column) {
  flex-direction: row !important;
  flex-wrap: wrap !important;
}

@media (max-width: 960px) {
  .expertise-skills-grid {
    grid-template-columns: 1fr;
  }
}

.trait-accordion {
  border-radius: 4px;
}
</style>
