---
id: 07-01
title: "CV PDF asset + build presence check"
epic: 07
status: done
size: S
blocked_by: ["01-01"]
files: ["public/cv/erick-andrinirina-cv.pdf", "scripts/check-assets.mjs", "package.json"]
issue:
pr:
delivery:
prior_status:
---
# Story 07-01: CV PDF asset + build presence check

> **Epic:** Assets, SEO & Social Sharing
> **Size:** S
## Description

Place the downloadable CV at `public/cv/erick-andrinirina-cv.pdf` by copying and renaming the existing French CV from `docs/CV_ANDRINIRINA_ERICK_FULLSTACK.pdf`. Add a lightweight build-time presence check (a prebuild npm script) so that a missing PDF causes the build to fail with a descriptive error rather than silently shipping a 404 download link. The `DownloadCvButton` component (story 04-08) references this asset via `import.meta.env.BASE_URL + 'cv/erick-andrinirina-cv.pdf'`, so the path must be stable.

## Acceptance Criteria

- [x] `public/cv/erick-andrinirina-cv.pdf` is present in the repository and is binary-identical to `docs/CV_ANDRINIRINA_ERICK_FULLSTACK.pdf` (the French CV).
- [x] A `prebuild` npm script is defined in `package.json` that runs before `npm run build`.
- [x] When `public/cv/erick-andrinirina-cv.pdf` is present the prebuild script exits with code 0 and `npm run build` completes normally.
- [x] When `public/cv/erick-andrinirina-cv.pdf` is absent the prebuild script exits with a non-zero code and prints a human-readable error message indicating which file is missing (e.g., `"ERROR: Missing required asset: public/cv/erick-andrinirina-cv.pdf"`); `npm run build` therefore fails.
- [x] The check script requires no npm packages beyond the Node.js standard library (`fs`, `path`, `process`).
- [x] Clicking the CV download button in a browser (with the dev server running) triggers a browser download of the PDF and the downloaded file opens as a valid, readable PDF.
- [x] The `href` in `DownloadCvButton` is constructed as `import.meta.env.BASE_URL + 'cv/erick-andrinirina-cv.pdf'` (not a hardcoded absolute path) so it resolves correctly under both `base: '/'` and a project-page sub-path.

### Edge Cases

- **English CV out of scope:** The French PDF is served for both `fr` and `en` locales. The `DownloadCvButton` must not conditionally switch the path based on locale (a locale-based switch would yield a 404 for `en`). Document this limitation with a `// TODO: add EN CV when available` comment.
- **CI environment:** The presence check must pass in the GitHub Actions build environment where `docs/` is checked in but `public/cv/` only exists if the file was committed. Ensure `public/cv/erick-andrinirina-cv.pdf` is tracked by git (not gitignored).
- **Binary file size:** The PDF should not exceed a reasonable size for a resume (guidance: under 2 MB). If the source file is larger, note it as a manual optimization task; do not automate compression in this story.
- **`public/cv/` directory:** The `cv/` subdirectory inside `public/` must be created (Vite copies the entire `public/` tree into `dist/`); ensure the directory itself is committed (e.g., add a `.gitkeep` only if the PDF is not present at story-write time, which it will be).

## Technical Notes

- Copy the file: `cp docs/CV_ANDRINIRINA_ERICK_FULLSTACK.pdf public/cv/erick-andrinirina-cv.pdf` — this is a one-time manual step; the file is then committed to the repo under `public/cv/`.
- The presence check can be a small ESM script at `scripts/check-assets.mjs` using `fs.existsSync`. Invoke it from `package.json` as `"prebuild": "node scripts/check-assets.mjs"`.
- The `prebuild` lifecycle hook is automatically executed by npm before `build`; no changes to the CI workflow (`deploy.yml`) are needed because CI already runs `npm run build`.
- If additional assets need a presence check in later stories (07-02), they can be appended to the same `scripts/check-assets.mjs` file rather than creating separate scripts.

## Files to Create/Modify

