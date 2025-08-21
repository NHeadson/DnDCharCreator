<template>
  <div class="mb-6">
    <v-row>
      <v-col cols="12" lg="5" md="6">
        <v-card variant="outlined">
          <v-card-title class="d-flex align-center py-2">
            <v-icon class="me-2" start>mdi-sword-cross</v-icon>
            <span class="text-subtitle-1 text-md-h6">Class Selection</span>
          </v-card-title>
          <v-card-text class="pt-2 pb-3">
            <v-select v-model="props.character.class" :density="$vuetify.display.smAndDown ? 'comfortable' : 'compact'"
              :error="!!props.characterData?.classError" item-title="name"
              :error-messages="props.characterData?.classError" item-value="index"
              :items="props.characterData?.classData || []" label="Choose Your Class"
              :loading="props.characterData?.isLoadingClasses" variant="outlined">
              <template #prepend>
                <v-icon color="primary" size="small">mdi-shield-sword</v-icon>
              </template>
            </v-select>
            <!-- Subclass Selection: Only show for classes that require it at level 1 -->
            <v-select v-if="props.character.class && availableSubclasses.length > 0 && shouldShowSubclassSelector"
              v-model="props.character.subclass" class="mt-3"
              :density="$vuetify.display.smAndDown ? 'comfortable' : 'compact'" item-title="name" item-value="index"
              :items="availableSubclasses" :label="`Choose Your ${selectedClassInfo?.subclassType || 'Subclass'}`"
              variant="outlined">
              <template #prepend>
                <v-icon color="secondary" size="small">mdi-star-circle</v-icon>
              </template>
            </v-select>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" lg="7" md="6">
        <v-card v-if="!props.character.class" class="text-blue-grey-lighten-5 class-preview-card" variant="tonal">
          <v-card-title class="d-flex align-center py-2">
            <v-icon class="text-blue-grey-darken-2 me-2" size="small">mdi-sword-cross</v-icon>
            <span class="text-subtitle-2 text-grey">Class Details</span>
          </v-card-title>
          <v-divider />
          <v-card-text class="d-flex align-center justify-center text-center py-4">
            <v-fade-transition>
              <div v-if="props.characterData?.isLoadingClasses">
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

        <v-card v-else-if="selectedClassInfo" class="class-preview-card" variant="tonal">
          <v-card-title class="d-flex align-center justify-space-between py-2">
            <div class="d-flex align-center">
              <v-icon class="me-2" color="primary" size="small">mdi-sword-cross</v-icon>
              <span class="text-subtitle-1 font-weight-bold">{{ selectedClassInfo.name }}</span>
            </div>

            <v-tooltip
              v-for="ability in (Array.isArray(selectedClassInfo.primaryAbility) ? selectedClassInfo.primaryAbility : [selectedClassInfo.primaryAbility])"
              :key="'ability-' + ability" text="Primary ability score that's most important for this class"
              location="top">
              <template v-slot:activator="{ props }">
                <v-chip v-bind="props" size="small" variant="tonal" color="accent">
                  {{ ability }}
                </v-chip>
              </template>
            </v-tooltip>
          </v-card-title>
          <v-divider />
          <v-card-text class="pt-3 pb-2">

            <!-- Quick Stats -->
            <div class="d-flex align-center mb-1">
              <span class="ms-5 text-subtitle-2 text-grey-darken-1">Quick Stats</span>
            </div>
            <div class="d-flex flex-wrap ms-5 class-details-chip-row class-details-chip-row-gap">
              <v-tooltip text="The type of hit dice used to determine hit points when leveling up" location="top">
                <template v-slot:activator="{ props }">
                  <v-chip v-bind="props" color="green" size="small" variant="tonal"
                    class="class-details-chip me-3 ms-5">
                    <v-icon start size="small">mdi-dice-d20</v-icon>
                    <span class="chip-label">Hit Die</span>
                    <span class="chip-value">: d{{ selectedClassInfo.hitDie ? selectedClassInfo.hitDie.replace('D', '')
                      : '-' }}</span>
                  </v-chip>
                </template>
              </v-tooltip>
              <v-tooltip v-if="selectedClassInfo.savingThrows && selectedClassInfo.savingThrows.length"
                text="Ability scores this class is proficient in for saving throws" location="top">
                <template v-slot:activator="{ props }">
                  <v-chip v-bind="props" color="blue" size="small" variant="tonal" class="class-details-chip me-3">
                    <v-icon start size="small">mdi-shield</v-icon>
                    <span class="chip-label">Saves</span>
                    <span class="chip-value">: {{ selectedClassInfo.savingThrows.join(', ') }}</span>
                  </v-chip>
                </template>
              </v-tooltip>
              <v-chip
                v-if="selectedClassInfo.armorTraining && (selectedClassInfo.armorTraining.light || selectedClassInfo.armorTraining.medium || selectedClassInfo.armorTraining.heavy || selectedClassInfo.armorTraining.shields)"
                color="blue" size="small" variant="tonal" class="class-details-chip me-3">
                <v-icon start size="small">mdi-shield-half-full</v-icon>
                <span class="chip-label">Armor</span>
                <span class="chip-value">
                  : {{ [
                    selectedClassInfo.armorTraining.light ? 'Light' : null,
                    selectedClassInfo.armorTraining.medium ? 'Medium' : null,
                    selectedClassInfo.armorTraining.heavy ? 'Heavy' : null,
                    selectedClassInfo.armorTraining.shields ? 'Shields' : null
                  ].filter(Boolean).join(', ') }}
                </span>
              </v-chip>
            </div>

            <!-- Proficiencies Section -->
            <div class="proficiencies-section mb-3">
              <div class="ms-3 mb-2 text-caption font-weight-bold text-grey-darken-1">Proficiencies</div>
              <div class="ms-5 mb-2">
                <span class="chip-label">Weapons:</span>
                <template v-if="selectedClassInfo.weaponProficiencies && selectedClassInfo.weaponProficiencies.length">
                  <div style="display: flex; gap: 6px; flex-wrap: wrap; margin: 4px 0;">
                    <v-chip v-for="wp in selectedClassInfo.weaponProficiencies" :key="'wp-' + wp" size="small"
                      variant="tonal" color="orange">
                      {{ wp }}
                    </v-chip>
                  </div>
                </template>
                <template v-else>
                  <span class="text-grey ms-2">None</span>
                </template>
              </div>
              <div class="ms-5 mb-2">
                <span class="chip-label">Tools:</span>
                <template v-if="selectedClassInfo.toolProficiencies && selectedClassInfo.toolProficiencies.length">
                  <div style="display: flex; gap: 6px; flex-wrap: wrap; margin: 4px 0;">
                    <v-chip v-for="tp in selectedClassInfo.toolProficiencies" :key="'tp-' + tp" size="small"
                      variant="tonal" color="pink">
                      {{ tp }}
                    </v-chip>
                  </div>
                </template>
                <template v-else>
                  <span class="text-grey ms-2">None</span>
                </template>
              </div>
              <div class="ms-5 mb-2">
                <span class="chip-label">Skills:</span>
                <template
                  v-if="selectedClassInfo && selectedClassInfo.skillProficiencies && selectedClassInfo.skillProficiencies.from && selectedClassInfo.skillProficiencies.from.length">
                  <span class="text-caption text-grey-darken-1"
                    style="font-size: 0.85em; font-weight: 400; margin-left: 12px;">(Choice of {{
                      selectedClassInfo.skillProficiencies.count }})</span>
                  <div style="display: flex; gap: 6px; flex-wrap: wrap; margin: 4px 0;">
                    <v-chip v-for="sk in selectedClassInfo.skillProficiencies.from" :key="'sk-' + sk" size="small"
                      variant="tonal" color="purple">
                      {{ sk }}
                    </v-chip>
                  </div>
                </template>
                <span v-else class="text-grey ms-2">None</span>
              </div>
            </div>

            <!-- Spellcasting (only show if spellcasting at level 1) -->
            <div
              v-if="selectedClassInfo && selectedClassInfo.spellcasting && (
                (selectedClassInfo.spellcasting.level === 1) ||
                (selectedClassInfo.spellcasting.spellSlots > 0) ||
                (selectedClassInfo.spellcasting.cantripsKnown > 0)
              ) && (selectedClassInfo.spellcasting.ability || (selectedClassInfo.spellcasting.info && selectedClassInfo.spellcasting.info.length))"
              class="ms-3 mb-3">
              <div class="d-flex align-center mb-1">
                <v-icon class="me-1" color="deep-purple" size="small">mdi-auto-fix</v-icon>
                <span class="text-caption font-weight-bold text-grey-darken-2">Spellcasting</span>
              </div>
              <div class="ms-3">
                <v-chip v-if="selectedClassInfo.spellcasting.ability" color="deep-purple" size="x-small" variant="flat"
                  class="me-2 mb-1">
                  <v-icon size="x-small" class="me-1">mdi-star-four-points</v-icon>
                  Ability: {{ selectedClassInfo.spellcasting.ability }}
                </v-chip>
                <v-chip v-if="selectedClassInfo.spellcasting.cantripsKnown" color="deep-purple" size="x-small"
                  variant="flat" class="me-2 mb-1">
                  <v-icon size="x-small" class="me-1">mdi-flash</v-icon>
                  Cantrips: {{ selectedClassInfo.spellcasting.cantripsKnown }}
                </v-chip>
                <v-chip v-if="selectedClassInfo.spellcasting.spellsKnown" color="deep-purple" size="x-small"
                  variant="flat" class="me-2 mb-1">
                  <v-icon size="x-small" class="me-1">mdi-book-open-variant</v-icon>
                  Spells: {{ selectedClassInfo.spellcasting.spellsKnown }}
                </v-chip>
                <v-chip v-if="selectedClassInfo.spellcasting.spellSlots" color="deep-purple" size="x-small"
                  variant="flat" class="me-2 mb-1">
                  <v-icon size="x-small" class="me-1">mdi-cube-outline</v-icon>
                  Spell Slots: {{ selectedClassInfo.spellcasting.spellSlots }}
                </v-chip>
                <div v-if="selectedClassInfo.spellcasting.info && selectedClassInfo.spellcasting.info.length"
                  class="mt-2">
                  <v-expansion-panels multiple elevation="0" class="spellcasting-info-panels">
                    <v-expansion-panel v-for="(info, idx) in selectedClassInfo.spellcasting.info"
                      :key="'spellinfo-' + idx">
                      <v-expansion-panel-title>{{ info.name }}</v-expansion-panel-title>
                      <v-expansion-panel-text>{{ info.desc }}</v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </div>
              </div>
            </div>

            <!-- Features: Only show if there are features to display -->
            <div v-if="selectedClassInfo && selectedClassInfo.features && selectedClassInfo.features.length"
              class="ms-3 mb-3">
              <div class="d-flex align-center mb-1">
                <v-icon class="me-1" color="amber" size="small">mdi-star-circle-outline</v-icon>
                <span class="text-caption font-weight-bold text-grey-darken-2">Level 1 Features</span>
              </div>
              <div class="ms-3">
                <v-expansion-panels multiple elevation="0" class="feature-panel">
                  <v-expansion-panel v-for="feature in selectedClassInfo.features" :key="'feature-' + feature.name">
                    <v-expansion-panel-title>{{ feature.name }}</v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <div v-if="Array.isArray(feature.desc)">
                        <ul class="feature-desc-list">
                          <li v-for="line in feature.desc" :key="'feature-line-' + line">{{ line }}</li>
                        </ul>
                      </div>
                      <div v-else>
                        <span v-html="formatFeatureDesc(feature.desc)"></span>
                      </div>
                      <!-- Emphasize feature choices if present -->
                      <div
                        v-if="feature.feature_specific && (feature.feature_specific.enemy_type_options || feature.feature_specific.terrain_type_options)">
                        <div class="mt-2 mb-1">
                          <span class="text-caption font-weight-bold text-amber-darken-2">Choices:</span>
                        </div>
                        <div v-if="feature.feature_specific.enemy_type_options">
                          <div class="feature-choice-chips">
                            <v-chip v-for="type in feature.feature_specific.enemy_type_options.from.options"
                              :key="'enemy-' + type" color="amber" size="small" class="ms-3 me-1 mb-1">{{ type
                              }}</v-chip>
                          </div>
                        </div>
                        <div v-if="feature.feature_specific.terrain_type_options">
                          <div class="feature-choice-chips">
                            <v-chip v-for="type in feature.feature_specific.terrain_type_options.from.options"
                              :key="'terrain-' + type" color="teal" size="small" class="ms-3 me-1 mb-1">{{ type
                              }}</v-chip>
                          </div>
                        </div>
                      </div>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </div>
            </div>

            <!-- Starting Equipment -->
            <div v-if="selectedClassInfo.startingEquipment && selectedClassInfo.startingEquipment.length"
              class="ms-3 mb-3">
              <div class="d-flex align-center mb-1">
                <v-icon class="me-1" color="blue-grey" size="small">mdi-backpack</v-icon>
                <span class="text-caption font-weight-bold text-grey-darken-2">Starting Equipment</span>
              </div>
              <div class="ms-10">
                <v-chip v-for="item in selectedClassInfo.startingEquipment" :key="'equip-' + (item.name || item)"
                  size="small" variant="tonal" color="error" class="ms-2 me-1 mb-1">
                  {{ typeof item === 'object' && item.name ? item.name + (item.quantity && item.quantity > 1 ? ' x' +
                    item.quantity : '') : item }}
                </v-chip>
              </div>
            </div>

            <!-- Starting Equipment Options -->
            <div v-if="selectedClassInfo.startingEquipmentOptions && selectedClassInfo.startingEquipmentOptions.length"
              class="ms-3 mb-3">
              <div class="d-flex align-center mb-1">
                <v-icon class="me-1" color="blue-grey" size="small">mdi-tune-variant</v-icon>
                <span class="text-caption font-weight-bold text-grey-darken-2">Equipment Choices</span>
              </div>
              <div class="ms-10">
                <div v-for="opt in selectedClassInfo.startingEquipmentOptions"
                  :key="'eqopt-' + (opt.desc || opt.choose || Math.random())" class="mb-2">
                  <template v-if="opt.from && Array.isArray(opt.from.options)">
                    <span v-for="(choice, choiceIdx) in opt.from.options"
                      :key="'choice-' + getEquipmentChoiceLabel(choice)">
                      <v-chip size="small" color="blue-grey" variant="tonal" class="me-1 mb-1">
                        {{ getEquipmentChoiceLabel(choice) }}
                      </v-chip>
                      <span v-if="choiceIdx < opt.from.options.length - 1" class="mx-1 text-grey-darken-1">or</span>
                    </span>
                  </template>
                  <template v-else-if="opt.options && Array.isArray(opt.options)">
                    <span v-for="(choice, choiceIdx) in opt.options" :key="'choice-' + getEquipmentChoiceLabel(choice)">
                      <v-chip size="small" color="blue-grey" variant="tonal" class="me-1 mb-1">
                        {{ getEquipmentChoiceLabel(choice) }}
                      </v-chip>
                      <span v-if="choiceIdx < opt.options.length - 1" class="mx-1 text-grey-darken-1">or</span>
                    </span>
                  </template>
                  <template v-else>
                    <v-chip size="small" color="blue-grey" variant="tonal" class="me-1 mb-1">
                      {{ capitalizeWords(opt.desc || ('Choose ' + opt.choose + ' from options')) }}
                    </v-chip>
                  </template>
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
// Classes that require subclass selection at level 1
const subclassAtLevel1 = ['warlock', 'cleric', 'sorcerer'];

