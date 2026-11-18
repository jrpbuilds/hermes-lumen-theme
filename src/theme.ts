/**
 * The theme contribution. This object is what the app validates
 * (`isValidTheme`) and paints with (`applyTheme`); everything visual beyond
 * the palette lives in the clarity layer (src/styles/).
 */

import { DARK, DARK_TERMINAL, LIGHT, LIGHT_TERMINAL } from "./palettes"
import type { DesktopTheme } from "./types/desktop-theme"

export const THEME_NAME = "lumen"

export const theme: DesktopTheme = {
    name: THEME_NAME,
    label: "Lumen",
    description: "A brighter, clearer, more spacious Hermes",

    colors: LIGHT,
    darkColors: DARK,

    typography: {
        fontSans:
            'Manrope, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", emoji',
        fontMono: '"JetBrains Mono", "SFMono-Regular", Consolas, "Liberation Mono", monospace',
        // 1.125rem = 18px — the global scale the clarity layer used to force
        // with a root-level !important override. The app now paints this
        // field as --dt-base-size on the real :root
        // (apps/desktop/src/themes/context.tsx), so every rem-based size in
        // the app scales through the supported path instead.
        baseSize: "1.125rem",
    },

    terminal: LIGHT_TERMINAL,
    darkTerminal: DARK_TERMINAL,
}
