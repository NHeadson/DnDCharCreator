<template>
  <v-card flat>
    <v-card-title class="text-h4 text-center mb-4">⚔️ Equipment & Gear</v-card-title>
    <v-card-subtitle class="text-center mb-6">
      Equip your character for adventure and combat readiness
    </v-card-subtitle>
    <v-card-text>

      <!-- Starting Gold and Equipment Method -->
      <v-card class="mb-6" variant="outlined">
        <v-card-title class="text-h6">💰 Equipment Method</v-card-title>
        <v-card-subtitle class="text-body-2 mb-4">
          Choose how to obtain your starting equipment. Each method has different advantages.
        </v-card-subtitle>
        <v-card-text>
          <v-row>
            <!-- Class Equipment Option -->
            <v-col cols="12" md="6">
              <v-card :color="equipmentMethod === 'class' ? 'primary' : 'surface-variant'"
                :variant="equipmentMethod === 'class' ? 'tonal' : 'outlined'"
                class="equipment-method-card pa-4 cursor-pointer h-100" @click="equipmentMethod = 'class'">
                <div class="d-flex align-center mb-2">
                  <v-radio v-model="equipmentMethod" value="class" color="primary" hide-details @click.stop />
                  <v-icon class="ml-2 mr-2"
                    :color="equipmentMethod === 'class' ? 'primary' : 'default'">mdi-package-variant</v-icon>
                  <span class="text-h6" :class="equipmentMethod === 'class' ? 'text-primary' : ''">
                    Class Equipment
                  </span>
                  <v-chip color="success" size="x-small" class="ml-2">Recommended</v-chip>
                </div>

                <div class="text-body-2 mb-3">
                  Get a curated selection of equipment perfect for your class.
                  This includes weapons, armor, tools, and gear that complement your class abilities.
                </div>

                <!-- Preview of class equipment -->
                <div v-if="hasClassEquipment" class="class-equipment-preview">
                  <v-divider class="mb-2" />
                  <div class="text-caption text-medium-emphasis mb-1">Preview for {{ character.classDetails?.name ||
                    character.class || 'your class' }}:</div>

                  <div class="equipment-preview-grid">
                    <div v-if="classStartingEquipment.weapons.length" class="mb-1">
                      <v-icon size="x-small" color="red">mdi-sword</v-icon>
                      <span class="text-caption ml-1">{{ classStartingEquipment.weapons.length }} weapon{{
                        classStartingEquipment.weapons.length > 1 ? 's' : '' }}</span>
                    </div>

                    <div v-if="classStartingEquipment.armor.length" class="mb-1">
                      <v-icon size="x-small" color="blue">mdi-shield</v-icon>
                      <span class="text-caption ml-1">{{ classStartingEquipment.armor.length }} armor piece{{
                        classStartingEquipment.armor.length > 1 ? 's' : '' }}</span>
                    </div>

                    <div v-if="classStartingEquipment.tools.length" class="mb-1">
                      <v-icon size="x-small" color="green">mdi-wrench</v-icon>
                      <span class="text-caption ml-1">{{ classStartingEquipment.tools.length }} tool{{
                        classStartingEquipment.tools.length > 1 ? 's' : '' }}</span>
                    </div>

                    <div v-if="classStartingEquipment.gear.length" class="mb-1">
                      <v-icon size="x-small" color="orange">mdi-bag-personal</v-icon>
                      <span class="text-caption ml-1">{{ classStartingEquipment.gear.length }} gear item{{
                        classStartingEquipment.gear.length > 1 ? 's' : '' }}</span>
                    </div>
                  </div>

                  <v-btn size="x-small" variant="text" color="primary" class="mt-2 pa-0"
                    @click.stop="showClassEquipmentPreview = !showClassEquipmentPreview">
                    {{ showClassEquipmentPreview ? 'Hide' : 'Show' }} Details
                    <v-icon size="small">{{ showClassEquipmentPreview ? 'mdi-chevron-up' : 'mdi-chevron-down'
                    }}</v-icon>
                  </v-btn>

                  <v-expand-transition>
                    <div v-if="showClassEquipmentPreview" class="mt-2">
                      <div v-if="classStartingEquipment.weapons.length" class="mb-2">
                        <div class="text-caption font-weight-medium text-red">⚔️ Weapons:</div>
                        <div v-for="weapon in classStartingEquipment.weapons" :key="weapon" class="text-caption ml-3">
                          • {{ weapon }}
                        </div>
                      </div>

                      <div v-if="classStartingEquipment.armor.length" class="mb-2">
                        <div class="text-caption font-weight-medium text-blue">🛡️ Armor:</div>
                        <div v-for="armor in classStartingEquipment.armor" :key="armor" class="text-caption ml-3">
                          • {{ armor }}
                        </div>
                      </div>

                      <div v-if="classStartingEquipment.tools.length" class="mb-2">
                        <div class="text-caption font-weight-medium text-green">🔧 Tools:</div>
                        <div v-for="tool in classStartingEquipment.tools" :key="tool" class="text-caption ml-3">
                          • {{ tool }}
                        </div>
                      </div>

                      <div v-if="classStartingEquipment.gear.length" class="mb-2">
                        <div class="text-caption font-weight-medium text-orange">🎒 Gear:</div>
                        <div v-for="item in classStartingEquipment.gear" :key="item" class="text-caption ml-3">
                          • {{ item }}
                        </div>
                      </div>
                    </div>
                  </v-expand-transition>
                </div>

                <div v-else class="class-equipment-preview">
                  <v-divider class="mb-2" />
                  <div class="text-caption text-medium-emphasis">
                    Select a class to see equipment preview
                  </div>
                </div>

                <!-- Spacer to push badge to bottom -->
                <v-spacer />

                <div class="mt-auto pt-3">
                  <v-chip color="success" size="small" variant="outlined">
                    <v-icon start size="small">mdi-check</v-icon>
                    Balanced & Ready
                  </v-chip>
                </div>
              </v-card>
            </v-col>

            <!-- Gold Purchase Option -->
            <v-col cols="12" md="6">
              <v-card :color="equipmentMethod === 'gold' ? 'primary' : 'surface-variant'"
                :variant="equipmentMethod === 'gold' ? 'tonal' : 'outlined'"
                class="equipment-method-card pa-4 cursor-pointer h-100" @click="equipmentMethod = 'gold'">
                <div class="d-flex align-center mb-2">
                  <v-radio v-model="equipmentMethod" value="gold" color="primary" hide-details @click.stop />
                  <v-icon class="ml-2 mr-2"
                    :color="equipmentMethod === 'gold' ? 'primary' : 'default'">mdi-cash</v-icon>
                  <span class="text-h6" :class="equipmentMethod === 'gold' ? 'text-primary' : ''">
                    Starting Gold
                  </span>
                  <v-chip color="info" size="x-small" class="ml-2">Customizable</v-chip>
                </div>

                <div class="text-body-2 mb-3">
                  Receive starting gold based on your class and purchase equipment yourself.
                  This gives you complete control over your equipment choices.
                </div>

                <!-- Gold amount preview -->
                <div class="gold-preview">
                  <v-divider class="mb-2" />
                  <div class="text-caption text-medium-emphasis mb-1">Starting gold for {{ character.classDetails?.name
                    || character.class || 'your class' }}:</div>

                  <div class="d-flex align-center mb-2">
                    <v-icon color="yellow-darken-2" class="mr-2">mdi-cash</v-icon>
                    <span class="text-h6 text-yellow-darken-2">{{ calculateStartingGold }} GP</span>
                    <span class="text-caption ml-2 text-medium-emphasis">({{ getClassGoldRange }})</span>
                  </div>

                  <div class="text-caption text-medium-emphasis mb-2">
                    This amount is based on rolling {{ getClassGoldRange }} and taking the average value.
                  </div>

                  <v-btn size="x-small" variant="text" color="primary" class="mt-1 pa-0"
                    @click.stop="showGoldAdvantages = !showGoldAdvantages">
                    {{ showGoldAdvantages ? 'Hide' : 'Show' }} Advantages
                    <v-icon size="small">{{ showGoldAdvantages ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                  </v-btn>

                  <v-expand-transition>
                    <div v-if="showGoldAdvantages" class="mt-2">
                      <div class="text-caption">
                        <div class="mb-1">
                          <v-icon size="x-small" color="success" class="mr-1">mdi-check</v-icon>
                          Choose exactly what you want
                        </div>
                        <div class="mb-1">
                          <v-icon size="x-small" color="success" class="mr-1">mdi-check</v-icon>
                          Optimize for your playstyle
                        </div>
                        <div class="mb-1">
                          <v-icon size="x-small" color="success" class="mr-1">mdi-check</v-icon>
                          Potentially get more value
                        </div>
                        <div class="mb-1">
                          <v-icon size="x-small" color="warning" class="mr-1">mdi-alert</v-icon>
                          Requires equipment knowledge
                        </div>
                      </div>
                    </div>
                  </v-expand-transition>
                </div>

                <!-- Spacer to push badge to bottom -->
                <v-spacer />

                <div class="mt-auto pt-3">
                  <v-chip color="info" size="small" variant="outlined">
                    <v-icon start size="small">mdi-cog</v-icon>
                    Full Control
                  </v-chip>
                </div>
              </v-card>
            </v-col>
          </v-row>

          <!-- Additional info alert -->
          <v-alert v-if="equipmentMethod === 'gold'" type="info" variant="tonal" class="mt-4">
            <v-alert-title>💡 Equipment Shopping Tips</v-alert-title>
            <div class="text-body-2">
              With {{ calculateStartingGold }} GP, you can afford:
              <ul class="mt-2 ml-4">
                <li><strong>Weapon:</strong> Simple weapons (2-5 GP) or some martial weapons (10-25 GP)</li>
                <li><strong>Armor:</strong> Leather armor (10 GP), studded leather (45 GP), or chain mail (75 GP)</li>
                <li><strong>Shield:</strong> 10 GP for +2 AC bonus</li>
                <li><strong>Adventuring gear:</strong> Backpack (2 GP), rope (2 GP), torches (1 CP each)</li>
              </ul>
            </div>
          </v-alert>

          <v-alert v-if="equipmentMethod === 'class'" type="success" variant="tonal" class="mt-4">
            <v-alert-title>✨ Why Class Equipment is Recommended</v-alert-title>
            <div class="text-body-2">
              Class equipment packages are carefully designed to provide everything you need to start adventuring
              effectively.
              They typically include a good balance of weapons, armor, tools, and adventuring gear worth more than the
              starting gold alternative.
            </div>
          </v-alert>
        </v-card-text>
      </v-card> <!-- Class Starting Equipment -->
      <v-card v-if="equipmentMethod === 'class' && hasClassEquipment" class="mb-6" variant="outlined">
        <v-card-title class="text-h6">📦 Class Starting Equipment</v-card-title>
        <v-card-subtitle>Equipment provided by your {{ character.classDetails?.name || character.class }}
          class</v-card-subtitle>
        <v-card-text>
          <v-row>
            <v-col v-if="classStartingEquipment.weapons.length" cols="12" md="6">
              <h4>⚔️ Weapons</h4>
              <v-chip-group>
                <v-chip v-for="weapon in classStartingEquipment.weapons" :key="weapon" color="red" size="small">{{
                  weapon }}</v-chip>
              </v-chip-group>
            </v-col>

            <v-col v-if="classStartingEquipment.armor.length" cols="12" md="6">
              <h4>🛡️ Armor & Shields</h4>
              <v-chip-group>
                <v-chip v-for="armor in classStartingEquipment.armor" :key="armor" color="blue" size="small">{{ armor
                }}</v-chip>
              </v-chip-group>
            </v-col>

            <v-col v-if="classStartingEquipment.tools.length" cols="12" md="6">
              <h4>🔧 Tools & Equipment</h4>
              <v-chip-group>
                <v-chip v-for="tool in classStartingEquipment.tools" :key="tool" color="green" size="small">{{ tool
                }}</v-chip>
              </v-chip-group>
            </v-col>

            <v-col v-if="classStartingEquipment.gear.length" cols="12" md="6">
              <h4>🎒 Adventuring Gear</h4>
              <v-chip-group>
                <v-chip v-for="item in classStartingEquipment.gear" :key="item" color="orange" size="small">{{ item
                }}</v-chip>
              </v-chip-group>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Background Equipment -->
      <v-card v-if="hasBackgroundEquipment" class="mb-6" variant="outlined">
        <v-card-title class="text-h6">📜 Background Equipment</v-card-title>
        <v-card-subtitle>Additional gear from your {{ character.backgroundDetails?.name || character.background }}
          background</v-card-subtitle>
        <v-card-text>
          <v-row>
            <v-col v-if="backgroundStartingEquipment.tools.length" cols="12" md="6">
              <h4>🔧 Tools</h4>
              <v-chip-group>
                <v-chip v-for="tool in backgroundStartingEquipment.tools" :key="tool" color="purple" size="small">{{
                  tool }}</v-chip>
              </v-chip-group>
            </v-col>

            <v-col v-if="backgroundStartingEquipment.gear.length" cols="12" md="6">
              <h4>🎒 Equipment</h4>
              <v-chip-group>
                <v-chip v-for="item in backgroundStartingEquipment.gear" :key="item" color="teal" size="small">{{ item
                }}</v-chip>
              </v-chip-group>
            </v-col>

            <v-col v-if="backgroundStartingEquipment.money" cols="12">
              <h4>💰 Starting Money</h4>
              <v-chip color="yellow-darken-2" size="small">{{ backgroundStartingEquipment.money }}</v-chip>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Custom Equipment Management -->
      <v-row>
        <!-- Weapons -->
        <v-col cols="12" lg="6">
          <v-card variant="outlined" class="mb-4">
            <v-card-title class="equipment-category-header">
              <div class="d-flex align-center justify-space-between w-100">
                <div class="d-flex align-center">
                  <v-icon class="me-2">mdi-sword</v-icon>
                  Weapons
                </div>
                <v-btn color="primary" density="comfortable" icon size="small" variant="text"
                  @click="addWeaponDialog = true">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-0">
              <v-list v-if="allWeapons.length" density="comfortable">
                <v-list-item v-for="(weapon, index) in allWeapons" :key="`weapon-${index}`">
                  <v-list-item-title>{{ weapon.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ weapon.damage || 'Varies' }} • {{ weapon.properties || weapon.type ||
                    'Weapon' }}</v-list-item-subtitle>
                  <template #append>
                    <v-btn v-if="weapon.custom" color="error" icon size="x-small" variant="text"
                      @click="removeCustomWeapon(index)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-list-item>
              </v-list>
              <div v-else class="pa-4 text-center text-medium-emphasis">
                No weapons equipped
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Armor -->
        <v-col cols="12" lg="6">
          <v-card variant="outlined" class="mb-4">
            <v-card-title class="equipment-category-header">
              <div class="d-flex align-center justify-space-between w-100">
                <div class="d-flex align-center">
                  <v-icon class="me-2">mdi-shield</v-icon>
                  Armor & Shields
                </div>
                <v-btn color="primary" density="comfortable" icon size="small" variant="text"
                  @click="addArmorDialog = true">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-0">
              <v-list v-if="allArmor.length" density="comfortable">
                <v-list-item v-for="(armor, index) in allArmor" :key="`armor-${index}`">
                  <v-list-item-title>{{ armor.name }}</v-list-item-title>
                  <v-list-item-subtitle>AC {{ armor.ac || 'Varies' }} • {{ armor.type || 'Armor'
                  }}</v-list-item-subtitle>
                  <template #append>
                    <v-btn v-if="armor.custom" color="error" icon size="x-small" variant="text"
                      @click="removeCustomArmor(index)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-list-item>
              </v-list>
              <div v-else class="pa-4 text-center text-medium-emphasis">
                No armor equipped
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Tools -->
        <v-col cols="12" lg="6">
          <v-card variant="outlined" class="mb-4">
            <v-card-title class="equipment-category-header">
              <div class="d-flex align-center justify-space-between w-100">
                <div class="d-flex align-center">
                  <v-icon class="me-2">mdi-wrench</v-icon>
                  Tools & Kits
                </div>
                <v-btn color="primary" density="comfortable" icon size="small" variant="text"
                  @click="addToolDialog = true">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-0">
              <v-list v-if="allTools.length" density="comfortable">
                <v-list-item v-for="(tool, index) in allTools" :key="`tool-${index}`">
                  <v-list-item-title>{{ tool.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ tool.type || 'Tool' }}</v-list-item-subtitle>
                  <template #append>
                    <v-btn v-if="tool.custom" color="error" icon size="x-small" variant="text"
                      @click="removeCustomTool(index)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-list-item>
              </v-list>
              <div v-else class="pa-4 text-center text-medium-emphasis">
                No tools equipped
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Adventuring Gear -->
        <v-col cols="12" lg="6">
          <v-card variant="outlined" class="mb-4">
            <v-card-title class="equipment-category-header">
              <div class="d-flex align-center justify-space-between w-100">
                <div class="d-flex align-center">
                  <v-icon class="me-2">mdi-bag-personal</v-icon>
                  Adventuring Gear
                </div>
                <v-btn color="primary" density="comfortable" icon size="small" variant="text"
                  @click="addGearDialog = true">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-0">
              <v-list v-if="allGear.length" density="comfortable">
                <v-list-item v-for="(item, index) in allGear" :key="`gear-${index}`">
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ item.description || item.type || 'Equipment' }}</v-list-item-subtitle>
                  <template #append>
                    <v-btn v-if="item.custom" color="error" icon size="x-small" variant="text"
                      @click="removeCustomGear(index)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-list-item>
              </v-list>
              <div v-else class="pa-4 text-center text-medium-emphasis">
                No gear equipped
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Equipment Summary -->
      <v-card class="mt-6" variant="outlined">
        <v-card-title class="text-h6">📋 Equipment Summary</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="3">
              <div class="text-center">
                <div class="text-h4 text-red">{{ totalWeapons }}</div>
                <div class="text-caption">Weapons</div>
              </div>
            </v-col>
            <v-col cols="12" md="3">
              <div class="text-center">
                <div class="text-h4 text-blue">{{ totalArmor }}</div>
                <div class="text-caption">Armor Pieces</div>
              </div>
            </v-col>
            <v-col cols="12" md="3">
              <div class="text-center">
                <div class="text-h4 text-green">{{ totalTools }}</div>
                <div class="text-caption">Tools</div>
              </div>
            </v-col>
            <v-col cols="12" md="3">
              <div class="text-center">
                <div class="text-h4 text-orange">{{ totalGear }}</div>
                <div class="text-caption">Other Gear</div>
              </div>
            </v-col>
          </v-row>

          <v-divider class="my-4" />

          <div class="text-center">
            <v-chip color="yellow-darken-2" size="large">
              <v-icon start>mdi-cash</v-icon>
              {{ remainingGold }} GP Remaining
            </v-chip>
          </div>
        </v-card-text>
      </v-card>

    </v-card-text>
  </v-card>

  <!-- Add Equipment Dialogs -->
  <v-dialog v-model="addWeaponDialog" max-width="500">
    <v-card>
      <v-card-title>Add Weapon</v-card-title>
      <v-card-text>
        <v-text-field v-model="newWeapon.name" label="Weapon Name" />
        <v-text-field v-model="newWeapon.damage" label="Damage (e.g., 1d8)" />
        <v-text-field v-model="newWeapon.properties" label="Properties" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="addWeaponDialog = false">Cancel</v-btn>
        <v-btn color="primary" @click="addCustomWeapon">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="addArmorDialog" max-width="500">
    <v-card>
      <v-card-title>Add Armor</v-card-title>
      <v-card-text>
        <v-text-field v-model="newArmor.name" label="Armor Name" />
        <v-text-field v-model="newArmor.ac" label="Armor Class" type="number" />
        <v-text-field v-model="newArmor.type" label="Type (Light, Medium, Heavy)" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="addArmorDialog = false">Cancel</v-btn>
        <v-btn color="primary" @click="addCustomArmor">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="addToolDialog" max-width="500">
    <v-card>
      <v-card-title>Add Tool</v-card-title>
      <v-card-text>
        <v-text-field v-model="newTool.name" label="Tool Name" />
        <v-text-field v-model="newTool.type" label="Type" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="addToolDialog = false">Cancel</v-btn>
        <v-btn color="primary" @click="addCustomTool">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="addGearDialog" max-width="500">
    <v-card>
      <v-card-title>Add Gear</v-card-title>
      <v-card-text>
        <v-text-field v-model="newGear.name" label="Item Name" />
        <v-text-field v-model="newGear.description" label="Description" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="addGearDialog = false">Cancel</v-btn>
        <v-btn color="primary" @click="addCustomGear">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch, toRefs } from 'vue'

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

