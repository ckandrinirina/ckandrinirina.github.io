---
id: 06-01
title: "Hero section + test"
epic: 06
status: done
size: M
blocked_by: ["04-05", "04-08", "02-10"]
files: ["src/components/sections/Hero.tsx", "src/components/sections/Hero.test.tsx"]
issue:
pr:
delivery: direct
prior_status:
---
# Story 06-01: Hero section + test

> **Epic:** Content Sections
> **Size:** M
## Description

Implement `src/components/sections/Hero.tsx`, the first and most prominent section of the
portfolio. Hero owns the page's single `<h1>` element (the owner's name). It renders the
professional title, a one-line positioning statement (7 years of experience), the city and
country only (Antananarivo, Madagascar), two primary calls to action — a "View projects"
button that smooth-scrolls to `#projects` and a `DownloadCvButton` — and `SocialLinks`
(GitHub + LinkedIn). Hero does not use the shared `Section` wrapper for its heading
because it must emit `<h1>` rather than `<h2>`; it renders its own outer
`<section id="hero">` directly. A co-located `Hero.test.tsx` asserts the critical
accessibility invariants.

## Acceptance Criteria

- [x] The rendered output contains exactly one `<h1>` with the text "Erick Andrinirina".
- [x] The `<h1>` does not change on locale switch (name is the same in both languages).
- [x] The professional title "Fullstack JavaScript Engineer" is visible (rendered in the active locale's translation).
- [x] The one-line positioning statement (7 years of experience) is rendered from `content.hero`.
- [x] The location "Antananarivo, Madagascar" is rendered — city and country only; no street or postal address appears anywhere in the component.
- [x] A "View projects" CTA (link or button) is present; clicking/activating it smooth-scrolls the page to `#projects`.
- [x] `DownloadCvButton` renders and its `href` resolves to the CV PDF using `import.meta.env.BASE_URL + 'cv/erick-andrinirina-cv.pdf'`.
- [x] `SocialLinks` renders with GitHub and LinkedIn icon links.
- [x] The outer element is `<section id="hero">`.
- [x] The component re-renders with French/English content when locale changes (title and positioning line update).
- [x] `Hero.test.tsx` — test asserts: (a) renders an `<h1>` containing "Erick Andrinirina"; (b) a link with the CV download href is present in the DOM.
- [x] `npm run test` passes for `Hero.test.tsx` with no skipped assertions.
- [x] No TypeScript errors on `npm run build`.

## Technical Notes

- Hero must own the `<h1>` directly — do not wrap with `Section` (which emits `<h2>`). A pattern: `<section id="hero"><div className="..."><h1>{content.hero.name}</h1>...</div></section>`.
- "View projects" smooth-scroll: `document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })` inside an `onClick` handler; guard with `window.matchMedia('(prefers-reduced-motion: reduce)').matches` and fall back to instant scroll.
- `DownloadCvButton` is an existing UI component from Epic 04 (story 04-08); import and reuse it — do not re-implement the download logic.
- `SocialLinks` is from Epic 02 (story 02-10); pass the optional `size` prop if the hero layout requires a larger icon size.
- The CV href pattern: `import.meta.env.BASE_URL + 'cv/erick-andrinirina-cv.pdf'` (note: `BASE_URL` ends with `/` in Vite when set to `'/'`; use `BASE_URL.replace(/\/$/, '') + '/cv/...'` or rely on the `DownloadCvButton` component to handle this internally).
- In `Hero.test.tsx`, wrap the component with `LanguageProvider` (or the project's test helper) to satisfy the `useLanguage()` context dependency.
- Use `@testing-library/react`'s `getByRole('heading', { level: 1 })` to assert the single `<h1>`.
- Use `getByRole('link', { name: /cv/i })` or a `data-testid` to locate the download link and check its `href`.

## Files to Create/Modify

| Action | File Path                               | Purpose                                           |
| ------ | --------------------------------------- | ------------------------------------------------- |
| CREATE | `src/components/sections/Hero.tsx`      | Hero section component with h1, positioning, CTAs |
| CREATE | `src/components/sections/Hero.test.tsx` | Unit tests for Hero rendering and download link   |

## Dependencies

- **Blocked by:** 04-05 (LanguageProvider — `useLanguage()` must exist), 04-08 (DownloadCvButton), 02-10 (SocialLinks).
- **Blocks:** 06-09 (wire sections into App).

## Related

- **Epic:** content-sections
- **Related stories:** 06-08 (Contact — also uses SocialLinks), 06-09 (App wiring)
- **Spec reference:** spec §5.1 (Hero / introduction), §4 (CV download, social links), §7 (location privacy)

## Implementation Plan

- [x] Write failing tests in `Hero.test.tsx` (RED)
  - Test: renders `<h1>` with "Erick Andrinirina"
  - Test: h1 text does not change on locale switch
  - Test: professional title is visible (FR and EN)
  - Test: positioning statement is rendered
  - Test: location "Antananarivo, Madagascar" is rendered
  - Test: "View projects" CTA is present
  - Test: DownloadCvButton renders with CV href
  - Test: SocialLinks renders with GitHub and LinkedIn links
  - Test: outer element is `<section id="hero">`
  - Test: component re-renders with locale change
- [x] Implement `Hero.tsx` (GREEN) — `<section id="hero">` with h1, title, positioning, location, CTAs, SocialLinks
- [x] Refactor and SOLID check
- [x] QA validation
- [x] Mark all tasks completed

## Implementation Summary

### Files Touched

| Action  | File                                    | Lines    |
| ------- | --------------------------------------- | -------- |
| CREATED | `src/components/sections/Hero.tsx`      | new file |
| CREATED | `src/components/sections/Hero.test.tsx` | new file |

### What Was Implemented

`Hero.tsx` is the portfolio's above-the-fold section. It renders:

- A single `<h1>` with the owner's name ("Erick Andrinirina") — locale-invariant
- Professional title from `content.hero.title` (locale-aware)
- Positioning statement from `content.hero.positioning`
- Location from `content.hero.location` with a `data-testid="hero-location"` marker
- A "View projects" `<button>` that calls `scrollToSection('projects')` with `prefers-reduced-motion` guard
- `DownloadCvButton` for CV download
- `SocialLinks` with `size="lg"`

`Hero.test.tsx` covers 12 assertions including: h1 presence, name invariance, CV href, smooth-scroll, outer section id, location text, and no-street-address guard.

All 341 tests pass. No TypeScript errors on build. ESLint clean.

---

## Bug Report — BUG-20260602-01

> **Status:** FIXED
> **Reported:** 2026-06-02
> **Scope:** Multi-story (verdict B) — also recorded in story 02-07.

### Symptom

Several home (`accueil`) entrance animations were missing or degraded versus the
source-of-truth reference (`docs/portfolion-ui/app.jsx`):

1. The tech **marquee** popped in instantly instead of fading in like every other
   home element.
2. The hero **name** faded in as a single block — the letter-by-letter `charIn`
   cascade was washed out.
3. The role rotor ("aussi —" / "also a —") live region was on the wrong element.

### Reproduction (failing tests, RED)

- `Marquee.test.tsx` — "applies reveal + r-fade so the marquee fades in on
  scroll-reveal" → FAILED (wrapper had only `marquee`).
- `Reveal.test.tsx` — "does NOT gate the container behind the .reveal scroll
  class" → FAILED (wrapper carried `reveal`).
- `HomeView.test.tsx` — "places aria-live=\"polite\" on the .home-rotor" → FAILED.

### Root cause

- **Marquee** (`src/components/ui/Marquee.tsx:40`): wrapper omitted the
  `reveal r-fade` classes, so `useScrollReveal` never faded it in. Reference
  `app.jsx:645` uses `marquee reveal r-fade`.
- **Reveal** (`src/components/ui/Reveal.tsx:43`): the container carried the
  `.reveal` class, which sets `opacity:0` + a translate/scale transform gated
  behind `useScrollReveal` adding `.in`. Layered over the per-character `charIn`
  animation, the parent's opacity/transform gate ran concurrently and washed out
  the letter cascade. Reference `app.jsx:570-571` gives the wrapper only an
  optional `italic` class — letters animate autonomously via `charIn`.
- **RoleRotor** (`src/views/HomeView.tsx`): `aria-live`/`aria-atomic` sat on the
  outer `.home-roles` div rather than the inner `.home-rotor` that actually swaps
  text (reference `app.jsx:581`).

### Fix Plan (FIXING → FIXED)

Minimal class/attribute placement changes only — no logic or refactor:

- Add `reveal r-fade` to the Marquee wrapper.
- Drop `reveal` from the Reveal container's class string.
- Move `aria-live`/`aria-atomic` from `.home-roles` to `.home-rotor`.

### Resolution

- **SOLID Verification (bounded to the diff):** S PASS · O PASS · L PASS ·
  I PASS · D PASS — changes are pure className/attribute placement; no
  responsibility, interface, or dependency boundaries touched.
- Full suite: **748 passed**. Build: clean. ESLint: clean.

### Files Touched

- MODIFIED `src/components/ui/Marquee.tsx:40`
- MODIFIED `src/components/ui/Reveal.tsx:14-17,45`
- MODIFIED `src/views/HomeView.tsx:192-194`
- MODIFIED `src/components/ui/Marquee.test.tsx` (regression test)
- MODIFIED `src/components/ui/Reveal.test.tsx` (regression test; replaced the
  assertion that encoded the bug)
- MODIFIED `src/views/HomeView.test.tsx` (regression test)
- MODIFIED `src/test/accessibility.test.tsx` (selector follows the moved live region)

**Unplanned changes:** `src/test/accessibility.test.tsx` — updated the role-rotor
live-region selector from `.home-roles` to `.home-rotor` — the moved `aria-live`
attribute required the assertion to follow it (intent unchanged).

## Manual-Test Reports

### 2026-06-02 — "STILL BROKEN: everything static, no motion at all" → RESOLVED (environment, not code)

- **Residual symptom:** user reported every home animation missing — hero
  cascade, role rotor, marquee, and all entrance reveals — with zero motion.
- **Root cause:** the host macOS had **Reduce Motion enabled**
  (`defaults read com.apple.universalaccess reduceMotion` → `1`). This sets
  `prefers-reduced-motion: reduce`, which the site honors by design via the CSS
  `@media (prefers-reduced-motion: reduce)` block (`index.css:2403`) and the JS
  `prefersReducedMotion()` guards in `Reveal` / `RoleRotor` / `CountUp`. All
  motion is intentionally disabled — matching the reference and WCAG 2.3.3.
- **Verdict:** NOT a code defect. The session's three fidelity fixes remain valid
  and are exercised by the motion-enabled unit tests. Animations are visible once
  Reduce Motion is turned off (System Settings → Accessibility → Display).
- **No code change** made for this report.

### 2026-06-02 — Marquee scroll speed (owner preference)

- After disabling Reduce Motion the user confirmed all home animations work, but
  found the bottom tech marquee too slow.
- Both our `.marquee-track` and the reference ran at `animation: marquee 400s`
  (a glacial drift). Per owner preference, sped up to **40s** (~10× faster).
- **Deliberate deviation from the reference's 400s** — documented inline at
  `src/index.css`. Build clean.
- MODIFIED `src/index.css` (`.marquee-track` animation duration 400s → 40s).
