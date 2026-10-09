---
id: 01-05
title: "Finalize Vite base path & npm scripts"
epic: 01
status: done
size: S
blocked_by: ["01-01"]
files: ["vite.config.ts", "package.json"]
issue:
pr:
delivery:
prior_status:
---
# Story 01-05: Finalize Vite base path & npm scripts

> **Epic:** Project Foundation & Tooling
> **Size:** S
## Description

Set `base: '/'` in `vite.config.ts` to target the GitHub user-page deployment at `ckandrinirina.github.io`, and add an inline comment documenting the project-page alternative (`'/<repo-name>/'`). Ensure all five canonical npm scripts are present in `package.json` with the exact commands specified in `dev-guide.md`: `dev`, `build` (as `tsc -b && vite build`), `preview`, `test`, `lint`, and `format`. Verify the production build emits correct asset URLs and that `npm run preview` serves it without errors.

## Acceptance Criteria

- [x] `vite.config.ts` contains `base: '/'` inside the `defineConfig({...})` call.
- [x] `vite.config.ts` includes an inline comment near the `base` setting explaining: user page (`ckandrinirina.github.io`) uses `'/'`; project page (e.g. `/ck-portfolio/`) uses `'/<repo-name>/'`.
- [x] `package.json` `scripts.build` is exactly `"tsc -b && vite build"`.
- [x] `package.json` `scripts.dev` is exactly `"vite"`.
- [x] `package.json` `scripts.preview` is exactly `"vite preview"`.
- [x] `package.json` `scripts.test` is `"vitest"` (may already be set by story 01-04).
- [x] `package.json` `scripts.lint` is `"eslint ."` (may already be set by story 01-03).
- [x] `package.json` `scripts.format` is `"prettier --write ."` (may already be set by story 01-03).
- [x] `npm run build` completes without errors and emits a `dist/` directory.
- [x] All static asset URLs in the generated `dist/index.html` and manifest are rooted at `/` (e.g. `/assets/main-[hash].js`, not `assets/main-[hash].js` without the leading slash and not `/ck-portfolio/assets/...`).
- [x] `npm run preview` starts a local server and the built app loads without 404s for any asset (verified by opening the preview URL in a browser or `curl`-ing the HTML and confirming asset `src`/`href` values).
- [x] `import.meta.env.BASE_URL` evaluates to `'/'` at runtime in the preview build (can be verified by a temporary `console.log(import.meta.env.BASE_URL)` in `src/main.tsx` — remove before committing).

### Edge Cases

- If `base` is missing from `vite.config.ts`, Vite defaults to `'/'` but this is implicit and undocumented; the setting must be explicit so future maintainers can safely change it.
- Changing `base` from `'/'` to a repo path (for a project-page migration) must update asset references in `public/` that use absolute paths (e.g. OG image, CV PDF) — the comment should hint at this concern.
- `tsc -b` (project references build) is used rather than plain `tsc` because the scaffold generates a `tsconfig.node.json` reference; running `tsc` without `-b` may miss config file validation errors.
- If `npm run build` fails at the `tsc -b` step with type errors in `vite.config.ts` (e.g. from the Vitest `test` block added in 01-04), ensure `tsconfig.node.json` includes the correct `include` paths and that `vitest` types are available.

## Technical Notes

- The complete `vite.config.ts` shape at the end of this epic (combining 01-01, 01-02, and 01-05):

  ```ts
  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'
  import tailwindcss from '@tailwindcss/vite'

  export default defineConfig({
    // User page (ckandrinirina.github.io) → '/'.
    // Project repo (e.g. /ck-portfolio/) → '/ck-portfolio/'.
    base: '/',
    plugins: [react(), tailwindcss()],
  })
  ```

- If Vitest config is defined in `vite.config.ts` (see story 01-04), the `test` block is added here as well; the `base` setting does not affect Vitest runs.
- Downstream stories (e.g. the `DownloadCvButton` in epic 04) must reference the CV PDF as `` `${import.meta.env.BASE_URL}cv/erick-andrinirina-cv.pdf` `` to correctly resolve under any base path. This story sets the contract; later stories consume it.
- `npm run build` runs `tsc -b` (type-check all references) then `vite build` (bundle). This ensures type errors are caught before the bundler runs. The two commands are chained with `&&` so a type error aborts the build.

## Files to Create/Modify

| Action | File Path        | Purpose                                                    |
| ------ | ---------------- | ---------------------------------------------------------- |
| MODIFY | `vite.config.ts` | Add explicit `base: '/'` with deployment comment           |
| MODIFY | `package.json`   | Ensure all 6 canonical scripts are set with exact commands |

## Dependencies

- **Blocked by:** 01-01
- **Blocks:** 08-01

## Implementation Summary

**Status:** All acceptance criteria verified as PASS.

**Files Modified:**
- `vite.config.ts` — Added `base: '/'` with deployment documentation comment (lines 6-8)
- `package.json` — Added `test`, `lint`, `format` scripts; verified all 6 canonical scripts are correct (lines 10-12)

**QA Validation:**
- ✓ `npm run build` completes successfully; emits dist/ with correct asset URLs
- ✓ All static assets rooted at `/` (verified in dist/index.html)
- ✓ `npm run preview` server starts without errors
- ✓ `import.meta.env.BASE_URL` evaluates to `'/'` at runtime

**Impact:**
- The user-page deployment target (`ckandrinirina.github.io`) is now explicitly configured with correct asset paths.
- All npm scripts are in place and ready for downstream epics.
- Type checking (`tsc -b`) is enforced before bundling to catch config-level errors early.

## Implementation Plan

### Subtasks

1. [x] Add `base: '/'` to vite.config.ts with clarifying comment
2. [x] Verify all 6 npm scripts in package.json (dev, build, preview, test, lint, format)
3. [x] Run `npm run build` and confirm no errors and dist/ created
4. [x] Verify asset URLs in generated dist/index.html are rooted at `/`
5. [x] Run `npm run preview` and confirm server starts without errors
6. [x] Verify `import.meta.env.BASE_URL` evaluates to `/`
7. [x] Complete QA validation
8. [x] Update story status to DONE

## Related

- **Epic:** 01_foundation-tooling
- **Related stories:** 01-01, 01-02, 01-04
- **Spec reference:** configuration.md §vite.config, configuration.md (Configuration matrix), dev-guide.md §4 Build, dev-guide.md §npm scripts
