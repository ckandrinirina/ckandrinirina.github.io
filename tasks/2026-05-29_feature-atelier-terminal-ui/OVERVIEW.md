---
slug: atelier-terminal-ui
title: Atelier Terminal UI
integration: epic
branch:
issue:
pr:
delivery:
---

# Feature Overview: Atelier Terminal UI

## Feature Description & Motivation

Replace the current scrolling-section portfolio shell with the **Atelier Terminal**
design: a fixed 240px sidebar + main view container with **route-based navigation**
(one view at a time), a warm dark default theme with 3 alternate palettes, animated
micro-interactions, a hand-rolled command palette (⌘K), project detail modals, and a
custom cursor. The bilingual (FR/EN) content system is **preserved** — this feature
rewrites the visual/presentation layer, not the content or build foundation.

The mockup is the **single source of truth for visuals**: every CSS variable,
typography rule, spacing value, radius, shadow, and animation timing must match it
verbatim. No re-interpretation of the palette.

**Source design:** [`docs/architecture/features/2026-05-27_atelier-terminal-ui.md`](../../docs/architecture/features/2026-05-27_atelier-terminal-ui.md)

## Affected Existing Components

| Component                                                                                                              | Disposition                                                               |
| ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `src/index.css`                                                                                                        | **Rewritten** — Tailwind + 4-theme tokens + all mockup component classes  |
| `index.html`                                                                                                           | **Updated** — Google Fonts, anti-FOUC bootstrap for `data-theme`          |
| `theme/ThemeProvider.tsx`, `useTheme.ts`                                                                               | **Rewritten** — 4 palettes via `[data-theme]` attribute, `cycle()`        |
| `content/types.ts`, `fr.ts`, `en.ts`, `i18n/ui.ts`                                                                     | **Updated** — new content shape; Education + standalone Languages dropped |
| `components/ui/Button.tsx`, `LanguageSwitcher.tsx`, `Card.tsx`, `Badge.tsx`, `SocialLinks.tsx`, `DownloadCvButton.tsx` | **Kept / restyled**                                                       |
| `hooks/useReveal.ts`                                                                                                   | **Kept** (reference; may be unused)                                       |
| `App.tsx`                                                                                                              | **Rewritten** — route + view shell                                        |
| `components/layout/Header.tsx`, `Footer.tsx`, `Section.tsx`                                                            | **Deleted** — replaced by Sidebar + Topbar + view layout                  |
| `components/sections/*` (8 components)                                                                                 | **Deleted** — replaced by `views/`                                        |
| `components/ui/ThemeToggle.tsx`                                                                                        | **Deleted** — replaced by `ThemeSwitcher`                                 |
| `hooks/useScrollSpy.ts`                                                                                                | **Deleted** — no scroll spy in the new shell                              |

## New Components Introduced

- **Layout:** `Sidebar`, `Topbar`, `ScrollHint`
- **Overlays:** `CommandPalette` (+ `commands.ts`), `Cursor`
- **Projects:** `ProjectCard`, `ProjectModal`, `ProjectArt` + 8 inline-SVG artworks
- **Views:** `HomeView`, `WorkView`, `ExperienceView`, `SkillsView`, `ProcessView`, `ContactView`
- **UI primitives:** `Reveal`, `CountUp`, `Marquee`, `ThemeSwitcher`
- **Hooks:** `useHashRoute`, `useScrollToNavigate`, `useKeyboardArrows`, `useCmdK`, `useScrollReveal`
- **Data:** `content/projects.ts`, `theme/themeBootstrap.ts`

## Integration Points with the Existing System

- **Preserved foundation (already built, from `tasks/2026-05-22_personal-portfolio/`):**
  Vite + React 19 + TypeScript scaffold (Epic 01), Vitest/Testing Library setup,
  the typed `LanguageProvider`/`useLanguage` i18n machinery, the `lib/utils.ts` `cn`
  helper, and the CV PDF asset + SEO metadata (Epic 07, DONE).
- **Provider stack** stays `ThemeProvider → LanguageProvider → App`; only the
  ThemeProvider implementation changes (class → `data-theme` attribute).
- **Content authoring** continues through the per-locale modules; the new views read
  from `useLanguage().content` with the new `PortfolioContent` shape.
- **Deployment** (Epic 08 of the original plan) and **SEO** (Epic 07, DONE) remain
  valid; the Lighthouse audit in this feature re-verifies the new shell against the
  same ≥95 targets.

## Tech Stack

No new runtime dependencies. All animation is CSS + `requestAnimationFrame`; the
command palette and modal are hand-rolled; project artwork is inline SVG. Google
Fonts (Geist, JetBrains Mono, Instrument Serif) are the only added external resource.

| Layer      | Technology                                                    |
| ---------- | ------------------------------------------------------------- |
| UI library | React 19                                                      |
| Language   | TypeScript 5.7+                                               |
| Styling    | Tailwind CSS v4 (CSS-first) + custom CSS (mockup classes)     |
| Theming    | `[data-theme]` attribute + CSS custom properties (4 palettes) |
| Testing    | Vitest + Testing Library + jsdom                              |
| Fonts      | Google Fonts: Geist, JetBrains Mono, Instrument Serif         |

## Out of Scope

- Tweaks panel (mockup-only host integration).
- Real-time analytics (PostHog, etc.).
- Per-project deep-link routes (e.g. `#work/soka`) — modal is in-page state today.
- Mobile/tablet rendering of the custom cursor.
