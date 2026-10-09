import { describe, expect, it } from 'vitest'
import html from '../../index.html?raw'
import { SOCIAL_LINKS } from '../lib/constants'

const OG_IMAGE_URL = 'https://ckandrinirina.github.io/og-image.png'
const SITE_URL = 'https://ckandrinirina.github.io/'

function metaContent(html: string, attr: string, name: string): string | null {
  const re = new RegExp(
    `<meta\\s+[^>]*${attr}=["']${name}["'][^>]*content=["']([^"']*)["']|<meta\\s+[^>]*content=["']([^"']*)["'][^>]*${attr}=["']${name}["']`,
    'i',
  )
  const match = html.match(re)
  return match ? (match[1] ?? match[2] ?? null) : null
}

describe('index.html — SEO metadata', () => {
  it('uses lang="fr" on <html>', () => {
    expect(html).toMatch(/<html\s+[^>]*lang=["']fr["']/i)
  })

  it('preserves the UTF-8 charset declaration', () => {
    expect(html).toMatch(/<meta\s+charset=["']UTF-8["']/i)
  })

  it('preserves the viewport meta tag', () => {
    expect(html).toMatch(
      /<meta\s+[^>]*name=["']viewport["'][^>]*content=["']width=device-width,\s*initial-scale=1\.0["']/i,
    )
  })

  it('has a title carrying the name and both fullstack keywords', () => {
    const m = html.match(/<title>([^<]+)<\/title>/i)
    expect(m).not.toBeNull()
    expect(m![1]).toContain('Erick Andrinirina')
    expect(m![1]).toContain('Développeur Fullstack')
    expect(m![1]).toContain('Fullstack Developer')
  })

  it('has a meta description of at most 160 characters with the search keywords', () => {
    const desc = metaContent(html, 'name', 'description')
    expect(desc).not.toBeNull()
    expect(desc!.length).toBeLessThanOrEqual(160)
    for (const keyword of [
      'fullstack',
      'React',
      'Next.js',
      'NestJS',
      'Madagascar',
    ]) {
      expect(desc!.toLowerCase()).toContain(keyword.toLowerCase())
    }
  })

  it('has og:title matching <title>', () => {
    expect(metaContent(html, 'property', 'og:title')).toBe(
      html.match(/<title>([^<]+)<\/title>/i)![1].trim(),
    )
  })

  it('has og:description matching the meta description', () => {
    const ogDesc = metaContent(html, 'property', 'og:description')
    const metaDesc = metaContent(html, 'name', 'description')
    expect(ogDesc).toBe(metaDesc)
  })

  it('declares fr_FR with en_US as the alternate locale', () => {
    expect(metaContent(html, 'property', 'og:locale')).toBe('fr_FR')
    expect(metaContent(html, 'property', 'og:locale:alternate')).toBe('en_US')
  })

  it('has og:image with the absolute production URL', () => {
    expect(metaContent(html, 'property', 'og:image')).toBe(OG_IMAGE_URL)
  })

  it('has og:type="website"', () => {
    expect(metaContent(html, 'property', 'og:type')).toBe('website')
  })

  it('has og:url with the canonical production URL', () => {
    expect(metaContent(html, 'property', 'og:url')).toBe(SITE_URL)
  })

  it('has twitter:card="summary_large_image"', () => {
    expect(metaContent(html, 'name', 'twitter:card')).toBe(
      'summary_large_image',
    )
  })

  it('has twitter:title and twitter:description mirroring OG values', () => {
    expect(metaContent(html, 'name', 'twitter:title')).toBe(
      metaContent(html, 'property', 'og:title'),
    )
    expect(metaContent(html, 'name', 'twitter:description')).toBe(
      metaContent(html, 'property', 'og:description'),
    )
  })

  it('has twitter:image equal to og:image', () => {
    expect(metaContent(html, 'name', 'twitter:image')).toBe(OG_IMAGE_URL)
  })

  it('has favicon link to /favicon.svg', () => {
    expect(html).toMatch(
      /<link\s+[^>]*rel=["']icon["'][^>]*href=["']\/favicon\.svg["'][^>]*type=["']image\/svg\+xml["']|<link\s+[^>]*type=["']image\/svg\+xml["'][^>]*href=["']\/favicon\.svg["'][^>]*rel=["']icon["']|<link\s+[^>]*href=["']\/favicon\.svg["'][^>]*type=["']image\/svg\+xml["'][^>]*\/?>/i,
    )
  })

  it('runs the anti-FOUC data-theme bootstrap before the bundle', () => {
    expect(html).toMatch(/localStorage\.getItem\(['"]theme['"]\)/)
    expect(html).toMatch(/setAttribute\(\s*['"]data-theme['"]/)
    expect(html).toMatch(/prefers-color-scheme:\s*dark/)
    // legacy dark-class bootstrap must be gone
    expect(html).not.toMatch(/classList\.add\(['"]dark['"]\)/)
  })

  it('declares the canonical URL', () => {
    expect(html).toContain(`<link rel="canonical" href="${SITE_URL}" />`)
  })
})

describe('index.html — structured data and no-JS fallback', () => {
  const jsonLd = () => {
    const m = html.match(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
    )
    expect(m).not.toBeNull()
    return JSON.parse(m![1])
  }

  it('describes a schema.org Person as valid JSON-LD', () => {
    const person = jsonLd()
    expect(person['@context']).toBe('https://schema.org')
    expect(person['@type']).toBe('Person')
    expect(person.name).toBe('Erick Andrinirina')
    expect(person.jobTitle).toBeTruthy()
    expect(person.url).toBe(SITE_URL)
    expect(person.image).toBe(`${SITE_URL}profile.jpg`)
    expect(person.address).toMatchObject({
      addressLocality: 'Antananarivo',
      addressCountry: 'MG',
    })
    expect(person.knowsAbout).toEqual(
      expect.arrayContaining(['React', 'Next.js', 'NestJS']),
    )
    expect(person.sameAs).toEqual([
      'https://github.com/ckandrinirina',
      'https://www.linkedin.com/in/andrinirina-erick-2aa6b0184/',
    ])
  })

  it('keeps the JSON-LD links in sync with SOCIAL_LINKS', () => {
    expect(jsonLd().sameAs).toEqual(Object.values(SOCIAL_LINKS))
  })

  it('has a <noscript> fallback with identity, bio and links, outside #root', () => {
    const m = html.match(/<body[\s\S]*?<noscript>([\s\S]*?)<\/noscript>/)
    expect(m).not.toBeNull()
    const noscript = m![1]
    expect(noscript).toContain('Erick Andrinirina')
    expect(noscript).toMatch(/Développeur Fullstack/)
    expect(noscript).toContain(SOCIAL_LINKS.github)
    expect(noscript).toContain(SOCIAL_LINKS.linkedin)
    expect(noscript).toContain('/cv/erick-andrinirina-cv.pdf')
    expect(html).toMatch(/<div id="root"><\/div>/)
  })
})
