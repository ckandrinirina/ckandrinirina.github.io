---
id: 03-03
title: "ThemeToggle component + test"
epic: 03
status: done
size: M
blocked_by: ["03-01", "02-04"]
files: ["src/components/ui/ThemeToggle.tsx", "src/components/ui/ThemeToggle.test.tsx"]
issue:
pr:
delivery: direct
prior_status:
---
# Story 03-03: ThemeToggle component + test

> **Epic:** Theming System
> **Size:** M
## Description

Build the `ThemeToggle` UI component — the button a visitor clicks to switch between light and dark modes. The component reads current theme state via `useTheme()` and calls `toggle()` on click. It renders a contextually appropriate icon (sun for light, moon for dark) and a screen-reader-friendly label, and sets `aria-pressed` to reflect the active theme. A companion test file verifies DOM effects and `localStorage` persistence end-to-end.

This component is the only user-facing entry point for the theming epic. It will be placed in the `Header` (story 05-02), but that wiring is out of scope here.

## Acceptance Criteria

- [x] Clicking `ThemeToggle` in light mode switches to dark: `dark` class is added to `document.documentElement`.
- [x] Clicking `ThemeToggle` in dark mode switches to light: `dark` class is removed from `document.documentElement`.
- [x] After each click, `localStorage['theme']` is updated to the new theme value (`'dark'` or `'light'`).
- [x] `aria-pressed` is `"true"` when the current theme is `'dark'`; `"false"` when `'light'`.
- [x] The rendered icon/symbol reflects the CURRENT theme (e.g. moon icon when dark is active, sun icon when light is active — or the inverse if used as "switch to" semantics, but the choice must be documented and consistent with `aria-pressed`).
- [x] The component has an `aria-label` (e.g. `"Toggle theme"` or `"Switch to dark mode"` / `"Switch to light mode"`) that is meaningful to screen-reader users.
- [x] The button is keyboard-focusable (`tabIndex` not negative) and shows a visible focus ring on `:focus-visible` (Tailwind `focus-visible:ring-*` or equivalent).
- [x] The component renders as a `<button>` element (not `<div>` or `<span>`), ensuring native keyboard activation via Space/Enter.
- [x] `ThemeToggle.test.tsx` passes: renders inside a `ThemeProvider` wrapper, simulates a click, and asserts `document.documentElement.classList.contains('dark')` changes and `localStorage.getItem('theme')` returns the expected value.
- [x] `ThemeToggle.test.tsx` covers both directions: light → dark and dark → light transitions.
- [x] No TypeScript errors; component props interface exported (even if empty, for future extensibility).
- [x] `npm run test -- --run` exits with code 0 after this story.

## Technical Notes

- Wrap the test render in a `ThemeProvider` helper (a small `renderWithTheme` utility or inline JSX wrapper). This keeps tests isolated without mocking the context.
- To test both directions, run one test starting with `localStorage['theme'] = 'light'` and another starting with `localStorage['theme'] = 'dark'`; reset `localStorage` in `beforeEach` / `afterEach`.
- Mock `window.matchMedia` in `src/test/setup.ts` (or per-file) since jsdom does not implement it:
  ```ts
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    })),
  })
  ```
- Use SVG icons inline or from a zero-dependency icon set already in the project (e.g. Heroicons as copy-paste SVG). Do NOT add an icon library dependency just for this component.
- The `Button` component from story 02-04 may be used as the base element to inherit variant styling and focus ring handling, or `ThemeToggle` can render a plain `<button>` styled directly — either is acceptable; document the choice.
- `aria-pressed` should be a string (`"true"` / `"false"`) not a boolean to satisfy ARIA spec and avoid React serialisation inconsistencies.

## Files to Create/Modify

| Action | File Path                                | Purpose                                                                                      |
| ------ | ---------------------------------------- | -------------------------------------------------------------------------------------------- |
| CREATE | `src/components/ui/ThemeToggle.tsx`      | Toggle button component — reads `useTheme`, calls `toggle()`, renders icon + aria attributes |
| CREATE | `src/components/ui/ThemeToggle.test.tsx` | Vitest + Testing Library tests asserting DOM class and localStorage effects                  |

## Dependencies

