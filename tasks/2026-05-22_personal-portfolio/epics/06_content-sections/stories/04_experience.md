---
id: 06-04
title: "Experience section"
epic: 06
status: done
size: M
blocked_by: ["04-05", "02-06", "02-09"]
files: ["src/components/sections/Experience.tsx"]
issue:
pr:
delivery: direct
prior_status:
---
# Story 06-04: Experience section

> **Epic:** Content Sections
> **Size:** L
## Description

Implement `src/components/sections/Experience.tsx`, the professional experience section.
The component reads `content.experience[]` via `useLanguage()` and renders all seven roles
in reverse-chronological order (most recent first) as `Card` components. Each card
displays the company name, job title, employment period, a list of tech stack highlights,
and a set of project bullets describing what was built during that role. The section uses
the shared `Section` wrapper with `id="experience"` and adapts to the active locale.

## Acceptance Criteria

- [x] The component renders inside a `<section id="experience">` (provided by the `Section` wrapper).
- [x] An `<h2>` heading is rendered by the `Section` wrapper with the locale-appropriate label.
- [x] All seven roles are rendered, ordered most-recent-first (SOKA/YAS Madagascar first, INGENOSYA last).
- [x] Each role is rendered as a `Card` component.
- [x] Each Card displays: company name, job title, employment period (e.g. "Jan 2025 – present").
- [x] Each Card displays tech stack highlights for that role.
- [x] Each Card displays one or more project bullets describing the projects delivered in that role.
- [x] The layout is responsive: cards stack on mobile, and use a comfortable readable width on desktop.
- [x] Switching the locale updates any locale-aware text (descriptions, bullet labels) without a page reload.
- [x] No TypeScript errors on `npm run build`.

## Technical Notes

- `content.experience[]` is an array of role objects; the expected shape (from Epic 04 types) is approximately: `{ company: string; role: string; period: string; techHighlights: string[]; projects: { name: string; description: string }[] }`.
- Use `Card` from Epic 02 (story 02-06); compose card content inside with standard HTML elements (`<h3>` for company or role name, `<p>`, `<ul>`, etc.).
- Tech highlights can be rendered as `Badge` chips (same as Skills) or as plain comma-separated text — use Badges if the design shows chips; plain text otherwise. Match whatever the design file specifies.
- Project bullets within a card: render as a `<ul>` with `<li>` items for semantic list structure and screen-reader clarity.
- The employment period string is locale-neutral (month abbreviations are the same in EN and FR in the content files, or the content files use full locale-specific strings — align with what Epic 04 produces).
- "present" in the current role's period must match the active locale (French: "aujourd'hui" or "en cours"). Confirm the shape with the Epic 04 implementer; if the content files return a translated string, no extra work is needed here.
- Reverse-chronological order should be enforced by the content data (Epic 04 authors `fr.ts`/`en.ts` in that order), but add a comment noting the assumption so a future content update does not silently break order.

## Files to Create/Modify

| Action | File Path                                | Purpose                                  |
| ------ | ---------------------------------------- | ---------------------------------------- |
| CREATE | `src/components/sections/Experience.tsx` | Reverse-chronological role cards section |

## Dependencies

- **Blocked by:** 04-05 (LanguageProvider — `useLanguage()` must exist), 02-06 (Card), 02-09 (Section wrapper).
- **Blocks:** 06-09 (wire sections into App).

## Related

- **Epic:** content-sections
- **Related stories:** 06-05 (Projects — content is derived from the same experience data), 06-03 (Skills — also uses Badge chips), 06-09 (App wiring)
- **Spec reference:** spec §5.4 (Professional experience — roles table and projects by role)

## Implementation Plan

### SOLID Analysis

- **S:** `Experience.tsx` renders the experience section only. Content data comes from `useLanguage()`, card shell from `Card`, heading/reveal from `Section`.
- **O:** Adding roles requires only content data changes (`en.ts`/`fr.ts`), not component code changes.
- **L:** Component satisfies the implicit "section component" contract — accepts no props, reads context, renders a `<section id="experience">`.
- **I:** Only depends on `content.experience[]` slice, not the entire content shape.
- **D:** Content injected via `useLanguage()` context hook, no direct imports of content files.

### Subtasks

- [x] 1. Write failing tests in `Experience.test.tsx` covering all acceptance criteria
- [x] 2. Create `src/components/sections/Experience.tsx` — Section + Card-per-role + Badge chips + project bullets
- [x] 3. Refactor: SOLID review, class readability, responsive layout check
- [x] 4. QA validation: run full suite, verify all acceptance criteria pass
- [x] 5. Mark story complete

## Implementation Summary

### What was built

`Experience.tsx` — the professional experience section component. Reads `content.experience[]` via `useLanguage()` and renders all seven roles as `Card` components in the order provided by the content data (most-recent-first, enforced by `en.ts`/`fr.ts`). Each card shows the company name, job title, employment period, tech highlights as `Badge` chips, and project bullets as a `<ul>`/`<li>` list. The section heading is locale-aware via `t('navExperience')`. Layout uses a 1-column mobile grid that expands to 2 columns at the `md` breakpoint.

`Experience.test.tsx` — 19 tests covering all 10 acceptance criteria: section element ID, h2 heading, role count and order, card count, per-card content (company/role/period), tech highlights, project bullets, responsive layout, locale switching, and build-safety.

### Files Touched

| Action | File | Lines |
|--------|------|-------|
| CREATED | `src/components/sections/Experience.tsx` | 97 lines |
| CREATED | `src/components/sections/Experience.test.tsx` | 233 lines |
| MODIFIED | `tasks/2026-05-22_personal-portfolio/epics/06_content-sections/stories/04_experience.md` | this file |
| MODIFIED | `tasks/2026-05-22_personal-portfolio/STORIES_INDEX.md` | status → IN PROGRESS |

### Test results

- 348 tests across 26 test files — all passing
- `npm run build` — no TypeScript errors, build succeeds
