# Changelog

All notable Lumen releases are documented here.

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
