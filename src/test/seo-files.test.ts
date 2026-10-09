import { describe, expect, it } from 'vitest'
import robots from '../../public/robots.txt?raw'
import sitemap from '../../public/sitemap.xml?raw'

const SITE_URL = 'https://ckandrinirina.github.io/'
const CV_URL = `${SITE_URL}cv/erick-andrinirina-cv.pdf`

describe('public/robots.txt', () => {
  it('allows every crawler', () => {
    expect(robots).toMatch(/^User-agent: \*$/m)
    expect(robots).toMatch(/^Allow: \/$/m)
    expect(robots).not.toMatch(/^Disallow: \S/m)
  })

  it('declares the sitemap', () => {
    expect(robots).toMatch(
      /^Sitemap: https:\/\/ckandrinirina\.github\.io\/sitemap\.xml$/m,
    )
  })
})

describe('public/sitemap.xml', () => {
  const doc = new DOMParser().parseFromString(sitemap, 'application/xml')

  it('is well-formed XML', () => {
    expect(doc.querySelector('parsererror')).toBeNull()
  })

  it('lists the site and the CV PDF', () => {
    const locs = [...doc.getElementsByTagName('loc')].map(
      (el) => el.textContent,
    )
    expect(locs).toEqual([SITE_URL, CV_URL])
  })
})
