<template>
  <v-card variant="outlined" class="mb-6">
    <v-card-title class="d-flex align-center py-2">
      <v-icon class="me-2" color="deep-purple">mdi-account-details</v-icon>
      Backstory & Personality
    </v-card-title>
    <v-divider />
    <v-card-text class="pt-3">
      <!-- Character Name and Basic Info -->
      <v-row class="mb-4">
        <v-col cols="12" md="6">
          <v-text-field v-model="character.name" density="compact" label="Character Name"
            placeholder="e.g., Figwit Goldbeard" variant="outlined">
            <template #prepend>
              <v-icon color="primary" size="small">mdi-account</v-icon>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-select v-model="character.alignment" density="compact" :items="alignments" label="Alignment"
            variant="outlined">
            <template #prepend>
              <v-icon color="secondary" size="small">mdi-compass</v-icon>
            </template>
          </v-select>
        </v-col>
      </v-row>

      <!-- Backstory -->
      <div class="mb-4">
        <h5 class="text-subtitle-2 text-grey-darken-2 mb-2 d-flex align-center">
          <v-icon class="me-2" color="brown" size="small">mdi-book-open-page-variant</v-icon>
          Backstory
        </h5>
        <v-textarea v-model="character.backstory" counter="500" density="compact" label="Character Backstory"
          placeholder="Describe your character's history, motivations, and background..." rows="4" variant="outlined" />
      </div>

      <!-- Personality Traits -->
      <div class="mb-4">
        <h5 class="text-subtitle-2 text-grey-darken-2 mb-2 d-flex align-center">
          <v-icon class="me-2" color="pink" size="small">mdi-emoticon-happy</v-icon>
          Personality Traits
        </h5>
        <div v-if="backgroundPersonalityOptions?.traits?.length" class="mb-2">
          <v-chip-group v-model="selectedBackgroundTraits" multiple>
            <v-chip v-for="trait in backgroundPersonalityOptions.traits" :key="trait" color="pink" filter
              variant="outlined" size="small">
              {{ trait }}
            </v-chip>
          </v-chip-group>
          <div class="text-caption text-grey mt-1">Select traits from your background, or add custom ones below</div>
        </div>
        <v-combobox v-model="character.personality.traits" chips clearable density="compact" label="Personality Traits"
          multiple placeholder="Add personality traits..." variant="outlined" />
      </div>

      <!-- Ideals -->
      <div class="mb-4">
        <h5 class="text-subtitle-2 text-grey-darken-2 mb-2 d-flex align-center">
          <v-icon class="me-2" color="blue" size="small">mdi-lightbulb</v-icon>
          Ideals
        </h5>
        <div v-if="backgroundPersonalityOptions?.ideals?.length" class="mb-2">
          <v-chip-group v-model="selectedBackgroundIdeals" multiple>
            <v-chip v-for="ideal in backgroundPersonalityOptions.ideals" :key="ideal" color="blue" filter
              variant="outlined" size="small">
              {{ ideal }}
            </v-chip>
          </v-chip-group>
          <div class="text-caption text-grey mt-1">Select ideals from your background, or add custom ones below</div>
        </div>
        <v-combobox v-model="character.personality.ideals" chips clearable density="compact" label="Character Ideals"
          multiple placeholder="Add ideals that drive your character..." variant="outlined" />
      </div>

      <!-- Bonds -->
      <div class="mb-4">
        <h5 class="text-subtitle-2 text-grey-darken-2 mb-2 d-flex align-center">
          <v-icon class="me-2" color="orange" size="small">mdi-heart</v-icon>
          Bonds
        </h5>
        <div v-if="backgroundPersonalityOptions?.bonds?.length" class="mb-2">
          <v-chip-group v-model="selectedBackgroundBonds" multiple>
            <v-chip v-for="bond in backgroundPersonalityOptions.bonds" :key="bond" color="orange" filter
              variant="outlined" size="small">
              {{ bond }}
            </v-chip>
          </v-chip-group>
          <div class="text-caption text-grey mt-1">Select bonds from your background, or add custom ones below</div>
        </div>
        <v-combobox v-model="character.personality.bonds" chips clearable density="compact" label="Character Bonds"
          multiple placeholder="Add important connections, people, or places..." variant="outlined" />
      </div>

      <!-- Flaws -->
      <div class="mb-4">
        <h5 class="text-subtitle-2 text-grey-darken-2 mb-2 d-flex align-center">
          <v-icon class="me-2" color="red" size="small">mdi-alert</v-icon>
          Flaws
        </h5>
        <div v-if="backgroundPersonalityOptions?.flaws?.length" class="mb-2">
          <v-chip-group v-model="selectedBackgroundFlaws" multiple>
            <v-chip v-for="flaw in backgroundPersonalityOptions.flaws" :key="flaw" color="red" filter variant="outlined"
              size="small">
              {{ flaw }}
            </v-chip>
          </v-chip-group>
          <div class="text-caption text-grey mt-1">Select flaws from your background, or add custom ones below</div>
        </div>
        <v-combobox v-model="character.personality.flaws" chips clearable density="compact" label="Character Flaws"
          multiple placeholder="Add character weaknesses or vices..." variant="outlined" />
      </div>

      <!-- Background Features (if available) -->
      <div v-if="character.backgroundDetails?.feature" class="mb-4">
        <h5 class="text-subtitle-2 text-grey-darken-2 mb-2 d-flex align-center">
          <v-icon class="me-2" color="indigo" size="small">mdi-star-circle</v-icon>
          Background Feature: {{ character.backgroundDetails.feature.name }}
        </h5>
        <v-card class="pa-3" color="indigo-lighten-5" flat>
          <div class="text-body-2">{{ character.backgroundDetails.feature.description }}</div>
        </v-card>
      </div>
    </v-card-text>
  </v-card>
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
  }
})

