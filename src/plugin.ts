/**
 * Lumen — a brighter, clearer, more spacious Hermes Desktop theme.
 *
 * Theme registration and a small number of Hermes-specific contrast fixes were
 * informed by Minimalist Themes for Hermes by Miguel Euraque (MIT):
 * https://github.com/mykeura/minimalist-themes-for-hermes
 * See docs/THIRD_PARTY_NOTICES.md.
 *
 * This module is the plugin entry: it contributes the theme data to the
 * `themes` registry area, contributes the Lumen workspace layout to `layouts`,
 * and installs the clarity layer (tokens + per-surface CSS) and the
 * sidebar-search focus behavior. The stylesheet is scoped to
 * `[data-hermes-theme='lumen']`, so it stays installed but inert while any
 * other theme is active.
 */

import { THEMES_AREA } from "@hermes/plugin-sdk"

import { installSectionGlyphs } from "./behaviors/section-glyphs"
import { installSidebarSearchFocus } from "./behaviors/sidebar-search"
import { manropeCss } from "./fonts"
import { layoutContribution } from "./lumen-layout"
import botsCss from "./styles/bots.css"
import capabilitiesCss from "./styles/capabilities.css"
import composerCss from "./styles/composer.css"
import conversationCss from "./styles/conversation.css"
import focusCss from "./styles/focus.css"
import formsCss from "./styles/forms.css"
import kanbanCss from "./styles/kanban.css"
import sidebarCss from "./styles/sidebar.css"
import tokensCss from "./styles/tokens.css"
import { theme, THEME_NAME } from "./theme"
import type { HermesPlugin, PluginContext, ThemeContribution } from "./types/plugin-contract"

const STYLE_ID = `${THEME_NAME}-styles`

/*
 * Concatenation order is cascade order: tokens first, then per-surface rules
 * in the original clarity-layer order.
 */
const CSS = [
    manropeCss,
    tokensCss,
    conversationCss,
    formsCss,
    sidebarCss,
    botsCss,
    composerCss,
    kanbanCss,
    capabilitiesCss,
    focusCss,
].join("\n")

function installStyles(ctx: PluginContext): void {
    if (typeof document === "undefined" || !document.head) {
        return
    }

    // Replaces the previous incarnation on hot reload (same id, fresh content).
    document.getElementById(STYLE_ID)?.remove()

    const style = document.createElement("style")

    style.id = STYLE_ID
    style.textContent = CSS
    document.head.append(style)

    ctx.onDispose(() => {
        style.remove()
    })
}

function installOptional(ctx: PluginContext, name: string, install: (ctx: PluginContext) => void): void {
    try {
        install(ctx)
    } catch (error) {
        console.warn(`[lumen] ${name} layer could not be installed`, error)
    }
}

const themeContribution: ThemeContribution = {
    id: THEME_NAME,
    area: THEMES_AREA,
    data: theme,
}

export default {
    id: THEME_NAME,
    name: "Lumen",
    description: theme.description,
    register(ctx) {
        ctx.register(themeContribution)
        ctx.register(layoutContribution)

        installOptional(ctx, "styles", installStyles)
        installOptional(ctx, "section glyphs", installSectionGlyphs)
        installOptional(ctx, "sidebar search", installSidebarSearchFocus)
    },
} satisfies HermesPlugin
