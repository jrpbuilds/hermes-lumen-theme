/**
 * Drift guard: the committed plugin.js must byte-match a fresh build.
 * Exits 1 (with a hint) when they differ; CI runs this as part of `npm run check`.
 */

import { mkdtemp, readFile, rm } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import esbuild from "esbuild"

import { ARTIFACT, buildOptions } from "./common.mjs"

const tempDir = await mkdtemp(path.join(os.tmpdir(), "lumen-check-"))
const tempArtifact = path.join(tempDir, "plugin.js")

try {
    await esbuild.build({ ...buildOptions(tempArtifact), logLevel: "silent" })

    const [committed, fresh] = await Promise.all([readFile(ARTIFACT), readFile(tempArtifact)])

    if (!committed.equals(fresh)) {
        console.error(
            "[lumen] plugin.js is out of date with src/.\n" +
                "        Run `npm run build` and commit the refreshed artifact.",
        )

        process.exitCode = 1
    } else {
        console.log("[lumen] plugin.js matches a fresh build")
    }
} finally {
    await rm(tempDir, { recursive: true, force: true })
}
