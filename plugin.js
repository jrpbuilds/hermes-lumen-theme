/*!
 * Lumen — a brighter, clearer, more spacious theme for Hermes Desktop.
 *
 * Generated artifact — built from src/ by scripts/build.mjs. Do not edit.
 * The committed plugin.js must match a fresh `npm run build`;
 * scripts/check-artifact.mjs guards this.
 *
 * SPDX-License-Identifier: MIT
 *
 * Theme registration and a small number of Hermes-specific contrast fixes
 * were informed by Minimalist Themes for Hermes by Miguel Euraque (MIT):
 * https://github.com/mykeura/minimalist-themes-for-hermes
 */


// src/plugin.ts
import { THEMES_AREA } from "@hermes/plugin-sdk";

// src/behaviors/sidebar-search.ts
var SIDEBAR_SELECTOR = "[data-tour='sessions-sidebar']";
function isSearchWrapper(node, sidebar) {
  if (node.tagName !== "DIV") {
    return false;
  }
  const outer = node.parentElement;
  if (!outer || outer.tagName !== "DIV") {
    return false;
  }
  const content = outer.parentElement;
  return content?.getAttribute("data-slot") === "sidebar-content" && content.parentElement === sidebar;
}
function findSearchInput(target) {
  if (!(target instanceof Element)) {
    return null;
  }
  if (target.closest('input, button, a, [role="button"]')) {
    return null;
  }
  const sidebar = target.closest(SIDEBAR_SELECTOR);
  if (!sidebar) {
    return null;
  }
  let node = target;
  while (node && node !== sidebar) {
    if (isSearchWrapper(node, sidebar)) {
      const input = node.querySelector(':scope > input[type="text"]');
      if (input instanceof HTMLInputElement) {
        return input;
      }
    }
    node = node.parentElement;
  }
  return null;
}
function installSidebarSearchFocus(ctx) {
  if (typeof document === "undefined") {
    return;
  }
  const handlePointerDown = (event) => {
    const input = findSearchInput(event.target);
    if (!input) {
      return;
    }
    event.preventDefault();
    input.focus();
  };
  document.addEventListener("pointerdown", handlePointerDown);
  ctx.onDispose(() => {
    document.removeEventListener("pointerdown", handlePointerDown);
  });
}

// src/lumen-layout.ts
var LAYOUTS_AREA = "layouts";
var LUMEN_LAYOUT_ID = "lumen-layout";
var lumenLayout = {
  type: "split",
  id: "s-mu6n5hwr-9",
  orientation: "row",
  children: [
    {
      type: "group",
      id: "g-mu6n5hwr-6",
      panes: ["sessions", "hermes-bots:pane", "hermes-bots:routines"],
      active: "sessions"
    },
    {
      type: "split",
      id: "s-mu6ow7bj-q",
      orientation: "column",
      children: [
        {
          type: "group",
          id: "g-mu6ow7bj-p",
          panes: ["terminal"],
          active: "terminal",
          minimized: true
        },
        {
          type: "group",
          id: "g-mu6n5hwr-7",
          panes: ["workspace", "plugin-workspace:hermes-bots:group:orchestrator-researcher-reviewer"],
          active: "workspace"
        }
      ],
      weights: [1, 1.5322690217391304]
    },
    {
      type: "group",
      id: "g-mu6n5hwr-8",
      panes: ["files", "review"],
      active: "files"
    }
  ],
  weights: [1, 3.2, 1.2]
};
var layoutContribution = {
  id: LUMEN_LAYOUT_ID,
  area: LAYOUTS_AREA,
  title: "Lumen",
  data: lumenLayout
};

// src/styles/capabilities.css
var capabilities_default = "/*\n * Lumen clarity layer \u2014 capabilities surfaces (Skills / Toolsets / MCP /\n * Plugins tabs) and embedded capability pickers.\n *\n * The tab group is located structurally via `data-tour` attributes; text\n * contrast fixes target Tailwind opacity-variant utility classes, which are\n * FRAGILE (see docs/COMPATIBILITY.md).\n */\n\n/*\n * Scope: the one section whose tab bar carries the capability tabs. All\n * `:has()` predicates compound on the section itself, so the rules apply to\n * every descendant regardless of the app's internal nesting depth under it.\n */\n:root[data-hermes-theme='lumen']\n  section:has([data-tour='tab-skills']):has([data-tour='tab-toolsets']):has([data-tour='tab-mcp']):has(\n    [data-tour='tab-plugins']\n  )\n  :is(\n    [class~='text-muted-foreground/50'],\n    [class~='text-muted-foreground/60'],\n    [class~='text-muted-foreground/70'],\n    [class~='text-muted-foreground/80']\n  ) {\n  color: var(--lumen-capabilities-readable-text) !important;\n}\n\n:root[data-hermes-theme='lumen']\n  section:has([data-tour='tab-skills']):has([data-tour='tab-toolsets']):has([data-tour='tab-mcp']):has(\n    [data-tour='tab-plugins']\n  )\n  [class~='text-foreground/85'] {\n  color: var(--ui-text-primary) !important;\n}\n\n:root[data-hermes-theme='lumen']\n  section:has([data-tour='tab-skills']):has([data-tour='tab-toolsets']):has([data-tour='tab-mcp']):has(\n    [data-tour='tab-plugins']\n  )\n  .cm-editor\n  :is(.cm-content, .cm-content span) {\n  color: var(--ui-text-primary) !important;\n}\n\n:root[data-hermes-theme='lumen']\n  section:has([data-tour='tab-skills']):has([data-tour='tab-toolsets']):has([data-tour='tab-mcp']):has(\n    [data-tour='tab-plugins']\n  )\n  .cm-editor\n  .cm-gutters {\n  color: var(--lumen-capabilities-readable-text) !important;\n}\n\n/* ==========================================================================\n   Embedded capability picker\n   ========================================================================== */\n\n/*\n * The picker keeps the three tab anchors it was validated with (no\n * toolsets); same compound-on-the-section scoping as above.\n */\n:root[data-hermes-theme='lumen']\n  section:has([data-tour='tab-skills']):has([data-tour='tab-mcp']):has([data-tour='tab-plugins'])\n  div:has(> iframe[src*='embed=picker']),\n:root[data-hermes-theme='lumen']\n  section:has([data-tour='tab-skills']):has([data-tour='tab-mcp']):has([data-tour='tab-plugins'])\n  iframe[src*='embed=picker'] {\n  background: var(--lumen-embed-background) !important;\n  color-scheme: dark;\n}\n";

