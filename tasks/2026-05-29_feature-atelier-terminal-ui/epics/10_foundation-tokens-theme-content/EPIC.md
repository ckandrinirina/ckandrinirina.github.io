---
epic: 10
slug: foundation-tokens-theme-content
title: "Foundation — Tokens, Theme & Content"
description: "This epic lays the base layer of the Atelier Terminal redesign: the visual token system, the theme machinery that drives it, and the content model that every view will read from."
issue:
pr:
delivery:
---
# Epic 01: Foundation — Tokens, Theme & Content

## Description

This epic lays the base layer of the Atelier Terminal redesign: the visual token
system, the theme machinery that drives it, and the content model that every view
will read from. Nothing in the new shell can render correctly until these three
pieces land, so this epic is the hard dependency root of the feature.

The centrepiece is the **global stylesheet rewrite** (`src/index.css`): the four
palette token sets (Ember/default, Paper, Ocean, Forest) as CSS custom properties on
`:root` and `[data-theme="..."]`, the base typography (mono body + serif display),
the ambient effects (body radial glow, grid overlay, marquee mask), and **every
component class from the mockup verbatim** (`.app`, `.sidebar`, `.sb-*`, `.topbar`,
`.view`, `.proj-card`, `.tl-*`, `.skill-card`, `.process-*`, `.cmdk-*`, `.modal*`,
`.marquee*`, `.cursor-*`, `.reveal`, keyframes, and the reduced-motion + cursor media
queries). The Google Fonts links and the anti-FOUC theme bootstrap are added to
`index.html`.

On top of the tokens sits the **theme system rewrite**: a `ThemeProvider` that toggles
the `data-theme` attribute on `<html>` (removing it for the `default` Ember palette),
a `useTheme` hook exposing `{ theme, setTheme, cycle }`, the co-located bootstrap
string, and a `ThemeSwitcher` control that replaces the old `ThemeToggle`.

In parallel, the **content model update** reshapes the typed content system to the new
`PortfolioContent` shape — adding `now`, `stats`, `marquee`, `process`, and the
projects data, moving spoken languages into the Contact card, and removing the
Education section. FR and EN modules are rewritten to the new shape and kept at parity.

## Goals

- Rewrite `src/index.css` with the 4-palette token system, base typography, ambient
  effects, and all mockup component classes — verbatim from the design doc.
- Add Google Fonts (Geist, JetBrains Mono, Instrument Serif) and the anti-FOUC theme
  bootstrap script to `index.html`.
- Rewrite `ThemeProvider`/`useTheme` for 4 themes via the `[data-theme]` attribute,
  with a `cycle()` and persistence; ship a `ThemeSwitcher` and `themeBootstrap.ts`.
- Reshape the content model (`types.ts`) to the new `PortfolioContent`, author the new
  `projects.ts` data, rewrite `fr.ts`/`en.ts` and `i18n/ui.ts`, and keep FR/EN at parity.

## Scope

### In Scope

- `src/index.css` — full rewrite (tokens, typography, ambient, all component classes,
  keyframes, media queries).
- `index.html` — Google Fonts preconnect + stylesheet; anti-FOUC `data-theme` bootstrap.
- `src/theme/ThemeProvider.tsx`, `src/theme/useTheme.ts`, `src/theme/themeBootstrap.ts`.
- `src/components/ui/ThemeSwitcher.tsx` (replaces `ThemeToggle`).
- `src/content/types.ts`, `src/content/fr.ts`, `src/content/en.ts`, `src/content/projects.ts`.
- `src/i18n/ui.ts` — nav labels, ⌘K group labels, copy labels, eyebrows, footer chips.
- Content parity test for FR/EN under the new shape.

### Out of Scope

- The Sidebar/Topbar that render the ThemeSwitcher — Epic 02 (02-03).
- The views that consume the content — Epic 03.
- Deletion of `ThemeToggle.tsx` and old section content — handled at integration (04-01)
  except where a file is directly superseded here.
- Routing/interaction hooks — Epic 02 (02-01).

## Dependencies

- **Depends on:** the preserved foundation from `tasks/2026-05-22_personal-portfolio/`
  (Vite/React/TS scaffold, Tailwind v4 setup, Vitest, existing `LanguageProvider`).
- **Blocks:** Epic 02 (02-02 needs classes; 02-03 needs ThemeSwitcher + labels), all of
  Epic 03 (classes + content), and Epic 04.

## Acceptance Criteria

- [ ] `src/index.css` defines all four palettes (Ember `:root`, Paper/Ocean/Forest via
      `[data-theme]`) with the exact token values from the design doc.
- [ ] All mockup component classes and keyframes are present; `prefers-reduced-motion`
      and `(hover: hover) and (pointer: fine)` media queries are implemented.
- [ ] `index.html` loads the three Google Font families with `display=swap` and runs the
      anti-FOUC bootstrap before React mounts — no flash of the wrong theme on reload.
- [ ] `ThemeProvider` cycles `default → ocean → forest → paper → default`, sets/removes
      the `data-theme` attribute correctly, and persists to `localStorage['theme']`.
- [ ] `ThemeSwitcher` renders the current theme and changes it app-wide on activation.
- [ ] `PortfolioContent` matches the new shape; `projects.ts` has 8 typed entries;
      Education and standalone Languages types are removed.
- [ ] FR and EN content modules compile against the new shape and pass the parity test.
- [ ] `npm run build` completes with no TypeScript errors.

## Technical Notes

- Tokens are the contract: components in later epics only apply classes; the values live
  here. Copy them **verbatim** — do not round or re-derive colours.
- Keep Tailwind v4 (`@import 'tailwindcss'`) for utilities, but the heavy lifting is the
  custom CSS block.
- The bootstrap string in `themeBootstrap.ts` and the inline `<script>` in `index.html`
  must stay byte-identical in logic to avoid theme drift.
- Content authoring: `fr.ts` is the localized source; `en.ts` mirrors the mockup copy as
  the EN baseline. The parity test asserts identical key shape across locales.
