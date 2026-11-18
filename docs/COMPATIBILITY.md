# Compatibility

Lumen themes the running app by _overriding_ it: a palette contribution plus a
CSS/behavior layer anchored on the app's own selectors and tokens. That means
Hermes Desktop updates can change the anchor points even when Lumen's code is
untouched. This file records what the current release was validated against
and where the fragile anchors are, so an app update has a concrete checklist.

**Core theme contracts validated against: Hermes Desktop v0.23.2+canary**
(hermes-agent `apps/desktop` at `f7e2898aae`, 2026-11-18). The SegmentedControl
rule covers the review scope tabs and their narrow-pane TabDropdown fallback
(`scope-row.tsx`); the workspace layout tree was checked against the current
`pane-shell/tree` model.

**Bots integration:** the hermes-bots DOM is now **vendored inside the desktop
app** at `apps/desktop/src/plugins/hermes-bots/` (no longer a separately
versioned plugin), so app updates and Bots DOM changes arrive together.

## Mirrored contracts (keep in sync)

| Vendored here                             | Mirrored from                                            | Notes                                                                                                                            |
| ----------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `src/types/desktop-theme.ts`              | `apps/desktop/src/themes/types.ts`                       | `DesktopTheme` / colors / typography (`baseSize` / `lineHeight` / `letterSpacing`) / terminal palette / `customCSS` / `accentOf` |
| `src/types/plugin-contract.ts`            | `apps/desktop/src/contrib/types.ts`, `contrib/plugin.ts` | `Contribution`, `PluginContext`, `HermesPlugin`                                                                                  |
| `src/types/plugin-contract.ts`            | `apps/desktop/src/components/pane-shell/tree/model.ts`   | `LayoutNode` tree shape                                                                                                          |
| `src/types/hermes-plugin-sdk.d.ts`        | `apps/desktop/src/sdk/index.ts`                          | only `THEMES_AREA` so far (exported from `themes/user-themes.ts`, value still `'themes'`)                                        |
| `src/lumen-layout.ts`                     | `apps/desktop/src/components/pane-shell/tree/presets.ts` | `LAYOUTS_AREA` / layout contribution                                                                                             |
| `test/palettes.test.ts` built-ins fixture | `apps/desktop/src/themes/presets.ts`                     | built-in slug list (now includes `classic` and `slate`)                                                                          |

Runtime seams the build relies on:

- The loader evaluates `plugin.js` as one blob ESM module and rewrites only
  `@hermes/plugin-sdk` / `react*` import specifiers
  (`apps/desktop/src/contrib/runtime-loader.ts`).
- Theme data is validated by `isValidTheme` and painted by `applyTheme`, which
  writes the palette to `--theme-*` seeds / `--dt-*` vars inline on `:root`
  (`apps/desktop/src/themes/context.tsx`, which also stamps
  `dataset.hermesTheme` / `dataset.hermesMode`). The clarity layer references
  those vars, so palette edits in `src/palettes.ts` flow through
  automatically.
- The app stamps `data-hermes-theme` / `data-hermes-mode` on `:root`; every
  clarity-layer rule is scoped to those attributes.
- **Global scale is now theme data, not CSS:** `typography.baseSize: 1.125rem`
  (18px) is painted as `--dt-base-size` and consumed by
  `html { font-size: var(--dt-base-size, 0.875rem) }` in the app's
  `styles.css`. The old `font-size: 18px !important` override on the scoped
  `:root` is retired.
- Hermes owns the Kanban board and centered task dialog. Its native dialog
  width is `min(62rem, 94vw)`; the shared base size keeps that cap near
  1116px. Lumen only colors the Activity, Runs, and Worker log feed surfaces
  and muted run badges; it does not change native dimensions.
- Theme typography uses the self-hosted Manrope faces embedded in the clarity
  layer and `fontSans` as the fallback stack; no font network request is
  needed. `fontMono` relies on the JetBrains Mono faces bundled by Hermes
  Desktop, then falls back to the local system mono stack.
- Layout presets are ordinary `area: 'layouts'` contributions. The Lumen card
  is filtered by the app's `isLayoutNode` validator and applied through the
  app's own `applyTree` / `markActivePreset` path when selected.

## Fragile anchors (re-verify after each app update)

Ordered roughly by breakage likelihood:

