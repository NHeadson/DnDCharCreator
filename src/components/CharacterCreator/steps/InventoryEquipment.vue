<template>
  <v-card flat>
    <v-card-title class="text-h4 text-center mb-1">🎒 Inventory & Equipment</v-card-title>
    <v-card-subtitle class="text-center mb-2">Manage your character's gear and starting items</v-card-subtitle>
    <v-divider class="mb-4" />

    <!-- Equipment Method Toggle -->
    <div class="d-flex justify-center mb-6">
      <v-btn-toggle v-model="equipmentMethod" mandatory class="custom-toggle elevation-2 rounded-pill pa-1"
        color="primary">
        <v-btn value="package" :class="['toggle-btn', equipmentMethod === 'package' ? 'selected-package' : '']"
          variant="flat" style="margin-right: 12px;">
          Standard Package
        </v-btn>
        <v-btn value="gold" :class="['toggle-btn', equipmentMethod === 'gold' ? 'selected-gold' : '']" variant="flat">
          Buy with Gold
        </v-btn>
      </v-btn-toggle>
    </div>

    <!-- Equipment Method Selection -->
    <template v-if="equipmentMethod === 'package'">
      <div>
        <!-- Summary Bar -->
        <div class="d-flex flex-wrap justify-center mb-4">
          <v-chip class="ma-1" color="warning" size="large" variant="tonal">💰 Gold: {{ packageGold }} gp</v-chip>
          <v-chip class="ma-1" color="info" size="large" variant="tonal">📦 Items: {{ packageItemCount }}</v-chip>
        </div>

        <!-- Class Equipment Choices Section -->
        <v-card class="mb-6" variant="outlined">
          <v-card-title class="font-weight-bold text-primary">⚔️ Class Equipment Choices</v-card-title>
          <v-card-subtitle class="text-caption">Choose your starting equipment for {{
            capitalizeClassName(character?.selectedClass?.name || character?.class || 'your class') }}</v-card-subtitle>
          <v-card-text>
            <!-- Equipment Choices from API -->
            <div v-if="equipmentChoices.length > 0">
              <div v-for="(choice, index) in equipmentChoices" :key="'choice-' + index" class="mb-6">
                <!-- Only show "Choose 1:" label if there are multiple options -->
                <div v-if="choice.options && choice.options.length > 1" class="mb-3">
                  <div class="text-body-2 text-grey-darken-1 mb-3">Choose 1:</div>
                </div>
                <!-- For single options, show them as automatic equipment -->
                <div v-else-if="choice.options && choice.options.length === 1" class="mb-3">
                  <div class="text-body-2 text-grey-darken-1 mb-3">Starting Equipment:</div>
                </div>

                <div class="d-flex flex-wrap ga-3">
                  <template v-for="(option, optionIndex) in choice.options" :key="'option-' + optionIndex">
                    <v-tooltip
                      v-if="option.items && option.items.length === 1 && getEquipmentTooltip(option.items[0].name)"
                      location="top" max-width="300">
                      <template v-slot:activator="{ props: tooltipProps }">
                        <v-chip v-bind="tooltipProps" :clickable="choice.options.length > 1"
                          @click="choice.options.length > 1 ? selectEquipmentOption(index, optionIndex, option) : null"
                          :color="choice.options.length === 1 ? 'primary' : (isOptionSelected(index, optionIndex) ? 'primary' : 'grey-lighten-3')"
                          :variant="choice.options.length === 1 ? 'tonal' : (isOptionSelected(index, optionIndex) ? 'elevated' : 'outlined')"
                          :prepend-icon="choice.options.length === 1 ? 'mdi-check-circle' : (isOptionSelected(index, optionIndex) ? 'mdi-check-circle' : null)"
                          size="large" class="equipment-choice-chip"
                          :style="choice.options.length > 1 ? 'cursor: pointer; transition: all 0.2s ease;' : 'transition: all 0.2s ease;'">
                          <template v-if="option.category && option.items && option.items.length > 0">
                            Choose {{ option.choose || 1 }} {{
                              (option.choose || 1) > 1 ?
                                (option.category.toLowerCase().endsWith('s') ? capitalizeAndCleanText(option.category) :
                                  capitalizeAndCleanText(option.category) + 's') :
                                (option.category.toLowerCase().endsWith('s') ?
                                  capitalizeAndCleanText(option.category.slice(0, -1)) :
                                  capitalizeAndCleanText(option.category))
                            }} + {{
                              capitalizeAndCleanText(option.items.map(item => {
                                const cleanName = item.name.replace(/\s*x\d+\s*$/i, '');
                                return cleanName + (item.quantity > 1 ? ` x${item.quantity}` : '');
                              }).join(' + '))
                            }}
                          </template>
                          <template v-else-if="option.category">
                            Choose {{ option.choose || 1 }} {{
                              (option.choose || 1) > 1 ?
                                (option.category.toLowerCase().endsWith('s') ? capitalizeAndCleanText(option.category) :
                                  capitalizeAndCleanText(option.category) + 's') :
                                (option.category.toLowerCase().endsWith('s') ?
                                  capitalizeAndCleanText(option.category.slice(0, -1)) :
                                  capitalizeAndCleanText(option.category))
                            }}
                          </template>
                          <template v-else-if="option.items && option.items.length > 0">
                            {{capitalizeAndCleanText(option.items.map(item => {
                              // Remove x2, x3, etc. suffixes for cleaner display
                              const cleanName = item.name.replace(/\s*x\d+\s*$/i, '');
                              return cleanName + (item.quantity > 1 ? ` x${item.quantity}` : '');
                            }).join(' + '))}}
                          </template>
                        </v-chip>
                      </template>
                      <template v-slot:default>
                        <div class="equipment-tooltip">
                          <div class="font-weight-bold text-primary mb-1">{{ option.items[0].name }}</div>
                          <div class="text-caption mb-1"><strong>Type:</strong> {{
                            getEquipmentTooltip(option.items[0].name).type }}</div>
                          <div class="text-caption mb-1" v-if="getEquipmentTooltip(option.items[0].name).damage">
                            <strong>Damage:</strong> {{ getEquipmentTooltip(option.items[0].name).damage }}
                          </div>
                          <div class="text-caption mb-1" v-if="getEquipmentTooltip(option.items[0].name).ac">
                            <strong>AC:</strong> {{ getEquipmentTooltip(option.items[0].name).ac }}
                          </div>
                          <div class="text-caption mb-1"
                            v-if="getEquipmentTooltip(option.items[0].name).properties !== 'None'">
                            <strong>Properties:</strong> {{ getEquipmentTooltip(option.items[0].name).properties }}
                          </div>
                          <!-- Special display for equipment packs -->
                          <div v-if="getEquipmentTooltip(option.items[0].name).contents" class="mt-2">
                            <div class="text-caption font-weight-bold mb-1 text-primary">Pack Contents:</div>
                            <div class="equipment-pack-contents">
                              <div v-for="item in getEquipmentTooltip(option.items[0].name).contents" :key="item"
                                class="text-caption pack-item">
                                • {{ item }}
                              </div>
                            </div>
                          </div>
                          <div class="text-caption text-grey-darken-1 mt-2" style="font-style: italic;"
                            v-if="!getEquipmentTooltip(option.items[0].name).contents">
                            {{ getEquipmentTooltip(option.items[0].name).description }}
                          </div>
                        </div>
                      </template>
                    </v-tooltip>
                    <v-chip v-else :clickable="choice.options.length > 1"
                      @click="choice.options.length > 1 ? selectEquipmentOption(index, optionIndex, option) : null"
                      :color="choice.options.length === 1 ? 'primary' : (isOptionSelected(index, optionIndex) ? 'primary' : 'grey-lighten-3')"
                      :variant="choice.options.length === 1 ? 'tonal' : (isOptionSelected(index, optionIndex) ? 'elevated' : 'outlined')"
                      :prepend-icon="choice.options.length === 1 ? 'mdi-check-circle' : (isOptionSelected(index, optionIndex) ? 'mdi-check-circle' : null)"
                      size="large" class="equipment-choice-chip"
                      :style="choice.options.length > 1 ? 'cursor: pointer; transition: all 0.2s ease;' : 'transition: all 0.2s ease;'">
                      <template v-if="option.category && option.items && option.items.length > 0">
                        Choose {{ option.choose || 1 }} {{
                          (option.choose || 1) > 1 ?
                            (option.category.toLowerCase().endsWith('s') ? capitalizeAndCleanText(option.category) :
                              capitalizeAndCleanText(option.category) + 's') :
                            (option.category.toLowerCase().endsWith('s') ? capitalizeAndCleanText(option.category.slice(0,
                              -1)) : capitalizeAndCleanText(option.category))
                        }} + {{
                          capitalizeAndCleanText(option.items.map(item => {
                            const cleanName = item.name.replace(/\s*x\d+\s*$/i, '');
                            return cleanName + (item.quantity > 1 ? ` x${item.quantity}` : '');
                          }).join(' + '))
                        }}
                      </template>
                      <template v-else-if="option.category">
                        Choose {{ option.choose || 1 }} {{
                          (option.choose || 1) > 1 ?
                            (option.category.toLowerCase().endsWith('s') ? capitalizeAndCleanText(option.category) :
                              capitalizeAndCleanText(option.category) + 's') :
                            (option.category.toLowerCase().endsWith('s') ? capitalizeAndCleanText(option.category.slice(0,
                              -1)) : capitalizeAndCleanText(option.category))
                        }}
                      </template>
                      <template v-else-if="option.items && option.items.length > 0">
                        {{capitalizeAndCleanText(option.items.map(item => {
                          // Remove x2, x3, etc. suffixes for cleaner display
                          const cleanName = item.name.replace(/\s*x\d+\s*$/i, '');
                          return cleanName + (item.quantity > 1 ? ` x${item.quantity}` : '');
                        }).join(' + '))}}
                      </template>
                    </v-chip>
                  </template>
                </div>
              </div>
            </div>

            <!-- Fallback if no equipment choices available -->
            <div v-else-if="fallbackEquipment.length > 0">
              <v-alert type="info" variant="tonal" class="mb-4">
                <v-icon>mdi-information</v-icon>
                No equipment choices found for {{ character?.selectedClass?.name || 'this class' }}. Showing standard
                equipment.
              </v-alert>
              <v-row>
                <v-col v-for="item in fallbackEquipment" :key="item.name" cols="12" md="6" lg="4">
                  <v-card class="uniform-item-card mb-3" color="grey-lighten-5" variant="tonal">
                    <v-card-title class="d-flex align-center justify-space-between">
                      <span class="font-weight-bold">{{ capitalizeEquipmentName(item.name) }}</span>
                      <v-chip v-if="item.quantity > 1" size="x-small" variant="outlined">x{{ item.quantity }}</v-chip>
                    </v-card-title>
                    <v-card-text>
                      <div v-if="item.description" class="text-caption">{{ item.description }}</div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </div>

            <!-- No equipment at all -->
            <div v-else class="text-center py-8">
              <v-icon size="64" color="grey">mdi-package-variant-closed</v-icon>
              <div class="text-h6 mt-2 text-grey">No Starting Equipment</div>
              <div class="text-caption text-grey">Select a class to see equipment options</div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Background Equipment Section -->
        <v-card v-if="backgroundEquipmentChoices.length > 0" class="mb-6" variant="outlined">
          <v-card-title class="font-weight-bold text-secondary">📜 Background Equipment Choices</v-card-title>
          <v-card-subtitle class="text-caption">Choose your starting equipment for {{
            character?.backgroundDetails?.name || character?.background || 'your background' }}</v-card-subtitle>
          <v-card-text>
            <div class="d-flex flex-wrap ga-2">
              <div v-for="item in backgroundEquipmentChoices" :key="item?.name || 'unknown'"
                class="background-equipment-item">
                <!-- Musical Instrument Chip with Click Functionality -->
                <template
                  v-if="item && item.name && (item.name?.toLowerCase().includes('musical instrument') || item.name?.toLowerCase() === 'instrument' || isSpecificMusicalInstrument(item))">
                  <v-tooltip
                    :text="isGenericMusicalInstrument(item) ? 'Click to choose a specific musical instrument' : 'Click to change musical instrument'"
                    location="top">
                    <template v-slot:activator="{ props: tooltipProps }">
                      <v-chip v-bind="tooltipProps"
                        :text="capitalizeEquipmentName(item?.name || 'Unknown Item') + (item?.quantity > 1 ? ` x${item.quantity}` : '')"
                        :color="getEquipmentTypeColor(item.name, item.source || 'background')"
                        :variant="isChoiceRequiredItem(item) ? 'outlined' : 'elevated'"
                        :class="{ 'choice-required-chip': isChoiceRequiredItem(item), 'musical-instrument-chip': true }"
                        :prepend-icon="isChoiceRequiredItem(item) ? 'mdi-help-circle' : 'mdi-music'" size="large"
                        class="ma-1" @click="musicalInstrumentDialog = true" style="cursor: pointer;" />
                    </template>
                  </v-tooltip>
                </template>

                <!-- Artisan's Tools Chip with Click Functionality -->
                <template
                  v-if="item && item.name && (item.name?.toLowerCase().includes('artisan') || item.name?.toLowerCase().includes('artisan\'s tools') || isSpecificArtisanTool(item))">
                  <v-tooltip
                    :text="isGenericArtisanTool(item) ? 'Click to choose specific artisan\'s tools' : 'Click to change artisan\'s tools'"
                    location="top">
                    <template v-slot:activator="{ props: tooltipProps }">
                      <v-chip v-bind="tooltipProps"
                        :text="capitalizeEquipmentName(item?.name || 'Unknown Item') + (item?.quantity > 1 ? ` x${item.quantity}` : '')"
                        :color="getEquipmentTypeColor(item.name, item.source || 'background')"
                        :variant="isChoiceRequiredItem(item) ? 'outlined' : 'elevated'"
                        :class="{ 'choice-required-chip': isChoiceRequiredItem(item), 'artisan-tools-chip': true }"
                        :prepend-icon="isChoiceRequiredItem(item) ? 'mdi-help-circle' : getEquipmentIcon(item.name)"
                        size="large" class="ma-1" @click="artisanToolsDialog = true" style="cursor: pointer;" />
                    </template>
                  </v-tooltip>
                </template>

                <!-- Regular Equipment Chip -->
                <template v-else-if="item && item.name">
                  <v-tooltip v-if="getEquipmentTooltip(item.name)" location="top" max-width="300">
                    <template v-slot:activator="{ props: tooltipProps }">
                      <v-chip v-bind="tooltipProps"
                        :text="capitalizeEquipmentName(item?.name || 'Unknown Item') + (item?.quantity > 1 ? ` x${item.quantity}` : '')"
                        :color="getEquipmentTypeColor(item.name, item.source || 'background')"
                        :variant="isChoiceRequiredItem(item) ? 'outlined' : 'elevated'"
                        :class="{ 'choice-required-chip': isChoiceRequiredItem(item) }"
                        :prepend-icon="isChoiceRequiredItem(item) ? 'mdi-help-circle' : getEquipmentIcon(item.name)"
                        size="large" class="ma-1" />
                    </template>
                    <template v-slot:default>
                      <div class="equipment-tooltip">
                        <div class="font-weight-bold text-primary mb-1">{{ capitalizeEquipmentName(item.name) }}</div>
                        <div class="text-caption mb-1"><strong>Type:</strong> {{ getEquipmentTooltip(item.name).type }}
                        </div>
                        <div class="text-caption mb-1" v-if="getEquipmentTooltip(item.name).damage">
                          <strong>Damage:</strong> {{ getEquipmentTooltip(item.name).damage }}
                        </div>
                        <div class="text-caption mb-1" v-if="getEquipmentTooltip(item.name).ac">
                          <strong>AC:</strong> {{ getEquipmentTooltip(item.name).ac }}
                        </div>
                        <div class="text-caption mb-1" v-if="getEquipmentTooltip(item.name).properties !== 'None'">
                          <strong>Properties:</strong> {{ getEquipmentTooltip(item.name).properties }}
                        </div>
                        <div v-if="getEquipmentTooltip(item.name).contents" class="mt-2">
                          <div class="text-caption font-weight-bold mb-1 text-primary">Pack Contents:</div>
                          <div class="equipment-pack-contents">
                            <div v-for="packItem in getEquipmentTooltip(item.name).contents" :key="packItem"
                              class="text-caption pack-item">
                              • {{ packItem }}
                            </div>
                          </div>
                        </div>
                        <div class="text-caption text-grey-darken-1 mt-2" style="font-style: italic;"
                          v-if="!getEquipmentTooltip(item.name).contents">
                          {{ getEquipmentTooltip(item.name).description }}
                        </div>
                      </div>
                    </template>
                  </v-tooltip>
                  <v-chip v-else
                    :text="capitalizeEquipmentName(item?.name || 'Unknown Item') + (item?.quantity > 1 ? ` x${item.quantity}` : '')"
                    :color="getEquipmentTypeColor(item.name, item.source || 'background')"
                    :variant="isChoiceRequiredItem(item) ? 'outlined' : 'elevated'"
                    :class="{ 'choice-required-chip': isChoiceRequiredItem(item) }"
                    :prepend-icon="isChoiceRequiredItem(item) ? 'mdi-help-circle' : getEquipmentIcon(item.name)"
                    size="large" class="ma-1" />
                </template>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Inventory Summary Section -->
        <v-card class="mt-2" variant="outlined">
          <v-card-title class="font-weight-bold text-primary">🎒 Your Complete Inventory</v-card-title>
          <v-card-subtitle class="text-caption">All equipment your character starts with</v-card-subtitle>
          <v-card-text>
            <div v-if="allInventory.length === 0" class="text-center py-4 text-grey">
              <v-icon size="32" color="grey">mdi-package-variant-closed</v-icon>
              <div class="text-body-2 mt-2">No equipment selected yet</div>
            </div>
            <div v-else class="d-flex flex-wrap ga-2">
              <div v-for="(item, index) in allInventory"
                :key="`${item?.name || 'unknown'}-${item?.source || 'unknown'}-${index}`"
                class="inventory-equipment-item">

                <!-- Musical Instrument Chip -->
                <template v-if="item && item.name && isSpecificMusicalInstrument(item)">
                  <v-tooltip
                    :text="`Musical instrument from your ${item.source === 'class' ? 'class equipment' : 'background'}`"
                    location="top">
                    <template v-slot:activator="{ props: tooltipProps }">
                      <v-chip v-bind="tooltipProps"
                        :text="capitalizeEquipmentName(item?.name || 'Unknown Item') + (item?.quantity > 1 ? ` x${item.quantity}` : '')"
                        :color="getEquipmentTypeColor(item.name, item.source)" variant="elevated"
                        :prepend-icon="'mdi-music'" size="large" class="ma-1" />
                    </template>
                  </v-tooltip>
                </template>

                <!-- Artisan's Tools Chip -->
                <template v-else-if="item && item.name && isSpecificArtisanTool(item)">
                  <v-tooltip
                    :text="`Artisan's tools from your ${item.source === 'background' ? 'background' : 'class equipment'}`"
                    location="top">
                    <template v-slot:activator="{ props: tooltipProps }">
                      <v-chip v-bind="tooltipProps"
                        :text="capitalizeEquipmentName(item?.name || 'Unknown Item') + (item?.quantity > 1 ? ` x${item.quantity}` : '')"
                        :color="getEquipmentTypeColor(item.name, item.source)" variant="elevated"
                        :prepend-icon="getEquipmentIcon(item.name)" size="large" class="ma-1" />
                    </template>
                  </v-tooltip>
                </template>

                <!-- Regular Equipment Chip -->
                <template v-else-if="item && item.name">
                  <v-tooltip v-if="getEquipmentTooltip(item.name)" location="top" max-width="300">
                    <template v-slot:activator="{ props: tooltipProps }">
                      <v-chip v-bind="tooltipProps"
                        :text="capitalizeEquipmentName(item?.name || 'Unknown Item') + (item?.quantity > 1 ? ` x${item.quantity}` : '')"
                        :color="getEquipmentTypeColor(item.name, item.source)" variant="elevated"
                        :prepend-icon="getEquipmentIcon(item.name)" size="large" class="ma-1" />
                    </template>
                    <template v-slot:default>
                      <div class="equipment-tooltip">
                        <div class="font-weight-bold text-primary mb-1">{{ capitalizeEquipmentName(item.name) }}</div>
                        <div class="text-caption mb-1"><strong>Type:</strong> {{ getEquipmentTooltip(item.name).type }}
                        </div>
                        <div class="text-caption mb-1" v-if="getEquipmentTooltip(item.name).damage">
                          <strong>Damage:</strong> {{ getEquipmentTooltip(item.name).damage }}
                        </div>
                        <div class="text-caption mb-1" v-if="getEquipmentTooltip(item.name).ac">
                          <strong>AC:</strong> {{ getEquipmentTooltip(item.name).ac }}
                        </div>
                        <div class="text-caption mb-1" v-if="getEquipmentTooltip(item.name).properties !== 'None'">
                          <strong>Properties:</strong> {{ getEquipmentTooltip(item.name).properties }}
                        </div>
                        <div v-if="getEquipmentTooltip(item.name).contents" class="mt-2">
                          <div class="text-caption font-weight-bold mb-1 text-primary">Pack Contents:</div>
                          <div class="equipment-pack-contents">
                            <div v-for="packItem in getEquipmentTooltip(item.name).contents" :key="packItem"
                              class="text-caption pack-item">
                              • {{ packItem }}
                            </div>
                          </div>
                        </div>
                        <div class="text-caption text-grey-darken-1 mt-2" style="font-style: italic;"
                          v-if="!getEquipmentTooltip(item.name).contents">
                          {{ getEquipmentTooltip(item.name).description }}
                        </div>
                        <div class="text-caption mt-2">
                          <strong>Source:</strong> {{ item.source === 'class' ? 'Class Equipment Choice' : item.source
                            === 'class-default' ? 'Starting Equipment' : item.source === 'background' ? 'Background' :
                            item.source === 'purchased' ? 'Purchased' : item.source }}
                        </div>
                      </div>
                    </template>
                  </v-tooltip>
                  <v-chip v-else
                    :text="capitalizeEquipmentName(item?.name || 'Unknown Item') + (item?.quantity > 1 ? ` x${item.quantity}` : '')"
                    :color="getEquipmentTypeColor(item.name, item.source)" variant="elevated"
                    :prepend-icon="getEquipmentIcon(item.name)" size="large" class="ma-1" />
                </template>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </template>
    <!-- Gold Purchasing Method -->
    <template v-else-if="equipmentMethod === 'gold'">
      <div>
        <!-- Alert banner removed for cleaner UI -->
        <div class="d-flex flex-wrap justify-center mb-4">
          <v-chip class="ma-1" color="warning" size="large" variant="tonal">💰 Gold: {{
            characterStore.character?.coins?.gp || 0 }} gp</v-chip>
          <v-chip class="ma-1" color="info" size="large" variant="tonal">📦 Items: {{ purchasedItems.length }}</v-chip>
        </div>

        <h4 class="text-h6 mb-4 font-weight-bold">🛒 Equipment Shop</h4>

        <!-- Shop Categories in Compact Grid -->
        <v-row class="mb-4">
          <!-- Weapons Section -->
          <v-col cols="12" md="4">
            <v-card class="equipment-shop-category mb-4" variant="outlined">
              <v-card-title class="d-flex align-center bg-red-lighten-5 text-red-darken-2">
                <v-icon class="mr-2">mdi-sword</v-icon>
                <span>Weapons</span>
                <v-spacer />
                <v-chip size="small" variant="text" color="red">{{ availableWeapons.length }}</v-chip>
              </v-card-title>
              <v-card-text class="pa-4">
                <div v-if="availableWeapons.length === 0" class="text-center text-grey py-4">
                  No weapons available
                </div>
                <div v-else class="text-center">
                  <div class="text-caption text-grey-darken-1 mb-3">
                    Browse {{ availableWeapons.length }} available weapons
                  </div>
                  <v-btn color="red" variant="tonal" block size="large" @click="addWeaponDialog = true">
                    <v-icon start>mdi-storefront</v-icon>
                    Browse Weapons Shop
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Armor Section -->
          <v-col cols="12" md="4">
            <v-card class="equipment-shop-category mb-4" variant="outlined">
              <v-card-title class="d-flex align-center bg-blue-lighten-5 text-blue-darken-2">
                <v-icon class="mr-2">mdi-shield</v-icon>
                <span>Armor</span>
                <v-spacer />
                <v-chip size="small" variant="text" color="blue">{{ availableArmor.length }}</v-chip>
              </v-card-title>
              <v-card-text class="pa-4">
                <div v-if="availableArmor.length === 0" class="text-center text-grey py-4">
                  No armor available
                </div>
                <div v-else class="text-center">
                  <div class="text-caption text-grey-darken-1 mb-3">
                    Browse {{ availableArmor.length }} available armor sets
                  </div>
                  <v-btn color="blue" variant="tonal" block size="large" @click="addArmorDialog = true">
                    <v-icon start>mdi-storefront</v-icon>
                    Browse Armor Shop
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Gear Section -->
          <v-col cols="12" md="4">
            <v-card class="equipment-shop-category mb-4" variant="outlined">
              <v-card-title class="d-flex align-center bg-green-lighten-5 text-green-darken-2">
                <v-icon class="mr-2">mdi-bag-personal</v-icon>
                <span>Gear</span>
                <v-spacer />
                <v-chip size="small" variant="text" color="green">{{ availableGear.length }}</v-chip>
              </v-card-title>
              <v-card-text class="pa-4">
                <div v-if="availableGear.length === 0" class="text-center text-grey py-4">
                  No gear available
                </div>
                <div v-else class="text-center">
                  <div class="text-caption text-grey-darken-1 mb-3">
                    Browse {{ availableGear.length }} available gear items
                  </div>
                  <v-btn color="green" variant="tonal" block size="large" @click="addGearDialog = true">
                    <v-icon start>mdi-storefront</v-icon>
                    Browse Gear Shop
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Purchased Items Summary -->
        <v-divider class="my-4" />
        <v-card class="mt-2" variant="outlined">
          <v-card-title class="font-weight-bold">Your Purchased Equipment</v-card-title>
          <v-card-text>
            <div v-if="purchasedItems.length === 0" class="text-center py-4 text-grey">
              <v-icon size="32" color="grey">mdi-storefront</v-icon>
              <div class="text-body-2 mt-2">No items purchased yet. Browse the shops above to buy equipment.</div>
            </div>
            <div v-else class="d-flex flex-wrap ga-2">
              <template v-for="(item, index) in purchasedItems" :key="`${item.name}-purchased-${index}`">
                <v-tooltip v-if="getEquipmentTooltip(item.name)" location="top" max-width="300">
                  <template v-slot:activator="{ props: tooltipProps }">
                    <v-chip v-bind="tooltipProps"
                      :text="capitalizeEquipmentName(item.name) + (item.quantity > 1 ? ` x${item.quantity}` : '')"
                      :color="getEquipmentTypeColor(item.name, 'purchased')" :prepend-icon="getEquipmentIcon(item.name)"
                      variant="elevated" size="large" class="ma-1 custom-chip" closable
                      @click:close="removePurchasedItem(item)" :close-icon="'mdi-close'" :close-size="'20'" />
                  </template>
                  <template v-slot:default>
                    <div class="equipment-tooltip">
                      <div class="font-weight-bold text-primary mb-1">{{ capitalizeEquipmentName(item.name) }}</div>
                      <div class="text-caption mb-1"><strong>Type:</strong> {{ getEquipmentTooltip(item.name).type }}
                      </div>
                      <div class="text-caption mb-1" v-if="getEquipmentTooltip(item.name).damage">
                        <strong>Damage:</strong> {{ getEquipmentTooltip(item.name).damage }}
                      </div>
                      <div class="text-caption mb-1" v-if="getEquipmentTooltip(item.name).ac">
                        <strong>AC:</strong> {{ getEquipmentTooltip(item.name).ac }}
                      </div>
                      <div class="text-caption mb-1" v-if="getEquipmentTooltip(item.name).properties !== 'None'">
                        <strong>Properties:</strong> {{ getEquipmentTooltip(item.name).properties }}
                      </div>
                      <div class="text-caption mb-1">
                        <strong>Cost:</strong> {{ formatCostWithGoldEquivalent(item) }}
                      </div>
                      <div class="text-caption text-grey-darken-1 mt-2" style="font-style: italic;">
                        {{ getEquipmentTooltip(item.name).description }}
                      </div>
                    </div>
                  </template>
                </v-tooltip>
                <v-chip v-else
                  :text="capitalizeEquipmentName(item.name) + (item.quantity > 1 ? ` x${item.quantity}` : '')"
                  :color="getEquipmentTypeColor(item.name, 'purchased')" :prepend-icon="getEquipmentIcon(item.name)"
                  variant="elevated" size="large" class="ma-1 custom-chip" closable
                  @click:close="removePurchasedItem(item)" :close-icon="'mdi-close'" :close-size="'20'" />
              </template>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </template>
  </v-card>

  <!-- Inventory Modal -->
  <v-dialog v-model="showInventoryModal" max-width="600">
    <v-card>
      <v-card-title>Full Inventory</v-card-title>
      <v-card-text>
        <div v-if="groupedInventory.length === 0">No items in inventory.</div>
        <v-list v-else>
          <template v-for="(item, index) in groupedInventory"
            :key="`${item?.name || 'unknown'}-${item?.source || 'unknown'}-${index}`">
            <v-list-item v-if="item && item.name">
              <v-list-item-title>{{ capitalizeEquipmentName(item.name) }}</v-list-item-title>
              <v-list-item-subtitle>Qty: {{ item.quantity }} | {{ parseEquipmentCost(item).quantity }} {{
                parseEquipmentCost(item).unit
              }}</v-list-item-subtitle>
            </v-list-item>
          </template>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="showInventoryModal = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Weapon Alternatives Dialog -->
  <v-dialog v-model="weaponAlternativesDialog" max-width="800">
    <v-card>
      <v-card-title>Choose Alternative Weapon</v-card-title>
      <v-card-subtitle>
        Replace <strong>{{ currentItemToReplace?.name }}</strong> with a weapon you're proficient with
      </v-card-subtitle>
      <v-card-text>
        <v-row>
          <v-col v-for="weapon in alternativeItems" :key="weapon.name" cols="12" md="6" sm="6">
            <v-card class="weapon-card mb-2" color="red" variant="tonal">
              <v-card-title class="d-flex align-center justify-space-between">
                <span class="font-weight-bold">{{ weapon.name }}</span>
                <v-chip v-if="equipmentMethod === 'gold'" color="red" size="small" variant="elevated">{{
                  parseEquipmentCost(weapon).quantity }}
                  gp</v-chip>
              </v-card-title>
              <v-card-subtitle class="text-caption">
                {{ weapon.weapon_category || 'Weapon' }} • {{ weapon.weapon_range || 'Melee' }}
              </v-card-subtitle>
              <v-card-text>
                <div class="d-flex align-center justify-space-between mb-2">
                  <span><strong>Damage:</strong> {{ weapon.damage?.dice || '1d6' }} {{ weapon.damage?.type ||
                    'slashing' }}</span>
                  <v-btn icon="mdi-information" size="x-small" variant="text" @click="showDetails(weapon)" />
                </div>
                <v-btn color="success" size="small" variant="tonal" @click="replaceItemWithAlternative(weapon)">
                  <v-icon size="small" start>mdi-swap-horizontal</v-icon>
                  Choose This
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="weaponAlternativesDialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Armor Alternatives Dialog -->
  <v-dialog v-model="armorAlternativesDialog" max-width="800">
    <v-card>
      <v-card-title>Choose Alternative Armor</v-card-title>
      <v-card-subtitle>
        Replace <strong>{{ currentItemToReplace?.name }}</strong> with armor you're proficient with
      </v-card-subtitle>
      <v-card-text>
        <v-row>
          <v-col v-for="armor in alternativeItems" :key="armor.name" cols="12" md="6" sm="6">
            <v-card class="armor-card mb-2" color="blue" variant="tonal">
              <v-card-title class="d-flex align-center justify-space-between">
                <span class="font-weight-bold">{{ armor.name }}</span>
                <v-chip v-if="equipmentMethod === 'gold'" color="blue" size="small" variant="elevated">{{
                  parseEquipmentCost(armor).quantity }}
                  gp</v-chip>
              </v-card-title>
              <v-card-subtitle class="text-caption">{{ armor.armor_category || 'Armor' }}</v-card-subtitle>
              <v-card-text>
                <div class="d-flex align-center justify-space-between mb-2">
                  <span><strong>AC:</strong> {{ armor.armor_class?.base || 10 }}</span>
                  <v-btn icon="mdi-information" size="x-small" variant="text" @click="showDetails(armor)" />
                </div>
                <v-btn color="success" size="small" variant="tonal" @click="replaceItemWithAlternative(armor)">
                  <v-icon size="small" start>mdi-swap-horizontal</v-icon>
                  Choose This
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="armorAlternativesDialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Musical Instrument Selection Dialog -->
  <v-dialog v-model="musicalInstrumentDialog" max-width="900">
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2" color="purple">🎵</v-icon>
        Choose Your Musical Instrument
      </v-card-title>
      <v-card-subtitle>
        Select a musical instrument. Proficient instruments will be highlighted in purple.
      </v-card-subtitle>
      <v-card-text>
        <v-row>
          <v-col v-for="instrument in musicalInstruments" :key="instrument.name" cols="12" md="6" sm="6">
            <v-card class="instrument-card mb-2" :variant="isProficientInstrument(instrument) ? 'outlined' : 'tonal'"
              :class="{ 'proficient-instrument': isProficientInstrument(instrument) }">
              <v-card-title class="d-flex align-center justify-space-between">
                <span class="font-weight-bold">{{ instrument.name }}</span>
                <div class="d-flex align-center">
                  <v-chip v-if="isProficientInstrument(instrument)" color="purple-lighten-1" size="small" class="mr-2"
                    variant="elevated">
                    <v-icon size="small" start>mdi-star</v-icon>
                    <strong>Proficient</strong>
                  </v-chip>
                  <v-chip v-if="equipmentMethod === 'gold'"
                    :color="isProficientInstrument(instrument) ? 'purple-lighten-1' : 'secondary'" size="small"
                    variant="elevated">
                    {{ parseEquipmentCost(instrument).quantity }} gp
                  </v-chip>
                </div>
              </v-card-title>
              <v-card-text>
                <v-btn color="success" size="small" variant="tonal" @click="selectMusicalInstrument(instrument)">
                  <v-icon size="small" start>🎵</v-icon>
                  Choose This Instrument
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="musicalInstrumentDialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Artisan's Tools Selection Dialog -->
  <v-dialog v-model="artisanToolsDialog" max-width="900">
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2" color="green">🔧</v-icon>
        Choose Your Artisan's Tools
      </v-card-title>
      <v-card-subtitle>
        Select artisan's tools. Proficient tools will be highlighted in green.
      </v-card-subtitle>
      <v-card-text>
        <v-row>
          <v-col v-for="tool in artisanTools" :key="tool.name" cols="12" md="6" sm="6">
            <v-card class="tool-card mb-2" :variant="isProficientTool(tool) ? 'outlined' : 'tonal'"
              :class="{ 'proficient-tool': isProficientTool(tool) }">
              <v-card-title class="d-flex align-center justify-space-between">
                <span class="font-weight-bold">{{ tool.name }}</span>
                <div class="d-flex align-center">
                  <v-chip v-if="isProficientTool(tool)" color="green-darken-1" size="small" class="mr-2"
                    variant="elevated">
                    <v-icon size="small" start>mdi-star</v-icon>
                    <strong>Proficient</strong>
                  </v-chip>
                  <v-chip v-if="equipmentMethod === 'gold'"
                    :color="isProficientTool(tool) ? 'green-darken-1' : 'secondary'" size="small" variant="elevated">
                    {{ parseEquipmentCost(tool).quantity }} gp
                  </v-chip>
                </div>
              </v-card-title>
              <v-card-text>
                <v-btn color="success" size="small" variant="tonal" @click="selectArtisanTool(tool)">
                  <v-icon size="small" start>🔧</v-icon>
                  Choose This Tool
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="artisanToolsDialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Weapon Category Selection Dialog -->
  <v-dialog v-model="weaponCategoryDialog" max-width="800">
    <v-card>
      <v-card-title class="text-h5">{{ weaponSelectionTitle }}</v-card-title>
      <v-card-subtitle>{{ weaponSelectionSubtitle }}</v-card-subtitle>
      <v-card-text>
        <div class="text-body-2 mb-4">Selected: {{ selectedWeapons.length }} / {{ weaponSelectionCount }}</div>
        <v-row>
          <v-col v-for="weapon in availableWeaponsForSelection" :key="weapon.name" cols="12" md="6" lg="4">
            <v-card :class="['weapon-selection-card', { 'selected': selectedWeapons.includes(weapon.name) }]"
              @click="toggleWeaponSelection(weapon.name)"
              :color="selectedWeapons.includes(weapon.name) ? 'primary' : 'grey-lighten-5'"
              :variant="selectedWeapons.includes(weapon.name) ? 'elevated' : 'outlined'"
              style="cursor: pointer; transition: all 0.2s ease;">
              <v-card-title class="text-subtitle-1">
                {{ weapon.name }}
                <v-icon v-if="selectedWeapons.includes(weapon.name)" color="white"
                  class="ml-2">mdi-check-circle</v-icon>
              </v-card-title>
              <v-card-text class="pt-2">
                <div class="text-caption">{{ weapon.description }}</div>
                <v-chip v-if="equipmentMethod === 'gold'" size="x-small" variant="outlined" class="mt-1">{{
                  weapon.cost.quantity }} {{ weapon.cost.unit }}</v-chip>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="confirmWeaponSelection"
          :disabled="selectedWeapons.length !== weaponSelectionCount">
          Confirm Selection
        </v-btn>
        <v-btn color="primary" @click="weaponCategoryDialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Weapon Shop Dialog -->
  <v-dialog v-model="addWeaponDialog" max-width="1200" scrollable>
    <v-card>
      <v-card-title class="bg-red-lighten-5 text-red-darken-2 d-flex align-center">
        <v-icon class="mr-2">mdi-sword</v-icon>
        <span>Weapons Shop</span>
        <v-spacer />
        <v-chip size="small" variant="text" color="red">{{ availableWeapons.length }} Items</v-chip>
      </v-card-title>
      <v-card-text class="pa-4" style="max-height: 600px;">
        <v-row>
          <v-col v-for="weapon in availableWeapons" :key="weapon.name" cols="12" sm="6" md="4" lg="3">
            <v-tooltip v-if="getEquipmentTooltip(weapon.name)" :text="getEquipmentTooltip(weapon.name).description"
              location="top">
              <template v-slot:activator="{ props }">
                <v-card v-bind="props" class="shop-item-card h-100" variant="outlined"
                  :class="{ 'elevation-4': canAffordItem(weapon) }">
                  <v-card-text class="pa-3">
                    <div class="d-flex align-center justify-space-between mb-2">
                      <span class="font-weight-bold text-body-2">{{ capitalizeEquipmentName(weapon.name) }}</span>
                      <v-chip size="small" color="red" variant="elevated">
                        {{ parseEquipmentCost(weapon).quantity }} gp
                      </v-chip>
                    </div>
                    <div class="text-caption text-grey-darken-1 mb-2">
                      {{ weapon.damage?.dice || '1d6' }} {{ weapon.damage?.type || 'damage' }}
                    </div>
                    <div v-if="weapon.weapon_category" class="text-caption mb-2">
                      {{ weapon.weapon_category }} {{ weapon.weapon_range || '' }}
                    </div>
                    <v-btn size="small" color="success" variant="tonal" block :disabled="!canAffordItem(weapon)"
                      @click="openQuantityDialog(weapon)">
                      <v-icon size="small" start>mdi-cart</v-icon>
                      Buy for {{ parseEquipmentCost(weapon).quantity }} gp
                    </v-btn>
                  </v-card-text>
                </v-card>
              </template>
            </v-tooltip>
            <!-- Fallback for weapons without tooltips -->
            <v-card v-else class="shop-item-card h-100" variant="outlined"
              :class="{ 'elevation-4': canAffordItem(weapon) }">
              <v-card-text class="pa-3">
                <div class="d-flex align-center justify-space-between mb-2">
                  <span class="font-weight-bold text-body-2">{{ capitalizeEquipmentName(weapon.name) }}</span>
                  <v-chip size="small" color="red" variant="elevated">
                    {{ parseEquipmentCost(weapon).quantity }} gp
                  </v-chip>
                </div>
                <div class="text-caption text-grey-darken-1 mb-2">
                  {{ weapon.damage?.dice || '1d6' }} {{ weapon.damage?.type || 'damage' }}
                </div>
                <div v-if="weapon.weapon_category" class="text-caption mb-2">
                  {{ weapon.weapon_category }} {{ weapon.weapon_range || '' }}
                </div>
                <v-btn size="small" color="success" variant="tonal" block :disabled="!canAffordItem(weapon)"
                  @click="openQuantityDialog(weapon)">
                  <v-icon size="small" start>mdi-cart</v-icon>
                  Buy for {{ parseEquipmentCost(weapon).quantity }} gp
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="addWeaponDialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Armor Shop Dialog -->
  <v-dialog v-model="addArmorDialog" max-width="1200" scrollable>
    <v-card>
      <v-card-title class="bg-blue-lighten-5 text-blue-darken-2 d-flex align-center">
        <v-icon class="mr-2">mdi-shield</v-icon>
        <span>Armor Shop</span>
        <v-spacer />
        <v-chip size="small" variant="text" color="blue">{{ availableArmor.length }} Items</v-chip>
      </v-card-title>
      <v-card-text class="pa-4" style="max-height: 600px;">
        <v-row>
          <v-col v-for="armor in availableArmor" :key="armor.name" cols="12" sm="6" md="4" lg="3">
            <v-tooltip v-if="getEquipmentTooltip(armor.name)" :text="getEquipmentTooltip(armor.name).description"
              location="top">
              <template v-slot:activator="{ props }">
                <v-card v-bind="props" class="shop-item-card h-100" variant="outlined"
                  :class="{ 'elevation-4': canAffordItem(armor) }">
                  <v-card-text class="pa-3">
                    <div class="d-flex align-center justify-space-between mb-2">
                      <span class="font-weight-bold text-body-2">{{ capitalizeEquipmentName(armor.name) }}</span>
                      <v-chip size="small" color="blue" variant="elevated">
                        {{ parseEquipmentCost(armor).quantity }} gp
                      </v-chip>
                    </div>
                    <div class="text-caption text-grey-darken-1 mb-2">
                      AC {{ armor.armor_class?.base || 10 }}
                      <span v-if="armor.armor_class?.dex_bonus">+ Dex</span>
                    </div>
                    <div v-if="armor.armor_category" class="text-caption mb-2">
                      {{ armor.armor_category }}
                    </div>
                    <v-btn size="small" color="success" variant="tonal" block :disabled="!canAffordItem(armor)"
                      @click="openQuantityDialog(armor)">
                      <v-icon size="small" start>mdi-cart</v-icon>
                      Buy for {{ parseEquipmentCost(armor).quantity }} gp
                    </v-btn>
                  </v-card-text>
                </v-card>
              </template>
            </v-tooltip>
            <!-- Fallback for armor without tooltips -->
            <v-card v-else class="shop-item-card h-100" variant="outlined"
              :class="{ 'elevation-4': canAffordItem(armor) }">
              <v-card-text class="pa-3">
                <div class="d-flex align-center justify-space-between mb-2">
                  <span class="font-weight-bold text-body-2">{{ capitalizeEquipmentName(armor.name) }}</span>
                  <v-chip size="small" color="blue" variant="elevated">
                    {{ parseEquipmentCost(armor).quantity }} gp
                  </v-chip>
                </div>
                <div class="text-caption text-grey-darken-1 mb-2">
                  AC {{ armor.armor_class?.base || 10 }}
                  <span v-if="armor.armor_class?.dex_bonus">+ Dex</span>
                </div>
                <div v-if="armor.armor_category" class="text-caption mb-2">
                  {{ armor.armor_category }}
                </div>
                <v-btn size="small" color="success" variant="tonal" block :disabled="!canAffordItem(armor)"
                  @click="openQuantityDialog(armor)">
                  <v-icon size="small" start>mdi-cart</v-icon>
                  Buy for {{ parseEquipmentCost(armor).quantity }} gp
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="addArmorDialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Gear Shop Dialog -->
  <v-dialog v-model="addGearDialog" max-width="1200" scrollable>
    <v-card>
      <v-card-title class="bg-green-lighten-5 text-green-darken-2 d-flex align-center">
        <v-icon class="mr-2">mdi-bag-personal</v-icon>
        <span>Gear Shop</span>
        <v-spacer />
        <v-chip size="small" variant="text" color="green">{{ availableGear.length }} Items</v-chip>
      </v-card-title>
      <v-card-text class="pa-4" style="max-height: 600px;">
        <v-row>
          <v-col v-for="item in availableGear" :key="item.name" cols="12" sm="6" md="4" lg="3">
            <v-tooltip v-if="getEquipmentTooltip(item.name)" :text="getEquipmentTooltip(item.name).description"
              location="top">
              <template v-slot:activator="{ props }">
                <v-card v-bind="props" class="shop-item-card h-100" variant="outlined"
                  :class="{ 'elevation-4': canAffordItem(item) }">
                  <v-card-text class="pa-3">
                    <div class="d-flex align-center justify-space-between mb-2">
                      <span class="font-weight-bold text-body-2">{{ capitalizeEquipmentName(item.name) }}</span>
                      <v-chip size="small" color="green" variant="elevated">
                        {{ formatCostWithGoldEquivalent(item) }}
                      </v-chip>
                    </div>
                    <div v-if="item.gear_category" class="text-caption text-grey-darken-1 mb-2">
                      {{ item.gear_category }}
                    </div>
                    <v-btn size="small" color="success" variant="tonal" block :disabled="!canAffordItem(item)"
                      @click="openQuantityDialog(item)">
                      <v-icon size="small" start>mdi-cart</v-icon>
                      Buy for {{ formatCostWithGoldEquivalent(item) }}
                    </v-btn>
                  </v-card-text>
                </v-card>
              </template>
            </v-tooltip>
            <!-- Fallback for gear without tooltips -->
            <v-card v-else class="shop-item-card h-100" variant="outlined"
              :class="{ 'elevation-4': canAffordItem(item) }">
              <v-card-text class="pa-3">
                <div class="d-flex align-center justify-space-between mb-2">
                  <span class="font-weight-bold text-body-2">{{ capitalizeEquipmentName(item.name) }}</span>
                  <v-chip size="small" color="green" variant="elevated">
                    {{ formatCostWithGoldEquivalent(item) }}
                  </v-chip>
                </div>
                <div v-if="item.gear_category" class="text-caption text-grey-darken-1 mb-2">
                  {{ item.gear_category }}
                </div>
                <v-btn size="small" color="success" variant="tonal" block :disabled="!canAffordItem(item)"
                  @click="openQuantityDialog(item)">
                  <v-icon size="small" start>mdi-cart</v-icon>
                  Buy for {{ formatCostWithGoldEquivalent(item) }}
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="addGearDialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Quantity Selection Dialog -->
  <v-dialog v-model="quantityDialog" max-width="400">
    <v-card>
      <v-card-title class="bg-primary-lighten-5 text-primary-darken-2 d-flex align-center">
        <v-icon class="mr-2">mdi-numeric</v-icon>
        <span>Select Quantity</span>
      </v-card-title>
      <v-card-text class="pa-4">
        <div v-if="selectedItem" class="text-center">
          <div class="mb-3">
            <div class="text-h6 mb-1">{{ capitalizeEquipmentName(selectedItem.name) }}</div>
            <v-chip size="small" color="primary" variant="elevated">
              {{ formatCostWithGoldEquivalent(selectedItem) }} each
            </v-chip>
          </div>

          <v-row align="center" justify="center" class="mb-3">
            <v-col cols="4">
              <v-btn icon size="large" color="primary" variant="outlined"
                @click="selectedQuantity = Math.max(1, selectedQuantity - 1)">
                <v-icon>mdi-minus</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="4" class="text-center">
              <v-text-field v-model.number="selectedQuantity" type="number" min="1" max="99" hide-details
                variant="outlined" density="compact" class="text-center" style="text-align: center;" />
            </v-col>
            <v-col cols="4">
              <v-btn icon size="large" color="primary" variant="outlined"
                @click="selectedQuantity = Math.min(99, selectedQuantity + 1)">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-col>
          </v-row>

          <div class="mb-3">
            <div class="text-body-2 text-grey-darken-1">Total Cost:</div>
            <div class="text-h6 font-weight-bold text-primary">
              {{ formatTotalCost(selectedItem, selectedQuantity) }}
            </div>
          </div>

          <v-alert v-if="!canAffordQuantity(selectedItem, selectedQuantity)" type="warning" variant="tonal"
            class="mb-3">
            Not enough gold! You need {{ formatTotalCost(selectedItem, selectedQuantity) }}
          </v-alert>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="grey" @click="quantityDialog = false">Cancel</v-btn>
        <v-spacer />
        <v-btn color="success" variant="elevated" :disabled="!canAffordQuantity(selectedItem, selectedQuantity)"
          @click="purchaseItemWithQuantity()">
          <v-icon start>mdi-cart</v-icon>
          Buy {{ selectedQuantity }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref, toRefs, watch, onMounted } from 'vue'
