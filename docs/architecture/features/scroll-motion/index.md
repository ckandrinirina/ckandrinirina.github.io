---
slug: scroll-motion
design: planned
---

# Scroll Motion

> Feature doc — self-contained. A story for this feature reads THIS file
> (+ ../../folder-structure.md, + ../../\_shared.md when noted), not the other feature docs.

## Summary

A progressive-enhancement **motion layer** that enriches how content arrives on screen
across all six views. It builds on the App Shell's existing scroll-reveal engine rather
than replacing it: a small, named **reveal vocabulary** (`data-reveal` variants), the
per-letter title reveal promoted site-wide, scroll-triggered number count-up, and a slim
per-view **scroll-progress** indicator.

The boundary: this feature owns the **cross-view motion contract** — the reveal variant
CSS, the `useInView` / `useScrollProgress` hooks, and the `ScrollProgress` component. It
does **not** own the IntersectionObserver engine (that stays in
[app-shell](../app-shell/index.md) `useScrollReveal`), the route transitions
(`view-enter`, also app-shell), or the content the views render
([content-views](../content-views/index.md)).

**Zero new runtime dependencies** — pure CSS + IntersectionObserver + `requestAnimationFrame`,
consistent with the project's [no-new-deps convention](../../_shared.md#conventions).
Every effect is fully neutralised under `prefers-reduced-motion: reduce`.

### Explicitly out of scope

