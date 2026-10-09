---
epic: 12
slug: content-surfaces-overlays
title: "Content Surfaces & Overlays"
description: "This epic builds everything the visitor actually sees inside the shell: the six route views, the project showcase (artwork, card, detail modal, and the Work grid), and the two global overlays (command palette and custom cursor)."
issue:
pr: 17
delivery: pr
---
# Epic 03: Content Surfaces & Overlays

## Description

This epic builds everything the visitor actually sees inside the shell: the six route
views, the project showcase (artwork, card, detail modal, and the Work grid), and the two
global overlays (command palette and custom cursor). Each surface reads bilingual content
from `useLanguage()` and applies the classes from Epic 01, composing the primitives and
hooks from Epic 02.

The **project showcase** is a complete vertical slice: `ProjectArt` switches on project id
to render one of eight inline-SVG artworks, `ProjectCard` is the grid tile (with the hover
shine), `ProjectModal` is the detail view (artwork + role/impact/stack columns + actions,
`Escape` to close, body-scroll lock), and `WorkView` lays the cards out in a 2-column grid
and opens the modal.

The **global overlays** are the hand-rolled `CommandPalette` (⌘K) — input + grouped results
(Navigation, Quick, Projects) with arrow-key navigation — backed by a `commands.ts` dataset,
and the custom `Cursor` (a dot that tracks the pointer plus a lerped ring with hover/label/
text states), disabled on touch/small screens.

The **views** are `HomeView` (the richest: hero with letter-reveal + role rotor + CTAs,
avatar frame, Now-card, Stats grid with CountUp, Marquee) and the remaining four —
`ExperienceView` (timeline), `SkillsView` (2×2 cards), `ProcessView` (5 numbered
principles), and `ContactView` (key/value card with copy buttons + pitch card).

## Goals

- Build the project showcase end-to-end: `ProjectArt` + 8 SVG artworks, `ProjectCard`,
  `ProjectModal`, and `WorkView`.
- Build the global overlays: `CommandPalette` (+ `commands.ts`) and the custom `Cursor`.
- Build `HomeView` with all its bespoke pieces (Reveal, role rotor, avatar, Now-card,
  Stats/CountUp, Marquee, CTAs including the CV download).
- Build `ExperienceView`, `SkillsView`, `ProcessView`, and `ContactView` (copy-to-clipboard).

## Scope

### In Scope

- `src/components/projects/ProjectCard.tsx`, `ProjectModal.tsx`,
  `artwork/ProjectArt.tsx` + 8 `*Art.tsx` files.
- `src/components/cmdk/CommandPalette.tsx`, `commands.ts`.
- `src/components/cursor/Cursor.tsx`.
- `src/views/HomeView.tsx`, `WorkView.tsx`, `ExperienceView.tsx`, `SkillsView.tsx`,
  `ProcessView.tsx`, `ContactView.tsx` (+ tests).

### Out of Scope

- `App.tsx` orchestration that mounts views/overlays and owns route/modal/cmd state —
  Epic 04 (04-01).
- Sidebar/Topbar chrome — Epic 02 (02-03).
- The hooks themselves (`useCmdK`, `useScrollReveal`) — Epic 02 (02-01).
- Final accessibility/responsiveness/Lighthouse passes — Epic 04 (04-02/04-03).

## Dependencies

- **Depends on:** Epic 01 (01-01 classes, 01-03 content/projects), Epic 02 (02-02 primitives;
  03-02 also needs 02-01’s `useCmdK`).
- **Blocks:** Epic 04 (04-01 mounts all of these into the shell).

## Acceptance Criteria

- [ ] `ProjectArt` renders the correct inline SVG per project id; all 8 artworks exist.
- [ ] `ProjectCard` renders num/name/year/category/desc/tags with the hover shine; `WorkView`
      lays them in a 2-col grid and opens the modal on activation.
- [ ] `ProjectModal` shows artwork + role/impact/stack columns + action buttons, closes on
      `Escape`/backdrop, and locks body scroll while open.
- [ ] `CommandPalette` filters across Navigation/Quick/Projects groups, supports arrow-key
      navigation + `Enter` to run, and is fully keyboard-operable.
- [ ] `Cursor` tracks the pointer (dot) with a lerped ring and switches hover/label/text
      states; it is disabled on touch/small screens.
- [ ] `HomeView` renders the hero (Reveal + role rotor + 3 CTAs incl. CV), avatar frame,
      Now-card, Stats grid (CountUp), and Marquee.
- [ ] `ExperienceView`, `SkillsView`, `ProcessView`, `ContactView` render their content; the
      Contact view’s copy buttons write to the clipboard and show the “✓ copied” state.
- [ ] Every view starts with an `<h2>` (`.section-title`); the Home hero name is the single `<h1>`.
- [ ] All surfaces are unit-tested; `npm run build` passes.

## Technical Notes

- Views are presentational: they read `useLanguage().content`, render the mockup classes, and
  receive callbacks (open modal, navigate) via props from App (04-01).
- The role rotor and Reveal are `aria-live="polite"`/labelled per the accessibility plan.
- Copy-to-clipboard uses `navigator.clipboard?.writeText`; show success for ~1400 ms.
- The modal and cmdk manage focus/`Escape` locally; App toggles their open state in 04-01.
- Inline SVG keeps the bundle small — no external image hosting for artwork.
