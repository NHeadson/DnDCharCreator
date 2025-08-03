<template>
  <v-card flat>
    <!-- Hero Section -->
    <div class="hero-section text-center mb-8">
      <div class="character-avatar-section mb-4">
        <v-avatar size="120" color="primary" class="elevation-4">
          <v-icon size="60">mdi-account</v-icon>
        </v-avatar>
      </div>

      <div class="character-title-section">
        <h1 class="text-h3 font-weight-bold mb-2">{{ character.name || 'Unnamed Character' }}</h1>
        <div class="character-subtitle text-h6 text-primary mb-3">
          Level {{ character.level }}
          {{ character.classDetails?.name || character.class || 'Unknown Class' }}
          <span v-if="character.subclass" class="text-secondary">({{ character.subclass }})</span>
        </div>
        <div class="character-details text-h6 mb-2">
          <v-chip color="secondary" variant="outlined" class="me-2">
            {{ character.speciesDetails?.name || character.species || 'Unknown Species' }}
            <span v-if="character.speciesLineage">&nbsp;({{ character.speciesLineage }})</span>
          </v-chip>
          <v-chip color="tertiary" variant="outlined">
            {{ character.backgroundDetails?.name || character.background || 'Unknown Background' }}
          </v-chip>
        </div>
        <div class="character-alignment">
          <v-chip color="surface-variant" size="small">
            {{ character.alignment || 'Unaligned' }}
          </v-chip>
        </div>
      </div>
    </div>

    <v-card-text class="px-0">

      <!-- Quick Stats Overview -->
      <v-row class="mb-6">
        <v-col cols="12">
          <v-card variant="tonal" color="primary" class="stats-overview">
            <v-card-title class="d-flex align-center justify-center">
              <v-icon class="me-2">mdi-chart-line</v-icon>
              Quick Stats
            </v-card-title>
            <v-card-text>
              <v-row class="text-center">
                <v-col cols="6" sm="3">
                  <div class="stat-block">
                    <div class="stat-value text-h4">{{ character.classDetails?.hitDie || 8 }}</div>
                    <div class="stat-label">Hit Die</div>
                  </div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="stat-block">
                    <div class="stat-value text-h4">{{ character.speciesDetails?.speed || 30 }}</div>
                    <div class="stat-label">Speed (ft)</div>
                  </div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="stat-block">
                    <div class="stat-value text-h4">+{{ character.proficiencyBonus || 2 }}</div>
                    <div class="stat-label">Proficiency</div>
                  </div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="stat-block">
                    <div class="stat-value text-h4">{{ character.speciesDetails?.size || 'M' }}</div>
                    <div class="stat-label">Size</div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Main Content Grid -->
      <v-row>
        <!-- Left Column - Proficiencies & Species Traits -->
        <v-col cols="12" lg="4">
          <!-- Proficiencies & Training -->
          <v-card class="section-card mb-4" variant="outlined">
            <v-card-title class="section-title">
              <v-icon class="me-2" color="success">mdi-school</v-icon>
              Proficiencies
            </v-card-title>
            <v-card-text class="pa-3">
              <!-- Saving Throws -->
              <div v-if="character.classDetails?.savingThrows?.length" class="mb-3">
                <div class="subsection-title mb-2">🛡️ Saving Throws</div>
                  <v-chip v-for="save in character.classDetails.savingThrows" :key="save"
                    class="mx-1" color="success" size="small"
                    variant="tonal">
                    {{ save }}
                  </v-chip>
              </div>

              <!-- Armor Training -->
              <div v-if="character.classDetails?.armorTraining" class="mb-3">
                <div class="subsection-title mb-2">🛡️ Armor Training</div>
                  <v-chip v-if="character.classDetails.armorTraining.light" class="me-2" color="info" size="small" variant="tonal">
                    Light Armor
                  </v-chip>
                  <v-chip v-if="character.classDetails.armorTraining.medium" class="me-2" color="info" size="small" variant="tonal">
                    Medium Armor
                  </v-chip>
                  <v-chip v-if="character.classDetails.armorTraining.heavy" class="me-2" color="info" size="small" variant="tonal">
                    Heavy Armor
                  </v-chip>
                  <v-chip v-if="character.classDetails.armorTraining.shields" class="me-2" color="info" size="small" variant="tonal">
                    Shields
                  </v-chip>
              </div>

              <!-- Languages -->
              <div v-if="allLanguages.length">
                <div class="subsection-title mb-2">🗣️ Languages</div>
                  <v-chip v-for="lang in allLanguages" :key="lang" class="me-2" color="secondary" size="small" variant="tonal">
                    {{ lang }}
                  </v-chip>
              </div>
            </v-card-text>
          </v-card>

          <!-- Species Traits -->
          <v-card v-if="character.speciesDetails?.traits?.length" class="section-card mb-4" variant="outlined">
            <v-card-title class="section-title">
              <v-icon class="me-2" color="teal">mdi-dna</v-icon>
              Species Traits
            </v-card-title>
            <v-card-text class="pa-0">
              <v-expansion-panels variant="accordion" class="trait-panels">
                <v-expansion-panel v-for="trait in character.speciesDetails.traits" :key="trait.name"
                  class="trait-panel">
                  <v-expansion-panel-title class="pa-3">
                    <span class="font-weight-medium">{{ trait.name }}</span>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text class="trait-description pa-3">
                    <div class="text-body-2">{{ trait.description }}</div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Center Column - Ability Scores & Combat Options & Class Features -->
        <v-col cols="12" lg="4">
          <!-- Ability Scores -->
          <v-card class="section-card mb-4" variant="outlined">
            <v-card-title class="section-title">
              <v-icon class="me-2" color="primary">mdi-dice-6</v-icon>
              Ability Scores
            </v-card-title>
            <v-card-text class="pa-3">
              <v-row dense>
                <v-col v-for="(score, ability) in character.abilityScores" :key="ability" cols="6">
                  <v-card class="ability-score-card text-center pa-3" variant="outlined">
                    <div class="ability-name text-caption font-weight-bold">{{ ability.toUpperCase() }}</div>
                    <div class="ability-score text-h5 font-weight-bold my-1">{{ score.score }}</div>
                    <div class="ability-modifier text-caption">
                      {{ score.modifier >= 0 ? '+' : '' }}{{ score.modifier }}
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Combat Info -->
          <v-card v-if="character.weapons?.length || character.damagingCantrips?.length" class="section-card mb-4"
            variant="outlined">
            <v-card-title class="section-title">
              <v-icon class="me-2" color="error">mdi-sword-cross</v-icon>
              Combat Options
            </v-card-title>
            <v-card-text class="pa-3">
              <div v-if="character.weapons?.length" class="mb-3">
                <div class="subsection-title mb-2">⚔️ Weapons</div>
                <div class="weapon-grid">
                  <v-card v-for="weapon in character.weapons" :key="weapon.name" class="weapon-card pa-2 mb-2"
                    variant="outlined" density="compact">
                    <div class="weapon-name font-weight-medium">{{ weapon.name }}</div>
                    <div class="weapon-damage text-caption text-medium-emphasis">{{ weapon.damage }}</div>
                  </v-card>
                </div>
              </div>

              <div v-if="character.damagingCantrips?.length">
                <div class="subsection-title mb-2">✨ Damage Cantrips</div>
                <div class="cantrip-grid">
                  <v-card v-for="cantrip in character.damagingCantrips" :key="cantrip.name"
                    class="cantrip-card pa-2 mb-2" variant="outlined" density="compact">
                    <div class="cantrip-name font-weight-medium">{{ cantrip.name }}</div>
                    <div class="cantrip-damage text-caption text-medium-emphasis">{{ cantrip.damage }}</div>
                  </v-card>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Class Features -->
          <v-card v-if="character.classDetails?.features?.length" class="section-card mb-4" variant="outlined">
            <v-card-title class="section-title">
              <v-icon class="me-2" color="warning">mdi-star</v-icon>
              Class Features
            </v-card-title>
            <v-card-text class="pa-0">
              <v-expansion-panels variant="accordion" class="trait-panels">
                <v-expansion-panel v-for="feature in character.classDetails.features" :key="feature.name"
                  class="trait-panel">
                  <v-expansion-panel-title class="pa-3">
                    <span class="font-weight-medium">{{ feature.name }}</span>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text class="trait-description pa-3">
                    <div class="text-body-2">{{ feature.description }}</div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Right Column - Feats & Personality -->
        <v-col cols="12" lg="4">
          <!-- Feats -->
          <v-card v-if="character.feats?.length" class="section-card mb-4" variant="outlined">
            <v-card-title class="section-title">
              <v-icon class="me-2" color="purple">mdi-medal</v-icon>
              Feats
            </v-card-title>
            <v-card-text class="pa-3">
              <v-chip-group density="compact">
                <v-chip v-for="feat in character.feats" :key="feat.name" color="purple" size="small" variant="tonal">
                  {{ feat.name }}
                </v-chip>
              </v-chip-group>
            </v-card-text>
          </v-card>

          <!-- Personality & Roleplay -->
          <v-card v-if="hasPersonality" class="section-card mb-4" variant="outlined">
            <v-card-title class="section-title">
              <v-icon class="me-2" color="pink">mdi-heart</v-icon>
              Personality
            </v-card-title>
            <v-card-text class="pa-3">
              <div v-if="character.personality?.traits?.length" class="personality-section mb-4">
                <div class="subsection-title mb-2">✨ Personality Traits</div>
                <div class="personality-items">
                  <v-chip v-for="trait in character.personality.traits" :key="trait" class="personality-chip ma-1"
                    color="pink" size="small" variant="tonal">
                    {{ trait }}
                  </v-chip>
                </div>
              </div>

              <div v-if="character.personality?.ideals?.length" class="personality-section mb-4">
                <div class="subsection-title mb-2">🎯 Ideals</div>
                <div class="personality-items">
                  <v-chip v-for="ideal in character.personality.ideals" :key="ideal" class="personality-chip ma-1"
                    color="blue" size="small" variant="tonal">
                    {{ ideal }}
                  </v-chip>
                </div>
              </div>

              <div v-if="character.personality?.bonds?.length" class="personality-section mb-4">
                <div class="subsection-title mb-2">🔗 Bonds</div>
                <div class="personality-items">
                  <v-chip v-for="bond in character.personality.bonds" :key="bond" class="personality-chip ma-1"
                    color="orange" size="small" variant="tonal">
                    {{ bond }}
                  </v-chip>
                </div>
              </div>

              <div v-if="character.personality?.flaws?.length" class="personality-section">
                <div class="subsection-title mb-2">⚠️ Flaws</div>
                <div class="personality-items">
                  <v-chip v-for="flaw in character.personality.flaws" :key="flaw" class="personality-chip ma-1"
                    color="red" size="small" variant="tonal">
                    {{ flaw }}
                  </v-chip>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Equipment & Wealth -->
          <v-card v-if="hasEquipment || hasCoins" class="section-card mb-4" variant="outlined">
            <v-card-title class="section-title">
              <v-icon class="me-2" color="amber">mdi-treasure-chest</v-icon>
              Equipment & Wealth
            </v-card-title>
            <v-card-text class="pa-3">
              <!-- Equipment by Category -->
              <div v-if="hasEquipment" class="mb-4">
                <div v-if="equipmentSummary.weapons.length" class="mb-3">
                  <div class="subsection-title mb-2">⚔️ Weapons ({{ equipmentSummary.weapons.length }})</div>
                  <div class="equipment-grid">
                    <v-chip v-for="weapon in equipmentSummary.weapons" :key="weapon.name || weapon" color="red"
                      size="small" variant="tonal" class="ma-1">
                      {{ weapon.name || weapon }}
                    </v-chip>
                  </div>
                </div>

                <div v-if="equipmentSummary.armor.length" class="mb-3">
                  <div class="subsection-title mb-2">🛡️ Armor ({{ equipmentSummary.armor.length }})</div>
                  <div class="equipment-grid">
                    <v-chip v-for="armor in equipmentSummary.armor" :key="armor.name || armor" color="blue" size="small"
                      variant="tonal" class="ma-1">
                      {{ armor.name || armor }}
                    </v-chip>
                  </div>
                </div>

                <div v-if="equipmentSummary.tools.length" class="mb-3">
                  <div class="subsection-title mb-2">🔧 Tools ({{ equipmentSummary.tools.length }})</div>
                  <div class="equipment-grid">
                    <v-chip v-for="tool in equipmentSummary.tools" :key="tool.name || tool" color="green" size="small"
                      variant="tonal" class="ma-1">
                      {{ tool.name || tool }}
                    </v-chip>
                  </div>
                </div>

                <div v-if="equipmentSummary.gear.length" class="mb-3">
                  <div class="subsection-title mb-2">🎒 Gear ({{ equipmentSummary.gear.length }})</div>
                  <div class="equipment-grid">
                    <v-chip v-for="item in equipmentSummary.gear" :key="item.name || item" color="orange" size="small"
                      variant="tonal" class="ma-1">
                      {{ item.name || item }}
                    </v-chip>
                  </div>
                </div>
              </div>

              <!-- Coins -->
              <div v-if="hasCoins" class="coins-section">
                <div class="subsection-title mb-2">💰 Currency</div>
                <div class="coins-display d-flex flex-wrap">
                  <v-chip v-if="character.coins.pp" color="purple" size="small" variant="tonal" class="ma-1">
                    {{ character.coins.pp }} Platinum
                  </v-chip>
                  <v-chip v-if="character.coins.gp" color="yellow-darken-2" size="small" variant="outlined"
                    class="ma-1">
                    {{ character.coins.gp }} Gold
                  </v-chip>
                  <v-chip v-if="character.coins.ep" color="blue-grey" size="small" variant="outlined" class="ma-1">
                    {{ character.coins.ep }} Electrum
                  </v-chip>
                  <v-chip v-if="character.coins.sp" color="grey" size="small" variant="outlined" class="ma-1">
                    {{ character.coins.sp }} Silver
                  </v-chip>
                  <v-chip v-if="character.coins.cp" color="brown" size="small" variant="outlined" class="ma-1">
                    {{ character.coins.cp }} Copper
                  </v-chip>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Special Abilities -->
          <v-card v-if="character.speciesDetails?.darkvision" class="section-card mb-4" variant="outlined">
            <v-card-title class="section-title">
              <v-icon class="me-2" color="indigo">mdi-eye</v-icon>
              Special Senses
            </v-card-title>
            <v-card-text class="pa-3">
              <div class="special-sense-item d-flex align-center mb-2">
                <v-icon color="indigo" class="me-2">mdi-weather-night</v-icon>
                <span class="font-weight-medium">Darkvision:</span>
                <span class="ml-2">{{ character.speciesDetails.darkvision }} feet</span>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Features Row (Species and Class combined) -->
      <v-row v-if="!character.speciesDetails?.traits?.length && !character.classDetails?.features?.length">
        <!-- This row is hidden since traits moved to left column and class features to center -->
      </v-row>

      <!-- Backstory Section -->
      <v-row v-if="character.backstory">
        <v-col cols="12">
          <v-card class="section-card" variant="outlined">
            <v-card-title class="section-title">
              <v-icon class="me-2" color="brown">mdi-book-open-page-variant</v-icon>
              Character Backstory
            </v-card-title>
            <v-card-text class="pa-4">
              <div class="backstory-content text-body-1">
                {{ character.backstory }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

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

// Computed properties for conditional display
const allLanguages = computed(() => {
  const languages = new Set()

  // Add species languages
  if (character.value.speciesDetails?.languages) {
    character.value.speciesDetails.languages.forEach(lang => languages.add(lang))
  }

  // Add background languages
  if (character.value.backgroundDetails?.languages) {
    character.value.backgroundDetails.languages.forEach(lang => languages.add(lang))
  }

  // Add additional languages
  if (character.value.additionalLanguages) {
    character.value.additionalLanguages.forEach(lang => languages.add(lang))
  }

  return Array.from(languages)
})

const hasPersonality = computed(() => {
  const p = character.value.personality
  return p && (
    (p.traits && p.traits.length) ||
    (p.ideals && p.ideals.length) ||
    (p.bonds && p.bonds.length) ||
    (p.flaws && p.flaws.length)
  )
})

const hasCoins = computed(() => {
  const coins = character.value.coins
  return coins && (coins.pp || coins.gp || coins.ep || coins.sp || coins.cp)
})

// Equipment organization
const equipmentSummary = computed(() => {
  const equipment = character.value.equipment || {}
  return {
    weapons: equipment.weapons || [],
    armor: equipment.armor || [],
    tools: equipment.tools || [],
    gear: equipment.gear || []
  }
})

const hasEquipment = computed(() => {
  const summary = equipmentSummary.value
  return summary.weapons.length || summary.armor.length || summary.tools.length || summary.gear.length
})
</script>
<style scoped>
/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.1), rgba(var(--v-theme-secondary), 0.05));
  border-radius: 16px;
  padding: 32px 24px;
  margin-bottom: 24px;
}