// src/styles/composer.css
var composer_default = "/*\n * Lumen clarity layer \u2014 composer surface.\n */\n\n:root[data-hermes-theme='lumen'] [data-slot='composer-surface'] {\n  background: color-mix(in srgb, var(--ui-bg-input) 94%, var(--ui-bg-editor));\n  border-color: var(--ui-stroke-secondary) !important;\n  border-top-color: color-mix(in srgb, var(--ui-stroke-secondary) 88%, transparent) !important;\n  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ui-stroke-secondary) 70%, transparent);\n  transition:\n    border-color 120ms ease,\n    box-shadow 120ms ease,\n    background-color 120ms ease;\n}\n\n:root[data-hermes-theme='lumen'] [data-slot='composer-surface']:focus-within {\n  box-shadow:\n    inset 0 0 0 1px color-mix(in srgb, var(--lumen-accent) 58%, transparent),\n    0 0 0 1px color-mix(in srgb, var(--lumen-accent) 22%, transparent);\n}\n";

// src/styles/conversation.css
var conversation_default = "/*\n * Lumen clarity layer \u2014 transcript scaffolding.\n *\n * Tool summaries and activity lines are secondary UI, not prose. A restrained\n * brand gradient gives them a little presence without turning every message\n * into a coloured block.\n */\n\n:root[data-hermes-theme='lumen'] [data-conversation-scaffold] .text-\\(--conversation-scaffold-text\\) {\n  color: var(--conversation-scaffold-text);\n}\n\n@supports ((-webkit-background-clip: text) or (background-clip: text)) {\n  :root[data-hermes-theme='lumen'] [data-conversation-scaffold] .text-\\(--conversation-scaffold-text\\) {\n    background-image: var(--lumen-scaffold-gradient);\n    background-clip: text;\n    -webkit-background-clip: text;\n    color: transparent;\n    -webkit-text-fill-color: transparent;\n  }\n}\n";

// src/styles/focus.css
var focus_default = "/*\n * Lumen clarity layer \u2014 focus visibility.\n */\n\n:root[data-hermes-theme='lumen']\n  :is(input, textarea, button, [contenteditable='true'], [role='button'], [role='option']):focus-visible {\n  outline-color: var(--lumen-accent);\n}\n";

// src/styles/forms.css
var forms_default = "/*\n * Lumen clarity layer \u2014 global form controls and dropdown menus.\n *\n * These selectors target the app's shadcn-style `data-slot` primitives and the\n * `.desktop-input-chrome` class. They are stable component API relative to the\n * utility-class selectors used elsewhere (see docs/COMPATIBILITY.md).\n */\n\n:root[data-hermes-theme='lumen']\n  :is(\n    .desktop-input-chrome,\n    [data-slot='input-group'],\n    [data-slot='input'],\n    [data-slot='textarea'],\n    [data-slot='select-trigger']\n  ) {\n  background: var(--lumen-field-surface) !important;\n  border: 1px solid var(--lumen-field-border) !important;\n  border-radius: 0.375rem !important;\n  color: var(--ui-text-primary) !important;\n  box-shadow: none !important;\n  transition:\n    background-color 120ms ease,\n    border-color 120ms ease,\n    box-shadow 120ms ease;\n}\n\n:root[data-hermes-theme='lumen']\n  :is(\n    input:not([type='checkbox'])\n      :not([type='radio'])\n      :not([type='range'])\n      :not([type='color'])\n      :not([type='file'])\n      :not([type='hidden'])\n      :not([type='button'])\n      :not([type='submit'])\n      :not([type='reset'])\n      :not([type='image']),\n    textarea,\n    select\n  ) {\n  background-color: var(--lumen-field-surface);\n  border-color: var(--lumen-field-border);\n  color: var(--ui-text-primary);\n}\n\n:root[data-hermes-theme='lumen']\n  :is(\n    .desktop-input-chrome,\n    [data-slot='input-group'],\n    [data-slot='input'],\n    [data-slot='textarea'],\n    [data-slot='select-trigger']\n  ):hover:not(:focus):not(:focus-within):not([data-state='open']) {\n  background: var(--lumen-field-hover-surface) !important;\n  border-color: var(--lumen-field-hover-border) !important;\n}\n\n:root[data-hermes-theme='lumen']\n  :is(\n    .desktop-input-chrome,\n    [data-slot='input-group'],\n    [data-slot='input'],\n    [data-slot='textarea'],\n    [data-slot='select-trigger']\n  ):is(:focus, :focus-within, [data-state='open']) {\n  background: var(--lumen-field-surface) !important;\n  border-color: var(--lumen-accent) !important;\n  outline: none !important;\n  box-shadow: 0 0 0 1px color-mix(in srgb, var(--lumen-accent) 38%, transparent) !important;\n}\n\n:root[data-hermes-theme='lumen'] :is(input, textarea)::placeholder {\n  color: var(--ui-text-tertiary) !important;\n  opacity: 1;\n}\n\n:root[data-hermes-theme='lumen'] [data-slot='select-trigger'] svg {\n  color: var(--ui-text-tertiary);\n  opacity: 0.9 !important;\n}\n\n/* ==========================================================================\n   Dropdown menus\n   ========================================================================== */\n\n:root[data-hermes-theme='lumen'] [data-slot='select-content'] {\n  box-sizing: border-box;\n  width: var(--radix-select-trigger-width) !important;\n  min-width: var(--radix-select-trigger-width) !important;\n  max-width: var(--radix-select-trigger-width) !important;\n  background: var(--ui-bg-elevated) !important;\n  border: 1px solid var(--lumen-field-border) !important;\n  border-radius: 0.5rem !important;\n  box-shadow: 0 0.5rem 1.5rem color-mix(in srgb, #000 18%, transparent) !important;\n}\n\n:root[data-hermes-theme='lumen'] [data-slot='select-item'] {\n  overflow: hidden;\n  border-radius: 0.375rem !important;\n  color: var(--ui-text-secondary);\n  transition:\n    background-color 80ms ease,\n    color 80ms ease;\n}\n\n/*\n * Keep ordinary select rows inside the trigger width. The item text gets a\n * clean two-line clamp for long options, without widening the menu or\n * affecting custom popovers/command menus.\n */\n:root[data-hermes-theme='lumen']\n  [data-slot='select-content']\n  [data-slot='select-item']\n  > [data-radix-select-item-text] {\n  display: -webkit-box;\n  min-width: 0;\n  flex: 1 1 auto;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: normal;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 2;\n  overflow-wrap: anywhere;\n}\n\n:root[data-hermes-theme='lumen'] [data-slot='select-item']:is(:focus, [data-highlighted]) {\n  background: color-mix(in srgb, var(--lumen-accent) 13%, transparent) !important;\n  color: var(--ui-text-primary) !important;\n  outline: none;\n}\n";

