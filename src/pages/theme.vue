<template>
  <div class="theme-demo-page theme-background theme-aware pa-4">
    <!-- Theme Builder Tool -->
    <v-container class="mb-8" width="50vw">
      <v-card class="themed-card pa-6 mb-6" elevation="4">
        <h2 class="text-h5 mb-4 theme-primary">Create a Custom Theme</h2>
        <v-form @submit.prevent="createTheme">
          <v-row>
            <v-col cols="6">
              <v-text-field v-model="customTheme.name" label="Theme Name" required dense />
            </v-col>
            <v-col cols="3">
              <div style="position:relative;">
                <v-text-field v-model="customTheme.primary" label="Primary" prepend-inner-icon="mdi-eyedropper"
                  :append-inner-icon="''" :style="{ cursor: 'pointer' }" dense required readonly
                  @click="pickers.primary = true">
                  <template #append-inner>
                    <span
                      :style="{ display: 'inline-block', width: '32px', height: '32px', borderRadius: '8px', background: customTheme.primary, border: '1px solid #ccc', marginRight: '8px', cursor: 'pointer' }"
                      @click.stop="pickers.primary = true"></span>
                  </template>
                </v-text-field>
                <v-menu v-model="pickers.primary" :close-on-content-click="false" transition="scale-transition"
                  activator="parent">
                  <v-color-picker :model-value="customTheme.primary"
                    @update:model-value="val => customTheme.primary = val" mode="hexa" show-swatches
                    swatches-max-height="150" />
                </v-menu>
              </div>
            </v-col>
            <v-col cols="3">
              <div style="position:relative;">
                <v-text-field v-model="customTheme.secondary" label="Secondary" prepend-inner-icon="mdi-eyedropper"
                  :append-inner-icon="''" :style="{ cursor: 'pointer' }" dense required readonly
                  @click="pickers.secondary = true">
                  <template #append-inner>
                    <span
                      :style="{ display: 'inline-block', width: '32px', height: '32px', borderRadius: '8px', background: customTheme.secondary, border: '1px solid #ccc', marginRight: '8px', cursor: 'pointer' }"
                      @click.stop="pickers.secondary = true"></span>
                  </template>
                </v-text-field>
                <v-menu v-model="pickers.secondary" :close-on-content-click="false" transition="scale-transition"
                  activator="parent">
                  <v-color-picker :model-value="customTheme.secondary"
                    @update:model-value="val => customTheme.secondary = val" mode="hexa" show-swatches
                    swatches-max-height="150" />
                </v-menu>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">
              <div style="position:relative;">
                <v-text-field v-model="customTheme.accent" label="Accent" prepend-inner-icon="mdi-eyedropper"
                  :append-inner-icon="''" :style="{ cursor: 'pointer' }" dense required readonly
                  @click="pickers.accent = true">
                  <template #append-inner>
                    <span
                      :style="{ display: 'inline-block', width: '32px', height: '32px', borderRadius: '8px', background: customTheme.accent, border: '1px solid #ccc', marginRight: '8px', cursor: 'pointer' }"
                      @click.stop="pickers.accent = true"></span>
                  </template>
                </v-text-field>
                <v-menu v-model="pickers.accent" :close-on-content-click="false" transition="scale-transition"
                  activator="parent">
                  <v-color-picker :model-value="customTheme.accent"
                    @update:model-value="val => customTheme.accent = val" mode="hexa" show-swatches
                    swatches-max-height="150" />
                </v-menu>
              </div>
            </v-col>
            <v-col cols="4">
              <div style="position:relative;">
                <v-text-field v-model="customTheme.background" label="Background" prepend-inner-icon="mdi-eyedropper"
                  :append-inner-icon="''" :style="{ cursor: 'pointer' }" dense required readonly
                  @click="pickers.background = true">
                  <template #append-inner>
                    <span
                      :style="{ display: 'inline-block', width: '32px', height: '32px', borderRadius: '8px', background: customTheme.background, border: '1px solid #ccc', marginRight: '8px', cursor: 'pointer' }"
                      @click.stop="pickers.background = true"></span>
                  </template>
                </v-text-field>
                <v-menu v-model="pickers.background" :close-on-content-click="false" transition="scale-transition"
                  activator="parent">
                  <v-color-picker :model-value="customTheme.background"
                    @update:model-value="val => customTheme.background = val" mode="hexa" show-swatches
                    swatches-max-height="150" />
                </v-menu>
              </div>
            </v-col>
            <v-col cols="4">
              <div style="position:relative;">
                <v-text-field v-model="customTheme.surface" label="Surface" prepend-inner-icon="mdi-eyedropper"
                  :append-inner-icon="''" :style="{ cursor: 'pointer' }" dense required readonly
                  @click="pickers.surface = true">
                  <template #append-inner>
                    <span
                      :style="{ display: 'inline-block', width: '32px', height: '32px', borderRadius: '8px', background: customTheme.surface, border: '1px solid #ccc', marginRight: '8px', cursor: 'pointer' }"
                      @click.stop="pickers.surface = true"></span>
                  </template>
                </v-text-field>
                <v-menu v-model="pickers.surface" :close-on-content-click="false" transition="scale-transition"
                  activator="parent">
                  <v-color-picker :model-value="customTheme.surface"
                    @update:model-value="val => customTheme.surface = val" mode="hexa" show-swatches
                    swatches-max-height="150" />
                </v-menu>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3" class="d-flex align-center ms-auto">
              <v-switch v-model="customTheme.isDark" label="Dark Mode" color="primary" hide-details />
            </v-col>
            <v-col cols="3" class="d-flex justify-center me-auto">
              <v-btn type="submit" color="accent" variant="flat" :disabled="!isThemeValid"
                class="mt-2 px-8 d-flex text-center create-theme-btn" style="max-width: 320px;">
                Create Theme
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-container>
    <!-- Custom Theme Creator removed -->
    <v-container>
      <!-- Header -->
      <div class="page-header text-center mb-6">
        <h1 class="display-1 font-weight-bold theme-primary mb-2">🎨 Themes</h1>
        <p class="text-h6 theme-text-secondary">Test the various themes</p>
        <ThemeSwitcher />
        <v-divider class="mx-auto mt-4" style="max-width: 200px;" />
      </div>
      <!-- Character Card Preview -->
      <v-row class="mb-6">
        <v-col cols="12">
          <h3 class="text-h5 mb-4 theme-primary">Character Card Preview</h3>
          <v-row>
            <v-col cols="12" lg="4" md="6">
              <v-card class="character-card h-100" elevation="4" hover>
                <!-- Character Header with Background -->
                <div class="character-header pa-3">
                  <div class="character-overlay">
                    <div class="d-flex align-center mb-2">
                      <v-avatar class="me-3 elevation-2" color="white" size="48">
                        <v-icon color="primary" size="32">mdi-sword</v-icon>
                      </v-avatar>
                      <div class="character-title">
                        <h3 class="text-h5 font-weight-bold text-white mb-0">Sample Character</h3>
                        <p class="text-subtitle-2 text-white opacity-90 mb-0">Test Player</p>
                      </div>
                    </div>
                    <div class="character-subtitle">
                      <v-chip class="me-2" color="rgba(255,255,255,0.9)" dark size="small">Level 5</v-chip>
                      <v-chip color="rgba(255,255,255,0.8)" dark size="small" variant="outlined">Fighter</v-chip>
                    </div>
                  </div>
                </div>

                <!-- Character Details -->
                <v-card-text class="pa-3">
                  <div class="character-info mb-3">
                    <v-row dense>
                      <v-col cols="6">
                        <v-card class="pa-2 mb-2" color="blue-lighten-5" variant="tonal">
                          <div class="d-flex align-center">
                            <v-icon class="me-2" color="blue-darken-2" size="small">mdi-dna</v-icon>
                            <div>
                              <div class="text-caption text-blue-darken-2 font-weight-bold">Species</div>
                              <div class="text-body-2 font-weight-medium">Human</div>
                            </div>
                          </div>
                        </v-card>
                      </v-col>
                      <v-col cols="6">
                        <v-card class="pa-2" color="green-lighten-5" variant="tonal">
                          <div class="d-flex align-center">
                            <v-icon class="me-2" color="green-darken-2" size="small">mdi-book-open-page-variant</v-icon>
                            <div>
                              <div class="text-caption text-green-darken-2 font-weight-bold">Background</div>
                              <div class="text-body-2 font-weight-medium">Soldier</div>
                            </div>
                          </div>
                        </v-card>
                      </v-col>
                    </v-row>
                  </div>
                </v-card-text>

                <!-- Actions -->
                <v-card-actions class="pa-4 pt-0">
                  <v-btn block class="admin-action-btn" color="primary" variant="elevated">
                    <template #prepend>
                      <v-icon>mdi-pencil</v-icon>
                    </template>
                    Edit Character
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
            <!-- Second Preview Object -->
            <v-col cols="12" lg="4" md="6">
              <v-card class="h-100" elevation="4" hover :style="{ background: 'var(--theme-surface)' }">
                <v-card-title class="d-flex align-center" style="gap: 12px;">
                  <v-avatar color="accent" size="44">
                    <v-icon color="white" size="28">mdi-magic-staff</v-icon>
                  </v-avatar>
                  <span class="text-h6 font-weight-bold theme-accent">Magic Item Preview</span>
                </v-card-title>
                <v-card-text>
                  <div class="mb-2">
                    <v-chip color="accent" text-color="white" class="me-2">Rare</v-chip>
                    <v-chip color="secondary" text-color="white">Wand</v-chip>
                  </div>
                  <div class="text-body-1 font-weight-medium mb-2">Wand of the Storm</div>
                  <div class="text-body-2 mb-4">Unleash a bolt of lightning at your foes. Grants +2 to spell attack
                    rolls
                    and deals 1d8 extra lightning damage.</div>
                  <div class="d-flex align-center mb-2">
                    <v-icon color="primary" class="me-1">mdi-flash</v-icon>
                    <span class="theme-primary font-weight-bold">Lightning</span>
                  </div>
                  <div class="d-flex align-center">
                    <v-icon color="secondary" class="me-1">mdi-star</v-icon>
                    <span class="theme-secondary font-weight-bold">Attunement Required</span>
                  </div>
                </v-card-text>
                <v-card-actions class="pa-4 pt-0">
                  <v-btn color="accent" variant="elevated" block>
                    <template #prepend>
                      <v-icon>mdi-eye</v-icon>
                    </template>
                    View Item
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
            <!-- Third Preview Object -->
            <v-col cols="12" lg="4" md="6">
              <v-card class="h-100" elevation="4" hover
                :style="{ background: 'var(--theme-background)', border: '2px solid var(--theme-accent)' }">
                <v-card-title class="d-flex align-center" style="gap: 12px;">
                  <v-avatar color="secondary" size="44">
                    <v-icon color="white" size="28">mdi-account-group</v-icon>
                  </v-avatar>
                  <span class="text-h6 font-weight-bold theme-secondary">Party Preview</span>
                </v-card-title>
                <v-card-text>
                  <div class="mb-2">
                    <v-chip color="primary" text-color="white" class="me-2">Adventurers</v-chip>
                    <v-chip color="accent" text-color="white">Level 5</v-chip>
                  </div>
                  <div class="text-body-1 font-weight-medium mb-2">The Stormwalkers</div>
                  <div class="text-body-2 mb-4">A diverse party of heroes, each with unique skills and backgrounds,
                    united
                    by fate and a common quest.</div>
                  <div class="d-flex align-center mb-2">
                    <v-icon color="secondary" class="me-1">mdi-account</v-icon>
                    <span class="theme-secondary font-weight-bold">5 Members</span>
                  </div>
                  <div class="d-flex align-center">
                    <v-icon color="accent" class="me-1">mdi-map-marker</v-icon>
                    <span class="theme-accent font-weight-bold">Currently: Neverwinter</span>
                  </div>
                </v-card-text>
                <v-card-actions class="pa-4 pt-0">
                  <v-btn color="secondary" variant="elevated" block>
                    <template #prepend>
                      <v-icon>mdi-eye</v-icon>
                    </template>
                    View Party
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>

