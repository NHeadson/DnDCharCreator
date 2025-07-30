<template>
  <v-card variant="outlined" class="mb-6">
    <v-card-title class="d-flex align-center py-2">
      <v-icon class="me-2" color="amber">mdi-treasure-chest</v-icon>
      Equipment, Languages & Coins
    </v-card-title>
    <v-divider />
    <v-card-text class="pt-3">
      <!-- Languages Section -->
      <div class="mb-4">
        <h5 class="text-subtitle-2 text-grey-darken-2 mb-2 d-flex align-center">
          <v-icon class="me-2" color="indigo" size="small">mdi-translate</v-icon>
          Languages
        </h5>
        <v-row>
          <v-col cols="12" md="6">
            <div class="text-caption text-grey-darken-2 mb-1">From Species:</div>
            <v-chip-group v-if="speciesLanguages.length">
              <v-chip v-for="lang in speciesLanguages" :key="lang" color="green" size="small" variant="flat">
                {{ lang }}
              </v-chip>
            </v-chip-group>
            <div v-else class="text-caption text-grey">None</div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="text-caption text-grey-darken-2 mb-1">From Background:</div>
            <v-chip-group v-if="backgroundLanguages.length">
              <v-chip v-for="lang in backgroundLanguages" :key="lang" color="blue" size="small" variant="flat">
                {{ lang }}
              </v-chip>
            </v-chip-group>
            <div v-else class="text-caption text-grey">None</div>
          </v-col>
          <v-col cols="12">
            <v-combobox v-model="character.additionalLanguages" chips clearable density="compact"
              :items="availableLanguages" label="Additional Languages" multiple variant="outlined" />
          </v-col>
        </v-row>
      </div>

      <!-- Equipment Section -->
      <div class="mb-4">
        <h5 class="text-subtitle-2 text-grey-darken-2 mb-2 d-flex align-center">
          <v-icon class="me-2" color="brown" size="small">mdi-bag-carry-on</v-icon>
          Equipment
        </h5>

        <!-- Starting Equipment from Class/Background -->
        <div v-if="startingEquipment.length" class="mb-3">
          <div class="text-caption text-grey-darken-2 mb-1">Starting Equipment:</div>
          <v-chip-group>
            <v-chip v-for="item in startingEquipment" :key="item" color="orange" size="small" variant="outlined">
              {{ item }}
            </v-chip>
          </v-chip-group>
        </div>

        <!-- Custom Equipment -->
        <v-row>
          <v-col v-for="(item, index) in character.equipment" :key="index" cols="12" sm="6" md="4">
            <v-card class="equipment-card" color="brown-lighten-5" flat>
              <v-card-text class="pa-2">
                <div class="d-flex justify-between align-center mb-1">
                  <v-text-field v-model="item.name" density="compact" hide-details placeholder="Item name"
                    variant="outlined" />
                  <v-btn @click="removeEquipment(index)" color="brown" icon size="x-small" variant="text" class="ms-1">
                    <v-icon size="small">mdi-close</v-icon>
                  </v-btn>
                </div>
                <v-row dense>
                  <v-col cols="6">
                    <v-text-field v-model.number="item.quantity" density="compact" hide-details label="Qty"
                      type="number" min="1" variant="outlined" />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field v-model="item.weight" density="compact" hide-details label="Weight"
                      variant="outlined" />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-btn @click="addEquipment" class="mt-2" color="brown" prepend-icon="mdi-plus" variant="outlined">
          Add Equipment
        </v-btn>
      </div>

      <!-- Coins Section -->
      <div class="mb-4">
        <h5 class="text-subtitle-2 text-grey-darken-2 mb-2 d-flex align-center">
          <v-icon class="me-2" color="amber" size="small">mdi-coins</v-icon>
          Coins
        </h5>
        <v-row>
          <v-col v-for="(coinData, coinType) in coinTypes" :key="coinType" cols="6" sm="4" md="2">
            <v-card class="text-center pa-2" :color="coinData.color + '-lighten-5'" flat>
              <div class="text-caption" :class="coinData.color + '--text'">{{ coinData.name }}</div>
              <v-text-field v-model.number="character.coins[coinType]" density="compact" hide-details min="0"
                type="number" variant="outlined" class="mt-1" />
            </v-card>
          </v-col>
        </v-row>

        <!-- Coin Converter -->
        <v-card class="mt-3 pa-3" color="amber-lighten-5" flat>
          <div class="text-subtitle-2 mb-2">Total Value: {{ totalCoinValue }} gp</div>
          <div class="text-caption text-grey-darken-2">
            1 pp = 10 gp | 1 gp = 10 sp | 1 sp = 10 cp | 1 gp = 2 ep
          </div>
        </v-card>
      </div>

      <!-- Attuned Items Section -->
      <div>
        <h5 class="text-subtitle-2 text-grey-darken-2 mb-2 d-flex align-center">
          <v-icon class="me-2" color="purple" size="small">mdi-diamond-stone</v-icon>
          Attuned Items (Max 3)
        </h5>
        <v-row>
          <v-col v-for="(item, index) in character.attunedItems" :key="index" cols="12" md="4">
            <v-text-field v-model="character.attunedItems[index]" density="compact" :label="`Attuned Item ${index + 1}`"
              variant="outlined" clearable>
              <template #prepend>
                <v-icon color="purple" size="small">mdi-diamond</v-icon>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
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

