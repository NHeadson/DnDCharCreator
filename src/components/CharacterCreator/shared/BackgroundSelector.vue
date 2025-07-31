<template>
  <div class="mb-6">
    <v-row>
      <v-col cols="12" md="5">
        <v-card variant="outlined">
          <v-card-title class="d-flex align-center py-2">
            <v-icon class="me-2" start>mdi-book-open-variant</v-icon>
            Background Selection
          </v-card-title>
          <v-card-text class="pt-2 pb-3">
            <v-select v-model="character.background" density="compact" :error="!!characterData?.backgroundError"
              item-title="name" :error-messages="characterData?.backgroundError" item-value="id"
              :items="characterData?.backgroundData || []" label="Choose Your Background"
              :loading="characterData?.isLoadingBackgrounds" variant="outlined">
              <template #prepend>
                <v-icon color="primary" size="small">mdi-account-details</v-icon>
              </template>
            </v-select>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="7">
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
          <v-card-title class="d-flex align-center py-2">
            <v-icon class="text-blue-grey-darken-2 me-2" size="small">mdi-book-open-variant</v-icon>
            <span class="text-subtitle-2">{{ selectedBackgroundInfo.name }}</span>
          </v-card-title>
          <v-divider />
          <v-card-text class="pt-3 pb-2" style="max-height: 300px; overflow-y: auto;">
            <div class="mb-3">
              <div class="text-caption">{{ selectedBackgroundInfo.description }}</div>
            </div>

            <div v-if="selectedBackgroundInfo.feature" class="mb-3">
              <h5 class="text-caption text-blue-grey-darken-2 mb-1 font-weight-bold">
                <v-icon class="me-1" size="small">mdi-star</v-icon>
                Background Feature
              </h5>
              <div class="ms-2">
                <div class="text-caption font-weight-bold text-warning mb-1">{{ selectedBackgroundInfo.feature.name
                }}</div>
                <div class="text-caption">{{ selectedBackgroundInfo.feature.description }}</div>
              </div>
            </div>

            <div v-if="selectedBackgroundInfo.skillProficiencies?.length" class="mb-3">
              <h5 class="text-caption text-blue-grey-darken-2 mb-1 font-weight-bold">
                <v-icon class="me-1" size="small">mdi-account-cog</v-icon>
                Skill Proficiencies
              </h5>
              <div class="ms-2">
                <v-chip-group>
                  <v-chip v-for="skill in selectedBackgroundInfo.skillProficiencies" :key="skill" class="mb-1"
                    color="success" size="x-small" variant="flat">
                    {{ skill }}
                  </v-chip>
                </v-chip-group>
              </div>
            </div>

            <div v-if="selectedBackgroundInfo.toolProficiencies?.length" class="mb-3">
              <h5 class="text-caption text-blue-grey-darken-2 mb-1 font-weight-bold">
                <v-icon class="me-1" size="small">mdi-tools</v-icon>
                Tool Proficiencies
              </h5>
              <div class="ms-2">
                <v-chip-group>
                  <v-chip v-for="tool in selectedBackgroundInfo.toolProficiencies" :key="tool" class="mb-1" color="info"
                    size="x-small" variant="flat">
                    {{ tool }}
                  </v-chip>
                </v-chip-group>
              </div>
            </div>

            <div v-if="selectedBackgroundInfo.languages?.length || selectedBackgroundInfo.languageOptions" class="mb-3">
              <h5 class="text-caption text-blue-grey-darken-2 mb-1 font-weight-bold">
                <v-icon class="me-1" size="small">mdi-translate</v-icon>
                Languages
              </h5>
              <div class="ms-2">
                <v-chip-group v-if="selectedBackgroundInfo.languages?.length">
                  <v-chip v-for="language in selectedBackgroundInfo.languages" :key="language" class="mb-1"
                    color="purple" size="x-small" variant="flat">
                    {{ language }}
                  </v-chip>
                </v-chip-group>
                <div v-if="selectedBackgroundInfo.languageOptions" class="text-caption">
                  Choose {{ selectedBackgroundInfo.languageOptions.choose }} additional languages
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

const selectedBackgroundInfo = computed(() => {
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