const shouldShowSubclassSelector = computed(() => {
  if (!props.character.class) return false;
  const classIndex = props.character.class.toLowerCase();
  // Show if class requires subclass at level 1
  if (subclassAtLevel1.includes(classIndex)) return true;
  // Otherwise, only show if character.level >= 2 (Ranger, etc. at level 2 or 3)
  return props.character.level && props.character.level >= 2;
});
import { ref, computed, watch } from 'vue'
const props = defineProps({
  character: { type: Object, required: true },
  characterData: { type: Object, required: true }
});
import { dndAPI } from '@/services/dndAPI.js'

// Watch for class selection and fetch details
watch(() => props.character.class, async (newClass, oldClass) => {
  if (newClass && newClass !== oldClass) {
    props.character.classDetails = null;
    // Always use lowercase index for API
    const details = await dndAPI.getClassDetails(newClass.toLowerCase());
    if (details) {
      props.character.classDetails = { ...details, id: newClass };
    }
  }
})

const featureMessage = computed(() => {
  if (selectedClassInfo && selectedClassInfo.features === null) {
    return 'No features at level 1.';
  }
  return 'None found for this class.';
});
// Helper for robust equipment choice label
function getEquipmentChoiceLabel(choice) {
  if (typeof choice === 'string') return choice;
  // D&D 5e API: counted_reference
  if (choice && choice.option_type === 'counted_reference' && choice.of && choice.of.name) {
    return (choice.of.name || '') + (choice.count && choice.count > 1 ? ' x' + choice.count : '');
  }
  // D&D 5e API: multiple (array of items)
  if (choice && choice.option_type === 'multiple' && Array.isArray(choice.items)) {
    return choice.items.map(getEquipmentChoiceLabel).join(' + ');
  }
  // D&D 5e API: choice (nested choice)
  if (choice && choice.option_type === 'choice' && choice.choice) {
    // Prefer formatted: '2 Simple Melee Weapons'
    if (
      choice.choice.choose &&
      choice.choice.from &&
      choice.choice.from.equipment_category &&
      choice.choice.from.equipment_category.name
    ) {
      return `${choice.choice.choose} ${choice.choice.from.equipment_category.name}`;
    }
    if (choice.choice.desc) return choice.choice.desc;
    if (choice.choice.name) return choice.choice.name;
    // If options array exists, join recursively
    if (Array.isArray(choice.choice.options)) {
      return choice.choice.options.map(getEquipmentChoiceLabel).join(' or ');
    }
  }
  // D&D 5e API: reference
  if (choice && choice.option_type === 'reference' && choice.item && choice.item.name) {
    return choice.item.name;
  }
  // fallback to previous logic
  if (choice && choice.item && choice.item.name) {
    return choice.item.name + (choice.quantity && choice.quantity > 1 ? ' x' + choice.quantity : '');
  }
  if (choice && choice.name) {
    return choice.name + (choice.quantity && choice.quantity > 1 ? ' x' + choice.quantity : '');
  }
  if (choice && choice.desc) return choice.desc;
  if (choice && typeof choice.item === 'string') return choice.item;
  // fallback for debugging
  try {
    return JSON.stringify(choice);
  } catch {
    return 'Option';
  }
}

