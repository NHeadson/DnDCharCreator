<template>
  <div class="mb-6">
    <v-row>
      <v-col cols="12" lg="5" md="6">
        <v-card variant="outlined">
          <v-card-title class="d-flex align-center py-2">
            <v-icon class="me-2" start>mdi-book-open-variant</v-icon>
            Background Selection
          </v-card-title>
          <v-card-text class="pt-2 pb-3">
            <v-select v-model="character.background" density="compact" :error="!!characterData?.backgroundError"
              :error-messages="characterData?.backgroundError" item-title="name" item-value="id"
              :items="characterData?.backgroundData || []" label="Choose Your Background"
              :loading="characterData?.isLoadingBackgrounds" variant="outlined">
              <template #prepend>
                <v-icon color="primary" size="small">mdi-account-details</v-icon>
              </template>
            </v-select>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" lg="7" md="6">
        <v-card v-if="!character.background" class="text-blue-grey-lighten-5 background-preview-card" variant="tonal">
          <v-card-title class="d-flex align-center py-2">
            <v-icon class="text-blue-grey-darken-2 me-2" size="small">mdi-book-open-variant</v-icon>
            <span class="text-subtitle-2 text-grey">Background Details</span>
          </v-card-title>
          <v-divider />
          <v-card-text class="d-flex align-center justify-center text-center py-4">
            <div>
              <v-icon class="mb-2 text-grey-darken-1" size="32">mdi-book-open-variant</v-icon>
              <div class="text-subtitle-2 text-grey-darken-1">Select a Background</div>
              <div class="text-caption text-grey mt-1">Choose your character's background to view details</div>
            </div>
          </v-card-text>
        </v-card>
        <v-card v-else-if="selectedBackgroundInfo" class="text-blue-grey-lighten-5 background-preview-card"
          variant="tonal">
          <v-card-title class="d-flex align-center justify-space-between py-2">
            <div class="d-flex align-center">
              <v-icon class="text-blue-grey-darken-2 me-2" size="small">mdi-book-open-variant</v-icon>
              <span class="text-subtitle-1 font-weight-bold">{{ selectedBackgroundInfo.name }}</span>
            </div>
            <div class="d-flex flex-column align-end">
              <span class="text-caption text-grey-darken-1 mb-1" style="font-size: 0.85em;">Key Abilities</span>
              <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                <v-tooltip v-for="score in selectedBackgroundInfo.abilityScores || []" :key="'score-' + score"
                  location="top" text="An ability score that's important for characters with this background">
                  <template #activator="{ props }">
                    <v-chip v-bind="props" color="accent" size="small" variant="tonal">
                      {{ score }}
                    </v-chip>
                  </template>
                </v-tooltip>
              </div>
            </div>
          </v-card-title>
          <v-divider />
          <v-card-text class="pt-3 pb-2">
            <!-- Description -->
            <div class="mb-2 ms-3">
              <span class="text-caption text-grey-darken-1">{{ selectedBackgroundInfo.description }}</span>
            </div>

            <!-- Feature -->
            <div v-if="selectedBackgroundInfo.feature" class="mb-3 ms-3">
              <div class="d-flex align-center mb-1">
                <v-icon class="me-1" color="amber" size="small">mdi-star-circle-outline</v-icon>
                <span class="text-caption font-weight-bold text-grey-darken-2">Background Feature</span>
              </div>
              <div class="ms-3">
                <v-tooltip location="top" text="A special benefit that comes with your character's background">
                  <template #activator="{ props }">
                    <v-chip v-bind="props" class="me-2 mb-1" color="amber" size="small" variant="tonal">
                      {{ selectedBackgroundInfo.feature.name }}
                    </v-chip>
                  </template>
                </v-tooltip>
                <span class="text-caption">{{ selectedBackgroundInfo.feature.description }}</span>
              </div>
            </div>

            <!-- Skill Proficiencies -->
            <div v-if="selectedBackgroundInfo.skillProficiencies?.length" class="mb-3 ms-3">
              <div class="d-flex align-center mb-1">
                <v-icon class="me-1" color="success" size="small">mdi-account-cog</v-icon>
                <span class="text-caption font-weight-bold text-grey-darken-2">Skill Proficiencies</span>
              </div>
              <div class="ms-3">
                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                  <v-tooltip v-for="skill in selectedBackgroundInfo.skillProficiencies" :key="'skill-' + skill"
                    location="top" text="A skill your character is trained in due to their background">
                    <template #activator="{ props }">
                      <v-chip v-bind="props" color="success" size="small" variant="tonal">
                        {{ skill }}
                      </v-chip>
                    </template>
                  </v-tooltip>
                </div>
              </div>
            </div>

            <!-- Tool Proficiencies -->
            <div v-if="selectedBackgroundInfo.toolProficiencies?.length" class="mb-3 ms-3">
              <div class="d-flex align-center mb-1">
                <v-icon class="me-1" color="info" size="small">mdi-tools</v-icon>
                <span class="text-caption font-weight-bold text-grey-darken-2">Tool Proficiencies</span>
              </div>
              <div class="ms-3">
                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                  <v-tooltip v-for="tool in selectedBackgroundInfo.toolProficiencies" :key="'tool-' + tool"
                    location="top" text="A tool or instrument your character learned to use in their background">
                    <template #activator="{ props }">
                      <v-chip v-bind="props" color="info" size="small" variant="tonal">
                        {{ tool }}
                      </v-chip>
                    </template>
                  </v-tooltip>
                </div>
              </div>
            </div>

            <!-- Languages -->
            <div v-if="selectedBackgroundInfo.languages?.length || selectedBackgroundInfo.languageOptions"
              class="mb-3 ms-3">
              <div class="d-flex align-center mb-1">
                <v-icon class="me-1" color="purple" size="small">mdi-translate</v-icon>
                <span class="text-caption font-weight-bold text-grey-darken-2">Languages</span>
              </div>
              <div class="ms-3">
                <div style="display: flex; gap: 6px; flex-wrap: wrap; align-items: center;">
                  <v-tooltip v-for="language in selectedBackgroundInfo.languages || []" :key="'lang-' + language"
                    location="top" text="A language your character learned through their background">
                    <template #activator="{ props }">
                      <v-chip v-bind="props" color="purple" size="small" variant="tonal">
                        {{ language }}
                      </v-chip>
                    </template>
                  </v-tooltip>
                  <v-tooltip v-for="option in selectedBackgroundInfo.languageOptions.from"
                    v-if="selectedBackgroundInfo.languageOptions && selectedBackgroundInfo.languageOptions.from && Array.isArray(selectedBackgroundInfo.languageOptions.from)"
                    :key="'langopt-' + option" location="top"
                    text="A language option available to choose from for this background">
                    <template #activator="{ props }">
                      <v-chip v-bind="props" color="purple" size="small" variant="tonal">
                        {{ option }}
                      </v-chip>
                    </template>
                  </v-tooltip>
                  <span v-if="selectedBackgroundInfo.languageOptions" class="text-caption text-grey-darken-1 ml-2">
                    (choose {{ selectedBackgroundInfo.languageOptions.choose }} additional language{{
                      selectedBackgroundInfo.languageOptions.choose > 1 ? 's' : '' }})
                  </span>
                </div>
              </div>
            </div>

            <!-- Starting Equipment -->
            <div v-if="selectedBackgroundInfo.startingEquipment && selectedBackgroundInfo.startingEquipment.length"
              class="mb-3 ms-3">
              <div class="d-flex align-center mb-1">
                <v-icon class="me-1" color="accent" size="small">mdi-package-variant</v-icon>
                <span class="text-caption font-weight-bold text-grey-darken-2">Starting Equipment</span>
              </div>
              <div class="ms-3">
                <v-tooltip v-for="item in selectedBackgroundInfo.startingEquipment"
                  :key="'equip-' + (item.name || item)" location="top"
                  text="Equipment provided by your background that helps tell your character's story">
                  <template #activator="{ props }">
                    <v-chip v-bind="props" class="me-2 mb-1" color="accent" size="small" variant="tonal">
                      {{ typeof item === 'object' && item.name ? item.name + (item.quantity && item.quantity > 1 ? ' x'
                        +
                        item.quantity : '') : item }}
                    </v-chip>
                  </template>
                </v-tooltip>
              </div>
            </div>

            <!-- Feat (if present) -->
            <div v-if="selectedBackgroundInfo.feat" class="mb-3 ms-3">
              <div class="d-flex align-center mb-1">
                <v-icon class="me-1" color="deep-purple" size="small">mdi-star-four-points</v-icon>
                <span class="text-caption font-weight-bold text-grey-darken-2">Bonus Feat</span>
              </div>
              <div class="ms-3">
                <v-tooltip location="top" text="An additional feat granted by this background">
                  <template #activator="{ props }">
                    <v-chip v-bind="props" class="me-2 mb-1" color="deep-purple" size="small" variant="tonal">
                      {{ selectedBackgroundInfo.feat }}
                    </v-chip>
                  </template>
                </v-tooltip>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { dndAPI } from '@/services/dndAPI.js'

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

// Watch for background selection and fetch details
watch(() => props.character.background, async (newBackground, oldBackground) => {
  if (newBackground && newBackground !== oldBackground) {
    props.character.backgroundDetails = null;
    // Fetch detailed background data from API
    const details = await dndAPI.getBackgroundDetails(newBackground);
    if (details) {
      props.character.backgroundDetails = { ...details, id: newBackground };
    }
  }
})

const selectedBackgroundInfo = computed(() => {
  // Prefer backgroundDetails if available
  if (props.character.backgroundDetails &&
    props.character.backgroundDetails.id === props.character.background) {
    return props.character.backgroundDetails;
  }
  // Fallback to backgroundData (basic info)
  if (!props.character.background || !props.characterData?.backgroundData) return null
  return props.characterData.backgroundData.find(
    background => background.id === props.character.background,
  )
})
</script>

<style scoped>
.background-preview-card {
  transition: all 0.2s ease-in-out;
}

.background-preview-card :deep(.v-card-text) {
  padding: 12px 16px;
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

.v-chip-group {
  flex-wrap: wrap;
}

.v-chip {
  margin-bottom: 4px;
}
</style>
