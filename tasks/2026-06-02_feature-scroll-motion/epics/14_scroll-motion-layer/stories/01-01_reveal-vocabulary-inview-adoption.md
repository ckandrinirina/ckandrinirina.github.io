---
id: 14-01
title: "Reveal vocabulary, `useInView` & site-wide view adoption"
epic: 14
status: todo
size: M
blocked_by: []
files: ["src/hooks/useInView.ts", "src/hooks/useInView.test.ts", "src/hooks/useScrollReveal.ts", "src/index.css", "src/components/ui/Marquee.tsx", "src/views/HomeView.tsx", "src/views/ExperienceView.tsx", "src/views/SkillsView.tsx", "src/hooks/useScrollReveal.test.ts"]
issue:
pr:
delivery:
prior_status:
---
# Story 01-01: Reveal vocabulary, `useInView` & site-wide view adoption

> **Epic:** Scroll Motion Layer
> **Size:** XL
## Description

Establish the **reveal vocabulary** and the **`useInView`** hook, then adopt both across the
view layer. This story owns the reveal/inView motion contract _and every view-content edit_, so
no other story touches the view files (avoiding conflicts with 01-02).

Three threads, one cohesive slice:

1. **Reveal vocabulary (CSS + engine):** add `.reveal[data-reveal="…"]` rules for the six named
   variants (`fade`, `blur`, `scale`, `left`, `right`, `mask`) plus the unchanged default, and
   extend `useScrollReveal`'s `REVEAL_SELECTOR` with the generic `[data-reveal]` hook so any
   element can opt in. The engine logic (one-shot observer, staggered `transitionDelay`) is
   unchanged — only the selector grows and the look is chosen per element by `data-reveal`.
2. **`useInView` hook:** a one-shot IntersectionObserver returning `[ref, inView]`, scoped to
   the active view container, so `CountUp` (and future scroll-triggered widgets) can fire
   anywhere — replacing Home's bespoke hardcoded `inView`.
3. **Adoption:** migrate the existing `.r-fade` / `.r-right` class usages (Marquee, HomeView) to
   the `data-reveal` attribute API, rewire Home's stats `CountUp` through `useInView`, and adopt
   `useInView`-driven `CountUp` / `data-reveal` variants in Experience and Skills where numeric
   or section motion improves the entrance.

## Acceptance Criteria

- [ ] `src/index.css` defines `.reveal[data-reveal="fade"|"blur"|"scale"|"left"|"right"|"mask"]`
      with the designed pre-`.in` (from) states and natural/`inset(0)` (to) states; the default
      `.reveal` (no attribute) keeps `opacity:0; translateY(16–36px)` → natural, unchanged.
- [ ] Each variant's transition reuses the shell's `--ease` curve and the existing reveal
      duration; only the animated property set differs per variant.
- [ ] `useScrollReveal`'s `REVEAL_SELECTOR` includes `[data-reveal]`; an element carrying only
      `class="reveal" data-reveal="blur"` receives `.in` and animates with the blur variant.
- [ ] `src/hooks/useInView.ts` returns `[ref, inView]`; `inView` flips to `true` exactly once
      when the ref enters the viewport (one-shot — it does not flip back on exit) and the
      observer is disconnected on unmount.
- [ ] Home's stats `CountUp` is driven by `useInView` (no hardcoded `inView`) and counts up only
      when the stats grid scrolls into view; at least one other view (Experience or Skills)
      animates a numeric stat the same way via `useInView`.
- [ ] All previous `.r-fade` / `.r-right` class usages (e.g. `Marquee.tsx`, `HomeView.tsx`) are
      replaced by the `data-reveal` attribute with no visual regression; the superseded
      `.reveal.r-*` rules are removed or left inert.
- [ ] Under `prefers-reduced-motion: reduce`, every variant and every `useInView`-driven
      `CountUp` shows its final/static state immediately (no transform, blur, or tween).
- [ ] No new runtime dependency; `npm run build` passes with no TS errors and unit tests cover
      `useInView` (including reduced-motion / one-shot behaviour) and the variant migration.

## Technical Notes