// Capitalize first letter of each word (for fallback equipment descriptions)
function capitalizeWords(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

// Reactive data for subclasses
const availableSubclasses = ref([])
const selectedSubclassInfo = ref(null)

const selectedClassInfo = computed(() => {
  // Use the detailed class info if available, otherwise fallback to classData
  if (!props.character.class) return null;
  // Prefer classDetails if available
  if (props.character.classDetails &&
    (props.character.classDetails.id === props.character.class || props.character.classDetails.index === props.character.class.toLowerCase())) {
    return props.character.classDetails;
  }
  // Fallback to classData (basic info)
  if (props.characterData?.classData) {
    // Try to match by id or index
    return props.characterData.classData.find(
      classInfo => classInfo.id === props.character.class || classInfo.index === props.character.class.toLowerCase()
    );
  }
  return null;
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

// Helper for formatting feature descriptions
function formatFeatureDesc(desc) {
  if (!desc) return '';
  // If desc contains newlines, split and bullet
  if (typeof desc === 'string' && desc.includes('\n')) {
    return '<ul class="feature-desc-list">' + desc.split(/\n+/).map(line => `<li>${line.trim()}</li>`).join('') + '</ul>';
  }
  // If desc contains multiple sentences, split and bullet
  const sentences = typeof desc === 'string' ? desc.match(/[^.!?]+[.!?]+/g) : null;
  if (sentences && sentences.length > 1) {
    return '<ul class="feature-desc-list">' + sentences.map(line => `<li>${line.trim()}</li>`).join('') + '</ul>';
  }
  // Otherwise, just return as paragraph
  return `<span>${desc}</span>`;
}
</script>

<style scoped>
.class-detail-header {
  font-weight: 600;
  color: var(--v-primary-darken2, #2a3a5a);
  letter-spacing: 0.05em;
}

.styled-section {
  font-weight: 600;
  color: var(--v-primary-darken2, #2a3a5a);
  letter-spacing: 0.05em;
}

.class-preview-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 12px rgba(60, 60, 100, 0.08);
  background: var(--v-theme-surface-variant, #f5f5fa);
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

.feature-desc-list {
  margin: 0 0 0.5em 1.2em;
  padding: 0;
  list-style: disc inside;
}

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

.class-detail-section-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(147, 51, 234, 0.08);
  background: var(--v-theme-surface, #232136);
  border: 1.5px solid rgba(147, 51, 234, 0.18);
  margin-bottom: 1.5rem;
}

.class-detail-section-card {
  border-radius: 4px;
}

.class-detail-section-card .v-card-text {
  padding: 1.5rem 1.5rem 1rem 1.5rem;
}

/* Mobile responsive adjustments */
@media (max-width: 960px) {
  .class-details-chip-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .class-details-chip {
    margin-bottom: 8px;
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 600px) {
  .class-detail-section-card .v-card-text {
    padding: 12px 16px 8px 16px;
  }

  .class-details-chip-row-gap {
    gap: 4px;
  }

  .class-details-chip {
    font-size: 0.75rem;
    height: auto;
    min-height: 28px;
    padding: 4px 8px;
  }

  .chip-label,
  .chip-value {
    font-size: 0.75rem;
  }

  .spellcasting-section,
  .feature-section {
    margin-bottom: 16px;
  }
}
</style>