.character-avatar-section {
  position: relative;
}

.character-title-section {
  max-width: 600px;
  margin: 0 auto;
}

.character-subtitle {
  font-weight: 500;
}

.character-details .v-chip {
  font-size: 0.875rem;
  font-weight: 500;
}

/* Stats Overview */
.stats-overview {
  border-radius: 12px;
  overflow: hidden;
}

.stat-block {
  padding: 8px;
}

.stat-value {
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: rgb(var(--v-theme-on-surface-variant));
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Section Cards */
.section-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.section-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.section-title {
  background-color: rgba(var(--v-theme-surface), 0.8);
  border-bottom: 1px solid rgba(var(--v-theme-outline), 0.2);
  padding: 16px 20px;
  font-weight: 600;
  font-size: 1.1rem;
}

.subsection-title {
  font-weight: 600;
  font-size: 0.875rem;
  color: rgb(var(--v-theme-primary));
  display: flex;
  align-items: center;
}

/* Ability Scores */
.ability-score-card {
  border-radius: 8px;
  transition: all 0.2s ease;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: rgb(var(--v-theme-surface)) !important;
  border: 1px solid rgba(var(--v-theme-outline), 0.3);
}

.ability-score-card:hover {
  transform: scale(1.05);
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.2);
}

.ability-name {
  color: rgb(var(--v-theme-primary));
  font-weight: 700;
  letter-spacing: 0.5px;
}

