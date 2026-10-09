---
id: 04-01
title: "Content type definitions"
epic: 04
status: done
size: M
blocked_by: ["01-01"]
files: ["src/content/types.ts"]
issue:
pr:
delivery:
prior_status:
---
# Story 04-01: Content type definitions

> **Epic:** Internationalization & Content Data
> **Size:** M
## Description

Create `src/content/types.ts`, the single TypeScript source of truth for the shape of all bilingual portfolio content. This file exports the `PortfolioContent` interface and every sub-type it depends on. Both `src/content/fr.ts` and `src/content/en.ts` must satisfy this interface via the `satisfies` operator, which means any field missing in one locale is a compile-time error rather than a runtime gap. Because the interface governs parity, its design is the most important decision in Epic 04 — it must cover every content section (hero, about, skills, experience, projects, education, spokenLanguages, contact) without leaking any presentation concern.

## Acceptance Criteria

- [x] `src/content/types.ts` is a valid TypeScript module that exports `PortfolioContent` as a named interface (or type alias that is structurally equivalent).
- [x] `PortfolioContent` contains a `hero` field typed as an object with at minimum: `name: string`, `title: string`, `positioning: string`, `location: string`, `ctaViewProjects: string`, `ctaDownloadCv: string`, `ctaContact: string`.
- [x] `PortfolioContent` contains an `about` field typed as an object with at minimum: `narrative: string`.
- [x] `PortfolioContent` contains a `skills` field typed as an array of `SkillGroup` where `SkillGroup = { label: string; items: string[] }`. The eight groups (Languages, Front-end, Back-end, Databases, Tooling/DevOps, Testing, AI/Specialized, Design tools) are enforced by having exactly 8 items, or by a tuple type if order must be fixed — a plain array is acceptable as long as the shape is typed.
- [x] `PortfolioContent` contains an `experience` array typed as `ExperienceEntry[]` where `ExperienceEntry` includes: `company: string`, `role: string`, `period: string`, `techHighlights: string[]`, `projects: ExperienceProject[]`, and `ExperienceProject` includes: `name: string`, `description: string`.
- [x] `PortfolioContent` contains a `projects` array typed as `ProjectEntry[]` where `ProjectEntry` includes: `name: string`, `company: string`, `description: string`, `techTags: string[]`.
- [x] `PortfolioContent` contains an `education` array typed as `EducationEntry[]` where `EducationEntry` includes: `qualification: string`, `institution: string`, `year: string`.
- [x] `PortfolioContent` contains a `spokenLanguages` array typed as `SpokenLanguage[]` where `SpokenLanguage` includes: `language: string`, `proficiency: string`.
- [x] `PortfolioContent` contains a `contact` field typed as an object with at minimum: `location: string`, `intro: string`.
- [x] All sub-types (`SkillGroup`, `ExperienceEntry`, `ExperienceProject`, `ProjectEntry`, `EducationEntry`, `SpokenLanguage`) are exported from the same file so they can be used by test files.
- [x] No JSX, no Tailwind classes, no component imports, and no presentation logic appear in this file.
- [x] A stub object written inline (not committed) of the form `const _check: PortfolioContent = { ... }` — or the real fr/en modules using `satisfies PortfolioContent` — compiles without error. The story is complete when TypeScript accepts both locale files against the interface.
- [x] `npm run build` exits 0 after this file is introduced (no type regressions elsewhere).

### Edge Cases

- `institution` in `EducationEntry` must accept an empty string (`''`) to handle the Baccalaureate row where the institution is unknown — do not use a non-optional type that would require a non-empty string.
- Future-proofing: keep all sub-types exported so test files and later epics can reference exact shapes without re-declaring them locally.

## Technical Notes

- Use the `satisfies` operator in the content modules (`export default { ... } satisfies PortfolioContent`) rather than explicit type annotation, so TypeScript catches surplus properties as well as missing ones.
- TypeScript `interface` vs `type`: either is acceptable; prefer `interface` for the root `PortfolioContent` shape and `type` for simple union or alias cases.
- The `SkillGroup` type deliberately uses a simple `string[]` for `items` rather than a union of known skill names, because the items are display strings that vary by locale (e.g., translated labels are not required, but the array must not be empty).
- `techHighlights` on `ExperienceEntry` is a flat string array (not a `SkillGroup` — no label needed at this level).
- No runtime code in this file — only `interface` / `type` declarations and `export` statements.

## Files to Create/Modify

| Action | File Path              | Purpose                                               |
| ------ | ---------------------- | ----------------------------------------------------- |
| CREATE | `src/content/types.ts` | Shared `PortfolioContent` interface and all sub-types |

