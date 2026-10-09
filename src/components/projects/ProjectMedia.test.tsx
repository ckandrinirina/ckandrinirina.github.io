import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import ProjectMedia from './ProjectMedia'

vi.mock('./projectImages', () => ({
  projectImage: (id: string) =>
    id === 'soka' ? '/assets/projects/soka-abc123.webp' : null,
}))

describe('ProjectMedia', () => {
  it('renders the screenshot when the project has one', () => {
    const { container } = render(
      <ProjectMedia project={{ id: 'soka', name: 'SOKA Club' }} />,
    )
    const img = container.querySelector('img.shot')
    expect(img).not.toBeNull()
    expect(img?.getAttribute('src')).toBe('/assets/projects/soka-abc123.webp')
    expect(img?.getAttribute('alt')).toBe('SOKA Club')
    expect(img?.getAttribute('loading')).toBe('lazy')
    expect(container.querySelector('svg')).toBeNull()
  })

  it('falls back to the inline-SVG artwork when there is no screenshot', () => {
    const { container } = render(
      <ProjectMedia project={{ id: 'eer', name: 'EER Full Digital' }} />,
    )
    expect(container.querySelector('svg')).not.toBeNull()
    expect(container.querySelector('img')).toBeNull()
  })
})
