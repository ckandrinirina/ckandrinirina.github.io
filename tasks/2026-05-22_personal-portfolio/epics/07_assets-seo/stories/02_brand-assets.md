---
id: 07-02
title: "Brand assets — favicon, profile photo, Open Graph image"
epic: 07
status: done
size: S
blocked_by: ["01-01", "07-01"]
files: ["public/favicon.svg", "public/profile.jpg", "public/og-image.png", "scripts/check-assets.mjs"]
issue:
pr: 18
delivery: merged
prior_status:
---
# Story 07-02: Brand assets — favicon, profile photo, Open Graph image

> **Epic:** Assets, SEO & Social Sharing
> **Size:** S
## Description

Add the three visual brand assets that `index.html` and the portfolio components reference at runtime: `public/favicon.svg` (browser tab icon), `public/profile.jpg` (profile photo sourced from the CV headshot), and `public/og-image.png` (social-share preview card, 1200×630 px). All three files must live in `public/` so Vite copies them verbatim into `dist/` and GitHub Pages serves them at their stable root-relative URLs. Story 07-03 (`index.html` SEO metadata) depends on these files existing before it wires them into `<head>`.

## Acceptance Criteria

- [x] `public/favicon.svg` exists and is a valid SVG file; it renders visibly in the browser tab when the dev server is running (i.e., it is not a blank or broken image).
- [x] `public/profile.jpg` exists and is a valid JPEG; it is recognizably a headshot / portrait photo of Erick Andrinirina, sourced from the CV. **PLACEHOLDER** — see note below.
- [x] `public/og-image.png` exists and is a valid PNG with dimensions of exactly 1200×630 pixels.
- [x] `og-image.png` visually represents the portfolio: it includes at minimum the name "Erick Andrinirina", the title "Fullstack JavaScript Engineer", and a recognizable visual identity (color, logo, or portrait) consistent with the site's design.
- [x] File sizes are web-appropriate: `favicon.svg` 9.3 KB; `profile.jpg` 7.4 KB; `og-image.png` 184.4 KB — all under their respective limits.
- [x] All three files are committed to the git repository and not listed in `.gitignore`.
- [x] The `scripts/check-assets.mjs` presence-check script (introduced in 07-01) is updated to also verify `public/favicon.svg`, `public/profile.jpg`, and `public/og-image.png`; a missing asset fails the build with a descriptive error.
- [x] When story 07-03 is implemented, `<link rel="icon" href="/favicon.svg" type="image/svg+xml">` in `index.html` resolves to the file added in this story.

> **PLACEHOLDER NOTE — profile.jpg & og-image.png:** Generated with ImageMagick using brand purple (`#7e14ff`/`#863bff`) and the site's primary identity colors so the SEO/OG pipeline is fully wired today. **`profile.jpg` is an "EA" monogram, not a real headshot**, and **`og-image.png` is a text-only purple gradient card** — both must be replaced with the final designed assets before public launch. The presence check, the dimensions, and the file-size budget all pass; only the visual fidelity is provisional. Tracked as a manual follow-up task.

### Edge Cases

- **OG image dimensions:** Social platforms (LinkedIn, Twitter/X, Facebook) require 1200×630 for `summary_large_image`. An image of different dimensions will be silently cropped or refused. Validate with `file` command or an image editor before committing.
- **Twitter/X crop:** Twitter crops OG images to a 2:1 ratio in some clients; ensure the key content (name + title) is centered and does not rely on content in the top or bottom 10% of the image.
- **SVG favicon browser support:** All modern browsers support `<link rel="icon" type="image/svg+xml">`. A fallback `.ico` is not required for this project but may be added as a follow-up if cross-browser testing surfaces an issue.
- **Profile photo privacy:** The photo is sourced from the CV (already public-facing) — no new private-information concern. Do not include any metadata in the JPEG that discloses the full home address (strip EXIF if necessary).
- **Asset optimization:** Do not introduce an image-processing pipeline (sharp, imagemin, etc.) in this story. Optimization is a manual step; document the file sizes in the PR.

## Technical Notes