import { useCharacterStore } from '@/stores/characterStore'

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

const emit = defineEmits(['complete'])

const { character, characterData } = toRefs(props)
const characterStore = useCharacterStore()

// Helper functions (defined early to ensure availability)
// Helper function to determine inventory item color based on source
const getInventoryItemColor = (source) => {
  switch (source) {
    case 'class':
      return 'primary';
    case 'class-default':
      return 'primary';
    case 'background':
      return 'secondary';
    default:
      return 'grey';
  }
};

// Helper function to capitalize first letter and remove (a), (b), (c) labels
const capitalizeAndCleanText = (text) => {
  if (!text) return '';

  // Remove (a), (b), (c) labels and clean up
  let cleanText = text
    .replace(/\(a\)\s*/gi, '')
    .replace(/\(b\)\s*/gi, '')
    .replace(/\(c\)\s*/gi, '')
    .replace(/\s+or\s+/gi, ' or ')
    .replace(/^\s*,?\s*/, '') // Remove leading comma/spaces
    .trim();

  // Capitalize first letter
  return cleanText.charAt(0).toUpperCase() + cleanText.slice(1);
};

// Helper function to capitalize class names
const capitalizeClassName = (className) => {
  if (!className) return '';
  if (typeof className === 'object') {
    className = className.name || '';
  }
  return className.charAt(0).toUpperCase() + className.slice(1).toLowerCase();
};

