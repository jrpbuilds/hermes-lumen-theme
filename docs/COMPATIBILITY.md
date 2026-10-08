# Compatibility

Lumen themes the running app by _overriding_ it: a palette contribution plus a
CSS/behavior layer anchored on the app's own selectors and tokens. That means
Hermes Desktop updates can change the anchor points even when Lumen's code is
untouched. This file records what the current release was validated against
and where the fragile anchors are, so an app update has a concrete checklist.

**Core theme contracts validated against: Hermes Desktop v0.21.x** (hermes-agent `apps/desktop`). The native Kanban task dialog was inspected in local Hermes Agent source at commit `074349fb27`. The review pane's scope tabs moved to their own `scope-row.tsx` row (hermes-agent commit `b4bf19d814`, Oct 2026); Lumen's shared SegmentedControl rule was validated against both that DOM and the pre-move header DOM.

**Bots integration:** validated against the hermes-bots DOM installed alongside
that Desktop build; hermes-bots is separately versioned and is not vendored in
this repository.

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
- Hermes owns the Kanban board and centered task dialog. Its native dialog
  width is `min(62rem, 94vw)`; the shared 18px root scale makes that cap
  about 1116px. Lumen only colors the Activity, Runs, and Worker log feed
  surfaces and muted run badges; it does not change native dimensions.
- Theme typography uses the self-hosted Manrope faces embedded in the clarity
  layer and `fontSans` as the fallback stack; no font network request is needed.
  `fontMono` relies on the JetBrains Mono faces bundled by Hermes Desktop, then
  falls back to the local system mono stack.
- Layout presets are ordinary `area: 'layouts'` contributions. The Lumen card
  is filtered by the app's `isLayoutNode` validator and applied through the
  app's own `applyTree` / `markActivePreset` path when selected.

## Fragile anchors (re-verify after each app update)

Ordered roughly by breakage likelihood:

1. **Kanban feed accents** (`src/styles/kanban.css`) — the native task
   dialog has `data-slot='dialog-content'` but no Kanban-specific hook. Lumen
   identifies its unique `w-[min(62rem,94vw)]` class, then the feed
   section and `FadeScroll` utility classes. Only Activity, Runs, and
   Worker log have that scroll wrapper; Comments does not.
   The board header count lozenge anchors its exact utility combo
   (`rounded-full` + `bg-(--ui-bg-quaternary)` + `py-px` + `tabular-nums`),
   unique to it in the app today. If these hooks change, the inset fill,
   purple muted run badge, or purple lozenge reverts. Heights and scrolling
   remain app-owned. The dialog tabs' active pill moved to the shared
   SegmentedControl rule (item 2).
2. **SegmentedControl active pill** (`src/styles/segmented.css`) — the
   component exposes no `data-slot`, so the shared track anchors its unique
   `rounded-[5px]` utility (the only `rounded-[5px]` in the app today, in
   `apps/desktop/src/components/ui/segmented-control.tsx`), with options
   reached through its `aria-pressed` buttons. The same component backs the
   review scope tabs (`scope-row.tsx`), the Kanban task dialog tabs,
   settings pages, Bots dialogs, and the command center. If the track
   utility changes, active pills revert to the native white/near-black
   treatment on every SegmentedControl surface.
3. **Session rows** (`src/styles/sidebar.css`) — matches
   `.row-hover[class*='bg-(--ui-row-active-background)']`, the title hook
   `.hover-marquee`, and the escaped arbitrary-value classes
   `.text-(--ui-text-tertiary)` / quaternary. Symptom: selected row loses its
   accent rail/outline, title weight, or meta text contrast reverts.
4. **Sidebar search** (`src/styles/sidebar.css` +
   `src/behaviors/sidebar-search.ts`) — both encode the DOM shape
   `sidebar-content > div > div` holding a direct `input[type='text']`. They
   are structural twins and must change together. The flush-left search
   override additionally anchors the app's `px-2` utility on the search
   wrapper container (`apps/desktop/src/app/chat/sidebar/index.tsx`). Symptom:
   search field reverts to app chrome, click-to-focus stops working, or it no
   longer sits flush with the section content edges.
5. **Capabilities pages** (`src/styles/capabilities.css`) — anchors on
   `data-tour='tab-skills'` / `tab-toolsets` / `tab-connectors` / `tab-plugins` plus
   opacity-variant classes `text-muted-foreground/50…80` and `text-foreground/85`,
   and CodeMirror's `.cm-editor` internals. The scope divider (Skills,
   Toolsets and Connectors tabs) anchors `data-tour='tab-skills'` /
   `data-tour='tab-toolsets'` (stable tour anchors) and identifies the scope
   selector row by its `border-(--ui-stroke-secondary)` + `py-2` token pair
   and the tab content wrapper by the shell's content chain — the Plugins
   tab and single-profile setups render no scope row and are untouched, and
   the Connectors search divider (tertiary token) stays native. The scope
   row's own bottom border is softened to a quiet stroke (a `color-mix` of
   the secondary stroke toward transparent) and the divider gains air on
   both sides.
   Symptom: muted text readability fixes stop applying, the scope divider
   hugs the tab content again, or its line returns to the full-strength
   secondary stroke.
6. **Profile rail** (`src/styles/sidebar.css`) — matches grab-handle buttons
   by utility classes (`rounded-[3px]`, `text-[0.5625rem]`, `opacity-35`,
   `aria-pressed`). Symptom: rail glyphs revert to app colors.
