<template>
  <v-card flat>
    <v-card-title class="text-h4 text-center mb-4">🎒 Inventory & Equipment</v-card-title>
    <v-card-subtitle class="text-center mb-4">
      What your character owns and carries
    </v-card-subtitle>

    <!-- Equipment Method Selection -->
    <v-card variant="outlined" class="mb-6">
      <v-card-title class="d-flex align-center">
        <v-icon color="primary" class="mr-2">mdi-package-variant</v-icon>
        Equipment Method
        <v-spacer />
        <v-chip color="success" variant="tonal" size="small">Physical Items</v-chip>
      </v-card-title>
      <v-card-subtitle>
        Choose how to determine your starting equipment
      </v-card-subtitle>

      <v-card-text>
        <v-radio-group v-model="equipmentMethod" inline>
          <v-radio label="Standard Equipment Package" value="package" class="mb-2" />
          <v-radio label="Purchase with Starting Gold" value="gold" class="mb-2" />
        </v-radio-group>

        <v-alert v-if="equipmentMethod === 'package'" type="info" variant="tonal" class="mt-4">
          <v-icon>mdi-package</v-icon>
          You'll receive the standard equipment package for your class and background
        </v-alert>

        <v-alert v-if="equipmentMethod === 'gold'" type="warning" variant="tonal" class="mt-4">
          <v-icon>mdi-gold</v-icon>
          Starting Gold: <strong>{{ startingGold }}</strong> gp
          <br>You must purchase all your equipment manually
        </v-alert>
      </v-card-text>
    </v-card>

    <!-- Current Carrying Capacity Overview -->
    <v-row class="mb-6">
      <v-col cols="12" md="4">
        <v-card color="blue-lighten-4" variant="outlined">
          <v-card-title class="text-center">⚖️ Weight</v-card-title>
          <v-card-text class="text-center">
            <div class="text-h4" :class="isOverloaded ? 'text-error' : 'text-blue'">
              {{ totalWeight }} / {{ maxCarryingCapacity }}
            </div>
            <div class="text-caption">pounds</div>
            <v-progress-linear :model-value="(totalWeight / maxCarryingCapacity) * 100"
              :color="isOverloaded ? 'error' : 'blue'" class="mt-2" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card color="success-lighten-4" variant="outlined">
          <v-card-title class="text-center">💰 Value</v-card-title>
          <v-card-text class="text-center">
            <div class="text-h4 text-success">{{ totalValue }}</div>
            <div class="text-caption">gold pieces</div>
            <div class="text-body-2 mt-2">
              Total equipment value
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card color="orange-lighten-4" variant="outlined">
          <v-card-title class="text-center">📦 Items</v-card-title>
          <v-card-text class="text-center">
            <div class="text-h4 text-orange">{{ totalItems }}</div>
            <div class="text-caption">total items</div>
            <div class="text-body-2 mt-2">
              In your inventory
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Weapons Section -->
    <v-card variant="outlined" class="mb-6">
      <v-card-title class="d-flex align-center">
        <v-icon color="red" class="mr-2">mdi-sword</v-icon>
        Weapons
        <v-spacer />
        <v-chip color="success" variant="tonal" size="small">Physical Items</v-chip>
      </v-card-title>
      <v-card-subtitle>
        Weapons you own and can use in combat
      </v-card-subtitle>

      <v-card-text>
        <!-- Class Starting Weapons -->
        <div v-if="classStartingWeapons.length" class="mb-4">
          <h4 class="text-subtitle-1 mb-2">
            <v-icon size="small" color="primary">mdi-school</v-icon>
            From Your Class
          </h4>
          <v-row>
            <v-col v-for="weapon in classStartingWeapons" :key="weapon.name" cols="12" md="6">
              <v-card variant="tonal" color="red" class="weapon-card">
                <v-card-text class="pa-3">
                  <div class="d-flex justify-space-between align-center mb-2">
                    <h5 class="font-weight-medium">{{ weapon.name }}</h5>
                    <v-chip size="x-small" color="red" variant="elevated">
                      {{ weapon.damage_dice }}{{ weapon.damage_type }}
                    </v-chip>
                  </div>
                  <div class="text-caption text-medium-emphasis mb-2">
                    {{ weapon.weapon_category }} • {{ weapon.weapon_range }}
                  </div>
                  <div class="d-flex justify-space-between align-center">
                    <div class="text-body-2">
                      <strong>Weight:</strong> {{ weapon.weight }} lbs
                    </div>
                    <div class="text-body-2">
                      <strong>Cost:</strong> {{ weapon.cost.quantity }} {{ weapon.cost.unit }}
                    </div>
                  </div>
                  <div v-if="weapon.properties?.length" class="mt-2">
                    <v-chip v-for="property in weapon.properties" :key="property.name" size="x-small" variant="outlined"
                      class="mr-1">
                      {{ property.name }}
                    </v-chip>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- Weapon Proficiency Choices -->
        <div v-if="hasWeaponChoices" class="mb-4">
          <h4 class="text-subtitle-1 mb-2">
            <v-icon size="small" color="primary">mdi-sword-cross</v-icon>
            Choose Additional Weapons
          </h4>
          <p class="text-caption mb-2">Select weapons from your class options:</p>
          <div class="d-flex flex-wrap ga-2 mb-3">
            <v-chip v-for="weapon in weaponChoiceOptions" :key="weapon.name"
              :color="isWeaponSelected(weapon.name) ? 'red' : 'default'"
              :variant="isWeaponSelected(weapon.name) ? 'elevated' : 'outlined'" clickable
              @click="toggleWeaponChoice(weapon)">
              <v-icon start size="x-small">mdi-package</v-icon>
              {{ weapon.name }}
            </v-chip>
          </div>
        </div>

        <v-alert type="info" variant="tonal" class="mt-4">
          <v-icon>mdi-sword</v-icon>
          <strong>What this means:</strong> These are physical weapons in your inventory.
          You can attack with them in combat, and they have weight and value.
        </v-alert>
      </v-card-text>
    </v-card>

    <!-- Armor Section -->
    <v-card variant="outlined" class="mb-6">
      <v-card-title class="d-flex align-center">
        <v-icon color="blue" class="mr-2">mdi-shield</v-icon>
        Armor & Shields
        <v-spacer />
        <v-chip color="success" variant="tonal" size="small">Physical Items</v-chip>
      </v-card-title>
      <v-card-subtitle>
        Protective gear you wear and carry
      </v-card-subtitle>

      <v-card-text>
        <!-- Starting Armor -->
        <div v-if="startingArmor.length" class="mb-4">
          <h4 class="text-subtitle-1 mb-2">
            <v-icon size="small" color="primary">mdi-school</v-icon>
            From Your Class
          </h4>
          <v-row>
            <v-col v-for="armor in startingArmor" :key="armor.name" cols="12" md="6">
              <v-card variant="tonal" color="blue" class="armor-card">
                <v-card-text class="pa-3">
                  <div class="d-flex justify-space-between align-center mb-2">
                    <h5 class="font-weight-medium">{{ armor.name }}</h5>
                    <v-chip size="x-small" color="blue" variant="elevated">
                      AC {{ armor.armor_class.base }}
                    </v-chip>
                  </div>
                  <div class="text-caption text-medium-emphasis mb-2">
                    {{ armor.armor_category }}
                  </div>
                  <div class="d-flex justify-space-between align-center">
                    <div class="text-body-2">
                      <strong>Weight:</strong> {{ armor.weight }} lbs
                    </div>
                    <div class="text-body-2">
                      <strong>Cost:</strong> {{ armor.cost.quantity }} {{ armor.cost.unit }}
                    </div>
                  </div>
                  <div v-if="armor.stealth_disadvantage" class="mt-2">
                    <v-chip size="x-small" color="warning" variant="outlined">
                      Stealth Disadvantage
                    </v-chip>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- Armor Choices -->
        <div v-if="hasArmorChoices" class="mb-4">
          <h4 class="text-subtitle-1 mb-2">
            <v-icon size="small" color="primary">mdi-shield-plus</v-icon>
            Choose Your Armor
          </h4>
          <p class="text-caption mb-2">Select your starting armor:</p>
          <v-row>
            <v-col v-for="armor in armorChoiceOptions" :key="armor.name" cols="12" md="4">
              <v-card :variant="isArmorSelected(armor.name) ? 'elevated' : 'outlined'"
                :color="isArmorSelected(armor.name) ? 'blue' : 'default'" clickable @click="selectArmor(armor)"
                class="armor-choice-card">
                <v-card-text class="pa-3 text-center">
                  <v-icon :color="isArmorSelected(armor.name) ? 'white' : 'blue'" size="large" class="mb-2">
                    mdi-shield
                  </v-icon>
                  <div class="font-weight-medium mb-1">{{ armor.name }}</div>
                  <div class="text-caption">AC {{ armor.armor_class.base }}</div>
                  <div class="text-caption">{{ armor.weight }} lbs</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>

    <!-- Adventuring Gear Section -->
    <v-card variant="outlined" class="mb-6">
      <v-card-title class="d-flex align-center">
        <v-icon color="brown" class="mr-2">mdi-bag-personal</v-icon>
        Adventuring Gear
        <v-spacer />
        <v-chip color="success" variant="tonal" size="small">Physical Items</v-chip>
      </v-card-title>
      <v-card-subtitle>
        Essential tools and supplies for your adventures
      </v-card-subtitle>

      <v-card-text>
        <!-- Starting Equipment Package -->
        <div v-if="equipmentMethod === 'package'" class="mb-4">
          <h4 class="text-subtitle-1 mb-2">
            <v-icon size="small" color="primary">mdi-package-variant-closed</v-icon>
            Standard Equipment Package
          </h4>
          <v-row>
            <v-col v-for="item in startingEquipmentPackage" :key="item.name" cols="12" sm="6" md="4">
              <v-card variant="outlined" class="gear-card">
                <v-card-text class="pa-3">
                  <div class="d-flex align-center mb-2">
                    <v-icon color="brown" size="small" class="mr-2">mdi-package</v-icon>
                    <span class="font-weight-medium">{{ item.name }}</span>
                    <v-spacer />
                    <v-chip v-if="item.quantity > 1" size="x-small" variant="outlined">
                      x{{ item.quantity }}
                    </v-chip>
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    {{ item.weight }} lbs • {{ item.cost.quantity }} {{ item.cost.unit }}
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- Background Equipment -->
        <div v-if="backgroundEquipment.length" class="mb-4">
          <h4 class="text-subtitle-1 mb-2">
            <v-icon size="small" color="orange">mdi-briefcase</v-icon>
            From Your Background
          </h4>
          <v-row>
            <v-col v-for="item in backgroundEquipment" :key="item.name" cols="12" sm="6" md="4">
              <v-card variant="tonal" color="orange" class="gear-card">
                <v-card-text class="pa-3">
                  <div class="d-flex align-center mb-2">
                    <v-icon color="orange-darken-2" size="small" class="mr-2">mdi-package</v-icon>
                    <span class="font-weight-medium">{{ item.name }}</span>
                    <v-spacer />
                    <v-chip v-if="item.quantity > 1" size="x-small" color="orange" variant="elevated">
                      x{{ item.quantity }}
                    </v-chip>
                  </div>
                  <div class="text-caption">
                    {{ item.weight }} lbs • {{ item.cost.quantity }} {{ item.cost.unit }}
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- Equipment Choices -->
        <div v-if="hasEquipmentChoices" class="mb-4">
          <h4 class="text-subtitle-1 mb-2">
            <v-icon size="small" color="primary">mdi-package-variant</v-icon>
            Choose Additional Equipment
          </h4>
          <p class="text-caption mb-2">Make your equipment selections:</p>

          <div v-for="(choice, index) in equipmentChoices" :key="index" class="mb-3">
            <div class="text-body-2 font-weight-medium mb-2">
              {{ choice.desc || `Choice ${index + 1}` }}
            </div>
            <div class="d-flex flex-wrap ga-2">
              <v-chip v-for="option in choice.options" :key="option.name"
                :color="isEquipmentSelected(choice.id, option.name) ? 'brown' : 'default'"
                :variant="isEquipmentSelected(choice.id, option.name) ? 'elevated' : 'outlined'" clickable
                @click="toggleEquipmentChoice(choice.id, option)">
                <v-icon start size="x-small">mdi-package</v-icon>
                {{ option.name }}
                <span v-if="option.quantity > 1" class="ml-1">x{{ option.quantity }}</span>
              </v-chip>
            </div>
          </div>
        </div>

        <!-- Manual Purchases (if using gold method) -->
        <div v-if="equipmentMethod === 'gold'" class="mb-4">
          <h4 class="text-subtitle-1 mb-2">
            <v-icon size="small" color="success">mdi-gold</v-icon>
            Purchase Equipment
          </h4>
          <p class="text-caption mb-3">
            Available Gold: <strong>{{ remainingGold }} gp</strong>
          </p>

          <v-text-field v-model="equipmentSearch" label="Search equipment..." prepend-inner-icon="mdi-magnify"
            variant="outlined" density="compact" class="mb-3" />

          <!-- Equipment Categories -->
          <v-expansion-panels variant="accordion">
            <v-expansion-panel v-for="category in equipmentCategories" :key="category.name"
              :title="`${category.name} (${category.items.length} items)`">
              <v-expansion-panel-text>
                <v-row>
                  <v-col v-for="item in category.items" :key="item.name" cols="12" sm="6" md="4">
                    <v-card variant="outlined" class="purchase-item-card">
                      <v-card-text class="pa-3">
                        <div class="d-flex justify-space-between align-center mb-2">
                          <span class="font-weight-medium">{{ item.name }}</span>
                          <v-btn :disabled="!canAfford(item.cost)" size="x-small" color="success"
                            @click="purchaseItem(item)">
                            Buy
                          </v-btn>
                        </div>
                        <div class="text-caption text-medium-emphasis mb-2">
                          {{ item.weight }} lbs
                        </div>
                        <div class="text-body-2 text-success font-weight-bold">
                          {{ item.cost.quantity }} {{ item.cost.unit }}
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>

        <!-- Purchased/Added Items -->
        <div v-if="purchasedItems.length" class="mb-4">
          <h4 class="text-subtitle-1 mb-2">
            <v-icon size="small" color="success">mdi-cart</v-icon>
            Your Purchases
          </h4>
          <v-row>
            <v-col v-for="item in purchasedItems" :key="item.id" cols="12" sm="6" md="4">
              <v-card variant="tonal" color="success" class="purchase-card">
                <v-card-text class="pa-3">
                  <div class="d-flex justify-space-between align-center mb-2">
                    <span class="font-weight-medium">{{ item.name }}</span>
                    <v-btn size="x-small" icon="mdi-close" variant="text" @click="removeItem(item.id)" />
                  </div>
                  <div class="text-caption">
                    Qty: {{ item.quantity }} • {{ item.weight }} lbs • {{ item.cost.quantity }} {{ item.cost.unit }}
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <v-alert type="info" variant="tonal" class="mt-4">
          <v-icon>mdi-package</v-icon>
          <strong>What this means:</strong> These are physical items in your inventory.
          They have weight (affects carrying capacity) and value. You can use, trade, or lose them.
        </v-alert>
      </v-card-text>
    </v-card>
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

