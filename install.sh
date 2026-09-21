#!/usr/bin/env bash
set -euo pipefail

# Install Lumen into the Hermes Desktop plugin folder.
# - Piped from the web (curl -fsSL <raw url> | bash [-s -- --dir PATH]):
#   downloads the committed plugin.js and installs it directly — no checkout,
#   no build, no Node.
# - From a checkout: builds from source by default; flags: --no-build,
#   --dir PATH, -h/--help — see ./install.sh --help.

COLOR_ENABLED=0
if [ -t 1 ] && [ -z "${NO_COLOR:-}" ] && [ "${TERM:-dumb}" != "dumb" ] && command -v tput >/dev/null 2>&1; then
  TERM_COLORS="$(tput colors 2>/dev/null || printf '0')"
  if [ "$TERM_COLORS" -ge 8 ] 2>/dev/null; then
    COLOR_ENABLED=1
  fi
fi

if [ "$COLOR_ENABLED" -eq 1 ]; then
  RESET="$(tput sgr0)"
  BOLD="$(tput bold)"
  PURPLE="$(tput setaf 5)"
  SUCCESS="$(tput setaf 2)"
  if [ "$TERM_COLORS" -ge 16 ] 2>/dev/null; then
    LILAC="$(tput setaf 13)"
  else
    LILAC="${BOLD}${PURPLE}"
  fi
else
  RESET=''
  BOLD=''
  PURPLE=''
  LILAC=''
  SUCCESS=''
fi

EMOJI_ENABLED=0
case "${LUMEN_EMOJI:-auto}" in
  always)
    EMOJI_ENABLED=1
    ;;
  never)
    ;;
  auto | *)
    if [ "${LUMEN_EMOJI:-auto}" != "auto" ]; then
      printf 'warning: LUMEN_EMOJI must be auto, always, or never; using auto\n' >&2
    fi
    case "${TERM_PROGRAM:-}" in
      Apple_Terminal | Hyper | iTerm.app | vscode | WarpTerminal | WezTerm) EMOJI_ENABLED=1 ;;
    esac
    if [ -n "${ALACRITTY_LOG:-}" ] || [ -n "${GHOSTTY_RESOURCES_DIR:-}" ] || [ -n "${KITTY_WINDOW_ID:-}" ] || [ -n "${KONSOLE_VERSION:-}" ] || [ -n "${VTE_VERSION:-}" ] || [ -n "${WEZTERM_EXECUTABLE:-}" ] || [ -n "${WT_SESSION:-}" ]; then
      EMOJI_ENABLED=1
    fi
    ;;
esac

if [ "$EMOJI_ENABLED" -eq 1 ]; then
  MOON='🌙'
  STEP_MARK='⚡'
else
  MOON='☾'
  STEP_MARK='●'
fi

welcome_message() {
  printf '\n  %s%s%s  L U M E N%s\n' "$BOLD" "$PURPLE" "$MOON" "$RESET"
  printf '  %sA brighter, clearer Hermes Desktop experience%s\n\n' "$LILAC" "$RESET"
}

step_message() {
  printf '  %s%s%s %s\n' "$PURPLE" "$STEP_MARK" "$RESET" "$1"
}

done_message() {
  printf '\n  %s╭─%s %s%sLumen installed%s\n' "$PURPLE" "$RESET" "$BOLD" "$SUCCESS" "$RESET"
  printf '  %s│%s\n' "$PURPLE" "$RESET"
  printf '  %s│%s  %sPlugin%s  %s\n' "$PURPLE" "$RESET" "$LILAC" "$RESET" "$1"
  printf '  %s│%s\n' "$PURPLE" "$RESET"
  printf '  %s│%s  Choose %sLumen%s in the theme picker (Cmd/Ctrl-K, Appearance, or /skin).\n' "$PURPLE" "$RESET" "$BOLD" "$RESET"
  printf '  %s│%s  The Lumen workspace layout is ready in the layout picker.\n' "$PURPLE" "$RESET"
  printf '  %s│%s\n' "$PURPLE" "$RESET"
  printf '  %s╰─%s Set Appearance to System to follow OS light/dark mode.\n' "$PURPLE" "$RESET"
}

# Piped execution has no script file (BASH_SOURCE is empty): install the
# committed artifact directly.
if [ ! -f "${BASH_SOURCE[0]:-}" ]; then
  ARTIFACT_URL="${LUMEN_ARTIFACT_URL:-https://raw.githubusercontent.com/jrpbuilds/hermes-lumen-theme/v1.0.0/plugin.js}"
  INSTALL_DIR="${LUMEN_INSTALL_DIR:-}"

  while [ $# -gt 0 ]; do
    case "$1" in
      --dir)
        [ $# -ge 2 ] && [ -n "$2" ] || { printf 'error: --dir requires a non-empty path\n' >&2; exit 1; }
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

  welcome_message
  step_message 'Downloading plugin.js…'
  mkdir -p "$TARGET"
  TMP_FILE="$(mktemp "$TARGET/.plugin.js.XXXXXX")"
  if ! curl --fail --silent --show-error --location --retry 3 --retry-delay 1 \
    --connect-timeout 10 --max-time 120 "$ARTIFACT_URL" -o "$TMP_FILE"; then
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

  step_message 'Installing plugin…'
  chmod 0644 "$TMP_FILE"
  mv -f "$TMP_FILE" "$TARGET/plugin.js"
  done_message "$TARGET/plugin.js"
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
      [ $# -ge 2 ] && [ -n "$2" ] || { printf 'error: --dir requires a non-empty path\n' >&2; exit 1; }
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

if [ ! -f "$ROOT/package.json" ] || [ ! -d "$ROOT/src" ]; then
  printf 'error: checkout mode must run from the Lumen repository; pipe install.sh to bash for a standalone install\n' >&2
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  printf 'error: node is required but was not found on PATH\n' >&2
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  printf 'error: npm is required but was not found on PATH\n' >&2
  exit 1
fi

NODE_VERSION="$(node -p 'process.versions.node')"
if ! node -e 'const [major, minor, patch] = process.versions.node.split(".").map(Number); const supported = major > 22 || (major === 22 && (minor > 22 || (minor === 22 && patch >= 2))); process.exit(supported ? 0 : 1)'; then
  printf 'warning: node %s found; node >= 22.22.2 is expected\n' "$NODE_VERSION" >&2
fi

welcome_message

if [ "$NO_BUILD" -eq 0 ]; then
  if [ ! -x "$ROOT/node_modules/.bin/esbuild" ]; then
    step_message 'Installing development dependencies…'
    if [ -f "$ROOT/package-lock.json" ]; then
      (cd "$ROOT" && npm ci --no-fund --no-audit)
    else
      (cd "$ROOT" && npm install --no-fund --no-audit)
    fi
  fi

  step_message 'Building Lumen…'
  (cd "$ROOT" && LUMEN_INSTALLER=1 npm run --silent build)
else
  if [ ! -f "$ROOT/desktop/plugin.js" ]; then
    printf 'error: desktop/plugin.js not found — run without --no-build\n' >&2
    exit 1
  fi
fi

step_message 'Installing plugin…'
(cd "$ROOT" && node scripts/sync.mjs >/dev/null)

done_message "${LUMEN_INSTALL_DIR:-${HERMES_HOME:-$HOME/.hermes}/desktop-plugins/lumen}/plugin.js"
