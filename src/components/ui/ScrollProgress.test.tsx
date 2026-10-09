import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import ScrollProgress from './ScrollProgress'

let frames: FrameRequestCallback[]

function makeView(scrollTop: number) {
  const el = document.createElement('div')
  Object.defineProperty(el, 'scrollHeight', { value: 1000 })
  Object.defineProperty(el, 'clientHeight', { value: 500 })
  el.scrollTop = scrollTop
  return el
}

function flushFrames() {
  const pending = frames.splice(0)
  act(() => {
    pending.forEach((cb) => cb(0))
  })
}

describe('ScrollProgress', () => {
  beforeEach(() => {
    frames = []
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((cb: FrameRequestCallback) => frames.push(cb)),
    )
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('is decorative: hidden from assistive tech', () => {
    render(<ScrollProgress viewRef={{ current: makeView(0) }} route="home" />)
    expect(screen.getByTestId('scroll-progress')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
  })

  it('starts empty', () => {
    render(<ScrollProgress viewRef={{ current: makeView(0) }} route="home" />)
    flushFrames()
    expect(screen.getByTestId('scroll-progress-bar')).toHaveStyle({
      transform: 'scaleX(0)',
    })
  })

  it('fills in step with the view scroll position', () => {
    const view = makeView(0)
    render(<ScrollProgress viewRef={{ current: view }} route="home" />)
    view.scrollTop = 250
    act(() => {
      view.dispatchEvent(new Event('scroll'))
    })
    flushFrames()
    expect(screen.getByTestId('scroll-progress-bar')).toHaveStyle({
      transform: 'scaleX(0.5)',
    })
  })

  it('applies the ratio without an inline transition, so reduced motion can drop it in CSS', () => {
    const view = makeView(500)
    render(<ScrollProgress viewRef={{ current: view }} route="home" />)
    flushFrames()
    const bar = screen.getByTestId('scroll-progress-bar')
    expect(bar).toHaveStyle({ transform: 'scaleX(1)' })
    expect(bar.style.transition).toBe('')
  })
})
