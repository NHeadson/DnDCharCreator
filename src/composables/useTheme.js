import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useTheme as useVuetifyTheme } from 'vuetify'

// Your custom color palette
const customColorPalette = {
  lightGray: '#B8D8D8', // Light blue-gray
  mediumGray: '#7A9E9F', // Medium blue-gray
  darkGray: '#4F6367', // Dark blue-gray
  cream: '#EEF5DB', // Light cream/green
}

// Generate color variations for better styling
const generateColorVariations = baseColor => {
  // Helper function to lighten/darken colors
  const adjustBrightness = (hex, percent) => {
    const num = Number.parseInt(hex.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) + amt
    const G = ((num >> 8) & 0x00_ff) + amt
    const B = (num & 0x00_00_ff) + amt
    return (
      '#'
      + (
        0x1_00_00_00
        + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x1_00_00
        + (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x1_00
        + (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    )
  }

  return {
    lighten5: adjustBrightness(baseColor, 40),
    lighten4: adjustBrightness(baseColor, 30),
    lighten3: adjustBrightness(baseColor, 20),
    lighten2: adjustBrightness(baseColor, 10),
    lighten1: adjustBrightness(baseColor, 5),
    base: baseColor,
    darken1: adjustBrightness(baseColor, -5),
    darken2: adjustBrightness(baseColor, -10),
    darken3: adjustBrightness(baseColor, -20),
    darken4: adjustBrightness(baseColor, -30),
  }
}

// Predefined theme configurations
let themePresets = {
  default: {
    name: 'D&D Classic Dark',
    primary: '#822522',
    secondary: '#CD853F', // Peru - warm bronze/copper that complements the deep red
    accent: '#D4AF37',
    background: '#1A1A1A', // Dark background
    surface: '#2C1810', // Dark surface using secondary color
    isDark: true, // Changed to dark mode
  },
  custom: {
    name: 'Mystical Waters',
    primary: customColorPalette.mediumGray, // #7A9E9F
    secondary: customColorPalette.darkGray, // #4F6367
    accent: customColorPalette.lightGray, // #B8D8D8
    background: customColorPalette.darkGray, // #4F6367 - Dark background
    surface: '#3A4B4E', // Slightly lighter than background
    isDark: true,
  },
  elegant: {
    name: 'Elegant Sage',
    primary: customColorPalette.darkGray, // #4F6367
    secondary: customColorPalette.mediumGray, // #7A9E9F
    accent: customColorPalette.cream, // #EEF5DB
    background: '#2A3335', // Darker version of darkGray
    surface: customColorPalette.darkGray, // #4F6367
    isDark: true,
  },
  light: {
    name: 'Sage Light',
    primary: customColorPalette.darkGray, // #4F6367
    secondary: customColorPalette.mediumGray, // #7A9E9F
    accent: customColorPalette.lightGray, // #B8D8D8
    background: customColorPalette.cream, // #EEF5DB - Light background
    surface: '#FFFFFF', // Pure white surfaces
    isDark: false,
  },
}

export function useTheme () {
  // Current theme state
  const currentTheme = ref('default')
  const isLoading = ref(false)

  // Vuetify theme instance
  const vuetifyTheme = useVuetifyTheme()

  // Reactive theme configuration
  const themeConfig = reactive({
    ...themePresets.default,
  })

  // Available theme options for admin selector
  const availableThemes = computed(() =>
    Object.entries(themePresets).map(([key, theme]) => ({
      value: key,
      name: theme.name,
      preview: {
        primary: theme.primary,
        secondary: theme.secondary,
        accent: theme.accent,
        background: theme.background,
      },
    })),
  )

  // Generate CSS custom properties for the current theme
  const cssVariables = computed(() => {
    const primary = generateColorVariations(themeConfig.primary)
    const secondary = generateColorVariations(themeConfig.secondary)
    const accent = generateColorVariations(themeConfig.accent)

    return {
      // Primary color variations
      '--theme-primary': primary.base,
      '--theme-primary-lighten-1': primary.lighten1,
      '--theme-primary-lighten-2': primary.lighten2,
      '--theme-primary-lighten-3': primary.lighten3,
      '--theme-primary-lighten-4': primary.lighten4,
      '--theme-primary-lighten-5': primary.lighten5,
      '--theme-primary-darken-1': primary.darken1,
      '--theme-primary-darken-2': primary.darken2,
      '--theme-primary-darken-3': primary.darken3,
      '--theme-primary-darken-4': primary.darken4,

      // Secondary color variations
      '--theme-secondary': secondary.base,
      '--theme-secondary-lighten-1': secondary.lighten1,
      '--theme-secondary-lighten-2': secondary.lighten2,
      '--theme-secondary-lighten-3': secondary.lighten3,
      '--theme-secondary-lighten-4': secondary.lighten4,
      '--theme-secondary-lighten-5': secondary.lighten5,
      '--theme-secondary-darken-1': secondary.darken1,
      '--theme-secondary-darken-2': secondary.darken2,
      '--theme-secondary-darken-3': secondary.darken3,
      '--theme-secondary-darken-4': secondary.darken4,

      // Accent color variations
      '--theme-accent': accent.base,
      '--theme-accent-lighten-1': accent.lighten1,
      '--theme-accent-lighten-2': accent.lighten2,
      '--theme-accent-lighten-3': accent.lighten3,
      '--theme-accent-lighten-4': accent.lighten4,
      '--theme-accent-lighten-5': accent.lighten5,
      '--theme-accent-darken-1': accent.darken1,
      '--theme-accent-darken-2': accent.darken2,
      '--theme-accent-darken-3': accent.darken3,
      '--theme-accent-darken-4': accent.darken4,

      // Background and surface
      '--theme-background': themeConfig.background,
      '--theme-surface': themeConfig.surface,

      // Text colors based on theme
      '--theme-text-primary': themeConfig.isDark ? '#FFFFFF' : '#1A1A1A',
      '--theme-text-secondary': themeConfig.isDark ? '#B0B0B0' : '#666666',
      '--theme-text-disabled': themeConfig.isDark ? '#707070' : '#9E9E9E',

      // Border and divider colors
      '--theme-border': themeConfig.isDark ? '#404040' : '#E0E0E0',
      '--theme-divider': themeConfig.isDark ? '#303030' : '#F0F0F0',
    }
  })

  // Apply CSS variables to document root
  const applyCSSVariables = () => {
    const root = document.documentElement
    const variables = cssVariables.value

    for (const [property, value] of Object.entries(variables)) {
      root.style.setProperty(property, value)
    }
  }

  // Update Vuetify theme
  const updateVuetifyTheme = () => {
    if (!vuetifyTheme) {
      return
    }

    const isDark = themeConfig.isDark
    if (vuetifyTheme.theme && typeof vuetifyTheme.theme.change === 'function') {
      vuetifyTheme.theme.change(isDark ? 'dark' : 'light')
    }

    // Update theme colors
    const themeColors = {
      primary: themeConfig.primary,
      secondary: themeConfig.secondary,
      accent: themeConfig.accent,
      background: themeConfig.background,
      surface: themeConfig.surface,
    }

    // Apply to both light and dark themes
    Object.assign(vuetifyTheme.themes.value.light.colors, themeColors)
    Object.assign(vuetifyTheme.themes.value.dark.colors, themeColors)
  }

  // Change theme
  const setTheme = async themeKey => {
    if (!themePresets[themeKey]) {
      console.warn(`Theme "${themeKey}" not found`)
      return
    }

    isLoading.value = true

    try {
      // Update theme configuration
      Object.assign(themeConfig, themePresets[themeKey])
      currentTheme.value = themeKey

      // Apply changes
      applyCSSVariables()
      updateVuetifyTheme()

      // Set data attribute for theme-specific styling
      document.documentElement.dataset.theme = themeKey

      // Save to localStorage
      localStorage.setItem('dnd-app-theme', themeKey)

      console.log(`Theme changed to: ${themePresets[themeKey].name}`)
    } catch (error) {
      console.error('Error applying theme:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Reset to default theme
  const resetTheme = () => {
    setTheme('default')
  }

  // Load theme from localStorage on mount
  const loadSavedTheme = () => {
    // Load custom themes from localStorage
    const customThemes = JSON.parse(
      localStorage.getItem('dnd-app-custom-themes') || '{}',
    )
    if (customThemes && typeof customThemes === 'object') {
      themePresets = { ...themePresets, ...customThemes }
    }
    const savedTheme = localStorage.getItem('dnd-app-theme')
    if (savedTheme && themePresets[savedTheme]) {
      setTheme(savedTheme)
    } else {
      // Apply default theme
      applyCSSVariables()
      updateVuetifyTheme()
    }
  }

  // Custom theme creation (for future expansion)
  const createCustomTheme = (name, colors) => {
    const customKey = `custom_${Date.now()}`
    themePresets[customKey] = {
      name,
      ...colors,
    }
    // Save custom themes to localStorage
    const customThemes = JSON.parse(
      localStorage.getItem('dnd-app-custom-themes') || '{}',
    )
    customThemes[customKey] = themePresets[customKey]
    localStorage.setItem('dnd-app-custom-themes', JSON.stringify(customThemes))
    return customKey
  }

  // Watch for theme config changes
  watch(
    () => ({ ...themeConfig }),
    () => {
      applyCSSVariables()
      updateVuetifyTheme()
    },
    { deep: true },
  )

  // Initialize on mount
  onMounted(() => {
    loadSavedTheme()
  })

  // Delete a custom theme
  const deleteCustomTheme = themeKey => {
    if (!themeKey.startsWith('custom_')) {
      console.warn('Can only delete custom themes')
      return false
    }

    if (currentTheme.value === themeKey) {
      // If the theme being deleted is currently active, switch to default
      setTheme('default')
    }

    // Remove from themePresets
    delete themePresets[themeKey]

    // Update localStorage
    const customThemes = JSON.parse(
      localStorage.getItem('dnd-app-custom-themes') || '{}',
    )
    delete customThemes[themeKey]
    localStorage.setItem('dnd-app-custom-themes', JSON.stringify(customThemes))

    return true
  }

  return {
    // State
    currentTheme: computed(() => currentTheme.value),
    themeConfig: computed(() => ({ ...themeConfig })),
    isLoading: computed(() => isLoading.value),
    availableThemes,
    cssVariables,
    deleteCustomTheme,

    // Methods
    setTheme,
    resetTheme,
    loadSavedTheme,
    createCustomTheme,

    // Utilities
    customColorPalette,
    themePresets,
  }
}
