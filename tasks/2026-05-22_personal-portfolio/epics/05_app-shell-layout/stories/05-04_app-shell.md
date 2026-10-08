---
id: 05-04
title: "App.tsx page shell"
epic: 05
status: done
size: M
blocked_by: ["05-02", "05-03"]
files: ["src/App.tsx"]
issue:
pr:
delivery:
prior_status:
---
# Story 05-04: App.tsx page shell

> **Epic:** App Shell & Layout
> **Size:** M
## Description

Update `src/App.tsx` to be the single-page shell that composes the full document structure: `<Header/>` at the top, a `<main>` landmark containing eight ordered section anchor slots, and `<Footer/>` at the bottom. Each section slot is a placeholder element (e.g. a `<div id="section-id"/>` or a stub `<section id="..."/>`) using the exact ids defined in the nav config in `src/lib/constants.ts`. Section components themselves (Hero, About, Skills, etc.) are not implemented here — they are filled in by Epic 06 and the subsequent section epics. This story exists to lock in the document structure, the landmark hierarchy, and the section id order so that `useScrollSpy`, the Header nav links, and future section imports all target the same ids.

## Acceptance Criteria

- [x] `App.tsx` renders a `<Header/>` component at the top of the output.
- [x] `App.tsx` renders a `<main>` HTML landmark element below the Header.
- [x] The `<main>` element contains exactly eight section slot elements, one for each portfolio section: Hero, About, Skills, Experience, Projects, Education, Languages, Contact — in that order.
- [x] Each section slot has an `id` attribute matching the corresponding value in the nav config array in `src/lib/constants.ts` (e.g. `id="hero"`, `id="about"`, `id="skills"`, `id="experience"`, `id="projects"`, `id="education"`, `id="languages"`, `id="contact"`).
- [x] The section `id` values in `App.tsx` are sourced from `src/lib/constants.ts` (not hardcoded inline), so a single change to constants propagates everywhere.
- [x] `App.tsx` renders a `<Footer/>` component below the `<main>` element.
- [x] The rendered DOM contains the landmarks `<header>`, `<main>`, and `<footer>` in the correct top-to-bottom order.
- [x] No TypeScript errors on `npm run build`.
- [x] `npm run dev` renders the page with a visible sticky Header, the eight section anchors (even if empty at this stage), and the Footer.
- [x] The active nav link in the Header highlights as the user scrolls past each empty section anchor (scrollspy must resolve against the ids present in the DOM).

## Technical Notes

- Section placeholder elements should be `<section id="..."/>` (self-closing or with a minimum height via Tailwind, e.g. `min-h-screen`, so scrollspy thresholds fire correctly during development). Using real `<section>` elements now means Epic 06 stories only need to swap out the placeholder content — no structural changes to `App.tsx` are required.
- The id values and nav order **must** come from `src/lib/constants.ts`. A suggested pattern: import `NAV_SECTIONS` (array of `{ id, labelKey }`), render `{NAV_SECTIONS.map(s => <section key={s.id} id={s.id} />)}` inside `<main>`. Epic 06 stories will replace each placeholder with the real section component.
- The `<main>` element should not have an `id` (landmarks are found by role); add a `className` for layout if needed (e.g. `flex flex-col`).
- Epic 05-04 intentionally leaves section content empty. An `aria-label` on `<main>` (e.g. `aria-label="Portfolio content"`) is acceptable to aid screen readers navigating past the Header.
- Verify that `useScrollSpy` (called inside Header with the ids list) can find the DOM elements at the time Header mounts — since App renders sections before Footer, the ids should be present before the first scroll event.
- If a `<React.StrictMode>` wrapper existed in `main.tsx` before this epic, keep it; this story does not remove it.

## Files to Create/Modify

| Action | File Path     | Purpose                                                                  |
| ------ | ------------- | ------------------------------------------------------------------------ |
| MODIFY | `src/App.tsx` | Compose Header, main with eight ordered section anchor slots, and Footer |

## Dependencies

- **Blocked by:** 05-02 (Header must exist), 05-03 (Footer must exist).
- **Blocks:** 06-01 through 06-08 (each section story replaces one placeholder slot); 06-09 (final section integration/wiring).

## Related

- **Epic:** app-shell-layout
- **Related stories:** 05-01 (provider wiring — providers wrap App), 05-02 (Header rendered here), 05-03 (Footer rendered here)
- **Spec reference:** components.md §Tree, folder-structure.md §src/App.tsx

## Implementation Plan

### SOLID

- **S — Single Responsibility:** `App.tsx` is the page-shell composer. No state, no handlers, no business logic — its only job is to lay out the document structure (Header + main + 8 section slots + Footer).
- **O — Open/Closed:** Section ids come from `NAV_SECTIONS` (`src/lib/constants.ts`). Adding, removing, or reordering a section is a single edit in constants — `App.tsx`, `useScrollSpy`, and `Header` all stay untouched.
- **L — Liskov:** No new types or subtyping introduced. Each `<section>` is a plain DOM element.
- **I — Interface Segregation:** `App` takes no props (mounted directly by `createRoot`). No new interfaces.
- **D — Dependency Inversion:** App depends on `Header`, `Footer`, and the `NAV_SECTIONS` constant — all stable abstractions. Theme/language state is read inside `Header` via context hooks, never threaded through `App`.

### Subtasks (TDD-ordered)

- [x] Write `src/App.test.tsx` covering all 10 acceptance criteria (RED).
- [x] Rewrite `src/App.tsx` to render `<Header/>` + `<main aria-label="Portfolio content">` with 8 `<section id min-h-screen/>` + `<Footer/>` (GREEN).
- [x] SOLID refactor pass; keep tests green.
- [x] QA: vitest run + `tsc -b` + eslint + `npm run build`; map each criterion to file:line.
- [x] Update Status DONE in story file, `STORIES_INDEX.md`, and `EPIC.md`.

## Unplanned Changes

- `src/App.css` — DELETED — pure Vite scaffold styles (`.counter`, `.hero`, `.framework`, `.ticks` …), no longer imported by anything after `src/App.tsx` rewrite; removing avoids leaving dead CSS in the bundle.

## Implementation Summary

App.tsx is now a pure page-shell composer: `<Header/>` → `<main aria-label="Portfolio content" className="flex flex-col">` with 8 `<section id={NAV_SECTIONS[i].id} className="min-h-screen"/>` placeholder anchors → `<Footer/>`. Section ids are mapped from `NAV_SECTIONS` (`src/lib/constants.ts`) so a single edit there propagates to Header nav, scroll-spy, and section anchors. The dead Vite scaffold (`src/App.css`) was removed.

### Files Touched

- CREATED `src/App.test.tsx`
- MODIFIED `src/App.tsx:1-19` (rewrote — was Vite scaffold; now Header + main + 8 sections + Footer)
- DELETED `src/App.css` (Vite scaffold, no remaining importers)

### Verification

- vitest: 329/329 PASS (9 new App tests + 320 existing).
- `tsc -b`: no errors.
- ESLint: no issues.
- `npm run build`: success (dist JS 452 KB / gzip 134 KB; CSS 19.29 KB / gzip 4.24 KB).
