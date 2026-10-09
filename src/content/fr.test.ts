// Tests for src/content/fr.ts — French default locale content module.
//
// Strategy:
//   1. Compile-time: `satisfies PortfolioContent` in fr.ts catches missing/surplus fields.
//   2. Runtime (this file): Vitest assertions against each acceptance criterion.
//
// These tests are intentionally data-driven — they verify the content values
// match the spec and story requirements rather than just checking shapes.

import { describe, expect, it } from 'vitest'
import type { PortfolioContent } from './types'
import fr from './fr'

// Type guard: verifies fr.ts satisfies the interface at compile time too.
const _typeCheck: PortfolioContent = fr

describe('fr.ts — hero section', () => {
  it('has the correct name', () => {
    expect(fr.hero.name).toBe('Erick Andrinirina')
  })

  it('has a French title referencing Fullstack JavaScript', () => {
    expect(fr.hero.title).toContain('Fullstack')
    expect(fr.hero.title).toContain('JavaScript')
  })

  it('positioning references 7 years of experience', () => {
    expect(fr.hero.positioning).toMatch(/7\s*(ans|années|year)/i)
  })

  it('location is exactly "Antananarivo, Madagascar"', () => {
    expect(fr.hero.location).toBe('Antananarivo, Madagascar')
  })

  it('has three CTA strings in French (non-empty)', () => {
    expect(fr.hero.ctaViewProjects).toBeTruthy()
    expect(fr.hero.ctaDownloadCv).toBeTruthy()
    expect(fr.hero.ctaContact).toBeTruthy()
  })
})

describe('fr.ts — about section', () => {
  it('narrative is a non-empty French paragraph', () => {
    expect(fr.about.narrative.length).toBeGreaterThan(50)
  })

  it('narrative references 7 years', () => {
    expect(fr.about.narrative).toMatch(/7\s*(ans|années)/i)
  })

  it('narrative mentions key technologies', () => {
    expect(fr.about.narrative).toMatch(
      /React|Angular|Node\.js|Symfony|Laravel/i,
    )
  })

  it('narrative mentions databases', () => {
    expect(fr.about.narrative).toMatch(/MongoDB|PostgreSQL|MySQL/i)
  })
})