// src/styles/kanban.css
var kanban_default = "/*\n * Lumen clarity layer \u2014 Kanban task drawer.\n *\n * FRAGILE: every selector in this file anchors on the TaskDrawer's exact\n * utility-class chain\n *\n *   [class~='absolute'][class~='inset-y-0'][class~='right-0'][class~='z-20']\n *\n * plus descendant utility classes. Targeting that exact combination ensures no\n * other right-hand sidebar, pane, modal, inspector or plugin drawer is caught,\n * but it breaks if the app's Tailwind classes change. Re-verify after every\n * Hermes Desktop update (see docs/COMPATIBILITY.md).\n */\n\n/* ==========================================================================\n   Task drawer width\n   ========================================================================== */\n\n/*\n * Hermes' Kanban TaskDrawer is specifically:\n *\n *   absolute inset-y-0 right-0 z-20 w-[26rem]\n *\n * 26rem -> 39rem = exactly 50% wider. The viewport guard ensures the board is\n * never completely swallowed on a smaller application window.\n */\n\n:root[data-hermes-theme='lumen']\n  [class~='absolute'][class~='inset-y-0'][class~='right-0'][class~='z-20'][class~='w-[26rem]'] {\n  width: min(39rem, calc(100vw - 12rem)) !important;\n}\n\n/* ==========================================================================\n   Drawer section separation\n   ========================================================================== */\n\n:root[data-hermes-theme='lumen']\n  [class~='absolute'][class~='inset-y-0'][class~='right-0'][class~='z-20']\n  > div[class~='min-h-0'][class~='flex-1'][class~='overflow-y-auto']\n  > div[class~='flex'][class~='flex-col']\n  > section {\n  position: relative;\n  padding-top: 0.875rem;\n  border-top: 1px solid var(--lumen-kanban-divider);\n}\n\n:root[data-hermes-theme='lumen']\n  [class~='absolute'][class~='inset-y-0'][class~='right-0'][class~='z-20']\n  > div[class~='min-h-0'][class~='flex-1'][class~='overflow-y-auto']\n  > div[class~='flex'][class~='flex-col']\n  > section\n  + section {\n  margin-top: 0.125rem;\n}\n\n/* ==========================================================================\n   Scroll wells\n   ========================================================================== */\n\n:root[data-hermes-theme='lumen']\n  [class~='absolute'][class~='inset-y-0'][class~='right-0'][class~='z-20']\n  section\n  > div:nth-child(2)[class~='overflow-y-auto'][class~='overscroll-contain'] {\n  box-sizing: border-box;\n  padding: 0.625rem 0.75rem 0.625rem 0.625rem;\n  background: var(--lumen-scroll-well-background) !important;\n  border: 1px solid var(--lumen-scroll-well-border);\n  border-radius: 0.625rem;\n  background-clip: padding-box;\n  scrollbar-gutter: stable;\n  scrollbar-color: var(--lumen-scroll-well-scrollbar) transparent;\n  scrollbar-width: thin;\n}\n\n/*\n * Worker Log gets the larger inspection area.\n */\n\n:root[data-hermes-theme='lumen']\n  [class~='absolute'][class~='inset-y-0'][class~='right-0'][class~='z-20']\n  section\n  > div:nth-child(2)[class~='overflow-y-auto'][class~='overscroll-contain']:has(\n    > [data-selectable-text='true'][class~='font-mono'][class~='whitespace-pre-wrap']\n  ) {\n  max-height: 22rem !important;\n}\n\n:root[data-hermes-theme='lumen']\n  [class~='absolute'][class~='inset-y-0'][class~='right-0'][class~='z-20']\n  section\n  > div:nth-child(2)[class~='overflow-y-auto'][class~='overscroll-contain']\n  > [data-selectable-text='true'][class~='font-mono'][class~='whitespace-pre-wrap'] {\n  padding: 0 !important;\n  background: transparent !important;\n  border: 0 !important;\n  border-radius: 0 !important;\n}\n\n:root[data-hermes-theme='lumen']\n  [class~='absolute'][class~='inset-y-0'][class~='right-0'][class~='z-20']\n  section\n  > div:nth-child(2)[class~='overflow-y-auto'][class~='overscroll-contain']\n  > ul {\n  background: transparent;\n}\n\n/* ==========================================================================\n   Dependency IDs\n   ========================================================================== */\n\n:root[data-hermes-theme='lumen']\n  [class~='absolute'][class~='inset-y-0'][class~='right-0'][class~='z-20']\n  section\n  button[class~='font-mono'][class~='bg-(--ui-bg-quaternary)'] {\n  padding: 0.125rem 0.4375rem !important;\n  background: var(--lumen-pill-background) !important;\n  border: 1px solid var(--lumen-pill-border) !important;\n  border-radius: 0.375rem !important;\n  color: var(--lumen-pill-foreground) !important;\n  font-weight: 500;\n  box-shadow: none;\n  transition:\n    background-color 100ms ease,\n    border-color 100ms ease,\n    color 100ms ease;\n}\n\n:root[data-hermes-theme='lumen']\n  [class~='absolute'][class~='inset-y-0'][class~='right-0'][class~='z-20']\n  section\n  button[class~='font-mono'][class~='bg-(--ui-bg-quaternary)']:hover {\n  background: color-mix(in srgb, var(--lumen-accent) 24%, var(--lumen-pill-background)) !important;\n  border-color: color-mix(in srgb, var(--lumen-accent) 58%, var(--lumen-pill-border)) !important;\n}\n\n/* ==========================================================================\n   Run status lozenges\n   ========================================================================== */\n\n:root[data-hermes-theme='lumen']\n  [class~='absolute'][class~='inset-y-0'][class~='right-0'][class~='z-20']\n  section\n  > div:nth-child(2)[class~='overflow-y-auto'][class~='overscroll-contain']\n  [data-slot='badge'] {\n  padding: 0.125rem 0.4375rem !important;\n  background: var(--lumen-pill-background) !important;\n  border: 1px solid var(--lumen-pill-border) !important;\n  border-radius: 0.375rem !important;\n  color: var(--lumen-pill-foreground) !important;\n  font-weight: 500;\n  box-shadow: none !important;\n}\n\n/* ==========================================================================\n   Nested scrollbars\n   ========================================================================== */\n\n:root[data-hermes-theme='lumen']\n  [class~='absolute'][class~='inset-y-0'][class~='right-0'][class~='z-20']\n  section\n  > div:nth-child(2)[class~='overflow-y-auto'][class~='overscroll-contain']::-webkit-scrollbar {\n  width: 9px;\n  height: 9px;\n}\n\n:root[data-hermes-theme='lumen']\n  [class~='absolute'][class~='inset-y-0'][class~='right-0'][class~='z-20']\n  section\n  > div:nth-child(2)[class~='overflow-y-auto'][class~='overscroll-contain']::-webkit-scrollbar-button {\n  display: none;\n  width: 0;\n  height: 0;\n}\n\n:root[data-hermes-theme='lumen']\n  [class~='absolute'][class~='inset-y-0'][class~='right-0'][class~='z-20']\n  section\n  > div:nth-child(2)[class~='overflow-y-auto'][class~='overscroll-contain']::-webkit-scrollbar-track {\n  background: transparent;\n  margin-block: 0.375rem;\n}\n\n:root[data-hermes-theme='lumen']\n  [class~='absolute'][class~='inset-y-0'][class~='right-0'][class~='z-20']\n  section\n  > div:nth-child(2)[class~='overflow-y-auto'][class~='overscroll-contain']::-webkit-scrollbar-thumb {\n  background: var(--lumen-scroll-well-scrollbar);\n  border: 2px solid transparent;\n  border-radius: 999px;\n  background-clip: padding-box;\n}\n\n:root[data-hermes-theme='lumen']\n  [class~='absolute'][class~='inset-y-0'][class~='right-0'][class~='z-20']\n  section\n  > div:nth-child(2)[class~='overflow-y-auto'][class~='overscroll-contain']::-webkit-scrollbar-thumb:hover {\n  background: color-mix(in srgb, var(--lumen-scroll-well-scrollbar) 80%, var(--ui-text-secondary));\n  border: 2px solid transparent;\n  background-clip: padding-box;\n}\n\n:root[data-hermes-theme='lumen']\n  [class~='absolute'][class~='inset-y-0'][class~='right-0'][class~='z-20']\n  section\n  > div:nth-child(2)[class~='overflow-y-auto'][class~='overscroll-contain']::-webkit-scrollbar-corner {\n  background: transparent;\n}\n";

