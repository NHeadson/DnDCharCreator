<template>
  <v-card flat>
    <!-- Hero Section -->
    <div class="hero-section text-center mb-8">
      <div class="character-avatar-section mb-4">
        <v-avatar class="elevation-4" color="primary" size="120">
          <v-icon size="60">mdi-account</v-icon>
        </v-avatar>
      </div>

      <div class="character-title-section">
        <h1 class="text-h3 font-weight-bold mb-2">{{ character.name || 'Unnamed Character' }}</h1>
        <div class="character-subtitle text-h6 text-primary mb-3">
          Level {{ character.level }}
        </div>
        <div class="character-details text-h6 mb-2">
          <v-chip class="me-2" color="secondary" variant="outlined">
            {{ character.speciesDetails?.name || character.species || 'Unknown Species' }}
            <span v-if="character.speciesLineage">&nbsp;({{ character.speciesLineage }})</span>
          </v-chip>
          <v-chip class="me-2" color="primary" variant="outlined">
            {{ character.classDetails?.name || character.class || 'Unknown Class' }}
            <span v-if="character.subclass" class="text-secondary">&nbsp;({{ character.subclass }})</span>
          </v-chip>
          <v-chip color="tertiary" variant="outlined">
            {{ capitalizeFirst(character.backgroundDetails?.name || character.background || 'Unknown Background') }}
          </v-chip>
        </div>
        <div class="character-alignment">
          <v-chip color="surface-variant" variant="outlined">
            {{ character.alignment || 'Unaligned' }}
          </v-chip>
        </div>
      </div>
    </div>

    <v-card-text class="px-0">

      <!-- Quick Stats Overview -->
      <v-row class="mb-6">
        <v-col cols="12">
          <v-card class="stats-overview" color="primary" variant="tonal">
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
      <v-row class="ma-0">
        <!-- Left Column - Proficiencies, Species Traits & Class Features -->
        <v-col cols="12" lg="4" md="4" class="order-3 order-lg-1">
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
                <v-chip v-for="save in character.classDetails.savingThrows" :key="save" class="ma-1" color="success"
                  size="default" variant="tonal">
                  {{ save }}
                </v-chip>
              </div>

              <!-- Armor Training -->
              <div v-if="character.classDetails?.armorTraining" class="mb-3">
                <div class="subsection-title mb-2">🛡️ Armor Training</div>
                <v-chip v-if="character.classDetails.armorTraining.light" class="ma-1" color="info" size="default"
                  variant="tonal">
                  Light Armor
                </v-chip>
                <v-chip v-if="character.classDetails.armorTraining.medium" class="ma-1" color="info" size="default"
                  variant="tonal">
                  Medium Armor
                </v-chip>
                <v-chip v-if="character.classDetails.armorTraining.heavy" class="ma-1" color="info" size="default"
                  variant="tonal">
                  Heavy Armor
                </v-chip>
                <v-chip v-if="character.classDetails.armorTraining.shields" class="ma-1" color="info" size="default"
                  variant="tonal">
                  Shields
                </v-chip>
              </div>

              <!-- Languages -->
              <div v-if="allLanguages.length">
                <div class="subsection-title mb-2">🗣️ Languages</div>
                <v-chip v-for="lang in allLanguages" :key="lang" class="ma-1" color="secondary" size="default"
                  variant="tonal">
                  {{ lang }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>

          <!-- Species Traits -->
          <v-card v-if="enhancedSpeciesTraits.length" class="section-card mb-4" variant="outlined">
            <v-card-title class="section-title">
              <v-icon class="me-2" color="teal">mdi-dna</v-icon>
              Species Traits
            </v-card-title>
            <v-card-text class="pa-0">
              <v-expansion-panels class="trait-panels" variant="accordion">
                <v-expansion-panel v-for="trait in enhancedSpeciesTraits" :key="trait.name" class="trait-panel">
                  <v-expansion-panel-title class="pa-3">
                    <span class="font-weight-medium">{{ trait.name }}</span>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text class="trait-description pa-3">
                    <div class="text-body-2">{{ trait.description || 'No description available.' }}</div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
          </v-card>

          <!-- Class Features -->
          <v-card v-if="character.classDetails?.features?.length" class="section-card mb-4" variant="outlined">
            <v-card-title class="section-title">
              <v-icon class="me-2" color="warning">mdi-star</v-icon>
              Class Features
            </v-card-title>
            <v-card-text class="pa-0">
              <v-expansion-panels class="trait-panels" variant="accordion">
                <v-expansion-panel v-for="feature in character.classDetails.features" :key="feature.name"
                  class="trait-panel">
                  <v-expansion-panel-title class="pa-3">
                    <span class="font-weight-medium">{{ feature.name }}</span>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text class="trait-description pa-3">
                    <div class="text-body-2">{{ feature.desc || feature.description || 'No description available.' }}
                    </div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Center Column - Ability Scores & Class Features -->
        <v-col cols="12" lg="4" md="4" class="order-1 order-lg-2">
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
                    <div class="ability-modifier text-h5 font-weight-bold my-1">
                      {{ score.modifier >= 0 ? '+' : '' }}{{ score.modifier }}
                    </div>
                    <div class="ability-score text-caption">{{ score.score }}</div>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Right Column - Feats & Personality & Equipment -->
        <v-col cols="12" lg="4" md="4" class="order-2 order-lg-3">
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
                    color="warning" size="small" variant="tonal">
                    {{ flaw }}
                  </v-chip>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Starting Inventory -->
          <v-card v-if="hasInventoryItems || hasCoins" class="section-card mb-4" variant="outlined">
            <v-card-title class="section-title">
              <v-icon class="me-2" color="amber">mdi-treasure-chest</v-icon>
              Starting Inventory
            </v-card-title>
            <v-card-text class="pa-3">
              <!-- Equipment Items (Same styling as page 4) -->
              <div v-if="hasInventoryItems" class="mb-4">
                <div v-if="allInventoryItems.length === 0" class="text-center py-4 text-grey">
                  <v-icon size="32" color="grey">mdi-package-variant-closed</v-icon>
                  <div class="text-body-2 mt-2">No equipment selected yet</div>
                </div>
                <div v-else class="d-flex flex-wrap ga-2">
                  <div v-for="(item, index) in allInventoryItems"
                    :key="`${item?.name || 'unknown'}-${item?.source || 'unknown'}-${index}`"
                    class="inventory-equipment-item">

                    <!-- Equipment Pack with Contents -->
                    <template v-if="item && item.name && isEquipmentPack(item)">
                      <div class="equipment-pack-container mb-3" style="width: 100%;">
                        <!-- Main Pack Chip -->
                        <v-tooltip v-if="getEquipmentTooltip(item.name)" location="top" max-width="300">
                          <template v-slot:activator="{ props: tooltipProps }">
                            <v-chip v-bind="tooltipProps"
                              :text="capitalizeEquipmentName(item?.name || 'Unknown Item') + (item?.quantity > 1 ? ` x${item.quantity}` : '')"
                              :color="getEquipmentTypeColor(item.name, item.source)" variant="elevated"
                              :prepend-icon="getEquipmentIcon(item.name)" size="large" class="ma-1" />
                          </template>
                          <template v-slot:default>
                            <div class="text-body-2 font-weight-bold mb-1">{{ capitalizeEquipmentName(item.name) }}
                            </div>
                            <div class="text-caption mb-1">
                              <strong>Type:</strong> {{ getEquipmentTooltip(item.name).type }}
                            </div>
                            <div class="text-caption mt-2">
                              {{ getEquipmentTooltip(item.name).description }}
                            </div>
                          </template>
                        </v-tooltip>
                        <v-chip v-else
                          :text="capitalizeEquipmentName(item?.name || 'Unknown Item') + (item?.quantity > 1 ? ` x${item.quantity}` : '')"
                          :color="getEquipmentTypeColor(item.name, item.source)" variant="elevated"
                          :prepend-icon="getEquipmentIcon(item.name)" size="large" class="ma-1" />

                        <!-- Pack Contents -->
                        <div v-if="getEquipmentTooltip(item.name)?.contents" class="pack-contents mt-2 ms-2">
                          <div class="text-caption text-grey-darken-1 mb-2 font-weight-medium">Contains:</div>
                          <div class="d-flex flex-wrap ga-2">
                            <v-tooltip v-for="contentItem in getEquipmentTooltip(item.name).contents" :key="contentItem"
                              location="top" max-width="300">
                              <template v-slot:activator="{ props: tooltipProps }">
                                <v-chip v-bind="tooltipProps" size="small" variant="outlined" color="grey-darken-1"
                                  class="pack-content-chip">
                                  {{ capitalizeEquipmentName(contentItem) }}
                                </v-chip>
                              </template>
                              <div v-if="getPackContentTooltip(contentItem)">
                                <div class="text-caption mb-1" v-if="getPackContentTooltip(contentItem).type">
                                  <strong>Type:</strong> {{ getPackContentTooltip(contentItem).type }}
                                </div>
                                <div class="text-caption">
                                  {{ getPackContentTooltip(contentItem).description }}
                                </div>
                              </div>
                              <div v-else>
                                <div class="text-caption">
                                  {{ capitalizeEquipmentName(contentItem) }} - Part of {{
                                    capitalizeEquipmentName(item.name) }}
                                </div>
                              </div>
                            </v-tooltip>
                          </div>
                        </div>
                      </div>
                    </template>

                    <!-- Musical Instrument Chip -->
                    <template v-else-if="item && item.name && isSpecificMusicalInstrument(item)">
                      <v-tooltip v-if="getEquipmentTooltip(item.name)" location="top" max-width="300">
                        <template v-slot:activator="{ props: tooltipProps }">
                          <v-chip v-bind="tooltipProps"
                            :text="capitalizeEquipmentName(item?.name || 'Unknown Item') + (item?.quantity > 1 ? ` x${item.quantity}` : '')"
                            :color="getEquipmentTypeColor(item.name, item.source)" variant="elevated"
                            :prepend-icon="'mdi-music'" size="large" class="ma-1" />
                        </template>
                        <div>
                          <div class="text-caption mb-1" v-if="getEquipmentTooltip(item.name).type">
                            <strong>Type:</strong> {{ getEquipmentTooltip(item.name).type }}
                          </div>
                          <div class="text-caption">
                            {{ getEquipmentTooltip(item.name).description }}
                          </div>
                        </div>
                      </v-tooltip>
                      <v-tooltip v-else
                        :text="`Musical instrument from your ${item.source === 'class' ? 'class equipment' : 'background'}`"
                        location="top">
                        <template v-slot:activator="{ props: tooltipProps }">
                          <v-chip v-bind="tooltipProps"
                            :text="capitalizeEquipmentName(item?.name || 'Unknown Item') + (item?.quantity > 1 ? ` x${item.quantity}` : '')"
                            :color="getEquipmentTypeColor(item.name, item.source)" variant="elevated"
                            :prepend-icon="'mdi-music'" size="large" class="ma-1" />
                        </template>
                      </v-tooltip>
                    </template>

                    <!-- Artisan's Tools Chip -->
                    <template v-else-if="item && item.name && isSpecificArtisanTool(item)">
                      <v-tooltip
                        :text="`Artisan's tools from your ${item.source === 'background' ? 'background' : 'class equipment'}`"
                        location="top">
                        <template v-slot:activator="{ props: tooltipProps }">
                          <v-chip v-bind="tooltipProps"
                            :text="capitalizeEquipmentName(item?.name || 'Unknown Item') + (item?.quantity > 1 ? ` x${item.quantity}` : '')"
                            :color="getEquipmentTypeColor(item.name, item.source)" variant="elevated"
                            :prepend-icon="getEquipmentIcon(item.name)" size="large" class="ma-1" />
                        </template>
                      </v-tooltip>
                    </template>

                    <!-- Regular Equipment Chip -->
                    <template v-else-if="item && item.name">
                      <v-tooltip v-if="getEquipmentTooltip(item.name)" location="top" max-width="300">
                        <template v-slot:activator="{ props: tooltipProps }">
                          <v-chip v-bind="tooltipProps"
                            :text="capitalizeEquipmentName(item?.name || 'Unknown Item') + (item?.quantity > 1 ? ` x${item.quantity}` : '')"
                            :color="getEquipmentTypeColor(item.name, item.source)" variant="elevated"
                            :prepend-icon="getEquipmentIcon(item.name)" size="large" class="ma-1" />
                        </template>
                        <template v-slot:default>
                          <div class="text-body-2 font-weight-bold mb-1">{{ capitalizeEquipmentName(item.name) }}</div>
                          <div class="text-caption mb-1" v-if="getEquipmentTooltip(item.name).type">
                            <strong>Type:</strong> {{ getEquipmentTooltip(item.name).type }}
                          </div>
                          <div class="text-caption mb-1" v-if="getEquipmentTooltip(item.name).damage">
                            <strong>Damage:</strong> {{ getEquipmentTooltip(item.name).damage }}
                          </div>
                          <div class="text-caption mb-1" v-if="getEquipmentTooltip(item.name).ac">
                            <strong>AC:</strong> {{ getEquipmentTooltip(item.name).ac }}
                          </div>
                          <div class="text-caption mb-1" v-if="getEquipmentTooltip(item.name).properties &&
                            getEquipmentTooltip(item.name).properties !== 'None'">
                            <strong>Properties:</strong> {{ getEquipmentTooltip(item.name).properties }}
                          </div>
                          <div class="text-caption mt-2">
                            {{ getEquipmentTooltip(item.name).description }}
                          </div>
                        </template>
                      </v-tooltip>
                      <v-chip v-else
                        :text="capitalizeEquipmentName(item?.name || 'Unknown Item') + (item?.quantity > 1 ? ` x${item.quantity}` : '')"
                        :color="getEquipmentTypeColor(item.name, item.source)" variant="elevated"
                        :prepend-icon="getEquipmentIcon(item.name)" size="large" class="ma-1" />
                    </template>
                  </div>
                </div>
              </div>

              <!-- Coins -->
              <div v-if="hasCoins" class="coins-section">
                <div class="subsection-title mb-2">💰 Currency</div>
                <div class="coins-display d-flex flex-wrap">
                  <v-chip v-if="character.coins.pp" class="ma-1" color="purple" size="small" variant="tonal">
                    {{ character.coins.pp }} Platinum
                  </v-chip>
                  <v-chip v-if="character.coins.gp" class="ma-1" color="yellow-darken-2" size="small"
                    variant="outlined">
                    {{ character.coins.gp }} Gold
                  </v-chip>
                  <v-chip v-if="character.coins.ep" class="ma-1" color="blue-grey" size="small" variant="outlined">
                    {{ character.coins.ep }} Electrum
                  </v-chip>
                  <v-chip v-if="character.coins.sp" class="ma-1" color="grey" size="small" variant="outlined">
                    {{ character.coins.sp }} Silver
                  </v-chip>
                  <v-chip v-if="character.coins.cp" class="ma-1" color="brown" size="small" variant="outlined">
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
            <v-card-text class="px-3 pt-0">
              <v-chip class="mx-1 my-0 pl-3" color="indigo" prepend-icon="mdi-weather-night" size="small"
                variant="tonal">
                Darkvision {{ character.speciesDetails.darkvision }}ft
              </v-chip>
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

<script setup>
import { computed, ref, toRefs, watch } from 'vue'

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

// Trait details storage
const traitDetails = ref({})

// Fetch trait details from API
const fetchTraitDetails = async traitIndex => {
  if (traitDetails.value[traitIndex]) return traitDetails.value[traitIndex]

  console.log(`Fetching trait details for index: ${traitIndex}`)
  try {
    const response = await fetch(`https://www.dnd5eapi.co/api/2014/traits/${traitIndex}`)
    console.log(`API response for ${traitIndex}:`, response.status, response.ok)
    if (response.ok) {
      const traitData = await response.json()
      console.log(`Trait data for ${traitIndex}:`, traitData)
      traitDetails.value[traitIndex] = traitData
      return traitData
    } else {
      console.warn(`API response not ok for ${traitIndex}:`, response.status)
    }
  } catch (error) {
    console.warn(`Failed to fetch trait details for ${traitIndex}:`, error)
  }

  return null
}

// Utility function to capitalize first letter
const capitalizeFirst = str => {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

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

// Equipment organization with quantity consolidation
const equipmentSummary = computed(() => {
  const equipment = character.value.equipment || []

  // Deduplicate equipment first - prioritize class choices over starting equipment
  const deduplicatedEquipment = []
  const seenItems = new Set()

  // First pass: Add all class equipment choices (highest priority)
  equipment.filter(item => item.source === 'class').forEach(item => {
    const name = item.name || item
    if (!seenItems.has(name.toLowerCase())) {
      deduplicatedEquipment.push(item)
      seenItems.add(name.toLowerCase())
    }
  })

  // Second pass: Add starting equipment (only if not already added)
  equipment.filter(item => item.source === 'class-default' || !item.source).forEach(item => {
    const name = item.name || item
    if (!seenItems.has(name.toLowerCase())) {
      deduplicatedEquipment.push(item)
      seenItems.add(name.toLowerCase())
    }
  })

  // Third pass: Add background equipment (only if not already added)
  equipment.filter(item => item.source === 'background').forEach(item => {
    const name = item.name || item
    if (!seenItems.has(name.toLowerCase())) {
      deduplicatedEquipment.push(item)
      seenItems.add(name.toLowerCase())
    }
  })

  const categorized = {
    weapons: [],
    armor: [],
    tools: [],
    gear: [],
  }

  // Helper function to consolidate items by name with smart quantity handling
  const consolidateItems = (items) => {
    const consolidated = {}

    items.forEach(item => {
      // Handle both string items and object items
      const name = typeof item === 'string' ? item : (item.name || item)
      const quantity = typeof item === 'object' && item.quantity ? item.quantity : 1

      if (consolidated[name]) {
        consolidated[name].quantity += quantity
      } else {
        consolidated[name] = {
          name: name,
          quantity: quantity,
          // Preserve other properties if it's an object
          ...(typeof item === 'object' ? item : {})
        }
      }
    })

    // Convert back to array and apply reasonable quantity limits for common items
    return Object.values(consolidated).map(item => {
      // Apply reasonable caps for obviously over-duplicated items
      if (item.name.toLowerCase().includes('arrow') && item.quantity > 60) {
        item.quantity = Math.min(item.quantity, 60) // Cap arrows at 60 (3 bundles)
      }
      if (item.name.toLowerCase().includes("burglar's pack") && item.quantity > 1) {
        item.quantity = 1 // You only need one burglar's pack
      }
      if (item.name.toLowerCase().includes('pack') && item.quantity > 2) {
        item.quantity = 1 // Most packs should only appear once
      }
      return item
    })
  }

  deduplicatedEquipment.forEach(item => {
    const category = item.category?.toLowerCase() || ''
    const itemName = (item.name || item).toLowerCase()

    // Weapons - check category, weaponCategory, or specific weapon names
    if (category.includes('weapon') || category.includes('simple') || category.includes('martial') ||
      item.weaponCategory ||
      // Check for specific weapon names
      itemName.includes('sword') || itemName.includes('axe') || itemName.includes('bow') ||
      itemName.includes('dagger') || itemName.includes('mace') || itemName.includes('hammer') ||
      itemName.includes('spear') || itemName.includes('javelin') || itemName.includes('maul') ||
      itemName.includes('whip') || itemName.includes('rapier') || itemName.includes('scimitar') ||
      itemName.includes('pike') || itemName.includes('halberd') || itemName.includes('glaive') ||
      itemName.includes('crossbow') || itemName.includes('arrow') || itemName.includes('bolt')) {
      categorized.weapons.push(item)
    }
    // Armor
    else if (category.includes('armor') || item.armorCategory) {
      categorized.armor.push(item)
    }
    // Tools
    else if (category.includes('tool') || item.toolCategory) {
      categorized.tools.push(item)
    }
    // Everything else as gear
    else {
      categorized.gear.push(item)
    }
  })

  // Consolidate duplicates in each category
  return {
    weapons: consolidateItems(categorized.weapons),
    armor: consolidateItems(categorized.armor),
    tools: consolidateItems(categorized.tools),
    gear: consolidateItems(categorized.gear),
  }
})

// Utility functions from InventoryEquipment.vue
function capitalizeEquipmentName(name) {
  if (!name) return ''

  // Split by spaces and capitalize each word, but handle special cases
  const words = name.toLowerCase().split(' ')
  const capitalizedWords = words.map(word => {
    // Handle words with "/" (like "Map/Scroll")
    if (word.includes('/')) {
      return word.split('/').map(part => {
        const lowerCaseWords = ['of', 'and', 'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'with']
        if (lowerCaseWords.includes(part) && words.indexOf(word) !== 0) {
          return part
        }
        return part.charAt(0).toUpperCase() + part.slice(1)
      }).join('/')
    }

    // Don't capitalize articles, prepositions, and conjunctions unless they're the first word
    const lowerCaseWords = ['of', 'and', 'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'with']
    if (lowerCaseWords.includes(word) && words.indexOf(word) !== 0) {
      return word
    }
    // Capitalize first letter
    return word.charAt(0).toUpperCase() + word.slice(1)
  })

  return capitalizedWords.join(' ')
}

// Helper function to get equipment icon based on type
const getEquipmentIcon = (itemName) => {
  if (!itemName) return null;

  const name = itemName.toLowerCase();
  const tooltip = getEquipmentTooltip(itemName);

  // Check tooltip type first for accuracy
  if (tooltip?.type) {
    const type = tooltip.type.toLowerCase();
    if (type.includes('armor') || type.includes('shield')) return 'mdi-shield';
    if (type.includes('weapon')) return 'mdi-sword';
    if (type.includes('artisan\'s tools')) return 'mdi-tools';
    if (type.includes('equipment pack')) return 'mdi-bag-personal';
    if (type.includes('divine focus')) return 'mdi-cross';
    if (type.includes('arcane focus')) return 'mdi-wizard-hat';
    if (type.includes('druidcraft focus')) return 'mdi-leaf';
    // Simple tools will fall through to name-based matching for specific icons
  }

  // Fallback to name-based matching
  if (name.includes('armor') || name.includes('mail') || name.includes('leather') ||
    name.includes('scale') || name.includes('studded') || name.includes('hide') ||
    name.includes('padded') || name.includes('ring') || name.includes('splint') ||
    name.includes('shield')) {
    return 'mdi-shield';
  }
  if (name.includes('sword') || name.includes('dagger') || name.includes('axe') ||
    name.includes('mace') || name.includes('club') || name.includes('sickle') ||
    name.includes('scimitar') || name.includes('rapier') || name.includes('bow') ||
    name.includes('crossbow') || name.includes('javelin') || name.includes('dart') ||
    name.includes('sling') || name.includes('flail') || name.includes('hammer') ||
    name.includes('spear') || name.includes('trident') || name.includes('whip') ||
    name.includes('glaive') || name.includes('halberd') || name.includes('pike') ||
    name.includes('lance') || name.includes('maul') || name.includes('greataxe') ||
    name.includes('greatsword') || name.includes('quarterstaff')) {
    return 'mdi-sword';
  }
  if (name.includes('musical instrument') || name.includes('instrument') ||
    name.includes('flute') || name.includes('lute') || name.includes('drum') ||
    name.includes('dulcimer') || name.includes('harp') || name.includes('horn') ||
    name.includes('lyre') || name.includes('pan flute') || name.includes('shawm') ||
    name.includes('viol') || name.includes('bagpipes') || name.includes('guitar') ||
    name.includes('harpsichord') || name.includes('mandolin') || name.includes('violin') ||
    name.includes('piano') || name.includes('trumpet') || name.includes('clarinet')) {
    return 'mdi-music';
  }
  if (name.includes('tools') || name.includes('kit') || name.includes('thieves')) {
    return 'mdi-tools';
  }
  if (name.includes('holy symbol')) return 'mdi-cross';
  if (name.includes('arcane focus')) return 'mdi-wizard-hat';
  if (name.includes('druidcraft focus')) return 'mdi-leaf';
  if (name.includes('component pouch')) return 'mdi-bag-checked';
  if (name.includes('pack') && (name.includes('dungeoneer') || name.includes('explorer') ||
    name.includes('entertainer') || name.includes('priest') || name.includes('scholar') ||
    name.includes('burglar'))) {
    return 'mdi-bag-personal';
  }
  if (name.includes('arrow') || name.includes('bolt') || name.includes('ammunition')) {
    return 'mdi-arrow-projectile';
  }
  if (name.includes('costume') || name.includes('uniform') || name.includes('clothes') ||
    name.includes('vestments')) return 'mdi-tshirt-crew';
  if (name.includes('pouch') || name.includes('bag')) return 'mdi-wallet';
  if (name.includes('rope')) return 'mdi-rope';
  if (name.includes('torch') || name.includes('lantern')) return 'mdi-fire';
  if (name.includes('bedroll') || name.includes('blanket')) return 'mdi-bed';
  if (name.includes('rations') || name.includes('food')) return 'mdi-food';
  if (name.includes('waterskin') || name.includes('water') || name.includes('flask')) return 'mdi-bottle-water';
  if (name.includes('book') || name.includes('tome') || name.includes('scroll') ||
    name.includes('parchment') || name.includes('paper')) return 'mdi-book-open';
  if (name.includes('ink') || name.includes('pen') || name.includes('quill')) return 'mdi-pen';
  if (name.includes('candle') || name.includes('oil') || name.includes('tinderbox')) return 'mdi-candle';
  if (name.includes('hammer') || name.includes('crowbar') || name.includes('piton')) return 'mdi-hammer';
  if (name.includes('shovel')) return 'mdi-shovel';
  if (name.includes('bell')) return 'mdi-bell';
  if (name.includes('string') || name.includes('twine')) return 'mdi-string-lights';
  if (name.includes('sand')) return 'mdi-grain';
  if (name.includes('knife') && !name.includes('dagger')) return 'mdi-knife';
  if (name.includes('mess kit') || name.includes('mess')) return 'mdi-silverware';
  if (name.includes('censer') || name.includes('incense')) return 'mdi-incense';
  if (name.includes('alms') || name.includes('coin') || name.includes('money')) return 'mdi-coins';
  if (name.includes('deck') || name.includes('cards')) return 'mdi-cards-playing';
  if (name.includes('signet ring') || name.includes('ring')) return 'mdi-ring';
  if (name.includes('scroll of pedigree') || name.includes('pedigree')) return 'mdi-script-text';

  return 'mdi-package-variant'; // Default icon for other items
};

// Source-based inventory coloring
const getInventoryItemColor = (source) => {
  switch (source) {
    case 'class':
      return 'primary'
    case 'class-default':
      return 'info'
    case 'background':
      return 'success'
    case 'purchased':
      return 'warning'
    default:
      return 'grey'
  }
}

// Enhanced color function based on equipment type
const getEquipmentTypeColor = (itemName, source = null) => {
  if (!itemName) return source ? getInventoryItemColor(source) : 'grey';

  const tooltip = getEquipmentTooltip(itemName);

  // Use tooltip type for accurate categorization
  if (tooltip?.type) {
    const type = tooltip.type.toLowerCase();

    if (type.includes('heavy armor')) return 'red-darken-1';
    if (type.includes('medium armor')) return 'orange-darken-1';
    if (type.includes('light armor')) return 'yellow-darken-1';
    if (type.includes('shield')) return 'blue-darken-1'; // Shields get their own distinct color
    if (type.includes('weapon')) return 'purple-darken-1'; // All weapons same color
    if (type.includes('musical instrument')) return 'purple-lighten-1'; // Musical instruments get light purple
    if (type.includes('tool')) return 'green-darken-1';
    if (type.includes('equipment pack')) return 'brown-darken-1';
    if (type.includes('adventuring gear')) return 'cyan-darken-1';
    if (type.includes('divine focus')) return 'amber-darken-1'; // Holy symbols and divine focuses
    if (type.includes('arcane focus')) return 'indigo-darken-1'; // Arcane focuses like crystal orbs
    if (type.includes('druidcraft focus') || type.includes('druidic focus')) return 'light-green-darken-1'; // Druidcraft focuses
    if (type.includes('spellcasting focus')) return 'teal-darken-1'; // Component pouches and other generic focuses
  }

  // Fallback to name-based color assignment for items without proper tooltips
  const name = itemName.toLowerCase();

  // Weapons - check for specific weapon names first
  if (name.includes('sword') || name.includes('axe') || name.includes('bow') ||
    name.includes('dagger') || name.includes('mace') || name.includes('hammer') ||
    name.includes('spear') || name.includes('javelin') || name.includes('maul') ||
    name.includes('whip') || name.includes('rapier') || name.includes('scimitar') ||
    name.includes('pike') || name.includes('halberd') || name.includes('glaive') ||
    name.includes('crossbow') || name.includes('club') || name.includes('quarterstaff') ||
    name.includes('sling') || name.includes('dart') || name.includes('trident') ||
    name.includes('lance') || name.includes('morningstar') || name.includes('flail') ||
    name.includes('warhammer') || name.includes('battleaxe') || name.includes('greataxe') ||
    name.includes('greatsword') || name.includes('longsword') || name.includes('shortsword')) {
    return 'purple-darken-1'; // All weapons get purple color
  }

  // Ammunition
  if (name.includes('arrow') || name.includes('bolt') || name.includes('ammunition')) {
    return 'grey-darken-2';
  }

  // Clothing and costumes
  if (name.includes('costume') || name.includes('uniform') || name.includes('clothes') ||
    name.includes('vestments')) {
    return 'pink-darken-1';
  }

  // Containers and bags
  if ((name.includes('pouch') || name.includes('bag')) && !name.includes('pack')) {
    return 'deep-orange-darken-1';
  }

  // Consumables and supplies
  if (name.includes('rations') || name.includes('food') || name.includes('candle') ||
    name.includes('oil') || name.includes('rope') || name.includes('torch')) {
    return 'lime-darken-1';
  }

  // Books and writing materials
  if (name.includes('book') || name.includes('ink') || name.includes('pen') ||
    name.includes('parchment') || name.includes('scroll')) {
    return 'blue-grey-darken-1';
  }

  // Jewelry and noble items
  if (name.includes('signet ring') || name.includes('ring') || name.includes('jewelry')) {
    return 'amber-darken-1'; // Gold/amber for jewelry
  }

  // Tools and artisan supplies
  if (name.includes('tools') || name.includes('supplies') || name.includes('kit') ||
    name.includes('shovel') || name.includes('smith') || name.includes('brewer') ||
    name.includes('carpenter') || name.includes('leatherworker') || name.includes('mason') ||
    name.includes('potter') || name.includes('weaver') || name.includes('woodcarver')) {
    return 'green-darken-1';
  }

  // Musical instruments
  if (name.includes('instrument') || name.includes('lute') || name.includes('flute') ||
    name.includes('drum') || name.includes('horn') || name.includes('viol') ||
    name.includes('lyre') || name.includes('shawm') || name.includes('pan flute') ||
    name.includes('dulcimer') || name.includes('bagpipes')) {
    return 'purple-lighten-1'; // Light purple for musical instruments
  }

  // Gaming and entertainment items
  if (name.includes('deck') || name.includes('cards') || name.includes('dice') ||
    name.includes('game')) {
    return 'red-lighten-1';
  }

  // Fallback to source-based coloring
  return source ? getInventoryItemColor(source) : 'grey';
};

// Helper functions for special equipment types
const isSpecificMusicalInstrument = (item) => {
  if (!item?.name) return false;
  const name = item.name.toLowerCase();
  return (name.includes('lute') || name.includes('flute') || name.includes('drum') ||
    name.includes('dulcimer') || name.includes('harp') || name.includes('horn') ||
    name.includes('lyre') || name.includes('pan flute') || name.includes('shawm') ||
    name.includes('viol') || name.includes('bagpipes') || name.includes('guitar') ||
    name.includes('harpsichord') || name.includes('mandolin') || name.includes('violin') ||
    name.includes('piano') || name.includes('trumpet') || name.includes('clarinet')) &&
    !name.includes('musical instrument'); // Don't match generic "musical instrument"
};

const isSpecificArtisanTool = (item) => {
  if (!item?.name) return false;
  const name = item.name.toLowerCase();
  return (name.includes('smith') && name.includes('tools')) ||
    (name.includes('brewer') && name.includes('supplies')) ||
    (name.includes('calligrapher') && name.includes('supplies')) ||
    (name.includes('carpenter') && name.includes('tools')) ||
    (name.includes('cartographer') && name.includes('tools')) ||
    (name.includes('cobbler') && name.includes('tools')) ||
    (name.includes('cook') && name.includes('utensils')) ||
    (name.includes('glassblower') && name.includes('tools')) ||
    (name.includes('jeweler') && name.includes('tools')) ||
    (name.includes('leatherworker') && name.includes('tools')) ||
    (name.includes('mason') && name.includes('tools')) ||
    (name.includes('painter') && name.includes('supplies')) ||
    (name.includes('potter') && name.includes('tools')) ||
    (name.includes('tinker') && name.includes('tools')) ||
    (name.includes('weaver') && name.includes('tools')) ||
    (name.includes('woodcarver') && name.includes('tools'));
};

const isEquipmentPack = (item) => {
  if (!item?.name) return false;
  const name = item.name.toLowerCase();
  return name.includes('pack') && (
    name.includes('entertainer') || name.includes('diplomat') || name.includes('dungeoneer') ||
    name.includes('explorer') || name.includes('priest') || name.includes('scholar') ||
    name.includes('burglar')
  );
};

// Equipment tooltip data for common D&D 5e items (simplified for CharacterSummary)
const getEquipmentTooltip = (itemName) => {
  if (!itemName) return null;

  const tooltips = {
    // Weapons
    'rapier': { type: 'Martial Melee Weapon', damage: '1d8 piercing', properties: 'Finesse', description: 'A slender, sharply pointed sword ideal for thrusting attacks.' },
    'dagger': { type: 'Simple Melee Weapon', damage: '1d4 piercing', properties: 'Finesse, Light, Thrown (range 20/60)', description: 'A simple, pointed blade. Can be thrown or used in melee.' },
    'longsword': { type: 'Martial Melee Weapon', damage: '1d8 slashing', properties: 'Versatile (1d10)', description: 'A standard long blade weapon favored by many warriors.' },
    'shortsword': { type: 'Martial Melee Weapon', damage: '1d6 piercing', properties: 'Finesse, Light', description: 'A short blade that is quick and nimble to use.' },
    'scimitar': { type: 'Martial Melee Weapon', damage: '1d6 slashing', properties: 'Finesse, Light', description: 'A curved blade weapon that is both quick and deadly.' },

    // Armor
    'leather armor': { type: 'Light Armor', ac: '11 + Dex modifier', properties: 'None', description: 'The breastplate and shoulder protectors of this armor are made of leather that has been stiffened by being boiled in oil.' },
    'studded leather': { type: 'Light Armor', ac: '12 + Dex modifier', properties: 'None', description: 'Made from tough but flexible leather, studded leather is reinforced with close-set rivets or spikes.' },
    'chain mail': { type: 'Heavy Armor', ac: '16', properties: 'Stealth Disadvantage', description: 'Made of interlocking metal rings. The suit includes gauntlets.' },
    'shield': { type: 'Shield', ac: '+2', properties: 'None', description: 'A shield is made from wood or metal and is carried in one hand. Wielding a shield increases your Armor Class by 2.' },

    // Equipment Packs
    'entertainer\'s pack': {
      type: 'Equipment Pack',
      description: 'Includes a backpack, a bedroll, 2 costumes, 5 candles, 5 days of rations, a waterskin, and a disguise kit.',
      contents: ['Backpack', 'Bedroll', '2 Costumes', '5 Candles', '5 days of rations', 'Waterskin', 'Disguise kit']
    },
    'diplomat\'s pack': {
      type: 'Equipment Pack',
      description: 'Includes a chest, 2 cases for maps and scrolls, a set of fine clothes, a bottle of ink, an ink pen, a lamp, 2 flasks of oil, 5 sheets of paper, a vial of perfume, sealing wax, and soap.',
      contents: ['Chest', '2 Map/Scroll Cases', 'Fine Clothes', 'Ink Bottle', 'Ink Pen', 'Lamp', '2 Oil Flasks', '5 Sheets Paper', 'Perfume Vial', 'Sealing Wax', 'Soap']
    },
    'dungeoneer\'s pack': {
      type: 'Equipment Pack',
      description: 'Includes a backpack, a crowbar, a hammer, 10 pitons, 10 torches, a tinderbox, 10 days of rations, and a waterskin.',
      contents: ['Backpack', 'Crowbar', 'Hammer', '10 Pitons', '10 Torches', 'Tinderbox', '10 days of rations', 'Waterskin']
    },
    'explorer\'s pack': {
      type: 'Equipment Pack',
      description: 'Includes a backpack, a bedroll, a mess kit, a tinderbox, 10 torches, 10 days of rations, a waterskin, and 50 feet of hemp rope.',
      contents: ['Backpack', 'Bedroll', 'Mess kit', 'Tinderbox', '10 Torches', '10 days of rations', 'Waterskin', '50 ft hemp rope']
    },
    'priest\'s pack': {
      type: 'Equipment Pack',
      description: 'Includes a backpack, a blanket, 10 candles, a tinderbox, an alms box, 2 blocks of incense, a censer, vestments, 2 days of rations, and a waterskin.',
      contents: ['Backpack', 'Blanket', '10 Candles', 'Tinderbox', 'Alms box', '2 Incense blocks', 'Censer', 'Vestments', '2 days of rations', 'Waterskin']
    },
    'scholar\'s pack': {
      type: 'Equipment Pack',
      description: 'Includes a backpack, a book of lore, a bottle of ink, an ink pen, 10 sheets of parchment, a little bag of sand, and a small knife.',
      contents: ['Backpack', 'Book of lore', 'Ink bottle', 'Ink pen', '10 Parchment sheets', 'Bag of sand', 'Small knife']
    },
    'burglar\'s pack': {
      type: 'Equipment Pack',
      description: 'Includes a backpack, a bag of 1,000 ball bearings, 10 feet of string, a bell, 5 candles, a crowbar, a hammer, 10 pitons, a hooded lantern, 2 flasks of oil, 5 days rations, a tinderbox, a waterskin, and 50 feet of hempen rope.',
      contents: ['Backpack', '1,000 Ball bearings', '10 ft String', 'Bell', '5 Candles', 'Crowbar', 'Hammer', '10 Pitons', 'Hooded lantern', '2 Oil flasks', '5 days rations', 'Tinderbox', 'Waterskin', '50 ft hemp rope']
    },

    // Tools
    'carpenter\'s tools': { type: 'Artisan\'s Tools', description: 'These special tools include the items needed to pursue a craft or trade. Proficiency with these tools lets you add your proficiency bonus to any ability checks you make to craft objects with wood.' },
    'potter\'s tools': { type: 'Artisan\'s Tools', description: 'These special tools include the items needed to pursue a craft or trade. Proficiency with these tools lets you add your proficiency bonus to any ability checks you make to craft objects with clay.' },
    'smith\'s tools': { type: 'Artisan\'s Tools', description: 'These special tools include the items needed to pursue a craft or trade. Proficiency with these tools lets you add your proficiency bonus to any ability checks you make to craft metal objects.' },
    'brewer\'s supplies': { type: 'Artisan\'s Tools', description: 'These special supplies include the items needed to pursue a craft or trade. Proficiency with these supplies lets you add your proficiency bonus to any ability checks you make to brew beer, ale, and other alcoholic beverages.' },
    'calligrapher\'s supplies': { type: 'Artisan\'s Tools', description: 'These special supplies include the items needed to pursue a craft or trade. Proficiency with these supplies lets you add your proficiency bonus to any ability checks you make to create beautiful writing.' },
    'cartographer\'s tools': { type: 'Artisan\'s Tools', description: 'These special tools include the items needed to pursue a craft or trade. Proficiency with these tools lets you add your proficiency bonus to any ability checks you make to create maps.' },
    'cobbler\'s tools': { type: 'Artisan\'s Tools', description: 'These special tools include the items needed to pursue a craft or trade. Proficiency with these tools lets you add your proficiency bonus to any ability checks you make to craft and repair shoes.' },
    'cook\'s utensils': { type: 'Artisan\'s Tools', description: 'These special utensils include the items needed to pursue a craft or trade. Proficiency with these utensils lets you add your proficiency bonus to any ability checks you make to prepare meals.' },
    'glassblower\'s tools': { type: 'Artisan\'s Tools', description: 'These special tools include the items needed to pursue a craft or trade. Proficiency with these tools lets you add your proficiency bonus to any ability checks you make to craft glass objects.' },
    'jeweler\'s tools': { type: 'Artisan\'s Tools', description: 'These special tools include the items needed to pursue a craft or trade. Proficiency with these tools lets you add your proficiency bonus to any ability checks you make to craft jewelry and appraise gems.' },
    'leatherworker\'s tools': { type: 'Artisan\'s Tools', description: 'These special tools include the items needed to pursue a craft or trade. Proficiency with these tools lets you add your proficiency bonus to any ability checks you make to craft leather goods.' },
    'mason\'s tools': { type: 'Artisan\'s Tools', description: 'These special tools include the items needed to pursue a craft or trade. Proficiency with these tools lets you add your proficiency bonus to any ability checks you make to craft stone structures.' },
    'painter\'s supplies': { type: 'Artisan\'s Tools', description: 'These special supplies include the items needed to pursue a craft or trade. Proficiency with these supplies lets you add your proficiency bonus to any ability checks you make to create paintings.' },
    'tinker\'s tools': { type: 'Artisan\'s Tools', description: 'These special tools include the items needed to pursue a craft or trade. Proficiency with these tools lets you add your proficiency bonus to any ability checks you make to craft and repair mechanical devices.' },
    'weaver\'s tools': { type: 'Artisan\'s Tools', description: 'These special tools include the items needed to pursue a craft or trade. Proficiency with these tools lets you add your proficiency bonus to any ability checks you make to craft cloth and textiles.' },
    'woodcarver\'s tools': { type: 'Artisan\'s Tools', description: 'These special tools include the items needed to pursue a craft or trade. Proficiency with these tools lets you add your proficiency bonus to any ability checks you make to craft wooden objects.' },
    'thieves\' tools': { type: 'Tools', description: 'This set of tools includes a small file, a set of lock picks, a small mirror mounted on a metal handle, a set of narrow-bladed scissors, and a pair of pliers.' },

    // Musical Instruments
    'bagpipes': { type: 'Musical Instrument', description: 'If you have proficiency with bagpipes, you can add your proficiency bonus to any ability checks you make to play music with the instrument. The haunting sound of bagpipes can inspire allies or intimidate enemies.' },
    'lute': { type: 'Musical Instrument', description: 'If you have proficiency with a lute, you can add your proficiency bonus to any ability checks you make to play music with the instrument. The melodic strings of a lute are perfect for entertainment and bardic magic.' },
    'flute': { type: 'Musical Instrument', description: 'If you have proficiency with a flute, you can add your proficiency bonus to any ability checks you make to play music with the instrument. The clear, sweet notes of a flute can carry far and wide.' },
    'drum': { type: 'Musical Instrument', description: 'If you have proficiency with drums, you can add your proficiency bonus to any ability checks you make to play music with the instrument. The rhythmic beat of drums can rally troops and set the pace for marching.' },
    'dulcimer': { type: 'Musical Instrument', description: 'If you have proficiency with a dulcimer, you can add your proficiency bonus to any ability checks you make to play music with the instrument. The gentle plucked strings create soothing melodies.' },
    'horn': { type: 'Musical Instrument', description: 'If you have proficiency with a horn, you can add your proficiency bonus to any ability checks you make to play music with the instrument. The bold call of a horn can signal across great distances.' },
    'lyre': { type: 'Musical Instrument', description: 'If you have proficiency with a lyre, you can add your proficiency bonus to any ability checks you make to play music with the instrument. The classical strings of a lyre evoke ancient traditions.' },
    'pan flute': { type: 'Musical Instrument', description: 'If you have proficiency with a pan flute, you can add your proficiency bonus to any ability checks you make to play music with the instrument. The breathy notes create pastoral melodies.' },
    'shawm': { type: 'Musical Instrument', description: 'If you have proficiency with a shawm, you can add your proficiency bonus to any ability checks you make to play music with the instrument. This double-reed instrument produces loud, penetrating tones.' },
    'viol': { type: 'Musical Instrument', description: 'If you have proficiency with a viol, you can add your proficiency bonus to any ability checks you make to play music with the instrument. The bowed strings create rich, expressive tones.' },

    // Common items
    'common clothes': { type: 'Adventuring Gear', description: 'Everyday clothing suitable for commoners and workers.' },
    'belt pouch': { type: 'Adventuring Gear', description: 'A small pouch that can hold up to 20 sling bullets or 50 blowgun needles, among other things.' },
    'shovel': { type: 'Adventuring Gear', description: 'A tool for digging and moving earth.' }
  };

  return tooltips[itemName.toLowerCase()] || null;
};

// Get specific tooltip for pack content items
const getPackContentTooltip = (itemName) => {
  if (!itemName) return null;

  // Extract the base item name from quantities like "2 Oil flasks" -> "oil flask"
  let baseItemName = itemName.toLowerCase()
    .replace(/^\d+\s*/, '') // Remove leading numbers
    .replace(/s$/, '') // Remove trailing 's' for plurals
    .trim();

  // Special handling for specific pack items
  const packContentTooltips = {
    // Containers and storage
    'backpack': { type: 'Adventuring Gear', description: 'A leather pack carried on the back, typically holding 30 pounds of gear.' },
    'chest': { type: 'Adventuring Gear', description: 'A sturdy wooden container for storing valuable items and documents.' },
    'belt pouch': { type: 'Adventuring Gear', description: 'A small pouch that can hold up to 20 sling bullets or 50 blowgun needles, among other things.' },
    'map/scroll case': { type: 'Adventuring Gear', description: 'A cylindrical leather case for holding maps, scrolls, and important documents.' },
    'alms box': { type: 'Adventuring Gear', description: 'A container used to collect charitable donations.' },
    'bag of sand': { type: 'Adventuring Gear', description: 'Fine sand used to dry ink when writing with quill and ink.' },

    // Bedding and comfort
    'bedroll': { type: 'Adventuring Gear', description: 'A sleeping bag and blanket for resting outdoors.' },
    'blanket': { type: 'Adventuring Gear', description: 'A wool blanket for warmth during rest.' },

    // Lighting and fire
    'candle': { type: 'Adventuring Gear', description: 'A candle sheds bright light in a 5-foot radius and dim light for an additional 5 feet for 1 hour.' },
    'torch': { type: 'Adventuring Gear', description: 'A torch burns for 1 hour, providing bright light in a 20-foot radius and dim light for an additional 20 feet.' },
    'tinderbox': { type: 'Adventuring Gear', description: 'A small container holding flint, fire steel, and tinder used to kindle a fire.' },
    'lamp': { type: 'Adventuring Gear', description: 'A lamp casts bright light in a 15-foot radius and dim light for an additional 30 feet.' },
    'hooded lantern': { type: 'Adventuring Gear', description: 'A hooded lantern casts bright light in a 30-foot radius and dim light for an additional 30 feet.' },
    'oil flask': { type: 'Adventuring Gear', description: 'Oil usually comes in a clay flask that holds 1 pint. As an action, you can splash the oil in this flask onto a creature within 5 feet of you or throw it up to 20 feet.' },

    // Food and drink
    'day of ration': { type: 'Adventuring Gear', description: 'Rations consist of dry foods suitable for extended travel, including jerky, dried fruit, hardtack, and nuts.' },
    'waterskin': { type: 'Adventuring Gear', description: 'A waterskin can hold 4 pints of liquid.' },

    // Clothing
    'costume': { type: 'Adventuring Gear', description: 'Clothing appropriate for a particular profession or social class, used for disguise or performance.' },
    'fine clothes': { type: 'Adventuring Gear', description: 'Expensive, fashionable clothes that mark the wearer as wealthy or noble.' },
    'common clothes': { type: 'Adventuring Gear', description: 'Everyday clothing suitable for commoners and workers.' },
    'vestment': { type: 'Adventuring Gear', description: 'Ceremonial robes worn by religious officials during services.' },

    // Writing materials
    'ink bottle': { type: 'Adventuring Gear', description: 'A 1 ounce bottle of ink, enough to write several pages of text.' },
    'ink pen': { type: 'Adventuring Gear', description: 'A quill or metal-tipped pen for writing with ink.' },
    'sheet of paper': { type: 'Adventuring Gear', description: 'A single sheet of paper made from wood pulp.' },
    'parchment sheet': { type: 'Adventuring Gear', description: 'A sheet of prepared animal skin used for writing.' },
    'book of lore': { type: 'Adventuring Gear', description: 'A scholarly book containing knowledge on various academic subjects.' },
    'sealing wax': { type: 'Adventuring Gear', description: 'Wax used to seal letters and documents, often impressed with a signet ring.' },

    // Tools and implements
    'crowbar': { type: 'Adventuring Gear', description: 'A flat iron bar used as a lever to force things apart.' },
    'hammer': { type: 'Adventuring Gear', description: 'A tool with a heavy head for striking nails or breaking objects.' },
    'piton': { type: 'Adventuring Gear', description: 'A spike driven into a rock or wall to secure a rope.' },
    'small knife': { type: 'Adventuring Gear', description: 'A simple cutting implement useful for various tasks.' },
    'mess kit': { type: 'Adventuring Gear', description: 'A lightweight set of cookware including a plate, bowl, cup, fork, knife, and spoon.' },

    // Religious items
    'incense block': { type: 'Adventuring Gear', description: 'Aromatic material that releases fragrant smoke when burned, used in religious ceremonies.' },
    'censer': { type: 'Adventuring Gear', description: 'A vessel for burning incense during religious rituals.' },

    // Miscellaneous
    'perfume vial': { type: 'Adventuring Gear', description: 'A small container of fragrant liquid used to mask odors or create pleasant scents.' },
    'soap': { type: 'Adventuring Gear', description: 'A bar of soap for cleaning and hygiene.' },
    'disguise kit': { type: 'Kit', description: 'This pouch of cosmetics, hair dye, and small props lets you create disguises that change your physical appearance.' },
    'hemp rope': { type: 'Adventuring Gear', description: 'Rope has 2 hit points and can be burst with a DC 17 Strength check. 50 feet of rope weighs 10 pounds.' },
    'ball bearing': { type: 'Adventuring Gear', description: 'Small metal spheres that can be scattered on the ground to create difficult terrain.' },
    'string': { type: 'Adventuring Gear', description: 'Thin cord useful for tying small objects or creating simple traps.' },
    'bell': { type: 'Adventuring Gear', description: 'A small metal bell that rings when struck or shaken.' }
  };

  return packContentTooltips[baseItemName] || null;
};

// Equipment choice parsing functions (from InventoryEquipment.vue)
function parseEquipmentChoice(choice, choiceIndex) {
  const description = choice.desc || `Choice ${choiceIndex + 1}`;
  const options = [];

  if (choice.from && choice.from.options) {
    choice.from.options.forEach((option, optionIndex) => {
      const parsedOption = parseOption(option);
      if (parsedOption) {
        options.push(parsedOption);
      }
    });
  }

  return {
    description,
    options,
    choose: choice.choose || 1
  };
}

function parseOption(option) {
  console.log('Summary parseOption called with:', option);

  if (option.option_type === 'counted_reference') {
    // Single item with count
    const itemName = option.of?.name || 'Unknown Item';
    return {
      items: [{
        name: itemName,
        quantity: option.count || 1,
        description: `${itemName} from equipment choice`,
        cost: { quantity: 0, unit: 'gp' }
      }]
    };
  } else if (option.option_type === 'multiple') {
    // Multiple items in this option
    const items = [];
    if (option.items) {
      option.items.forEach(item => {
        if (item.option_type === 'counted_reference') {
          const itemName = item.of?.name || 'Unknown Item';
          items.push({
            name: itemName,
            quantity: item.count || 1,
            description: `${itemName} from equipment choice`,
            cost: { quantity: 0, unit: 'gp' }
          });
        } else if (item.option_type === 'choice') {
          // This is a sub-choice (like "a martial weapon")
          items.push({
            name: item.choice?.desc || 'Choose an item',
            quantity: 1,
            description: `Choose ${item.choice?.choose || 1} from ${item.choice?.from?.equipment_category?.name || 'category'}`,
            cost: { quantity: 0, unit: 'gp' }
          });
        }
      });
    }
    return { items };
  } else if (option.option_type === 'choice') {
    // Handle special cases for better user experience
    const categoryName = option.choice?.from?.equipment_category?.name || '';
    const description = option.choice?.desc || '';

    console.log('Summary choice option detected:', { categoryName, description });

    // Special handling for musical instruments
    if (categoryName.toLowerCase().includes('musical') || description.toLowerCase().includes('musical instrument')) {
      console.log('Summary musical instrument choice detected');
      return {
        items: [{
          name: 'Choose Musical Instrument',
          quantity: 1,
          description: 'Select any musical instrument of your choice',
          cost: { quantity: 30, unit: 'gp' },
          isMusicalInstrumentChoice: true
        }]
      };
    }

    // This is a category choice (like "choose any martial weapon")
    return {
      category: categoryName || 'Items',
      choose: option.choice?.choose || 1,
      description: description || 'Choose items from category'
      // Note: No items array for pure category choices to avoid duplication in display
    };
  }

  return null;
}

// Equipment choices computed property (same logic as InventoryEquipment.vue)
const equipmentChoices = computed(() => {
  const classInfo = character.value?.selectedClass || character.value?.class;
  console.log('Summary equipmentChoices - classInfo:', classInfo);
  if (!classInfo) return [];

  // First try to get from API data
  if (character.value.classDetails?.startingEquipmentOptions && character.value.classDetails.startingEquipmentOptions.length > 0) {
    console.log('Summary equipmentChoices - using API data:', character.value.classDetails.startingEquipmentOptions);
    const choices = character.value.classDetails.startingEquipmentOptions.map((choice, index) => {
      const parsed = parseEquipmentChoice(choice, index);
      console.log(`Summary equipmentChoices - parsed choice ${index}:`, parsed);
      return parsed;
    });
    console.log('Summary equipmentChoices - all parsed choices:', choices);
    return choices;
  }

  // For now, return empty array if no API data (could add fallback later)
  console.log('Summary equipmentChoices - no API data available');
  return [];
});

// All inventory items (complete logic from InventoryEquipment.vue)
const allInventoryItems = computed(() => {
  const inv = [];

  // Always use package mode logic for summary (we're showing starting inventory)
  console.log('=== SUMMARY INVENTORY DEBUG ===');

  // Add items from selected equipment choices (if any exist)
  const selectedEquipmentChoices = character.value?.equipmentChoices || [];
  console.log('Summary selected equipment choices:', selectedEquipmentChoices);

  equipmentChoices.value.forEach((choice, choiceIndex) => {
    const selectedOptionIndex = selectedEquipmentChoices[choiceIndex];
    console.log(`Summary processing choice ${choiceIndex}, selected option:`, selectedOptionIndex);

    if (selectedOptionIndex !== null && selectedOptionIndex !== undefined) {
      const selectedOption = choice.options[selectedOptionIndex];
      console.log(`Summary selected option for choice ${choiceIndex}:`, selectedOption);
      console.log(`Summary selected option structure - has items:`, !!selectedOption?.items);
      console.log(`Summary selected option items:`, selectedOption?.items);

      // Check if this is a category choice with custom selected weapons
      const customWeapons = character.value?.equipment?.filter(
        item => item.choiceIndex === choiceIndex && item.source === 'class'
      ) || [];
      console.log(`Summary custom weapons for choice ${choiceIndex}:`, customWeapons);

      if (customWeapons.length > 0) {
        // Add the custom selected weapons instead of the generic category
        customWeapons.forEach(weapon => {
          console.log('Summary adding custom weapon from choice:', weapon.name);
          inv.push({
            ...weapon,
            quantity: weapon.quantity || 1,
            source: 'class'
          });
        });
      } else if (selectedOption && selectedOption.items) {
        // Add regular equipment items
        selectedOption.items.forEach(item => {
          console.log('Summary adding equipment choice item:', item.name);
          inv.push({
            ...item,
            quantity: item.quantity || 1,
            source: 'class'
          });
        });
      } else {
        console.log(`Summary no items found for choice ${choiceIndex} - selectedOption:`, selectedOption);
      }
    }
  });

  // Add starting equipment package (but avoid duplicates with equipment choices)
  const startingEquipment = character.value?.classDetails?.startingEquipment || [];
  console.log('Summary starting equipment package:', startingEquipment.map(i => i?.name).filter(Boolean));
  const itemsFromChoices = inv.map(item => item.name?.toLowerCase()).filter(Boolean);
  console.log('Summary items already added from choices:', itemsFromChoices);

  startingEquipment.forEach(item => {
    if (!item || !item.name) {
      console.warn('Summary skipping invalid starting equipment item:', item);
      return;
    }

    // Skip if this item was already added from equipment choices
    const itemNameLower = item.name.toLowerCase();
    if (itemsFromChoices.includes(itemNameLower)) {
      console.log('Summary skipping starting equipment (already from choice):', item.name);
      return;
    }

    console.log('Summary adding starting equipment:', item.name);
    inv.push({
      ...item,
      quantity: item.quantity || 1,
      source: 'class-default'
    });
  });

  // Add background equipment from stored equipment array
  const backgroundEquipment = character.value?.equipment?.filter(item => item.source === 'background') || [];
  console.log('Summary background equipment from stored array:', backgroundEquipment.map(i => ({ name: i.name, quantity: i.quantity })));
  backgroundEquipment.forEach(item => {
    console.log('Summary adding background equipment:', item.name, 'x' + (item.quantity || 1));
    inv.push({
      ...item,
      quantity: item.quantity || 1,
      source: 'background'
    });
  });

  console.log('Summary raw inventory before filtering:', inv.map(i => ({ name: i.name, source: i.source, quantity: i.quantity })));

  // Filter out generic items when specific ones have been selected
  const filteredInv = []
  const hasSpecificMusicalInstrument = inv.some(item =>
    item.source !== 'class-default' && isSpecificMusicalInstrument(item)
  )
  const hasSpecificArtisanTool = inv.some(item =>
    item.source !== 'class-default' && isSpecificArtisanTool(item)
  )

  console.log('Summary filtering inventory - hasSpecificMusicalInstrument:', hasSpecificMusicalInstrument)
  console.log('Summary filtering inventory - hasSpecificArtisanTool:', hasSpecificArtisanTool)

  inv.forEach(item => {
    const itemName = item.name?.toLowerCase() || ''

    // Skip generic musical instrument if specific one exists
    if (itemName === 'musical instrument' && hasSpecificMusicalInstrument) {
      console.log('Summary filtering out generic Musical Instrument, specific instrument found')
      return
    }

    // Skip generic artisan's tools if specific one exists
    if ((itemName.includes('artisan\'s tools') || itemName.includes('artisan tools') ||
      itemName === 'artisan\'s tools' || itemName === 'set of artisan\'s tools') && hasSpecificArtisanTool) {
      console.log('Summary filtering out generic Artisan\'s Tools, specific tool found')
      return
    }

    filteredInv.push(item)
  })

  console.log('Summary final filtered inventory:', filteredInv.map(i => ({ name: i.name, source: i.source, quantity: i.quantity })))

  // Sort inventory for better display order
  const sortedInv = filteredInv.sort((a, b) => {
    const getItemPriority = (item) => {
      const name = item.name?.toLowerCase() || '';
      const tooltip = getEquipmentTooltip(item.name);

      // Check tooltip type first for accuracy
      if (tooltip?.type) {
        const type = tooltip.type.toLowerCase();
        if (type.includes('weapon')) return 1; // Weapons first
        if (type.includes('armor') || type.includes('shield')) return 2; // Armor second
        if (type.includes('tool')) return 3; // Tools third
        if (type.includes('equipment pack')) return 8; // Packs near end
      }

      // Fallback to name-based categorization
      if (name.includes('sword') || name.includes('dagger') || name.includes('axe') ||
        name.includes('mace') || name.includes('club') || name.includes('sickle') ||
        name.includes('scimitar') || name.includes('rapier') || name.includes('bow') ||
        name.includes('crossbow') || name.includes('javelin') || name.includes('dart') ||
        name.includes('sling') || name.includes('flail') || name.includes('hammer') ||
        name.includes('spear') || name.includes('trident') || name.includes('whip') ||
        name.includes('glaive') || name.includes('halberd') || name.includes('pike') ||
        name.includes('lance') || name.includes('maul') || name.includes('greataxe') ||
        name.includes('greatsword') || name.includes('quarterstaff')) {
        return 1; // Weapons first
      }
      if (name.includes('armor') || name.includes('mail') || name.includes('leather') ||
        name.includes('scale') || name.includes('studded') || name.includes('hide') ||
        name.includes('padded') || name.includes('ring') || name.includes('splint') ||
        name.includes('shield')) {
        return 2; // Armor second
      }
      if (name.includes('tools') || name.includes('kit') || name.includes('thieves')) {
        return 3; // Tools third
      }
      if (name.includes('musical instrument') || name.includes('instrument') ||
        name.includes('flute') || name.includes('lute') || name.includes('drum') ||
        name.includes('dulcimer') || name.includes('harp') || name.includes('horn') ||
        name.includes('lyre') || name.includes('pan flute') || name.includes('shawm') ||
        name.includes('viol') || name.includes('bagpipes')) {
        return 4; // Musical instruments fourth
      }
      if (name.includes('arrow') || name.includes('bolt') || name.includes('ammunition')) {
        return 5; // Ammunition fifth
      }
      if (name.includes('costume') || name.includes('uniform') || name.includes('clothes') ||
        name.includes('vestments')) {
        return 6; // Clothing sixth
      }
      if (name.includes('pouch') || name.includes('bag') || name.includes('waterskin') ||
        name.includes('rope') || name.includes('bedroll') || name.includes('rations') ||
        name.includes('torch') || name.includes('candle') || name.includes('oil')) {
        return 7; // General gear seventh
      }
      if (name.includes('pack') && (name.includes('dungeoneer') || name.includes('explorer') ||
        name.includes('entertainer') || name.includes('priest') || name.includes('scholar') ||
        name.includes('burglar') || name.includes('diplomat'))) {
        return 8; // Equipment packs at end
      }

      return 6; // Default to general gear
    };

    const priorityA = getItemPriority(a);
    const priorityB = getItemPriority(b);

    // Primary sort by priority
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    // Secondary sort by name alphabetically within same priority
    const nameA = a.name?.toLowerCase() || '';
    const nameB = b.name?.toLowerCase() || '';
    return nameA.localeCompare(nameB);
  });

  console.log('Summary sorted inventory:', sortedInv.map(i => ({ name: i.name, priority: sortedInv.indexOf(i) + 1 })))
  return sortedInv
}); const hasInventoryItems = computed(() => {
  return allInventoryItems.value.length > 0
})

// Load trait details when species or lineage traits change
watch(
  () => [character.value.derivedTraits?.species, character.value.derivedTraits?.lineage],
  async ([speciesTraits, lineageTraits]) => {
    const allTraits = [...(speciesTraits || []), ...(lineageTraits || [])]
    console.log('Trait watcher triggered with traits:', allTraits)

    if (allTraits.length) {
      // Fetch details for all traits that have an index
      const traitPromises = allTraits.map(trait => {
        console.log(`Checking trait: ${trait.name}, index: ${trait.index}, already loaded:`, !!traitDetails.value[trait.index])
        if (trait.index && !traitDetails.value[trait.index]) {
          console.log(`Fetching details for: ${trait.name} (${trait.index})`)
          return fetchTraitDetails(trait.index)
        }
        return Promise.resolve(null)
      })

      try {
        const results = await Promise.all(traitPromises)
        console.log('Trait fetch results:', results)
      } catch (error) {
        console.error('Error loading trait details:', error)
      }
    }
  },
  { immediate: true }
)

// Enhanced species traits with detailed descriptions
const enhancedSpeciesTraits = computed(() => {
  // Get traits from both species and lineage sources in derivedTraits
  const speciesTraits = character.value.derivedTraits?.species || []
  const lineageTraits = character.value.derivedTraits?.lineage || []
  const allTraits = [...speciesTraits, ...lineageTraits]

  if (!allTraits.length) return []

  console.log('enhancedSpeciesTraits - Raw traits:', allTraits)

  return allTraits.map(trait => {
    console.log('Processing trait:', trait.name, 'Description:', trait.description)

    // Check if trait already has a valid description (not placeholder text)
    if (trait.description &&
      trait.description.trim() &&
      trait.description !== 'Description not loaded yet.' &&
      !trait.description.includes('not loaded')) {
      console.log('Has valid description:', trait.description)
      return {
        ...trait,
        description: trait.description
      }
    }

    // Use fallback for common traits
    if (trait.name === 'Draconic Ancestry') {
      console.log('Using fallback for:', trait.name)
      return {
        ...trait,
        description: 'You have draconic ancestry. Choose one type of dragon from the Draconic Ancestry table. Your breath weapon and damage resistance are determined by the dragon type.'
      }
    }

    if (trait.name === 'Breath Weapon') {
      console.log('Using fallback for:', trait.name)
      return {
        ...trait,
        description: 'You can use your action to exhale destructive energy. Your draconic ancestry determines the size, shape, and damage type of the exhalation.'
      }
    }

    if (trait.name === 'Damage Resistance') {
      console.log('Using fallback for:', trait.name)
      return {
        ...trait,
        description: 'You have resistance to the damage type associated with your draconic ancestry.'
      }
    }    // Default fallback
    return {
      ...trait,
      description: `A species trait: ${trait.name}`
    }
  })
})
</script>
'Draconic Ancestry': 'You have draconic ancestry. Choose one type of dragon from the Draconic Ancestry table. Your
breath weapon and damage resistance are determined by the dragon type.',
'Breath Weapon': 'You can use your action to exhale destructive energy. Your draconic ancestry determines the size,
shape, and damage type of the exhalation.',
'Damage Resistance': 'You have resistance to the damage type associated with your draconic ancestry.',
'Darkvision': 'You have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if
it were bright light, and in darkness as if it were dim light. You cannot discern color in darkness, only shades of
gray.',
'Fey Ancestry': 'You have advantage on saving throws against being charmed, and magic cannot put you to sleep.',
'Trance': 'Elves do not need to sleep. Instead, they meditate deeply, remaining semiconscious, for 4 hours a day. After
resting in this way, you gain the same benefit that a human does from 8 hours of sleep.',
'Keen Senses': 'You have proficiency in the Perception skill.',
'Dwarven Resilience': 'You have advantage on saving throws against poison, and you have resistance against poison
damage.',
'Stout Resilience': 'You have advantage on saving throws against poison, and you have resistance against poison
damage.',
'Stonecunning': 'Whenever you make an Intelligence (History) check related to the origin of stonework, you are
considered proficient in the History skill and add double your proficiency bonus to the check.',
'Lucky': 'When you roll a 1 on the d20 for an attack roll, ability check, or saving throw, you can reroll the die and
must use the new roll.',
'Brave': 'You have advantage on saving throws against being frightened.',
'Halfling Nimbleness': 'You can move through the space of any creature that is of a size larger than yours.',
'Natural Stealthiness': 'You can attempt to hide even when you are obscured only by a creature that is at least one size
larger than you.',
'Draconic Ancestry': 'You have draconic ancestry. Choose one type of dragon from the Draconic Ancestry table. Your
breath weapon and damage resistance are determined by the dragon type.',
'Breath Weapon': 'You can use your action to exhale destructive energy. Your draconic ancestry determines the size,
shape, and damage type of the exhalation.'
}

return allTraits.map(trait => {
console.log('Processing trait:', trait.name, 'with index:', trait.index)
console.log(' - trait.description:', typeof trait.description, '|', trait.description)
console.log(' - trait.desc:', typeof trait.desc, '|', trait.desc)

// Priority 1: Check if trait already has description in various possible formats
if (trait.description && trait.description.trim()) {
console.log('Using existing description for:', trait.name, '|', trait.description)
return {
...trait,
desc: Array.isArray(trait.description) ? trait.description : [trait.description],
description: Array.isArray(trait.description) ? trait.description.join('\n') : trait.description,
}
}

if (trait.desc && Array.isArray(trait.desc) && trait.desc.length && trait.desc[0].trim()) {
console.log('Using existing desc for:', trait.name, '|', trait.desc)
return {
...trait,
desc: trait.desc,
description: trait.desc.join('\n'),
}
}

// Priority 2: Try API data if available
const traitDetail = traitDetails.value[trait.index]
if (traitDetail && traitDetail.desc) {
console.log('Using API description for:', trait.name)
return {
...trait,
desc: traitDetail.desc,
description: Array.isArray(traitDetail.desc) ? traitDetail.desc.join('\n') : traitDetail.desc,
}
}

// Priority 3: Use fallback descriptions
const fallbackDesc = fallbackDescriptions[trait.name]
if (fallbackDesc) {
console.log('Using fallback description for:', trait.name)
return {
...trait,
desc: [fallbackDesc],
description: fallbackDesc,
}
}

// Priority 4: Last resort - provide a basic description
console.log('Using default description for:', trait.name)
return {
// Priority 4: Last resort - provide a basic description
console.log('Using default description for:', trait.name)
return {
...trait,
desc: [`A species trait: ${trait.name}`],
description: `A species trait: ${trait.name}`,
}
})
})

// Fallback trait descriptions for common traits (by name)
const fallbackDescriptions = {
'Draconic Ancestry': ['You have draconic ancestry. Choose one type of dragon from the Draconic Ancestry table. Your
breath weapon and damage resistance are determined by the dragon type.'],
'Breath Weapon': ['You can use your action to exhale destructive energy. Your draconic ancestry determines the size,
shape, and damage type of the exhalation.'],
'Damage Resistance': ['You have resistance to the damage type associated with your draconic ancestry.'],
'Darkvision': ['You have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as
if it were bright light, and in darkness as if it were dim light. You cannot discern color in darkness, only shades of
gray.'],
'Fey Ancestry': ['You have advantage on saving throws against being charmed, and magic cannot put you to sleep.'],
'Trance': ['Elves do not need to sleep. Instead, they meditate deeply, remaining semiconscious, for 4 hours a day. After
resting in this way, you gain the same benefit that a human does from 8 hours of sleep.'],
'Keen Senses': ['You have proficiency in the Perception skill.'],
'Dwarven Resilience': ['You have advantage on saving throws against poison, and you have resistance against poison
damage.'],
'Stout Resilience': ['You have advantage on saving throws against poison, and you have resistance against poison
damage.'],
'Stonecunning': ['Whenever you make an Intelligence (History) check related to the origin of stonework, you are
considered proficient in the History skill and add double your proficiency bonus to the check.'],
'Lucky': ['When you roll a 1 on the d20 for an attack roll, ability check, or saving throw, you can reroll the die and
must use the new roll.'],
'Brave': ['You have advantage on saving throws against being frightened.'],
'Halfling Nimbleness': ['You can move through the space of any creature that is of a size larger than yours.'],
'Hellish Resistance': ['You have resistance to fire damage.'],
'Infernal Legacy': ['You know the thaumaturgy cantrip. When you reach 3rd level, you can cast the hellish rebuke spell
as a 2nd-level spell once with this trait and regain the ability to do so when you finish a long rest.'],
'Extra Language': ['You can speak, read, and write one extra language of your choice.'],
'Skill Versatility': ['You gain proficiency in two skills of your choice.'],
'Natural Armor': ['You have tough, scaly skin. When you aren\'t wearing armor, your AC is 13 + your Dex modifier.'],
}
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
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.15), rgba(var(--v-theme-secondary), 0.08)) !important;
  border: 1px solid rgba(var(--v-theme-outline), 0.2);
}

.ability-score-card:hover {
  transform: scale(1.02);
  border-color: rgba(var(--v-theme-primary), 0.4);
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.20), rgba(var(--v-theme-secondary), 0.12)) !important;
  box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.1);
}

.ability-name {
  color: rgb(var(--v-theme-primary));
  font-weight: 700;
  letter-spacing: 0.5px;
}

.ability-score {
  color: rgb(var(--v-theme-on-surface-variant));
  line-height: 1;
  font-weight: 800;
}

.ability-modifier {
  color: rgb(var(--v-theme-on-surface));
  font-weight: 600;
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

/* Equipment pack styling */
.equipment-pack-container {
  border: 1px solid rgba(var(--v-theme-surface-variant), 0.5);
  border-radius: 12px;
  padding: 16px;
  background: rgba(var(--v-theme-surface), 0.3);
  margin-bottom: 8px;
}

.pack-contents {
  margin-left: 8px;
  margin-top: 8px;
}

.pack-content-chip {
  font-size: 0.75rem !important;
  height: 28px !important;
  padding: 0 8px !important;
  margin: 2px !important;
}

:deep(.pack-content-chip .v-chip__content) {
  font-weight: 500;
  line-height: 1.2;
}
</style>
