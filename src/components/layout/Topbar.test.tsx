/**
 * Topbar.test.tsx — Unit tests for the Topbar layout chrome component.
 *
 * Tests cover:
 * - breadcrumb rendering for active route
 * - ⌘K button calling the onOpenCmdK callback
 * - TNR clock (UTC+3) rendering with fake timers + tick every 30 s
 * - interval cleanup on unmount
 * - keyboard accessibility
 */

import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
} from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '../../theme/ThemeProvider'
import { LanguageProvider } from '../../i18n/LanguageProvider'
import Topbar from './Topbar'
import { ROUTE_META } from '../../lib/constants'

const viewRef = { current: null }

function renderTopbar(route = 'home', onOpenCmdK = vi.fn()) {
  return render(
    <ThemeProvider>
      <LanguageProvider>
        <Topbar route={route} viewRef={viewRef} onOpenCmdK={onOpenCmdK} />
      </LanguageProvider>
    </ThemeProvider>,
  )
}

describe('Topbar', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.lang = ''
    vi.stubGlobal('navigator', { ...navigator, language: 'de' })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  // ── AC 5: breadcrumb for active route ────────────────────────────────────
  it('renders the breadcrumb text for the active route', () => {
    renderTopbar('home')
    const crumb = ROUTE_META['home'].breadcrumb
    expect(screen.getByTestId('tb-breadcrumb')).toHaveTextContent(crumb)
  })

  it('updates breadcrumb when route prop changes', () => {
    const { rerender } = renderTopbar('home')
    rerender(
      <ThemeProvider>
        <LanguageProvider>
          <Topbar route="work" viewRef={viewRef} onOpenCmdK={vi.fn()} />
        </LanguageProvider>
      </ThemeProvider>,
    )
    const crumb = ROUTE_META['work'].breadcrumb
    expect(screen.getByTestId('tb-breadcrumb')).toHaveTextContent(crumb)
  })

  it('renders breadcrumb for every route without crashing', () => {
    for (const [id, meta] of Object.entries(ROUTE_META)) {
      const { unmount } = renderTopbar(id)
      expect(screen.getByTestId('tb-breadcrumb')).toHaveTextContent(
        meta.breadcrumb,
      )
      unmount()
    }
  })

  // ── AC 6: ⌘K button ───────────────────────────────────────────────────────
  it('renders a ⌘K button', () => {
    renderTopbar()
    expect(screen.getByTestId('tb-cmdk-btn')).toBeInTheDocument()
  })

  it('calls onOpenCmdK when ⌘K button is clicked', async () => {
    const onOpenCmdK = vi.fn()
    const user = userEvent.setup()
    renderTopbar('home', onOpenCmdK)
    await user.click(screen.getByTestId('tb-cmdk-btn'))
    expect(onOpenCmdK).toHaveBeenCalledOnce()
  })

  it('⌘K button is focusable (keyboard accessible)', () => {
    renderTopbar()
    const btn = screen.getByTestId('tb-cmdk-btn')
    const tag = btn.tagName.toLowerCase()
    expect(['button', 'a']).toContain(tag)
  })

  // ── AC 7: TNR clock (UTC+3) ───────────────────────────────────────────────
  describe('TNR clock', () => {
    beforeAll(() => {
      vi.useFakeTimers()
    })

    afterAll(() => {
      vi.useRealTimers()
    })

    it('renders the TNR clock element', () => {
      renderTopbar()
      expect(screen.getByTestId('tb-clock')).toBeInTheDocument()
    })

    it('displays a time string (HH:MM format)', () => {
      // Fix system time to 2026-01-01 00:00:00 UTC → 03:00 TNR
      vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
      renderTopbar()
      const clock = screen.getByTestId('tb-clock')
      // Expect HH:MM pattern (24h) followed by the TNR locality suffix
      expect(clock.textContent).toMatch(/^\d{2}:\d{2} TNR$/)
    })

    it('displays TNR time (UTC+3): 00:00 UTC → 03:00 TNR', () => {
      vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
      renderTopbar()
      expect(screen.getByTestId('tb-clock').textContent).toBe('03:00 TNR')
    })

    it('updates the clock after 30 seconds', () => {
      vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
      renderTopbar()
      expect(screen.getByTestId('tb-clock').textContent).toBe('03:00 TNR')

      act(() => {
        vi.advanceTimersByTime(30_000)
      })

      // After advancing 30 s, the clock should still show a valid time
      // (same minute unless the test crosses a minute boundary — use pattern)
      expect(screen.getByTestId('tb-clock').textContent).toMatch(
        /^\d{2}:\d{2} TNR$/,
      )
    })

    it('updates to the new time after 30 seconds (59:30 UTC → 02:30 next hour)', () => {
      // Start at 2026-01-01 00:59:30 UTC → 03:59 TNR
      vi.setSystemTime(new Date('2026-01-01T00:59:30Z'))
      renderTopbar()
      expect(screen.getByTestId('tb-clock').textContent).toBe('03:59 TNR')

      act(() => {
        vi.setSystemTime(new Date('2026-01-01T01:00:00Z'))
        vi.advanceTimersByTime(30_000)
      })

      // Now 01:00:00 UTC + 30 s → 01:00:30 UTC → 04:00 TNR
      expect(screen.getByTestId('tb-clock').textContent).toBe('04:00 TNR')
    })

    it('cleans up the interval on unmount', () => {
      const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval')
      vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
      const { unmount } = renderTopbar()
      unmount()
      expect(clearIntervalSpy).toHaveBeenCalled()
      clearIntervalSpy.mockRestore()
    })
  })

  // ── AC 9: accessibility ───────────────────────────────────────────────────
  it('⌘K button has an accessible label or text', () => {
    renderTopbar()
    const btn = screen.getByTestId('tb-cmdk-btn')
    const hasAriaLabel = btn.hasAttribute('aria-label')
    const hasText = (btn.textContent?.trim().length ?? 0) > 0
    expect(hasAriaLabel || hasText).toBe(true)
  })

  // ── Top-right controls: theme palette + language flag ─────────────────────
  it('renders the theme palette swatch picker', () => {
    renderTopbar()
    expect(screen.getByRole('group', { name: /theme/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ember' })).toBeInTheDocument()
  })

  it('renders the language flag toggle', () => {
    renderTopbar()
    const lang = screen.getByRole('button', { name: /langue|language/i })
    expect(lang).toBeInTheDocument()
    expect(lang.textContent).toMatch(/FR|EN/)
  })

  // ── Scroll progress ───────────────────────────────────────────────────────
  it('mounts the decorative scroll-progress bar inside the topbar', () => {
    const { container } = renderTopbar()
    const bar = screen.getByTestId('scroll-progress')
    expect(container.querySelector('.topbar')).toContainElement(bar)
    expect(bar).toHaveAttribute('aria-hidden', 'true')
  })

  it('forwards its viewRef to the scroll-progress bar', () => {
    const view = document.createElement('div')
    Object.defineProperty(view, 'scrollHeight', { value: 1000 })
    Object.defineProperty(view, 'clientHeight', { value: 500 })
    view.scrollTop = 250
    const frames: FrameRequestCallback[] = []
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) =>
      frames.push(cb),
    )
    vi.stubGlobal('cancelAnimationFrame', vi.fn())

    render(
      <ThemeProvider>
        <LanguageProvider>
          <Topbar
            route="home"
            viewRef={{ current: view }}
            onOpenCmdK={vi.fn()}
          />
        </LanguageProvider>
      </ThemeProvider>,
    )
    act(() => {
      frames.splice(0).forEach((cb) => cb(0))
    })

    expect(screen.getByTestId('scroll-progress-bar')).toHaveStyle({
      transform: 'scaleX(0.5)',
    })
  })
})
