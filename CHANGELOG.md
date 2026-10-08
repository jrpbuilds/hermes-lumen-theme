# Changelog

All notable Lumen releases are documented here.

## [1.3.0]

### Added

- Paint the raised active pill of every SegmentedControl tab group (review scope tabs, Kanban task dialog, settings pages, Bots dialogs, command center) in the theme purple, in light and dark.
- Equalize the sessions-sidebar section header pills: header action controls (the "+" and filter menu) are capped to the pill's content box so icon-bearing headers like Projects match the compact Pinned header height.

### Changed

- Retire the review scope-chip layer: Hermes Desktop moved the Review pane's scope tabs to their own row, so the old anchors went dark; the shared SegmentedControl rule now covers that pane.
- Drop the 2px accent rail from the sessions-sidebar section header pills.
- Give the capabilities scope divider breathing room on the Skills, Toolsets and Connectors tabs: the "Configuring:" row's divider keeps its place but no longer hugs the tab content — air on both sides, while the Connectors search divider stays put.
- Soften that same scope divider to a quiet stroke (a color-mix of the secondary stroke toward transparent) so the line above the Connectors, Skills and Toolsets content no longer reads as a heavy rule.

## [1.2.0]

### Changed

- Remove obsolete Kanban drawer styling and use Hermes Desktop’s native, large task dialog.
- Give the Activity, Runs and Worker log panels inset surfaces and muted run badges a purple tint, without changing their native heights.
- Paint the task dialog feed tabs’ active pill in the theme purple in dark mode.
- Restore the purple count lozenge on the Kanban board header in both modes.
- Extend the light-mode purple composer primary control to its Send and Stop states, so the streaming Stop button no longer stays black next to the purple voice button.

## [1.1.0]

### Added

- Unified Hermes package support for managed installation and stable-channel updates.

### Fixed

- Restore native sessions-sidebar glyphs when switching from Lumen to another theme.

## [1.0.0] - 2026-09-19

### Added

- High-contrast light and dark Hermes Desktop palettes with tuned terminal ANSI colors.
- Self-hosted Manrope variable-font subsets embedded in the single-file plugin artifact.
- Localized sessions-sidebar section glyphs across Hermes' shipped locales.
- Dynamic project glyphs for entered-project sessions views.
- Clarity-layer improvements across forms, sidebar search, Bots panels, group-chat rooms, Kanban, capabilities, and the workspace layout.

### Compatibility

- Validated against Hermes Desktop v0.21.x and the current hermes-bots DOM contracts.
- The committed `desktop/plugin.js` remains the consumer-facing artifact and is checked for byte parity in CI.
