/**
 * SkillsView — 2-column grid of skill cards.
 *
 * Verbatim port of the "Atelier Terminal" Skills view: an `.eyebrow`, a serif
 * `.section-title` with an accent `.mark` span, a `.section-sub` with `<strong>`
 * emphasis, then a `.skill-cards` grid of `.skill-card`s. Each card carries a
 * `data-deco` watermark letter (rendered via the CSS `::before`
 * `content: attr(data-deco)`), a `.head` with `.name` + `.count`, a `.lead-list`
 * of solid accent pills, and an `.other-list` of outlined pills.
 *
 * Reads `content.skillCards` + header labels from useLanguage(). Each
 * `.skill-card` is targeted by useScrollReveal and carries a `stg-N` stagger;
 * its tool count ticks up (CountUp via useInView) as the card scrolls into view.
 */

import { useLanguage } from '../i18n/useLanguage'
import CountUp from '../components/ui/CountUp'
import { useInView } from '../hooks/useInView'
import type { SkillCard } from '../content/types'

// ---------------------------------------------------------------------------
// Sub-component: one skill card
// ---------------------------------------------------------------------------

type SkillCardItemProps = {
  card: SkillCard
  /** 1-based stagger position. */
  stagger: number
  /** Localised noun after the tool count (e.g. "tools"). */
  toolsLabel: string
}

function SkillCardItem({ card, stagger, toolsLabel }: SkillCardItemProps) {
  const [countRef, inView] = useInView<HTMLSpanElement>()
  const total = card.lead.length + card.items.length

  return (
    <div className={`skill-card stg-${stagger}`} data-deco={card.deco}>
      <div className="head">
        <span className="name">{card.title}</span>
        <span className="count" ref={countRef}>
          <span className="sr-only">{`${total} ${toolsLabel}`}</span>
          <span aria-hidden="true">
            <CountUp to={total} inView={inView} duration={800} /> {toolsLabel}
          </span>
        </span>
      </div>
      <div className="lead-list">
        {card.lead.map((pill) => (
          <span key={pill}>{pill}</span>
        ))}
      </div>
      <div className="other-list">
        {card.items.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// View
// ---------------------------------------------------------------------------

export default function SkillsView() {
  const { content, t } = useLanguage()

  return (
    <div className="view-inner">
      <p className="eyebrow">{t('eyebrowSkills')}</p>
      <h2 className="section-title reveal" data-reveal="blur">
        {t('skillsTitleLead')}
        <span className="mark">{t('skillsTitleMark')}</span>
        {t('skillsTitleTail')}
      </h2>
      <p className="section-sub">
        {t('skillsSubLead')}
        <strong>{t('skillsSubStrong')}</strong>
        {t('skillsSubTail')}
      </p>

      <div className="skill-cards">
        {content.skillCards.map((card, i) => (
          <SkillCardItem
            key={card.title}
            card={card}
            stagger={i + 1}
            toolsLabel={t('skillsToolsLabel')}
          />
        ))}
      </div>
    </div>
  )
}
