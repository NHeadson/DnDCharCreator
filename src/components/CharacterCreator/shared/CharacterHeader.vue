<template>
  <v-card class="character-header-card mb-6">
    <v-row class="dense-form align-center" no-gutters>
      <!-- Character Portrait -->
      <v-col class="px-6 py-4" cols="12" sm="2">
        <div class="character-portrait-container">
          <div class="character-portrait" @click="isPortraitSelectorOpen = true">
            <v-img class="portrait-image" cover height="100" :src="character.portrait || ''" width="100">
              <template #placeholder>
                <div class="portrait-placeholder d-flex align-center justify-center fill-height">
                  <v-icon color="grey-lighten-2" size="36">mdi-account-circle</v-icon>
                </div>
              </template>
            </v-img>
          </div>
        </div>
      </v-col>

      <!-- Character & Player Name -->
      <v-col class="px-6 py-4" cols="12" sm="7">
        <v-row dense>
          <v-col cols="12" md="8">
            <v-text-field v-model="character.name" class="character-name-input" density="compact" hide-details
              :placeholder="$vuetify.display.mobile ? 'Character Name' : 'Enter Character Name'" variant="outlined">
              <template #append-inner>
                <v-btn class="random-name-btn" color="primary" icon :loading="isGeneratingName" size="small"
                  variant="text" @click="generateRandomName">
                  <v-icon size="24">mdi-dice-6</v-icon>
                  <v-tooltip activator="parent" location="top">Generate random name</v-tooltip>
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field v-model="character.playerName" density="compact" hide-details label="Player Name"
              variant="outlined" />
          </v-col>
        </v-row>
      </v-col>

      <!-- Level & XP -->
      <v-col class="px-6 py-4" cols="12" sm="3">
        <v-row dense no-gutters>
          <v-col class="pe-2" cols="6">
            <div class="stat-display stat-secondary-bg">
              <div class="stat-label">Level</div>
              <div class="stat-value">{{ character.level ?? 1 }}</div>
            </div>
          </v-col>
          <v-col class="ps-2" cols="6">
            <div class="stat-display stat-secondary-bg">
              <div class="stat-label">XP</div>
              <div class="stat-value">{{ character.xp ?? 0 }}</div>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
  <PortraitSelector v-model="isPortraitSelectorOpen" @select="handlePortraitSelect" />
</template>

<script setup>
import { nextTick, ref } from 'vue'
import PortraitSelector from './PortraitSelector.vue'

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

const isGeneratingName = ref(false)
const isPortraitSelectorOpen = ref(false)

// Initialize character properties if they don't exist
if (!props.character.playerName) props.character.playerName = ''
if (!props.character.portrait) props.character.portrait = ''

const generateRandomName = async () => {
  if (!props.characterData?.generateName) {
    // Fallback if no name generator available
    generateFallbackName()
    return
  }

  isGeneratingName.value = true
  try {
    // Use the species for name generation, fallback to 'human'
    const race = props.character.species || 'human'
    const generatedName = await props.characterData.generateName(race)
    props.character.name = generatedName
  } catch (error) {
    console.error('Error generating name:', error)
    generateFallbackName()
  } finally {
    isGeneratingName.value = false
  }
}

const generateFallbackName = () => {
  const firstNames = [
    'Aeliana',
    'Bran',
    'Cora',
    'Dain',
    'Elen',
    'Finn',
    'Gwen',
    'Hal',
    'Ivy',
    'Jace',
    'Kira',
    'Liam',
    'Maya',
    'Nox',
    'Ora',
    'Pike',
    'Quinn',
    'Rae',
    'Sage',
    'Tara',
    'Uma',
    'Vale',
    'Wren',
    'Zara',
  ]

  const lastNames = [
    'Brightblade',
    'Stormwind',
    'Ironforge',
    'Goldleaf',
    'Shadowmere',
    'Flameheart',
    'Frostborn',
    'Starweaver',
    'Moonwhisper',
    'Thornfield',
    'Dragonbane',
    'Swiftarrow',
    'Battlehammer',
    'Silverbough',
    'Nightfall',
    'Dawnbreaker',
    'Riverstone',
    'Wildmane',
    'Emberfall',
    'Crystalvein',
    'Ashwood',
    'Blackthorn',
    'Greycloak',
    'Redbeard',
    'Silverhand',
  ]

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  props.character.name = `${firstName} ${lastName}`
}

