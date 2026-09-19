/**
 * Behavioral tests for the always-seated thread composer, under jsdom.
 */

// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  installThreadComposerSeat,
  LOG_GRID_SELECTOR,
  REPLY_LINK_SELECTOR,
  seatThreadComposers
} from '../src/behaviors/reply-thread'

/**
 * The room shape the behavior depends on. Clicking the reply link seats the
 * app's composer by REPLACING the link; the fake handler mimics that render
 * so the pass's re-checks see a seated room.
 */
function buildRoomDom(options: { composer?: boolean; hidden?: boolean } = {}): {
  grid: HTMLDivElement
  state: { clicks: number }
} {
  const state = { clicks: 0 }

  document.body.innerHTML = `
    <div class="relative flex h-full flex-col">
      <div class="border-b border-(--ui-stroke-secondary)"></div>
      <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div class="grid grid-cols-[minmax(0,1fr)] gap-1.5 px-2.5 pb-2" id="grid">
          <div class="group flex items-start gap-2 px-2 py-1"><span>Orchestrator</span></div>
          ${options.composer ? '<form class="grid gap-0 px-2 pb-1"><textarea aria-label="Reply in thread"></textarea></form>' : ''}
          ${options.composer ? '' : '<button data-variant="link" type="button" id="replylink">Reply in thread</button>'}
        </div>
      </div>
    </div>
  `

  const grid = document.getElementById('grid') as HTMLDivElement
  const link = document.getElementById('replylink')

  if (link) {
    link.addEventListener('click', () => {
      state.clicks += 1
      link.replaceWith(Object.assign(document.createElement('form'), { className: 'grid gap-0 px-2 pb-1' }))
    })
  }

  if (options.hidden) {
    grid.closest('.relative')!.setAttribute('data-pane-hidden', '')
  }

  return { grid, state }
}

describe('seatThreadComposers', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('clicks the newest reply link in a room without a composer', () => {
    const { grid, state } = buildRoomDom({})

    expect(seatThreadComposers(document)).toBe(1)
    expect(state.clicks).toBe(1)
    expect(grid.querySelector('form')).not.toBeNull()
  })

  it('leaves rooms that already have a composer seated', () => {
    const { state } = buildRoomDom({ composer: true })

    expect(seatThreadComposers(document)).toBe(0)
    expect(state.clicks).toBe(0)
  })

  it('skips seats in hidden pane layers', () => {
    const { state } = buildRoomDom({ hidden: true })

    expect(seatThreadComposers(document)).toBe(0)
    expect(state.clicks).toBe(0)
  })

  it('returns focus to the element that held it before the seat', () => {
    buildRoomDom({})

    const holder = document.createElement('button')
    document.body.append(holder)
    holder.focus()
    expect(document.activeElement).toBe(holder)

    seatThreadComposers(document)

    // The composer's autoFocus lands after the seat; the behavior hands the
    // caret back on the following tick.
    const textarea = document.querySelector('form textarea') as HTMLTextAreaElement | null

    if (textarea) {
      textarea.focus()
    }

    vi.advanceTimersByTime(1)

    expect(document.activeElement).toBe(holder)
  })

  it('matches both anchors against the room shape', () => {
    buildRoomDom({})

    expect(document.querySelectorAll(LOG_GRID_SELECTOR)).toHaveLength(1)
    expect(document.querySelectorAll(REPLY_LINK_SELECTOR)).toHaveLength(1)
  })
})

describe('installThreadComposerSeat', () => {
  let disposer: (() => void) | null = null

  beforeEach(() => {
    document.body.innerHTML = ''
    vi.useFakeTimers()
  })

  afterEach(() => {
    disposer?.()
    disposer = null
    vi.useRealTimers()
  })

  const fakeCtx = {
    onDispose: (fn: () => void) => {
      disposer = fn
    },
    register: () => () => {},
    registerMany: () => () => {},
    source: 'plugin:lumen'
  }

  it('seats once when a room mounts without a composer', () => {
    const { state } = buildRoomDom({})

    installThreadComposerSeat(fakeCtx as never)
    vi.advanceTimersByTime(300)

    expect(state.clicks).toBe(1)
  })

  it('stops seating after dispose', () => {
    installThreadComposerSeat(fakeCtx as never)
    disposer!()

    const { state } = buildRoomDom({})
    vi.advanceTimersByTime(300)

    expect(state.clicks).toBe(0)
  })
})
