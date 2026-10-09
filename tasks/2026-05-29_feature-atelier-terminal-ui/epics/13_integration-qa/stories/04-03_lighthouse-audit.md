---
id: 13-03
title: "Lighthouse performance & SEO audit"
epic: 13
status: in-progress
size: M
blocked_by: ["13-02"]
files: ["index.html", "src/*", "vite.config.ts"]
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

- [ ] Lighthouse is run against `npm run build` + `npm run preview` (production bundle), not dev.
- [ ] Performance score ≥ 95 on the built site.
- [ ] Accessibility score ≥ 95 on the built site.
- [ ] SEO checks pass: title + meta description present, OG/Twitter tags intact, `<html lang>` set,
      exactly one `<h1>`, descriptive image `alt`s.
- [ ] Fonts use `display=swap`; the Google Fonts stylesheet is the only blocking external resource;
      no render-blocking application JS.
- [ ] Bundle size is checked and within target (~<220 KB JS gzipped); any obvious regressions fixed.
- [ ] Issues the audit surfaces are remediated (or documented with a clear rationale if out of scope).
- [ ] The audit results (scores + notable diagnostics) are recorded in the implementation summary.
- [ ] `npm run build` passes and the suite is green.

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

- [ ] 1. Build + preview the production bundle.
- [ ] 2. Run Lighthouse (perf/a11y/SEO); record baseline scores.
- [ ] 3. Remediate findings (fonts, blocking resources, bundle, SEO `<h1>`/`lang`).
- [ ] 4. Re-run Lighthouse; confirm Performance ≥ 95 and Accessibility ≥ 95.
- [ ] 5. Record final scores + diagnostics in the implementation summary.
- [ ] 6. QA validation — map each AC, run the suite, check TypeScript.