| Action | File Path                            | Purpose                                                                                                      |
| ------ | ------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| CREATE | `public/cv/erick-andrinirina-cv.pdf` | Downloadable French CV (copied from `docs/CV_ANDRINIRINA_ERICK_FULLSTACK.pdf`)                               |
| CREATE | `scripts/check-assets.mjs`           | Node.js presence-check script; exits non-zero with a descriptive error if required public assets are missing |
| MODIFY | `package.json`                       | Add `"prebuild": "node scripts/check-assets.mjs"` to the `scripts` block                                     |

## Dependencies

- **Blocked by:** 01-01 (project scaffold — `package.json` and `public/` directory must exist)
- **Blocks:** None (supports Epic 09 Lighthouse audit indirectly via a working download link)

## Related

- **Epic:** 07_assets-seo
- **Related stories:** 04-08 (DownloadCvButton component consumes this asset), 07-02 (brand assets — the same check script can be extended), 09-xx (Lighthouse audit)
- **Spec reference:** data-flow.md §7 CV download + failure modes (missing CV PDF); pre-spec.md §6 CV download

## Implementation Plan

### SOLID Analysis

- **S — Single Responsibility:** `scripts/check-assets.mjs` only verifies presence of required public assets and reports the first missing one. No copying, no build orchestration.
- **O — Open/Closed:** required-asset paths live in a top-level `ASSETS` constant. Story 07-02 will append entries to this array without altering the verification logic.
- **L — Liskov:** N/A (procedural ESM script).
- **I — Interface segregation:** depends only on Node stdlib (`fs`, `path`, `process`, `url`) — no external surface.
- **D — Dependency Inversion:** delegates existence-check to `fs.existsSync`; resolves paths from `import.meta.url` so the script is location-independent.

### Subtasks

- [x] Phase 4 — write failing tests for `check-assets.mjs` (pass / fail / error message)
- [x] Phase 5 — implement script, copy CV to `public/cv/`, add `prebuild` to `package.json`
- [x] Phase 6 — SOLID refactor + final green check
- [x] Phase 7 — QA: vitest, eslint, positive & negative build paths, AC citations

## Unplanned Changes

- `eslint.config.js` — added `scripts/**/*.{js,mjs}` override that declares Node globals (`globals.node`) — required so `console`/`process` in the new ESM Node script don't trigger `no-undef`; ESLint flat config previously only declared browser/test globals for `src/`.
- `scripts/check-assets.test.mjs` — added a co-located vitest spec for the new script (Phase 4 RED → GREEN); not pre-declared in "Files to Create/Modify" because the story listed only the script and its production wiring.

## Implementation Summary

### Outcome

The portfolio's downloadable CV is now committed at `public/cv/erick-andrinirina-cv.pdf` (binary-identical to `docs/CV_ANDRINIRINA_ERICK_FULLSTACK.pdf`), and `npm run build` is now guarded by a `prebuild` step that fails fast with a descriptive error if the file is missing. The check is a tiny stdlib-only Node ESM script with an extensible `ASSETS` array — story 07-02 will append the brand asset paths without changing the check logic.

### Files Touched

**CREATED:**

- `public/cv/erick-andrinirina-cv.pdf`
- `scripts/check-assets.mjs`
- `scripts/check-assets.test.mjs`

**MODIFIED:**

- `package.json:8` — added `"prebuild": "node scripts/check-assets.mjs"`
- `eslint.config.js:5,25-28` — imported `globals` and added a `scripts/**/*.{js,mjs}` flat-config block declaring Node globals

### Verification

- `npx vitest run`: PASS (442) FAIL (0) — includes 3 new tests for the check script
- `npx eslint .`: no issues
- `npx tsc -b`: no errors
- `npm run build` (positive path): exits 0, produces `dist/cv/erick-andrinirina-cv.pdf`
- `npm run build` (CV temporarily renamed): exits 1, stderr `ERROR: Missing required asset: public/cv/erick-andrinirina-cv.pdf`
