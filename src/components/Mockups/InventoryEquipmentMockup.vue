<template>
  <v-card flat>
    <v-card-title class="text-h4 text-center mb-4">🎒 Inventory & Equipment</v-card-title>
    <v-card-subtitle class="text-center mb-4">
      Physical items your character owns and carries
    </v-card-subtitle>

    <!-- Equipment Method Selection -->
    <v-card class="mb-6" variant="outlined">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2" color="primary">mdi-package-variant</v-icon>
        Equipment Method
      </v-card-title>
      <v-card-subtitle class="text-body-2">
        Choose how to acquire your starting equipment
      </v-card-subtitle>

      <v-card-text>
        <v-radio-group v-model="equipmentMethod">
          <v-row>
            <v-col cols="12" md="6">
              <v-card
                class="pa-4 cursor-pointer h-100"
                :color="equipmentMethod === 'class' ? 'primary' : 'default'"
                variant="outlined"
                @click="equipmentMethod = 'class'"
              >
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
              <v-card
                class="pa-4 cursor-pointer h-100"
                :color="equipmentMethod === 'gold' ? 'primary' : 'default'"
                variant="outlined"
                @click="equipmentMethod = 'gold'"
              >
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
        <v-alert v-if="equipmentMethod === 'gold'" class="mt-4" type="success" variant="tonal">
          <v-icon>mdi-gold</v-icon>
          <strong>Starting Gold:</strong> 175 gp
          <div class="text-body-2 mt-1">
            Use this to purchase weapons, armor, and adventuring gear below
          </div>
        </v-alert>
      </v-card-text>
    </v-card>

    <v-row>
      <!-- Weapons Section -->
      <v-col cols="12" lg="6">
        <v-card class="h-100" variant="outlined">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2" color="red">mdi-sword</v-icon>
            Weapons
            <v-spacer />
            <v-chip color="red" size="small" variant="tonal">
              <v-icon size="x-small" start>mdi-package</v-icon>
              3 Owned
            </v-chip>
          </v-card-title>
          <v-card-subtitle class="text-body-2">
            Physical weapons in your possession
          </v-card-subtitle>

          <v-card-text class="pa-2">
            <v-list density="comfortable">
              <v-list-item class="weapon-item">
                <template #prepend>
                  <v-avatar color="red" size="small">
                    <v-icon color="white" size="small">mdi-sword</v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title>Longsword</v-list-item-title>
                <v-list-item-subtitle>
                  <div class="d-flex align-center ga-2">
                    <v-chip color="orange" size="x-small">1d8</v-chip>
                    <span class="text-caption">Versatile</span>
                  </div>
                </v-list-item-subtitle>

                <template #append>
                  <div class="text-right">
                    <div class="text-caption">3 lb</div>
                    <div class="text-caption text-medium-emphasis">15 gp</div>
                  </div>
                </template>
              </v-list-item>

              <v-list-item class="weapon-item">
                <template #prepend>
                  <v-avatar color="red" size="small">
                    <v-icon color="white" size="small">mdi-bow-arrow</v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title>Light Crossbow</v-list-item-title>
                <v-list-item-subtitle>
                  <div class="d-flex align-center ga-2">
                    <v-chip color="orange" size="x-small">1d8</v-chip>
                    <span class="text-caption">Ammunition, Loading, Two-handed</span>
                  </div>
                </v-list-item-subtitle>

                <template #append>
                  <div class="text-right">
                    <div class="text-caption">5 lb</div>
                    <div class="text-caption text-medium-emphasis">25 gp</div>
                  </div>
                </template>
              </v-list-item>
            </v-list>

            <!-- Add Weapon Button -->
            <v-btn block class="mt-2" color="red" variant="outlined">
              <v-icon start>mdi-plus</v-icon>
              Add Weapon
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Armor Section -->
      <v-col cols="12" lg="6">
        <v-card class="h-100" variant="outlined">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2" color="blue">mdi-shield</v-icon>
            Armor & Protection
            <v-spacer />
            <v-chip color="blue" size="small" variant="tonal">
              <v-icon size="x-small" start>mdi-package</v-icon>
              2 Pieces
            </v-chip>
          </v-card-title>
          <v-card-subtitle class="text-body-2">
            Protective gear you wear and carry
          </v-card-subtitle>

          <v-card-text class="pa-2">
            <v-list density="comfortable">
              <v-list-item class="armor-item">
                <template #prepend>
                  <v-avatar color="blue" size="small">
                    <v-icon color="white" size="small">mdi-shield</v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title>Chain Mail</v-list-item-title>
                <v-list-item-subtitle>
                  <div class="d-flex align-center ga-2">
                    <v-chip color="green" size="x-small">AC 16</v-chip>
                    <span class="text-caption">Heavy Armor</span>
                  </div>
                </v-list-item-subtitle>

                <template #append>
                  <div class="text-right">
                    <div class="text-caption">55 lb</div>
                    <div class="text-caption text-medium-emphasis">75 gp</div>
                  </div>
                </template>
              </v-list-item>

              <v-list-item class="armor-item">
                <template #prepend>
                  <v-avatar color="blue" size="small">
                    <v-icon color="white" size="small">mdi-shield-outline</v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title>Shield</v-list-item-title>
                <v-list-item-subtitle>
                  <div class="d-flex align-center ga-2">
                    <v-chip color="green" size="x-small">+2 AC</v-chip>
                    <span class="text-caption">Shield</span>
                  </div>
                </v-list-item-subtitle>

                <template #append>
                  <div class="text-right">
                    <div class="text-caption">6 lb</div>
                    <div class="text-caption text-medium-emphasis">10 gp</div>
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Adventuring Gear Section -->
    <v-card class="mt-6" variant="outlined">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2" color="orange">mdi-bag-personal</v-icon>
        Adventuring Gear
        <v-spacer />
        <v-chip color="orange" size="small" variant="tonal">
          <v-icon size="x-small" start>mdi-package</v-icon>
          12 Items
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
            <v-card color="purple" variant="tonal">
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
                <v-chip class="mr-2 mb-2" color="purple" size="small" variant="tonal">
                  <v-icon size="x-small" start>mdi-package</v-icon>
                  Smith's Tools
                </v-chip>

                <v-btn
                  block
                  class="mt-2"
                  color="purple"
                  size="small"
                  variant="outlined"
                >
                  <v-icon start>mdi-plus</v-icon>
                  Buy Tools
                </v-btn>

                <v-alert class="mt-3" density="compact" type="info" variant="tonal">
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
            <v-card color="indigo" variant="tonal">
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

                <v-chip class="mr-2 mb-2" color="indigo" size="small" variant="tonal">
                  <v-icon size="x-small" start>mdi-package</v-icon>
                  Lute
                </v-chip>

                <v-alert class="mt-3" density="compact" type="info" variant="tonal">
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
        <v-card class="mt-4" color="orange" variant="tonal">
          <v-card-title class="text-subtitle-1">
            <v-icon class="mr-2">mdi-bag-personal</v-icon>
            General Equipment
          </v-card-title>
          <v-card-text>
            <div class="text-body-2 text-medium-emphasis mb-3">
              Supplies, containers, and miscellaneous items
            </div>

            <!-- Grid of general gear items -->
            <v-row>
              <v-col cols="12" md="4" sm="6">
                <v-card class="gear-item" variant="outlined">
                  <v-card-text class="pa-3">
                    <div class="d-flex justify-space-between align-center">
                      <div>
                        <div class="font-weight-medium">Backpack</div>
                        <div class="text-caption text-medium-emphasis">Holds 30 lb of gear</div>
                      </div>
                      <div class="text-right">
                        <div class="text-caption">5 lb</div>
                        <div class="text-caption text-medium-emphasis">2 gp</div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-card class="gear-item" variant="outlined">
                  <v-card-text class="pa-3">
                    <div class="d-flex justify-space-between align-center">
                      <div>
                        <div class="font-weight-medium">Rope, hempen (50 feet)</div>
                        <div class="text-caption text-medium-emphasis">Standard adventuring rope</div>
                      </div>
                      <div class="text-right">
                        <div class="text-caption">10 lb</div>
                        <div class="text-caption text-medium-emphasis">2 gp</div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-card class="gear-item" variant="outlined">
                  <v-card-text class="pa-3">
                    <div class="d-flex justify-space-between align-center">
                      <div>
                        <div class="font-weight-medium">Torch (10)</div>
                        <div class="text-caption text-medium-emphasis">Provides bright light</div>
                      </div>
                      <div class="text-right">
                        <div class="text-caption">10 lb</div>
                        <div class="text-caption text-medium-emphasis">1 sp</div>
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
    <v-card class="mt-6" color="warning-lighten-4" variant="outlined">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2" color="warning">mdi-weight</v-icon>
        Carrying Capacity
      </v-card-title>
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" md="8">
            <v-progress-linear class="mb-2" color="success" height="20" :model-value="(120 / 225) * 100">
              <strong>120 / 225 lb</strong>
            </v-progress-linear>
            <div class="text-body-2">
              <strong>Total Weight:</strong> 120 lb •
              <strong>Capacity:</strong> 225 lb (15 Str × 15)
            </div>
          </v-col>
          <v-col class="text-center" cols="12" md="4">
            <v-chip color="success" size="large">
              <v-icon start>mdi-check</v-icon>
              Good
            </v-chip>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-card>
</template>

<script setup>
  import { ref } from 'vue'

  // Mock data for the demo
  const equipmentMethod = ref('class')
</script>

<style scoped>
.weapon-item:hover,
.armor-item:hover,
.gear-item:hover {
  background-color: rgba(var(--v-theme-surface-variant), 0.5);
  transition: background-color 0.2s ease;
}
</style>