// Helper function to determine if an item requires user choice
const isChoiceRequiredItem = (item) => {
  if (!item || !item.name) return false;

  const itemName = typeof item === 'string' ? item : item.name;
  const choiceRequiredItems = [
    'Musical Instrument',
    'Artisan\'s Tools',
    'Gaming Set',
    'Tool Kit',
    'Instrument'
  ];
  return choiceRequiredItems.some(choiceItem =>
    itemName.toLowerCase().includes(choiceItem.toLowerCase())
  );
};

// Helper function to get equipment icon based on type
const getEquipmentIcon = (itemName) => {
  if (!itemName) return null;

  const name = itemName.toLowerCase();
  const tooltip = getEquipmentTooltip(itemName);

  // Check tooltip type first for accuracy
  if (tooltip?.type) {
    const type = tooltip.type.toLowerCase();
    if (type.includes('armor') || type.includes('shield')) return 'mdi-shield';
    if (type.includes('weapon')) return 'mdi-sword';
    if (type.includes('artisan\'s tools')) return 'mdi-tools';
    if (type.includes('equipment pack')) return 'mdi-bag-personal';
    if (type.includes('divine focus')) return 'mdi-cross';
    if (type.includes('arcane focus')) return 'mdi-wizard-hat';
    if (type.includes('druidcraft focus')) return 'mdi-leaf';
    // Simple tools will fall through to name-based matching for specific icons
  }

  // Fallback to name-based matching
  if (name.includes('armor') || name.includes('mail') || name.includes('leather') ||
    name.includes('scale') || name.includes('studded') || name.includes('hide') ||
    name.includes('padded') || name.includes('ring') || name.includes('splint') ||
    name.includes('shield')) {
    return 'mdi-shield';
  }
  if (name.includes('sword') || name.includes('dagger') || name.includes('axe') ||
    name.includes('mace') || name.includes('club') || name.includes('sickle') ||
    name.includes('scimitar') || name.includes('rapier') || name.includes('bow') ||
    name.includes('crossbow') || name.includes('javelin') || name.includes('dart') ||
    name.includes('sling') || name.includes('flail') || name.includes('hammer') ||
    name.includes('spear') || name.includes('trident') || name.includes('whip') ||
    name.includes('glaive') || name.includes('halberd') || name.includes('pike') ||
    name.includes('lance') || name.includes('maul') || name.includes('greataxe') ||
    name.includes('greatsword') || name.includes('quarterstaff')) {
    return 'mdi-sword';
  }
  if (name.includes('musical instrument') || name.includes('instrument') ||
    name.includes('flute') || name.includes('lute') || name.includes('drum') ||
    name.includes('dulcimer') || name.includes('harp') || name.includes('horn') ||
    name.includes('lyre') || name.includes('pan flute') || name.includes('shawm') ||
    name.includes('viol') || name.includes('bagpipes') || name.includes('guitar') ||
    name.includes('harpsichord') || name.includes('mandolin') || name.includes('violin') ||
    name.includes('piano') || name.includes('trumpet') || name.includes('clarinet')) {
    return 'mdi-music';
  }
  if (name.includes('tools') || name.includes('kit') || name.includes('thieves')) {
    return 'mdi-tools';
  }
  if (name.includes('holy symbol')) return 'mdi-cross';
  if (name.includes('arcane focus')) return 'mdi-wizard-hat';
  if (name.includes('druidcraft focus')) return 'mdi-leaf';
  if (name.includes('component pouch')) return 'mdi-bag-checked';
  if (name.includes('pack') && (name.includes('dungeoneer') || name.includes('explorer') ||
    name.includes('entertainer') || name.includes('priest') || name.includes('scholar') ||
    name.includes('burglar'))) {
    return 'mdi-bag-personal';
  }
  if (name.includes('arrow') || name.includes('bolt') || name.includes('ammunition')) {
    return 'mdi-arrow-projectile';
  }
  if (name.includes('costume') || name.includes('uniform') || name.includes('clothes') ||
    name.includes('vestments')) return 'mdi-tshirt-crew';
  if (name.includes('pouch') || name.includes('bag')) return 'mdi-wallet';
  if (name.includes('rope')) return 'mdi-rope';
  if (name.includes('torch') || name.includes('lantern')) return 'mdi-fire';
  if (name.includes('bedroll') || name.includes('blanket')) return 'mdi-bed';
  if (name.includes('rations') || name.includes('food')) return 'mdi-food';
  if (name.includes('waterskin') || name.includes('water') || name.includes('flask')) return 'mdi-bottle-water';
  if (name.includes('book') || name.includes('tome') || name.includes('scroll') ||
    name.includes('parchment') || name.includes('paper')) return 'mdi-book-open';
  if (name.includes('ink') || name.includes('pen') || name.includes('quill')) return 'mdi-pen';
  if (name.includes('candle') || name.includes('oil') || name.includes('tinderbox')) return 'mdi-candle';
  if (name.includes('hammer') || name.includes('crowbar') || name.includes('piton')) return 'mdi-hammer';
  if (name.includes('shovel')) return 'mdi-shovel';
  if (name.includes('bell')) return 'mdi-bell';
  if (name.includes('string') || name.includes('twine')) return 'mdi-string-lights';
  if (name.includes('sand')) return 'mdi-grain';
  if (name.includes('knife') && !name.includes('dagger')) return 'mdi-knife';
  if (name.includes('mess kit') || name.includes('mess')) return 'mdi-silverware';
  if (name.includes('censer') || name.includes('incense')) return 'mdi-incense';
  if (name.includes('alms') || name.includes('coin') || name.includes('money')) return 'mdi-coins';
  if (name.includes('deck') || name.includes('cards')) return 'mdi-cards-playing';
  if (name.includes('signet ring') || name.includes('ring')) return 'mdi-ring';
  if (name.includes('scroll of pedigree') || name.includes('pedigree')) return 'mdi-script-text';

  return 'mdi-package-variant'; // Default icon for other items
};

// Enhanced color function based on equipment type
const getEquipmentTypeColor = (itemName, source = null) => {
  if (!itemName) return source ? getInventoryItemColor(source) : 'grey';

  const tooltip = getEquipmentTooltip(itemName);

  // Debug logging for bagpipes specifically
  if (itemName.toLowerCase().includes('bagpipes')) {
    console.log('DEBUG: Bagpipes color check - itemName:', itemName, 'tooltip:', tooltip, 'source:', source);
  }

  // Use tooltip type for accurate categorization
  if (tooltip?.type) {
    const type = tooltip.type.toLowerCase();

    // Debug logging for bagpipes
    if (itemName.toLowerCase().includes('bagpipes')) {
      console.log('DEBUG: Bagpipes tooltip type:', type);
    }

    if (type.includes('heavy armor')) return 'red-darken-1';
    if (type.includes('medium armor')) return 'orange-darken-1';
    if (type.includes('light armor')) return 'yellow-darken-1';
    if (type.includes('shield')) return 'blue-darken-1'; // Shields get their own distinct color
    if (type.includes('weapon')) return 'purple-darken-1'; // All weapons same color
    if (type.includes('musical instrument')) return 'purple-lighten-1'; // Musical instruments get light purple
    if (type.includes('tool')) return 'green-darken-1';
    if (type.includes('equipment pack')) return 'brown-darken-1';
    if (type.includes('adventuring gear')) return 'cyan-darken-1';
    if (type.includes('divine focus')) return 'amber-darken-1'; // Holy symbols and divine focuses
    if (type.includes('arcane focus')) return 'indigo-darken-1'; // Arcane focuses like crystal orbs
    if (type.includes('druidcraft focus') || type.includes('druidic focus')) return 'light-green-darken-1'; // Druidcraft focuses
    if (type.includes('spellcasting focus')) return 'teal-darken-1'; // Component pouches and other generic focuses
  }

  // Fallback to name-based color assignment for items without proper tooltips
  const name = itemName.toLowerCase();

  // Weapons - check for specific weapon names first
  if (name.includes('sword') || name.includes('axe') || name.includes('bow') ||
    name.includes('dagger') || name.includes('mace') || name.includes('hammer') ||
    name.includes('spear') || name.includes('javelin') || name.includes('maul') ||
    name.includes('whip') || name.includes('rapier') || name.includes('scimitar') ||
    name.includes('pike') || name.includes('halberd') || name.includes('glaive') ||
    name.includes('crossbow') || name.includes('club') || name.includes('quarterstaff') ||
    name.includes('sling') || name.includes('dart') || name.includes('trident') ||
    name.includes('lance') || name.includes('morningstar') || name.includes('flail') ||
    name.includes('warhammer') || name.includes('battleaxe') || name.includes('greataxe') ||
    name.includes('greatsword') || name.includes('longsword') || name.includes('shortsword')) {
    return 'purple-darken-1'; // All weapons get purple color
  }

  // Ammunition
  if (name.includes('arrow') || name.includes('bolt') || name.includes('ammunition')) {
    return 'grey-darken-2';
  }

  // Clothing and costumes
  if (name.includes('costume') || name.includes('uniform') || name.includes('clothes') ||
    name.includes('vestments')) {
    return 'pink-darken-1';
  }

  // Containers and bags
  if ((name.includes('pouch') || name.includes('bag')) && !name.includes('pack')) {
    return 'deep-orange-darken-1';
  }

  // Consumables and supplies
  if (name.includes('rations') || name.includes('food') || name.includes('candle') ||
    name.includes('oil') || name.includes('rope') || name.includes('torch')) {
    return 'lime-darken-1';
  }

  // Books and writing materials
  if (name.includes('book') || name.includes('ink') || name.includes('pen') ||
    name.includes('parchment') || name.includes('scroll')) {
    return 'blue-grey-darken-1';
  }

  // Jewelry and noble items
  if (name.includes('signet ring') || name.includes('ring') || name.includes('jewelry')) {
    return 'amber-darken-1'; // Gold/amber for jewelry
  }

  // Tools and artisan supplies
  if (name.includes('tools') || name.includes('supplies') || name.includes('kit') ||
    name.includes('shovel') || name.includes('smith') || name.includes('brewer') ||
    name.includes('carpenter') || name.includes('leatherworker') || name.includes('mason') ||
    name.includes('potter') || name.includes('weaver') || name.includes('woodcarver')) {
    return 'green-darken-1';
  }

  // Musical instruments
  if (name.includes('instrument') || name.includes('lute') || name.includes('flute') ||
    name.includes('drum') || name.includes('horn') || name.includes('viol') ||
    name.includes('lyre') || name.includes('shawm') || name.includes('pan flute') ||
    name.includes('dulcimer') || name.includes('bagpipes')) {

    // Debug logging for bagpipes
    if (name.includes('bagpipes')) {
      console.log('DEBUG: Bagpipes matched musical instruments section, returning purple-lighten-1');
    }

    return 'purple-lighten-1'; // Light purple for musical instruments
  }

  // Gaming and entertainment items
  if (name.includes('deck') || name.includes('cards') || name.includes('dice') ||
    name.includes('game')) {
    return 'red-lighten-1';
  }

  // Fallback to source-based coloring
  const finalColor = source ? getInventoryItemColor(source) : 'grey';

  // Debug logging for bagpipes
  if (itemName.toLowerCase().includes('bagpipes')) {
    console.log('DEBUG: Bagpipes fallback color:', finalColor, 'source:', source);
  }

  return finalColor;
};

// Modal state
const showInventoryModal = ref(false)
const addWeaponDialog = ref(false)
const addArmorDialog = ref(false)
const addGearDialog = ref(false)

// Quantity selection state
const quantityDialog = ref(false)
const selectedItem = ref(null)
const selectedQuantity = ref(1)

// Alternative selection state
const weaponAlternativesDialog = ref(false)
const armorAlternativesDialog = ref(false)
const musicalInstrumentDialog = ref(false)
const artisanToolsDialog = ref(false)
const currentItemToReplace = ref(null)
const alternativeItems = ref([])
const musicalInstruments = ref([])

// Weapon category selection state
const weaponCategoryDialog = ref(false)
const weaponSelectionTitle = ref('')

