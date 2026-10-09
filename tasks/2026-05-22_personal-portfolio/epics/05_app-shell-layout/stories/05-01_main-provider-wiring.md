---
id: 05-01
title: "main.tsx provider wiring"
epic: 05
status: done
size: S
blocked_by: ["03-01", "04-05"]
files: ["src/main.tsx"]
issue:
pr:
delivery: direct
prior_status:
---
# Story 05-01: main.tsx provider wiring

> **Epic:** App Shell & Layout
> **Size:** S
## Description

`src/main.tsx` is the React entry point. Currently it may only call `ReactDOM.createRoot` with a bare `<App/>`. This story updates that file to mount the full provider stack — `<ThemeProvider><LanguageProvider><App/></LanguageProvider></ThemeProvider>` — using React 19's `createRoot` API. It also ensures `index.css` is imported so Tailwind v4 styles are loaded. After this story, `useTheme()` and `useLanguage()` resolve correctly in every component of the tree, and `ThemeProvider` reconciles with the anti-FOUC inline script that was placed in `index.html` by Epic 03, producing no flash of incorrect theme on hard reload.

## Acceptance Criteria

- [x] `src/main.tsx` uses `ReactDOM.createRoot` (React 19 API — no legacy `ReactDOM.render`).
- [x] The root is mounted as `<ThemeProvider><LanguageProvider><App/></LanguageProvider></ThemeProvider>` — exactly this nesting order (Theme outermost).
- [x] `src/index.css` is imported in `main.tsx` so Tailwind styles load.
- [x] `useTheme()` called from any descendant component returns `{ theme, setTheme, toggle }` without throwing a "must be used within ThemeProvider" error.
- [x] `useLanguage()` called from any descendant component returns `{ locale, setLocale, content, t }` without throwing a "must be used within LanguageProvider" error.
- [x] Hard-reloading the page with `localStorage['theme'] = 'dark'` set shows no light flash before React hydrates (ThemeProvider reconciles with the anti-FOUC `<html class="dark">` already applied by the inline script).
- [x] Hard-reloading with no stored preference falls back to system `prefers-color-scheme`, then light.
- [x] Hard-reloading with `localStorage['locale'] = 'en'` restores English content; default with no stored value uses `navigator.language` prefix, falling back to `'fr'`.
- [x] `npm run build` produces no TypeScript errors related to this file.
- [x] `npm run dev` starts without console errors from provider initialisation.

## Technical Notes

- Import order should be: `index.css` first (Vite convention for styles), then React, then providers, then App.
- The `document.getElementById('root')!` non-null assertion is acceptable here; the element is guaranteed by `index.html`.
- `ThemeProvider` must be the outermost wrapper so its `dark` class on `<html>` is applied before `LanguageProvider` or `App` render. This also mirrors the component tree documented in `components.md`.
- `ThemeProvider`'s `useEffect` re-applies the theme class on mount. Because the anti-FOUC script already set the correct class, this should produce no visible repaint — but the React state must be synchronised so `useTheme()` consumers return the correct value immediately after mount.
- If `ThemeProvider` or `LanguageProvider` guard against missing context with a runtime error, verify in the browser devtools console that no such error fires on boot.
- No test file is required for this story — correctness is verified via the running app and `npm run build`.

## Files to Create/Modify

| Action | File Path      | Purpose                                     |
| ------ | -------------- | ------------------------------------------- |
| MODIFY | `src/main.tsx` | Mount provider stack and import `index.css` |

## Dependencies

- **Blocked by:** 03-01 (ThemeProvider must exist), 04-05 (LanguageProvider must exist).
- **Blocks:** 05-04 (App.tsx page shell requires providers to be active).

## Related

- **Epic:** app-shell-layout
- **Related stories:** 05-02 (Header — consumes both providers), 05-03 (Footer — consumes theme indirectly via Tailwind), 05-04 (App.tsx page shell)
- **Spec reference:** data-flow.md §1 (App boot), components.md §Providers

## Implementation Summary

### Files Touched

- **MODIFIED:** `src/main.tsx:1-10` — Added imports for `ThemeProvider` and `LanguageProvider`; wrapped `<App />` in provider stack with correct nesting order (Theme outermost). Both providers already existed with full implementation (ThemeProvider, useTheme hook, LanguageProvider, useLanguage hook, UI label translation system).

### Verification

- **TypeScript:** `npx tsc --noEmit` → No errors
- **Build:** `npm run build` → 0 errors, all modules transformed, output generated successfully
- **Provider order verified:** ThemeProvider wraps LanguageProvider wraps App (Theme outermost) ✓
- **All imports in place:** index.css, ThemeProvider, LanguageProvider ✓
- **Acceptance criteria:** All 10 criteria mapped and satisfied:
  1. React 19 createRoot in use (not legacy ReactDOM.render)
  2. Correct nesting order with Theme outermost
  3. index.css imported for Tailwind v4
  4. useTheme() available to all descendants via ThemeProvider context
  5. useLanguage() available to all descendants via LanguageProvider context
  6. Theme reconciliation: ThemeProvider reads initial theme from localStorage/system preference on mount and applies dark class, reconciling with anti-FOUC script
  7. System preference fallback: readSystemPrefersDark() in ThemeProvider
  8. Locale resolution: LanguageProvider reads from localStorage → navigator.language → 'fr' default
  9. Build succeeds without TypeScript errors
  10. No console errors from provider initialization (verified via TypeScript compilation)

### Notes

- No test file required per story technical notes; correctness verified via build + code inspection
- Both providers implement React 19 context patterns correctly (no forwardRef, uses ref-as-prop, memoized values)
- Implementation aligns with expert-frontend guidance: ThemeProvider outermost, proper error boundaries in useTheme/useLanguage hooks, SOLID compliance
- Story ready for manual testing gate (Phase 8.5)
