/**
 * Sidebar.test.tsx — Unit tests for the Sidebar layout chrome component.
 *
 * Tests cover:
 * - <aside> landmark rendering
 * - grouped nav rows (glyph + label + optional badge)
 * - active route marking
 * - navigate callback on row click
 * - desktop-only status block presence
 * - ThemeSwitcher and LanguageSwitcher rendering
 * - keyboard accessibility (focusable rows, aria-hidden glyphs)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '../../theme/ThemeProvider'
import { LanguageProvider } from '../../i18n/LanguageProvider'
import Sidebar from './Sidebar'
import { ROUTE_ORDER } from '../../lib/constants'
import { projects } from '../../content/projects'

function renderSidebar(
  route = 'home',
  navigate = vi.fn(),
  onOpenCmdK = vi.fn(),
) {
  return render(
    <ThemeProvider>
      <LanguageProvider>
        <Sidebar route={route} navigate={navigate} onOpenCmdK={onOpenCmdK} />
      </LanguageProvider>
    </ThemeProvider>,
  )
}

describe('Sidebar', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.lang = ''
    vi.stubGlobal('navigator', { ...navigator, language: 'de' })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  // ── AC 1: <aside> landmark with <nav> ──────────────────────────────────────
  it('renders an <aside> landmark', () => {
    renderSidebar()
    expect(screen.getByRole('complementary')).toBeInTheDocument()
  })

  it('renders a <nav> inside the aside', () => {
    renderSidebar()
    const aside = screen.getByRole('complementary')
    expect(within(aside).getByRole('navigation')).toBeInTheDocument()
  })

  // ── AC 1: nav groups in documented order ──────────────────────────────────
  it('renders both nav groups: workspace and connect', () => {
    renderSidebar()
    // Group labels are rendered as visible text (workspace / connect)
    expect(screen.getByText(/workspace/i)).toBeInTheDocument()
    expect(screen.getByText(/connect/i)).toBeInTheDocument()
  })

  it('renders all routes from ROUTE_ORDER', () => {
    renderSidebar()
    // Every route id in ROUTE_ORDER should produce a focusable row
    for (const id of ROUTE_ORDER) {
      expect(screen.getByTestId(`nav-row-${id}`)).toBeInTheDocument()
    }
  })

  it('renders glyph and label for each nav row', () => {
    renderSidebar()
    const homeRow = screen.getByTestId('nav-row-home')
    // glyph has aria-hidden
    const glyph = homeRow.querySelector('[aria-hidden="true"]')
    expect(glyph).not.toBeNull()
    // label text is present
    expect(homeRow).toHaveTextContent(/.+/)
  })

  it('renders a badge for work row (badge = project count)', () => {
    renderSidebar()
    const workRow = screen.getByTestId('nav-row-work')
    expect(
      within(workRow).getByText(String(projects.length)),
    ).toBeInTheDocument()
  })

  // ── AC 2: active route marking ────────────────────────────────────────────
  it('marks the active route row with the "active" class', () => {
    renderSidebar('work')
    const workRow = screen.getByTestId('nav-row-work')
    expect(workRow.classList.contains('active')).toBe(true)
  })

  it('does not mark non-active rows with the "active" class', () => {
    renderSidebar('work')
    const homeRow = screen.getByTestId('nav-row-home')
    expect(homeRow.classList.contains('active')).toBe(false)
  })

  // ── AC 2: navigate callback on row click ──────────────────────────────────
  it('calls navigate with the route id on row click', async () => {
    const navigate = vi.fn()
    const user = userEvent.setup()
    renderSidebar('home', navigate)
    await user.click(screen.getByTestId('nav-row-work'))
    expect(navigate).toHaveBeenCalledWith('work')
  })

  it('all nav rows are focusable (button or anchor)', () => {
    renderSidebar()
    for (const id of ROUTE_ORDER) {
      const row = screen.getByTestId(`nav-row-${id}`)
      const tag = row.tagName.toLowerCase()
      expect(['button', 'a']).toContain(tag)
    }
  })

  // ── AC 3: desktop-only status block (status + region; theme/language and
  //          the "paired with" row now live in the Topbar / were removed) ────
  it('renders the status block with the status and region lines', () => {
    renderSidebar()
    expect(screen.getByTestId('sb-status')).toBeInTheDocument()
    expect(screen.getByTestId('sb-status-available')).toBeInTheDocument()
    expect(screen.getByTestId('sb-status-region')).toBeInTheDocument()
  })

  it('no longer renders the "paired with" status line', () => {
    renderSidebar()
    expect(screen.queryByTestId('sb-status-paired')).not.toBeInTheDocument()
  })

  it('status block contains a green availability dot', () => {
    renderSidebar()
    const dot = screen.getByTestId('sb-dot-available')
    expect(dot.classList.contains('sb-dot')).toBe(true)
  })

  it('does not render the theme/language switchers (they moved to the Topbar)', () => {
    renderSidebar()
    expect(
      screen.queryByRole('group', { name: /theme/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /langue|language/i }),
    ).toBeNull()
  })

  // ── AC 9: accessibility — glyphs are decorative ───────────────────────────
  it('nav glyphs have aria-hidden="true"', () => {
    renderSidebar()
    const homeRow = screen.getByTestId('nav-row-home')
    const glyph = homeRow.querySelector('[aria-hidden="true"]')
    expect(glyph).not.toBeNull()
  })

  it('nav rows have a visible text label as accessible name', () => {
    renderSidebar()
    // Each row must have non-empty text content beyond the glyph
    for (const id of ROUTE_ORDER) {
      const row = screen.getByTestId(`nav-row-${id}`)
      // The row's textContent should include the label text
      expect(row.textContent?.trim().length).toBeGreaterThan(0)
    }
  })
})
