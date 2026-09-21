# Lumen

<div align="center">

<a href="https://www.jrpbuilds.co.uk/projects/lumen/"><img src="https://raw.githubusercontent.com/jrpbuilds/hermes-lumen-theme/main/docs/lumen-banner.webp" alt="Lumen" width="100%"></a>

**A brighter, clearer, more spacious theme for [Hermes Desktop](https://github.com/NousResearch/hermes-agent).**

[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/jrpbuilds/hermes-lumen-theme/ci.yml?branch=main&label=CI)](https://github.com/jrpbuilds/hermes-lumen-theme/actions/workflows/ci.yml)
[![Hermes Desktop](https://img.shields.io/badge/Hermes%20Desktop-theme-6558D9)](https://github.com/NousResearch/hermes-agent)
[![Manrope](<https://img.shields.io/badge/typography-Manrope%20(self--hosted)-444>)](https://fonts.google.com/specimen/Manrope)

</div>

Lumen makes Hermes Desktop easier to scan: clearer surfaces, readable controls
and thoughtfully tuned light and dark palettes, without changing how Hermes
works.

> Built and tested against Hermes Desktop **v0.21.x** — see
> [COMPATIBILITY.md](./docs/COMPATIBILITY.md) for what that covers and what can
> break on app updates.

## Install

Install the managed Hermes package:

```bash
hermes plugins install jrpbuilds/hermes-lumen-theme
```

Lumen is not in the Hermes catalog, so Hermes will ask you to review and
approve its security scan before installing this custom source.

After a future release, update it with:

```bash
hermes plugins update lumen
```

Then restart Hermes Desktop so it loads the updated Desktop package half.

The curl installer remains a standalone fallback. It will be repointed to the
versioned 1.1.0 artifact immediately after this release is tagged:

```bash
curl -fsSL https://raw.githubusercontent.com/jrpbuilds/hermes-lumen-theme/main/install.sh | bash
```

> **Migrating from curl?** Move the old standalone plugin aside before your
> first managed install, then restart Hermes Desktop:
>
> ```bash
> mv ~/.hermes/desktop-plugins/lumen ~/.hermes/desktop-plugins/lumen.legacy
> ```
>
> Hermes will not overwrite that folder automatically, so it can preserve a
> user's standalone plugin installation.

Managed Lumen installs use the release-only `stable` branch. If you installed
an earlier managed copy while it tracked `main`, reinstall it after the
repository default changes so later `hermes plugins update lumen` commands
stay on the stable channel.

Then pick **Lumen** in the theme picker (Cmd/Ctrl-K → theme, Appearance settings,
or `/skin`). The clarity layer activates automatically whenever the Lumen skin
is active and stays inert otherwise. You can also choose the bundled Lumen
workspace layout in the layout picker.

## What it changes

- **Clearer visual hierarchy** — tuned palettes, terminal ANSI colours,
  stronger text contrast and a readable 18px type scale.
- **Better dense-work surfaces** — refined sessions and Bots panels, sidebar
  search, controls, capability pages, Kanban task drawer and worker logs.
- **Useful interaction polish** — visible focus states, better dropdowns and a
  full clickable area for sidebar search.
- **A ready-to-use workspace** — a Lumen layout in the layout picker for
  sessions, terminal, workspace, files and review.

<p align="center">
  <img
    src="https://www.jrpbuilds.co.uk/images/projects/lumen/screenshots/bot-session-dark.webp"
    alt="Lumen Bots view in Hermes Desktop"
    width="49%"
  />
  <img
    src="https://www.jrpbuilds.co.uk/images/projects/lumen/screenshots/kanban-dark.webp"
    alt="Lumen Kanban board in Hermes Desktop"
    width="49%"
  />
</p>

See [more screenshots on the Lumen website](https://www.jrpbuilds.co.uk/projects/lumen/#screenshots).

## License

MIT — see [LICENSE](./LICENSE) and [THIRD_PARTY_NOTICES.md](./docs/THIRD_PARTY_NOTICES.md).
