#!/usr/bin/env bash
set -euo pipefail

# Install Lumen into the Hermes Desktop plugin folder.
# - Piped from the web (curl -fsSL <raw url> | bash [-s -- --dir PATH]):
#   downloads the committed plugin.js and installs it directly — no checkout,
#   no build, no Node.
# - From a checkout: builds from source by default; flags: --no-build,
#   --dir PATH, -h/--help — see ./install.sh --help.

done_message() {
  printf 'Done. Choose Lumen in the theme picker (Cmd/Ctrl-K, Appearance, or /skin) if not already active;\n'
  printf 'the Lumen workspace layout is available in the layout picker. The desktop hot-reloads this file on change.\n'
  printf 'Set appearance mode to System to follow your\n'
  printf 'OS light/dark setting.\n'
}

# Piped execution has no script file (BASH_SOURCE is empty): install the
# committed artifact directly.
if [ ! -f "${BASH_SOURCE[0]:-}" ]; then
  ARTIFACT_URL="https://raw.githubusercontent.com/jrpbuilds/hermes-lumen-theme/main/plugin.js"
  INSTALL_DIR=""

  while [ $# -gt 0 ]; do
    case "$1" in
      --dir)
        [ $# -ge 2 ] || { printf 'error: --dir requires a path\n' >&2; exit 1; }
        INSTALL_DIR="$2"
        shift
        ;;
      --no-build) ;; # a piped install never builds; accepted for symmetry
      -h | --help)
        printf 'Usage: curl -fsSL <raw install.sh url> | bash [-s -- [--dir PATH]]\n\n'
        printf 'Downloads the committed plugin.js and installs it into\n'
        printf '$HERMES_HOME/desktop-plugins/lumen (HERMES_HOME defaults to ~/.hermes).\n'
        printf 'A --dir flag overrides the full path.\n'
        exit 0
        ;;
      *)
        printf 'error: unknown flag: %s (try --help)\n' "$1" >&2
        exit 1
        ;;
    esac
    shift
  done

  if ! command -v curl >/dev/null 2>&1; then
    printf 'error: curl is required but was not found on PATH\n' >&2
    exit 1
  fi

  if [ -n "$INSTALL_DIR" ]; then
    TARGET="$INSTALL_DIR"
  else
    TARGET="${HERMES_HOME:-$HOME/.hermes}/desktop-plugins/lumen"
  fi

  printf '[lumen] downloading plugin.js...\n'
  TMP_FILE="$(mktemp)"
  if ! curl --fail --silent --show-error --location "$ARTIFACT_URL" -o "$TMP_FILE"; then
    rm -f "$TMP_FILE"
    printf 'error: download failed\n' >&2
    exit 1
  fi

  # The artifact self-identifies; reject error pages and truncated downloads.
  if ! grep -q "data-hermes-theme" "$TMP_FILE"; then
    rm -f "$TMP_FILE"
    printf 'error: downloaded file does not look like the Lumen plugin\n' >&2
    exit 1
  fi

  mkdir -p "$TARGET"
  mv "$TMP_FILE" "$TARGET/plugin.js"
  printf '[lumen] installed %s\n' "$TARGET/plugin.js"
  done_message
  exit 0
fi

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

done_message
