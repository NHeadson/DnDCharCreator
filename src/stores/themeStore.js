import { defineStore } from "pinia";
import { ref, reactive, computed } from "vue";

export const useThemeStore = defineStore("theme", {
  state: () => ({
    currentTheme: "default",
    isLoading: false,
    themeConfig: {},
    themePresets: {},
    availableThemes: [],
  }),
  actions: {
    initThemes() {
      // Custom color palette
      const customColorPalette = {
        lightGray: "#B8D8D8",
        mediumGray: "#7A9E9F",
        darkGray: "#4F6367",
        cream: "#EEF5DB",
      };
      // Theme presets
      this.themePresets = {
        default: {
          name: "D&D Classic Dark",
          primary: "#822522",
          secondary: "#CD853F",
          accent: "#D4AF37",
          background: "#1A1A1A",
          surface: "#2C1810",
          isDark: true,
        },
        custom: {
          name: "Mystical Waters",
          primary: customColorPalette.mediumGray,
          secondary: customColorPalette.darkGray,
          accent: customColorPalette.lightGray,
          background: customColorPalette.darkGray,
          surface: "#3A4B4E",
          isDark: true,
        },
        elegant: {
          name: "Elegant Sage",
          primary: customColorPalette.darkGray,
          secondary: customColorPalette.mediumGray,
          accent: customColorPalette.cream,
          background: "#2A3335",
          surface: customColorPalette.darkGray,
          isDark: true,
        },
        light: {
          name: "Sage Light",
          primary: customColorPalette.darkGray,
          secondary: customColorPalette.mediumGray,
          accent: customColorPalette.lightGray,
          background: customColorPalette.cream,
          surface: "#FFFFFF",
          isDark: false,
        },
      };
      // Load custom themes from localStorage
      const customThemes = JSON.parse(
        localStorage.getItem("dnd-app-custom-themes") || "{}"
      );
      if (customThemes && typeof customThemes === "object") {
        this.themePresets = { ...this.themePresets, ...customThemes };
      }
      // Set default config
      this.themeConfig = { ...this.themePresets.default };
      // Set available themes
      this.availableThemes = Object.entries(this.themePresets).map(
        ([key, theme]) => ({
          value: key,
          name: theme.name,
          preview: {
            primary: theme.primary,
            secondary: theme.secondary,
            accent: theme.accent,
            background: theme.background,
          },
        })
      );
    },
    setTheme(themeKey) {
      if (!this.themePresets[themeKey]) return;
      this.isLoading = true;
      try {
        Object.assign(this.themeConfig, this.themePresets[themeKey]);
        this.currentTheme = themeKey;
        localStorage.setItem("dnd-app-theme", themeKey);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Error applying theme:", e);
      } finally {
        this.isLoading = false;
      }
    },
    resetTheme() {
      this.setTheme("default");
    },
    loadSavedTheme() {
      const savedTheme = localStorage.getItem("dnd-app-theme");
      if (savedTheme && this.themePresets[savedTheme]) {
        this.setTheme(savedTheme);
      }
    },
    createCustomTheme(name, colors) {
      const customKey = `custom_${Date.now()}`;
      this.themePresets[customKey] = { name, ...colors };
      const customThemes = JSON.parse(
        localStorage.getItem("dnd-app-custom-themes") || "{}"
      );
      customThemes[customKey] = this.themePresets[customKey];
      localStorage.setItem(
        "dnd-app-custom-themes",
        JSON.stringify(customThemes)
      );
      this.availableThemes.push({ value: customKey, name, preview: colors });
      return customKey;
    },
    deleteCustomTheme(themeKey) {
      if (!themeKey.startsWith("custom_")) return false;
      if (this.currentTheme === themeKey) this.setTheme("default");
      delete this.themePresets[themeKey];
      const customThemes = JSON.parse(
        localStorage.getItem("dnd-app-custom-themes") || "{}"
      );
      delete customThemes[themeKey];
      localStorage.setItem(
        "dnd-app-custom-themes",
        JSON.stringify(customThemes)
      );
      this.availableThemes = this.availableThemes.filter(
        (t) => t.value !== themeKey
      );
      return true;
    },
  },
  getters: {
    isDark: (state) => state.themeConfig.isDark,
    theme: (state) => state.themeConfig,
    themes: (state) => state.availableThemes,
    loading: (state) => state.isLoading,
    current: (state) => state.currentTheme,
  },
});