// src/styles/sidebar.css
var sidebar_default = "/*\n * Lumen clarity layer \u2014 sessions sidebar.\n *\n * Structure-anchored selectors below (`data-tour`, `data-slot`, `data-sidebar`\n * attributes) are the app's own hooks and reasonably stable. The session-row\n * rules match Tailwind utility classes, which are more fragile \u2014 flagged\n * inline and catalogued in docs/COMPATIBILITY.md.\n */\n\n:root[data-hermes-theme='lumen']\n  [data-tour='sessions-sidebar']\n  > [data-slot='sidebar-content']\n  > [data-slot='sidebar-group']:first-child {\n  position: relative;\n  margin-bottom: 0.125rem;\n  padding-bottom: 0.4375rem !important;\n}\n\n:root[data-hermes-theme='lumen']\n  [data-tour='sessions-sidebar']\n  > [data-slot='sidebar-content']\n  > [data-slot='sidebar-group']:first-child::after {\n  content: '';\n  position: absolute;\n  left: 0;\n  /* The sessions scroller below reserves a stable scrollbar gutter, so its\n     section border-tops end short of the sidebar padding on the right. Inset\n     this divider by the same gutter width so the two hairlines span an\n     identical box. */\n  right: var(--lumen-sidebar-scrollbar-width);\n  bottom: 0;\n  height: 1px;\n  background: var(--lumen-sidebar-divider);\n}\n\n:root[data-hermes-theme='lumen']\n  [data-tour='sessions-sidebar']\n  > [data-slot='sidebar-content']\n  > [data-slot='sidebar-group']:first-child\n  [data-sidebar='menu-button'] {\n  width: calc(100% - 0.625rem);\n  border-color: transparent;\n}\n\n:root[data-hermes-theme='lumen']\n  [data-tour='sessions-sidebar']\n  > [data-slot='sidebar-content']\n  > [data-slot='sidebar-group']:first-child\n  [data-sidebar='menu-button']:hover {\n  background: var(--ui-control-hover-background);\n}\n\n/* ==========================================================================\n   Sidebar search\n   ========================================================================== */\n\n/*\n * Structural twin of the wrapper located by installSidebarSearchFocus()\n * (src/behaviors/sidebar-search.ts) \u2014 if the app's DOM shape changes, change\n * both together.\n */\n\n:root[data-hermes-theme='lumen']\n  [data-tour='sessions-sidebar']\n  > [data-slot='sidebar-content']\n  > div\n  > div:has(> input[type='text']) {\n  width: 100%;\n  min-height: 1.875rem;\n  box-sizing: border-box;\n  margin-top: 0.25rem;\n  padding-inline: 0.5rem;\n  background: var(--lumen-field-surface);\n  border: 1px solid var(--lumen-field-border) !important;\n  border-radius: 0.375rem;\n  opacity: 0.92 !important;\n  box-shadow: none;\n  background-clip: padding-box;\n  cursor: text;\n}\n\n/*\n * Sit the search field flush with the sidebar's left content edge. The app\n * wraps the SearchField in a `px-2` container\n * (apps/desktop/src/app/chat/sidebar/index.tsx), which insets it 0.5rem\n * further left than the nav items above and the session sections below.\n * Dropping only the left inset keeps the wrapper's own right-edge geometry.\n * FRAGILE: anchors the app's `px-2` search wrapper utility (see\n * docs/COMPATIBILITY.md).\n */\n:root[data-hermes-theme='lumen']\n  [data-tour='sessions-sidebar']\n  > [data-slot='sidebar-content']\n  > div:has(> div > input[type='text']) {\n  padding-left: 0;\n}\n\n:root[data-hermes-theme='lumen']\n  [data-tour='sessions-sidebar']\n  > [data-slot='sidebar-content']\n  > div\n  > div:has(> input[type='text'])\n  > input[type='text'] {\n  background: transparent !important;\n  background-color: transparent !important;\n  border: 0 !important;\n  border-color: transparent !important;\n  border-radius: 0 !important;\n  outline: 0 !important;\n  box-shadow: none !important;\n}\n\n:root[data-hermes-theme='lumen']\n  [data-tour='sessions-sidebar']\n  > [data-slot='sidebar-content']\n  > div\n  > div:has(> input[type='text']):focus-within {\n  border-color: var(--lumen-accent) !important;\n  opacity: 1 !important;\n  box-shadow: 0 0 0 1px color-mix(in srgb, var(--lumen-accent) 38%, transparent);\n}\n\n:root[data-hermes-theme='lumen']\n  [data-tour='sessions-sidebar']\n  > [data-slot='sidebar-content']\n  > div\n  > div:has(> input[type='text'])\n  svg {\n  color: var(--ui-text-tertiary);\n}\n\n:root[data-hermes-theme='lumen']\n  [data-tour='sessions-sidebar']\n  > [data-slot='sidebar-content']\n  > div\n  > div:has(> input[type='text'])\n  input::placeholder {\n  color: var(--ui-text-tertiary);\n  opacity: 1;\n}\n\n/* ==========================================================================\n   Sidebar sections\n   ========================================================================== */\n\n/*\n * Section spacing is symmetric around each divider: the divider's own\n * margin-top matches the group's padding-top below it. The app's SidebarGroup\n * ships `p-2` (0.5rem bottom padding) which doubled the gap under the header\n * pill before the next divider \u2014 dropped to 0 so collapsed sections close up\n * flush (see the group-content rule below for the open-section counterpart).\n */\n:root[data-hermes-theme='lumen'] [data-tour='sessions-sidebar'] [data-sessions-mode] > [data-slot='sidebar-group'] {\n  border-top: 1px solid var(--lumen-sidebar-divider);\n  margin-top: 0.375rem;\n  padding-top: 0.375rem !important;\n  padding-bottom: 0 !important;\n}\n\n:root[data-hermes-theme='lumen']\n  [data-tour='sessions-sidebar']\n  [data-sessions-mode]\n  > [data-slot='sidebar-group']\n  > div:first-child {\n  min-height: 1.625rem;\n  box-sizing: border-box;\n  background: var(--lumen-sidebar-section-tint);\n  border: 0;\n  border-radius: 0.25rem;\n  /* Same accent language as the selected session row: a crisp 2px inset rail\n     clipped by the card radius, not a floating rounded pseudo-element. */\n  box-shadow: inset 2px 0 0 color-mix(in srgb, var(--lumen-accent) 75%, transparent);\n  margin-bottom: 0;\n  padding: 0.1875rem 0.375rem 0.1875rem 0.5625rem !important;\n}\n\n/*\n * Header-to-rows separation rides the group-content element instead of the\n * header pill's margin: the app only renders group content while a section\n * is open ({sectionOpen && <SidebarGroupContent>}), so collapsed sections\n * have nothing to push the next divider away and sit flush with the same\n * gap the divider has above the pill. Open sections keep the same 0.25rem\n * breathing room the pill margin used to provide.\n */\n:root[data-hermes-theme='lumen']\n  [data-tour='sessions-sidebar']\n  [data-sessions-mode]\n  > [data-slot='sidebar-group']\n  > [data-slot='sidebar-group-content'] {\n  margin-top: 0.25rem;\n  padding-inline: 0.0625rem;\n}\n\n:root[data-hermes-theme='lumen']\n  [data-tour='sessions-sidebar']\n  [data-sessions-mode]\n  > [data-slot='sidebar-group']\n  [data-sidebar='menu-button'],\n:root[data-hermes-theme='lumen']\n  [data-tour='sessions-sidebar']\n  [data-sessions-mode]\n  > [data-slot='sidebar-group']\n  button[role='button'] {\n  box-shadow: none;\n}\n\n/* ==========================================================================\n   Session rows\n   ========================================================================== */\n\n/*\n * FRAGILE: matches the app's Tailwind utility classes, including the escaped\n * arbitrary-value classes `.text-(--ui-text-tertiary)` / quaternary. Re-verify\n * these after every Hermes Desktop update (see docs/COMPATIBILITY.md).\n */\n\n:root[data-hermes-theme='lumen'] [data-tour='sessions-sidebar'] .row-hover {\n  transition:\n    background-color 120ms ease,\n    box-shadow 120ms ease,\n    transform 120ms ease;\n}\n\n:root[data-hermes-theme='lumen'] [data-tour='sessions-sidebar'] .row-hover:hover {\n  box-shadow: inset 0 0 0 1px var(--lumen-row-hover-outline);\n}\n:root[data-hermes-theme='lumen'] [data-tour='sessions-sidebar'] .row-hover[class*='bg-(--ui-row-active-background)'] {\n  box-shadow: inset 0 0 0 1px var(--lumen-row-selected-outline);\n}\n\n:root[data-hermes-theme='lumen']\n  [data-tour='sessions-sidebar']\n  .row-hover[class*='bg-(--ui-row-active-background)']:hover {\n  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--lumen-accent) 52%, transparent);\n}\n:root[data-hermes-theme='lumen']\n  [data-tour='sessions-sidebar']\n  .row-hover[class*='bg-(--ui-row-active-background)']\n  .text-\\(--ui-text-tertiary\\),\n:root[data-hermes-theme='lumen']\n  [data-tour='sessions-sidebar']\n  .row-hover[class*='bg-(--ui-row-active-background)']\n  .text-\\(--ui-text-quaternary\\) {\n  color: color-mix(in srgb, var(--ui-text-secondary) 92%, var(--ui-text-primary)) !important;\n}\n\n/* Keep the selected session title prominent without changing its metadata. */\n:root[data-hermes-theme='lumen']\n  [data-tour='sessions-sidebar']\n  .row-hover[class*='bg-(--ui-row-active-background)']\n  .hover-marquee {\n  font-weight: 600;\n}\n\n:root[data-hermes-theme='lumen'] [data-tour='sessions-sidebar'] .row-hover [data-row-actions] button {\n  border-radius: 0.3125rem;\n}\n\n/* ==========================================================================\n   Profile rail\n   ========================================================================== */\n\n/*\n * FRAGILE: matches the grab-handle / disabled profile buttons by utility\n * class (`.rounded-[3px]`, `.text-[0.5625rem]`, `.opacity-35`).\n */\n\n:root[data-hermes-theme='lumen']\n  :is(\n    button.cursor-grab.touch-none.rounded-\\[3px\\].text-\\[0\\.5625rem\\][aria-pressed],\n    button.opacity-35.rounded-\\[3px\\].text-\\[0\\.5625rem\\]\n  ) {\n  color: var(--lumen-profile-rail-glyph) !important;\n  opacity: 0.92 !important;\n  filter: none !important;\n}\n\n/* ==========================================================================\n   Sidebar scrollbar\n   ========================================================================== */\n\n:root[data-hermes-theme='lumen']\n  [data-tour='sessions-sidebar']\n  :is([data-slot='sidebar-content'], [data-sessions-mode])::-webkit-scrollbar {\n  width: var(--lumen-sidebar-scrollbar-width);\n}\n\n:root[data-hermes-theme='lumen']\n  [data-tour='sessions-sidebar']\n  :is([data-slot='sidebar-content'], [data-sessions-mode])::-webkit-scrollbar-track {\n  background: transparent;\n}\n\n:root[data-hermes-theme='lumen']\n  [data-tour='sessions-sidebar']\n  :is([data-slot='sidebar-content'], [data-sessions-mode])::-webkit-scrollbar-thumb {\n  background: color-mix(in srgb, var(--ui-text-tertiary) 28%, transparent);\n  border: 3px solid transparent;\n  border-radius: 999px;\n  background-clip: padding-box;\n}\n\n:root[data-hermes-theme='lumen']\n  [data-tour='sessions-sidebar']\n  :is([data-slot='sidebar-content'], [data-sessions-mode])::-webkit-scrollbar-thumb:hover {\n  background: color-mix(in srgb, var(--ui-text-secondary) 42%, transparent);\n  border: 2px solid transparent;\n  background-clip: padding-box;\n}\n\n/* ==========================================================================\n   Section hover\n   ========================================================================== */\n\n:root[data-hermes-theme='lumen']\n  [data-tour='sessions-sidebar']\n  [data-sessions-mode]\n  > [data-slot='sidebar-group']\n  > div:first-child:hover {\n  background: color-mix(in srgb, var(--lumen-accent) 10%, var(--ui-bg-sidebar));\n}\n\n/* ==========================================================================\n   Active top navigation\n   ========================================================================== */\n\n:root[data-hermes-theme='lumen']\n  [data-tour='sessions-sidebar']\n  > [data-slot='sidebar-content']\n  > [data-slot='sidebar-group']:first-child\n  [data-sidebar='menu-button'][aria-current='page'],\n:root[data-hermes-theme='lumen']\n  [data-tour='sessions-sidebar']\n  > [data-slot='sidebar-content']\n  > [data-slot='sidebar-group']:first-child\n  [data-sidebar='menu-button'][data-active='true'] {\n  box-shadow: inset 2px 0 0 color-mix(in srgb, var(--lumen-accent) 72%, transparent);\n}\n";