.ability-score {
  color: rgb(var(--v-theme-on-surface));
  line-height: 1;
  font-weight: 800;
}

.ability-modifier {
  color: rgb(var(--v-theme-on-surface-variant));
  font-weight: 600;
}

/* Combat Options */
.weapon-grid,
.cantrip-grid {
  display: grid;
  gap: 8px;
}

.weapon-card,
.cantrip-card {
  border-radius: 8px;
  transition: all 0.2s ease;
  border-color: rgba(var(--v-theme-outline), 0.3);
}

.weapon-card:hover,
.cantrip-card:hover {
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.2);
}

.weapon-name,
.cantrip-name {
  font-size: 0.875rem;
  line-height: 1.2;
}

.weapon-damage,
.cantrip-damage {
  font-size: 0.75rem;
}

/* Traits and Features */
.trait-panels {
  border-radius: 0;
}

.trait-panel {
  border: none !important;
}

.trait-title {
  background-color: rgba(var(--v-theme-surface-variant), 0.5);
  min-height: 48px !important;
  font-size: 0.9rem;
}

.trait-description {
  border-top: 1px solid rgba(var(--v-theme-outline), 0.2);
  background-color: rgba(var(--v-theme-surface), 0.8);
}

/* Personality Section */
.personality-section {
  border-left: 3px solid rgba(var(--v-theme-primary), 0.3);
  padding-left: 12px;
}