// Common D&D languages
const availableLanguages = [
  'Common', 'Dwarvish', 'Elvish', 'Giant', 'Gnomish', 'Goblin', 'Halfling', 'Orc',
  'Abyssal', 'Celestial', 'Draconic', 'Deep Speech', 'Infernal', 'Primordial', 'Sylvan', 'Undercommon'
]

// Coin types with colors
const coinTypes = {
  cp: { name: 'Copper', color: 'brown' },
  sp: { name: 'Silver', color: 'blue-grey' },
  ep: { name: 'Electrum', color: 'yellow' },
  gp: { name: 'Gold', color: 'amber' },
  pp: { name: 'Platinum', color: 'blue' }
}

// Initialize arrays if they don't exist
if (!props.character.equipment) {
  props.character.equipment = []
}
if (!props.character.additionalLanguages) {
  props.character.additionalLanguages = []
}
if (!props.character.coins) {
  props.character.coins = { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 }
}
if (!props.character.attunedItems) {
  props.character.attunedItems = ['', '', '']
}

// Computed properties for languages from species and background
const speciesLanguages = computed(() => {
  return props.character.speciesDetails?.languages || []
})

const backgroundLanguages = computed(() => {
  return props.character.backgroundDetails?.languages || []
})

// Starting equipment from class and background
const startingEquipment = computed(() => {
  const equipment = []

  if (props.character.classDetails?.startingEquipment) {
    equipment.push(...props.character.classDetails.startingEquipment)
  }

  if (props.character.backgroundDetails?.startingEquipment) {
    equipment.push(...props.character.backgroundDetails.startingEquipment.map(item => item.name))
  }

  return equipment
})

// Total coin value in gold pieces
const totalCoinValue = computed(() => {
  const coins = props.character.coins
  return (
    coins.pp * 10 +
    coins.gp +
    coins.ep * 0.5 +
    coins.sp * 0.1 +
    coins.cp * 0.01
  ).toFixed(2)
})

const addEquipment = () => {
  props.character.equipment.push({
    name: '',
    quantity: 1,
    weight: ''
  })
}

const removeEquipment = (index) => {
  props.character.equipment.splice(index, 1)
}
</script>

<style scoped>
.equipment-card {
  border: 1px solid rgba(0, 0, 0, 0.12);
  transition: all 0.2s ease;
}

.equipment-card:hover {
  border-color: rgba(121, 85, 72, 0.3);
  box-shadow: 0 2px 4px rgba(121, 85, 72, 0.1);
}

:deep(.v-chip-group .v-chip) {
  margin: 2px;
}

:deep(.v-text-field--density-compact .v-field) {
  --v-field-padding-start: 8px;
  --v-field-padding-end: 8px;
}
</style>