// Equipment method selection
const equipmentMethod = ref('package')
const equipmentSearch = ref('')

// Sample data - these would come from actual API/data sources
const classStartingWeapons = ref([
  {
    name: 'Scimitar',
    damage_dice: '1d6',
    damage_type: ' slashing',
    weapon_category: 'Simple Melee',
    weapon_range: 'Melee',
    weight: 3,
    cost: { quantity: 25, unit: 'gp' },
    properties: [{ name: 'Finesse' }, { name: 'Light' }]
  }
])

const startingArmor = ref([
  {
    name: 'Leather Armor',
    armor_class: { base: 11 },
    armor_category: 'Light Armor',
    weight: 10,
    cost: { quantity: 10, unit: 'gp' },
    stealth_disadvantage: false
  }
])

const startingEquipmentPackage = ref([
  { name: 'Backpack', weight: 5, cost: { quantity: 2, unit: 'gp' }, quantity: 1 },
  { name: 'Bedroll', weight: 7, cost: { quantity: 1, unit: 'sp' }, quantity: 1 },
  { name: 'Mess kit', weight: 1, cost: { quantity: 2, unit: 'sp' }, quantity: 1 },
  { name: 'Tinderbox', weight: 1, cost: { quantity: 5, unit: 'sp' }, quantity: 1 },
  { name: 'Torch', weight: 1, cost: { quantity: 1, unit: 'cp' }, quantity: 10 },
  { name: 'Rations (1 day)', weight: 2, cost: { quantity: 2, unit: 'sp' }, quantity: 10 },
  { name: 'Waterskin', weight: 5, cost: { quantity: 2, unit: 'gp' }, quantity: 1 },
  { name: 'Hemp rope (50 feet)', weight: 10, cost: { quantity: 2, unit: 'gp' }, quantity: 1 }
])

