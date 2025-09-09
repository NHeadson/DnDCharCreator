<template>
  <div class="characters-page theme-background theme-aware">
    <v-container class="pa-4">
      <!-- Quick Actions Bar -->
      <v-container class="px-0 pb-0" fluid>
        <v-card class="mb-4" :class="{ 'py-2': true }" variant="outlined">
          <v-container :class="{ 'px-4': true, 'py-1': true }">
            <!-- Desktop Layout (above 1117px) -->
            <v-row align="center" class="no-gutters quick-actions-desktop" justify="center">
              <!-- Access Status -->
              <v-col class="d-flex justify-center px-3" cols="6" lg="2" md="3" order="1" order-lg="2" sm="6">
                <div v-if="hasAccess" class="d-flex flex-column align-center">
                  <div class="d-flex align-center justify-center">
                    <v-chip class="quick-actions-chip" color="success" prepend-icon="mdi-account-check" size="small"
                      variant="elevated">
                      <span class="d-none d-md-inline">Group Access</span>
                      <span class="d-inline d-md-none">Group</span>
                    </v-chip>
                  </div>
                </div>
                <div v-else class="d-flex flex-column align-center">
                  <div class="d-flex align-center justify-center">
                    <v-chip class="quick-actions-chip" color="warning" prepend-icon="mdi-lock" size="small"
                      variant="elevated">
                      <span class="d-none d-md-inline">Access Required</span>
                      <span class="d-inline d-md-none">Access</span>
                    </v-chip>
                  </div>
                </div>
              </v-col>

              <!-- Admin Status -->
              <v-col class="d-flex justify-center px-3" cols="6" lg="2" md="3" order="2" order-lg="3" sm="6">
                <div v-if="adminStore.isAdminUser" class="d-flex flex-column align-center">
                  <div class="d-flex align-center justify-center">
                    <v-chip class="ma-0 quick-actions-chip admin-status-chip" color="success"
                      prepend-icon="mdi-shield-check" size="small" variant="elevated">
                      <span class="d-none d-md-inline">Admin</span>
                      <span class="d-inline d-md-none">Admin</span>
                    </v-chip>
                    <v-btn class="logout-btn" color="grey" size="medium" title="Logout from admin" variant="text"
                      @click="adminLogout">
                      <v-icon size="medium">mdi-logout</v-icon>
                    </v-btn>
                  </div>
                </div>
                <!-- Admin Login Button -->
                <div v-else-if="hasAccess" class="d-flex flex-column align-center">
                  <div class="d-flex align-center justify-center">
                    <v-chip class="quick-actions-chip admin-status-chip" color="warning" data-admin-login
                      prepend-icon="mdi-shield-key" size="small" variant="elevated" @click="showAdminLogin">
                      <span class="d-none d-md-inline">Admin Login</span>
                      <span class="d-inline d-md-none">Login</span>
                    </v-chip>
                  </div>
                </div>
                <div v-else class="d-flex flex-column align-center">
                  <div class="text-caption text-grey">
                    Admin requires access first
                  </div>
                </div>
              </v-col>

              <!-- Character Count -->
              <v-col class="d-flex justify-center px-3" cols="6" lg="2" md="3" order="3" order-lg="1" sm="6">
                <div class="d-flex align-center text-no-wrap">
                  <v-icon class="me-2 flex-shrink-0" color="accent" size="large">mdi-information</v-icon>
                  <span class="text-subtitle-1 theme-secondary text-no-wrap">
                    <strong>{{ characters.length }}</strong> character{{ characters.length !== 1 ? 's' : '' }}
                  </span>
                </div>
              </v-col>

              <!-- Create Character Button -->
              <v-col class="d-flex justify-center px-3" cols="6" lg="2" md="3" order="4" order-lg="4" sm="6">
                <v-btn v-if="hasAccess" class="text-white create-character-btn align-center" color="accent"
                  prepend-icon="mdi-plus" variant="elevated" @click="requireAccessForCreation">
                  <span class="d-none d-xl-inline">Create New</span>
                  <span class="d-inline d-xl-none">New</span>
                </v-btn>
                <v-btn v-else class="create-character-btn" color="grey" prepend-icon="mdi-lock" variant="outlined"
                  @click="requireAccessForCreation">
                  <span class="d-none d-xl-inline">Create New</span>
                  <span class="d-inline d-xl-none">New</span>
                </v-btn>
              </v-col>
            </v-row>

            <!-- Mobile Layout (1117px and below) -->
            <div class="quick-actions-mobile">
              <!-- Top Row - Always visible (Character Count & Create Button) -->
              <v-row align="center" class="no-gutters mb-1" justify="center">
                <!-- Character Count -->
                <v-col class="d-flex justify-center px-2" cols="6">
                  <div class="d-flex align-center text-no-wrap">
                    <v-icon class="me-2 flex-shrink-0" color="accent" size="medium">mdi-information</v-icon>
                    <span class="text-subtitle-2">
                      <strong>{{ characters.length }}</strong> character{{ characters.length !== 1 ? 's' : '' }}
                    </span>
                  </div>
                </v-col>

                <!-- Create Character Button -->
                <v-col class="d-flex justify-center px-2" cols="6">
                  <v-btn v-if="hasAccess" class="text-white create-character-btn-mobile" color="accent"
                    prepend-icon="mdi-plus" size="small" variant="elevated" @click="requireAccessForCreation">
                    <span>Create New</span>
                  </v-btn>
                  <v-btn v-else class="create-character-btn-mobile" color="grey" prepend-icon="mdi-lock" size="small"
                    variant="outlined" @click="requireAccessForCreation">
                    <span>Create New</span>
                  </v-btn>
                </v-col>
              </v-row>

              <!-- Expandable Bottom Row (Access & Admin Status) -->
              <v-expand-transition>
                <div v-show="mobileActionsExpanded">
                  <v-row align="center" class="no-gutters mb-1" justify="center">
                    <!-- Access Status -->
                    <v-col class="d-flex justify-center px-2" cols="6">
                      <div v-if="hasAccess" class="d-flex flex-column align-center">
                        <v-chip class="quick-actions-chip-mobile" color="success" prepend-icon="mdi-account-check"
                          size="small" variant="elevated">
                          <span>Group Access</span>
                        </v-chip>
                      </div>
                      <div v-else class="d-flex flex-column align-center">
                        <v-chip class="quick-actions-chip-mobile" color="warning" prepend-icon="mdi-lock" size="small"
                          variant="elevated">
                          <span>Access Required</span>
                        </v-chip>
                      </div>
                    </v-col>

                    <!-- Admin Status -->
                    <v-col class="d-flex justify-center px-2" cols="6">
                      <div v-if="adminStore.isAdminUser" class="d-flex align-center">
                        <v-chip class="quick-actions-chip-mobile admin-status-chip" color="success"
                          prepend-icon="mdi-shield-check" size="small" variant="elevated">
                          <span>Admin</span>
                        </v-chip>
                        <v-btn class="logout-btn ml-1" color="grey" size="small" title="Logout from admin"
                          variant="text" @click="adminLogout">
                          <v-icon size="small">mdi-logout</v-icon>
                        </v-btn>
                      </div>
                      <div v-else-if="hasAccess" class="d-flex flex-column align-center">
                        <v-chip class="quick-actions-chip-mobile admin-status-chip" color="warning" data-admin-login
                          prepend-icon="mdi-shield-key" size="small" variant="elevated" @click="showAdminLogin">
                          <span>Admin Login</span>
                        </v-chip>
                      </div>
                      <div v-else class="d-flex flex-column align-center">
                        <div class="text-caption text-grey text-center">
                          Admin requires access first
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </v-expand-transition>

              <!-- Expand/Collapse Button -->
              <div class="text-center">
                <v-btn class="expand-toggle-btn" color="primary" size="small" variant="text"
                  @click="mobileActionsExpanded = !mobileActionsExpanded">
                  <v-icon size="small">{{ mobileActionsExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                  <span class="ml-1">{{ mobileActionsExpanded ? 'Less' : 'More' }}</span>
                </v-btn>
              </div>
            </div>
          </v-container>
        </v-card>
      </v-container>

      <!-- Header Section -->
      <div class="page-header text-center mb-4">
        <h1 class="display-1 font-weight-bold text-primary mb-2">🎭 My Characters</h1>
        <p class="text-h6 text-grey-darken-1">Your collection of heroes and adventurers</p>
        <v-divider class="mx-auto mt-4" style="max-width: 200px; border-color: var(--theme-accent);" />
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center pa-8">
        <v-progress-circular class="mb-4" color="accent" indeterminate size="64" width="6" />
        <h3 class="text-h5 text-grey-darken-1">Loading your characters...</h3>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center pa-8">
        <v-icon class="mb-4" color="error" size="64">mdi-alert-circle</v-icon>
        <v-alert class="mb-4 mx-auto" style="max-width: 600px;" type="error" variant="tonal">
          <v-alert-title>Something went wrong</v-alert-title>
          {{ error }}
        </v-alert>
        <v-btn color="accent" prepend-icon="mdi-refresh" variant="elevated" @click="loadCharacters">
          Try Again
        </v-btn>
      </div>

      <!-- Empty State -->
      <div v-else-if="characters.length === 0" class="empty-state text-center pa-8">
        <v-card class="mx-auto pa-8" style="max-width: 600px; background: var(--theme-card-bg);" variant="tonal">
          <v-icon class="mb-4" color="primary-lighten-1" size="80">mdi-sword-cross</v-icon>
          <h2 class="text-h4 font-weight-bold text-primary mb-3">Your Adventure Awaits</h2>
          <p class="text-h6 text-grey-darken-1 mb-6">
            You haven't created any characters yet. Start your legendary journey today!
          </p>
          <v-btn v-if="hasAccess" class="create-character-btn" color="accent" prepend-icon="mdi-plus-circle"
            size="large" variant="elevated" @click="requireAccessForCreation">
            Create Your First Character
          </v-btn>
          <v-btn v-else class="create-character-btn" color="grey" prepend-icon="mdi-lock" size="large"
            variant="outlined" @click="requireAccessForCreation">
            Get Access to Create Characters
          </v-btn>
        </v-card>
      </div>

      <!-- Characters Grid -->
      <div v-else>
        <!-- Character Cards -->
        <v-row>
          <v-col v-for="character in characters" :key="character.id" cols="12" lg="4" md="6" sm="12" xl="4">
            <v-card class="character-card h-100" elevation="4" hover :style="{ background: 'var(--theme-surface)' }">
              <!-- Character Header with Background -->
              <div class="character-header" :style="getCharacterHeaderStyle(character)">
                <div class="character-overlay pa-3">
                  <div class="d-flex align-center mb-2">
                    <v-avatar class="me-3 elevation-2" color="white" size="48">
                      <v-icon :color="getClassColor(character.classDetails?.name)" size="32">
                        {{ getClassIcon(character.classDetails?.name) }}
                      </v-icon>
                    </v-avatar>
                    <div class="character-title">
                      <h3 class="text-h5 font-weight-bold text-white mb-0">
                        {{ character.name || 'Unnamed Character' }}
                      </h3>
                      <p class="text-subtitle-2 text-white opacity-90 mb-0">
                        {{ character.playerName || 'Unknown Player' }}
                      </p>
                    </div>
                  </div>

                  <div class="character-subtitle">
                    <v-tooltip location="top"
                      text="Character's current level - determines abilities and features available">
                      <template #activator="{ props }">
                        <v-chip v-bind="props" class="me-2" size="small"
                          style="background: var(--theme-card-bg); color: var(--theme-text-primary); font-weight: 600;">
                          Level {{ character.level || 1 }}
                        </v-chip>
                      </template>
                    </v-tooltip>
                    <v-tooltip location="top" text="Experience points earned - determines when character levels up">
                      <template #activator="{ props }">
                        <v-chip v-bind="props" class="me-2" size="small"
                          style="background: var(--theme-card-bg); color: var(--theme-text-primary); font-weight: 600;">
                          XP {{ character.xp || 0 }}
                        </v-chip>
                      </template>
                    </v-tooltip>
                    <v-tooltip location="top" text="Character's class - defines their role and abilities">
                      <template #activator="{ props }">
                        <v-chip v-bind="props" color="accent" size="small" text-color="black" variant="elevated">
                          {{ character.classDetails?.name || 'Unknown Class' }}
                        </v-chip>
                      </template>
                    </v-tooltip>
                  </div>
                </div>
              </div>

              <!-- Character Details -->
              <v-card-text class="pa-3">
                <!-- Essential Combat Stats (Always Visible) -->
                <div class="essential-stats mb-3">
                  <v-row dense>
                    <v-col cols="3">
                      <v-card class="text-center d-flex flex-column justify-center align-center essential-stat-card"
                        style="background: var(--theme-surface); min-height: 80px;" variant="tonal">
                        <v-icon color="error" size="small">mdi-heart</v-icon>
                        <div class="text-caption font-weight-bold">HP</div>
                        <div class="text-h6 font-weight-bold">
                          {{ (character.level * 8) + (character.abilityScores?.constitution?.modifier || 0) }}
                        </div>
                      </v-card>
                    </v-col>
                    <v-col cols="3">
                      <v-card class="text-center d-flex flex-column justify-center align-center essential-stat-card"
                        style="background: var(--theme-surface); min-height: 80px;" variant="tonal">
                        <v-icon color="blue-darken-2" size="small">mdi-shield</v-icon>
                        <div class="text-caption font-weight-bold">AC</div>
                        <div class="text-h6 font-weight-bold">
                          {{ 10 + (character.abilityScores?.dexterity?.modifier || 0) }}
                        </div>
                      </v-card>
                    </v-col>
                    <v-col cols="3">
                      <v-card class="text-center d-flex flex-column justify-center align-center essential-stat-card"
                        style="background: var(--theme-surface); min-height: 80px;" variant="tonal">
                        <v-icon color="green-darken-2" size="small">mdi-run-fast</v-icon>
                        <div class="text-caption font-weight-bold">Speed</div>
                        <div class="text-h6 font-weight-bold">
                          {{ character.speciesDetails?.speed || 30 }}
                        </div>
                      </v-card>
                    </v-col>
                    <v-col cols="3">
                      <v-card class="text-center d-flex flex-column justify-center align-center essential-stat-card"
                        style="background: var(--theme-surface); min-height: 80px;" variant="tonal">
                        <v-icon color="purple-darken-2" size="small">mdi-sword-cross</v-icon>
                        <div class="text-caption font-weight-bold">Init</div>
                        <div class="text-h6 font-weight-bold">
                          {{ (character.abilityScores?.dexterity?.modifier || 0) >= 0 ? '+' : '' }}{{
                            character.abilityScores?.dexterity?.modifier || 0 }}
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>

                <!-- Core Character Info (Always Visible) -->
                <div class="core-character-info mb-3">
                  <v-row dense>
                    <v-col cols="6">
                      <div class="d-flex align-center mb-2">
                        <v-icon class="me-2" color="blue-darken-2" size="small">mdi-dna</v-icon>
                        <span class="text-caption font-weight-bold text-blue-darken-2 me-2">Species:</span>
                        <span class="text-body-2 font-weight-medium">
                          {{ character.speciesDetails?.name || 'Unknown' }}
                          <span v-if="getLineageName(character)" class="text-caption text-grey ms-1">
                            ({{ getLineageName(character) }})
                          </span>
                        </span>
                      </div>
                      <div class="d-flex align-center">
                        <v-icon class="me-2" color="green-darken-2" size="small">mdi-book-open-page-variant</v-icon>
                        <span class="text-caption font-weight-bold text-green-darken-2 me-2">Background:</span>
                        <span class="text-body-2 font-weight-medium">{{ getBackgroundName(character) }}</span>
                      </div>
                    </v-col>
                    <v-col cols="6">
                      <div class="d-flex align-center mb-2">
                        <v-icon class="me-2" color="purple-darken-2" size="small">mdi-compass</v-icon>
                        <span class="text-caption font-weight-bold text-purple-darken-2 me-2">Alignment:</span>
                        <span class="text-body-2 font-weight-medium text-no-wrap">{{ character.alignment || 'Neutral'
                        }}</span>
                      </div>
                      <div class="d-flex align-center">
                        <v-icon class="me-2" color="orange-darken-2" size="small">mdi-star-outline</v-icon>
                        <span class="text-caption font-weight-bold text-orange-darken-2 me-2">Proficiency:</span>
                        <span class="text-body-2 font-weight-medium">+{{ Math.ceil(character.level / 4) + 1 }}</span>
                      </div>
                    </v-col>
                  </v-row>
                </div>

                <!-- Ability Scores (Always Visible) -->
                <div class="ability-scores-main mb-3">
                  <h4 class="text-subtitle-2 font-weight-bold mb-2 d-flex align-center">
                    <v-icon class="me-2" color="primary" size="small">mdi-chart-box</v-icon>
                    Ability Scores
                  </h4>
                  <v-row dense>
                    <v-col
                      v-for="abilityKey in ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']"
                      :key="abilityKey" cols="4" lg="2" md="2" sm="4">
                      <v-card class="pa-2 text-center ability-score-card-main" variant="outlined">
                        <div class="text-caption font-weight-bold text-primary">
                          {{ ({
                            strength: 'STR', dexterity: 'DEX', constitution: 'CON', intelligence: 'INT', wisdom: 'WIS',
                            charisma: 'CHA'
                          })[abilityKey] }}
                        </div>
                        <div class="text-h6 font-weight-bold"
                          :class="(character.abilityScores?.[abilityKey]?.modifier ?? 0) >= 0 ? 'text-success' : 'text-error'">
                          {{ (character.abilityScores?.[abilityKey]?.modifier ?? 0) >= 0 ? '+' : '' }}{{
                            character.abilityScores?.[abilityKey]?.modifier ?? 0 }}
                        </div>
                        <div class="text-caption">{{ character.abilityScores?.[abilityKey]?.score ?? '-' }}
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>

                <!-- Starting Inventory (Always Visible) -->
                <div v-if="getCharacterInventory(character).length > 0" class="character-inventory mb-3">
                  <h4 class="text-subtitle-2 font-weight-bold mb-2 d-flex align-center">
                    <v-icon class="me-2" color="brown-darken-2" size="small">mdi-bag-personal</v-icon>
                    Starting Inventory
                  </h4>
                  <div class="d-flex flex-wrap" style="gap: 4px;">
                    <v-tooltip v-for="item in getCharacterInventory(character)"
                      :key="`${item.originalName}-${item.source}`" location="top" max-width="300">
                      <template #activator="{ props }">
                        <v-chip v-bind="props" :color="item.source === 'class' || item.source === 'class-default' ? 'blue-lighten-4' :
                          item.source === 'background' ? 'green-lighten-4' :
                            'grey-lighten-3'" size="small" variant="tonal">
                          {{ item.name }}
                        </v-chip>
                      </template>
                      <template v-if="getEquipmentTooltip(item.originalName)" #default>
                        <div class="text-body-2 font-weight-bold mb-1">{{ item.name }}</div>
                        <div class="text-caption mb-1" v-if="getEquipmentTooltip(item.originalName).type">
                          <strong>Type:</strong> {{ getEquipmentTooltip(item.originalName).type }}
                        </div>
                        <div class="text-caption mb-1" v-if="getEquipmentTooltip(item.originalName).damage">
                          <strong>Damage:</strong> {{ getEquipmentTooltip(item.originalName).damage }}
                        </div>
                        <div class="text-caption mb-1" v-if="getEquipmentTooltip(item.originalName).ac">
                          <strong>AC:</strong> {{ getEquipmentTooltip(item.originalName).ac }}
                        </div>
                        <div class="text-caption mb-1"
                          v-if="getEquipmentTooltip(item.originalName).properties && getEquipmentTooltip(item.originalName).properties !== 'None'">
                          <strong>Properties:</strong> {{ getEquipmentTooltip(item.originalName).properties }}
                        </div>
                        <div class="text-caption mt-2">
                          {{ getEquipmentTooltip(item.originalName).description }}
                        </div>
                        <div class="text-caption mt-2 font-weight-bold" style="color: #1976d2;">
                          Source: {{ item.source === 'class' || item.source === 'class-default' ? 'Class Equipment' :
                            item.source === 'background' ? 'Background Equipment' :
                              item.source === 'purchased' ? 'Purchased with Gold' :
                                'Starting Equipment' }}
                        </div>
                      </template>
                      <template v-else #default>
                        <div class="text-body-2 font-weight-bold mb-1">{{ item.name }}</div>
                        <div class="text-caption">{{ item.description || 'No description available' }}</div>
                        <div class="text-caption mt-2 font-weight-bold" style="color: #1976d2;">
                          Source: {{ item.source === 'class' || item.source === 'class-default' ? 'Class Equipment' :
                            item.source === 'background' ? 'Background Equipment' :
                              item.source === 'purchased' ? 'Purchased with Gold' :
                                'Starting Equipment' }}
                        </div>
                      </template>
                    </v-tooltip>
                  </div>
                </div>

                <!-- Show More Details Expansion -->
                <v-expansion-panels class="character-details-expansion" variant="accordion">
                  <v-expansion-panel>
                    <v-expansion-panel-title class="pa-2">
                      <div class="d-flex align-center w-100">
                        <v-icon class="me-2" color="primary" size="small">mdi-information-outline</v-icon>
                        <span class="text-subtitle-2 font-weight-bold">Show More Details</span>
                        <v-spacer />
                        <v-chip color="primary" size="x-small" variant="tonal">
                          {{ getCharacterDetailsCount(character) }} items
                        </v-chip>
                      </div>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text class="pa-3">

                      <!-- Notable Features -->
                      <div v-if="getNotableFeatures(character).length > 0" class="notable-features mb-4">
                        <h4 class="text-subtitle-2 font-weight-bold mb-2 d-flex align-center">
                          <v-icon class="me-2" color="amber-darken-2" size="small">mdi-star-circle</v-icon>
                          Notable Features
                        </h4>
                        <div class="d-flex flex-wrap" style="gap: 4px;">
                          <v-chip v-for="feature in getNotableFeatures(character)" :key="feature" color="accent"
                            size="small" variant="elevated">
                            {{ feature }}
                          </v-chip>
                        </div>
                      </div>

                      <!-- Skills -->
                      <div v-if="getCharacterSkills(character).length > 0" class="character-skills mb-4">
                        <h4 class="text-subtitle-2 font-weight-bold mb-2 d-flex align-center">
                          <v-icon class="me-2" color="green-darken-2" size="small">mdi-brain</v-icon>
                          Skill Proficiencies
                        </h4>
                        <div class="d-flex flex-wrap" style="gap: 4px;">
                          <v-tooltip v-for="skill in getCharacterSkills(character)" :key="skill" location="top"
                            text="A trained ability that can be used for various actions and checks">
                            <template #activator="{ props }">
                              <v-chip v-bind="props" color="green-lighten-4" size="small" variant="tonal">
                                {{ skill }}
                              </v-chip>
                            </template>
                          </v-tooltip>
                        </div>
                      </div>

                      <!-- Languages -->
                      <div v-if="getCharacterLanguages(character).length > 0" class="character-languages mb-4">
                        <h4 class="text-subtitle-2 font-weight-bold mb-2 d-flex align-center">
                          <v-icon class="me-2" color="purple-darken-2" size="small">mdi-translate</v-icon>
                          Languages
                        </h4>
                        <div class="d-flex flex-wrap" style="gap: 4px;">
                          <v-tooltip v-for="lang in getCharacterLanguages(character)" :key="lang" location="top"
                            text="A language this character can speak, read, and write">
                            <template #activator="{ props }">
                              <v-chip v-bind="props" color="purple-lighten-4" size="small" variant="tonal">
                                {{ lang }}
                              </v-chip>
                            </template>
                          </v-tooltip>
                        </div>
                      </div>

                      <!-- Tools -->
                      <div v-if="getCharacterTools(character).length > 0" class="character-tools">
                        <h4 class="text-subtitle-2 font-weight-bold mb-2 d-flex align-center">
                          <v-icon class="me-2" color="orange-darken-2" size="small">mdi-tools</v-icon>
                          Tool Proficiencies
                        </h4>
                        <div class="d-flex flex-wrap" style="gap: 4px;">
                          <v-tooltip v-for="tool in getCharacterTools(character)" :key="tool" location="top"
                            text="Equipment or tools this character is trained to use effectively">
                            <template #activator="{ props }">
                              <v-chip v-bind="props" color="orange-lighten-4" size="small" variant="tonal">
                                {{ tool }}
                              </v-chip>
                            </template>
                          </v-tooltip>
                        </div>
                      </div>

                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-card-text>

              <!-- Actions -->
              <v-card-actions class="pa-4 pt-0">
                <v-row dense>
                  <v-col cols="8">
                    <v-btn block class="admin-action-btn" :class="{ 'admin-protected': !adminStore.isAdminUser }"
                      :color="adminStore.isAdminUser ? 'primary' : 'grey'" size="large" variant="elevated"
                      @click="editCharacter(character)">
                      <template #prepend>
                        <v-icon>{{ adminStore.isAdminUser ? 'mdi-pencil' : 'mdi-shield-key' }}</v-icon>
                      </template>
                      {{ adminStore.isAdminUser ? 'Edit Character' : 'Edit (Admin)' }}
                    </v-btn>
                  </v-col>
                  <v-col cols="4">
                    <v-btn block class="admin-action-btn" :class="{ 'admin-protected': !adminStore.isAdminUser }"
                      :color="adminStore.isAdminUser ? 'error' : 'grey'" size="large"
                      :title="adminStore.isAdminUser ? 'Delete Character' : 'Delete (Admin Only)'" variant="outlined"
                      @click="confirmDelete(character)">
                      <v-icon>{{ adminStore.isAdminUser ? 'mdi-delete' : 'mdi-shield-key' }}</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>

    <!-- Enhanced Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="480">
      <v-card>
        <v-card-title class="d-flex align-center text-h5">
          <v-icon class="me-2" color="error">mdi-alert-circle</v-icon>
          Delete Character
        </v-card-title>
        <v-card-text class="text-body-1">
          <p class="mb-3">
            Are you sure you want to delete <strong>"{{ selectedCharacter?.name }}"</strong>?
          </p>
          <v-alert class="mb-0" type="warning" variant="tonal">
            This action cannot be undone. All character data will be permanently lost.
          </v-alert>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="outlined" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" prepend-icon="mdi-delete" variant="elevated" @click="deleteCharacter">
            Delete Forever
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Admin Authentication Dialog -->
    <AdminAuthDialog />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AdminAuthDialog from '@/components/AdminAuthDialog.vue'
import { useAdminStore } from '@/stores/adminStore'
import { useAdminAuth } from '@/composables/useAdminAuth'
import { useFirestore } from '@/composables/useFirestore'

const router = useRouter()
const { getCharacters, deleteCharacter: deleteFromFirestore } = useFirestore()
const adminStore = useAdminStore()
const {
  isAuthenticated,
  showAuthDialog,
  requireAuth,
  logout,
  extendSession,
} = useAdminAuth()

const hasAccess = computed(() => adminStore.isAccessValid)
const requireAccess = adminStore.requireAccess
const extendAccessSession = adminStore.extendAccessSession
const getRemainingAccessTime = adminStore.getRemainingAccessTime

// Reactive data
const characters = ref([])
const loading = ref(true)
const error = ref(null)
const deleteDialog = ref(false)
const selectedCharacter = ref(null)
const mobileActionsExpanded = ref(false)

// Helper functions for styling
const getCharacterHeaderStyle = character => {
  const classColors = {
    Barbarian: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
    Bard: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    Cleric: 'linear-gradient(135deg, #87CEEB 0%, #4682B4 100%)',
    Druid: 'linear-gradient(135deg, #228B22 0%, #32CD32 100%)',
    Fighter: 'linear-gradient(135deg, #B22222 0%, #DC143C 100%)',
    Monk: 'linear-gradient(135deg, #8A2BE2 0%, #9370DB 100%)',
    Paladin: 'linear-gradient(135deg, #FFD700 0%, #F0E68C 100%)',
    Ranger: 'linear-gradient(135deg, #006400 0%, #228B22 100%)',
    Rogue: 'linear-gradient(135deg, #2F4F4F 0%, #696969 100%)',
    Sorcerer: 'linear-gradient(135deg, #FF4500 0%, #FF6347 100%)',
    Warlock: 'linear-gradient(135deg, #4B0082 0%, #8A2BE2 100%)',
    Wizard: 'linear-gradient(135deg, #191970 0%, #4169E1 100%)',
  }

  const className = character.classDetails?.name
  const background = classColors[className] || 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'

  return {
    background,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
  }
}

const getClassIcon = className => {
  const classIcons = {
    Barbarian: 'mdi-axe',
    Bard: 'mdi-music',
    Cleric: 'mdi-cross',
    Druid: 'mdi-leaf',
    Fighter: 'mdi-sword',
    Monk: 'mdi-hand-peace',
    Paladin: 'mdi-shield-sword',
    Ranger: 'mdi-bow-arrow',
    Rogue: 'mdi-knife',
    Sorcerer: 'mdi-fire',
    Warlock: 'mdi-eye',
    Wizard: 'mdi-hat-fedora',
  }
  return classIcons[className] || 'mdi-account'
}

const getClassColor = className => {
  const classColors = {
    Barbarian: '#8B4513',
    Bard: '#FFD700',
    Cleric: '#4682B4',
    Druid: '#228B22',
    Fighter: '#B22222',
    Monk: '#8A2BE2',
    Paladin: '#FFD700',
    Ranger: '#006400',
    Rogue: '#2F4F4F',
    Sorcerer: '#FF4500',
    Warlock: '#4B0082',
    Wizard: '#191970',
  }
  return classColors[className] || '#6366f1'
}

const getAbilityColor = modifier => {
  if (modifier >= 4) return 'green-lighten-4'
  if (modifier >= 2) return 'blue-lighten-4'
  if (modifier >= 0) return 'grey-lighten-3'
  if (modifier >= -2) return 'orange-lighten-4'
  return 'error-lighten-4'
}

// Get top 3 ability scores for a character
const getTopAbilities = abilityScores => {
  if (!abilityScores) return {}

  const abilities = Object.entries(abilityScores)
    .sort(([, a], [, b]) => b.score - a.score)
    .slice(0, 3)
    .reduce((obj, [key, value]) => {
      obj[key] = value
      return obj
    }, {})

  return abilities
}

// Get notable features for a character
const getNotableFeatures = character => {
  const features = []

  // Add racial traits
  if (character.speciesDetails?.traits) {
    for (const trait of character.speciesDetails.traits) {
      features.push(trait.name)
    }
  }

  // Add class features (placeholder - would need actual class data)
  if (character.classDetails?.name) {
    const classFeatures = {
      Barbarian: ['Rage', 'Unarmored Defense'],
      Bard: ['Bardic Inspiration', 'Spellcasting'],
      Cleric: ['Divine Domain', 'Spellcasting'],
      Druid: ['Druidcraft', 'Spellcasting'],
      Fighter: ['Fighting Style', 'Second Wind'],
      Monk: ['Martial Arts', 'Ki'],
      Paladin: ['Divine Sense', 'Lay on Hands'],
      Ranger: ['Favored Enemy', 'Natural Explorer'],
      Rogue: ['Sneak Attack', 'Thieves\' Cant'],
      Sorcerer: ['Spellcasting', 'Sorcerous Origin'],
      Warlock: ['Otherworldly Patron', 'Pact Magic'],
      Wizard: ['Spellcasting', 'Arcane Recovery'],
    }

    const feats = classFeatures[character.classDetails.name] || []
    features.push(...feats)
  }

  // Add background feature
  if (character.backgroundDetails?.feature?.name) {
    features.push(character.backgroundDetails.feature.name)
  }

  return features
}

// Helper functions for character choices dropdown
const getCharacterChoicesCount = character => {
  let count = 0

  // Count lineage selection
  if (character.speciesLineage) count += 1

  // Count languages
  count += getCharacterLanguages(character).length

  // Count tools
  count += getCharacterTools(character).length

  // Count skills (limit display to avoid overwhelming)
  const skills = getCharacterSkills(character)
  if (skills.length > 0) count += Math.min(skills.length, 6)

  return count
}

// Helper function for character details expansion count
const getCharacterDetailsCount = character => {
  let count = 0

  // Count notable features
  count += getNotableFeatures(character).length

  // Count skills
  count += getCharacterSkills(character).length

  // Count languages
  count += getCharacterLanguages(character).length

  // Count tools
  count += getCharacterTools(character).length

  // Count inventory items
  count += getCharacterInventory(character).length

  return count
}

const getLineageName = character => {
  if (!character.speciesLineage || !character.speciesDetails?.lineages) return ''
  const lineage = character.speciesDetails.lineages.find(l => l.id === character.speciesLineage)
  return lineage?.name || character.speciesLineage
}

const getSpeciesDisplayName = character => {
  const speciesName = character.speciesDetails?.name || 'Unknown'
  const lineageName = getLineageName(character)

  if (lineageName) {
    return `${speciesName} (${lineageName})`
  }

  return speciesName
}

const getBackgroundName = character => {
  // Utility function to capitalize first letter
  const capitalizeFirst = str => {
    if (!str) return str
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  // If backgroundDetails exists, use it
  if (character.backgroundDetails?.name) {
    return capitalizeFirst(character.backgroundDetails.name)
  }

  // Otherwise, look up the name from the background ID
  if (character.background) {
    const backgroundMap = {
      'acolyte': 'Acolyte',
      'criminal': 'Criminal',
      'folk-hero': 'Folk Hero',
      'noble': 'Noble',
      'sage': 'Sage',
      'soldier': 'Soldier',
      'hermit': 'Hermit',
      'entertainer': 'Entertainer',
      'guild-artisan': 'Guild Artisan',
      'outlander': 'Outlander',
    }
    return backgroundMap[character.background] || capitalizeFirst(character.background)
  }

  return 'Unknown'
}

const getCharacterLanguages = character => {
  const languages = []

  // Add common/standard languages (Basic D&D assumption)
  languages.push('Common')

  // Add species languages
  if (character.speciesDetails?.name) {
    const speciesLanguages = {
      'Dragonborn': ['Draconic'],
      'Dwarf': ['Dwarvish'],
      'Elf': ['Elvish'],
      'Gnome': ['Gnomish'],
      'Half-Elf': ['Elvish'],
      'Halfling': ['Halfling'],
      'Half-Orc': ['Orc'],
      'Tiefling': ['Infernal'],
    }
    const speciesLangs = speciesLanguages[character.speciesDetails.name] || []
    languages.push(...speciesLangs)
  }

  // Add additional selected languages if available
  if (character.additionalLanguages) {
    languages.push(...character.additionalLanguages.filter(Boolean))
  }

  return [...new Set(languages)] // Remove duplicates
}

const getCharacterTools = character => {
  const tools = []

  // Add background tools (common examples)
  if (character.backgroundDetails?.name) {
    const backgroundTools = {
      'Acolyte': [],
      'Criminal': ['Thieves\' Tools'],
      'Folk Hero': ['Smith\'s Tools', 'Vehicles (Land)'],
      'Noble': ['Gaming Set'],
      'Sage': [],
      'Soldier': ['Gaming Set', 'Vehicles (Land)'],
    }
    const bgTools = backgroundTools[character.backgroundDetails.name] || []
    tools.push(...bgTools)
  }

  // Add selected tools if available
  if (character.selectedTools) {
    tools.push(...character.selectedTools.filter(Boolean))
  }

  return [...new Set(tools)] // Remove duplicates
}

const getCharacterInventory = character => {
  const inventory = []
  const itemMap = new Map() // To handle duplicates by grouping items

  // Add equipment from character.equipment array
  if (character.equipment && Array.isArray(character.equipment)) {
    character.equipment.forEach((item, index) => {
      if (item && item.name) {
        // Create a key that considers name, source, and cost to identify truly identical items
        const itemKey = `${item.name.toLowerCase()}_${item.source || 'unknown'}_${JSON.stringify(item.cost || {})}`

        if (itemMap.has(itemKey)) {
          // Item already exists - this is a true duplicate, so we keep only one
          // Don't add to quantity since these are duplicate entries, not multiple items
          console.log(`DEBUG: Skipping duplicate entry for ${item.name}`)
        } else {
          // New unique item
          itemMap.set(itemKey, {
            name: item.name,
            originalName: item.name,
            quantity: item.quantity || 1,
            source: item.source || 'unknown',
            cost: item.cost,
            description: item.description
          })
        }
      }
    })
  }

  // Convert map to array and format display names
  itemMap.forEach(item => {
    const displayName = item.quantity > 1
      ? `${item.name} (${item.quantity})`
      : item.name

    inventory.push({
      ...item,
      name: displayName
    })
  })

  // Sort inventory: weapons first, then armor, then other items
  inventory.sort((a, b) => {
    const aName = a.originalName.toLowerCase()
    const bName = b.originalName.toLowerCase()

    // Weapons first
    const aIsWeapon = aName.includes('sword') || aName.includes('axe') || aName.includes('bow') ||
      aName.includes('dagger') || aName.includes('spear') || aName.includes('mace')
    const bIsWeapon = bName.includes('sword') || bName.includes('axe') || bName.includes('bow') ||
      bName.includes('dagger') || bName.includes('spear') || bName.includes('mace')

    // Armor second
    const aIsArmor = aName.includes('armor') || aName.includes('mail') || aName === 'shield'
    const bIsArmor = bName.includes('armor') || bName.includes('mail') || bName === 'shield'

    if (aIsWeapon && !bIsWeapon) return -1
    if (bIsWeapon && !aIsWeapon) return 1
    if (aIsArmor && !bIsArmor && !bIsWeapon) return -1
    if (bIsArmor && !aIsArmor && !aIsWeapon) return 1

    // Alphabetical for items in same category
    return aName.localeCompare(bName)
  })

  console.log('DEBUG: Deduplicated inventory:', inventory)
  return inventory
}

const getEquipmentTooltip = (itemName) => {
  if (!itemName) return null;

  // Clean the item name
  const cleanName = itemName.toLowerCase()
    .replace(/^\d+\s*x?\s*/i, '') // Remove quantity prefix like "2x" or "2 "
    .replace(/\s*x\d+$/i, '') // Remove quantity suffix like " x2"
    .replace(/\s*\(\w+\)$/i, '') // Remove parenthetical like " (longsword)"
    .trim()

  const tooltips = {
    // Weapons
    'rapier': { type: 'Martial Melee Weapon', damage: '1d8 piercing', properties: 'Finesse', description: 'A slender, sharply pointed sword ideal for thrusting attacks.' },
    'dagger': { type: 'Simple Melee Weapon', damage: '1d4 piercing', properties: 'Finesse, Light, Thrown (range 20/60)', description: 'A simple, pointed blade. Can be thrown or used in melee.' },
    'longsword': { type: 'Martial Melee Weapon', damage: '1d8 slashing', properties: 'Versatile (1d10)', description: 'A standard long blade weapon favored by many warriors.' },
    'shortsword': { type: 'Martial Melee Weapon', damage: '1d6 piercing', properties: 'Finesse, Light', description: 'A short blade that is quick and nimble to use.' },
    'scimitar': { type: 'Martial Melee Weapon', damage: '1d6 slashing', properties: 'Finesse, Light', description: 'A curved blade weapon that is both quick and deadly.' },
    'handaxe': { type: 'Simple Melee Weapon', damage: '1d6 slashing', properties: 'Light, Thrown (range 20/60)', description: 'A small axe balanced for throwing or close combat.' },
    'javelin': { type: 'Simple Melee Weapon', damage: '1d6 piercing', properties: 'Thrown (range 30/120)', description: 'A light spear designed for throwing.' },
    'light crossbow': { type: 'Simple Ranged Weapon', damage: '1d8 piercing', properties: 'Ammunition (range 80/320), Loading, Two-handed', description: 'A smaller, easier to use crossbow that requires bolts.' },
    'shortbow': { type: 'Simple Ranged Weapon', damage: '1d6 piercing', properties: 'Ammunition (range 80/320), Two-handed', description: 'A compact bow suitable for hunting and combat.' },
    'crossbow bolts': { type: 'Ammunition', description: 'Ammunition for crossbows. Sold in bundles of 20.' },

    // Armor
    'leather armor': { type: 'Light Armor', ac: '11 + Dex modifier', properties: 'None', description: 'The breastplate and shoulder protectors of this armor are made of leather that has been stiffened by being boiled in oil.' },
    'studded leather': { type: 'Light Armor', ac: '12 + Dex modifier', properties: 'None', description: 'Made from tough but flexible leather, studded leather is reinforced with close-set rivets or spikes.' },
    'chain mail': { type: 'Heavy Armor', ac: '16', properties: 'Stealth Disadvantage', description: 'Made of interlocking metal rings. The suit includes gauntlets.' },
    'scale mail': { type: 'Medium Armor', ac: '14 + Dex modifier (max 2)', properties: 'Stealth Disadvantage', description: 'This armor consists of a coat and leggings of leather covered with overlapping pieces of metal.' },
    'shield': { type: 'Shield', ac: '+2', properties: 'None', description: 'A shield is made from wood or metal and is carried in one hand. Wielding a shield increases your Armor Class by 2.' },

    // Equipment Packs
    'entertainer\'s pack': {
      type: 'Equipment Pack',
      description: 'Includes a backpack, a bedroll, 2 costumes, 5 candles, 5 days of rations, a waterskin, and a disguise kit.',
      contents: ['Backpack', 'Bedroll', '2 Costumes', '5 Candles', '5 days of rations', 'Waterskin', 'Disguise kit']
    },
    'diplomat\'s pack': {
      type: 'Equipment Pack',
      description: 'Includes a chest, 2 cases for maps and scrolls, a set of fine clothes, a bottle of ink, an ink pen, a lamp, 2 flasks of oil, 5 sheets of paper, a vial of perfume, sealing wax, and soap.',
      contents: ['Chest', '2 Map/Scroll Cases', 'Fine Clothes', 'Ink Bottle', 'Ink Pen', 'Lamp', '2 Oil Flasks', '5 Sheets Paper', 'Perfume Vial', 'Sealing Wax', 'Soap']
    },
    'dungeoneer\'s pack': {
      type: 'Equipment Pack',
      description: 'Includes a backpack, a crowbar, a hammer, 10 pitons, 10 torches, a tinderbox, 10 days of rations, and a waterskin.',
      contents: ['Backpack', 'Crowbar', 'Hammer', '10 Pitons', '10 Torches', 'Tinderbox', '10 days of rations', 'Waterskin']
    },
    'explorer\'s pack': {
      type: 'Equipment Pack',
      description: 'Includes a backpack, a bedroll, a mess kit, a tinderbox, 10 torches, 10 days of rations, a waterskin, and 50 feet of hemp rope.',
      contents: ['Backpack', 'Bedroll', 'Mess kit', 'Tinderbox', '10 Torches', '10 days of rations', 'Waterskin', '50 ft hemp rope']
    },
    'priest\'s pack': {
      type: 'Equipment Pack',
      description: 'Includes a backpack, a blanket, 10 candles, a tinderbox, an alms box, 2 blocks of incense, a censer, vestments, 2 days of rations, and a waterskin.',
      contents: ['Backpack', 'Blanket', '10 Candles', 'Tinderbox', 'Alms box', '2 Incense blocks', 'Censer', 'Vestments', '2 days of rations', 'Waterskin']
    },
    'scholar\'s pack': {
      type: 'Equipment Pack',
      description: 'Includes a backpack, a book of lore, a bottle of ink, an ink pen, 10 sheets of parchment, a little bag of sand, and a small knife.',
      contents: ['Backpack', 'Book of lore', 'Ink bottle', 'Ink pen', '10 Parchment sheets', 'Bag of sand', 'Small knife']
    },
    'burglar\'s pack': {
      type: 'Equipment Pack',
      description: 'Includes a backpack, a bag of 1,000 ball bearings, 10 feet of string, a bell, 5 candles, a crowbar, a hammer, 10 pitons, a hooded lantern, 2 flasks of oil, 5 days rations, a tinderbox, a waterskin, and 50 feet of hempen rope.',
      contents: ['Backpack', '1,000 Ball bearings', '10 ft String', 'Bell', '5 Candles', 'Crowbar', 'Hammer', '10 Pitons', 'Hooded lantern', '2 Oil flasks', '5 days rations', 'Tinderbox', 'Waterskin', '50 ft hemp rope']
    },

    // Tools
    'carpenter\'s tools': { type: 'Artisan\'s Tools', description: 'These special tools include the items needed to pursue a craft or trade. Proficiency with these tools lets you add your proficiency bonus to any ability checks you make to craft objects with wood.' },
    'potter\'s tools': { type: 'Artisan\'s Tools', description: 'These special tools include the items needed to pursue a craft or trade. Proficiency with these tools lets you add your proficiency bonus to any ability checks you make to craft objects with clay.' },
    'smith\'s tools': { type: 'Artisan\'s Tools', description: 'These special tools include the items needed to pursue a craft or trade. Proficiency with these tools lets you add your proficiency bonus to any ability checks you make to craft metal objects.' },
    'brewer\'s supplies': { type: 'Artisan\'s Tools', description: 'These special supplies include the items needed to pursue a craft or trade. Proficiency with these supplies lets you add your proficiency bonus to any ability checks you make to brew beer, ale, and other alcoholic beverages.' },
    'calligrapher\'s supplies': { type: 'Artisan\'s Tools', description: 'These special supplies include the items needed to pursue a craft or trade. Proficiency with these supplies lets you add your proficiency bonus to any ability checks you make to create beautiful writing.' },
    'cartographer\'s tools': { type: 'Artisan\'s Tools', description: 'These special tools include the items needed to pursue a craft or trade. Proficiency with these tools lets you add your proficiency bonus to any ability checks you make to create maps.' },
    'cobbler\'s tools': { type: 'Artisan\'s Tools', description: 'These special tools include the items needed to pursue a craft or trade. Proficiency with these tools lets you add your proficiency bonus to any ability checks you make to craft and repair shoes.' },
    'cook\'s utensils': { type: 'Artisan\'s Tools', description: 'These special utensils include the items needed to pursue a craft or trade. Proficiency with these utensils lets you add your proficiency bonus to any ability checks you make to prepare meals.' },
    'glassblower\'s tools': { type: 'Artisan\'s Tools', description: 'These special tools include the items needed to pursue a craft or trade. Proficiency with these tools lets you add your proficiency bonus to any ability checks you make to craft glass objects.' },
    'jeweler\'s tools': { type: 'Artisan\'s Tools', description: 'These special tools include the items needed to pursue a craft or trade. Proficiency with these tools lets you add your proficiency bonus to any ability checks you make to craft jewelry and appraise gems.' },
    'leatherworker\'s tools': { type: 'Artisan\'s Tools', description: 'These special tools include the items needed to pursue a craft or trade. Proficiency with these tools lets you add your proficiency bonus to any ability checks you make to craft leather goods.' },
    'mason\'s tools': { type: 'Artisan\'s Tools', description: 'These special tools include the items needed to pursue a craft or trade. Proficiency with these tools lets you add your proficiency bonus to any ability checks you make to craft stone structures.' },
    'painter\'s supplies': { type: 'Artisan\'s Tools', description: 'These special supplies include the items needed to pursue a craft or trade. Proficiency with these supplies lets you add your proficiency bonus to any ability checks you make to create paintings.' },
    'tinker\'s tools': { type: 'Artisan\'s Tools', description: 'These special tools include the items needed to pursue a craft or trade. Proficiency with these tools lets you add your proficiency bonus to any ability checks you make to craft and repair mechanical devices.' },
    'weaver\'s tools': { type: 'Artisan\'s Tools', description: 'These special tools include the items needed to pursue a craft or trade. Proficiency with these tools lets you add your proficiency bonus to any ability checks you make to craft cloth and textiles.' },
    'woodcarver\'s tools': { type: 'Artisan\'s Tools', description: 'These special tools include the items needed to pursue a craft or trade. Proficiency with these tools lets you add your proficiency bonus to any ability checks you make to craft wooden objects.' },
    'thieves\' tools': { type: 'Tools', description: 'This set of tools includes a small file, a set of lock picks, a small mirror mounted on a metal handle, a set of narrow-bladed scissors, and a pair of pliers.' },

    // Musical Instruments
    'bagpipes': { type: 'Musical Instrument', description: 'If you have proficiency with bagpipes, you can add your proficiency bonus to any ability checks you make to play music with the instrument. The haunting sound of bagpipes can inspire allies or intimidate enemies.' },
    'lute': { type: 'Musical Instrument', description: 'If you have proficiency with a lute, you can add your proficiency bonus to any ability checks you make to play music with the instrument. The melodic strings of a lute are perfect for entertainment and bardic magic.' },
    'flute': { type: 'Musical Instrument', description: 'If you have proficiency with a flute, you can add your proficiency bonus to any ability checks you make to play music with the instrument. The clear, sweet notes of a flute can carry far and wide.' },
    'drum': { type: 'Musical Instrument', description: 'If you have proficiency with drums, you can add your proficiency bonus to any ability checks you make to play music with the instrument. The rhythmic beat of drums can rally troops and set the pace for marching.' },
    'dulcimer': { type: 'Musical Instrument', description: 'If you have proficiency with a dulcimer, you can add your proficiency bonus to any ability checks you make to play music with the instrument. The gentle plucked strings create soothing melodies.' },
    'horn': { type: 'Musical Instrument', description: 'If you have proficiency with a horn, you can add your proficiency bonus to any ability checks you make to play music with the instrument. The bold call of a horn can signal across great distances.' },
    'lyre': { type: 'Musical Instrument', description: 'If you have proficiency with a lyre, you can add your proficiency bonus to any ability checks you make to play music with the instrument. The classical strings of a lyre evoke ancient traditions.' },
    'pan flute': { type: 'Musical Instrument', description: 'If you have proficiency with a pan flute, you can add your proficiency bonus to any ability checks you make to play music with the instrument. The breathy notes create pastoral melodies.' },
    'shawm': { type: 'Musical Instrument', description: 'If you have proficiency with a shawm, you can add your proficiency bonus to any ability checks you make to play music with the instrument. This double-reed instrument produces loud, penetrating tones.' },
    'viol': { type: 'Musical Instrument', description: 'If you have proficiency with a viol, you can add your proficiency bonus to any ability checks you make to play music with the instrument. The bowed strings create rich, expressive tones.' },

    // Common items
    'common clothes': { type: 'Adventuring Gear', description: 'Everyday clothing suitable for commoners and workers.' },
    'belt pouch': { type: 'Adventuring Gear', description: 'A small pouch that can hold up to 20 sling bullets or 50 blowgun needles, among other things.' },
    'shovel': { type: 'Adventuring Gear', description: 'A tool for digging and moving earth.' },
    'backpack': { type: 'Adventuring Gear', description: 'A leather pack carried on the back, typically holding 30 pounds of gear.' },
    'bedroll': { type: 'Adventuring Gear', description: 'A sleeping bag and blanket used for resting during travel.' },
    'blanket': { type: 'Adventuring Gear', description: 'A warm cloth covering used for sleeping or warmth.' },
    'tinderbox': { type: 'Adventuring Gear', description: 'A small container holding flint, fire steel, and tinder for starting fires.' },
    'torch': { type: 'Adventuring Gear', description: 'A wooden rod with one end wrapped in cloth soaked in oil. Burns for 1 hour providing bright light.' },
    'candle': { type: 'Adventuring Gear', description: 'A small wax candle that burns for 1 hour providing dim light in a 5-foot radius.' },
    'rations': { type: 'Adventuring Gear', description: 'Dry foods suitable for extended travel. One day\'s worth of food for one person.' },
    'waterskin': { type: 'Adventuring Gear', description: 'A leather container for holding water during travel.' },
    'hemp rope': { type: 'Adventuring Gear', description: 'Strong rope made from hemp fibers, useful for climbing and securing equipment.' },
    'hempen rope': { type: 'Adventuring Gear', description: 'Strong rope made from hemp fibers, useful for climbing and securing equipment.' },
    'crowbar': { type: 'Adventuring Gear', description: 'A metal bar used as a lever to pry objects apart or open containers.' },
    'hammer': { type: 'Adventuring Gear', description: 'A tool with a heavy head used for driving nails or breaking objects.' },
    'piton': { type: 'Adventuring Gear', description: 'A metal spike that can be driven into rock or wood to serve as an anchor point.' },
    'lantern': { type: 'Adventuring Gear', description: 'A portable light source that burns oil to provide bright illumination.' },
    'oil flask': { type: 'Adventuring Gear', description: 'A small container of oil that can fuel lanterns or be used as a weapon when ignited.' },
    'mess kit': { type: 'Adventuring Gear', description: 'A set of eating utensils and cookware for preparing and consuming meals while traveling.' },
    'rope': { type: 'Adventuring Gear', description: 'Strong rope useful for climbing and securing equipment.' },
    'fine clothes': { type: 'Clothing', description: 'Elegant clothing made from fine materials. Provides advantage on social interactions with nobles and wealthy merchants.' },
    'set of fine clothes': { type: 'Clothing', description: 'Elegant clothing made from fine materials. Provides advantage on social interactions with nobles and wealthy merchants.' },
    'disguise kit': { type: 'Tools', description: 'This kit includes cosmetics, hair dye, small props, and clothing necessary to create a disguise.' }
  };

  return tooltips[cleanName] || null;
}

const getCharacterSkills = character => {
  const skills = []

  // Add background skills (common examples)
  if (character.backgroundDetails?.name) {
    const backgroundSkills = {
      'Acolyte': ['Insight', 'Religion'],
      'Criminal': ['Deception', 'Stealth'],
      'Folk Hero': ['Animal Handling', 'Survival'],
      'Noble': ['History', 'Persuasion'],
      'Sage': ['Arcana', 'History'],
      'Soldier': ['Athletics', 'Intimidation'],
    }
    const bgSkills = backgroundSkills[character.backgroundDetails.name] || []
    skills.push(...bgSkills)
  }

  // Add class skills if selected/saved
  if (character.selectedSkills) {
    skills.push(...character.selectedSkills.filter(Boolean))
  }

  return [...new Set(skills)] // Remove duplicates
}

// Load characters from Firestore
const loadCharacters = async () => {
  loading.value = true
  error.value = null

  try {
    const result = await getCharacters()

    if (result.success) {
      characters.value = result.data
    } else {
      throw new Error(result.error)
    }
  } catch (error_) {
    error.value = error_.message
    console.error('Error loading characters:', error_)
  } finally {
    loading.value = false
  }
}

// Edit character - requires admin authentication
const editCharacter = character => {
  adminStore.requireAdminAccess(() => {
    router.push({
      name: 'CharacterForm',
      query: { edit: character.id },
    })
  })
}

// Confirm character deletion - requires admin authentication
const confirmDelete = character => {
  adminStore.requireAdminAccess(() => {
    selectedCharacter.value = character
    deleteDialog.value = true
  })
}

// Delete character
const deleteCharacter = async () => {
  if (!selectedCharacter.value) return

  try {
    const result = await deleteFromFirestore(selectedCharacter.value.id)

    if (result.success) {
      // Remove from local array
      characters.value = characters.value.filter(c => c.id !== selectedCharacter.value.id)
      alert('Character deleted successfully')

      // Extend admin session on successful action
      extendSession()
    } else {
      throw new Error(result.error)
    }
  } catch (error_) {
    alert('Error deleting character: ' + error_.message)
    console.error('Error deleting character:', error_)
  } finally {
    deleteDialog.value = false
    selectedCharacter.value = null
  }
}

// Show admin login dialog
const showAdminLogin = () => {
  adminStore.showAccessDialog = true
}

// Admin logout - clear admin privileges but keep group access
const adminLogout = () => {
  // Reset access type to 'user' if they have group access, or clear completely
  if (adminStore.hasAccess) {
    adminStore.accessType = 'user'
    adminStore.saveAccessState()
  } else {
    adminStore.clearAccess()
  }
  // Also clear the useAdminAuth state
  logout()
}

// Require access for character creation
const requireAccessForCreation = () => {
  requireAccess(() => {
    // Navigate to character form
    router.push('/character-form')
  })
}

// Load characters on component mount
onMounted(() => {
  loadCharacters()
})
</script>

<style scoped>
/* Quick Actions responsive layout */
.quick-actions-desktop {
  display: flex;
}

.quick-actions-mobile {
  display: none;
}

/* At 1117px and below, switch to mobile layout */
@media (max-width: 1117px) {
  .quick-actions-desktop {
    display: none !important;
  }

  .quick-actions-mobile {
    display: block !important;
  }

  /* More compact quick actions card */
  .quick-actions-mobile .v-card {
    padding-top: 8px !important;
    padding-bottom: 8px !important;
  }

  /* Reduce title size for mobile */
  .page-header h1 {
    font-size: 2.5rem !important;
  }

  .page-header p {
    font-size: 1.1rem !important;
  }

  .page-header {
    padding: 1.5rem 0 !important;
    margin-bottom: 1rem !important;
  }
}

/* Mobile quick actions styling */
.quick-actions-chip-mobile {
  min-width: 140px !important;
  width: 140px !important;
  text-align: center !important;
  justify-content: center !important;
  font-size: 0.75rem !important;
}

.create-character-btn-mobile {
  min-width: 120px !important;
  font-size: 0.75rem !important;
}

.expand-toggle-btn {
  min-height: 24px !important;
  height: 24px !important;
  font-size: 0.7rem !important;
  opacity: 0.8;
  transition: opacity 0.3s ease;
  padding: 0 8px !important;
}

.expand-toggle-btn:hover {
  opacity: 1;
}

@media (max-width: 600px) {
  .quick-actions-chip-mobile {
    min-width: 120px !important;
    width: 120px !important;
    font-size: 0.7rem !important;
  }

  .create-character-btn-mobile {
    min-width: 100px !important;
    font-size: 0.7rem !important;
  }
}

@media (max-width: 480px) {
  .quick-actions-chip-mobile {
    min-width: 100px !important;
    width: 100px !important;
    font-size: 0.65rem !important;
  }

  .create-character-btn-mobile {
    min-width: 90px !important;
    font-size: 0.65rem !important;
  }
}

/* Admin login chip styles */
.v-chip[data-admin-login] {
  background: linear-gradient(135deg, #FFA726 0%, #FF9800 100%) !important;
  color: #000000 !important;
  box-shadow: 0 2px 8px rgba(255, 152, 0, 0.3);
  transition: all 0.3s ease;
  animation: gentle-pulse 3s ease-in-out infinite;
  cursor: pointer;
}

.v-chip[data-admin-login]:hover {
  background: linear-gradient(135deg, #FFB74D 0%, #FFA726 100%) !important;
  color: #000000 !important;
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.4);
  transform: translateY(-1px);
  animation: none;
}

/* Admin status chips consistent width */
.admin-status-chip {
  min-width: 100px !important;
  width: 100px !important;
}

@media (max-width: 768px) {
  .admin-status-chip {
    min-width: 60px !important;
    width: 60px !important;
  }
}

/* All status chips consistent width - includes access and admin chips */
.quick-actions-chip {
  min-width: 130px !important;
  width: 130px !important;
  text-align: center !important;
  justify-content: center !important;
}

@media (max-width: 768px) {
  .quick-actions-chip {
    min-width: 70px !important;
    width: 70px !important;
  }
}

@keyframes gentle-pulse {

  0%,
  100% {
    box-shadow: 0 2px 8px rgba(255, 152, 0, 0.3);
  }

  50% {
    box-shadow: 0 4px 16px rgba(255, 152, 0, 0.5);
  }
}

/* Create Character button styles */
.create-character-btn {
  color: #000000 !important;
}

.create-character-btn:hover {
  color: #000000 !important;
}

/* Admin protection styles */
.admin-action-btn.admin-protected {
  opacity: 0.7;
  border-style: dashed !important;
}

.admin-action-btn.admin-protected:hover {
  opacity: 0.9;
  transform: scale(1.02);
}

.characters-page {
  min-height: 100vh;
  /* Remove the fixed gradient background for dark theme compatibility */
}

.page-header {
  padding: 2rem 0;
}

.character-card {
  transition: all 0.3s ease;
  border-radius: 16px !important;
  overflow: hidden;
}

.character-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
}

/* Dark theme hover effects */
.v-theme--dark .character-card:hover {
  box-shadow: 0 8px 32px rgba(255, 255, 255, 0.08) !important;
}

.character-header {
  height: 120px;
  position: relative;
  overflow: hidden;
}

.character-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(1px);
  padding-bottom: 8px !important;
}

.character-choices-panels {
  box-shadow: none !important;
}

.character-choices-panels .v-expansion-panel {
  background: rgba(var(--v-theme-surface), 0.02) !important;
  border: 1px solid rgba(var(--v-theme-primary), 0.12) !important;
  border-radius: 8px !important;
}

.character-choices-panels .v-expansion-panel-title {
  min-height: 32px !important;
  font-size: 0.75rem !important;
}

.character-choices-panels .v-expansion-panel-text {
  font-size: 0.7rem !important;
}

.character-title h3 {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.character-subtitle {
  margin-top: 8px;
}

.info-item {
  border-radius: 8px;
  padding: 2px 0;
}

.ability-scores .v-card {
  border-radius: 8px !important;
  transition: all 0.2s ease;
  min-height: 70px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.ability-scores .v-card:hover {
  transform: scale(1.05);
}

/* Theme-aware hover shadows */
.v-theme--light .ability-scores .v-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.v-theme--dark .ability-scores .v-card:hover {
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
}

.key-stats .v-card {
  border-radius: 8px !important;
  transition: all 0.2s ease;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.key-stats .v-card:hover {
  transform: scale(1.02);
}

/* Theme-aware hover shadows for key stats */
.v-theme--light .key-stats .v-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.v-theme--dark .key-stats .v-card:hover {
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.08);
}

.empty-state .v-card {
  border-radius: 16px !important;
}

.v-btn {
  border-radius: 8px !important;
  font-weight: 600;
}

/* Enhanced card actions */
.v-card-actions .v-btn {
  font-weight: 500;
  min-height: 48px !important;
  height: 48px !important;
}

/* Loading and error states */
.v-progress-circular {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.7;
  }

  100% {
    opacity: 1;
  }
}

/* Dialog improvements */
.v-dialog .v-card {
  border-radius: 12px !important;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem !important;
  }

  .character-overlay {
    padding: 1rem !important;
    padding-bottom: 12px !important;
  }
}

/* Create character button responsive sizing */
@media (min-width: 960px) and (max-width: 1280px) {
  .create-character-btn {
    min-width: 80px !important;
    padding-left: 8px !important;
    padding-right: 8px !important;
  }
}

/* Dark theme specific adjustments */
.v-theme--dark .character-overlay {
  background: rgba(0, 0, 0, 0.4);
}

/* Ensure good contrast for character title text */
.character-title h3,
.character-title p {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

/* Character details expansion styling */
.character-details-expansion {
  border: none !important;
  box-shadow: none !important;
}

.character-details-expansion .v-expansion-panel {
  background: transparent !important;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12) !important;
  border-radius: 8px !important;
  margin-bottom: 0 !important;
}

.character-details-expansion .v-expansion-panel-title {
  font-size: 0.875rem !important;
  background: rgba(var(--v-theme-primary), 0.05) !important;
  border-radius: 8px 8px 0 0 !important;
}

.character-details-expansion .v-expansion-panel-title:hover {
  background: rgba(var(--v-theme-primary), 0.1) !important;
}

.character-details-expansion .v-expansion-panel-text {
  background: var(--v-theme-surface) !important;
  border-radius: 0 0 8px 8px !important;
}

/* Enhanced core character info layout */
.core-character-info .d-flex {
  align-items: flex-start;
}

/* Essential stats cards styling */
.essential-stat-card {
  transition: all 0.2s ease;
  padding: 0 !important;
  position: relative !important;
}

.essential-stat-card>* {
  width: 100%;
  text-align: center;
}

.essential-stat-card .v-icon {
  top: 5px;
  flex-shrink: 0;
}

.essential-stat-card .text-caption {
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-weight: 500;
  top: 5px;
  position: relative;
}

.essential-stat-card .text-h6 {
  bottom: 5px;
  flex-shrink: 0;
}

.essential-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.v-theme--dark .essential-stat-card:hover {
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1) !important;
}

.essential-stats .v-card {
  transition: all 0.2s ease;
}

.essential-stats .v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

/* Ability scores on main card styling */
.ability-scores-main .ability-score-card-main {
  transition: all 0.2s ease;
  border: 1px solid rgba(var(--v-theme-primary), 0.2) !important;
  background: rgba(var(--v-theme-primary), 0.02) !important;
}

.ability-scores-main .ability-score-card-main:hover {
  transform: translateY(-1px);
  border-color: rgba(var(--v-theme-primary), 0.4) !important;
  background: rgba(var(--v-theme-primary), 0.05) !important;
  box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.15) !important;
}

.ability-scores-main h4 {
  color: rgb(var(--v-theme-primary)) !important;
}

/* Admin chip group tight spacing */
.admin-chip-group>*+* {
  margin-left: 4px !important;
}

/* Logout button reduced padding */
.logout-btn {
  min-width: auto !important;
  padding-left: 6px !important;
  padding-right: 6px !important;
}
</style>
