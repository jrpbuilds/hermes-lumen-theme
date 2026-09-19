/**
 * Contract tests for the theme data. `isValidTheme` in the app only enforces a
 * minimal shape (name/label/background/foreground/primary); Lumen ships the
 * FULL DesktopThemeColors set in both modes, so these tests assert the stricter
 * contract the clarity layer and docs rely on.
 */

import { describe, expect, it } from 'vitest'

import { DARK_TERMINAL, LIGHT_TERMINAL } from '../src/palettes'
import { theme } from '../src/theme'
import type { DesktopTerminalPalette, DesktopThemeColors } from '../src/types/desktop-theme'

/**
 * Slug list mirrored from the app's built-in presets
 * (apps/desktop/src/themes/presets.ts @ v0.21.x). Contributed themes must not
 * shadow a built-in name — the app drops such contributions silently.
 */
const BUILTIN_THEME_NAMES = new Set([
  'github',
  'nous',
  'catppuccin',
  'everforest',
  'solarized',
  'nous-alt',
  'midnight',
  'ember',
  'mono',
  'cyberpunk'
])

/** Every non-optional key of DesktopThemeColors. */
const REQUIRED_COLOR_KEYS: ReadonlyArray<keyof DesktopThemeColors> = [
  'background',
  'foreground',
  'card',
  'cardForeground',
  'muted',
  'mutedForeground',
  'popover',
  'popoverForeground',
  'primary',
  'primaryForeground',
  'secondary',
  'secondaryForeground',
  'accent',
  'accentForeground',
  'border',
  'input',
  'ring',
  'destructive',
  'destructiveForeground'
]

/** Optional DesktopThemeColors keys Lumen commits to shipping. */
const OPTIONAL_COLOR_KEYS: ReadonlyArray<keyof DesktopThemeColors> = [
  'midground',
  'midgroundForeground',
  'composerRing',
  'sidebarBackground',
  'sidebarBorder',
  'userBubble',
  'userBubbleBorder'
]

/** All ANSI palette keys, required for a hand-tuned terminal theme. */
const TERMINAL_KEYS: ReadonlyArray<keyof DesktopTerminalPalette> = [
  'foreground',
  'cursor',
  'selectionBackground',
  'black',
  'red',
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan',
  'white',
  'brightBlack',
  'brightRed',
  'brightGreen',
  'brightYellow',
  'brightBlue',
  'brightMagenta',
  'brightCyan',
  'brightWhite'
]

const HEX = /^#[0-9a-fA-F]{6}$/

function expectFullPalette(colors: DesktopThemeColors): void {
  for (const key of [...REQUIRED_COLOR_KEYS, ...OPTIONAL_COLOR_KEYS]) {
    const value = colors[key]

    expect(value, key).toBeDefined()
    expect(value, key).toMatch(HEX)
  }
}

describe('theme contribution', () => {
  it('carries identity metadata', () => {
    expect(theme.name).toBe('lumen')
    expect(theme.label).toBe('Lumen')
    expect(theme.description.length).toBeGreaterThan(0)
  })

  it('does not collide with a built-in theme name', () => {
    expect(BUILTIN_THEME_NAMES.has(theme.name)).toBe(false)
  })

  it('ships complete light and dark palettes', () => {
    expectFullPalette(theme.colors)
    expectFullPalette(theme.darkColors ?? ({} as DesktopThemeColors))
  })

  it('light and dark palettes differ', () => {
    expect(theme.darkColors).not.toEqual(theme.colors)
  })

  it('ships sans and mono typography', () => {
    const typography = theme.typography ?? {}

    expect(typography.fontSans?.length).toBeGreaterThan(0)
    expect(typography.fontMono?.length).toBeGreaterThan(0)
    expect(typography.fontSans).toMatch(/^Manrope,/)
    expect(typography.fontUrl).toBe(
      'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap'
    )
  })
})

describe('terminal palettes', () => {
  it('define the full ANSI set in both modes', () => {
    for (const key of TERMINAL_KEYS) {
      expect(LIGHT_TERMINAL[key], `light ${key}`).toMatch(HEX)
      expect(DARK_TERMINAL[key], `dark ${key}`).toMatch(HEX)
    }
  })

  it('differ between modes', () => {
    expect(DARK_TERMINAL).not.toEqual(LIGHT_TERMINAL)
  })
})