1. **Kanban feed accents** (`src/styles/kanban.css`) — the native task
   dialog has `data-slot='dialog-content'` but no Kanban-specific hook. Lumen
   identifies its unique `w-[min(62rem,94vw)]` class, then the feed
   section and `FadeScroll` utility classes (the drawer's `ScrollFade` wraps
   the app `FadeScroll`, which renders `overflow-y-auto overscroll-contain`).
   Only Activity, Runs, and Worker log have that scroll wrapper; Comments does
   not. The board header count lozenge anchors its exact utility combo
   (`rounded-full` + `bg-(--ui-bg-quaternary)` + `py-px` + `tabular-nums`),
   unique to it in the app today (`plugins/kanban/board.tsx`). If these hooks
   change, the inset fill, purple muted run badge, or purple lozenge reverts.
   Heights and scrolling remain app-owned. The dialog tabs' active pill rides
   the shared SegmentedControl rule (item 2).
2. **SegmentedControl active pill** (`src/styles/segmented.css`) — the
   component exposes no `data-slot`, so the shared track anchors its unique
   `rounded-[5px]` utility (the only `rounded-[5px]` in the app today, in
   `apps/desktop/src/components/ui/segmented-control.tsx`), with options
   reached through its `aria-pressed` buttons. The same component backs the
   review scope tabs (`scope-row.tsx`), the Kanban task dialog tabs,
   settings pages, Bots dialogs, and the command center. **Narrow panes
   collapse the scope row to a `TabDropdown`** (below `13.5rem`), which Lumen
   does not restyle — its active option stays native. If the track utility
   changes, active pills revert to the native white/near-black treatment on
   every SegmentedControl surface.
3. **Session rows** (`src/styles/sidebar.css`) — matches
   `.row-hover[class*='bg-(--ui-row-active-background)']`, the title hook
   `.hover-marquee`, and the escaped arbitrary-value classes
   `.text-(--ui-text-tertiary)` / quaternary (`session-row.tsx`). Symptom:
   selected row loses its accent rail/outline, title weight, or meta text
   contrast reverts.
4. **Sidebar search** (`src/styles/sidebar.css` +
   `src/behaviors/sidebar-search.ts`) — the painted field box remains a
   deliberate Lumen design statement over the app's newer receded-underline
   `SearchField`; the icon/placeholder ink rules were retired as app-owned
   (SearchField ships `text-muted-foreground/70` and
   `placeholder:text-muted-foreground`, and the global placeholder rule
   covers the rest). The CSS box and `behaviors/sidebar-search.ts` still
   encode the same DOM shape `sidebar-content > div > div` holding a direct
   `input[type='text']` — structural twins; change both together. The
   behavior is the only fix for click-to-focus (SearchField still has no
   wrapper click handling). Symptom: search field reverts to the app's
   underline chrome or click-to-focus stops working.
