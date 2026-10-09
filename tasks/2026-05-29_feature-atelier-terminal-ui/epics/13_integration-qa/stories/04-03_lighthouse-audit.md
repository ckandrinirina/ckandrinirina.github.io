---
id: 13-03
title: 'Lighthouse performance & SEO audit'
epic: 13
status: done
size: M
blocked_by: ['13-02']
files: [index.html, src/*, src/components/layout/Sidebar.tsx, src/components/layout/Topbar.tsx, src/components/ui/LanguageSwitcher.tsx, src/index.css, src/test/google-fonts.test.ts, src/test/index-html.test.ts, src/test/lighthouse-css.test.ts, src/test/lighthouse-label-in-name.test.tsx, vite.config.ts]
issue:
pr:
delivery:
prior_status:
---

# Story 04-03: Lighthouse performance & SEO audit

> **Epic:** Integration & QA
> **Size:** M

## Description

Run a Lighthouse audit against the production build of the redesigned shell and confirm it
meets the feature’s non-functional targets, fixing whatever the audit surfaces. This is the
final quality gate for the Atelier Terminal feature.

Targets from the design doc: **Performance ≥ 95**, **Accessibility ≥ 95**, fonts loaded with
`display: swap`, a single external network call (Google Fonts CSS), no render-blocking JS,
the custom cursor using compositor-only `transform` updates, and an estimated JS bundle
< 220 KB gzipped with first load < 1.5 s on broadband. SEO carries over from the prior plan’s
metadata (07-03, DONE) — re-verify it still holds for the new shell (title/description, OG/
Twitter tags, `lang` attribute, single `<h1>`).

## Acceptance Criteria

- [x] Lighthouse is run against `npm run build` + `npm run preview` (production bundle), not dev.
- [x] Performance score ≥ 95 on the built site.
- [x] Accessibility score ≥ 95 on the built site.
- [x] SEO checks pass: title + meta description present, OG/Twitter tags intact, `<html lang>` set,
      exactly one `<h1>`, descriptive image `alt`s.
- [x] Fonts use `display=swap`; the Google Fonts stylesheet is the only blocking external resource;
      no render-blocking application JS.
- [x] Bundle size is checked and within target (~<220 KB JS gzipped); any obvious regressions fixed.
- [x] Issues the audit surfaces are remediated (or documented with a clear rationale if out of scope).
- [x] The audit results (scores + notable diagnostics) are recorded in the implementation summary.
- [x] `npm run build` passes and the suite is green.

## Technical Notes

- Build + preview, then run Lighthouse (CLI `lighthouse <url>` or Chrome DevTools) against the
  preview URL; mobile and desktop profiles if practical.
- Common wins if scores fall short: ensure images are sized/lazy where appropriate, confirm
  `font-display: swap`, verify no large synchronous work on first paint, and that the cursor RAF
  loop uses `transform: translate3d` (compositor-only).
- SEO is mostly inherited; the main risks from the redesign are the single-`<h1>` rule and the
  `lang` attribute toggling with locale — verify both.
- Record scores even if a target is narrowly missed, with the remediation attempted; don’t silently
  cap or hand-wave the result.
- This story is verification-led; code changes should be minimal and targeted at audit findings.

## Files to Create/Modify

| Action | File Path              | Purpose                                     |
| ------ | ---------------------- | ------------------------------------------- |
| MODIFY | `index.html` / `src/*` | Targeted perf/SEO fixes from audit findings |
| MODIFY | `vite.config.ts`       | Only if a build-level perf fix is required  |
| MODIFY | story file             | Record Lighthouse scores + diagnostics      |

## Dependencies

- **Blocked by:** 04-02 (a11y/responsive sound first). SEO metadata from prior plan 07-03 (DONE).
- **Blocks:** — (final gate)

## Related

- **Epic:** integration-qa
- **Related stories:** 04-02 (a11y feeds the Lighthouse a11y score)
- **Spec reference:** feature doc §Non-functional targets, §Accessibility, §Configuration (fonts)

## Implementation Plan

### SOLID Analysis

- **S — Single Responsibility:** this story measures + remediates; it does not add features.
- **O — Open/Closed:** perf fixes are additive (preload, sizing) and don’t alter component contracts.
- **L — Liskov:** unaffected — no interface changes expected.
- **I — Interface Segregation:** unaffected.
- **D — Dependency Inversion:** unaffected.

### Subtasks

- [x] 1. Build + preview the production bundle.
- [x] 2. Run Lighthouse (perf/a11y/SEO); record baseline scores.
- [x] 3. Remediate findings (fonts, blocking resources, bundle, SEO `<h1>`/`lang`).
- [x] 4. Re-run Lighthouse; confirm Performance ≥ 95 and Accessibility ≥ 95.
- [x] 5. Record final scores + diagnostics in the implementation summary.
- [x] 6. QA validation — map each AC, run the suite, check TypeScript.

## Implementation Summary

Lighthouse 13.5.0 (headless Chrome, `npm run build` + `vite preview`, production bundle) was
run before and after remediation. Fixes were targeted at the real findings; SEO and the
single-`<h1>` / `<html lang>` rules were already in place and left untouched.

### Lighthouse results

| Profile          | Run      | Performance | Accessibility | Best Practices | SEO |
| ---------------- | -------- | ----------- | ------------- | -------------- | --- |
| Mobile (default) | baseline | 76-83       | 91            | 100            | 100 |
| Desktop          | baseline | 90          | 91            | 100            | 100 |
| Mobile (default) | final    | **98**      | **100**       | 100            | 100 |
| Desktop          | final    | **99**      | **100**       | 100            | 100 |

Final mobile metrics: FCP 1.4 s, LCP 2.3 s, TBT 40 ms, CLS 0.004, Speed Index 1.4 s.
Final desktop metrics: FCP 0.4 s, LCP 1.0 s, TBT 0 ms, CLS 0.005. The dev machine was under
heavy load during the runs (a first baseline run reported a Speed Index of 11.8 s from
CPU starvation, so the baseline performance is a range).

### Findings and remediation

- **Render-blocking Google Fonts CSS** (est. 2 s mobile FCP/LCP cost): now loaded with
  `rel="preload" as="style"` + `onload` swap and a `<noscript>` stylesheet fallback;
  `display=swap` kept. No render-blocking application JS (module script).
- **Accessibility, color-contrast**: `.scroll-hint-inner` text `--muted` on `--surface-2`
  was 4.35:1 on Ember; now `--fg-dim`.
- **Accessibility, target-size**: theme swatches were 14px; the button is now a 24px hit area
  with the 14px dot drawn by `::before` (look unchanged apart from 4px wider swatch pitch).
- **Accessibility, label-in-name**: the brand, Quick-nav and language buttons now carry their
  visible text in their `aria-label`; a word break was added between brand name and role.
- Bundle: JS 324.8 kB raw, **99.9 kB gzip** (target < 220 kB); CSS 10.6 kB gzip. Fonts and
  the cursor (`translate3d`, compositor-only) were verified unchanged.
- SEO (100): title, description, OG/Twitter, canonical, `lang`, JSON-LD, robots, one `<h1>`
  (Home), project image `alt`s all intact.
- Not actioned (informational, out of scope): "unused JavaScript" 37 KiB (single-chunk SPA),
  the local 10 kB stylesheet (150 ms, not worth inlining), and the non-scored agentic
  `llms.txt` / `ard-schema` checks.

Full suite 835/835 green, `tsc -b`, `eslint .` and `npm run build` pass.

### Files Touched

- **MODIFIED** `index.html` - non-blocking fonts stylesheet + noscript fallback.
- **MODIFIED** `src/index.css` - swatch hit area, scroll-hint contrast.
- **MODIFIED** `src/components/layout/Sidebar.tsx`, `src/components/layout/Topbar.tsx`,
  `src/components/ui/LanguageSwitcher.tsx` - label-in-name.
- **CREATED** `src/test/lighthouse-label-in-name.test.tsx`, `src/test/lighthouse-css.test.ts`.
- **MODIFIED** `src/test/google-fonts.test.ts`, `src/test/index-html.test.ts`.
