---
epic: 03
slug: theming-system
title: "Theming System"
description: "This epic delivers the full light/dark theming infrastructure the portfolio needs, end to end."
issue:
pr:
delivery:
---
# Epic 03: Theming System

## Description

This epic delivers the full light/dark theming infrastructure the portfolio needs, end to end. It covers the React context layer (`ThemeProvider` + `useTheme`) that owns theme state, the browser-native anti-FOUC bootstrap script that prevents a flash of incorrect theme before React hydrates, and the user-facing `ThemeToggle` component that sits in the Header.

Theme initialisation follows a strict precedence: `localStorage['theme']` is checked first; if absent, the system preference (`prefers-color-scheme: dark`) is used; if neither indicates dark, light is the final default. Every user choice is persisted back to `localStorage` so the preference survives page reloads. The `dark` CSS class on `<html>` is the single source of truth for Tailwind v4's class-based dark variant, which was established in Epic 01 (`@custom-variant dark (&:where(.dark, .dark *))`).

The three stories are ordered by dependency: the provider must exist before either the bootstrap script (which must mirror its precedence logic exactly) or the toggle (which calls the provider's `toggle` function). The epic is intentionally narrow — no design tokens, no animations, no section components — so it can be completed, tested, and merged cleanly before the main wiring (Epic 05) begins.

## Goals

- Implement a `ThemeProvider` that manages `'light' | 'dark'` state, applies the `dark` class to `<html>`, and persists the choice to `localStorage`.
- Expose a stable `useTheme()` hook returning `{ theme, setTheme, toggle }` for all consumers.
- Eliminate theme flash on reload with a synchronous inline bootstrap script in `index.html` that matches `ThemeProvider`'s precedence logic exactly.
- Provide a `ThemeToggle` UI component with correct `aria-pressed` state, keyboard accessibility, and a unit test suite verifying DOM and localStorage effects.

## Scope

### In Scope

- `src/theme/ThemeProvider.tsx` — React context provider with state, init logic, and `<html>` class effect.
- `src/theme/useTheme.ts` — context accessor hook with runtime guard.
- Inline `<script>` block in `index.html` `<head>` for anti-FOUC theme bootstrapping.
- `src/components/ui/ThemeToggle.tsx` — accessible toggle button reflecting current theme.
- `src/components/ui/ThemeToggle.test.tsx` — Vitest + Testing Library unit tests.
- Privacy-mode resilience: `localStorage` access wrapped in `try/catch` in both the provider and the bootstrap script.

### Out of Scope

- Any design tokens, color palette definitions, or `@theme` block entries (Epic 02).
- Tailwind `dark:` utility class definitions (applied in individual section/UI components, later epics).
- The `Header` component that renders `ThemeToggle` in position (Epic 05).
- System-level `prefers-color-scheme` change listener (a future enhancement; not required for MVP).
- Server-side rendering or SSG considerations.

## Dependencies

- **Depends on:** Epic 01 story 01-02 (Tailwind v4 dark variant configured in `src/index.css`); Epic 02 story 02-04 (Button component used as the base for ThemeToggle).
- **Blocks:** Epic 05 story 05-01 (ThemeProvider wired into `main.tsx`), Epic 05 story 05-02 (Header renders ThemeToggle).

## Acceptance Criteria

- [ ] Switching theme in the running app toggles the `dark` class on `<html>` and updates all `dark:` styled elements without a page reload.
- [ ] Chosen theme is persisted to `localStorage['theme']` and restored correctly on the next page load.
- [ ] Hard-reloading the page with `dark` stored in `localStorage` shows no light flash before React mounts.
- [ ] `ThemeToggle` is keyboard-focusable, shows a visible focus ring, and `aria-pressed` reflects the active theme.
- [ ] When `localStorage` is unavailable, theme falls back to system preference (or light), and the toggle still functions for the session.
- [ ] `npm run test -- --run` passes all ThemeToggle tests with no console errors.
- [ ] `npm run build` completes without TypeScript errors after this epic is complete.

## Technical Notes

- Tailwind v4 dark mode is class-based via the custom variant defined in `src/index.css`: `@custom-variant dark (&:where(.dark, .dark *))`. The `ThemeProvider` must add/remove the `dark` class on `document.documentElement` — not `document.body` — for this selector to match.
- The bootstrap script in `index.html` must be synchronous (no `defer`, no `async`, no `type="module"`) so it blocks HTML parsing just long enough to set the class before any CSS is applied. It should be minimal — a single `try/catch` reading `localStorage` and calling `document.documentElement.classList.add('dark')`.
- When `ThemeProvider` mounts, it re-evaluates and applies the same precedence. Because the bootstrap script ran first, the DOM is already in the correct state; the provider's `useEffect` should not cause a visible re-paint, but must still set its React state to match so `useTheme()` consumers are consistent.
- Mock `window.matchMedia` and `localStorage` in Vitest tests using `jsdom` + `vi.stubGlobal` or a setup helper in `src/test/setup.ts`.
