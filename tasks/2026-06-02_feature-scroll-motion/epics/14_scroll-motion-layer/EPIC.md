---
epic: 14
slug: scroll-motion
title: "Scroll Motion Layer"
description: "Deliver the cross-view **motion layer** designed in `features/scroll-motion/index.md`: a zero-dependency, reduced-motion-gated enhancement to how content arrives across all six route views."
issue:
pr: 19
delivery: merged
---
# Epic 01: Scroll Motion Layer

## Description

Deliver the cross-view **motion layer** designed in `features/scroll-motion/index.md`: a
zero-dependency, reduced-motion-gated enhancement to how content arrives across all six route
views. It extends the App Shell's existing scroll-reveal engine rather than replacing it,
adds two small reusable hooks, and mounts a per-view scroll-progress indicator in the Topbar.

The epic ships in two independent slices with clean file ownership. **Story 01-01** owns the
reveal/inView contract and _all_ view-content edits: the `data-reveal` CSS vocabulary, the
`[data-reveal]` selector extension, the new `useInView` hook, and the migration of the
existing `.r-*` class usages plus site-wide `CountUp` adoption. **Story 01-02** is a
self-contained subsystem: `useScrollProgress`, the `ScrollProgress` component, and its Topbar
mount. The two stories share no component files (only non-overlapping sections of `index.css`)
and can therefore be built in parallel.

Every effect is purely CSS + IntersectionObserver + `requestAnimationFrame` — no new runtime
dependency — and is fully neutralised under `prefers-reduced-motion: reduce`.

## Goals

- Generalise reveal motion into a named `data-reveal` vocabulary on the existing engine, with
  the default (no attribute) preserving today's look exactly.
- Promote the `Reveal` / `CountUp` primitives from Home-only to site-wide via a reusable
  `useInView` hook.
- Add a slim, accessible, decorative scroll-progress bar per view in the Topbar.
- Keep zero new dependencies and full reduced-motion parity.

## Scope

### In Scope

- `useScrollReveal` `REVEAL_SELECTOR` extension with `[data-reveal]`.
- `data-reveal` CSS variants: `fade`, `blur`, `scale`, `left`, `right`, `mask` (+ default).
- New `useInView` hook; rewiring Home's `CountUp` and adopting it in Experience/Skills.
- Migration of existing `.r-fade` / `.r-right` class usages to the `data-reveal` attribute API.
- New `useScrollProgress` hook + `ScrollProgress` component, mounted in the Topbar.
- Reduced-motion gating for every new effect; `aria-hidden` on the progress bar.

### Out of Scope

- Smooth / inertial scrolling, heavy parallax, pinned scroll scenes, and any scroll-animation
  library (GSAP / Motion) — all explicitly dropped in the feature doc.
- Changes to the IntersectionObserver reveal engine internals, route transitions
  (`view-enter`), the wheel-gesture route advance (`useScrollToNavigate`), or content data.

## Dependencies

- **Depends on:** Existing App Shell (`useScrollReveal`, `.view`/`.view-inner`, `Topbar`) and
  Content Views (`Reveal`, `CountUp`) from `tasks/2026-05-29_feature-atelier-terminal-ui/`
  (all DONE). No dependency on unfinished work.
- **Blocks:** None.

## Acceptance Criteria

- [ ] All six `data-reveal` variants render their designed from→to transitions; omitting the
      attribute reproduces today's default rise-and-fade with no view regression.
- [ ] `useInView` fires `CountUp` on scroll entry (once) in any view, replacing Home's
      hardcoded `inView`.
- [ ] The Topbar shows a scroll-progress bar that tracks the active view 0→100% and reads 0 on
      short (non-scrolling) views; it does not hijack the wheel or break route navigation.
- [ ] Every new effect is neutralised under `prefers-reduced-motion: reduce`; the progress bar
      is `aria-hidden`.
- [ ] No new runtime dependency; `npm run build` and the test suite pass.

## Technical Notes

- The reveal _look_ is pure CSS keyed off `data-reveal`; the engine only toggles `.in` and the
  staggered `transitionDelay` (`min(siblingIndex, 8) × 90ms`) — do not duplicate that logic.
- Migrating `.r-fade`/`.r-right` → `data-reveal`: keep the same visual result; the existing
  `.reveal.r-*` rules are superseded by `.reveal[data-reveal="…"]` rules.
- `useScrollProgress` must use a **passive** `scroll` listener and a single in-flight RAF;
  recompute on `route` change and `resize`; clamp to `[0,1]` and treat `max <= 0` as `0`.
- `App.tsx` already owns `viewRef` (points at `.view-inner`) — reuse it; do not introduce a
  second ref.
