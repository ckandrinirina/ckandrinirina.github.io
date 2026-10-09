---
id: 12-01
title: "Project showcase — artwork, ProjectCard, ProjectModal, WorkView"
epic: 12
status: done
size: M
blocked_by: ["10-01", "10-03", "11-02"]
files: ["src/components/projects/artwork/ProjectArt.tsx", "src/components/projects/artwork/SokaArt.tsx", "src/components/projects/artwork/SokaLiveArt.tsx", "src/components/projects/artwork/LudokaArt.tsx", "src/components/projects/artwork/EerArt.tsx", "src/components/projects/artwork/ShoyoArt.tsx", "src/components/projects/artwork/OcrArt.tsx", "src/components/projects/artwork/HappyArt.tsx", "src/components/projects/artwork/TheseisArt.tsx", "src/components/projects/ProjectCard.tsx", "src/components/projects/ProjectModal.tsx", "src/views/WorkView.tsx", "src/components/projects/*.test.tsx", "src/views/WorkView.test.tsx"]
issue:
pr:
delivery:
prior_status:
---
# Story 03-01: Project showcase — artwork, ProjectCard, ProjectModal, WorkView

> **Epic:** Content Surfaces & Overlays
> **Size:** XL
## Description

Build the complete project showcase vertical slice: the inline-SVG artwork system, the
grid card, the detail modal, and the Work view that ties them together. All project data
comes from `content/projects.ts` (01-03) and copy from `useLanguage()`.

- **`ProjectArt`** — a switch on project `id` that renders the matching inline-SVG artwork
  component. Each of the 8 projects has its own `*Art.tsx` (`SokaArt`, `SokaLiveArt`,
  `LudokaArt`, `EerArt`, `ShoyoArt`, `OcrArt`, `HappyArt`, `TheseisArt`).
- **`ProjectCard`** — the grid tile: project number, name, year, category, summary, and tech
  tag chips, with the diagonal hover shine (`.proj-card` from 01-01) and the `[data-cursor]`
  hooks for the custom cursor. Activating a card opens the modal.
- **`ProjectModal`** — the detail view: artwork header, role/impact/stack columns, and action
  buttons (Visit live / Read case / repo as available). Closes on `Escape` and backdrop
  click; locks body scroll while open; manages focus.
- **`WorkView`** — the `work` route view: an `<h2>` section title + eyebrow and a 2-column
  `.work-grid` of `ProjectCard`s; invokes the supplied open-modal callback.

## Acceptance Criteria

- [x] `ProjectArt` renders the correct artwork for each of the 8 ids and renders nothing/an
      empty fallback (not a crash) for an unknown id.
- [x] All 8 artwork components exist and render valid inline SVG (no external image requests).
- [x] `ProjectCard` renders `num`, `name`, `year`, `category`, `desc`, and tag chips from a
      `Project`, applies `.proj-card`, and carries `data-cursor`/`data-cursor-label` for the cursor.
- [x] Activating a `ProjectCard` (click or keyboard) calls the `onOpen(project)` prop.
- [x] `ProjectModal` renders the artwork, the `detail.role`/`detail.impact`/`detail.stack`
      columns, and only the action buttons whose links exist (`link`/`repo` non-null).
- [x] `ProjectModal` closes on `Escape` and on backdrop click, and restores focus to the
      triggering element on close.
- [x] Opening the modal locks body scroll; closing restores it.
- [x] `WorkView` renders an `<h2>` `.section-title`, the eyebrow, and a 2-col `.work-grid` of
      all projects, wiring each card’s `onOpen` to the supplied callback.
- [x] Tag chips and action labels are localized via `useLanguage()` (`ui` labels).
- [x] Unit tests cover artwork switching, card rendering/activation, modal open/close/focus,
      and WorkView grid; `npm run build` passes.

## Technical Notes

- The modal’s open/close state is owned by App (04-01); this story exposes `ProjectModal` as a
  controlled component (`project | null` + `onClose`) and `WorkView` as taking an `onOpen` prop.
- Body-scroll lock: toggle a class or `overflow: hidden` on `document.body` in an effect tied to
  the modal’s mounted/open state; always clean up.
