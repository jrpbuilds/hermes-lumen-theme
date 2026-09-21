/**
 * Unified Hermes package contract. The CLI discovers the root manifest while
 * Desktop discovers the companion desktop/plugin.js artifact.
 */

import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { describe, expect, it } from "vitest"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const manifest = await readFile(path.join(ROOT, "plugin.yaml"), "utf8")
const packageJson = JSON.parse(await readFile(path.join(ROOT, "package.json"), "utf8")) as { version: string }

function field(name: string) {
    return new RegExp(`^${name}: (.+)$`, "m").exec(manifest)?.[1]
}

describe("unified Hermes package", () => {
    it("declares the managed Lumen package identity", () => {
        expect(field("name")).toBe("lumen")
        expect(field("label")).toBe("Lumen")
        expect(field("description")).toBe("A brighter, clearer, more spacious Hermes Desktop theme.")
        expect(field("author")).toBe("jrpbuilds")
        expect(field("kind")).toBe("standalone")
    })

    it("keeps the manifest version aligned with package metadata", () => {
        expect(field("version")).toBe(packageJson.version)
    })

    it("ships a Desktop plugin half", async () => {
        const artifact = await readFile(path.join(ROOT, "desktop", "plugin.js"), "utf8")

        expect(artifact).toContain("@hermes/plugin-sdk")
    })
})
