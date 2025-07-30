<template>
  <div class="mb-6">
    <v-row>
      <v-col cols="12" md="5">
        <v-card variant="outlined">
          <v-card-title class="d-flex align-center py-2">
            <v-icon class="me-2" start>mdi-sword-cross</v-icon>
            Class Selection
          </v-card-title>
          <v-card-text class="pt-2 pb-3">
            <v-select
              v-model="character.class"
              density="compact"
              :error="!!characterData?.classError"
              item-title="name"
              :error-messages="characterData?.classError"
              item-value="id"
              :items="characterData?.classOptions || []"
              label="Choose Your Class"
              :loading="characterData?.isLoadingClasses"
              variant="outlined"
              @update:model-value="characterData?.updateClassTraits"
            >
              <template #prepend>
                <v-icon color="primary" size="small">mdi-shield-sword</v-icon>
              </template>
</v-select>
</v-card-text>
</v-card>
</v-col>
<v-col cols="12" md="7">
  <v-card v-if="!character.class" class="text-blue-grey-lighten-5 class-preview-card" variant="tonal">
    <v-card-title class="d-flex align-center py-2">
      <v-icon class="text-blue-grey-darken-2 me-2" size="small">mdi-sword-cross</v-icon>
      <span class="text-subtitle-2 text-grey">Class Details</span>
    </v-card-title>
    <v-divider />
    <v-card-text class="d-flex align-center justify-center text-center py-4">
      <v-fade-transition>
        <div v-if="characterData?.isLoadingClasses">
          <v-progress-circular class="mb-2" color="primary" indeterminate :size="32" />
          <div class="text-subtitle-2 text-primary">Loading Class Data...</div>
        </div>
        <div v-else>
          <v-icon class="mb-2 text-grey-darken-1" size="32">mdi-sword-cross</v-icon>
          <div class="text-subtitle-2 text-grey-darken-1">Select a Class</div>
          <div class="text-caption text-grey mt-1">Choose your character's class to view details</div>
        </div>
      </v-fade-transition>
    </v-card-text>
  </v-card>
  <v-card v-else-if="selectedClassInfo" class="text-blue-grey-lighten-5 class-preview-card" variant="tonal">
    <v-card-title class="d-flex align-center py-2">
      <v-icon class="text-blue-grey-darken-2 me-2" size="small">mdi-sword-cross</v-icon>
      <span class="text-subtitle-2">{{ selectedClassInfo.name }}</span>
    </v-card-title>
    <v-divider />
    <v-card-text class="pt-3 pb-2" style="max-height: 400px; overflow-y: auto;">
      <!-- Class Description -->
      <div v-if="selectedClassInfo.description" class="mb-3">
        <div class="text-body-2 text-grey-darken-2">{{ selectedClassInfo.description }}</div>
      </div>

      <!-- Core Attributes Grid -->
      <v-container class="pa-0 mb-3">
        <v-row class="class-attributes-grid" dense>
          <v-col cols="6" sm="3">
            <v-hover v-slot="{ isHovering, props: hoverProps }">
              <v-card class="pa-2 attribute-card" :color="isHovering ? 'blue-grey-lighten-4' : 'blue-grey-lighten-5'"
                flat v-bind="hoverProps">
                <v-tooltip text="Determines your Hit Points and healing during short rests">
                  <template #activator="{ props }">
                          <div class="text-center" v-bind="props">
                            <div class="text-overline text-blue-grey-darken-1">Hit Die</div>
                            <div class="text-h6 font-weight-bold text-error">d{{ selectedClassInfo.hitDie }}</div>
                          </div>
                        </template>
                </v-tooltip>
              </v-card>
            </v-hover>
          </v-col>
          <v-col cols="6" sm="3">
            <v-hover v-slot="{ isHovering, props: hoverProps }">
              <v-card class="pa-2 attribute-card" :color="isHovering ? 'blue-grey-lighten-4' : 'blue-grey-lighten-5'"
                flat v-bind="hoverProps">
                <v-tooltip text="Your starting Hit Points at 1st level">
                  <template #activator="{ props }">
                          <div class="text-center" v-bind="props">
                            <div class="text-overline text-blue-grey-darken-1">HP at 1st</div>
                            <div class="text-h6 font-weight-bold text-error">{{ selectedClassInfo.hitDie }} + CON</div>
                          </div>
                        </template>
                </v-tooltip>
              </v-card>
            </v-hover>
          </v-col>
          <v-col cols="6" sm="3">
            <v-hover v-slot="{ isHovering, props: hoverProps }">
              <v-card class="pa-2 attribute-card" :color="isHovering ? 'blue-grey-lighten-4' : 'blue-grey-lighten-5'"
                flat v-bind="hoverProps">
                <v-tooltip text="The most important ability score for your class abilities">
                  <template #activator="{ props }">
                          <div class="text-center" v-bind="props">
                            <div class="text-overline text-blue-grey-darken-1">Primary</div>
                            <div class="text-h6 font-weight-bold text-primary">{{ selectedClassInfo.primaryAbility }}</div>
                          </div>
                        </template>
                </v-tooltip>
              </v-card>
            </v-hover>
          </v-col>
          <v-col cols="6" sm="3">
            <v-hover v-slot="{ isHovering, props: hoverProps }">
              <v-card class="pa-2 attribute-card" :color="isHovering ? 'blue-grey-lighten-4' : 'blue-grey-lighten-5'"
                flat v-bind="hoverProps">
                <v-tooltip text="Ability saves your class is proficient in">
                  <template #activator="{ props }">
                          <div class="text-center" v-bind="props">
                            <div class="text-overline text-blue-grey-darken-1">Saves</div>
                            <div class="text-subtitle-2 font-weight-bold text-primary">
                              {{ selectedClassInfo.savingThrows?.join(', ') }}
                            </div>
                          </div>
                        </template>
                </v-tooltip>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-container>

      <!-- Proficiencies Section -->
      <div class="proficiencies-section mb-3">
        <h5 class="text-subtitle-2 text-blue-grey-darken-2 mb-2 d-flex align-center">
          <v-icon class="me-2" color="success" size="small">mdi-shield-star</v-icon>
          Proficiencies
        </h5>

        <!-- Armor -->
        <div v-if="selectedClassInfo.armorTraining" class="ms-4 mb-2">
          <div class="text-caption text-grey-darken-2 mb-1">Armor:</div>
          <v-chip-group class="proficiency-chips">
            <v-chip v-if="selectedClassInfo.armorTraining.light" color="success" density="comfortable" size="x-small"
              variant="flat">Light</v-chip>
            <v-chip v-if="selectedClassInfo.armorTraining.medium" color="success" density="comfortable" size="x-small"
              variant="flat">Medium</v-chip>
            <v-chip v-if="selectedClassInfo.armorTraining.heavy" color="success" density="comfortable" size="x-small"
              variant="flat">Heavy</v-chip>
            <v-chip v-if="selectedClassInfo.armorTraining.shields" color="success" density="comfortable" size="x-small"
              variant="flat">Shields</v-chip>
          </v-chip-group>
        </div>

        <!-- Weapons -->
        <div v-if="selectedClassInfo.weaponProficiencies" class="ms-4 mb-2">
          <div class="text-caption text-grey-darken-2 mb-1">Weapons:</div>
          <v-chip-group class="proficiency-chips">
            <v-chip v-for="prof in selectedClassInfo.weaponProficiencies" :key="prof" color="error"
              density="comfortable" size="x-small" variant="flat">
              {{ prof }}
            </v-chip>
          </v-chip-group>
        </div>

        <!-- Tools -->
        <div v-if="selectedClassInfo.toolProficiencies" class="ms-4 mb-2">
          <div class="text-caption text-grey-darken-2 mb-1">Tools:</div>
          <v-chip-group class="proficiency-chips">
            <v-chip v-for="tool in selectedClassInfo.toolProficiencies" :key="tool" color="warning"
              density="comfortable" size="x-small" variant="flat">
              {{ tool }}
            </v-chip>
          </v-chip-group>
        </div>

        <!-- Skills -->
        <div v-if="selectedClassInfo.skillProficiencies" class="ms-4">
          <div class="text-caption text-grey-darken-2 mb-1">
            Skills (Choose {{ selectedClassInfo.skillProficiencies.count }}):
          </div>
          <v-chip-group class="proficiency-chips">
            <v-chip v-for="skill in selectedClassInfo.skillProficiencies.from" :key="skill" color="blue-grey"
              density="comfortable" size="x-small" variant="flat">
              {{ skill }}
            </v-chip>
          </v-chip-group>
        </div>
      </div>

      <!-- Class Features -->
      <div v-if="selectedClassInfo.features?.length" class="class-features-section mb-3">
        <h5 class="text-subtitle-2 text-blue-grey-darken-2 mb-2 d-flex align-center">
          <v-icon class="me-2" color="info" size="small">mdi-star-circle</v-icon>
          Class Features
        </h5>
        <v-expansion-panels variant="accordion">
          <v-expansion-panel v-for="feature in selectedClassInfo.features" :key="feature.name" class="feature-panel"
            density="compact">
            <v-expansion-panel-title class="text-subtitle-2">
              {{ feature.name }}
            </v-expansion-panel-title>
            <v-expansion-panel-text class="text-body-2">
              {{ feature.description }}
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>

      <!-- Spellcasting -->
      <div v-if="selectedClassInfo.spellcasting?.isSpellcaster" class="spellcasting-section">
        <h5 class="text-subtitle-2 text-blue-grey-darken-2 mb-2 d-flex align-center">
          <v-icon class="me-2" color="purple" size="small">mdi-magic-staff</v-icon>
          Spellcasting
        </h5>
        <v-card class="pa-3" color="purple-lighten-5" flat>
          <div class="d-flex align-center mb-2">
            <div class="text-caption text-grey-darken-2">Spellcasting Ability:</div>
            <v-chip class="ms-2" color="purple" size="x-small" variant="flat">
              {{ selectedClassInfo.spellcasting.spellcastingAbility }}
            </v-chip>
          </div>
          <v-row dense>
            <v-col v-if="selectedClassInfo.spellcasting.cantripsKnown" cols="6">
              <div class="text-caption">
                Cantrips Known: <span class="text-purple-darken-2 font-weight-bold">
                  {{ selectedClassInfo.spellcasting.cantripsKnown }}
                </span>
              </div>
            </v-col>
            <v-col v-if="selectedClassInfo.spellcasting.spellsKnown" cols="6">
              <div class="text-caption">
                1st Level Spells: <span class="text-purple-darken-2 font-weight-bold">
                  {{ selectedClassInfo.spellcasting.spellsKnown }}
                </span>
              </div>
            </v-col>
          </v-row>
        </v-card>
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