// src/styles/tokens.css
var tokens_default = "/*\n * Lumen clarity layer \u2014 design tokens.\n * ------------------------------------\n * Every rule in this layer is scoped to the Lumen skin, so the stylesheet is\n * inert while any other theme is active.\n *\n * Values that coincide with the contributed palette are expressed through the\n * app's seed/palette vars (`--theme-*`, `--dt-*`, written inline on :root by\n * the app when the theme is applied \u2014 apps/desktop/src/themes/context.tsx), so\n * src/palettes.ts stays the single source of truth for color. Fixed hexes here\n * are Lumen-authored refinements with no palette counterpart.\n */\n\n:root[data-hermes-theme='lumen'] {\n  /*\n   * Global UI scale. Lumen targets readable defaults; 18px on :root scales\n   * every rem-based size in the app (app native root is 16px via\n   * --dt-base-size; see docs/COMPATIBILITY.md for the impact).\n   */\n  font-size: 18px !important;\n\n  /* Brand accent \u2014 tracks the palette ring (== primary) in both modes. */\n  --lumen-accent: var(--dt-ring);\n  /* Control strokes reuse the sharpened primary stroke defined below. */\n  --lumen-control-border: var(--ui-stroke-primary);\n  /* Profile rail glyphs (sidebar bottom rail). */\n  --lumen-profile-rail-glyph: #343a44;\n\n  /*\n   * Shared form-control language.\n   */\n  --lumen-field-surface: color-mix(in srgb, var(--theme-card-seed) 82%, var(--theme-sidebar-seed));\n  --lumen-field-hover-surface: color-mix(in srgb, var(--theme-card-seed) 92%, var(--theme-sidebar-seed));\n  --lumen-field-border: #c6ced7;\n  --lumen-field-hover-border: #aeb8c4;\n\n  /*\n   * Sidebar.\n   */\n  /* Width of the styled sidebar scrollbar; the sessions list reserves the same\n     amount as a stable gutter, so divider rules couple to this variable to\n     span the same box as the section content (see styles/sidebar.css). */\n  --lumen-sidebar-scrollbar-width: 10px;\n  --lumen-sidebar-nav-surface: #f8f9fb;\n  --lumen-sidebar-section-tint: color-mix(in srgb, var(--dt-ring) 7%, var(--theme-sidebar-seed));\n  --lumen-sidebar-divider: #c9d0d8;\n  --lumen-row-hover-outline: color-mix(in srgb, var(--dt-ring) 14%, var(--lumen-sidebar-divider));\n  --lumen-row-selected-outline: color-mix(in srgb, var(--dt-ring) 38%, transparent);\n\n  /*\n   * Kanban nested scroll wells.\n   */\n  --lumen-scroll-well-background: var(--theme-sidebar-seed);\n  --lumen-scroll-well-border: #c4cbd4;\n  --lumen-scroll-well-scrollbar: #96a1ae;\n  --lumen-kanban-divider: var(--dt-border);\n\n  /*\n   * Purple metadata lozenges.\n   */\n  --lumen-pill-background: color-mix(in srgb, var(--dt-ring) 13%, var(--theme-card-seed));\n  --lumen-pill-border: color-mix(in srgb, var(--dt-ring) 32%, var(--dt-border));\n  --lumen-pill-foreground: #5145be;\n\n  /*\n   * Text hierarchy \u2014 fixed inks replacing the app's color-mix-derived tiers,\n   * for predictable contrast (asserted in test/contrast.test.ts).\n   */\n  --ui-text-primary: var(--theme-foreground);\n  --ui-text-secondary: #4f5863;\n  --ui-text-tertiary: #68737f;\n  --ui-text-quaternary: #737d89;\n  --conversation-scaffold-text: #59636f;\n  --conversation-scaffold-meta: #737d89;\n  --lumen-scaffold-gradient: linear-gradient(\n    105deg,\n    color-mix(in srgb, var(--lumen-accent) 74%, var(--ui-text-primary)) 0%,\n    var(--lumen-accent) 50%,\n    color-mix(in srgb, var(--lumen-accent) 58%, var(--ui-text-primary)) 100%\n  );\n\n  /*\n   * Stroke hierarchy.\n   */\n  --ui-stroke-primary: #7f8995;\n  --ui-stroke-secondary: #a7b0bb;\n  --ui-stroke-tertiary: #c1c8d0;\n  --ui-stroke-quaternary: #d5dae0;\n  --stroke-nous: color-mix(in srgb, var(--theme-foreground) 10%, transparent);\n\n  /*\n   * Inputs. Border strength is driven by a single alpha knob the app mixes\n   * into input borders (app styles.css); Lumen raises it for crisper fields.\n   */\n  --dt-input-border: 28%;\n  --dt-input-bg: 100%;\n  --dt-input-inset: none;\n\n  /*\n   * Surfaces \u2014 pinned to the palette seeds (background / sidebar / card /\n   * popover); --ui-bg-card and --ui-bg-input are authored refinements.\n   */\n  --ui-bg-chrome: var(--theme-background-seed);\n  --ui-bg-sidebar: var(--theme-sidebar-seed);\n  --ui-bg-editor: var(--theme-card-seed);\n  --ui-bg-elevated: var(--theme-elevated-seed);\n  --ui-bg-card: #f2f4f7;\n  --ui-bg-input: var(--theme-card-seed);\n  --ui-widget-surface-background: var(--theme-card-seed);\n\n  /*\n   * Interaction states.\n   */\n  --ui-row-hover-background: #e8ebf2;\n  --ui-row-active-background: #e3e0f8;\n  --ui-control-hover-background: #e8ebf2;\n  --ui-control-active-background: #e3e0f8;\n  --chrome-action-hover: #e8ebf2;\n\n  /*\n   * Misc.\n   */\n  --ui-selection-background: color-mix(in srgb, var(--dt-ring) 24%, transparent);\n  --ui-inline-code-background: #eceff4;\n  --ui-inline-code-foreground: #262b32;\n  --lumen-capabilities-readable-text: #59636f;\n  /* Embedded capability pickers keep a constant dark backdrop in both modes. */\n  --lumen-embed-background: #171a1f;\n}\n\n/* ==========================================================================\n   Dark mode\n   ========================================================================== */\n:root[data-hermes-theme='lumen'][data-hermes-mode='dark'] {\n  --lumen-accent: var(--dt-ring);\n  --lumen-control-border: var(--ui-stroke-primary);\n  --lumen-profile-rail-glyph: #d5dae1;\n\n  /*\n   * Forms. The dark field surface sits below the dark card (#252b32) so\n   * fields read as inset wells rather than as another card.\n   */\n  --lumen-field-surface: color-mix(in srgb, #1f252b 82%, var(--theme-sidebar-seed));\n  --lumen-field-hover-surface: color-mix(in srgb, var(--theme-card-seed) 84%, var(--theme-sidebar-seed));\n  --lumen-field-border: #424c58;\n  --lumen-field-hover-border: #596574;\n\n  /*\n   * Sidebar.\n   */\n  --lumen-sidebar-nav-surface: #272d34;\n  --lumen-sidebar-section-tint: color-mix(in srgb, var(--dt-ring) 9%, var(--theme-sidebar-seed));\n  --lumen-sidebar-divider: #3b444f;\n  --lumen-row-hover-outline: color-mix(in srgb, var(--dt-ring) 18%, var(--lumen-sidebar-divider));\n  --lumen-row-selected-outline: color-mix(in srgb, var(--dt-ring) 48%, transparent);\n\n  /*\n   * Kanban wells.\n   */\n  --lumen-scroll-well-background: #232a31;\n  --lumen-scroll-well-border: #3e4854;\n  --lumen-scroll-well-scrollbar: #667381;\n  --lumen-kanban-divider: var(--dt-border);\n\n  /*\n   * Purple metadata lozenges.\n   */\n  --lumen-pill-background: color-mix(in srgb, var(--dt-ring) 17%, #232a31);\n  --lumen-pill-border: color-mix(in srgb, var(--dt-ring) 38%, #3e4854);\n  --lumen-pill-foreground: #d6d0ff;\n\n  /*\n   * Text hierarchy.\n   */\n  --ui-text-primary: var(--theme-foreground);\n  --ui-text-secondary: #c2c8d0;\n  --ui-text-tertiary: #9da6b2;\n  --ui-text-quaternary: #858f9b;\n  --conversation-scaffold-text: #afb7c1;\n  --conversation-scaffold-meta: #858f9b;\n  --lumen-scaffold-gradient: linear-gradient(\n    105deg,\n    color-mix(in srgb, var(--lumen-accent) 74%, var(--ui-text-primary)) 0%,\n    var(--lumen-accent) 50%,\n    color-mix(in srgb, var(--lumen-accent) 58%, var(--ui-text-primary)) 100%\n  );\n\n  /*\n   * Stroke hierarchy.\n   */\n  --ui-stroke-primary: #717e8d;\n  --ui-stroke-secondary: #596574;\n  --ui-stroke-tertiary: #414a55;\n  --ui-stroke-quaternary: #353d46;\n  --stroke-nous: color-mix(in srgb, var(--theme-foreground) 12%, transparent);\n\n  /*\n   * Inputs.\n   */\n  --dt-input-border: 34%;\n  --dt-input-bg: 100%;\n  --dt-input-inset: none;\n\n  /*\n   * Surfaces.\n   */\n  --ui-bg-chrome: var(--theme-background-seed);\n  --ui-bg-sidebar: var(--theme-sidebar-seed);\n  --ui-bg-editor: var(--theme-card-seed);\n  --ui-bg-elevated: var(--theme-elevated-seed);\n  --ui-bg-card: #2a3038;\n  --ui-bg-input: #20262c;\n  --ui-widget-surface-background: var(--theme-card-seed);\n\n  /*\n   * Interaction.\n   */\n  --ui-row-hover-background: #2b323a;\n  --ui-row-active-background: #37334f;\n  --ui-control-hover-background: #303740;\n  --ui-control-active-background: #393653;\n  --chrome-action-hover: #303740;\n\n  /*\n   * Misc.\n   */\n  --ui-selection-background: color-mix(in srgb, var(--dt-ring) 30%, transparent);\n  --ui-inline-code-background: #2b323a;\n  --ui-inline-code-foreground: #e7eaf0;\n  --lumen-capabilities-readable-text: #b2bac4;\n  --lumen-embed-background: #171a1f;\n}\n";

