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
            <v-select
              v-model="character.species"
              density="compact"
              :error="!!characterData?.speciesError"
              item-title="name"
              :error-messages="characterData?.speciesError"
              item-value="id"
              :items="characterData?.speciesOptions || []"
              label="Choose Your Species"
              :loading="characterData?.isLoadingSpecies"
              variant="outlined"
            >
              <template #prepend>
                <v-icon color="primary" size="small">mdi-account-group</v-icon>
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
        <v-card v-else-if="selectedSpeciesInfo" class="text-blue-grey-lighten-5 species-preview-card" variant="tonal">
          <v-card-title class="d-flex align-center py-2">
            <v-icon class="text-blue-grey-darken-2 me-2" size="small">mdi-dna</v-icon>
            <span class="text-subtitle-2">{{ selectedSpeciesInfo.name }}</span>
          </v-card-title>
          <v-divider />
          <v-card-text class="pt-3 pb-2" style="max-height: 300px; overflow-y: auto;">
            <div class="mb-2">
              <h5 class="text-caption text-blue-grey-darken-2 mb-1 font-weight-bold">Physical Attributes</h5>
              <div class="ms-2">
                <v-row dense>
                  <v-col cols="6" sm="4">
                    <v-tooltip text="Determines your character's physical stature and carrying capacity">
                      <template #activator="{ props }">
                        <div class="text-center" v-bind="props">
                          <div class="text-overline text-grey-darken-1">Size</div>
                          <div class="text-caption font-weight-bold">{{ selectedSpeciesInfo.size }}</div>
                        </div>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="6" sm="4">
                    <v-tooltip text="Base walking speed in feet per round">
                      <template #activator="{ props }">
                        <div class="text-center" v-bind="props">
                          <div class="text-overline text-grey-darken-1">Speed</div>
                          <div class="text-caption font-weight-bold">{{ selectedSpeciesInfo.speed }} ft</div>
                        </div>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col v-if="selectedSpeciesInfo.darkvision" cols="6" sm="4">
                    <div class="text-center">
                      <div class="text-overline text-grey-darken-1">Darkvision</div>
                      <div class="text-caption font-weight-bold text-purple">{{ selectedSpeciesInfo.darkvision }} ft
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </div>

            <!-- Ability Score Improvements -->
            <div v-if="selectedSpeciesInfo.abilityScores" class="mb-3">
              <h5 class="text-caption text-blue-grey-darken-2 mb-1 font-weight-bold d-flex align-center">
                <v-icon class="me-1" size="x-small">mdi-arrow-up-bold</v-icon>
                Ability Score Improvements
                <v-tooltip class="ms-1" location="right">
                  <template #activator="{ props }">
                    <v-icon color="grey" size="x-small" v-bind="props">mdi-help-circle-outline</v-icon>
                  </template>
                  These bonuses are added to your base ability scores
                </v-tooltip>
              </h5>
              <div class="ability-scores-grid ms-2">
                <v-chip
                  v-for="(value, ability) in selectedSpeciesInfo.abilityScores"
                  :key="ability"
                  class="ability-score-chip"
                  color="success"
                  density="comfortable"
                  size="x-small"
                  variant="flat"
                >
                  <v-icon size="x-small" start>mdi-plus</v-icon>
                  {{ value }} {{ ability }}
                </v-chip>
              </div>
            </div>

            <!-- Special Traits -->
            <div v-if="selectedSpeciesInfo.traits?.length" class="mb-3">
              <h5 class="text-caption text-blue-grey-darken-2 mb-1 font-weight-bold">
                <v-icon class="me-1" size="x-small">mdi-star</v-icon>
                Special Traits
              </h5>
              <v-expansion-panels variant="accordion">
                <v-expansion-panel
                  v-for="trait in selectedSpeciesInfo.traits"
                  :key="trait.name"
                  class="trait-panel"
                  density="compact"
                >
                  <v-expansion-panel-title class="text-caption">
                    {{ trait.name }}
                  </v-expansion-panel-title>
                  <v-expansion-panel-text class="text-caption">
                    {{ trait.description || 'No description available.' }}
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>

            <!-- Languages -->
            <div v-if="selectedSpeciesInfo.languages" class="mb-3">
              <h5 class="text-caption text-blue-grey-darken-2 mb-1 font-weight-bold">
                <v-icon class="me-1" size="x-small">mdi-translate</v-icon>
                Languages
              </h5>
              <v-chip-group class="ms-2">
                <v-chip
                  v-for="lang in selectedSpeciesInfo.languages"
                  :key="lang"
                  color="info"
                  density="comfortable"
                  size="x-small"
                  variant="flat"
                >
                  {{ lang }}
                </v-chip>
              </v-chip-group>
            </div>

            <div v-if="selectedSpeciesInfo.lineages?.length" class="mt-3">
              <h5 class="text-caption text-blue-grey-darken-2 mb-2 font-weight-bold">
                <v-icon class="me-1" size="small">mdi-family-tree</v-icon>
                Available Lineages/Subraces
              </h5>
              <v-tabs v-model="activeSubrace" class="mb-3 subrace-tabs" density="compact" grow>
                <v-tab
                  v-for="(subrace, index) in selectedSpeciesInfo.lineages"
                  :key="index"
                  class="text-caption"
                  :value="index"
                >
                  {{ subrace.name }}
                </v-tab>
              </v-tabs>
              <v-window v-model="activeSubrace" class="v-tabs-window">
                <v-window-item v-for="(subrace, index) in selectedSpeciesInfo.lineages" :key="index" :value="index">
                  <v-card class="pa-3" color="grey-lighten-5" variant="outlined">
                    <div class="text-caption">
                      <!-- This would need to come from the API -->
                      A detailed description of the {{ subrace.name }} subrace would go here.
                    </div>
                  </v-card>
                </v-window-item>
              </v-window>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
  import { computed, ref } from 'vue'

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
</script>

<style scoped>
.species-preview-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.species-preview-card :deep(.v-card-text) {
  padding: 12px 16px;
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
