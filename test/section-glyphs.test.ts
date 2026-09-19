/**
 * Behavioral tests for the sessions sidebar's section glyphs, under jsdom.
 */

// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  dressSectionGlyphs,
  GLYPH_CLASS,
  installSectionGlyphs,
  SECTION_HEADER_BUTTON_SELECTOR,
  SECTION_ICONS
} from '../src/behaviors/section-glyphs'

const localizedSectionIcons = [
  ['النتائج', 'search'],
  ['المثبتة', 'pin'],
  ['الجلسات', 'comment-discussion'],
  ['المهام المجدولة', 'watch'],
  ['المشاريع', 'project'],
  ['結果', 'search'],
  ['ピン留め', 'pin'],
  ['セッション', 'comment-discussion'],
  ['cronジョブ', 'watch'],
  ['プロジェクト', 'project'],
  ['результаты', 'search'],
  ['закреплённые', 'pin'],
  ['сеансы', 'comment-discussion'],
  ['cron-задачи', 'watch'],
  ['проекты', 'project'],
  ['结果', 'search'],
  ['已置顶', 'pin'],
  ['会话', 'comment-discussion'],
  ['定时任务', 'watch'],
  ['项目', 'project'],
  ['已釘選', 'pin'],
  ['工作階段', 'comment-discussion'],
  ['排程任務', 'watch'],
  ['專案', 'project']
] as const

/**
 * The structural shape the behavior depends on: the sessions sidebar's
 * section pill headers — one icon-less section (Pinned), one Cron jobs
 * section, one with a platform avatar leading the label, and one with an
 * unknown label. SidebarPanelLabel renders the dither square before the
 * truncating label span.
 */
function buildSidebarDom({ inProject = false }: { inProject?: boolean } = {}): { buttons: NodeListOf<Element> } {
  document.body.innerHTML = `
    <div data-tour="sessions-sidebar">
      <div data-slot="sidebar-content" data-sessions-mode="">
        <div data-slot="sidebar-group">
          <div class="group/section flex items-center justify-between">
            <button type="button" id="pinned-btn">
              <span class="flex min-w-0 items-center gap-2 pl-2 text-[0.64rem] font-semibold uppercase">
                <span aria-hidden="true" class="dither inline-block size-2 shrink-0 rounded-[1px]"></span>
                <span class="min-w-0 truncate leading-none">Pinned</span>
              </span>
            </button>
          </div>
        </div>
        <div data-slot="sidebar-group">
          <div class="group/section flex items-center justify-between">
            <button type="button" id="cron-btn">
              <span class="flex min-w-0 items-center gap-2 pl-2 text-[0.64rem] font-semibold uppercase">
                <span aria-hidden="true" class="dither inline-block size-2 shrink-0 rounded-[1px]"></span>
                <span class="min-w-0 truncate leading-none">Cron Jobs</span>
              </span>
            </button>
          </div>
        </div>
        <div data-slot="sidebar-group">
          <div class="group/section flex items-center justify-between">
            <button type="button" id="channel-btn">
              <span class="avatar-chip"></span>
              <span class="flex min-w-0 items-center gap-2 pl-2 text-[0.64rem] font-semibold uppercase">
                <span aria-hidden="true" class="dither inline-block size-2 shrink-0 rounded-[1px]"></span>
                <span class="min-w-0 truncate leading-none">TELEGRAM</span>
              </span>
            </button>
          </div>
        </div>
        <div data-slot="sidebar-group">
          <div class="group/section flex items-center justify-between">
            <button type="button" id="other-btn">
              <span class="flex min-w-0 items-center gap-2 pl-2 text-[0.64rem] font-semibold uppercase">
                <span aria-hidden="true" class="dither inline-block size-2 shrink-0 rounded-[1px]"></span>
                <span class="min-w-0 truncate leading-none">Mystery Section</span>
              </span>
            </button>
          </div>
        </div>
      </div>
      ${
        inProject
          ? `
      <div data-slot="sidebar-content" data-sessions-mode="" data-sessions-project="proj_1">
        <div data-slot="sidebar-group">
          <div class="group/section flex items-center justify-between">
            <button type="button" id="entered-project-btn">
              <span class="flex min-w-0 items-center gap-2 pl-2 text-[0.64rem] font-semibold uppercase">
                <span aria-hidden="true" class="dither inline-block size-2 shrink-0 rounded-[1px]"></span>
                <span class="min-w-0 truncate leading-none">My Cool App</span>
              </span>
            </button>
          </div>
        </div>
      </div>`
          : ''
      }
    </div>
  `

  return { buttons: document.querySelectorAll(SECTION_HEADER_BUTTON_SELECTOR) }
}

describe('SECTION_ICONS', () => {
  it.each(localizedSectionIcons)('maps the %s label to the %s codicon', (label, icon) => {
    expect(SECTION_ICONS[label]).toBe(icon)
  })
})

describe('dressSectionGlyphs', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('matches the section header buttons against the replica', () => {
    const { buttons } = buildSidebarDom()

    expect(buttons).toHaveLength(4)
  })

  it('dresses icon-less sections whose label is known', () => {
    buildSidebarDom()

    expect(dressSectionGlyphs(document)).toBe(2)

    const pinned = document.querySelector('#pinned-btn .dither') as HTMLElement
    const cron = document.querySelector('#cron-btn .dither') as HTMLElement

    expect(pinned.classList).toContain(GLYPH_CLASS)
    expect(pinned.querySelector('.codicon-pin')).not.toBeNull()
    expect(cron.querySelector('.codicon-watch')).not.toBeNull()
  })

  it('uses the project icon for an unmapped entered-project label', () => {
    buildSidebarDom({ inProject: true })

    expect(dressSectionGlyphs(document)).toBe(3)

    const project = document.querySelector('#entered-project-btn .dither') as HTMLElement
    expect(project.classList).toContain(GLYPH_CLASS)
    expect(project.querySelector('.codicon-project')).not.toBeNull()
  })

  it('leaves icon-led sections and unknown labels alone', () => {
    buildSidebarDom()

    dressSectionGlyphs(document)

    const channel = document.querySelector('#channel-btn .dither') as HTMLElement
    const other = document.querySelector('#other-btn .dither') as HTMLElement

    expect(channel.classList).not.toContain(GLYPH_CLASS)
    expect(channel.querySelector('.codicon')).toBeNull()
    expect(other.classList).not.toContain(GLYPH_CLASS)
  })

  it('is idempotent', () => {
    buildSidebarDom()

    expect(dressSectionGlyphs(document)).toBe(2)
    expect(dressSectionGlyphs(document)).toBe(0)
  })
})

describe('installSectionGlyphs', () => {
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

  it('dresses a sidebar mounted after install', () => {
    installSectionGlyphs(fakeCtx as never)

    buildSidebarDom()
    vi.advanceTimersByTime(300)

    expect(document.querySelectorAll(`.${GLYPH_CLASS}`)).toHaveLength(2)
  })

  it('stops dressing after dispose', () => {
    installSectionGlyphs(fakeCtx as never)
    disposer!()

    buildSidebarDom()
    vi.advanceTimersByTime(300)

    expect(document.querySelectorAll(`.${GLYPH_CLASS}`)).toHaveLength(0)
  })
})
