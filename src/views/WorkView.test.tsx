/**
 * WorkView unit tests (story 03-01).
 *
 * Covers: section heading (<h2> + eyebrow, no <h1>), the 2-col .work-grid of all
 * projects, and that activating a card invokes the supplied onOpen callback with
 * the right project.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageProvider } from '../i18n/LanguageProvider'
import { projects, localizeProjects } from '../content/projects'
import WorkView from './WorkView'

function renderWork(onOpen = vi.fn()) {
  return render(
    <LanguageProvider>
      <WorkView onOpen={onOpen} />
    </LanguageProvider>,
  )
}

describe('WorkView — section heading', () => {
  it('renders an <h2> with class section-title', () => {
    const { container } = renderWork()
    expect(container.querySelector('h2.section-title')).not.toBeNull()
  })

  it('renders an eyebrow', () => {
    const { container } = renderWork()
    expect(container.querySelector('.eyebrow')).not.toBeNull()
  })

  it('does not render an <h1>', () => {
    renderWork()
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull()
  })
})

describe('WorkView — grid', () => {
  it('renders a .work-grid container', () => {
    const { container } = renderWork()
    expect(container.querySelector('.work-grid')).not.toBeNull()
  })

  it('renders one .proj-card per project', () => {
    const { container } = renderWork()
    expect(container.querySelectorAll('.proj-card')).toHaveLength(
      projects.length,
    )
  })

  it('renders all nine projects', () => {
    const { container } = renderWork()
    expect(container.querySelectorAll('.proj-card')).toHaveLength(9)
  })
})

describe('WorkView — interaction', () => {
  it('calls onOpen with the project when a card is activated', () => {
    const onOpen = vi.fn()
    renderWork(onOpen)
    const cards = screen.getAllByRole('button')
    fireEvent.click(cards[0])
    expect(onOpen).toHaveBeenCalledTimes(1)
    expect(onOpen).toHaveBeenCalledWith(projects[0])
  })
})

// The grid sources its copy from the English baseline dataset; under fr it must
// render the localized descriptions, not English ones. (BUG-20260612-01)
describe('WorkView — localized copy (fr)', () => {
  beforeEach(() => localStorage.setItem('locale', 'fr'))
  afterEach(() => localStorage.clear())

  it('renders project descriptions in French, not the English baseline', () => {
    const { container } = renderWork()
    const frFirst = localizeProjects('fr')[0].desc
    expect(container.textContent).toContain(frFirst)
    expect(container.textContent).not.toContain(projects[0].desc)
  })

  it('opens a card with the localized (fr) project object', () => {
    const onOpen = vi.fn()
    renderWork(onOpen)
    fireEvent.click(screen.getAllByRole('button')[0])
    expect(onOpen).toHaveBeenCalledWith(localizeProjects('fr')[0])
  })
})