// src/palettes.ts
var LIGHT = {
  background: "#F6F7F9",
  foreground: "#171A1F",
  card: "#FFFFFF",
  cardForeground: "#171A1F",
  muted: "#E9EDF2",
  mutedForeground: "#68737F",
  popover: "#FFFFFF",
  popoverForeground: "#171A1F",
  primary: "#6558D9",
  primaryForeground: "#FFFFFF",
  secondary: "#ECEAFB",
  secondaryForeground: "#332D71",
  accent: "#EFEDFB",
  accentForeground: "#332D71",
  border: "#C7CDD5",
  input: "#AEB7C2",
  ring: "#6558D9",
  midground: "#6558D9",
  midgroundForeground: "#FFFFFF",
  composerRing: "#8E83EA",
  destructive: "#C4324A",
  destructiveForeground: "#FFFFFF",
  sidebarBackground: "#EEF1F5",
  sidebarBorder: "#C7CDD5",
  userBubble: "#EFEDFB",
  userBubbleBorder: "#C9C4F0"
};
var DARK = {
  background: "#1B1F24",
  foreground: "#F2F4F7",
  card: "#252B32",
  cardForeground: "#F2F4F7",
  muted: "#303740",
  mutedForeground: "#9DA6B2",
  popover: "#2B323A",
  popoverForeground: "#F2F4F7",
  primary: "#9B92FF",
  primaryForeground: "#14161A",
  secondary: "#34314F",
  secondaryForeground: "#E5E2FF",
  accent: "#393653",
  accentForeground: "#F1EFFF",
  border: "#414A55",
  input: "#596574",
  ring: "#9B92FF",
  midground: "#9B92FF",
  midgroundForeground: "#14161A",
  composerRing: "#8C82F4",
  destructive: "#F06472",
  destructiveForeground: "#190709",
  sidebarBackground: "#22272E",
  sidebarBorder: "#414A55",
  userBubble: "#302D46",
  userBubbleBorder: "#514C75"
};
var LIGHT_TERMINAL = {
  foreground: "#2A3038",
  cursor: "#6558D9",
  selectionBackground: "#DAD6FA",
  black: "#303740",
  red: "#B4233C",
  green: "#247A52",
  yellow: "#8B6508",
  blue: "#3F63C8",
  magenta: "#7657C5",
  cyan: "#267781",
  white: "#E4E8ED",
  brightBlack: "#68737F",
  brightRed: "#D13D57",
  brightGreen: "#2E9365",
  brightYellow: "#A77A0C",
  brightBlue: "#5275DE",
  brightMagenta: "#8A6ADC",
  brightCyan: "#328C97",
  brightWhite: "#FFFFFF"
};
var DARK_TERMINAL = {
  foreground: "#E7EAF0",
  cursor: "#9B92FF",
  selectionBackground: "#4B466E",
  black: "#252B32",
  red: "#F06472",
  green: "#68C596",
  yellow: "#DDB65D",
  blue: "#83A9FF",
  magenta: "#BEA8FF",
  cyan: "#75C7D0",
  white: "#C2C8D0",
  brightBlack: "#717E8D",
  brightRed: "#FF8993",
  brightGreen: "#8BD8B1",
  brightYellow: "#EACB83",
  brightBlue: "#A6C2FF",
  brightMagenta: "#D3C4FF",
  brightCyan: "#99D9E0",
  brightWhite: "#FFFFFF"
};

