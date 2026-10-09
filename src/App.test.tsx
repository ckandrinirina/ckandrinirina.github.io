/**
 * App integration tests (04-01).
 *
 * Drives the assembled Atelier Terminal shell: route navigation via every input
 * source (sidebar, ⌘K, hash, arrow keys, wheel gesture), the re-keyed view
 * shell, the command palette, and the project modal. Queries by role / testid
 * (locale-independent) and wraps App in the real Theme + Language providers.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { ThemeProvider } from './theme/ThemeProvider'
import { LanguageProvider } from './i18n/LanguageProvider'

function renderApp() {
  return render(
    <ThemeProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ThemeProvider>,
  )
}

/** The scrollable view-inner the navigation hooks read for boundary checks. */
function viewInner(container: HTMLElement): HTMLElement {
  const el = container.querySelector<HTMLElement>('.view-inner')
  if (!el) throw new Error('.view-inner not found')
  return el
}

beforeEach(() => {
  // Reset hash + storage so each test starts from a clean route/locale.
  window.history.replaceState(null, '', window.location.pathname)
  localStorage.clear()
})

describe('App shell structure', () => {
  // AC: renders <aside> (Sidebar), <main>, and the chrome.
  it('renders the sidebar (complementary) and main landmarks', () => {
    const { container } = renderApp()
    expect(container.querySelector('aside.sidebar')).not.toBeNull()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(container.querySelector('.topbar')).not.toBeNull()
  })

  // AC: overlays start closed.
  it('renders no command palette or project modal initially', () => {
    renderApp()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  // AC: teardown — no old banner/contentinfo landmarks remain.
  it('renders no <header> banner or <footer> contentinfo (old design gone)', () => {
    renderApp()
    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument()
  })

  // AC: the re-keyed .view carries a view-enter animation class.
  it('renders the .view container with an enter-direction class', () => {
    const { container } = renderApp()
    const view = container.querySelector('.view')
    expect(view).not.toBeNull()
    expect(view!.className).toMatch(/view-enter-(down|up)/)
  })
})

describe('Default route', () => {
  // AC: empty hash defaults to home (HomeView owns the only <h1>).
  it('renders HomeView (the single <h1>) for an empty hash', () => {
    renderApp()
    expect(document.querySelectorAll('h1')).toHaveLength(1)
  })

  // AC: an unknown hash also defaults to home.
  it('falls back to home for an unknown hash', () => {
    window.history.replaceState(null, '', '#totally-unknown')
    renderApp()
    expect(document.querySelector('h1')).not.toBeNull()
  })

  // AC: a valid initial hash renders that view.
  it('honours a valid initial hash (#work renders the project grid)', () => {
    window.history.replaceState(null, '', '#work')
    const { container } = renderApp()
    expect(container.querySelectorAll('.proj-card')).toHaveLength(9)
  })
})

describe('Sidebar navigation', () => {
  // AC: clicking a sidebar row navigates to that route.
  it('navigates to work when the work row is clicked', async () => {
    const user = userEvent.setup()
    const { container } = renderApp()
    await user.click(screen.getByTestId('nav-row-work'))
    expect(container.querySelectorAll('.proj-card')).toHaveLength(9)
    expect(document.querySelector('h1')).toBeNull() // left home
  })

  // AC: on nav, the hash updates via history.replaceState.
  it('updates the hash to the destination route', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByTestId('nav-row-skills'))
    expect(window.location.hash).toBe('#skills')
  })

  // AC: breadcrumb reflects the active route (from ROUTE_META).
  it('updates the topbar breadcrumb on navigation', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByTestId('nav-row-work'))
    expect(screen.getByTestId('tb-breadcrumb')).toHaveTextContent(
      'selected-work',
    )
  })

  // AC: active row gets aria-current="page".
  it('marks the active sidebar row with aria-current', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByTestId('nav-row-contact'))
    expect(screen.getByTestId('nav-row-contact')).toHaveAttribute(
      'aria-current',
      'page',
    )
  })
})

describe('Keyboard & wheel navigation', () => {
  // AC: ArrowDown at the bottom boundary advances to the next route.
  it('ArrowDown advances home → work', async () => {
    const user = userEvent.setup()
    const { container } = renderApp()
    await user.keyboard('{ArrowDown}')
    expect(container.querySelectorAll('.proj-card')).toHaveLength(9)
  })

  // AC: a wheel gesture past threshold at the boundary advances the route.
  it('a downward wheel gesture advances home → work', () => {
    const { container } = renderApp()
    fireEvent.wheel(viewInner(container), { deltaY: 120 })
    expect(container.querySelectorAll('.proj-card')).toHaveLength(9)
  })

  // AC: navigation locks (850ms) — a second immediate gesture is ignored.
  it('locks re-entrant navigation during the animation window', () => {
    const { container } = renderApp()
    fireEvent.wheel(viewInner(container), { deltaY: 120 }) // home → work
    fireEvent.wheel(viewInner(container), { deltaY: 120 }) // locked, ignored
    // Still on work (not advanced to experience).
    expect(screen.getByTestId('tb-breadcrumb')).toHaveTextContent(
      'selected-work',
    )
  })
})

