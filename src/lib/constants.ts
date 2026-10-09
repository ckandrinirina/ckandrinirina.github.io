/**
 * Site metadata — name, title, location, and contact information.
 * Typed with SiteMeta interface and validated at compile time.
 * Location is limited to city/country for privacy (no street address).
 */

import { projects } from '../content/projects'

interface SiteMeta {
  name: string
  title: string
  locationLabel: string
  email: string
  whatsapp: string
}

export const SITE_META = {
  name: 'Erick Andrinirina',
  title: 'Full-stack Developer',
  locationLabel: 'Antananarivo, Madagascar',
  email: 'ckandrinirina@gmail.com',
  whatsapp: 'https://wa.me/261385096664',
} as const satisfies SiteMeta

/**
 * Social media profile URLs.
 * GitHub and LinkedIn are marked as [TO BE DEFINED] placeholders.
 * TODO: replace with actual URLs when available.
 */

interface SocialLinks {
  github: string
  linkedin: string
}

export const SOCIAL_LINKS = {
  github: '', // TODO: replace with actual URL
  linkedin: '', // TODO: replace with actual URL
} as const satisfies SocialLinks

/**
 * Navigation section configuration.
 * Each entry maps a section id to an i18n label key.
 * Order determines nav link sequence and scroll-spy priority.
 */

interface NavSection {
  id: string
  labelKey: string
}

export const NAV_SECTIONS = [
  { id: 'hero', labelKey: 'nav.hero' },
  { id: 'about', labelKey: 'nav.about' },
  { id: 'skills', labelKey: 'nav.skills' },
  { id: 'experience', labelKey: 'nav.experience' },
  { id: 'projects', labelKey: 'nav.projects' },
  { id: 'education', labelKey: 'nav.education' },
  { id: 'languages', labelKey: 'nav.languages' },
  { id: 'contact', labelKey: 'nav.contact' },
] as const satisfies readonly NavSection[]

/**
 * Atelier Terminal route system.
 *
 * ROUTE_ORDER — the canonical ordered list of all route ids.
 * ROUTE_META  — per-route metadata: label (UI key), glyph (decorative char),
 *               optional badge (e.g. project count), and breadcrumb string.
 * NAV_GROUPS  — groups the routes into the two sidebar sections:
 *               "workspace" (primary nav) and "connect" (secondary).
 *
 * Adding a new route: add an entry to ROUTE_META, add its id to ROUTE_ORDER
 * in the desired position, and add it to the appropriate NAV_GROUPS entry.
 * The sidebar and topbar components consume this data and require no code edits.
 */

/** All route identifiers — single source of truth for ordering. */
export type RouteId =
  | 'home'
  | 'work'
  | 'experience'
  | 'skills'
  | 'process'
  | 'contact'

export const ROUTE_ORDER: readonly RouteId[] = [
  'home',
  'work',
  'experience',
  'skills',
  'process',
  'contact',
]

/** Per-route metadata consumed by Sidebar and Topbar. */
export interface RouteMeta {
  /** UI label key in ui.ts (maps to the sidebar row label). */
  labelKey: string
  /** Decorative glyph character shown in the sidebar row (aria-hidden). */
  glyph: string
  /** Optional badge text (e.g. project count). */
  badge?: string
  /** Breadcrumb string shown in the Topbar (e.g. "selected-work"). */
  breadcrumb: string
}

export const ROUTE_META: Record<RouteId, RouteMeta> = {
  home: {
    labelKey: 'navHome',
    glyph: '◇',
    breadcrumb: 'home',
  },
  work: {
    labelKey: 'navWork',
    glyph: '▸',
    badge: String(projects.length),
    breadcrumb: 'selected-work',
  },
  experience: {
    labelKey: 'navExperience',
    glyph: '≡',
    breadcrumb: 'experience',
  },
  skills: {
    labelKey: 'navSkills',
    glyph: '⌬',
    breadcrumb: 'skills',
  },
  process: {
    labelKey: 'navProcess',
    glyph: '✦',
    breadcrumb: 'how-i-work',
  },
  contact: {
    labelKey: 'navContact',
    glyph: '@',
    breadcrumb: 'contact',
  },
}

/** Sidebar nav group definitions — order determines visual grouping. */
export interface NavGroup {
  /** Group label shown above the rows (e.g. "workspace"). */
  label: string
  /** Ordered route ids in this group. */
  routes: readonly RouteId[]
}

export const NAV_GROUPS: readonly NavGroup[] = [
  {
    label: 'workspace',
    routes: ['home', 'work', 'experience', 'skills', 'process'],
  },
  {
    label: 'connect',
    routes: ['contact'],
  },
]