// Destructure for template access while maintaining reactivity
const { character, characterData } = toRefs(props)

// Equipment method selection
const equipmentMethod = ref('class')

// Custom equipment arrays
const customWeapons = ref([])
const customArmor = ref([])
const customTools = ref([])
const customGear = ref([])

// Dialog states
const addWeaponDialog = ref(false)
const addArmorDialog = ref(false)
const addToolDialog = ref(false)
const addGearDialog = ref(false)

// Equipment method preview states
const showClassEquipmentPreview = ref(false)
const showGoldAdvantages = ref(false)

// New item forms
const newWeapon = ref({ name: '', damage: '', properties: '' })
const newArmor = ref({ name: '', ac: '', type: '' })
const newTool = ref({ name: '', type: '' })
const newGear = ref({ name: '', description: '' })

// Starting gold calculation
const calculateStartingGold = computed(() => {
  if (equipmentMethod.value !== 'gold') return 0

  const className = character.value.class || character.value.classDetails?.index
  const goldRanges = {
    'barbarian': 50, // 2d4 × 10
    'bard': 125, // 5d4 × 10
    'cleric': 125, // 5d4 × 10
    'druid': 50, // 2d4 × 10
    'fighter': 125, // 5d4 × 10
    'monk': 25, // 5d4
    'paladin': 125, // 5d4 × 10
    'ranger': 125, // 5d4 × 10
    'rogue': 100, // 4d4 × 10
    'sorcerer': 75, // 3d4 × 10
    'warlock': 100, // 4d4 × 10
    'wizard': 100, // 4d4 × 10
  }

  return goldRanges[className] || 100
})

