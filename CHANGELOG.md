# Changelog

All notable Lumen releases are documented here.

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
