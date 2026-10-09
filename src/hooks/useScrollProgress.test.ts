import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useScrollProgress } from './useScrollProgress'

type Frame = FrameRequestCallback

let frames: Map<number, Frame>
let nextId: number

function flushFrames() {
  const pending = [...frames.values()]
  frames.clear()
  act(() => {
    pending.forEach((cb) => cb(0))
  })
}

function makeView({
  scrollTop = 0,
  scrollHeight = 1000,
  clientHeight = 500,
} = {}) {
  const el = document.createElement('div')
  Object.defineProperty(el, 'scrollHeight', {
    configurable: true,
    get: () => scrollHeight,
  })
  Object.defineProperty(el, 'clientHeight', {
    configurable: true,
    get: () => clientHeight,
  })
  el.scrollTop = scrollTop
  return el
}

function setup(el: HTMLElement | null, route = 'home') {
  const ref = { current: el }
  const hook = renderHook(({ r }: { r: string }) => useScrollProgress(ref, r), {
    initialProps: { r: route },
  })
  return { ref, ...hook }
}

describe('useScrollProgress', () => {
  beforeEach(() => {
    frames = new Map()
    nextId = 1
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((cb: Frame) => {
        const id = nextId++
        frames.set(id, cb)
        return id
      }),
    )
    vi.stubGlobal(
      'cancelAnimationFrame',
      vi.fn((id: number) => {
        frames.delete(id)
      }),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('is 0 at the top of the scroll range', () => {
    const { result } = setup(makeView({ scrollTop: 0 }))
    flushFrames()
    expect(result.current).toBe(0)
  })

  it('is scrollTop / (scrollHeight - clientHeight) while scrolling', () => {
    const view = makeView()
    const { result } = setup(view)
    view.scrollTop = 125
    act(() => {
      view.dispatchEvent(new Event('scroll'))
    })
    flushFrames()
    expect(result.current).toBe(0.25)
  })

  it('is 1 at the bottom and clamps overscroll to 1', () => {
    const view = makeView()
    const { result } = setup(view)
    view.scrollTop = 500
    view.dispatchEvent(new Event('scroll'))
    flushFrames()
    expect(result.current).toBe(1)

    view.scrollTop = 900
    view.dispatchEvent(new Event('scroll'))
    flushFrames()
    expect(result.current).toBe(1)
  })

  it('clamps a negative scrollTop (rubber-band) to 0', () => {
    const view = makeView()
    const { result } = setup(view)
    view.scrollTop = -40
    view.dispatchEvent(new Event('scroll'))
    flushFrames()
    expect(result.current).toBe(0)
  })

  it('stays 0 when the content fits without scrolling', () => {
    const view = makeView({ scrollHeight: 500, clientHeight: 500 })
    const { result } = setup(view)
    view.scrollTop = 30
    view.dispatchEvent(new Event('scroll'))
    flushFrames()
    expect(result.current).toBe(0)
  })

  it('attaches a passive scroll listener', () => {
    const view = makeView()
    const add = vi.spyOn(view, 'addEventListener')
    setup(view)
    expect(add).toHaveBeenCalledWith('scroll', expect.any(Function), {
      passive: true,
    })
  })

  it('coalesces a burst of scroll events into one pending frame', () => {
    const view = makeView()
    setup(view)
    flushFrames()
    vi.mocked(requestAnimationFrame).mockClear()

    view.dispatchEvent(new Event('scroll'))
    view.dispatchEvent(new Event('scroll'))
    view.dispatchEvent(new Event('scroll'))

    expect(requestAnimationFrame).toHaveBeenCalledTimes(1)
  })

  it('measures again on the next scroll once the frame has run', () => {
    const view = makeView()
    setup(view)
    flushFrames()
    vi.mocked(requestAnimationFrame).mockClear()

    view.dispatchEvent(new Event('scroll'))
    flushFrames()
    view.dispatchEvent(new Event('scroll'))

    expect(requestAnimationFrame).toHaveBeenCalledTimes(2)
  })

  it('recomputes on window resize', () => {
    let clientHeight = 500
    const view = makeView()
    Object.defineProperty(view, 'clientHeight', {
      configurable: true,
      get: () => clientHeight,
    })
    const { result } = setup(view)
    view.scrollTop = 250
    view.dispatchEvent(new Event('scroll'))
    flushFrames()
    expect(result.current).toBe(0.5)

    clientHeight = 750
    act(() => {
      window.dispatchEvent(new Event('resize'))
    })
    flushFrames()
    expect(result.current).toBe(1)
  })

  it('resets to the new view on route change', () => {
    const first = makeView()
    const { result, ref, rerender } = setup(first, 'home')
    first.scrollTop = 250
    first.dispatchEvent(new Event('scroll'))
    flushFrames()
    expect(result.current).toBe(0.5)

    ref.current = makeView({ scrollTop: 0 })
    rerender({ r: 'work' })
    flushFrames()
    expect(result.current).toBe(0)
  })

  it('removes the listeners and cancels the pending frame on unmount', () => {
    const view = makeView()
    const remove = vi.spyOn(view, 'removeEventListener')
    const { unmount } = setup(view)
    view.dispatchEvent(new Event('scroll'))
    expect(frames.size).toBeGreaterThan(0)

    unmount()

    expect(remove).toHaveBeenCalledWith('scroll', expect.any(Function))
    expect(cancelAnimationFrame).toHaveBeenCalled()
    expect(frames.size).toBe(0)
  })

  it('stays 0 without a view container', () => {
    const { result } = setup(null)
    flushFrames()
    expect(result.current).toBe(0)
  })
})
