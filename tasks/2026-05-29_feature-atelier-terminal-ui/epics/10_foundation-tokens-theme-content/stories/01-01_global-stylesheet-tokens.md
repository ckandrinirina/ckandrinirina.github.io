---
id: 10-01
title: "Global stylesheet rewrite — 4-theme tokens, classes, fonts"
epic: 10
status: done
size: M
blocked_by: []
files: ["src/index.css", "index.html"]
issue:
pr:
delivery:
prior_status:
---
# Story 01-01: Global stylesheet rewrite — 4-theme tokens, classes, fonts

> **Epic:** Foundation — Tokens, Theme & Content
> **Size:** XL
## Description

Rewrite `src/index.css` to be the complete visual foundation of the Atelier Terminal
shell, and update `index.html` to load the required fonts. This story produces the
token system and every component class the redesign needs; later components only apply
these classes.

The stylesheet must contain, **verbatim from the design doc**: the four palette token
sets — Ember (`:root`, the default), Paper (`[data-theme="paper"]`), Ocean
(`[data-theme="ocean"]`), Forest (`[data-theme="forest"]`) — as CSS custom properties;
the typography/motion tokens (`--font-mono`, `--font-serif`, `--ease`); the base
element styles (mono body at `14px / 1.6` with OpenType `"ss01","cv11"`, serif display
titles using the `clamp()` sizes); the ambient effects (`body::before` radial glow,
`body::after` grid overlay, marquee edge mask, project card shine); and the full set of
mockup component classes with their keyframes and media-query overrides.

`index.html` gains the Google Fonts preconnects + stylesheet at the top of `<head>`.
(The anti-FOUC `data-theme` bootstrap script is added in 01-02; this story only adds the
font links and may leave a placeholder comment where the bootstrap will go.)

## Acceptance Criteria

- [x] `src/index.css` begins with `@import 'tailwindcss';` and an `@theme { ... }` block
      bridging the key tokens (`--color-bg`, `--color-fg`, `--color-accent`,
      `--font-mono`, `--font-serif`) so Tailwind utilities resolve.
- [x] The Ember palette is defined on `:root` with every token value from the design doc
      (`--bg #16130F`, `--accent #E08660`, … through `--shadow-lift`).
- [x] `[data-theme="paper"]`, `[data-theme="ocean"]`, and `[data-theme="forest"]` each
      override the palette tokens with their exact documented values.
- [x] `--font-mono`, `--font-serif`, and `--ease` (`cubic-bezier(0.22, 1, 0.36, 1)`) are
      defined; the body uses `font-mono` at `14px / 1.6` with `font-feature-settings`
      enabling `"ss01"` and `"cv11"`.
- [x] Section titles use `font-serif` italic at `clamp(32px, 4.5vw, 52px)`; the Hero name
      uses `clamp(48px, 7vw, 88px)`.
- [x] `body::before` (radial glow, two gradients, `pointer-events:none`, `z-index:0`) and
      `body::after` (perpendicular `linear-gradient` grid at `64px 64px`, `opacity:0.5`)
      are present and fixed behind content.
- [x] All mockup component classes exist: `.app`, `.sidebar`, `.sb-*`, `.topbar`, `.tb-*`,
      `.view`, `.view-inner`, `.view-enter` (+ `-down`/`-up`), `.eyebrow`, `.section-title`,
      `.section-sub`, `.home-*`, `.avatar-*`, `.now-card`, `.stats-grid`, `.stat-tile`,
      `.marquee`, `.marquee-track`, `.work-grid`, `.proj-card`, `.modal-bg`, `.modal`,
      `.modal-body`, `.timeline`, `.tl-*`, `.skill-cards`, `.skill-card`, `.process-*`,
      `.contact-*`, `.cmdk-*`, `.deco-corner`, `.stg-1`…`.stg-8`, `.reveal`, `.nav-lock`,
      `.scroll-hint`, `.cursor-dot`, `.cursor-ring`, `.btn`/`.btn-primary`.
- [x] All mockup keyframes exist: `orbit`, `blink`, `viewEnter`, `viewEnterDown`,
      `viewEnterUp`, `marquee`, `navSweep`, `bounce`, `charIn`, `cardIn`.
- [x] `@media (prefers-reduced-motion: reduce)` disables entrance/letter/scroll animations
      and forces the final visible state.
- [x] `@media (hover: hover) and (pointer: fine)` sets `cursor: none` on `html, body,
  button, a, input` (for the custom cursor).
- [x] The `.app` grid is `240px 1fr`, `height: 100vh`, `overflow: hidden`; below `880px`
      it stacks to `grid-template-rows: 56px 1fr`; view padding steps `56px 80px 80px` →
      `40px 40px 60px` (≤1100px) → `24px 18px 60px` (≤600px).
- [x] `index.html` includes the two `preconnect` links and the Google Fonts stylesheet
      for Geist, Instrument Serif, and JetBrains Mono with `display=swap`.
