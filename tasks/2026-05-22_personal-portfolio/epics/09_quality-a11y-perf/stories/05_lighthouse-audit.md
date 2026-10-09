---
id: 09-05
title: "Lighthouse Performance & SEO Audit"
epic: 09
status: skip
size: M
blocked_by: ["09-01", "09-02", "07-03", "08-01"]
files: ["public/og-image.jpg", ".webp", "vite.config.ts", "docs/audits/lighthouse-YYYY-MM-DD.json", "src/sections/Hero.tsx"]
issue:
pr: 22
delivery: pr
prior_status:
---
# Story 09-05: Lighthouse Performance & SEO Audit

> **Epic:** Quality, Accessibility & Performance
> **Size:** M
## Description

Run Lighthouse against the production build and iterate on any optimizations
needed to reach performance ≥ 95 and accessibility ≥ 95. Verify that all SEO
checks pass (title, meta description, Open Graph and Twitter Card tags, correct
`lang` attribute), and confirm the first-load experience is under 1.5 s on
broadband. Document the final scores — a screenshot or exported JSON report is
committed to the repository as evidence of the Definition of Done.

This story runs after accessibility fixes (09-01) and responsiveness fixes
(09-02) are merged, so scores measured here reflect the final site state. It
also depends on SEO meta tags being in place (07-03) and the GitHub Pages deploy
being live (08-01) so the audit can optionally be run against the real CDN URL
as a final confirmation.

## Acceptance Criteria

- [ ] Lighthouse performance score is ≥ 95 when run on the production build via
      `npm run preview` (localhost:4173), desktop preset.
- [ ] Lighthouse accessibility score is ≥ 95 when run on the production build,
      desktop preset, in both light and dark modes.
- [ ] Lighthouse SEO audit passes all checks: document has a `<title>`, has a
      meta description, links have descriptive text, `<html>` has a valid `lang`
      attribute, page is not blocked from indexing.
- [ ] Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`,
      `og:type`) and Twitter Card tags (`twitter:card`, `twitter:title`,
      `twitter:description`, `twitter:image`) are verified present in the built
      `index.html`.
- [ ] First Contentful Paint (FCP) is ≤ 1.5 s and Largest Contentful Paint
      (LCP) is ≤ 2.5 s in the Lighthouse run.
- [ ] Cumulative Layout Shift (CLS) is ≤ 0.1 (no significant layout instability
      on load).
- [ ] Total Blocking Time (TBT) is ≤ 200 ms.
- [ ] The og-image asset (if used) is a compressed JPEG or WebP file ≤ 200 KB.
- [ ] No render-blocking resources are reported by Lighthouse that are under
      the project's control.
- [ ] The final Lighthouse report (screenshot of the scores panel or the
      exported JSON) is committed to `docs/audits/lighthouse-<date>.json` (or a
      `.png` equivalent) as permanent evidence.
- [ ] Optionally: Lighthouse is also run against the live GitHub Pages URL and
      passes the same thresholds (noted in a comment if scores differ from local).

## Technical Notes

- Always run Lighthouse on the production build, not the dev server. The dev
  server includes unminified assets, HMR scripts, and source maps that inflate
  bundle size and degrade performance scores.
  ```bash
  npm run build && npm run preview
  # Then open Chrome, navigate to http://localhost:4173
  # DevTools → Lighthouse → Desktop → Generate report
  ```
- Lighthouse must be run in an Incognito window (or with extensions disabled)
  to avoid extension interference. The axe-DevTools extension, for example, adds
  noticeable overhead.
- Common performance bottlenecks on a Vite/React static site:
  - **og-image**: a large PNG og-image (e.g., 1200 × 630 px) can be 500 KB+.
    Convert to JPEG or WebP and compress to ≤ 200 KB.
  - **Profile photo** (if present): serve as WebP, sized to display dimensions
    (e.g., 400 × 400 px max), with `width`/`height` attributes to prevent CLS.
  - **Unused CSS**: Tailwind v4 with the Vite plugin tree-shakes unused classes;
    verify the `@tailwindcss/vite` plugin is correctly configured.
  - **Font loading**: if Google Fonts or any external font is added, use
    `display=swap` and preconnect hints to prevent render blocking.
  - **Third-party scripts**: none expected in this project — confirm no analytics
    or chat widget was accidentally added.
- SEO verification checklist:
  - `<title>` — should be "Erick Andrinirina — Fullstack JavaScript Engineer"
    or equivalent.
  - `<meta name="description">` — concise, ≤ 160 chars.
  - `<meta property="og:image">` — absolute URL (requires correct
    `VITE_SITE_URL` or equivalent env var used when generating meta tags).
  - `<html lang="fr">` on first load (confirmed by 09-01).
- If the performance score is between 90 and 95, investigate the specific
  opportunities and diagnostics Lighthouse reports. The most impactful levers
  on a static site are image optimization and eliminating unused JS (verify
  code-splitting is working via `vite build --report` or rollup-plugin-visualizer).
- Export the Lighthouse report: in Chrome DevTools Lighthouse tab, click the
  download arrow (↓) next to the score to save the full JSON. Commit that JSON
  to the repo for traceability.

## Files to Create/Modify

| Action | File Path                                | Purpose                                                                      |
| ------ | ---------------------------------------- | ---------------------------------------------------------------------------- |
| MODIFY | `public/og-image.jpg` (or `.webp`)       | Compress og-image to ≤ 200 KB; convert from PNG if needed                    |
| MODIFY | `vite.config.ts`                         | Verify build config: no source maps in production, asset inlining thresholds |
| CREATE | `docs/audits/lighthouse-YYYY-MM-DD.json` | Committed Lighthouse report as Definition-of-Done evidence                   |
| MODIFY | `src/sections/Hero.tsx`                  | Add `width`/`height` to profile photo `<img>` to prevent CLS (if applicable) |

## Dependencies

- **Blocked by:** Story 09-01 (accessibility fixes — a11y score depends on them),
  Story 09-02 (responsiveness — CLS can be affected), Story 07-03 (SEO meta
  tags — SEO audit depends on them), Story 08-01 (deploy/preview URL — needed
  for optional CDN audit)
- **Blocks:** None

## Related

- **Epic:** quality-a11y-perf
- **Related stories:** 09-01 (accessibility pass), 09-02 (responsiveness pass),
  09-03 (reduced-motion — affects CLS), 09-04 (privacy — check runs before
  build is audited)
- **Spec reference:** `docs/architecture/overview.md` §Non-functional requirements
  (Performance, SEO/sharing); `docs/architecture/dev-guide.md` §Definition of
  done; `docs/specs/2026-05-22_personal-portfolio/pre-spec.md` §6 (Performance
  & availability, Discoverability)
