import type { RefObject } from 'react'
import { useReveal } from './useReveal'

/**
 * useInView — one-shot "has this element scrolled into view" flag.
 *
 * Returns `[ref, inView]`: attach `ref` to the target and read `inView`, which
 * flips to `true` once on first intersection and never back. Under
 * `prefers-reduced-motion: reduce` it is `true` from mount, so scroll-triggered
 * widgets such as `CountUp` show their final state immediately.
 *
 * The observer root is the viewport; the active view's scroll container clips
 * its descendants, so an element only intersects once scrolled into that view.
 */
export function useInView<T extends Element = HTMLElement>(
  options?: IntersectionObserverInit,
): [RefObject<T | null>, boolean] {
  const { ref, isVisible } = useReveal<T>(options)
  return [ref, isVisible]
}
