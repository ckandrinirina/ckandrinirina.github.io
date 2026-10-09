// Single TypeScript source of truth for the shape of all bilingual portfolio
// content. Both `src/content/fr.ts` and `src/content/en.ts` must satisfy
// `PortfolioContent` via the `satisfies` operator so a field missing in one
// locale is a compile-time error rather than a silent runtime gap.
//
// No JSX, no Tailwind classes, no presentation logic — declarations only.

/**
 * Hero section copy: the above-the-fold introduction.
 *
 * The `name`/`title`/`positioning`/`location` + `cta*` fields are the legacy
 * shape still read by `components/sections/Hero.tsx` (removed in 04-01). The
 * Atelier HomeView additionally reads `greet`, `tagline`, and the `roles` rotor.
 */
export interface HeroContent {
  name: string
  title: string
  positioning: string
  /** City + country only. The full home address is intentionally never shown. */
  location: string
  ctaViewProjects: string
  ctaDownloadCv: string
  ctaContact: string
  /** Atelier: short greeting line above the name (e.g. "Hi, I'm"). */
  greet: string
  /** Atelier: one-line value proposition under the name. */
  tagline: string
  /** Atelier: rotating role terms cycled in the Hero rotor. */
  roles: string[]
}

/** About section copy: a single narrative paragraph. */
export interface AboutContent {
  narrative: string
}

/**
 * One labelled bucket of skills (e.g. "Front-end", "Databases"). `items` holds
 * display strings that vary by locale, so it is a plain `string[]` rather than
 * a union of known skill names.
 */
export interface SkillGroup {
  label: string
  items: string[]
}

/** A single project bullet rendered inside an `ExperienceEntry`. */
export interface ExperienceProject {
  name: string
  description: string
}

/**
 * One professional role. `techHighlights` is a flat array because the role
 * level does not need labelled groups — `SkillGroup` is only used by the
 * top-level skills section.
 */
export interface ExperienceEntry {
  company: string
  role: string
  period: string
  techHighlights: string[]
  projects: ExperienceProject[]
}

/** A curated project card rendered in the dedicated Projects section. */
export interface ProjectEntry {
  name: string
  company: string
  description: string
  techTags: string[]
}

/**
 * One education row. `institution` accepts an empty string so the Baccalaureate
 * row (where the institution is unknown) can be expressed without making the
 * field nullable — keeping a single shape across every row simplifies the
 * table renderer.
 */
export interface EducationEntry {
  qualification: string
  institution: string
  year: string
}

/** One spoken language with its proficiency label. */
export interface SpokenLanguage {
  language: string
  proficiency: string
}

/**
 * One key/value row in the Atelier Contact card. `copy: true` marks a row whose
 * value can be copied to the clipboard; `href` makes it a link (mail/tel/url).
 *
 * `copyValue` overrides what lands on the clipboard when it differs from the
 * displayed `value` (e.g. WhatsApp shows "+261 38 50 966 64" but copies the
 * unspaced "+261385096664"). `muted` is an optional trailing fragment rendered
 * in the muted colour (e.g. the "· UTC+3" after a location). `dot` colours a
 * leading status bullet ("●") in the value — "success" for the open/available
 * row.
 */
export interface ContactMetaRow {
  label: string
  value: string
  href?: string
  copy?: boolean
  /** Clipboard payload when it differs from the displayed `value`. */
  copyValue?: string
  /** Trailing fragment rendered muted, appended after the value. */
  muted?: string
  /** Leading status bullet colour. */
  dot?: 'success'
}

/**
 * The Atelier Contact "pitch" card: a serif heading, two body paragraphs, and a
 * signature. Replaces the former single `pitch` string so the view can mirror
 * the reference markup verbatim (`<h3>` + two `<p>` + `<div class="sig">`).
 */
export interface ContactPitch {
  heading: string
  paragraphs: [string, string]
  signature: string
}

/**
 * Contact section copy. Social links live in `lib/constants.ts`, not here.
 *
 * `location`/`intro` are the legacy fields read by the doomed
 * `components/sections/Contact.tsx`. The Atelier ContactView reads `pitch`,
 * the `languages` rows (spoken languages moved here from the dropped Languages
 * section), and the `meta` key/value rows.
 */
