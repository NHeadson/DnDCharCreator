// src/composables/useFadedThemeColor.js
import { useTheme } from 'vuetify';

/**
 * Returns a faded (alpha) version of a Vuetify theme color.
 * @param {string} colorName - e.g. 'secondary'
 * @param {number} alpha - 0..1
 * @returns {string} CSS rgba color
 */
export function useFadedThemeColor (colorName, alpha = 0.12) {
  const theme = useTheme();
  // Vuetify 3 theme colors are in theme.current.value.colors
  const color = theme.current.value.colors[colorName];
  if (!color) return `rgba(0,0,0,${alpha})`;
  // Convert hex to rgb
  const hex = color.replace('#', '');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}
