---
epic: 05
slug: app-shell-layout
title: "App Shell & Layout"
description: "This epic assembles the application shell that ties together every provider and layout component built in Epics 02–04."
issue:
pr:
delivery:
---
# Epic 05: App Shell & Layout

## Description

This epic assembles the application shell that ties together every provider and layout component built in Epics 02–04. It begins at the React entry point (`main.tsx`), where the full provider stack (`ThemeProvider` → `LanguageProvider` → `App`) is wired up so that theme and language state are available to every component in the tree from the very first render — and so that `ThemeProvider` reconciles cleanly with the anti-FOUC inline script already placed in `index.html` by Epic 03.

The centrepiece of the epic is the `Header` component: a sticky top bar that renders a navigation landmark with eight anchor links, highlights the active section in real time via `useScrollSpy`, supports a hamburger mobile menu (keyboard-accessible), and hosts the `LanguageSwitcher` and `ThemeToggle` controls built in earlier epics. Nav links smooth-scroll to their target section anchors and the mobile menu self-closes on selection. Alongside the Header, a `Footer` component is built, providing social links, a dynamic copyright year, and a "built with" note that reads correctly in both light and dark themes.

The epic closes with `App.tsx`, which composes the page shell: `<Header>` + `<main>` (containing the eight ordered section anchor slots) + `<Footer>`. Section content itself is left as placeholders; Epic 06 and the subsequent section epics fill in each slot. All four stories are sequenced by dependency: providers first, then Header and Footer in parallel, then App.tsx last.

## Goals

- Wire `main.tsx` so the full provider stack (`ThemeProvider` → `LanguageProvider` → `App`) mounts correctly, reconciles with the anti-FOUC script, and makes `useTheme`/`useLanguage` available app-wide.
- Build a sticky, accessible `Header` with scroll-spy nav highlighting, mobile menu, `LanguageSwitcher`, and `ThemeToggle`.
- Build a `Footer` with social links, a dynamic copyright year, and a "built with" note visible in both themes.
- Compose `App.tsx` as the single-page shell establishing the `<main>` landmark and the eight section anchor slots in the order defined by the nav/scrollspy config.

## Scope

### In Scope

- `src/main.tsx` — React 19 `createRoot` entry; provider stack mount; `index.css` import.
- `src/components/layout/Header.tsx` — sticky nav, scroll-spy highlight, mobile hamburger menu, `LanguageSwitcher`, `ThemeToggle`, smooth-scroll.
- `src/components/layout/Footer.tsx` — `SocialLinks`, dynamic copyright year, "built with" note.
- `src/App.tsx` — page shell composing Header, main with eight ordered section anchor slots, and Footer.
- Accessibility landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`.
- Mobile menu keyboard accessibility and reduced-motion respect for smooth-scroll.

### Out of Scope

- Actual content of section components (Hero, About, Skills, etc.) — Epic 06 onwards.
- `Section.tsx` and `Container.tsx` layout primitives — Epic 02.
- `ThemeToggle`, `LanguageSwitcher`, `SocialLinks` implementations — Epics 03 and 04.
- `useScrollSpy` hook implementation — Epic 02.
- Any form or backend interaction — not applicable (static site).
- Unit tests for Header/Footer (integration testing deferred; component-level test scaffolding is noted in Technical Notes only).

## Dependencies

- **Depends on:** Epic 02 (hooks/primitives: `useScrollSpy` 02-08, `SocialLinks` 02-10, `Container` 02-01), Epic 03 (ThemeToggle 03-03, `ThemeProvider` 03-01), Epic 04 (LanguageProvider 04-05, LanguageSwitcher 04-06).
- **Blocks:** Epic 06 (section wiring — all section stories 06-01 through 06-08 depend on the App shell established in 05-04); also blocks 06-09 (final section integration).

## Acceptance Criteria

- [ ] `npm run dev` boots the app with both ThemeProvider and LanguageProvider active; `useTheme()` and `useLanguage()` resolve without error in any component.
- [ ] ThemeProvider correctly reconciles with the anti-FOUC inline script — no flash of incorrect theme on hard reload with a stored preference.
- [ ] The Header is sticky (remains visible on scroll) across all viewport sizes.
- [ ] Clicking a nav link smooth-scrolls to the matching `#section-id` anchor.
- [ ] The nav link corresponding to the section currently in the viewport is visually highlighted.
- [ ] The mobile hamburger menu opens and closes correctly; selecting a link closes the menu.
- [ ] The mobile menu and all Header controls are keyboard-navigable with visible focus rings.
- [ ] `LanguageSwitcher` and `ThemeToggle` render and function inside the Header.
- [ ] The Footer renders `SocialLinks`, a correct dynamic copyright year, and a "built with" note in both light and dark themes.
- [ ] `App.tsx` renders `<header>`, `<main>` (with eight section anchor slots in nav order), and `<footer>` landmarks.
- [ ] Section `id` attributes in `App.tsx` match the ids list passed to `useScrollSpy`.
- [ ] `npm run build` completes without TypeScript errors after all four stories are complete.

## Technical Notes

- The section id order in `App.tsx` and `useScrollSpy` must be sourced from `src/lib/constants.ts` (the nav config array) — a single source of truth prevents drift between the nav labels, the scroll-spy list, and the `<section id>` attributes.
- `ThemeProvider` wraps `LanguageProvider` (not vice-versa) so that any future theme-aware translation could access both contexts without prop drilling.
- For smooth-scroll, use `element.scrollIntoView({ behavior: 'smooth' })` or `window.scrollTo`; guard with `window.matchMedia('(prefers-reduced-motion: reduce)').matches` and fall back to instant scroll.
- The mobile menu open/close state is local to `Header` (no global store needed). A `useEffect` that adds a `keydown` listener for `Escape` to close the menu satisfies keyboard accessibility.
- `aria-expanded` on the hamburger button and `aria-hidden` on the nav panel (when closed) are required for screen-reader correctness.
- Footer copyright year: `new Date().getFullYear()` — no static string.
