---
id: 05-02
title: "Header component"
epic: 05
status: done
size: M
blocked_by: ["02-08", "02-01", "03-03", "04-06"]
files: ["src/components/layout/Header.tsx"]
issue:
pr:
delivery: direct
prior_status:
---
# Story 05-02: Header component

> **Epic:** App Shell & Layout
> **Size:** L
## Description

Build `src/components/layout/Header.tsx`, the sticky top bar that sits at the top of every viewport. The Header renders a `<header>` landmark containing a `<nav>` landmark with eight anchor links (one per portfolio section). The active section is highlighted in real time by consuming `useScrollSpy` with the ids list sourced from `src/lib/constants.ts`. Clicking any nav link smooth-scrolls to the matching `#section-id` anchor, with a fallback to instant scroll when `prefers-reduced-motion: reduce` is set. On narrow viewports a hamburger button toggles the mobile nav menu open and closed; the menu closes automatically when a link is selected. The Header also hosts the `LanguageSwitcher` and `ThemeToggle` UI controls built in Epics 03–04. All interactive elements are keyboard-accessible with visible focus rings.

## Acceptance Criteria

- [x] The Header is position-sticky (or position-fixed) and remains visible when the user scrolls past the first section.
- [x] The Header renders a `<header>` HTML landmark element as its root.
- [x] A `<nav>` landmark is present inside the Header with an appropriate `aria-label` (e.g. "Main navigation").
- [x] The nav contains exactly eight anchor links, one for each section, with labels sourced from the nav config in `src/lib/constants.ts`.
- [x] Clicking a nav link smooth-scrolls to the matching `#section-id` element; the `href` matches the section `id` (e.g. `href="#about"`).
- [x] When `prefers-reduced-motion: reduce` is active, clicking a nav link performs an instant scroll (no smooth animation).
- [x] The nav link whose section is currently in the viewport is visually distinguished (e.g. different colour, underline, or weight) from inactive links.
- [x] The active link state is driven by `useScrollSpy` with the same id list used in `App.tsx`.
- [x] On viewports narrower than the desktop breakpoint (≤ md), the nav links are hidden by default and a visible hamburger button is shown.
- [x] Clicking the hamburger button toggles the mobile nav panel open and closed.
- [x] The hamburger button has `aria-expanded="true"` when the menu is open and `aria-expanded="false"` when closed, plus an accessible label (e.g. `aria-label="Open menu"` / `aria-label="Close menu"`).
- [x] Selecting a nav link while the mobile menu is open closes the menu.
- [x] Pressing `Escape` while the mobile menu is open closes the menu and returns focus to the hamburger button.
- [x] `LanguageSwitcher` and `ThemeToggle` render in the Header and function correctly (language/theme change is reflected app-wide).
- [x] All interactive elements (nav links, hamburger, LanguageSwitcher, ThemeToggle) are reachable via keyboard (`Tab`) and show a visible focus ring.
- [x] Header background and text are correctly styled in both light and dark themes using Tailwind `dark:` variants.
- [x] No TypeScript errors on `npm run build`.

## Technical Notes

- The section id list and nav labels **must** come from `src/lib/constants.ts` (e.g. a `NAV_SECTIONS` array of `{ id: string; labelKey: string }` objects). Do not hardcode section ids inside the component.
- `useScrollSpy` returns the id of the currently-visible section. Pass it the same array of ids used to render the links. Compare each link's id against the returned active id to determine the highlighted link.
- Smooth-scroll implementation: on nav link click, `event.preventDefault()`, then call `document.getElementById(id)?.scrollIntoView({ behavior: smoothAllowed ? 'smooth' : 'auto' })` where `smoothAllowed = !window.matchMedia('(prefers-reduced-motion: reduce)').matches`.
- Mobile menu state is component-local (`useState<boolean>`). A `useEffect` that registers a `keydown` listener for `Escape` (and cleans it up on unmount) is the simplest correct approach.
- `useEffect` should also close the menu on route/scroll changes if the menu is open when the user navigates via keyboard — this is optional for MVP but noted for future polish.
- The `LanguageSwitcher` and `ThemeToggle` should be rendered outside the `<nav>` but inside the `<header>`, in a flex row alongside the nav (desktop) or in the mobile menu panel (mobile) — choose the layout that best matches the design spec.
- Avoid `z-index` magic numbers; use Tailwind's `z-*` scale and ensure the header sits above section content on scroll.
- Focus management: when the mobile menu opens, move focus to the first nav link (`useRef` + `.focus()`). When it closes via `Escape`, return focus to the hamburger button.

