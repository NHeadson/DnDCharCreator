<template>
  <v-card class="mb-6" variant="outlined">
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
          <v-chip v-if="character.speciesLineage" color="primary" size="small" variant="elevated" />
        </div>
        <v-chip-group v-if="character.speciesDetails.abilityBonus?.length" class="ma-0">
          <v-chip v-for="bonus in character.speciesDetails.abilityBonus" :key="bonus.ability" v-chip <
            color="blue" /></v-chip-group>
      </div>

      <!-- Quick Stats Row -->
      <v-row class="mb-3" dense>
        <v-col cols="auto">
          <v-chip color="green" size="small" variant="flat" />
        </v-col>
        <v-col cols="auto">
          <v-chip color="green" size="small" variant="flat" />
        </v-col>
        <v-col v-if="character.speciesDetails.darkvision" cols="auto">
          <v-chip color="purple" size="small" variant="flat" />
        </v-col>
        <v-col v-if="character.speciesDetails.damageResistance?.length" cols="auto" />
      </v-row>

      <!-- Special Traits -->
      <div v-if="character.speciesDetails.traits?.length" class="mb-3">
        <div class="d-flex align-center mb-2" />
        <div class="traits-compact" />
      </div>

      <!-- Lineage Comparison -->
      <div v-if="character.speciesDetails.lineages?.length > 1" class="mb-3">
        <div class="d-flex align-center mb-2" />
        <v-row dense />
      </div>

      <!-- Languages & Other Info -->
      <v-row v-if="character.speciesDetails.languages?.length || character.speciesDetails.damageResistance?.length"
        dense>
        <v-col v-if="character.speciesDetails.languages?.length" cols="12" sm="6" />
        <v-col v-if="character.speciesDetails.damageResistance?.length" cols="12" sm="6" />
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
  },
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
const getLineageHighlights = lineage => {
  const highlights = {
    // Elf lineages
    'High Elf': 'Extra cantrip, weapon training, bonus language',
    'Wood Elf': 'Keen senses, mask of the wild, elf weapon training',
    'Dark Elf (Drow)': 'Superior darkvision, drow magic, sunlight sensitivity',
    'Drow': 'Superior darkvision, drow magic, sunlight sensitivity',

    // Dwarf lineages
    'Hill Dwarf': 'Dwarven toughness, extra hit points per level',
    'Mountain Dwarf': 'Armor proficiency, more robust and hardy',

    // Halfling lineages
    'Lightfoot': 'Naturally stealthy, social and charming',
    'Lightfoot Halfling': 'Naturally stealthy, social and charming',
    'Stout': 'Poison resistance, hardy constitution',
    'Stout Halfling': 'Poison resistance, hardy constitution',

    // Gnome lineages
    'Forest Gnome': 'Speak with animals, natural illusionist',
    'Rock Gnome': 'Tinker abilities, tool expertise',

    // Human variants
    'Variant Human': 'Extra feat, extra skill, flexible and adaptable',

    // Default fallback
    'default': 'Unique traits and abilities',
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
