<template>
  <v-dialog max-width="900px" :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <v-card class="portrait-selector-card">
      <v-card-title class="d-flex align-center">
        <span class="text-h5">Select a Portrait</span>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" @click="$emit('update:modelValue', false)" />
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-tabs v-model="currentRaceTab" align-tabs="center" class="mb-4" grow>
          <v-tab v-for="race in availableRaces" :key="race" class="text-capitalize" :value="race">{{ getRaceDisplayName(race) }}</v-tab>
        </v-tabs>

        <v-window v-model="currentRaceTab">
          <v-window-item v-for="race in availableRaces" :key="race" :value="race">
            <!-- Subspecies tabs if race has subspecies -->
            <v-tabs v-if="getSubspeciesForRace(race).length > 0" v-model="currentSubraceTab[race]" align-tabs="center" class="mb-3 subspecies-tabs" density="compact">
              <v-tab v-for="subspecies in getSubspeciesForRace(race)" :key="subspecies" :value="subspecies">
                {{ getSubspeciesDisplayName(subspecies) }}
              </v-tab>
            </v-tabs>

            <v-divider v-if="getSubspeciesForRace(race).length > 0" class="mb-4" />

            <v-row dense>
              <v-col v-for="gender in availableGenders(race)" :key="gender" cols="12" md="6">
                <div class="text-subtitle-1 font-weight-bold mb-3 text-capitalize text-center">
                  {{ gender }}
                </div>

                <!-- Loading state -->
                <div v-if="isLoading" class="d-flex justify-center mb-3">
                  <v-card class="portrait-item" flat style="width: 200px; height: 200px">
                    <div class="d-flex align-center justify-center fill-height grey-lighten-3 rounded-lg">
                      <div class="text-center">
                        <v-progress-circular class="mb-2" color="primary" indeterminate size="32" />
                        <div class="text-body-2 text-medium-emphasis">Loading portraits...</div>
                      </div>
                    </div>
                  </v-card>
                </div>

                <!-- Portrait grid - centered below gender label -->
                <div v-else class="d-flex justify-center mb-3">
                  <v-card
                    v-for="portrait in getPortraitsForRaceGender(race, gender)"
                    :key="portrait.id"
                    class="portrait-item"
                    flat
                    hover
                    @click="selectPortrait(portrait)"
                    style="width: 200px; height: 200px; margin: 0 8px"
                  >
                    <v-img :alt="`${race} ${gender} portrait`" :aspect-ratio="1" class="rounded-lg" cover :src="portrait.url">
                      <template #placeholder>
                        <div class="d-flex align-center justify-center fill-height grey-lighten-3">
                          <v-icon color="grey-lighten-1" size="48">mdi-account</v-icon>
                        </div>
                      </template>
                      <template #error>
                        <div class="d-flex flex-column align-center justify-center fill-height grey-lighten-3">
                          <v-icon class="mb-1" color="grey-lighten-1" size="32">mdi-image-off</v-icon>
                          <div class="text-caption text-center text-grey-lighten-1 px-2">Image not found</div>
                        </div>
                      </template>
                    </v-img>
                  </v-card>
                </div>
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  characterRace: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'select'])

const RACES = ['dragonborn', 'dwarf', 'elf', 'gnome', 'half-elf', 'halfling', 'half-orc', 'human', 'tiefling']
const GENDERS = ['female', 'male']
const currentRaceTab = ref(props.characterRace || RACES[0])
const currentSubraceTab = ref({})

// Dynamic portrait discovery based on folder structure
const portraits = ref([])
const isLoading = ref(true)

// Function to discover portraits from the folder structure
const discoverPortraits = async () => {
  const discoveredPortraits = []
  const raceConfigs = {
    dragonborn: { subspecies: [] },
    dwarf: { subspecies: ['hill', 'mountain'] },
    elf: { subspecies: ['dark', 'high', 'wood'] },
    gnome: { subspecies: ['forest', 'rock'] },
    'half-elf': { subspecies: [] },
    halfling: { subspecies: ['lightfoot', 'stout'] },
    'half-orc': { subspecies: [] },
    human: { subspecies: [] },
    tiefling: { subspecies: [] },
  }
  const genders = ['female', 'male']

  for (const [race, config] of Object.entries(raceConfigs)) {
    if (config.subspecies.length > 0) {
      // Race has subspecies
      for (const subspecies of config.subspecies) {
        for (const gender of genders) {
          const portraitUrl = `/assets/portraits/${race}/${subspecies}/${gender}/1.jpg`
          console.log(`Portrait URL: ${portraitUrl}`) // Debug log

          discoveredPortraits.push({
            id: `${race}-${subspecies}-${gender}-1`,
            race: race,
            subspecies: subspecies,
            gender: gender,
            url: portraitUrl,
          })
        }
      }
    } else {
      // Race has no subspecies
      for (const gender of genders) {
        const portraitUrl = `/assets/portraits/${race}/${gender}/1.jpg`
        console.log(`Portrait URL: ${portraitUrl}`) // Debug log

        discoveredPortraits.push({
          id: `${race}-${gender}-1`,
          race: race,
          subspecies: null,
          gender: gender,
          url: portraitUrl,
        })
      }
    }
  }

  portraits.value = discoveredPortraits
  isLoading.value = false
}