// Equipment tooltip data for common D&D 5e items
const equipmentTooltips = ref({
  // Armor
  'chainmail': {
    type: 'Heavy Armor',
    ac: '16',
    cost: '75 gp',
    weight: '55 lbs',
    properties: 'Stealth Disadvantage',
    description: 'Made of interlocking metal rings. The suit includes gauntlets.'
  },
  'chain mail': {
    type: 'Heavy Armor',
    ac: '16',
    cost: '75 gp',
    weight: '55 lbs',
    properties: 'Stealth Disadvantage',
    description: 'Made of interlocking metal rings. The suit includes gauntlets.'
  },
  'leather armor': {
    type: 'Light Armor',
    ac: '11 + Dex modifier',
    cost: '10 gp',
    weight: '10 lbs',
    properties: 'None',
    description: 'The breastplate and shoulder protectors of this armor are made of leather that has been stiffened by being boiled in oil.'
  },
  'leather': {
    type: 'Light Armor',
    ac: '11 + Dex modifier',
    cost: '10 gp',
    weight: '10 lbs',
    properties: 'None',
    description: 'The breastplate and shoulder protectors of this armor are made of leather that has been stiffened by being boiled in oil.'
  },
  'scale mail': {
    type: 'Medium Armor',
    ac: '14 + Dex modifier (max 2)',
    cost: '50 gp',
    weight: '45 lbs',
    properties: 'Stealth Disadvantage',
    description: 'This armor consists of a coat and leggings of leather covered with overlapping pieces of metal.'
  },
  'studded leather': {
    type: 'Light Armor',
    ac: '12 + Dex modifier',
    cost: '45 gp',
    weight: '13 lbs',
    properties: 'None',
    description: 'Made from tough but flexible leather, studded leather is reinforced with close-set rivets or spikes.'
  },
  'padded': {
    type: 'Light Armor',
    ac: '11 + Dex modifier',
    cost: '5 gp',
    weight: '8 lbs',
    properties: 'Stealth Disadvantage',
    description: 'Padded armor consists of quilted layers of cloth and batting.'
  },
  'hide': {
    type: 'Medium Armor',
    ac: '12 + Dex modifier (max 2)',
    cost: '10 gp',
    weight: '12 lbs',
    properties: 'None',
    description: 'This crude armor consists of thick furs and pelts. It is commonly worn by barbarian tribes.'
  },
  'shield': {
    type: 'Shield',
    ac: '+2',
    cost: '10 gp',
    weight: '6 lbs',
    properties: 'None',
    description: 'A shield is made from wood or metal and is carried in one hand. Wielding a shield increases your Armor Class by 2.'
  },
  'ring mail': {
    type: 'Heavy Armor',
    ac: '14',
    cost: '30 gp',
    weight: '40 lbs',
    properties: 'Stealth Disadvantage',
    description: 'This armor is leather armor with heavy rings sewn into it.'
  },
  'splint': {
    type: 'Heavy Armor',
    ac: '17',
    cost: '200 gp',
    weight: '60 lbs',
    properties: 'Stealth Disadvantage',
    description: 'This armor is made of narrow vertical strips of metal riveted to a backing of leather.'
  },

  // Weapons - Melee
  'longsword': {
    type: 'Martial Melee Weapon',
    damage: '1d8 slashing',
    cost: '15 gp',
    weight: '3 lbs',
    properties: 'Versatile (1d10)',
    description: 'A standard long blade weapon favored by many warriors.'
  },
  'shortsword': {
    type: 'Martial Melee Weapon',
    damage: '1d6 piercing',
    cost: '10 gp',
    weight: '2 lbs',
    properties: 'Finesse, Light',
    description: 'A short blade that is quick and nimble to use.'
  },
  'rapier': {
    type: 'Martial Melee Weapon',
    damage: '1d8 piercing',
    cost: '25 gp',
    weight: '2 lbs',
    properties: 'Finesse',
    description: 'A slender, sharply pointed sword ideal for thrusting attacks.'
  },
  'scimitar': {
    type: 'Martial Melee Weapon',
    damage: '1d6 slashing',
    cost: '25 gp',
    weight: '3 lbs',
    properties: 'Finesse, Light',
    description: 'A curved blade weapon that is both quick and deadly.'
  },
  'dagger': {
    type: 'Simple Melee Weapon',
    damage: '1d4 piercing',
    cost: '2 gp',
    weight: '1 lb',
    properties: 'Finesse, Light, Thrown (range 20/60)',
    description: 'A simple, pointed blade. Can be thrown or used in melee.'
  },
  'handaxe': {
    type: 'Simple Melee Weapon',
    damage: '1d6 slashing',
    cost: '5 gp',
    weight: '2 lbs',
    properties: 'Light, Thrown (range 20/60)',
    description: 'A small axe that can be wielded in one hand or thrown.'
  },
  'spear': {
    type: 'Simple Melee Weapon',
    damage: '1d6 piercing',
    cost: '1 gp',
    weight: '3 lbs',
    properties: 'Thrown (range 20/60), Versatile (1d8)',
    description: 'A long weapon with a pointed head that can be thrust or thrown.'
  },
  'quarterstaff': {
    type: 'Simple Melee Weapon',
    damage: '1d6 bludgeoning',
    cost: '2 sp',
    weight: '4 lbs',
    properties: 'Versatile (1d8)',
    description: 'A simple staff weapon made from hardwood.'
  },
  'club': {
    type: 'Simple Melee Weapon',
    damage: '1d4 bludgeoning',
    cost: '1 sp',
    weight: '2 lbs',
    properties: 'Light',
    description: 'A simple wooden club or cudgel.'
  },
  'greatclub': {
    type: 'Simple Melee Weapon',
    damage: '1d8 bludgeoning',
    cost: '2 sp',
    weight: '10 lbs',
    properties: 'Two-handed',
    description: 'A larger, heavier club that requires two hands to wield effectively.'
  },
  'sickle': {
    type: 'Simple Melee Weapon',
    damage: '1d4 slashing',
    cost: '1 gp',
    weight: '2 lbs',
    properties: 'Light',
    description: 'A curved blade used for reaping crops, but effective as a light weapon.'
  },
  'mace': {
    type: 'Simple Melee Weapon',
    damage: '1d6 bludgeoning',
    cost: '5 gp',
    weight: '4 lbs',
    properties: 'None',
    description: 'A heavy weapon with a weighted head, effective against armor.'
  },
  'greataxe': {
    type: 'Martial Melee Weapon',
    damage: '1d12 slashing',
    cost: '30 gp',
    weight: '7 lbs',
    properties: 'Heavy, Two-handed',
    description: 'A massive two-handed axe favored by barbarians.'
  },
  'greatsword': {
    type: 'Martial Melee Weapon',
    damage: '2d6 slashing',
    cost: '50 gp',
    weight: '6 lbs',
    properties: 'Heavy, Two-handed',
    description: 'A massive two-handed sword with devastating power.'
  },
  'battleaxe': {
    type: 'Martial Melee Weapon',
    damage: '1d8 slashing',
    cost: '10 gp',
    weight: '4 lbs',
    properties: 'Versatile (1d10)',
    description: 'A one-handed axe that can be wielded with two hands for more damage.'
  },
  'flail': {
    type: 'Martial Melee Weapon',
    damage: '1d8 bludgeoning',
    cost: '10 gp',
    weight: '2 lbs',
    properties: 'None',
    description: 'A weapon with a heavy head connected to a handle by a chain or rope.'
  },
  'warhammer': {
    type: 'Martial Melee Weapon',
    damage: '1d8 bludgeoning',
    cost: '15 gp',
    weight: '2 lbs',
    properties: 'Versatile (1d10)',
    description: 'A balanced weapon with a heavy head, effective against armor.'
  },

  // Weapons - Ranged
  'light crossbow': {
    type: 'Simple Ranged Weapon',
    damage: '1d8 piercing',
    cost: '25 gp',
    weight: '5 lbs',
    properties: 'Ammunition (range 80/320), Loading, Two-handed',
    description: 'A smaller crossbow that is easier to use than heavy variants.'
  },
  'crossbow, light': {
    type: 'Simple Ranged Weapon',
    damage: '1d8 piercing',
    cost: '25 gp',
    weight: '5 lbs',
    properties: 'Ammunition (range 80/320), Loading, Two-handed',
    description: 'A smaller crossbow that is easier to use than heavy variants.'
  },
  'heavy crossbow': {
    type: 'Martial Ranged Weapon',
    damage: '1d10 piercing',
    cost: '50 gp',
    weight: '18 lbs',
    properties: 'Ammunition (range 100/400), Heavy, Loading, Two-handed',
    description: 'A powerful crossbow that requires strength to operate effectively.'
  },
  'crossbow, heavy': {
    type: 'Martial Ranged Weapon',
    damage: '1d10 piercing',
    cost: '50 gp',
    weight: '18 lbs',
    properties: 'Ammunition (range 100/400), Heavy, Loading, Two-handed',
    description: 'A powerful crossbow that requires strength to operate effectively.'
  },
  'javelin': {
    type: 'Simple Melee Weapon',
    damage: '1d6 piercing',
    cost: '5 sp',
    weight: '2 lbs',
    properties: 'Thrown (range 30/120)',
    description: 'A light spear designed for throwing.'
  },
  'shortbow': {
    type: 'Simple Ranged Weapon',
    damage: '1d6 piercing',
    cost: '25 gp',
    weight: '2 lbs',
    properties: 'Ammunition (range 80/320), Two-handed',
    description: 'A flexible bow suitable for hunting and combat.'
  },
  'longbow': {
    type: 'Martial Ranged Weapon',
    damage: '1d8 piercing',
    cost: '50 gp',
    weight: '2 lbs',
    properties: 'Ammunition (range 150/600), Heavy, Two-handed',
    description: 'A tall bow with exceptional range and power.'
  },
  'dart': {
    type: 'Simple Ranged Weapon',
    damage: '1d4 piercing',
    cost: '5 cp',
    weight: '1/4 lb',
    properties: 'Finesse, Thrown (range 20/60)',
    description: 'A small thrown weapon with a weighted point.'
  },
  'sling': {
    type: 'Simple Ranged Weapon',
    damage: '1d4 bludgeoning',
    cost: '1 sp',
    weight: '—',
    properties: 'Ammunition (range 30/120)',
    description: 'A simple weapon used to hurl stones or bullets.'
  },

  // Shields
  'shield': {
    type: 'Shield',
    ac: '+2 AC',
    cost: '10 gp',
    weight: '6 lbs',
    properties: 'None',
    description: 'A shield is made from wood or metal and is carried in one hand.'
  },

  // Tools and Equipment
  'thieves\' tools': {
    type: 'Tool',
    cost: '25 gp',
    weight: '1 lb',
    properties: 'None',
    description: 'A set of tools for picking locks and disarming traps.'
  },
  'musical instrument': {
    type: 'Tool',
    cost: 'Varies',
    weight: 'Varies',
    properties: 'None',
    description: 'An instrument used to create music. Choose a specific type.'
  },
  'bagpipes': {
    type: 'Musical Instrument',
    cost: '30 gp',
    weight: '6 lbs',
    properties: 'None',
    description: 'A musical instrument consisting of a bag and pipes, producing sound when air is blown through.'
  },
  'lute': {
    type: 'Musical Instrument',
    cost: '35 gp',
    weight: '2 lbs',
    properties: 'None',
    description: 'A stringed musical instrument with a long neck and rounded body.'
  },
  'drum': {
    type: 'Musical Instrument',
    cost: '6 gp',
    weight: '3 lbs',
    properties: 'None',
    description: 'A percussion instrument consisting of a skin stretched over a circular frame.'
  },
  'flute': {
    type: 'Musical Instrument',
    cost: '2 gp',
    weight: '1 lb',
    properties: 'None',
    description: 'A woodwind instrument producing sound by blowing air across an opening.'
  },
  'smith\'s tools': {
    type: 'Artisan\'s Tools',
    cost: '20 gp',
    weight: '8 lbs',
    properties: 'None',
    description: 'Tools for working metal, including hammers, tongs, and anvil.'
  },
  'brewer\'s supplies': {
    type: 'Artisan\'s Tools',
    cost: '20 gp',
    weight: '9 lbs',
    properties: 'None',
    description: 'Equipment for brewing ales, beers, and other fermented beverages.'
  },
  'carpenter\'s tools': {
    type: 'Artisan\'s Tools',
    cost: '8 gp',
    weight: '6 lbs',
    properties: 'None',
    description: 'Tools for shaping and joining wood, including saws, chisels, and planes.'
  },
  'leatherworker\'s tools': {
    type: 'Artisan\'s Tools',
    cost: '5 gp',
    weight: '5 lbs',
    properties: 'None',
    description: 'Tools for working leather, including knives, needles, and awls.'
  },
  'mason\'s tools': {
    type: 'Artisan\'s Tools',
    cost: '10 gp',
    weight: '8 lbs',
    properties: 'None',
    description: 'Tools for working stone, including chisels, hammers, and trowels.'
  },
  'potter\'s tools': {
    type: 'Artisan\'s Tools',
    cost: '10 gp',
    weight: '3 lbs',
    properties: 'None',
    description: 'Tools for shaping clay, including a potter\'s wheel and firing supplies.'
  },
  'weaver\'s tools': {
    type: 'Artisan\'s Tools',
    cost: '1 gp',
    weight: '5 lbs',
    properties: 'None',
    description: 'Tools for making cloth, including looms, spindles, and needles.'
  },
  'woodcarver\'s tools': {
    type: 'Artisan\'s Tools',
    cost: '1 gp',
    weight: '5 lbs',
    properties: 'None',
    description: 'Tools for carving wood, including knives, gouges, and small saws.'
  },
  'shovel': {
    type: 'Tool',
    cost: '2 gp',
    weight: '5 lbs',
    properties: 'None',
    description: 'A simple tool for digging. Essential for any folk hero\'s work.'
  },
  'herbalism kit': {
    type: 'Tool',
    cost: '5 gp',
    weight: '3 lbs',
    properties: 'None',
    description: 'A kit containing herbs and supplies for creating remedies.'
  },
  'holy symbol': {
    type: 'Divine Focus',
    cost: '5 gp',
    weight: '1 lb',
    properties: 'Spellcasting Focus',
    description: 'A representation of a deity or divine force. Required as a spellcasting focus for clerics and paladins to cast spells with material components.'
  },
  'arcane focus': {
    type: 'Arcane Focus',
    cost: '20 gp',
    weight: '2 lbs',
    properties: 'Spellcasting Focus',
    description: 'A crystal, wand, staff, or other item used to channel arcane magic. Required for sorcerers, wizards, and warlocks to cast spells with material components.'
  },
  'druidcraft focus': {
    type: 'Druidic Focus',
    cost: '10 gp',
    weight: '1 lb',
    properties: 'Spellcasting Focus',
    description: 'A sprig of mistletoe, yew wand, staff, totem, or other focus infused with the power of nature. Required for druids to cast spells with material components.'
  },
  'component pouch': {
    type: 'Spellcasting Focus',
    cost: '25 gp',
    weight: '2 lbs',
    properties: 'Spellcasting Focus',
    description: 'A small, watertight leather belt pouch containing material components for spellcasting. Can be used by any spellcaster as an alternative to other focuses.'
  },
  'spellbook': {
    type: 'Spellcasting Focus',
    cost: '50 gp',
    weight: '3 lbs',
    properties: 'Spellbook',
    description: 'A leather-bound tome containing magical formulas and spell inscriptions. Essential for wizards to prepare and cast spells. Contains space for 100 spells.'
  },

  // Common Adventuring Gear
  'backpack': {
    type: 'Adventuring Gear',
    cost: '2 gp',
    weight: '5 lbs',
    properties: 'None',
    description: 'A sturdy canvas backpack for carrying equipment.'
  },
  'bedroll': {
    type: 'Adventuring Gear',
    cost: '1 gp',
    weight: '7 lbs',
    properties: 'None',
    description: 'A cloth and leather sleeping bag for resting outdoors.'
  },
  'rope, hempen (50 feet)': {
    type: 'Adventuring Gear',
    cost: '2 gp',
    weight: '10 lbs',
    properties: 'None',
    description: 'Sturdy rope useful for climbing and securing items.'
  },
  'costume': {
    type: 'Adventuring Gear',
    cost: '5 gp',
    weight: '4 lbs',
    properties: 'None',
    description: 'An outfit appropriate for a specific profession or role, used for disguise or performance.'
  },
  'belt pouch': {
    type: 'Adventuring Gear',
    cost: '5 sp',
    weight: '1 lb',
    properties: 'None',
    description: 'A small cloth or leather pouch that can hold up to 20 sling bullets or 50 blowgun needles, among other things.'
  },

  // Equipment Packs
  'dungeoneer\'s pack': {
    type: 'Equipment Pack',
    cost: '12 gp',
    weight: '61.5 lbs',
    properties: 'None',
    description: 'Contains: Backpack, Crowbar, Hammer, 10 Pitons, 10 Torches, Tinderbox, 10 days of Rations, Waterskin, 50 feet of Hempen Rope. The pack is strapped to a backpack.',
    contents: ['Backpack', 'Crowbar', 'Hammer', '10 Pitons', '10 Torches', 'Tinderbox', '10 days of Rations', 'Waterskin', '50 feet of Hempen Rope']
  },
  'dungeoneers pack': {
    type: 'Equipment Pack',
    cost: '12 gp',
    weight: '61.5 lbs',
    properties: 'None',
    description: 'Contains: Backpack, Crowbar, Hammer, 10 Pitons, 10 Torches, Tinderbox, 10 days of Rations, Waterskin, 50 feet of Hempen Rope. The pack is strapped to a backpack.',
    contents: ['Backpack', 'Crowbar', 'Hammer', '10 Pitons', '10 Torches', 'Tinderbox', '10 days of Rations', 'Waterskin', '50 feet of Hempen Rope']
  },
  'explorer\'s pack': {
    type: 'Equipment Pack',
    cost: '10 gp',
    weight: '59 lbs',
    properties: 'None',
    description: 'Contains: Backpack, Bedroll, Mess Kit, Tinderbox, 10 Torches, 10 days of Rations, Waterskin, 50 feet of Hempen Rope. The pack is strapped to a backpack.',
    contents: ['Backpack', 'Bedroll', 'Mess Kit', 'Tinderbox', '10 Torches', '10 days of Rations', 'Waterskin', '50 feet of Hempen Rope']
  },
  'explorers pack': {
    type: 'Equipment Pack',
    cost: '10 gp',
    weight: '59 lbs',
    properties: 'None',
    description: 'Contains: Backpack, Bedroll, Mess Kit, Tinderbox, 10 Torches, 10 days of Rations, Waterskin, 50 feet of Hempen Rope. The pack is strapped to a backpack.',
    contents: ['Backpack', 'Bedroll', 'Mess Kit', 'Tinderbox', '10 Torches', '10 days of Rations', 'Waterskin', '50 feet of Hempen Rope']
  },
  'entertainer\'s pack': {
    type: 'Equipment Pack',
    cost: '40 gp',
    weight: '38 lbs',
    properties: 'None',
    description: 'Contains: Backpack, Bedroll, 2 Costumes, 5 Candles, 5 days of Rations, Waterskin, Disguise Kit. The pack is strapped to a backpack.',
    contents: ['Backpack', 'Bedroll', '2 Costumes', '5 Candles', '5 days of Rations', 'Waterskin', 'Disguise Kit']
  },
  'entertainers pack': {
    type: 'Equipment Pack',
    cost: '40 gp',
    weight: '38 lbs',
    properties: 'None',
    description: 'Contains: Backpack, Bedroll, 2 Costumes, 5 Candles, 5 days of Rations, Waterskin, Disguise Kit. The pack is strapped to a backpack.',
    contents: ['Backpack', 'Bedroll', '2 Costumes', '5 Candles', '5 days of Rations', 'Waterskin', 'Disguise Kit']
  },
  'priest\'s pack': {
    type: 'Equipment Pack',
    cost: '19 gp',
    weight: '24 lbs',
    properties: 'None',
    description: 'Contains: Backpack, Blanket, 10 Candles, Tinderbox, Alms Box, 2 blocks of Incense, Censer, Vestments, 2 days of Rations, Waterskin. The pack is strapped to a backpack.',
    contents: ['Backpack', 'Blanket', '10 Candles', 'Tinderbox', 'Alms Box', '2 blocks of Incense', 'Censer', 'Vestments', '2 days of Rations', 'Waterskin']
  },
  'priests pack': {
    type: 'Equipment Pack',
    cost: '19 gp',
    weight: '24 lbs',
    properties: 'None',
    description: 'Contains: Backpack, Blanket, 10 Candles, Tinderbox, Alms Box, 2 blocks of Incense, Censer, Vestments, 2 days of Rations, Waterskin. The pack is strapped to a backpack.',
    contents: ['Backpack', 'Blanket', '10 Candles', 'Tinderbox', 'Alms Box', '2 blocks of Incense', 'Censer', 'Vestments', '2 days of Rations', 'Waterskin']
  },
  'scholar\'s pack': {
    type: 'Equipment Pack',
    cost: '40 gp',
    weight: '10 lbs',
    properties: 'None',
    description: 'Contains: Backpack, Book of Lore, Bottle of Ink, Ink Pen, 10 sheets of Parchment, Little bag of Sand, Small Knife. The pack is strapped to a backpack.',
    contents: ['Backpack', 'Book of Lore', 'Bottle of Ink', 'Ink Pen', '10 sheets of Parchment', 'Little bag of Sand', 'Small Knife']
  },
  'scholars pack': {
    type: 'Equipment Pack',
    cost: '40 gp',
    weight: '10 lbs',
    properties: 'None',
    description: 'Contains: Backpack, Book of Lore, Bottle of Ink, Ink Pen, 10 sheets of Parchment, Little bag of Sand, Small Knife. The pack is strapped to a backpack.',
    contents: ['Backpack', 'Book of Lore', 'Bottle of Ink', 'Ink Pen', '10 sheets of Parchment', 'Little bag of Sand', 'Small Knife']
  },
  'burglar\'s pack': {
    type: 'Equipment Pack',
    cost: '16 gp',
    weight: '46.5 lbs',
    properties: 'None',
    description: 'Contains: Backpack, Ball bearings (bag of 1,000), 10 feet of String, Bell, 5 Candles, Crowbar, Hammer, 10 Pitons, Hooded Lantern, 2 flasks of Oil, 5 days Rations, Tinderbox, Waterskin, 50 feet of Hempen Rope. The pack is strapped to a backpack.',
    contents: ['Backpack', 'Ball bearings (1,000)', '10 feet of String', 'Bell', '5 Candles', 'Crowbar', 'Hammer', '10 Pitons', 'Hooded Lantern', '2 flasks of Oil', '5 days Rations', 'Tinderbox', 'Waterskin', '50 feet of Hempen Rope']
  },
  'burglars pack': {
    type: 'Equipment Pack',
    cost: '16 gp',
    weight: '46.5 lbs',
    properties: 'None',
    description: 'Contains: Backpack, Ball bearings (bag of 1,000), 10 feet of String, Bell, 5 Candles, Crowbar, Hammer, 10 Pitons, Hooded Lantern, 2 flasks of Oil, 5 days Rations, Tinderbox, Waterskin, 50 feet of Hempen Rope. The pack is strapped to a backpack.',
    contents: ['Backpack', 'Ball bearings (1,000)', '10 feet of String', 'Bell', '5 Candles', 'Crowbar', 'Hammer', '10 Pitons', 'Hooded Lantern', '2 flasks of Oil', '5 days Rations', 'Tinderbox', 'Waterskin', '50 feet of Hempen Rope']
  },
  'diplomat\'s pack': {
    type: 'Equipment Pack',
    cost: '39 gp',
    weight: '8 lbs',
    properties: 'None',
    description: 'Contains: Chest, 2 cases for maps and scrolls, Set of fine clothes, Bottle of ink, Ink pen, Lamp, 2 flasks of oil, 5 sheets of paper, Vial of perfume, Sealing wax, Soap. The pack is strapped to a backpack.',
    contents: ['Chest', '2 cases for maps and scrolls', 'Set of fine clothes', 'Bottle of ink', 'Ink pen', 'Lamp', '2 flasks of oil', '5 sheets of paper', 'Vial of perfume', 'Sealing wax', 'Soap']
  },
  'diplomats pack': {
    type: 'Equipment Pack',
    cost: '39 gp',
    weight: '8 lbs',
    properties: 'None',
    description: 'Contains: Chest, 2 cases for maps and scrolls, Set of fine clothes, Bottle of ink, Ink pen, Lamp, 2 flasks of oil, 5 sheets of paper, Vial of perfume, Sealing wax, Soap. The pack is strapped to a backpack.',
    contents: ['Chest', '2 cases for maps and scrolls', 'Set of fine clothes', 'Bottle of ink', 'Ink pen', 'Lamp', '2 flasks of oil', '5 sheets of paper', 'Vial of perfume', 'Sealing wax', 'Soap']
  },

  // Ammunition
  'arrow': {
    type: 'Ammunition',
    cost: '1 gp (20)',
    weight: '1 lb (20)',
    properties: 'Ammunition',
    description: 'Arrows designed for use with longbows and shortbows. Sold in bundles of 20.'
  },
  'crossbow bolt': {
    type: 'Ammunition',
    cost: '1 gp (20)',
    weight: '1.5 lbs (20)',
    properties: 'Ammunition',
    description: 'Bolts designed for use with crossbows. Sold in bundles of 20.'
  },

  // Consumables and Supplies
  'rations': {
    type: 'Adventuring Gear',
    cost: '2 gp',
    weight: '2 lbs',
    properties: 'Consumable',
    description: 'Dry foods suitable for extended travel, including jerky, dried fruit, hardtack, and nuts. One day\'s worth of food.'
  },
  'waterskin': {
    type: 'Adventuring Gear',
    cost: '2 gp',
    weight: '5 lbs (full)',
    properties: 'Container',
    description: 'A leather container that holds 4 pints of liquid.'
  },
  'torch': {
    type: 'Adventuring Gear',
    cost: '1 cp',
    weight: '1 lb',
    properties: 'Light',
    description: 'Burns for 1 hour, providing bright light in a 20-foot radius and dim light for an additional 20 feet.'
  },
  'rope': {
    type: 'Adventuring Gear',
    cost: '2 gp',
    weight: '10 lbs',
    properties: 'None',
    description: '50 feet of hempen rope. Has 2 hit points and can be burst with a DC 17 Strength check.'
  },
  'bedroll': {
    type: 'Adventuring Gear',
    cost: '1 gp',
    weight: '7 lbs',
    properties: 'None',
    description: 'Consists of bedding and a blanket. As thick as a mattress, it can be rolled up and tied.'
  },
  'mess kit': {
    type: 'Adventuring Gear',
    cost: '2 sp',
    weight: '1 lb',
    properties: 'None',
    description: 'A tin box containing a cup and simple cutlery. The box clamps together, and one side can be used as a cooking pan and the other as a plate or shallow bowl.'
  },
  'tinderbox': {
    type: 'Adventuring Gear',
    cost: '5 sp',
    weight: '1 lb',
    properties: 'None',
    description: 'Contains flint, fire steel, and tinder (usually dry cloth soaked in light oil) used to kindle a fire.'
  },
  'candle': {
    type: 'Adventuring Gear',
    cost: '1 cp',
    weight: '—',
    properties: 'Light',
    description: 'Burns for 1 hour, providing bright light in a 5-foot radius and dim light for an additional 5 feet.'
  },

  // Clothing and Costumes
  'uniform': {
    type: 'Clothing',
    cost: '2 gp',
    weight: '4 lbs',
    properties: 'None',
    description: 'Represents the official attire of a particular organization, guild, or military unit. Provides identity and belonging.'
  },
  'costume': {
    type: 'Clothing',
    cost: '5 gp',
    weight: '4 lbs',
    properties: 'None',
    description: 'Elaborate clothing designed for entertainment, disguise, or ceremonial purposes. Popular among performers and entertainers.'
  },
  'vestments': {
    type: 'Clothing',
    cost: '5 gp',
    weight: '6 lbs',
    properties: 'Sacred',
    description: 'Ceremonial garments worn by religious figures during worship and sacred rituals. Often embroidered with holy symbols.'
  },
  'common clothes': {
    type: 'Clothing',
    cost: '5 sp',
    weight: '3 lbs',
    properties: 'None',
    description: 'Simple, practical clothing worn by common folk. Includes basic garments suitable for everyday work and activities.'
  },

  // Gaming and Entertainment
  'deck of cards': {
    type: 'Gaming Set',
    cost: '5 sp',
    weight: '—',
    properties: 'Gaming Set',
    description: 'A standard deck of playing cards used for various card games. Popular in taverns and among travelers for entertainment.'
  },
  'playing cards': {
    type: 'Gaming Set',
    cost: '5 sp',
    weight: '—',
    properties: 'Gaming Set',
    description: 'A standard deck of playing cards used for various card games. Popular in taverns and among travelers for entertainment.'
  },
  'dice set': {
    type: 'Gaming Set',
    cost: '1 sp',
    weight: '—',
    properties: 'Gaming Set',
    description: 'A set of dice used for various games of chance. Includes multiple dice of different shapes and sizes.'
  },

  // Religious Items
  'censer': {
    type: 'Religious Item',
    cost: '5 gp',
    weight: '2 lbs',
    properties: 'Sacred',
    description: 'A metal container used to burn incense during religious ceremonies. Often swung on chains to spread fragrant smoke.'
  },
  'incense': {
    type: 'Religious Item',
    cost: '1 gp',
    weight: '—',
    properties: 'Sacred, Consumable',
    description: 'Aromatic substances burned during religious ceremonies. Each block burns for about 1 hour and produces fragrant smoke.'
  },
  'alms box': {
    type: 'Religious Item',
    cost: '2 gp',
    weight: '2 lbs',
    properties: 'Container',
    description: 'A small locked box used to collect donations for charitable purposes. Often found in temples and carried by clerics.'
  },

  // Tools and Utility Items
  'crowbar': {
    type: 'Tool',
    cost: '5 gp',
    weight: '5 lbs',
    properties: 'None',
    description: 'Using a crowbar grants advantage to Strength checks where the crowbar\'s leverage can be applied.'
  },
  'hammer': {
    type: 'Tool',
    cost: '1 gp',
    weight: '3 lbs',
    properties: 'Light',
    description: 'A simple tool with a weighted head and handle, used for construction and as an improvised weapon.'
  },
  'piton': {
    type: 'Tool',
    cost: '5 cp',
    weight: '1/4 lb',
    properties: 'None',
    description: 'A metal spike driven into rock or ice to support a rope. Essential for climbing and mountaineering.'
  },
  'bell': {
    type: 'Adventuring Gear',
    cost: '1 gp',
    weight: '—',
    properties: 'None',
    description: 'A small bell that can be attached to objects or creatures to provide audible alerts.'
  },
  'string': {
    type: 'Adventuring Gear',
    cost: '1 sp',
    weight: '—',
    properties: 'None',
    description: 'Thin cord useful for tying, binding, or creating simple traps and alarms.'
  },
  'little bag of sand': {
    type: 'Adventuring Gear',
    cost: '1 sp',
    weight: '1 lb',
    properties: 'None',
    description: 'A small pouch filled with fine sand, often used for drying ink, improving grip, or revealing invisible writing.'
  },
  'small knife': {
    type: 'Tool',
    cost: '1 gp',
    weight: '1/2 lb',
    properties: 'Light, Finesse',
    description: 'A small utility blade useful for cutting, carving, and various crafting tasks. Not designed for combat.'
  },
  'book of lore': {
    type: 'Adventuring Gear',
    cost: '25 gp',
    weight: '5 lbs',
    properties: 'Knowledge',
    description: 'A tome containing historical accounts, cultural knowledge, and scholarly research. Useful for research and reference.'
  },
  'bottle of ink': {
    type: 'Adventuring Gear',
    cost: '10 gp',
    weight: '—',
    properties: 'Writing Supply',
    description: 'A small bottle containing black ink for writing. Contains enough ink for several documents or spells.'
  },
  'ink pen': {
    type: 'Adventuring Gear',
    cost: '2 cp',
    weight: '—',
    properties: 'Writing Supply',
    description: 'A writing instrument with a metal nib, used with ink for writing documents, letters, and spell scrolls.'
  },
  'parchment': {
    type: 'Adventuring Gear',
    cost: '2 sp',
    weight: '—',
    properties: 'Writing Supply',
    description: 'A sheet of treated animal skin used for writing. Durable and suitable for important documents and spell scrolls.'
  },
  'lamp': {
    type: 'Adventuring Gear',
    cost: '5 sp',
    weight: '1 lb',
    properties: 'Light Source',
    description: 'A small oil lamp that burns for 6 hours on 1 pint of oil. Provides bright light in a 15-foot radius and dim light for an additional 30 feet.'
  },
  'sealing wax': {
    type: 'Adventuring Gear',
    cost: '5 sp',
    weight: '—',
    properties: 'Writing Supply',
    description: 'Wax used to seal letters and documents. Often imprinted with a signet ring for authentication.'
  },
  'vial of perfume': {
    type: 'Adventuring Gear',
    cost: '5 gp',
    weight: '—',
    properties: 'Social',
    description: 'A small bottle of fragrant oil used for personal hygiene and social occasions. Popular among nobles and entertainers.'
  },
  'chest': {
    type: 'Container',
    cost: '5 gp',
    weight: '25 lbs',
    properties: 'Storage',
    description: 'A sturdy wooden box with iron fittings and a lock. Can hold 12 cubic feet or 300 pounds of gear.'
  },
  'flask of oil': {
    type: 'Adventuring Gear',
    cost: '1 sp',
    weight: '1 lb',
    properties: 'Fuel',
    description: 'A flask containing lamp oil. Burns for 6 hours in a lamp or can be thrown as an improvised weapon.'
  },

  // Containers
  'backpack': {
    type: 'Adventuring Gear',
    cost: '2 gp',
    weight: '5 lbs',
    properties: 'Container',
    description: 'A leather pack carried on the back. Holds up to 1 cubic foot or 30 pounds of gear.'
  },
  'pouch': {
    type: 'Adventuring Gear',
    cost: '5 sp',
    weight: '1 lb',
    properties: 'Container',
    description: 'A small cloth or leather bag. Holds up to 20 sling bullets or 50 blowgun needles, among other things.'
  },
  'bag': {
    type: 'Adventuring Gear',
    cost: '1 gp',
    weight: '2 lbs',
    properties: 'Container',
    description: 'A simple sack or bag for carrying various items and supplies.'
  },

  // Noble Background Equipment
  'fine clothes': {
    type: 'Clothing',
    cost: '15 gp',
    weight: '6 lbs',
    properties: 'Social',
    description: 'Elegant clothing made from fine materials. Provides advantage on social interactions with nobles and wealthy merchants.'
  },
  'set of fine clothes': {
    type: 'Clothing',
    cost: '15 gp',
    weight: '6 lbs',
    properties: 'Social',
    description: 'Elegant clothing made from fine materials. Provides advantage on social interactions with nobles and wealthy merchants.'
  },
  'signet ring': {
    type: 'Jewelry',
    cost: '5 gp',
    weight: '0 lbs',
    properties: 'Noble Seal',
    description: 'A ring bearing your family crest or personal seal. Used to authenticate documents and identify your noble status.'
  },
  'scroll of pedigree': {
    type: 'Document',
    cost: '10 gp',
    weight: '0 lbs',
    properties: 'Legal Document',
    description: 'A formal document that traces your family lineage and establishes your noble heritage and rights.'
  }
})

// Function to get tooltip data for an equipment item
const getEquipmentTooltip = (itemName) => {
  if (!itemName) return null

  const cleanName = itemName.toLowerCase()
    .replace(/^\d+\s*x?\s*/i, '') // Remove quantity prefix like "2x" or "2 "
    .replace(/\s*x\d+$/i, '') // Remove quantity suffix like " x2"
    .replace(/\s*\(\w+\)$/i, '') // Remove parenthetical like " (longsword)"
    .trim()

  return equipmentTooltips.value[cleanName] || null
}
const weaponSelectionSubtitle = ref('')
const weaponSelectionCount = ref(1)
const selectedWeapons = ref([])
const availableWeaponsForSelection = ref([])
const currentWeaponChoice = ref({ choiceIndex: -1, optionIndex: -1 })

// Equipment method selection
const equipmentMethod = ref('package')

// Equipment choices state
const selectedEquipmentChoices = ref([]) // Array of selected option indices for each choice

// Watch for equipment method changes to initialize gold
watch(() => equipmentMethod.value, (newMethod) => {
  if (newMethod === 'gold') {
    // Initialize starting gold when gold method is selected
    characterStore.calculateStartingGold()

    // Force equipment data loading if not already loaded
    if (characterStore.equipmentData && characterStore.equipmentData.length > 0) {
      const categories = [...new Set(characterStore.equipmentData.map(item => item.category))]
    }
  } else if (newMethod === 'package') {
    // Set gold to 0 and clear purchased items when standard package is selected
    characterStore.character.coins.gp = 0
    purchasedItems.value = []
  }
})

// Load equipment data on component mount
onMounted(async () => {
  if (!characterStore.equipmentData || characterStore.equipmentData.length === 0) {
    await characterStore.loadEquipmentData()
  }
})

