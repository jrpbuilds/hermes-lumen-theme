/**
 * The theme contribution. This object is what the app validates
 * (`isValidTheme`) and paints with (`applyTheme`); everything visual beyond
 * the palette lives in the clarity layer (src/styles/).
 */

import { DARK, DARK_TERMINAL, LIGHT, LIGHT_TERMINAL } from './palettes'
import type { DesktopTheme } from './types/desktop-theme'

export const THEME_NAME = 'lumen'

export const theme: DesktopTheme = {
  name: THEME_NAME,
  label: 'Lumen',
  description: 'A brighter, clearer, more spacious Hermes',

  colors: LIGHT,
  darkColors: DARK,

  typography: {
    fontSans:
      'Manrope, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", emoji',
    fontMono: '"JetBrains Mono", "SFMono-Regular", Consolas, "Liberation Mono", monospace',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap'
  },

  terminal: LIGHT_TERMINAL,
  darkTerminal: DARK_TERMINAL
}