- [x] `npm run build` completes with no errors and the existing test suite still passes
      (or failing tests are limited to components being replaced later in the feature).

## Technical Notes

- Copy token values **exactly** from the design doc tables. Do not normalize hex casing,
  round rgba alphas, or substitute "equivalent" colours — the mockup is the source of truth.
- Ocean and Forest omit `--info` / a couple of shadow tokens in the doc; inherit those
  from `:root` (do not invent values).
- The grid overlay is two stacked `linear-gradient`s (vertical + horizontal lines). Keep
  both `::before`/`::after` layers `pointer-events: none` so they never block clicks.
- Because Tailwind v4 is CSS-first, the `@theme` block is how custom tokens become
  utilities; keep it minimal (only the tokens utilities actually reference).
- This is a large file. Organize it with section comments (`/* === TOKENS === */`,
  `/* === LAYOUT === */`, etc.) so later stories can find the class they need.
- Visual correctness can't be fully unit-tested; assert structural facts instead (e.g. a
  CSS-presence test that the stylesheet defines `--accent` for each `[data-theme]`, that
  the four palettes exist, and that key class names are present in the file).

## Files to Create/Modify

| Action | File Path       | Purpose                                                                     |
| ------ | --------------- | --------------------------------------------------------------------------- |
| MODIFY | `src/index.css` | Full rewrite: tokens (4 palettes), typography, ambient, all mockup classes  |
| MODIFY | `index.html`    | Add Google Fonts preconnects + stylesheet (bootstrap placeholder for 01-02) |

## Dependencies

- **Blocked by:** — (builds on the existing scaffold; no in-feature blocker)
- **Blocks:** 01-02 (theme provider toggles `data-theme` against these tokens), 02-02,
  02-03, 03-01, 03-02, 03-03, 03-04 (every component applies these classes).

## Related

- **Epic:** foundation-tokens-theme-content
- **Related stories:** 01-02 (adds the bootstrap script to `index.html`), 01-03 (content)
- **Spec reference:** feature doc §Design tokens, §Ambient effects, §Layout shell,
  §Configuration changes (`index.html`, `src/index.css`)

## Implementation Plan

### SOLID Analysis

- **S — Single Responsibility:** the stylesheet owns presentation only; logic lives in
  later TS modules. Each class targets one visual concern.
- **O — Open/Closed:** new palettes are added by a new `[data-theme]` block without
  touching component classes; new views reuse existing classes.
- **L — Liskov:** every `[data-theme]` overrides the same token contract `:root` defines,
  so any theme is a drop-in substitute.
- **I — Interface Segregation:** the `@theme` block exposes only the tokens utilities need.
- **D — Dependency Inversion:** components depend on token names (`var(--accent)`), not
  concrete colours, so the theme layer can swap values freely.

### Subtasks

- [x] 1. Add a CSS-presence test (RED) asserting the four palettes, key tokens, and core
     class names exist in `src/index.css`.
- [x] 2. Write the `@import`/`@theme` header + the four palette token blocks (GREEN).
- [x] 3. Add base typography, ambient effects, layout shell, and all component classes.
- [x] 4. Add keyframes + `prefers-reduced-motion` + cursor media queries.
- [x] 5. Add Google Fonts to `index.html`; verify `npm run build`.
- [x] 6. QA validation — map each AC, run the suite, check TypeScript.

## Implementation Summary

### What was built

Rewrote `src/index.css` from scratch as the complete visual foundation for the
Atelier Terminal redesign: a Tailwind v4 CSS-first stylesheet containing the 4-palette
token system (Ember/Paper/Ocean/Forest), all base typography, ambient effects, every
mockup component class, all 10 keyframes, and the required media queries. Updated
`index.html` to load Geist, JetBrains Mono, and Instrument Serif via Google Fonts.

Added 2 new test files that assert structural facts about the stylesheet (97 new tests).
Fixed a test infrastructure issue where `@tailwindcss/vite` was intercepting `?raw`
CSS imports — resolved by reading the file directly via Node `fs.readFileSync`.

### Files Touched

| Status   | File                                 | Lines                                              |
| -------- | ------------------------------------ | -------------------------------------------------- |
| MODIFIED | `src/index.css`                      | 1–1750 (full rewrite, +1742 lines)                 |
| MODIFIED | `index.html`                         | 14–22 (Google Fonts preconnects + stylesheet link) |
| CREATED  | `src/test/stylesheet-tokens.test.ts` | 1–353                                              |
| CREATED  | `src/test/google-fonts.test.ts`      | 1–41                                               |

### Test results

- 557 tests pass (37 test files) — 0 failures
- `npm run build` succeeds with no TypeScript or Vite errors
- CSS output: 43.87 kB / 9.29 kB gzip

### QA

All 13 acceptance criteria verified PASS in iteration 1.
