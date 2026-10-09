/**
 * Tests for useScrollReveal hook.
 *
 * Strategy: Mock IntersectionObserver with a controllable implementation that
 * lets tests manually trigger intersections. Use vi.useFakeTimers() for the
 * 30ms delay before the observer is created.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRef } from 'react'
import { useScrollReveal } from './useScrollReveal'

// ---------------------------------------------------------------------------
// Controllable IntersectionObserver mock
// ---------------------------------------------------------------------------

type IOCallback = (
  entries: IntersectionObserverEntry[],
  observer: IntersectionObserver,
) => void

interface IOInstance {
  callback: IOCallback
  options: IntersectionObserverInit | undefined
  observed: Element[]
  unobserved: Element[]
  disconnected: boolean
}

const ioInstances: IOInstance[] = []

class MockIO implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = ''
  readonly thresholds: ReadonlyArray<number> = []

  private _instance: IOInstance

  constructor(callback: IOCallback, options?: IntersectionObserverInit) {
    this._instance = {
      callback,
      options,
      observed: [],
      unobserved: [],
      disconnected: false,
    }
    ioInstances.push(this._instance)
  }

  observe = vi.fn((el: Element) => {
    this._instance.observed.push(el)
  })

  unobserve = vi.fn((el: Element) => {
    this._instance.unobserved.push(el)
  })

  disconnect = vi.fn(() => {
    this._instance.disconnected = true
  })

  takeRecords = vi.fn(() => [] as IntersectionObserverEntry[])

  /** Simulate an element entering the viewport */
  triggerEntry(el: Element, isIntersecting: boolean) {
    const entry = {
      target: el,
      isIntersecting,
      intersectionRatio: isIntersecting ? 1 : 0,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: Date.now(),
    } as IntersectionObserverEntry
    this._instance.callback([entry], this)
  }

  get instance() {
    return this._instance
  }
}

let originalIO: typeof IntersectionObserver

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const REVEAL_SELECTORS = [
  '.reveal',
  '.proj-card',
  '.skill-card',
  '.tl-item',
  '.process-item',
  '.now-card',
  '.stats-grid',
]