const handlePortraitSelect = async selection => {
  console.log('CharacterHeader - Received selection:', selection)
  props.character.portrait = selection.url
  if (selection.race) {
    console.log('Setting species to:', selection.race)
    props.character.species = selection.race
  }

  // Use nextTick to set lineage after species watch has completed
  if (selection.subspecies) {
    await nextTick()

    // Map portrait subspecies to API lineage IDs
    const subspeciesMapping = {
      // Elf subspecies
      dark: 'dark-elf',
      high: 'high-elf',
      wood: 'wood-elf',
      // Dwarf subspecies
      hill: 'hill-dwarf',
      mountain: 'mountain-dwarf',
      // Gnome subspecies
      forest: 'forest-gnome',
      rock: 'rock-gnome',
      // Halfling subspecies (check both with and without suffix)
      lightfoot: 'lightfoot',
      stout: 'stout',
    }

    const lineageId = subspeciesMapping[selection.subspecies] || selection.subspecies
    console.log('Setting speciesLineage to:', lineageId, '(from subspecies:', selection.subspecies + ')')
    props.character.speciesLineage = lineageId
    console.log('Character after lineage update:', props.character)
  }

  isPortraitSelectorOpen.value = false
}
</script>

<style scoped>
/* Card styling */
.character-header-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
}

/* Portrait section styling */
.character-portrait-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.character-portrait {
  position: relative;
  width: 10vh;
  height: 10vh;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid var(--theme-accent);
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--v-theme-surface-variant);
}

.character-portrait:hover {
  border-color: rgba(var(--v-theme-primary), 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.portrait-image {
  transition: all 0.3s ease;
}

.character-portrait:hover .portrait-image {
  transform: scale(1.05);
}

.portrait-placeholder {
  background: var(--v-theme-surface-variant);
  width: 100%;
  height: 100%;
}

/* Name field styling */
.character-name-section {
  :deep(.character-name-input .v-field__input) {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--v-theme-primary);
  }

  :deep(.v-field) {
    border-radius: 6px;
    border: 2px solid rgba(var(--v-theme-primary), 0.2);
  }

  :deep(.v-field--focused) {
    border-color: var(--v-theme-primary);
    box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.1);
  }
}

/* Input field common styles */
:deep(.v-input) {
  .v-field {
    border-radius: 6px;
    transition: all 0.2s ease;
  }

  .v-field--focused {
    box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.1);
  }

  .v-field__input {
    font-size: 0.95rem;
    font-weight: 500;
  }

  .v-label {
    font-size: 0.875rem;
    font-weight: 500;
  }
}

/* Stat display styling */
.stat-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  border: 1px solid var(--theme-secondary);
  border-radius: 6px;
  min-height: 56px;
  justify-content: center;
}

.stat-secondary-bg {
  background-color: var(--theme-secondary);
}

.stat-secondary-bg .stat-label,
.stat-secondary-bg .stat-value {
  color: #222;
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--v-theme-on-surface-variant);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--v-theme-on-surface);
}

/* Button styling */
:deep(.v-btn) {
  text-transform: none;
  font-weight: 500;
  border-radius: 6px;
}

:deep(.v-btn--icon) {
  border-radius: 50%;
  transition: all 0.2s ease;
}

:deep(.v-btn--icon:hover) {
  transform: scale(1.1);
}

/* Row and column spacing */
.v-row {
  margin: 0;

  .v-col {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}

/* Ensure equal height columns */
.dense-form .v-col {
  min-height: 80px;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .character-name-section :deep(.character-name-input .v-field__input) {
    font-size: 1.1rem;
  }

  .character-portrait {
    margin: 0 auto;
    max-width: 100px;
  }
}

@media (max-width: 600px) {
  .character-name-section :deep(.character-name-input .v-field__input) {
    font-size: 1rem;
  }

  .random-name-btn {
    padding-left: 0 !important;
    padding-right: 0 !important;
    min-width: 36px !important;
  }

  /* Stack vertically on mobile */
  .v-row .v-col {
    margin-bottom: 8px;
  }
}
</style>
