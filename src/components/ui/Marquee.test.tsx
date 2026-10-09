import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Marquee from './Marquee'

const items = ['React', 'TypeScript', 'Vite', 'Tailwind']

describe('Marquee', () => {
  describe('default (motion enabled)', () => {
    it('renders all items', () => {
      render(<Marquee items={items} />)
      // Items are duplicated, so each text appears at least once
      expect(screen.getAllByText('React').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('TypeScript').length).toBeGreaterThanOrEqual(1)
    })

    it('duplicates the track for a seamless loop', () => {
      render(<Marquee items={items} />)
      // Each item should appear twice (original + duplicate)
      const reactItems = screen.getAllByText('React')
      expect(reactItems.length).toBe(2)
    })

    it('applies the marquee wrapper class for the edge mask', () => {
      const { container } = render(<Marquee items={items} />)
      expect(container.firstChild).toHaveClass('marquee')
    })

    // BUG-20260602-01: the marquee must carry the scroll-reveal hook so it
    // fades in on entrance like the rest of the home view. It uses the
    // `data-reveal` vocabulary rather than the superseded `.r-fade` class.
    it('opts into the fade reveal variant via data-reveal', () => {
      const { container } = render(<Marquee items={items} />)
      expect(container.firstChild).toHaveClass('reveal')
      expect(container.firstChild).toHaveAttribute('data-reveal', 'fade')
      expect(container.firstChild).not.toHaveClass('r-fade')
    })

    it('applies marquee-track class to the scrolling track', () => {
      const { container } = render(<Marquee items={items} />)
      const track = container.querySelector('.marquee-track')
      expect(track).toBeInTheDocument()
    })

    it('applies marquee-item class to each item', () => {
      const { container } = render(<Marquee items={items} />)
      const marqueeItems = container.querySelectorAll('.marquee-item')
      // 4 items × 2 (duplicated) = 8
      expect(marqueeItems.length).toBe(8)
    })

    it('marks duplicate items aria-hidden to avoid screen reader repetition', () => {
      const { container } = render(<Marquee items={items} />)
      const hiddenTrack = container.querySelector('[aria-hidden="true"]')
      expect(hiddenTrack).toBeInTheDocument()
    })
  })

  describe('reduced motion', () => {
    beforeEach(() => {
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
    })

    it('still renders all items under reduced motion', () => {
      render(<Marquee items={items} />)
      expect(screen.getAllByText('React').length).toBeGreaterThanOrEqual(1)
    })

    it('renders the marquee container under reduced motion', () => {
      const { container } = render(<Marquee items={items} />)
      expect(container.firstChild).toHaveClass('marquee')
    })
  })

  describe('edge cases', () => {
    it('renders nothing when items array is empty', () => {
      const { container } = render(<Marquee items={[]} />)
      const track = container.querySelector('.marquee-track')
      expect(track).toBeInTheDocument()
      // No marquee-item children
      const marqueeItems = container.querySelectorAll('.marquee-item')
      expect(marqueeItems.length).toBe(0)
    })

    it('renders a single item duplicated', () => {
      render(<Marquee items={['Solo']} />)
      expect(screen.getAllByText('Solo').length).toBe(2)
    })
  })
})