import { ref, computed } from 'vue'

import { useTheme } from '@/composables/useTheme.js'
const { createCustomTheme, setTheme } = useTheme()

const customTheme = ref({
  name: '',
  primary: '#1976d2',
  secondary: '#9c27b0',
  accent: '#2196f3',
  background: '#121212',
  surface: '#23272f',
  isDark: true
})

const pickers = ref({
  primary: false,
  secondary: false,
  accent: false,
  background: false,
  surface: false
})

const isThemeValid = computed(() => {
  return customTheme.value.name && customTheme.value.primary && customTheme.value.secondary && customTheme.value.accent && customTheme.value.background && customTheme.value.surface
})

function createTheme() {
  if (!isThemeValid.value) return
  const colors = {
    primary: customTheme.value.primary,
    secondary: customTheme.value.secondary,
    accent: customTheme.value.accent,
    background: customTheme.value.background,
    surface: customTheme.value.surface,
    isDark: customTheme.value.isDark
  }
  const key = createCustomTheme(customTheme.value.name, colors)
  setTheme(key)
  // Reset form
  customTheme.value = {
    name: '',
    primary: '#1976d2',
    secondary: '#9c27b0',
    accent: '#2196f3',
    background: '#121212',
    surface: '#23272f',
    isDark: true
  }
}
</script>

