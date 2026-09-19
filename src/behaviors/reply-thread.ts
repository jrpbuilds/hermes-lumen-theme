/**
 * Keep a group-chat thread composer always seated, theme-side.
 *
 * The room seats its composer under whichever thread you click; this behavior
 * seats the newest thread's composer on mount when none is seated. Seat-once
 * semantics: the app keeps the composer seated (there is no close affordance),
 * so this only fills the empty state and never fights a user choice.
 */

import type { PluginContext } from '../types/plugin-contract'

/** The group-chat room's log grid — the only element carrying this chain. */
export const LOG_GRID_SELECTOR =
  "div[class*='grid-cols-[minmax(0,1fr)]'][class*='gap-1.5'][class*='px-2.5'][class*='pb-2']"

/** The room's "Reply in thread" link buttons (Button stamps data-variant). */
export const REPLY_LINK_SELECTOR = "button[data-variant='link']"

/** A parked pane layer, minimized zone, or veiled subtree must not be seated. */
function isHidden(element: Element): boolean {
  return Boolean(element.closest('[data-pane-hidden], [inert]'))
}

/**
 * Seat a composer in every visible room that lacks one by clicking its newest
 * thread's reply link. The composer's autoFocus steals the caret on the seat,
 * so focus is handed back to the prior holder on the following tick. Returns
 * how many seats were taken.
 */
export function seatThreadComposers(root: Document | Element): number {
  let seats = 0

  root.querySelectorAll(LOG_GRID_SELECTOR).forEach(grid => {
    if (grid.querySelector('form')) {
      return
    }

    if (isHidden(grid)) {
      return
    }

    const links = grid.querySelectorAll(REPLY_LINK_SELECTOR)
    const newest = links[links.length - 1]

    if (!(newest instanceof HTMLElement)) {
      return
    }

    const previous = document.activeElement
    newest.click()
    seats += 1

    setTimeout(() => {
      const focused = document.activeElement

      if (focused === previous || !grid.contains(focused)) {
        return
      }

      if (previous instanceof HTMLElement && previous.isConnected) {
        previous.focus()
      }
    }, 0)
  })

  return seats
}

/** Wire the seat-on-mount pass; disposed with the plugin. */
export function installThreadComposerSeat(ctx: PluginContext): void {
  if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') {
    return
  }

  let scheduled: ReturnType<typeof setTimeout> | null = null

  const run = (): void => {
    scheduled = null
    seatThreadComposers(document)
  }

  // Batches room-mount mutation storms into one pass per 100ms window.
  const schedule = (): void => {
    if (scheduled !== null) {
      return
    }

    scheduled = setTimeout(run, 100)
  }

  const observer = new MutationObserver(schedule)
  observer.observe(document.documentElement, { childList: true, subtree: true })

  // Rooms already open when the plugin (re)loads, plus a settle pass for the
  // boot render the observer may have been installed after.
  seatThreadComposers(document)
  const settle = setTimeout(run, 250)

  ctx.onDispose(() => {
    observer.disconnect()

    if (scheduled !== null) {
      clearTimeout(scheduled)
      scheduled = null
    }

    clearTimeout(settle)
  })
}
