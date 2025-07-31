<template>
  <v-card flat>
    <v-card-title class="text-h4 text-center mb-4">🎯 Features & Choices</v-card-title>
    <v-card-subtitle class="text-center mb-4">
      Make important decisions about your character's abilities and proficiencies
    </v-card-subtitle>
    <v-card-text>
      <!-- Core Stats Cards -->
      <v-row class="mb-6">
        <v-col cols="12" md="4">
          <v-card color="primary" variant="outlined">
            <v-card-title class="text-center">⚔️ Combat Stats</v-card-title>
            <v-card-text>
              <v-list density="compact">
                <v-list-item>
                  <v-list-item-title>Proficiency Bonus</v-list-item-title>
                  <template #append>
                    <v-chip color="primary" size="small">+{{ character.proficiencyBonus }}</v-chip>
                  </template>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Initiative</v-list-item-title>
                  <template #append>
                    <v-chip :color="character.initiative >= 0 ? 'green' : 'red'" size="small">
                      {{ character.initiative >= 0 ? '+' : '' }}{{ character.initiative }}
                    </v-chip>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Skill Selection -->
      <v-card class="mb-6" variant="outlined">
        <v-card-title class="text-h6">📋 Skill Proficiencies</v-card-title>
        <v-card-text>
          <v-row>
            <v-col v-for="skill in getProficientSkills" :key="skill.name" cols="12" md="4" sm="6">
              <v-card class="skill-card" color="blue-lighten-5" variant="tonal">
                <v-card-text class="py-2">
                  <div class="d-flex align-center">
                    {{ skill.name }}
                    <v-spacer />
                    <v-chip color="primary" size="x-small">
                      {{ skill.ability }}
                    </v-chip>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Spell Selection for Spellcasters (Tabbed UI) -->
      <v-card v-if="isSpellcaster" class="mb-6" variant="outlined">
        <v-card-title class="text-h6">🪄 Spell Selection</v-card-title>
        <v-card-text>
          <div v-if="characterStore.isLoadingSpells">
            <v-progress-circular indeterminate color="primary" /> Loading spells...
          </div>
          <div v-else>
            <v-tabs v-model="spellTab" grow class="mb-2">
              <v-tab v-if="cantripsKnown > 0">Cantrips</v-tab>
              <v-tab v-if="spellsKnown > 0">1st-level Spells</v-tab>
            </v-tabs>
            <v-window v-model="spellTab">
              <!-- Cantrips Tab -->
              <v-window-item v-if="cantripsKnown > 0" :value="0">
                <v-autocomplete v-model="selectedCantrips" :items="characterStore.availableCantrips" item-title="name"
                  item-value="index" :label="`Choose up to ${cantripsKnown} cantrips`" multiple chips
                  :counter="cantripsKnown" :rules="[v => v.length <= cantripsKnown || `Select up to ${cantripsKnown}`]"
                  class="mb-2" @update:modelValue="onCantripSelect" />
                <v-list v-if="selectedCantrips.length">
                  <v-list-item v-for="spell in selectedCantripsDetails" :key="spell.index"
                    @click="selectedCantripDetail = spell.index" :active="selectedCantripDetail === spell.index">
                    <v-list-item-title>{{ spell.name }}</v-list-item-title>
                  </v-list-item>
                </v-list>
                <v-expand-transition>
                  <div v-if="selectedCantripDetailObj">
                    <v-card class="mt-2" color="grey-lighten-4" variant="tonal">
                      <v-card-title>{{ selectedCantripDetailObj.name }}</v-card-title>
                      <v-card-text style="white-space: pre-line">{{ selectedCantripDetailObj.desc?.join('\n')
                        }}</v-card-text>
                    </v-card>
                  </div>
                </v-expand-transition>
              </v-window-item>
              <!-- 1st-level Spells Tab -->
              <v-window-item v-if="spellsKnown > 0" :value="1">
                <v-autocomplete v-model="selectedSpells" :items="characterStore.availableSpells" item-title="name"
                  item-value="index" :label="`Choose up to ${spellsKnown} 1st-level spells`" multiple chips
                  :counter="spellsKnown" :rules="[v => v.length <= spellsKnown || `Select up to ${spellsKnown}`]"
                  class="mb-2" @update:modelValue="onSpellSelect" />
                <v-list v-if="selectedSpells.length">
                  <v-list-item v-for="spell in selectedSpellsDetails" :key="spell.index"
                    @click="selectedSpellDetail = spell.index" :active="selectedSpellDetail === spell.index">
                    <v-list-item-title>{{ spell.name }}</v-list-item-title>
                  </v-list-item>
                </v-list>
                <v-expand-transition>
                  <div v-if="selectedSpellDetailObj">
                    <v-card class="mt-2" color="grey-lighten-4" variant="tonal">
                      <v-card-title>{{ selectedSpellDetailObj.name }}</v-card-title>
                      <v-card-text style="white-space: pre-line">{{ selectedSpellDetailObj.desc?.join('\n')
                        }}</v-card-text>
                    </v-card>
                  </div>
                </v-expand-transition>
              </v-window-item>
            </v-window>
          </div>
        </v-card-text>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, watch, ref } from 'vue'
