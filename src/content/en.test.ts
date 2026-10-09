// Tests for `src/content/en.ts` — English portfolio content module.
//
// Strategy (two layers):
//   1. Compile-time — the `export default { ... } satisfies PortfolioContent`
//      in en.ts will fail `tsc -b` if any required field is missing or mistyped.
//   2. Runtime — Vitest asserts exact values from the acceptance criteria and
//      structural invariants that the type system alone cannot enforce (e.g.
//      exact hero.title string, exactly 8 skill groups, exactly 7 experience
//      entries, exactly 3 education entries, etc.).
import { describe, expect, it } from 'vitest'
import en from './en'

describe('en.ts — hero section', () => {
  it('has the correct name', () => {
    expect(en.hero.name).toBe('Erick Andrinirina')
  })

  it('has the correct title', () => {
    expect(en.hero.title).toBe('Fullstack JavaScript Engineer')
  })

  it('has a positioning line referencing 7 years of experience', () => {
    expect(en.hero.positioning).toMatch(/7/)
  })

  it('has the correct location', () => {
    expect(en.hero.location).toBe('Antananarivo, Madagascar')
  })

  it('has all three CTA labels as non-empty English strings', () => {
    expect(en.hero.ctaViewProjects.length).toBeGreaterThan(0)
    expect(en.hero.ctaDownloadCv.length).toBeGreaterThan(0)
    expect(en.hero.ctaContact.length).toBeGreaterThan(0)
  })
})

describe('en.ts — about section', () => {
  it('has a non-empty narrative paragraph', () => {
    expect(typeof en.about.narrative).toBe('string')
    expect(en.about.narrative.length).toBeGreaterThan(0)
  })

  it('narrative mentions 7 years of experience', () => {
    expect(en.about.narrative).toMatch(/7/)
  })

  it('narrative mentions key technologies', () => {
    const narrative = en.about.narrative
    expect(narrative).toMatch(/React/)
    expect(narrative).toMatch(/Node\.js/)
  })
})

describe('en.ts — skills section', () => {
  it('has exactly 8 skill groups', () => {
    expect(en.skills).toHaveLength(8)
  })

  it('group labels are in English and match the spec', () => {
    const labels = en.skills.map((g) => g.label)
    expect(labels).toContain('Languages')
    expect(labels).toContain('Front-end frameworks & libraries')
    expect(labels).toContain('Back-end frameworks')
    expect(labels).toContain('Databases')
    expect(labels).toContain('Tooling & DevOps')
    expect(labels).toContain('Testing')
    expect(labels).toContain('AI & Specialized')
    expect(labels).toContain('Project & design tools')
  })

  it('every skill group has at least one item', () => {
    en.skills.forEach((group) => {
      expect(group.items.length).toBeGreaterThan(0)
    })
  })

  it('Languages group contains TypeScript and JavaScript', () => {
    const lang = en.skills.find((g) => g.label === 'Languages')
    expect(lang?.items).toContain('TypeScript')
    expect(lang?.items).toContain('JavaScript')
  })
})

describe('en.ts — experience section', () => {
  it('has exactly 7 experience entries', () => {
    expect(en.experience).toHaveLength(7)
  })

  it('first entry is SOKA / YAS Madagascar (most recent)', () => {
    expect(en.experience[0].company).toBe('SOKA / YAS Madagascar')
  })

  it('last entry is INGENOSYA (oldest)', () => {
    expect(en.experience[6].company).toBe('INGENOSYA')
  })

  it('every entry has company, role, period, techHighlights, and projects', () => {
    en.experience.forEach((entry) => {
      expect(entry.company.length).toBeGreaterThan(0)
      expect(entry.role.length).toBeGreaterThan(0)
      expect(entry.period.length).toBeGreaterThan(0)
      expect(Array.isArray(entry.techHighlights)).toBe(true)
      expect(Array.isArray(entry.projects)).toBe(true)
    })
  })

  it('every project within each experience has a name and English description', () => {
    en.experience.forEach((entry) => {
      entry.projects.forEach((project) => {
        expect(project.name.length).toBeGreaterThan(0)
        expect(project.description.length).toBeGreaterThan(0)
      })
    })
  })

  it('SOKA entry projects include SOKA CLUB, SOKA LIVE, and LUDOKA', () => {
    const soka = en.experience[0]
    const names = soka.projects.map((p) => p.name)
    expect(names).toContain('SOKA CLUB')
    expect(names).toContain('SOKA LIVE')
    expect(names).toContain('LUDOKA')
  })

  it('BMOI entry has EER Full Digital project', () => {
    const bmoi = en.experience.find((e) => e.company === 'BMOI Madagascar')
    expect(bmoi).toBeDefined()
    const names = bmoi!.projects.map((p) => p.name)
    expect(names).toContain('EER Full Digital')
  })
})

describe('en.ts — projects (curated) section', () => {
  it('has at least one curated project', () => {
    expect(en.projects.length).toBeGreaterThan(0)
  })

  it('every curated project has name, company, English description, and techTags', () => {
    en.projects.forEach((project) => {
      expect(project.name.length).toBeGreaterThan(0)
      expect(project.company.length).toBeGreaterThan(0)
      expect(project.description.length).toBeGreaterThan(0)
      expect(Array.isArray(project.techTags)).toBe(true)
      expect(project.techTags.length).toBeGreaterThan(0)
    })
  })
})

describe('en.ts — education section', () => {
  it('has exactly 3 education entries', () => {
    expect(en.education).toHaveLength(3)
  })

  it('Baccalaureate entry has empty institution and year 2013', () => {
    const bac = en.education.find((e) => e.year === '2013')
    expect(bac).toBeDefined()
    expect(bac?.institution).toBe('')
    expect(bac?.year).toBe('2013')
  })

  it('Master entry is from École Supérieure Polytechnique d\'Antananarivo', () => {
    const master = en.education.find((e) =>
      e.institution.includes('Polytechnique'),
    )
    expect(master).toBeDefined()
  })
})

describe('en.ts — spokenLanguages section', () => {
  it('has exactly 3 spoken languages', () => {
    expect(en.spokenLanguages).toHaveLength(3)
  })

  it('includes Malagasy as Native', () => {
    const malagasy = en.spokenLanguages.find((l) => l.language === 'Malagasy')
    expect(malagasy).toBeDefined()
    expect(malagasy?.proficiency).toBe('Native')
  })

  it('includes French as Fluent', () => {
    const french = en.spokenLanguages.find((l) => l.language === 'French')
    expect(french).toBeDefined()
    expect(french?.proficiency).toBe('Fluent')
  })

  it('includes English at intermediate level', () => {
    const english = en.spokenLanguages.find((l) => l.language === 'English')
    expect(english).toBeDefined()
    expect(english?.proficiency).toBe('Intermediate')
  })
})

describe('en.ts — contact section', () => {
  it('location is exactly "Antananarivo, Madagascar"', () => {
    expect(en.contact.location).toBe('Antananarivo, Madagascar')
  })

  it('intro is a non-empty English string', () => {
    expect(typeof en.contact.intro).toBe('string')
    expect(en.contact.intro.length).toBeGreaterThan(0)
  })

  it('contact does not contain a full street address', () => {
    // Full address would include a street number or suburb — only city+country allowed
    const contactStr = JSON.stringify(en.contact)
    expect(contactStr).not.toMatch(/\d{1,5}\s+\w+\s+(Street|Road|Ave|Blvd)/i)
  })
})