const backgroundEquipment = ref([
  { name: 'Set of artisan tools', weight: 5, cost: { quantity: 15, unit: 'gp' }, quantity: 1 },
  { name: 'Belt pouch', weight: 1, cost: { quantity: 5, unit: 'sp' }, quantity: 1 }
])

const equipmentCategories = ref([
  {
    name: 'Weapons',
    items: [
      { name: 'Club', weight: 2, cost: { quantity: 1, unit: 'sp' } },
      { name: 'Dagger', weight: 1, cost: { quantity: 2, unit: 'gp' } },
      { name: 'Javelin', weight: 2, cost: { quantity: 5, unit: 'sp' } }
    ]
  },
  {
    name: 'Adventuring Gear',
    items: [
      { name: 'Rope, hempen (50 feet)', weight: 10, cost: { quantity: 2, unit: 'gp' } },
      { name: 'Grappling hook', weight: 4, cost: { quantity: 2, unit: 'gp' } },
      { name: 'Lantern, hooded', weight: 2, cost: { quantity: 5, unit: 'gp' } }
    ]
  }
])

const purchasedItems = ref([])

// Computed properties
const startingGold = computed(() => {
  // This would be calculated based on class
  return '4d4 × 10'
})

const maxCarryingCapacity = computed(() => {
  const strength = character.value.strength || 10
  return strength * 15
})

