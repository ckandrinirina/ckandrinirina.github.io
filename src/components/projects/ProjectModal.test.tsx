/**
 * ProjectModal unit tests (story 03-01).
 *
 * Covers: closed state renders nothing; open renders artwork + role/impact/stack;
 * action buttons render only when their links exist; Escape / backdrop / close
 * button all invoke onClose; body scroll locks while open and restores on close.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LanguageProvider } from '../../i18n/LanguageProvider'
import type { Project } from '../../content/types'
import ProjectModal from './ProjectModal'

const baseProject: Project = {
  id: 'soka',
  num: '01',
  name: 'SOKA Club',
  year: '2025',
  role: 'Lead Fullstack',
  client: 'YAS Madagascar',
  category: 'Platform · Web3',
  link: 'https://example.com',
  repo: 'https://github.com/example',
  desc: 'A great platform.',
  tags: ['Next.js', 'NestJS'],
  detail: {
    role: 'Lead fullstack engineer.',
    impact: 'Unified ticketing and commerce.',
    stack: 'Next.js · NestJS · PostgreSQL',
  },
}

function renderModal(project: Project | null, onClose = vi.fn()) {
  return render(
    <LanguageProvider>
      <ProjectModal project={project} onClose={onClose} />
    </LanguageProvider>,
  )
}

afterEach(() => {
  document.body.style.overflow = ''
})

describe('ProjectModal — open / closed', () => {
  it('renders nothing when project is null', () => {
    renderModal(null)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('renders a dialog with the project name when open', () => {
    renderModal(baseProject)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAttribute('aria-label', 'SOKA Club')
  })

  it('renders the project visual (screenshot or inline-SVG fallback)', () => {
    const { container } = renderModal(baseProject)
    expect(container.querySelector('.art img.shot, .art svg')).not.toBeNull()
  })
})

describe('ProjectModal — detail body', () => {
  it('renders the role, impact, and meta values', () => {
    renderModal(baseProject)
    expect(screen.getByText('Lead fullstack engineer.')).toBeInTheDocument()
    expect(
      screen.getByText('Unified ticketing and commerce.'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Lead Fullstack · YAS Madagascar · 2025'),
    ).toBeInTheDocument()
  })

  it('renders the stack as individual token pills', () => {
    const { container } = renderModal(baseProject)
    const pills = Array.from(container.querySelectorAll('.stack span')).map(
      (el) => el.textContent,
    )
    expect(pills).toEqual(['Next.js', 'NestJS', 'PostgreSQL'])
  })

  it('renders the My role / Impact column headings', () => {
    renderModal(baseProject)
    expect(screen.getByText('My role')).toBeInTheDocument()
    expect(screen.getByText('Impact')).toBeInTheDocument()
  })
})

describe('ProjectModal — action buttons', () => {
  it('renders a visit-live link when project.link exists', () => {
    const { container } = renderModal(baseProject)
    const link = container.querySelector(
      '.actions a[href="https://example.com"]',
    )
    expect(link).not.toBeNull()
  })

  it('omits the visit-live link when link is null', () => {
    const { container } = renderModal({
      ...baseProject,
      link: null,
    })
    expect(container.querySelectorAll('.actions a')).toHaveLength(0)
  })

  it('always renders a Close action button', () => {
    renderModal(baseProject)
    const closeButtons = screen.getAllByRole('button', { name: /close/i })
    expect(closeButtons.length).toBeGreaterThanOrEqual(1)
  })
})

describe('ProjectModal — closing', () => {
  it('calls onClose when the round close (×) button is clicked', () => {
    const onClose = vi.fn()
    renderModal(baseProject, onClose)
    fireEvent.click(screen.getByRole('button', { name: /close dialog/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when the action Close button is clicked', () => {
    const onClose = vi.fn()
    renderModal(baseProject, onClose)
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when the backdrop is clicked', () => {
    const onClose = vi.fn()
    renderModal(baseProject, onClose)
    fireEvent.click(screen.getByTestId('modal-backdrop'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when the dialog body is clicked', () => {
    const onClose = vi.fn()
    renderModal(baseProject, onClose)
    fireEvent.click(screen.getByRole('dialog'))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn()
    renderModal(baseProject, onClose)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})

describe('ProjectModal — focus management (04-02)', () => {
  it('moves focus to the round close (×) button on open', () => {
    renderModal(baseProject)
    expect(screen.getByRole('button', { name: /close dialog/i })).toHaveFocus()
  })

  it('traps Tab focus inside the modal (wraps forward to the first element)', async () => {
    const user = userEvent.setup()
    // focusables in DOM order: round close (×), visit-live link, action Close
    renderModal(baseProject)
    const close = screen.getByRole('button', { name: /close dialog/i })
    expect(close).toHaveFocus()
    await user.tab() // → visit live
    await user.tab() // → action Close
    await user.tab() // → wraps back to round close
    expect(close).toHaveFocus()
  })

  it('wraps backward with Shift+Tab from the first element to the last', async () => {
    const user = userEvent.setup()
    renderModal(baseProject)
    expect(screen.getByRole('button', { name: /close dialog/i })).toHaveFocus()
    await user.tab({ shift: true }) // wraps to last focusable
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus()
  })
})

// The section headings and the two close controls were hardcoded English;
// they now resolve through t() so French renders translated. (BUG-20260612-01)
describe('ProjectModal — localized labels (fr)', () => {
  beforeEach(() => localStorage.setItem('locale', 'fr'))
  afterEach(() => localStorage.clear())

  it('renders the column headings and close controls in French', () => {
    renderModal(baseProject)
    expect(screen.getByText('Mon rôle')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Fermer' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /fermer la fenêtre/i }),
    ).toBeInTheDocument()
  })
})

describe('ProjectModal — body scroll lock', () => {
  it('locks body scroll while open and restores it on unmount', () => {
    const { unmount } = renderModal(baseProject)
    expect(document.body.style.overflow).toBe('hidden')
    unmount()
    expect(document.body.style.overflow).not.toBe('hidden')
  })
})
