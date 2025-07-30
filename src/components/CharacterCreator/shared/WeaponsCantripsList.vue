<template>
  <v-card variant="outlined" class="mb-6">
    <v-card-title class="d-flex align-center py-2">
      <v-icon class="me-2" color="red">mdi-sword</v-icon>
      Weapons & Damage Cantrips
    </v-card-title>
    <v-divider />
    <v-card-text class="pt-3">
      <!-- Weapons Section -->
      <div class="mb-4">
        <h5 class="text-subtitle-2 text-grey-darken-2 mb-3 d-flex align-center">
          <v-icon class="me-2" color="red" size="small">mdi-sword</v-icon>
          Weapons
        </h5>

        <v-row>
          <v-col v-for="(weapon, index) in character.weapons" :key="index" cols="12" md="6">
            <v-card class="weapon-card" color="red-lighten-5" flat>
              <v-card-text class="pa-3">
                <div class="d-flex justify-between align-center mb-2">
                  <div class="text-subtitle-2 font-weight-bold">{{ weapon.name || 'Weapon ' + (index + 1) }}</div>
                  <v-btn @click="removeWeapon(index)" color="red" icon size="x-small" variant="text">
                    <v-icon size="small">mdi-close</v-icon>
                  </v-btn>
                </div>

                <v-row dense>
                  <v-col cols="12">
                    <v-text-field v-model="weapon.name" density="compact" label="Weapon Name" variant="outlined" />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field v-model="weapon.damage" density="compact" label="Damage (e.g., 1d8)"
                      variant="outlined" />
                  </v-col>
                  <v-col cols="6">
                    <v-select v-model="weapon.damageType" density="compact" :items="damageTypes" label="Damage Type"
                      variant="outlined" />
                  </v-col>
                  <v-col cols="6">
                    <v-select v-model="weapon.attackBonus" density="compact" :items="abilityScores" item-title="label"
                      item-value="value" label="Attack Bonus" variant="outlined" />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field v-model="weapon.range" density="compact" label="Range/Reach" variant="outlined" />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-btn @click="addWeapon" class="mt-2" color="red" prepend-icon="mdi-plus" variant="outlined">
          Add Weapon
        </v-btn>
      </div>

      <!-- Damage Cantrips Section -->
      <div>
        <h5 class="text-subtitle-2 text-grey-darken-2 mb-3 d-flex align-center">
          <v-icon class="me-2" color="purple" size="small">mdi-magic-staff</v-icon>
          Damage Cantrips
        </h5>

        <v-row>
          <v-col v-for="(cantrip, index) in character.damagingCantrips" :key="index" cols="12" md="6">
            <v-card class="cantrip-card" color="purple-lighten-5" flat>
              <v-card-text class="pa-3">
                <div class="d-flex justify-between align-center mb-2">
                  <div class="text-subtitle-2 font-weight-bold">{{ cantrip.name || 'Cantrip ' + (index + 1) }}</div>
                  <v-btn @click="removeCantrip(index)" color="purple" icon size="x-small" variant="text">
                    <v-icon size="small">mdi-close</v-icon>
                  </v-btn>
                </div>

                <v-row dense>
                  <v-col cols="12">
                    <v-text-field v-model="cantrip.name" density="compact" label="Cantrip Name" variant="outlined" />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field v-model="cantrip.damage" density="compact" label="Damage (e.g., 1d10)"
                      variant="outlined" />
                  </v-col>
                  <v-col cols="6">
                    <v-select v-model="cantrip.damageType" density="compact" :items="damageTypes" label="Damage Type"
                      variant="outlined" />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field v-model="cantrip.range" density="compact" label="Range" variant="outlined" />
                  </v-col>
                  <v-col cols="6">
                    <v-select v-model="cantrip.savingThrow" density="compact" :items="savingThrows" label="Saving Throw"
                      variant="outlined" />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-btn @click="addCantrip" class="mt-2" color="purple" prepend-icon="mdi-plus" variant="outlined">
          Add Damage Cantrip
        </v-btn>
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

// Damage types from D&D 5e
const damageTypes = [
  'Acid', 'Bludgeoning', 'Cold', 'Fire', 'Force',
  'Lightning', 'Necrotic', 'Piercing', 'Poison',
  'Psychic', 'Radiant', 'Slashing', 'Thunder'
]

// Saving throws
const savingThrows = [
  'None', 'Strength', 'Dexterity', 'Constitution',
  'Intelligence', 'Wisdom', 'Charisma'
]

// Ability scores for attack bonus
const abilityScores = [
  { label: 'Strength', value: 'strength' },
  { label: 'Dexterity', value: 'dexterity' },
  { label: 'Constitution', value: 'constitution' },
  { label: 'Intelligence', value: 'intelligence' },
  { label: 'Wisdom', value: 'wisdom' },
  { label: 'Charisma', value: 'charisma' }
]

// Initialize arrays if they don't exist
if (!props.character.weapons) {
  props.character.weapons = []
}
if (!props.character.damagingCantrips) {
  props.character.damagingCantrips = []
}

const addWeapon = () => {
  props.character.weapons.push({
    name: '',
    damage: '',
    damageType: '',
    attackBonus: 'strength',
    range: ''
  })
}

const removeWeapon = (index) => {
  props.character.weapons.splice(index, 1)
}

const addCantrip = () => {
  props.character.damagingCantrips.push({
    name: '',
    damage: '',
    damageType: '',
    range: '',
    savingThrow: 'None'
  })
}

const removeCantrip = (index) => {
  props.character.damagingCantrips.splice(index, 1)
}
</script>

<style scoped>
.weapon-card,
.cantrip-card {
  border: 1px solid rgba(0, 0, 0, 0.12);
  transition: all 0.2s ease;
}

.weapon-card:hover {
  border-color: rgba(244, 67, 54, 0.3);
  box-shadow: 0 2px 4px rgba(244, 67, 54, 0.1);
}

.cantrip-card:hover {
  border-color: rgba(156, 39, 176, 0.3);
  box-shadow: 0 2px 4px rgba(156, 39, 176, 0.1);
}
</style>
