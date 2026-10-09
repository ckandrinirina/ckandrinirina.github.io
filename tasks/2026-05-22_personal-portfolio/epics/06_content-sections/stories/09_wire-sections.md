---
id: 06-09
title: "Wire sections into App + scrollspy nav"
epic: 06
status: done
size: S
blocked_by: ["06-01", "06-02", "06-03", "06-04", "06-05", "06-06", "06-07", "06-08", "05-04"]
files: ["src/App.tsx"]
issue:
pr:
delivery: direct
prior_status:
---
# Story 06-09: Wire sections into App + scrollspy nav

> **Epic:** Content Sections
> **Size:** S
## Description

Update `src/App.tsx` to replace every section placeholder (from Epic 05 story 05-04) with
the real section components built in stories 06-01 through 06-08, in the correct page
order: Hero, About, Skills, Experience, Projects, Education, Languages, Contact. After
this story, the full single-page portfolio is assembled end-to-end. The story also
verifies that all eight `<section id>` attributes in `App.tsx` match the id list passed
to `useScrollSpy` in the Header (via the nav config in `src/lib/constants.ts`), so nav
link highlighting works correctly for every section.

## Acceptance Criteria

- [x] `src/App.tsx` imports and renders all eight section components in the order: Hero, About, Skills, Experience, Projects, Education, Languages, Contact.
- [x] Each section component is placed inside `<main>` and replaces the corresponding placeholder slot from 05-04.
- [x] The rendered DOM contains exactly one `<h1>` element (Hero's name).
- [x] Each non-Hero section renders an `<h2>` via its Section wrapper — ~~eight sections, eight `<h2>` elements total~~ **seven `<h2>` elements** (Hero owns the single `<h1>` and does not render an `<h2>`). Corrected from the original criterion; see Unplanned Changes.
- [x] The eight section `id` attributes in `App.tsx` (`hero`, `about`, `skills`, `experience`, `projects`, `education`, `languages`, `contact`) match the ids in the `useScrollSpy` config in `src/lib/constants.ts`.
- [x] Clicking a nav link in the Header smooth-scrolls to the correct target section. *(manual-test PASS)*
- [x] The active nav link in the Header is highlighted as the user scrolls past each section. *(manual-test PASS)*
- [x] The full page renders in French (default locale) with no console errors. *(verified via test with `localStorage['locale']='fr'`; production default depends on `navigator.language` resolution)*
- [x] Switching to English re-renders all sections with English content.
- [x] `npm run build` completes without TypeScript errors.
- [x] `npm run dev` displays the fully assembled portfolio page. *(manual-test PASS)*

## Technical Notes

- The section id values and order must be sourced from `src/lib/constants.ts` (the same array consumed by the Header's `useScrollSpy` call). If `App.tsx` was already mapping over `NAV_SECTIONS` to render placeholder `<section>` elements (as suggested in 05-04), the update is: import each section component by name and replace the generic placeholder render with the real component, keyed by `section.id`.
- If 05-04 used a `NAV_SECTIONS.map(...)` pattern, consider switching to explicit imports for each component — it is more readable and type-safe for a fixed set of eight sections. Alternatively keep the map and add a lookup object `{ hero: Hero, about: About, ... }` — either approach is acceptable.
- After wiring, run `npm run dev` and manually scroll through all eight sections, confirming: (a) each section's content is visible, (b) the nav highlights the correct item, (c) clicking each nav link lands on the right section.
- Verify that the `<h1>` uniqueness invariant holds: search the rendered DOM for `h1` elements and confirm exactly one is present.
- Check that the reveal animations (`useReveal`) fire correctly for each section as it enters the viewport — they depend on the `<section id>` being present in the DOM, which is now guaranteed.

## Files to Create/Modify

| Action | File Path     | Purpose                                                            |
| ------ | ------------- | ------------------------------------------------------------------ |
| MODIFY | `src/App.tsx` | Replace section placeholders with real section components in order |

## Dependencies

- **Blocked by:** 06-01 (Hero), 06-02 (About), 06-03 (Skills), 06-04 (Experience), 06-05 (Projects), 06-06 (Education), 06-07 (Languages), 06-08 (Contact), 05-04 (App shell with placeholder slots).
- **Blocks:** None directly — this story completing gates Epic 08 (deployment) and Epic 09 (QA).

## Related

- **Epic:** content-sections
- **Related stories:** 06-01 through 06-08 (all section implementations), 05-04 (App shell this story modifies)
- **Spec reference:** components.md §Tree, data-flow.md §5 (Navigation & scroll spy)

## Implementation Plan

### SOLID Analysis

- **S**: App.tsx composes the page shell — Header + 8 sections (in order) + Footer. Section components encapsulate their own content/rendering.
- **O**: Section additions/removals are the only reason App.tsx would change (matches NAV_SECTIONS as the canonical id source).
- **L**: All 8 section components are zero-prop default exports — substitutable.
- **I**: Each section reads only its own slice of `useLanguage()`. No bloated shared props.
- **D**: App depends on the abstract "Section" concept (zero-prop component) and resolves via direct imports; NAV_SECTIONS remains the single source of truth for ids.

### Design Decision

Use **explicit ordered JSX** (not `NAV_SECTIONS.map(...)` + component lookup). For a fixed set of 8 sections, direct imports are more readable and type-safe; no runtime indirection.

### Subtasks

- [x] RED: Add tests to `src/App.test.tsx` — exactly one h1, exactly seven h2s, FR-default smoke check, EN re-render smoke check.
- [x] GREEN: Modify `src/App.tsx` — explicit imports + ordered render of Hero, About, Skills, Experience, Projects, Education, Languages, Contact inside `<main>`.
- [x] REFACTOR: SOLID review pass; ensure NAV_SECTIONS still drives the id list (parity test stays green).
- [x] QA: Run full vitest suite + `npm run build` + `npm run lint`; verify all acceptance criteria.
- [x] Complete: Update story file (Status DONE), STORIES_INDEX, EPIC.md.

### Acceptance Criteria — Note on h2 count

The criterion "eight sections, eight `<h2>` elements total" is a typo: Hero owns the single `<h1>` and does not render an `<h2>`. The 7 non-Hero sections each render exactly one `<h2>` via the `Section` wrapper — actual count is **1 h1 + 7 h2s**. Tests assert 7 h2s; this discrepancy is logged in `## Unplanned Changes`.

## Unplanned Changes

- `src/App.test.tsx` — added test block "App wired sections (06-09)" with 6 new assertions (1 h1, 7 h2s, owner-name in h1, FR-default smoke, EN switch smoke, each NAV_SECTIONS id has content). Not in the original "Files to Create/Modify" but needed to verify the new acceptance criteria (the original AC list assumed App.tsx-only changes; tests are required to enforce them).
- Acceptance-criteria correction — "eight `<h2>` elements" in the original story was a typo. Corrected the AC line in place (struck through, replaced with "seven `<h2>` elements") because Hero's spec (06-01) explicitly says Hero owns the single h1 and does NOT use the Section wrapper for an h2.

## Implementation Summary

### Approach

Replaced the placeholder `NAV_SECTIONS.map(...)` loop in `src/App.tsx` with explicit, ordered JSX importing each section component directly. For a fixed set of 8 sections, explicit imports are more readable and type-safe than a runtime lookup map.

### Files Touched

| Action  | File                     | Lines |
| ------- | ------------------------ | ----- |
| MODIFY  | `src/App.tsx`            | 1-32 (full rewrite — was 19 lines, now 31 lines) |
| MODIFY  | `src/App.test.tsx`       | +61 lines (new `describe('App wired sections (06-09)')` block) |

### Tests

- **Added:** 6 new tests in `src/App.test.tsx` covering the new acceptance criteria.
- **Result:** 15/15 in `App.test.tsx` PASS; 439/439 in full suite PASS.

### Quality Gates

- ✓ `npm run build` — clean (0 TS errors, dist/ 471KB)
- ✓ `npm run lint` — clean
- ✓ `npx vitest run` — 439/439

### SOLID Compliance

- **S**: App.tsx remains a thin composition root (only renders Header, sections in order, Footer).
- **O**: Section additions require only one new line in App.tsx; sections are independently extensible internally.
- **L**: All 8 sections are zero-prop default exports — interchangeable.
- **I**: Each section reads only its own slice of `useLanguage()`.
- **D**: App depends on the abstract "Section" shape (zero-prop component); `NAV_SECTIONS` remains the single source of truth for ids (enforced by the existing parity test).
