import type { RefObject } from 'react'
import { useScrollProgress } from '../../hooks/useScrollProgress'

export type ScrollProgressProps = {
  /** The active view's scroll container. */
  viewRef: RefObject<HTMLElement | null>
  /** Active route; navigating remounts the view, so the bar re-measures. */
  route: string
}

/**
 * Slim decorative bar showing how far the active view has scrolled.
 *
 * Fills with `scaleX` from the left edge — a compositor-only property, cheaper
 * than animating `width`. `aria-hidden`: keyboard route nav and ScrollHint stay
 * the real wayfinding.
 */
export default function ScrollProgress({
  viewRef,
  route,
}: ScrollProgressProps) {
  const ratio = useScrollProgress(viewRef, route)

  return (
    <div
      className="scroll-progress"
      data-testid="scroll-progress"
      aria-hidden="true"
    >
      <div
        className="scroll-progress-bar"
        data-testid="scroll-progress-bar"
        style={{ transform: `scaleX(${ratio})` }}
      />
    </div>
  )
}
