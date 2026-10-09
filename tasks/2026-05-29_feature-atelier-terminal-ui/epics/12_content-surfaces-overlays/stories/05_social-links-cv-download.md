---
id: 12-05
title: "GitHub, LinkedIn and Download CV on the Page"
epic: 12
status: done
size: S
blocked_by: []
files: [src/content/en.ts, src/content/fr.ts, src/lib/constants.test.ts, src/lib/constants.ts, src/views/ContactView.test.tsx, src/views/ContactView.tsx, src/views/HomeView.test.tsx, src/views/HomeView.tsx]
issue:
pr: 17
delivery: pr
prior_status:
---

# Story 12-05: GitHub, LinkedIn and Download CV on the Page

> **Epic:** Content Surfaces & Overlays
> **Size:** S

## Description

Visitors can reach Erick's GitHub and LinkedIn profiles and download the new CV directly from the page. Today the social links are empty placeholders and the CV is only reachable through the ⌘K command palette.

## Acceptance Criteria

- [x] `SOCIAL_LINKS.github` is `https://github.com/ckandrinirina` and `SOCIAL_LINKS.linkedin` is `https://www.linkedin.com/in/andrinirina-erick-2aa6b0184/`; the Contact card shows a GitHub row and a LinkedIn row linking to them, opening in a new tab with `rel="noopener noreferrer"`, in both FR and EN.
- [x] The Home hero (next to the existing call-to-action buttons) and the Contact view each show a "Télécharger le CV" / "Download CV" button whose link ends with `cv/erick-andrinirina-cv.pdf` and carries the `download` attribute.
- [x] Human check: `npm run dev` — Home shows the CV button beside the existing buttons; Contact shows GitHub and LinkedIn; clicking the CV button downloads the PDF; switching language relabels the button.

### Edge Cases

- The links must respect the deploy base path (`import.meta.env.BASE_URL`), as `DownloadCvButton` already does.
- FR/EN parity tests require any new `contact.meta` rows to exist in both locales with the same count.

## Implementation Tasks

1. Write failing tests: `constants.test.ts` (both URLs), `ContactView.test.tsx` (GitHub/LinkedIn rows with href, target and rel; CV button href + `download`), `HomeView.test.tsx` (CV button in the hero, FR and EN labels).
2. Fill `SOCIAL_LINKS` with the real URLs and drop the TODO comments.
3. Add GitHub and LinkedIn rows to `contact.meta` in `fr.ts` and `en.ts` (`href` set, external-link attributes applied by the view).
4. Render the existing `DownloadCvButton` in the Home hero CTA row and in the Contact view, styled like the neighbouring buttons.

## Technical Notes

- Reuse first: `ContactMetaRow` already supports `href`, and `DownloadCvButton` already builds the base-path-aware PDF link and the i18n label — no new component.
- The same two URLs feed the JSON-LD `sameAs` in story 07-04; keep them identical.

## Related

- **Epic:** 12_content-surfaces-overlays
- **Related stories:** 07-04 (SEO uses the same profile URLs), 07-01 (CV asset)

## Implementation Summary

- `SOCIAL_LINKS` now holds the real GitHub and LinkedIn URLs; `fr.ts` and `en.ts` add GitHub and LinkedIn rows to `contact.meta` reading from it, so the URLs stay single-sourced (feeds 07-04 `sameAs`).
- `ContactView` renders `DownloadCvButton` in the contact card; `HomeView` renders it in the hero `.home-actions` row beside the two CTAs. External-link attributes come from the existing `ContactRow`.
- Tests: constants URLs, Contact rows (href, target, rel, FR/EN), CV link on Home and Contact (href suffix, `download`, FR/EN label); the Home CTA-count test now expects two buttons plus the CV link.
- Full suite 767/767, `tsc -b` and eslint clean on touched files. The human check (criterion 3) is left to the orchestrator's manual gate.