// src/theme.ts
var THEME_NAME = "lumen";
var theme = {
  name: THEME_NAME,
  label: "Lumen",
  description: "A brighter, clearer, more spacious Hermes",
  colors: LIGHT,
  darkColors: DARK,
  typography: {
    fontSans: 'Manrope, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", emoji',
    fontMono: '"JetBrains Mono", "SFMono-Regular", Consolas, "Liberation Mono", monospace',
    fontUrl: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap"
  },
  terminal: LIGHT_TERMINAL,
  darkTerminal: DARK_TERMINAL
};

// src/plugin.ts
var STYLE_ID = `${THEME_NAME}-styles`;
var CSS = [tokens_default, conversation_default, forms_default, sidebar_default, composer_default, kanban_default, capabilities_default, focus_default].join(
  "\n"
);
function installStyles(ctx) {
  if (typeof document === "undefined") {
    return;
  }
  document.getElementById(STYLE_ID)?.remove();
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = CSS;
  document.head.append(style);
  ctx.onDispose(() => {
    style.remove();
  });
}
var themeContribution = {
  id: THEME_NAME,
  area: THEMES_AREA,
  data: theme
};
var plugin_default = {
  id: THEME_NAME,
  name: "Lumen",
  description: theme.description,
  register(ctx) {
    installStyles(ctx);
    installSidebarSearchFocus(ctx);
    ctx.register(themeContribution);
    ctx.register(layoutContribution);
  }
};
export {
  plugin_default as default
};
