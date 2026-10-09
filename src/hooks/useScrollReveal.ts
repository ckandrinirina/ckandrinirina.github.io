import { useEffect, type RefObject } from 'react'

const REVEAL_DELAY_MS = 30
const STAGGER_MS = 90
const MAX_STAGGER_INDEX = 8
const OBSERVER_THRESHOLD = 0.08
const OBSERVER_ROOT_MARGIN = '0px 0px -8% 0px'

/**
 * Selectors for elements that should receive the staggered reveal animation.
 * Kept as a single querySelectorAll argument for efficiency.
 */
const REVEAL_SELECTOR =
  '.reveal, .proj-card, .skill-card, .tl-item, .process-item, .now-card, .stats-grid, [data-reveal]'

/**
 * useScrollReveal — 30 ms after a route change, queries all revealable
 * elements inside the view, strips any existing `.in` class, then creates an
 * IntersectionObserver (scoped to the view) that:
 *   - adds `.in` with a staggered `transitionDelay` of `min(siblingIndex, 8) × 90ms`
 *   - unobserves the element immediately after revealing (one-shot per element)
 *
 * Reduced motion is honoured at the CSS layer (`@media (prefers-reduced-motion)`);
 * this hook always runs so the `.in` class is set, but animations are neutralised
 * by the media query — no JS branch needed here.
 *
 * @param viewRef - Ref to the scrollable view container (used as observer root).
 * @param route   - Current route id; changing it re-runs the effect.
 */
export function useScrollReveal(
  viewRef: RefObject<HTMLElement | null>,
  route: string,
): void {
  useEffect(() => {
    const container = viewRef.current
    if (!container) return

    let observer: IntersectionObserver | null = null

    const timerId = setTimeout(() => {
      const elements = Array.from(
        container.querySelectorAll<HTMLElement>(REVEAL_SELECTOR),
      )

      // Strip any pre-existing .in so elements re-animate on route change.
      elements.forEach((el) => el.classList.remove('in'))

      observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return

            const el = entry.target as HTMLElement
            // Compute sibling index among the queried elements, capped at MAX_STAGGER_INDEX.
            const idx = elements.indexOf(el)
            const staggerIdx = Math.min(idx === -1 ? 0 : idx, MAX_STAGGER_INDEX)
            el.style.transitionDelay = `${staggerIdx * STAGGER_MS}ms`
            el.classList.add('in')
            obs.unobserve(el)
          })
        },
        {
          root: container,
          threshold: OBSERVER_THRESHOLD,
          rootMargin: OBSERVER_ROOT_MARGIN,
        },
      )

      elements.forEach((el) => observer!.observe(el))
    }, REVEAL_DELAY_MS)

    return () => {
      clearTimeout(timerId)
      observer?.disconnect()
    }
    // route is included so the observer re-runs on each route change.
  }, [viewRef, route])
}
