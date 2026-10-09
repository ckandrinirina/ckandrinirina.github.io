---
id: 03-01
title: "ThemeProvider + useTheme"
epic: 03
status: done
size: M
blocked_by: ["01-02"]
files: ["src/theme/ThemeProvider.tsx", "src/theme/useTheme.ts"]
issue:
pr:
delivery: direct
prior_status:
---
# Story 03-01: ThemeProvider + useTheme

> **Epic:** Theming System
> **Size:** M
## Description

Create the React context layer that owns the application's light/dark theme state. `ThemeProvider` wraps the component tree, initialises theme from `localStorage['theme']` (falling back to `prefers-color-scheme`, then `'light'`), synchronises the `dark` class on `document.documentElement` on every state change, and persists the chosen value back to `localStorage`. `useTheme` is the public hook that any component uses to read or update the theme.

This story is the foundational piece of the theming epic: both the anti-FOUC bootstrap script (03-02) and the `ThemeToggle` component (03-03) depend on its API being stable and correctly implemented.

## Acceptance Criteria

- [x] `ThemeProvider` renders its children without error and provides a non-null context value.
- [x] On mount, if `localStorage['theme']` is `'dark'`, the initial state is `'dark'` and `document.documentElement` has the `dark` class.
- [x] On mount, if `localStorage['theme']` is `'light'`, the initial state is `'light'` and `document.documentElement` does NOT have the `dark` class.
- [x] On mount, if `localStorage['theme']` is absent and `matchMedia('(prefers-color-scheme: dark)').matches` is `true`, the initial state is `'dark'`.
- [x] On mount, if both `localStorage['theme']` and `prefers-color-scheme` are absent or non-dark, the initial state is `'light'`.
- [x] Calling `setTheme('dark')` adds the `dark` class to `document.documentElement` and writes `'dark'` to `localStorage['theme']`.
- [x] Calling `setTheme('light')` removes the `dark` class from `document.documentElement` and writes `'light'` to `localStorage['theme']`.
- [x] Calling `toggle()` flips the theme from `'light'` to `'dark'` (and vice versa), updating `<html>` class and `localStorage` accordingly.
- [x] `useTheme()` called outside `ThemeProvider` throws a descriptive error (e.g. `"useTheme must be used within a ThemeProvider"`).
- [x] When `localStorage` is unavailable (simulated by `localStorage.getItem` throwing), the provider falls back to system preference and does not throw; `toggle()` still updates in-memory state and the `<html>` class for the duration of the session.
- [x] No double-application flicker: if the bootstrap script has already set `dark` on `<html>` before mount, the provider's effect does not remove and re-add it (i.e. the derived initial state matches the DOM state applied by the script).
- [x] TypeScript: `ThemeProvider` props are typed; `useTheme` return type is `{ theme: 'light' | 'dark'; setTheme: (t: 'light' | 'dark') => void; toggle: () => void }`.

## Technical Notes

- Use `createContext` with `undefined` as default so the out-of-provider guard works correctly.
- Initialise state with a lazy initialiser function passed to `useState` — this avoids running the `localStorage`/`matchMedia` logic on every re-render.
- The `useEffect` that manages the `<html>` class should have `[theme]` as its dependency array; it should call `document.documentElement.classList.add('dark')` / `.remove('dark')` (not `.toggle`) for clarity.
- Wrap all `localStorage` access in `try/catch` to handle browsers with storage disabled (incognito/privacy mode on some browsers throws on `localStorage.setItem`).
- `matchMedia` may be `undefined` in test environments — guard with `typeof window !== 'undefined' && window.matchMedia`.
- Export `ThemeContext` as a named export for testing purposes (so tests can provide a mock value directly if needed).

## Files to Create/Modify

| Action | File Path                     | Purpose                                                                                         |
| ------ | ----------------------------- | ----------------------------------------------------------------------------------------------- |
| CREATE | `src/theme/ThemeProvider.tsx` | Context provider component, state init logic, `<html>` class effect, `localStorage` persistence |
| CREATE | `src/theme/useTheme.ts`       | `useTheme` hook — context accessor with out-of-provider guard                                   |

## Dependencies

