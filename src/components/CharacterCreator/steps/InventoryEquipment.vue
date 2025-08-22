<template>
  <v-card flat>
    <v-card-title class="text-h4 text-center mb-2">🎒 Inventory & Equipment</v-card-title>
    <v-card-subtitle class="text-center mb-4">Manage your character's gear and starting items</v-card-subtitle>

    <!-- Step 1: Equipment Method Stepper -->
    <v-stepper v-model="step" class="mb-6" alt-labels>
      <v-stepper-header>
        <v-stepper-step :complete="step > 1" step="1">Choose Method</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="step > 2" step="2">Select Equipment</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="3">Review</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card variant="outlined" class="mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-package-variant</v-icon>
              Equipment Method
            </v-card-title>
            <v-card-text>
              <v-radio-group v-model="equipmentMethod" inline>
                <v-radio label="Standard Equipment Package" value="package" />
                <v-radio label="Purchase with Starting Gold" value="gold" />
              </v-radio-group>
              <v-alert v-if="equipmentMethod === 'package'" type="info" variant="tonal" class="mt-4">
                <v-icon>mdi-package</v-icon>
                You'll receive the standard equipment package for your class and background.
              </v-alert>
              <v-alert v-if="equipmentMethod === 'gold'" type="warning" variant="tonal" class="mt-4">
                <v-icon>mdi-gold</v-icon>
                Starting Gold: <strong>{{ startingGold }}</strong> gp<br>
                You must purchase all your equipment manually.
              </v-alert>
              <v-btn color="primary" class="mt-4" @click="step = 2">Continue</v-btn>
            </v-card-text>
          </v-card>
        </v-stepper-content>
        <v-stepper-content step="2">
          <!-- Sticky Inventory Summary Bar -->
          <div class="sticky-summary-bar mb-4">
            <v-row>
              <v-col cols="6" class="text-center">
                <v-chip color="success" class="ma-1" size="large">💰 Value: {{ totalValue }} gp</v-chip>
              </v-col>
              <v-col cols="6" class="text-center">
                <v-chip color="orange" class="ma-1" size="large">📦 Items: {{ totalItems }}</v-chip>
              </v-col>
            </v-row>
            <v-btn variant="text" color="primary" @click="showInventoryModal = true">View All</v-btn>
          </div>

          <!-- Accordion for Weapons, Armor, Gear -->
          <v-expansion-panels multiple>
            <!-- Weapons -->
            <v-expansion-panel>
              <v-expansion-panel-title>
                <v-icon color="red" class="mr-2">mdi-sword</v-icon> Weapons
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-row>
                  <v-col v-for="weapon in classStartingWeapons" :key="weapon.name" cols="12" sm="6" md="4">
                    <v-card class="weapon-card mb-2" variant="tonal" color="red">
                      <v-card-title class="d-flex align-center justify-space-between">
                        <span class="font-weight-bold">{{ weapon.name }}</span>
                        <v-chip size="small" color="red" variant="elevated">{{ weapon.damage_dice }}{{
                          weapon.damage_type }}</v-chip>
                      </v-card-title>
                      <v-card-subtitle class="text-caption">{{ weapon.weapon_category }} • {{ weapon.weapon_range
                        }}</v-card-subtitle>
                      <v-card-text>
                        <div class="d-flex align-center justify-space-between mb-2">
                          <span><strong>Cost:</strong> {{ weapon.cost.quantity }} {{ weapon.cost.unit }}</span>
                          <v-btn icon="mdi-information" size="x-small" variant="text"
                            @click="showDetails(weapon)"></v-btn>
                        </div>
                        <div v-if="weapon.properties?.length" class="mb-2">
                          <v-chip v-for="property in weapon.properties" :key="property.name" size="x-small"
                            variant="outlined" class="mr-1">{{ property.name }}</v-chip>
                        </div>
                        <v-btn color="error" variant="text" size="small" @click="removeWeapon(weapon)">Remove</v-btn>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
                <v-btn color="primary" variant="tonal" class="mt-2" @click="addWeaponDialog = true">+ Add Weapon</v-btn>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <!-- Armor -->
            <v-expansion-panel>
              <v-expansion-panel-title>
                <v-icon color="blue" class="mr-2">mdi-shield</v-icon> Armor & Shields
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-row>
                  <v-col v-for="armor in startingArmor" :key="armor.name" cols="12" sm="6" md="4">
                    <v-card class="armor-card mb-2" variant="tonal" color="blue">
                      <v-card-title class="d-flex align-center justify-space-between">
                        <span class="font-weight-bold">{{ armor.name }}</span>
                        <v-chip size="small" color="blue" variant="elevated">AC {{ armor.armor_class.base }}</v-chip>
                      </v-card-title>
                      <v-card-subtitle class="text-caption">{{ armor.armor_category }}</v-card-subtitle>
                      <v-card-text>
                        <span><strong>Cost:</strong> {{ armor.cost.quantity }} {{ armor.cost.unit }}</span>
                        <v-btn icon="mdi-information" size="x-small" variant="text" @click="showDetails(armor)"></v-btn>
                        <v-btn color="error" variant="text" size="small" @click="removeArmor(armor)">Remove</v-btn>
                        <div v-if="armor.stealth_disadvantage" class="mt-2">
                          <v-chip size="x-small" color="warning" variant="outlined">Stealth Disadvantage</v-chip>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
                <v-btn color="primary" variant="tonal" class="mt-2" @click="addArmorDialog = true">+ Add Armor</v-btn>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <!-- Gear -->
            <v-expansion-panel>
              <v-expansion-panel-title>
                <v-icon color="brown" class="mr-2">mdi-bag-personal</v-icon> Adventuring Gear
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-row>
                  <v-col v-for="item in allGear" :key="item.name" cols="12" sm="6" md="4">
                    <v-card class="gear-card mb-2" variant="outlined">
                      <v-card-title class="d-flex align-center justify-space-between">
                        <span class="font-weight-bold">{{ item.name }}</span>
                        <v-chip v-if="item.quantity > 1" size="x-small" color="brown" variant="outlined">x{{
                          item.quantity }}</v-chip>
                      </v-card-title>
                      <v-card-text>
                        <span><strong>Cost:</strong> {{ item.cost.quantity }} {{ item.cost.unit }}</span>
                        <v-btn icon="mdi-information" size="x-small" variant="text" @click="showDetails(item)"></v-btn>
                        <v-btn v-if="item.inInventory" color="error" variant="text" size="small"
                          @click="removeGear(item)">Remove</v-btn>
                        <v-btn v-else color="primary" variant="tonal" size="small" @click="addGear(item)">Add</v-btn>
                        <v-text-field v-if="item.inInventory" v-model.number="item.quantity" type="number" min="1"
                          max="99" label="Qty" class="mt-2" style="max-width: 80px; display: inline-block;"
                          density="compact" hide-details />
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
                <v-btn color="primary" variant="tonal" class="mt-2" @click="addGearDialog = true">+ Add Gear</v-btn>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-btn color="primary" class="mt-6" @click="step = 3">Review & Continue</v-btn>
        </v-stepper-content>
        <v-stepper-content step="3">
          <v-card variant="outlined" class="pa-4">
            <v-card-title class="text-h5">Review Your Inventory</v-card-title>
            <v-card-text>
              <div class="mb-2">Total Value: <strong>{{ totalValue }} gp</strong></div>
              <div class="mb-2">Total Items: <strong>{{ totalItems }}</strong></div>
              <v-btn color="primary" class="mt-2" @click="showInventoryModal = true">View Full Inventory</v-btn>
            </v-card-text>
            <v-card-actions>
              <v-btn color="success" @click="$emit('complete')">Finish</v-btn>
              <v-btn variant="text" @click="step = 2">Back</v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>

    <!-- Inventory Modal -->
    <v-dialog v-model="showInventoryModal" max-width="600">
      <v-card>
        <v-card-title>Full Inventory</v-card-title>
        <v-card-text>
          <div v-if="allInventory.length === 0">No items in inventory.</div>
          <v-list v-else>
            <v-list-item v-for="item in allInventory" :key="item.name">
              <v-list-item-title>{{ item.name }}</v-list-item-title>
              <v-list-item-subtitle>Qty: {{ item.quantity }} | {{ item.cost.quantity }} {{ item.cost.unit
                }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="showInventoryModal = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { computed, ref, toRefs } from 'vue'

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
const { character, characterData } = toRefs(props)

// Stepper state
const step = ref(1)
const showInventoryModal = ref(false)
const addWeaponDialog = ref(false)
const addArmorDialog = ref(false)
const addGearDialog = ref(false)

// Equipment method selection
const equipmentMethod = ref('package')
const equipmentSearch = ref('')

// Sample data (replace with real data as needed)
const classStartingWeapons = ref([
  {
    name: 'Scimitar',
    damage_dice: '1d6',
    damage_type: ' slashing',
    weapon_category: 'Simple Melee',
    weapon_range: 'Melee',
    cost: { quantity: 25, unit: 'gp' },
    properties: [{ name: 'Finesse' }, { name: 'Light' }],
  },
])
const startingArmor = ref([
  {
    name: 'Leather Armor',
    armor_class: { base: 11 },
    armor_category: 'Light Armor',
    cost: { quantity: 10, unit: 'gp' },
    stealth_disadvantage: false,
  },
])
const startingEquipmentPackage = ref([
  { name: 'Backpack', cost: { quantity: 2, unit: 'gp' }, quantity: 1 },
  { name: 'Bedroll', cost: { quantity: 1, unit: 'sp' }, quantity: 1 },
  { name: 'Mess kit', cost: { quantity: 2, unit: 'sp' }, quantity: 1 },
  { name: 'Tinderbox', cost: { quantity: 5, unit: 'sp' }, quantity: 1 },
  { name: 'Torch', cost: { quantity: 1, unit: 'cp' }, quantity: 10 },
  { name: 'Rations (1 day)', cost: { quantity: 2, unit: 'sp' }, quantity: 10 },
  { name: 'Waterskin', cost: { quantity: 2, unit: 'gp' }, quantity: 1 },
  { name: 'Hemp rope (50 feet)', cost: { quantity: 2, unit: 'gp' }, quantity: 1 },
])
const backgroundEquipment = ref([
  { name: 'Set of artisan tools', cost: { quantity: 15, unit: 'gp' }, quantity: 1 },
  { name: 'Belt pouch', cost: { quantity: 5, unit: 'sp' }, quantity: 1 },
])
const purchasedItems = ref([])

// All gear (merge starting package, background, and purchased)
const allGear = computed(() => {
  // Merge all gear, mark inInventory and allow quantity editing
  const gear = []
  const addOrUpdate = (item, inInventory = false) => {
    const found = gear.find(g => g.name === item.name)
    if (found) {
      found.quantity += item.quantity || 1
      found.inInventory = found.inInventory || inInventory
    } else {
      gear.push({ ...item, inInventory, quantity: item.quantity || 1 })
    }
  }
  if (equipmentMethod.value === 'package') {
    startingEquipmentPackage.value.forEach(i => addOrUpdate(i, true))
    backgroundEquipment.value.forEach(i => addOrUpdate(i, true))
  }
  purchasedItems.value.forEach(i => addOrUpdate(i, true))
  // Add more gear options for adding (not in inventory)
  // Example: addOrUpdate({ name: 'Grappling hook', cost: { quantity: 2, unit: 'gp' }, quantity: 1 }, false)
  return gear
})

const allInventory = computed(() => {
  // Merge all inventory: weapons, armor, gear
  const inv = []
  classStartingWeapons.value.forEach(w => inv.push({ ...w, quantity: 1 }))
  startingArmor.value.forEach(a => inv.push({ ...a, quantity: 1 }))
  allGear.value.forEach(g => inv.push({ ...g }))
  return inv
})

const totalValue = computed(() => {
  let value = 0
  allInventory.value.forEach(item => {
    const cost = item.cost
    if (!cost) return
    value += cost.unit === 'gp' ? cost.quantity * (item.quantity || 1)
      : cost.unit === 'sp' ? (cost.quantity / 10) * (item.quantity || 1)
        : (cost.quantity / 100) * (item.quantity || 1)
  })
  return Math.round(value * 10) / 10
})
const totalItems = computed(() => {
  let count = 0
  allInventory.value.forEach(item => { count += item.quantity || 1 })
  return count
})
const startingGold = computed(() => '4d4 × 10')
const remainingGold = computed(() => 150) // Placeholder

// Dialog/modal handlers
function showDetails(item) {
  // Could open a modal with item details (not implemented here)
  alert(`Details for ${item.name}`)
}

// Add/Remove/Replace handlers
function removeWeapon(weapon) {
  const idx = classStartingWeapons.value.findIndex(w => w.name === weapon.name)
  if (idx > -1) classStartingWeapons.value.splice(idx, 1)
}
function removeArmor(armor) {
  const idx = startingArmor.value.findIndex(a => a.name === armor.name)
  if (idx > -1) startingArmor.value.splice(idx, 1)
}
function removeGear(item) {
  // Remove from purchased or starting package
  let idx = purchasedItems.value.findIndex(i => i.name === item.name)
  if (idx > -1) purchasedItems.value.splice(idx, 1)
  else {
    idx = startingEquipmentPackage.value.findIndex(i => i.name === item.name)
    if (idx > -1) startingEquipmentPackage.value.splice(idx, 1)
    else {
      idx = backgroundEquipment.value.findIndex(i => i.name === item.name)
      if (idx > -1) backgroundEquipment.value.splice(idx, 1)
    }
  }
}
function addGear(item) {
  // Add to purchasedItems
  const found = purchasedItems.value.find(i => i.name === item.name)
  if (found) found.quantity += 1
  else purchasedItems.value.push({ ...item, quantity: 1 })
}
</script>

<style scoped>
.weapon-card,
.armor-card,
.gear-card,
.purchase-item-card,
.purchase-card {
  height: 100%;
  transition: transform 0.2s ease;
}

.weapon-card:hover,
.armor-card:hover,
.gear-card:hover,
.purchase-item-card:hover {
  transform: translateY(-2px);
}

.armor-choice-card {
  height: 120px;
  transition: all 0.2s ease;
}

.armor-choice-card:hover {
  transform: translateY(-2px);
}
</style>
