<template>
  <v-card flat>
    <v-card-title class="text-h4 text-center mb-4">📝 Character Information</v-card-title>
    <v-card-text>
      <character-header :character="character" :character-data="characterData" />

      <!-- Core Character Options -->
      <div class="selection-options">
        <species-selector :character="character" :character-data="characterData" />
        <class-selector :character="character" :character-data="characterData" />
        <background-selector :character="character" :character-data="characterData" />
      </div>

      <basic-details :character="character" :character-data="characterData" />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { watch } from 'vue'
import BackgroundSelector from '../shared/BackgroundSelector.vue'
import BasicDetails from '../shared/BasicDetails.vue'
import CharacterHeader from '../shared/CharacterHeader.vue'
import ClassSelector from '../shared/ClassSelector.vue'
import SpeciesSelector from '../shared/SpeciesSelector.vue'

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

// Map API lineage IDs to portrait folder names
const lineageToSubspeciesMap = {
  'dark-elf': 'dark',
  'high-elf': 'high',
  'wood-elf': 'wood',
  'hill-dwarf': 'hill',
  'mountain-dwarf': 'mountain',
  'forest-gnome': 'forest',
  'rock-gnome': 'rock',
  lightfoot: 'lightfoot',
  stout: 'stout',
}

// Species that have subspecies
const speciesWithSubspecies = ['elf', 'dwarf', 'gnome', 'halfling']

// Function to set default portrait based on species and subspecies
const setDefaultPortrait = () => {
  // Only auto-set if portrait is not already selected
  if (props.character.portrait) {
    return
  }

  const species = props.character.species
  if (!species) {
    return
  }

  // If species has subspecies, wait for subspecies selection
  if (speciesWithSubspecies.includes(species) && !props.character.speciesLineage) {
    console.log('Species has subspecies, waiting for subspecies selection')
    return
  }

  // Get subspecies folder name if applicable
  const lineageId = props.character.speciesLineage
  const subspecies = lineageId ? lineageToSubspeciesMap[lineageId] : null

  // Build portrait path - male is default gender
  let portraitPath
  if (subspecies) {
    portraitPath = `/assets/portraits/${species}/${subspecies}/male/1.jpg`
  } else {
    portraitPath = `/assets/portraits/${species}/male/1.jpg`
  }

  console.log('Auto-setting default portrait:', portraitPath)
  props.character.portrait = portraitPath
}

// Watch for species changes
watch(
  () => props.character.species,
  (newSpecies, oldSpecies) => {
    // Only auto-set if species actually changed (not initial load)
    if (oldSpecies !== undefined && newSpecies !== oldSpecies) {
      setDefaultPortrait()
    }
  }
)

// Watch for subspecies/lineage changes
watch(
  () => props.character.speciesLineage,
  (newLineage, oldLineage) => {
    // Only auto-set if lineage actually changed and species is set
    if (oldLineage !== undefined && newLineage !== oldLineage && props.character.species) {
      setDefaultPortrait()
    }
  }
)
</script>

<style scoped>
.selection-options > :deep(*) {
  margin-bottom: 2rem;
}

/* Remove margin from the last selector */
.selection-options > :deep(*:last-child) {
  margin-bottom: 0;
}

/* Apply proper spacing between the cards */
.selection-options :deep(.v-row) {
  margin: 0;
}

.selection-options :deep(.v-col) {
  padding: 8px;
}
</style>