// Dynamic equipment data from character selections
const classStartingWeapons = computed(() => {
  if (!character.value) return [];

  console.log('classStartingWeapons - character.value:', character.value);
  console.log('classStartingWeapons - classDetails:', character.value.classDetails);

  // Try to get all weapons from classDetails.startingEquipment and classDetails.equipment
  let items = [];
  if (character.value.classDetails?.startingEquipment) {
    console.log('Found classDetails.startingEquipment:', character.value.classDetails.startingEquipment);
    items = items.concat(character.value.classDetails.startingEquipment);
  }
  if (character.value.classDetails?.equipment) {
    console.log('Found classDetails.equipment:', character.value.classDetails.equipment);
    items = items.concat(character.value.classDetails.equipment);
  }
  // Fallback to character.equipment
  if (items.length === 0 && character.value.equipment) {
    console.log('Using fallback character.equipment:', character.value.equipment);
    items = items.concat(character.value.equipment.filter(i => i.source === 'class'));
  }

  console.log('All items before filtering for weapons:', items);

  const weapons = items.filter(item => {
    const category = item.category?.toLowerCase() || '';
    const name = item.name?.toLowerCase() || '';
    const isWeapon = category.includes('weapon') || category.includes('simple') || category.includes('martial') ||
      item.weaponCategory || name.includes('dagger') || name.includes('sword') || name.includes('bow');
    if (isWeapon) console.log('Found weapon:', item);
    return isWeapon;
  }).map(item => ({
    ...item,
    name: item.name,
    damage_dice: item.damage?.dice || '1d6',
    damage_type: item.damage?.type || 'slashing',
    weapon_category: item.weaponCategory || 'Simple',
    weapon_range: item.weaponRange || 'Melee',
    cost: item.cost || { quantity: 0, unit: 'gp' },
    properties: item.properties || [],
  }));

  console.log('Final weapons:', weapons);
  return weapons;
});

const startingArmor = computed(() => {
  if (!character.value) return [];

  console.log('startingArmor - character.value:', character.value);
  console.log('startingArmor - classDetails:', character.value.classDetails);

  let items = [];
  if (character.value.classDetails?.startingEquipment) {
    console.log('Found classDetails.startingEquipment for armor:', character.value.classDetails.startingEquipment);
    items = items.concat(character.value.classDetails.startingEquipment);
  }
  if (character.value.classDetails?.equipment) {
    console.log('Found classDetails.equipment for armor:', character.value.classDetails.equipment);
    items = items.concat(character.value.classDetails.equipment);
  }
  if (items.length === 0 && character.value.equipment) {
    console.log('Using fallback character.equipment for armor:', character.value.equipment);
    items = items.concat(character.value.equipment.filter(i => i.source === 'class'));
  }

  console.log('All items before filtering for armor:', items);

  const armor = items.filter(item => {
    const category = item.category?.toLowerCase() || '';
    const name = item.name?.toLowerCase() || '';
    const isArmor = category.includes('armor') || item.armorCategory ||
      name.includes('armor') || name.includes('leather') || name.includes('mail') || name.includes('shield');
    if (isArmor) console.log('Found armor:', item);
    return isArmor;
  }).map(item => ({
    ...item,
    name: item.name,
    armor_class: item.armorClass || { base: 10 },
    armor_category: item.armorCategory || 'Light Armor',
    cost: item.cost || { quantity: 0, unit: 'gp' },
    stealth_disadvantage: item.stealthDisadvantage || false,
  }));

  console.log('Final armor:', armor);
  return armor;
});

const startingEquipmentPackage = computed(() => {
  if (!character.value) return [];
  let items = [];
  if (character.value.classDetails?.startingEquipment) {
    items = items.concat(character.value.classDetails.startingEquipment);
  }
  if (character.value.classDetails?.equipment) {
    items = items.concat(character.value.classDetails.equipment);
  }
  if (items.length === 0 && character.value.equipment) {
    items = items.concat(character.value.equipment.filter(i => i.source === 'class'));
  }
  return items.map(item => ({
    ...item,
    name: item.name,
    cost: item.cost || { quantity: 0, unit: 'gp' },
    quantity: item.quantity || 1,
  }));
});

// Background equipment must reflect live store state (prop may be stale)
const backgroundEquipment = computed(() => {
  const liveChar = characterStore.character; // always use store as source of truth
  if (!liveChar) return [];

  // Get all background equipment from character.equipment
  const equipmentItems = (liveChar.equipment || [])
    .filter(item => item && item.source === 'background')
    .map(item => ({
      ...item,
      name: item.name,
      cost: item.cost || { quantity: 0, unit: 'gp' },
      quantity: item.quantity || 1,
    }));

  // If we have background equipment in the equipment array, use that primarily
  if (equipmentItems.length > 0) {
    // Also check fallback for any items not yet added to equipment array
    const fallbackItems = [];

    if (liveChar.backgroundDetails?.startingEquipment) {
      liveChar.backgroundDetails.startingEquipment.forEach(fallbackItem => {
        // Only add fallback item if it's not already covered by equipment array
        const isAlreadyCovered = equipmentItems.some(equipItem => {
          const equipName = equipItem.name.toLowerCase();
          const fallbackName = fallbackItem.name.toLowerCase();

          // Exact match
          if (equipName === fallbackName) return true;

          // Check if a specific item replaces a generic one
          if (fallbackName.includes('musical instrument') && isSpecificMusicalInstrument(equipItem)) {
            return true;
          }

          if (fallbackName.includes('artisan') && isSpecificArtisanTool(equipItem)) {
            return true;
          }

          return false;
        });

        if (!isAlreadyCovered) {
          fallbackItems.push({
            ...fallbackItem,
            name: fallbackItem.name,
            cost: fallbackItem.cost || { quantity: 0, unit: 'gp' },
            quantity: fallbackItem.quantity || 1,
            source: 'background'
          });
        }
      });
    }

    return [...equipmentItems, ...fallbackItems];
  }

  // Fallback: get from backgroundDetails.startingEquipment if equipment array is empty
  if (liveChar.backgroundDetails?.startingEquipment) {
    return liveChar.backgroundDetails.startingEquipment.map(item => ({
      ...item,
      name: item.name,
      cost: item.cost || { quantity: 0, unit: 'gp' },
      quantity: item.quantity || 1,
      source: 'background' // Ensure source is set for consistency
    }));
  }

  return [];
})

// Computed property for background equipment that requires user choices
const backgroundEquipmentChoices = computed(() => {
  return backgroundEquipment.value.filter(item => {
    if (!item || !item.name) return false;

    const name = item.name.toLowerCase();

    // Only show items that require user choice/interaction
    return (
      // Musical instruments (generic or specific)
      name.includes('musical instrument') ||
      isSpecificMusicalInstrument(item) ||
      // Artisan's tools (generic or specific)
      name.includes('artisan') ||
      isSpecificArtisanTool(item) ||
      // Add other choice-based items here if needed
      isChoiceRequiredItem(item)
    );
  });
});

// Equipment choices from class starting equipment options
const equipmentChoices = computed(() => {
  // Check for both selectedClass and class properties
  const classInfo = character.value?.selectedClass || character.value?.class;
  console.log('equipmentChoices - classInfo:', classInfo);
  if (!classInfo) return [];

  // First try to get from API data
  if (character.value.classDetails?.startingEquipmentOptions && character.value.classDetails.startingEquipmentOptions.length > 0) {
    console.log('equipmentChoices - using API data:', character.value.classDetails.startingEquipmentOptions);
    const choices = character.value.classDetails.startingEquipmentOptions.map((choice, index) => {
      const parsed = parseEquipmentChoice(choice, index);
      console.log(`equipmentChoices - parsed choice ${index}:`, parsed);
      return parsed;
    });
    console.log('equipmentChoices - all parsed choices:', choices);
    return choices;
  }

  // Fallback to common D&D equipment choices by class
  const className = (typeof classInfo === 'string' ? classInfo : classInfo?.name)?.toLowerCase();
  console.log('equipmentChoices - using fallback for class:', className);
  const fallback = getFallbackEquipmentChoices(className);
  console.log('equipmentChoices - fallback choices:', fallback);
  return fallback;
});

// Fallback equipment choices for common classes
function getFallbackEquipmentChoices(className) {
  const commonChoices = {
    fighter: [
      {
        description: "Chain mail or leather armor, longbow, and 20 arrows",
        options: [
          {
            items: [
              { name: "Chain Mail", quantity: 1, description: "Heavy armor, AC 16", cost: { quantity: 75, unit: 'gp' } }
            ]
          },
          {
            items: [
              { name: "Leather Armor", quantity: 1, description: "Light armor, AC 11 + Dex modifier", cost: { quantity: 10, unit: 'gp' } },
              { name: "Longbow", quantity: 1, description: "Ranged weapon, 1d8 piercing", cost: { quantity: 50, unit: 'gp' } },
              { name: "Arrow", quantity: 20, description: "Ammunition for longbow", cost: { quantity: 1, unit: 'gp' } }
            ]
          }
        ]
      },
      {
        description: "A martial weapon and a shield or two martial weapons",
        options: [
          {
            category: "Martial Weapon",
            choose: 1,
            items: [
              { name: "Shield", quantity: 1, description: "+2 AC", cost: { quantity: 10, unit: 'gp' } }
            ]
          },
          {
            category: "Martial Weapon",
            choose: 2
          }
        ]
      },
      {
        description: "A light crossbow and 20 bolts or two handaxes",
        options: [
          {
            items: [
              { name: "Light Crossbow", quantity: 1, description: "Ranged weapon, 1d8 piercing" },
              { name: "Crossbow Bolt", quantity: 20, description: "Ammunition for crossbow" }
            ]
          },
          {
            items: [
              { name: "Handaxe", quantity: 2, description: "Simple weapon, 1d6 slashing, thrown" }
            ]
          }
        ]
      },
      {
        description: "A dungeoneer's pack or an explorer's pack",
        options: [
          {
            items: [
              { name: "Dungeoneer's Pack", quantity: 1, description: "Backpack, crowbar, hammer, 10 pitons, 10 torches, tinderbox, 10 days of rations, waterskin, 50 feet of hemp rope" }
            ]
          },
          {
            items: [
              { name: "Explorer's Pack", quantity: 1, description: "Backpack, bedroll, mess kit, tinderbox, 10 torches, 10 days of rations, waterskin, 50 feet of hemp rope" }
            ]
          }
        ]
      }
    ],
    rogue: [
      {
        description: "A rapier or a shortsword",
        options: [
          {
            items: [
              { name: "Rapier", quantity: 1, description: "Martial weapon, 1d8 piercing, finesse" }
            ]
          },
          {
            items: [
              { name: "Shortsword", quantity: 1, description: "Martial weapon, 1d6 piercing, finesse" }
            ]
          }
        ]
      },
      {
        description: "A shortbow and quiver of 20 arrows or a shortsword",
        options: [
          {
            items: [
              { name: "Shortbow", quantity: 1, description: "Ranged weapon, 1d6 piercing" },
              { name: "Arrow", quantity: 20, description: "Ammunition for shortbow" }
            ]
          },
          {
            items: [
              { name: "Shortsword", quantity: 1, description: "Martial weapon, 1d6 piercing, finesse" }
            ]
          }
        ]
      },
      {
        description: "A burglar's pack, a dungeoneer's pack, or an explorer's pack",
        options: [
          {
            items: [
              { name: "Burglar's Pack", quantity: 1, description: "Backpack, bag of 1000 ball bearings, 10 feet of string, bell, 5 candles, crowbar, hammer, 10 pitons, hooded lantern, 2 flasks of oil, 5 days rations, tinderbox, waterskin, 50 feet hemp rope" }
            ]
          },
          {
            items: [
              { name: "Dungeoneer's Pack", quantity: 1, description: "Backpack, crowbar, hammer, 10 pitons, 10 torches, tinderbox, 10 days of rations, waterskin, 50 feet of hemp rope" }
            ]
          },
          {
            items: [
              { name: "Explorer's Pack", quantity: 1, description: "Backpack, bedroll, mess kit, tinderbox, 10 torches, 10 days of rations, waterskin, 50 feet of hemp rope" }
            ]
          }
        ]
      }
    ],
    ranger: [
      {
        description: "(a) scale mail or (b) leather armor",
        options: [
          {
            items: [
              { name: "Scale Mail", quantity: 1, description: "Medium armor, AC 14 + Dex modifier (max 2)", cost: { quantity: 50, unit: 'gp' } }
            ]
          },
          {
            items: [
              { name: "Leather Armor", quantity: 1, description: "Light armor, AC 11 + Dex modifier", cost: { quantity: 10, unit: 'gp' } }
            ]
          }
        ]
      },
      {
        description: "(a) two shortswords or (b) two simple melee weapons",
        options: [
          {
            items: [
              { name: "Shortsword", quantity: 2, description: "Martial weapon, 1d6 piercing, finesse", cost: { quantity: 10, unit: 'gp' } }
            ]
          },
          {
            items: [
              { name: "Handaxe", quantity: 2, description: "Simple weapon, 1d6 slashing, thrown", cost: { quantity: 5, unit: 'gp' } }
            ]
          }
        ]
      },
      {
        description: "A dungeoneer's pack or an explorer's pack",
        options: [
          {
            items: [
              { name: "Dungeoneer's Pack", quantity: 1, description: "Backpack, crowbar, hammer, 10 pitons, 10 torches, tinderbox, 10 days of rations, waterskin, 50 feet of hemp rope", cost: { quantity: 12, unit: 'gp' } }
            ]
          },
          {
            items: [
              { name: "Explorer's Pack", quantity: 1, description: "Backpack, bedroll, mess kit, tinderbox, 10 torches, 10 days of rations, waterskin, 50 feet of hemp rope", cost: { quantity: 10, unit: 'gp' } }
            ]
          }
        ]
      }
    ],
    wizard: [
      {
        description: "(a) a quarterstaff or (b) a dagger",
        options: [
          {
            items: [
              { name: "Quarterstaff", quantity: 1, description: "Simple weapon, 1d6 bludgeoning, versatile (1d8)" }
            ]
          },
          {
            items: [
              { name: "Dagger", quantity: 1, description: "Simple weapon, 1d4 piercing, finesse, thrown" }
            ]
          }
        ]
      },
      {
        description: "(a) a component pouch or (b) an arcane focus",
        options: [
          {
            items: [
              { name: "Component Pouch", quantity: 1, description: "A pouch containing spell components" }
            ]
          },
          {
            items: [
              { name: "Arcane Focus", quantity: 1, description: "A focus for spellcasting" }
            ]
          }
        ]
      },
      {
        description: "(a) a scholar's pack or (b) an explorer's pack",
        options: [
          {
            items: [
              { name: "Scholar's Pack", quantity: 1, description: "Backpack, book of lore, bottle of ink, ink pen, 10 sheets of parchment, little bag of sand, small knife" }
            ]
          },
          {
            items: [
              { name: "Explorer's Pack", quantity: 1, description: "Backpack, bedroll, mess kit, tinderbox, 10 torches, 10 days of rations, waterskin, 50 feet of hemp rope" }
            ]
          }
        ]
      }
    ],
    paladin: [
      {
        description: "A martial weapon and a shield or two martial weapons",
        options: [
          {
            category: "Martial Weapon",
            choose: 1,
            items: [
              { name: "Shield", quantity: 1, description: "+2 AC", cost: { quantity: 10, unit: 'gp' } }
            ]
          },
          {
            category: "Martial Weapon",
            choose: 2
          }
        ]
      },
      {
        description: "Five javelins or any simple melee weapon",
        options: [
          {
            items: [
              { name: "Javelin", quantity: 5, description: "Simple weapon, 1d6 piercing, thrown" }
            ]
          },
          {
            category: "Simple Melee Weapon",
            choose: 1
          }
        ]
      },
      {
        description: "A priest's pack or an explorer's pack",
        options: [
          {
            items: [
              { name: "Priest's Pack", quantity: 1, description: "Backpack, blanket, 10 candles, tinderbox, alms box, 2 blocks of incense, censer, vestments, 2 days of rations, waterskin" }
            ]
          },
          {
            items: [
              { name: "Explorer's Pack", quantity: 1, description: "Backpack, bedroll, mess kit, tinderbox, 10 torches, 10 days of rations, waterskin, 50 feet of hemp rope" }
            ]
          }
        ]
      }
    ],
    bard: [
      {
        description: "(a) a rapier, (b) a longsword, or (c) any simple weapon",
        options: [
          {
            items: [
              { name: "Rapier", quantity: 1, description: "Martial weapon, 1d8 piercing, finesse", cost: { quantity: 25, unit: 'gp' } }
            ]
          },
          {
            items: [
              { name: "Longsword", quantity: 1, description: "Martial weapon, 1d8 slashing, versatile", cost: { quantity: 15, unit: 'gp' } }
            ]
          },
          {
            category: "Simple Weapon",
            choose: 1
          }
        ]
      },
      {
        description: "(a) a diplomat's pack or (b) an entertainer's pack",
        options: [
          {
            items: [
              { name: "Diplomat's Pack", quantity: 1, description: "Chest, 2 cases for maps and scrolls, fine clothes, bottle of ink, ink pen, lamp, 2 flasks of oil, 5 sheets of paper, vial of perfume, sealing wax, soap" }
            ]
          },
          {
            items: [
              { name: "Entertainer's Pack", quantity: 1, description: "Backpack, bedroll, 2 costumes, 5 candles, 5 days of rations, waterskin, disguise kit" }
            ]
          }
        ]
      },
      {
        description: "A musical instrument of your choice",
        options: [
          {
            category: "Musical Instrument",
            choose: 1,
            items: [
              { name: "Musical Instrument", quantity: 1, description: "Choose any musical instrument", cost: { quantity: 30, unit: 'gp' } }
            ]
          }
        ]
      }
    ]
  };

  return commonChoices[className] || [];
}

// Fallback equipment if no choices available
const fallbackEquipment = computed(() => {
  // Use the old system as fallback
  const items = [];
  items.push(...classStartingWeapons.value);
  items.push(...startingArmor.value);
  items.push(...startingEquipmentPackage.value);
  return items;
});

const purchasedItems = ref([])

// Available equipment from API for purchasing
const availableWeapons = computed(() => {
  if (!characterStore.equipmentData || characterStore.equipmentData.length === 0) {
    return []
  }

  const weapons = characterStore.equipmentData.filter(item => {
    const category = item.category?.toLowerCase() || ''
    return category.includes('weapon') || item.weaponCategory
  })

  // Fallback: if no weapons found, return some basic ones
  if (weapons.length === 0) {
    return characterStore.equipmentData.filter(item =>
      item.name?.toLowerCase().includes('sword') ||
      item.name?.toLowerCase().includes('axe') ||
      item.name?.toLowerCase().includes('bow') ||
      item.weaponCategory
    ).slice(0, 12)
  }

  return weapons
})

const availableArmor = computed(() => {
  if (!characterStore.equipmentData || characterStore.equipmentData.length === 0) {
    return []
  }

  const armor = characterStore.equipmentData.filter(item => {
    const category = item.category?.toLowerCase() || ''
    return category.includes('armor') || item.armorCategory
  })

  // Fallback: if no armor found, return some basic ones
  if (armor.length === 0) {
    return characterStore.equipmentData.filter(item =>
      item.name?.toLowerCase().includes('armor') ||
      item.name?.toLowerCase().includes('shield') ||
      item.armorCategory
    ).slice(0, 12)
  }

  return armor
})

const availableGear = computed(() => {
  if (!characterStore.equipmentData || characterStore.equipmentData.length === 0) {
    return []
  }

  const gear = characterStore.equipmentData.filter(item => {
    const category = item.category?.toLowerCase() || ''
    return !category.includes('weapon') && !category.includes('armor') && category.includes('gear')
  })

  // Fallback: if no gear found, return some basic ones
  if (gear.length === 0) {
    return characterStore.equipmentData.filter(item => {
      const category = item.category?.toLowerCase() || ''
      return !category.includes('weapon') && !category.includes('armor')
    }).slice(0, 24)
  }

  return gear
})

// All gear (merge starting package, background, and purchased)
const allGear = computed(() => {
  // Merge all gear, mark inInventory and allow quantity editing
  const gear = []
  const addOrUpdate = (item, inInventory = false) => {
    if (!item || !item.name) return
    const found = gear.find(g => g.name === item.name)
    if (found) {
      found.quantity += item.quantity || 1
      found.inInventory = found.inInventory || inInventory
    } else {
      gear.push({ ...item, inInventory, quantity: item.quantity || 1 })
    }
  }

  if (equipmentMethod.value === 'package') {
    // Only include starting equipment for package method
    startingEquipmentPackage.value.forEach(i => addOrUpdate(i, true))
    backgroundEquipment.value.forEach(i => addOrUpdate(i, true))
  } else {
    // For gold method, include purchased items
    purchasedItems.value.forEach(i => addOrUpdate(i, true))
  }

  // For package method, don't add available gear options
  // For gold method, add available gear options for adding (not in inventory)
  if (equipmentMethod.value === 'gold') {
    availableGear.value.forEach(item => {
      if (!gear.find(g => g.name === item.name)) {
        addOrUpdate(item, false)
      }
    })
  }

  return gear
})

// Default equipment that all characters of a class get (regardless of choices)
const defaultClassEquipment = computed(() => {
  const classInfo = character.value?.selectedClass || character.value?.class;
  if (!classInfo) return [];

  const className = (typeof classInfo === 'string' ? classInfo : classInfo?.name)?.toLowerCase();

  const defaultEquipment = {
    ranger: [
      { name: "Scale Mail", quantity: 1, description: "Medium armor, AC 14 + Dex modifier (max 2)", cost: { quantity: 50, unit: 'gp' } },
      { name: "Longbow", quantity: 1, description: "Ranged weapon, 1d8 piercing", cost: { quantity: 50, unit: 'gp' } },
      { name: "Arrow", quantity: 20, description: "Ammunition for longbow", cost: { quantity: 1, unit: 'gp' } }
    ],
    rogue: [
      { name: "Leather Armor", quantity: 1, description: "Light armor, AC 11 + Dex modifier", cost: { quantity: 10, unit: 'gp' } },
      { name: "Dagger", quantity: 2, description: "Simple melee weapon, 1d4 piercing", cost: { quantity: 2, unit: 'gp' } }
    ],
    wizard: [
      { name: "Spellbook", quantity: 1, description: "Contains your known spells", cost: { quantity: 50, unit: 'gp' } }
    ],
    cleric: [
      { name: "Scale Mail", quantity: 1, description: "Medium armor, AC 14 + Dex modifier (max 2)", cost: { quantity: 50, unit: 'gp' } },
      { name: "Shield", quantity: 1, description: "+2 AC", cost: { quantity: 10, unit: 'gp' } },
      { name: "Holy Symbol", quantity: 1, description: "Focus for divine spellcasting", cost: { quantity: 5, unit: 'gp' } }
    ],
    paladin: [
      { name: "Chain Mail", quantity: 1, description: "Heavy armor, AC 16", cost: { quantity: 75, unit: 'gp' } },
      { name: "Holy Symbol", quantity: 1, description: "Focus for divine spellcasting", cost: { quantity: 5, unit: 'gp' } }
    ],
    warlock: [
      { name: "Leather Armor", quantity: 1, description: "Light armor, AC 11 + Dex modifier", cost: { quantity: 10, unit: 'gp' } },
      { name: "Arcane Focus", quantity: 1, description: "Focus for eldritch magic", cost: { quantity: 20, unit: 'gp' } }
    ],
    sorcerer: [
      { name: "Arcane Focus", quantity: 1, description: "Focus for sorcerous magic", cost: { quantity: 20, unit: 'gp' } }
    ],
    bard: [
      { name: "Leather Armor", quantity: 1, description: "Light armor, AC 11 + Dex modifier", cost: { quantity: 10, unit: 'gp' } },
      { name: "Dagger", quantity: 1, description: "Simple melee weapon, 1d4 piercing, finesse, light, thrown", cost: { quantity: 2, unit: 'gp' } },
      { name: "Musical Instrument", quantity: 1, description: "Focus for bardic magic", cost: { quantity: 30, unit: 'gp' } }
    ],
    druid: [
      { name: "Leather Armor", quantity: 1, description: "Light armor, AC 11 + Dex modifier", cost: { quantity: 10, unit: 'gp' } },
      { name: "Shield", quantity: 1, description: "+2 AC", cost: { quantity: 10, unit: 'gp' } },
      { name: "Druidcraft Focus", quantity: 1, description: "Natural focus for druid spells", cost: { quantity: 10, unit: 'gp' } }
    ],
    monk: [
      { name: "Dart", quantity: 10, description: "Simple ranged weapon, 1d4 piercing", cost: { quantity: 0.05, unit: 'gp' } }
    ],
    barbarian: [
      { name: "Javelin", quantity: 4, description: "Simple ranged weapon, 1d6 piercing", cost: { quantity: 0.5, unit: 'gp' } }
    ],
    fighter: [] // Fighters get everything through choices, no default equipment
  };

  return defaultEquipment[className] || [];
});