const selectedClassInfo = computed(() => {
  if (!props.character.class || !props.characterData?.classData) {
    return null
  }
  return props.characterData.classData.find(
    classInfo => classInfo.id === props.character.class,
  )
})
</script>

<style scoped>
.class-preview-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.class-preview-card :deep(.v-card-text) {
  padding: 12px 16px;
}

.class-attributes-grid :deep(.v-card) {
  border-radius: 8px;
  transition: all 0.2s ease;
}

.attribute-card {
  transition: all 0.2s ease;
  cursor: help;
}

.attribute-card:hover {
  transform: translateY(-2px);
}

.proficiencies-section {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  padding: 16px;
  margin: 0 -8px 1rem;
}

.proficiencies-section :deep(.v-chip-group) {
  margin: -4px;
}

.proficiencies-section :deep(.v-chip) {
  margin: 4px;
  transition: all 0.2s ease;
}

.proficiencies-section :deep(.v-chip:hover) {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.feature-panel {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  margin-bottom: 4px;
  transition: all 0.2s ease;
}

.feature-panel:hover {
  border-color: var(--v-primary-base);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.feature-panel :deep(.v-expansion-panel-title) {
  min-height: 40px;
  padding: 8px 16px;
}

.feature-panel :deep(.v-expansion-panel-text__wrapper) {
  padding: 12px 16px;
}

.spellcasting-section :deep(.v-card) {
  border: 1px solid rgba(147, 51, 234, 0.12);
  transition: all 0.2s ease;
}

.spellcasting-section :deep(.v-card:hover) {
  background: rgba(147, 51, 234, 0.05);
}

/* Loading state transitions */
.v-select :deep(.v-field__append-inner) {
  transition: transform 0.2s ease;
}

.v-select.v-field--loading :deep(.v-field__append-inner) {
  transform: rotate(360deg);
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
</style>
