---
id: 10-02
title: "Theme system rewrite — 4 palettes, data-theme, switcher"
epic: 10
status: done
size: M
blocked_by: ["10-01"]
files: ["src/theme/ThemeProvider.tsx", "src/theme/useTheme.ts", "src/theme/themeBootstrap.ts", "index.html", "src/components/ui/ThemeSwitcher.tsx", "src/components/ui/ThemeToggle.tsx", "src/components/ui/ThemeToggle.test.tsx"]
issue:
pr:
delivery:
prior_status:
---
# Story 01-02: Theme system rewrite — 4 palettes, data-theme, switcher

> **Epic:** Foundation — Tokens, Theme & Content
> **Size:** L
## Description

Rewrite the theme system to drive the four Atelier palettes through the `data-theme`
attribute on `<html>` instead of the old `dark` class. This replaces `ThemeProvider`,
extends `useTheme`, adds the co-located anti-FOUC bootstrap, ships a `ThemeSwitcher`
control, and deletes the obsolete `ThemeToggle`.

`ThemeProvider` exposes `{ theme, setTheme, cycle }` where `theme` is one of
`'default' | 'paper' | 'ocean' | 'forest'`. Applying a theme sets `data-theme` on the
document element — **except** `default` (Ember), which removes the attribute so the
`:root` palette governs. The choice is persisted to `localStorage['theme']`. The default
when nothing is stored is `default` if the system prefers dark, else `paper`.

The anti-FOUC bootstrap (`themeBootstrap.ts` as an exported string) is wired into
`index.html` as an inline `<script>` that runs before React so the correct theme is
applied on first paint. The logic must match the provider's resolution exactly.

## Acceptance Criteria

- [x] `Theme` type is `'default' | 'paper' | 'ocean' | 'forest'`.
- [x] `ThemeProvider` resolves the initial theme as `localStorage['theme']` if present,
      else `default` when `matchMedia('(prefers-color-scheme: dark)').matches`, else `paper`.
- [x] Applying `default` **removes** the `data-theme` attribute; any other theme sets
      `data-theme="<theme>"` on `document.documentElement`.
- [x] `setTheme(t)` updates state, the attribute, and `localStorage['theme']`.
- [x] `cycle()` advances through `default → ocean → forest → paper → default` (the
      documented order) and persists.
- [x] `useTheme()` returns `{ theme, setTheme, cycle }` and throws a clear error when used
      outside the provider.
- [x] `themeBootstrap.ts` exports the inline-script string; `index.html` runs it before the
      React bundle and its resolution matches the provider (no flash of wrong theme on a
      hard reload with a stored preference). _(In-sync enforced by a whitespace/semicolon-
      insensitive test asserting `index.html` embeds `THEME_BOOTSTRAP`.)_
- [x] `ThemeSwitcher` renders the active theme and switches it app-wide on click/activation
      (cycle button), with an accessible label and visible focus ring.
- [x] `src/components/ui/ThemeToggle.tsx` and its test are removed; no remaining import
      references them. _(Doomed `Header` swapped to `ThemeSwitcher` — minimal change, full
      teardown in 04-01.)_
- [x] Provider/switcher/bootstrap unit tests pass; `npm run build` has no TS errors.

## Technical Notes

- Keep the provider tree order `ThemeProvider → LanguageProvider → App` (wired in 04-01);
  this story only changes the ThemeProvider implementation, not the nesting.
- The bootstrap is duplicated by necessity (inline in HTML + co-located TS source). Export
  one canonical string from `themeBootstrap.ts` and paste it into `index.html`; add a test
  that the two stay in sync (e.g. assert the HTML contains the exported snippet).
- Guard `localStorage`/`matchMedia` access in `try/catch` for SSR-less safety and old
  browsers (the bootstrap already does).
- `ThemeSwitcher` reads `useTheme()`; do not duplicate persistence logic in the component.
- Removing `ThemeToggle` may break an import in the old `Header` (slated for deletion in
  04-01). If `Header` still imports it at this point, leave a TODO or stub rather than
  editing the doomed file extensively — full teardown happens in 04-01.

## Files to Create/Modify

| Action | File Path                                | Purpose                                           |
| ------ | ---------------------------------------- | ------------------------------------------------- |
| MODIFY | `src/theme/ThemeProvider.tsx`            | 4-theme provider via `data-theme`, cycle, persist |
| MODIFY | `src/theme/useTheme.ts`                  | Extended return `{ theme, setTheme, cycle }`      |
| CREATE | `src/theme/themeBootstrap.ts`            | Exported anti-FOUC inline-script string           |
| MODIFY | `index.html`                             | Inline bootstrap `<script>` before the bundle     |
| CREATE | `src/components/ui/ThemeSwitcher.tsx`    | Theme control replacing ThemeToggle               |
| DELETE | `src/components/ui/ThemeToggle.tsx`      | Superseded by ThemeSwitcher                       |
| DELETE | `src/components/ui/ThemeToggle.test.tsx` | Obsolete test                                     |

