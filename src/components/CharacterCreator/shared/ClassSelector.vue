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
            <v-select v-model="character.class" density="compact" :error="!!characterData?.classError" item-title="name"
              :error-messages="characterData?.classError" item-value="id" :items="characterData?.classOptions || []"
              label="Choose Your Class" :loading="characterData?.isLoadingClasses" variant="outlined"
              @update:model-value="onClassChange">
              <template #prepend>
                <v-icon color="primary" size="small">mdi-shield-sword</v-icon>
              </template>
            </v-select>
            <!-- Subclass Selection -->
            <v-select v-if="character.class && availableSubclasses.length > 0" v-model="character.subclass" class="mt-3"
              density="compact" item-title="name" item-value="index" :items="availableSubclasses" :label="`Choose Your ${selectedClassInfo?.subclassType || 'Subclass'
                }`" variant="outlined" @update:model-value="onSubclassChange">
              <template #prepend>
                <v-icon color="secondary" size="small">mdi-star-circle</v-icon>
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
                <div class="text-subtitle-2 text-primary">
                  Loading Class Data...
                </div>
              </div>
              <div v-else>
                <v-icon class="mb-2 text-grey-darken-1" size="32">mdi-sword-cross</v-icon>
                <div class="text-subtitle-2 text-grey-darken-1">
                  Select a Class
                </div>
                <div class="text-caption text-grey mt-1">
                  Choose your character's class to view details
                </div>
              </div>
            </v-fade-transition>
          </v-card-text>
        </v-card>

        <v-card v-else-if="selectedClassInfo" class="class-preview-card class-detail-modern class-detail-bordered"
          variant="outlined">
          <v-card-title class="d-flex align-center py-2 class-detail-header">
            <v-icon class="me-2" color="primary" size="small">mdi-sword-cross</v-icon>
            <span class="text-h6 font-weight-bold">{{ selectedClassInfo.name }}</span>
            <v-chip v-if="character.subclass && selectedSubclassInfo" color="secondary" size="small" variant="elevated"
              class="ms-2">
              {{ selectedSubclassInfo.name }}
            </v-chip>
          </v-card-title>
          <v-card-text class="pt-3 pb-3 px-2">
            <div v-if="selectedClassInfo.description" class="mb-2 text-grey-darken-2 text-body-2">{{
              selectedClassInfo.description }}</div>
            <div v-if="selectedClassInfo.notes" class="mb-2 text-caption text-grey-darken-2">{{ selectedClassInfo.notes
            }}
            </div>
            <div v-if="selectedClassInfo.overview" class="mb-2 text-caption text-grey-darken-1">{{
              selectedClassInfo.overview
            }}</div>

            <v-divider class="my-2" />
            <v-row class="mb-2">
              <v-col cols="12" sm="6">
                <div class="core-stats-label mb-2 styled-section"><v-icon size="small"
                    class="me-1">mdi-information-variant</v-icon>Core Stats</div>
                <div class="core-stats-row align-center mb-2">
                  <v-icon size="small" class="me-1">mdi-dice-d20</v-icon>
                  <span class="core-stats-key">Hit Die:</span>
                  <span class="core-stats-value ms-1">d{{ selectedClassInfo.hitDie || '-' }}</span>
                </div>
                <div v-if="selectedClassInfo.primaryAbility" class="core-stats-row align-center mb-2">
                  <v-icon size="small" class="me-1">mdi-star</v-icon>
                  <span class="core-stats-key">Primary:</span>
                  <span class="core-stats-value ms-1">
                    <v-chip
                      v-for="(ability, idx) in (Array.isArray(selectedClassInfo.primaryAbility) ? selectedClassInfo.primaryAbility : [selectedClassInfo.primaryAbility])"
                      :key="ability + idx" color="primary" size="x-small" variant="flat" class="me-1 mb-1">{{ ability
                      }}</v-chip>
                  </span>
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="core-stats-label mb-2 styled-section"><v-icon size="small"
                    class="me-1">mdi-shield-account</v-icon>Proficiencies</div>
                <div v-if="selectedClassInfo.savingThrows && selectedClassInfo.savingThrows.length"
                  class="core-stats-row align-center mb-2">
                  <v-icon size="small" class="me-1">mdi-shield</v-icon>
                  <span class="core-stats-key">Saves:</span>
                  <span class="core-stats-value ms-1">
                    <v-chip v-for="(save, idx) in selectedClassInfo.savingThrows" :key="save + idx" color="primary"
                      size="x-small" variant="flat" class="me-1 mb-1">{{ save }}</v-chip>
                  </span>
                </div>
                <div
                  v-if="selectedClassInfo.armorTraining && (selectedClassInfo.armorTraining.light || selectedClassInfo.armorTraining.medium || selectedClassInfo.armorTraining.heavy || selectedClassInfo.armorTraining.shields)"
                  class="core-stats-row align-center mb-2">
                  <v-icon size="small" class="me-1">mdi-shield-half-full</v-icon>
                  <span class="core-stats-key">Armor:</span>
                  <span class="core-stats-value ms-1">
                    <v-chip v-if="selectedClassInfo.armorTraining.light" color="primary" size="x-small" variant="flat"
                      class="me-1 mb-1">Light</v-chip>
                    <v-chip v-if="selectedClassInfo.armorTraining.medium" color="primary" size="x-small" variant="flat"
                      class="me-1 mb-1">Medium</v-chip>
                    <v-chip v-if="selectedClassInfo.armorTraining.heavy" color="primary" size="x-small" variant="flat"
                      class="me-1 mb-1">Heavy</v-chip>
                    <v-chip v-if="selectedClassInfo.armorTraining.shields" color="primary" size="x-small" variant="flat"
                      class="me-1 mb-1">Shields</v-chip>
                  </span>
                </div>
                <div v-if="selectedClassInfo.weaponProficiencies && selectedClassInfo.weaponProficiencies.length"
                  class="core-stats-row align-center mb-2">
                  <v-icon size="small" class="me-1">mdi-sword</v-icon>
                  <span class="core-stats-key">Weapons:</span>
                  <span class="core-stats-value ms-1">
                    <v-chip v-for="(wpn, idx) in selectedClassInfo.weaponProficiencies" :key="wpn + idx" color="primary"
                      size="x-small" variant="flat" class="me-1 mb-1">{{ wpn }}</v-chip>
                  </span>
                </div>
                <div v-if="selectedClassInfo.toolProficiencies && selectedClassInfo.toolProficiencies.length"
                  class="core-stats-row align-center mb-2">
                  <v-icon size="small" class="me-1">mdi-hammer-wrench</v-icon>
                  <span class="core-stats-key">Tools:</span>
                  <span class="core-stats-value ms-1">
                    <v-chip v-for="(tool, idx) in selectedClassInfo.toolProficiencies" :key="tool + idx" color="primary"
                      size="x-small" variant="flat" class="me-1 mb-1">{{ tool }}</v-chip>
                  </span>
                </div>
                <div
                  v-if="selectedClassInfo.skillProficiencies && selectedClassInfo.skillProficiencies.from && selectedClassInfo.skillProficiencies.from.length"
                  class="core-stats-row align-center mb-2">
                  <v-icon size="small" class="me-1">mdi-account-group</v-icon>
                  <span class="core-stats-key">Skills:</span>
                  <span class="core-stats-value ms-1">
                    <span class="me-1">Choose {{ selectedClassInfo.skillProficiencies.count }}:</span>
                    <v-chip v-for="(skill, idx) in selectedClassInfo.skillProficiencies.from" :key="skill + idx"
                      color="primary" size="x-small" variant="flat" class="me-1 mb-1">{{ skill }}</v-chip>
                  </span>
                </div>
              </v-col>
            </v-row>
            <v-divider class="my-3" />

            <div v-if="selectedClassInfo.startingEquipment?.length" class="mb-3">
              <div class="core-stats-label mb-2 styled-section"><v-icon size="small"
                  class="me-1">mdi-backpack</v-icon>Starting Equipment</div>
              <div class="core-stats-row flex-wrap">
                <v-chip v-for="(item, idx) in selectedClassInfo.startingEquipment" :key="item.name || item || idx"
                  color="brown" size="x-small" variant="flat" class="me-1 mb-1">
                  {{ typeof item === 'object' && item.name ? item.name + (item.quantity && item.quantity > 1 ? ' x' +
                    item.quantity : '') : item }}
                </v-chip>
              </div>
            </div>

            <div v-if="selectedClassInfo.spellcasting?.isSpellcaster" class="mb-2">
              <div class="core-stats-label mb-2 styled-section"><v-icon size="small"
                  class="me-1">mdi-auto-fix</v-icon>Spellcasting</div>
              <div class="core-stats-row mb-2 align-center">
                <v-icon size="small" class="me-1">mdi-star-four-points</v-icon>
                <span class="core-stats-key">Ability:</span>
                <span class="core-stats-value ms-1">
                  <v-chip color="primary" size="x-small" variant="flat">{{
                    selectedClassInfo.spellcasting.spellcastingAbility
                  }}</v-chip>
                </span>
              </div>
              <div v-if="selectedClassInfo.spellcasting.cantripsKnown" class="core-stats-row mb-2 align-center">
                <v-icon size="small" class="me-1">mdi-flash</v-icon>
                <span class="core-stats-key">Cantrips Known:</span>
                <span class="core-stats-value ms-1">
                  <v-chip color="primary" size="x-small" variant="flat">{{ selectedClassInfo.spellcasting.cantripsKnown
                  }}</v-chip>
                </span>
              </div>
              <div v-if="selectedClassInfo.spellcasting.spellsKnown" class="core-stats-row mb-2 align-center">
                <v-icon size="small" class="me-1">mdi-book-open-variant</v-icon>
                <span class="core-stats-key">1st Level Spells:</span>
                <span class="core-stats-value ms-1">
                  <v-chip color="primary" size="x-small" variant="flat">{{ selectedClassInfo.spellcasting.spellsKnown
                  }}</v-chip>
                </span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>

import { ref, computed, watch } from 'vue'
const props = defineProps({
  character: { type: Object, required: true },
  characterData: { type: Object, required: true }
});

// Reactive data for subclasses
const availableSubclasses = ref([])
const selectedSubclassInfo = ref(null)

const selectedClassInfo = computed(() => {
  if (!props.character.class || !props.characterData?.classData) {
    return null
  }
  return props.characterData.classData.find(
    classInfo => classInfo.id === props.character.class,
  )
})

// Mock subclasses data for now - we'll enhance the API later
const mockSubclasses = {
  'ranger': [
    { index: 'hunter', name: 'Hunter' },
    { index: 'beast-master', name: 'Beast Master' },
    { index: 'gloom-stalker', name: 'Gloom Stalker' }
  ],
  'fighter': [
    { index: 'champion', name: 'Champion' },
    { index: 'battle-master', name: 'Battle Master' },
    { index: 'eldritch-knight', name: 'Eldritch Knight' }
  ],
  'wizard': [
    { index: 'abjuration', name: 'School of Abjuration' },
    { index: 'divination', name: 'School of Divination' },
    { index: 'evocation', name: 'School of Evocation' }
  ]
}

// Watch for class changes to load subclasses
watch(() => props.character.class, async (newClassId) => {
  if (newClassId) {
    // For now, use mock data. Later we'll implement API calls
    availableSubclasses.value = mockSubclasses[newClassId] || []
  } else {
    availableSubclasses.value = []
  }

  // Clear subclass selection when class changes
  props.character.subclass = null
  selectedSubclassInfo.value = null
}, { immediate: true })

// Watch for subclass changes
watch(() => props.character.subclass, async (newSubclassId) => {
  if (newSubclassId) {
    // Mock subclass details for now
    selectedSubclassInfo.value = {
      name: availableSubclasses.value.find(s => s.index === newSubclassId)?.name || newSubclassId,
      features: [
        {
          name: 'Subclass Feature',
          description: 'This is a placeholder for subclass features that will be loaded from the API.'
        }
      ]
    }
    props.character.subclassDetails = selectedSubclassInfo.value
  } else {
    selectedSubclassInfo.value = null
    props.character.subclassDetails = null
  }
})

const onClassChange = () => {
  if (props.characterData?.updateClassTraits) {
    props.characterData.updateClassTraits()
  }
}

const onSubclassChange = () => {
  console.log('Subclass changed to:', props.character.subclass)
}
</script>

<style scoped>

.class-detail-header {
  font-weight: 600;
  color: var(--v-primary-darken2, #2a3a5a);
  letter-spacing: 0.05em;
}

.class-preview-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(60, 60, 100, 0.08);
  background: var(--v-theme-surface-variant, #f5f5fa);
}

.class-preview-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(60, 60, 100, 0.08);
  background: var(--v-theme-surface-variant, #f5f5fa);
}

.styled-section {
  font-weight: 600;
  color: var(--v-primary-darken2, #2a3a5a);
  letter-spacing: 0.05em;
}

.class-preview-card :deep(.v-card-text) {
  padding: 18px 22px 18px 0;
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