import { useCharacterStore } from '@/stores/characterStore'

defineProps({
  character: {
    type: Object,
    required: true,
  },
  characterData: {
    type: Object,
    required: true,
  },
})

const characterStore = useCharacterStore()

const selectedCantrips = ref([])
const selectedSpells = ref([])
const spellTab = ref(0)
const selectedCantripDetail = ref(null)
const selectedSpellDetail = ref(null)

// Get full details for selected cantrips and spells
const selectedCantripsDetails = computed(() => {
  return characterStore.availableCantrips.filter(spell => selectedCantrips.value.includes(spell.index))
})
const selectedSpellsDetails = computed(() => {
  return characterStore.availableSpells.filter(spell => selectedSpells.value.includes(spell.index))
})
const selectedCantripDetailObj = computed(() => {
  return characterStore.availableCantrips.find(spell => spell.index === selectedCantripDetail.value)
})
const selectedSpellDetailObj = computed(() => {
  return characterStore.availableSpells.find(spell => spell.index === selectedSpellDetail.value)
})

function onCantripSelect(val) {
  // If a new cantrip is selected, show its details
  if (val.length) {
    selectedCantripDetail.value = val[val.length - 1]
  } else {
    selectedCantripDetail.value = null
  }
}
function onSpellSelect(val) {
  if (val.length) {
    selectedSpellDetail.value = val[val.length - 1]
  } else {
    selectedSpellDetail.value = null
  }
}

// Watch for class change and fetch spells if spellcaster
watch(
  () => character.class,
  async (newClass) => {
    if (newClass && characterStore.classData.length) {
      const classInfo = characterStore.classData.find(c => c.index === newClass)
      if (classInfo && classInfo.spellcasting) {
        await characterStore.fetchSpellsForClass(newClass)
      }
    }
  },
  { immediate: true }
)

const isSpellcaster = computed(() => {
  if (!character.class || !characterStore.classData.length) return false
  const classInfo = characterStore.classData.find(c => c.index === character.class)
  return !!(classInfo && classInfo.spellcasting)
})

const cantripsKnown = computed(() => {
  if (!character.class || !characterStore.classData.length) return 0
  const classInfo = characterStore.classData.find(c => c.index === character.class)
  return classInfo?.spellcasting?.cantripsKnown || 0
})

const spellsKnown = computed(() => {
  if (!character.class || !characterStore.classData.length) return 0
  const classInfo = characterStore.classData.find(c => c.index === character.class)
  return classInfo?.spellcasting?.spellsKnown || 0
})

// Save selected spells to character object
watch(selectedCantrips, (val) => {
  character.cantrips = val
})
watch(selectedSpells, (val) => {
  character.preparedSpells = val
})

const getProficientSkills = computed(() => {
  // Implementation
  return []
})
</script>

<style scoped>
.skill-card {
  transition: all 0.3s ease;
}
</style>
