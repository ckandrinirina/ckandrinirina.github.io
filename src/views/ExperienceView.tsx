/**
 * ExperienceView — timeline of professional roles.
 *
 * Verbatim port of the "Atelier Terminal" Experience view: an `.eyebrow`, a
 * serif `.section-title` with an accent `.mark` span, a `.section-sub`, then a
 * `.timeline` of `.tl-item` rows (year / role / company / desc / stack pills).
 * Reads `content.timeline` + the editorial header labels from useLanguage().
 * Each `.tl-item` is targeted by useScrollReveal (and carries a `stg-N` stagger
 * class mirroring the reference).
 */

import { useLanguage } from '../i18n/useLanguage'
import type { TimelineEntry } from '../content/types'

// ---------------------------------------------------------------------------
// Sub-component: one timeline entry
// ---------------------------------------------------------------------------

type TlItemProps = {
  entry: TimelineEntry
  /** 1-based stagger position (capped at 8 like the reference). */
  stagger: number
  /** Localised "at" prefix before the company name. */
  atLabel: string
}

function TlItem({ entry, stagger, atLabel }: TlItemProps) {
  return (
    <div className={`tl-item stg-${stagger}`}>
      <div className="tl-year">{entry.year}</div>
      <div className="tl-role">{entry.role}</div>
      <div className="tl-co">
        <span className="at">{atLabel}</span> {entry.company}
      </div>
      <div className="tl-desc">{entry.desc}</div>
      <div className="tl-stack">
        {entry.stack.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// View
// ---------------------------------------------------------------------------

export default function ExperienceView() {
  const { content, t } = useLanguage()

  return (
    <div className="view-inner">
      <p className="eyebrow">{t('eyebrowExperience')}</p>
      <h2 className="section-title reveal" data-reveal="blur">
        {t('experienceTitleLead')}
        <span className="mark">{t('experienceTitleMark')}</span>
        {t('experienceTitleTail')}
      </h2>
      <p className="section-sub">{t('experienceSub')}</p>

      <div className="timeline">
        {content.timeline.map((entry, i) => (
          <TlItem
            key={`${entry.year}-${entry.company}`}
            entry={entry}
            stagger={Math.min(i + 1, 8)}
            atLabel={t('experienceAt')}
          />
        ))}
      </div>
    </div>
  )
}
