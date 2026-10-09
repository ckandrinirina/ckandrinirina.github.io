/**
 * ProjectModal — the project detail overlay.
 *
 * Verbatim port of the "Atelier Terminal" project modal: a blurred `.modal-bg`
 * backdrop (click closes), a `.modal` card (stopPropagation) with a round
 * `.close` button, the inline-SVG `.art` header, then a `.modal-body` with the
 * num/category line, serif name, role·client·year meta, summary, a two-column
 * `.row` (My role / Impact), a "Stack" heading + `.stack` of token pills, and an
 * `.actions` row with a conditional "Visit live ↗" primary button and a "Close"
 * button.
 *
 * A controlled component: App (04-01) owns the open state by passing the active
 * `project` (or `null`). The live app's a11y contract is preserved on top of the
 * reference visuals: `role="dialog"` + `aria-modal`, Escape + backdrop close,
 * body-scroll lock, focus moved to the close button on open and restored to the
 * trigger on close, and a Tab/Shift+Tab focus trap.
 *
 * SOLID notes:
 *   - S: renders detail UI only; open state is owned by the parent.
 *   - I: narrow contract — `{ project | null, onClose, returnFocusRef? }`.
 *   - D: depends on the `Project` type, not on concrete data.
 */

import { useEffect, useRef, type RefObject } from 'react'
import { useLanguage } from '../../i18n/useLanguage'
import type { Project } from '../../content/types'
import ProjectMedia from './ProjectMedia'

export interface ProjectModalProps {
  /** The project to show, or null when the modal is closed. */
  project: Project | null
  /** Close the modal (Escape, backdrop, or close button). */
  onClose: () => void
  /** Element to restore focus to when the modal closes (the triggering card). */
  returnFocusRef?: RefObject<HTMLElement | null>
}

export default function ProjectModal({
  project,
  onClose,
  returnFocusRef,
}: ProjectModalProps) {
  const { t } = useLanguage()
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)

  // Keep keyboard focus inside the modal: Tab / Shift+Tab cycle through the
  // dialog's focusable controls (close button + the action links) and wrap at
  // the ends. Focus is moved in on open and restored to the trigger on close.
  function trapTabFocus(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'Tab') return
    const root = dialogRef.current
    if (!root) return
    const focusables = root.querySelectorAll<HTMLElement>(
      'button, a[href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
    )
    if (focusables.length === 0) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    const active = document.activeElement
    if (e.shiftKey && active === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && active === last) {
      e.preventDefault()
      first.focus()
    }
  }

  // Lock body scroll + move focus into the modal while a project is shown.
  useEffect(() => {
    if (!project) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    // Capture the trigger element now; the ref may point elsewhere by cleanup.
    const triggerEl = returnFocusRef?.current

    return () => {
      document.body.style.overflow = previousOverflow
      // Restore focus to the trigger (the card that opened the modal).
      triggerEl?.focus()
    }
  }, [project, returnFocusRef])

  // Close on Escape while open.
  useEffect(() => {
    if (!project) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [project, onClose])

  if (!project) return null

  const { detail } = project
  const stackTokens = detail.stack.split(' · ').filter((s) => s.trim())

  return (
    <div
      className="modal-bg open"
      data-testid="modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={project.name}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={trapTabFocus}
      >
        <button
          ref={closeRef}
          type="button"
          className="close"
          aria-label={t('modalCloseAria')}
          onClick={onClose}
        >
          ×
        </button>

        <div className="art">
          <ProjectMedia project={project} />
        </div>

        <div className="modal-body">
          <div className="num">
            {project.num} · {project.category}
          </div>
          <div className="name">{project.name}</div>
          <div className="meta">
            {project.role} · {project.client} · {project.year}
          </div>
          <div className="desc">{project.desc}</div>

          <div className="row">
            <div className="col">
              <h4>{t('modalRole')}</h4>
              <p>{detail.role}</p>
            </div>
            <div className="col">
              <h4>{t('modalImpact')}</h4>
              <p>{detail.impact}</p>
            </div>
          </div>

          <h4 className="stack-label">{t('modalStack')}</h4>
          <div className="stack">
            {stackTokens.map((token, i) => (
              <span key={i}>{token}</span>
            ))}
          </div>

          <div className="actions">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
              >
                {t('visitLive')} <span className="arrow">↗</span>
              </a>
            )}
            <button type="button" className="btn" onClick={onClose}>
              {t('modalClose')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
