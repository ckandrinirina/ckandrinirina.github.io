---
id: 04-03
title: "English content module"
epic: 04
status: done
size: M
blocked_by: ["04-01"]
files: ["src/content/en.ts"]
issue:
pr:
delivery:
prior_status:
---
# Story 04-03: English content module

> **Epic:** Internationalization & Content Data
> **Size:** L
## Description

Author `src/content/en.ts`, the English-locale content module. This file mirrors `src/content/fr.ts` in every structural aspect — same interface, same keys, same array lengths, same ordering — but every user-visible string is idiomatic English. The `PortfolioContent` interface guarantees structural parity at compile time, and the dedicated parity test (story 04-07) verifies equal array lengths at runtime. This story exists because EN/FR parity cannot be assumed; it must be explicitly authored and verified.

The content is a faithful translation of the French module. Skill names and technology names (React, NestJS, PostgreSQL…) are identical in both locales and require no translation. Only narrative copy — the hero positioning line, the about paragraph, project descriptions, proficiency labels, and the contact intro — requires genuine localization into idiomatic English.

## Acceptance Criteria

- [x] `src/content/en.ts` compiles without error: the exported object uses `satisfies PortfolioContent` and TypeScript accepts it.
- [x] `hero` section: `name` is `"Erick Andrinirina"`, `title` is `"Fullstack JavaScript Engineer"`, `positioning` references 7 years of experience in English, `location` is `"Antananarivo, Madagascar"`, and all three CTA label strings are present in English.
- [x] `about.narrative` is an idiomatic English paragraph matching spec §5.2 in meaning (experienced Fullstack developer, 7 years, React/Angular/Node.js/Symfony/Laravel, MongoDB/PostgreSQL/MySQL, motivated by technical challenges).
- [x] `skills` contains exactly 8 `SkillGroup` entries; group labels are in English ("Languages", "Front-end frameworks & libraries", "Back-end frameworks", "Databases", "Tooling & DevOps", "Testing", "AI & Specialized", "Project & design tools"); `items` arrays are identical to those in `fr.ts` (technology names do not change between locales).
- [x] `experience` array has exactly 7 entries in the same reverse-chronological order as `fr.ts`, with the same companies, roles, and periods — only the prose descriptions of projects are translated to English.
- [x] Each experience entry's `projects` array contains the same number of entries as the corresponding entry in `fr.ts`; project `name` values are identical (proper nouns); `description` values are in English.
- [x] `projects` (curated list) has the same number of entries as `fr.ts`; `name` and `company` values are identical; `description` strings are in English; `techTags` arrays are identical.
- [x] `education` array has exactly 3 entries in the same order as `fr.ts`; `qualification` strings are translated to English; `institution` values are identical (proper nouns); `year` values are identical; the Baccalaureate entry still has `institution: ''`.
- [x] `spokenLanguages` has exactly 3 entries with English proficiency labels: Malagasy (Native), French (Fluent), English (Working proficiency).
- [x] `contact.location` is exactly `"Antananarivo, Madagascar"`. No full address.
- [x] `contact.intro` is a short English invitation to get in touch.
- [x] No TypeScript `// @ts-ignore` or `as unknown as` casts appear in this file.
- [x] `npm run build` exits 0 after this file is added.
- [x] `src/content/content.test.ts` (story 04-07) passes for this module when run after authoring.

### Edge Cases

- Technology names (React, Node.js, PostgreSQL, etc.) and proper nouns (company names, project names) must remain unchanged between locales — do not translate "SOKA CLUB" to "SOKA CLUB [EN]" or alter stack names.
- `institution: ''` for the Baccalaureate entry must be preserved in both locales so the parity test does not flag a structural divergence.
- `techTags` arrays on `ProjectEntry` items must be identical between `fr.ts` and `en.ts`; only `description` and group `label` strings differ between locales.

## Technical Notes

- Export pattern: `export default { ... } satisfies PortfolioContent` — identical to the French module.
- A practical workflow: copy `fr.ts`, then translate only the user-visible narrative strings (`positioning`, `narrative`, `description` fields, skill group `label` strings, proficiency strings, CTA labels, contact intro). Leave technology names, company names, project names, and period strings unchanged.
- If any English phrasing feels ambiguous compared to the French original, prefer clarity over literal translation — the goal is idiomatic English, not word-for-word rendering.

## Files to Create/Modify

| Action | File Path           | Purpose                   |
| ------ | ------------------- | ------------------------- |
| CREATE | `src/content/en.ts` | English portfolio content |

## Dependencies

- **Blocked by:** 04-01 (PortfolioContent interface must exist before this file can satisfy it)
- **Blocks:** 04-05, 04-07

## Related

- **Epic:** 04_i18n-content
- **Related stories:** 04-01, 04-02, 04-07
- **Spec reference:** spec §5 (all subsections)

## Implementation Plan

### SOLID Analysis

- **S:** `en.ts` is a pure data module — no logic, no JSX, no side effects.
- **O:** Extending `PortfolioContent` in `types.ts` triggers a compile error in `en.ts` until the new field is added — open for extension.
- **L:** `en` satisfies `PortfolioContent` fully; any consumer of the interface can swap in `en` without behavioral differences.
- **I:** Interface is already section-segregated (`HeroContent`, `AboutContent`, etc.).
- **D:** `en.ts` depends only on the `PortfolioContent` interface from `./types`, not on `fr.ts`.

### Subtasks

- [x] 1. Write tests for `en.ts` (RED phase) — `src/content/en.test.ts`
- [x] 2. Create `src/content/en.ts` (GREEN phase)
- [x] 3. Refactor & verify SOLID compliance
- [x] 4. QA validation — run full suite, map acceptance criteria
- [x] 5. Completion — update story file and index

## Implementation Summary

### Files Touched

| Action   | File                                                                                        |
| -------- | ------------------------------------------------------------------------------------------- |
| CREATED  | `src/content/en.ts`                                                                         |
| CREATED  | `src/content/en.test.ts`                                                                    |
| MODIFIED | `tasks/2026-05-22_personal-portfolio/STORIES_INDEX.md:28` (status TODO → IN PROGRESS)      |
| MODIFIED | `tasks/2026-05-22_personal-portfolio/epics/04_i18n-content/stories/03_content-en.md:5,105` (status + plan + summary) |

### Build / Test Results

- `npm run test -- --run`: **174 tests pass** (16 test files)
- `npm run build`: **exits 0** (TypeScript compilation + Vite bundle succeed)

### Summary

Authored `src/content/en.ts`, the English portfolio content module, faithful to spec §5.
The file exports a `satisfies PortfolioContent` default object covering all eight sections:
hero (with exact `name`, `title`, `location`, `positioning`, and three CTA labels),
`about.narrative` (idiomatic English paragraph referencing 7 years, React/Angular/Node.js/Symfony/Laravel, MongoDB/PostgreSQL/MySQL),
8 `SkillGroup` entries with English labels and unchanged `items` arrays,
7 experience entries in reverse-chronological order with all projects translated,
5 curated project cards,
3 education entries (Baccalaureate with `institution: ''` and `year: '2013'`),
3 spoken languages (Malagasy/Native, French/Fluent, English/Working proficiency),
and contact with `location: "Antananarivo, Madagascar"` and a short English `intro`.
No `// @ts-ignore` or `as unknown as` casts are present.