const getClassGoldRange = computed(() => {
  const className = character.value.class || character.value.classDetails?.index
  const goldDescriptions = {
    'barbarian': '2d4 × 10 gp',
    'bard': '5d4 × 10 gp',
    'cleric': '5d4 × 10 gp',
    'druid': '2d4 × 10 gp',
    'fighter': '5d4 × 10 gp',
    'monk': '5d4 gp',
    'paladin': '5d4 × 10 gp',
    'ranger': '5d4 × 10 gp',
    'rogue': '4d4 × 10 gp',
    'sorcerer': '3d4 × 10 gp',
    'warlock': '4d4 × 10 gp',
    'wizard': '4d4 × 10 gp',
  }

  return goldDescriptions[className] || '4d4 × 10 gp'
})

// Class starting equipment
const classStartingEquipment = computed(() => {
  const className = character.value.class || character.value.classDetails?.index

  const equipmentData = {
    'fighter': {
      weapons: ['Longsword or any martial melee weapon', 'Shield or second weapon', 'Light crossbow and 20 bolts'],
      armor: ['Chain mail or leather armor', 'Shield (if chosen)'],
      tools: [],
      gear: ['Dungeoneer\'s pack or Explorer\'s pack']
    },
    'rogue': {
      weapons: ['Rapier or shortsword', 'Shortbow and quiver of 20 arrows', 'Dagger (2)'],
      armor: ['Leather armor'],
      tools: ['Thieves\' tools'],
      gear: ['Burglar\'s pack', 'Two daggers']
    },
    'wizard': {
      weapons: ['Quarterstaff or dagger', 'Light crossbow and 20 bolts or any simple weapon'],
      armor: [],
      tools: [],
      gear: ['Spellbook', 'Scholar\'s pack', 'Component pouch or arcane focus']
    },
    'cleric': {
      weapons: ['Mace or warhammer', 'Scale mail or leather armor', 'Light crossbow and 20 bolts or any simple weapon'],
      armor: ['Scale mail or leather armor', 'Shield'],
      tools: [],
      gear: ['Priest\'s pack', 'Shield', 'Holy symbol']
    },
    'ranger': {
      weapons: ['Scale mail or leather armor', 'Two shortswords or two simple melee weapons', 'Longbow and quiver of 20 arrows'],
      armor: ['Scale mail or leather armor'],
      tools: [],
      gear: ['Dungeoneer\'s pack or Explorer\'s pack']
    },
    'barbarian': {
      weapons: ['Greataxe or any martial melee weapon', 'Two handaxes or any simple weapon', 'Javelin (4)'],
      armor: [],
      tools: [],
      gear: ['Explorer\'s pack']
    },
    'bard': {
      weapons: ['Rapier or longsword or any simple weapon', 'Dagger'],
      armor: ['Leather armor'],
      tools: ['Three musical instruments of your choice'],
      gear: ['Entertainer\'s pack', 'Lute or any other musical instrument']
    },
    'druid': {
      weapons: ['Scimitar or any simple melee weapon', 'Shield', 'Leather armor'],
      armor: ['Leather armor', 'Shield'],
      tools: ['Herbalism kit'],
      gear: ['Explorer\'s pack', 'Druidcraft focus']
    },
    'monk': {
      weapons: ['Shortsword or any simple weapon', 'Dart (10)'],
      armor: [],
      tools: ['One type of artisan\'s tools or one musical instrument'],
      gear: ['Dungeoneer\'s pack or Explorer\'s pack']
    },
    'paladin': {
      weapons: ['Martial weapon and shield or two martial weapons', 'Five javelins or any simple melee weapon'],
      armor: ['Chain mail', 'Shield (if chosen)'],
      tools: [],
      gear: ['Priest\'s pack or Explorer\'s pack', 'Holy symbol']
    },
    'sorcerer': {
      weapons: ['Light crossbow and 20 bolts or any simple weapon', 'Dagger (2)'],
      armor: [],
      tools: [],
      gear: ['Dungeoneer\'s pack or Explorer\'s pack', 'Sorcerous focus']
    },
    'warlock': {
      weapons: ['Light crossbow and 20 bolts or any simple weapon', 'Simple weapon'],
      armor: ['Leather armor'],
      tools: [],
      gear: ['Scholar\'s pack or Dungeoneer\'s pack', 'Simple weapon', 'Arcane focus']
    }
  }

  return equipmentData[className] || { weapons: [], armor: [], tools: [], gear: [] }
})

