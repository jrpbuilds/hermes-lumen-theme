# Compatibility

Lumen themes the running app by _overriding_ it: a palette contribution plus a
CSS/behavior layer anchored on the app's own selectors and tokens. That means
Hermes Desktop updates can change the anchor points even when Lumen's code is
untouched. This file records what the current release was validated against
and where the fragile anchors are, so an app update has a concrete checklist.

**Validated against: Hermes Desktop v0.21.x** (hermes-agent `apps/desktop`).

## Mirrored contracts (keep in sync)

| Vendored here                             | Mirrored from                                            | Notes                                            |
| ----------------------------------------- | -------------------------------------------------------- | ------------------------------------------------ |
| `src/types/desktop-theme.ts`              | `apps/desktop/src/themes/types.ts`                       | `DesktopTheme` / colors / terminal palette shape |
| `src/types/plugin-contract.ts`            | `apps/desktop/src/contrib/types.ts`, `contrib/plugin.ts` | `Contribution`, `PluginContext`, `HermesPlugin`  |
| `src/types/plugin-contract.ts`            | `apps/desktop/src/components/pane-shell/tree/model.ts`   | `LayoutNode` tree shape                          |
| `src/types/hermes-plugin-sdk.d.ts`        | `apps/desktop/src/sdk/index.ts`                          | only `THEMES_AREA` so far                        |
| `src/lumen-layout.ts`                     | `apps/desktop/src/components/pane-shell/tree/presets.ts` | `LAYOUTS_AREA` / layout contribution             |
| `test/palettes.test.ts` built-ins fixture | `apps/desktop/src/themes/presets.ts`                     | built-in slug list                               |

Runtime seams the build relies on:

- The loader evaluates `plugin.js` as one blob ESM module and rewrites only
  `@hermes/plugin-sdk` / `react*` import specifiers
  (`apps/desktop/src/contrib/runtime-loader.ts`).
- Theme data is validated by `isValidTheme` and painted by `applyTheme`, which
  writes the palette to `--theme-*` seeds / `--dt-*` vars inline on `:root`
  (`apps/desktop/src/themes/context.tsx`). The clarity layer references those
  vars, so palette edits in `src/palettes.ts` flow through automatically.
- The app stamps `data-hermes-theme` / `data-hermes-mode` on `:root`; every
  clarity-layer rule is scoped to those attributes.
- Theme typography loads the configured `fontUrl` once and uses `fontSans` as
  the fallback stack; if Google Fonts is unavailable, Manrope falls back to the
  local system and emoji fonts declared by Lumen.
- Layout presets are ordinary `area: 'layouts'` contributions. The Lumen card
  is filtered by the app's `isLayoutNode` validator and applied through the
  app's own `applyTree` / `markActivePreset` path when selected.

## Fragile anchors (re-verify after each app update)

Ordered roughly by breakage likelihood:

1. **Kanban drawer** (`src/styles/kanban.css`) — every rule anchors on the
   TaskDrawer's exact Tailwind utility chain
   `[class~='absolute'][class~='inset-y-0'][class~='right-0'][class~='z-20']`
   and descendants (`w-[26rem]`, `overscroll-contain`, `nth-child(2)`,
   `bg-(--ui-bg-quaternary)`, `data-selectable-text`). A utility rename here
   silently un-styles the drawer. Symptom: drawer back to 26rem, plain wells,
   default lozenges.
2. **Session rows** (`src/styles/sidebar.css`) — matches
   `.row-hover[class*='bg-(--ui-row-active-background)']`, the title hook
   `.hover-marquee`, and the escaped arbitrary-value classes
   `.text-(--ui-text-tertiary)` / quaternary. Symptom: selected row loses its
   accent rail/outline, title weight, or meta text contrast reverts.
3. **Sidebar search** (`src/styles/sidebar.css` +
   `src/behaviors/sidebar-search.ts`) — both encode the DOM shape
   `sidebar-content > div > div` holding a direct `input[type='text']`. They
   are structural twins and must change together. The flush-left search
   override additionally anchors the app's `px-2` utility on the search
   wrapper container (`apps/desktop/src/app/chat/sidebar/index.tsx`). Symptom:
   search field reverts to app chrome, click-to-focus stops working, or it no
   longer sits flush with the section content edges.
4. **Capabilities pages** (`src/styles/capabilities.css`) — anchors on
   `data-tour='tab-skills'` / `tab-toolsets` / `tab-mcp` / `tab-plugins` plus
   opacity-variant classes `text-muted-foreground/50…80` and `text-foreground/85`,
   and CodeMirror's `.cm-editor` internals. Symptom: muted text readability
   fixes stop applying.
5. **Profile rail** (`src/styles/sidebar.css`) — matches grab-handle buttons
   by utility classes (`rounded-[3px]`, `text-[0.5625rem]`, `opacity-35`,
   `aria-pressed`). Symptom: rail glyphs revert to app colors.
