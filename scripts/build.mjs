/**
 * Build the Lumen plugin artifact.
 *
 *   node scripts/build.mjs            — one-shot build to ./desktop/plugin.js
 *   node scripts/build.mjs --sync     — build, then copy to the install dir
 *   node scripts/build.mjs --watch    — rebuild on change
 *   node scripts/build.mjs --watch --sync — `npm run dev`
 *
 * The Hermes Desktop runtime evaluates a plugin as a SINGLE blob module that
 * may only import `@hermes/plugin-sdk` and `react*`, so everything (including
 * the CSS layer, inlined as strings) is bundled into one self-contained file.
 */

import esbuild from "esbuild"

import { ARTIFACT, buildOptions, syncArtifact } from "./common.mjs"

const watch = process.argv.includes("--watch")
const sync = process.argv.includes("--sync")
const installer = process.env.LUMEN_INSTALLER === "1"
const logLevel = installer ? "warning" : "info"

const syncOnEnd = {
    name: "lumen-sync",
    setup(build) {
        build.onEnd(async result => {
            if (result.errors.length > 0 || !sync) {
                return
            }

            await syncArtifact()
        })
    },
}

if (watch) {
    const context = await esbuild.context({ ...buildOptions(ARTIFACT), logLevel, plugins: [syncOnEnd] })

    await context.watch()

    console.log("[lumen] watching for changes…")
} else {
    await esbuild.build({ ...buildOptions(ARTIFACT), logLevel, plugins: sync ? [syncOnEnd] : [] })

    if (!sync && !installer) {
        console.log("[lumen] built desktop/plugin.js — run `npm run sync` to install it")
    }
}
