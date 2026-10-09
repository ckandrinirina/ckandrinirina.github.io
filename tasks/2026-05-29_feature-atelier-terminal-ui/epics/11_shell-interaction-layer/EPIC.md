---
epic: 11
slug: app-shell
title: "Shell & Interaction Layer"
description: "This epic builds the navigational skeleton of the Atelier Terminal shell: the routing and interaction hooks, the reusable UI primitives, and the persistent layout chrome (Sidebar + Topbar)."
issue:
pr:
delivery:
---
# Epic 02: Shell & Interaction Layer

## Description

This epic builds the navigational skeleton of the Atelier Terminal shell: the routing
and interaction hooks, the reusable UI primitives, and the persistent layout chrome
(Sidebar + Topbar). These are the reusable pieces that the content surfaces (Epic 03)
render into and that the App integration (Epic 04) wires together.

The hardest part is the **interaction hooks**: hash-based routing (`useHashRoute`), the
scroll-to-navigate gesture engine (`useScrollToNavigate`) that advances routes only when
a wheel/touch gesture _starts_ at a scroll boundary and accumulates past threshold,
keyboard arrow navigation (`useKeyboardArrows`), the ⌘K toggle (`useCmdK`), and the
staggered scroll-reveal observer (`useScrollReveal`). The old `useScrollSpy` is removed.

Alongside the hooks, the **UI primitives** provide the animated building blocks — the
letter-by-letter `Reveal`, the `CountUp` for stats, the looping `Marquee`, the sticky
`ScrollHint`, and the restyled `.btn`/`.btn-primary` `Button`.

Finally the **layout chrome** — `Sidebar` (brand mark, grouped nav rows with glyphs and
badges, status block, ThemeSwitcher/LanguageSwitcher) and `Topbar` (breadcrumb, ⌘K
button, auto-updating TNR clock) — frames every view. These are presentational and
prop-driven; App owns the route state they reflect.

## Goals

- Implement the five interaction hooks that power route navigation, the command palette
  toggle, and scroll reveals; remove `useScrollSpy`.
- Build the animated UI primitives (`Reveal`, `CountUp`, `Marquee`, `ScrollHint`) and
  restyle `Button` to the mockup `.btn` classes.
- Build the `Sidebar` and `Topbar` chrome, prop-driven from route state, hosting the
  theme and language controls and the TNR clock.

## Scope

### In Scope

- `src/hooks/useHashRoute.ts`, `useScrollToNavigate.ts`, `useKeyboardArrows.ts`,
  `useCmdK.ts`, `useScrollReveal.ts` (+ tests).
- Removal of `src/hooks/useScrollSpy.ts` (+ test).
- `src/components/ui/Reveal.tsx`, `CountUp.tsx`, `Marquee.tsx`, `ScrollHint.tsx`;
  restyle of `Button.tsx` (+ tests).
- `src/components/layout/Sidebar.tsx`, `Topbar.tsx` (+ tests).
- `src/lib/constants.ts` — `ROUTE_ORDER` and route metadata (labels/glyphs/badges).

### Out of Scope

- `App.tsx` integration that consumes these hooks/chrome — Epic 04 (04-01).
- The views rendered inside `.view` — Epic 03.
- The command palette UI and custom cursor (only `useCmdK` lives here) — Epic 03 (03-02).
- Project artwork/cards — Epic 03 (03-01).

## Dependencies

- **Depends on:** Epic 01 (01-01 classes for primitives/chrome; 01-02 ThemeSwitcher;
  01-03 nav labels). `useReveal` from the prior plan is kept for reference.
- **Blocks:** Epic 03 (03-01/03-03/03-04 use the primitives; 03-02 uses `useCmdK`),
  Epic 04 (04-01 wires hooks + chrome).

## Acceptance Criteria

- [ ] `useHashRoute` reads/writes `window.location.hash` and updates route state on
      `hashchange`.
- [ ] `useScrollToNavigate` advances/retreats the route only when a gesture starts at the
      top/bottom boundary and accumulates past the documented threshold; it locks for
      850 ms after a nav and resets the accumulator on pause.
- [ ] `useKeyboardArrows` moves between routes via arrow/Page keys at scroll boundaries.
- [ ] `useCmdK` toggles the command palette on `⌘/Ctrl+K`.
- [ ] `useScrollReveal` adds `.in` with staggered delay to revealable elements via an
      IntersectionObserver scoped to the view.
- [ ] `useScrollSpy` is deleted with no remaining imports.
- [ ] `Reveal`, `CountUp`, `Marquee`, `ScrollHint` render per the mockup and respect
      reduced motion; `Button` uses `.btn`/`.btn-primary`.
- [ ] `Sidebar` renders grouped nav rows (glyph + label + optional badge), a status block
      (desktop), and the theme/language controls; the active route is visually marked.
- [ ] `Topbar` renders the breadcrumb for the active route, a ⌘K button, and a TNR clock
      that updates every 30 s.
- [ ] All new units are tested; `npm run build` passes with no TS errors.

## Technical Notes

- `useScrollToNavigate` is the trickiest unit — see the design doc’s scroll-to-navigate
  rules. Test the boundary-start condition, the 90 px accumulator, the 180 ms reset, and
  the 850 ms lock with fake timers and synthetic wheel/touch events.
- Chrome components are prop-driven: `Sidebar`/`Topbar` receive `route`, `navigate`, and
  group/route metadata; they do not own routing state (App does, in 04-01).
- Route metadata (id, label key, glyph, badge, breadcrumb) belongs in `constants.ts`
  alongside `ROUTE_ORDER` so the sidebar, topbar, and navigation hooks share one source.
- Keep the TNR clock as a self-contained effect with a 30 s interval; format for UTC+3.
