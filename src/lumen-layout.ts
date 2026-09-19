/**
 * The Lumen workspace layout contribution.
 *
 * This tree was extracted from the author's saved Lumen workspace preset and
 * validated against Hermes Desktop v0.21.x. It is registered through the same
 * `layouts` contribution area as the app's built-in presets. The hermes-bots
 * panes remain in the tree intentionally; Hermes handles unavailable panes
 * through its normal layout adoption path.
 */

import type { LayoutContribution, LayoutNode } from "./types/plugin-contract"

export const LAYOUTS_AREA = "layouts"

export const LUMEN_LAYOUT_ID = "lumen-layout"

export const lumenLayout: LayoutNode = {
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
}

export const layoutContribution: LayoutContribution = {
    id: LUMEN_LAYOUT_ID,
    area: LAYOUTS_AREA,
    title: "Lumen",
    data: lumenLayout,
}