- **Variant table (from feature doc):**

  | `data-reveal` | From (pre-`.in`)                          | To (`.in`) |
  | ------------- | ----------------------------------------- | ---------- |
  | _(none)_      | `opacity:0; translateY(16px)`             | natural    |
  | `fade`        | `opacity:0`                               | natural    |
  | `blur`        | `opacity:0; filter:blur(8px)`             | natural    |
  | `scale`       | `opacity:0; transform:scale(.96)`         | natural    |
  | `left`        | `opacity:0; transform:translateX(-24px)`  | natural    |
  | `right`       | `opacity:0; transform:translateX(24px)`   | natural    |
  | `mask`        | `clip-path: inset(100% 0 0 0); opacity:0` | `inset(0)` |

  The repo currently uses heavier offsets in the default (`translateY(36px) scale(.97)`) and
  class-based `.r-*` variants — supersede them with the `data-reveal` attribute rules; keep the
  default look visually equivalent to today's.

- **`useInView`:** create one `IntersectionObserver` per mount, threshold ≈ `0.2` (or reuse the
  engine's `0.08` for consistency), `unobserve` on first intersection, `disconnect` on cleanup.
  Return a stable `ref` callback or `RefObject` plus the `inView` boolean. Mirror the
  reduced-motion guard pattern already in `CountUp.tsx` / `Reveal.tsx` (`matchMedia`).
- **`CountUp` is unchanged** — it already takes an `inView` prop; only the call sites change
  from `inView` (hardcoded) to `inView={inView}` sourced from `useInView`.
- Keep the engine's stagger untouched: `transitionDelay = min(idx, 8) × 90ms` is set by
  `useScrollReveal`, not by CSS variants.
- Do not touch the Topbar, `App.tsx`, or add a scroll-progress bar — that is story 01-02.

## Files to Create/Modify

| Action | File Path                           | Purpose                                                            |
| ------ | ----------------------------------- | ------------------------------------------------------------------ |
| CREATE | `src/hooks/useInView.ts`            | One-shot IntersectionObserver hook returning `[ref, inView]`.      |
| CREATE | `src/hooks/useInView.test.ts`       | Unit tests: one-shot fire, cleanup, reduced-motion behaviour.      |
| MODIFY | `src/hooks/useScrollReveal.ts`      | Add `[data-reveal]` to `REVEAL_SELECTOR`.                          |
| MODIFY | `src/index.css`                     | `.reveal[data-reveal="…"]` variant rules; supersede `.r-*`; a11y.  |
| MODIFY | `src/components/ui/Marquee.tsx`     | `.r-fade` class → `data-reveal="fade"`.                            |
| MODIFY | `src/views/HomeView.tsx`            | `.r-*` → `data-reveal`; stats `CountUp` via `useInView`.           |
| MODIFY | `src/views/ExperienceView.tsx`      | Adopt `useInView`-driven `CountUp` / `data-reveal` where it helps. |
| MODIFY | `src/views/SkillsView.tsx`          | Adopt `useInView`-driven `CountUp` / `data-reveal` where it helps. |
| MODIFY | `src/hooks/useScrollReveal.test.ts` | Cover the `[data-reveal]` selector match.                          |

## Implementation Tasks

1. [ ] Write `useInView` tests (one-shot fire on intersect, no flip-back, cleanup disconnects,
       reduced-motion path) — RED.
2. [ ] Implement `src/hooks/useInView.ts` as a one-shot IntersectionObserver returning
       `[ref, inView]` scoped to the active view; satisfy the tests — GREEN.
3. [ ] Add the `.reveal[data-reveal="…"]` variant rules to `src/index.css` (six variants +
       default) reusing `--ease` and the existing reveal duration; add the reduced-motion
       neutralisation block.
4. [ ] Extend `REVEAL_SELECTOR` in `useScrollReveal.ts` with `[data-reveal]`; update its test.
5. [ ] Migrate `.r-fade` / `.r-right` usages in `Marquee.tsx` and `HomeView.tsx` to the
       `data-reveal` attribute; remove or inert the superseded `.reveal.r-*` CSS.
6. [ ] Rewire Home's stats `CountUp` to source `inView` from `useInView`; verify it counts only
       on scroll-in.
7. [ ] Adopt `useInView`-driven `CountUp` and selected `data-reveal` variants in
       `ExperienceView.tsx` and `SkillsView.tsx` where motion improves the entrance.
8. [ ] Run the suite + `npm run build`; verify reduced-motion parity and no visual regression on
       default reveals.

## Dependencies

- **Blocked by:** None.
- **Blocks:** None.

## Related

- **Epic:** scroll-motion-layer
- **Related stories:** 01-02 (independent; shares only non-overlapping `index.css` sections).
- **Spec reference:** `features/scroll-motion/index.md` §Reveal vocabulary, §Hooks (`useInView`),
  §Flows (reveal-on-scroll, scroll-triggered count-up).
