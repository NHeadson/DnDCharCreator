<template>
  <v-card flat>
    <v-card-title class="text-h4 text-center mb-4">🎒 Inventory & Equipment</v-card-title>
    <v-card-subtitle class="text-center mb-4">
      Physical items your character owns and carries
    </v-card-subtitle>

    <!-- Equipment Method Selection -->
    <v-card variant="outlined" class="mb-6">
      <v-card-title class="d-flex align-center">
        <v-icon color="primary" class="mr-2">mdi-package-variant</v-icon>
        Equipment Method
      </v-card-title>
      <v-card-subtitle class="text-body-2">
        Choose how to acquire your starting equipment
      </v-card-subtitle>

      <v-card-text>
        <v-radio-group v-model="equipmentMethod">
          <v-row>
            <v-col cols="12" md="6">
              <v-card :color="equipmentMethod === 'class' ? 'primary' : 'default'" variant="outlined"
                class="pa-4 cursor-pointer h-100" @click="equipmentMethod = 'class'">
                <div class="d-flex align-center mb-2">
                  <v-radio value="class" />
                  <v-icon class="ml-2 mr-2">mdi-package-variant</v-icon>
                  <span class="font-weight-medium">Class Equipment Package</span>
                </div>
                <div class="text-body-2 text-medium-emphasis">
                  Get a curated set of equipment based on your class and background.
                  Quick and balanced for new players.
                </div>
              </v-card>
            </v-col>

            <v-col cols="12" md="6">
              <v-card :color="equipmentMethod === 'gold' ? 'primary' : 'default'" variant="outlined"
                class="pa-4 cursor-pointer h-100" @click="equipmentMethod = 'gold'">
                <div class="d-flex align-center mb-2">
                  <v-radio value="gold" />
                  <v-icon class="ml-2 mr-2">mdi-gold</v-icon>
                  <span class="font-weight-medium">Buy with Starting Gold</span>
                </div>
                <div class="text-body-2 text-medium-emphasis">
                  Start with gold and purchase exactly what you want.
                  Maximum customization for experienced players.
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-radio-group>

        <!-- Starting Gold Display -->
        <v-alert v-if="equipmentMethod === 'gold'" type="success" variant="tonal" class="mt-4">
          <v-icon>mdi-gold</v-icon>
          <strong>Starting Gold:</strong> {{ startingGold }} gp
          <div class="text-body-2 mt-1">
            Use this to purchase weapons, armor, and adventuring gear below
          </div>
        </v-alert>
      </v-card-text>
    </v-card>

    <v-row>
      <!-- Weapons Section -->
      <v-col cols="12" lg="6">
        <v-card variant="outlined" class="h-100">
          <v-card-title class="d-flex align-center">
            <v-icon color="red" class="mr-2">mdi-sword</v-icon>
            Weapons
            <v-spacer />
            <v-chip color="red" variant="tonal" size="small">
              <v-icon start size="x-small">mdi-package</v-icon>
              {{ allWeapons.length }} Owned
            </v-chip>
          </v-card-title>
          <v-card-subtitle class="text-body-2">
            Physical weapons in your possession
          </v-card-subtitle>

          <v-card-text class="pa-2">
            <template v-if="allWeapons.length">
              <v-list density="comfortable">
                <v-list-item v-for="(weapon, index) in allWeapons" :key="`weapon-${index}`" class="weapon-item">
                  <template #prepend>
                    <v-avatar color="red" size="small">
                      <v-icon color="white" size="small">mdi-sword</v-icon>
                    </v-avatar>
                  </template>

                  <v-list-item-title>{{ weapon.name }}</v-list-item-title>
                  <v-list-item-subtitle>
                    <div class="d-flex align-center ga-2">
                      <v-chip size="x-small" color="orange">{{ weapon.damage }}</v-chip>
                      <span class="text-caption">{{ weapon.properties }}</span>
                    </div>
                  </v-list-item-subtitle>

                  <template #append>
                    <div class="text-right">
                      <div class="text-caption">{{ weapon.weight }} lb</div>
                      <div class="text-caption text-medium-emphasis">{{ weapon.cost }}</div>
                    </div>
                  </template>
                </v-list-item>
              </v-list>

              <!-- Add Weapon Button -->
              <v-btn v-if="equipmentMethod !== 'class'" variant="outlined" color="red" class="mt-2" block
                @click="openWeaponShop">
                <v-icon start>mdi-plus</v-icon>
                Add Weapon
              </v-btn>
            </template>

            <div v-else class="text-center pa-6">
              <v-icon size="large" color="medium-emphasis">mdi-sword-cross</v-icon>
              <div class="text-body-2 text-medium-emphasis mt-2">No weapons equipped</div>
              <v-btn v-if="equipmentMethod !== 'class'" variant="outlined" color="red" class="mt-3"
                @click="openWeaponShop">
                <v-icon start>mdi-plus</v-icon>
                Add Your First Weapon
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Armor Section -->
      <v-col cols="12" lg="6">
        <v-card variant="outlined" class="h-100">
          <v-card-title class="d-flex align-center">
            <v-icon color="blue" class="mr-2">mdi-shield</v-icon>
            Armor & Protection
            <v-spacer />
            <v-chip color="blue" variant="tonal" size="small">
              <v-icon start size="x-small">mdi-package</v-icon>
              {{ allArmor.length }} Pieces
            </v-chip>
          </v-card-title>
          <v-card-subtitle class="text-body-2">
            Protective gear you wear and carry
          </v-card-subtitle>

          <v-card-text class="pa-2">
            <!-- Armor display similar to weapons -->
            <template v-if="allArmor.length">
              <v-list density="comfortable">
                <v-list-item v-for="(armor, index) in allArmor" :key="`armor-${index}`" class="armor-item">
                  <template #prepend>
                    <v-avatar color="blue" size="small">
                      <v-icon color="white" size="small">mdi-shield</v-icon>
                    </v-avatar>
                  </template>

                  <v-list-item-title>{{ armor.name }}</v-list-item-title>
                  <v-list-item-subtitle>
                    <div class="d-flex align-center ga-2">
                      <v-chip size="x-small" color="green">AC {{ armor.ac }}</v-chip>
                      <span class="text-caption">{{ armor.type }}</span>
                    </div>
                  </v-list-item-subtitle>

                  <template #append>
                    <div class="text-right">
                      <div class="text-caption">{{ armor.weight }} lb</div>
                      <div class="text-caption text-medium-emphasis">{{ armor.cost }}</div>
                    </div>
                  </template>
                </v-list-item>
              </v-list>
            </template>

            <div v-else class="text-center pa-6">
              <v-icon size="large" color="medium-emphasis">mdi-shield-off</v-icon>
              <div class="text-body-2 text-medium-emphasis mt-2">No armor equipped</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Adventuring Gear Section -->
    <v-card variant="outlined" class="mt-6">
      <v-card-title class="d-flex align-center">
        <v-icon color="orange" class="mr-2">mdi-bag-personal</v-icon>
        Adventuring Gear
        <v-spacer />
        <v-chip color="orange" variant="tonal" size="small">
          <v-icon start size="x-small">mdi-package</v-icon>
          {{ allGear.length }} Items
        </v-chip>
      </v-card-title>
      <v-card-subtitle class="text-body-2">
        Tools, supplies, and equipment in your inventory
      </v-card-subtitle>

      <v-card-text>
        <!-- Gear organized by category -->
        <v-row>
          <!-- Physical Tools (that you own) -->
          <v-col cols="12" md="6">
            <v-card variant="tonal" color="purple">
              <v-card-title class="text-subtitle-1">
                <v-icon class="mr-2">mdi-tools</v-icon>
                Physical Tools
                <v-spacer />
                <v-chip color="purple" size="small" variant="elevated">Owned Items</v-chip>
              </v-card-title>
              <v-card-text>
                <div class="text-body-2 text-medium-emphasis mb-3">
                  Actual tool sets you carry (separate from proficiency)
                </div>

                <!-- List of owned physical tools -->
                <div v-if="physicalTools.length">
                  <v-chip v-for="tool in physicalTools" :key="tool.name" class="mr-2 mb-2" color="purple"
                    variant="tonal" size="small">
                    <v-icon start size="x-small">mdi-package</v-icon>
                    {{ tool.name }}
                  </v-chip>
                </div>
                <div v-else class="text-center pa-4">
                  <v-icon color="medium-emphasis">mdi-tools</v-icon>
                  <div class="text-body-2 text-medium-emphasis">No tools owned</div>
                </div>

                <v-btn v-if="equipmentMethod !== 'class'" variant="outlined" color="purple" size="small" class="mt-2"
                  block @click="openToolShop">
                  <v-icon start>mdi-plus</v-icon>
                  Buy Tools
                </v-btn>

                <v-alert type="info" variant="tonal" class="mt-3" density="compact">
                  <div class="text-caption">
                    <strong>Note:</strong> Having proficiency ≠ owning the tool.
                    You need both proficiency (from Page 3) and the physical tool to get bonuses.
                  </div>
                </v-alert>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Instruments (that you own) -->
          <v-col cols="12" md="6">
            <v-card variant="tonal" color="indigo">
              <v-card-title class="text-subtitle-1">
                <v-icon class="mr-2">mdi-music</v-icon>
                Musical Instruments
                <v-spacer />
                <v-chip color="indigo" size="small" variant="elevated">Owned Items</v-chip>
              </v-card-title>
              <v-card-text>
                <div class="text-body-2 text-medium-emphasis mb-3">
                  Instruments you physically carry
                </div>

                <!-- Similar structure for owned instruments -->
                <v-alert type="info" variant="tonal" class="mt-3" density="compact">
                  <div class="text-caption">
                    <strong>Note:</strong> Instrument proficiency (Page 3) + owning the instrument = performance
                    bonuses.
                  </div>
                </v-alert>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- General Adventuring Gear -->
        <v-card variant="tonal" color="orange" class="mt-4">
          <v-card-title class="text-subtitle-1">
            <v-icon class="mr-2">mdi-bag-personal</v-icon>
            General Equipment
          </v-card-title>
          <v-card-text>
            <div class="text-body-2 text-medium-emphasis mb-3">
              Supplies, containers, and miscellaneous items
            </div>

            <!-- Grid of general gear items -->
            <v-row v-if="generalGear.length">
              <v-col v-for="item in generalGear" :key="item.name" cols="12" sm="6" md="4">
                <v-card variant="outlined" class="gear-item">
                  <v-card-text class="pa-3">
                    <div class="d-flex justify-space-between align-center">
                      <div>
                        <div class="font-weight-medium">{{ item.name }}</div>
                        <div class="text-caption text-medium-emphasis">{{ item.description }}</div>
                      </div>
                      <div class="text-right">
                        <div class="text-caption">{{ item.weight }} lb</div>
                        <div class="text-caption text-medium-emphasis">{{ item.cost }}</div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>

    <!-- Encumbrance & Weight Summary -->
    <v-card variant="outlined" class="mt-6" color="warning-lighten-4">
      <v-card-title class="d-flex align-center">
        <v-icon color="warning" class="mr-2">mdi-weight</v-icon>
        Carrying Capacity
      </v-card-title>
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" md="8">
            <v-progress-linear :model-value="(totalWeight / carryingCapacity) * 100"
              :color="totalWeight > carryingCapacity ? 'error' : 'success'" height="20" class="mb-2">
              <strong>{{ totalWeight }} / {{ carryingCapacity }} lb</strong>
            </v-progress-linear>
            <div class="text-body-2">
              <strong>Total Weight:</strong> {{ totalWeight }} lb •
              <strong>Capacity:</strong> {{ carryingCapacity }} lb ({{ character.strength }} Str × 15)
            </div>
          </v-col>
          <v-col cols="12" md="4" class="text-center">
            <v-chip :color="totalWeight > carryingCapacity ? 'error' : 'success'" size="large">
              <v-icon start>
                {{ totalWeight > carryingCapacity ? 'mdi-alert' : 'mdi-check' }}
              </v-icon>
              {{ totalWeight > carryingCapacity ? 'Overloaded' : 'Good' }}
            </v-chip>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-card>
</template>

<script setup>
// Component logic would go here
// This mockup shows the structure with clear item vs proficiency separation
</script>

<style scoped>
.weapon-item:hover,
.armor-item:hover,
.gear-item:hover {
  background-color: rgba(var(--v-theme-surface-variant), 0.5);
  transition: background-color 0.2s ease;
}
</style>
