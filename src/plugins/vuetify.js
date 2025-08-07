/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Composables
import { createVuetify } from "vuetify";

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Custom color palette
const customColorPalette = {
  lightGray: "#B8D8D8", // Light blue-gray
  mediumGray: "#7A9E9F", // Medium blue-gray
  darkGray: "#4F6367", // Dark blue-gray
  cream: "#EEF5DB", // Light cream/green
};

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: "dark",
    themes: {
      light: {
        colors: {
          primary: customColorPalette.darkGray,
          secondary: customColorPalette.mediumGray,
          accent: customColorPalette.lightGray,
          background: customColorPalette.cream,
          surface: "#FFFFFF",
          error: "#F44336",
          warning: "#FF9800",
          info: "#2196F3",
          success: "#4CAF50",
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: "#822522",
          secondary: "#D4AF37",
          accent: "#FF715B",
          background: "#1A1A1A",
          surface: "#2E3236",
        },
      },
    },
  },
  display: {
    mobileBreakpoint: "sm",
    thresholds: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});