const allInventory = computed(() => {
  const inv = [];

  if (equipmentMethod.value === 'package') {
    // Package mode: include selected equipment choices, starting equipment, and background equipment

    console.log('=== INVENTORY DEBUG ===');

    // Add items from selected equipment choices
    equipmentChoices.value.forEach((choice, choiceIndex) => {
      const selectedOptionIndex = selectedEquipmentChoices.value[choiceIndex];
      if (selectedOptionIndex !== null && selectedOptionIndex !== undefined) {
        const selectedOption = choice.options[selectedOptionIndex];

        // Check if this is a category choice with custom selected weapons
        const customWeapons = characterStore.character?.equipment?.filter(
          item => item.choiceIndex === choiceIndex && item.source === 'class'
        ) || [];

        if (customWeapons.length > 0) {
          // Add the custom selected weapons instead of the generic category
          customWeapons.forEach(weapon => {
            console.log('Adding custom weapon from choice:', weapon.name);
            inv.push({
              ...weapon,
              quantity: weapon.quantity || 1,
              source: 'class',
              cost: parseEquipmentCost(weapon)
            });
          });
        } else if (selectedOption && selectedOption.items) {
          // Add regular equipment items
          selectedOption.items.forEach(item => {
            console.log('Adding equipment choice item:', item.name);
            inv.push({
              ...item,
              quantity: item.quantity || 1,
              source: 'class',
              cost: parseEquipmentCost(item)
            });
          });
        }
      }
    });

    // Add starting equipment package (but avoid duplicates with equipment choices)
    console.log('Starting equipment package:', startingEquipmentPackage.value.map(i => i.name));
    const itemsFromChoices = inv.map(item => item.name.toLowerCase());
    console.log('Items already added from choices:', itemsFromChoices);

    startingEquipmentPackage.value.forEach(item => {
      if (!item || !item.name) {
        console.warn('Skipping invalid starting equipment item:', item);
        return;
      }

      // Skip if this item was already added from equipment choices
      const itemNameLower = item.name.toLowerCase();
      if (itemsFromChoices.includes(itemNameLower)) {
        console.log('Skipping starting equipment (already from choice):', item.name);
        return;
      }

      console.log('Adding starting equipment:', item.name);
      inv.push({
        ...item,
        quantity: item.quantity || 1,
        source: 'class-default',
        cost: parseEquipmentCost(item)
      });
    });

    // Add background equipment
    console.log('Background equipment from computed:', backgroundEquipment.value.map(i => ({ name: i.name, quantity: i.quantity })));
    console.log('Character equipment array:', characterStore.character?.equipment?.filter(item => item.source === 'background'));
    backgroundEquipment.value.forEach(item => {
      console.log('Adding background equipment:', item.name, 'x' + (item.quantity || 1));
      inv.push({
        ...item,
        quantity: item.quantity || 1,
        source: 'background'
      });
    });

  } else if (equipmentMethod.value === 'gold') {
    // Gold mode: only include purchased items
    purchasedItems.value.forEach(item => {
      inv.push({
        ...item,
        quantity: item.quantity || 1,
        source: 'purchased',
        cost: parseEquipmentCost(item)
      });
    });
  }

  console.log('Raw inventory before filtering:', inv.map(i => ({ name: i.name, source: i.source, quantity: i.quantity })));
  console.log('Raw inventory detailed:', inv);

  // Filter out generic items when specific ones have been selected
  const filteredInv = []
  const hasSpecificMusicalInstrument = inv.some(item =>
    item.source !== 'class-default' && isSpecificMusicalInstrument(item)
  )
  const hasSpecificArtisanTool = inv.some(item =>
    item.source !== 'class-default' && isSpecificArtisanTool(item)
  )

  // Debug logging for artisan tools
  const artisanToolItems = inv.filter(item => {
    const name = item.name?.toLowerCase() || '';
    return name.includes('artisan') || isSpecificArtisanTool(item);
  });
  console.log('All artisan tool related items:', artisanToolItems.map(i => ({ name: i.name, source: i.source, isSpecific: isSpecificArtisanTool(i) })));

  console.log('Filtering inventory - hasSpecificMusicalInstrument:', hasSpecificMusicalInstrument)
  console.log('Filtering inventory - hasSpecificArtisanTool:', hasSpecificArtisanTool)
  console.log('Raw inventory before filtering:', inv.map(i => ({ name: i.name, source: i.source })))

  inv.forEach(item => {
    const itemName = item.name?.toLowerCase() || ''

    // Skip generic musical instrument if specific one exists
    if (itemName === 'musical instrument' && hasSpecificMusicalInstrument) {
      console.log('Filtering out generic Musical Instrument, specific instrument found')
      return
    }

    // Skip generic artisan's tools if specific one exists (handle various naming patterns)
    if ((itemName.includes('artisan\'s tools') || itemName.includes('artisan tools') ||
      itemName === 'artisan\'s tools' || itemName === 'set of artisan\'s tools') && hasSpecificArtisanTool) {
      console.log('Filtering out generic Artisan\'s Tools, specific tool found')
      return
    }

    filteredInv.push(item)
  })

  console.log('Filtered inventory:', filteredInv.map(i => ({ name: i.name, source: i.source, quantity: i.quantity })))
  console.log('Filtered inventory detailed:', filteredInv)

  return filteredInv
})

