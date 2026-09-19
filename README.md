# Lumen

<div align="center">

<img src="https://raw.githubusercontent.com/jrpbuilds/hermes-lumen-theme/main/docs/lumen-banner.webp" alt="Lumen" width="100%">

**A brighter, clearer, more spacious theme for [Hermes Desktop](https://github.com/NousResearch/hermes-agent).**

[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/jrpbuilds/hermes-lumen-theme/ci.yml?branch=main&label=CI)](https://github.com/jrpbuilds/hermes-lumen-theme/actions/workflows/ci.yml)
[![Hermes Desktop](https://img.shields.io/badge/Hermes%20Desktop-theme-6558D9)](https://github.com/NousResearch/hermes-agent)
[![Manrope](https://img.shields.io/badge/typography-Manrope-444)](https://fonts.google.com/specimen/Manrope)

</div>

High-contrast light and dark palettes, a tuned integrated-terminal ANSI set,
and a "clarity layer" that sharpens forms, the sessions sidebar, the composer,
the Kanban drawer and the capabilities pages. It also ships a Lumen workspace
layout for the app's layout picker.

> Built and tested against Hermes Desktop **v0.21.x** — see
> [COMPATIBILITY.md](./docs/COMPATIBILITY.md) for what that covers and what can
> break on app updates.

## Install

One command — build from source and install into `~/.hermes/desktop-plugins/lumen/`:

```
./install.sh             # build + install
./install.sh --no-build  # install the committed plugin.js as-is
./install.sh --dir PATH  # custom install location
```

It respects `HERMES_HOME` (defaults to `~/.hermes`) and needs Node >= 22.22.2.

Alternatively, from the Hermes Desktop plugin catalog UI, or:

```
hermes plugins install jrpbuilds/hermes-lumen-theme
```

Then pick **Lumen** in the theme picker (Cmd/Ctrl-K → theme, Appearance settings,
or `/skin`). The clarity layer activates automatically whenever the Lumen skin
is active and stays inert otherwise. The bundled Lumen workspace layout is
available in the layout picker when you want to apply it.

## What it changes

- **Palette** — hand-tuned light and dark color sets (no synthesized variants)
  with hand-tuned ANSI palettes for the integrated terminal.
- **Clarity layer** — CSS overrides scoped to `[data-hermes-theme='lumen']`:
  - readable default type scale (18px root) and strengthened form-field
    borders
  - Manrope as the main UI font, with local system and emoji fallbacks
  - sharpened text/stroke hierarchies (`--ui-text-*`, `--ui-stroke-*`,
    `--ui-bg-*`)
  - restyled sidebar search, section tints, session-row selection states
  - a wider Kanban task drawer (26rem → 39rem, viewport-guarded) with padded
    scroll wells and restyled dependency/status lozenges
  - readable muted text on the capabilities pages
  - standard dropdowns that match their trigger width and wrap long options to
    two lines
  - accent-tinted focus rings and slim overlay scrollbars
- **Behavior** — the whole painted sidebar-search rectangle is clickable and
  focuses the input (not just the field itself).
- **Workspace layout** — a Lumen layout template is available in the layout
  picker, including the saved sessions, terminal, workspace, files and review
  arrangement.

<p align="center">
  <img
    src="https://raw.githubusercontent.com/jrpbuilds/hermes-lumen-theme/main/docs/screenshot.webp"
    alt="Lumen running in Hermes Desktop"
    width="800"
  />
</p>

## Development

```
npm install
npm run dev     # build --watch, synced into ~/.hermes/desktop-plugins/lumen
```

Hermes Desktop hot-reloads the plugin on save, so edits to `src/` appear in
the running app within a couple of seconds. For the project map, the full
script table, the test suite, and the committed-artifact policy, see
[docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md); for what can break on Hermes
Desktop updates, see [docs/COMPATIBILITY.md](./docs/COMPATIBILITY.md).

## License

MIT — see [LICENSE](./LICENSE) and [THIRD_PARTY_NOTICES.md](./docs/THIRD_PARTY_NOTICES.md).