const backgroundStartingEquipment = computed(() => {
  const backgroundName = character.value.background || character.value.backgroundDetails?.index

  const backgroundEquipment = {
    'acolyte': {
      tools: ['Holy symbol'],
      gear: ['Prayer book or prayer wheel', 'Incense (5 sticks)', 'Vestments', 'Common clothes'],
      money: '15 gp'
    },
    'criminal': {
      tools: ['Thieves\' tools', 'Gaming set'],
      gear: ['Crowbar', 'Dark common clothes with hood', 'Belt pouch'],
      money: '15 gp'
    },
    'folk-hero': {
      tools: ['Artisan\'s tools', 'Vehicles (land)'],
      gear: ['Smith\'s tools', 'Shovel', 'Iron pot', 'Common clothes'],
      money: '10 gp'
    },
    'noble': {
      tools: ['Gaming set'],
      gear: ['Signet ring', 'Scroll of pedigree', 'Fine clothes', 'Purse'],
      money: '25 gp'
    },
    'sage': {
      tools: [],
      gear: ['Ink and quill', 'Small knife', 'Letter from dead colleague', 'Common clothes'],
      money: '10 gp'
    },
    'soldier': {
      tools: ['Gaming set', 'Vehicles (land)'],
      gear: ['Insignia of rank', 'Trophy from fallen enemy', 'Common clothes'],
      money: '10 gp'
    }
  }

  return backgroundEquipment[backgroundName] || { tools: [], gear: [], money: '10 gp' }
})

