/**
 * Registration tests for the plugin entry point, under jsdom.
 */

// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest"

const installs = vi.hoisted(() => ({
    section: vi.fn(),
    search: vi.fn(),
}))

vi.mock("../src/behaviors/section-glyphs", () => ({ installSectionGlyphs: installs.section }))
vi.mock("../src/behaviors/sidebar-search", () => ({ installSidebarSearchFocus: installs.search }))
vi.mock("../src/fonts", () => ({ manropeCss: "" }))
vi.mock("../src/styles/bots.css", () => ({ default: "" }))
vi.mock("../src/styles/capabilities.css", () => ({ default: "" }))
vi.mock("../src/styles/composer.css", () => ({ default: "" }))
vi.mock("../src/styles/conversation.css", () => ({ default: "" }))
vi.mock("../src/styles/focus.css", () => ({ default: "" }))
vi.mock("../src/styles/forms.css", () => ({ default: "" }))
vi.mock("../src/styles/kanban.css", () => ({ default: "" }))
vi.mock("../src/styles/sidebar.css", () => ({ default: "" }))
vi.mock("../src/styles/tokens.css", () => ({ default: "" }))

import plugin from "../src/plugin"

function buildContext(events: string[]): {
    onDispose: (fn: () => void) => void
    register: (contribution: unknown) => void
    registerMany: () => () => void
    source: string
    disposers: Array<() => void>
} {
    const disposers: Array<() => void> = []

    return {
        onDispose: fn => {
            events.push("dispose")
            disposers.push(fn)
        },
        register: contribution => {
            events.push(`register:${(contribution as { id?: string }).id ?? "unknown"}`)
        },
        registerMany: () => () => undefined,
        source: "plugin:lumen",
        disposers,
    }
}

afterEach(() => {
    document.head.querySelector("#lumen-styles")?.remove()
    installs.section.mockReset()
    installs.search.mockReset()
})

describe("plugin registration", () => {
    it("registers contributions before optional layers and disposes styles", () => {
        const events: string[] = []
        const context = buildContext(events)

        plugin.register(context as never)

        expect(events.slice(0, 2)).toEqual(["register:lumen", "register:lumen-layout"])
        expect(document.head.querySelector("#lumen-styles")).not.toBeNull()
        expect(installs.section).toHaveBeenCalledOnce()
        expect(installs.search).toHaveBeenCalledOnce()

        context.disposers.forEach(dispose => dispose())
        expect(document.head.querySelector("#lumen-styles")).toBeNull()
    })

    it("keeps contributions registered when an optional layer fails", () => {
        const events: string[] = []
        const context = buildContext(events)
        const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined)
        installs.section.mockImplementation(() => {
            throw new Error("section test failure")
        })

        plugin.register(context as never)

        expect(events.slice(0, 2)).toEqual(["register:lumen", "register:lumen-layout"])
        expect(installs.search).toHaveBeenCalledOnce()
        expect(warn).toHaveBeenCalledWith(expect.stringContaining("section glyphs"), expect.any(Error))

        warn.mockRestore()
    })
})
