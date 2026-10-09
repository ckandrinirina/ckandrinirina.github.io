/// <reference types="node" />
/**
 * CSS-presence tests for the scroll-progress bar: the track and fill rules, the
 * motion-on transition on the shell --ease curve, and the reduced-motion drop.
 * Reads the source file directly (see reveal-variants.test.ts).
 */
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { describe, expect, it } from 'vitest'

const css = readFileSync(
  resolve(__dirname, '../../src/index.css'),
  'utf8',
).replace(/'/g, '"')

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function ruleBody(selector: string, source = css): string {
  const re = new RegExp(
    `(?:^|[\\s,}])${escape(selector)}\\s*(?:,[^{]*)?\\{([^}]*)\\}`,
  )
  return re.exec(source)?.[1] ?? ''
}

const reducedMotionBlock = css.slice(
  css.indexOf('@media (prefers-reduced-motion: reduce)'),
)

describe('scroll progress — motion on', () => {
  it('track is pinned under the breadcrumb row and never intercepts input', () => {
    const body = ruleBody('.scroll-progress')
    expect(body).toMatch(/position:\s*absolute/)
    expect(body).toMatch(/pointer-events:\s*none/)
  })

  it('fill scales from the left edge', () => {
    const body = ruleBody('.scroll-progress-bar')
    expect(body).toMatch(/transform-origin:\s*left/)
    expect(body).toMatch(/transform:\s*scaleX\(0\)/)
  })

  it('fill eases its transform on the shell --ease curve', () => {
    expect(ruleBody('.scroll-progress-bar')).toMatch(
      /transition:\s*transform\s+[\d.]+m?s\s+var\(--ease\)/,
    )
  })
})

describe('scroll progress — reduced motion', () => {
  it('updates instantly: no transition on the fill', () => {
    expect(ruleBody('.scroll-progress-bar', reducedMotionBlock)).toMatch(
      /transition:\s*none/,
    )
  })
})
