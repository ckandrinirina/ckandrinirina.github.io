---
epic: 13
slug: integration-qa
title: "Integration & QA"
description: "This epic assembles the Atelier Terminal shell and proves it meets the Definition of Done."
issue:
pr: 20
delivery: pr
---
# Epic 04: Integration & QA

## Description

This epic assembles the Atelier Terminal shell and proves it meets the Definition of Done.
It is the convergence point: `App.tsx` is rewritten to own all cross-cutting state (route,
direction, modal, command-palette), wire every interaction hook, render the Sidebar/Topbar
chrome and the active view, mount the global overlays, and tear down every obsolete file
from the old section-based design. Two QA stories then validate the result — accessibility,
reduced motion, and responsiveness, followed by a final Lighthouse performance/SEO audit.

`App.tsx` keys the `.view` container by route so React remounts it for the view-enter
animation, sets `view-enter-down`/`-up` from the tracked direction, resets `scrollTop`,
applies the 850 ms nav lock, and writes the hash via `history.replaceState`. It maps command
descriptors and project actions to real handlers, and renders `ProjectModal`/`CommandPalette`
/`Cursor` as App-controlled overlays.

The teardown removes `Header`, `Footer`, `Section`, all `components/sections/*`, and any
remaining `ThemeToggle`/`useScrollSpy` references so the new shell is the only UI.

## Goals

- Rewrite `App.tsx` to orchestrate route/direction/modal/cmd state, wire all hooks, render
  chrome + active view + overlays, and animate view transitions.
- Remove all obsolete files from the old design (Header, Footer, Section, sections/\*,
  ThemeToggle, useScrollSpy) and their tests, leaving a clean tree.
- Validate accessibility (landmarks, focus, ARIA), reduced motion, and responsiveness across
  the documented breakpoints.
- Run a Lighthouse performance + SEO audit and confirm the ≥95 targets.

## Scope

### In Scope

- `src/App.tsx` — full rewrite (route + view shell + overlays + teardown).
- Deletion of `components/layout/Header.tsx`, `Footer.tsx`, `Section.tsx` (+ tests),
  `components/sections/*` (8 components + tests), and any leftover obsolete files.
- `src/App.test.tsx` — rewritten integration tests.
- Accessibility/reduced-motion/responsiveness verification and any fixes they surface.
- Lighthouse audit and any perf/SEO fixes it surfaces.

### Out of Scope

- New feature behavior (all built in Epics 01–03).
- Deployment workflow changes (covered by the prior plan’s Epic 08; re-verify only).

## Dependencies

- **Depends on:** Epic 02 (02-01 hooks, 02-03 chrome) and all of Epic 03 (views + overlays);
  Epic 01 transitively. SEO metadata (prior plan 07-03, DONE) feeds the Lighthouse SEO check.
- **Blocks:** nothing in-feature — this epic is the finish line.

## Acceptance Criteria

- [ ] `App.tsx` owns route/direction/modal/cmd state, wires all five interaction hooks, and
      renders Sidebar + Topbar + the active view + the overlays.
- [ ] Navigating (sidebar, ⌘K, hash, scroll gesture, arrow keys) changes the view with the
      correct enter-direction animation, resets scroll, locks 850 ms, and updates the hash.
- [ ] The project modal and command palette open/close from App state; their actions work.
- [ ] All obsolete files (Header, Footer, Section, sections/\*, ThemeToggle, useScrollSpy) are
      deleted with no dangling imports; the tree contains only the new shell.
- [ ] `npm run build` passes and the full test suite is green.
- [ ] Accessibility: landmarks present (`<aside>`/`<main>`, one `<h1>`, `<h2>` per view), focus
      rings visible, ARIA (`aria-live` rotor, copy announcements, cmdk contract) correct.
- [ ] Reduced motion: all entrance/letter/scroll animations are neutralized under
      `prefers-reduced-motion: reduce`.
- [ ] Responsiveness: layout is correct at desktop, ≤1100px, ≤880px (stacked sidebar strip),
      and ≤600px.
- [ ] Lighthouse: Performance ≥ 95 and Accessibility ≥ 95 on the built site; SEO check passes.

## Technical Notes

- Re-keying the `.view` on route change is what drives the remount animation; combine with the
  `direction` to pick `view-enter-down` vs `-up`.
- App is the single owner of state the leaf components reflect — keep them prop-driven.
- Run the teardown last within 04-01, after the new shell renders, so the build never has both
  designs half-wired.
- Lighthouse should run against `npm run build` + `preview` (production bundle), not dev.
