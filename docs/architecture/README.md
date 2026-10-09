# Architecture Documentation — Erick Andrinirina Portfolio

Feature-scoped architecture documentation for the personal developer portfolio.
Source-of-truth specification: [`../specs/2026-05-22_personal-portfolio/spec.md`](../specs/2026-05-22_personal-portfolio/spec.md).

**Project:** A bilingual (EN/FR), 4-palette, single-page personal portfolio for Erick
Andrinirina, built as a static site and deployed to GitHub Pages. The live UI is the
**Atelier Terminal** design (sidebar + main view, route-based navigation).

## Global Documents

These describe the whole system and are read on demand, not per story.

| Document                                   | Description                                                      |
| ------------------------------------------ | ---------------------------------------------------------------- |
| [overview.md](overview.md)                 | Project vision, goals, and target users                          |
| [folder-structure.md](folder-structure.md) | Complete project directory tree                                  |
| [tech-stack.md](tech-stack.md)             | Languages, frameworks, and versions                              |
| [\_shared.md](_shared.md)                  | Cross-cutting infra: providers, UI primitives, a11y, conventions |
| [configuration.md](configuration.md)       | Config files, environment variables                              |
| [dev-guide.md](dev-guide.md)               | Prerequisites, setup, build, and run instructions                |

## Feature Documents

Each feature owns a self-contained slice (its components, APIs, data, and flows). A
`build`/`fix` story reads only its feature doc (+ `folder-structure.md`, + `_shared.md`
when noted) — never the whole architecture.

| Feature                                        | Document                                                                                               |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Theming                                        | [features/theming/index.md](features/theming/index.md)                                                 |
| Internationalization & Content                 | [features/i18n-content/index.md](features/i18n-content/index.md)                                       |
| App Shell & Interaction                        | [features/app-shell/index.md](features/app-shell/index.md)                                             |
| Content Views                                  | [features/content-views/index.md](features/content-views/index.md)                                     |
| Command Palette (⌘K)                           | [features/command-palette/index.md](features/command-palette/index.md)                                 |
| Project Showcase                               | [features/project-showcase/index.md](features/project-showcase/index.md)                               |
| Scroll Motion                                  | [features/scroll-motion/index.md](features/scroll-motion/index.md)                                     |
| Foundation — Tokens, Theme & Content _(stub)_  | [features/foundation-tokens-theme-content/index.md](features/foundation-tokens-theme-content/index.md) |
| Content Surfaces & Overlays _(stub)_           | [features/content-surfaces-overlays/index.md](features/content-surfaces-overlays/index.md)             |
| Integration & QA _(stub)_                      | [features/integration-qa/index.md](features/integration-qa/index.md)                                   |
| Project Foundation & Tooling _(stub)_          | [features/foundation-tooling/index.md](features/foundation-tooling/index.md)                           |
| Design System — UI Primitives & Hooks _(stub)_ | [features/design-system-primitives/index.md](features/design-system-primitives/index.md)               |
| Theming System _(stub)_                        | [features/theming-system/index.md](features/theming-system/index.md)                                   |
| App Shell & Layout _(stub)_                    | [features/app-shell-layout/index.md](features/app-shell-layout/index.md)                               |
| Content Sections _(stub)_                      | [features/content-sections/index.md](features/content-sections/index.md)                               |
| Assets, SEO & Social Sharing _(stub)_          | [features/assets-seo/index.md](features/assets-seo/index.md)                                           |
| Deployment Pipeline _(stub)_                   | [features/deployment/index.md](features/deployment/index.md)                                           |
| Quality, Accessibility & Performance _(stub)_  | [features/quality-a11y-perf/index.md](features/quality-a11y-perf/index.md)                             |

Rows marked _(stub)_ were scaffolded by `/ck-code:design sync` so every epic routes to a doc; they carry no technical detail yet.

> **Not applicable:** `api-contracts` (no backend; direct links only) and
> `database-schema` (no database; content is static typed data).

## Quick facts

- **Type:** Static single-page application (SPA), no server, no database.
- **Stack:** Vite 7 · React 19 · TypeScript 5.7+ · Tailwind CSS v4.
- **Hosting:** GitHub Pages, auto-deployed via GitHub Actions on push to `main`.
- **Languages:** French (default) and English, switchable at runtime.
- **Theme:** Four palettes — Ember (default warm dark), Paper (light), Ocean, Forest —
  toggled via `[data-theme]` on `<html>`, defaulting to the visitor's system preference.
- **Shell:** Sidebar + main view container with route-based navigation
  (Home · Work · Experience · Skills · How I work · Contact) and a `⌘K` command palette.

## Source

- **Original spec:** [`../specs/2026-05-22_personal-portfolio/spec.md`](../specs/2026-05-22_personal-portfolio/spec.md)
- **Live design source of truth:** the Atelier Terminal mockup (visuals are verbatim).
- **Gaps remaining:** None at the architecture level.

## Changelog

- **2026-06-02** — Added **Scroll Motion** feature (`features/scroll-motion/`) — a
  zero-dependency, reduced-motion-gated motion layer across all six views: `data-reveal`
  reveal vocabulary on the existing `useScrollReveal` engine, site-wide `Reveal`/`CountUp`
  via a new `useInView` hook, and a `ScrollProgress` bar in the Topbar
  (`useScrollProgress`). Updated `app-shell`, `content-views`, `_shared.md`, and
  `DESIGN_LEDGER.md`.
- **2026-06-02** — Migrated to the v3 feature-scoped layout (`doc-optimizer upgrade`).
  Decomposed `components.md` + `data-flow.md` + the `2026-05-27_atelier-terminal-ui`
  design record into 6 feature docs (theming, i18n-content, app-shell, content-views,
  command-palette, project-showcase) + `_shared.md`. Scaffolded `DESIGN_LEDGER.md`;
  stamped `tasks/VERSION.md` (`layout: v3`). Originals preserved in `archive/`.
- **2026-05-27** — Atelier Terminal UI: sidebar+main shell, 6 routes, 4-palette theme
  via `[data-theme]`, command palette, project modal, custom cursor, scroll-to-navigate.
  Dropped Education; Languages merged into Contact; CV download moved to a Home CTA.

## Archive

Pre-v3 layer docs are preserved (never deleted) under [`archive/`](archive/):
`components.md`, `data-flow.md`, `2026-05-27_atelier-terminal-ui.md`. Their content now
lives in the feature docs above.
