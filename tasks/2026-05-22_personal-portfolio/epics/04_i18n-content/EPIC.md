---
epic: 04
slug: i18n-content
title: "Internationalization & Content Data"
description: "This epic defines and populates the entire content and language runtime for the portfolio."
issue:
pr:
delivery:
---
# Epic 04: Internationalization & Content Data

## Description

This epic defines and populates the entire content and language runtime for the portfolio. It covers three tightly related concerns that must be built together before any section component can render real data. First, a shared TypeScript interface (`PortfolioContent`) pins the exact shape of every content section — hero, about, skills, experience, projects, education, spoken languages, and contact — so that French and English modules are guaranteed to be structurally identical at compile time: a missing field in either locale is a type error, not a runtime surprise.

Second, the two locale content modules are authored in full. `src/content/fr.ts` is the default and contains all CV data in French: seven experiences (SOKA/YAS, BMOI, SHOYO, VTC Academy, PANAFRI HELP, CREACTISOFT, INGENOSYA) listed most-recent-first, their named projects, all eight skill groups, three education rows, spoken-language proficiencies, and contact information limited to city/country. `src/content/en.ts` provides a complete English translation of the same object, verified for parity by a dedicated test.

Third, the runtime language system is wired: `LanguageProvider` and `useLanguage` resolve the active locale (localStorage → navigator.language → `fr` default), expose the active content object and a `t()` UI-label resolver, and keep `<html lang>` in sync. A `LanguageSwitcher` UI control and a localized `DownloadCvButton` complete the deliverables. The epic produces everything Epic 05 (Header/shell) and Epic 06 (section components) need to render real, bilingual content.

## Goals

- Define a single `PortfolioContent` interface that enforces EN/FR structural parity at compile time.
- Author complete, accurate French (default) and English content modules covering all spec §5 sections.
- Build and test the `LanguageProvider` / `useLanguage` runtime with correct locale initialization, persistence, and `<html lang>` management.
- Provide a typed UI micro-labels map (`ui.ts`) covering every nav item, button, and aria-label string used by the chrome.
- Deliver a `LanguageSwitcher` component with a passing test and a localized `DownloadCvButton`.

## Scope

### In Scope

- `src/content/types.ts` — `PortfolioContent` interface and all sub-types.
- `src/content/fr.ts` — full French content module (default locale).
- `src/content/en.ts` — full English content module (full parity with fr.ts).
- `src/i18n/ui.ts` — typed per-locale map of all UI micro-labels.
- `src/i18n/LanguageProvider.tsx` — React context provider for locale and content.
- `src/i18n/useLanguage.ts` — context accessor hook.
- `src/components/ui/LanguageSwitcher.tsx` — EN/FR toggle UI component.
- `src/components/ui/LanguageSwitcher.test.tsx` — component test.
- `src/content/content.test.ts` — structural parity test between fr.ts and en.ts.
- `src/components/ui/DownloadCvButton.tsx` — localized anchor to the CV PDF.

### Out of Scope

- `ThemeProvider` or any theme-related state (Epic 03).
- Any section component that consumes the content (Epic 06).
- Header assembly and nav integration (Epic 05).
- The CV PDF asset itself (Epic 07).
- GitHub/LinkedIn URL resolution (noted as `[TO BE DEFINED]` in spec — constants live in `src/lib/constants.ts`, not in content modules).
- Contact form or any backend communication.

## Dependencies

- **Depends on:** Epic 01 (project scaffold — TypeScript, Vitest, Testing Library must be present); Story 02-04 (Button component, needed by DownloadCvButton in 04-08).
- **Blocks:** Epic 05 (Header + shell, needs LanguageProvider and LanguageSwitcher); Epic 06 (all section components consume `useLanguage()` and the content objects).

## Acceptance Criteria

- [ ] `src/content/types.ts` exports a `PortfolioContent` interface covering all eight content sections; both `fr.ts` and `en.ts` compile against it without `as unknown as` casts.
- [ ] `src/content/fr.ts` contains all seven professional experiences in reverse-chronological order with named projects, all eight skill groups, three education rows, spoken-language proficiencies, and a contact location of "Antananarivo, Madagascar". No full street address is present anywhere.
- [ ] `src/content/en.ts` mirrors `fr.ts` in structure; all fields are present in idiomatic English.
- [ ] `src/content/content.test.ts` passes: same top-level keys, equal array lengths for `experience`, `projects`, `education`, `spokenLanguages`, and equal skill group counts.
- [ ] `src/i18n/ui.ts` provides FR and EN entries for every nav label (8 sections), every button text, and every aria-label referenced by chrome components.
- [ ] `src/i18n/LanguageProvider.tsx` initializes locale to `fr` when localStorage is empty and `navigator.language` is neither `en` nor `fr`. It persists the user's choice via `localStorage['locale']` and sets `document.documentElement.lang` on every change.
- [ ] `src/i18n/useLanguage.ts` returns `{ locale, setLocale, content, t }` when called inside a `LanguageProvider`.
- [ ] `LanguageSwitcher.test.tsx` passes: renders active locale, clicking switches locale, `document.documentElement.lang` updates.
- [ ] `DownloadCvButton` renders an `<a>` with `download` attribute; `href` is `import.meta.env.BASE_URL + 'cv/erick-andrinirina-cv.pdf'`; label matches the active locale's `t('downloadCv')`.
- [ ] `npm run test -- --run` exits 0 with all new tests passing.
- [ ] `npm run build` exits 0 (TypeScript compilation of content modules against the interface succeeds).

## Technical Notes

- Content separation rule: `src/content/*` holds data only (strings, arrays of typed objects). No JSX, no Tailwind classes, no component logic.
- UI label separation rule: `src/i18n/ui.ts` holds only chrome-level micro-copy (nav, buttons, aria). Section narrative copy belongs in the content modules.
- The `PortfolioContent` interface is the single source of parity truth. Adding a field to the interface without updating both locale files must produce a TypeScript error.
- Locale detection order in `LanguageProvider`: (1) `localStorage.getItem('locale')`, (2) `navigator.language.slice(0, 2)` if it is `'en'` or `'fr'`, (3) `'fr'`. The FR default must hold for any other browser language (e.g. `de`, `ja`).
- `localStorage` may be unavailable in some privacy contexts (Safari private mode throws on access). Wrap in try/catch; fall back to session-only state.
- `DownloadCvButton` must use `import.meta.env.BASE_URL` (with no leading slash on the path segment) so the URL is correct under both `base: '/'` and a project sub-path like `base: '/ck-portfolio/'`.
- Test environment: mock `localStorage` and `navigator.language` in Vitest using `vi.stubGlobal` / `Object.defineProperty` patterns before testing `LanguageProvider` initialization.