.personality-items {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.personality-chip {
  max-width: 100%;
  height: auto !important;
  white-space: normal;
  font-size: 0.75rem;
}

/* Equipment Section */
.equipment-section {
  background-color: rgba(var(--v-theme-surface-variant), 0.3);
  border-radius: 8px;
  padding: 12px;
}

.equipment-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.coins-section {
  background-color: rgba(var(--v-theme-warning), 0.1);
  border-radius: 8px;
  padding: 12px;
  border: 1px solid rgba(var(--v-theme-warning), 0.3);
}

.coins-display {
  gap: 4px;
}

/* Special Senses */
.special-sense-item {
  background-color: rgba(var(--v-theme-indigo), 0.1);
  border-radius: 8px;
  padding: 8px 12px;
}

/* Backstory */
.backstory-content {
  line-height: 1.6;
  font-size: 1rem;
  background-color: rgba(var(--v-theme-surface-variant), 0.3);
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid rgb(var(--v-theme-primary));
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .hero-section {
    padding: 24px 16px;
  }

  .section-title {
    padding: 12px 16px;
    font-size: 1rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }
}

/* Enhanced chip styling */
:deep(.v-chip) {
  transition: all 0.2s ease;
}

:deep(.v-chip:hover) {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Expansion panel improvements */
:deep(.v-expansion-panel-title) {
  transition: all 0.2s ease;
}

:deep(.v-expansion-panel--active .v-expansion-panel-title) {
  color: rgb(var(--v-theme-primary));
}

/* Card hover effects */
:deep(.v-card) {
  transition: all 0.3s ease;
}
</style>
