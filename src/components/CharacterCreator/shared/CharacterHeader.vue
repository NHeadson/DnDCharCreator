<template>
  <v-card class="character-header-card mb-6">
    <v-row class="dense-form align-center" no-gutters>
      <!-- Character Portrait (Smaller) -->
      <v-col class="pa-3" cols="12" sm="2">
        <div class="character-portrait-container">
          <div class="character-portrait" @click="uploadPortrait">
            <v-img class="portrait-image" cover height="100" width="100" :src="character.portrait">
              <template #placeholder>
                <div class="portrait-placeholder d-flex align-center justify-center fill-height">
                  <v-icon color="grey-lighten-2" size="36">mdi-account-circle</v-icon>
                </div>
              </template>
              <div class="portrait-overlay d-flex align-center justify-center">
                <v-icon color="white" size="24">mdi-camera</v-icon>
              </div>
            </v-img>
          </div>
        </div>
      </v-col>

      <!-- Character Name (Prominent) -->
      <v-col class="pa-3" cols="12" sm="4">
        <div class="character-name-section">
          <v-text-field v-model="character.name" class="character-name-input" hide-details
            placeholder="Enter Character Name" density="compact" variant="outlined">
            <template #append-inner>
              <v-btn color="primary" icon :loading="isGeneratingName" size="small" variant="text"
                @click="generateRandomName">
                <v-icon size="24">mdi-dice-6</v-icon>
                <v-tooltip activator="parent" location="top">Generate random name</v-tooltip>
              </v-btn>
            </template>
          </v-text-field>
        </div>
      </v-col>

      <!-- Player Name -->
      <v-col class="pa-3" cols="12" sm="4">
        <v-text-field v-model="character.playerName" density="compact" hide-details label="Player Name"
          variant="outlined" />
      </v-col>

      <!-- Level & XP (Display Only) -->
      <v-col class="pa-3" cols="12" sm="2">
        <v-row dense>
          <v-col cols="6">
            <div class="stat-display">
              <div class="stat-label">Level</div>
              <div class="stat-value">1</div>
            </div>
          </v-col>
          <v-col cols="6">
            <div class="stat-display">
              <div class="stat-label">XP</div>
              <div class="stat-value">0</div>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'

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

const alignmentOptions = [
  'Lawful Good',
  'Neutral Good',
  'Chaotic Good',
  'Lawful Neutral',
  'True Neutral',
  'Chaotic Neutral',
  'Lawful Evil',
  'Neutral Evil',
  'Chaotic Evil',
]

// Initialize character properties if they don't exist
if (!props.character.playerName) props.character.playerName = ''

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
    'Aeliana', 'Bran', 'Cora', 'Dain', 'Elen', 'Finn', 'Gwen', 'Hal',
    'Ivy', 'Jace', 'Kira', 'Liam', 'Maya', 'Nox', 'Ora', 'Pike',
    'Quinn', 'Rae', 'Sage', 'Tara', 'Uma', 'Vale', 'Wren', 'Zara'
  ]

  const lastNames = [
    'Brightblade', 'Stormwind', 'Ironforge', 'Goldleaf', 'Shadowmere',
    'Flameheart', 'Frostborn', 'Starweaver', 'Moonwhisper', 'Thornfield',
    'Dragonbane', 'Swiftarrow', 'Battlehammer', 'Silverbough', 'Nightfall',
    'Dawnbreaker', 'Riverstone', 'Wildmane', 'Emberfall', 'Crystalvein',
    'Ashwood', 'Blackthorn', 'Greycloak', 'Redbeard', 'Silverhand'
  ]

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  props.character.name = `${firstName} ${lastName}`
}

const uploadPortrait = () => {
  // TODO: Implement portrait upload functionality
  console.log('Portrait upload clicked')
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
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid rgba(var(--v-theme-primary), 0.2);
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
  width: 100%;
  height: 100%;
}

.character-portrait:hover .portrait-image {
  transform: scale(1.05);
}

.portrait-placeholder {
  background: var(--v-theme-surface-variant);
  width: 100%;
  height: 100%;
}

.portrait-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.character-portrait:hover .portrait-overlay {
  opacity: 1;
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

/* Read-only field styling - no hover effects */
:deep(.readonly-field) {
  .v-field {
    background-color: var(--v-theme-surface-variant);
    opacity: 0.8;
  }

  .v-field--focused {
    box-shadow: none !important;
  }

  .v-field__input {
    color: var(--v-theme-on-surface-variant);
    font-weight: 400;
  }
}

/* Stat display styling */
.stat-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  border: 1px solid rgba(var(--v-theme-outline), 0.3);
  border-radius: 6px;
  background-color: var(--v-theme-surface-variant);
  min-height: 56px;
  justify-content: center;
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

/* Switch styling */
:deep(.v-switch) {
  .v-switch__track {
    opacity: 0.3;
  }

  .v-switch__thumb {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
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
  margin: 0 -8px;

  .v-col {
    padding: 8px;
  }
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

  /* Stack vertically on mobile */
  .v-row .v-col {
    margin-bottom: 8px;
  }
}
</style>
