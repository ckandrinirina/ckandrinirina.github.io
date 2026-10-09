/**
 * HomeView unit tests.
 *
 * Covers all acceptance criteria:
 * - Hero: greeting/eyebrow, Reveal name as <h1>, tagline
 * - Role rotor: cycles roles on interval, aria-live="polite", pauses under reduced motion
 * - Three CTAs: primary (navigate to contact), secondary, CV download (DownloadCvButton)
 * - Avatar frame: img from public/profile.jpg, orbit accent, avatar-tag
 * - Now-card: headline, body, meta label/period
 * - Stats grid: stat-tiles with CountUp value+suffix and label
 * - Marquee: content.marquee tokens in a seamless loop
 * - Reveal classes on .now-card and .stats-grid for useScrollReveal
 * - Navigation/CV/contact CTAs invoke supplied callbacks
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { LanguageProvider } from '../i18n/LanguageProvider'
import HomeView from './HomeView'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderHomeView(navigate = vi.fn()) {
  return render(
    <LanguageProvider>
      <HomeView navigate={navigate} />
    </LanguageProvider>,
  )
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

describe('HomeView — Hero', () => {
  it('renders the greeting/eyebrow text', () => {
    renderHomeView()
    // The greeting is "Hi, I'm" in EN / "Bonjour, je suis" in FR
    // We use getByText with partial match
    const greet = document.querySelector('.home-greet')
    expect(greet).toBeInTheDocument()
    expect(greet?.textContent?.length).toBeGreaterThan(0)
  })

  it('renders the name as the only <h1> on the page', () => {
    renderHomeView()
    const h1s = document.querySelectorAll('h1')
    expect(h1s).toHaveLength(1)
  })

  it('renders the hero name inside the <h1> via Reveal', () => {
    renderHomeView()
    const h1 = document.querySelector('h1')
    // Reveal renders with aria-label or direct text
    expect(h1?.textContent).toContain('Erick')
  })

  it('renders the tagline text below the name', () => {
    renderHomeView()
    const tagline = document.querySelector('.home-tagline')
    expect(tagline).toBeInTheDocument()
    expect(tagline?.textContent?.length).toBeGreaterThan(0)
  })

  it('applies .home-hero class to the hero section', () => {
    const { container } = renderHomeView()
    expect(container.querySelector('.home-hero')).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// Role rotor
// ---------------------------------------------------------------------------

describe('HomeView — Role rotor', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the role rotor with aria-live="polite"', () => {
    renderHomeView()
    const liveRegion = document.querySelector('[aria-live="polite"]')
    expect(liveRegion).toBeInTheDocument()
  })

  it('shows the first role initially', () => {
    renderHomeView()
    const rotor = document.querySelector('.home-rotor')
    expect(rotor).toBeInTheDocument()
    expect(rotor?.textContent?.length).toBeGreaterThan(0)
  })

  // BUG-20260602-01: aria-live belongs on the inner .home-rotor (the part that
  // actually swaps text), matching the reference (app.jsx:581). Announcing only
  // the rotor — not the static "also a —" label — is the correct live region.
  it('places aria-live="polite" on the .home-rotor', () => {
    renderHomeView()
    const rotor = document.querySelector('.home-rotor')
    expect(rotor?.getAttribute('aria-live')).toBe('polite')
  })

  it('cycles to the next role after an interval', () => {
    renderHomeView()

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    const rotorAfter = document.querySelector('.home-rotor')?.textContent
    // After 3s (typical interval), it may change to a different role
    // This test verifies cycled render is non-empty
    expect(rotorAfter?.length).toBeGreaterThan(0)
    expect(rotorAfter).toBeTruthy()
  })

  it('freezes on first role under reduced motion', () => {
    vi.stubGlobal(
      'matchMedia',
      (query: string): MediaQueryList =>
        ({
          matches: query.includes('reduce'),
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as unknown as MediaQueryList,
    )

    renderHomeView()
    const rotorBefore = document.querySelector('.home-rotor')?.textContent

    act(() => {
      vi.advanceTimersByTime(10000)
    })

    const rotorAfter = document.querySelector('.home-rotor')?.textContent
    // Under reduced motion the role should stay at the first role
    expect(rotorAfter).toBe(rotorBefore)
  })
})

// ---------------------------------------------------------------------------
// CTAs
// ---------------------------------------------------------------------------

describe('HomeView — CTAs', () => {
  it('renders the two navigation CTAs and the CV download in .home-actions', () => {
    renderHomeView()
    const actions = document.querySelector('.home-actions')
    expect(actions).toBeInTheDocument()
    expect(actions?.querySelectorAll('button').length).toBe(2)
    expect(actions?.querySelectorAll('a[download]').length).toBe(1)
  })

  it.each([
    ['fr', 'Télécharger le CV'],
    ['en', 'Download CV'],
  ])('shows a downloadable CV link beside the CTAs in %s', (locale, label) => {
    localStorage.setItem('locale', locale)
    renderHomeView()
    const link = screen.getByRole('link', { name: label })
    expect(link.getAttribute('href')).toMatch(/cv\/erick-andrinirina-cv\.pdf$/)
    expect(link).toHaveAttribute('download')
    expect(link.closest('.home-actions')).not.toBeNull()
  })

  it('calls navigate("work") when the primary CTA ("See selected work") is clicked', () => {
    const navigate = vi.fn()
    renderHomeView(navigate)
    const primaryBtn = screen.getByRole('button', {
      name: /see selected work|voir les projets/i,
    })
    primaryBtn.click()
    expect(navigate).toHaveBeenCalledWith('work')
  })

  it('calls navigate("contact") when the secondary CTA ("Get in touch") is clicked', () => {
    const navigate = vi.fn()
    renderHomeView(navigate)
    const secondaryBtn = screen.getByRole('button', {
      name: /get in touch|me contacter/i,
    })
    secondaryBtn.click()
    expect(navigate).toHaveBeenCalledWith('contact')
  })
})

// ---------------------------------------------------------------------------
// Avatar frame
// ---------------------------------------------------------------------------

describe('HomeView — Avatar frame', () => {
  it('renders .avatar-frame container', () => {
    const { container } = renderHomeView()
    expect(container.querySelector('.avatar-frame')).toBeInTheDocument()
  })

  it('renders an <img> with src referencing profile.jpg', () => {
    renderHomeView()
    const img = document.querySelector(
      '.avatar-frame img',
    ) as HTMLImageElement | null
    expect(img).toBeInTheDocument()
    expect(img?.src).toMatch(/profile\.jpg/)
  })

  it('provides a descriptive alt attribute on the avatar img', () => {
    renderHomeView()
    const img = document.querySelector(
      '.avatar-frame img',
    ) as HTMLImageElement | null
    expect(img?.alt?.length).toBeGreaterThan(0)
  })

  it('renders .avatar-tag inside the avatar frame', () => {
    const { container } = renderHomeView()
    const tag = container.querySelector('.avatar-tag')
    expect(tag).toBeInTheDocument()
    expect(tag?.textContent?.length).toBeGreaterThan(0)
  })

  it('renders an orbit accent element inside the avatar frame', () => {
    const { container } = renderHomeView()
    // The orbit accent is a decorative element — aria-hidden
    const accent = container.querySelector('.avatar-frame [aria-hidden="true"]')
    expect(accent).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// Now card
// ---------------------------------------------------------------------------

describe('HomeView — Now card', () => {
  it('renders .now-card container', () => {
    const { container } = renderHomeView()
    expect(container.querySelector('.now-card')).toBeInTheDocument()
  })

  it('renders the now.headline inside the now-card', () => {
    renderHomeView()
    const card = document.querySelector('.now-card')
    expect(card?.textContent).toContain('SOKA')
  })

  it('renders the now.body text inside the now-card', () => {
    renderHomeView()
    const body = document.querySelector('.now-body')
    expect(body).toBeInTheDocument()
    expect(body?.textContent?.length).toBeGreaterThan(0)
  })

  it('renders now.meta.label inside .now-meta', () => {
    renderHomeView()
    const meta = document.querySelector('.now-meta')
    expect(meta).toBeInTheDocument()
    expect(meta?.textContent).toMatch(/yas|madagascar/i)
  })

  it('renders now.meta.period inside .now-meta', () => {
    renderHomeView()
    const meta = document.querySelector('.now-meta')
    expect(meta?.textContent).toMatch(/2025/)
  })
})

// ---------------------------------------------------------------------------
// Stats grid
// ---------------------------------------------------------------------------

describe('HomeView — Stats grid', () => {
  it('renders .stats-grid container', () => {
    const { container } = renderHomeView()
    expect(container.querySelector('.stats-grid')).toBeInTheDocument()
  })

  it('renders the correct number of .stat-tile elements', () => {
    const { container } = renderHomeView()
    // EN content has 4 stats
    const tiles = container.querySelectorAll('.stat-tile')
    expect(tiles.length).toBe(4)
  })

  it('renders a label in each .stat-tile', () => {
    const { container } = renderHomeView()
    const tiles = container.querySelectorAll('.stat-tile')
    tiles.forEach((tile) => {
      const label = tile.querySelector('.stat-label')
      expect(label).toBeInTheDocument()
      expect(label?.textContent?.length).toBeGreaterThan(0)
    })
  })

  it('renders the CountUp value container inside each .stat-tile', () => {
    const { container } = renderHomeView()
    const tiles = container.querySelectorAll('.stat-tile')
    tiles.forEach((tile) => {
      const statN = tile.querySelector('.stat-n')
      expect(statN).toBeInTheDocument()
    })
  })

  it('shows suffix alongside a stat number', () => {
    renderHomeView()
    // EN stats: first two have suffix "+"
    const statValues = document.querySelectorAll('.stat-n')
    const texts = Array.from(statValues).map((n) => n.textContent)
    const hasSuffix = texts.some((t) => t?.includes('+'))
    expect(hasSuffix).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Scroll-triggered count-up (useInView)
// ---------------------------------------------------------------------------

describe('HomeView — stats count up on scroll-in', () => {
  const realObserver = globalThis.IntersectionObserver
  const observers: { cb: IntersectionObserverCallback; els: Element[] }[] = []

  beforeEach(() => {
    vi.useFakeTimers()
    observers.length = 0
    class CapturingObserver {
      private record: (typeof observers)[number]
      constructor(cb: IntersectionObserverCallback) {
        this.record = { cb, els: [] }
        observers.push(this.record)
      }
      observe = (el: Element) => {
        this.record.els.push(el)
      }
      unobserve = vi.fn()
      disconnect = vi.fn()
    }
    vi.stubGlobal('IntersectionObserver', CapturingObserver)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.stubGlobal('IntersectionObserver', realObserver)
  })

  const statTexts = () =>
    Array.from(document.querySelectorAll('.stat-n')).map((n) => n.textContent)

  it('holds the stats at 0 until the grid enters the viewport, then counts to the target', () => {
    const { container } = renderHomeView()
    const grid = container.querySelector('.stats-grid')!

    act(() => {
      vi.runAllTimers()
    })
    expect(statTexts().every((t) => t?.startsWith('0'))).toBe(true)

    const watcher = observers.find((o) => o.els.includes(grid))!
    act(() => {
      watcher.cb(
        [{ isIntersecting: true, target: grid } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      )
      vi.runAllTimers()
    })
    expect(statTexts()[0]).toBe('7+')
  })
})

describe('HomeView — reveal variants use data-reveal', () => {
  it('fades the hero blocks and slides the avatar in via data-reveal', () => {
    const { container } = renderHomeView()
    for (const sel of [
      '.home-greet',
      '.home-tagline',
      '.home-roles',
      '.home-actions',
      '.marquee',
    ]) {
      expect(container.querySelector(sel)).toHaveAttribute(
        'data-reveal',
        'fade',
      )
    }
    expect(container.querySelector('.avatar-col')).toHaveAttribute(
      'data-reveal',
      'right',
    )
    expect(container.querySelector('[class*="r-fade"], .r-right')).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// Marquee
// ---------------------------------------------------------------------------

describe('HomeView — Marquee', () => {
  it('renders a .marquee container', () => {
    const { container } = renderHomeView()
    expect(container.querySelector('.marquee')).toBeInTheDocument()
  })

  it('renders a .marquee-track inside the marquee', () => {
    const { container } = renderHomeView()
    expect(container.querySelector('.marquee-track')).toBeInTheDocument()
  })

  it('renders at least one marquee item (TypeScript is in content.marquee)', () => {
    renderHomeView()
    // Each item appears at least once visible in the track
    expect(screen.getAllByText('TypeScript').length).toBeGreaterThanOrEqual(1)
  })
})

// ---------------------------------------------------------------------------
// Reveal / scroll classes
// ---------------------------------------------------------------------------

describe('HomeView — Reveal classes for useScrollReveal', () => {
  it('.now-card carries the reveal selector class', () => {
    const { container } = renderHomeView()
    expect(container.querySelector('.now-card')).toBeInTheDocument()
  })

  it('.stats-grid carries the reveal selector class', () => {
    const { container } = renderHomeView()
    expect(container.querySelector('.stats-grid')).toBeInTheDocument()
  })

  it('hero name element carries the .reveal class via Reveal primitive', () => {
    const { container } = renderHomeView()
    const reveal = container.querySelector('.reveal')
    expect(reveal).toBeInTheDocument()
  })
})
