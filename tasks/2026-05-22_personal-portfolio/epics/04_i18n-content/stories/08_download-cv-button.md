---
id: 04-08
title: "DownloadCvButton component"
epic: 04
status: done
size: S
blocked_by: ["04-05", "02-04"]
files: ["src/components/ui/DownloadCvButton.tsx"]
issue:
pr:
delivery:
prior_status:
---
# Story 04-08: DownloadCvButton component

> **Epic:** Internationalization & Content Data
> **Size:** S
## Description

Implement `src/components/ui/DownloadCvButton.tsx`, a localized anchor component that triggers a PDF download of the CV. The component wraps the existing `Button` component (story 02-04) with `as="a"`, sets the `download` attribute, builds a base-aware `href`, and reads its label from `t('downloadCv')` via `useLanguage()`. The `href` must use `import.meta.env.BASE_URL` so the link resolves correctly regardless of whether Vite's `base` is set to `'/'` (user-page deployment) or a sub-path like `'/ck-portfolio/'` (project-page deployment). The PDF file itself is a separate concern handled in Epic 07 — this component only needs to point at the right path.

## Acceptance Criteria

- [x] `src/components/ui/DownloadCvButton.tsx` renders an `<a>` element (via `Button as="a"`) with `download` attribute present (either as a boolean prop or `download="erick-andrinirina-cv.pdf"`).
- [x] The rendered `href` is `import.meta.env.BASE_URL + 'cv/erick-andrinirina-cv.pdf'` — exactly this expression, ensuring no double-slash when `BASE_URL` is `'/'` and correct resolution when `BASE_URL` is `'/some-path/'`. In the default deployment (`base: '/'`), the resolved href is `/cv/erick-andrinirina-cv.pdf`.
- [x] The component's visible label text is `t('downloadCv')` from `useLanguage()` — when locale is `'fr'` the French label is shown; when `'en'` the English label is shown.
- [x] The component accepts no required props (all data comes from context and `import.meta.env`).
- [x] The component accepts optional `className` prop (or equivalent) for layout flexibility, passed through to the underlying `Button`.
- [x] The rendered element is a valid anchor: `href` is set and `download` attribute is present; clicking it in a browser initiates a file download rather than navigation.
- [x] `npm run build` exits 0 after this file is added (no TypeScript errors; `import.meta.env.BASE_URL` is recognized by Vite's type declarations).

### Edge Cases

- When `import.meta.env.BASE_URL` is `'/'`, the resulting href is `/cv/erick-andrinirina-cv.pdf` (no double slash). Verify the concatenation: `'/' + 'cv/...'` = `'/cv/...'` — correct. If `BASE_URL` is `'/ck-portfolio/'`, the result is `/ck-portfolio/cv/erick-andrinirina-cv.pdf` — also correct. No special handling needed beyond using `import.meta.env.BASE_URL` directly.
- The PDF file may not exist yet (Epic 07 places it in `public/cv/`). This is a build-time concern, not a component concern. The component renders the correct href whether or not the file is present.
- The component must not break if rendered outside a `LanguageProvider` — `useLanguage` should either provide a safe fallback label or the error should surface clearly during development.

## Technical Notes

- The `Button` component (story 02-04) supports `as="a"` to render as an anchor element while applying button styles. `DownloadCvButton` should use this prop rather than rendering a raw `<a>` to maintain visual consistency with the rest of the design system.
- Suggested implementation:
  ```tsx
  const { t } = useLanguage()
  const href = import.meta.env.BASE_URL + 'cv/erick-andrinirina-cv.pdf'
  return (
    <Button as="a" href={href} download variant="primary" className={className}>
      {t('downloadCv')}
    </Button>
  )
  ```
- `import.meta.env.BASE_URL` is a string injected by Vite at build time. TypeScript recognizes it via Vite's `vite/client` types (included when `vite` is a dev dependency and `tsconfig.json` includes `vite/client` in `compilerOptions.types` or via the `/// <reference types="vite/client" />` directive).
- No test is required for this story (the localization integration is covered by `LanguageSwitcher.test.tsx` and the parity test). A smoke check in the running dev server (Epic 08 or manual verification) is sufficient.

## Files to Create/Modify

| Action | File Path                                | Purpose                                         |
| ------ | ---------------------------------------- | ----------------------------------------------- |
| CREATE | `src/components/ui/DownloadCvButton.tsx` | Localized anchor to CV PDF with base-aware href |

## Dependencies

- **Blocked by:** 04-05 (useLanguage must exist for `t('downloadCv')`), 02-04 (Button component must exist)
- **Blocks:** 06-01 (Hero section renders DownloadCvButton)

## Related

- **Epic:** 04_i18n-content
- **Related stories:** 04-05, 02-04, 06-01
- **Spec reference:** data-flow.md §7 CV download; components.md §UI (DownloadCvButton)

## Implementation Plan

- [x] Write test file covering href, download attribute, and localized label
- [x] Implement DownloadCvButton component wrapping Button with `as="a"`
- [x] Verify all tests pass (4 test cases in DownloadCvButton.test.tsx)
- [x] Verify full test suite passes (270 tests)
- [x] Verify TypeScript compilation clean
- [x] Verify npm run build exits 0

## Implementation Summary

### Files Created

- `src/components/ui/DownloadCvButton.tsx` — Localized anchor component wrapping Button, uses `import.meta.env.BASE_URL + 'cv/erick-andrinirina-cv.pdf'` for href, includes `download` attribute, renders localized label via `t('downloadCv')` from `useLanguage()`, accepts optional `className` prop.

### Files Modified

None outside the created files.

### Test Results

- New tests (4): All PASS
  - Renders anchor element with correct href
  - Has download attribute present
  - Displays localized label
  - Accepts and applies className prop
- Full test suite: 270 tests PASS
- Build: `npm run build` exits 0
- TypeScript: No errors

### Verification

- Component renders correctly inside LanguageProvider
- `import.meta.env.BASE_URL` recognized by Vite's type declarations
- href concatenation: `/cv/erick-andrinirina-cv.pdf` (default BASE_URL of `/`)
- Optional className prop passed through to underlying Button
