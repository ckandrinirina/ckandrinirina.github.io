import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { useInView } from './useInView'

type Callback = (entries: IntersectionObserverEntry[]) => void

function stubObserver() {
  const disconnect = vi.fn()
  const observe = vi.fn()
  const created: Callback[] = []

  class MockObserver {
    constructor(cb: Callback) {
      created.push(cb)
    }
    observe = observe
    disconnect = disconnect
    unobserve = vi.fn()
  }
  vi.stubGlobal('IntersectionObserver', MockObserver)

  return {
    observe,
    disconnect,
    created,
    emit: (isIntersecting: boolean) =>
      act(() => {
        created[0]([{ isIntersecting } as IntersectionObserverEntry])
      }),
  }
}

function stubReducedMotion(reduced: boolean) {
  vi.stubGlobal(
    'matchMedia',
    (query: string) => ({ matches: reduced, media: query }) as MediaQueryList,
  )
}

function Probe() {
  const [ref, inView] = useInView<HTMLDivElement>()
  return (
    <div ref={ref} data-testid="probe">
      {String(inView)}
    </div>
  )
}

describe('useInView', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('observes the ref element and reports false until it intersects', () => {
    stubReducedMotion(false)
    const io = stubObserver()
    render(<Probe />)

    expect(io.observe).toHaveBeenCalledWith(screen.getByTestId('probe'))
    expect(screen.getByTestId('probe')).toHaveTextContent('false')
  })

  it('flips to true on entry and never flips back (one-shot)', () => {
    stubReducedMotion(false)
    const io = stubObserver()
    render(<Probe />)

    io.emit(true)
    expect(screen.getByTestId('probe')).toHaveTextContent('true')
    expect(io.disconnect).toHaveBeenCalled()

    io.emit(false)
    expect(screen.getByTestId('probe')).toHaveTextContent('true')
  })

  it('disconnects the observer on unmount', () => {
    stubReducedMotion(false)
    const io = stubObserver()
    const { unmount } = render(<Probe />)

    unmount()
    expect(io.disconnect).toHaveBeenCalled()
  })

  it('is in view immediately under reduced motion, without an observer', () => {
    stubReducedMotion(true)
    const io = stubObserver()
    render(<Probe />)

    expect(screen.getByTestId('probe')).toHaveTextContent('true')
    expect(io.created).toHaveLength(0)
  })
})
