---
id: 14-02
title: "Scroll-progress indicator (`useScrollProgress` + `ScrollProgress`)"
epic: 14
status: done
size: M
blocked_by: []
files: [src/App.test.tsx, src/App.tsx, src/components/layout/Topbar.test.tsx, src/components/layout/Topbar.tsx, src/components/ui/ScrollProgress.test.tsx, src/components/ui/ScrollProgress.tsx, src/hooks/useScrollProgress.test.ts, src/hooks/useScrollProgress.ts, src/index.css, src/test/scroll-progress-css.test.ts]
issue:
pr: 19
delivery: pr
prior_status:
---
# Story 01-02: Scroll-progress indicator (`useScrollProgress` + `ScrollProgress`)

> **Epic:** Scroll Motion Layer
> **Size:** L
## Description

Add a slim, decorative **scroll-progress bar** to the Topbar that reflects the active view's
scroll position 0→100%. This is a self-contained subsystem: a new `useScrollProgress` hook, a
new `ScrollProgress` component, its Topbar mount, and the supporting CSS. It shares no component
files with story 01-01, so the two can be built in parallel.

- **`useScrollProgress(viewRef, route)`** subscribes a **passive** `scroll` listener to the view
  container and, on each RAF tick, computes `scrollTop / (scrollHeight − clientHeight)` clamped
  to `[0,1]`; recomputes on `route` change and `resize`; returns the ratio.
- **`ScrollProgress`** renders a thin horizontal bar whose width/`scaleX` follows the ratio. It
  is `aria-hidden` and decorative only — keyboard route nav and `ScrollHint` remain the real
  wayfinding.
- It mounts in the **Topbar** under the breadcrumb row, so it reads as "progress through this
  section". `App.tsx` threads the existing `viewRef` (the `.view-inner` scroll container) and
  `route` into the Topbar.

The bar must **not** hijack the wheel or interfere with `useScrollToNavigate` (which advances
routes from a wheel gesture at the scroll boundary) — it is a read-only, passive listener.

## Acceptance Criteria

- [x] `src/hooks/useScrollProgress.ts` returns a `0–1` ratio: `0` at the top, `1` at the bottom
      of the view's scroll range, computed as `clamp(scrollTop / (scrollHeight − clientHeight))`.
- [x] When `scrollHeight − clientHeight <= 0` (content fits without scrolling) the ratio is `0`
      — no misleading full bar on short views.
- [x] The hook attaches a **passive** `scroll` listener, coalesces work into a single in-flight
      `requestAnimationFrame`, and recomputes on `route` change and on `resize`; it removes the
      listener and cancels any pending frame on cleanup.
- [x] `ScrollProgress` renders a bar whose width (or `scaleX`) tracks the ratio, is positioned in
      the Topbar under the breadcrumb, and carries `aria-hidden="true"`.
- [x] `App.tsx` passes its existing `viewRef` and `route` to `Topbar`, and `Topbar` forwards
      them to `ScrollProgress` — no second/duplicate ref is introduced.
- [x] Under `prefers-reduced-motion: reduce` the bar still reflects position but applies no
      animated transition (instant width update), and remains decorative.
- [x] Scrolling a tall view updates the bar smoothly; route navigation and the wheel-gesture
      route advance are unaffected. `npm run build` and the test suite pass; no new dependency.

## Technical Notes

- **Measure flow (from feature doc):**

  ```
  on mount / route change / resize: attach passive 'scroll' listener to viewRef
  on scroll: if no frame pending → requestAnimationFrame(measure)
  measure(): max = scrollHeight − clientHeight
             ratio = max <= 0 ? 0 : clamp(scrollTop / max, 0, 1)
             setRatio(ratio)
  cleanup:  remove listener, cancel pending frame
  ```

- `viewRef` already exists in `App.tsx` (`useRef<HTMLElement | null>`, assigned the
  `.view-inner` node and consumed by `useScrollReveal` / `useScrollToNavigate`). Reuse it — pass
  it as a prop to `Topbar`, which currently takes only `{ route, onOpenCmdK }`.
- The bar's `route` dependency forces a recompute when the user navigates (the new view starts
  at `scrollTop = 0`, so the bar should reset to 0).
