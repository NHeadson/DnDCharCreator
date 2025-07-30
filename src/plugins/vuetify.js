/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Composables
import { createVuetify } from 'vuetify'

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Custom color palette
const customColorPalette = {
  lightGray: '#B8D8D8', // Light blue-gray
  mediumGray: '#7A9E9F', // Medium blue-gray
  darkGray: '#4F6367', // Dark blue-gray
  cream: '#EEF5DB', // Light cream/green
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      light: {
        colors: {
          primary: customColorPalette.darkGray,
          secondary: customColorPalette.mediumGray,
          accent: customColorPalette.lightGray,
          background: customColorPalette.cream,
          surface: '#FFFFFF',
          error: '#F44336',
          warning: '#FF9800',
          info: '#2196F3',
          success: '#4CAF50',
        },
      },
      dark: {
        colors: {
          primary: '#822522',
          secondary: '#2C1810',
          accent: '#D4AF37',
          background: '#1A1A1A',
          surface: '#2C1810',
          error: '#FF5252',
          warning: '#FFC107',
          info: '#03DAC6',
          success: '#00E676',
        },
      },
    },
  },
})
