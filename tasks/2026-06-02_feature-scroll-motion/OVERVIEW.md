---
slug: scroll-motion
title: Scroll Motion
integration: epic
branch:
issue:
pr:
delivery:
---

# Feature Overview: Scroll Motion

> **Mode:** Feature — Add Feature
> **Feature doc:** [`docs/architecture/features/scroll-motion/index.md`](../../docs/architecture/features/scroll-motion/index.md)
> **Design ledger row:** `Scroll Motion` · `scroll-motion` · 2026-06-02

## Description & Motivation

A progressive-enhancement **motion layer** that enriches how content arrives on screen
across all six route views. It does **not** replace the App Shell's existing scroll-reveal
engine — it builds on it with a small, named vocabulary and two reusable hooks:

- a **reveal vocabulary** (`data-reveal` variants: `fade` · `blur` · `scale` · `left` ·
  `right` · `mask`) layered onto the existing `useScrollReveal` `.in` engine — the look is
  pure CSS keyed off a `data-reveal` attribute, so omitting the attribute preserves today's
  default rise-and-fade exactly;
- the per-letter `Reveal` and number `CountUp` primitives **promoted from Home-only to
  site-wide** via a new `useInView` hook, so any view can fire a scroll-triggered count-up;
- a slim per-view **scroll-progress** bar (`useScrollProgress` + `ScrollProgress`) mounted in
  the Topbar under the breadcrumb.

**Zero new runtime dependencies** — pure CSS + IntersectionObserver + `requestAnimationFrame`.
Every effect collapses to its final/static state under `prefers-reduced-motion: reduce`.

The feature owns the **cross-view motion contract**: the reveal-variant CSS, the `useInView` /
`useScrollProgress` hooks, and the `ScrollProgress` component. It does **not** own the
IntersectionObserver engine (`useScrollReveal`, app-shell), the route transitions
(`view-enter`, app-shell), or the content the views render (content-views).

## Affected Existing Components

| File                                                        | Change                                                                                                           |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `src/hooks/useScrollReveal.ts`                              | Extend `REVEAL_SELECTOR` to include the generic `[data-reveal]` hook (engine logic otherwise unchanged).         |
| `src/index.css`                                             | Add `.reveal[data-reveal="…"]` variant rules + `.scroll-progress` / `.scroll-progress-bar`; reduced-motion gate. |
| `src/components/ui/CountUp.tsx`                             | No core change — now driven by `useInView` at call sites instead of a hardcoded `inView`.                        |
| `src/components/ui/Reveal.tsx`                              | No change — already site-wide-capable; documented as a general primitive here.                                   |
| `src/components/ui/Marquee.tsx`                             | Migrate its `.r-fade` class usage to the `data-reveal="fade"` attribute API.                                     |
| `src/views/HomeView.tsx`                                    | Migrate `.r-*` reveal classes → `data-reveal`; rewire the stats `CountUp` through `useInView`.                   |
| `src/views/ExperienceView.tsx` · `src/views/SkillsView.tsx` | Adopt `useInView`-driven `CountUp` and `data-reveal` variants where numeric/section motion helps.                |
| `src/components/layout/Topbar.tsx`                          | Accept `viewRef` and render `<ScrollProgress>` under the breadcrumb row.                                         |
| `src/App.tsx`                                               | Thread the existing `viewRef` (the `.view-inner` scroll container) into `Topbar`.                                |

## New Components Introduced

| Artifact                               | Kind      | Responsibility                                                                      |
| -------------------------------------- | --------- | ----------------------------------------------------------------------------------- |
| `src/hooks/useInView.ts`               | Hook      | One-shot IntersectionObserver returning `[ref, inView]`, scoped to the active view. |
| `src/hooks/useScrollProgress.ts`       | Hook      | Passive `scroll` + RAF; returns clamped `scrollTop/(scrollHeight−clientHeight)`.    |
| `src/components/ui/ScrollProgress.tsx` | Component | Slim horizontal bar reflecting the active view's scroll position; `aria-hidden`.    |

## Integration Points

- **App Shell** — the reveal engine (`useScrollReveal`), the `.view` / `.view-inner` scroll
  container, and the Topbar are the host surfaces this feature extends and mounts into. The
  scroll-progress bar must **not** interfere with `useScrollToNavigate` (the wheel-gesture
  route advance) — it is a passive read-only `scroll` listener.
- **Content Views** — `Reveal` / `CountUp` are generalised from Home-only to site-wide; views
  opt into `data-reveal` variants per element with no forced regression.
- **Accessibility & reduced-motion** (`_shared.md`) — every variant, count-up, and the progress
  bar collapse to their final/static state under `prefers-reduced-motion: reduce`; the bar is
  decorative (`aria-hidden`), keyboard route nav and `ScrollHint` remain the real wayfinding.

## References

- Feature doc: `docs/architecture/features/scroll-motion/index.md`
- Shared conventions: `docs/architecture/_shared.md` (a11y / reduced-motion, no-new-deps)
- Generated: 2026-06-02
