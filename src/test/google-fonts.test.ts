/**
 * Tests for story 01-01: Google Fonts links in index.html.
 *
 * Asserts that the two preconnect links and the Google Fonts stylesheet
 * for Geist, Instrument Serif, and JetBrains Mono are present.
 */
import { describe, expect, it } from 'vitest'
import html from '../../index.html?raw'

describe('index.html — Google Fonts', () => {
  it('has preconnect to fonts.googleapis.com', () => {
    expect(html).toMatch(
      /<link\s[^>]*rel=["']preconnect["'][^>]*href=["']https:\/\/fonts\.googleapis\.com["'][^>]*>/i,
    )
  })

  it('has preconnect to fonts.gstatic.com with crossorigin', () => {
    expect(html).toMatch(
      /<link\s[^>]*rel=["']preconnect["'][^>]*href=["']https:\/\/fonts\.gstatic\.com["'][^>]*crossorigin[^>]*>/i,
    )
  })

  it('has a Google Fonts stylesheet link for Geist', () => {
    expect(html).toMatch(/fonts\.googleapis\.com\/css2/)
    expect(html).toMatch(/Geist/)
  })

  it('has a Google Fonts stylesheet link for Instrument Serif', () => {
    expect(html).toMatch(
      /Instrument\+Serif|Instrument%20Serif|Instrument Serif/,
    )
  })

  it('has a Google Fonts stylesheet link for JetBrains Mono', () => {
    expect(html).toMatch(/JetBrains\+Mono|JetBrains%20Mono|JetBrains Mono/)
  })

  it('uses display=swap in the fonts URL', () => {
    expect(html).toMatch(/display=swap/)
  })
})

describe('index.html — Google Fonts loading (story 13-03)', () => {
  const head = html.slice(0, html.indexOf('</head>'))
  const headScripted = head.replace(/<noscript>[\s\S]*?<\/noscript>/g, '')
  const fontsHref = /https:\/\/fonts\.googleapis\.com\/css2\?[^"']+/

  it('does not load the fonts stylesheet as a render-blocking stylesheet', () => {
    const blocking = headScripted.match(
      /<link\s[^>]*rel=["']stylesheet["'][^>]*fonts\.googleapis\.com[^>]*>/i,
    )
    expect(blocking).toBeNull()
  })

  it('preloads the fonts stylesheet and applies it on load', () => {
    expect(head).toMatch(
      /<link\s[^>]*rel=["']preload["'][^>]*as=["']style["'][^>]*fonts\.googleapis\.com[^>]*onload=["']this\.onload=null;this\.rel='stylesheet'["'][^>]*>/i,
    )
  })

  it('falls back to a plain stylesheet when JavaScript is disabled', () => {
    expect(html).toMatch(
      /<noscript>\s*<link\s[^>]*rel=["']stylesheet["'][^>]*fonts\.googleapis\.com[^>]*>\s*<\/noscript>/i,
    )
  })

  it('keeps display=swap in the fonts URL', () => {
    expect(head.match(fontsHref)?.[0]).toMatch(/display=swap/)
  })
})