describe('fr.ts — skills section', () => {
  it('has exactly 8 skill groups', () => {
    expect(fr.skills).toHaveLength(8)
  })

  it('every group has a non-empty label and at least one item', () => {
    fr.skills.forEach((group) => {
      expect(group.label.length).toBeGreaterThan(0)
      expect(group.items.length).toBeGreaterThan(0)
    })
  })

  it('includes a Languages group with TypeScript and JavaScript', () => {
    const group = fr.skills.find(
      (g) =>
        g.label.toLowerCase().includes('langage') ||
        g.label.toLowerCase().includes('language'),
    )
    expect(group).toBeDefined()
    expect(group!.items).toContain('TypeScript')
    expect(group!.items).toContain('JavaScript')
  })

  it('includes a Front-end group with React and Angular', () => {
    const group = fr.skills.find(
      (g) =>
        g.label.toLowerCase().includes('front') ||
        g.label.toLowerCase().includes('frontend'),
    )
    expect(group).toBeDefined()
    expect(group!.items).toContain('React')
    expect(group!.items).toContain('Angular')
  })

  it('includes a Back-end group with Node.js', () => {
    const group = fr.skills.find(
      (g) =>
        g.label.toLowerCase().includes('back') ||
        g.label.toLowerCase().includes('backend'),
    )
    expect(group).toBeDefined()
    expect(group!.items.some((i) => i.includes('Node'))).toBe(true)
  })

  it('includes a Databases group with PostgreSQL', () => {
    const group = fr.skills.find(
      (g) =>
        g.label.toLowerCase().includes('base') ||
        g.label.toLowerCase().includes('database') ||
        g.label.toLowerCase().includes('donnée'),
    )
    expect(group).toBeDefined()
    expect(group!.items).toContain('PostgreSQL')
  })

  it('includes a Testing group with Jest', () => {
    const group = fr.skills.find((g) => g.label.toLowerCase().includes('test'))
    expect(group).toBeDefined()
    expect(group!.items).toContain('Jest')
  })

  it('includes an AI/Specialized group mentioning OpenAI or OCR or Blockchain', () => {
    const group = fr.skills.find(
      (g) =>
        g.label.toLowerCase().includes('ai') ||
        g.label.toLowerCase().includes('ia') ||
        g.label.toLowerCase().includes('spécialisé') ||
        g.label.toLowerCase().includes('specialized'),
    )
    expect(group).toBeDefined()
    expect(group!.items.some((i) => /openai|ocr|blockchain/i.test(i))).toBe(
      true,
    )
  })

  it('includes a Tooling/DevOps group with Git and Docker', () => {
    const group = fr.skills.find(
      (g) =>
        g.label.toLowerCase().includes('tool') ||
        g.label.toLowerCase().includes('outil') ||
        g.label.toLowerCase().includes('devops'),
    )
    expect(group).toBeDefined()
    expect(group!.items).toContain('Git')
    expect(group!.items).toContain('Docker')
  })

  it('includes a Project/design tools group mentioning Jira or Figma', () => {
    const group = fr.skills.find(
      (g) =>
        g.label.toLowerCase().includes('projet') ||
        g.label.toLowerCase().includes('project') ||
        g.label.toLowerCase().includes('design') ||
        g.label.toLowerCase().includes('gestion'),
    )
    expect(group).toBeDefined()
    expect(group!.items.some((i) => /jira|figma/i.test(i))).toBe(true)
  })
})