// Check if equipment data exists
const hasClassEquipment = computed(() => {
  const equipment = classStartingEquipment.value
  return equipment.weapons.length > 0 || equipment.armor.length > 0 || equipment.tools.length > 0 || equipment.gear.length > 0
})

const hasBackgroundEquipment = computed(() => {
  const equipment = backgroundStartingEquipment.value
  return equipment.tools.length > 0 || equipment.gear.length > 0 || equipment.money
})

// Combined equipment arrays
const allWeapons = computed(() => {
  const classWeapons = equipmentMethod.value === 'class' ? classStartingEquipment.value.weapons.map(w => ({ name: w, type: 'Class Equipment' })) : []
  const customWeaponsList = customWeapons.value.map(w => ({ ...w, custom: true }))
  return [...classWeapons, ...customWeaponsList]
})

const allArmor = computed(() => {
  const classArmor = equipmentMethod.value === 'class' ? classStartingEquipment.value.armor.map(a => ({ name: a, type: 'Class Equipment' })) : []
  const customArmorList = customArmor.value.map(a => ({ ...a, custom: true }))
  return [...classArmor, ...customArmorList]
})

const allTools = computed(() => {
  const classTools = equipmentMethod.value === 'class' ? classStartingEquipment.value.tools.map(t => ({ name: t, type: 'Class Equipment' })) : []
  const backgroundTools = hasBackgroundEquipment.value ? backgroundStartingEquipment.value.tools.map(t => ({ name: t, type: 'Background Equipment' })) : []
  const customToolsList = customTools.value.map(t => ({ ...t, custom: true }))
  return [...classTools, ...backgroundTools, ...customToolsList]
})

