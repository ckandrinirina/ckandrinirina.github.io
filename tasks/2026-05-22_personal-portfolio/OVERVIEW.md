---
slug: personal-portfolio
title: Erick Andrinirina — Personal Portfolio
integration: epic
branch:
issue:
pr:
delivery:
---

# Project Overview: Erick Andrinirina — Personal Portfolio

## Vision

A fast, polished, bilingual (French default / English) personal portfolio that
presents Erick Andrinirina — a Fullstack JavaScript engineer with 7 years of
experience — to recruiters, potential clients, and fellow developers. It is a
purely client-side static single-page application: no backend, no database, no
runtime API. All content is compiled into the bundle as typed per-locale data,
and the browser does everything. The site is permanently online, zero-cost, and
fast via GitHub Pages, and it deliberately keeps private data (full home
address) off the page while remaining personable.

## Architecture

```
                         ┌──────────────────────────────────────────┐
   Visitor's browser     │              index.html                   │
   ───────────────────►  │   ┌──────────────────────────────────┐   │
                         │   │            React app              │   │
   GitHub Pages (CDN)    │   │  ThemeProvider  ──► <html class>   │   │
   serves static dist/   │   │  LanguageProvider ─► locale + data │   │
                         │   │  App                               │   │
                         │   │   ├─ Header (nav, lang, theme)     │   │
                         │   │   ├─ Hero/About/Skills/Experience/ │   │
                         │   │   │  Projects/Education/Languages/  │   │
                         │   │   │  Contact (sections)            │   │
                         │   │   └─ Footer                        │   │
                         │   └──────────────────────────────────┘   │
                         │   localStorage: theme + locale            │
                         │   /cv/<resume>.pdf  (static asset)        │
                         └──────────────────────────────────────────┘

Build & deploy:  push main → GitHub Actions → npm ci → vite build → dist/
                 → upload-pages-artifact → deploy-pages → ckandrinirina.github.io
```

## Tech Stack

| Layer                   | Technology                                                         | Version     |
| ----------------------- | ------------------------------------------------------------------ | ----------- |
| Build tool / dev server | Vite                                                               | 7.x         |
| UI library              | React                                                              | 19.x        |
| Language                | TypeScript                                                         | 5.7+        |
| Styling                 | Tailwind CSS (CSS-first, `@tailwindcss/vite`)                      | 4.x         |
| Linting                 | ESLint (flat config)                                               | 9.x         |
| Formatting              | Prettier (+ `prettier-plugin-tailwindcss`)                         | 3.x         |
| Testing                 | Vitest + Testing Library + jsdom                                   | 3.x / 16.x  |
| i18n                    | Typed `LanguageProvider` + per-locale content modules (no library) | —           |
| CI/CD                   | GitHub Actions → GitHub Pages                                      | Node 20 LTS |

## Components

### Foundation & Tooling

- **Purpose:** Scaffold and configure the build/lint/test/format toolchain.
- **Technology:** Vite, TypeScript, Tailwind v4, ESLint, Prettier, Vitest.
- **Key responsibilities:** A project that compiles, lints, tests, and builds to `dist/` with the correct GitHub Pages base path.

### Design System (UI Primitives & Hooks)

- **Purpose:** Reusable, content-agnostic building blocks.
- **Technology:** React 19 function components, Tailwind utilities, IntersectionObserver hooks.
- **Key responsibilities:** `Container`, `Section`, `Button`, `Badge`, `Card`, `SocialLinks`, design tokens, `lib/utils` + `lib/constants`, `useReveal`, `useScrollSpy`.

### Theming System

- **Purpose:** Light/dark theme with system-preference default and persistence.
- **Technology:** React context + Tailwind class-based dark variant.
- **Key responsibilities:** `ThemeProvider`/`useTheme`, anti-FOUC bootstrap script, `ThemeToggle`.

### Internationalization & Content Data

- **Purpose:** Bilingual content model and runtime language switching.
- **Technology:** Typed TS content modules + React context.
- **Key responsibilities:** `content/types.ts`, `content/fr.ts` (default), `content/en.ts`, `i18n/ui.ts`, `LanguageProvider`/`useLanguage`, `LanguageSwitcher`, `DownloadCvButton`, parity test.

### App Shell & Layout

- **Purpose:** Assemble the page and provider stack.
- **Technology:** React 19.
- **Key responsibilities:** `main.tsx` provider wiring, `Header` (sticky nav + scrollspy + mobile menu + toggles), `Footer`, `App.tsx` shell.

### Content Sections

- **Purpose:** The eight visible portfolio sections.
- **Technology:** React + `useLanguage()` content slices.
- **Key responsibilities:** Hero, About, Skills, Experience, Projects, Education, Languages, Contact, plus scrollspy wiring.

### Assets, SEO & Deployment

- **Purpose:** Brand assets, social/SEO metadata, and automated publishing.
- **Technology:** `public/` static assets, `index.html` meta, GitHub Actions.
- **Key responsibilities:** CV PDF + presence check, favicon/profile/OG image, SEO/OG/Twitter tags, Pages workflow, README.

### Quality, Accessibility & Performance

- **Purpose:** The final quality gate.
- **Key responsibilities:** A11y (WCAG 2.1 AA intent), responsiveness, reduced-motion, privacy verification, Lighthouse ≥ 95.

## Key Design Decisions

- **Static-first, no backend:** everything is pre-built and CDN-served; contact is direct links only (email, WhatsApp, GitHub, LinkedIn) — no form.
- **Content/UI separation:** portfolio content lives in typed per-locale data modules decoupled from presentation; a missing French field is a compile-time error (EN/FR parity by construction).
- **Lightweight i18n (no library):** only two languages and fully static content, so a typed `LanguageProvider` + content modules avoids base-path/async complications on GitHub Pages.
- **Progressive comfort:** theme and language respect the visitor's environment first (system theme, browser language), then their explicit choice (persisted in `localStorage`).
- **User-page deployment assumption:** `base: '/'` for `ckandrinirina.github.io`. Switchable to `'/<repo>/'` for a project page (assets via `import.meta.env.BASE_URL`).

## Non-Functional Requirements

- **Performance:** Lighthouse performance ≥ 95; first load < 1.5s on broadband.
- **Accessibility:** WCAG 2.1 AA intent — semantic landmarks, single `<h1>`, focus states, color contrast, `aria` on toggles; Lighthouse a11y ≥ 95.
- **Responsiveness:** mobile, tablet, desktop breakpoints.
- **SEO / sharing:** title, meta description, Open Graph/Twitter card, correct `lang`.
- **i18n:** full EN/FR parity for all visible content; French default.
- **Availability:** always online via GitHub Pages CDN.
- **Privacy:** full home address never rendered or embedded; location shown as "Antananarivo, Madagascar" only.

## Open Questions (from the spec — tracked as story TODOs)

- GitHub & LinkedIn profile URLs (`[TO BE DEFINED]` in `lib/constants` — story 02-01).
- Deployment target: user page (`base: '/'`) vs project page (`base: '/<repo>/'`) — affects 01-05, 07-03, 08-01.
- Scientific Baccalaureate (2013) institution: named or left blank (handled gracefully — 04-02/06-06).
- Separate English CV file: out of scope for now; FR PDF served for both locales (07-01).

## References

- Specification: `docs/specs/2026-05-22_personal-portfolio/pre-spec.md`
- Architecture: `docs/architecture/` (overview, tech-stack, components, data-flow, configuration, folder-structure, dev-guide)
- Generated: 2026-05-22
