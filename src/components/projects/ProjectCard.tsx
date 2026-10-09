/**
 * ProjectCard — a single grid tile in the Work view.
 *
 * Verbatim port of the "Atelier Terminal" `.proj-card`: an `.art` header
 * (category tag top-left, year top-right, inline-SVG artwork) over a `.body`
 * with the num/client line, serif name, role meta, summary, up-to-4 tag pills
 * (+N overflow), and an `.actions` row ("Read case →" plus an optional
 * "· Visit live ↗" link).
 *
 * The whole tile is an activatable control: `role="button"` + `tabIndex={0}` so
 * it is keyboard operable (Enter / Space) and mouse-clickable, calling
 * `onOpen(project)`. The inner "Read case" button and "Visit live" link
 * stopPropagation so they don't double-fire the card handler.
 *
 * A native `<button>` is avoided on purpose: it would wrap the artwork/markup in
 * button semantics and double-fire on keyboard. A role="button" element gives a
 * single activation path we control explicitly.
 *
 * The `data-cursor` / `data-cursor-label` hooks let the custom Cursor (03-02)
 * switch to its labelled state over the card; the native focus ring is kept.
 */

import { useLanguage } from '../../i18n/useLanguage'
import type { Project } from '../../content/types'
import ProjectMedia from './ProjectMedia'

export interface ProjectCardProps {
  project: Project
  /** Open the detail modal for this project. App owns the modal state (04-01). */
  onOpen: (project: Project) => void
}

export default function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const { t } = useLanguage()

  function activate() {
    onOpen(project)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      activate()
    }
  }

  const extraTags = project.tags.length - 4

  return (
    <article
      className="proj-card"
      role="button"
      tabIndex={0}
      aria-label={`${project.name} — open project`}
      data-cursor
      data-cursor-label={t('readCase')}
      onClick={activate}
      onKeyDown={handleKeyDown}
    >
      <div className="art">
        <div className="art-tag">{project.category}</div>
        <div className="art-year">{project.year}</div>
        <ProjectMedia project={project} />
      </div>

      <div className="body">
        <div className="num">
          {project.num} · {project.client}
        </div>
        <div className="name">{project.name}</div>
        <div className="meta">
          <span className="role">{project.role}</span>
        </div>
        <div className="desc">{project.desc}</div>

        <div className="tags">
          {project.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
          {extraTags > 0 && <span className="tag">+{extraTags}</span>}
        </div>

        <div className="actions">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              activate()
            }}
          >
            {t('readCase')} <span>→</span>
          </button>
          {project.link && (
            <>
              <span className="sep">·</span>
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                {t('visitLive')} <span>↗</span>
              </a>
            </>
          )}
        </div>
      </div>
    </article>
  )
}
