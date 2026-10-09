// Tests for the new Atelier project dataset (`src/content/projects.ts`).
//
// `projects.ts` is the standalone, locale-independent source of the 9 featured
// works rendered by the Work view and the project detail modal. It is typed by
// the `Project` interface in `types.ts`. This suite locks the shape the design
// doc specifies: 9 entries, `num` "01"…"09", the 9-id union, and a populated
// `detail` block on every entry.
import { describe, expect, it } from 'vitest'
import { projects, localizeProjects } from './projects'
import type { Project, ProjectId } from './types'

const EXPECTED_IDS: ProjectId[] = [
  'soka',
  'soka-live',
  'ludoka',
  'bmoi-intranet',
  'eer',
  'shoyo',
  'ocr',
  'happy',
  'theseis',
]

describe('projects dataset', () => {
  it('exports exactly 9 entries', () => {
    expect(projects).toHaveLength(9)
  })

  it('covers every project id in the union, with no duplicates', () => {
    const ids = projects.map((p) => p.id)
    expect(new Set(ids).size).toBe(9)
    expect([...ids].sort()).toEqual([...EXPECTED_IDS].sort())
  })

  it('numbers entries "01" through "09" in order', () => {
    const nums = projects.map((p) => p.num)
    expect(nums).toEqual(['01', '02', '03', '04', '05', '06', '07', '08', '09'])
  })

  it('every entry carries the required scalar fields', () => {
    projects.forEach((project: Project) => {
      expect(project.name).toBeTruthy()
      expect(project.year).toBeTruthy()
      expect(project.role).toBeTruthy()
      expect(project.client).toBeTruthy()
      expect(project.category).toBeTruthy()
      expect(Array.isArray(project.tags)).toBe(true)
      expect(project.tags.length).toBeGreaterThan(0)
    })
  })

  it('link and repo are string-or-null', () => {
    projects.forEach((project) => {
      expect(['string', 'object']).toContain(typeof project.link)
      expect(['string', 'object']).toContain(typeof project.repo)
      // null is typeof 'object'; a non-null object would be wrong
      if (project.link !== null) expect(typeof project.link).toBe('string')
      if (project.repo !== null) expect(typeof project.repo).toBe('string')
    })
  })

  it('every entry has a populated detail block', () => {
    projects.forEach((project) => {
      expect(project.detail.role).toBeTruthy()
      expect(project.detail.impact).toBeTruthy()
      expect(project.detail.stack).toBeTruthy()
      // detail.stack is a single " · "-separated string, not an array
      expect(typeof project.detail.stack).toBe('string')
    })
  })
})

// The Atelier base dataset is the English baseline. `localizeProjects(locale)`
// overlays the per-locale copy (role / category / desc / detail.role /
// detail.impact) while leaving locale-independent fields (id, num, name, year,
// client, tags, stack, link) untouched. (BUG-20260612-01)
describe('localizeProjects — per-locale overlay', () => {
  it("returns the English baseline unchanged for 'en'", () => {
    expect(localizeProjects('en')).toEqual(projects)
  })

  it("translates the locale-dependent fields for 'fr'", () => {
    const fr = localizeProjects('fr')
    const frSoka = fr.find((p) => p.id === 'soka')!
    const enSoka = projects.find((p) => p.id === 'soka')!
    expect(frSoka.desc).not.toBe(enSoka.desc)
    expect(frSoka.category).not.toBe(enSoka.category)
    expect(frSoka.detail.role).not.toBe(enSoka.detail.role)
    expect(frSoka.detail.impact).not.toBe(enSoka.detail.impact)
  })

  it("preserves locale-independent fields for 'fr'", () => {
    const fr = localizeProjects('fr')
    fr.forEach((p) => {
      const en = projects.find((e) => e.id === p.id)!
      expect(p.id).toBe(en.id)
      expect(p.num).toBe(en.num)
      expect(p.name).toBe(en.name)
      expect(p.year).toBe(en.year)
      expect(p.client).toBe(en.client)
      expect(p.tags).toEqual(en.tags)
      expect(p.detail.stack).toBe(en.detail.stack)
      expect(p.link).toBe(en.link)
    })
  })

  it('provides non-empty French copy for all 9 projects', () => {
    const fr = localizeProjects('fr')
    expect(fr).toHaveLength(9)
    fr.forEach((p) => {
      expect(p.desc.length).toBeGreaterThan(0)
      expect(p.category.length).toBeGreaterThan(0)
      expect(p.detail.role.length).toBeGreaterThan(0)
      expect(p.detail.impact.length).toBeGreaterThan(0)
    })
  })
})
