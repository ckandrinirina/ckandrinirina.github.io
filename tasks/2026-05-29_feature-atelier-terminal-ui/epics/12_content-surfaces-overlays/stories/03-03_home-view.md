---
id: 12-03
title: "HomeView — hero, rotor, avatar, now-card, stats, marquee"
epic: 12
status: done
size: M
blocked_by: ["10-01", "10-03", "11-02"]
files: ["src/views/HomeView.tsx", "src/views/HomeView.test.tsx"]
issue:
pr: 17
delivery: pr
prior_status:
---
# Story 03-03: HomeView — hero, rotor, avatar, now-card, stats, marquee

> **Epic:** Content Surfaces & Overlays
> **Size:** XL
## Description

Build `HomeView`, the `home` route — the richest surface in the shell. It composes the
primitives from 02-02 and reads `hero`, `now`, `stats`, and `marquee` from
`useLanguage().content`.

The view contains:

- **Hero** — eyebrow/greeting, the name rendered with `Reveal` (letter-by-letter) as the
  single page `<h1>`, the serif tagline, a **role rotor** that cycles through `hero.roles`
  (`aria-live="polite"`), and three CTAs: primary "Get in touch" (navigates to contact),
  a secondary action, and the **CV download** as the third CTA (reusing `DownloadCvButton`,
  per the design decision).
- **Avatar frame** — the `.avatar-frame` with an `<img>` referencing `public/profile.jpg`
  (replacing the mockup’s `<image-slot>`), with the orbiting accent and `.avatar-tag`.
- **Now-card** — `.now-card` rendering `now.headline`, `now.body`, and meta (label + period).
- **Stats grid** — `.stats-grid` of `.stat-tile`s, each animating with `CountUp` (value +
  optional suffix) and a label.
- **Marquee** — the looping `Marquee` of `content.marquee` tech tokens.

## Acceptance Criteria

- [x] The hero renders the greeting/eyebrow, the name via `Reveal` as the only `<h1>` on the
      page, and the serif tagline.
- [x] The role rotor cycles through `hero.roles` on an interval, is wrapped in an
      `aria-live="polite"` region, and pauses/settles under reduced motion.
- [x] Three CTAs render: a primary that navigates to `contact`, a secondary action, and the CV
      download (via `DownloadCvButton`) as the third CTA.
- [x] The avatar frame renders an `<img>` from `public/profile.jpg` with appropriate `alt`, plus
      the orbit accent and avatar tag.
- [x] The Now-card renders `now.headline`, `now.body`, and the meta label/period.
- [x] The Stats grid renders each `stats` entry as a `.stat-tile` with a `CountUp` value
      (+ suffix) and label.
- [x] The Marquee renders `content.marquee` tokens in a seamless loop with the edge mask.
- [x] Revealable elements (`.now-card`, `.stats-grid`, `.reveal`) carry the classes
      `useScrollReveal` targets so they animate in on route entry.
- [x] Navigation/CV/contact CTAs invoke the supplied callbacks/props (App wires them in 04-01).
- [x] Unit tests cover hero/rotor/CTAs/avatar/now/stats/marquee; `npm run build` passes.

## Technical Notes

- The role rotor is local interval state; clear it on unmount and freeze on the first role under
  `prefers-reduced-motion` (read via `matchMedia`, guarded for jsdom).
- `HomeView` receives navigation as a prop (`navigate`/`onNavigate`) — it does not own routing.
- Reuse `DownloadCvButton` (kept from the prior plan) for the CV CTA; restyle to `.btn` if needed.
- Profile image lives at `public/profile.jpg` (already present from the prior plan’s brand assets);
  reference it by absolute public path; provide descriptive `alt`.
- Keep `CountUp` triggering consistent with 02-02’s viewport approach; the stat tiles must carry
  the reveal classes so the stagger applies.
- One `<h1>` rule: the hero name is the page’s `<h1>`; every other view uses `<h2>`.

## Files to Create/Modify

| Action | File Path                     | Purpose                                       |
| ------ | ----------------------------- | --------------------------------------------- |
| CREATE | `src/views/HomeView.tsx`      | Hero, rotor, avatar, Now-card, stats, marquee |
| CREATE | `src/views/HomeView.test.tsx` | Unit tests                                    |

## Dependencies

- **Blocked by:** 01-01 (`.home-*`/`.avatar-*`/`.now-card`/`.stats-grid`/`.marquee` classes),
  01-03 (`hero`/`now`/`stats`/`marquee` content), 02-02 (`Reveal`, `CountUp`, `Marquee`)
- **Blocks:** 04-01 (App renders HomeView for the `home` route)

## Related

- **Epic:** content-surfaces-overlays
- **Related stories:** 02-02 (primitives), 03-04 (sibling views), 04-01 (consumer)
- **Spec reference:** feature doc §Components (HomeView), §Content model (hero/now/stats/marquee)

## Implementation Plan

### SOLID Analysis

- **S — Single Responsibility:** HomeView composes; each sub-block (rotor, stats) delegates motion
  to a primitive.
- **O — Open/Closed:** stat/marquee/role lists are data-driven; adding an item needs no view change.
- **L — Liskov:** renders for any valid `hero`/`now`/`stats`/`marquee` content.
- **I — Interface Segregation:** takes only `{ content slice via hook, navigate }`.
- **D — Dependency Inversion:** depends on `useLanguage()` content + a `navigate` callback.

### Subtasks

- [x] 1. Write HomeView tests incl. rotor + reduced-motion (RED).
- [x] 2. Implement hero (Reveal name, tagline, rotor, CTAs) (GREEN).
- [x] 3. Implement avatar frame + Now-card.
- [x] 4. Implement Stats grid (CountUp) + Marquee.
- [x] 5. Wire reveal classes; refactor + a11y check.
- [x] 6. QA validation — map each AC, run the suite, check TypeScript.
