---
id: 04-05
title: "LanguageProvider + useLanguage"
epic: 04
status: done
size: M
blocked_by: ["04-02", "04-03", "04-04"]
files: ["src/i18n/LanguageProvider.tsx", "src/i18n/useLanguage.ts"]
issue:
pr:
delivery:
prior_status:
---
# Story 04-05: LanguageProvider + useLanguage

> **Epic:** Internationalization & Content Data
> **Size:** M
## Description

Implement `src/i18n/LanguageProvider.tsx` and `src/i18n/useLanguage.ts` — the runtime heart of the bilingual system. `LanguageProvider` is a React context provider that owns the `locale` state, resolves it from storage or browser preference on first render, keeps `document.documentElement.lang` in sync, and exposes the resolved content object and a `t()` label accessor to all descendants. `useLanguage` is the corresponding context hook that any component calls to access `{ locale, setLocale, content, t }`.

These two files are the integration point between the static content modules (04-02, 04-03), the UI label map (04-04), and every section component (Epic 06). Getting the initialization order and the localStorage resilience right is critical: the provider must degrade gracefully when localStorage is unavailable, must default to `'fr'` for any non-English/non-French browser language, and must not cause a hydration flash by diverging from the early state set by a potential inline script.

## Acceptance Criteria

- [x] `src/i18n/LanguageProvider.tsx` exports a `LanguageProvider` React component that accepts `{ children: React.ReactNode }` and wraps children in a context provider.
- [x] `src/i18n/useLanguage.ts` exports a `useLanguage` hook that returns `{ locale: 'fr' | 'en', setLocale: (l: 'fr' | 'en') => void, content: PortfolioContent, t: (key: keyof UiLabels) => string }`.
- [x] `useLanguage` throws a descriptive error (or returns a safe fallback) if called outside a `LanguageProvider`.
- [x] **Locale initialization order** (verified by test):
  1. If `localStorage.getItem('locale')` returns `'fr'` or `'en'`, that value is used.
  2. Else if `navigator.language.slice(0, 2)` is `'fr'` or `'en'`, that value is used.
  3. Otherwise, `'fr'` is used as the default.
- [x] When `locale` is `'fr'`, `content` is the object from `src/content/fr.ts`. When `locale` is `'en'`, `content` is the object from `src/content/en.ts`. No other values are possible.
- [x] `t(key)` returns `ui[locale][key]` from `src/i18n/ui.ts`. Calling `t` with an invalid key is a TypeScript error.
- [x] On mount, `document.documentElement.lang` is set to the resolved locale.
- [x] When `setLocale` is called: (a) `locale` state updates, triggering a re-render of all consumers; (b) `document.documentElement.lang` is updated; (c) `localStorage.setItem('locale', newLocale)` is called.
- [x] **localStorage unavailability**: if `localStorage.getItem` throws (e.g., SecurityError in private mode), the provider catches the error, applies the `navigator.language` / default fallback, and continues without crashing. `setLocale` similarly wraps `localStorage.setItem` in a try/catch.
- [x] The context value object is stable across re-renders for unchanged locale (use `useMemo` or equivalent) to avoid unnecessary downstream re-renders.
- [x] `npm run build` exits 0 after these files are added.

### Edge Cases

- Browser language `'fr-FR'`, `'fr-BE'`, or `'en-US'` must match as `'fr'` or `'en'` respectively after `slice(0, 2)`.
- Browser language `'de'`, `'ja'`, `'pt'`, or any other language must fall through to the `'fr'` default.
- If localStorage returns a value that is neither `'fr'` nor `'en'` (e.g., corrupted), treat it as missing and fall through to the navigator/default logic.
- The provider must not attempt to read `localStorage` during SSR (not a current concern but guard with `typeof window !== 'undefined'` for correctness).

### Test Notes

- Test the initialization logic by mocking `localStorage` before mounting `LanguageProvider`:
  - `localStorage` empty + `navigator.language = 'de'` → locale is `'fr'`.
  - `localStorage.locale = 'en'` → locale is `'en'` regardless of navigator.
  - `localStorage` empty + `navigator.language = 'en-US'` → locale is `'en'`.
  - `localStorage` throws → locale is `'fr'` (or `'en'` per navigator) without crash.
- Use `vi.stubGlobal` or `Object.defineProperty` to mock `navigator.language` in Vitest.
- Mock `localStorage` with `vi.spyOn(Storage.prototype, 'getItem')`.

