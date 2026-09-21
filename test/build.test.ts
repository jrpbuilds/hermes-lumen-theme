/**
 * Sanity checks on the built artifact. The artifact is committed, so these run
 * without a build step; scripts/check-artifact.mjs separately guards byte
 * parity with a fresh build.
 */

import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { describe, expect, it } from "vitest"

const ARTIFACT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../desktop/plugin.js")

const artifact = await readFile(ARTIFACT, "utf8")
const readableArtifact = artifact.replace(/\\"/g, '"')

describe("built desktop/plugin.js", () => {
    it("keeps the SDK import for the runtime loader to rewrite", () => {
        expect(artifact).toContain("@hermes/plugin-sdk")
    })

    it("registers the lumen theme selector", () => {
        expect(readableArtifact).toMatch(/data-hermes-theme=["']lumen["']/)
        expect(readableArtifact).toMatch(/\[data-hermes-mode=["']dark["']\]/)
    })

    it("uses the 18px global scale", () => {
        expect(artifact).toContain("font-size: 18px")
    })

    it("carries the third-party attribution", () => {
        expect(artifact).toContain("minimalist-themes-for-hermes")
    })

    it("bundles every clarity-layer surface", () => {
        for (const marker of [
            "composer-surface",
            "sessions-sidebar",
            "bots-roster",
            "tab-skills",
            "overscroll-contain",
            "lumen-scaffold-gradient",
        ]) {
            expect(artifact, marker).toContain(marker)
        }
    })

    it("bundles the Lumen workspace layout contribution", () => {
        for (const marker of [
            "lumen-layout",
            'LAYOUTS_AREA = "layouts"',
            "ctx.register(layoutContribution)",
            "hermes-bots:pane",
        ]) {
            expect(artifact, marker).toContain(marker)
        }
    })

    it("keeps standard select menus aligned and long options contained", () => {
        for (const marker of [
            "--radix-select-trigger-width",
            "data-radix-select-item-text",
            "-webkit-line-clamp: 2",
            "overflow-wrap: anywhere",
        ]) {
            expect(artifact, marker).toContain(marker)
        }
    })

    it("bundles the self-hosted Manrope font", () => {
        expect(artifact).toContain('font-family: "Manrope"')
        expect(artifact).toContain("data:font/woff2;base64,")
        expect(artifact).not.toContain("fonts.googleapis.com/css2?family=Manrope")
    })

    it("bundles the branded transcript scaffold gradient", () => {
        expect(artifact).toContain("data-conversation-scaffold")
        expect(artifact).toContain("var(--lumen-scaffold-gradient)")
        expect(artifact).toContain("background-clip: text")
    })

    it("has balanced braces in the inlined stylesheet", () => {
        const open = [...artifact.matchAll(/\{/g)].length
        const close = [...artifact.matchAll(/\}/g)].length

        expect(open).toBe(close)
    })
})
