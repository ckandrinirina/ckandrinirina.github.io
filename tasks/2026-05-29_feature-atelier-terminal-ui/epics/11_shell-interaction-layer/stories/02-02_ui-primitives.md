---
id: 11-02
title: "UI primitives — Reveal, CountUp, Marquee, ScrollHint, Button"
epic: 11
status: done
size: M
blocked_by: ["10-01"]
files: ["src/components/ui/Reveal.tsx", "src/components/ui/CountUp.tsx", "src/components/ui/Marquee.tsx", "src/components/ui/ScrollHint.tsx", "src/components/ui/Button.tsx", "src/components/ui/*.test.tsx"]
issue:
pr:
delivery:
prior_status:
---
# Story 02-02: UI primitives — Reveal, CountUp, Marquee, ScrollHint, Button

> **Epic:** Shell & Interaction Layer
> **Size:** L
## Description

Build the animated UI building blocks the views compose from, and restyle the existing
`Button` to the mockup’s `.btn`/`.btn-primary` classes. These primitives encapsulate the
motion patterns so views stay declarative.

- **`Reveal`** — renders text letter-by-letter, each character wrapped for the `charIn`
  staggered entrance; respects reduced motion (renders the full text immediately).
- **`CountUp`** — animates a number from 0 to a target when it enters the viewport, with an
  optional suffix; used by the Stats grid.
- **`Marquee`** — a horizontally looping track of tech tokens with the `marquee` keyframe
  and the edge fade-out mask from the stylesheet.
- **`ScrollHint`** — the sticky bottom chip that names the next view; reads the next route
  label and is hidden on the last route.
- **`Button`** — restyled to `.btn` (and `.btn-primary` for the primary variant); keeps its
  existing API/accessibility (native `<button>`/anchor, focus ring).

## Acceptance Criteria

- [ ] `Reveal` splits its text into per-character spans for the `charIn` animation and, under
      `prefers-reduced-motion: reduce`, renders the complete text with no per-letter animation.
- [ ] `Reveal` preserves whitespace and is accessible (the full string is readable by screen
      readers, e.g. via an `aria-label` or visually-hidden copy — not 1 char per node only).
- [ ] `CountUp` animates from 0 to its target value on entering the viewport and renders the
      optional `suffix`; under reduced motion it shows the final value immediately.
- [ ] `Marquee` renders a duplicated track that loops seamlessly and applies the edge mask;
      it pauses or is static under reduced motion.
- [ ] `ScrollHint` shows the next route’s label, is positioned sticky at the view bottom, and
      renders nothing on the last route (`contact`).
- [ ] `Button` renders `.btn` by default and `.btn-primary` for the primary variant, remains
      keyboard-focusable with a visible focus ring, and preserves its prior prop contract.
- [ ] Each primitive has unit tests; `npm run build` passes with no TS errors.

## Technical Notes

- `Reveal` and `CountUp` should trigger on viewport entry; reuse an IntersectionObserver
  (or accept an `inView`/trigger prop the view supplies) — keep it consistent with how
  `useScrollReveal` marks elements. Document the chosen approach.
- For accessibility, `Reveal` should expose the plain text to assistive tech; wrap the
  per-letter spans with `aria-hidden` and provide a visually-hidden full-text node, or set
  `aria-label` on the container.
- `Marquee` duplicates its children once to create the seamless loop; width is content-driven.
- `ScrollHint` needs the route order to know "next" — accept the next label as a prop (App
  resolves it from `ROUTE_ORDER`) rather than importing constants directly, to stay leaf-like.
- Keep `Button`’s existing tests passing where the API is unchanged; only the class output and
  styling change.
- All animations are CSS-driven (classes from 01-01); these components add/remove classes and
  set inline `transition-delay`/counters — they do not hand-roll `requestAnimationFrame`
  unless `CountUp` needs it for the number tween.

## Files to Create/Modify

| Action | File Path                          | Purpose                                 |
| ------ | ---------------------------------- | --------------------------------------- |
| CREATE | `src/components/ui/Reveal.tsx`     | Letter-by-letter text entrance          |
| CREATE | `src/components/ui/CountUp.tsx`    | Number tween on viewport entry          |
| CREATE | `src/components/ui/Marquee.tsx`    | Looping tech-token track with edge mask |
| CREATE | `src/components/ui/ScrollHint.tsx` | Sticky next-view hint chip              |
| MODIFY | `src/components/ui/Button.tsx`     | Restyle to `.btn` / `.btn-primary`      |
| CREATE | `src/components/ui/*.test.tsx`     | Unit tests for the new primitives       |

## Dependencies

- **Blocked by:** 01-01 (the `.reveal`, `.marquee`, `.scroll-hint`, `.btn`, `charIn`/`marquee`
  keyframes must exist)
- **Blocks:** 03-01 (cards reveal), 03-03 (Home uses Reveal/CountUp/Marquee/ScrollHint),
  03-04 (views use Reveal/ScrollHint)

## Related

- **Epic:** shell-interaction-layer
- **Related stories:** 02-01 (`useScrollReveal` marks the same elements), 03-03 (heaviest consumer)
- **Spec reference:** feature doc §UI primitives, §Ambient effects (marquee mask, card shine)

## Implementation Plan

### SOLID Analysis

- **S — Single Responsibility:** each primitive animates one thing; `Button` only renders a button.
- **O — Open/Closed:** variants are props; new button variants extend the union without rewrites.
- **L — Liskov:** `Button` keeps the prior contract, so existing call sites stay valid.
- **I — Interface Segregation:** primitives take minimal props (text, target, items, label).
- **D — Dependency Inversion:** `ScrollHint`/`Marquee` receive data via props, not via constants imports.

### Subtasks

- [ ] 1. Write tests for each primitive incl. reduced-motion paths (RED).
- [ ] 2. Implement `Reveal` + `CountUp` (GREEN).
- [ ] 3. Implement `Marquee` + `ScrollHint`.
- [ ] 4. Restyle `Button`; keep existing tests green.
- [ ] 5. Refactor + SOLID/a11y check.
- [ ] 6. QA validation — map each AC, run the suite, check TypeScript.
