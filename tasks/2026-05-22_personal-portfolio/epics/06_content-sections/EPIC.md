---
epic: 06
slug: content-sections
title: "Content Sections"
description: "This epic implements the eight visible content sections that make up the portfolio's single-page body: Hero, About, Skills, Experience, Projects, Education, Languages, and Contact."
issue:
pr:
delivery:
---
# Epic 06: Content Sections

## Description

This epic implements the eight visible content sections that make up the portfolio's
single-page body: Hero, About, Skills, Experience, Projects, Education, Languages, and
Contact. Each section component calls `useLanguage()` to retrieve its slice from the
active-locale content object, then renders that slice inside the shared `Section` wrapper
(which provides the `<section id>`, the `<h2>` heading, and the `useReveal` scroll
animation). Hero is the sole exception — it owns the page's single `<h1>` element and
does not delegate heading rendering to `Section`.

The eight section stories (06-01 through 06-08) are independent of each other and can be
built in parallel once Epic 02 primitives (Section, Badge, Card, SocialLinks) and Epic 04
content plumbing (LanguageProvider, content objects, DownloadCvButton) are in place. Each
story delivers a fully functional, locale-aware component plus a co-located test file
where required. The epic closes with story 06-09, which replaces the placeholder slots in
`App.tsx` with the real section components and verifies that the scrollspy nav highlights
correctly end-to-end.

After 06-09 merges, the full single-page portfolio is visible and interactive in both
French and English, and the way is clear for Epic 08 (GitHub Pages deployment) and Epic
09 (QA and accessibility review).

## Goals

- Implement all eight portfolio section components, each reading its content slice via `useLanguage()` and rendered inside the Section wrapper (Hero excepted).
- Ensure all section components update seamlessly on locale switch between French and English.
- Render Experience and Projects content using the Card primitive; Skills content using the Badge primitive; Hero CTAs using DownloadCvButton and SocialLinks.
- Respect privacy rules: city and country only for location; no full home address anywhere; external links use `target="_blank" rel="noopener noreferrer"`.
- Wire all eight sections into `App.tsx` in the correct order and confirm scrollspy nav highlighting works end-to-end.

## Scope

### In Scope

- `src/components/sections/Hero.tsx` — name, title, positioning line, location, CTAs, SocialLinks; owns the single `<h1>`.
- `src/components/sections/Hero.test.tsx` — unit test for Hero.
- `src/components/sections/About.tsx` — profile narrative paragraph.
- `src/components/sections/Skills.tsx` — eight skill groups rendered as Badge chips.
- `src/components/sections/Experience.tsx` — seven roles as Cards, most-recent-first, with project bullets.
- `src/components/sections/Projects.tsx` — project cards with tech Badge tags.
- `src/components/sections/Education.tsx` — three education rows in a table or accessible list.
- `src/components/sections/Languages.tsx` — spoken languages with proficiency levels.
- `src/components/sections/Contact.tsx` — direct links only (email, WhatsApp, GitHub, LinkedIn via SocialLinks) plus location text; no form.
- `src/App.tsx` (modify) — swap section placeholders for real components; confirm ids match scrollspy config.

### Out of Scope

- Any contact form, message inbox, or server-side interaction.
- Blog, articles, or other sections not listed in the spec.
- Content data files (`src/content/fr.ts`, `src/content/en.ts`, `src/content/types.ts`) — Epic 04.
- UI primitives (Badge, Card, Section, SocialLinks, DownloadCvButton) — Epic 02 / Epic 04.
- Header, Footer, navigation structure — Epic 05.
- GitHub Pages deployment workflow — Epic 08.
- Full QA and accessibility audit — Epic 09.

## Dependencies

- **Depends on:** Epic 02 (Section 02-09, Badge 02-05, Card 02-06, SocialLinks 02-10), Epic 04 (LanguageProvider 04-05, DownloadCvButton 04-08), Epic 05 (App shell 05-04).
- **Blocks:** Epic 08 (GitHub Pages deployment), Epic 09 (QA and accessibility review).

## Acceptance Criteria

- [ ] All eight section components exist under `src/components/sections/` and compile without TypeScript errors.
- [ ] Every section renders its content in French (default) and updates correctly when the locale is switched to English.
- [ ] The page contains exactly one `<h1>` element (rendered by Hero); every other section renders an `<h2>` via the Section wrapper.
- [ ] Skills section renders all eight skill groups with their labels and each skill as a Badge chip.
- [ ] Experience section renders all seven roles most-recent-first, each inside a Card with company, role, period, tech highlights, and project bullets.
- [ ] Projects section renders all projects from `content.projects` as Cards with name, company/client, description, and tech Badge tags.
- [ ] Education section renders three education rows; a missing institution is handled gracefully (no crash, empty cell or dash).
- [ ] Languages section renders Malagasy (native), French (fluent), and English (working proficiency) with locale-aware labels.
- [ ] Contact section contains email mailto, WhatsApp wa.me, and SocialLinks (GitHub/LinkedIn); contains no `<form>` or `<input>` elements; all external links use `target="_blank" rel="noopener noreferrer"`; full street address is absent.
- [ ] Hero location shows "Antananarivo, Madagascar" only — no street address.
- [ ] `npm run dev` renders all eight sections in order (Hero → About → Skills → Experience → Projects → Education → Languages → Contact) in `<main>`.
- [ ] Nav highlighting via scrollspy correctly tracks the active section as the user scrolls.
- [ ] `npm run test` passes for Hero.test.tsx and any other co-located test files.
- [ ] `npm run build` completes without errors after 06-09.

## Technical Notes

- All section components are default exports in `PascalCase.tsx` files under `src/components/sections/`.
- Tests are co-located next to the component (`Hero.test.tsx` beside `Hero.tsx`); use Vitest + `@testing-library/react`.
- The `Section` wrapper accepts `id`, `title`, and `children`; it handles the `<section>` element, `<h2>`, and reveal animation internally. Hero does not use Section as the heading wrapper; it renders its own outer `<section id="hero">` and places the `<h1>` directly.
- `DownloadCvButton` href must use `import.meta.env.BASE_URL + 'cv/erick-andrinirina-cv.pdf'` so it works under both root and sub-path Vite bases.
- External links (GitHub, LinkedIn, WhatsApp) must always include `target="_blank" rel="noopener noreferrer"`.
- Section `id` values (`hero`, `about`, `skills`, `experience`, `projects`, `education`, `languages`, `contact`) must match the nav config in `src/lib/constants.ts` exactly — this is the single source of truth consumed by `useScrollSpy`.
- The `content.projects[]` array is derived from the experience data in Epic 04; `Projects.tsx` reads it directly from `content.projects` rather than re-deriving from `content.experience`.
- Privacy: location is always "Antananarivo, Madagascar" (city + country only); the full street address from the CV must never appear in any component.
