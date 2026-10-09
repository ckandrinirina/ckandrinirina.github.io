import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import ProjectArt from './ProjectArt'

const ALL_IDS = [
  'soka',
  'soka-live',
  'ludoka',
  'bmoi-intranet',
  'eer',
  'shoyo',
  'ocr',
  'happy',
  'theseis',
] as const

describe('ProjectArt', () => {
  it.each(ALL_IDS)('renders inline SVG for id="%s"', (id) => {
    const { container } = render(<ProjectArt id={id} />)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
  })

  it.each(ALL_IDS)(
    'renders no <img> for id="%s" (no external requests)',
    (id) => {
      const { container } = render(<ProjectArt id={id} />)
      expect(container.querySelector('img')).toBeNull()
    },
  )

  it('renders an empty fallback (not a crash) for an unknown id', () => {
    // @ts-expect-error — intentionally passing unknown id to test fallback
    const { container } = render(<ProjectArt id="unknown-xyz" />)
    // Should render nothing or an empty fallback container, but not throw
    // The container itself should be present (no crash)
    expect(container).toBeTruthy()
    // No SVG for unknown id
    expect(container.querySelector('svg')).toBeNull()
  })

  it('passes className prop to the root SVG element', () => {
    const { container } = render(
      <ProjectArt id="soka" className="test-class" />,
    )
    const svg = container.querySelector('svg')
    // SVGElement.className is an SVGAnimatedString, not a string — read the
    // actual class attribute to assert the forwarded class.
    expect(svg?.getAttribute('class')).toContain('test-class')
  })
})