// Initialize portraits on component mount
onMounted(async () => {
  await discoverPortraits()

  // Initialize subspecies tabs to first option for each race
  const subspeciesDefaults = {}
  RACES.forEach((race) => {
    const subspecies = getSubspeciesForRace(race)
    if (subspecies.length > 0) {
      subspeciesDefaults[race] = subspecies[0]
    }
  })
  currentSubraceTab.value = subspeciesDefaults
})

const availableRaces = computed(() => {
  if (props.characterRace && RACES.includes(props.characterRace)) {
    return [props.characterRace]
  }
  return RACES
})

// Function to get display name for a race
function getRaceDisplayName(race) {
  const displayNames = {
    dragonborn: 'Dragonborn',
    dwarf: 'Dwarf',
    elf: 'Elf',
    gnome: 'Gnome',
    'half-elf': 'Half-Elf',
    halfling: 'Halfling',
    'half-orc': 'Half-Orc',
    human: 'Human',
    tiefling: 'Tiefling',
  }
  return displayNames[race] || race
}

// Function to get subspecies for a race
function getSubspeciesForRace(race) {
  const subspeciesMap = {
    dwarf: ['hill', 'mountain'],
    elf: ['dark', 'high', 'wood'],
    gnome: ['forest', 'rock'],
    halfling: ['lightfoot', 'stout'],
  }
  return subspeciesMap[race] || []
}

// Function to get subspecies display name
function getSubspeciesDisplayName(subspecies) {
  const displayNames = {
    hill: 'Hill Dwarf',
    mountain: 'Mountain Dwarf',
    dark: 'Dark Elf (Drow)',
    high: 'High Elf',
    wood: 'Wood Elf',
    forest: 'Forest Gnome',
    rock: 'Rock Gnome',
    lightfoot: 'Lightfoot',
    stout: 'Stout',
  }
  return displayNames[subspecies] || subspecies
}

function availableGenders(race) {
  if (isLoading.value) return GENDERS // Return all genders if portraits not loaded yet
  return GENDERS.filter((gender) => portraits.value.some((p) => p.race === race && p.gender === gender))
}

function getPortraitsForRaceGender(race, gender) {
  if (isLoading.value) return [] // Return empty array if portraits not loaded yet

  // Get subspecies if race has them
  const subspecies = getSubspeciesForRace(race)

  if (subspecies.length > 0) {
    // Filter by race, gender, and current subspecies selection
    const currentSubspecies = currentSubraceTab.value[race] || subspecies[0]
    return portraits.value.filter((p) => p.race === race && p.gender === gender && p.subspecies === currentSubspecies)
  } else {
    // Filter by race and gender only (no subspecies)
    return portraits.value.filter((p) => p.race === race && p.gender === gender)
  }
}

const selectPortrait = (portrait) => {
  console.log('PortraitSelector - Selected portrait:', portrait)
  const selectionData = {
    url: portrait.url,
    race: portrait.race,
    subspecies: portrait.subspecies,
  }
  console.log('PortraitSelector - Emitting selection:', selectionData)
  emit('select', selectionData)
  emit('update:modelValue', false)
}
</script>

<style scoped>
.portrait-selector-card {
  border-radius: 16px;
}

.portrait-item {
  cursor: pointer;
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
  border: 2px solid transparent;
}

.portrait-item:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-color: rgba(var(--v-theme-primary), 0.6);
}

/* Add gap between subspecies tabs */
.subspecies-tabs :deep(.v-tab) {
  margin: 0 4px;
}

/* Highlight active subspecies tab */
.subspecies-tabs :deep(.v-tab--selected) {
  background-color: rgba(var(--v-theme-primary), 0.12);
  font-weight: 600;
}
</style>
