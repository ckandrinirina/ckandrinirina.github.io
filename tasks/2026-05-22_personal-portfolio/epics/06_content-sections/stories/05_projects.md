---
id: 06-05
title: "Projects section"
epic: 06
status: done
size: M
blocked_by: ["04-05", "02-06", "02-09"]
files: ["src/components/sections/Projects.tsx"]
issue:
pr:
delivery: direct
prior_status:
---
# Story 06-05: Projects section

> **Epic:** Content Sections
> **Size:** L
## Description

Implement `src/components/sections/Projects.tsx`, the curated project showcase section.
The component reads `content.projects[]` via `useLanguage()` — a dedicated array derived
from the experience data and authored in Epic 04 — and renders each project as a `Card`
with the project name, the company or client it was built for, a short description, and a
set of technology `Badge` tags. All projects are named and attributed per the owner's
decision. The section uses the shared `Section` wrapper with `id="projects"` and renders
responsively in a grid or column layout.

## Acceptance Criteria

- [x] The component renders inside a `<section id="projects">` (provided by the `Section` wrapper).
- [x] An `<h2>` heading is rendered by the `Section` wrapper with the locale-appropriate label.
- [x] All projects from `content.projects[]` are rendered — at minimum: SOKA Club, SOKA Live, LUDOKA, EER Full Digital, SHOYO (platform), THESEIS, Happy Capital / My Capital Immo, OCR/GPT-4 extraction, VTC Academy training site, PANAFRI HELP funding platform, IPSUM, SOLIUS, MOZART, ELISE, BNI Madagascar, FMFP, FORET MAD.
- [x] Each project is rendered as a `Card` component.
- [x] Each Card displays: project name, company / client name, description text.
- [x] Each Card displays technology tags as `Badge` chips.
- [x] Cards use a responsive grid layout (e.g. 1 column mobile → 2–3 columns desktop).
- [x] Switching the locale updates description text without a page reload.
- [x] Project names and company/client attributions remain unchanged on locale switch (they are proper nouns).
- [x] No TypeScript errors on `npm run build`.

## Technical Notes

- `content.projects[]` is a dedicated array in the content object (not re-derived in the component from `content.experience`). The expected shape is approximately: `{ name: string; company: string; description: string; tech: string[] }`. Align with Epic 04 types.
- Use `Card` from Epic 02 (story 02-06) and `Badge` from Epic 02 (story 02-05).
- Responsive grid suggestion: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6` inside a `Container`.
- Per spec §7: all employers and projects are named, per the owner's explicit choice. If any client later requests anonymisation, individual entries can be relabelled in the content files without redesigning this component.
- Project ordering: group by employer (matching the Experience section order) or use whatever order the content author defines in `fr.ts`/`en.ts`. Do not re-sort in the component.
- `Badge` tech tags inside a Card: use a `<div className="flex flex-wrap gap-1.5">` wrapper so they wrap gracefully on narrow cards.

## Files to Create/Modify

| Action | File Path                              | Purpose                                                 |
| ------ | -------------------------------------- | ------------------------------------------------------- |
| CREATE | `src/components/sections/Projects.tsx` | Project showcase section with Card and Badge components |

## Dependencies

- **Blocked by:** 04-05 (LanguageProvider — `useLanguage()` must exist), 02-06 (Card), 02-09 (Section wrapper).
- **Blocks:** 06-09 (wire sections into App).

## Related

- **Epic:** content-sections
- **Related stories:** 06-04 (Experience — same underlying employer data), 06-03 (Skills — also uses Badge), 06-09 (App wiring)
- **Spec reference:** spec §5.4 (Projects by role), §7 (project naming decision)

## Implementation Summary

### Files Touched

| Action   | File                                                   | Lines |
| -------- | ------------------------------------------------------ | ----- |
| CREATED  | `src/components/sections/Projects.tsx`                 | 52    |
| CREATED  | `src/components/sections/Projects.test.tsx`            | 163   |

### Approach

Implemented `Projects.tsx` as a zero-props component that reads `content.projects[]` via `useLanguage()` and maps each `ProjectEntry` to a `Card` containing an `h3` heading (project name), a `p` element for the company/client attribution, a description paragraph, and a flex-wrap `div` of `Badge` chips for tech tags. The `Section` wrapper with `id="projects"` provides the `<section>` element and `<h2>` heading. The responsive grid uses `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` per the story's technical notes.

Tests in `Projects.test.tsx` cover all acceptance criteria: section structure, project count, card content (name, company, description, tech tags), responsive grid class presence, and locale switching. The `SwitcherProbe` component wraps `useLanguage()` in a proper React context to enable locale-switch tests.

### Deviations

None.

## Implementation Plan

### Subtasks

- [x] 1. Write failing tests (`src/components/sections/Projects.test.tsx`)
- [x] 2. Implement `Projects.tsx` component
- [x] 3. Refactor — SOLID compliance review
- [x] 4. QA validation — run full test suite + acceptance criteria check
- [x] 5. Completion — update story file, mark all tasks done

### SOLID Analysis

- **S:** `Projects.tsx` renders projects grid only — no data transformation logic.
- **O:** Responsive grid via Tailwind utilities — open to layout extension without code changes.
- **L:** Uses `Section`, `Card`, `Badge` contracts as documented.
- **I:** Zero props — component reads context directly via `useLanguage()`.
- **D:** Content accessed through `useLanguage()` abstraction.

---

## Bug Report — BUG-20260612-01

**Status:** FIXED

**Symptom:** On `#work` in French, project text stayed English: card/modal copy
(`desc`, `role`, `category`, `detail.role`, `detail.impact`) and the modal
section labels (`My role` / `Impact` / `Stack` / `Close` + aria `Close dialog`).