const totalWeight = computed(() => {
  let weight = 0

  // Add weapon weights
  classStartingWeapons.value.forEach(weapon => weight += weapon.weight)
  startingArmor.value.forEach(armor => weight += armor.weight)

  if (equipmentMethod.value === 'package') {
    startingEquipmentPackage.value.forEach(item => weight += item.weight * item.quantity)
    backgroundEquipment.value.forEach(item => weight += item.weight * item.quantity)
  }

  purchasedItems.value.forEach(item => weight += item.weight * item.quantity)

  return weight
})

const totalValue = computed(() => {
  let value = 0

  // Calculate total value in gold pieces
  classStartingWeapons.value.forEach(weapon => {
    const cost = weapon.cost
    value += cost.unit === 'gp' ? cost.quantity :
      cost.unit === 'sp' ? cost.quantity / 10 :
        cost.quantity / 100
  })

  startingArmor.value.forEach(armor => {
    const cost = armor.cost
    value += cost.unit === 'gp' ? cost.quantity :
      cost.unit === 'sp' ? cost.quantity / 10 :
        cost.quantity / 100
  })

  if (equipmentMethod.value === 'package') {
    startingEquipmentPackage.value.forEach(item => {
      const cost = item.cost
      const itemValue = cost.unit === 'gp' ? cost.quantity :
        cost.unit === 'sp' ? cost.quantity / 10 :
          cost.quantity / 100
      value += itemValue * item.quantity
    })

    backgroundEquipment.value.forEach(item => {
      const cost = item.cost
      const itemValue = cost.unit === 'gp' ? cost.quantity :
        cost.unit === 'sp' ? cost.quantity / 10 :
          cost.quantity / 100
      value += itemValue * item.quantity
    })
  }

  return Math.round(value * 10) / 10 // Round to 1 decimal place
})

