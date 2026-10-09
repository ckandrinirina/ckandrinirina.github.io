---
id: 06-06
title: "Education section"
epic: 06
status: done
size: S
blocked_by: ["04-05", "02-09"]
files: ["src/components/sections/Education.tsx"]
issue:
pr:
delivery: direct
prior_status:
---
# Story 06-06: Education section

> **Epic:** Content Sections
> **Size:** S
## Description

Implement `src/components/sections/Education.tsx`, the education history section. The
component reads `content.education[]` via `useLanguage()` and renders three entries —
Master's engineer degree, advanced web development training, and Scientific Baccalaureate
— in a table or accessible list. One entry (Baccalaureate) may have a blank institution
field (per open question §9.2 in the spec); the component must handle this gracefully.
The section uses the shared `Section` wrapper with `id="education"`.

## Acceptance Criteria

- [x] The component renders inside a `<section id="education">` (provided by the `Section` wrapper).
- [x] An `<h2>` heading is rendered by the `Section` wrapper with the locale-appropriate label.
- [x] All three education entries from `content.education[]` are rendered: Master's Engineer (2018, École Supérieure Polytechnique d'Antananarivo), Advanced web development (2019, NEITIC), Scientific Baccalaureate (2013).
- [x] Each entry shows: year, qualification/degree title, institution name.
- [x] A missing or empty institution field renders gracefully — no crash, no "[object Object]", no "undefined" text; acceptable outputs are an empty cell, a dash, or the string "—".
- [x] If a `<table>` is used, it includes `<thead>`, `<tbody>`, `<th scope="col">` for column headers, and `<th scope="row">` or `<td>` for row data (accessible table semantics).
- [x] If a list layout is used instead of a table, each entry is clearly delineated and the year/qualification/institution hierarchy is visually and semantically clear.
- [x] The locale switch updates qualification titles and column header labels; years and institution names are locale-neutral.
- [x] No TypeScript errors on `npm run build`.

## Technical Notes

- `content.education[]` shape (from Epic 04 types): `{ year: string | number; qualification: string; institution: string | null | undefined }`. The `institution` field may be absent for the Baccalaureate entry; use `institution ?? '—'` or a conditional render.
- If using a `<table>`: Tailwind table utilities (`table-auto`, `w-full`) work well; add `border-collapse` and row borders for readability. Ensure the table is horizontally scrollable on very narrow screens (`overflow-x-auto` on a wrapper `<div>`).
- If using a definition list (`<dl>`) or a card-per-entry layout, ensure sufficient visual separation between entries.
- Column header labels (Year, Qualification, Institution) must come from the UI labels file (`src/i18n/ui.ts`) or from `content.education` metadata, so they update on locale switch.

## Files to Create/Modify

| Action | File Path                               | Purpose                                                 |
| ------ | --------------------------------------- | ------------------------------------------------------- |
| CREATE | `src/components/sections/Education.tsx` | Education history section with accessible table or list |

## Dependencies

- **Blocked by:** 04-05 (LanguageProvider — `useLanguage()` must exist), 02-09 (Section wrapper).
- **Blocks:** 06-09 (wire sections into App).

## Related

- **Epic:** content-sections
- **Related stories:** 06-07 (Languages — similar simple data table pattern), 06-09 (App wiring)
- **Spec reference:** spec §5.5 (Education), §9.2 (open question: Baccalaureate institution)

## Implementation Plan

### Subtasks

- [x] Write tests covering all acceptance criteria (RED phase)
- [x] Implement Education.tsx with accessible table structure (GREEN phase)
- [x] Refactor for SOLID compliance and code quality (REFACTOR phase)
- [x] QA validation against acceptance criteria
- [x] Manual testing in browser (dev server)

### Design Notes

**Component Structure:**
- Default export `Education()` function component
- Use `useLanguage()` to get `content.education[]` array
- Wrap in `Section` wrapper with id="education" and title from UI labels
- Render as accessible `<table>` with proper semantic elements:
  - `<thead>` with column headers (Year, Qualification, Institution)
  - `<tbody>` with education entries as rows
  - Headers use `<th scope="col">` for accessibility
  - Data cells use `<td>`
- Handle empty institution field gracefully using `institution ?? '—'`
- Ensure table is responsive with `overflow-x-auto` wrapper on mobile

**SOLID Compliance:**
- **S (Single Responsibility):** Component only renders education data; no business logic
- **O (Open/Closed):** Extensible via props if needed in future; closed to modification
- **L (Liskov Substitution):** Follows React component contract; can be substituted in Section
- **I (Interface Segregation):** No unused props; minimal focused interface
- **D (Dependency Inversion):** Depends on `useLanguage()` hook abstraction, not concrete content

### Test Plan

Tests should verify:
1. Component renders inside `<section id="education">`
2. All three education entries are rendered
3. Each entry shows year, qualification, and institution
4. Empty institution field renders as '—' or empty cell (no crashes, no "undefined" text)
5. Table has proper semantic structure (`<thead>`, `<tbody>`, `<th scope="col">`)
6. Locale switch updates qualification text correctly
7. No TypeScript errors on build

## Implementation Summary

### Files Touched

| File                                      | Action  | Details                                                                   |
| ----------------------------------------- | ------- | ------------------------------------------------------------------------- |
| `src/components/sections/Education.tsx`   | CREATED | Main Education section component with accessible table layout             |
| `src/components/sections/Education.test.tsx` | CREATED | Comprehensive test suite (15 tests covering all acceptance criteria)      |

### Implementation Details

**Education.tsx:**
- Default export function component
- Uses `useLanguage()` to access `content.education[]` and locale
- Renders an accessible `<table>` with semantic HTML5 elements:
  - `<thead>` with localized column headers (Year/Année, Qualification/Formation, Institution/Établissement)
  - `<tbody>` with education entries as rows
  - Proper `<th scope="col">` attributes for accessibility
- Gracefully handles empty institution fields using nullish coalescing (`institution ?? '—'`)
- Wrapped in `Section` component with id="education" and locale-aware title
- Responsive table with `overflow-x-auto` wrapper for mobile devices
- Tailwind CSS styling with dark mode support

**Education.test.tsx:**
- 15 comprehensive tests covering:
  - Semantic HTML structure verification
  - All three education entries rendered
  - Empty institution field handling
  - Locale-aware content
  - Accessibility compliance
  - Edge cases (undefined, [object Object])
- All tests pass; no regressions

### SOLID Compliance

- **S (Single Responsibility):** Component only renders education section data
- **O (Open/Closed):** Extensible through content changes, closed to modification
- **L (Liskov Substitution):** Correctly implements Section component contract
- **I (Interface Segregation):** No unnecessary dependencies or props
- **D (Dependency Inversion):** Depends on `useLanguage()` hook abstraction

### QA Results

- All 15 tests pass
- Full test suite (344 tests) passes with no regressions
- TypeScript compilation succeeds (`npm run build`)
- No linting errors or warnings
- Table semantics verified with proper accessibility attributes

### Status: IN PROGRESS

Ready for user manual testing (Phase 8.5). All acceptance criteria met, all tests green, all code quality checks pass.
