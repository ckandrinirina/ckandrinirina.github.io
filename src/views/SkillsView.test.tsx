/**
 * SkillsView.test.tsx
 *
 * Tests for story 03-04 AC:
 * - Renders <h2> .section-title and eyebrow
 * - Renders a 2×2 grid of .skill-cards
 * - Each .skill-card has title, lead pills (.skill-pill), and secondary chips (.skill-chip)
 * - Revealable items carry .skill-card class
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LanguageProvider } from '../i18n/LanguageProvider'
import SkillsView from './SkillsView'

function renderSkills() {
  return render(
    <LanguageProvider>
      <SkillsView />
    </LanguageProvider>,
  )
}

describe('SkillsView — section heading', () => {
  it('renders an <h2> element with class section-title', () => {
    const { container } = renderSkills()
    expect(container.querySelector('h2.section-title')).not.toBeNull()
  })

  it('renders an eyebrow element', () => {
    const { container } = renderSkills()
    expect(container.querySelector('.eyebrow')).not.toBeNull()
  })

  it('does not render an <h1>', () => {
    renderSkills()
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull()
  })
})

describe('SkillsView — 2×2 grid structure', () => {
  it('renders a .skill-cards container', () => {
    const { container } = renderSkills()
    expect(container.querySelector('.skill-cards')).not.toBeNull()
  })

  it('renders exactly 4 .skill-card elements', () => {
    const { container } = renderSkills()
    const cards = container.querySelectorAll('.skill-card')
    expect(cards).toHaveLength(4)
  })
})

describe('SkillsView — .skill-card content', () => {
  it('each .skill-card has a .head with a .name title', () => {
    const { container } = renderSkills()
    const cards = container.querySelectorAll('.skill-card')
    cards.forEach((card) => {
      expect(card.querySelector('.head .name')).not.toBeNull()
    })
  })

  it('each .skill-card carries a data-deco watermark letter', () => {
    const { container } = renderSkills()
    const cards = container.querySelectorAll('.skill-card')
    cards.forEach((card) => {
      const deco = card.getAttribute('data-deco')
      expect(deco?.length).toBeGreaterThan(0)
    })
  })

  it('each .skill-card has a .head .count tools label', () => {
    const { container } = renderSkills()
    const cards = container.querySelectorAll('.skill-card')
    cards.forEach((card) => {
      const count = card.querySelector('.head .count')
      expect(count).not.toBeNull()
      expect(count!.textContent?.trim().length).toBeGreaterThan(0)
    })
  })

  it('each .skill-card has .lead-list solid pills', () => {
    const { container } = renderSkills()
    const cards = container.querySelectorAll('.skill-card')
    cards.forEach((card) => {
      const pills = card.querySelectorAll('.lead-list span')
      expect(pills.length).toBeGreaterThan(0)
    })
  })

  it('each .skill-card has .other-list outlined pills', () => {
    const { container } = renderSkills()
    const cards = container.querySelectorAll('.skill-card')
    cards.forEach((card) => {
      const chips = card.querySelectorAll('.other-list span')
      expect(chips.length).toBeGreaterThan(0)
    })
  })

  it('renders skill card titles from skillCards data', () => {
    // Use a locale-agnostic check: 4 non-empty .head .name elements
    const { container } = renderSkills()
    const titles = container.querySelectorAll('.head .name')
    expect(titles).toHaveLength(4)
    titles.forEach((titleEl) => {
      expect(titleEl.textContent?.trim().length).toBeGreaterThan(0)
    })
  })

  it('renders lead technologies in skill pills', () => {
    renderSkills()
    expect(screen.getByText('React 19')).toBeInTheDocument()
    expect(screen.getByText('Node.js')).toBeInTheDocument()
  })
})

describe('SkillsView — scroll-reveal classes', () => {
  it('.skill-card elements carry the class targeted by useScrollReveal', () => {
    const { container } = renderSkills()
    const cards = container.querySelectorAll('.skill-card')
    expect(cards.length).toBeGreaterThan(0)
  })
})
