/**
 * Shared paths, flags and esbuild options for the Lumen build scripts.
 */

import { copyFile, mkdir, readFile, rename, unlink } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
export const ARTIFACT = path.join(ROOT, "plugin.js")
export const ENTRY = path.join(ROOT, "src/plugin.ts")

/** Where Hermes Desktop loads the plugin from.
 *
 *  Resolution order: LUMEN_INSTALL_DIR (full path override) →
 *  $HERMES_HOME/desktop-plugins/lumen → ~/.hermes/desktop-plugins/lumen. */
export function installDir() {
    if (process.env.LUMEN_INSTALL_DIR) {
        return process.env.LUMEN_INSTALL_DIR
    }

    const hermesHome = process.env.HERMES_HOME ?? path.join(os.homedir(), ".hermes")

    return path.join(hermesHome, "desktop-plugins", "lumen")
}

export const BANNER = `/*!
 * Lumen — a brighter, clearer, more spacious theme for Hermes Desktop.
 *
 * Generated artifact — built from src/ by scripts/build.mjs. Do not edit.
 * The committed plugin.js must match a fresh \`npm run build\`;
 * scripts/check-artifact.mjs guards this.
 *
 * SPDX-License-Identifier: MIT
 *
 * Theme registration and a small number of Hermes-specific contrast fixes
 * were informed by Minimalist Themes for Hermes by Miguel Euraque (MIT):
 * https://github.com/mykeura/minimalist-themes-for-hermes
 */
`

export function buildOptions(outfile) {
    return {
        entryPoints: [ENTRY],
        outfile,
        bundle: true,
        format: "esm",
        target: ["es2022"],
        platform: "browser",
        // Readable output is a feature: the artifact is committed and reviewed.
        minify: false,
        sourcemap: false,
        legalComments: "inline",
        banner: { js: BANNER },
        // Styles are inlined as strings and concatenated at runtime by plugin.ts.
        // Font assets use data URLs so the single-file plugin stays offline-capable.
        loader: { ".css": "text", ".woff2": "dataurl" },
        // The SDK is rewritten to a live shim by the app's runtime loader; it must
        // survive as a bare import in the artifact.
        external: ["@hermes/plugin-sdk"],
        logLevel: "info",
    }
}

/** Copy the built artifact into the Hermes Desktop plugin folder. */
export async function syncArtifact(source = ARTIFACT) {
    const targetDir = installDir()
    const target = path.join(targetDir, "plugin.js")
    const temporary = path.join(targetDir, `.plugin.js.${process.pid}.${Date.now()}.tmp`)

    await mkdir(targetDir, { recursive: true })

    try {
        await copyFile(source, temporary)
        await rename(temporary, target)
    } finally {
        await unlink(temporary).catch(() => undefined)
    }

    const bytes = (await readFile(target)).length

    console.log(`[lumen] synced ${target} (${bytes} bytes)`)
}
