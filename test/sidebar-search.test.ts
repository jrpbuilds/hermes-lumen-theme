/**
 * Behavioral tests for the sidebar-search focus fix, running under jsdom.
 */

// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'

import { findSearchInput, installSidebarSearchFocus } from '../src/behaviors/sidebar-search'

/**
 * The structural shape the behavior depends on:
 *
 *   [data-tour='sessions-sidebar']
 *     > [data-slot='sidebar-content']
 *       > div (outer)
 *         > div (wrapper) > input[type='text'] + svg
 */
function buildSidebarDom(): { input: HTMLInputElement; wrapper: HTMLDivElement } {
  document.body.innerHTML = `
    <div data-tour="sessions-sidebar">
      <div data-slot="sidebar-content">
        <div id="outer">
          <div id="wrapper">
            <input type="text" />
            <svg width="4" height="4"></svg>
          </div>
        </div>
      </div>
    </div>
  `

  const wrapper = document.getElementById('wrapper') as HTMLDivElement
  const input = wrapper.querySelector('input[type="text"]') as HTMLInputElement

  return { input, wrapper }
}

function pointerDown(target: Element): { prevented: boolean } {
  const event = new MouseEvent('pointerdown', { bubbles: true, cancelable: true })

  target.dispatchEvent(event)

  return { prevented: event.defaultPrevented }
}

describe('findSearchInput', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('resolves the input from anywhere inside the painted wrapper', () => {
    const { input, wrapper } = buildSidebarDom()

    expect(findSearchInput(wrapper.querySelector('svg'))).toBe(input)
    expect(findSearchInput(wrapper)).toBe(input)
  })

  it('returns null for interactive targets', () => {
    const { wrapper } = buildSidebarDom()

    wrapper.insertAdjacentHTML('afterbegin', '<button type="button">x</button>')
    const button = wrapper.querySelector('button')!

    expect(findSearchInput(button)).toBeNull()
    expect(findSearchInput(wrapper.querySelector('input'))).toBeNull()
  })

  it('returns null outside the sidebar or outside the wrapper depth', () => {
    const { wrapper } = buildSidebarDom()

    expect(findSearchInput(document.body)).toBeNull()

    // A sibling of the wrapper (inside `outer`) is not the painted field.
    const sibling = document.createElement('div')
    wrapper.parentElement!.append(sibling)

    expect(findSearchInput(sibling)).toBeNull()
  })

  it('ignores input-bearing divs at the wrong depth', () => {
    const { wrapper } = buildSidebarDom()

    // A div DIRECTLY under sidebar-content holding an input: right content,
    // wrong depth — the CSS selector requires `sidebar-content > div > div`.
    const shallow = document.createElement('div')
    const shallowInput = document.createElement('input')

    shallowInput.type = 'text'
    shallow.append(shallowInput)
    wrapper.closest('[data-slot="sidebar-content"]')!.prepend(shallow)

    expect(findSearchInput(shallow)).toBeNull()
  })
})

describe('installSidebarSearchFocus', () => {
  let disposer: (() => void) | null = null

  const fakeCtx = {
    onDispose: (fn: () => void) => {
      disposer = fn
    },
    register: () => () => {},
    registerMany: () => () => {},
    source: 'plugin:lumen'
  }

  beforeEach(() => {
    document.body.innerHTML = ''
    disposer?.()
    disposer = null
  })

  it('focuses the input and cancels the press on the painted wrapper', () => {
    const { input, wrapper } = buildSidebarDom()

    installSidebarSearchFocus(fakeCtx as never)

    const { prevented } = pointerDown(wrapper.querySelector('svg')!)

    expect(prevented).toBe(true)
    expect(document.activeElement).toBe(input)
  })

  it('leaves presses on interactive elements alone', () => {
    const { wrapper } = buildSidebarDom()

    wrapper.insertAdjacentHTML('afterbegin', '<button type="button">x</button>')
    const button = wrapper.querySelector('button')!

    installSidebarSearchFocus(fakeCtx as never)

    const { prevented } = pointerDown(button)

    expect(prevented).toBe(false)
    expect(document.activeElement).not.toBe(wrapper.querySelector('input'))
  })

  it('stops intercepting after dispose', () => {
    const { wrapper } = buildSidebarDom()

    installSidebarSearchFocus(fakeCtx as never)
    disposer!()

    const { prevented } = pointerDown(wrapper)

    expect(prevented).toBe(false)
  })
})
