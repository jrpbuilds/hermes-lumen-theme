/**
 * Selector-contract tests for src/styles/bots.css, under jsdom.
 *
 * Selectors are evaluated against DOM replicas of the roster's two shapes
 * (gateway-sectioned and flat) and fail if a rule stops matching the markup
 * it was written for. If the plugin's markup changes, update the replica AND
 * the stylesheet together (see docs/COMPATIBILITY.md).
 *
 * The replicas mirror the live pane's data-slot reality: Radix asChild
 * triggers overwrite the row-button's own data-slot, so section headings
 * carry `data-slot='tooltip-trigger'` (Tip) and rows carry
 * `data-slot='context-menu-trigger'` (bot rows also carry data-roster-key).
 */

// @vitest-environment jsdom
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { beforeEach, describe, expect, it } from 'vitest'

const CSS = readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/styles/bots.css'), 'utf8')

/** Comment-free, whitespace-collapsed CSS text for presence checks. */
const FLAT_CSS = CSS.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\s+/g, ' ')

/** Every selector list in the stylesheet, ready to hand to querySelectorAll. */
function selectors(): string[] {
  return CSS.replace(/\/\*[\s\S]*?\*\//g, ' ')
    .split('}')
    .map(chunk => chunk.split('{')[0]?.trim() ?? '')
    .filter(Boolean)
    .map(selector => selector.replace(/\s+/g, ' '))
    .filter(selector => !selector.includes('::'))
}

/**
 * Gateway shape, mirroring the running pane: a group-chats section (its active
 * group row wrapped with move controls) and a gateway bucket of bot rows.
 * Class chains come from the plugin's components (roster-pane-toolbar,
 * roster-pane-content, roster-sections, bot-row).
 */
const GATEWAY_DOM = `
  <div class="flex h-full flex-col">
    <div class="flex items-center justify-between gap-2 px-2.5 pt-2.5 pb-1.5"><span>Bots</span></div>
    <div class="flex min-w-0 items-center gap-1 px-2.5 pb-1.5">
      <div class="inline-flex max-w-full min-w-0 flex-1 items-center gap-1.5 border-b border-transparent px-0.5 opacity-50 focus-within:opacity-100">
        <svg class="pointer-events-none size-3.5 shrink-0"></svg>
        <input type="text" />
      </div>
      <button class="size-7 shrink-0" type="button"></button>
    </div>
    <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain" data-slot="bots-roster">
      <div class="grid w-full min-w-0 gap-0.5 px-1.5 pb-2">
        <div class="min-w-0">
          <button class="flex w-full min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-[0.6875rem] font-semibold uppercase tracking-wider text-(--ui-text-quaternary) transition-colors mt-1" data-slot="tooltip-trigger" type="button" aria-expanded="true">
            <i class="codicon codicon-chevron-right shrink-0 transition-transform duration-150 rotate-90"></i>
            <i class="codicon codicon-organization shrink-0"></i>
            <span class="flex min-w-0 items-center gap-1"><span class="min-w-0 truncate">Group chats</span></span>
            <span aria-hidden="true" class="min-w-0 flex-1"></span>
            <span class="shrink-0 font-normal tabular-nums text-(--ui-text-quaternary)">1</span>
          </button>
          <div class="grid min-w-0 gap-0.5">
            <div class="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center">
              <button class="flex w-full min-w-0 max-w-full items-center gap-2.5 overflow-hidden rounded-md px-2 py-2 text-left transition-colors bg-(--ui-row-active-background)" data-slot="context-menu-trigger" type="button" aria-label="Dev Team, 5 bots, 5 of 5 available" draggable="true">
                <div class="min-w-0 flex-1">
                  <div class="flex items-baseline justify-between gap-2">
                    <span class="min-w-0 flex-1 truncate text-[0.8125rem] font-medium">Dev Team</span>
                    <span class="shrink-0 text-[0.6875rem] text-(--ui-text-quaternary)">6m</span>
                  </div>
                  <div class="min-w-0 truncate text-xs text-(--ui-text-tertiary)">preview</div>
                </div>
              </button>
              <div class="flex flex-col">
                <button class="size-6 rounded-[4px]" type="button"></button>
                <button class="size-6 rounded-[4px]" type="button"></button>
              </div>
            </div>
          </div>
        </div>
        <div class="min-w-0">
          <button class="flex w-full min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-[0.6875rem] font-semibold uppercase tracking-wider text-(--ui-text-quaternary) transition-colors mt-1" data-slot="tooltip-trigger" type="button" aria-expanded="true">
            <i class="codicon codicon-chevron-right shrink-0 transition-transform duration-150 rotate-90"></i>
            <span aria-hidden="true" class="grid size-3.5 shrink-0 place-items-center text-(--ui-text-quaternary)" data-connection-kind="remote" data-slot="connection-glyph"><svg class="size-3"></svg></span>
            <span class="flex min-w-0 items-center gap-1"><span class="min-w-0 truncate">192.168.0.200:9119</span></span>
            <span aria-hidden="true" class="min-w-0 flex-1"></span>
            <span class="shrink-0 font-normal tabular-nums text-(--ui-text-quaternary)">8</span>
          </button>
          <div class="grid min-w-0 gap-0.5">
            <button class="flex w-full min-w-0 max-w-full items-center gap-2.5 overflow-hidden rounded-md px-2 py-2 text-left transition-colors" data-slot="context-menu-trigger" type="button" aria-label="Hermes" data-roster-key="192-168-0-200-9119::default" draggable="true">
              <div class="min-w-0 flex-1">
                <div class="flex items-baseline justify-between gap-2">
                  <span class="min-w-0 truncate text-[0.8125rem] font-medium">Hermes</span>
                  <span class="shrink-0 text-[0.6875rem] text-(--ui-text-quaternary)">now</span>
                </div>
              </div>
            </button>
            <button class="flex w-full min-w-0 max-w-full items-center gap-2.5 overflow-hidden rounded-md px-2 py-2 text-left transition-colors" data-slot="context-menu-trigger" type="button" aria-label="Writer" data-roster-key="192-168-0-200-9119::writer" draggable="true">
              <div class="min-w-0 flex-1">
                <div class="flex items-baseline justify-between gap-2">
                  <span class="min-w-0 truncate text-[0.8125rem] font-medium">Writer</span>
                  <span class="shrink-0 text-[0.6875rem] text-(--ui-text-quaternary)">15d</span>
                </div>
                <div class="flex min-w-0 items-center gap-1.5 text-xs text-(--ui-text-tertiary)"><span class="min-w-0 truncate">preview</span></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
`

/** Flat shape: one connection, so user sections are the top level. */
const FLAT_DOM = `  <div class="flex h-full flex-col">    <div class="flex items-center justify-between gap-2 px-2.5 pt-2.5 pb-1.5"><span>Bots</span></div>
    <div class="flex min-w-0 items-center gap-1 px-2.5 pb-1.5">
      <div class="inline-flex max-w-full min-w-0 flex-1 items-center gap-1.5 border-b border-transparent px-0.5 opacity-50 focus-within:opacity-100">
        <svg class="pointer-events-none size-3.5 shrink-0"></svg>
        <input type="text" />
      </div>
    </div>
    <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain" data-slot="bots-roster">
      <div class="grid w-full min-w-0 gap-0.5 px-1.5 pb-2">
        <div class="relative min-w-0 rounded-md" data-slot="bots-section">
          <div data-section-id="s1" data-slot="bots-section-heading">
            <div class="group/section mt-1 flex w-full min-w-0 items-center gap-1 pr-1">
              <button class="flex min-w-0 flex-1 items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-[0.6875rem] font-semibold uppercase tracking-wider text-(--ui-text-quaternary) transition-colors" data-slot="tooltip-trigger" type="button">
                <i class="codicon codicon-chevron-right shrink-0 transition-transform duration-150"></i>
                <i class="codicon codicon-folder shrink-0"></i>
                <span class="flex min-w-0 items-center gap-1"><span class="min-w-0 truncate">Ops</span></span>
                <span aria-hidden="true" class="min-w-0 flex-1"></span>
                <span class="shrink-0 font-normal tabular-nums text-(--ui-text-quaternary)">1</span>
              </button>
              <button class="shrink-0 rounded-md p-0.5" type="button"></button>
            </div>
          </div>
          <div class="grid min-w-0 gap-0.5">
            <button class="flex w-full min-w-0 max-w-full items-center gap-2.5 overflow-hidden rounded-md px-2 py-2 text-left transition-colors" data-slot="context-menu-trigger" type="button" aria-label="Builder" data-roster-key="local::builder" draggable="true">
              <span class="min-w-0 truncate text-[0.8125rem] font-medium">Builder</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
`

/**
 * Group-chat workspace shape (the in-pane or main-tab room): header, activity
 * panel hairline, log scroller and the log grid with one user message (grey
 * fill) and one bot message.
 */
const ROOM_DOM = `
  <div class="relative flex h-full flex-col">
    <div class="flex items-center gap-2 px-2.5 pt-2.5 pb-2"><span>Dev Team</span></div>
    <div class="border-b border-(--ui-stroke-secondary)">
      <div class="flex items-center gap-1"><button data-slot="row-button" type="button">Activity</button></div>
    </div>
    <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain">
      <div class="grid grid-cols-[minmax(0,1fr)] gap-1.5 px-2.5 pb-2">
        <div class="group flex items-start gap-2 rounded-md bg-(--chrome-action-hover) px-2 py-1.5">
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <span class="text-[0.7rem] font-semibold text-foreground">You</span>
              <span class="text-[0.625rem] text-(--ui-text-quaternary)">41 min ago</span>
            </div>
            <div class="min-w-0 text-xs text-(--ui-text-secondary)" data-selectable-text="true" data-slot="group-chat-message-content">
              <p class="wrap-anywhere leading-(--dt-line-height)">Can you guys investigate this Hermes theme?</p>
            </div>
          </div>
        </div>
        <div class="group flex items-start gap-2 px-2 py-1">
          <div class="mt-0.5 shrink-0"><svg data-bot-face="orchestrator"></svg></div>
          <div class="min-w-0 flex-1">
            <div class="min-w-0 text-xs text-(--ui-text-secondary)" data-selectable-text="true" data-slot="group-chat-message-content">
              <p class="wrap-anywhere leading-(--dt-line-height)">Queued: researcher → reviewer (gated).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`

interface Expectation {
  /** The rule as written in bots.css (minus the skin prefix). */
  selector: string
  gateway: number
  flat: number
  /** The group-chat workspace shape, when the rule targets it. */
  room?: number
}

const EXPECTATIONS: Expectation[] = [
  {
    selector: 'div.flex.h-full.flex-col:has(> div.flex.items-center.justify-between.gap-2.px-2\\.5.pt-2\\.5.pb-1\\.5)',
    gateway: 1,
    flat: 1
  },
  {
    selector: "[data-slot='bots-roster'] button.uppercase.tracking-wider",
    gateway: 2,
    flat: 1
  },
  {
    selector: "[data-slot='bots-roster'] > div > div > button.uppercase.tracking-wider",
    gateway: 2,
    flat: 0
  },
  {
    selector: "[data-slot='bots-roster'] > div > [data-slot='bots-section'] button.uppercase.tracking-wider",
    gateway: 0,
    flat: 1
  },
  {
    selector: "[data-slot='bots-roster'] > div > div > button.uppercase.tracking-wider [data-slot='connection-glyph']",
    gateway: 1,
    flat: 0
  },
  {
    selector: "[data-slot='bots-roster'] button.uppercase.tracking-wider > .codicon-chevron-right",
    gateway: 2,
    flat: 1
  },
  {
    selector: "[data-slot='bots-roster'] > div > div",
    gateway: 2,
    flat: 1
  },
  {
    selector: "[data-slot='bots-roster'] button:is([data-roster-key], [data-slot='context-menu-trigger'])",
    gateway: 3,
    flat: 1
  },
  {
    selector:
      "[data-slot='bots-roster'] button:is([data-roster-key], [data-slot='context-menu-trigger'])[class*='bg-(--ui-row-active-background)']",
    gateway: 1,
    flat: 0
  },
  {
    selector:
      "[data-slot='bots-roster'] button:is([data-roster-key], [data-slot='context-menu-trigger']) [class*='text-[0.8125rem]']",
    gateway: 3,
    flat: 1
  },
  {
    selector:
      "[data-slot='bots-roster'] button:is([data-roster-key], [data-slot='context-menu-trigger']) .text-\\(--ui-text-tertiary\\)",
    gateway: 2,
    flat: 0
  },
  {
    selector:
      "[data-slot='bots-roster'] button:is([data-roster-key], [data-slot='context-menu-trigger']) [class*='text-[0.6875rem]']",
    gateway: 3,
    flat: 0
  },
  {
    selector: "[data-slot='bots-roster'] button.uppercase.tracking-wider > span.min-w-0.flex-1",
    gateway: 2,
    flat: 1
  },
  {
    selector: "[data-slot='bots-roster'] button.uppercase.tracking-wider > span.tabular-nums",
    gateway: 2,
    flat: 1
  },
  {
    selector: "[data-slot='bots-roster'] button.uppercase.tracking-wider + div.grid",
    gateway: 2,
    flat: 0
  },
  {
    selector: "[data-slot='bots-roster'] div.grid[class*='grid-cols-[minmax(0,1fr)_auto]']",
    gateway: 1,
    flat: 0
  },
  {
    selector:
      "[data-slot='bots-roster'] div.grid[class*='grid-cols-[minmax(0,1fr)_auto]'] > button:is([data-roster-key], [data-slot='context-menu-trigger'])",
    gateway: 1,
    flat: 0
  },
  {
    selector:
      "[data-slot='bots-roster'] div.grid[class*='grid-cols-[minmax(0,1fr)_auto]']:has(> button[class*='bg-(--ui-row-active-background)'])",
    gateway: 1,
    flat: 0
  },
  {
    selector: "[data-slot='bots-roster'] button[class*='bg-(--ui-row-active-background)'] [class*='text-[0.8125rem]']",
    gateway: 1,
    flat: 0
  },
  {
    selector:
      "[data-slot='bots-roster'] button[class*='bg-(--ui-row-active-background)'] .text-\\(--ui-text-tertiary\\)",
    gateway: 1,
    flat: 0
  },
  {
    selector:
      "div.relative.flex.h-full.flex-col > div.min-h-0.flex-1.overflow-y-auto.overscroll-contain > div[class*='grid-cols-[minmax(0,1fr)]'][class*='gap-1.5'][class*='px-2.5'][class*='pb-2']",
    gateway: 0,
    flat: 0,
    room: 1
  },
  {
    selector:
      "div.relative.flex.h-full.flex-col > div.min-h-0.flex-1.overflow-y-auto.overscroll-contain > div[class*='grid-cols-[minmax(0,1fr)]'][class*='gap-1.5'][class*='px-2.5'][class*='pb-2'] > div[class*='bg-(--chrome-action-hover)']",
    gateway: 0,
    flat: 0,
    room: 1
  },
  {
    selector:
      "div.relative.flex.h-full.flex-col > div.min-h-0.flex-1.overflow-y-auto.overscroll-contain > div[class*='grid-cols-[minmax(0,1fr)]'][class*='gap-1.5'][class*='px-2.5'][class*='pb-2'] > div[class*='bg-(--chrome-action-hover)'] [data-slot='group-chat-message-content']",
    gateway: 0,
    flat: 0,
    room: 1
  }
]

describe('bots.css selectors', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('parses every rule that jsdom can evaluate', () => {
    document.body.innerHTML = GATEWAY_DOM

    for (const selector of selectors()) {
      expect(() => document.querySelectorAll(selector), selector).not.toThrow()
    }
  })

  it.each(EXPECTATIONS.map(expectation => [expectation.selector, expectation] as const))(
    'matches the intended elements for %s',
    (selector, expectation) => {
      expect(FLAT_CSS).toContain(selector)

      document.body.innerHTML = GATEWAY_DOM
      expect(document.querySelectorAll(selector)).toHaveLength(expectation.gateway)

      document.body.innerHTML = FLAT_DOM
      expect(document.querySelectorAll(selector)).toHaveLength(expectation.flat)

      if (expectation.room !== undefined) {
        document.body.innerHTML = ROOM_DOM
        expect(document.querySelectorAll(selector)).toHaveLength(expectation.room)
      }
    }
  )
})