<style scoped>
.theme-demo-page {
  min-height: 100vh;
}

.create-theme-btn .v-btn__content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.v-color-picker {
  min-width: 250px;
}

.color-demo-box {
  transition: transform 0.2s ease;
}

.color-demo-box:hover {
  transform: scale(1.05);
}

.character-overlay {
  background: rgba(0, 0, 0, 0.3);
  padding: 16px;
  border-radius: 8px;
}

/* Modern Theme Demo Section Improvements */
.theme-palette-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  margin: 0 auto 48px auto;
  justify-content: center;
  align-items: flex-end;
  max-width: 600px;
}

.palette-block {
  width: 88px;
  height: 88px;
  border-radius: 18px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin: 0 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.10);
  position: relative;
  transition: transform 0.15s;
}

.palette-block:hover {
  transform: scale(1.06);
  z-index: 2;
}

.palette-label {
  color: #fff;
  font-size: 1.08rem;
  font-weight: 600;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
  margin-bottom: 14px;
  letter-spacing: 0.5px;
  user-select: none;
}

.theme-primary-bg {
  background: var(--theme-primary);
}

.theme-secondary-bg {
  background: var(--theme-secondary);
}

.theme-accent-bg {
  background: var(--theme-accent);
}

.theme-background-bg {
  background: var(--theme-background);
}

.theme-surface-bg {
  background: var(--theme-surface);
}

.modern-demo-row {
  margin-bottom: 56px;
}

.modern-demo-row .v-card {
  min-width: 260px;
}

.modern-demo-row .v-col {
  display: flex;
  align-items: stretch;
}

.component-preview-card {
  min-height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
}

.surface-bg-demo {
  background: var(--theme-background);
  border-radius: 16px;
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 0;
}

@media (max-width: 900px) {
  .theme-palette-bar {
    gap: 16px;
    max-width: 100vw;
  }

  .palette-block {
    width: 64px;
    height: 64px;
    border-radius: 12px;
    margin: 0 4px;
  }

  .modern-demo-row {
    margin-bottom: 32px;
  }
}

@media (max-width: 600px) {
  .theme-palette-bar {
    gap: 8px;
    margin-bottom: 24px;
  }

  .palette-block {
    width: 44px;
    height: 44px;
    border-radius: 8px;
    margin: 0 2px;
  }

  .palette-label {
    font-size: 0.8rem;
    margin-bottom: 6px;
  }

  .component-preview-card {
    min-height: 220px;
    padding: 12px !important;
  }

  .surface-bg-demo {
    padding: 12px 0;
  }
}
</style>