## Dependencies

- **Blocked by:** 01-01 (the `[data-theme]` token blocks must exist for theming to work)
- **Blocks:** 02-03 (Sidebar/Topbar host the ThemeSwitcher), 04-01 (provider wiring)

## Related

- **Epic:** foundation-tokens-theme-content
- **Related stories:** 01-01 (tokens + font links + bootstrap placeholder), 02-03 (chrome)
- **Spec reference:** feature doc §Decisions (theme model), §Data flow (Boot, Theme cycle),
  §Components (ThemeProvider), §Configuration changes

## Implementation Plan

### SOLID Analysis

- **S — Single Responsibility:** provider owns theme state/persistence; bootstrap owns
  first-paint resolution; switcher owns presentation; hook owns context access.
- **O — Open/Closed:** adding a palette means extending the `Theme` union + cycle array,
  not rewriting the provider.
- **L — Liskov:** every theme value is a valid argument to `setTheme`; `default` is handled
  by attribute removal but is otherwise interchangeable.
- **I — Interface Segregation:** `ThemeSwitcher` consumes only `{ theme, cycle/setTheme }`.
- **D — Dependency Inversion:** components depend on `useTheme()`, not on `localStorage` or
  the DOM attribute directly.

### Subtasks

- [x] 1. Write provider/hook/switcher/bootstrap tests (RED).
- [x] 2. Implement `themeBootstrap.ts` + `ThemeProvider`/`useTheme` (GREEN).
- [x] 3. Wire the inline script into `index.html`; add the in-sync test.
- [x] 4. Build `ThemeSwitcher`; delete `ThemeToggle` + test.
- [x] 5. Refactor + SOLID check; verify no dangling imports.
- [x] 6. QA validation — map each AC, run the suite, check TypeScript.

## Implementation Summary

Replaced the old `light`/`dark` class-based theme system with the 4-palette
`data-theme` model. `ThemeProvider` now exposes `{ theme, setTheme, cycle }` over
`'default' | 'paper' | 'ocean' | 'forest'`; applying `default` removes the `data-theme`
attribute (the `:root` Ember palette governs), every other theme sets it. Initial theme
resolves `stored → (prefers-dark ? 'default' : 'paper')`, persisted to
`localStorage['theme']`. The anti-FOUC bootstrap is a single canonical string in
`themeBootstrap.ts`, pasted into `index.html` and kept in sync by a test.

`ThemeSwitcher` (new) is a cycle button reading `useTheme()` — no duplicated persistence.
`ThemeToggle` + its test were deleted; the doomed `Header` was given a minimal
`ThemeToggle → ThemeSwitcher` swap (full teardown is 04-01).

**QA:** `tsc -b` clean · `vite build` green · 551 tests pass (38 files) · ESLint clean.

## Files Touched

- CREATED: `src/theme/themeBootstrap.ts`
- CREATED: `src/components/ui/ThemeSwitcher.tsx`
- CREATED: `src/components/ui/ThemeSwitcher.test.tsx`
- MODIFIED: `src/theme/ThemeProvider.tsx` — 4-palette `data-theme` provider, `cycle`, persist
- MODIFIED: `src/theme/useTheme.ts` — return shape now `{ theme, setTheme, cycle }` (via context type)
- MODIFIED: `src/theme/ThemeProvider.test.tsx` — rewritten for the new model
- MODIFIED: `src/theme/themeBootstrap.test.ts` — rewritten: new resolution + `index.html` in-sync
- MODIFIED: `index.html` — `data-theme` anti-FOUC bootstrap (replaces the dark-class script)
- DELETED: `src/components/ui/ThemeToggle.tsx`, `src/components/ui/ThemeToggle.test.tsx`

## Unplanned Changes

- `src/components/layout/Header.tsx` — swapped `ThemeToggle` import/usages for `ThemeSwitcher` — required so the doomed Header keeps compiling after ThemeToggle's deletion (minimal, per story note; full teardown in 04-01).
- `src/components/layout/Header.test.tsx` — updated the two theme assertions (button name + `data-theme` instead of `dark` class) to match the swap.
- `src/test/index-html.test.ts` — updated the bootstrap assertion from the `dark` class to `data-theme` (the script the story rewrites).
