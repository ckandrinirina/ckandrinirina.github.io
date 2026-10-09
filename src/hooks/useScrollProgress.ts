import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

/**
 * useScrollProgress — the active view's scroll position as a 0–1 ratio.
 *
 * Read-only: a passive `scroll` listener on the view container (never touches
 * the wheel, so `useScrollToNavigate` is unaffected), with measuring coalesced
 * into one in-flight animation frame. Re-attaches on `route` change — the view
 * remounts and starts at the top — and re-measures on `resize`.
 *
 * A view that fits without scrolling reports 0, never a misleading full bar.
 */
export function useScrollProgress(
  viewRef: RefObject<HTMLElement | null>,
  route: string,
): number {
  const [ratio, setRatio] = useState(0)

  useEffect(() => {
    const view = viewRef.current
    let frame: number | null = null

    function measure() {
      frame = null
      if (!view) return setRatio(0)
      const max = view.scrollHeight - view.clientHeight
      setRatio(max <= 0 ? 0 : Math.min(1, Math.max(0, view.scrollTop / max)))
    }

    function schedule() {
      if (frame === null) frame = requestAnimationFrame(measure)
    }

    schedule()
    view?.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    return () => {
      view?.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [viewRef, route])

  return ratio
}