const allGear = computed(() => {
  const classGear = equipmentMethod.value === 'class' ? classStartingEquipment.value.gear.map(g => ({ name: g, type: 'Class Equipment' })) : []
  const backgroundGear = hasBackgroundEquipment.value ? backgroundStartingEquipment.value.gear.map(g => ({ name: g, type: 'Background Equipment' })) : []
  const customGearList = customGear.value.map(g => ({ ...g, custom: true }))
  return [...classGear, ...backgroundGear, ...customGearList]
})

// Equipment totals
const totalWeapons = computed(() => allWeapons.value.length)
const totalArmor = computed(() => allArmor.value.length)
const totalTools = computed(() => allTools.value.length)
const totalGear = computed(() => allGear.value.length)
const remainingGold = computed(() => calculateStartingGold.value)

// Add custom equipment functions
function addCustomWeapon() {
  if (newWeapon.value.name) {
    customWeapons.value.push({ ...newWeapon.value })
    newWeapon.value = { name: '', damage: '', properties: '' }
    addWeaponDialog.value = false
  }
}

function addCustomArmor() {
  if (newArmor.value.name) {
    customArmor.value.push({ ...newArmor.value })
    newArmor.value = { name: '', ac: '', type: '' }
    addArmorDialog.value = false
  }
}

