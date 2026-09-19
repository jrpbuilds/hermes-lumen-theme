/**
 * Make the whole painted sidebar-search rectangle focus the actual input.
 *
 * The wrapper is located structurally — walking ancestors and verifying the
 * exact depth `sessions-sidebar > sidebar-content > div > div` — rather than
 * via a `:has()` selector string, so the logic is unit-testable without a CSS
 * selector engine. This is the JS twin of the CSS wrapper selector in
 * src/styles/sidebar.css; if the app's DOM shape changes, change both
 * together (see docs/COMPATIBILITY.md).
 */

import type { PluginContext } from "../types/plugin-contract"

const SIDEBAR_SELECTOR = "[data-tour='sessions-sidebar']"

/** `sidebar > [data-slot='sidebar-content'] > div > wrapper` shape check. */
function isSearchWrapper(node: Element, sidebar: Element): boolean {
    if (node.tagName !== "DIV") {
        return false
    }

    const outer = node.parentElement

    if (!outer || outer.tagName !== "DIV") {
        return false
    }

    const content = outer.parentElement

    return content?.getAttribute("data-slot") === "sidebar-content" && content.parentElement === sidebar
}

/**
 * Resolve the search input a pointerdown inside the painted search rectangle
 * should focus, or null when the press must not be intercepted (interactive
 * elements) or no search field is involved.
 */
export function findSearchInput(target: EventTarget | null): HTMLInputElement | null {
    if (!(target instanceof Element)) {
        return null
    }

    if (target.closest('input, button, a, [role="button"]')) {
        return null
    }

    const sidebar = target.closest(SIDEBAR_SELECTOR)

    if (!sidebar) {
        return null
    }

    // The wrapper is the first ancestor that directly contains the search input
    // AND sits at the expected depth under the sidebar content. Deeper matches
    // with the wrong structure are skipped, mirroring CSS closest() semantics.
    let node: Element | null = target

    while (node && node !== sidebar) {
        if (isSearchWrapper(node, sidebar)) {
            const input = node.querySelector<HTMLInputElement>(':scope > input[type="text"]')

            if (input instanceof HTMLInputElement) {
                return input
            }
        }

        node = node.parentElement
    }

    return null
}

/** Wire the pointerdown interceptor; disposed with the plugin. */
export function installSidebarSearchFocus(ctx: PluginContext): void {
    if (typeof document === "undefined") {
        return
    }

    const handlePointerDown = (event: PointerEvent): void => {
        const input = findSearchInput(event.target)

        if (!input) {
            return
        }

        event.preventDefault()
        input.focus()
    }

    document.addEventListener("pointerdown", handlePointerDown)

    ctx.onDispose(() => {
        document.removeEventListener("pointerdown", handlePointerDown)
    })
}
