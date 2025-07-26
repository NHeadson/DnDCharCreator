<template>
  <v-menu offset-y>
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" :color="currentTheme === 'default' ? 'primary' : 'theme-primary'" variant="elevated"
        prepend-icon="mdi-palette" :loading="isLoading" class="theme-switcher-btn">
        <span class="d-none d-sm-inline">{{ currentThemeConfig.name }}</span>
        <span class="d-sm-none">Theme</span>
        <template v-slot:append>
          <v-icon>mdi-chevron-down</v-icon>
        </template>
      </v-btn>
    </template>

    <v-card class="theme-menu" min-width="320" max-width="400">
      <v-card-title class="d-flex align-center pa-3">
        <v-icon color="primary" class="me-2">mdi-palette</v-icon>
        <span class="text-h6 font-weight-bold">App Theme</span>
        <v-spacer />
        <v-btn variant="text" size="small" @click="resetTheme" :disabled="currentTheme === 'default'"
          title="Reset to Default">
          <v-icon size="small">mdi-refresh</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-0">
        <v-list density="comfortable">
          <v-list-item v-for="theme in availableThemes" :key="theme.value" @click="setTheme(theme.value)"
            :active="currentTheme === theme.value" :disabled="isLoading" class="theme-option">
            <template v-slot:prepend>
              <div class="theme-preview me-3">
                <div class="preview-colors d-flex">
                  <div class="color-dot" :style="{ backgroundColor: theme.preview.primary }"
                    :title="`Primary: ${theme.preview.primary}`" />
                  <div class="color-dot" :style="{ backgroundColor: theme.preview.secondary }"
                    :title="`Secondary: ${theme.preview.secondary}`" />
                  <div class="color-dot" :style="{ backgroundColor: theme.preview.accent }"
                    :title="`Accent: ${theme.preview.accent}`" />
                  <div class="color-dot background-dot" :style="{
                    backgroundColor: theme.preview.background,
                    border: theme.preview.background === '#FFFFFF' || theme.preview.background.includes('F') ? '1px solid #E0E0E0' : 'none'
                  }" :title="`Background: ${theme.preview.background}`" />
                </div>
              </div>
            </template>

            <v-list-item-title class="font-weight-medium">
              {{ theme.name }}
            </v-list-item-title>

            <v-list-item-subtitle v-if="theme.value === 'default'" class="text-caption">
              Classic D&D dark styling
            </v-list-item-subtitle>
            <v-list-item-subtitle v-else-if="theme.value === 'custom'" class="text-caption">
              Dark mystical theme
            </v-list-item-subtitle>
            <v-list-item-subtitle v-else-if="theme.value === 'elegant'" class="text-caption">
              Sophisticated dark mode
            </v-list-item-subtitle>
            <v-list-item-subtitle v-else-if="theme.value === 'light'" class="text-caption">
              Clean light theme
            </v-list-item-subtitle>

            <template v-slot:append v-if="currentTheme === theme.value">
              <v-icon color="success" size="small">mdi-check-circle</v-icon>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-3">
        <div class="d-flex flex-column w-100">
          <div class="d-flex align-center mb-2">
            <v-icon color="info" size="small" class="me-2">mdi-information-outline</v-icon>
            <span class="text-caption text-info">
              Theme changes apply instantly across the entire app
            </span>
          </div>

          <div class="d-flex align-center">
            <v-icon color="success" size="small" class="me-2">mdi-content-save</v-icon>
            <span class="text-caption text-success">
              Your selection is automatically saved
            </span>
          </div>
        </div>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script setup>
import { computed } from 'vue';
import { useTheme } from '@/composables/useTheme.js';

// Use the theme composable
const {
  currentTheme,
  themeConfig,
  isLoading,
  availableThemes,
  setTheme,
  resetTheme,
} = useTheme();

// Current theme configuration for display
const currentThemeConfig = computed(() => {
  const current = availableThemes.value.find(t => t.value === currentTheme.value);
  return current || { name: 'Unknown' };
});
</script>

<style scoped>
.theme-switcher-btn {
  min-width: 120px;
}

.theme-menu {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
}

.theme-option {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.theme-option:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
}

.theme-preview {
  display: flex;
  align-items: center;
}

.preview-colors {
  gap: 2px;
  padding: 2px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.04);
}

.color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  transition: transform 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.background-dot {
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.2);
}

.theme-option:hover .color-dot {
  transform: scale(1.1);
}

.v-list-item--active {
  background-color: rgba(var(--v-theme-primary), 0.08) !important;
}

.v-list-item--active .v-list-item-title {
  color: rgb(var(--v-theme-primary)) !important;
  font-weight: 600 !important;
}
</style>