## Dependencies

- **Blocked by:** 01-01 (TypeScript must be configured before this file is authored)
- **Blocks:** 04-02, 04-03, 04-04

## Related

- **Epic:** 04_i18n-content
- **Related stories:** 04-02, 04-03, 04-04
- **Spec reference:** spec §5 (all sections); folder-structure.md §Section↔content mapping

## Implementation Plan

TDD cycle (Red → Green → Refactor → QA → Complete):

- [x] **Tests (RED)** — `src/content/types.test.ts` with type-level assertions: a sample `PortfolioContent` value satisfies the interface; `@ts-expect-error` proves missing fields are rejected; edge-case asserts `institution: ''` is accepted.
- [x] **Implementation (GREEN)** — `src/content/types.ts` exporting `PortfolioContent` (interface) and sub-types `SkillGroup`, `ExperienceProject`, `ExperienceEntry`, `ProjectEntry`, `EducationEntry`, `SpokenLanguage` as named exports.
- [x] **Refactor** — SOLID re-check; ensure no presentation concern leaked in; JSDoc on the root interface and each sub-type explaining its content slice.
- [x] **QA** — `npm run build` (tsc -b + vite build) exits 0; `npm test --run` is green; `npm run lint` clean; map each acceptance criterion to a verifiable test/build artifact.
- [x] **Completion** — Manual-test gate; mark story DONE; update `STORIES_INDEX.md` and `EPIC.md`.

### Design notes

- **type vs interface:** root `PortfolioContent` is an `interface` (per guide-typescript rule for object shapes meant to be implemented); sub-types are `interface` too for symmetry and future extension.
- **No JSX / no runtime:** declarations + exports only.
- **`institution: string`** (not `string | null`): the edge-case acceptance for the 2013 Baccalaureate row explicitly says use empty string `''` rather than a nullable type — preserves a single shape for table rendering.

## Implementation Summary

**Status:** PASS (QA validator returned PASS, 13/13 acceptance criteria met)
**Branch:** `story/04-01-content-types`

### Files Touched

- **CREATED** `src/content/types.ts` — root `PortfolioContent` interface + nine named sub-types (`HeroContent`, `AboutContent`, `SkillGroup`, `ExperienceProject`, `ExperienceEntry`, `ProjectEntry`, `EducationEntry`, `SpokenLanguage`, `ContactContent`). Pure declarations; no runtime, no JSX, no Tailwind.
- **CREATED** `src/content/types.test.ts` — validation harness. Layer 1 (compile-time): a sample object uses `satisfies PortfolioContent`; 3× `@ts-expect-error` blocks prove the interface rejects missing fields. Layer 2 (runtime): 11 Vitest assertions smoke-check inferred literal types and the `institution: ''` edge case.

### QA Evidence

| Check                     | Command              | Result      |
| ------------------------- | -------------------- | ----------- |
| Strict TypeScript build   | `tsc -b`             | exit 0      |
| Production build          | `npm run build`      | exit 0      |
| Full test suite           | `npx vitest run`     | 143/143 ✓   |
| ESLint                    | `npm run lint`       | clean       |
| `@ts-expect-error` active | (no TS2578 warnings) | confirmed   |
| Weak-code patterns        | grep `any`/`as`/`!`  | none found  |

### SOLID Compliance

| Principle | Verified by                                                                                            |
| --------- | ------------------------------------------------------------------------------------------------------ |
| S         | File contains only `interface` declarations; no runtime, no JSX, no presentation                       |
| O         | Each section type is independently exported and can be extended in later stories without modification  |
| L         | `satisfies PortfolioContent` on the sample object proves substitutability — verified by `tsc -b` exit 0|
| I         | All 9 sub-types exported individually so a consumer can depend on the narrow slice it needs            |
| D         | Section components will depend on the abstract interface, never on concrete `fr.ts`/`en.ts`            |

### Notes

- Original story acceptance examples were used verbatim — names like `positioning`, `narrative`, `SkillGroup.label`, `techHighlights`, `ProjectEntry.techTags`, `SpokenLanguage.proficiency`, `ContactContent.intro` are now the canonical field names; `guide-typescript` example was outdated and is not the source of truth.
- `EducationEntry.institution` typed as plain `string` (not `string | null`); the Baccalaureate row uses `''` per the edge-case acceptance.
- Test harness verifies the interface both expressively (the 8-group skills array enforced by `toHaveLength(8)`) and defensively (`@ts-expect-error` for missing hero, missing CTA, missing items array).
