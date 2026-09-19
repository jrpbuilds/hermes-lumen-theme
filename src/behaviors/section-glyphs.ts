/**
 * Give the sessions sidebar's icon-less sections real glyphs, theme-side.
 *
 * The app's SidebarPanelLabel leads every section with a little dither
 * square; messaging sections swap that for a platform avatar while the rest
 * (Pinned, Cron jobs, Sessions, …) keep the bare square. This behavior
 * injects a matching codicon into the square — the clarity layer shapes it
 * into a chip the size of the platform avatars. Labels are matched against
 * the app's shipped sidebar strings; unknown labels keep the plain square
 * unless the sessions sidebar is showing an entered project.
 */

import type { PluginContext } from '../types/plugin-contract'

/** Normalized section labels → codicon across the app's shipped locales. */
export const SECTION_ICONS: Record<string, string> = {
  results: 'search',
  pinned: 'pin',
  'cron jobs': 'watch',
  sessions: 'comment-discussion',
  projects: 'project',
  النتائج: 'search',
  المثبتة: 'pin',
  'المهام المجدولة': 'watch',
  الجلسات: 'comment-discussion',
  المشاريع: 'project',
  結果: 'search',
  ピン留め: 'pin',
  セッション: 'comment-discussion',
  cronジョブ: 'watch',
  プロジェクト: 'project',
  результаты: 'search',
  закреплённые: 'pin',
  'cron-задачи': 'watch',
  сеансы: 'comment-discussion',
  проекты: 'project',
  结果: 'search',
  已置顶: 'pin',
  会话: 'comment-discussion',
  定时任务: 'watch',
  项目: 'project',
  已釘選: 'pin',
  工作階段: 'comment-discussion',
  排程任務: 'watch',
  專案: 'project'
}

/** The section pill's label button — the only place a dither square leads. */
export const SECTION_HEADER_BUTTON_SELECTOR =
  "[data-tour='sessions-sidebar'] [data-sessions-mode] > [data-slot='sidebar-group'] > div:first-child button"

export const GLYPH_CLASS = 'lumen-section-glyph'

/** Dressed sections count. Unknown or icon-led sections are left alone. */
export function dressSectionGlyphs(root: Document | Element): number {
  let dressed = 0

  root.querySelectorAll(SECTION_HEADER_BUTTON_SELECTOR).forEach(button => {
    // The label span is the header button's first child exactly when no icon
    // precedes it, and the dither square is its lead child.
    const glyph = button.querySelector(`:scope > span:first-child > .dither`)

    if (!(glyph instanceof HTMLElement) || glyph.classList.contains(GLYPH_CLASS)) {
      return
    }

    const label = (button.querySelector('.min-w-0.truncate')?.textContent ?? '').trim().toLowerCase()
    const enteredProject = button.closest('[data-sessions-mode]')?.hasAttribute('data-sessions-project') ?? false
    const icon = SECTION_ICONS[label] ?? (enteredProject ? 'project' : undefined)

    if (!icon) {
      return
    }

    glyph.classList.add(GLYPH_CLASS)
    glyph.textContent = ''

    const codicon = document.createElement('i')
    codicon.className = `codicon codicon-${icon}`
    codicon.setAttribute('aria-hidden', 'true')
    glyph.append(codicon)
    dressed += 1
  })

  return dressed
}

/** Wire the dress pass; disposed with the plugin. */
export function installSectionGlyphs(ctx: PluginContext): void {
  if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') {
    return
  }

  let scheduled: ReturnType<typeof setTimeout> | null = null

  const run = (): void => {
    scheduled = null
    dressSectionGlyphs(document)
  }

  // Batches React re-renders into one pass per 100ms window.
  const schedule = (): void => {
    if (scheduled !== null) {
      return
    }

    scheduled = setTimeout(run, 100)
  }

  const observer = new MutationObserver(schedule)
  observer.observe(document.documentElement, { childList: true, subtree: true })

  // Sections already rendered when the plugin (re)loads, plus a settle pass
  // for the boot render the observer may have missed.
  dressSectionGlyphs(document)
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
