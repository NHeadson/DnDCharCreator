<template>
  <v-card flat>
    <v-card-title class="text-h4 text-center mb-6 text-primary">
      📝 Character Sheet
    </v-card-title>
    <v-card-subtitle class="text-center mb-8 text-h6">
      Complete character overview for {{ character.name || 'Your Character' }}
    </v-card-subtitle>
    <v-card-text>
      <!-- Character Header -->
      <v-card variant="outlined" class="mb-4">
        <v-card-text class="pa-4">
          <v-row>
            <v-col cols="12" md="8">
              <div class="text-h4 mb-2">{{ character.name || 'Unnamed Character' }}</div>
              <div class="text-h6 mb-2 text-primary">
                Level {{ character.level }}
                {{ character.classDetails?.name || character.class || 'Unknown Class' }}
                <span v-if="character.subclass" class="text-secondary">({{ character.subclass }})</span>
              </div>
              <div class="text-subtitle-1 mb-2">
                {{ character.speciesDetails?.name || character.species || 'Unknown Species' }}
                <span v-if="character.speciesLineage" class="text-primary">({{ character.speciesLineage }})</span>
                • {{ character.backgroundDetails?.name || character.background || 'Unknown Background' }}
              </div>
              <div class="text-body-1">
                {{ character.alignment || 'Unaligned' }}
              </div>
            </v-col>
            <v-col cols="12" md="4" class="text-center">
              <v-avatar size="120" color="primary">
                <v-icon size="60">mdi-account</v-icon>
              </v-avatar>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Core Stats -->
      <v-row>
        <v-col cols="12" md="4">
          <!-- Ability Scores -->
          <v-card variant="outlined" class="mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon class="me-2" color="blue">mdi-trending-up</v-icon>
              Ability Scores
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col v-for="(score, ability) in character.abilityScores" :key="ability" cols="6">
                  <v-card class="text-center pa-2" color="blue-lighten-5" flat>
                    <div class="text-caption text-blue-darken-2">{{ ability.toUpperCase() }}</div>
                    <div class="text-h6 font-weight-bold">{{ score.score }}</div>
                    <div class="text-caption">{{ score.modifier >= 0 ? '+' : '' }}{{ score.modifier }}</div>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Core Info -->
          <v-card variant="outlined" class="mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon class="me-2" color="green">mdi-information</v-icon>
              Core Info
            </v-card-title>
            <v-card-text>
              <div class="mb-2"><strong>Hit Points:</strong> {{ character.classDetails?.hitDie || 8 }} + CON modifier
              </div>
              <div class="mb-2"><strong>Size:</strong> {{ character.speciesDetails?.size || 'Medium' }}</div>
              <div class="mb-2"><strong>Speed:</strong> {{ character.speciesDetails?.speed || 30 }} ft</div>
              <div v-if="character.speciesDetails?.darkvision" class="mb-2">
                <strong>Darkvision:</strong> {{ character.speciesDetails.darkvision }} ft
              </div>
              <div class="mb-2"><strong>Proficiency Bonus:</strong> +{{ character.proficiencyBonus }}</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="8">
          <!-- Proficiencies -->
          <v-card variant="outlined" class="mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon class="me-2" color="orange">mdi-shield-star</v-icon>
              Proficiencies & Training
            </v-card-title>
            <v-card-text>
              <v-row>
                <!-- Saving Throws -->
                <v-col v-if="character.classDetails?.savingThrows?.length" cols="12" sm="6">
                  <div class="text-subtitle-2 mb-1">Saving Throws:</div>
                  <v-chip-group>
                    <v-chip v-for="save in character.classDetails.savingThrows" :key="save" color="success" size="small"
                      variant="flat">
                      {{ save }}
                    </v-chip>
                  </v-chip-group>
                </v-col>

                <!-- Armor Training -->
                <v-col v-if="character.classDetails?.armorTraining" cols="12" sm="6">
                  <div class="text-subtitle-2 mb-1">Armor Training:</div>
                  <v-chip-group>
                    <v-chip v-if="character.classDetails.armorTraining.light" color="blue" size="small"
                      variant="flat">Light</v-chip>
                    <v-chip v-if="character.classDetails.armorTraining.medium" color="blue" size="small"
                      variant="flat">Medium</v-chip>
                    <v-chip v-if="character.classDetails.armorTraining.heavy" color="blue" size="small"
                      variant="flat">Heavy</v-chip>
                    <v-chip v-if="character.classDetails.armorTraining.shields" color="blue" size="small"
                      variant="flat">Shields</v-chip>
                  </v-chip-group>
                </v-col>

                <!-- Languages -->
                <v-col cols="12">
                  <div class="text-subtitle-2 mb-1">Languages:</div>
                  <v-chip-group>
                    <v-chip v-for="lang in allLanguages" :key="lang" color="indigo" size="small" variant="flat">
                      {{ lang }}
                    </v-chip>
                  </v-chip-group>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Weapons & Cantrips -->
          <v-card v-if="character.weapons?.length || character.damagingCantrips?.length" variant="outlined"
            class="mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon class="me-2" color="red">mdi-sword</v-icon>
              Combat Options
            </v-card-title>
            <v-card-text>
              <v-row v-if="character.weapons?.length">
                <v-col cols="12">
                  <div class="text-subtitle-2 mb-2">Weapons:</div>
                  <v-chip-group>
                    <v-chip v-for="weapon in character.weapons" :key="weapon.name" color="red" size="small"
                      variant="outlined">
                      {{ weapon.name }} ({{ weapon.damage }})
                    </v-chip>
                  </v-chip-group>
                </v-col>
              </v-row>
              <v-row v-if="character.damagingCantrips?.length">
                <v-col cols="12">
                  <div class="text-subtitle-2 mb-2">Damage Cantrips:</div>
                  <v-chip-group>
                    <v-chip v-for="cantrip in character.damagingCantrips" :key="cantrip.name" color="purple"
                      size="small" variant="outlined">
                      {{ cantrip.name }} ({{ cantrip.damage }})
                    </v-chip>
                  </v-chip-group>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Feats -->
          <v-card v-if="character.feats?.length" variant="outlined" class="mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon class="me-2" color="teal">mdi-medal</v-icon>
              Feats
            </v-card-title>
            <v-card-text>
              <v-chip-group>
                <v-chip v-for="feat in character.feats" :key="feat.name" color="teal" size="small" variant="flat">
                  {{ feat.name }}
                </v-chip>
              </v-chip-group>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Features and Traits -->
      <v-row>
        <v-col cols="12" md="6">
          <!-- Species Traits -->
          <v-card v-if="character.speciesDetails?.traits?.length" variant="outlined" class="mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon class="me-2" color="green">mdi-leaf</v-icon>
              Species Traits
            </v-card-title>
            <v-card-text>
              <v-expansion-panels variant="accordion" density="compact">
                <v-expansion-panel v-for="trait in character.speciesDetails.traits" :key="trait.name">
                  <v-expansion-panel-title class="text-subtitle-2">
                    {{ trait.name }}
                  </v-expansion-panel-title>
                  <v-expansion-panel-text class="text-body-2">
                    {{ trait.description }}
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
          </v-card>

          <!-- Class Features -->
          <v-card v-if="character.classDetails?.features?.length" variant="outlined" class="mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon class="me-2" color="blue">mdi-star-circle</v-icon>
              Class Features
            </v-card-title>
            <v-card-text>
              <v-expansion-panels variant="accordion" density="compact">
                <v-expansion-panel v-for="feature in character.classDetails.features" :key="feature.name">
                  <v-expansion-panel-title class="text-subtitle-2">
                    {{ feature.name }}
                  </v-expansion-panel-title>
                  <v-expansion-panel-text class="text-body-2">
                    {{ feature.description }}
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <!-- Personality -->
          <v-card v-if="hasPersonality" variant="outlined" class="mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon class="me-2" color="deep-purple">mdi-account-details</v-icon>
              Personality
            </v-card-title>
            <v-card-text>
              <div v-if="character.personality?.traits?.length" class="mb-3">
                <div class="text-subtitle-2 mb-1">Traits:</div>
                <v-chip-group>
                  <v-chip v-for="trait in character.personality.traits" :key="trait" color="pink" size="small"
                    variant="outlined">
                    {{ trait }}
                  </v-chip>
                </v-chip-group>
              </div>

              <div v-if="character.personality?.ideals?.length" class="mb-3">
                <div class="text-subtitle-2 mb-1">Ideals:</div>
                <v-chip-group>
                  <v-chip v-for="ideal in character.personality.ideals" :key="ideal" color="blue" size="small"
                    variant="outlined">
                    {{ ideal }}
                  </v-chip>
                </v-chip-group>
              </div>

              <div v-if="character.personality?.bonds?.length" class="mb-3">
                <div class="text-subtitle-2 mb-1">Bonds:</div>
                <v-chip-group>
                  <v-chip v-for="bond in character.personality.bonds" :key="bond" color="orange" size="small"
                    variant="outlined">
                    {{ bond }}
                  </v-chip>
                </v-chip-group>
              </div>

              <div v-if="character.personality?.flaws?.length">
                <div class="text-subtitle-2 mb-1">Flaws:</div>
                <v-chip-group>
                  <v-chip v-for="flaw in character.personality.flaws" :key="flaw" color="red" size="small"
                    variant="outlined">
                    {{ flaw }}
                  </v-chip>
                </v-chip-group>
              </div>
            </v-card-text>
          </v-card>

          <!-- Equipment & Coins -->
          <v-card v-if="character.equipment?.length || hasCoins" variant="outlined" class="mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon class="me-2" color="amber">mdi-treasure-chest</v-icon>
              Equipment & Wealth
            </v-card-title>
            <v-card-text>
              <div v-if="character.equipment?.length" class="mb-3">
                <div class="text-subtitle-2 mb-1">Equipment:</div>
                <v-chip-group>
                  <v-chip v-for="item in character.equipment" :key="item.name" color="brown" size="small"
                    variant="outlined">
                    {{ item.name }} {{ item.quantity > 1 ? `(${item.quantity})` : '' }}
                  </v-chip>
                </v-chip-group>
              </div>

              <div v-if="hasCoins">
                <div class="text-subtitle-2 mb-1">Coins:</div>
                <div class="d-flex flex-wrap">
                  <div v-if="character.coins.pp" class="me-3 text-body-2">{{ character.coins.pp }} pp</div>
                  <div v-if="character.coins.gp" class="me-3 text-body-2">{{ character.coins.gp }} gp</div>
                  <div v-if="character.coins.ep" class="me-3 text-body-2">{{ character.coins.ep }} ep</div>
                  <div v-if="character.coins.sp" class="me-3 text-body-2">{{ character.coins.sp }} sp</div>
                  <div v-if="character.coins.cp" class="me-3 text-body-2">{{ character.coins.cp }} cp</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Backstory -->
      <v-card v-if="character.backstory" variant="outlined" class="mb-4">
        <v-card-title class="d-flex align-center">
          <v-icon class="me-2" color="brown">mdi-book-open-page-variant</v-icon>
          Backstory
        </v-card-title>
        <v-card-text>
          <div class="text-body-1">{{ character.backstory }}</div>
        </v-card-text>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

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

