#!/usr/bin/env bash
set -euo pipefail

# Build Lumen from source and install it into the Hermes Desktop plugin folder.
# Flags: --no-build, --dir PATH, -h/--help — see ./install.sh --help.

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

usage() {
  printf 'Usage: install.sh [--no-build] [--dir PATH] [-h|--help]\n\n'
  printf 'Build Lumen from source and install it into the Hermes Desktop plugin folder.\n'
  printf 'Install target: $HERMES_HOME/desktop-plugins/lumen (HERMES_HOME defaults to\n'
  printf '~/.hermes). A --dir flag or LUMEN_INSTALL_DIR env var overrides the full path.\n\n'
  printf '  --no-build   install the committed plugin.js as-is\n'
  printf '  --dir PATH   install into PATH instead of the default target\n'
}

NO_BUILD=0
while [ $# -gt 0 ]; do
  case "$1" in
    --no-build)
      NO_BUILD=1
      ;;
    --dir)
      [ $# -ge 2 ] || { printf 'error: --dir requires a path\n' >&2; exit 1; }
      export LUMEN_INSTALL_DIR="$2"
      shift
      ;;
    -h | --help)
      usage
      exit 0
      ;;
    *)
      printf 'error: unknown flag: %s (try --help)\n' "$1" >&2
      exit 1
      ;;
  esac
  shift
done

if ! command -v node >/dev/null 2>&1; then
  printf 'error: node is required but was not found on PATH\n' >&2
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  printf 'error: npm is required but was not found on PATH\n' >&2
  exit 1
fi

NODE_VERSION="$(node -p 'process.versions.node')"
if [ "$(printf '%s\n22.22.2\n' "$NODE_VERSION" | sort -V | head -1)" != "22.22.2" ]; then
  printf 'warning: node %s found; node >= 22.22.2 is expected\n' "$NODE_VERSION" >&2
fi

if [ "$NO_BUILD" -eq 0 ]; then
  if [ ! -x "$ROOT/node_modules/.bin/esbuild" ]; then
    printf '[lumen] installing dev dependencies...\n'
    if [ -f "$ROOT/package-lock.json" ]; then
      (cd "$ROOT" && npm ci --no-fund --no-audit)
    else
      (cd "$ROOT" && npm install --no-fund --no-audit)
    fi
  fi

  printf '[lumen] building...\n'
  (cd "$ROOT" && npm run --silent build)
else
  if [ ! -f "$ROOT/plugin.js" ]; then
    printf 'error: plugin.js not found — run without --no-build\n' >&2
    exit 1
  fi
fi

printf '[lumen] installing...\n'
(cd "$ROOT" && node scripts/sync.mjs)

printf 'Done. Choose Lumen in the theme picker (Cmd/Ctrl-K, Appearance, or /skin) if not already active;\n'
printf 'the Lumen workspace layout is available in the layout picker. The desktop hot-reloads this file on change.\n'
printf 'Set appearance mode to System to follow your\n'
printf 'OS light/dark setting.\n'