const totalItems = computed(() => {
  let count = 0
  count += classStartingWeapons.value.length
  count += startingArmor.value.length

  if (equipmentMethod.value === 'package') {
    startingEquipmentPackage.value.forEach(item => count += item.quantity)
    backgroundEquipment.value.forEach(item => count += item.quantity)
  }

  purchasedItems.value.forEach(item => count += item.quantity)

  return count
})

const isOverloaded = computed(() => {
  return totalWeight.value > maxCarryingCapacity.value
})

const remainingGold = computed(() => {
  // This would track actual remaining gold
  return 150 // Placeholder
})

const hasWeaponChoices = computed(() => {
  // Check if class has weapon choices
  return false
})

const weaponChoiceOptions = computed(() => {
  return []
})

const hasArmorChoices = computed(() => {
  // Check if class has armor choices
  return false
})

const armorChoiceOptions = computed(() => {
  return []
})

const hasEquipmentChoices = computed(() => {
  // Check if class has equipment choices
  return false
})

const equipmentChoices = computed(() => {
  return []
})

// Methods
const toggleWeaponChoice = (weapon) => {
  // Handle weapon selection logic
}

const isWeaponSelected = (weaponName) => {
  return false
}

const selectArmor = (armor) => {
  // Handle armor selection
}

const isArmorSelected = (armorName) => {
  return false
}

const toggleEquipmentChoice = (choiceId, option) => {
  // Handle equipment choice selection
}

const isEquipmentSelected = (choiceId, optionName) => {
  return false
}

const canAfford = (cost) => {
  const costInGold = cost.unit === 'gp' ? cost.quantity :
    cost.unit === 'sp' ? cost.quantity / 10 :
      cost.quantity / 100
  return remainingGold.value >= costInGold
}

const purchaseItem = (item) => {
  if (canAfford(item.cost)) {
    purchasedItems.value.push({
      ...item,
      id: Date.now() + Math.random(),
      quantity: 1
    })
  }
}

const removeItem = (itemId) => {
  const index = purchasedItems.value.findIndex(item => item.id === itemId)
  if (index > -1) {
    purchasedItems.value.splice(index, 1)
  }
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
