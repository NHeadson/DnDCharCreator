<template>
  <div class="mb-6">
    <v-row>
      <v-col cols="12" md="5">
        <v-card variant="outlined">
          <v-card-title class="d-flex align-center py-2">
            <v-icon class="me-2" start>mdi-dna</v-icon>
            Species Selection
          </v-card-title>
          <v-card-text class="pt-2 pb-3">
            <v-select v-model="character.species" density="compact" :error="!!characterData?.speciesError"
              item-title="name" :error-messages="characterData?.speciesError" item-value="id"
              :items="characterData?.speciesOptions || []" label="Choose Your Species"
              :loading="characterData?.isLoadingSpecies" variant="outlined" @update:model-value="onSpeciesChange">
              <template #prepend>
                <v-icon color="primary" size="small">mdi-account-group</v-icon>
              </template>
            </v-select>

            <!-- Subspecies/Lineage Selection -->
            <v-select v-if="character.species && availableLineages.length > 0" v-model="character.speciesLineage"
              class="mt-3" density="compact" item-title="name" item-value="name" :items="availableLineages"
              label="Choose Your Lineage/Subrace" variant="outlined" @update:model-value="onLineageChange">
              <template #prepend>
                <v-icon color="secondary" size="small">mdi-family-tree</v-icon>
              </template>
            </v-select>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="7">
        <v-card v-if="!character.species" class="text-blue-grey-lighten-5 species-preview-card" variant="tonal">
          <v-card-title class="d-flex align-center py-2">
            <v-icon class="text-blue-grey-darken-2 me-2" size="small">mdi-dna</v-icon>
            <span class="text-subtitle-2 text-grey">Species Details</span>
          </v-card-title>
          <v-divider />
          <v-card-text class="d-flex align-center justify-center text-center py-4">
            <v-fade-transition>
              <div v-if="characterData?.isLoadingSpecies">
                <v-progress-circular class="mb-2" color="primary" indeterminate :size="32" />
                <div class="text-subtitle-2 text-primary">Loading Species Data...</div>
              </div>
              <div v-else>
                <v-icon class="mb-2 text-grey-darken-1" size="32">mdi-help-circle-outline</v-icon>
                <div class="text-subtitle-2 text-grey-darken-1">Select a Species</div>
                <div class="text-caption text-grey mt-1">Choose your character's species to view details</div>
              </div>
            </v-fade-transition>
          </v-card-text>
        </v-card>
        <v-card v-else-if="selectedSpeciesInfo" class="species-preview-card" variant="outlined">
          <v-card-title class="d-flex align-center justify-space-between py-2">
            <div class="d-flex align-center">
              <v-icon class="me-2" color="primary" size="small">mdi-dna</v-icon>
              <span class="text-subtitle-1 font-weight-bold">{{ selectedSpeciesInfo.name }}</span>
            </div>
            <v-chip-group v-if="selectedSpeciesInfo.abilityBonus?.length" class="ma-0">
              <v-chip v-for="bonus in selectedSpeciesInfo.abilityBonus" :key="bonus.ability" color="blue" size="x-small"
                variant="text">
                +{{ bonus.bonus }} {{ bonus.ability.slice(0, 3) }}
              </v-chip>
            </v-chip-group>
          </v-card-title>
          <v-divider />
          <v-card-text class="pt-3 pb-2">
            <!-- Quick Stats -->
            <div class="d-flex flex-wrap gap-2 mb-3">
              <v-chip color="green" size="small" variant="flat">
                <v-icon start size="small">mdi-resize</v-icon>
                {{ selectedSpeciesInfo.size }}
              </v-chip>
              <v-chip color="green" size="small" variant="flat">
                <v-icon start size="small">mdi-run</v-icon>
                {{ selectedSpeciesInfo.speed }}ft
              </v-chip>
              <v-chip v-if="selectedSpeciesInfo.darkvision" color="purple" size="small" variant="flat">
                <v-icon start size="small">mdi-eye</v-icon>
                {{ selectedSpeciesInfo.darkvision }}ft vision
              </v-chip>
              <v-chip v-if="selectedSpeciesInfo.damageResistance" color="orange" size="small" variant="flat">
                <v-icon start size="small">mdi-shield</v-icon>
                Resistances
              </v-chip>
            </div>

            <!-- Special Traits -->
            <div v-if="selectedSpeciesInfo.traits?.length" class="mb-3">
              <div class="d-flex align-center mb-1">
                <v-icon class="me-1" color="amber" size="small">mdi-star-circle</v-icon>
                <span class="text-caption font-weight-bold text-grey-darken-2">Special Traits</span>
              </div>
              <div class="ms-3">
                <v-chip v-for="trait in selectedSpeciesInfo.traits" :key="trait.name" color="amber-lighten-4"
                  size="x-small" variant="flat" class="me-1 mb-1">
                  {{ trait.name }}
                </v-chip>
              </div>
            </div>

            <!-- Languages -->
            <div v-if="selectedSpeciesInfo.languages?.length" class="mb-3">
              <div class="d-flex align-center mb-1">
                <v-icon class="me-1" color="indigo" size="small">mdi-translate</v-icon>
                <span class="text-caption font-weight-bold text-grey-darken-2">Languages</span>
              </div>
              <div class="ms-3">
                <v-chip v-for="lang in selectedSpeciesInfo.languages" :key="lang" color="indigo" size="x-small"
                  variant="outlined" class="me-1">
                  {{ lang }}
                </v-chip>
              </div>
            </div>

            <!-- Lineage Options with Highlights -->
            <div v-if="selectedSpeciesInfo.lineages?.length" class="mt-3">
              <div class="d-flex align-center mb-2">
                <v-icon class="me-1" color="primary" size="small">mdi-family-tree</v-icon>
                <span class="text-caption font-weight-bold text-grey-darken-2">
                  {{ selectedSpeciesInfo.lineages.length > 1 ? 'Lineage Options' : 'Available Lineage' }}
                </span>
              </div>
              <div v-if="selectedSpeciesInfo.lineages.length === 1" class="ms-3">
                <v-chip color="primary" size="small" variant="outlined">
                  {{ selectedSpeciesInfo.lineages[0].name }}
                </v-chip>
              </div>
              <div v-else class="ms-3">
                <div class="lineage-options-row">
                  <div v-for="lineage in selectedSpeciesInfo.lineages" :key="lineage.id"
                    class="lineage-option-card compact">
                    <div class="d-flex align-center justify-space-between">
                      <span class="text-caption font-weight-bold">{{ lineage.name }}</span>
                    </div>
                    <div v-if="getLineageHighlights(lineage)" class="text-caption text-grey-darken-1 mt-1">
                      {{ getLineageHighlights(lineage) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

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

const activeSubrace = ref(0)
const availableLineages = ref([])

const selectedSpeciesInfo = computed(() => {
  if (!props.character.species || !props.characterData?.speciesData) {
    return null
  }

  // speciesData is a ref, so we need to access its value
  const info = props.characterData.speciesData.find(
    species => species.id === props.character.species,
  )
  return info
})

// Watch for species changes to load lineages
watch(() => props.character.species, (newSpeciesId) => {
  if (newSpeciesId && selectedSpeciesInfo.value?.lineages) {
    availableLineages.value = selectedSpeciesInfo.value.lineages || []
  } else {
    availableLineages.value = []
  }

  // Clear lineage selection when species changes
  props.character.speciesLineage = null
}, { immediate: true })

const onSpeciesChange = () => {
  // Update species details when species changes
  if (props.character.species && selectedSpeciesInfo.value) {
    props.character.speciesDetails = selectedSpeciesInfo.value
  }

  // Call the original update function if it exists
  if (props.characterData?.updateSpeciesTraits) {
    props.characterData.updateSpeciesTraits()
  }
}

const onLineageChange = () => {
  console.log('Lineage changed to:', props.character.speciesLineage)
  // Additional logic for lineage changes can be added here
}

// Get key differentiators for each lineage/subrace
const getLineageHighlights = (lineage) => {
  const highlights = {
    // Elf lineages
    'High Elf': '+1 INT, Cantrip, Extra Language',
    'Wood Elf': '+1 WIS, Elf Weapon Training, Stealth',
    'Dark Elf (Drow)': '+1 CHA, Superior Darkvision, Drow Magic',
    'Drow': '+1 CHA, Superior Darkvision, Drow Magic',

    // Dwarf lineages
    'Hill Dwarf': '+1 WIS, +1 HP per level, Wisdom bonus',
    'Mountain Dwarf': '+2 STR, Armor Proficiency, More robust',

    // Halfling lineages
    'Lightfoot': '+1 CHA, Naturally Stealthy, Social',
    'Lightfoot Halfling': '+1 CHA, Naturally Stealthy, Social',
    'Stout': '+1 CON, Poison Resistance, Hardy',
    'Stout Halfling': '+1 CON, Poison Resistance, Hardy',

    // Gnome lineages
    'Forest Gnome': '+1 DEX, Speak with Animals, Nature magic',
    'Rock Gnome': '+1 CON, Tinker abilities, Tool expertise',

    // Human variants
    'Variant Human': 'Extra Feat, Extra Skill, Flexible stats',

    // Default fallback
    'default': 'Unique traits and abilities'
  }

  return highlights[lineage.name] || highlights['default']
}
</script>

<style scoped>
.species-preview-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.species-preview-card :deep(.v-card-text) {
  padding: 12px 16px;
}




.lineage-options-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 4px;
}

.lineage-option-card {
  background: #181b20 !important;
  border: 1.5px solid #23272e !important;
  color: #f3f4f6 !important;
  transition: all 0.2s ease;
  min-width: 0;
  flex: 1 1 180px;
  max-width: 220px;
  padding: 8px 12px !important;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.lineage-option-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  border-color: rgba(0, 0, 0, 0.15);
}

.trait-panel {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  margin-bottom: 4px;
  transition: box-shadow 0.2s ease;
}

.trait-panel:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.trait-panel :deep(.v-expansion-panel-title) {
  min-height: 36px;
  padding: 8px 12px;
}

.trait-panel :deep(.v-expansion-panel-text__wrapper) {
  padding: 8px 12px;
}

.subrace-tabs {
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

:deep(.v-chip-group) {
  margin: -2px;
}

:deep(.v-chip) {
  margin: 2px !important;
}

:deep(.v-row) {
  margin: 0 -8px;
}

:deep(.v-col) {
  padding: 8px;
}

:deep(.text-caption) {
  line-height: 1.4;
}

:deep(.text-subtitle-2) {
  line-height: 1.3;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Loading state transitions */
.v-select :deep(.v-field__append-inner) {
  transition: transform 0.2s ease;
}

.v-select.v-field--loading :deep(.v-field__append-inner) {
  transform: rotate(360deg);
}

/* Ability Scores Grid */
.ability-scores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 8px;
  margin-top: 8px;
}

.ability-score-chip {
  transition: all 0.2s ease;
  text-align: center;
  justify-content: center;
}

.ability-score-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Trait Panels Animation */
.trait-panel {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.trait-panel:hover {
  transform: translateY(-1px);
}

/* Smooth transitions */
.v-fade-transition-enter-active,
.v-fade-transition-leave-active {
  transition: opacity 0.3s ease;
}

.v-fade-transition-enter-from,
.v-fade-transition-leave-to {
  opacity: 0;
}

/* Card transitions */
.species-preview-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.species-preview-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
