---
id: 11-01
title: "Routing & interaction hooks"
epic: 11
status: done
size: M
blocked_by: []
files: ["src/hooks/useHashRoute.ts", "src/hooks/useScrollToNavigate.ts", "src/hooks/useKeyboardArrows.ts", "src/hooks/useCmdK.ts", "src/hooks/useScrollReveal.ts", "src/hooks/*.test.ts", "src/hooks/useScrollSpy.ts", "src/hooks/useScrollSpy.test.ts"]
issue:
pr:
delivery: direct
prior_status:
---
# Story 02-01: Routing & interaction hooks

> **Epic:** Shell & Interaction Layer
> **Size:** XL
## Description

Implement the five hooks that power the Atelier shell’s navigation and motion, and
remove the obsolete `useScrollSpy`. These are pure logic units (no JSX), independently
testable, and consumed by `App.tsx` in 04-01 and the command palette in 03-02.

1. **`useHashRoute(setRoute)`** — reads the initial `window.location.hash`, subscribes to
   `hashchange`, and keeps route state in sync. App writes the hash via
   `history.replaceState` on every nav so the browser back button walks route history.
2. **`useScrollToNavigate(viewRef, route, locked, navigate)`** — wheel + touch listeners
   that advance/retreat the route. A wheel gesture only triggers a nav when it **starts**
   at the top (going up) or bottom (going down) boundary, accumulates `> 90px` in that
   direction, and hasn’t paused (>180 ms gap resets the accumulator). After a nav it locks
   for 850 ms. Touch: on `touchend`, navigate if `|dy| > 70` AND `dt < 700ms` AND the inner
   view didn’t actually scroll (`|view.scrollTop − startScrollTop| < 8`).
3. **`useKeyboardArrows(navigate, locked)`** — Arrow/Page Up/Down move between routes when
   the view is at a scroll boundary.
4. **`useCmdK(toggle)`** — `⌘/Ctrl+K` toggles the command palette; prevents default.
5. **`useScrollReveal(viewRef, route)`** — 30 ms after a route change, queries
   `.reveal, .proj-card, .skill-card, .tl-item, .process-item, .now-card, .stats-grid`,
   strips `.in`, creates an IntersectionObserver (root = viewRef, threshold 0.08,
   rootMargin `0px 0px -8% 0px`), and on entry sets a staggered `transitionDelay`
   (`min(siblingIndex, 8) * 90ms`), adds `.in`, and unobserves.

## Acceptance Criteria

- [ ] `useHashRoute` initializes route from the current hash and updates on `hashchange`;
      cleans up its listener on unmount.
- [ ] `useScrollToNavigate` triggers `navigate('down')` only when a wheel gesture starts at
      the bottom boundary and accumulates `> 90px` downward; `navigate('up')` symmetrically
      at the top boundary.
- [ ] A wheel gesture that merely scrolls _into_ a boundary (without starting there) does
      not navigate.
- [ ] The accumulator resets after a >180 ms pause between wheel events.
- [ ] After any nav the hook is locked for 850 ms and ignores further gestures.
- [ ] Touch navigation fires only when `|dy| > 70`, `dt < 700ms`, and the inner view did
      not scroll (`|ΔscrollTop| < 8`).
- [ ] `useKeyboardArrows` navigates next/prev on Arrow/Page keys only at the matching scroll
      boundary, and not while `locked`.
- [ ] `useCmdK` toggles via `⌘K` and `Ctrl+K` and calls `preventDefault`.
- [ ] `useScrollReveal` adds `.in` with the documented stagger to matched elements entering
      the viewport and unobserves each after revealing; re-runs cleanly on route change.
- [ ] All five hooks are unit-tested (fake timers + synthetic events); `npm run build` passes.
- [ ] `src/hooks/useScrollSpy.ts` and its test are removed; no remaining imports reference them.
      **DEFERRED to 04-01:** the obsolete `Header.tsx` still imports `useScrollSpy`; deleting it
      now breaks the build. Removal moves to the 04-01 obsolete-file teardown when `Header` is removed.

## Technical Notes

- Use `vi.useFakeTimers()` for the 850 ms lock, 180 ms reset, and 30 ms reveal delay.
- Synthesize `WheelEvent`/`TouchEvent` in tests; in jsdom you may need to construct plain
  objects with the fields the hook reads (`deltaY`, `touches`, `changedTouches`).
- Boundary detection: `el.scrollTop <= 0` (top) and
  `el.scrollHeight - el.clientHeight - el.scrollTop <= 1` (bottom), with a small epsilon.
- `useScrollReveal` must mock `IntersectionObserver` in tests (provide a manual trigger).
- Keep each hook free of route-list knowledge where possible — pass `navigate('up'|'down')`
  callbacks in; `ROUTE_ORDER` resolution lives in App/constants, not in the gesture hooks.
- Honour reduced motion at the CSS layer (01-01); the reveal hook still runs but animations
  are neutralized by the media query, so no JS branch is required.

## Files to Create/Modify

| Action | File Path                          | Purpose                                |
| ------ | ---------------------------------- | -------------------------------------- |
| CREATE | `src/hooks/useHashRoute.ts`        | Hash read/write + `hashchange` sync    |
| CREATE | `src/hooks/useScrollToNavigate.ts` | Wheel/touch boundary-gesture nav       |
| CREATE | `src/hooks/useKeyboardArrows.ts`   | Arrow/Page key route nav at boundary   |
| CREATE | `src/hooks/useCmdK.ts`             | `⌘/Ctrl+K` palette toggle              |
| CREATE | `src/hooks/useScrollReveal.ts`     | Staggered IntersectionObserver reveals |
| CREATE | `src/hooks/*.test.ts`              | Unit tests for each hook               |
| DELETE | `src/hooks/useScrollSpy.ts`        | No scroll spy in the new shell         |
| DELETE | `src/hooks/useScrollSpy.test.ts`   | Obsolete test                          |

## Dependencies

- **Blocked by:** — (pure logic; no CSS/content dependency — can start immediately)
- **Blocks:** 03-02 (`useCmdK`), 04-01 (App wires all five hooks)

## Related

- **Epic:** shell-interaction-layer
- **Related stories:** 04-01 (consumer), 02-03 (chrome reflects route state)
- **Spec reference:** feature doc §Hooks, §Data flow (Route navigation, Scroll-to-navigate,
  Reveal animation)

## Implementation Plan

### SOLID Analysis

- **S — Single Responsibility:** each hook owns exactly one interaction concern.
- **O — Open/Closed:** navigation hooks take a `navigate` callback, so route resolution can
  change without touching gesture logic.
- **L — Liskov:** all hooks follow React hook conventions and clean up their own listeners.
- **I — Interface Segregation:** hooks accept only the refs/callbacks they need, not App state.
- **D — Dependency Inversion:** gesture hooks depend on an abstract `navigate('up'|'down')`,
  not on `ROUTE_ORDER` or hash internals.

### Subtasks

- [ ] 1. Write tests for all five hooks with fake timers + synthetic events (RED).
- [ ] 2. Implement `useHashRoute`, `useCmdK`, `useKeyboardArrows` (GREEN).
- [ ] 3. Implement `useScrollReveal` (observer + stagger).
- [ ] 4. Implement `useScrollToNavigate` (the gesture engine).
- [ ] 5. Delete `useScrollSpy` + test; check no dangling imports.
- [ ] 6. QA validation — map each AC, run the suite, check TypeScript.