// Computed properties for conditional display
const allLanguages = computed(() => {
  const languages = new Set()

  // Add species languages
  if (props.character.speciesDetails?.languages) {
    props.character.speciesDetails.languages.forEach(lang => languages.add(lang))
  }

  // Add background languages
  if (props.character.backgroundDetails?.languages) {
    props.character.backgroundDetails.languages.forEach(lang => languages.add(lang))
  }

  // Add additional languages
  if (props.character.additionalLanguages) {
    props.character.additionalLanguages.forEach(lang => languages.add(lang))
  }

  return Array.from(languages)
})

const hasPersonality = computed(() => {
  const p = props.character.personality
  return p && (
    (p.traits && p.traits.length) ||
    (p.ideals && p.ideals.length) ||
    (p.bonds && p.bonds.length) ||
    (p.flaws && p.flaws.length)
  )
})

const hasCoins = computed(() => {
  const coins = props.character.coins
  return coins && (coins.pp || coins.gp || coins.ep || coins.sp || coins.cp)
})
</script>

<style scoped>
:deep(.v-expansion-panel-title) {
  min-height: 36px;
  padding: 8px 16px;
}

:deep(.v-expansion-panel-text__wrapper) {
  padding: 8px 16px;
}

:deep(.v-chip-group .v-chip) {
  margin: 2px;
}
</style>
