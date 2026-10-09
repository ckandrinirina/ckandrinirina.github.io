/// <reference types="node" />
/**
 * Stylesheet guards for the Lighthouse accessibility findings (story 13-03).
 * jsdom cannot compute layout or contrast, so these assert the source rules
 * that satisfy the audit.
 */
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { describe, expect, it } from 'vitest'

const css = readFileSync(resolve(__dirname, '../index.css'), 'utf8')

/** Declarations of the first top-level rule for an exact selector. */
function rule(selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = css.match(new RegExp(`(?:^|\\n)${escaped}\\s*\\{([^}]*)\\}`))
  if (!match) throw new Error(`rule not found: ${selector}`)
  return match[1]
}

describe('Lighthouse accessibility — stylesheet', () => {
  it('theme swatches have a hit area of at least 24x24px (WCAG 2.5.8)', () => {
    const body = rule('.tb-swatch')
    expect(body).toMatch(/width:\s*24px/)
    expect(body).toMatch(/height:\s*24px/)
  })

  it('the swatch dot is still drawn at 14px from the palette colour', () => {
    const body = rule('.tb-swatch::before')
    expect(body).toMatch(/width:\s*14px/)
    expect(body).toMatch(/background:\s*var\(--sw/)
  })

  it('the scroll-hint chip text meets 4.5:1 on every palette (uses --fg-dim)', () => {
    expect(rule('.scroll-hint-inner')).toMatch(/color:\s*var\(--fg-dim\)/)
  })
})
