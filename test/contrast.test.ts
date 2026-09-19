/**
 * WCAG contrast assertions on the contributed palettes.
 *
 * Policy:
 *   - "Core" fg/bg pairs (body text on every major surface, plus foregrounds
 *     on primary/destructive/midground fills) must clear WCAG AA 4.5:1.
 *   - De-emphasized meta text (mutedForeground on muted) is held to the AA
 *     large-text floor 3:1 — it is intentionally quieter than body text.
 *
 * Measured at the time the floors were set:
 *   light muted 4.11 (the only pair below 4.5, by design),
 *   light text-tertiary 4.51, dark muted 4.89.
 */

import { readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { describe, expect, it } from "vitest"

import { DARK, LIGHT } from "../src/palettes"
import type { DesktopThemeColors } from "../src/types/desktop-theme"

/** WCAG 2.x relative luminance for a #RRGGBB color. */
function luminance(hex: string): number {
    const channels = [1, 3, 5].map(offset => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255)

    const [r, g, b] = channels.map(channel =>
        channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    )

    return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** WCAG contrast ratio between two hex colors. */
function contrastRatio(foreground: string, background: string): number {
    const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a)

    return (lighter + 0.05) / (darker + 0.05)
}

/** Palette lookup that fails loudly instead of casting an optional key away. */
function ink(colors: DesktopThemeColors, key: keyof DesktopThemeColors): string {
    const value = colors[key]

    if (typeof value !== "string") {
        throw new Error(`palette is missing "${String(key)}"`)
    }

    return value
}

interface ColorPair {
    background: keyof DesktopThemeColors
    foreground: keyof DesktopThemeColors
    floor: number
}

const CORE_PAIRS: ReadonlyArray<ColorPair> = [
    { background: "background", foreground: "foreground", floor: 4.5 },
    { background: "card", foreground: "cardForeground", floor: 4.5 },
    { background: "popover", foreground: "popoverForeground", floor: 4.5 },
    { background: "secondary", foreground: "secondaryForeground", floor: 4.5 },
    { background: "accent", foreground: "accentForeground", floor: 4.5 },
    { background: "primary", foreground: "primaryForeground", floor: 4.5 },
    { background: "destructive", foreground: "destructiveForeground", floor: 4.5 },
    { background: "midground", foreground: "midgroundForeground", floor: 4.5 },
    { background: "sidebarBackground", foreground: "foreground", floor: 4.5 },
]

const META_PAIRS: ReadonlyArray<ColorPair> = [{ background: "muted", foreground: "mutedForeground", floor: 3.0 }]

const TOKENS_CSS = readFileSync(
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src/styles/tokens.css"),
    "utf8",
)

function tokenHex(mode: "light" | "dark", name: string): string {
    const selector =
        mode === "light"
            ? /:root\[data-hermes-theme=["']lumen["']\]\s*\{/g
            : /:root\[data-hermes-theme=["']lumen["']\]\[data-hermes-mode=["']dark["']\]\s*\{/g

    const match = selector.exec(TOKENS_CSS)

    if (!match || match.index === undefined) {
        throw new Error(`tokens.css is missing the ${mode} token block`)
    }

    const block = TOKENS_CSS.slice(match.index, TOKENS_CSS.indexOf("}", match.index))
    const value = new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`).exec(block)?.[1]

    if (!value) {
        throw new Error(`tokens.css is missing a hex value for --${name} in ${mode} mode`)
    }

    return value
}

const TEXT_SECONDARY_LIGHT = tokenHex("light", "ui-text-secondary")
const TEXT_SECONDARY_DARK = tokenHex("dark", "ui-text-secondary")
const TEXT_TERTIARY_LIGHT = tokenHex("light", "ui-text-tertiary")
const TEXT_TERTIARY_DARK = tokenHex("dark", "ui-text-tertiary")
const TEXT_QUATERNARY_LIGHT = tokenHex("light", "ui-text-quaternary")
const TEXT_QUATERNARY_DARK = tokenHex("dark", "ui-text-quaternary")

describe("palette contrast", () => {
    for (const [mode, colors] of [
        ["light", LIGHT],
        ["dark", DARK],
    ] as const) {
        describe(mode, () => {
            for (const pair of [...CORE_PAIRS, ...META_PAIRS]) {
                it(`${pair.foreground} on ${pair.background} clears ${pair.floor}:1`, () => {
                    const ratio = contrastRatio(ink(colors, pair.foreground), ink(colors, pair.background))

                    expect(
                        ratio,
                        `${pair.foreground}/${pair.background} measured ${ratio.toFixed(2)}`,
                    ).toBeGreaterThanOrEqual(pair.floor)
                })
            }
        })
    }
})

describe("clarity-layer ink contrast", () => {
    it("holds the fixed text-tier hexes to their floors on the chrome background", () => {
        expect(contrastRatio(TEXT_SECONDARY_LIGHT, LIGHT.background)).toBeGreaterThanOrEqual(4.5)
        expect(contrastRatio(TEXT_SECONDARY_DARK, DARK.background)).toBeGreaterThanOrEqual(4.5)

        expect(contrastRatio(TEXT_TERTIARY_LIGHT, LIGHT.background)).toBeGreaterThanOrEqual(3.0)
        expect(contrastRatio(TEXT_TERTIARY_DARK, DARK.background)).toBeGreaterThanOrEqual(3.0)

        expect(contrastRatio(TEXT_QUATERNARY_LIGHT, LIGHT.background)).toBeGreaterThanOrEqual(3.0)
        expect(contrastRatio(TEXT_QUATERNARY_DARK, DARK.background)).toBeGreaterThanOrEqual(3.0)
    })
})