## Technical Notes

- Context creation: use `React.createContext<LanguageContextValue | null>(null)` so that `useLanguage` can detect missing provider.
- State: `const [locale, setLocaleState] = useState<'fr' | 'en'>(() => resolveInitialLocale())` where `resolveInitialLocale` is a plain function (not a hook) defined in the same file. Lazy initialization avoids re-running on every render.
- Import both content modules at the top of the provider file: `import frContent from '../content/fr'` and `import enContent from '../content/en'`. Select the active object inside the context value: `const content = locale === 'en' ? enContent : frContent`.
- `setLocale` wrapper: call `setLocaleState(l)`, then `localStorage.setItem` (in try/catch), then `document.documentElement.lang = l`.
- The `lang` update can also live in a `useEffect([locale])` to keep side effects out of the setter — either pattern is acceptable as long as the AC holds.

## Files to Create/Modify

| Action | File Path                       | Purpose                                                          |
| ------ | ------------------------------- | ---------------------------------------------------------------- |
| CREATE | `src/i18n/LanguageProvider.tsx` | React context provider — locale state, content resolution, `t()` |
| CREATE | `src/i18n/useLanguage.ts`       | Context accessor hook — `{ locale, setLocale, content, t }`      |

## Dependencies

- **Blocked by:** 04-02 (fr.ts must exist), 04-03 (en.ts must exist), 04-04 (ui.ts must exist for `t()`)
- **Blocks:** 04-06, 04-08, 05-01, 06-01, 06-02, 06-03, 06-04, 06-05, 06-06, 06-07, 06-08

## Implementation Summary

### Files Touched

| Action   | File                                        | Notes                                            |
| -------- | ------------------------------------------- | ------------------------------------------------ |
| CREATED  | `src/i18n/LanguageProvider.tsx`             | React context provider, locale state, t() helper |
| CREATED  | `src/i18n/useLanguage.ts`                   | Context accessor hook with descriptive error     |
| CREATED  | `src/i18n/LanguageProvider.test.tsx`        | 28 tests covering all ACs and edge cases         |

### Test Results

- Vitest: 259 passed, 0 failed (full suite)
- ESLint: 0 errors, 0 warnings on new files
- `npm run build`: exits 0 (tsc -b + vite build)

### Key Design Decisions

- `resolveInitialLocale()` is a plain function (not a hook) — safe as `useState` lazy initializer.
- `readStoredLocale()` / `readNavigatorLocale()` are single-responsibility pure helpers.
- `useEffect([locale])` manages `document.documentElement.lang` side effect cleanly.
- `setLocale` callback wraps `localStorage.setItem` in try/catch — no crash on SecurityError.
- `useMemo` on the context value prevents unnecessary re-renders in consumers.
- React 19 pattern: `<LanguageContext value={value}>` (not `.Provider`).

## Related

- **Epic:** 04_i18n-content
- **Related stories:** 04-02, 04-03, 04-04, 04-06
- **Spec reference:** components.md §LanguageProvider; data-flow.md §2 Content rendering, §3 Language switch

## Implementation Plan

### SOLID Analysis

- **S** — `LanguageProvider.tsx` owns locale state + context exposure only; `resolveInitialLocale()` is a pure utility function in the same file; `useLanguage.ts` is a single-purpose accessor.
- **O** — Locale resolution logic is isolated in a pure function; the component does not need modification to extend fallback strategies.
- **L** — `LanguageContextValue` is fully substitutable; `createContext<LanguageContextValue | null>(null)` allows safe null-detection in the hook.
- **I** — The context interface exposes exactly `{ locale, setLocale, content, t }` — nothing more.
- **D** — Content modules (`fr.ts`, `en.ts`) and `ui.ts` are imported at the module level and selected at runtime — easily mockable in tests.

### Subtasks

- [x] 1. Write failing tests in `src/i18n/LanguageProvider.test.tsx`
- [x] 2. Implement `src/i18n/LanguageProvider.tsx` (provider + resolveInitialLocale)
- [x] 3. Implement `src/i18n/useLanguage.ts` (hook)
- [x] 4. Refactor: SOLID compliance check + run tests
- [x] 5. QA validation + acceptance criteria verification
- [x] 6. Completion: update story file + mark DONE
