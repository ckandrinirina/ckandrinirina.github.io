---
id: 06-03
title: "Skills section"
epic: 06
status: done
size: M
blocked_by: ["04-05", "02-05", "02-09"]
files: ["src/components/sections/Skills.tsx"]
issue:
pr:
delivery: direct
prior_status:
---
# Story 06-03: Skills section

> **Epic:** Content Sections
> **Size:** M
## Description

Implement `src/components/sections/Skills.tsx`, the scannable skills matrix section. The
component reads `content.skills` via `useLanguage()` and renders eight named skill groups
(Languages, Front-end frameworks & libraries, Back-end frameworks, Databases,
Tooling & DevOps, Testing, AI & specialized, Project & design tools) as wrap-layout
groups of `Badge` chips. Group labels are locale-aware. The section uses the shared
`Section` wrapper with `id="skills"` and is legible in both light and dark themes.

## Acceptance Criteria

- [x] The component renders inside a `<section id="skills">` (provided by the `Section` wrapper).
- [x] An `<h2>` heading is rendered by the `Section` wrapper with the locale-appropriate label.
- [x] Exactly eight skill groups are rendered, matching the groups defined in `content.skills`.
- [x] Each group has a visible label (e.g. "Languages", "Front-end", etc.) rendered in the active locale.
- [x] Every individual skill within a group is rendered as a `Badge` chip component.
- [x] The layout uses a wrap or grid arrangement so skills do not overflow on narrow viewports.
- [x] Switching the locale updates group labels without changing the skill names (skill names are language-neutral technical terms).
- [x] The section is legible in light mode and dark mode (Badge contrast passes in both themes).
- [x] No TypeScript errors on `npm run build`.

## Technical Notes

- `content.skills` is expected to be an array of `{ group: string; items: string[] }` objects (or equivalent shape from Epic 04 types); iterate over groups and render each group's `items` as `Badge` chips.
- Group labels come from the content object's locale-specific group names (or a UI label key) — they must update on locale switch.
- Use `Badge` from Epic 02 (story 02-05); do not re-implement chip styling inline.
- Use `Section` from Epic 02 (story 02-09); pass `id="skills"` and the localized heading.
- Suggested layout: each group in a `<div>` with a `<h3>` label and a wrapping `<div className="flex flex-wrap gap-2">` of Badges. Verify `<h3>` is appropriate given the `<h2>` Section heading (it is — no heading level is skipped).
- If `content.skills` groups differ between locales in label only (items stay the same), ensure the data shape supports this; flag any mismatch to the Epic 04 implementer.

## Files to Create/Modify

| Action | File Path                            | Purpose                                        |
| ------ | ------------------------------------ | ---------------------------------------------- |
| CREATE | `src/components/sections/Skills.tsx` | Skills matrix section with grouped Badge chips |

## Dependencies

- **Blocked by:** 04-05 (LanguageProvider — `useLanguage()` must exist), 02-05 (Badge), 02-09 (Section wrapper).
- **Blocks:** 06-09 (wire sections into App).

## Related

- **Epic:** content-sections
- **Related stories:** 06-04 (Experience — also uses Badge for tech highlights), 06-05 (Projects — also uses Badge for tech tags), 06-09 (App wiring)
- **Spec reference:** spec §5.3 (Skills matrix)

## Implementation Plan

- [x] Phase 4 — Write tests (RED): `src/components/sections/Skills.test.tsx`
- [x] Phase 5 — Implement `src/components/sections/Skills.tsx` (GREEN)
- [x] Phase 6 — Refactor + SOLID review
- [x] Phase 7 — QA validation
- [x] Phase 8 — Update story file + mark complete

## Implementation Summary

**Implemented:** `src/components/sections/Skills.tsx` — a locale-aware React 19 component that renders the skills matrix section. It reads `content.skills` (an array of `SkillGroup` objects) via `useLanguage()`, wraps the section in the `Section` layout component (id="skills", title from `t('navSkills')`), and renders each group as an `<h3>` label + `flex-wrap` row of `Badge` chips.

**Tests:** `src/components/sections/Skills.test.tsx` — 15 tests covering all 9 acceptance criteria including section wrapper, group count, Badge rendering, wrap layout, locale switching (FR/EN), and render stability.

**Files Touched:**

| Status | File | Lines |
|---|---|---|
| CREATED | `src/components/sections/Skills.tsx` | 1–25 |
| CREATED | `src/components/sections/Skills.test.tsx` | 1–184 |

**Test results:** 344/344 pass (26 test files). `npm run build` succeeds with zero TypeScript errors. ESLint: no issues.
