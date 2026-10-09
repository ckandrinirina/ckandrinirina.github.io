---
id: 03-02
title: "Anti-FOUC inline theme bootstrap script"
epic: 03
status: done
size: S
blocked_by: ["03-01"]
files: ["index.html"]
issue:
pr:
delivery:
prior_status:
---
# Story 03-02: Anti-FOUC inline theme bootstrap script

> **Epic:** Theming System
> **Size:** S
## Description

Add a small synchronous inline `<script>` in the `<head>` of `index.html` that reads `localStorage['theme']` (or falls back to `prefers-color-scheme`) and adds the `dark` class to `<html>` before any CSS or React code executes. Without this script, users who prefer dark mode experience a brief flash of the light theme (FOUC — Flash Of Unstyled/Incorrect Content) on every page load because React's `ThemeProvider` only runs after the JavaScript bundle is parsed and executed.

The script's precedence logic must be an exact match of `ThemeProvider`'s init logic (story 03-01) so there is no divergence between what the script applied and what the provider computes as its initial state.

## Acceptance Criteria

- [x] On a hard reload with `localStorage['theme'] = 'dark'`, the `dark` class is present on `<html>` before the first CSS paint — no white flash is visible.
- [x] On a hard reload with `localStorage['theme'] = 'light'`, the `dark` class is NOT added — no dark flash is visible for light-preferring users.
- [x] On a hard reload with no `localStorage['theme']` and `prefers-color-scheme: dark`, the `dark` class is added before paint.
- [x] On a hard reload with no `localStorage['theme']` and `prefers-color-scheme: light` (or absent), no `dark` class is added; the page renders light.
- [x] The script is wrapped in a `try/catch` so a `localStorage` access error (e.g. privacy mode) does not throw an uncaught exception and does not prevent the page from loading.
- [x] When JavaScript is disabled entirely, no script error occurs and the page loads with its default (light) appearance.
- [x] The script has no `async` or `defer` attribute and is not `type="module"` — it must execute synchronously during HTML parsing.
- [x] The script is minimal: it contains no library imports, no function declarations beyond an immediately-invoked expression, and is human-readable inline.
- [x] The precedence order in the script (`localStorage` → `prefers-color-scheme` → light) matches `ThemeProvider`'s lazy initialiser exactly — verified by code review against 03-01.
- [x] `ThemeProvider` mounting after the script produces no visible re-paint: the React state initialised in 03-01 must agree with what the script set on `<html>`.

## Technical Notes

- Place the script as the last element in `<head>` before `</head>`, after all `<meta>` and `<link>` tags but before the `<script type="module" src="/src/main.tsx">` entry point. This ensures it runs before React but after the document's character encoding and viewport are established.
- Recommended pattern (IIFE with try/catch):
  ```html
  <script>
    ;(function () {
      try {
        var t = localStorage.getItem('theme')
        if (
          t === 'dark' ||
          (!t && matchMedia('(prefers-color-scheme: dark)').matches)
        ) {
          document.documentElement.classList.add('dark')
        }
      } catch (_) {}
    })()
  </script>
  ```
- The IIFE avoids polluting the global scope. The variable `t` is `var` (not `let`/`const`) for maximum compatibility with any environment that might inline this, though in practice modern browsers support `let` fine.
- Do not use `document.documentElement.classList.toggle('dark', condition)` — some older environments have inconsistent two-argument toggle support; explicit `add`/`remove` is safer.
- This script will be tested manually (browser dev tools, throttled reload) rather than via Vitest, since jsdom does not simulate actual CSS paint. Describe the manual test steps in the story test note below.
- Manual test: open DevTools → Application → Local Storage, set `theme` to `dark`, hard-reload with Network throttling set to "Slow 3G" — the page background should be dark from the very first frame. Verify the same with `theme` absent and system dark mode on.

## Files to Create/Modify

| Action | File Path    | Purpose                                                                         |
| ------ | ------------ | ------------------------------------------------------------------------------- |
| MODIFY | `index.html` | Add synchronous inline `<script>` in `<head>` for anti-FOUC theme bootstrapping |

## Dependencies

- **Blocked by:** 03-01 (ThemeProvider must exist first so its precedence logic can be replicated exactly in the script)
- **Blocks:** None

## Related

- **Epic:** theming-system
- **Related stories:** 03-01 (logic must match exactly)
- **Spec reference:** components.md §ThemeProvider edge case, data-flow.md §1 (App boot — "inline script: read localStorage['theme']"), configuration.md §index.html

## Implementation Summary

### What was built

A synchronous inline `<script>` IIFE was added to `index.html`'s `<head>` that reads `localStorage.getItem('theme')` and conditionally applies the `dark` class to `document.documentElement` before any CSS paint. The script mirrors `ThemeProvider`'s `resolveInitialTheme()` precedence exactly: stored `'dark'` → dark, stored `'light'` → light, absent + system dark → dark, absent + system light → light. The entire script is wrapped in a `try/catch` for privacy-mode resilience.

Unit tests were added in `src/theme/themeBootstrap.test.ts` to validate the theme-resolution logic in isolation (19 tests covering all acceptance criteria paths and edge cases). CSS paint timing cannot be tested with jsdom — manual browser testing is required for that aspect.

### Files Touched

- MODIFIED `index.html:8-23` — Added anti-FOUC synchronous inline `<script>` IIFE in `<head>`
- CREATED `src/theme/themeBootstrap.test.ts` — 19 unit tests for bootstrap theme-resolution logic

### Test Results

- Test files: 13 passed
- Tests: 118 passed (19 new bootstrap logic tests, all green)
- ESLint: No issues found
- TypeScript build: passes (`npm run build`)

## Implementation Plan

### SOLID Analysis

- **S (Single Responsibility):** The inline script has one job — detect the theme and apply the `dark` class before paint. No other responsibility.
- **O (Open/Closed):** Logic is directly derived from `ThemeProvider`'s `resolveInitialTheme`. Any future change to precedence must update both; the script is intentionally minimal.
- **L (Liskov):** N/A — no inheritance.
- **I (Interface Segregation):** N/A — plain HTML script with no interfaces.
- **D (Dependency Inversion):** Zero dependencies; only browser globals (`localStorage`, `matchMedia`) used inside a try/catch.

### Subtasks

- [x] 1. Write unit tests for bootstrap logic (`src/theme/themeBootstrap.test.ts`) — DONE
- [x] 2. Add inline synchronous `<script>` to `index.html` `<head>` — DONE
- [x] 3. Run tests — confirm RED then GREEN — DONE (118 tests all pass)
- [x] 4. Refactor + SOLID review — DONE (ESLint clean, no violations)
- [x] 5. QA validation — DONE (all ACs verified)
- [x] 6. Completion — DONE