// D&D 5e Alignments
const alignments = [
  'Lawful Good', 'Neutral Good', 'Chaotic Good',
  'Lawful Neutral', 'True Neutral', 'Chaotic Neutral',
  'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'
]

// Initialize personality object if it doesn't exist
if (!props.character.personality) {
  props.character.personality = {
    traits: [],
    ideals: [],
    bonds: [],
    flaws: []
  }
}

// Background personality options
const backgroundPersonalityOptions = computed(() => {
  return props.character.backgroundDetails || null
})

// Selected background options (for the chip groups)
const selectedBackgroundTraits = ref([])
const selectedBackgroundIdeals = ref([])
const selectedBackgroundBonds = ref([])
const selectedBackgroundFlaws = ref([])

// Watch for changes in background selections and add them to the character
watch(selectedBackgroundTraits, (newTraits) => {
  if (newTraits && backgroundPersonalityOptions.value?.traits) {
    newTraits.forEach(index => {
      const trait = backgroundPersonalityOptions.value.traits[index]
      if (trait && !props.character.personality.traits.includes(trait)) {
        props.character.personality.traits.push(trait)
      }
    })
  }
}, { deep: true })

watch(selectedBackgroundIdeals, (newIdeals) => {
  if (newIdeals && backgroundPersonalityOptions.value?.ideals) {
    newIdeals.forEach(index => {
      const ideal = backgroundPersonalityOptions.value.ideals[index]
      if (ideal && !props.character.personality.ideals.includes(ideal)) {
        props.character.personality.ideals.push(ideal)
      }
    })
  }
}, { deep: true })

watch(selectedBackgroundBonds, (newBonds) => {
  if (newBonds && backgroundPersonalityOptions.value?.bonds) {
    newBonds.forEach(index => {
      const bond = backgroundPersonalityOptions.value.bonds[index]
      if (bond && !props.character.personality.bonds.includes(bond)) {
        props.character.personality.bonds.push(bond)
      }
    })
  }
}, { deep: true })

watch(selectedBackgroundFlaws, (newFlaws) => {
  if (newFlaws && backgroundPersonalityOptions.value?.flaws) {
    newFlaws.forEach(index => {
      const flaw = backgroundPersonalityOptions.value.flaws[index]
      if (flaw && !props.character.personality.flaws.includes(flaw)) {
        props.character.personality.flaws.push(flaw)
      }
    })
  }
}, { deep: true })
</script>

<style scoped>
:deep(.v-textarea .v-field__input) {
  line-height: 1.5;
}

:deep(.v-combobox .v-chip) {
  margin: 2px;
}

:deep(.v-chip-group .v-chip) {
  margin: 2px;
  transition: all 0.2s ease;
}

:deep(.v-chip-group .v-chip:hover) {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