7. **Sidebar divider geometry** (`src/styles/sidebar.css` +
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
   The section pill itself (same file) no longer paints an inset accent rail,
   and its trailing action cluster (the header's last child holding the "+"
   and filter-menu controls) is capped to the pill's 1.25rem content box via
   the app's `size-6` utility on those buttons. Symptom: icon-bearing headers
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
9. **Global scale** — `font-size: 18px !important` on the skin `:root` (app
   native root is 16px). All rem-based sizing in the app scales with it; if
   the app moves away from rem sizing for a surface, that surface stops
   scaling.
10. **Workspace layout contribution** (`src/lumen-layout.ts`) — the saved tree
    is validated by the app's `isLayoutNode` check. A future tree-format change
    can make the Lumen card disappear from the picker until the mirrored type
    and tree are refreshed. The tree intentionally references the optional
    `hermes-bots` panes; Hermes' normal missing-pane adoption handles machines
    without that plugin.
11. **Standard select sizing** (`src/styles/forms.css`) — ordinary Radix select
    menus use `--radix-select-trigger-width` and
    `[data-radix-select-item-text]` to stay aligned and clamp long options to
    two lines. If Hermes changes these Radix hooks, long options may widen again
    or lose their wrapping.
12. **Bots sidebar** (`src/styles/bots.css`) — anchors the hermes-bots roster's
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
    Kanban board shares the root chain but has no such children). Other room
    behavior anchors include the own-message fill class
    `bg-(--chrome-action-hover)`, reply links (`data-variant='link'`), the
    seated composer `form.grid`, its adjacent `div.group`, and message content
    marked `data-slot='group-chat-message-content'`. Roster styling also reads
    `data-slot='bots-section'`, `data-slot='connection-glyph'`, heading child
    spans (`min-w-0 flex-1`, `tabular-nums`) and the roster typography size
    utilities. These hooks belong to the separately versioned hermes-bots
    plugin and should be revalidated after either app/plugin update.
    Symptom: the pane reverts to the darker zone chrome, or the heading pills,
    row outlines, search-field surface and scrollbar stop applying.
13. **Sessions section glyphs** (`src/behaviors/section-glyphs.ts` and
    `src/styles/sidebar.css`) — anchors the direct section pills under
    `[data-tour='sessions-sidebar'] [data-sessions-mode]`, the dither lead
    selected by `span:first-child > .dither`, and the app's localized section
    labels. Entered projects use `data-sessions-project` because their label
    is the user-defined project name rather than a translatable string. The
    behavior also assumes Hermes' app-wide codicon stylesheet and font remain
    available for the injected `codicon-*` element.
    Symptom: section icons fall back to plain dither squares, or a renamed
    section receives the wrong glyph.

Stable-by-design anchors: `data-slot` component primitives
(`input`, `textarea`, `select-trigger`, `select-content`, `select-item`,
`dialog-content`, `badge`,
`composer-surface`, `sidebar-content`, `sidebar-group`),
`data-sidebar='menu-button'`, the `data-tour` tab anchors
(`tab-${id}` derived in `ResponsiveTabs`), and the `data-hermes-*` skin
attributes.

## Fragile selector inventory

| Surface                    | Stable anchor used by Lumen                                                                                                              | Contained fallback                                                                                                                                                       | Failure symptom                                                                                                                             |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Kanban feed                | `data-slot='dialog-content'` and `badge`                                                                                                 | The modal width class and feed `FadeScroll` utilities identify the three tab panels; the header lozenge keeps its exact utility combo.                                   | Activity, Runs, or Worker log fill, run badge tint, or header lozenge reverts.                                                              |
| SegmentedControl           | None (`aria-pressed` buttons only)                                                                                                       | The track's unique `rounded-[5px]` utility identifies the component wherever it is used.                                                                                 | Active tab pills revert to native white/near-black on review scope tabs, the Kanban dialog, settings, Bots dialogs, and the command center. |
| Bots pane                  | `data-slot='bots-roster'`, `bots-section`, `bots-section-heading`, `connection-glyph`, `data-roster-key`, and group-chat message content | Toolbar, heading typography, and group-chat log geometry retain their documented utility chains beneath the Bots roots.                                                  | Bot rows, headings, search, or group-chat spacing reverts.                                                                                  |
| Session rows               | `data-tour='sessions-sidebar'` and `data-row-actions`                                                                                    | Hermes exposes no semantic selected-row, title, or metadata hook, so the row state and title utility classes remain under the sessions sidebar.                          | Selected-row outline, title weight, or metadata contrast reverts.                                                                           |
| Capabilities scope divider | `data-tour='tab-skills'` / `data-tour='tab-toolsets'`                                                                                    | The scope selector row keeps its `border-(--ui-stroke-secondary)` + `py-2` token pair under the capabilities section; the shell's content chain locates the tab wrapper. | The divider's breathing room collapses, its soft stroke returns to full strength, and the tab content hugs the line again.                  |
| Profile rail               | `data-slot='profile-rail'`                                                                                                               | Drag and disabled square states have no individual hooks; their utility predicates are now contained under the profile-rail root.                                        | Rail control glyphs return to the app's muted treatment.                                                                                    |

## Update checklist

1. Bump a dev install (`npm run dev`) against the new Hermes build.
2. Walk the surfaces in the order above: chat + composer, forms/dropdowns,
   sessions sidebar (search, sections, rows, rail, scrollbar), Bots sidebar
   (surface, headings, rows, search, scrollbar), Kanban native task dialog,
   SegmentedControl tabs (review scope tabs, settings, Bots dialogs, command
   center), capabilities
   tabs, embedded picker, light **and** dark.
3. Check the mirror table for upstream contract changes and refresh the
   vendored types + built-ins fixture.
4. Update the "Validated against" line.
