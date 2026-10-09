/**
 * ExperienceView.test.tsx
 *
 * Tests for story 03-04 AC:
 * - Renders <h2> .section-title and eyebrow
 * - Renders all timeline entries in reverse-chronological order as .tl-items
 * - Each .tl-item has year, role, company, desc and stack chips with dot markers
 * - Revealable items carry .tl-item class (targeted by useScrollReveal)
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LanguageProvider } from '../i18n/LanguageProvider'
import ExperienceView from './ExperienceView'

function renderExperience() {
  return render(
    <LanguageProvider>
      <ExperienceView />
    </LanguageProvider>,
  )
}

describe('ExperienceView — section heading', () => {
  it('renders an <h2> element with class section-title', () => {
    const { container } = renderExperience()
    const h2 = container.querySelector('h2.section-title')
    expect(h2).not.toBeNull()
  })

  it('renders an eyebrow element above the section title', () => {
    const { container } = renderExperience()
    const eyebrow = container.querySelector('.eyebrow')
    expect(eyebrow).not.toBeNull()
  })

  it('does not render an <h1>', () => {
    renderExperience()
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull()
  })
})

describe('ExperienceView — timeline structure', () => {
  it('renders a .timeline container', () => {
    const { container } = renderExperience()
    expect(container.querySelector('.timeline')).not.toBeNull()
  })

  it('renders .tl-item elements for each timeline entry', () => {
    const { container } = renderExperience()
    const items = container.querySelectorAll('.tl-item')
    expect(items.length).toBeGreaterThanOrEqual(7)
  })

  it('renders items in reverse-chronological order (most recent first)', () => {
    const { container } = renderExperience()
    const items = container.querySelectorAll('.tl-item')
    // First item should contain 2025, last item should contain 2018
    expect(items[0].textContent).toContain('2025')
    expect(items[items.length - 1].textContent).toContain('2018')
  })
})

describe('ExperienceView — .tl-item content', () => {
  it('each .tl-item contains a .tl-year', () => {
    const { container } = renderExperience()
    const items = container.querySelectorAll('.tl-item')
    items.forEach((item) => {
      expect(item.querySelector('.tl-year')).not.toBeNull()
    })
  })

  it('each .tl-item contains a .tl-role', () => {
    const { container } = renderExperience()
    const items = container.querySelectorAll('.tl-item')
    items.forEach((item) => {
      expect(item.querySelector('.tl-role')).not.toBeNull()
    })
  })

  it('each .tl-item contains a .tl-co (company)', () => {
    const { container } = renderExperience()
    const items = container.querySelectorAll('.tl-item')
    items.forEach((item) => {
      expect(item.querySelector('.tl-co')).not.toBeNull()
    })
  })

  it('each .tl-item contains a .tl-desc (description)', () => {
    const { container } = renderExperience()
    const items = container.querySelectorAll('.tl-item')
    items.forEach((item) => {
      expect(item.querySelector('.tl-desc')).not.toBeNull()
    })
  })

  it('each .tl-item contains a .tl-stack with stack pills', () => {
    const { container } = renderExperience()
    const items = container.querySelectorAll('.tl-item')
    items.forEach((item) => {
      const stack = item.querySelector('.tl-stack')
      expect(stack).not.toBeNull()
      expect(stack!.querySelectorAll('span').length).toBeGreaterThan(0)
    })
  })

  it('each .tl-item company carries the muted .at prefix span', () => {
    const { container } = renderExperience()
    const items = container.querySelectorAll('.tl-item')
    items.forEach((item) => {
      expect(item.querySelector('.tl-co .at')).not.toBeNull()
    })
  })

  it('renders company names from timeline data', () => {
    const { container } = renderExperience()
    const companies = Array.from(container.querySelectorAll('.tl-co')).map(
      (el) => el.textContent ?? '',
    )
    expect(companies.some((c) => /SOKA · YAS Madagascar/i.test(c))).toBe(true)
    expect(companies.some((c) => /Ingenosya/i.test(c))).toBe(true)
  })
})

describe('ExperienceView — scroll-reveal classes', () => {
  it('.tl-item elements carry the class targeted by useScrollReveal', () => {
    const { container } = renderExperience()
    const items = container.querySelectorAll('.tl-item')
    expect(items.length).toBeGreaterThan(0)
  })
})

describe('ExperienceView — title reveal', () => {
  it('blurs the section title in via data-reveal', () => {
    const { container } = renderExperience()
    const title = container.querySelector('h2.section-title')
    expect(title).toHaveClass('reveal')
    expect(title).toHaveAttribute('data-reveal', 'blur')
  })
})