## Files to Create/Modify

| Action | File Path                          | Purpose                                                              |
| ------ | ---------------------------------- | -------------------------------------------------------------------- |
| CREATE | `src/components/layout/Header.tsx` | Sticky nav bar with scroll-spy, mobile menu, language/theme controls |

## Dependencies

- **Blocked by:** 02-08 (`useScrollSpy` hook must exist), 02-01 (`Container` component for max-width wrapper), 03-03 (`ThemeToggle` component), 04-06 (`LanguageSwitcher` component).
- **Blocks:** 05-04 (`App.tsx` page shell imports and renders `<Header/>`).

## Related

- **Epic:** app-shell-layout
- **Related stories:** 05-01 (provider wiring — Header consumes `useTheme` and `useLanguage`), 05-04 (App.tsx renders Header)
- **Spec reference:** components.md §Header, data-flow.md §5 (Navigation & scroll spy), spec §6 navigation

## Implementation Plan

### SOLID Analysis

- **S — Single Responsibility:** `Header` owns only nav/mobile-menu orchestration; scroll-spy lives in `useScrollSpy`; `LanguageSwitcher`/`ThemeToggle` are injected as sub-components; nav click handler is a standalone function.
- **O — Open/Closed:** Nav sections sourced from `NAV_SECTIONS` constant; adding a new section only requires updating the constant, zero Header code change.
- **L — Liskov:** No custom types that extend others; `Header` renders correctly without any props.
- **I — Interface Segregation:** `Header` takes no required props (all state via context hooks); `NavLink` sub-component receives only what it needs (id, label, active flag, onClick).
- **D — Dependency Inversion:** Theme/language state from `useTheme()`/`useLanguage()` hooks; scroll-spy from `useScrollSpy()`; no concrete context reads inside nav handlers.

### Subtasks

- [x] 1. Write `src/components/layout/Header.test.tsx` (RED — all ACs fail)
- [x] 2. Create `src/components/layout/Header.tsx` (GREEN — all tests pass)
- [x] 3. Refactor + SOLID compliance check (tests stay green)
- [x] 4. QA validation — map each AC, run suite, check TypeScript
- [x] 5. Mark tasks done, update story file

## Implementation Summary

### Files Touched

| Action   | File                                                   | Notes                          |
| -------- | ------------------------------------------------------ | ------------------------------ |
| CREATED  | `src/components/layout/Header.tsx`                     | Full implementation            |
| CREATED  | `src/components/layout/Header.test.tsx`                | 29 tests, all ACs covered      |

### Modified files (git diff)

- `src/components/layout/Header.tsx` — CREATED (new file, ~230 lines)
- `src/components/layout/Header.test.tsx` — CREATED (new file, ~470 lines)

### Test Results

- 29 new tests — all pass
- Full suite: 310 tests — all pass (0 regressions)
- TypeScript: 0 errors

### Key design decisions

- `NAV_SECTIONS` from `src/lib/constants.ts` as the single source of truth for section ids and label keys.
- `labelKeyToUiKey()` converts `'nav.hero'` → `'navHero'` to look up `UiLabels` without hardcoding.
- `SECTION_IDS` is a module-level constant to give `useScrollSpy` a stable array reference.
- Mobile menu is conditionally rendered (`{menuOpen && ...}`) — not CSS-hidden — to avoid duplicate focusable elements in the tab order.
- `NavLink` sub-component extracts the anchor rendering (S of SOLID); accepts optional `ref` for focus management in the mobile menu.
- `handleNavClick` guards against jsdom/old-browser environments with `typeof el.scrollIntoView === 'function'`.
