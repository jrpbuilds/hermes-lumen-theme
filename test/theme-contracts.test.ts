/**
 * Fast contracts for the clarity layer's non-Bots surfaces.
 *
 * These fixtures verify selector compatibility and theme containment without
 * requiring Electron or a Hermes Desktop checkout. They intentionally do not
 * assert layout or pixels; those remain part of the manual compatibility pass.
 */

// @vitest-environment jsdom
import { readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { beforeEach, describe, expect, it } from "vitest"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

const STYLE_FILES = [
    "bots.css",
    "capabilities.css",
    "composer.css",
    "conversation.css",
    "focus.css",
    "forms.css",
    "kanban.css",
    "segmented.css",
    "sidebar.css",
    "tokens.css",
] as const

const LUMEN_SCOPE = ':root[data-hermes-theme="lumen"]'

const FRAGILE_FALLBACKS = [
    {
        cssFile: "kanban.css",
        marker: "FRAGILE FALLBACK — task dialog feed",
        stableAnchor: "data-slot='dialog-content'",
    },
    { cssFile: "bots.css", marker: "FRAGILE FALLBACK —", stableAnchor: "data-slot='bots-roster'" },
    {
        cssFile: "sidebar.css",
        marker: "FRAGILE FALLBACK — matches the app's Tailwind",
        stableAnchor: "data-tour='sessions-sidebar'",
    },
    {
        cssFile: "sidebar.css",
        marker: "FRAGILE FALLBACK — profile rail controls",
        stableAnchor: "data-slot='profile-rail'",
    },
    {
        cssFile: "sidebar.css",
        marker: "FRAGILE FALLBACK — a section header's trailing action cluster",
        stableAnchor: "data-tour='sessions-sidebar'",
    },
    {
        cssFile: "segmented.css",
        marker: "FRAGILE FALLBACK — SegmentedControl",
        stableAnchor: "aria-pressed",
    },
    {
        cssFile: "capabilities.css",
        marker: "FRAGILE FALLBACK — capabilities scope divider",
        stableAnchor: "data-tour='tab-skills'",
    },
] as const

function readSource(relativePath: string): string {
    return readFileSync(path.join(ROOT, relativePath), "utf8")
}

function normalizeCss(value: string): string {
    return value.replaceAll(/\s+/g, " ").replaceAll(/\(\s+/g, "(").replaceAll(/\s+\)/g, ")").trim()
}

function splitSelectors(selectorList: string): string[] {
    const selectors: string[] = []
    let start = 0
    let depth = 0

    for (let index = 0; index < selectorList.length; index += 1) {
        const character = selectorList[index]

        if (character === "(" || character === "[") {
            depth += 1
        } else if (character === ")" || character === "]") {
            depth -= 1
        } else if (character === "," && depth === 0) {
            selectors.push(selectorList.slice(start, index))
            start = index + 1
        }
    }

    selectors.push(selectorList.slice(start))

    return selectors.map(selector => selector.trim()).filter(Boolean)
}

/** Return ordinary CSS rule headers, recursing through conditional at-rules. */
function ruleHeaders(css: string): string[] {
    const withoutComments = css.replaceAll(/\/\*[\s\S]*?\*\//g, "")
    const headers: string[] = []
    let cursor = 0

    while (cursor < withoutComments.length) {
        const open = withoutComments.indexOf("{", cursor)

        if (open === -1) {
            break
        }

        const header = withoutComments.slice(cursor, open).trim()
        let depth = 1
        let close = open + 1

        while (close < withoutComments.length && depth > 0) {
            if (withoutComments[close] === "{") {
                depth += 1
            } else if (withoutComments[close] === "}") {
                depth -= 1
            }

            close += 1
        }

        const body = withoutComments.slice(open + 1, close - 1)

        if (header.startsWith("@")) {
            headers.push(...ruleHeaders(body))
        } else if (header) {
            headers.push(header)
        }

        cursor = close
    }

    return headers
}

function selector(cssFile: (typeof STYLE_FILES)[number], value: string): string {
    const css = normalizeCss(readSource(`src/styles/${cssFile}`))
    const normalized = normalizeCss(value)

    expect(css, `${cssFile} should retain its selector`).toContain(normalized)

    return normalized
}

const SIDEBAR_DOM = `
  <aside data-tour="sessions-sidebar">
    <div data-slot="sidebar-content">
      <div data-slot="sidebar-group"><button data-sidebar="menu-button"></button></div>
      <div><div><input type="text" /></div></div>
      <div data-sessions-mode>
        <div data-slot="sidebar-group">
          <div>
            <button role="button"></button>
            <div class="flex shrink-0 items-center gap-0.5">
              <button aria-label="New session" class="size-6"></button>
              <div class="grid size-6 place-items-center"><button class="size-6"></button></div>
            </div>
          </div>
        </div>
        <div data-slot="sidebar-group"><div><button role="button"></button></div></div>
      </div>
      <div class="row-hover bg-(--ui-row-active-background)">
        <span class="hover-marquee"></span>
      </div>
      <div data-slot="profile-rail">
        <button aria-pressed="true" class="cursor-grab touch-none rounded-[3px] text-[0.5625rem]"></button>
      </div>
    </div>
  </aside>
  <button id="unrelated-profile-control" aria-pressed="true" class="cursor-grab touch-none rounded-[3px] text-[0.5625rem]"></button>
`

const CAPABILITIES_DOM = `
  <section>
    <button data-tour="tab-skills"></button>
    <button data-tour="tab-toolsets"></button>
    <button data-tour="tab-connectors"></button>
    <button data-tour="tab-plugins"></button>
    <p class="text-muted-foreground/70"></p>
    <div class="cm-editor"><div class="cm-gutters"></div></div>
  </section>
`

/*
 * Mirrors the Capabilities page under its PageSearchShell for each tab that
 * renders the scope selector: Skills, Toolsets and Connectors all show the
 * "Configuring:" row (border-b + secondary stroke token) above the tab
 * content wrapper (the shell's content chain). The Connectors tab carries
 * the search row with the tertiary-stroke divider that must keep its
 * native position. The Plugins tab renders NO scope row — its wrapper must
 * not gain padding — and a decoy row outside any section must never be
 * caught.
 */
const CAPABILITIES_TABS_DOM = `
  <section>
    <div class="shrink-0">
      <div data-tour="page-tabs">
        <button data-tour="tab-skills">Skills</button>
        <button data-tour="tab-toolsets">Tools</button>
        <button data-tour="tab-connectors">Connectors</button>
        <button data-tour="tab-plugins">Plugins</button>
      </div>
    </div>
    <div class="min-h-0 flex-1 overflow-hidden">
      <div class="flex h-full flex-col">
        <div class="flex min-w-0 items-center gap-2 border-b border-(--ui-stroke-secondary) px-3 py-2">
          <span>Configuring:</span><button>default — This device (current)</button>
        </div>
        <div class="flex min-h-0 flex-1 flex-col">
          <div class="min-h-40 flex-1 overflow-hidden"><p>skills list</p></div>
        </div>
      </div>
    </div>
  </section>
  <section>
    <div class="shrink-0">
      <div data-tour="page-tabs">
        <button data-tour="tab-skills">Skills</button>
        <button data-tour="tab-toolsets">Tools</button>
        <button data-tour="tab-connectors">Connectors</button>
        <button data-tour="tab-plugins">Plugins</button>
      </div>
    </div>
    <div class="min-h-0 flex-1 overflow-hidden">
      <div class="flex h-full flex-col">
        <div class="flex min-w-0 items-center gap-2 border-b border-(--ui-stroke-secondary) px-3 py-2">
          <span>Configuring:</span><button>default — This device (current)</button>
        </div>
        <div class="flex min-h-0 flex-1 flex-col">
          <div class="min-h-0 flex-1"><p>toolsets list</p></div>
        </div>
      </div>
    </div>
  </section>
  <section>
    <div class="shrink-0">
      <div data-tour="page-tabs">
        <button data-tour="tab-skills">Skills</button>
        <button data-tour="tab-toolsets">Tools</button>
        <button data-tour="tab-connectors">Connectors</button>
        <button data-tour="tab-plugins">Plugins</button>
      </div>
    </div>
    <div class="min-h-0 flex-1 overflow-hidden">
      <div class="flex h-full flex-col">
        <div class="flex min-w-0 items-center gap-2 border-b border-(--ui-stroke-secondary) px-3 py-2">
          <span>Configuring:</span><button>default — This device (current)</button>
        </div>
        <div class="flex min-h-0 flex-1 flex-col">
          <div class="min-h-0 flex-1">
            <div class="flex h-full min-h-0 flex-col gap-3 px-4 pb-2">
              <div data-slot="connectors-directory" class="flex min-h-0 flex-1 flex-col gap-3">
                <div class="flex shrink-0 items-center gap-3"><h2>Connectors</h2></div>
                <div class="flex shrink-0 items-center gap-3 border-b border-(--ui-stroke-tertiary) pb-1.5">
                  <input type="text" placeholder="Search 65 apps." />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section>
    <div class="shrink-0">
      <div data-tour="page-tabs">
        <button data-tour="tab-skills">Skills</button>
        <button data-tour="tab-toolsets">Tools</button>
        <button data-tour="tab-connectors">Connectors</button>
        <button data-tour="tab-plugins">Plugins</button>
      </div>
    </div>
    <div class="min-h-0 flex-1 overflow-hidden">
      <div class="flex h-full flex-col">
        <div class="flex min-h-0 flex-1 flex-col"><p>plugins list</p></div>
      </div>
    </div>
  </section>
  <div class="flex min-w-0 items-center gap-2 border-b border-(--ui-stroke-secondary) px-3 py-2">
    <span>decoy row outside any section</span>
  </div>
`

/*
 * Mirrors the native Kanban task dialog's feed structure (Hermes Desktop
 * plugins/kanban/drawer.tsx at commit 074349fb27): the SegmentedControl tab
 * row, an Activity/Runs/Worker-log feed wrapped in FadeScroll, a
 * Comments-shaped feed without one, plus a plain dialog that lacks the
 * identifying width class. The board header count lozenge sits outside the
 * dialog, next to a near-miss counter span that must never be caught.
 */
const KANBAN_DIALOG_DOM = `
  <header>
    <h1>Kanban</h1>
    <span class="rounded-full bg-(--ui-bg-quaternary) px-1.5 py-px text-[0.625rem] tabular-nums">294</span>
    <span class="rounded bg-(--ui-bg-quinary) px-1 py-px text-[0.6rem] tabular-nums leading-3.5">7</span>
  </header>
  <div data-slot="dialog-content" class="w-[min(62rem,94vw)] max-w-none">
    <section class="flex flex-col gap-3">
      <div class="flex items-center justify-between gap-2">
        <div class="inline-grid auto-cols-fr grid-flow-col gap-0.5 rounded-[5px] bg-(--ui-bg-tertiary) p-0.5">
          <button aria-pressed="false" class="text-muted-foreground">Comments · 0</button>
          <button aria-pressed="true" class="bg-background text-foreground shadow-sm">Activity · 37</button>
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <div class="overflow-y-auto overscroll-contain">
          <ul class="flex flex-col gap-1.5">
            <li>
              <div class="flex items-center gap-2"><span data-slot="badge" class="bg-muted">running</span></div>
            </li>
            <li>
              <div class="flex items-center gap-2"><span data-slot="badge" class="bg-destructive">failed</span></div>
            </li>
          </ul>
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <ul class="flex flex-col gap-3"><li>comment</li></ul>
      </div>
    </section>
  </div>
  <div data-slot="dialog-content" class="max-w-none">
    <section class="flex flex-col gap-3">
      <div class="flex flex-col gap-4">
        <div class="overflow-y-auto overscroll-contain"></div>
      </div>
    </section>
  </div>
`

/*
 * Mirrors the app's SegmentedControl track both as the review scope row
 * renders it (scope-row.tsx — twMerge replaced `inline-grid`/`auto-cols-fr`
 * with `auto-cols-[minmax(0,auto)]` under the new dedicated row) and as the
 * Kanban task dialog renders it (plain base classes, `mr-1` passed through).
 * A near-miss `rounded-[5px]` div without SegmentedControl buttons must never
 * be caught, and an inactive option must never take the active pill.
 */
const SEGMENTED_DOM = `
  <aside aria-label="Review">
    <div class="grid-flow-col gap-0.5 rounded-[5px] bg-(--ui-bg-tertiary) p-0.5 hidden w-full auto-cols-[minmax(0,auto)] @[13.5rem]:grid [&>button]:px-2">
      <button aria-pressed="true" class="bg-background text-foreground shadow-sm"><span>Uncommitted</span></button>
      <button aria-pressed="false" class="text-muted-foreground"><span>Branch</span></button>
    </div>
  </aside>
  <div class="inline-grid w-fit auto-cols-fr grid-flow-col gap-0.5 rounded-[5px] bg-(--ui-bg-tertiary) p-0.5 mr-1">
    <button aria-pressed="false" class="text-muted-foreground">Comments · 0</button>
    <button aria-pressed="true" class="bg-background text-foreground shadow-sm">Activity · 37</button>
  </div>
  <div class="rounded-[5px]"><span aria-pressed="true">decoy span</span></div>
`

describe("Lumen theme contracts", () => {
    beforeEach(() => {
        document.documentElement.setAttribute("data-hermes-theme", "lumen")
        document.body.innerHTML = ""
    })

    it("scopes every clarity-layer selector to the active Lumen theme", () => {
        for (const cssFile of STYLE_FILES) {
            for (const header of ruleHeaders(readSource(`src/styles/${cssFile}`))) {
                for (const ruleSelector of splitSelectors(header)) {
                    expect(ruleSelector, `${cssFile}: ${ruleSelector}`).toContain(LUMEN_SCOPE)
                }
            }
        }
    })

    it("documents every retained utility fallback with its owning stable anchor", () => {
        const compatibility = readSource("docs/COMPATIBILITY.md")

        for (const { cssFile, marker, stableAnchor } of FRAGILE_FALLBACKS) {
            expect(readSource(`src/styles/${cssFile}`), cssFile).toContain(marker)
            expect(compatibility, stableAnchor).toContain(stableAnchor)
        }
    })

    it("targets the sessions sidebar search, section, and selected-row contracts", () => {
        document.body.innerHTML = SIDEBAR_DOM

        const selectors = [
            selector(
                "sidebar.css",
                `${LUMEN_SCOPE} [data-tour="sessions-sidebar"] > [data-slot="sidebar-content"] > div > div:has(> input[type="text"])`,
            ),
            selector(
                "sidebar.css",
                `${LUMEN_SCOPE} [data-tour="sessions-sidebar"] [data-sessions-mode] > [data-slot="sidebar-group"]`,
            ),
            selector(
                "sidebar.css",
                `${LUMEN_SCOPE} [data-tour="sessions-sidebar"] .row-hover[class*="bg-(--ui-row-active-background)"] .hover-marquee`,
            ),
        ]

        for (const current of selectors) {
            expect(() => document.querySelectorAll(current), current).not.toThrow()
            expect(document.querySelectorAll(current), current).not.toHaveLength(0)
        }

        // The Projects-style header action cluster (the header's last child
        // holding the "+" and filter-menu buttons) is capped to the pill's
        // content box; the icon-less section's label-only header has no
        // action cluster, so nothing there may match.
        const actionContainment = selector(
            "sidebar.css",
            `${LUMEN_SCOPE} [data-tour="sessions-sidebar"] [data-sessions-mode] > [data-slot="sidebar-group"] > div:first-child > :last-child:has(button) :is(button, [class~="size-6"])`,
        )

        expect(document.querySelectorAll(actionContainment)).toHaveLength(3)
        // The label-only section header's button is not inside an action cluster:
        // the header's last child is the button itself, which has no button
        // descendants, so `:has(button)` excludes it.
        expect(document.querySelectorAll(`${actionContainment} [role="button"]`)).toHaveLength(0)
    })

    it("removed the section-pill accent rail and keeps the pill geometry", () => {
        document.body.innerHTML = SIDEBAR_DOM

        const pill = selector(
            "sidebar.css",
            `${LUMEN_SCOPE} [data-tour="sessions-sidebar"] [data-sessions-mode] > [data-slot="sidebar-group"] > div:first-child`,
        )

        expect(document.querySelectorAll(pill)).toHaveLength(2)

        // The pill's accent rail declaration is gone: no inset x-axis shadow
        // remains in the pill rule's block (the fixture's rail would otherwise
        // paint a 2px line on the first section header).
        const pillRule = readSource("src/styles/sidebar.css").match(
            /\[data-tour="sessions-sidebar"\]\s+\[data-sessions-mode\]\s+>\s+\[data-slot="sidebar-group"\]\s+>\s+div:first-child\s*\{[\s\S]*?\}/,
        )

        expect(pillRule?.[0]).toBeDefined()
        expect(pillRule![0]).not.toMatch(/box-shadow|inset 2px/)
    })

    it("contains profile-rail fallbacks beneath Hermes' stable rail hook", () => {
        document.body.innerHTML = SIDEBAR_DOM

        const profileRailControl = selector(
            "sidebar.css",
            `${LUMEN_SCOPE} [data-slot="profile-rail"] :is(button.cursor-grab.touch-none.rounded-\\[3px\\].text-\\[0\\.5625rem\\][aria-pressed], button.opacity-35.rounded-\\[3px\\].text-\\[0\\.5625rem\\])`,
        )

        expect(document.querySelectorAll(profileRailControl)).toHaveLength(1)
        expect(document.querySelector("#unrelated-profile-control")?.matches(profileRailControl)).toBe(false)
    })

    it("targets the composer surface and every light-mode primary control state", () => {
        document.documentElement.removeAttribute("data-hermes-mode")
        document.body.innerHTML = `
          <div data-slot="composer-surface">
            <button class="bg-foreground"><svg></svg></button>
            <button class="bg-foreground"><span class="codicon codicon-arrow-up"></span></button>
            <button class="bg-foreground"><span class="block size-2.5 rounded-[0.1875rem] bg-current"></span></button>
            <button class="bg-foreground" disabled><span class="block size-2.5 rounded-[0.1875rem] bg-current"></span></button>
          </div>
        `

        const selectors = [
            selector("composer.css", `${LUMEN_SCOPE} [data-slot="composer-surface"]`),
            selector(
                "composer.css",
                `${LUMEN_SCOPE}:not([data-hermes-mode="dark"]) [data-slot="composer-surface"] button.bg-foreground:not(:disabled)`,
            ),
        ]

        for (const current of selectors) {
            expect(() => document.querySelectorAll(current), current).not.toThrow()
            expect(document.querySelectorAll(current), current).not.toHaveLength(0)
        }

        // The hover rule is a static contract: it must stay in the file and
        // parse, but nothing is hovered under jsdom so it matches nothing.
        const hoverSelector = selector(
            "composer.css",
            `${LUMEN_SCOPE}:not([data-hermes-mode="dark"]) [data-slot="composer-surface"] button.bg-foreground:not(:disabled):hover`,
        )

        expect(() => document.querySelectorAll(hoverSelector)).not.toThrow()

        // Voice (inline svg), Send (Codicon glyph), and Stop (square span)
        // all take the purple fill; the disabled dimmed state stays native.
        expect(document.querySelectorAll(selectors[1])).toHaveLength(3)
    })

    it("targets the capabilities tab set and readable editor tiers", () => {
        document.body.innerHTML = CAPABILITIES_DOM

        const selectorPrefix = `${LUMEN_SCOPE} section:has([data-tour="tab-skills"]):has([data-tour="tab-toolsets"]):has([data-tour="tab-connectors"]):has([data-tour="tab-plugins"])`

        const selectors = [
            selector(
                "capabilities.css",
                `${selectorPrefix} :is([class~="text-muted-foreground/50"], [class~="text-muted-foreground/60"], [class~="text-muted-foreground/70"], [class~="text-muted-foreground/80"])`,
            ),
            selector("capabilities.css", `${selectorPrefix} .cm-editor .cm-gutters`),
        ]

        for (const current of selectors) {
            expect(() => document.querySelectorAll(current), current).not.toThrow()
            expect(document.querySelectorAll(current), current).not.toHaveLength(0)
        }
    })

    it("airs the capabilities scope divider on every tab that shows it", () => {
        document.body.innerHTML = CAPABILITIES_TABS_DOM

        const selectors = [
            // The scope selector row's divider gains bottom padding.
            selector(
                "capabilities.css",
                `${LUMEN_SCOPE} section:has([data-tour="tab-skills"]):has([data-tour="tab-toolsets"]) [class~="border-(--ui-stroke-secondary)"][class~="py-2"]`,
            ),
            // The tab content wrapper gains top padding, only while the
            // divider row actually precedes it.
            selector(
                "capabilities.css",
                `${LUMEN_SCOPE} section:has([data-tour="tab-skills"]):has([data-tour="tab-toolsets"]) > div:last-child > div:first-child:has(> div:first-child[class~="border-(--ui-stroke-secondary)"][class~="py-2"]) > div:last-child`,
            ),
        ]

        // Exactly the three scope rows (Skills, Toolsets, Connectors) are
        // caught — never the Plugins wrapper or the decoy row.
        expect(() => document.querySelectorAll(selectors[0])).not.toThrow()
        expect(document.querySelectorAll(selectors[0])).toHaveLength(3)

        for (const current of selectors) {
            for (const element of document.querySelectorAll(current)) {
                expect(element.textContent, current).not.toContain("decoy")
            }
        }

        expect(document.querySelectorAll(selectors[1])).toHaveLength(3)
        expect([...document.querySelectorAll(selectors[1])].map(element => element.textContent?.trim())).toEqual(
            expect.arrayContaining(["skills list", "toolsets list", "Connectors"]),
        )

        // The Connectors search divider (tertiary token) is never the scope
        // row, and the Plugins wrapper — which has no divider above it —
        // gains no padding.
        const searchDivider = document.querySelector('[class~="border-(--ui-stroke-tertiary)"]')
        expect(searchDivider).not.toBeNull()
        expect([...document.querySelectorAll(selectors[0])]).not.toContain(searchDivider)

        const pluginsWrapper = [...document.querySelectorAll("section")]
            .at(-1)
            ?.querySelector("div.flex.h-full.flex-col > div:last-child")

        expect(pluginsWrapper?.textContent).toContain("plugins list")
        expect([...document.querySelectorAll(selectors[1])]).not.toContain(pluginsWrapper)

        // The divider itself is softened — a color-mix toward transparent on
        // the scope row's bottom border — so the line reads quiet on every tab
        // that shows it rather than as a full-strength secondary rule.
        const scopeRowRule = readSource("src/styles/capabilities.css").match(
            /\[class~="border-\(--ui-stroke-secondary\)"\]\[class~="py-2"\]\s*\{[\s\S]*?\}/,
        )

        expect(scopeRowRule?.[0]).toMatch(/border-bottom-color:\s*color-mix\(in srgb, var\(--ui-stroke-secondary\)/)
    })

    it("targets the Kanban task dialog feed and muted badges", () => {
        document.documentElement.removeAttribute("data-hermes-mode")
        document.body.innerHTML = KANBAN_DIALOG_DOM

        const dialogAnchor = `[data-slot="dialog-content"][class~="w-[min(62rem,94vw)]"]`
        const feedChain = `section.flex.flex-col.gap-3 > div.flex.flex-col.gap-4`

        const selectors = {
            feedWrapper: selector(
                "kanban.css",
                `${LUMEN_SCOPE} ${dialogAnchor} ${feedChain}:has(> div.overflow-y-auto.overscroll-contain)`,
            ),
            scrollContainer: selector(
                "kanban.css",
                `${LUMEN_SCOPE} ${dialogAnchor} ${feedChain} > div.overflow-y-auto.overscroll-contain`,
            ),
            lightBadge: selector(
                "kanban.css",
                `${LUMEN_SCOPE}:not([data-hermes-mode="dark"]) ${dialogAnchor} ${feedChain} > div.overflow-y-auto.overscroll-contain > ul [data-slot="badge"].bg-muted`,
            ),
            darkBadge: selector(
                "kanban.css",
                `${LUMEN_SCOPE}[data-hermes-mode="dark"] ${dialogAnchor} ${feedChain} > div.overflow-y-auto.overscroll-contain > ul [data-slot="badge"].bg-muted`,
            ),
            lightLozenge: selector(
                "kanban.css",
                `${LUMEN_SCOPE}:not([data-hermes-mode="dark"]) span[class~="rounded-full"][class~="bg-(--ui-bg-quaternary)"][class~="py-px"][class~="tabular-nums"]`,
            ),
            darkLozenge: selector(
                "kanban.css",
                `${LUMEN_SCOPE}[data-hermes-mode="dark"] span[class~="rounded-full"][class~="bg-(--ui-bg-quaternary)"][class~="py-px"][class~="tabular-nums"]`,
            ),
        }

        // Only the scroll-wrapped feed matches; the Comments-shaped feed and
        // the width-class-less dialog stay native.
        expect(document.querySelectorAll(selectors.feedWrapper)).toHaveLength(1)
        expect(document.querySelectorAll(selectors.scrollContainer)).toHaveLength(1)

        // Light mode tints only the muted badge; failed badges stay red.
        expect(document.querySelectorAll(selectors.lightBadge)).toHaveLength(1)
        expect(document.querySelector(selectors.lightBadge)?.textContent).toBe("running")

        // The board header count lozenge is caught; the near-miss counter
        // (rounded, quinary background) next to it is not.
        expect(document.querySelectorAll(selectors.lightLozenge)).toHaveLength(1)
        expect(document.querySelector(selectors.lightLozenge)?.textContent).toBe("294")

        // Dark-only rules stay inert while no mode is set.
        expect(document.querySelectorAll(selectors.darkBadge)).toHaveLength(0)
        expect(document.querySelectorAll(selectors.darkLozenge)).toHaveLength(0)

        document.documentElement.setAttribute("data-hermes-mode", "dark")
        expect(document.querySelectorAll(selectors.darkBadge)).toHaveLength(1)
        expect(document.querySelectorAll(selectors.darkLozenge)).toHaveLength(1)
        expect(document.querySelectorAll(selectors.lightLozenge)).toHaveLength(0)
    })

    it("paints the active SegmentedControl pill app-wide in both modes", () => {
        document.documentElement.removeAttribute("data-hermes-mode")
        document.body.innerHTML = SEGMENTED_DOM

        const pillSelector = selector(
            "segmented.css",
            `${LUMEN_SCOPE}:not([data-hermes-mode="dark"]) div[class~="rounded-[5px]"] > button[aria-pressed="true"]`,
        )

        const darkPillSelector = selector(
            "segmented.css",
            `${LUMEN_SCOPE}[data-hermes-mode="dark"] div[class~="rounded-[5px]"] > button[aria-pressed="true"]`,
        )

        // Both tracks' active options (scope row + Kanban dialog) are caught;
        // the decoy's aria-pressed span is not a SegmentedControl button.
        expect(document.querySelectorAll(pillSelector)).toHaveLength(2)
        expect(document.querySelector(pillSelector)?.textContent).toContain("Uncommitted")
        expect(document.querySelectorAll(`${pillSelector}, [aria-pressed="false"]`)).toHaveLength(4)

        // Dark-only rules stay inert while no mode is set.
        expect(document.querySelectorAll(darkPillSelector)).toHaveLength(0)

        document.documentElement.setAttribute("data-hermes-mode", "dark")
        expect(document.querySelectorAll(darkPillSelector)).toHaveLength(2)
        expect(document.querySelector(darkPillSelector)?.textContent).toContain("Uncommitted")
        expect(document.querySelectorAll(pillSelector)).toHaveLength(0)
    })
})

describe("release metadata", () => {
    it("keeps package.json aligned with the top unreleased changelog entry", () => {
        const packageVersion = JSON.parse(readSource("package.json")) as { version?: unknown }
        const changelog = readSource("CHANGELOG.md")
        const unreleasedVersion = /^## \[([^\]]+)\](?!\s*-)/m.exec(changelog)?.[1]

        expect(packageVersion.version).toMatch(/^\d+\.\d+\.\d+$/)
        expect(unreleasedVersion).toBe(packageVersion.version)
    })
})