| Considered                                 | Decision    | Reason                                                                                                                                                     |
| ------------------------------------------ | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Smooth / inertial scrolling (Lenis-style)  | **Dropped** | Hijacks the wheel; conflicts with [`useScrollToNavigate`](../app-shell/index.md#hooks), which advances routes from a wheel gesture at the scroll boundary. |
| Heavy parallax / pinned scroll scenes      | **Dropped** | Views are short, route-based scroll containers (one view at a time) — not enough scroll travel for parallax to read well.                                  |
| A scroll-animation library (GSAP / Motion) | **Dropped** | The existing system already covers reveals with CSS + RAF; a runtime dep would break the zero-dep convention for marginal gain.                            |

## Components

| Component        | File                                   | Responsibility                                                                                                        | Key props                                 |
| ---------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `ScrollProgress` | `src/components/ui/ScrollProgress.tsx` | Slim horizontal bar reflecting the active view's scroll position (0→100%). Rendered in the `Topbar`.                  | `viewRef`, `route`                        |
| `Reveal`         | `src/components/ui/Reveal.tsx`         | Per-letter text entrance (existing). **Promoted from Home-only to site-wide** — usable in any section title.          | `text`, `charDelay?`, `italic?`, `delay?` |
| `CountUp`        | `src/components/ui/CountUp.tsx`        | Eased 0→`to` number tween (existing). Now driven by `useInView` so it fires on scroll in **any** view, not only Home. | `to`, `suffix?`, `duration?`, `inView?`   |

> `Reveal` and `CountUp` already exist as Home-only primitives in
> [content-views](../content-views/index.md#home-animation-primitives--cta). This feature
> generalises them; their core implementation is unchanged. New, motion-only code is
> `ScrollProgress` + the two hooks below + the reveal-variant CSS.

## Hooks

| Hook                          | File                             | Responsibility                                                                                                                                                                                                                                |
| ----------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useScrollReveal` (app-shell) | `src/hooks/useScrollReveal.ts`   | **Extended, not replaced.** The engine that adds `.in` with staggered `transitionDelay`. The `REVEAL_SELECTOR` gains the generic `[data-reveal]` hook so any element can opt in; variant look comes from CSS (below).                         |
| `useInView`                   | `src/hooks/useInView.ts`         | Returns a `[ref, inView]` pair via a one-shot IntersectionObserver scoped to the active view. Lets `CountUp` (and future scroll-triggered widgets) fire anywhere, replacing Home's bespoke wiring.                                            |
| `useScrollProgress`           | `src/hooks/useScrollProgress.ts` | Subscribes to the view container's `scroll` event (passive), and on each RAF tick computes `scrollTop / (scrollHeight − clientHeight)` clamped to `[0,1]`. Returns the ratio for `ScrollProgress`. Recomputes on `route` change and `resize`. |

## Reveal vocabulary

The existing engine simply toggles `.in`; the _look_ of the transition is pure CSS keyed
off a `data-reveal` attribute on the revealed element. This is the only new "API" the
views consume.

```html
<!-- default: rise + fade (current behaviour, unchanged) -->
<div class="reveal">…</div>

<!-- named variants -->
<div class="reveal" data-reveal="fade">…</div>
<!-- opacity only -->
<div class="reveal" data-reveal="blur">…</div>
<!-- blur(8px) → 0 + fade -->
<div class="reveal" data-reveal="scale">…</div>
<!-- scale(.96) → 1 + fade -->
<div class="reveal" data-reveal="left">…</div>
<!-- translateX(-24px) → 0 -->
<div class="reveal" data-reveal="right">…</div>
<!-- translateX(24px) → 0 -->
<div class="reveal" data-reveal="mask">…</div>
<!-- clip-path inset wipe, bottom→top -->
```

| `data-reveal` | From state (pre-`.in`)                    | To state (`.in`) |
| ------------- | ----------------------------------------- | ---------------- |
| _(none)_      | `opacity:0; translateY(16px)`             | natural          |
| `fade`        | `opacity:0`                               | natural          |
| `blur`        | `opacity:0; filter:blur(8px)`             | natural          |
| `scale`       | `opacity:0; transform:scale(.96)`         | natural          |
| `left`        | `opacity:0; transform:translateX(-24px)`  | natural          |
| `right`       | `opacity:0; transform:translateX(24px)`   | natural          |
| `mask`        | `clip-path: inset(100% 0 0 0); opacity:0` | `inset(0)`       |

- Transition timing reuses the shell's `--ease` curve and the reveal duration already in
  `src/index.css`; only the property set differs per variant.
- Stagger is unchanged: `useScrollReveal` sets `transitionDelay = min(siblingIndex, 8) × 90ms`.
- Variants are opt-in per element; omitting `data-reveal` preserves today's look exactly,
  so no existing view regresses.

## Flows

### Reveal-on-scroll (extended)

```
On route change (app-shell useScrollReveal):
  wait 30ms → query .reveal, .proj-card, .skill-card, .tl-item,
              .process-item, .now-card, .stats-grid, [data-reveal]
  strip .in
  IntersectionObserver(root: viewRef, threshold 0.08, rootMargin '0px 0px -8% 0px')
  on enter:
    transitionDelay = min(idx, 8) × 90ms
    add .in   →  CSS plays the variant chosen by data-reveal
    unobserve (one-shot)
```

### Scroll progress

```
Topbar renders <ScrollProgress viewRef route />:
  useScrollProgress(viewRef, route):
    on mount / route change / resize:  attach passive 'scroll' listener to viewRef
    on scroll:  if no frame pending → requestAnimationFrame(measure)
    measure():  max = scrollHeight − clientHeight
                ratio = max <= 0 ? 0 : clamp(scrollTop / max, 0, 1)
                setRatio(ratio)
    cleanup:    remove listener, cancel pending frame
  bar width (or scaleX) = ratio × 100%
```

The bar sits in the Topbar under the breadcrumb row so it reads as "progress through this
section". On short views where content fits without scrolling, `max <= 0` keeps the bar
at 0 (no misleading full bar).

### Scroll-triggered count-up (site-wide)

```
Any view with a numeric stat:
  const [ref, inView] = useInView()
  <span ref={ref}><CountUp to={N} suffix="+" inView={inView} /></span>
  → enters viewport once → RAF tween 0→N (ease-out quad), then settles
```

This replaces Home's previous one-off `inView` wiring with a reusable hook so Experience,
Skills, etc. can animate numbers identically.

## State summary

| State                 | Where                           | Persisted | Default |
| --------------------- | ------------------------------- | --------- | ------- |
| Scroll-progress ratio | `useScrollProgress` (transient) | no        | `0`     |
| `inView` flag         | `useInView` (transient)         | no        | `false` |
| Reveal `.in` flag     | DOM class (app-shell engine)    | no        | unset   |

No new persisted state, no new URL/hash involvement, no new content data.

## Configuration

- `src/index.css` — new `.reveal[data-reveal="…"]` rules and the `.scroll-progress` /
  `.scroll-progress-bar` classes (timing reuses existing `--ease` and reveal-duration tokens).
- No `vite.config.ts`, env, or `package.json` changes (zero new deps).

## Shared dependencies

- [App Shell — `useScrollReveal`, `useScrollToNavigate`, Topbar, `.view` scroll container](../app-shell/index.md) —
  this feature extends the reveal engine and mounts `ScrollProgress` inside the Topbar.
- [Content Views — `Reveal`, `CountUp` primitives](../content-views/index.md#home-animation-primitives--cta) —
  promoted from Home-only to site-wide here.
- [Accessibility & reduced-motion conventions](../../_shared.md#accessibility--reduced-motion) —
  **every** reveal variant, count-up, and the progress bar collapse to their final/static
  state under `@media (prefers-reduced-motion: reduce)`; the bar is `aria-hidden` and is
  decorative only (keyboard route nav and `ScrollHint` remain the real wayfinding).
- [No-new-deps & CSS conventions](../../_shared.md#conventions).

## Changelog

- 2026-06-02 · design — feature created. Cross-view motion layer (reveal vocabulary via
  `data-reveal`, site-wide `Reveal`/`CountUp` via `useInView`, `ScrollProgress` +
  `useScrollProgress`). Zero new deps; reduced-motion gated. Out of scope: smooth-scroll,
  parallax, animation libraries.