function addCustomTool() {
  if (newTool.value.name) {
    customTools.value.push({ ...newTool.value })
    newTool.value = { name: '', type: '' }
    addToolDialog.value = false
  }
}

function addCustomGear() {
  if (newGear.value.name) {
    customGear.value.push({ ...newGear.value })
    newGear.value = { name: '', description: '' }
    addGearDialog.value = false
  }
}

// Remove custom equipment functions
function removeCustomWeapon(index) {
  const customIndex = index - (equipmentMethod.value === 'class' ? classStartingEquipment.value.weapons.length : 0)
  if (customIndex >= 0) {
    customWeapons.value.splice(customIndex, 1)
  }
}

function removeCustomArmor(index) {
  const customIndex = index - (equipmentMethod.value === 'class' ? classStartingEquipment.value.armor.length : 0)
  if (customIndex >= 0) {
    customArmor.value.splice(customIndex, 1)
  }
}

function removeCustomTool(index) {
  const classToolsLength = equipmentMethod.value === 'class' ? classStartingEquipment.value.tools.length : 0
  const backgroundToolsLength = hasBackgroundEquipment.value ? backgroundStartingEquipment.value.tools.length : 0
  const customIndex = index - classToolsLength - backgroundToolsLength
  if (customIndex >= 0) {
    customTools.value.splice(customIndex, 1)
  }
}

