/// <reference types="node" />
/**
 * CSS-presence tests for the scroll-motion reveal vocabulary: every named
 * `data-reveal` variant, the superseded `.r-*` classes, and the reduced-motion
 * neutralisation. Reads the source file directly (see stylesheet-tokens.test.ts).
 */
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { describe, expect, it } from 'vitest'

const css = readFileSync(
  resolve(__dirname, '../../src/index.css'),
  'utf8',
).replace(/'/g, '"')

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Declarations of the first rule whose selector list contains `selector`. */
function ruleBody(selector: string, source = css): string {
  const re = new RegExp(
    `(?:^|[\\s,}])${escape(selector)}\\s*(?:,[^{]*)?\\{([^}]*)\\}`,
  )
  return re.exec(source)?.[1] ?? ''
}

const reducedMotionBlock = css.slice(
  css.indexOf('@media (prefers-reduced-motion: reduce)'),
)

const variant = (name: string) => `.reveal[data-reveal="${name}"]`

const NAMES = ['fade', 'blur', 'scale', 'left', 'right', 'mask']

describe('reveal vocabulary — pre-.in states', () => {
  it.each([
    ['fade', /transform:\s*none/],
    ['blur', /filter:\s*blur\(8px\)/],
    ['scale', /scale\(0?\.96\)/],
    ['left', /translateX\(-24px\)/],
    ['right', /translateX\(24px\)/],
    ['mask', /clip-path:\s*inset\(100%\s+0\s+0\s+0\)/],
  ])('%s variant sets its designed from-state', (name, from) => {
    expect(ruleBody(variant(name))).toMatch(from)
  })

  it('variants that restate the transition reuse the shell --ease curve', () => {
    const restated = NAMES.map((n) => ruleBody(variant(n))).filter((body) =>
      body.includes('transition'),
    )
    expect(restated.length).toBeGreaterThan(0)
    restated.forEach((body) => expect(body).toContain('var(--ease)'))
  })

  it('keeps the default .reveal rise unchanged', () => {
    expect(ruleBody('.reveal')).toMatch(/translateY\(36px\)\s+scale\(0\.97\)/)
  })
})

describe('reveal vocabulary — .in states', () => {
  it('mask variant wipes to inset(0) once revealed', () => {
    expect(ruleBody(`${variant('mask')}.in`)).toMatch(/clip-path:\s*inset\(0\)/)
  })

  it('blur variant clears the filter once revealed', () => {
    expect(ruleBody(`${variant('blur')}.in`)).toMatch(
      /filter:\s*(none|blur\(0\))/,
    )
  })
})

describe('superseded .r-* classes', () => {
  it('no longer defines .reveal.r-* rules', () => {
    expect(css).not.toMatch(/\.reveal\.r-(fade|left|right|scale)/)
  })
})

describe('reveal vocabulary — reduced motion', () => {
  it('forces every variant to its static final state', () => {
    const body = ruleBody('.reveal[data-reveal]', reducedMotionBlock)
    expect(body).toMatch(/opacity:\s*1/)
    expect(body).toMatch(/transform:\s*none/)
    expect(body).toMatch(/filter:\s*none/)
    expect(body).toMatch(/clip-path:\s*none/)
    expect(body).toMatch(/transition:\s*none/)
  })
})