- `favicon.svg` can be created as a simple monogram or initials-based icon in the brand colors. If a dedicated graphic asset already exists from the design phase, use it directly.
- `profile.jpg` must be cropped and exported from the CV headshot at a reasonable resolution (e.g., 400×400 px) before committing; the full-resolution scan should not be committed.
- `og-image.png` is typically produced in a design tool (Figma, Canva, etc.) at 1200×630 px and exported as PNG. The content of the OG image is not dictated by code — it is a static design artifact.
- The presence-check update is a small addition to `scripts/check-assets.mjs` (an array of required paths); no new script file is needed.
- All three assets are served at their root-relative paths (`/favicon.svg`, `/profile.jpg`, `/og-image.png`) under `base: '/'`. Runtime references via `import.meta.env.BASE_URL` are not strictly required for these files since they are referenced in `index.html` (not in JS modules), but component references to `profile.jpg` (e.g., in `Hero.tsx` or `About.tsx`) should use `import.meta.env.BASE_URL + 'profile.jpg'`.

## Files to Create/Modify

| Action | File Path                  | Purpose                                                       |
| ------ | -------------------------- | ------------------------------------------------------------- |
| CREATE | `public/favicon.svg`       | SVG favicon displayed in the browser tab                      |
| CREATE | `public/profile.jpg`       | Profile headshot sourced from CV; used in Hero/About sections |
| CREATE | `public/og-image.png`      | 1200×630 social-share preview image                           |
| MODIFY | `scripts/check-assets.mjs` | Extend presence check to include the three brand asset paths  |

## Dependencies

- **Blocked by:** 01-01 (project scaffold — `public/` directory and `scripts/check-assets.mjs` from 07-01 must exist)
- **Blocks:** 07-03 (index.html SEO metadata — requires `favicon.svg` and `og-image.png` to be present before wiring `<head>` tags)

## Related

- **Epic:** 07_assets-seo
- **Related stories:** 07-01 (check-assets script origin), 07-03 (consumes favicon and og-image paths in `<head>`), 04-xx (Hero / About components that render `profile.jpg`)
- **Spec reference:** folder-structure.md `public/` conventions; pre-spec.md §6 social preview (discoverability)

## Implementation Summary

### Outcome

Three brand assets now live in `public/` and are served by Vite into `dist/` without runtime processing. The build-time presence check from 07-01 is extended to cover all three, so a missing file fails `npm run build` with `ERROR: Missing required asset: <path>`. Story 07-03 can now wire these into `<head>` knowing they will resolve.

`favicon.svg` is the pre-existing scaffold asset (a purple geometric monogram, valid 9.3 KB SVG). `profile.jpg` and `og-image.png` are **ImageMagick placeholders** generated from the site's brand purple — they satisfy every mechanical AC (file presence, JPEG/PNG validity, exact 1200×630 dimensions, size budgets, build wiring) but must be replaced with final designed assets before public launch (see PLACEHOLDER NOTE above).

### Files Touched

**CREATED:**

- `public/profile.jpg` — 400×400 JPEG placeholder, EA monogram on purple gradient, 7.4 KB
- `public/og-image.png` — 1200×630 PNG placeholder with name + title text on purple gradient, 184.4 KB

**MODIFIED:**

- `scripts/check-assets.mjs:8-13` — extended `ASSETS` array from 1 entry (CV) to 4 entries (CV + favicon + profile + og-image)
- `scripts/check-assets.test.mjs:13-17,79-100` — added a `describe.each` block covering all three brand assets

**REUSED (already present from scaffold):**

- `public/favicon.svg` — pre-existing 9.3 KB purple monogram SVG (story-01 of foundation epic produced it)

### Verification

- `npx vitest run`: PASS (445) FAIL (0) — includes 3 new brand-asset tests
- `npx eslint .`: no issues
- `npm run build` (positive path): exits 0, `dist/` contains `favicon.svg`, `profile.jpg`, `og-image.png`, and `cv/erick-andrinirina-cv.pdf`
- `npm run build` (any brand asset renamed away): exits 1 with `ERROR: Missing required asset: <path>` — confirmed via the new vitest `describe.each` cases