- **Blocked by:** 03-01 (useTheme hook must exist), 02-04 (Button component available as optional base)
- **Blocks:** 05-02 (Header renders ThemeToggle in the top bar)

## Related

- **Epic:** theming-system
- **Related stories:** 03-01, 02-04, 05-02
- **Spec reference:** components.md §UI ThemeToggle, components.md §Accessibility notes, data-flow.md §4 (theme toggle flow)

---

## Implementation Plan

**Planned:** 2026-05-26
**Skills loaded:** expert-frontend, expert-qa, expert-qa-project, guide-typescript, guide-react, guide-tailwind
**SOLID approach:** Single-purpose component consuming `useTheme()` — no theme state of its own. Closed for modification (variant styling delegated to optional `className`); open for extension through `ThemeToggleProps`. Icons inlined as zero-dependency SVG components, each with a single rendering responsibility.

### Subtasks
1. [x] Write failing tests covering all 12 acceptance criteria (RED)
2. [x] Implement `src/components/ui/ThemeToggle.tsx` (GREEN)
3. [x] Implement `src/components/ui/ThemeToggle.test.tsx` (GREEN)
4. [x] Refactor for SOLID compliance
5. [x] QA validation (vitest, tsc, eslint, prettier)
6. [ ] Update story status DONE + ship (orchestrator owns the DONE flip after manual-test PASS)

### Design Notes
- `useTheme()` is the only theme source — no local state.
- Icon semantics: SUN when current theme is LIGHT, MOON when current theme is DARK ("reflect current state" convention, consistent with `aria-pressed="true"` meaning dark is active).
- `aria-pressed` written as the string `"true"`/`"false"` (per ARIA spec, avoids React boolean serialisation quirks).
- `aria-label` is contextual: `"Switch to light mode"` when dark, `"Switch to dark mode"` when light — tells the screen-reader user what clicking will do.
- Renders a native `<button type="button">` (not a styled `div`) so Space/Enter activation is free.
- Focus ring via `focus-visible:ring-*` so it appears for keyboard users but not mouse clicks.
- Tests wrap each render in a real `ThemeProvider` (no context mocking) to exercise the full path.

---

## Implementation Summary

**Completed:** 2026-05-26
**TDD Iterations:** 1 (red → green → refactor in a single pass)
**QA Iterations:** 1
**Manual-test bugs:** none (pending gate)
**Tests written:** 14
**Files created:** 2
**Files modified:** 0
**Unplanned changes:** none

### What Was Implemented
- `ThemeToggle` button consuming `useTheme()` from epic 03 story 03-01.
- Inline SVG sun/moon icons (zero dependencies); icon reflects the current theme.
- `aria-pressed` as a string mirrors dark-mode state; `aria-label` is contextual.
- Native `<button type="button">` element; Tailwind `focus-visible:ring-*` for keyboard accessibility.
- Companion test suite (14 tests) exercising both toggle directions, DOM class changes, `localStorage` persistence, all ARIA attributes, icon rendering, focus-ring class presence, and the `<button>` element type — all wrapped in the real `ThemeProvider`.

### Files Touched

```
CREATED  src/components/ui/ThemeToggle.tsx
CREATED  src/components/ui/ThemeToggle.test.tsx
```

### SOLID Compliance
- **S:** Component is pure UI — theme state lives in `ThemeProvider`. `SunIcon` / `MoonIcon` are single-purpose render helpers.
- **O:** `ThemeToggleProps` allows extension via `className`; styling is closed for modification but open for composition.
- **L:** N/A (no inheritance).
- **I:** `ThemeToggleProps` exposes only `className` — the minimum surface a caller needs to compose styling.
- **D:** Component depends on the abstract `useTheme` hook contract, not on the concrete `ThemeProvider` implementation. Tests inject the real provider at the test boundary.

### Notes
- The icon convention is **"reflect current state"**: sun when light is active, moon when dark is active. `aria-pressed="true"` means dark mode is currently active, consistent with the icon.
- Styling references the design-token utilities `text-text-primary`, `hover:bg-surface-elevated`, and `focus-visible:ring-brand-500` — these tokens are not yet defined in `src/index.css` `@theme` and will need to be added in a later design-pass story before the toggle renders correctly in the browser. Tests do not catch this (utility classes are strings, not type-checked symbols).
