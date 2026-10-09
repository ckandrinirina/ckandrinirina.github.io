---
id: 09-03
title: "prefers-reduced-motion Verification"
epic: 09
status: todo
size: S
blocked_by: ["06-09"]
files: ["src/hooks/useReveal.ts", "src/components/Section.tsx", "src/index.css"]
issue:
pr:
delivery:
prior_status:
---
# Story 09-03: prefers-reduced-motion Verification

> **Epic:** Quality, Accessibility & Performance
> **Size:** S
## Description

Verify end-to-end that the site respects the visitor's `prefers-reduced-motion:
reduce` preference. When this OS/browser setting is active, all reveal-on-scroll
animations must be suppressed and content must be immediately fully visible
without any layout shift, flash, or delay. The `useReveal` hook is the primary
integration point, but any CSS transitions or animations defined in
`index.css` or component styles must also be disabled under reduced motion.

This story is primarily a verification pass; fixes are expected to be small
(a missing media-query guard or a hook branch). If the implementation already
works correctly, the acceptance criteria are demonstrated and the story is done.

## Acceptance Criteria

- [ ] With `prefers-reduced-motion: reduce` active in the OS/browser, loading
      the site shows all section content fully visible immediately — no content is
      hidden, faded, or translated awaiting scroll.
- [ ] No layout shift (CLS) occurs on page load when reduced motion is active;
      content does not pop into view after a brief hidden state.
- [ ] `useReveal()` returns `{ isVisible: true }` immediately (without waiting
      for the `IntersectionObserver` callback) when the media query matches
      `prefers-reduced-motion: reduce`.
- [ ] The `IntersectionObserver` inside `useReveal` is not created (or is
      immediately disconnected) when reduced motion is active, so it does not
      contribute unnecessary side-effects.
- [ ] Any CSS `transition` or `animation` rules in `index.css` or component
      styles that drive reveal behavior are wrapped in a
      `@media (prefers-reduced-motion: no-preference) { … }` block or overridden
      by a `@media (prefers-reduced-motion: reduce) { … }` block that sets
      `animation: none; transition: none;`.
- [ ] With reduced motion disabled (default), the reveal animations play as
      expected — the fix must not break the standard experience.
- [ ] Verified manually by toggling the OS reduced-motion setting and reloading
      the page (not just by reading the code).

## Technical Notes

- macOS: System Settings → Accessibility → Display → Reduce Motion.
- Windows: Settings → Ease of Access → Display → Show animations in Windows
  (turn off).
- Chrome DevTools shortcut: open DevTools → Rendering tab (via ⋮ More tools) →
  "Emulate CSS media feature prefers-reduced-motion" → reduce. This does not
  require an OS change and is convenient for quick iteration.
- The `useReveal` hook should check
  `window.matchMedia('(prefers-reduced-motion: reduce)').matches` synchronously
  at call time. If true, return `{ ref: someRef, isVisible: true }` immediately
  and skip creating the `IntersectionObserver`.
- CSS approach: Tailwind v4 has a `motion-safe:` and `motion-reduce:` variant.
  Apply animation/transition classes under `motion-safe:` so they are
  automatically disabled under reduced motion without needing a separate media
  query override.
- Edge case: if `Section` applies an initial opacity/translate class
  unconditionally and removes it when `isVisible` becomes true, then with
  reduced motion the section could flicker hidden for one render frame. Ensure
  the initial class is only applied when reduced motion is not active.
- Lighthouse does not directly test `prefers-reduced-motion`; this is a manual
  and unit-test concern.

## Files to Create/Modify

| Action | File Path                    | Purpose                                                                                           |
| ------ | ---------------------------- | ------------------------------------------------------------------------------------------------- |
| MODIFY | `src/hooks/useReveal.ts`     | Return `isVisible: true` immediately when reduced-motion media query matches; skip observer setup |
| MODIFY | `src/components/Section.tsx` | Ensure initial hidden/animation classes are conditional on motion being allowed                   |
| MODIFY | `src/index.css`              | Wrap reveal-related transitions/animations in `@media (prefers-reduced-motion: no-preference)`    |

## Dependencies

- **Blocked by:** Story 06-09 (assembled site — hooks and Section must exist)
- **Blocks:** None

## Related

- **Epic:** quality-a11y-perf
- **Related stories:** 09-01 (accessibility — motion-related a11y), 09-05
  (Lighthouse — CLS score impacted by improper motion handling)
- **Spec reference:** `docs/architecture/data-flow.md` §6 Reveal-on-scroll and
  §Failure modes (Reduced-motion preference row);
  `docs/architecture/components.md` §Accessibility notes