- Focus management: on open, move focus into the modal; on close (`Escape`/backdrop), return
  focus to the card that opened it (App may coordinate the trigger ref, or the modal accepts a
  `returnFocusRef`).
- Keep each `*Art.tsx` self-contained and small; `ProjectArt` is a thin dispatcher (`switch (id)`).
- `ProjectCard` is an interactive element — use a `<button>`/`<a>` (or `role`/`tabIndex` + key
  handlers) so it’s keyboard-operable with a visible focus ring (the custom cursor must not
  replace focus styling).
- Reuse the kept `Card`/`Badge` primitives only if they fit the mockup; otherwise render the
  `.proj-card` markup directly.

## Files to Create/Modify

| Action | File Path                                                           | Purpose                          |
| ------ | ------------------------------------------------------------------- | -------------------------------- |
| CREATE | `src/components/projects/artwork/ProjectArt.tsx`                    | Dispatch SVG artwork by id       |
| CREATE | `src/components/projects/artwork/SokaArt.tsx`                       | Project artwork                  |
| CREATE | `src/components/projects/artwork/SokaLiveArt.tsx`                   | Project artwork                  |
| CREATE | `src/components/projects/artwork/LudokaArt.tsx`                     | Project artwork                  |
| CREATE | `src/components/projects/artwork/EerArt.tsx`                        | Project artwork                  |
| CREATE | `src/components/projects/artwork/ShoyoArt.tsx`                      | Project artwork                  |
| CREATE | `src/components/projects/artwork/OcrArt.tsx`                        | Project artwork                  |
| CREATE | `src/components/projects/artwork/HappyArt.tsx`                      | Project artwork                  |
| CREATE | `src/components/projects/artwork/TheseisArt.tsx`                    | Project artwork                  |
| CREATE | `src/components/projects/ProjectCard.tsx`                           | Grid tile with hover shine       |
| CREATE | `src/components/projects/ProjectModal.tsx`                          | Detail modal (Esc/backdrop/lock) |
| CREATE | `src/views/WorkView.tsx`                                            | 2-col project grid view          |
| CREATE | `src/components/projects/*.test.tsx`, `src/views/WorkView.test.tsx` | Unit tests                       |

## Dependencies

- **Blocked by:** 01-01 (`.proj-card`/`.modal*`/`.work-grid` classes), 01-03 (`projects.ts`,
  `ui` labels), 02-02 (cards reveal via the same `.in`/reveal mechanics)
- **Blocks:** 03-02 (cmdk Projects group can reference the same open-modal action), 04-01 (App
  owns modal state and renders WorkView)

## Related

- **Epic:** content-surfaces-overlays
- **Related stories:** 03-02 (Projects group in cmdk), 04-01 (modal state owner)
- **Spec reference:** feature doc §Components (ProjectModal, ProjectArt), §Projects shape,
  §Data flow (copy-to-clipboard not here; modal lock here)

## Implementation Plan

### SOLID Analysis

- **S — Single Responsibility:** artwork renders SVG; card renders a tile; modal renders detail;
  WorkView lays out the grid. Each `*Art` owns one project’s visual.
- **O — Open/Closed:** adding a project = new `*Art` + a `switch` case + a data entry; card/modal
  are generic over `Project`.
- **L — Liskov:** every `*Art` is a valid `ProjectArt` branch; any `Project` renders in card/modal.
- **I — Interface Segregation:** `ProjectCard` takes `{ project, onOpen }`; `ProjectModal` takes
  `{ project|null, onClose }` — narrow contracts.
- **D — Dependency Inversion:** card/modal depend on the `Project` type, not concrete data.

### Subtasks

- [x] 1. Write tests for `ProjectArt` dispatch, `ProjectCard`, `ProjectModal`, `WorkView` (RED).
- [x] 2. Implement the 8 `*Art` components + `ProjectArt` dispatcher (GREEN).
- [x] 3. Implement `ProjectCard` (shine, cursor hooks, activation).
- [x] 4. Implement `ProjectModal` (Esc/backdrop/scroll-lock/focus).
- [x] 5. Implement `WorkView` grid.
- [x] 6. QA validation — map each AC, run the suite, check TypeScript.
