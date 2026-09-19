/**
 * Contract tests for the Lumen workspace layout contribution.
 */

import { describe, expect, it } from "vitest"

import { layoutContribution, LAYOUTS_AREA, LUMEN_LAYOUT_ID, lumenLayout } from "../src/lumen-layout"
import type { LayoutNode } from "../src/types/plugin-contract"

function expectValidLayoutNode(node: LayoutNode): void {
    expect(node.id).toEqual(expect.any(String))

    if (node.type === "group") {
        expect(node.panes.length).toBeGreaterThan(0)
        expect(node.panes).toEqual(expect.arrayContaining([node.active]))

        return
    }

    expect(["row", "column"]).toContain(node.orientation)
    expect(node.children.length).toBeGreaterThan(0)
    expect(node.weights).toHaveLength(node.children.length)

    for (const weight of node.weights) {
        expect(Number.isFinite(weight)).toBe(true)
        expect(weight).toBeGreaterThan(0)
    }

    for (const child of node.children) {
        expectValidLayoutNode(child)
    }
}

describe("Lumen layout contribution", () => {
    it("matches the app layout contribution contract", () => {
        expectValidLayoutNode(lumenLayout)
        expect(layoutContribution).toMatchObject({
            area: LAYOUTS_AREA,
            data: lumenLayout,
            id: LUMEN_LAYOUT_ID,
            title: "Lumen",
        })
    })

    it("keeps the saved workspace arrangement", () => {
        expect(lumenLayout).toEqual({
            type: "split",
            id: "s-mu6n5hwr-9",
            orientation: "row",
            children: [
                {
                    type: "group",
                    id: "g-mu6n5hwr-6",
                    panes: ["sessions", "hermes-bots:pane", "hermes-bots:routines"],
                    active: "sessions",
                },
                {
                    type: "split",
                    id: "s-mu6ow7bj-q",
                    orientation: "column",
                    children: [
                        {
                            type: "group",
                            id: "g-mu6ow7bj-p",
                            panes: ["terminal"],
                            active: "terminal",
                            minimized: true,
                        },
                        {
                            type: "group",
                            id: "g-mu6n5hwr-7",
                            panes: ["workspace", "plugin-workspace:hermes-bots:group:orchestrator-researcher-reviewer"],
                            active: "workspace",
                        },
                    ],
                    weights: [1, 1.5322690217391304],
                },
                {
                    type: "group",
                    id: "g-mu6n5hwr-8",
                    panes: ["files", "review"],
                    active: "files",
                },
            ],
            weights: [1, 3.2, 1.2],
        })
    })
})