6. **Sidebar divider geometry** (`src/styles/sidebar.css` +
   `--lumen-sidebar-scrollbar-width` in `tokens.css`) — the hairline above the
   search field is inset on the right by the sessions scroller's stable
   scrollbar gutter so it spans the same box as the section border-tops below
   the search field. That holds only while the app keeps
   `[scrollbar-gutter:stable]` on `[data-sessions-mode]`
   (`apps/desktop/src/app/chat/sidebar/index.tsx`) and the styled scrollbar
   width matches the variable. Symptom: the two hairlines drift apart again.
   Section spacing is also symmetric around each divider by construction: it
   relies on the app's `SidebarGroup` `p-2` (overridden), the header pill's
   `SidebarSectionHeader` wrapper, and group content being rendered only while
   a section is open. If the app changes the group padding or starts rendering
   content unconditionally, the pill-to-divider gaps go asymmetric again.
7. **App token overrides** (`src/styles/tokens.css`) — pins
   `--ui-text-*`, `--ui-stroke-*`, `--ui-bg-*`, `--ui-row-*`/`--ui-control-*`,
   `--ui-selection-background`, `--ui-inline-code-*`, `--stroke-nous`,
   `--conversation-scaffold-*`, `--chrome-action-hover`, and the
   `--dt-input-border`/`--dt-input-bg`/`--dt-input-inset` knobs (percentages
   consumed by `color-mix` in the app's `styles.css`). These are internal
   app tokens — a token rename makes an override inert (harmless) but should
   be cleaned up. The scaffold gradient (`src/styles/conversation.css`)
   additionally anchors the app's `.text-(--conversation-scaffold-text)`
   utility class under `[data-conversation-scaffold]` (with a
   `background-clip: text` `@supports` guard); if either is renamed, the
   transcript's tool/activity lines revert to the app's flat ink.
8. **Global scale** — `font-size: 18px !important` on the skin `:root` (app
   native root is 16px). All rem-based sizing in the app scales with it; if
   the app moves away from rem sizing for a surface, that surface stops
   scaling.
9. **Workspace layout contribution** (`src/lumen-layout.ts`) — the saved tree
   is validated by the app's `isLayoutNode` check. A future tree-format change
   can make the Lumen card disappear from the picker until the mirrored type
   and tree are refreshed. The tree intentionally references the optional
   `hermes-bots` panes; Hermes' normal missing-pane adoption handles machines
   without that plugin.
10. **Standard select sizing** (`src/styles/forms.css`) — ordinary Radix select
    menus use `--radix-select-trigger-width` and
    `[data-radix-select-item-text]` to stay aligned and clamp long options to
    two lines. If Hermes changes these Radix hooks, long options may widen again
    or lose their wrapping.
11. **Bots sidebar** (`src/styles/bots.css`) — anchors the hermes-bots roster's
    own hooks: the pane root via its toolbar title row
    (`flex items-center justify-between gap-2 px-2.5 pt-2.5 pb-1.5`),
    `data-slot='bots-roster'`, and the `uppercase tracking-wider` class pair on
    the roster's section-heading buttons. Note the data-slot trap: Radix
    `asChild` triggers overwrite the row-button's own `data-slot`, so headings
    carry `tooltip-trigger` (Tip) and rows carry `context-menu-trigger`
    (bot rows also carry `data-roster-key`) — never style roster children by
    `data-slot='row-button'`. The search-field rules encode the toolbar row's
    utility chain and the `div:has(> input[type='text'])` SearchField wrapper.
    The group-chat room rules anchor the workspace root's
    `relative flex h-full flex-col` chain plus the log grid's
    `grid-cols-[minmax(0,1fr)] gap-1.5 px-2.5 pb-2` utility combo; the room
    hairline recolor assumes only the room's own structural borders are direct
    children of that root carrying `border-(--ui-stroke-secondary)` (the
    Kanban board shares the root chain but has no such children).
    Symptom: the pane reverts to the darker zone chrome, or the heading pills,
    row outlines, search-field surface and scrollbar stop applying.
12. **Sessions section glyphs** (`src/behaviors/section-glyphs.ts` and
    `src/styles/sidebar.css`) — anchors the direct section pills under
    `[data-tour='sessions-sidebar'] [data-sessions-mode]`, the dither lead
    selected by `span:first-child > .dither`, and the app's localized section
    labels. Entered projects use `data-sessions-project` because their label
    is the user-defined project name rather than a translatable string.
    Symptom: section icons fall back to plain dither squares, or a renamed
    section receives the wrong glyph.

Stable-by-design anchors: `data-slot` component primitives
(`input`, `textarea`, `select-trigger`, `select-content`, `select-item`,
`composer-surface`, `sidebar-content`, `sidebar-group`, `badge`),
`data-sidebar='menu-button'`, and the `data-hermes-*` skin attributes.

## Update checklist

1. Bump a dev install (`npm run dev`) against the new Hermes build.
2. Walk the surfaces in the order above: chat + composer, forms/dropdowns,
   sessions sidebar (search, sections, rows, rail, scrollbar), Bots sidebar
   (surface, headings, rows, search, scrollbar), Kanban drawer, capabilities
   tabs, embedded picker, light **and** dark.
3. Check the mirror table for upstream contract changes and refresh the
   vendored types + built-ins fixture.
4. Update the "Validated against" line.