- **Blocked by:** 01-02 (Tailwind v4 `@custom-variant dark` configured in `src/index.css` — the `dark` class on `<html>` must actually activate dark styles)
- **Blocks:** 03-02 (bootstrap script must replicate this story's precedence logic), 03-03 (ThemeToggle calls `useTheme`), 05-01 (main.tsx wraps app in ThemeProvider)

## Related

- **Epic:** theming-system
- **Related stories:** 03-02, 03-03, 05-01
- **Spec reference:** components.md §Providers (ThemeProvider), data-flow.md §4 (theme toggle), data-flow.md §Failure modes (localStorage unavailable)

---

## Implementation Plan

**Planned:** 2026-05-26
**Skills loaded:** expert-frontend, expert-qa, expert-qa-project, guide-typescript, guide-react, guide-tailwind
**SOLID approach:** Single-responsibility split — `ThemeProvider.tsx` owns context creation + state + DOM/storage side effects; `useTheme.ts` is a pure context accessor with an out-of-provider guard. Closed for modification, open for extension through the small `ThemeApi` interface. Dependencies on `window.localStorage` / `window.matchMedia` are isolated at the boundary and guarded with `try/catch` for inversion-friendly testing.

### Subtasks
1. [x] Write failing tests covering all 12 acceptance criteria (RED)
2. [x] Implement `src/theme/ThemeProvider.tsx` (GREEN)
3. [x] Implement `src/theme/useTheme.ts` (GREEN)
4. [x] Refactor for SOLID compliance + memoize context value
5. [x] QA validation (vitest, tsc, eslint, prettier)
6. [x] Update story status DONE + ship

### Design Notes
- `createContext<ThemeContextValue | null>(null)` and export `ThemeContext` as a named export — enables both the out-of-provider guard and direct test injection.
- Use **React 19** `<ThemeContext value={api}>` (not `<Context.Provider>`).
- Lazy `useState(initializer)` reads `localStorage['theme']` then `matchMedia('(prefers-color-scheme: dark)')` then `'light'` — runs once, never on re-render.
- The same precedence is intentionally identical to what the bootstrap script (03-02) will replicate, so the derived initial state matches the DOM state already applied → `useEffect`'s `classList.add('dark')` becomes idempotent (no flicker).
- `useEffect([theme])` calls `document.documentElement.classList.add('dark')` / `.remove('dark')` (not `.toggle`) for clarity. Persistence to `localStorage` happens in the same effect, wrapped in `try/catch`.
- `matchMedia` guarded with `typeof window !== 'undefined' && window.matchMedia` for SSR/test environments without it.
- `useMemo([theme])` for the context value so consumers don't re-render needlessly.
- API shape: `{ theme: 'light' | 'dark'; setTheme: (t: 'light' | 'dark') => void; toggle: () => void }`.
- `useTheme()` throws `"useTheme must be used within a ThemeProvider"` when context is `null`.

---

## Implementation Summary

**Completed:** 2026-05-26
**TDD Iterations:** 1 (single red→green→refactor cycle; all 12 tests passed on first GREEN)
**QA Iterations:** 1
**Manual-test bugs:** none (pending gate)
**Tests written:** 12
**Files created:** 3
**Files modified:** 0
**Unplanned changes:** none

### What Was Implemented
- `ThemeProvider` React 19 context provider owning `'light' | 'dark'` state, applying the `dark` class to `<html>`, and persisting choice to `localStorage['theme']`.
- Initial-state precedence: stored value → `prefers-color-scheme: dark` → `'light'`.
- `useTheme()` hook with descriptive out-of-provider throw.
- Privacy-mode resilient: every `localStorage` and `matchMedia` access wrapped in `try/catch`; toggle continues to update in-memory state and DOM when storage is disabled.
- Flicker-free: provider's effect uses idempotent `classList.add('dark')` / `.remove('dark')`, so the bootstrap-script-applied class is never toggled off and back on.

### Files Touched

```
CREATED  src/theme/ThemeProvider.tsx
CREATED  src/theme/useTheme.ts
CREATED  src/theme/ThemeProvider.test.tsx
```

### SOLID Compliance
- **S:** `ThemeProvider.tsx` owns context + state + side effects; `useTheme.ts` is a pure context accessor; small helpers (`readStoredTheme`, `readSystemPrefersDark`, `resolveInitialTheme`, `persistTheme`) each have one responsibility.
- **O:** `Theme` and `ThemeContextValue` are closed surface types; behavior extension flows through `setTheme` / `toggle`, not modification.
- **L:** N/A (no inheritance).
- **I:** `ThemeContextValue` exposes only `{ theme, setTheme, toggle }` — exactly what consumers need.
- **D:** `localStorage` and `matchMedia` access is isolated behind small functions; tests substitute them at the boundary via `vi.spyOn(Storage.prototype, …)` and `vi.stubGlobal('matchMedia', …)`.

### Notes
- React 19 idiom used throughout: `<ThemeContext value={...}>`, no `forwardRef`, no `Context.Provider`.
- A single `eslint-disable-next-line react-refresh/only-export-components` is on the `ThemeContext` export — the story's tech notes require named-exporting the context from this file for tests; this disables Fast Refresh's "only export components" hint, which is a dev-experience advisory, not a correctness rule.
- 03-02 (bootstrap script) MUST replicate this provider's precedence exactly — `localStorage['theme']` first, then `prefers-color-scheme: dark`, then `'light'` — for the no-flicker AC to hold across reloads.