describe('fr.ts — experience section', () => {
  it('has exactly 7 entries', () => {
    expect(fr.experience).toHaveLength(7)
  })

  it('first entry is SOKA / YAS Madagascar (Jan 2025 – present)', () => {
    const entry = fr.experience[0]
    expect(entry.company).toMatch(/SOKA|YAS/)
    expect(entry.period).toMatch(/jan(v|uary)?[\s.]*2025/i)
  })

  it('second entry is BMOI Madagascar (Jul 2024 – Jan 2025)', () => {
    const entry = fr.experience[1]
    expect(entry.company).toMatch(/BMOI/)
    expect(entry.period).toMatch(/juill?(let)?[\s.]*2024|jul[\s.]*2024/i)
  })

  it('third entry is SHOYO (Jan 2021 – Jul 2024)', () => {
    const entry = fr.experience[2]
    expect(entry.company).toMatch(/SHOYO/)
    expect(entry.period).toMatch(/jan(v|uary)?[\s.]*2021/i)
  })

  it('fourth entry is VTC Academy (Jun 2020 – Dec 2020)', () => {
    const entry = fr.experience[3]
    expect(entry.company).toMatch(/VTC Academy/)
    expect(entry.period).toMatch(/juin\s*2020|jun[\s.]*2020/i)
  })

  it('fifth entry is PANAFRI HELP (Jan 2020 – Jun 2020)', () => {
    const entry = fr.experience[4]
    expect(entry.company).toMatch(/PANAFRI/)
    expect(entry.period).toMatch(/jan(v|uary)?[\s.]*2020/i)
  })

  it('sixth entry is CREACTISOFT (Sept 2019 – Dec 2020)', () => {
    const entry = fr.experience[5]
    expect(entry.company).toMatch(/CREACTISOFT/)
    expect(entry.period).toMatch(/sep(t|tembre)?[\s.]*2019/i)
  })

  it('seventh entry is INGENOSYA (Oct 2018 – Sept 2019)', () => {
    const entry = fr.experience[6]
    expect(entry.company).toMatch(/INGENOSYA/)
    expect(entry.period).toMatch(/oct(obre)?[\s.]*2018/i)
  })

  it('every entry has a role and techHighlights', () => {
    fr.experience.forEach((entry) => {
      expect(entry.role).toBeTruthy()
      expect(entry.techHighlights.length).toBeGreaterThan(0)
    })
  })

  describe('SOKA/YAS projects', () => {
    it('has SOKA CLUB, SOKA LIVE, LUDOKA projects', () => {
      const entry = fr.experience[0]
      const names = entry.projects.map((p) => p.name)
      expect(names.some((n) => /SOKA CLUB|SOKA Club/i.test(n))).toBe(true)
      expect(names.some((n) => /SOKA LIVE|SOKA Live/i.test(n))).toBe(true)
      expect(names.some((n) => /LUDOKA/i.test(n))).toBe(true)
    })

    it('every project has a non-empty description', () => {
      fr.experience[0].projects.forEach((p) => {
        expect(p.description.length).toBeGreaterThan(10)
      })
    })
  })

  describe('BMOI projects', () => {
    it('has EER Full Digital project', () => {
      const entry = fr.experience[1]
      const names = entry.projects.map((p) => p.name)
      expect(names.some((n) => /EER/i.test(n))).toBe(true)
    })
  })

  describe('SHOYO projects', () => {
    it('has SHOYO, THESEIS, Happy Capital, OCR projects', () => {
      const entry = fr.experience[2]
      const names = entry.projects.map((p) => p.name)
      expect(names.some((n) => /SHOYO/i.test(n))).toBe(true)
      expect(names.some((n) => /THESEIS/i.test(n))).toBe(true)
      expect(names.some((n) => /Happy Capital|My Capital/i.test(n))).toBe(true)
      expect(names.some((n) => /OCR/i.test(n))).toBe(true)
    })
  })

  describe('VTC Academy projects', () => {
    it('has VTC Academy platform project', () => {
      const entry = fr.experience[3]
      const names = entry.projects.map((p) => p.name)
      expect(names.some((n) => /VTC/i.test(n))).toBe(true)
    })
  })

  describe('PANAFRI HELP projects', () => {
    it('has PANAFRI HELP platform project', () => {
      const entry = fr.experience[4]
      const names = entry.projects.map((p) => p.name)
      expect(names.some((n) => /PANAFRI/i.test(n))).toBe(true)
    })
  })

  describe('CREACTISOFT projects', () => {
    it('has IPSUM, SOLIUS, MOZART, ELISE projects', () => {
      const entry = fr.experience[5]
      const names = entry.projects.map((p) => p.name)
      expect(names.some((n) => /IPSUM/i.test(n))).toBe(true)
      expect(names.some((n) => /SOLIUS/i.test(n))).toBe(true)
      expect(names.some((n) => /MOZART/i.test(n))).toBe(true)
      expect(names.some((n) => /ELISE/i.test(n))).toBe(true)
    })
  })

  describe('INGENOSYA projects', () => {
    it('has BNI Madagascar, FMFP, FORET MAD projects', () => {
      const entry = fr.experience[6]
      const names = entry.projects.map((p) => p.name)
      expect(names.some((n) => /BNI/i.test(n))).toBe(true)
      expect(names.some((n) => /FMFP/i.test(n))).toBe(true)
      expect(names.some((n) => /FORET/i.test(n))).toBe(true)
    })
  })
})

