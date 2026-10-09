import { useRef, useState, useEffect } from 'react'

/**
 * useReveal — IntersectionObserver-based reveal hook.
 *
 * Returns `{ ref, isVisible }` where `ref` should be attached to the target
 * DOM element. Once the element intersects the viewport, `isVisible` flips to
 * `true` and stays there (one-shot: the observer disconnects immediately).
 *
 * Under `prefers-reduced-motion: reduce`, the hook skips the observer entirely
 * and returns `isVisible = true` on mount so content is always accessible.
 *
 * @param options - Optional IntersectionObserverInit overrides (e.g. `{ threshold: 0.2 }`).
 */
export function useReveal<T extends Element = Element>(
  options?: IntersectionObserverInit,
): {
  ref: React.RefObject<T | null>
  isVisible: boolean
} {
  const ref = useRef<T>(null)

  const [isVisible, setIsVisible] = useState<boolean>(() => {
    // Initialise to true immediately under reduced-motion (SSR-safe guard).
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    // If already visible (reduced-motion path), skip observer creation entirely.
    if (isVisible) return

    // Gracefully handle null ref (e.g. during test without a real DOM element).
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, ...options },
    )

    observer.observe(ref.current)

    // Cleanup: disconnect observer on unmount.
    return () => {
      observer.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { ref, isVisible }
}