// Grouped and sorted inventory by equipment type
const groupedInventory = computed(() => {
  // First, get all inventory items
  const inventory = allInventory.value

  // Define equipment type categories and their priority order
  const getEquipmentCategory = (item) => {
    const tooltip = getEquipmentTooltip(item.name)
    if (tooltip?.type) {
      const type = tooltip.type.toLowerCase()
      if (type.includes('heavy armor')) return { category: 'Heavy Armor', priority: 1 }
      if (type.includes('medium armor')) return { category: 'Medium Armor', priority: 2 }
      if (type.includes('light armor')) return { category: 'Light Armor', priority: 3 }
      if (type.includes('shield')) return { category: 'Shields', priority: 4 }
      if (type.includes('weapon')) return { category: 'Weapons', priority: 5 }
      if (type.includes('divine focus')) return { category: 'Divine Focuses', priority: 6 }
      if (type.includes('arcane focus')) return { category: 'Arcane Focuses', priority: 7 }
      if (type.includes('druidic focus')) return { category: 'Druidic Focuses', priority: 8 }
      if (type.includes('spellcasting focus')) return { category: 'Spellcasting Focuses', priority: 9 }
      if (type.includes('tool')) return { category: 'Tools', priority: 10 }
      if (type.includes('equipment pack')) return { category: 'Equipment Packs', priority: 11 }
    }

    // Fallback name-based categorization
    const name = item.name.toLowerCase()
    if (name.includes('arrow') || name.includes('bolt') || name.includes('ammunition')) {
      return { category: 'Ammunition', priority: 12 }
    }
    if (name.includes('costume') || name.includes('uniform') || name.includes('clothes') ||
      name.includes('vestments')) {
      return { category: 'Clothing', priority: 13 }
    }
    if ((name.includes('pouch') || name.includes('bag')) && !name.includes('pack')) {
      return { category: 'Containers', priority: 14 }
    }
    if (name.includes('rations') || name.includes('food') || name.includes('candle') ||
      name.includes('oil') || name.includes('rope') || name.includes('torch')) {
      return { category: 'Consumables', priority: 15 }
    }
    if (name.includes('book') || name.includes('ink') || name.includes('pen') ||
      name.includes('parchment') || name.includes('scroll')) {
      return { category: 'Books & Writing', priority: 16 }
    }
    if (name.includes('deck') || name.includes('cards') || name.includes('dice') ||
      name.includes('game')) {
      return { category: 'Gaming Items', priority: 17 }
    }

    // Default category for miscellaneous items
    return { category: 'Miscellaneous', priority: 18 }
  }

  // Group items by category and merge duplicates
  const grouped = {}
  inventory.forEach(item => {
    // Add null check to prevent errors
    if (!item || !item.name) {
      console.warn('Skipping invalid inventory item:', item);
      return;
    }

    const { category } = getEquipmentCategory(item)
    if (!grouped[category]) {
      grouped[category] = []
    }

    // Check if item already exists in this category
    const existingItem = grouped[category].find(existing => existing.name === item.name)
    if (existingItem) {
      // Merge quantities if item already exists
      console.log(`Merging duplicate item: ${item.name} (existing: ${existingItem.quantity}, adding: ${item.quantity || 1})`);
      existingItem.quantity = (existingItem.quantity || 1) + (item.quantity || 1)
    } else {
      // Add new item
      console.log(`Adding new item to ${category}: ${item.name} x${item.quantity || 1}`);
      grouped[category].push({
        ...item,
        quantity: item.quantity || 1
      })
    }
  })

  // Sort categories by priority and create flat sorted array
  const sortedCategories = Object.keys(grouped).sort((a, b) => {
    const priorityA = getEquipmentCategory({ name: grouped[a][0].name }).priority
    const priorityB = getEquipmentCategory({ name: grouped[b][0].name }).priority
    return priorityA - priorityB
  })

  // Create flat array with items grouped by category
  const sortedInventory = []
  sortedCategories.forEach(category => {
    // Sort items within each category alphabetically
    const sortedItems = grouped[category].sort((a, b) => a.name.localeCompare(b.name))
    sortedInventory.push(...sortedItems)
  })

  return sortedInventory
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

// Helper function to parse equipment cost
function parseEquipmentCost(item) {
  if (!item) return { quantity: 0, unit: 'gp' }

  // If cost is already in the expected format
  if (item.cost && typeof item.cost === 'object' && item.cost.quantity) {
    return item.cost
  }

  // If cost is a string like "15 gp"
  if (item.cost && typeof item.cost === 'string') {
    const match = item.cost.match(/(\d+)\s*(gp|sp|cp)/i)
    if (match) {
      return {
        quantity: parseInt(match[1]),
        unit: match[2].toLowerCase()
      }
    }
  }

  // Try to find cost in other properties
  if (item.equipment && item.equipment.cost) {
    return item.equipment.cost
  }

  // Default costs for common equipment
  const defaultCosts = {
    // Weapons
    'dagger': { quantity: 2, unit: 'gp' },
    'shortsword': { quantity: 10, unit: 'gp' },
    'longsword': { quantity: 15, unit: 'gp' },
    'greatsword': { quantity: 50, unit: 'gp' },
    'rapier': { quantity: 25, unit: 'gp' },
    'handaxe': { quantity: 5, unit: 'gp' },
    'battleaxe': { quantity: 10, unit: 'gp' },
    'greataxe': { quantity: 30, unit: 'gp' },
    'light crossbow': { quantity: 25, unit: 'gp' },
    'shortbow': { quantity: 25, unit: 'gp' },
    'longbow': { quantity: 50, unit: 'gp' },
    'quarterstaff': { quantity: 0.2, unit: 'gp' },
    'spear': { quantity: 1, unit: 'gp' },
    'mace': { quantity: 5, unit: 'gp' },
    'warhammer': { quantity: 15, unit: 'gp' },
    'morningstar': { quantity: 15, unit: 'gp' },

    // Armor
    'leather armor': { quantity: 10, unit: 'gp' },
    'studded leather armor': { quantity: 45, unit: 'gp' },
    'hide armor': { quantity: 10, unit: 'gp' },
    'chain mail': { quantity: 75, unit: 'gp' },
    'scale mail': { quantity: 50, unit: 'gp' },
    'breastplate': { quantity: 400, unit: 'gp' },
    'half plate': { quantity: 750, unit: 'gp' },
    'ring mail': { quantity: 30, unit: 'gp' },
    'chain shirt': { quantity: 50, unit: 'gp' },
    'splint armor': { quantity: 200, unit: 'gp' },
    'plate armor': { quantity: 1500, unit: 'gp' },
    'shield': { quantity: 10, unit: 'gp' },

    // Adventuring Gear
    'backpack': { quantity: 2, unit: 'gp' },
    'crowbar': { quantity: 2, unit: 'gp' },
    'hammer': { quantity: 1, unit: 'gp' },
    'pitons': { quantity: 0.05, unit: 'gp' },
    'lantern': { quantity: 5, unit: 'gp' },
    'oil': { quantity: 0.1, unit: 'gp' },
    'rations': { quantity: 0.5, unit: 'gp' },
    'waterskin': { quantity: 0.2, unit: 'gp' },
    'rope': { quantity: 1, unit: 'gp' },
    'torch': { quantity: 0.01, unit: 'gp' },
    'bedroll': { quantity: 1, unit: 'gp' },
    'flint and steel': { quantity: 0.5, unit: 'gp' },
    'potion of healing': { quantity: 50, unit: 'gp' },
    'healer\'s kit': { quantity: 5, unit: 'gp' },
    'antitoxin': { quantity: 50, unit: 'gp' },

    // Entertainer Background Items
    'musical instrument': { quantity: 0, unit: 'gp' }, // Free choice, but we'll give it a default
    'costume': { quantity: 5, unit: 'gp' },
    'belt pouch': { quantity: 0.5, unit: 'gp' },

    // Musical Instruments (specific ones)
    'lute': { quantity: 35, unit: 'gp' },
    'flute': { quantity: 2, unit: 'gp' },
    'horn': { quantity: 3, unit: 'gp' },
    'drum': { quantity: 6, unit: 'gp' },
    'lyre': { quantity: 30, unit: 'gp' },
    'pan flute': { quantity: 12, unit: 'gp' },
    'shawm': { quantity: 2, unit: 'gp' },
    'viol': { quantity: 30, unit: 'gp' },

    // Pack Contents and Misc Items
    'little bag of sand': { quantity: 1, unit: 'sp' },
    'small knife': { quantity: 1, unit: 'gp' },
    'book of lore': { quantity: 25, unit: 'gp' },
    'bottle of ink': { quantity: 10, unit: 'gp' },
    'ink pen': { quantity: 2, unit: 'cp' },
    'parchment': { quantity: 2, unit: 'sp' },
    'sheets of parchment': { quantity: 2, unit: 'sp' },
    '10 sheets of parchment': { quantity: 2, unit: 'gp' },
    'sealing wax': { quantity: 5, unit: 'sp' },
    'perfume': { quantity: 5, unit: 'gp' },
    'vial of perfume': { quantity: 5, unit: 'gp' },
    'fine clothes': { quantity: 15, unit: 'gp' },
    'set of fine clothes': { quantity: 15, unit: 'gp' },
    'map case': { quantity: 1, unit: 'gp' },
    'scroll case': { quantity: 1, unit: 'gp' },
    'case for maps and scrolls': { quantity: 1, unit: 'gp' },
    '2 cases for maps and scrolls': { quantity: 2, unit: 'gp' },
    'lamp': { quantity: 5, unit: 'sp' },
    'flask of oil': { quantity: 1, unit: 'sp' },
    '2 flasks of oil': { quantity: 2, unit: 'sp' },
    'paper': { quantity: 2, unit: 'sp' },
    'sheet of paper': { quantity: 2, unit: 'sp' },
    '5 sheets of paper': { quantity: 1, unit: 'gp' },
    'soap': { quantity: 2, unit: 'cp' },
    'chest': { quantity: 5, unit: 'gp' },

    // Common adventuring items that might be missing
    'arrow': { quantity: 1, unit: 'gp' }, // for 20 arrows
    'crossbow bolt': { quantity: 1, unit: 'gp' }, // for 20 bolts
    'candle': { quantity: 1, unit: 'cp' },
    'bell': { quantity: 1, unit: 'gp' },
    'string': { quantity: 1, unit: 'sp' },
    'piton': { quantity: 5, unit: 'cp' },
    'mess kit': { quantity: 2, unit: 'sp' },
    'tinderbox': { quantity: 5, unit: 'sp' },
    'pouch': { quantity: 5, unit: 'sp' },
    'bag': { quantity: 1, unit: 'gp' },
    'uniform': { quantity: 2, unit: 'gp' },
    'vestments': { quantity: 5, unit: 'gp' },
    'deck of cards': { quantity: 5, unit: 'sp' },
    'playing cards': { quantity: 5, unit: 'sp' },
    'dice set': { quantity: 1, unit: 'sp' },
    'censer': { quantity: 5, unit: 'gp' },
    'incense': { quantity: 1, unit: 'gp' },
    'alms box': { quantity: 2, unit: 'gp' }
  }

  const itemName = item.name?.toLowerCase()
  if (itemName && defaultCosts[itemName]) {
    return defaultCosts[itemName]
  }

  // Default fallback
  return { quantity: 0, unit: 'gp' }
}

// Function to properly capitalize equipment names
function capitalizeEquipmentName(name) {
  if (!name) return ''

  // Split by spaces and capitalize each word, but handle special cases
  const words = name.toLowerCase().split(' ')
  const capitalizedWords = words.map(word => {
    // Don't capitalize articles, prepositions, and conjunctions unless they're the first word
    const lowerCaseWords = ['of', 'and', 'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'with']
    if (lowerCaseWords.includes(word) && words.indexOf(word) !== 0) {
      return word
    }
    // Capitalize first letter
    return word.charAt(0).toUpperCase() + word.slice(1)
  })

  return capitalizedWords.join(' ')
}

// Function to display cost with gold equivalent
function formatCostWithGoldEquivalent(item) {
  const cost = parseEquipmentCost(item)
  if (!cost) return '0 gp'

  // If it's already gold, just return the cost
  if (cost.unit === 'gp') {
    return `${cost.quantity} gp`
  }

  // For silver and copper, show both original cost and gold equivalent
  const goldEquivalent = cost.unit === 'sp' ? cost.quantity / 10 : cost.quantity / 100
  return `${cost.quantity} ${cost.unit} (${goldEquivalent} gp)`
}

// Package-specific calculations
const packageValue = computed(() => {
  if (equipmentMethod.value !== 'package') return 0

  let value = 0

  // Calculate value from selected equipment choices
  equipmentChoices.value.forEach((choice, choiceIndex) => {
    const selectedOptionIndex = selectedEquipmentChoices.value[choiceIndex];
    if (selectedOptionIndex !== null && selectedOptionIndex !== undefined) {
      const selectedOption = choice.options[selectedOptionIndex];
      if (selectedOption && selectedOption.items) {
        selectedOption.items.forEach(item => {
          const cost = parseEquipmentCost(item);
          if (cost.quantity > 0) {
            value += cost.unit === 'gp' ? cost.quantity * (item.quantity || 1)
              : cost.unit === 'sp' ? (cost.quantity / 10) * (item.quantity || 1)
                : (cost.quantity / 100) * (item.quantity || 1);
          }
        });
      }
    }
  });

  // Calculate value from background equipment
  backgroundEquipment.value.forEach(item => {
    const cost = parseEquipmentCost(item)
    if (cost.quantity > 0) {
      value += cost.unit === 'gp' ? cost.quantity * (item.quantity || 1)
        : cost.unit === 'sp' ? (cost.quantity / 10) * (item.quantity || 1)
          : (cost.quantity / 100) * (item.quantity || 1)
    }
  })

  return Math.round(value * 10) / 10
})

const packageItemCount = computed(() => {
  if (equipmentMethod.value !== 'package') return 0

  // Count all items in the complete inventory (matches what's displayed)
  return allInventory.value.reduce((sum, item) => sum + (item.quantity || 1), 0)
})

const startingGold = computed(() => {
  if (!character.value?.class) return '4d4 × 10'

  // Calculate starting gold based on class (placeholder logic)
  const classGold = {
    'barbarian': '2d4 × 10',
    'bard': '5d4 × 10',
    'cleric': '5d4 × 10',
    'druid': '2d4 × 10',
    'fighter': '5d4 × 10',
    'monk': '5d4',
    'paladin': '5d4 × 10',
    'ranger': '5d4 × 10',
    'rogue': '4d4 × 10',
    'sorcerer': '3d4 × 10',
    'warlock': '4d4 × 10',
    'wizard': '4d4 × 10',
  }
  return classGold[character.value.class] || '4d4 × 10'
})

// Capitalized names for display
const capitalizedClassName = computed(() => {
  if (!character.value?.class) return 'Class'
  return character.value.class.charAt(0).toUpperCase() + character.value.class.slice(1)
})

const capitalizedBackgroundName = computed(() => {
  if (!character.value?.background) return 'Background'
  return character.value.background.charAt(0).toUpperCase() + character.value.background.slice(1)
})

// Dialog/modal handlers
function showDetails(item) {
  // Could open a modal with item details (not implemented here)
  alert(`Details for ${item.name}`)
}

// Show weapon alternatives based on proficiencies
function showWeaponAlternatives(weapon) {
  currentItemToReplace.value = weapon
  alternativeItems.value = []

  // Get character's weapon proficiencies
  const proficiencies = character.value?.proficiencies || []

  // Filter available weapons based on proficiencies
  const alternatives = availableWeapons.value.filter(altWeapon => {
    // Always include simple weapons
    if (altWeapon.weapon_category?.toLowerCase().includes('simple')) {
      return true
    }

    // Include martial weapons if proficient
    if (altWeapon.weapon_category?.toLowerCase().includes('martial')) {
      return proficiencies.some(p =>
        p.name?.toLowerCase().includes('martial') ||
        p.name?.toLowerCase().includes('all weapons')
      )
    }

    // Include specific weapon proficiencies
    return proficiencies.some(p =>
      p.name?.toLowerCase().includes(altWeapon.name?.toLowerCase()) ||
      altWeapon.name?.toLowerCase().includes(p.name?.toLowerCase())
    )
  })

  alternativeItems.value = alternatives.slice(0, 10) // Limit to 10 alternatives
  weaponAlternativesDialog.value = true
}

// Show armor alternatives based on proficiencies
function showArmorAlternatives(armor) {
  currentItemToReplace.value = armor
  alternativeItems.value = []

  // Get character's armor proficiencies
  const proficiencies = character.value?.proficiencies || []

  // Filter available armor based on proficiencies
  const alternatives = availableArmor.value.filter(altArmor => {
    // Always include light armor
    if (altArmor.armor_category?.toLowerCase().includes('light')) {
      return true
    }

    // Include medium/heavy armor if proficient
    if (altArmor.armor_category?.toLowerCase().includes('medium') ||
      altArmor.armor_category?.toLowerCase().includes('heavy')) {
      return proficiencies.some(p =>
        p.name?.toLowerCase().includes(altArmor.armor_category?.toLowerCase()) ||
        p.name?.toLowerCase().includes('all armor')
      )
    }

    return false
  })

  alternativeItems.value = alternatives.slice(0, 10) // Limit to 10 alternatives
  armorAlternativesDialog.value = true
}

// Replace item with alternative
function replaceItemWithAlternative(alternative) {
  if (!currentItemToReplace.value) return

  // Remove the original item from character store
  characterStore.removeEquipment(currentItemToReplace.value.name)

  // Add the alternative item
  characterStore.addEquipment({
    ...alternative,
    source: 'alternative',
    equipped: false
  })

  // Close the dialog
  weaponAlternativesDialog.value = false
  armorAlternativesDialog.value = false
  currentItemToReplace.value = null
  alternativeItems.value = []
}

// Add/Remove/Replace handlers
function removeWeapon(weapon) {
  const idx = classStartingWeapons.value.findIndex(w => w.name === weapon.name)
  if (idx > -1) {
    // For now, just remove from display - in full implementation would update character store
    console.log('Remove weapon:', weapon.name)
  }
}

function removeArmor(armor) {
  const idx = startingArmor.value.findIndex(a => a.name === armor.name)
  if (idx > -1) {
    // For now, just remove from display - in full implementation would update character store
    console.log('Remove armor:', armor.name)
  }
}

function removeGear(item) {
  // Remove from purchased items
  const idx = purchasedItems.value.findIndex(i => i.name === item.name)
  if (idx > -1) purchasedItems.value.splice(idx, 1)
}

// Open quantity dialog for item purchase
function openQuantityDialog(item) {
  selectedItem.value = item
  selectedQuantity.value = 1
  quantityDialog.value = true
}

// Check if player can afford a specific quantity of an item
function canAffordQuantity(item, quantity) {
  if (!item || !quantity) return false

  const cost = parseEquipmentCost(item)
  const goldCost = cost.unit === 'gp' ? cost.quantity
    : cost.unit === 'sp' ? cost.quantity / 10
      : cost.quantity / 100  // cp to gp

  const totalCost = goldCost * quantity
  return (characterStore.character?.coins?.gp || 0) >= totalCost
}

// Format total cost for multiple items
function formatTotalCost(item, quantity) {
  if (!item || !quantity) return '0 gp'

  const cost = parseEquipmentCost(item)
  const goldCost = cost.unit === 'gp' ? cost.quantity
    : cost.unit === 'sp' ? cost.quantity / 10
      : cost.quantity / 100  // cp to gp

  const totalCost = goldCost * quantity

  // Format nicely
  if (totalCost >= 1) {
    return `${totalCost} gp`
  } else if (totalCost >= 0.1) {
    return `${Math.round(totalCost * 10)} sp`
  } else {
    return `${Math.round(totalCost * 100)} cp`
  }
}

// Purchase item with specified quantity
function purchaseItemWithQuantity() {
  const item = selectedItem.value
  const quantity = selectedQuantity.value

  if (!item || !quantity || !canAffordQuantity(item, quantity)) return

  const cost = parseEquipmentCost(item)
  const goldCost = cost.unit === 'gp' ? cost.quantity
    : cost.unit === 'sp' ? cost.quantity / 10
      : cost.quantity / 100  // cp to gp

  const totalCost = goldCost * quantity

  // Spend the gold
  if (characterStore.spendGold(totalCost)) {
    // Add to purchased items
    const existingItem = purchasedItems.value.find(p => p.name === item.name)
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      purchasedItems.value.push({
        ...item,
        quantity: quantity,
        source: 'purchased'
      })
    }

    // Add to character store equipment (add each item individually for proper tracking)
    for (let i = 0; i < quantity; i++) {
      characterStore.addEquipment({
        ...item,
        source: 'purchased',
        equipped: false
      })
    }

    // Close dialogs
    quantityDialog.value = false
    addWeaponDialog.value = false
    addArmorDialog.value = false
    addGearDialog.value = false
  }
}

function addGear(item) {
  // Add gear to purchased items
  const existingItem = purchasedItems.value.find(p => p.name === item.name)
  if (existingItem) {
    existingItem.quantity += 1
  } else {
    purchasedItems.value.push({
      ...item,
      quantity: 1,
      source: 'purchased'
    })
  }

  // Add to character store equipment
  characterStore.addEquipment({
    ...item,
    source: 'purchased',
    equipped: false
  })
}

const purchasedValue = computed(() => {
  let value = 0
  purchasedItems.value.forEach(item => {
    const cost = item.cost
    if (!cost) return
    value += cost.unit === 'gp' ? cost.quantity * (item.quantity || 1)
      : cost.unit === 'sp' ? (cost.quantity / 10) * (item.quantity || 1)
        : (cost.quantity / 100) * (item.quantity || 1)
  })
  return Math.round(value * 10) / 10
})

// Helper function to check if character can afford an item
function canAffordItem(item) {
  const cost = parseEquipmentCost(item)
  if (!cost) return false

  // Convert all costs to gold equivalent for comparison
  const goldValue = cost.unit === 'gp' ? cost.quantity
    : cost.unit === 'sp' ? cost.quantity / 10
      : cost.quantity / 100  // cp to gp

  return (characterStore.character?.coins?.gp || 0) >= goldValue
}

// Purchase an item with gold
function purchaseItem(item) {
  if (!canAffordItem(item)) return

  const cost = parseEquipmentCost(item)
  const goldCost = cost.unit === 'gp' ? cost.quantity
    : cost.unit === 'sp' ? cost.quantity / 10
      : cost.quantity / 100  // cp to gp

  // Spend the gold
  if (characterStore.spendGold(goldCost)) {
    // Add to purchased items
    const existingItem = purchasedItems.value.find(p => p.name === item.name)
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      purchasedItems.value.push({
        ...item,
        quantity: 1,
        source: 'purchased'
      })
    }

    // Add to character store equipment
    characterStore.addEquipment({
      ...item,
      source: 'purchased',
      equipped: false
    })
  }
}

// Remove a purchased item
function removePurchasedItem(item) {
  const index = purchasedItems.value.findIndex(p => p.name === item.name)
  if (index > -1) {
    const purchasedItem = purchasedItems.value[index]

    // Refund the gold
    const cost = parseEquipmentCost(purchasedItem)
    if (cost) {
      const goldValue = cost.unit === 'gp' ? cost.quantity
        : cost.unit === 'sp' ? cost.quantity / 10
          : cost.quantity / 100  // cp to gp

      if (characterStore.character?.coins) {
        characterStore.character.coins.gp += goldValue
      }
    }

    // Remove from purchased items
    purchasedItems.value.splice(index, 1)

    // Remove from character store equipment
    characterStore.removeEquipment(item.name)
  }
}

// Equipment choice methods
function parseEquipmentChoice(choice, choiceIndex) {
  const description = choice.desc || `Choice ${choiceIndex + 1}`;
  const options = [];

  if (choice.from && choice.from.options) {
    choice.from.options.forEach((option, optionIndex) => {
      const parsedOption = parseOption(option);
      if (parsedOption) {
        options.push(parsedOption);
      }
    });
  }

  return {
    description,
    options,
    choose: choice.choose || 1
  };
}

function parseOption(option) {
  console.log('parseOption called with:', option);

  if (option.option_type === 'counted_reference') {
    // Single item with count
    const itemName = option.of?.name || 'Unknown Item';
    return {
      items: [{
        name: itemName,
        quantity: option.count || 1,
        description: getItemDescription({ name: itemName }),
        cost: parseEquipmentCost({ name: itemName })
      }]
    };
  } else if (option.option_type === 'multiple') {
    // Multiple items in this option
    const items = [];
    if (option.items) {
      option.items.forEach(item => {
        if (item.option_type === 'counted_reference') {
          const itemName = item.of?.name || 'Unknown Item';
          items.push({
            name: itemName,
            quantity: item.count || 1,
            description: getItemDescription({ name: itemName }),
            cost: parseEquipmentCost({ name: itemName })
          });
        } else if (item.option_type === 'choice') {
          // This is a sub-choice (like "a martial weapon")
          items.push({
            name: item.choice?.desc || 'Choose an item',
            quantity: 1,
            description: `Choose ${item.choice?.choose || 1} from ${item.choice?.from?.equipment_category?.name || 'category'}`,
            cost: { quantity: 0, unit: 'gp' }
          });
        }
      });
    }
    return { items };
  } else if (option.option_type === 'choice') {
    // Handle special cases for better user experience
    const categoryName = option.choice?.from?.equipment_category?.name || '';
    const description = option.choice?.desc || '';

    console.log('Choice option detected:', { categoryName, description });

    // Special handling for musical instruments
    if (categoryName.toLowerCase().includes('musical') || description.toLowerCase().includes('musical instrument')) {
      console.log('Musical instrument choice detected');
      return {
        items: [{
          name: 'Choose Musical Instrument',
          quantity: 1,
          description: 'Select any musical instrument of your choice',
          cost: { quantity: 30, unit: 'gp' },
          isMusicalInstrumentChoice: true
        }]
      };
    }

    // This is a category choice (like "choose any martial weapon")
    return {
      category: categoryName || 'Items',
      choose: option.choice?.choose || 1,
      description: description || 'Choose items from category'
      // Note: No items array for pure category choices to avoid duplication in display
    };
  }

  return null;
}

function selectEquipmentOption(choiceIndex, optionIndex, option) {
  console.log('selectEquipmentOption called:', { choiceIndex, optionIndex, option });

  // Check for musical instrument choice first
  if (option && option.items) {
    const musicalInstrumentItem = option.items.find(item => item.isMusicalInstrumentChoice);
    if (musicalInstrumentItem) {
      console.log('Musical instrument choice detected, opening dialog');
      // Store the choice context for later use
      currentItemToReplace.value = { choiceIndex, optionIndex, item: musicalInstrumentItem };
      musicalInstrumentDialog.value = true;
      return;
    }
  }

  // Check if this is a category choice that needs specific item selection
  if (option && option.category) {
    console.log('Category detected:', option.category);
    // Check for weapon categories
    if (option.category.toLowerCase().includes('melee') || option.category.toLowerCase().includes('weapon')) {
      console.log('Weapon category detected, opening dialog');
      // For mixed choices (category + fixed items), we need to handle both
      // First, set the choice as selected
      selectedEquipmentChoices.value[choiceIndex] = optionIndex;
      characterStore.updateEquipmentChoice(choiceIndex, optionIndex);

      // If there are fixed items (like Shield), add them immediately
      if (option.items && option.items.length > 0) {
        console.log('Adding fixed items:', option.items);
        // Add the fixed items to inventory
        option.items.forEach(item => {
          const existingEquipment = characterStore.character.equipment || [];
          const newItem = {
            ...item,
            choiceIndex,
            optionIndex,
            source: 'class'
          };

          // Check if item already exists for this choice
          const existingIndex = existingEquipment.findIndex(eq =>
            eq.name === item.name && eq.choiceIndex === choiceIndex
          );

          if (existingIndex === -1) {
            characterStore.character.equipment = [...existingEquipment, newItem];
          }
        });
      }

      // Then open weapon selection dialog for the category part
      openWeaponSelectionDialog(choiceIndex, optionIndex, option);
      return;
    }
    // For other categories that require selection, you could add more dialogs here
    // For now, we'll treat other categories as requiring specific selection too
    // You may want to add more specific selection dialogs for armor, tools, etc.

    // For now, if it's a category but not a weapon, just select it and let user know they need to choose
    console.log('Category choice selected:', option.category, 'Choose:', option.choose);
    // Don't continue with automatic selection for category choices
    return;
  }

  // Check for mixed choices - detect when an item is actually a category placeholder
  if (option && option.items) {
    const weaponCategoryItem = option.items.find(item =>
      item.name && (
        item.name.toLowerCase().includes('martial weapon') ||
        item.name.toLowerCase().includes('simple weapon') ||
        item.name.toLowerCase().includes('choose') && item.name.toLowerCase().includes('weapon') ||
        item.description?.toLowerCase().includes('choose') && item.description?.toLowerCase().includes('weapon')
      )
    );

    if (weaponCategoryItem) {
      console.log('Detected weapon category item:', weaponCategoryItem);

      // Extract category from the description or name
      let category = 'Weapon';
      let choose = 1;

      if (weaponCategoryItem.name.toLowerCase().includes('martial')) {
        category = 'Martial Weapon';
      } else if (weaponCategoryItem.name.toLowerCase().includes('simple')) {
        category = 'Simple Weapon';
      }

      // Extract choose count from the name (e.g., "Choose 2 Martial Weapons" -> choose = 2)
      const chooseMatch = weaponCategoryItem.name.match(/choose\s+(\d+)/i);
      if (chooseMatch) {
        choose = parseInt(chooseMatch[1]);
      }

      // Create a synthetic option structure
      const syntheticOption = {
        category: category,
        choose: choose,
        items: option.items.filter(item => item !== weaponCategoryItem) // Keep non-weapon items like Shield
      };

      console.log('Created synthetic option:', syntheticOption);

      // First, set the choice as selected
      selectedEquipmentChoices.value[choiceIndex] = optionIndex;
      characterStore.updateEquipmentChoice(choiceIndex, optionIndex);

      // Add fixed items (like Shield) immediately
      if (syntheticOption.items && syntheticOption.items.length > 0) {
        syntheticOption.items.forEach(item => {
          const existingEquipment = characterStore.character.equipment || [];
          const newItem = {
            ...item,
            choiceIndex,
            optionIndex,
            source: 'class',
            isFixedItem: true // Mark this as a fixed item that should always be preserved
          };

          const existingIndex = existingEquipment.findIndex(eq =>
            eq.name === item.name && eq.choiceIndex === choiceIndex
          );

          if (existingIndex === -1) {
            characterStore.character.equipment = [...existingEquipment, newItem];
          }
        });
      }

      // Store the fixed items in the synthetic option for later use in confirmWeaponSelection
      syntheticOption.fixedItems = syntheticOption.items || [];

      // Open weapon selection dialog
      openWeaponSelectionDialog(choiceIndex, optionIndex, syntheticOption);
      return;
    }
  }

  // Update local state for regular choices (items that don't need further selection)
  selectedEquipmentChoices.value[choiceIndex] = optionIndex;

  // Update character store
  characterStore.updateEquipmentChoice(choiceIndex, optionIndex);

  // Update character equipment based on choices
  updateCharacterEquipmentFromChoices();
}

function openWeaponSelectionDialog(choiceIndex, optionIndex, option) {
  console.log('openWeaponSelectionDialog called:', { choiceIndex, optionIndex, option });

  const count = option.choose || 1;
  weaponSelectionTitle.value = `Choose ${count} ${option.category}`;
  weaponSelectionSubtitle.value = `Select exactly ${count} weapon${count > 1 ? 's' : ''} from the list below`;
  weaponSelectionCount.value = count;
  currentWeaponChoice.value = { choiceIndex, optionIndex, option };
  selectedWeapons.value = [];

  // Load available weapons based on category
  if (option.category.toLowerCase().includes('simple melee')) {
    availableWeaponsForSelection.value = getSimpleMeleeWeapons();
  } else if (option.category.toLowerCase().includes('martial melee') || option.category.toLowerCase() === 'martial weapon') {
    availableWeaponsForSelection.value = getMartialMeleeWeapons();
  } else if (option.category.toLowerCase().includes('simple ranged')) {
    availableWeaponsForSelection.value = getSimpleRangedWeapons();
  } else {
    availableWeaponsForSelection.value = getAllWeapons();
  }

  console.log('Setting weaponCategoryDialog to true');
  weaponCategoryDialog.value = true;
}

function toggleWeaponSelection(weaponName) {
  const index = selectedWeapons.value.indexOf(weaponName);
  if (index > -1) {
    selectedWeapons.value.splice(index, 1);
  } else if (selectedWeapons.value.length < weaponSelectionCount.value) {
    selectedWeapons.value.push(weaponName);
  }
}

function confirmWeaponSelection() {
  const { choiceIndex, optionIndex, option } = currentWeaponChoice.value;

  // Update the equipment choice with selected weapons
  selectedEquipmentChoices.value[choiceIndex] = optionIndex;
  characterStore.updateEquipmentChoice(choiceIndex, optionIndex);

  // Add selected weapons to character equipment
  const weaponItems = selectedWeapons.value.map(weaponName => ({
    name: weaponName,
    quantity: 1,
    source: 'class',
    description: getItemDescription({ name: weaponName }),
    cost: parseEquipmentCost({ name: weaponName }),
    choiceIndex: choiceIndex,
    optionIndex: optionIndex
  }));

  // Store the selected weapons for this choice
  if (characterStore.character) {
    if (!characterStore.character.equipment) {
      characterStore.character.equipment = [];
    }

    // Remove any previous weapons from this choice (but preserve fixed items)
    characterStore.character.equipment = characterStore.character.equipment.filter(
      item => !(item.source === 'class' && item.choiceIndex === choiceIndex && !item.isFixedItem)
    );

    // Add selected weapons
    weaponItems.forEach(weapon => {
      characterStore.character.equipment.push(weapon);
    });

    // Ensure fixed items (like Shield) are present for mixed choices
    if (option && option.fixedItems && option.fixedItems.length > 0) {
      option.fixedItems.forEach(item => {
        // Check if this fixed item already exists
        const existingFixedItem = characterStore.character.equipment.find(eq =>
          eq.name === item.name && eq.choiceIndex === choiceIndex && eq.isFixedItem
        );

        if (!existingFixedItem) {
          characterStore.addEquipment({
            name: item.name,
            quantity: item.quantity || 1,
            source: 'class',
            equipped: false,
            cost: { quantity: 0, unit: 'gp' },
            choiceIndex: choiceIndex,
            optionIndex: optionIndex,
            isFixedItem: true
          });
        }
      });
    }
  }

  // Close dialog and update equipment
  weaponCategoryDialog.value = false;
  updateCharacterEquipmentFromChoices();
}

function getSimpleMeleeWeapons() {
  return [
    { name: 'Club', description: '1d4 bludgeoning, light', cost: { quantity: 1, unit: 'sp' } },
    { name: 'Dagger', description: '1d4 piercing, finesse, light, thrown (range 20/60)', cost: { quantity: 2, unit: 'gp' } },
    { name: 'Dart', description: '1d4 piercing, finesse, thrown (range 20/60)', cost: { quantity: 5, unit: 'cp' } },
    { name: 'Greatclub', description: '1d8 bludgeoning, two-handed', cost: { quantity: 2, unit: 'sp' } },
    { name: 'Handaxe', description: '1d6 slashing, light, thrown (range 20/60)', cost: { quantity: 5, unit: 'gp' } },
    { name: 'Javelin', description: '1d6 piercing, thrown (range 30/120)', cost: { quantity: 5, unit: 'sp' } },
    { name: 'Light Hammer', description: '1d4 bludgeoning, light, thrown (range 20/60)', cost: { quantity: 2, unit: 'gp' } },
    { name: 'Mace', description: '1d6 bludgeoning', cost: { quantity: 5, unit: 'gp' } },
    { name: 'Quarterstaff', description: '1d6 bludgeoning, versatile (1d8)', cost: { quantity: 2, unit: 'sp' } },
    { name: 'Sickle', description: '1d4 slashing, light', cost: { quantity: 1, unit: 'gp' } },
    { name: 'Spear', description: '1d6 piercing, thrown (range 20/60), versatile (1d8)', cost: { quantity: 1, unit: 'gp' } }
  ];
}

function getMartialMeleeWeapons() {
  return [
    { name: 'Battleaxe', description: '1d8 slashing, versatile (1d10)', cost: { quantity: 10, unit: 'gp' } },
    { name: 'Flail', description: '1d8 bludgeoning', cost: { quantity: 10, unit: 'gp' } },
    { name: 'Glaive', description: '1d10 slashing, heavy, reach, two-handed', cost: { quantity: 20, unit: 'gp' } },
    { name: 'Greataxe', description: '1d12 slashing, heavy, two-handed', cost: { quantity: 30, unit: 'gp' } },
    { name: 'Greatsword', description: '2d6 slashing, heavy, two-handed', cost: { quantity: 50, unit: 'gp' } },
    { name: 'Halberd', description: '1d10 slashing, heavy, reach, two-handed', cost: { quantity: 20, unit: 'gp' } },
    { name: 'Lance', description: '1d12 piercing, reach, special', cost: { quantity: 10, unit: 'gp' } },
    { name: 'Longsword', description: '1d8 slashing, versatile (1d10)', cost: { quantity: 15, unit: 'gp' } },
    { name: 'Maul', description: '2d6 bludgeoning, heavy, two-handed', cost: { quantity: 10, unit: 'gp' } },
    { name: 'Morningstar', description: '1d8 piercing', cost: { quantity: 15, unit: 'gp' } },
    { name: 'Pike', description: '1d10 piercing, heavy, reach, two-handed', cost: { quantity: 5, unit: 'gp' } },
    { name: 'Rapier', description: '1d8 piercing, finesse', cost: { quantity: 25, unit: 'gp' } },
    { name: 'Scimitar', description: '1d6 slashing, finesse, light', cost: { quantity: 25, unit: 'gp' } },
    { name: 'Shortsword', description: '1d6 piercing, finesse, light', cost: { quantity: 10, unit: 'gp' } },
    { name: 'Trident', description: '1d6 piercing, thrown (range 20/60), versatile (1d8)', cost: { quantity: 5, unit: 'gp' } },
    { name: 'War Pick', description: '1d8 piercing', cost: { quantity: 5, unit: 'gp' } },
    { name: 'Warhammer', description: '1d8 bludgeoning, versatile (1d10)', cost: { quantity: 15, unit: 'gp' } },
    { name: 'Whip', description: '1d4 slashing, finesse, reach', cost: { quantity: 2, unit: 'gp' } }
  ];
}

function getSimpleRangedWeapons() {
  return [
    { name: 'Crossbow, Light', description: '1d8 piercing, ammunition (range 80/320), loading, two-handed', cost: { quantity: 25, unit: 'gp' } },
    { name: 'Shortbow', description: '1d6 piercing, ammunition (range 80/320), two-handed', cost: { quantity: 25, unit: 'gp' } },
    { name: 'Sling', description: '1d4 bludgeoning, ammunition (range 30/120)', cost: { quantity: 1, unit: 'sp' } }
  ];
}

function getAllWeapons() {
  return [...getSimpleMeleeWeapons(), ...getMartialMeleeWeapons(), ...getSimpleRangedWeapons()];
}

function isOptionSelected(choiceIndex, optionIndex) {
  return selectedEquipmentChoices.value[choiceIndex] === optionIndex;
}

function updateCharacterEquipmentFromChoices() {
  // Clear existing class equipment, but preserve custom-selected weapons with choiceIndex
  if (characterStore.character?.equipment) {
    characterStore.character.equipment = characterStore.character.equipment.filter(
      item => item.source !== 'class' || (item.source === 'class' && item.choiceIndex !== undefined)
    );
  }

  // Add selected equipment choices
  equipmentChoices.value.forEach((choice, choiceIndex) => {
    const selectedOptionIndex = selectedEquipmentChoices.value[choiceIndex];
    if (selectedOptionIndex !== null && selectedOptionIndex !== undefined) {
      const selectedOption = choice.options[selectedOptionIndex];

      // Check if we have custom weapons selected for this choice/option combination BEFORE clearing
      const existingCustomWeapons = characterStore.character?.equipment?.filter(
        item => item.choiceIndex === choiceIndex && item.optionIndex === selectedOptionIndex && item.source === 'class'
      ) || [];

      // Clear any existing equipment for this specific choice but different option
      // This ensures when switching between options, old items are properly removed
      // But preserve items for the current option (custom weapons and fixed items)
      if (characterStore.character?.equipment) {
        characterStore.character.equipment = characterStore.character.equipment.filter(
          item => !(item.choiceIndex === choiceIndex && item.source === 'class' &&
            item.optionIndex !== selectedOptionIndex)
        );
      }

      // Only add generic equipment if we don't have custom weapons for this specific choice/option
      if (existingCustomWeapons.length === 0 && selectedOption && selectedOption.items) {
        selectedOption.items.forEach(item => {
          characterStore.addEquipment({
            name: item.name,
            quantity: item.quantity || 1,
            source: 'class',
            equipped: false,
            choiceIndex: choiceIndex,
            optionIndex: selectedOptionIndex,
            cost: { quantity: 0, unit: 'gp' } // Starting equipment is free
          });
        });
      }
    }
  });
}

// Musical instrument methods
const isGenericMusicalInstrument = (item) => {
  if (!item || !item.name) return false;
  const name = item.name.toLowerCase();
  // Check if it's a generic musical instrument that hasn't been replaced with a specific one
  return name.includes('musical instrument') || name === 'instrument';
};

const isSpecificMusicalInstrument = (item) => {
  if (!item || !item.name) return false;
  const name = item.name.toLowerCase();
  // Check if it's a specific musical instrument (not generic)
  // More comprehensive list of musical instruments
  const specificInstruments = [
    'lute', 'flute', 'drum', 'horn', 'lyre', 'pan flute', 'shawm', 'viol',
    'bagpipes', 'dulcimer', 'guitar', 'harp', 'harpsichord', 'mandolin',
    'ocarina', 'organ', 'piano', 'recorder', 'trumpet', 'violin', 'zither'
  ];

  // Check if it's any specific instrument but not the generic placeholder
  return specificInstruments.some(instrument => name.includes(instrument)) &&
    !name.includes('musical instrument') &&
    name !== 'instrument';
};

const isProficientInstrument = (instrument) => {
  // Check if character has proficiency in this specific instrument
  const character = characterStore.character;
  if (!character || !instrument) return false;

  const instrumentName = instrument.name?.toLowerCase() || '';

  // First, check character's proficiencies array
  const proficiencies = character.proficiencies || [];
  if (proficiencies.length > 0) {
    const isProficient = proficiencies.some(prof => {
      if (!prof || !prof.name) return false;
      const profName = prof.name.toLowerCase();

      // Exact match first
      if (profName === instrumentName) return true;

      // Check for word boundaries to avoid false positives
      // e.g., "lute" should not match "flute" or "pan flute"
      const profWords = profName.split(/\s+/);
      const instrumentWords = instrumentName.split(/\s+/);

      // Check if any proficiency word exactly matches any instrument word
      return profWords.some(profWord =>
        instrumentWords.some(instWord => profWord === instWord)
      );
    });
    if (isProficient) return true;
  }

  // Check backgroundDetails for proficiency information
  const backgroundDetails = character.backgroundDetails;
  if (backgroundDetails) {
    // Check toolProficiencies array (this is where musical instrument proficiencies are stored)
    const toolProficiencies = backgroundDetails.toolProficiencies || [];
    if (toolProficiencies.length > 0) {
      const isProficient = toolProficiencies.some(prof => {
        // Handle both string and object formats
        const profName = (typeof prof === 'string' ? prof : prof?.name || '').toLowerCase();

        // If proficiency is "Musical Instrument", character can choose any instrument
        // but we don't highlight them until they make a choice
        if (profName === 'musical instrument' || profName.includes('musical instrument')) {
          // Don't highlight all instruments - let them choose first
          return false;
        }

        // Exact match first
        if (profName === instrumentName) return true;

        // Check for word boundaries to avoid false positives
        const profWords = profName.split(/\s+/);
        const instrumentWords = instrumentName.split(/\s+/);

        return profWords.some(profWord =>
          instrumentWords.some(instWord => profWord === instWord)
        );
      });
      if (isProficient) return true;
    }

    // Also check if backgroundDetails has a proficiencies or skills array (fallback)
    const bgProficiencies = backgroundDetails.proficiencies || backgroundDetails.skills || [];
    if (bgProficiencies.length > 0) {
      const isProficient = bgProficiencies.some(prof => {
        if (!prof || !prof.name) return false;
        const profName = prof.name.toLowerCase();

        // Exact match first
        if (profName === instrumentName) return true;

        // Check for word boundaries to avoid false positives
        const profWords = profName.split(/\s+/);
        const instrumentWords = instrumentName.split(/\s+/);

        return profWords.some(profWord =>
          instrumentWords.some(instWord => profWord === instWord)
        );
      });
      if (isProficient) return true;
    }

    // Check if there's a specific instrument selected in backgroundDetails
    if (backgroundDetails.selectedInstrument) {
      const selectedInstrument = backgroundDetails.selectedInstrument.toLowerCase();

      // Exact match first
      if (selectedInstrument === instrumentName) return true;

      // Check for word boundaries
      const selectedWords = selectedInstrument.split(/\s+/);
      const instrumentWords = instrumentName.split(/\s+/);

      if (selectedWords.some(selectedWord =>
        instrumentWords.some(instWord => selectedWord === instWord)
      )) {
        return true;
      }
    }

    // Check selected background instruments from page 3
    if (character.selectedBackgroundInstruments && character.selectedBackgroundInstruments.length > 0) {
      console.log('Found selectedBackgroundInstruments:', character.selectedBackgroundInstruments);
      const isSelected = character.selectedBackgroundInstruments.some(selected => {
        const selectedName = selected.toLowerCase();
        console.log('Comparing selected instrument:', selectedName, 'with current:', instrumentName);

        // Exact match first
        if (selectedName === instrumentName) return true;

        // Check for word boundaries
        const selectedWords = selectedName.split(/\s+/);
        const instrumentWords = instrumentName.split(/\s+/);

        return selectedWords.some(selectedWord =>
          instrumentWords.some(instWord => selectedWord === instWord)
        );
      });
      console.log('selectedBackgroundInstruments check result:', isSelected);
      if (isSelected) return true;
    }

    // Check feature or other properties
    if (backgroundDetails.feature) {
      const featureText = JSON.stringify(backgroundDetails.feature).toLowerCase();
      if (featureText.includes(instrumentName)) {
        return true;
      }
    }
  }

  return false;
};

const selectMusicalInstrument = (instrument) => {
  console.log('[Instrument] Selecting', instrument?.name);
  const equip = characterStore.character.equipment;
  if (!Array.isArray(equip)) return;

  // Check if this is being called from an equipment choice dialog
  const isEquipmentChoice = currentItemToReplace.value?.choiceIndex !== undefined;

  if (isEquipmentChoice) {
    console.log('[Instrument] Handling equipment choice selection');
    const { choiceIndex, optionIndex } = currentItemToReplace.value;

    // Set the choice as selected
    selectedEquipmentChoices.value[choiceIndex] = optionIndex;
    characterStore.updateEquipmentChoice(choiceIndex, optionIndex);

    // Add the selected instrument to equipment
    const newItem = {
      name: instrument.name,
      ...instrument,
      quantity: 1,
      equipped: false,
      source: 'class',
      choiceIndex,
      optionIndex
    };

    // Remove any existing equipment for this choice
    const filteredEquip = equip.filter(item =>
      !(item.choiceIndex === choiceIndex && item.optionIndex === optionIndex)
    );

    // Add the new instrument
    filteredEquip.push(newItem);
    characterStore.character.equipment = filteredEquip;

    console.log('[Instrument] Added class equipment instrument:', instrument.name);
  } else {
    // Handle background instrument selection (existing logic)
    console.log('[Instrument] Handling background instrument selection');

    // Find any existing musical instrument (generic placeholder OR specific instrument)
    const idx = equip.findIndex(item => {
      const n = item?.name?.trim().toLowerCase();
      // Check for generic placeholder
      if ((n === 'musical instrument' || n === 'instrument') && item.source === 'background') {
        return true;
      }
      // Check for specific musical instruments
      if (item.source === 'background' && isSpecificMusicalInstrument(item)) {
        return true;
      }
      return false;
    });

    console.log('[Instrument] Existing instrument index:', idx, 'Current equipment snapshot:', equip.map(e => e.name));

    if (idx !== -1) {
      // Replace the existing instrument (generic or specific)
      equip.splice(idx, 1, {
        name: instrument.name,
        ...instrument,
        quantity: 1,
        equipped: false,
        source: 'background'
      });
      console.log('[Instrument] Replaced existing instrument with', instrument.name);
    } else {
      // If no existing instrument found, add the new one
      equip.push({
        name: instrument.name,
        ...instrument,
        quantity: 1,
        equipped: false,
        source: 'background'
      });
      console.log('[Instrument] Added new instrument');
    }

    // Ensure other background equipment is preserved (costume, belt pouch, etc.)
    const requiredBackgroundEquipment = ['costume', 'belt pouch'];
    requiredBackgroundEquipment.forEach(itemName => {
      const exists = equip.some(item =>
        item.name?.toLowerCase() === itemName.toLowerCase() &&
        item.source === 'background'
      );

      if (!exists) {
        console.log('[Instrument] Restoring missing background equipment:', itemName);
        // Proper title case for multi-word items
        const properName = itemName === 'belt pouch' ? 'Belt Pouch' :
          itemName.charAt(0).toUpperCase() + itemName.slice(1);
        equip.push({
          name: properName,
          quantity: 1,
          equipped: false,
          source: 'background',
          cost: { quantity: itemName === 'costume' ? 5 : 0.5, unit: 'gp' }
        });
      }
    });

    console.log('[Instrument] Updated equipment:', equip.map(e => e.name));

    // Update the character store with the new equipment
    characterStore.character.equipment = equip;
  }

  // Clear the context and close dialog
  currentItemToReplace.value = null;
  musicalInstrumentDialog.value = false;
};

const loadMusicalInstruments = async () => {
  try {
    const response = await fetch('https://www.dnd5eapi.co/api/equipment-categories/musical-instruments');
    const data = await response.json();

    if (data.equipment) {
      musicalInstruments.value = data.equipment.map(item => ({
        ...item,
        cost: item.cost || { quantity: 0, unit: 'gp' }
      }));
    }
  } catch (error) {
    console.error('Error loading musical instruments:', error);
    // Fallback to common musical instruments
    musicalInstruments.value = [
      { name: 'Lute', cost: { quantity: 35, unit: 'gp' } },
      { name: 'Drum', cost: { quantity: 6, unit: 'gp' } },
      { name: 'Flute', cost: { quantity: 2, unit: 'gp' } },
      { name: 'Horn', cost: { quantity: 3, unit: 'gp' } },
      { name: 'Lyre', cost: { quantity: 30, unit: 'gp' } },
      { name: 'Pan flute', cost: { quantity: 12, unit: 'gp' } },
      { name: 'Shawm', cost: { quantity: 2, unit: 'gp' } },
      { name: 'Viol', cost: { quantity: 30, unit: 'gp' } }
    ];
  }
};

// Artisan's tools functionality
const artisanTools = ref([
  { name: "Smith's tools", cost: { quantity: 20, unit: 'gp' } },
  { name: "Brewer's supplies", cost: { quantity: 20, unit: 'gp' } },
  { name: "Carpenter's tools", cost: { quantity: 8, unit: 'gp' } },
  { name: "Leatherworker's tools", cost: { quantity: 5, unit: 'gp' } },
  { name: "Mason's tools", cost: { quantity: 10, unit: 'gp' } },
  { name: "Potter's tools", cost: { quantity: 10, unit: 'gp' } },
  { name: "Weaver's tools", cost: { quantity: 1, unit: 'gp' } },
  { name: "Woodcarver's tools", cost: { quantity: 1, unit: 'gp' } }
]);

const isGenericArtisanTool = (item) => {
  if (!item || !item.name) return false;
  const name = item.name.toLowerCase();
  return (
    name.includes("artisan's tools") ||
    name.includes("artisan tools") ||
    name === "artisan's tools" ||
    name === "artisan tools"
  );
};

const isSpecificArtisanTool = (item) => {
  if (!item || !item.name) return false;
  const name = item.name.toLowerCase();
  return artisanTools.value.some(tool =>
    tool.name.toLowerCase() === name ||
    tool.name.toLowerCase().includes(name) ||
    name.includes(tool.name.toLowerCase())
  );
}; const isProficientTool = (tool) => {
  // Check if character has proficiency in this specific artisan tool
  const character = characterStore.character;
  if (!character || !tool) return false;

  const toolName = tool.name?.toLowerCase() || '';
  console.log('[Proficiency] Checking tool:', toolName);
  console.log('[Proficiency] Full character object:', character);

  // First, check character's proficiencies array (main proficiencies from all sources)
  const proficiencies = character.proficiencies || [];
  console.log('[Proficiency] Character proficiencies:', proficiencies);
  if (proficiencies.length > 0) {
    const isProficient = proficiencies.some(prof => {
      if (!prof || !prof.name) return false;
      const profName = prof.name.toLowerCase();
      console.log('[Proficiency] Checking prof:', profName, 'against tool:', toolName);

      // Exact match first
      if (profName === toolName) {
        console.log('[Proficiency] Exact match found!');
        return true;
      }

      // Check for partial matches (common for artisan tools)
      if (profName.includes(toolName) || toolName.includes(profName)) {
        console.log('[Proficiency] Partial match found!');
        return true;
      }

      // Handle common variations like "Smith's tools" vs "smith tools"
      if (toolName.includes('tools') && profName.includes('tools')) {
        const toolBase = toolName.replace(/['']?s tools?$/, '');
        const profBase = profName.replace(/['']?s tools?$/, '');
        if (toolBase === profBase) {
          console.log('[Proficiency] Tool base match found!');
          return true;
        }
      }

      return false;
    });
    if (isProficient) return true;
  }

  // Check backgroundDetails for proficiency information (most important for tools)
  const backgroundDetails = character.backgroundDetails;
  console.log('[Proficiency] Background details:', backgroundDetails);
  if (backgroundDetails) {
    // Check toolProficiencies array (this is where artisan tool proficiencies are stored)
    const toolProficiencies = backgroundDetails.toolProficiencies || [];
    console.log('[Proficiency] Background tool proficiencies:', toolProficiencies);
    if (toolProficiencies.length > 0) {
      const isProficient = toolProficiencies.some(prof => {
        // Handle both string and object formats
        const profName = (typeof prof === 'string' ? prof : prof?.name || '').toLowerCase();
        console.log('[Proficiency] Checking background prof:', profName, 'against tool:', toolName);

        // Exact match first
        if (profName === toolName) {
          console.log('[Proficiency] Background exact match found!');
          return true;
        }

        // Check for partial matches
        if (profName.includes(toolName) || toolName.includes(profName)) {
          console.log('[Proficiency] Background partial match found!');
          return true;
        }

        // Handle common variations
        if (toolName.includes('tools') && profName.includes('tools')) {
          const toolBase = toolName.replace(/['']?s tools?$/, '');
          const profBase = profName.replace(/['']?s tools?$/, '');
          if (toolBase === profBase) {
            console.log('[Proficiency] Background tool base match found!');
            return true;
          }
        }

        return false;
      });
      if (isProficient) return true;
    }
  }

  // Check class tool proficiencies
  const classProfs = character.classDetails?.toolProficiencies || [];
  console.log('[Proficiency] Class tool proficiencies:', classProfs);
  for (const prof of classProfs) {
    const profName = prof.name?.toLowerCase() || prof.toLowerCase() || '';
    if (profName === toolName || profName.includes(toolName) || toolName.includes(profName)) {
      console.log('[Proficiency] Class proficiency match found!');
      return true;
    }
  }

  // Check species tool proficiencies  
  const speciesProfs = character.speciesDetails?.toolProficiencies || [];
  console.log('[Proficiency] Species tool proficiencies:', speciesProfs);
  for (const prof of speciesProfs) {
    const profName = prof.name?.toLowerCase() || prof.toLowerCase() || '';
    if (profName === toolName || profName.includes(toolName) || toolName.includes(profName)) {
      console.log('[Proficiency] Species proficiency match found!');
      return true;
    }
  }

  // Check skill proficiencies as some backgrounds mix tool and skill proficiencies
  const skillProfs = character.backgroundDetails?.skillProficiencies || [];
  console.log('[Proficiency] Background skill proficiencies (checking for tools):', skillProfs);

  // Check character.selectedBackgroundTools (where tool choices from page 3 are stored)
  const selectedBackgroundTools = character.selectedBackgroundTools || [];
  console.log('[Proficiency] Selected background tools from page 3:', selectedBackgroundTools);
  for (const tool of selectedBackgroundTools) {
    const profName = tool?.name?.toLowerCase() || tool?.toLowerCase() || '';
    if (profName === toolName || profName.includes(toolName) || toolName.includes(profName)) {
      console.log('[Proficiency] Selected background tool match found!');
      return true;
    }
  }

  console.log('[Proficiency] No proficiency found for:', toolName);
  return false;
};

const selectArtisanTool = (tool) => {
  console.log('[Tool] Selecting artisan tool:', tool.name);

  const equip = characterStore.character.equipment;
  if (!Array.isArray(equip)) return;

  // Find any existing artisan tool (generic placeholder OR specific tool)
  const idx = equip.findIndex(item => {
    const n = item?.name?.trim().toLowerCase();
    // Check for generic placeholder
    if ((n === "artisan's tools" || n === "artisan tools") && item.source === 'background') {
      return true;
    }
    // Check for specific artisan tools
    if (item.source === 'background' && isSpecificArtisanTool(item)) {
      return true;
    }
    return false;
  });

  console.log('[Tool] Existing tool index:', idx, 'Current equipment snapshot:', equip.map(e => e.name));

  if (idx !== -1) {
    // Replace the existing tool (generic or specific)
    equip.splice(idx, 1, {
      name: tool.name,
      ...tool,
      quantity: 1,
      equipped: false,
      source: 'background'
    });
    console.log('[Tool] Replaced existing tool with', tool.name);
  } else {
    // If no existing tool found, add the new one
    equip.push({
      name: tool.name,
      ...tool,
      quantity: 1,
      equipped: false,
      source: 'background'
    });
    console.log('[Tool] Added new tool');
  }

  // Ensure other background equipment is preserved (shovel, clothes, etc.)
  const requiredBackgroundEquipment = ['shovel', 'set of artisan\'s tools', 'common clothes', 'belt pouch'];
  requiredBackgroundEquipment.forEach(itemName => {
    const hasItem = equip.some(item => {
      const name = item.name?.toLowerCase() || '';
      return name.includes(itemName.toLowerCase()) || itemName.toLowerCase().includes(name);
    });

    if (!hasItem && itemName !== 'set of artisan\'s tools') { // Skip the generic tools since we just replaced it
      const properName = itemName === 'belt pouch' ? 'Belt Pouch' :
        itemName === 'common clothes' ? 'Common Clothes' :
          itemName.charAt(0).toUpperCase() + itemName.slice(1);
      equip.push({
        name: properName,
        quantity: 1,
        equipped: false,
        source: 'background',
        cost: { quantity: itemName === 'common clothes' ? 0.5 : 0.5, unit: 'gp' }
      });
    }
  });

  console.log('[Tool] Updated equipment:', equip.map(e => e.name));
  artisanToolsDialog.value = false;
};

// Compute the total gold from equipment/background for standard package
const packageGold = computed(() => {
  if (equipmentMethod.value !== 'package') return 0;

  let gold = 0;

  // Add starting gold from class
  if (character.value?.classDetails?.startingMoney?.gp) {
    gold += character.value.classDetails.startingMoney.gp;
  }

  // Add starting gold from background
  if (character.value?.backgroundDetails?.startingMoney?.gp) {
    gold += character.value.backgroundDetails.startingMoney.gp;
  }

  // Add gold from specific gold piece items (actual currency)
  allInventory.value.forEach(item => {
    const name = item.name?.toLowerCase() || '';
    // Only count actual gold pieces/currency, not equipment
    if (name.includes('gold piece') || name === 'gold' || name === 'gp') {
      gold += item.quantity || 0;
    }
  });

  return gold;
});

// Helper to get the real market price for a musical instrument, even if granted for free
function getInstrumentMarketPrice(item) {
  if (!item || !item.name) return { quantity: 0, unit: 'gp' };
  const name = item.name.toLowerCase();
  // Try to find in equipmentData
  if (characterStore.equipmentData && characterStore.equipmentData.length > 0) {
    const found = characterStore.equipmentData.find(eq => eq.name?.toLowerCase() === name);
    if (found && found.cost) return found.cost;
  }
  // Fallback to parseEquipmentCost
  return parseEquipmentCost(item);
}

// Helper to get a description from desc (array), description (string), or fallback
function getItemDescription(item) {
  if (!item) return '';
  // Prefer item's own desc/description
  if (Array.isArray(item.desc) && item.desc.length > 0) return item.desc[0];
  if (typeof item.desc === 'string' && item.desc) return item.desc;
  if (typeof item.description === 'string' && item.description) return item.description;

  // Fallback: try to find a matching item in equipmentData by name
  if (characterStore.equipmentData && item.name) {
    const match = characterStore.equipmentData.find(eq => eq.name?.toLowerCase() === item.name.toLowerCase());
    if (match) {
      if (Array.isArray(match.desc) && match.desc.length > 0) return match.desc[0];
      if (typeof match.desc === 'string' && match.desc) return match.desc;
      if (typeof match.description === 'string' && match.description) return match.description;
    }
  }
  return 'No description available.';
}

// Load musical instruments when component mounts
onMounted(() => {
  loadMusicalInstruments();

  // Initialize equipment choices with first option selected for each choice
  initializeEquipmentChoices();
});

// Initialize equipment choices
function initializeEquipmentChoices(forceReset = false) {
  const choices = equipmentChoices.value;
  if (choices.length > 0) {
    // Try to load saved choices from character store first (unless forcing reset)
    const savedChoices = !forceReset ? characterStore.getEquipmentChoices() : null;
    if (savedChoices && savedChoices.length === choices.length && !forceReset) {
      selectedEquipmentChoices.value = [...savedChoices];
    } else {
      // Initialize choices - null for multiple options, 0 for single options
      selectedEquipmentChoices.value = choices.map(choice => {
        // Auto-select single-option choices, leave multi-option choices unselected
        return choice.options && choice.options.length === 1 ? 0 : null;
      });
      // Save initial choices to character store
      characterStore.setEquipmentChoices(selectedEquipmentChoices.value);
    }
    // Update character equipment based on selections
    updateCharacterEquipmentFromChoices();
  }
}

// Watch for class changes to reinitialize equipment choices
watch(() => character.value?.selectedClass?.id, (newClassId, oldClassId) => {
  if (newClassId && newClassId !== oldClassId) {
    // Slight delay to ensure equipment choices are updated
    setTimeout(() => {
      initializeEquipmentChoices();
    }, 100);
  }
});

// Watch for character ID changes (new character creation)
watch(() => character.value?.id, (newId, oldId) => {
  // If character ID changes or becomes null/undefined (new character)
  if (newId !== oldId) {
    // Reset equipment choices for new character
    selectedEquipmentChoices.value = [];
    // Clear any stored equipment choices
    characterStore.setEquipmentChoices([]);
    // Reinitialize equipment choices with force reset
    setTimeout(() => {
      initializeEquipmentChoices(true);
    }, 100);
  }
});

// Watch for character reset (when character becomes null/undefined)
watch(() => character.value, (newChar, oldChar) => {
  if (!newChar && oldChar) {
    // Character was cleared/reset
    selectedEquipmentChoices.value = [];
    characterStore.setEquipmentChoices([]);
  }
}, { immediate: false });
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

.proficient-instrument {
  border: 3px solid #9c27b0 !important;
  box-shadow: 0 4px 12px rgba(156, 39, 176, 0.4) !important;
  background: rgba(156, 39, 176, 0.05) !important;
}

.proficient-instrument:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(156, 39, 176, 0.5) !important;
  border-color: #7b1fa2 !important;
}