describe('fr.ts — projects section (curated)', () => {
  it('has at least 10 curated projects', () => {
    expect(fr.projects.length).toBeGreaterThanOrEqual(10)
  })

  it('includes key named projects', () => {
    const names = fr.projects.map((p) => p.name)
    expect(names.some((n) => /SOKA Club|SOKA CLUB/i.test(n))).toBe(true)
    expect(names.some((n) => /SOKA Live|SOKA LIVE/i.test(n))).toBe(true)
    expect(names.some((n) => /LUDOKA/i.test(n))).toBe(true)
    expect(names.some((n) => /EER/i.test(n))).toBe(true)
    expect(names.some((n) => /SHOYO/i.test(n))).toBe(true)
    expect(names.some((n) => /THESEIS/i.test(n))).toBe(true)
    expect(names.some((n) => /Happy Capital|My Capital/i.test(n))).toBe(true)
    expect(names.some((n) => /OCR/i.test(n))).toBe(true)
    expect(names.some((n) => /VTC/i.test(n))).toBe(true)
    expect(names.some((n) => /PANAFRI/i.test(n))).toBe(true)
  })

  it('every project has a non-empty description and techTags', () => {
    fr.projects.forEach((project) => {
      expect(project.description.length).toBeGreaterThan(10)
      expect(project.techTags.length).toBeGreaterThan(0)
      expect(project.company).toBeTruthy()
    })
  })
})

describe('fr.ts — education section', () => {
  it('has exactly 3 entries', () => {
    expect(fr.education).toHaveLength(3)
  })

  it('first entry is Advanced web development (NEITIC, 2019)', () => {
    const entry = fr.education[0]
    expect(entry.institution).toMatch(/NEITIC/)
    expect(entry.year).toMatch(/2019/)
  })

  it("second entry is Master's Engineer (ESP Antananarivo, 2018)", () => {
    const entry = fr.education[1]
    expect(entry.institution).toMatch(/Polytechnique|ESP/)
    expect(entry.year).toMatch(/2018/)
  })

  it('third entry is Baccalaureate with empty institution (2013)', () => {
    const entry = fr.education[2]
    expect(entry.institution).toBe('')
    expect(entry.year).toMatch(/2013/)
    expect(entry.qualification).toMatch(/bac/i)
  })
})

describe('fr.ts — spokenLanguages section', () => {
  it('has exactly 3 entries', () => {
    expect(fr.spokenLanguages).toHaveLength(3)
  })

  it('Malagasy is listed as native/langue maternelle', () => {
    const entry = fr.spokenLanguages.find(
      (l) =>
        l.language.toLowerCase().includes('malagasy') ||
        l.language.toLowerCase().includes('malgache'),
    )
    expect(entry).toBeDefined()
    expect(entry!.proficiency).toMatch(/maternell|native/i)
  })

  it('French is listed as courant/fluent', () => {
    const entry = fr.spokenLanguages.find(
      (l) =>
        l.language.toLowerCase().includes('français') ||
        l.language.toLowerCase().includes('french'),
    )
    expect(entry).toBeDefined()
    expect(entry!.proficiency).toMatch(/courant|fluent/i)
  })

  it('English is listed at intermediate level', () => {
    const entry = fr.spokenLanguages.find(
      (l) =>
        l.language.toLowerCase().includes('anglais') ||
        l.language.toLowerCase().includes('english'),
    )
    expect(entry).toBeDefined()
    expect(entry!.proficiency).toMatch(/intermédiaire/i)
  })
})

describe('fr.ts — contact section', () => {
  it('location is exactly "Antananarivo, Madagascar"', () => {
    expect(fr.contact.location).toBe('Antananarivo, Madagascar')
  })

  it('intro is a non-empty French string', () => {
    expect(fr.contact.intro.length).toBeGreaterThan(10)
  })

  it('contact contains no street address', () => {
    const contactStr = JSON.stringify(fr.contact)
    // A real street address pairs a number with a street keyword, e.g.
    // "12 rue …" / "5 avenue …". Each keyword is a whole word so JSON tokens
    // like "true" (…rue) or "street" inside keys cannot trigger a false match.
    expect(contactStr).not.toMatch(
      /\b\d{1,5}\s+(rue|avenue|boulevard|street|road|ave|blvd)\b/i,
    )
  })
})

// Ensure the _typeCheck variable is used (avoids "unused variable" lint warning)
describe('fr.ts — TypeScript type compliance', () => {
  it('is assignable to PortfolioContent', () => {
    expect(_typeCheck).toBeDefined()
  })
})