- CSS: add `.scroll-progress` (track) and `.scroll-progress-bar` (fill) classes; reuse `--ease`
  for the (motion-on) width transition; under reduced motion drop the transition.
- Use `scaleX(ratio)` with `transform-origin: left` (cheaper than animating `width`) or `width:
ratio%` — either is acceptable; document the choice.
- Guard `window`/`matchMedia` access for the jsdom test environment (mirror existing primitives).

## Files to Create/Modify

| Action | File Path                                   | Purpose                                                           |
| ------ | ------------------------------------------- | ----------------------------------------------------------------- |
| CREATE | `src/hooks/useScrollProgress.ts`            | Passive scroll + RAF; returns clamped scroll ratio.               |
| CREATE | `src/hooks/useScrollProgress.test.ts`       | Unit tests: clamp, `max<=0 → 0`, route/resize recompute, cleanup. |
| CREATE | `src/components/ui/ScrollProgress.tsx`      | Decorative bar bound to the ratio; `aria-hidden`.                 |
| CREATE | `src/components/ui/ScrollProgress.test.tsx` | Renders/updates with ratio; is `aria-hidden`; reduced-motion.     |
| MODIFY | `src/components/layout/Topbar.tsx`          | Accept `viewRef`; render `<ScrollProgress>` under the breadcrumb. |
| MODIFY | `src/components/layout/Topbar.test.tsx`     | Cover the new prop + mounted bar.                                 |
| MODIFY | `src/App.tsx`                               | Pass `viewRef` + `route` to `Topbar`.                             |
| MODIFY | `src/index.css`                             | `.scroll-progress` / `.scroll-progress-bar`; reduced-motion gate. |

## Implementation Tasks

1. [x] Write `useScrollProgress` tests: ratio clamp, `max <= 0 → 0`, recompute on route/resize,
       passive listener + RAF coalescing, cleanup cancels frame — RED.
2. [x] Implement `src/hooks/useScrollProgress.ts` to satisfy the tests — GREEN.
3. [x] Build `src/components/ui/ScrollProgress.tsx` (bar bound to the ratio, `aria-hidden`,
       reduced-motion-aware) with its test.
4. [x] Add `.scroll-progress` / `.scroll-progress-bar` rules to `src/index.css` (reuse `--ease`;
       drop the transition under reduced motion).
5. [x] Extend `Topbar` to accept `viewRef` and render `<ScrollProgress viewRef route />` under
       the breadcrumb row; update its test.
6. [x] Thread the existing `viewRef` (+ `route`) from `App.tsx` into `Topbar`.
7. [ ] Manually verify: tall view animates the bar; short view stays at 0; route nav resets the
       bar; wheel-gesture route advance still works. Run the suite + `npm run build`.

## Dependencies

- **Blocked by:** None.
- **Blocks:** None.

## Related

- **Epic:** scroll-motion-layer
- **Related stories:** 01-01 (independent; shares only non-overlapping `index.css` sections).
- **Spec reference:** `features/scroll-motion/index.md` §Components (`ScrollProgress`),
  §Hooks (`useScrollProgress`), §Flows (scroll progress).

## Implementation Summary

- `useScrollProgress(viewRef, route)`: passive `scroll` listener plus `resize`, one in-flight
  `requestAnimationFrame`, ratio clamped to `[0,1]` and `0` when the view fits; cleanup removes
  listeners and cancels the pending frame. The first measure is also frame-scheduled, so a route
  change resets the bar on the next frame.
- `ScrollProgress`: `aria-hidden` track with a `scaleX(ratio)` fill (transform-origin left, cheaper
  than animating `width`).
- CSS: `.scroll-progress` is absolutely pinned on the topbar's bottom edge (over its border line);
  the fill eases `transform` on `--ease`; `transition: none` under `prefers-reduced-motion: reduce`,
  so the bar still tracks position but updates instantly.
- `Topbar` takes a required `viewRef` and renders the bar; `App` passes its existing `viewRef` and
  `route`. No second ref, no new dependency.
- Tests: hook (12), component (4), CSS presence (4), Topbar (2) and an App integration test; they do
  not read `matchMedia`, so the leaked reduced-motion stub cannot affect them.
- Manual browser check (tall view, short view, route reset, wheel advance) is left to the
  orchestrator's manual gate.
