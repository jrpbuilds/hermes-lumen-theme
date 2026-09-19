import { fileURLToPath } from "node:url"

import { defineConfig } from "vitest/config"

export default defineConfig({
    resolve: {
        alias: {
            "@hermes/plugin-sdk": fileURLToPath(new URL("./test/plugin-sdk-shim.ts", import.meta.url)),
        },
    },
    test: {
        include: ["test/**/*.test.ts"],
        environment: "node",
    },
})
