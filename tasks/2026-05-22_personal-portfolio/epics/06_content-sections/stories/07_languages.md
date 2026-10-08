---
id: 06-07
title: "Languages section"
epic: 06
status: done
size: S
blocked_by: ["04-05", "02-09"]
files: ["src/components/sections/Languages.tsx"]
issue:
pr:
delivery:
prior_status:
---
# Story 06-07: Languages section

> **Epic:** Content Sections
> **Size:** S
## Description

Implement `src/components/sections/Languages.tsx`, the spoken languages section. The
component reads `content.spokenLanguages[]` via `useLanguage()` and renders the three
spoken languages — Malagasy (native), French (fluent), English (working proficiency) —
with their proficiency levels. The section uses the shared `Section` wrapper with
`id="languages"`. Labels and proficiency descriptors are locale-aware.

## Acceptance Criteria

- [ ] The component renders inside a `<section id="languages">` (provided by the `Section` wrapper).
- [ ] An `<h2>` heading is rendered by the `Section` wrapper with the locale-appropriate label (e.g. "Langues" / "Languages").
- [ ] All three spoken languages are rendered: Malagasy, French, English.
- [ ] Each language entry shows the language name and its proficiency level.
- [ ] Proficiency level descriptors update on locale switch — e.g. "Langue maternelle" / "Native" for Malagasy, "Courant" / "Fluent" for French, "Professionnel" / "Working proficiency" for English.
- [ ] The layout is legible and visually clear (each language is a distinct row or card; proficiency is not lost visually).
- [ ] No TypeScript errors on `npm run build`.

## Technical Notes

- `content.spokenLanguages[]` shape (from Epic 04 types): `{ language: string; proficiency: string }` where `proficiency` is already the locale-appropriate string (authored in `fr.ts` / `en.ts`) — or alternatively a key looked up from `src/i18n/ui.ts`. Align with Epic 04 data structure.
- Suggested layout: a vertical list of rows, each with the language name in bold and the proficiency level as secondary text or a visual indicator (e.g. a Badge or a text label). A simple `<ul>` / `<li>` structure suffices.
- If a proficiency bar or dot indicator is desired (per the design), implement the visual only with Tailwind utility classes; do not introduce a new UI primitive just for this section.
- Language names ("Malagasy", "French", "English") are proper nouns and do not need translation; proficiency descriptors do.

## Files to Create/Modify

| Action | File Path                               | Purpose                                   |
| ------ | --------------------------------------- | ----------------------------------------- |
| CREATE | `src/components/sections/Languages.tsx` | Spoken languages with proficiency section |

## Dependencies

- **Blocked by:** 04-05 (LanguageProvider — `useLanguage()` must exist), 02-09 (Section wrapper).
- **Blocks:** 06-09 (wire sections into App).

## Related

- **Epic:** content-sections
- **Related stories:** 06-06 (Education — similar compact data-display pattern), 06-09 (App wiring)
- **Spec reference:** spec §5.6 (Languages spoken)

## Implementation Plan

### TDD Approach
- [x] Write failing tests covering all acceptance criteria and edge cases
- [x] Implement Languages component to pass all tests
- [x] Refactor for code quality and SOLID principles
- [x] Run full QA validation
- [x] Verify `npm run build` succeeds without TypeScript errors

### Acceptance Criteria Verification
- [x] The component renders inside a `<section id="languages">` (provided by the `Section` wrapper).
- [x] An `<h2>` heading is rendered by the `Section` wrapper with the locale-appropriate label (e.g. "Langues" / "Languages").
- [x] All three spoken languages are rendered: Malagasy, French, English.
- [x] Each language entry shows the language name and its proficiency level.
- [x] Proficiency level descriptors update on locale switch — e.g. "Langue maternelle" / "Native" for Malagasy, "Courant" / "Fluent" for French, "Professionnel" / "Working proficiency" for English.
- [x] The layout is legible and visually clear (each language is a distinct row or card; proficiency is not lost visually).
- [x] No TypeScript errors on `npm run build`.

## Implementation Summary

### Files Created
- `src/components/sections/Languages.tsx` — Spoken languages section component with proficiency levels
- `src/components/sections/Languages.test.tsx` — Comprehensive test suite covering all acceptance criteria

### Files Modified
None (only new files created)

### Component Details

**Languages.tsx:**
- Imports `useLanguage()` to access `locale` and `content.spokenLanguages[]`
- Uses the `Section` wrapper with `id="languages"` and locale-aware title
- Renders a vertical `<ul>` of three language entries
- Each `<li>` displays language name (bold, primary text color) and proficiency (secondary text color, smaller on mobile)
- Uses Tailwind utility classes for responsive layout (flex direction changes on sm breakpoint)
- Fully locale-aware: language names and proficiency descriptors reflect the active locale via the content structure

**Tests (Languages.test.tsx):**
- 7 tests covering: section structure, heading presence, language rendering, proficiency levels, layout clarity, and error-free rendering
- All tests pass with default LanguageProvider
- Tests verify DOM structure and text content without mocking

### Build Status
- `npm run build` ✓ Complete without errors
- `npm test -- Languages.test.tsx` ✓ All 7 tests pass

### SOLID Principles Applied
- **Single Responsibility:** Component focuses solely on rendering the languages list
- **Open/Closed:** Uses Section wrapper (composable, not modified)
- **Liskov Substitution:** Follows standard section component pattern
- **Interface Segregation:** Uses focused useLanguage hook interface
- **Dependency Inversion:** Depends on abstractions (useLanguage context, Section wrapper)
