# Development

Everything a maintainer needs that isn't user-facing. For what can break on
Hermes Desktop updates, see [COMPATIBILITY.md](./COMPATIBILITY.md).

## Prerequisites

- Node >= 22.22.2, npm (as pinned by `engines` in `package.json`)
- A Hermes Desktop install to test against (`~/.hermes` by default; override
  with `HERMES_HOME`)

## Install options

The README intentionally shows only the standard user install. The full
installer behaviour is documented here for maintainers and local development.

After a release tag is published, the piped `install.sh` downloads that
release's committed `desktop/plugin.js`
and installs it into `$HERMES_HOME/desktop-plugins/lumen` (or
`~/.hermes/desktop-plugins/lumen` when `HERMES_HOME` is unset). It needs only
`curl`, not Node or a checkout. Override the complete destination with either
`--dir PATH` or `LUMEN_INSTALL_DIR`:

```bash
curl -fsSL https://raw.githubusercontent.com/jrpbuilds/hermes-lumen-theme/main/install.sh | bash -s -- --dir PATH
curl -fsSL https://raw.githubusercontent.com/jrpbuilds/hermes-lumen-theme/main/install.sh | LUMEN_INSTALL_DIR=PATH bash
```

From a checkout, the same script builds and installs by default. It requires
Node >= 22.22.2; `--no-build` instead installs the committed artifact:

```bash
./install.sh
./install.sh --no-build
./install.sh --dir PATH
```

Hermes can install the unified package directly from GitHub:

```bash
hermes plugins install jrpbuilds/hermes-lumen-theme
```

That clone is placed under `~/.hermes/plugins/lumen`. Hermes Desktop copies its
`desktop/` half into the app-level plugin root and registers it after a restart.
Because Lumen is a custom source rather than a catalog entry, the CLI asks the
user to review and approve its security scan during installation. Noninteractive
automation must make that trust decision explicitly with `--force`.
Once the release-only `stable` branch is the repository default, update it
with `hermes plugins update lumen`. A managed install made while the default
branch was `main` must be reinstalled to switch update tracks.

The curl path remains a standalone fallback. A user moving from it to the
managed package must move `~/.hermes/desktop-plugins/lumen` aside first; a
marker-less standalone folder intentionally blocks package materialization.

## Getting started

```
npm install
npm run dev     # build --watch, synced into ~/.hermes/desktop-plugins/lumen
```

Hermes Desktop watches that file and hot-reloads the plugin on save, so
edits to `src/` appear in the running app within a couple of seconds.

## Project structure

| Path                    | What it is                                                                          |
| ----------------------- | ----------------------------------------------------------------------------------- |
| `src/plugin.ts`         | Entry: registers theme + layout, injects the clarity-layer stylesheet               |
| `src/theme.ts`          | The `DesktopTheme` contribution (palette selection + typography)                    |
| `src/palettes.ts`       | Light/dark color sets and terminal ANSI palettes — single source of truth for color |
| `src/lumen-layout.ts`   | The workspace layout tree contributed to the `layouts` area                         |
| `src/behaviors/`        | DOM behaviors (sidebar search focus and section glyph injection)                    |
| `src/styles/tokens.css` | Design tokens; every value scoped to `[data-hermes-theme='lumen']`                  |
| `src/styles/*.css`      | Per-surface clarity layer (sidebar, forms, kanban, …)                               |
| `src/types/`            | Vendored mirrors of the app's plugin/theme/layout contracts                         |
| `test/`                 | Vitest suites (see below)                                                           |
| `scripts/`              | build / sync / check-artifact plumbing                                              |

## Scripts

| Script           | What it does                                                              |
| ---------------- | ------------------------------------------------------------------------- |
| `./install.sh`   | Build + install in one step (see Install options above for flags)         |
| `npm run build`  | Bundle `src/` into the committed `desktop/plugin.js`                      |
| `npm run dev`    | `build --watch`, copying each build into the install dir                  |
| `npm run format` | Prettier-write the repo (artifact + lockfile are ignored)                 |
| `npm run sync`   | Copy the committed artifact into the install dir                          |
| `npm run check`  | format + lint + typecheck + tests + artifact-parity gate                  |
| `npm run test`   | Vitest (palette, layout, WCAG contrast, sidebar/Bots behaviors, artifact) |

## Why a committed build artifact

Hermes Desktop evaluates a desktop plugin as a single self-contained ES module
that may only import `@hermes/plugin-sdk` and `react*` — so multi-file sources
require bundling. Committing the built `desktop/plugin.js` means `hermes plugins
install` works straight from this repo with no build step on the consumer
side; `scripts/check-artifact.mjs` (run by `npm run check` and CI) fails if
the committed artifact drifts from `src/`.

## Checks and tests

`npm run check` runs the full gate used by CI:

- **format** — Prettier parity across the repo. `desktop/plugin.js` and
  `package-lock.json` are ignored (reformatting the artifact would break
  byte parity with esbuild's output).
- **lint** — ESLint with the Hermes workspace's shared rule set, so source
  style stays consistent with the app this plugin targets.
- **typecheck** — `tsc --noEmit` in strict mode against the vendored
  contracts in `src/types/`.
- **test** — ten Vitest suites:
    - `palettes.test.ts` — full-palette contract and no built-in-name collision
    - `contrast.test.ts` — WCAG floors for core and meta text in both modes
    - `lumen-layout.test.ts` — the layout tree satisfies the app's validator
    - `sidebar-search.test.ts` — the search focus behavior, under jsdom
    - `bots-sidebar.test.ts` — Bots pane selector contracts, under jsdom
    - `section-glyphs.test.ts` — localized sessions section glyphs, under jsdom
    - `plugin.test.ts` — entry-point registration and optional-layer containment
    - `build.test.ts` — sanity markers on the committed artifact
    - `theme-contracts.test.ts` — Lumen-only CSS scoping, representative
      sidebar/composer/Kanban/capabilities selector fixtures, and unreleased
      package/changelog version parity. This is a fast compatibility guard,
      not a rendered-pixel or real Hermes Desktop test.
    - `package.test.ts` — managed package manifest fields, version parity, and
      the required Desktop package half.
- **artifact parity** — the committed `desktop/plugin.js` must byte-match a fresh
  build; rebuild and re-commit after any `src/` change.

## Updating against a new Hermes Desktop

1. Bump a dev install (`npm run dev`) against the new Hermes build.
2. Walk the fragile-anchor checklist and surface order in
   [COMPATIBILITY.md](./COMPATIBILITY.md), light **and** dark.
3. Refresh the vendored type mirrors and the built-ins fixture if the app's
   contracts changed (see the mirror table there).
4. Update the "Validated against" line at the top of that doc.
