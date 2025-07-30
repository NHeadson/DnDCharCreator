<template>
  <v-card variant="outlined" class="mb-6">
    <v-card-title class="d-flex align-center py-2">
      <v-icon class="me-2" color="green">mdi-leaf</v-icon>
      Species Traits
    </v-card-title>
    <v-divider />
    <v-card-text v-if="character.speciesDetails" class="pt-3">
      <!-- Species Info Header -->
      <div class="d-flex align-center justify-space-between mb-3">
        <div class="d-flex align-center">
          <h5 class="text-h6 me-2">{{ character.speciesDetails.name }}</h5>
          <v-chip v-if="character.speciesLineage" color="primary" size="small" variant="elevated">
          </v-chip>
        </div>
        <v-chip-group v-if="character.speciesDetails.abilityBonus?.length" class="ma-0">
          <v-chip v-for="bonus in character.speciesDetails.abilityBonus" :key="bonus.ability" color="blue" </v-chip>
        </v-chip-group>
      </div>

      <!-- Quick Stats Row -->
      <v-row dense class="mb-3">
        <v-col cols="auto">
          <v-chip color="green" size="small" variant="flat">
          </v-chip>
        </v-col>
        <v-col cols="auto">
          <v-chip color="green" size="small" variant="flat">
          </v-chip>
        </v-col>
        <v-col v-if="character.speciesDetails.darkvision" cols="auto">
          <v-chip color="purple" size="small" variant="flat">
          </v-chip>
        </v-col>
        <v-col v-if="character.speciesDetails.damageResistance?.length" cols="auto">
        </v-col>
      </v-row>

      <!-- Special Traits -->
      <div v-if="character.speciesDetails.traits?.length" class="mb-3">
        <div class="d-flex align-center mb-2">
        </div>
        <div class="traits-compact">
        </div>
      </div>

      <!-- Lineage Comparison -->
      <div v-if="character.speciesDetails.lineages?.length > 1" class="mb-3">
        <div class="d-flex align-center mb-2">
        </div>
        <v-row dense>
        </v-row>
      </div>

      <!-- Languages & Other Info -->
      <v-row v-if="character.speciesDetails.languages?.length || character.speciesDetails.damageResistance?.length"
        dense>
        <v-col v-if="character.speciesDetails.languages?.length" cols="12" sm="6">
        </v-col>
        <v-col v-if="character.speciesDetails.damageResistance?.length" cols="12" sm="6">
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text v-else class="d-flex align-center justify-center text-center py-6">
      <div>
        <v-icon class="mb-2 text-grey-darken-1" size="48">mdi-leaf</v-icon>
        <div class="text-subtitle-2 text-grey-darken-1">No Species Selected</div>
        <div class="text-caption text-grey mt-1">Choose your character's species to view traits</div>
      </div>
    </v-card-text>
  </v-card>
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
  }
})

// Computed property for lineage-specific traits
const lineageTraits = computed(() => {
  if (!props.character.speciesLineage || !props.character.speciesDetails?.lineages) {
    return []
  }

  const lineage = props.character.speciesDetails.lineages.find(
    l => l.name.toLowerCase() === props.character.speciesLineage.toLowerCase()
  )

  return lineage?.traits || []
})

// Get key differentiators for each lineage/subrace
const getLineageHighlights = (lineage) => {
  const highlights = {
    // Elf lineages
    'High Elf': '+1 INT, Cantrip, Extra Language',
    'Wood Elf': '+1 WIS, Elf Weapon Training, Stealth',
    'Dark Elf (Drow)': '+1 CHA, Superior Darkvision, Drow Magic',
    'Drow': '+1 CHA, Superior Darkvision, Drow Magic',

    // Dwarf lineages
    'Hill Dwarf': '+1 WIS, +1 HP per level, Wisdom bonus',
    'Mountain Dwarf': '+2 STR, Armor Proficiency, More robust',

    // Halfling lineages
    'Lightfoot': '+1 CHA, Naturally Stealthy, Social',
    'Lightfoot Halfling': '+1 CHA, Naturally Stealthy, Social',
    'Stout': '+1 CON, Poison Resistance, Hardy',
    'Stout Halfling': '+1 CON, Poison Resistance, Hardy',

    // Gnome lineages
    'Forest Gnome': '+1 DEX, Speak with Animals, Nature magic',
    'Rock Gnome': '+1 CON, Tinker abilities, Tool expertise',

    // Human variants
    'Variant Human': 'Extra Feat, Extra Skill, Flexible stats',

    // Default fallback
    'default': 'Unique traits and abilities'
  }

  return highlights[lineage.name] || highlights['default']
}
</script>

<style scoped>
.traits-compact {
  line-height: 1.2;
}


.lineage-card {
  transition: all 0.2s ease;
  max-width: 340px;
  margin-left: auto;
  margin-right: auto;
  padding: 10px 14px !important;
  box-sizing: border-box;
}



.lineage-selected {
  background: #181b20 !important;
  border: 1.5px solid #3b82f6 !important;
  color: #f3f4f6 !important;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
}

.lineage-unselected {
  background: #181b20 !important;
  border: 1px solid #23272e !important;
  color: #e5e7eb !important;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.10);
}

.lineage-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(var(--v-theme-shadow-key-umbra-opacity), 0.15);
}

.traits-list {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  padding: 16px;
  margin: 0 -8px;
}

.trait-item {
  padding: 12px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 6px;
  border-left: 3px solid var(--v-green-base);
  transition: all 0.2s ease;
}

.trait-item:hover {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

:deep(.v-card) {
  border-radius: 4px;
  transition: all 0.2s ease;
}

:deep(.v-card:hover) {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.v-chip-group) {
  gap: 2px;
}

:deep(.v-chip--size-x-small) {
  font-size: 0.75rem;
}
</style>