**Root cause (two gaps):**
1. The Work view renders `content/projects.ts` (`Project[]`), which is the
   locale-independent English baseline — its copy never went through the i18n
   layer, so French showed English. (The French `content.projects`
   `ProjectEntry[]` in `fr.ts` is unrelated dead data, rendered by nothing.)
2. `ProjectModal.tsx` hardcoded the section/close labels instead of `t()`,
   unlike `readCase` / `visitLive` which were already localized.

**Fix:**
- **Part A (labels):** added `modalRole` / `modalImpact` / `modalStack` /
  `modalClose` / `modalCloseAria` to `i18n/ui.ts` (fr + en); wired
  `ProjectModal.tsx` to `t()`.
- **Part B (copy):** added the `ProjectCopy` type; new `content/projects.fr.ts`
  holds the French overlay for all 8 featured works; `localizeProjects(locale)`
  in `projects.ts` merges it over the English baseline (locale-independent
  fields untouched). `WorkView`, `CommandPalette` (cmdk `.meta`) and
  `App.runCommand` (cmdk-opened modal) all render the localized list.

**Resolution:** RED→GREEN via new tests; full suite 757 passed / 0 failed;
`tsc --noEmit` clean; eslint clean. SOLID re-check on the diff: S/O/L/I/D all
PASS (overlay is a pure function; `Project` extended via `ProjectCopy`, not
modified; consumers depend on the `localizeProjects` abstraction).

**Files Touched:**
- MODIFIED src/i18n/ui.ts:70-76,199-204,318-323
- MODIFIED src/components/projects/ProjectModal.tsx:125,147,151,156,175
- MODIFIED src/content/types.ts:189-205
- CREATED src/content/projects.fr.ts
- MODIFIED src/content/projects.ts:3-12,172-196
- MODIFIED src/views/WorkView.tsx:21,31-32,51
- MODIFIED src/App.tsx:46,171-173
- MODIFIED src/components/cmdk/CommandPalette.tsx:25,68-76,108
- MODIFIED src/i18n/ui.test.ts (regression), src/content/projects.test.ts (regression), src/components/projects/ProjectModal.test.tsx (regression), src/views/WorkView.test.tsx (regression)

**Related (not fixed here):** `content.projects` (`ProjectEntry[]`) in
`fr.ts`/`en.ts` is dead code — no view renders it. Cleanup is out of scope for
this minimal fix; run `/ck-code:fix` separately if you want it removed.
