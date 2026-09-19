/**
 * Mirrored plugin authoring contract from NousResearch/hermes-agent
 * `apps/desktop/src/contrib/types.ts` + `contrib/plugin.ts` (v0.21.x).
 *
 * Only the surface Lumen uses is mirrored; see docs/COMPATIBILITY.md for the
 * keep-in-sync policy.
 */

import type { DesktopTheme } from "./desktop-theme"

/** Provenance tag; the host stamps `plugin:<id>` on every registration. */
export type ContributionSource = "core" | (string & {})

/** The single, uniform primitive every surface consumes. */
export interface Contribution {
    /** Stable id, unique within its area. Re-registering the same id replaces it. */
    id: string
    /** Namespaced area id this contribution targets, e.g. `'themes'`. */
    area: string
    source?: ContributionSource
    title?: string
    order?: number
    when?: () => boolean
    enabled?: boolean
    render?: () => unknown
    /** Declarative payload for data contributions — themes, commands, etc. */
    data?: unknown
}

/** A contribution as a plugin author writes it — provenance + id scoping are the host's job. */
export type PluginContribution = Omit<Contribution, "source" | "id"> & { id: string }

/** The scoped context handed to a plugin's `register`. */
export interface PluginContext {
    /** The resolved plugin source tag, e.g. `'plugin:lumen'`. */
    readonly source: string
    /** Register one contribution (id namespaced, source stamped). */
    register: (c: PluginContribution) => () => void
    /** Register several at once; the returned disposer removes all of them. */
    registerMany: (cs: PluginContribution[]) => () => void
    /** Register an arbitrary cleanup to run on unload/disable. */
    onDispose: (fn: () => void) => void
}

/** A plugin is a module that default-exports this shape. */
export interface HermesPlugin {
    /** Stable slug — becomes the `plugin:<id>` source and the id namespace. */
    id: string
    /** Human name for settings / about UI. */
    name?: string
    /** One-liner for the settings inventory. */
    description?: string
    /** Registers on load when the user hasn't chosen (default true). */
    defaultEnabled?: boolean
    /** Called once at load; wire contributions through `ctx`. */
    register: (ctx: PluginContext) => void
}

/** The theme contribution Lumen registers into `THEMES_AREA`. */
export type ThemeContribution = PluginContribution & { data: DesktopTheme }

/** Layout tree node mirrored from `components/pane-shell/tree/model.ts`. */
export type LayoutOrientation = "row" | "column"

export type LayoutTabStripMode = "always" | "never"

export interface LayoutSplitNode {
    type: "split"
    id: string
    orientation: LayoutOrientation
    children: LayoutNode[]
    weights: number[]
}

export interface LayoutGroupNode {
    type: "group"
    id: string
    panes: string[]
    active: string
    minimized?: boolean
    tabStrip?: LayoutTabStripMode
}

export type LayoutNode = LayoutSplitNode | LayoutGroupNode

/** The layout contribution Lumen registers into the app's `'layouts'` area. */
export type LayoutContribution = PluginContribution & { data: LayoutNode }
