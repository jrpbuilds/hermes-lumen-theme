/**
 * Lumen palettes — the single source of truth for every color the theme
 * contributes. The clarity layer (src/styles/) references these values through
 * the app's seed/palette CSS vars (`--theme-*`, `--dt-*`) where the two
 * coincide; fixed hexes there are Lumen-authored refinements with no palette
 * counterpart.
 */

import type { DesktopTerminalPalette, DesktopThemeColors } from "./types/desktop-theme"

export const LIGHT: DesktopThemeColors = {
    background: "#F6F7F9",
    foreground: "#171A1F",
    card: "#FFFFFF",
    cardForeground: "#171A1F",
    muted: "#E9EDF2",
    mutedForeground: "#68737F",
    popover: "#FFFFFF",
    popoverForeground: "#171A1F",
    primary: "#6558D9",
    primaryForeground: "#FFFFFF",
    secondary: "#ECEAFB",
    secondaryForeground: "#332D71",
    accent: "#EFEDFB",
    accentForeground: "#332D71",
    border: "#C7CDD5",
    input: "#AEB7C2",
    ring: "#6558D9",
    midground: "#6558D9",
    midgroundForeground: "#FFFFFF",
    composerRing: "#8E83EA",
    destructive: "#C4324A",
    destructiveForeground: "#FFFFFF",
    sidebarBackground: "#EEF1F5",
    sidebarBorder: "#C7CDD5",
    userBubble: "#EFEDFB",
    userBubbleBorder: "#C9C4F0",
}

export const DARK: DesktopThemeColors = {
    background: "#1B1F24",
    foreground: "#F2F4F7",
    card: "#252B32",
    cardForeground: "#F2F4F7",
    muted: "#303740",
    mutedForeground: "#9DA6B2",
    popover: "#2B323A",
    popoverForeground: "#F2F4F7",
    primary: "#9B92FF",
    primaryForeground: "#14161A",
    secondary: "#34314F",
    secondaryForeground: "#E5E2FF",
    accent: "#393653",
    accentForeground: "#F1EFFF",
    border: "#414A55",
    input: "#596574",
    ring: "#9B92FF",
    midground: "#9B92FF",
    midgroundForeground: "#14161A",
    composerRing: "#8C82F4",
    destructive: "#F06472",
    destructiveForeground: "#190709",
    sidebarBackground: "#22272E",
    sidebarBorder: "#414A55",
    userBubble: "#302D46",
    userBubbleBorder: "#514C75",
}

export const LIGHT_TERMINAL: DesktopTerminalPalette = {
    foreground: "#2A3038",
    cursor: "#6558D9",
    selectionBackground: "#DAD6FA",

    black: "#303740",
    red: "#B4233C",
    green: "#247A52",
    yellow: "#8B6508",
    blue: "#3F63C8",
    magenta: "#7657C5",
    cyan: "#267781",
    white: "#E4E8ED",

    brightBlack: "#68737F",
    brightRed: "#D13D57",
    brightGreen: "#2E9365",
    brightYellow: "#A77A0C",
    brightBlue: "#5275DE",
    brightMagenta: "#8A6ADC",
    brightCyan: "#328C97",
    brightWhite: "#FFFFFF",
}

export const DARK_TERMINAL: DesktopTerminalPalette = {
    foreground: "#E7EAF0",
    cursor: "#9B92FF",
    selectionBackground: "#4B466E",

    black: "#252B32",
    red: "#F06472",
    green: "#68C596",
    yellow: "#DDB65D",
    blue: "#83A9FF",
    magenta: "#BEA8FF",
    cyan: "#75C7D0",
    white: "#C2C8D0",

    brightBlack: "#717E8D",
    brightRed: "#FF8993",
    brightGreen: "#8BD8B1",
    brightYellow: "#EACB83",
    brightBlue: "#A6C2FF",
    brightMagenta: "#D3C4FF",
    brightCyan: "#99D9E0",
    brightWhite: "#FFFFFF",
}
