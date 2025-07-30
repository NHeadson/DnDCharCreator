<template>
  <v-card class="character-header-card mb-6">
    <v-row class="dense-form" no-gutters>
      <!-- Left Column: Character Portrait -->
      <v-col class="pa-4" cols="12" md="3">
        <div class="character-portrait">
          <v-img class="bg-grey-lighten-2" cover height="200" :src="character.portrait || 'placeholder-avatar.png'">
            <template #placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-icon color="grey-lighten-1" size="64">mdi-account-circle</v-icon>
              </div>
            </template>
          </v-img>
          <v-btn block class="mt-2" prepend-icon="mdi-image" size="small" variant="outlined" @click="uploadPortrait">
            Upload Portrait
          </v-btn>
        </div>
      </v-col>

      <!-- Middle Column: Basic Info -->
      <v-col class="pa-4" cols="12" md="6">
        <!-- Character Name -->
        <div class="character-name-field mb-4">
          <v-text-field v-model="character.name" class="text-h4 font-weight-bold" hide-details
            placeholder="CHARACTER NAME" density="comfortable" :rules="[v => !!v || 'Name is required']"
            variant="outlined">
            <template #prepend>
              <v-icon color="primary" size="large">mdi-account-circle</v-icon>
            </template>
            <template #append>
              <v-btn color="primary" icon :loading="isGeneratingName" size="x-large" variant="text"
                @click="generateRandomName">
                <v-icon>mdi-dice-6</v-icon>
                <v-tooltip activator="parent" location="top">Generate random name</v-tooltip>
              </v-btn>
            </template>
          </v-text-field>
        </div>

        <!-- Class, Level & XP Row -->
        <v-row class="mb-2" dense>
          <v-col cols="6">
            <v-select v-model="character.class" density="comfortable" hide-details class="mb-2" item-title="name"
              item-value="id" :items="characterData?.classOptions?.value || []" placeholder="CLASS" variant="outlined"
              @update:model-value="(value) => { character.class = value; characterData?.updateClassTraits(); }" />
          </v-col>
          <v-col cols="3">
            <v-text-field v-model.number="character.level" density="comfortable" max="20" hide-details min="1"
              placeholder="LEVEL" type="number" class="mb-2" variant="outlined" />
          </v-col>
          <v-col cols="3">
            <v-text-field v-model.number="character.xp" density="comfortable" class="mb-2" hide-details placeholder="XP"
              type="number" variant="outlined" />
          </v-col>
        </v-row>

        <!-- Race, Background & Alignment Row -->
        <v-row dense>
          <v-col cols="4">
            <v-select v-model="character.species" density="comfortable" hide-details class="mb-2" item-title="name"
              item-value="id" :items="characterData?.speciesOptions?.value || []" placeholder="RACE"
              variant="outlined" />
          </v-col>
          <v-col cols="4">
            <v-select v-model="character.background" density="comfortable" hide-details item-title="name" class="mb-2"
              item-value="id" :items="characterData?.backgroundOptions?.value || []" placeholder="BACKGROUND"
              variant="outlined" />
          </v-col>
          <v-col cols="4">
            <v-select v-model="character.alignment" class="mb-2" density="comfortable" hide-details
              :items="alignmentOptions" placeholder="ALIGNMENT" variant="outlined" />
          </v-col>
        </v-row>
      </v-col>

      <!-- Right Column: Player Info & Inspiration -->
      <v-col class="pa-4" cols="12" md="3">
        <v-text-field v-model="character.playerName" class="mb-2" density="comfortable" hide-details label="PLAYER NAME"
          variant="outlined" />
        <v-switch v-model="character.inspiration" class="mb-2" color="warning" hide-details label="Inspiration">
          <template #prepend>
            <v-icon color="warning">mdi-star</v-icon>
          </template>
        </v-switch>
        <v-text-field v-model="character.faction" class="mb-2" density="comfortable" hide-details label="FACTION"
          variant="outlined" />
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
if (!props.character.inspiration) props.character.inspiration = false
if (!props.character.xp) props.character.xp = 0
if (!props.character.playerName) props.character.playerName = ''
if (!props.character.faction) props.character.faction = ''

const generateRandomName = async () => {
  isGeneratingName.value = true
  try {
    // TODO: Implement name generation based on race/class
    await new Promise(resolve => setTimeout(resolve, 1000))
    // For now, just generate a placeholder name
    const randomName = `Adventurer_${Math.floor(Math.random() * 1000)}`
    props.character.name = randomName
  } catch (error) {
    console.error('Error generating name:', error)
  } finally {
    isGeneratingName.value = false
  }
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
  border: 1px solid var(--theme-border);
  background-color: var(--theme-surface);
}

/* Portrait section styling */
.character-portrait {
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid var(--theme-border);
  background-color: var(--theme-background);

  .v-img {
    transition: all 0.3s ease;

    &:hover {
      opacity: 0.9;
    }
  }
}

/* Name field styling */
.character-name-field {
  :deep(.v-field__input) {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--theme-text-primary);
  }

  :deep(.v-field) {
    border-radius: 8px;

    &.v-field--focused {
      border-color: var(--theme-primary);
    }
  }
}

/* Input field common styles */
:deep(.v-input) {
  .v-field {
    border-radius: 4px;
    transition: all 0.2s ease;
  }

  .v-field--focused {
    box-shadow: 0 0 0 2px var(--theme-primary-lighten-3);
  }

  .v-field__input {
    font-size: 1rem;
    color: var(--theme-text-primary);
  }

  .v-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--theme-text-secondary);
  }
}

:deep(.v-input--density-comfortable .v-field__input) {
  padding-top: 8px;
  padding-bottom: 8px;
}

/* Select field specific styles */
:deep(.v-select) {
  .v-field__input {
    min-height: 40px;
  }

  .v-select__selection {
    color: var(--theme-text-primary);
  }
}

/* Switch styling */
:deep(.v-switch) {
  .v-switch__track {
    opacity: 0.2;
  }

  .v-switch__thumb {
    color: var(--theme-accent);
  }
}

/* Button styling */
:deep(.v-btn) {
  text-transform: none;
  letter-spacing: 0.5px;
  font-weight: 500;
}

:deep(.v-btn--outlined) {
  border-color: var(--theme-border);
}

:deep(.v-btn--outlined:hover) {
  background-color: var(--theme-primary-lighten-5);
  opacity: 0.9;
}

:deep(.v-btn--icon) {
  opacity: 0.8;
}

:deep(.v-btn--icon:hover) {
  opacity: 1;
}

/* Row and column spacing */
.v-row {
  margin: 0 -8px;

  .v-col {
    padding: 8px;
  }
}

/* Dense form styling */
.dense-form {
  .v-input {
    margin-bottom: 8px;
  }
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .character-name-field :deep(.v-field__input) {
    font-size: 1.25rem;
  }

  :deep(.v-input--density-comfortable .v-field__input) {
    padding-top: 6px;
    padding-bottom: 6px;
  }
}
</style>
