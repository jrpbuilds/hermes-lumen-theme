/**
 * One-shot install: copy the committed artifact into the Hermes Desktop
 * plugin folder (hot-reloaded by the app on write).
 *
 * Target: ~/.hermes/desktop-plugins/lumen/plugin.js
 * Override the destination with LUMEN_INSTALL_DIR.
 */

import { access, constants } from "node:fs/promises"

import { ARTIFACT, syncArtifact } from "./common.mjs"

try {
    await access(ARTIFACT, constants.F_OK)
} catch {
    console.error("[lumen] desktop/plugin.js not found — run `npm run build` first.")

    process.exitCode = 1
}

if (!process.exitCode) {
    await syncArtifact()
}