function createRevealElement(
  className: string,
  parent?: HTMLElement,
): HTMLElement {
  const el = document.createElement('div')
  el.className = className
  ;(parent ?? document.body).appendChild(el)
  return el
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useScrollReveal', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    originalIO = window.IntersectionObserver
    ioInstances.length = 0
    vi.stubGlobal('IntersectionObserver', MockIO)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.stubGlobal('IntersectionObserver', originalIO)
    document.body.innerHTML = ''
  })

  /** Build a fake IntersectionObserver with spy methods, usable as the
   *  second argument passed to the hook's IntersectionObserver callback. */
  function makeFakeObserver() {
    return {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
      takeRecords: vi.fn(() => []),
      root: null,
      rootMargin: '',
      thresholds: [],
    } as unknown as IntersectionObserver
  }

  function makeEntry(
    el: Element,
    isIntersecting: boolean,
  ): IntersectionObserverEntry {
    return {
      target: el,
      isIntersecting,
      intersectionRatio: isIntersecting ? 1 : 0,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: Date.now(),
    } as IntersectionObserverEntry
  }

  describe('30ms delay before observer creation', () => {
    it('does not create IntersectionObserver before 30ms', () => {
      const container = document.createElement('div')
      document.body.appendChild(container)

      renderHook(() => {
        const ref = useRef<HTMLElement>(container)
        useScrollReveal(ref, 'home')
      })

      // Before timer fires
      expect(ioInstances.length).toBe(0)
    })

    it('creates IntersectionObserver after 30ms', () => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      createRevealElement('reveal', container)

      renderHook(() => {
        const ref = useRef<HTMLElement>(container)
        useScrollReveal(ref, 'home')
      })

      act(() => {
        vi.advanceTimersByTime(30)
      })

      expect(ioInstances.length).toBe(1)
    })
  })

  describe('observer options', () => {
    it('creates observer with threshold 0.08', () => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      createRevealElement('reveal', container)

      renderHook(() => {
        const ref = useRef<HTMLElement>(container)
        useScrollReveal(ref, 'home')
      })

      act(() => {
        vi.advanceTimersByTime(30)
      })

      expect(ioInstances[0].options?.threshold).toBe(0.08)
    })

    it('creates observer with rootMargin "0px 0px -8% 0px"', () => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      createRevealElement('reveal', container)

      renderHook(() => {
        const ref = useRef<HTMLElement>(container)
        useScrollReveal(ref, 'home')
      })

      act(() => {
        vi.advanceTimersByTime(30)
      })

      expect(ioInstances[0].options?.rootMargin).toBe('0px 0px -8% 0px')
    })
  })

  describe('strips .in class on setup', () => {
    it('removes .in class from matching elements before observing', () => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      const el = createRevealElement('reveal in', container)

      renderHook(() => {
        const ref = useRef<HTMLElement>(container)
        useScrollReveal(ref, 'home')
      })

      act(() => {
        vi.advanceTimersByTime(30)
      })

      expect(el.classList.contains('in')).toBe(false)
    })
  })

  describe('adds .in class with staggered transitionDelay on intersection', () => {
    it('adds .in class when element enters viewport', () => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      const el = createRevealElement('reveal', container)

      renderHook(() => {
        const ref = useRef<HTMLElement>(container)
        useScrollReveal(ref, 'home')
      })

      act(() => {
        vi.advanceTimersByTime(30)
      })

      const fakeObs = makeFakeObserver()
      act(() => {
        ioInstances[0].callback([makeEntry(el, true)], fakeObs)
      })

      expect(el.classList.contains('in')).toBe(true)
    })

    it('sets staggered transitionDelay based on sibling index', () => {
      const container = document.createElement('div')
      document.body.appendChild(container)

      const els = [
        createRevealElement('reveal', container),
        createRevealElement('reveal', container),
        createRevealElement('reveal', container),
      ]

      renderHook(() => {
        const ref = useRef<HTMLElement>(container)
        useScrollReveal(ref, 'home')
      })

      act(() => {
        vi.advanceTimersByTime(30)
      })

      const fakeObs = makeFakeObserver()
      act(() => {
        els.forEach((el) => {
          ioInstances[0].callback([makeEntry(el, true)], fakeObs)
        })
      })

      // Check stagger: min(siblingIndex, 8) * 90ms
      expect(els[0].style.transitionDelay).toBe('0ms')
      expect(els[1].style.transitionDelay).toBe('90ms')
      expect(els[2].style.transitionDelay).toBe('180ms')
    })

    it('caps stagger at index 8 (max delay = 8 * 90ms = 720ms)', () => {
      const container = document.createElement('div')
      document.body.appendChild(container)

      const els: HTMLElement[] = []
      for (let i = 0; i < 10; i++) {
        els.push(createRevealElement('reveal', container))
      }

      renderHook(() => {
        const ref = useRef<HTMLElement>(container)
        useScrollReveal(ref, 'home')
      })

      act(() => {
        vi.advanceTimersByTime(30)
      })

      const fakeObs = makeFakeObserver()
      act(() => {
        els.forEach((el) => {
          ioInstances[0].callback([makeEntry(el, true)], fakeObs)
        })
      })

      // Index 8 and 9 both get min(8,8)*90 = 720ms and min(9,8)*90 = 720ms
      expect(els[8].style.transitionDelay).toBe('720ms')
      expect(els[9].style.transitionDelay).toBe('720ms')
    })

    it('does NOT add .in when isIntersecting is false', () => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      const el = createRevealElement('reveal', container)

      renderHook(() => {
        const ref = useRef<HTMLElement>(container)
        useScrollReveal(ref, 'home')
      })

      act(() => {
        vi.advanceTimersByTime(30)
      })

      const fakeObs = makeFakeObserver()
      act(() => {
        ioInstances[0].callback([makeEntry(el, false)], fakeObs)
      })

      expect(el.classList.contains('in')).toBe(false)
    })
  })

  describe('unobserves after revealing', () => {
    it('calls unobserve on each element after adding .in', () => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      const el = createRevealElement('reveal', container)

      renderHook(() => {
        const ref = useRef<HTMLElement>(container)
        useScrollReveal(ref, 'home')
      })

      act(() => {
        vi.advanceTimersByTime(30)
      })

      // Use a fake observer that records unobserve calls
      const unobserveCalls: Element[] = []
      const fakeObs = {
        observe: vi.fn(),
        unobserve: vi.fn((e: Element) => {
          unobserveCalls.push(e)
        }),
        disconnect: vi.fn(),
        takeRecords: vi.fn(() => []),
        root: null,
        rootMargin: '',
        thresholds: [],
      } as unknown as IntersectionObserver

      act(() => {
        ioInstances[0].callback([makeEntry(el, true)], fakeObs)
      })

      expect(unobserveCalls).toContain(el)
    })
  })

  describe('re-runs cleanly on route change', () => {
    it('disconnects old observer and creates new one on route change', () => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      createRevealElement('reveal', container)

      const { rerender } = renderHook(
        ({ route }: { route: string }) => {
          const ref = useRef<HTMLElement>(container)
          useScrollReveal(ref, route)
        },
        { initialProps: { route: 'home' } },
      )

      act(() => {
        vi.advanceTimersByTime(30)
      })
      const firstInstanceCount = ioInstances.length
      expect(firstInstanceCount).toBe(1)

      rerender({ route: 'work' })

      act(() => {
        vi.advanceTimersByTime(30)
      })

      // A new observer should be created for the new route
      expect(ioInstances.length).toBeGreaterThan(firstInstanceCount)
    })
  })

  describe('cleanup on unmount', () => {
    it('disconnects the observer on unmount', () => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      createRevealElement('reveal', container)

      const { unmount } = renderHook(() => {
        const ref = useRef<HTMLElement>(container)
        useScrollReveal(ref, 'home')
      })

      act(() => {
        vi.advanceTimersByTime(30)
      })
      unmount()

      expect(ioInstances[0].disconnected).toBe(true)
    })
  })

  describe('null ref', () => {
    it('does not throw when ref.current is null', () => {
      expect(() => {
        renderHook(() => {
          const ref = useRef<HTMLElement>(null)
          useScrollReveal(ref, 'home')
        })
        act(() => {
          vi.advanceTimersByTime(30)
        })
      }).not.toThrow()
    })
  })

  describe('observed selectors', () => {
    it.each(REVEAL_SELECTORS)('observes .%s elements', (cls) => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      // Remove the leading dot from class name for createElement
      const className = cls.replace(/^\./, '')
      const el = createRevealElement(className, container)

      renderHook(() => {
        const ref = useRef<HTMLElement>(container)
        useScrollReveal(ref, 'home')
      })

      act(() => {
        vi.advanceTimersByTime(30)
      })

      expect(ioInstances[0].observed).toContain(el)
    })
  })

  describe('[data-reveal] variant hook', () => {
    it('observes an element carrying only data-reveal and gives it .in', () => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      const el = createRevealElement('', container)
      el.setAttribute('data-reveal', 'blur')

      renderHook(() => {
        const ref = useRef<HTMLElement>(container)
        useScrollReveal(ref, 'home')
      })
      act(() => {
        vi.advanceTimersByTime(30)
      })
      expect(ioInstances[0].observed).toContain(el)

      act(() => {
        ioInstances[0].callback([makeEntry(el, true)], makeFakeObserver())
      })
      expect(el.classList.contains('in')).toBe(true)
    })
  })

  describe('named export', () => {
    it('is a named export function', async () => {
      const module = await import('./useScrollReveal')
      expect(typeof module.useScrollReveal).toBe('function')
    })
  })
})