/* Toggle button custom styles */
.custom-toggle .toggle-btn {
  border: none !important;
  background: transparent;
  transition: background 0.2s;
  border-radius: 999px !important;
}

.custom-toggle .toggle-btn:hover {
  background: rgba(0, 0, 0, 0.06);
  border-radius: 999px !important;
}

.custom-toggle .selected-package {
  background: var(--v-theme-primary, var(--v-primary-base, #1976d2)) !important;
  color: #fff !important;
  border-radius: 999px;
  box-shadow: none !important;
}

.custom-toggle .selected-gold {
  background: #8d6a00 !important;
  /* Even darker gold */
  color: #ffffff !important;
  border-radius: 999px;
  box-shadow: none !important;
  font-weight: 600 !important;
}

.custom-toggle .selected-gold *,
.custom-toggle .selected-gold .v-btn__content {
  color: #ffffff !important;
  text-shadow: none !important;
  font-weight: 600 !important;
}

/* Uniform height for all item cards in standard package */
.uniform-item-card {
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Ensure pure white text for selected-gold toggle, even inside Vuetify's deep structure */
:deep(.custom-toggle .selected-gold),
:deep(.custom-toggle .selected-gold .v-btn__content),
:deep(.custom-toggle .selected-gold .v-btn__content *) {
  color: #fff !important;
  text-shadow: none !important;
  font-weight: 600 !important;
}

/* Equipment choice styles */
.equipment-choice-card {
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.equipment-option-card {
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.equipment-option-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.selected-option {
  border-color: var(--v-theme-primary) !important;
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(25, 118, 210, 0.4);
}

.selected-option .v-card-title,
.selected-option .v-card-text {
  color: white !important;
}

.selected-option .v-chip {
  background: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
}

/* Compact card styles */
.compact-option-card {
  min-height: auto !important;
}

.compact-items-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.background-equipment-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.equipment-choice-card .v-card-title {
  padding-top: 8px;
  padding-bottom: 8px;
}

.equipment-choice-card .v-card-text {
  padding-top: 8px;
  padding-bottom: 8px;
}

/* Equipment choice chip styles */
.equipment-choice-chip {
  min-height: 48px !important;
  padding: 8px 16px !important;
  max-width: 400px;
}

.equipment-choice-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.equipment-choice-chip.v-chip--variant-elevated {
  box-shadow: 0 6px 20px rgba(25, 118, 210, 0.3);
}

.choice-required-chip.v-chip {
  background: linear-gradient(45deg, var(--v-theme-warning) 0%, var(--v-theme-warning-darken-1) 100%) !important;
  color: white !important;
  border: 2px solid var(--v-theme-warning-darken-2);
  position: relative;
}

.choice-required-chip.v-chip:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}

.choice-required-chip .v-chip__content {
  display: flex;
  align-items: center;
  gap: 4px;
}

.musical-instrument-chip.v-chip {
  cursor: pointer !important;
  transition: all 0.2s ease;
}

.musical-instrument-chip.v-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.musical-instrument-chip.choice-required-chip:hover {
  transform: scale(1.05) translateY(-2px);
}

.weapon-selection-card {
  transition: all 0.2s ease;
  cursor: pointer;
}

.weapon-selection-card:hover {
  transform: translateY(-2px);
}

.weapon-selection-card.selected {
  border: 2px solid var(--v-theme-primary);
}

.weapon-selection-card.selected .v-card-title {
  color: white;
}

.weapon-selection-card.selected .v-card-text {
  color: rgba(255, 255, 255, 0.8);
}

/* Equipment pack tooltip styling */
.equipment-pack-contents {
  max-height: 200px;
  overflow-y: auto;
  padding: 4px 0;
}

.pack-item {
  line-height: 1.3;
  margin-bottom: 2px;
  color: rgba(0, 0, 0, 0.87);
}

.equipment-tooltip {
  max-width: 320px;
}

/* Enhanced tooltip styling */
.equipment-tooltip .text-caption {
  line-height: 1.4;
}

/* Chip alignment and padding fixes */
.v-chip {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center !important;
  vertical-align: middle !important;
  min-height: 32px !important;
  padding: 0 12px 0 16px !important;
}

.v-chip.size-large {
  min-height: 40px !important;
  padding: 0 16px 0 20px !important;
  font-size: 0.875rem !important;
}

.v-chip .v-chip__content {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 100% !important;
  text-align: center !important;
  line-height: 1.2 !important;
  gap: 6px !important;
  padding-left: 2px !important;
}

.v-chip .v-icon {
  margin: 0 !important;
  vertical-align: middle !important;
  flex-shrink: 0 !important;
}

/* Equipment choice chip specific styling */
.equipment-choice-chip {
  min-width: 120px !important;
  text-align: center !important;
}

/* Background equipment chip styling */
.musical-instrument-chip,
.choice-required-chip {
  min-width: 100px !important;
}

/* Ensure all chips have consistent baseline alignment */
.d-flex .v-chip {
  align-self: center !important;
}

/* Custom chip styling for purchased items - focus on text alignment */
.custom-chip .v-chip__close {
  margin-right: 8px !important;
  line-height: 1 !important;
  display: inline-flex !important;
  align-items: baseline !important;
}

.custom-chip .v-chip__close .v-icon {
  line-height: 1 !important;
  vertical-align: baseline !important;
  display: inline-block !important;
}

/* Ensure chip text and close button share same line height */
.custom-chip .v-chip__content {
  line-height: 1 !important;
  display: inline-flex !important;
  align-items: baseline !important;
}

.custom-chip {
  line-height: 1 !important;
}

/* Only fix X button spacing and alignment - try global styles */
.v-chip.v-chip--closable .v-chip__close {
  margin-right: 8px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 32px !important;
  height: 32px !important;
  min-width: 32px !important;
  min-height: 32px !important;
}

.v-chip.v-chip--closable .v-chip__close .v-icon {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 20px !important;
  width: 20px !important;
  height: 20px !important;
}

/* Ensure chip content is centered */
.v-chip .v-chip__content {
  display: flex !important;
  align-items: center !important;
}

/* Equipment shop styling */
.equipment-shop-category {
  height: 100%;
}

.shop-item-card {
  transition: all 0.2s ease;
}

.shop-item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.weapon-grid,
.armor-grid,
.gear-grid {
  max-height: 400px;
  overflow-y: auto;
}
</style>

<style>
/* Unscoped styles to override Vuetify's chip X button alignment */
.custom-chip .v-chip__close {
  margin-right: -2px !important;
  margin-left: 6px !important;
}

.custom-chip {
  align-items: center !important;
}

.custom-chip .v-chip__content,
.custom-chip .v-chip__close,
.custom-chip .v-chip__close .v-icon {
  line-height: 1.2 !important;
  vertical-align: middle !important;
  display: flex !important;
  align-items: center !important;
}
</style>