describe('Hash-driven navigation', () => {
  // AC: a hashchange event drives navigation.
  it('navigates when the hash changes externally', () => {
    const { container } = renderApp()
    window.history.replaceState(null, '', '#skills')
    fireEvent(window, new HashChangeEvent('hashchange'))
    // Skills view renders skill cards.
    expect(container.querySelector('.skill-cards')).not.toBeNull()
  })
})

describe('Command palette (⌘K)', () => {
  // AC: ⌘K opens the palette.
  it('opens the palette on ⌘K', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.keyboard('{Meta>}k{/Meta}')
    expect(
      screen.getByRole('dialog', { name: /command palette/i }),
    ).toBeInTheDocument()
  })

  // AC: the topbar button opens the palette.
  it('opens the palette from the topbar ⌘K button', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByTestId('tb-cmdk-btn'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  // AC: a Navigation command navigates and closes the palette.
  it('runs a navigation command and closes', async () => {
    const user = userEvent.setup()
    const { container } = renderApp()
    await user.click(screen.getByTestId('tb-cmdk-btn'))
    const dialog = screen.getByRole('dialog')
    // Click the "work" navigation option.
    await user.click(within(dialog).getByText(/selected work|projets/i))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(container.querySelectorAll('.proj-card')).toHaveLength(9)
  })

  // AC: a Quick action runs (language toggle flips <html lang>).
  it('runs the language-toggle quick action', async () => {
    localStorage.setItem('locale', 'fr')
    const user = userEvent.setup()
    renderApp()
    expect(document.documentElement.lang).toBe('fr')
    await user.click(screen.getByTestId('tb-cmdk-btn'))
    const dialog = screen.getByRole('dialog')
    // Filter to the language item to disambiguate, then run it.
    await user.type(within(dialog).getByRole('combobox'), 'language')
    await user.keyboard('{Enter}')
    expect(document.documentElement.lang).toBe('en')
  })

  // AC: the copyEmail quick action writes the email to the clipboard.
  // userEvent.setup() installs its own clipboard stub on navigator, so we
  // assert through it (readText) rather than spying on writeText.
  it('runs the copy-email quick action', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByTestId('tb-cmdk-btn'))
    const dialog = screen.getByRole('dialog')
    // "clipboard" only matches the copyEmail description/searchText.
    await user.type(within(dialog).getByRole('combobox'), 'clipboard')
    await user.keyboard('{Enter}')
    await expect(navigator.clipboard.readText()).resolves.toBe(
      'ckandrinirina@gmail.com',
    )
  })

  // AC: the whatsapp quick action opens the chat link in a new tab.
  it('runs the whatsapp quick action', async () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null)
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByTestId('tb-cmdk-btn'))
    const dialog = screen.getByRole('dialog')
    // "open whatsapp" disambiguates from the Contact nav item (whose
    // description mentions "WhatsApp" but not "open").
    await user.type(within(dialog).getByRole('combobox'), 'open whatsapp')
    await user.keyboard('{Enter}')
    expect(open).toHaveBeenCalledWith(
      'https://wa.me/261385096664',
      '_blank',
      'noopener',
    )
    open.mockRestore()
  })
})

describe('Project modal', () => {
  // AC: opening a project from a card sets the modal; closing clears it.
  it('opens the modal from a project card and closes it', async () => {
    const user = userEvent.setup()
    window.history.replaceState(null, '', '#work')
    const { container } = renderApp()
    const firstCard = container.querySelector<HTMLElement>('.proj-card')!
    await user.click(firstCard)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    await user.click(within(dialog).getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  // AC: a cmdk Projects item opens the modal.
  it('opens the modal from a command-palette project item', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByTestId('tb-cmdk-btn'))
    const dialog = screen.getByRole('dialog')
    await user.type(within(dialog).getByRole('combobox'), 'soka club')
    await user.keyboard('{Enter}')
    expect(
      screen.getByRole('dialog', { name: /soka club/i }),
    ).toBeInTheDocument()
  })
})

describe('Custom cursor overlay', () => {
  // AC: the Cursor overlay mounts (jsdom matchMedia → fine pointer).
  it('renders the custom cursor dot', () => {
    renderApp()
    expect(screen.getByTestId('cursor-dot')).toBeInTheDocument()
  })
})
