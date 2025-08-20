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
          Choose how to obtain your starting equipment. Recommended Equipment provides a complete loadout based on your
          character choices.
        </v-card-subtitle>
        <v-card-text>
          <v-radio-group v-model="equipmentMethod" hide-details>
            <v-row>
              <!-- Class Equipment Option -->
              <v-col cols="12" md="6">
                <v-card :color="equipmentMethod === 'class' ? 'primary' : 'white'"
                  :variant="equipmentMethod === 'class' ? 'outlined' : 'outlined'"
                  class="equipment-method-card pa-4 cursor-pointer h-100" @click="equipmentMethod = 'class'">
                  <div class="d-flex align-center mb-2">
                    <v-radio value="class" color="primary" hide-details />
                    <v-icon class="ml-2 mr-2"
                      :color="equipmentMethod === 'class' ? 'primary' : 'default'">mdi-package-variant</v-icon>
                    <span class="text-h6" :class="equipmentMethod === 'class' ? 'text-primary' : ''">
                      Recommended Equipment
                    </span>
                    <v-tooltip text="This method provides equipment tailored for your class and is easy for new players"
                      location="top">
                      <template v-slot:activator="{ props }">
                        <v-chip v-bind="props" color="success" size="x-small" class="ml-2">Recommended</v-chip>
                      </template>
                    </v-tooltip>
                  </div>

                  <div class="text-body-2 mb-3">
                    Get a complete starting loadout with equipment suggestions based on your race/subrace, class, and
                    background.
                    This provides a balanced selection of weapons, armor, tools, and gear that work well together.
                  </div>

                  <!-- Preview of class equipment -->
                  <div v-if="hasClassEquipment" class="class-equipment-preview">
                    <v-divider class="mb-2" />
                    <div class="text-caption text-medium-emphasis mb-1">Starting Equipment:</div>

                    <div class="equipment-preview-grid">
                      <div v-if="classStartingEquipment.weapons.length" class="mb-1 d-flex align-center">
                        <v-icon size="x-small" color="accent">mdi-sword</v-icon>
                        <span class="text-caption ml-1">{{ classStartingEquipment.weapons.length }} weapon{{
                          classStartingEquipment.weapons.length > 1 ? 's' : '' }}</span>
                      </div>

                      <div v-if="classStartingEquipment.armor.length" class="mb-1 d-flex align-center">
                        <v-icon size="x-small" color="blue">mdi-shield</v-icon>
                        <span class="text-caption ml-1">{{ classStartingEquipment.armor.length }} armor piece{{
                          classStartingEquipment.armor.length > 1 ? 's' : '' }}</span>
                      </div>

                      <div
                        v-if="classStartingEquipment.tools.length || (hasBackgroundEquipment && backgroundStartingEquipment.tools.length)"
                        class="mb-1 d-flex align-center">
                        <v-icon size="x-small" color="green">mdi-wrench</v-icon>
                        <span class="text-caption ml-1">{{ classStartingEquipment.tools.length + (hasBackgroundEquipment
                          ?
                          backgroundStartingEquipment.tools.length : 0) }} tool{{
                            (classStartingEquipment.tools.length + (hasBackgroundEquipment ?
                              backgroundStartingEquipment.tools.length : 0))
                              > 1 ? 's' : '' }}</span>
                      </div>

                      <div
                        v-if="classStartingEquipment.gear.length || (hasBackgroundEquipment && backgroundStartingEquipment.gear.length)"
                        class="mb-1 d-flex align-center">
                        <v-icon size="x-small" color="orange">mdi-bag-personal</v-icon>
                        <span class="text-caption ml-1">{{ classStartingEquipment.gear.length + (hasBackgroundEquipment
                          ?
                          backgroundStartingEquipment.gear.length : 0) }} gear item{{
                            (classStartingEquipment.gear.length + (hasBackgroundEquipment ?
                              backgroundStartingEquipment.gear.length : 0)) >
                              1 ? 's' : '' }}</span>
                      </div>

                      <div v-if="hasBackgroundEquipment && backgroundStartingEquipment.money"
                        class="mb-1 d-flex align-center">
                        <v-icon size="x-small" color="amber">mdi-cash</v-icon>
                        <span class="text-caption ml-1">{{ backgroundStartingEquipment.money }}</span>
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
                          <div class="text-caption font-weight-medium text-accent">⚔️ Weapons:</div>
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
                    <v-tooltip text="This method gives you a complete set of equipment that works well together"
                      location="top">
                      <template v-slot:activator="{ props }">
                        <v-chip v-bind="props" color="success" size="small" variant="outlined">
                          <v-icon start size="small">mdi-check</v-icon>
                          Balanced & Ready
                        </v-chip>
                      </template>
                    </v-tooltip>
                  </div>
                </v-card>
              </v-col>

              <!-- Gold Purchase Option -->
              <v-col cols="12" md="6">
                <v-card :color="equipmentMethod === 'gold' ? 'primary' : 'white'"
                  :variant="equipmentMethod === 'gold' ? 'outlined' : 'outlined'"
                  class="equipment-method-card pa-4 cursor-pointer h-100" @click="equipmentMethod = 'gold'">
                  <div class="d-flex align-center mb-2">
                    <v-radio value="gold" color="primary" hide-details />
                    <v-icon class="ml-2 mr-2"
                      :color="equipmentMethod === 'gold' ? 'primary' : 'default'">mdi-cash</v-icon>
                    <span class="text-h6" :class="equipmentMethod === 'gold' ? 'text-primary' : ''">
                      Starting Gold
                    </span>
                    <v-tooltip text="You can choose your own equipment but start with less gold" location="top">
                      <template v-slot:activator="{ props }">
                        <v-chip v-bind="props" color="info" size="x-small" class="ml-2">Customizable</v-chip>
                      </template>
                    </v-tooltip>
                  </div>

                  <div class="text-body-2 mb-3">
                    Receive starting gold based on your class and purchase equipment yourself.
                    This gives you complete control over your equipment choices.
                  </div>

                  <!-- Gold amount preview -->
                  <div class="gold-preview">
                    <v-divider class="mb-2" />
                    <div class="text-caption text-medium-emphasis mb-1">Starting gold for {{
                      character.classDetails?.name
                      || character.class || 'your class' }}:</div>

                    <div class="d-flex align-center mb-2">
                      <v-icon color="yellow-darken-2" class="mr-2">mdi-cash</v-icon>
                      <span class="text-h6 text-yellow-darken-2">{{ calculateStartingGold }} GP</span>
                      <span class="text-caption ml-2 text-medium-emphasis">({{ getClassGoldRange }})</span>
                    </div>

                    <div class="text-caption text-medium-emphasis mb-2">
                      Starting gold based on class average: {{ getClassGoldRange }}
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
                    <v-tooltip text="You have complete freedom to choose your equipment but need to manage your budget"
                      location="top">
                      <template v-slot:activator="{ props }">
                        <v-chip v-bind="props" color="info" size="small" variant="outlined">
                          <v-icon start size="small">mdi-cog</v-icon>
                          Full Control
                        </v-chip>
                      </template>
                    </v-tooltip>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-radio-group>

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
        </v-card-text>
      </v-card>

      <!-- Custom Equipment Management -->
      <v-card class="mb-6" variant="outlined">
        <v-card-title class="d-flex align-center">
          <v-icon class="me-3" size="large" color="surface-variant">mdi-plus-circle-outline</v-icon>
          <div>
            <div class="text-h5">
              {{ equipmentMethod === 'class' ? 'Recommended Equipment Package' : 'Custom Equipment' }}
            </div>
            <div class="text-subtitle-2 text-medium-emphasis">
              {{ equipmentMethod === 'class'
                ? 'Complete starting loadout based on your race/subrace, class, and background'
                : 'Build your equipment loadout by adding weapons, armor, tools, and gear with your starting gold'
              }}
            </div>
          </div>
        </v-card-title>

        <!-- Contextual Alert -->
        <v-alert v-if="equipmentMethod === 'class'" type="success" variant="tonal" class="ma-4 mb-0">
          <v-alert-title>Starting Equipment</v-alert-title>
          <div class="text-body-2">
            Complete starting loadout from your class, background, and species.
            <span v-if="backgroundStartingEquipment.money">
              Your background provides <strong>{{ backgroundStartingEquipment.money }}</strong> for additional
              purchases <strong>during gameplay</strong>.
            </span>
          </div>
        </v-alert>
        <v-alert v-if="equipmentMethod === 'gold'" type="warning" variant="tonal" class="ma-4 mb-0">
          <v-alert-title>💰 Equipment Budget: {{ remainingGold }} GP</v-alert-title>
          <div class="text-body-2">
            Use your {{ calculateStartingGold }} GP starting gold to purchase all necessary equipment.
            Remember to get weapons, armor, and basic adventuring supplies before spending on luxury items.
          </div>
        </v-alert>

        <!-- Equipment Details Section (only shown for Recommended Equipment) -->
        <v-card-text>
          <v-row class="equipment-management-row">
            <!-- Weapons -->
            <v-col cols="12" lg="6" class="d-flex">
              <v-card variant="outlined" class="flex-grow-1">
                <v-card-title class="d-flex align-center justify-space-between pa-4"
                  style="background: rgba(var(--v-theme-surface-variant), 0.3);">
                  <div class="d-flex align-center">
                    <v-icon color="red" class="me-2">mdi-sword</v-icon>
                    <div>
                      <div class="text-subtitle-0 font-weight-medium">Weapons</div>
                      <div class="text-caption text-medium-emphasis">{{ allWeapons.length }} equipped</div>
                    </div>
                  </div>
                  <v-btn v-if="equipmentMethod !== 'class'" color="red" variant="elevated" size="small"
                    @click="addWeaponDialog = true" prepend-icon="mdi-plus">
                    Add Weapon
                  </v-btn>
                </v-card-title>

                <v-card-text class="pa-2">
                  <v-list v-if="allWeapons.length" density="comfortable" class="py-0">
                    <template v-for="(weapon, index) in allWeapons" :key="`weapon-${index}`">
                      <v-list-item class="px-4">
                        <template #prepend>
                          <v-avatar size="small" :color="weapon.custom ? 'red-lighten-1' : 'red-darken-2'">
                            <v-icon size="small">mdi-sword</v-icon>
                          </v-avatar>
                        </template>

                        <v-list-item-title class="text-truncate"
                          :style="weapon.name.length > 25 ? 'font-size: 0.875rem;' : ''">
                          {{ weapon.name }}
                          <v-chip v-if="!weapon.custom && detectEquipmentChoices(weapon.name)" size="x-small"
                            :color="isEquipmentChoiceComplete(weapon.name) ? 'success' : 'warning'"
                            :variant="isEquipmentChoiceComplete(weapon.name) ? 'elevated' : 'outlined'" class="ml-2">
                            {{ isEquipmentChoiceComplete(weapon.name) ? 'Complete' : 'Choice Required' }}
                          </v-chip>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          {{ weapon.damage || 'Varies' }} • {{ weapon.properties || weapon.type || 'Weapon' }}
                        </v-list-item-subtitle>

                        <template #append>
                          <v-btn v-if="weapon.custom" color="error" icon size="small" variant="text"
                            @click="removeCustomWeapon(index)">
                            <v-icon size="small">mdi-delete</v-icon>
                          </v-btn>
                        </template>
                      </v-list-item>

                      <!-- Indented selection interface for choice-based equipment -->
                      <div v-if="!weapon.custom && detectEquipmentChoices(weapon.name)" class="ml-16 mr-16 mb-3">
                        <v-card variant="outlined" class="pa-3">
                          <!-- Show current selections -->
                          <div v-if="isEquipmentChoiceComplete(weapon.name)">
                            <div class="text-caption text-success mb-2">
                              Selected:
                            </div>
                            <div class="d-flex flex-wrap ga-2 mb-3">
                              <v-chip
                                v-for="choice in (equipmentChoices[detectEquipmentChoices(weapon.name).type] || [])"
                                :key="choice" size="x-small" color="success" variant="tonal">
                                {{ choice }}
                              </v-chip>
                            </div>
                            <v-btn size="x-small" variant="text" color="primary"
                              @click="clearEquipmentChoices(detectEquipmentChoices(weapon.name).type)">
                              Change Selection
                            </v-btn>
                          </div>

                          <!-- Inline choice interface for incomplete selections -->
                          <div v-else>
                            <!-- Multi-stage choice handling (e.g., Artisan's Tools or Musical Instrument) -->
                            <div v-if="detectEquipmentChoices(weapon.name).isMultiStage">
                              <!-- Stage 1: Choose category -->
                              <div v-if="!multiStageChoices[detectEquipmentChoices(weapon.name).type]?.category"
                                class="text-caption text-medium-emphasis mb-2">
                                Choose category:
                              </div>
                              <div v-if="!multiStageChoices[detectEquipmentChoices(weapon.name).type]?.category"
                                class="d-flex flex-wrap ga-2 mb-3">
                                <v-chip
                                  v-for="option in getAvailableChoicesForType(detectEquipmentChoices(weapon.name).type)"
                                  :key="option" size="small" color="primary" variant="outlined" clickable
                                  @click="toggleEquipmentChoice(detectEquipmentChoices(weapon.name).type, option, detectEquipmentChoices(weapon.name).count, true)">
                                  {{ option }}
                                </v-chip>
                              </div>

                              <!-- Stage 2: Choose specific item from selected category -->
                              <div v-if="multiStageChoices[detectEquipmentChoices(weapon.name).type]?.category">
                                <div class="text-caption text-success mb-2">
                                  Category selected: {{
                                    multiStageChoices[detectEquipmentChoices(weapon.name).type].category }}
                                </div>
                                <div class="text-caption text-medium-emphasis mb-2">
                                  Now choose specific item:
                                </div>
                                <div class="d-flex flex-wrap ga-2 mb-3">
                                  <v-chip
                                    v-for="option in getSpecificOptionsForCategory(multiStageChoices[detectEquipmentChoices(weapon.name).type].category)"
                                    :key="option" size="x-small" :color="(equipmentChoices[detectEquipmentChoices(weapon.name).type] || []).includes(option)
                                      ? 'success'
                                      : 'default'" :variant="(equipmentChoices[detectEquipmentChoices(weapon.name).type] || []).includes(option)
                                        ? 'elevated'
                                        : 'outlined'" clickable
                                    @click="toggleEquipmentChoice(detectEquipmentChoices(weapon.name).type, option, detectEquipmentChoices(weapon.name).count)">
                                    {{ option }}
                                  </v-chip>
                                </div>
                                <v-btn size="x-small" variant="text" color="primary"
                                  @click="multiStageChoices[detectEquipmentChoices(weapon.name).type] = null; equipmentChoices[detectEquipmentChoices(weapon.name).type] = []">
                                  Choose Different Category
                                </v-btn>
                              </div>
                            </div>

                            <!-- Regular single-stage choice handling -->
                            <div v-else>
                              <div class="text-caption text-medium-emphasis mb-2">
                                Select {{ detectEquipmentChoices(weapon.name).count }}
                                {{ detectEquipmentChoices(weapon.name).type === 'musicalInstruments' ? 'instrument' :
                                  detectEquipmentChoices(weapon.name).type === 'gamingSets' ? 'gaming set' :
                                    detectEquipmentChoices(weapon.name).type === 'artisanTools' ? 'tool' :
                                      detectEquipmentChoices(weapon.name).type === 'vehicles' ? 'vehicle' :
                                        detectEquipmentChoices(weapon.name).type.startsWith('choice_') ? 'option' : 'item' }}{{
                                  detectEquipmentChoices(weapon.name).count > 1 ? 's' : '' }}:
                              </div>

                              <div class="d-flex flex-wrap ga-2 mb-3">
                                <v-chip
                                  v-for="option in getAvailableChoicesForType(detectEquipmentChoices(weapon.name).type)"
                                  :key="option" size="x-small" :color="getInstrumentDisabledState(option, detectEquipmentChoices(weapon.name).type)
                                    ? 'error'
                                    : (equipmentChoices[detectEquipmentChoices(weapon.name).type] || []).includes(option)
                                      ? 'success'
                                      : 'default'" :variant="getInstrumentDisabledState(option, detectEquipmentChoices(weapon.name).type)
                                        ? 'tonal'
                                        : (equipmentChoices[detectEquipmentChoices(weapon.name).type] || []).includes(option)
                                          ? 'elevated'
                                          : 'outlined'"
                                  :disabled="getInstrumentDisabledState(option, detectEquipmentChoices(weapon.name).type)"
                                  clickable
                                  @click="!getInstrumentDisabledState(option, detectEquipmentChoices(weapon.name).type) && toggleEquipmentChoice(detectEquipmentChoices(weapon.name).type, option, detectEquipmentChoices(weapon.name).count)">
                                  {{ option }}
                                </v-chip>
                              </div>
                            </div>

                            <div class="text-caption text-medium-emphasis">
                              {{ (equipmentChoices[detectEquipmentChoices(weapon.name).type] || []).length }} / {{
                                detectEquipmentChoices(weapon.name).count }} selected
                            </div>
                          </div>
                        </v-card>
                      </div>
                    </template>
                  </v-list>
                  <div v-else class="pa-6 text-center">
                    <v-icon size="large" color="medium-emphasis">mdi-sword-cross</v-icon>
                    <div class="text-body-2 text-medium-emphasis mt-2">No weapons equipped</div>
                    <div class="text-caption text-medium-emphasis">Add weapons to your inventory</div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Armor -->
            <v-col cols="12" lg="6" class="d-flex">
              <v-card variant="outlined" class="flex-grow-1">
                <v-card-title class="d-flex align-center justify-space-between pa-4"
                  style="background: rgba(var(--v-theme-surface-variant), 0.3);">
                  <div class="d-flex align-center">
                    <v-icon color="blue" class="me-2">mdi-shield</v-icon>
                    <div>
                      <div class="text-subtitle-0 font-weight-medium">Armor & Shields</div>
                      <div class="text-caption text-medium-emphasis">{{ allArmor.length }} equipped</div>
                    </div>
                  </div>
                  <v-btn v-if="equipmentMethod !== 'class'" color="blue" variant="elevated" size="small"
                    @click="addArmorDialog = true" prepend-icon="mdi-plus">
                    Add Armor
                  </v-btn>
                </v-card-title>

                <v-card-text class="pa-2">
                  <v-list v-if="allArmor.length" density="comfortable" class="py-0">
                    <template v-for="(armor, index) in allArmor" :key="`armor-${index}`">
                      <v-list-item class="px-4">
                        <template #prepend>
                          <v-avatar size="small" :color="armor.custom ? 'blue-lighten-1' : 'blue-darken-2'">
                            <v-icon size="small">mdi-shield</v-icon>
                          </v-avatar>
                        </template>

                        <v-list-item-title class="text-truncate"
                          :style="armor.name.length > 25 ? 'font-size: 0.875rem;' : ''">
                          {{ armor.name }}
                          <v-chip v-if="!armor.custom && detectEquipmentChoices(armor.name)" size="x-small"
                            :color="isEquipmentChoiceComplete(armor.name) ? 'success' : 'warning'"
                            :variant="isEquipmentChoiceComplete(armor.name) ? 'elevated' : 'outlined'" class="ml-2">
                            {{ isEquipmentChoiceComplete(armor.name) ? 'Complete' : 'Choice Required' }}
                          </v-chip>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          AC {{ armor.ac || 'Varies' }} • {{ armor.type || 'Armor' }}
                        </v-list-item-subtitle>

                        <template #append>
                          <v-btn v-if="armor.custom" color="error" icon size="small" variant="text"
                            @click="removeCustomArmor(index)">
                            <v-icon size="small">mdi-delete</v-icon>
                          </v-btn>
                        </template>
                      </v-list-item>

                      <!-- Indented selection interface for choice-based equipment -->
                      <div v-if="!armor.custom && detectEquipmentChoices(armor.name)" class="ml-16 mr-16 mb-3">
                        <v-card variant="outlined" class="pa-3">
                          <!-- Show current selections -->
                          <div v-if="isEquipmentChoiceComplete(armor.name)">
                            <div class="text-caption text-success mb-2">
                              Selected:
                            </div>
                            <div class="d-flex flex-wrap ga-2 mb-3">
                              <v-chip
                                v-for="choice in (equipmentChoices[detectEquipmentChoices(armor.name).type] || [])"
                                :key="choice" size="x-small" color="success" variant="tonal">
                                {{ choice }}
                              </v-chip>
                            </div>
                            <v-btn size="x-small" variant="text" color="primary"
                              @click="clearEquipmentChoices(detectEquipmentChoices(armor.name).type)">
                              Change Selection
                            </v-btn>
                          </div>

                          <!-- Inline choice interface for incomplete selections -->
                          <div v-else>
                            <div class="text-caption text-medium-emphasis mb-2">
                              Select {{ detectEquipmentChoices(armor.name).count }}
                              {{ detectEquipmentChoices(armor.name).type === 'musicalInstruments' ? 'instrument' :
                                detectEquipmentChoices(armor.name).type === 'gamingSets' ? 'gaming set' :
                                  detectEquipmentChoices(armor.name).type === 'artisanTools' ? 'tool' :
                                    detectEquipmentChoices(armor.name).type === 'vehicles' ? 'vehicle' :
                                      detectEquipmentChoices(armor.name).type.startsWith('choice_') ? 'option' : 'item' }}{{
                                detectEquipmentChoices(armor.name).count > 1 ? 's' : '' }}:
                            </div>

                            <div class="d-flex flex-wrap ga-2 mb-3">
                              <v-chip
                                v-for="option in getAvailableChoicesForType(detectEquipmentChoices(armor.name).type)"
                                :key="option" size="x-small" :color="getInstrumentDisabledState(option, detectEquipmentChoices(armor.name).type)
                                  ? 'error'
                                  : (equipmentChoices[detectEquipmentChoices(armor.name).type] || []).includes(option)
                                    ? 'success'
                                    : 'default'
                                  " :variant="getInstrumentDisabledState(option, detectEquipmentChoices(armor.name).type)
                                    ? 'tonal'
                                    : (equipmentChoices[detectEquipmentChoices(armor.name).type] || []).includes(option)
                                      ? 'elevated'
                                      : 'outlined'
                                    "
                                :disabled="getInstrumentDisabledState(option, detectEquipmentChoices(armor.name).type)"
                                clickable
                                @click="!getInstrumentDisabledState(option, detectEquipmentChoices(armor.name).type) && toggleEquipmentChoice(detectEquipmentChoices(armor.name).type, option, detectEquipmentChoices(armor.name).count)">
                                {{ option }}
                              </v-chip>
                            </div>

                            <div class="text-caption text-medium-emphasis">
                              {{ (equipmentChoices[detectEquipmentChoices(armor.name).type] || []).length }} / {{
                                detectEquipmentChoices(armor.name).count }} selected
                            </div>
                          </div>
                        </v-card>
                      </div>
                    </template>
                  </v-list>
                  <div v-else class="pa-6 text-center">
                    <v-icon size="large" color="medium-emphasis">mdi-shield-off</v-icon>
                    <div class="text-body-2 text-medium-emphasis mt-2">No armor equipped</div>
                    <div class="text-caption text-medium-emphasis">Add armor to protect yourself</div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Tools -->
            <v-col cols="12" lg="6" class="d-flex">
              <v-card variant="outlined" class="flex-grow-1">
                <v-card-title class="d-flex align-center justify-space-between pa-4"
                  style="background: rgba(var(--v-theme-surface-variant), 0.3);">
                  <div class="d-flex align-center">
                    <v-icon color="green" class="me-2">mdi-tools</v-icon>
                    <div>
                      <div class="text-subtitle-0 font-weight-medium">Tools & Kits</div>
                      <div class="text-caption text-medium-emphasis">{{ allTools.length }} equipped</div>
                    </div>
                  </div>
                  <v-btn v-if="equipmentMethod !== 'class'" color="green" variant="elevated" size="small"
                    @click="addToolDialog = true" prepend-icon="mdi-plus">
                    Add Tool
                  </v-btn>
                </v-card-title>

                <v-card-text class="pa-2">
                  <template v-if="allTools.length">
                    <template v-for="(tool, index) in allTools" :key="`tool-${index}`">
                      <!-- Main equipment list item -->
                      <v-list density="comfortable" class="py-0">
                        <v-list-item class="px-4">
                          <template #prepend>
                            <v-avatar size="small" :color="tool.custom ? 'green-lighten-1' : 'green-darken-2'">
                              <v-icon size="small">mdi-tools</v-icon>
                            </v-avatar>
                          </template>

                          <div class="w-100">
                            <v-list-item-title class="text-truncate"
                              :style="tool.name.length > 25 ? 'font-size: 0.875rem;' : ''">
                              {{ tool.name }}
                              <v-chip v-if="!tool.custom && detectEquipmentChoices(tool.name)" size="x-small"
                                :color="isEquipmentChoiceComplete(tool.name) ? 'success' : 'warning'"
                                :variant="isEquipmentChoiceComplete(tool.name) ? 'elevated' : 'outlined'" class="ml-2">
                                {{ isEquipmentChoiceComplete(tool.name) ? 'Complete' : 'Needs Selection' }}
                              </v-chip>
                            </v-list-item-title>
                            <v-list-item-subtitle>
                              {{ tool.type || 'Tool' }}
                            </v-list-item-subtitle>
                          </div>

                          <template #append>
                            <v-btn v-if="tool.custom" color="error" icon size="small" variant="text"
                              @click="removeCustomTool(index)">
                              <v-icon size="small">mdi-delete</v-icon>
                            </v-btn>
                          </template>
                        </v-list-item>
                      </v-list>

                      <!-- Indented selection interface for choice-based equipment -->
                      <div v-if="!tool.custom && detectEquipmentChoices(tool.name)" class="ml-16 mr-16 mb-3">
                        <v-card variant="outlined" class="pa-3">
                          <!-- Show current selections -->
                          <div v-if="isEquipmentChoiceComplete(tool.name)">
                            <div class="text-caption text-success mb-2">
                              Selected:
                            </div>
                            <div class="d-flex flex-wrap ga-2 mb-3">
                              <v-chip v-for="choice in (equipmentChoices[detectEquipmentChoices(tool.name).type] || [])"
                                :key="choice" size="x-small" color="success" variant="tonal">
                                {{ choice }}
                              </v-chip>
                            </div>
                            <v-btn size="x-small" variant="text" color="primary"
                              @click="clearEquipmentChoices(detectEquipmentChoices(tool.name).type)">
                              Change Selection
                            </v-btn>
                          </div>

                          <!-- Inline choice interface for incomplete selections -->
                          <div v-else>
                            <!-- Multi-stage choice handling (e.g., Artisan's Tools or Musical Instrument) -->
                            <div v-if="detectEquipmentChoices(tool.name).isMultiStage">
                              <!-- Stage 1: Choose category -->
                              <div v-if="!multiStageChoices[detectEquipmentChoices(tool.name).type]?.category"
                                class="text-caption text-medium-emphasis mb-2">
                                Choose category:
                              </div>
                              <div v-if="!multiStageChoices[detectEquipmentChoices(tool.name).type]?.category"
                                class="d-flex flex-wrap ga-2 mb-3">
                                <v-chip
                                  v-for="option in getAvailableChoicesForType(detectEquipmentChoices(tool.name).type)"
                                  :key="option" size="small" color="primary" variant="outlined" clickable
                                  @click="toggleEquipmentChoice(detectEquipmentChoices(tool.name).type, option, detectEquipmentChoices(tool.name).count, true)">
                                  {{ option }}
                                </v-chip>
                              </div>

                              <!-- Stage 2: Choose specific item from selected category -->
                              <div v-if="multiStageChoices[detectEquipmentChoices(tool.name).type]?.category">
                                <div class="text-caption text-success mb-2">
                                  Category selected: {{
                                    multiStageChoices[detectEquipmentChoices(tool.name).type].category }}
                                </div>
                                <div class="text-caption text-medium-emphasis mb-2">
                                  Now choose specific item:
                                </div>
                                <div class="d-flex flex-wrap ga-2 mb-3">
                                  <v-chip
                                    v-for="option in getSpecificOptionsForCategory(multiStageChoices[detectEquipmentChoices(tool.name).type].category)"
                                    :key="option" size="x-small" :color="(equipmentChoices[detectEquipmentChoices(tool.name).type] || []).includes(option)
                                      ? 'success'
                                      : 'default'" :variant="(equipmentChoices[detectEquipmentChoices(tool.name).type] || []).includes(option)
                                        ? 'elevated'
                                        : 'outlined'" clickable
                                    @click="toggleEquipmentChoice(detectEquipmentChoices(tool.name).type, option, detectEquipmentChoices(tool.name).count)">
                                    {{ option }}
                                  </v-chip>
                                </div>
                                <v-btn size="x-small" variant="text" color="primary"
                                  @click="multiStageChoices[detectEquipmentChoices(tool.name).type] = null; equipmentChoices[detectEquipmentChoices(tool.name).type] = []">
                                  Choose Different Category
                                </v-btn>
                              </div>
                            </div>

                            <!-- Regular single-stage choice handling -->
                            <div v-else>
                              <div class="text-caption text-medium-emphasis mb-2">
                                Select {{ detectEquipmentChoices(tool.name).count }}
                                {{ detectEquipmentChoices(tool.name).type === 'musicalInstruments' ? 'instrument' :
                                  detectEquipmentChoices(tool.name).type === 'gamingSets' ? 'gaming set' :
                                    detectEquipmentChoices(tool.name).type === 'artisanTools' ? 'tool' :
                                      detectEquipmentChoices(tool.name).type === 'vehicles' ? 'vehicle' :
                                        detectEquipmentChoices(tool.name).type.startsWith('choice_') ? 'option' : 'item' }}{{
                                  detectEquipmentChoices(tool.name).count > 1 ? 's' : '' }}:
                              </div>

                              <div class="d-flex flex-wrap ga-2 mb-3">
                                <v-chip
                                  v-for="option in getAvailableChoicesForType(detectEquipmentChoices(tool.name).type)"
                                  :key="option" size="x-small" :color="getInstrumentDisabledState(option, detectEquipmentChoices(tool.name).type)
                                    ? 'error'
                                    : (equipmentChoices[detectEquipmentChoices(tool.name).type] || []).includes(option)
                                      ? 'success'
                                      : 'default'
                                    " :variant="getInstrumentDisabledState(option, detectEquipmentChoices(tool.name).type)
                                      ? 'tonal'
                                      : (equipmentChoices[detectEquipmentChoices(tool.name).type] || []).includes(option)
                                        ? 'elevated'
                                        : 'outlined'
                                      "
                                  :disabled="getInstrumentDisabledState(option, detectEquipmentChoices(tool.name).type)"
                                  clickable
                                  @click="!getInstrumentDisabledState(option, detectEquipmentChoices(tool.name).type) && toggleEquipmentChoice(detectEquipmentChoices(tool.name).type, option, detectEquipmentChoices(tool.name).count)">
                                  {{ option }}
                                </v-chip>
                              </div>

                              <div class="text-caption text-medium-emphasis">
                                {{ (equipmentChoices[detectEquipmentChoices(tool.name).type] || []).length }} / {{
                                  detectEquipmentChoices(tool.name).count }} selected
                              </div>
                            </div>
                          </div>
                        </v-card>
                      </div>
                    </template>
                  </template>
                  <div v-if="!allTools.length" class="pa-6 text-center">
                    <v-icon size="large" color="medium-emphasis">mdi-tools</v-icon>
                    <div class="text-body-2 text-medium-emphasis mt-2">No tools equipped</div>
                    <div class="text-caption text-medium-emphasis">Add tools for various tasks</div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Adventuring Gear -->
            <v-col cols="12" lg="6" class="d-flex">
              <v-card variant="outlined" class="flex-grow-1">
                <v-card-title class="d-flex align-center justify-space-between pa-4"
                  style="background: rgba(var(--v-theme-surface-variant), 0.3);">
                  <div class="d-flex align-center">
                    <v-icon color="orange" class="me-2">mdi-bag-personal</v-icon>
                    <div>
                      <div class="text-subtitle-0 font-weight-medium">Adventuring Gear</div>
                      <div class="text-caption text-medium-emphasis">{{ allGear.length }} equipped</div>
                    </div>
                  </div>
                  <v-btn v-if="equipmentMethod !== 'class'" color="orange" variant="elevated" size="small"
                    @click="addGearDialog = true" prepend-icon="mdi-plus">
                    Add Gear
                  </v-btn>
                </v-card-title>

                <v-card-text class="pa-2">
                  <template v-if="allGear.length">
                    <template v-for="(item, index) in allGear" :key="`gear-${index}`">
                      <!-- Main equipment list item -->
                      <v-list density="comfortable" class="py-0">
                        <v-list-item class="px-4">
                          <template #prepend>
                            <v-avatar size="small" :color="item.custom ? 'orange-lighten-1' : 'orange-darken-2'">
                              <v-icon size="small">mdi-bag-personal</v-icon>
                            </v-avatar>
                          </template>

                          <div class="w-100">
                            <v-list-item-title class="text-truncate"
                              :style="item.name.length > 25 ? 'font-size: 0.875rem;' : ''">
                              {{ item.name }}
                              <v-chip v-if="!item.custom && detectEquipmentChoices(item.name)" size="x-small"
                                :color="isEquipmentChoiceComplete(item.name) ? 'success' : 'warning'"
                                :variant="isEquipmentChoiceComplete(item.name) ? 'elevated' : 'outlined'" class="ml-2">
                                {{ isEquipmentChoiceComplete(item.name) ? 'Complete' : 'Needs Selection' }}
                              </v-chip>
                            </v-list-item-title>
                            <v-list-item-subtitle>
                              {{ item.description || item.type || 'Equipment' }}
                            </v-list-item-subtitle>
                          </div>

                          <template #append>
                            <v-btn v-if="item.custom" color="error" icon size="small" variant="text"
                              @click="removeCustomGear(index)">
                              <v-icon size="small">mdi-delete</v-icon>
                            </v-btn>
                          </template>
                        </v-list-item>
                      </v-list>

                      <!-- Indented selection interface for choice-based equipment -->
                      <div v-if="!item.custom && detectEquipmentChoices(item.name)" class="ml-16 mr-16 mb-3">
                        <v-card variant="outlined" class="pa-3">
                          <!-- Show current selections -->
                          <div v-if="isEquipmentChoiceComplete(item.name)">
                            <div class="text-caption text-success mb-2">
                              Selected:
                            </div>
                            <div class="d-flex flex-wrap ga-2 mb-3">
                              <v-chip v-for="choice in (equipmentChoices[detectEquipmentChoices(item.name).type] || [])"
                                :key="choice" size="x-small" color="success" variant="tonal">
                                {{ choice }}
                              </v-chip>
                            </div>
                            <v-btn size="x-small" variant="text" color="primary"
                              @click="clearEquipmentChoices(detectEquipmentChoices(item.name).type)">
                              Change Selection
                            </v-btn>
                          </div>

                          <!-- Inline choice interface for incomplete selections -->
                          <div v-else>
                            <div class="text-caption text-medium-emphasis mb-2">
                              Select {{ detectEquipmentChoices(item.name).count }}
                              {{ detectEquipmentChoices(item.name).type === 'musicalInstruments' ? 'instrument' :
                                detectEquipmentChoices(item.name).type === 'gamingSets' ? 'gaming set' :
                                  detectEquipmentChoices(item.name).type === 'artisanTools' ? 'tool' :
                                    detectEquipmentChoices(item.name).type === 'vehicles' ? 'vehicle' :
                                      detectEquipmentChoices(item.name).type.startsWith('choice_') ? 'option' : 'item' }}{{
                                detectEquipmentChoices(item.name).count > 1 ? 's' : '' }}:
                            </div>

                            <div class="d-flex flex-wrap ga-2 mb-3">
                              <v-chip
                                v-for="option in getAvailableChoicesForType(detectEquipmentChoices(item.name).type)"
                                :key="option" size="x-small" :color="getInstrumentDisabledState(option, detectEquipmentChoices(item.name).type)
                                  ? 'error'
                                  : (equipmentChoices[detectEquipmentChoices(item.name).type] || []).includes(option)
                                    ? 'warning'
                                    : 'default'" :variant="getInstrumentDisabledState(option, detectEquipmentChoices(item.name).type)
                                      ? 'tonal'
                                      : (equipmentChoices[detectEquipmentChoices(item.name).type] || []).includes(option)
                                        ? 'elevated'
                                        : 'outlined'"
                                :disabled="getInstrumentDisabledState(option, detectEquipmentChoices(item.name).type)"
                                clickable
                                @click="!getInstrumentDisabledState(option, detectEquipmentChoices(item.name).type) && toggleEquipmentChoice(detectEquipmentChoices(item.name).type, option, detectEquipmentChoices(item.name).count)">
                                {{ option }}
                              </v-chip>
                            </div>

                            <div class="text-caption text-medium-emphasis">
                              {{ (equipmentChoices[detectEquipmentChoices(item.name).type] || []).length }} / {{
                                detectEquipmentChoices(item.name).count }} selected
                            </div>
                          </div>
                        </v-card>
                      </div>
                    </template>
                  </template>
                  <div v-else class="pa-6 text-center">
                    <v-icon size="large" color="medium-emphasis">mdi-bag-personal-off</v-icon>
                    <div class="text-body-2 text-medium-emphasis mt-2">No gear equipped</div>
                    <div class="text-caption text-medium-emphasis">Add essential adventuring equipment</div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Equipment Summary -->
      <v-card class="mt-6" variant="outlined">
        <v-card-title class="text-h6">📋 Equipment Summary</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="3">
              <div class="text-center">
                <div class="text-h4 text-accent">{{ totalWeapons }}</div>
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

          <div v-if="equipmentMethod === 'gold'" class="text-center">
            <v-tooltip text="Gold pieces you have left to spend on additional equipment" location="top">
              <template v-slot:activator="{ props }">
                <v-chip v-bind="props" color="yellow-darken-2" size="large">
                  <v-icon start>mdi-cash</v-icon>
                  {{ remainingGold }} GP Remaining
                </v-chip>
              </template>
            </v-tooltip>
          </div>

          <div v-else class="text-center">
            <v-chip color="success" size="large" variant="tonal">
              <v-icon start>mdi-package-variant</v-icon>
              Equipment Package Selected
            </v-chip>
          </div>
        </v-card-text>
      </v-card>

    </v-card-text>
  </v-card>

  <!-- Add Equipment Dialogs -->
  <v-dialog v-model="addWeaponDialog" max-width="600">
    <v-card>
      <v-card-title>Add Weapon</v-card-title>
      <v-card-text>
        <v-tabs v-model="weaponTab" color="primary">
          <v-tab value="api">Browse Official</v-tab>
          <v-tab value="custom">Add Custom</v-tab>
        </v-tabs>

        <v-tabs-window v-model="weaponTab" class="mt-4">
          <!-- API Selection Tab -->
          <v-tabs-window-item value="api">
            <div v-if="loadingEquipment" class="text-center py-4">
              <v-progress-circular indeterminate color="primary" />
              <div class="text-body-2 mt-2">Loading weapons...</div>
            </div>

            <div v-else-if="weaponOptions.length === 0" class="text-center py-4 text-medium-emphasis">
              No weapons available from API.
            </div>

            <div v-else class="equipment-chips">
              <div class="text-body-2 mb-3">Select a weapon:</div>
              <div class="d-flex flex-wrap ga-2">
                <v-chip v-for="weapon in weaponOptions.slice(0, 30)" :key="weapon.id"
                  :variant="selectedWeapon === weapon ? 'elevated' : 'outlined'"
                  :color="selectedWeapon === weapon ? 'primary' : (canAfford(weapon) ? 'default' : 'error')"
                  :disabled="!canAfford(weapon) && equipmentMethod === 'gold'" class="weapon-chip" clickable
                  @click="selectedWeapon = selectedWeapon === weapon ? null : weapon">
                  <div class="chip-content">
                    <div class="font-weight-medium">{{ weapon.name }}</div>
                    <div class="text-caption">
                      {{ weapon.damage?.dice || 'Varies' }} {{ weapon.damage?.type || '' }}
                      • {{ weapon.cost?.quantity || 0 }}{{ weapon.cost?.unit || 'gp' }}
                      <span v-if="!canAfford(weapon) && equipmentMethod === 'gold'" class="text-error ml-1">
                        (Can't afford)
                      </span>
                    </div>
                  </div>
                </v-chip>
              </div>
            </div>
          </v-tabs-window-item>

          <!-- Custom Entry Tab -->
          <v-tabs-window-item value="custom">
            <v-text-field v-model="newWeapon.name" label="Weapon Name" />
            <v-text-field v-model="newWeapon.damage" label="Damage (e.g., 1d8)" />
            <v-text-field v-model="newWeapon.properties" label="Properties" />
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="addWeaponDialog = false; selectedWeapon = null">Cancel</v-btn>
        <v-btn v-if="weaponTab === 'api'" :disabled="!selectedWeapon || !canAfford(selectedWeapon)" color="primary"
          @click="addSelectedWeapon">
          Add Selected
        </v-btn>
        <v-btn v-if="weaponTab === 'custom'" :disabled="!newWeapon.name" color="primary" @click="addCustomWeapon">
          Add Custom
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="addArmorDialog" max-width="600">
    <v-card>
      <v-card-title>Add Armor</v-card-title>
      <v-card-text>
        <v-tabs v-model="armorTab" color="primary">
          <v-tab value="api">Browse Official</v-tab>
          <v-tab value="custom">Add Custom</v-tab>
        </v-tabs>

        <v-tabs-window v-model="armorTab" class="mt-4">
          <!-- API Selection Tab -->
          <v-tabs-window-item value="api">
            <div v-if="loadingEquipment" class="text-center py-4">
              <v-progress-circular indeterminate color="primary" />
              <div class="text-body-2 mt-2">Loading armor...</div>
            </div>

            <div v-else-if="armorOptions.length === 0" class="text-center py-4 text-medium-emphasis">
              No armor available from API.
            </div>

            <div v-else class="equipment-chips">
              <div class="text-body-2 mb-3">Select armor:</div>
              <div class="d-flex flex-wrap ga-2">
                <v-chip v-for="armor in armorOptions.slice(0, 30)" :key="armor.id"
                  :variant="selectedArmor === armor ? 'elevated' : 'outlined'"
                  :color="selectedArmor === armor ? 'primary' : (canAfford(armor) ? 'default' : 'error')"
                  :disabled="!canAfford(armor) && equipmentMethod === 'gold'" class="armor-chip" clickable
                  @click="selectedArmor = selectedArmor === armor ? null : armor">
                  <div class="chip-content">
                    <div class="font-weight-medium">{{ armor.name }}</div>
                    <div class="text-caption">
                      AC {{ armor.armorClass?.base || 'Varies' }}
                      <span v-if="armor.armorCategory"> • {{ armor.armorCategory }}</span>
                      • {{ armor.cost?.quantity || 0 }}{{ armor.cost?.unit || 'gp' }}
                      <span v-if="!canAfford(armor) && equipmentMethod === 'gold'" class="text-error ml-1">
                        (Can't afford)
                      </span>
                    </div>
                  </div>
                </v-chip>
              </div>
            </div>
          </v-tabs-window-item>

          <!-- Custom Entry Tab -->
          <v-tabs-window-item value="custom">
            <v-text-field v-model="newArmor.name" label="Armor Name" />
            <v-text-field v-model="newArmor.ac" label="Armor Class" type="number" />
            <v-text-field v-model="newArmor.type" label="Type (Light, Medium, Heavy)" />
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="addArmorDialog = false; selectedArmor = null">Cancel</v-btn>
        <v-btn v-if="armorTab === 'api'" :disabled="!selectedArmor || !canAfford(selectedArmor)" color="primary"
          @click="addSelectedArmor">
          Add Selected
        </v-btn>
        <v-btn v-if="armorTab === 'custom'" :disabled="!newArmor.name" color="primary" @click="addCustomArmor">
          Add Custom
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="addToolDialog" max-width="600">
    <v-card>
      <v-card-title>Add Tool</v-card-title>
      <v-card-text>
        <v-tabs v-model="toolTab" color="primary">
          <v-tab value="api">Browse Official</v-tab>
          <v-tab value="custom">Add Custom</v-tab>
        </v-tabs>

        <v-tabs-window v-model="toolTab" class="mt-4">
          <!-- API Selection Tab -->
          <v-tabs-window-item value="api">
            <div v-if="loadingEquipment" class="text-center py-4">
              <v-progress-circular indeterminate color="primary" />
              <div class="text-body-2 mt-2">Loading tools...</div>
            </div>

            <div v-else-if="toolOptions.length === 0" class="text-center py-4 text-medium-emphasis">
              No tools available from API.
            </div>

            <div v-else class="equipment-chips">
              <div class="text-body-2 mb-3">Select a tool:</div>
              <div class="d-flex flex-wrap ga-2">
                <v-chip v-for="tool in toolOptions.slice(0, 30)" :key="tool.id"
                  :variant="selectedTool === tool ? 'elevated' : 'outlined'"
                  :color="selectedTool === tool ? 'primary' : (canAfford(tool) ? 'default' : 'error')"
                  :disabled="!canAfford(tool) && equipmentMethod === 'gold'" class="tool-chip" clickable
                  @click="selectedTool = selectedTool === tool ? null : tool">
                  <div class="chip-content">
                    <div class="font-weight-medium">{{ tool.name }}</div>
                    <div class="text-caption">
                      {{ tool.category || 'Tool' }}
                      • {{ tool.cost?.quantity || 0 }}{{ tool.cost?.unit || 'gp' }}
                      <span v-if="!canAfford(tool) && equipmentMethod === 'gold'" class="text-error ml-1">
                        (Can't afford)
                      </span>
                    </div>
                  </div>
                </v-chip>
              </div>
            </div>
          </v-tabs-window-item>

          <!-- Custom Entry Tab -->
          <v-tabs-window-item value="custom">
            <v-text-field v-model="newTool.name" label="Tool Name" />
            <v-text-field v-model="newTool.type" label="Type" />
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="addToolDialog = false; selectedTool = null">Cancel</v-btn>
        <v-btn v-if="toolTab === 'api'" :disabled="!selectedTool || !canAfford(selectedTool)" color="primary"
          @click="addSelectedTool">
          Add Selected
        </v-btn>
        <v-btn v-if="toolTab === 'custom'" :disabled="!newTool.name" color="primary" @click="addCustomTool">
          Add Custom
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="addGearDialog" max-width="600">
    <v-card>
      <v-card-title>Add Gear</v-card-title>
      <v-card-text>
        <v-tabs v-model="gearTab" color="primary">
          <v-tab value="api">Browse Official</v-tab>
          <v-tab value="custom">Add Custom</v-tab>
        </v-tabs>

        <v-tabs-window v-model="gearTab" class="mt-4">
          <!-- API Selection Tab -->
          <v-tabs-window-item value="api">
            <div v-if="loadingEquipment" class="text-center py-4">
              <v-progress-circular indeterminate color="primary" />
              <div class="text-body-2 mt-2">Loading gear...</div>
            </div>

            <div v-else-if="gearOptions.length === 0" class="text-center py-4 text-medium-emphasis">
              No adventuring gear available from API.
            </div>

            <div v-else class="equipment-chips">
              <div class="text-body-2 mb-3">Select adventuring gear:</div>
              <div class="d-flex flex-wrap ga-2">
                <v-chip v-for="gear in gearOptions.slice(0, 30)" :key="gear.id"
                  :variant="selectedGear === gear ? 'elevated' : 'outlined'"
                  :color="selectedGear === gear ? 'primary' : (canAfford(gear) ? 'default' : 'error')"
                  :disabled="!canAfford(gear) && equipmentMethod === 'gold'" class="gear-chip" clickable
                  @click="selectedGear = selectedGear === gear ? null : gear">
                  <div class="chip-content">
                    <div class="font-weight-medium">{{ gear.name }}</div>
                    <div class="text-caption">
                      {{ gear.category || 'Equipment' }}
                      • {{ gear.cost?.quantity || 0 }}{{ gear.cost?.unit || 'gp' }}
                      <span v-if="!canAfford(gear) && equipmentMethod === 'gold'" class="text-error ml-1">
                        (Can't afford)
                      </span>
                    </div>
                  </div>
                </v-chip>
              </div>
            </div>
          </v-tabs-window-item>

          <!-- Custom Entry Tab -->
          <v-tabs-window-item value="custom">
            <v-text-field v-model="newGear.name" label="Item Name" />
            <v-text-field v-model="newGear.description" label="Description" />
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="addGearDialog = false; selectedGear = null">Cancel</v-btn>
        <v-btn v-if="gearTab === 'api'" :disabled="!selectedGear || !canAfford(selectedGear)" color="primary"
          @click="addSelectedGear">
          Add Selected
        </v-btn>
        <v-btn v-if="gearTab === 'custom'" :disabled="!newGear.name" color="primary" @click="addCustomGear">
          Add Custom
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Equipment Choice Dialogs -->
  <v-dialog v-model="choiceDialogs.musicalInstruments" max-width="600">
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon color="green" class="mr-3">mdi-music</v-icon>
        Choose Musical Instruments
      </v-card-title>
      <v-card-text>
        <div class="text-body-2 mb-4">
          Select {{ choiceDialogs.requiredCount || 1 }} musical instrument{{ (choiceDialogs.requiredCount || 1) > 1 ?
            's'
            : '' }}:
        </div>
        <div class="d-flex flex-wrap ga-2">
          <v-chip v-for="instrument in availableChoices.musicalInstruments" :key="instrument"
            :color="(equipmentChoices.musicalInstruments || []).includes(instrument) ? 'green' : 'default'"
            :variant="(equipmentChoices.musicalInstruments || []).includes(instrument) ? 'elevated' : 'outlined'"
            clickable @click="addEquipmentChoice('musicalInstruments', instrument)">
            {{ instrument }}
          </v-chip>
        </div>
      </v-card-text>
      <v-card-actions>
        <div class="text-caption text-medium-emphasis">
          Selected: {{ (equipmentChoices.musicalInstruments || []).length }} / {{ choiceDialogs.requiredCount || 1 }}
        </div>
        <v-spacer />
        <v-btn @click="choiceDialogs.musicalInstruments = false">Cancel</v-btn>
        <v-btn color="primary"
          :disabled="(equipmentChoices.musicalInstruments || []).length !== (choiceDialogs.requiredCount || 1)"
          @click="confirmEquipmentChoices('musicalInstruments')">
          Confirm Selection
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="choiceDialogs.gamingSets" max-width="600">
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon color="green" class="mr-3">mdi-dice-multiple</v-icon>
        Choose Gaming Set
      </v-card-title>
      <v-card-text>
        <div class="text-body-2 mb-4">Select a gaming set:</div>
        <div class="d-flex flex-wrap ga-2">
          <v-chip v-for="gamingSet in availableChoices.gamingSets" :key="gamingSet"
            :color="(equipmentChoices.gamingSets || []).includes(gamingSet) ? 'green' : 'default'"
            :variant="(equipmentChoices.gamingSets || []).includes(gamingSet) ? 'elevated' : 'outlined'" clickable
            @click="addEquipmentChoice('gamingSets', gamingSet)">
            {{ gamingSet }}
          </v-chip>
        </div>
      </v-card-text>
      <v-card-actions>
        <div class="text-caption text-medium-emphasis">
          Selected: {{ (equipmentChoices.gamingSets || []).length }} / 1
        </div>
        <v-spacer />
        <v-btn @click="choiceDialogs.gamingSets = false">Cancel</v-btn>
        <v-btn color="primary" :disabled="(equipmentChoices.gamingSets || []).length !== 1"
          @click="confirmEquipmentChoices('gamingSets')">
          Confirm Selection
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="choiceDialogs.artisanTools" max-width="600">
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon color="green" class="mr-3">mdi-tools</v-icon>
        Choose Artisan's Tools
      </v-card-title>
      <v-card-text>
        <div class="text-body-2 mb-4">
          Select {{ choiceDialogs.requiredCount || 1 }} artisan's tool{{ (choiceDialogs.requiredCount || 1) > 1 ? 's' :
            ''
          }}:
        </div>
        <div class="d-flex flex-wrap ga-2">
          <v-chip v-for="tool in availableChoices.artisanTools" :key="tool"
            :color="(equipmentChoices.artisanTools || []).includes(tool) ? 'green' : 'default'"
            :variant="(equipmentChoices.artisanTools || []).includes(tool) ? 'elevated' : 'outlined'" clickable
            @click="addEquipmentChoice('artisanTools', tool)">
            {{ tool }}
          </v-chip>
        </div>
      </v-card-text>
      <v-card-actions>
        <div class="text-caption text-medium-emphasis">
          Selected: {{ (equipmentChoices.artisanTools || []).length }} / {{ choiceDialogs.requiredCount || 1 }}
        </div>
        <v-spacer />
        <v-btn @click="choiceDialogs.artisanTools = false">Cancel</v-btn>
        <v-btn color="primary"
          :disabled="(equipmentChoices.artisanTools || []).length !== (choiceDialogs.requiredCount || 1)"
          @click="confirmEquipmentChoices('artisanTools')">
          Confirm Selection
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="choiceDialogs.vehicles" max-width="600">
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon color="green" class="mr-3">mdi-car</v-icon>
        Choose Vehicle Proficiency
      </v-card-title>
      <v-card-text>
        <div class="text-body-2 mb-4">Select a vehicle proficiency:</div>
        <div class="d-flex flex-wrap ga-2">
          <v-chip v-for="vehicle in availableChoices.vehicles" :key="vehicle"
            :color="(equipmentChoices.vehicles || []).includes(vehicle) ? 'green' : 'default'"
            :variant="(equipmentChoices.vehicles || []).includes(vehicle) ? 'elevated' : 'outlined'" clickable
            @click="addEquipmentChoice('vehicles', vehicle)">
            {{ vehicle }}
          </v-chip>
        </div>
      </v-card-text>
      <v-card-actions>
        <div class="text-caption text-medium-emphasis">
          Selected: {{ (equipmentChoices.vehicles || []).length }} / 1
        </div>
        <v-spacer />
        <v-btn @click="choiceDialogs.vehicles = false">Cancel</v-btn>
        <v-btn color="primary" :disabled="(equipmentChoices.vehicles || []).length !== 1"
          @click="confirmEquipmentChoices('vehicles')">
          Confirm Selection
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch, toRefs, onMounted } from 'vue'
import { dndAPI } from '@/services/dndAPI.js'

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

// Dice rolling for starting gold
const rolledStartingGold = ref(0)

// Dice rolling function for starting gold
const rollStartingGold = () => {
  const className = characterData.selectedClass?.index
  if (!className) return

  const rollsByClass = {
    barbarian: { dice: 2, sides: 4, multiplier: 10 },
    bard: { dice: 5, sides: 4, multiplier: 10 },
    cleric: { dice: 5, sides: 4, multiplier: 10 },
    druid: { dice: 2, sides: 4, multiplier: 10 },
    fighter: { dice: 5, sides: 4, multiplier: 10 },
    monk: { dice: 5, sides: 4, multiplier: 1 },
    paladin: { dice: 5, sides: 4, multiplier: 10 },
    ranger: { dice: 4, sides: 4, multiplier: 10 },
    rogue: { dice: 4, sides: 4, multiplier: 10 },
    sorcerer: { dice: 3, sides: 4, multiplier: 10 },
    warlock: { dice: 4, sides: 4, multiplier: 10 },
    wizard: { dice: 4, sides: 4, multiplier: 10 }
  }

  const rollData = rollsByClass[className]
  if (!rollData) return

  let total = 0
  for (let i = 0; i < rollData.dice; i++) {
    total += Math.floor(Math.random() * rollData.sides) + 1
  }

  rolledStartingGold.value = total * rollData.multiplier

  // Update character store with the rolled gold amount
  if (equipmentMethod.value === 'gold') {
    character.value.coins.gp = rolledStartingGold.value
  }
}

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

// Equipment API data
const allEquipment = ref([])
const loadingEquipment = ref(false)
// Filtered equipment by category
const weaponOptions = computed(() => {
  return allEquipment.value.filter(item => {
    const category = item.category?.toLowerCase() || ''
    return category.includes('weapon') ||
      category.includes('martial') ||
      category.includes('simple') ||
      item.weaponCategory ||
      item.damage
  })
})

const armorOptions = computed(() => {
  return allEquipment.value.filter(item => {
    const category = item.category?.toLowerCase() || ''
    return category.includes('armor') ||
      item.armorCategory ||
      item.armorClass
  })
})

const toolOptions = computed(() => {
  return allEquipment.value.filter(item => {
    return item.category?.toLowerCase().includes('tool') ||
      item.category?.toLowerCase().includes('kit') ||
      item.name.toLowerCase().includes('tools')
  })
})

const gearOptions = computed(() => {
  return allEquipment.value.filter(item => {
    return item.category?.toLowerCase().includes('adventuring') ||
      item.category?.toLowerCase().includes('gear') ||
      item.category === 'Miscellaneous'
  })
})

// Selected equipment from API
const selectedWeapon = ref(null)
const selectedArmor = ref(null)
const selectedTool = ref(null)
const selectedGear = ref(null)

// Tab selection for dialogs
const weaponTab = ref('api')
const armorTab = ref('api')
const toolTab = ref('api')
const gearTab = ref('api')

// Equipment choices for "choice" items
const equipmentChoices = ref({
  musicalInstruments: [],
  gamingSets: [],
  artisanTools: [],
  vehicles: []
})

// Multi-stage equipment choices (category -> specific item)
const multiStageChoices = ref({})

// Equipment choice dialogs
const choiceDialogs = ref({
  musicalInstruments: false,
  gamingSets: false,
  artisanTools: false,
  vehicles: false
})

// Available choices for different categories
const availableChoices = {
  musicalInstruments: [
    'Bagpipes', 'Drum', 'Dulcimer', 'Flute', 'Lute', 'Lyre', 'Horn', 'Pan flute', 'Shawm', 'Viol'
  ],
  gamingSets: [
    'Dice set', 'Dragonchess set', 'Playing card set', 'Three-Dragon Ante set'
  ],
  artisanTools: [
    "Alchemist's supplies", "Brewer's supplies", "Calligrapher's supplies", "Carpenter's tools",
    "Cartographer's tools", "Cobbler's tools", "Cook's utensils", "Glassblower's tools",
    "Jeweler's tools", "Leatherworker's tools", "Mason's tools", "Painter's supplies",
    "Potter's tools", "Smith's tools", "Tinker's tools", "Weaver's tools", "Woodcarver's tools"
  ],
  vehicles: [
    'Vehicles (land)', 'Vehicles (water)'
  ],
  martialMeleeWeapons: [
    'Battleaxe', 'Flail', 'Glaive', 'Greataxe', 'Greatsword', 'Halberd', 'Lance', 'Longsword',
    'Maul', 'Morningstar', 'Pike', 'Rapier', 'Scimitar', 'Shortsword', 'Trident', 'War pick',
    'Warhammer', 'Whip'
  ],
  simpleMeleeWeapons: [
    'Club', 'Dagger', 'Dart', 'Handaxe', 'Javelin', 'Light hammer', 'Mace', 'Quarterstaff',
    'Sickle', 'Spear'
  ],
  martialRangedWeapons: [
    'Blowgun', 'Hand crossbow', 'Heavy crossbow', 'Longbow', 'Net'
  ],
  simpleRangedWeapons: [
    'Light crossbow', 'Shortbow', 'Sling'
  ],
  simpleWeapons: [
    // Combine all simple weapon types for "any simple weapon" choices
    'Club', 'Dagger', 'Dart', 'Handaxe', 'Javelin', 'Light hammer',
    'Mace', 'Quarterstaff', 'Sickle', 'Spear', 'Light crossbow', 'Shortbow', 'Sling'
  ],
  shields: [
    'Shield'
  ],
  weapons: [
    // Combine all weapon types for general "weapon" choices
    'Battleaxe', 'Flail', 'Glaive', 'Greataxe', 'Greatsword', 'Halberd', 'Lance', 'Longsword',
    'Maul', 'Morningstar', 'Pike', 'Rapier', 'Scimitar', 'Shortsword', 'Trident', 'War pick',
    'Warhammer', 'Whip', 'Club', 'Dagger', 'Dart', 'Handaxe', 'Javelin', 'Light hammer',
    'Mace', 'Quarterstaff', 'Sickle', 'Spear', 'Blowgun', 'Hand crossbow', 'Heavy crossbow',
    'Longbow', 'Net', 'Light crossbow', 'Shortbow', 'Sling'
  ]
}

// Starting gold calculation
const calculateStartingGold = computed(() => {
  // Show rolled value if available, regardless of equipment method
  if (rolledStartingGold.value > 0) {
    return rolledStartingGold.value
  }

  // Default to showing dice formula values for reference
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
      weapons: ['Mace or warhammer', 'Light crossbow and 20 bolts or any simple weapon'],
      armor: ['Scale mail or Leather Armor', 'Shield'],
      tools: [],
      gear: ['Priest\'s pack', 'Shield', 'Holy symbol']
    },
    'ranger': {
      weapons: ['Two shortswords or two simple melee weapons', 'Longbow and quiver of 20 arrows'],
      armor: ['Scale mail or Leather Armor'],
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
      weapons: ['Rapier or Longsword or any simple weapon', 'Dagger'],
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
      tools: ['Artisan\'s tools or Musical instrument'],
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
    'entertainer': {
      tools: ['Disguise kit', 'One musical instrument of your choice'],
      gear: ['Costume', 'Belt pouch'],
      money: '15 gp'
    },
    'folk-hero': {
      tools: ['Artisan\'s tools (choice)', 'Vehicles (land)'],
      gear: ['Smith\'s tools', 'Shovel', 'Iron pot', 'Common clothes'],
      money: '10 gp'
    },
    'hermit': {
      tools: ['Herbalism kit'],
      gear: ['Scroll case', 'Winter blanket', 'Common clothes'],
      money: '5 gp'
    },
    'noble': {
      tools: ['Gaming set'],
      gear: ['Signet ring', 'Scroll of pedigree', 'Fine clothes', 'Purse'],
      money: '25 gp'
    },
    'outlander': {
      tools: ['Herbalism kit', 'One musical instrument of your choice'],
      gear: ['Staff', 'Hunting trap', 'Traveler\'s clothes', 'Belt pouch'],
      money: '10 gp'
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

// Helper function to capitalize first letter of equipment names
const capitalizeEquipmentName = (name) => {
  if (!name) return ''
  return name.charAt(0).toUpperCase() + name.slice(1)
}

// Equipment totals
const totalWeapons = computed(() => allWeapons.value.length)
const totalArmor = computed(() => allArmor.value.length)
const totalTools = computed(() => allTools.value.length)
const totalGear = computed(() => allGear.value.length)

// Calculate total cost of purchased equipment
const totalSpent = computed(() => {
  if (equipmentMethod.value !== 'gold') {
    return 0
  }

  let total = 0

  // Add costs from custom weapons
  customWeapons.value.forEach(weapon => {
    if (weapon.cost?.quantity) {
      total += weapon.cost.quantity
    }
  })

  // Add costs from custom armor
  customArmor.value.forEach(armor => {
    if (armor.cost?.quantity) {
      total += armor.cost.quantity
    }
  })

  // Add costs from custom tools
  customTools.value.forEach(tool => {
    if (tool.cost?.quantity) {
      total += tool.cost.quantity
    }
  })

  // Add costs from custom gear
  customGear.value.forEach(gear => {
    if (gear.cost?.quantity) {
      total += gear.cost.quantity
    }
  })

  return total
})

const remainingGold = computed(() => {
  // Only calculate gold when using the gold equipment method
  if (equipmentMethod.value !== 'gold') {
    return 0 // Explicitly return 0 for class equipment
  }

  const remaining = Math.max(0, calculateStartingGold.value - totalSpent.value)
  return remaining
})

// Computed function to check if an instrument choice should be disabled
const getInstrumentDisabledState = computed(() => {
  return (option, currentChoiceType) => {
    // Check if this option is a musical instrument
    const isInstrument = availableChoices.musicalInstruments?.includes(option)
    if (!isInstrument) return false

    // Get all equipment choice types and check each one
    for (const [choiceType, selections] of Object.entries(equipmentChoices.value)) {
      // Skip the current choice type
      if (choiceType === currentChoiceType) continue

      // Check if this choice type could contain musical instruments
      const couldContainInstruments =
        choiceType === 'musicalInstruments' ||
        (availableChoices[choiceType] && availableChoices[choiceType].includes(option))

      if (couldContainInstruments && selections.includes(option)) {
        return true
      }
    }

    return false
  }
})

// Load equipment from API
const loadEquipment = async () => {
  if (loadingEquipment.value || allEquipment.value.length > 0) return

  loadingEquipment.value = true
  try {
    const equipment = await dndAPI.getEquipment()
    allEquipment.value = equipment || []
    console.log(`Loaded ${allEquipment.value.length} equipment items`)
  } catch (error) {
    console.error('Failed to load equipment:', error)
    allEquipment.value = []
  } finally {
    loadingEquipment.value = false
  }
}

// Cost validation functions
const canAfford = (item) => {
  if (equipmentMethod.value !== 'gold') {
    return true // No cost restrictions for class equipment method
  }

  const itemCost = item?.cost?.quantity || 0
  return itemCost <= remainingGold.value
}

const getAffordabilityMessage = (item) => {
  if (equipmentMethod.value !== 'gold') {
    return ''
  }

  const itemCost = item?.cost?.quantity || 0
  if (itemCost > remainingGold.value) {
    return `Insufficient gold: Need ${itemCost}gp, have ${remainingGold.value}gp`
  }
  return ''
}

// Add equipment from API selection
function addSelectedWeapon() {
  if (selectedWeapon.value) {
    if (!canAfford(selectedWeapon.value)) {
      alert(getAffordabilityMessage(selectedWeapon.value))
      return
    }

    customWeapons.value.push({
      name: selectedWeapon.value.name,
      damage: selectedWeapon.value.damage?.dice || 'Varies',
      properties: selectedWeapon.value.properties?.join(', ') || '',
      cost: selectedWeapon.value.cost,
      weight: selectedWeapon.value.weight
    })
    selectedWeapon.value = null
    addWeaponDialog.value = false
  }
}

function addSelectedArmor() {
  if (selectedArmor.value) {
    if (!canAfford(selectedArmor.value)) {
      alert(getAffordabilityMessage(selectedArmor.value))
      return
    }

    customArmor.value.push({
      name: selectedArmor.value.name,
      ac: selectedArmor.value.armorClass?.base || 'Varies',
      type: selectedArmor.value.armorCategory || 'Armor',
      cost: selectedArmor.value.cost,
      weight: selectedArmor.value.weight
    })
    selectedArmor.value = null
    addArmorDialog.value = false
  }
}

function addSelectedTool() {
  if (selectedTool.value) {
    if (!canAfford(selectedTool.value)) {
      alert(getAffordabilityMessage(selectedTool.value))
      return
    }

    customTools.value.push({
      name: selectedTool.value.name,
      type: selectedTool.value.category || 'Tool',
      cost: selectedTool.value.cost,
      weight: selectedTool.value.weight
    })
    selectedTool.value = null
    addToolDialog.value = false
  }
}

function addSelectedGear() {
  if (selectedGear.value) {
    if (!canAfford(selectedGear.value)) {
      alert(getAffordabilityMessage(selectedGear.value))
      return
    }

    customGear.value.push({
      name: selectedGear.value.name,
      description: selectedGear.value.description || selectedGear.value.category,
      cost: selectedGear.value.cost,
      weight: selectedGear.value.weight
    })
    selectedGear.value = null
    addGearDialog.value = false
  }
}

// Add custom equipment functions (manual entry)
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

  // Update gold when switching to gold method
  if (newMethod === 'gold') {
    if (rolledStartingGold.value > 0) {
      character.value.coins.gp = rolledStartingGold.value
    } else {
      character.value.coins.gp = calculateStartingGold.value
    }
  } else {
    // Reset coins when using class equipment
    character.value.coins = { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 }
  }
})

// Load equipment on component mount
onMounted(() => {
  loadEquipment()
})

// Equipment choice handling functions
function detectEquipmentChoices(tool) {
  const toolLower = tool.toLowerCase()

  // Check for "A or B or any C" patterns (like "Rapier or longsword or any simple weapon")
  if (toolLower.includes(' or any ')) {
    // Split by " or " to get all parts
    const allParts = tool.split(/\s+or\s+/i)

    // Look for a part that starts with "any "
    const anyIndex = allParts.findIndex(part => part.toLowerCase().trim().startsWith('any '))

    if (anyIndex !== -1 && allParts.length >= 2) {
      const categoryText = allParts[anyIndex].replace(/^any\s+/i, '').trim().toLowerCase()
      const specificItems = allParts.slice(0, anyIndex).map(item => item.trim())

      let categoryKey = null
      let categoryOptions = []

      // Map category text to our available choices
      if (categoryText.includes('simple') && categoryText.includes('weapon')) {
        categoryKey = 'simpleWeapons'
        // Combine simple melee and ranged weapons
        categoryOptions = [...availableChoices.simpleMeleeWeapons, ...availableChoices.simpleRangedWeapons]
      } else if (categoryText.includes('martial') && categoryText.includes('melee') && categoryText.includes('weapon')) {
        categoryKey = 'martialMeleeWeapons'
        categoryOptions = [...availableChoices.martialMeleeWeapons]
      } else if (categoryText.includes('simple') && categoryText.includes('melee') && categoryText.includes('weapon')) {
        categoryKey = 'simpleMeleeWeapons'
        categoryOptions = [...availableChoices.simpleMeleeWeapons]
      } else if (categoryText.includes('martial') && categoryText.includes('ranged') && categoryText.includes('weapon')) {
        categoryKey = 'martialRangedWeapons'
        categoryOptions = [...availableChoices.martialRangedWeapons]
      } else if (categoryText.includes('simple') && categoryText.includes('ranged') && categoryText.includes('weapon')) {
        categoryKey = 'simpleRangedWeapons'
        categoryOptions = [...availableChoices.simpleRangedWeapons]
      } else if (categoryText.includes('weapon')) {
        categoryKey = 'weapons'
        categoryOptions = [...availableChoices.weapons]
      } else if (categoryText.includes('instrument') || categoryText.includes('insutument')) {
        // Handle "any other instrument" or "any other musical instrument" (with typo support)
        categoryKey = 'musicalInstruments'
        categoryOptions = [...availableChoices.musicalInstruments]
      }

      if (categoryKey && categoryOptions.length > 0) {
        // Add specific items to the options if they're not already there
        specificItems.forEach(item => {
          if (!categoryOptions.includes(item)) {
            categoryOptions.unshift(item) // Add to beginning
          }
        })

        const choiceKey = `choice_${tool.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`
        availableChoices[choiceKey] = categoryOptions

        return { type: choiceKey, count: 1, specificOptions: categoryOptions }
      }
    }
  }

  // Check for "X or any Y" patterns (like "Longsword or any martial melee weapon")
  if (toolLower.includes(' or any ')) {
    const parts = tool.split(/\s+or\s+any\s+/i)
    if (parts.length === 2) {
      const specificItem = parts[0].trim()
      const categoryText = parts[1].trim().toLowerCase()

      let categoryKey = null
      let categoryOptions = []

      // Map category text to our available choices
      if (categoryText.includes('martial') && categoryText.includes('melee') && categoryText.includes('weapon')) {
        categoryKey = 'martialMeleeWeapons'
        categoryOptions = [...availableChoices.martialMeleeWeapons]
      } else if (categoryText.includes('simple') && categoryText.includes('melee') && categoryText.includes('weapon')) {
        categoryKey = 'simpleMeleeWeapons'
        categoryOptions = [...availableChoices.simpleMeleeWeapons]
      } else if (categoryText.includes('martial') && categoryText.includes('ranged') && categoryText.includes('weapon')) {
        categoryKey = 'martialRangedWeapons'
        categoryOptions = [...availableChoices.martialRangedWeapons]
      } else if (categoryText.includes('simple') && categoryText.includes('ranged') && categoryText.includes('weapon')) {
        categoryKey = 'simpleRangedWeapons'
        categoryOptions = [...availableChoices.simpleRangedWeapons]
      } else if (categoryText.includes('weapon')) {
        categoryKey = 'weapons'
        categoryOptions = [...availableChoices.weapons]
      } else if (categoryText.includes('instrument') || categoryText.includes('insutument')) {
        // Handle "any other instrument" or "any other musical instrument" (with typo support)
        categoryKey = 'musicalInstruments'
        categoryOptions = [...availableChoices.musicalInstruments]
      }

      if (categoryKey && categoryOptions.length > 0) {
        // Add the specific item to the options if it's not already there
        if (!categoryOptions.includes(specificItem)) {
          categoryOptions.unshift(specificItem) // Add to beginning
        }

        const choiceKey = `choice_${tool.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`
        availableChoices[choiceKey] = categoryOptions

        return { type: choiceKey, count: 1, specificOptions: categoryOptions }
      }
    }
  }

  // Check for simple "X or Y" patterns first (like "Dungeoneer's pack or Explorer's pack")
  if (toolLower.includes(' or ')) {
    // Extract the specific options from the text
    const options = tool.split(/\s+or\s+/i).map(option => option.trim())
    if (options.length === 2) {
      // Special handling for "Artisan's tools or Musical instrument"
      if (options.some(opt => opt.toLowerCase().includes('artisan') && opt.toLowerCase().includes('tool')) &&
        options.some(opt => opt.toLowerCase().includes('musical instrument'))) {

        // Create a two-stage choice: first choose category, then specific item
        const choiceKey = `choice_${tool.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`
        const categoryOptions = ['Artisan\'s Tools', 'Musical Instrument']

        if (!availableChoices[choiceKey]) {
          availableChoices[choiceKey] = categoryOptions
        }

        return { type: choiceKey, count: 1, specificOptions: categoryOptions, isMultiStage: true }
      }

      // Handle special cases like "second weapon" -> expand to weapon options
      const expandedOptions = []

      options.forEach(option => {
        const optionLower = option.toLowerCase()
        if (optionLower.includes('weapon')) {
          // If one option is "weapon" or "second weapon", expand it
          expandedOptions.push(...availableChoices.weapons)
        } else {
          expandedOptions.push(option)
        }
      })

      // Remove duplicates
      const uniqueOptions = [...new Set(expandedOptions)]

      // Create a unique key for this specific choice
      const choiceKey = `choice_${tool.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`

      // Store the available options for this specific choice
      if (!availableChoices[choiceKey]) {
        availableChoices[choiceKey] = uniqueOptions
      }

      return { type: choiceKey, count: 1, specificOptions: uniqueOptions }
    }
  }

  if (toolLower.includes('musical instrument')) {
    return { type: 'musicalInstruments', count: extractNumber(tool) || 1 }
  }
  if (toolLower.includes('gaming set')) {
    return { type: 'gamingSets', count: 1 }
  }
  if (toolLower.includes('artisan') && toolLower.includes('choice')) {
    return { type: 'artisanTools', count: extractNumber(tool) || 1 }
  }
  if (toolLower.includes('vehicles')) {
    return { type: 'vehicles', count: 1 }
  }
  return null
}
function extractNumber(text) {
  const match = text.match(/(\w+)\s+musical\s+instruments?/i)
  if (match) {
    const wordToNum = {
      'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
      'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
    }
    return wordToNum[match[1].toLowerCase()] || parseInt(match[1]) || 1
  }
  return 1
}

function openEquipmentChoice(choiceType, requiredCount) {
  equipmentChoices.value[choiceType] = []
  choiceDialogs.value[choiceType] = true
  choiceDialogs.value.requiredCount = requiredCount
}

function addEquipmentChoice(choiceType, choice) {
  const required = choiceDialogs.value.requiredCount || 1
  const current = equipmentChoices.value[choiceType] || []

  if (current.includes(choice)) {
    equipmentChoices.value[choiceType] = current.filter(c => c !== choice)
  } else if (current.length < required) {
    equipmentChoices.value[choiceType] = [...current, choice]
  }
}

function confirmEquipmentChoices(choiceType) {
  choiceDialogs.value[choiceType] = false
}

function getEquipmentDisplay(tool) {
  const choice = detectEquipmentChoices(tool)
  if (!choice) return capitalizeEquipmentName(tool)

  const selected = equipmentChoices.value[choice.type] || []
  if (selected.length === 0) {
    return tool // Show original text if no choices made
  }

  return selected.join(', ')
}

function isEquipmentChoiceComplete(tool) {
  const choice = detectEquipmentChoices(tool)
  if (!choice) return true

  const selected = equipmentChoices.value[choice.type] || []
  return selected.length >= choice.count
}

// Helper function to get available choices for a type
function getAvailableChoicesForType(type) {
  return availableChoices[type] || []
}

// Helper function to check if an instrument is already selected in any other choice
const isInstrumentSelectedElsewhere = (instrument, currentChoiceType) => {
  // Check if the instrument is a musical instrument
  const isMusicalInstrument = availableChoices.musicalInstruments?.includes(instrument)
  if (!isMusicalInstrument) return false

  // Get all equipment choice types and check each one
  for (const [choiceType, selections] of Object.entries(equipmentChoices.value)) {
    // Skip the current choice type
    if (choiceType === currentChoiceType) continue

    // Check if this choice type could contain musical instruments
    const couldContainInstruments =
      choiceType === 'musicalInstruments' ||
      (availableChoices[choiceType] && availableChoices[choiceType].includes(instrument))

    if (couldContainInstruments && selections.includes(instrument)) {
      return true
    }
  }

  return false
}

// Helper function to check if an instrument choice should be disabled
const isInstrumentChoiceDisabled = (option, currentChoiceType) => {
  // Check if this option is a musical instrument
  const isInstrument = availableChoices.musicalInstruments?.includes(option)

  if (isInstrument) {
    return isInstrumentSelectedElsewhere(option, currentChoiceType)
  }

  return false
}

// Helper function to toggle equipment choice
function toggleEquipmentChoice(choiceType, choice, maxCount, isMultiStage = false) {
  // Handle multi-stage choices (category selection)
  if (isMultiStage && (choice === 'Artisan\'s Tools' || choice === 'Musical Instrument')) {
    // Clear any previous selection for this choice type
    multiStageChoices.value[choiceType] = { category: choice, specificItem: null }
    equipmentChoices.value[choiceType] = []
    return
  }

  // Handle second stage of multi-stage choices (specific item selection)
  if (multiStageChoices.value[choiceType]?.category && !multiStageChoices.value[choiceType].specificItem) {
    multiStageChoices.value[choiceType].specificItem = choice
    equipmentChoices.value[choiceType] = [choice]
    return
  }

  // Handle regular single-stage choices
  const current = equipmentChoices.value[choiceType] || []

  if (current.includes(choice)) {
    // Remove the choice
    equipmentChoices.value[choiceType] = current.filter(c => c !== choice)
    // Also clear multi-stage data if removing
    if (multiStageChoices.value[choiceType]) {
      multiStageChoices.value[choiceType] = null
    }
  } else if (current.length < maxCount) {
    // Add the choice
    equipmentChoices.value[choiceType] = [...current, choice]
  }
}

// Clear all selections for a specific choice type
function clearEquipmentChoices(choiceType) {
  equipmentChoices.value[choiceType] = []
  // Also clear multi-stage data
  if (multiStageChoices.value[choiceType]) {
    multiStageChoices.value[choiceType] = null
  }
}

// Get specific options for a selected category in multi-stage choices
function getSpecificOptionsForCategory(category) {
  if (category === 'Artisan\'s Tools') {
    return availableChoices.artisanTools
  } else if (category === 'Musical Instrument') {
    return availableChoices.musicalInstruments
  }
  return []
}
</script>

<style scoped>
.equipment-section {
  border-radius: 8px;
  background: rgba(var(--v-theme-surface-variant), 0.3);
  padding: 12px;
  height: 100%;
}

.equipment-items {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.text-wrap {
  white-space: normal !important;
  word-wrap: break-word;
  max-width: 100%;
  height: auto !important;
  min-height: 32px;
  text-align: center;
}

.v-chip.text-wrap {
  height: auto !important;
  min-height: 32px;
  padding: 4px 12px !important;
}

.v-chip.text-wrap .v-chip__content {
  white-space: normal !important;
  word-wrap: break-word;
  line-height: 1.3;
  height: auto !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  align-items: center !important;
  text-align: center !important;
  min-height: 16px;
}

/* Equipment management layout */
.equipment-management-row {
  min-height: 400px;
}

.equipment-management-section {
  border: 1px solid rgba(var(--v-theme-outline), 0.2);
  border-radius: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.equipment-management-section:not(:last-child) {
  border-right: none;
}

.equipment-management-section .section-header {
  background: rgba(var(--v-theme-surface-variant), 0.5);
  flex-shrink: 0;
  font-size: x-large;
  font-weight: 500;
}

.equipment-management-section .section-content {
  background: rgba(var(--v-theme-surface), 0.8);
  flex-grow: 1;
  overflow-y: auto;
}

@media (max-width: 1279px) {
  .equipment-management-section {
    border-right: 1px solid rgba(var(--v-theme-outline), 0.2);
    border-bottom: none;
  }

  .equipment-management-section:not(:last-child) {
    border-bottom: none;
  }
}

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

/* Mobile responsive styles */
@media (max-width: 960px) {
  .equipment-method-card {
    min-height: 300px;
  }

  .equipment-preview-grid {
    grid-template-columns: 1fr;
    gap: 2px;
  }
}

@media (max-width: 600px) {
  .equipment-method-card {
    min-height: 250px;
    padding: 12px !important;
  }

  .equipment-method-card .text-h6 {
    font-size: 1.1rem !important;
  }

  .equipment-method-card .text-body-2 {
    font-size: 0.9rem !important;
  }

  .equipment-method-card:hover {
    transform: none;
    /* Disable hover transform on mobile */
  }
}

/* Equipment chip styles */
.equipment-chips {
  max-height: 400px;
  overflow-y: auto;
}

.weapon-chip,
.armor-chip,
.tool-chip,
.gear-chip {
  height: auto;
  padding: 8px 12px;
  margin-bottom: 8px;
}

.chip-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  white-space: normal;
  text-align: left;
  max-width: 200px;
}

.chip-content .font-weight-medium {
  line-height: 1.2;
}

.chip-content .text-caption {
  line-height: 1.1;
  opacity: 0.8;
}

/* Force dark text on all elevated chips */
.v-chip--variant-elevated {
  color: rgba(0, 0, 0, 0.87) !important;
}

.v-chip--variant-elevated .chip-content,
.v-chip--variant-elevated .chip-content .font-weight-medium,
.v-chip--variant-elevated .chip-content .text-caption {
  color: rgba(0, 0, 0, 0.87) !important;
}

/* Ensure text remains dark even for different chip colors */
.v-chip--variant-elevated.v-chip--color-primary,
.v-chip--variant-elevated.v-chip--color-red,
.v-chip--variant-elevated.v-chip--color-blue,
.v-chip--variant-elevated.v-chip--color-green,
.v-chip--variant-elevated.v-chip--color-orange,
.v-chip--variant-elevated.v-chip--color-purple,
.v-chip--variant-elevated.v-chip--color-teal {
  color: rgba(0, 0, 0, 0.87) !important;
}

/* Force dark text on all elevated buttons */
.v-btn--variant-elevated {
  color: rgba(0, 0, 0, 0.87) !important;
}

.v-btn--variant-elevated .v-btn__content {
  color: rgba(0, 0, 0, 0.87) !important;
}

/* Ensure text remains dark even for different button colors */
.v-btn--variant-elevated.v-btn--color-primary,
.v-btn--variant-elevated.v-btn--color-red,
.v-btn--variant-elevated.v-btn--color-blue,
.v-btn--variant-elevated.v-btn--color-green,
.v-btn--variant-elevated.v-btn--color-orange,
.v-btn--variant-elevated.v-btn--color-purple,
.v-btn--variant-elevated.v-btn--color-teal {
  color: rgba(0, 0, 0, 0.87) !important;
}

/* Equipment choice styling */
.cursor-pointer {
  cursor: pointer !important;
}

.cursor-pointer:hover {
  opacity: 0.8;
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

/* Choice dialog styling */
.equipment-choice-chip {
  margin: 4px;
  transition: all 0.2s ease;
}

.equipment-choice-chip:hover {
  transform: scale(1.05);
}

/* Universal chip vertical centering fixes */
.v-chip {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  vertical-align: middle !important;
}

.v-chip .v-chip__content {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  line-height: 1 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  white-space: nowrap;
  text-align: center !important;
}

/* Specific fixes for chips in list items (status chips) */
.v-list-item-title .v-chip {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  vertical-align: middle !important;
  transform: translateY(0) !important;
}

.v-list-item-title .v-chip .v-chip__content {
  line-height: 1 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* Fixes for chips in selection interfaces */
.d-flex .v-chip,
.equipment-choice-chip {
  align-self: center !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

/* More specific targeting for equipment selection chips in card interfaces */
.v-card .d-flex .v-chip,
.ml-16 .d-flex .v-chip,
.mr-16 .d-flex .v-chip {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  vertical-align: middle !important;
  transform: translateY(0) !important;
}

/* Specific size adjustments for consistent vertical centering */
.v-chip--size-x-small {
  height: 20px !important;
  min-height: 20px !important;
}

.v-chip--size-x-small .v-chip__content {
  min-height: 20px !important;
  height: 20px !important;
  font-size: 0.75rem !important;
  line-height: 1 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.v-chip--size-small {
  height: 24px !important;
  min-height: 24px !important;
}

.v-chip--size-small .v-chip__content {
  min-height: 24px !important;
  height: 24px !important;
  font-size: 0.8125rem !important;
  line-height: 1 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.v-chip--size-default .v-chip__content {
  min-height: 28px !important;
  font-size: 0.875rem !important;
}

.v-chip--size-large .v-chip__content {
  min-height: 32px !important;
  font-size: 1rem !important;
}

/* Override for multi-line text in chips (like equipment descriptions) */
.v-chip.text-wrap .v-chip__content {
  white-space: normal !important;
  line-height: 1.3 !important;
  text-align: center !important;
  padding: 2px 0 !important;
  height: auto !important;
  min-height: 20px !important;
}

/* Aggressive override for ALL chips in this component */
* .v-chip {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  vertical-align: middle !important;
}

* .v-chip .v-chip__content {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  line-height: 1 !important;
  text-align: center !important;
  vertical-align: middle !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

/* Force height consistency for x-small chips everywhere */
* .v-chip--size-x-small {
  height: 20px !important;
  min-height: 20px !important;
  max-height: 20px !important;
}

* .v-chip--size-x-small .v-chip__content {
  height: 20px !important;
  min-height: 20px !important;
  max-height: 20px !important;
  line-height: 1 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
</style>
