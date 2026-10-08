---
slug: i18n-content
design: planned
---

# Internationalization & Content

> Feature doc — self-contained. A story for this feature reads THIS file
> (+ ../../folder-structure.md, + ../../\_shared.md when noted), not the other feature docs.

## Summary

Compile-in, typed bilingual content (French default, English switchable) plus the
`LanguageProvider`/`useLanguage` context and the `LanguageSwitcher` control. The
boundary: this feature owns the content **data and its types**; the views that render
each content slice belong to [content-views](../content-views/index.md), and the
project artwork/cards belong to [project-showcase](../project-showcase/index.md).
There are no network requests — all content is bundled.

## Components

### `LanguageProvider`

- **Type:** React context provider — `src/i18n/LanguageProvider.tsx`
- **State:** `locale: 'en' | 'fr'`.
- **Init:** `localStorage['locale']` → else `navigator.language` prefix (`en`/`fr`)
  → else `'fr'` (default).
- **Effect:** sets `document.documentElement.lang`; persists the choice.
- **Exposes (via `useLanguage`):** `{ locale, setLocale, content, t }` where `content`
  is the resolved per-locale object and `t(key)` resolves UI micro-labels.

### `LanguageSwitcher`

- **Type:** UI control — `src/components/ui/LanguageSwitcher.tsx`
- **Purpose:** EN/FR toggle or segmented control; exposes `aria-label`. Lives in the
  sidebar status block or topbar.

### `useLanguage()` hook

Context accessor returning `{ locale, setLocale, content, t }`.

## Data — content model

Content objects (`src/content/fr.ts`, `src/content/en.ts`) both implement the
`PortfolioContent` interface in `src/content/types.ts`, guaranteeing EN/FR parity at
**compile time** — a missing French field is a type error (also asserted by a runtime
parity test).

```ts
interface PortfolioContent {
  hero: HeroContent // greet, name, tagline, roles[], cta labels
  now: NowContent // headline + body + meta (label, period)
  stats: StatTile[] // [{ n, suffix?, label }]
  marquee: string[] // tech tokens
  projects: Project[] // 8 entries (see below)
  experience: TimelineEntry[] // 7 entries
  skills: SkillCard[] // 4 cards (Frontend, Backend, Data & Cloud, AI & Craft)
  process: ProcessPrinciple[] // 5 numbered principles
  contact: ContactContent // pitch + meta rows (languages here)
  ui: UiLabels // eyebrows, "Read case", "Visit live", "copy"/"copied", etc.
}
```

- `content/fr.ts` is the source for new copy; `content/en.ts` mirrors the same shape
  (the original mockup copy is the EN baseline).
- `Education` and standalone `spokenLanguages` types are **removed** — languages now
  live in `contact.languages: string[]`, rendered as a row in the Contact card.

### `Project` shape

```ts
interface Project {
  id:
    | 'soka'
    | 'soka-live'
    | 'ludoka'
    | 'eer'
    | 'shoyo'
    | 'ocr'
    | 'happy'
    | 'theseis'
  num: string // "01"…"08"
  name: string
  year: string // "2025" or "2021–24"
  role: string // "Lead Fullstack"
  client: string // "YAS Madagascar"
  category: string // "Platform · Web3"
  link: string | null // "#" if none
  repo: string | null
  desc: string // card summary
  tags: string[]
  detail: { role: string; impact: string; stack: string /* " · "-separated */ }
}
```

`src/content/projects.ts` is the derived project list (id/num/year/category/tags/detail).
Consumed by [project-showcase](../project-showcase/index.md).

### `TimelineEntry` shape

```ts
interface TimelineEntry {
  year: string
  role: string
  company: string
  desc: string
  stack: string[]
}
```

### UI micro-labels

`src/i18n/ui.ts` holds the `t(key)`-resolved labels: nav labels, ⌘K group labels,
copy/"copied" labels, eyebrows, footer chips.

## Flows

### Content rendering

```
LanguageProvider
  ├─ locale = 'fr' (default) | 'en'
  ├─ content = locale === 'en' ? enContent : frContent   // typed, same shape
  └─ provides { locale, content, t } via context

View component (e.g. ExperienceView)
  └─ const { content } = useLanguage()
       └─ render content.experience[]   // re-renders when locale changes
```

### Language switch

```
User clicks LanguageSwitcher (EN ⇄ FR)
  └─ setLocale('fr')
       ├─ context state updates → all consumers re-render with the new content
       ├─ document.documentElement.lang = 'fr'
       └─ localStorage['locale'] = 'fr'      // remembered for next visit
```

## Shared dependencies

- [Provider/context conventions](../../_shared.md#providers--context) — the context
  pattern `LanguageProvider` follows.
- [Accessibility & reduced-motion conventions](../../_shared.md#accessibility--reduced-motion) —
  language switch sets `<html lang>` correctly.

## Changelog

- 2026-06-02 · doc-optimizer upgrade — feature doc created from `components.md`,
  `data-flow.md`, and the Atelier Terminal UI design record.