5. **Capabilities pages** (`src/styles/capabilities.css`) — the tab group
   was rebuilt upstream as `apps/desktop/src/app/capabilities` with semantic
   page classes (`.capabilities-page`, `.catalog-*`) and **no** per-tab
   `data-tour='tab-*'` anchors; the old contrast chain, scope divider, and
   embedded-picker fixes were retired with them. What remains is one muted
   label lift anchored on the exact combo
   `text-[0.68rem] font-normal text-muted-foreground/60` (the Skills tab's
   server filter and the MCP editor's title) — unique in the app today. If
   the combo spreads or changes, re-audit containment before trusting it.
   Symptom: those small labels revert to washed-out native ink.
6. **Profile rail** (`src/styles/sidebar.css`) — the rest squares carry the
   stable `data-slot='profile-rail-rest-square'`; drag handles still have no
   hook and are matched by their utility predicate
   (`cursor-grab touch-none rounded-[3px] text-[0.5625rem]` +
   `aria-pressed`, resting at `opacity-55` upstream). Symptom: rail glyphs
   revert to app colors, or drag handles drop out of the treatment when their
   classes change.
7. **Sidebar divider geometry** (`src/styles/sidebar.css` +
   `--lumen-sidebar-scrollbar-width` in `tokens.css`) — the hairline above the
   search field is inset on the right by the sessions scroller's stable
   scrollbar gutter so it spans the same box as the section border-tops below
   the search field. That holds only while the app keeps
   `[scrollbar-gutter:stable]` on `[data-sessions-mode]`
   (`apps/desktop/src/app/chat/sidebar/index.tsx`) and the styled scrollbar
   width matches the variable. Symptom: the two hairlines drift apart again.
   Section spacing is also symmetric around each divider by construction: it
   relies on the app's `SidebarGroup` padding (overridden), the header pill's
   `SidebarSectionHeader` wrapper (`sessions-section.tsx`), and group content
   being rendered only while a section is open. The section pill's trailing
   action cluster (the header's last child holding the "+" and filter-menu
   controls) is capped to the pill's 1.25rem content box via the app's
   `size-6` utility on those controls. Symptom: icon-bearing headers
   (Projects) grow taller than icon-less ones (Pinned) again if the app stops
   using `size-6` on those controls.
8. **App token overrides** (`src/styles/tokens.css`) — pins
   `--ui-text-*`, `--ui-stroke-*`, `--ui-bg-*`, `--ui-row-*`/`--ui-control-*`,
   `--ui-selection-background`, `--ui-inline-code-*`, `--stroke-nous`,
   `--conversation-scaffold-*`, `--chrome-action-hover`,
   `--ui-sidebar-surface-background`, and the
   `--dt-input-border`/`--dt-input-bg`/`--dt-input-inset` knobs (percentages
   consumed by `color-mix` in the app's `styles.css`). These are internal
   app tokens — a token rename makes an override inert (harmless) but should
   be cleaned up. The scaffold gradient (`src/styles/conversation.css`)
   additionally anchors the app's `.text-(--conversation-scaffold-text)`
   utility class under `[data-conversation-scaffold]` (with a
   `background-clip: text` `@supports` guard); if either is renamed, the
   transcript's tool/activity lines revert to the app's flat ink. Read-only
   app-provided values also include `--dt-accent-foreground` and
   `--theme-bubble-seed`.
9. **Workspace layout contribution** (`src/lumen-layout.ts`) — the saved tree
   is validated by the app's `isLayoutNode` check. A future tree-format change
   can make the Lumen card disappear from the picker until the mirrored type
   and tree are refreshed. The tree intentionally references the hermes-bots
   panes; Hermes' normal missing-pane adoption handles machines without that
   plugin.
10. **Standard select sizing** (`src/styles/forms.css`) — menu alignment is
    app-owned now: the popper content pins `min-w-(--radix-select-trigger-width)`
    natively (`components/ui/select.tsx`). Lumen no longer forces an exact
    width — the old `!important` trio plus the `[data-radix-select-item-text]`
    two-line clamp are both gone (Radix 2.3.8 emits no such attribute, and
    max-width without a clamp clips long options). What remains is surface
    styling: elevated background, border, radius, shadow, item hover/focus
    tints. If menus visibly misbehave again, re-anchor on the app's own
    width mechanism rather than re-imposing the old forcing.
11. **Bots sidebar** (`src/styles/bots.css`) — anchors the vendored roster's
    own hooks: the pane root via its toolbar title row
    (`flex items-center justify-between gap-2 px-2.5 pt-2.5 pb-1.5`),
    `data-slot='bots-roster'`, and the `uppercase tracking-wider` class pair on
    the roster's section-heading buttons. Note the data-slot trap: Radix
    `asChild` triggers overwrite the row-button's own `data-slot`, so headings
    carry `tooltip-trigger` (Tip) and rows carry `context-menu-trigger`
    (bot rows also carry `data-roster-key`) — never style roster children by
    `data-slot='row-button'`. The search-field rules encode the toolbar row's
    utility chain and the `div:has(> input[type='text'])` SearchField wrapper.
    The group-chat room was redesigned upstream around a centered `max-w-3xl`
    log grid (`grid-cols-[minmax(0,1fr)] gap-0.5 py-4`) with message rows
    carrying `data-room-message`; the app itself paints user bodies with
    `--dt-user-bubble`, so Lumen no longer does. What remains room-side: the
    reply-in-thread link pill (log-grid child `button[data-variant='link']`,
    rendered by the room's reply affordance), the mention-textarea baseline
    fix, and the header hairline recolor (the room root's direct `header`
    child carrying `border-(--ui-stroke-secondary)`; the activity divider
    moved to the tertiary token and the composer grew its own
    `room-composer-surface`, so both stay native). Roster styling also reads
    `data-slot='bots-section'`, `data-slot='connection-glyph'`, heading child
    spans (`min-w-0 flex-1`, `tabular-nums`) and the roster typography size
    utilities. Symptom: the pane reverts to the darker zone chrome, or the
    heading pills, row outlines, search-field surface and scrollbar stop
    applying.
12. **Sessions section glyphs** (`src/behaviors/section-glyphs.ts` and
    `src/styles/sidebar.css`) — anchors the direct section pills under
    `[data-tour='sessions-sidebar'] [data-sessions-mode]`, the dither lead
    selected by `span:first-child > .dither` (the app's `SidebarPanelLabel`
    in `app/shell/sidebar-label.tsx`), and the app's localized section
    labels. Entered projects use `data-sessions-project` because their label
    is the user-defined project name rather than a translatable string. The
    behavior also assumes Hermes' app-wide codicon stylesheet and font remain
    available for the injected `codicon-*` element (imported in the app's
    `styles.css`).
    Symptom: section icons fall back to plain dither squares, or a renamed
    section receives the wrong glyph.

Stable-by-design anchors: `data-slot` component primitives
(`input`, `textarea`, `select-trigger`, `select-content`, `select-item`,
`dialog-content`, `badge`, `composer-surface`, `sidebar-content`,
`sidebar-group`, `profile-rail`, `profile-rail-rest-square`),
`data-sidebar='menu-button'`, the `data-hermes-*` skin attributes, and the
`data-room-message` / `data-roster-key` Bots hooks.

## Fragile selector inventory

| Surface                   | Stable anchor used by Lumen                                                                                      | Contained fallback                                                                                                                              | Failure symptom                                                                                                                             |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Kanban feed               | `data-slot='dialog-content'` and `badge`                                                                         | The modal width class and feed `FadeScroll` utilities identify the three tab panels; the header lozenge keeps its exact utility combo.          | Activity, Runs, or Worker log fill, run badge tint, or header lozenge reverts.                                                              |
| SegmentedControl          | None (`aria-pressed` buttons only)                                                                               | The track's unique `rounded-[5px]` utility identifies the component wherever it is used.                                                        | Active tab pills revert to native white/near-black on review scope tabs, the Kanban dialog, settings, Bots dialogs, and the command center. |
| Capabilities muted labels | None (no stable hook on the rebuilt pages)                                                                       | The exact `text-[0.68rem] font-normal text-muted-foreground/60` combo is unique to the two labels today.                                        | The small server/scope labels revert to washed-out native ink.                                                                              |
| Profile rail              | `data-slot='profile-rail'` and `data-slot='profile-rail-rest-square'`                                            | Drag handles have no individual hook; their utility predicate is contained under the rail root.                                                 | Rail control glyphs return to the app's muted treatment.                                                                                    |
| Bots group-chat room      | `data-room-message` rows (not styled — the app owns the bubble now); reply links via the log-grid chain          | The reply pill anchors the log grid's `grid-cols` + `gap-0.5` combo; the hairline recolor anchors the root's direct `header` child.             | Reply links revert to bare accent text; the header rule returns to full-strength secondary stroke.                                          |
| Bots pane                 | `data-slot='bots-roster'`, `bots-section`, `connection-glyph`, `data-roster-key`, and group-chat message content | Toolbar, heading typography, and group-chat log geometry retain their documented utility chains beneath the Bots roots.                         | Bot rows, headings, search, or group-chat spacing reverts.                                                                                  |
| Session rows              | `data-tour='sessions-sidebar'` and `data-row-actions`                                                            | Hermes exposes no semantic selected-row, title, or metadata hook, so the row state and title utility classes remain under the sessions sidebar. | Selected-row outline, title weight, or metadata contrast reverts.                                                                           |
| Sidebar search            | `data-tour='sessions-sidebar'` and the shared `SearchField` input (`type='text'`)                                | The wrapper is located by its exact depth under the sidebar content, in both the CSS and the JS twin.                                           | Search reverts to app chrome or loses click-to-focus.                                                                                       |

## Update checklist

1. Bump a dev install (`npm run dev`) against the new Hermes build.
2. Walk the surfaces in the order above: chat + composer, forms/dropdowns,
   sessions sidebar (search, sections, rows, rail, scrollbar), Bots sidebar
   (surface, headings, rows, search, scrollbar), one Bots group room (header
   hairline, reply pill, composer textarea), Kanban native task dialog,
   SegmentedControl tabs (review scope tabs incl. the narrow TabDropdown
   fallback, settings, Bots dialogs, command center), capabilities tabs,
   light **and** dark.
3. Check the mirror table for upstream contract changes and refresh the
   vendored types + built-ins fixture.
4. Update the "Validated against" line.