export interface ContactContent {
  location: string
  intro: string
  /** Atelier: the structured pitch card (heading + two paragraphs + signature). */
  pitch: ContactPitch
  /** Atelier: spoken languages rendered as a Contact-card row. */
  languages: string[]
  /** Atelier: key/value rows (email, WhatsApp, region, status, …). */
  meta: ContactMetaRow[]
}

/** The nine known project ids (the fixed showcase set). */
export type ProjectId =
  | 'soka'
  | 'soka-live'
  | 'ludoka'
  | 'bmoi-intranet'
  | 'eer'
  | 'shoyo'
  | 'ocr'
  | 'happy'
  | 'theseis'

/** The expanded detail shown in a project's modal. */
export interface ProjectDetail {
  role: string
  impact: string
  /** A single " · "-separated stack string (NOT an array — renders inline). */
  stack: string
}

/**
 * A featured work entry. Locale-independent (proper nouns + tech), so it lives
 * in `content/projects.ts` rather than the per-locale modules.
 */
export interface Project {
  id: ProjectId
  /** Two-digit ordinal, "01"…"09". */
  num: string
  name: string
  /** "2025" or a range like "2021–24". */
  year: string
  role: string
  client: string
  /** e.g. "Platform · Web3". */
  category: string
  /** External link, or null (a "#" placeholder is allowed per the doc). */
  link: string | null
  repo: string | null
  /** Card summary. */
  desc: string
  tags: string[]
  detail: ProjectDetail
}

/**
 * The locale-dependent subset of a `Project` — the human-language copy that
 * reads differently in French and English. Proper nouns, tech, years, clients,
 * tags and the stack string stay locale-independent in `content/projects.ts`;
 * this overlay (one per non-default locale) is merged in at render time by
 * `localizeProjects(locale)`.
 */
export interface ProjectCopy {
  role: string
  category: string
  desc: string
  detail: {
    role: string
    impact: string
  }
}

/** One row of the Atelier experience timeline. */
export interface TimelineEntry {
  year: string
  role: string
  company: string
  desc: string
  /** Stack chips — an array here (unlike `ProjectDetail.stack`). */
  stack: string[]
}

/** A Home stat tile. `n` is numeric so the CountUp primitive can animate it. */
export interface StatTile {
  n: number
  /** Optional unit suffix appended after the number (e.g. "+"). */
  suffix?: string
  label: string
}

/** The Home "Now" card: what I'm currently working on. */
export interface NowContent {
  headline: string
  body: string
  meta: {
    label: string
    period: string
  }
}

/** One numbered principle in the "How I work" view. */
export interface ProcessPrinciple {
  /** Two-digit ordinal, "01"…"05". */
  num: string
  title: string
  body: string
}

/**
 * One Atelier skill card (Frontend / Backend / Data & Cloud / AI & Craft).
 * `lead` holds the solid headline pills (the daily drivers); `items` the
 * outlined secondary technologies. `deco` is the single decorative watermark
 * letter rendered via the `.skill-card::before` `content: attr(data-deco)`.
 */
export interface SkillCard {
  title: string
  /** Decorative watermark letter (e.g. "F" for Frontend). */
  deco: string
  lead: string[]
  items: string[]
}

/**
 * Root content shape. The locale modules (`fr.ts`, `en.ts`) implement this
 * interface via `satisfies PortfolioContent` so any field missing in one
 * locale is caught at compile time.
 *
 * This is a transitional superset (story 01-03): the first block is the legacy
 * shape still consumed by `components/sections/*` (removed in 04-01); the second
 * block is the new Atelier model consumed by `views/*`. At integration (04-01)
 * the legacy members are dropped and `timeline`/`skillCards` are renamed to
 * `experience`/`skills`. The new project list lives in `content/projects.ts`.
 */
export interface PortfolioContent {
  // ── Legacy (doomed; read by components/sections/*, removed in 04-01) ──
  about: AboutContent
  skills: SkillGroup[]
  experience: ExperienceEntry[]
  projects: ProjectEntry[]
  education: EducationEntry[]
  spokenLanguages: SpokenLanguage[]

  // ── Shared (extended in place) ──
  hero: HeroContent
  contact: ContactContent

  // ── New Atelier model (read by views/*) ──
  now: NowContent
  stats: StatTile[]
  marquee: string[]
  /** New experience shape; → renamed to `experience` in 04-01. */
  timeline: TimelineEntry[]
  /** New skills shape; → renamed to `skills` in 04-01. */
  skillCards: SkillCard[]
  process: ProcessPrinciple[]
}