function removeCustomGear(index) {
  const classGearLength = equipmentMethod.value === 'class' ? classStartingEquipment.value.gear.length : 0
  const backgroundGearLength = hasBackgroundEquipment.value ? backgroundStartingEquipment.value.gear.length : 0
  const customIndex = index - classGearLength - backgroundGearLength
  if (customIndex >= 0) {
    customGear.value.splice(customIndex, 1)
  }
}

// Save equipment to character object
watch([allWeapons, allArmor, allTools, allGear], ([weapons, armor, tools, gear]) => {
  character.value.equipment = {
    weapons: weapons,
    armor: armor,
    tools: tools,
    gear: gear,
    method: equipmentMethod.value,
    startingGold: calculateStartingGold.value
  }
})

// Watch equipment method changes
watch(equipmentMethod, (newMethod) => {
  character.value.equipmentMethod = newMethod
})
</script>

<style scoped>
.equipment-category-header {
  padding: 12px 16px;
  background-color: rgba(var(--v-theme-surface), 0.8);
}

.equipment-category-header-compact {
  padding: 8px 16px;
}

.equipment-card {
  transition: all 0.3s ease;
}

.equipment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.equipment-method-card {
  transition: all 0.3s ease;
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.equipment-method-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.equipment-preview-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
}

.cursor-pointer {
  cursor: pointer;
}

.weapons-card .v-card-title {
  background-color: rgba(var(--v-theme-error), 0.1);
}

.armor-card .v-card-title {
  background-color: rgba(var(--v-theme-primary), 0.1);
}

.tools-card .v-card-title {
  background-color: rgba(var(--v-theme-success), 0.1);
}

.gear-card .v-card-title {
  background-color: rgba(var(--v-theme-warning), 0.1);
}
</style>
