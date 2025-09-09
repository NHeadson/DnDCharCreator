<template>
  <v-menu offset-y>
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        class="theme-switcher-btn"
        :color="currentTheme === 'default' ? 'primary' : 'theme-primary'"
        :loading="isLoading"
        prepend-icon="mdi-palette"
        variant="elevated"
      >
        <span class="d-none d-sm-inline">{{ currentThemeConfig.name }}</span>
        <span class="d-sm-none">Theme</span>
        <template #append>
          <v-icon>mdi-chevron-down</v-icon>
        </template>
      </v-btn>
    </template>

    <v-card class="theme-menu" max-width="400" min-width="320">
      <v-card-title class="d-flex align-center pa-3">
        <v-icon class="me-2" color="accent">mdi-palette</v-icon>
        <span class="text-h6 font-weight-bold">App Theme</span>
        <v-spacer />
        <v-btn
          color="secondary"
          :disabled="currentTheme === 'default'"
          size="small"
          title="Reset to Default"
          variant="text"
          @click="resetTheme"
        >
          <v-icon size="small">mdi-refresh</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-0">
        <v-list density="comfortable">
          <v-list-item
            v-for="theme in availableThemes"
            :key="theme.value"
            :active="currentTheme === theme.value"
            class="theme-option"
            :disabled="isLoading"
            @click="setTheme(theme.value)"
          >
            <template #prepend>
              <div class="theme-preview me-3">
                <div class="preview-colors d-flex">
                  <div
                    class="color-dot"
                    :style="{ backgroundColor: theme.preview.primary }"
                    :title="`Primary: ${theme.preview.primary}`"
                  />
                  <div
                    class="color-dot"
                    :style="{ backgroundColor: theme.preview.secondary }"
                    :title="`Secondary: ${theme.preview.secondary}`"
                  />
                  <div
                    class="color-dot"
                    :style="{ backgroundColor: theme.preview.accent }"
                    :title="`Accent: ${theme.preview.accent}`"
                  />
                  <div
                    class="color-dot background-dot"
                    :style="{
                      backgroundColor: theme.preview.background,
                      border: theme.preview.background === '#FFFFFF' || theme.preview.background.includes('F') ? '1px solid #E0E0E0' : 'none'
                    }"
                    :title="`Background: ${theme.preview.background}`"
                  />
                  <div
                    class="color-dot"
                    :style="{ backgroundColor: theme.preview.surface }"
                    :title="`Surface: ${theme.preview.surface}`"
                  />
                </div>
              </div>
            </template>

            <v-list-item-title class="font-weight-medium">
              {{ theme.name }}
              <v-btn
                v-if="theme.value.startsWith('custom_')"
                class="ms-2"
                color="error"
                icon="mdi-delete"
                size="small"
                :title="'Delete ' + theme.name"
                variant="text"
                @click.stop="deleteTheme(theme.value)"
              />
            </v-list-item-title>

            <v-list-item-subtitle v-if="theme.value === 'default'" class="text-caption">
              Classic D&D dark styling
            </v-list-item-subtitle>
            <v-list-item-subtitle v-else-if="theme.value === 'custom'" class="text-caption">
              Cool blues and seafoam
            </v-list-item-subtitle>
            <v-list-item-subtitle v-else-if="theme.value === 'elegant'" class="text-caption">
              Earthy sage and peach
            </v-list-item-subtitle>
            <v-list-item-subtitle v-else-if="theme.value === 'sunset'" class="text-caption">
              Warm orange and ember browns
            </v-list-item-subtitle>
            <v-list-item-subtitle v-else-if="theme.value === 'amethyst'" class="text-caption">
              Purple, pink, and gold
            </v-list-item-subtitle>
            <v-list-item-subtitle v-else-if="theme.value === 'neon'" class="text-caption">
              Neon cyan, yellow, and orange
            </v-list-item-subtitle>

            <template v-if="currentTheme === theme.value" #append>
              <v-icon color="success" size="small">mdi-check-circle</v-icon>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-3">
        <div class="d-flex flex-column w-100">
          <div class="d-flex align-center mb-2">
            <v-icon class="me-2" color="info" size="small">mdi-information-outline</v-icon>
            <span class="text-caption text-info">
              Theme changes apply instantly across the entire app
            </span>
          </div>

          <div class="d-flex align-center mb-2">
            <v-icon class="me-2" color="success" size="small">mdi-content-save</v-icon>
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
  import { ref } from 'vue'
  const customTheme = ref({
    name: '',
    primary: '#4F6367',
    secondary: '#7A9E9F',
    accent: '#B8D8D8',
    background: '#EEF5DB',
    surface: '#FFFFFF',
    isDark: false,
  })

  const createTheme = () => {
    if (!customTheme.value.name || !customTheme.value.primary || !customTheme.value.secondary || !customTheme.value.accent || !customTheme.value.background || !customTheme.value.surface) return
    createCustomTheme(customTheme.value.name, {
      primary: customTheme.value.primary,
      secondary: customTheme.value.secondary,
      accent: customTheme.value.accent,
      background: customTheme.value.background,
      surface: customTheme.value.surface,
      isDark: customTheme.value.isDark,
    })
    customTheme.value = {
      name: '',
      primary: '#4F6367',
      secondary: '#7A9E9F',
      accent: '#B8D8D8',
      background: '#EEF5DB',
      surface: '#FFFFFF',
      isDark: false,
    }
  }
  import { computed } from 'vue'
  import { useTheme } from '@/composables/useTheme.js'

  // Use the theme composable
  const {
    currentTheme,
    themeConfig,
    isLoading,
    availableThemes,
    setTheme,
    resetTheme,
    deleteCustomTheme,
  } = useTheme()

  // Handle theme deletion
  const deleteTheme = themeKey => {
    if (confirm(`Are you sure you want to delete this custom theme?`)) {
      deleteCustomTheme(themeKey)
    }
  }

  // Current theme configuration for display
  const currentThemeConfig = computed(() => {
    const current = availableThemes.value.find(t => t.value === currentTheme.value)
    return current || { name: 'Unknown' }
  })
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
