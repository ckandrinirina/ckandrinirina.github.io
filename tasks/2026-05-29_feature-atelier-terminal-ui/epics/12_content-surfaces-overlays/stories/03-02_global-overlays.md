---
id: 12-02
title: "Global overlays — CommandPalette + Cursor"
epic: 12
status: done
size: M
blocked_by: ["10-01", "10-03", "11-01"]
files: ["src/components/cmdk/CommandPalette.tsx", "src/components/cmdk/commands.ts", "src/components/cursor/Cursor.tsx", "src/components/cmdk/*.test.tsx", "src/components/cursor/Cursor.test.tsx"]
issue:
pr: 17
delivery: merged
prior_status:
---
# Story 03-02: Global overlays — CommandPalette + Cursor

> **Epic:** Content Surfaces & Overlays
> **Size:** L
## Description

Build the two global overlay layers mounted at the App root: the hand-rolled command
palette (⌘K) and the custom cursor. Both sit above all content (`z-index: 9999` for the
cursor; a modal layer for the palette) and are driven by App state in 04-01.

- **`CommandPalette`** — a modal with a search input and grouped, filterable results in three
  groups: **Navigation** (the six routes), **Quick** (e.g. cycle theme, toggle language,
  download CV), and **Projects** (the eight projects → open modal / external link). Supports
  arrow-key navigation through results, `Enter` to run the active item, and `Escape` to close.
  Backed by a `commands.ts` dataset that maps each command to an action descriptor.
- **`Cursor`** — two fixed divs (dot + ring). The dot follows `mousemove` directly; the ring
  lerps toward the pointer at ~0.18 per RAF tick. A `mouseover` listener inspects
  `e.target.closest(...)` to switch states: `label` (when `[data-cursor][data-cursor-label]`,
  ring expands into a labelled pill), `hover` (links/buttons/cards/sidebar rows/search),
  `text` (inputs/textareas/contenteditable → thin bar), else `default`. Disabled when
  `(hover: none) or (max-width: 880px)` matches; fades out/in on document leave/enter.

## Acceptance Criteria

- [x] `CommandPalette` renders an input and three labelled groups (Navigation, Quick, Projects)
      sourced from `commands.ts`, with localized group/item labels.
- [x] Typing filters items across all groups; empty/no-match shows an appropriate empty state.
- [x] Arrow Up/Down move the active item across the filtered list (wrapping or clamping per the
      mockup); `Enter` runs the active item’s action; `Escape` closes the palette.
- [x] Running a Navigation item navigates routes; a Quick item performs its action (theme cycle,
      language toggle, CV download); a Projects item opens the project (modal or link).
- [x] The palette is keyboard-operable end-to-end and the input is focused on open.
- [x] `Cursor` renders a dot that tracks the pointer and a ring that lerps behind it via RAF.
- [x] `Cursor` switches to `hover` over interactive elements, `label` over
      `[data-cursor][data-cursor-label]` (showing the label), and `text` over text inputs.
- [x] `Cursor` does not render / is inert when `(hover: none) or (max-width: 880px)` matches.
- [x] The cursor never replaces native focus styling (focus rings remain visible).
- [x] Unit tests cover palette filtering/keyboard/actions and cursor state transitions
      (with mocked `matchMedia`/RAF); `npm run build` passes.

## Technical Notes

- The palette’s open state and the `toggle` come from `useCmdK` (02-01), wired in App (04-01).
  This story builds the palette UI as a controlled component (`open`, `onClose`) plus the
  `commands.ts` data and action-dispatch contract.
- `commands.ts` should describe actions abstractly (e.g. `{ kind: 'nav', route }`,
  `{ kind: 'quick', id }`, `{ kind: 'project', id }`) so App maps them to real handlers; avoid
  importing App state into the data file.
- Cursor: clean up `mousemove`/`mouseover`/RAF on unmount. Use `transform: translate3d(...)`
  for compositor-only updates (perf target). Guard `matchMedia` for jsdom.
- For tests, mock `requestAnimationFrame`/`cancelAnimationFrame` and `matchMedia`; assert state
  classes change on synthetic `mouseover` with the relevant `closest` targets.
- Projects in the palette reuse the same open-modal action as 03-01 (App coordinates).

## Files to Create/Modify

| Action | File Path                                                                 | Purpose                              |
| ------ | ------------------------------------------------------------------------- | ------------------------------------ |
| CREATE | `src/components/cmdk/CommandPalette.tsx`                                  | ⌘K modal: input + grouped results    |
| CREATE | `src/components/cmdk/commands.ts`                                         | Command dataset + action descriptors |
| CREATE | `src/components/cursor/Cursor.tsx`                                        | Dot + lerped ring with states        |
| CREATE | `src/components/cmdk/*.test.tsx`, `src/components/cursor/Cursor.test.tsx` | Unit tests                           |

## Dependencies

- **Blocked by:** 01-01 (`.cmdk-*`/`.cursor-*` classes), 01-03 (commands reference routes/projects
  - copy labels), 02-01 (`useCmdK`)
- **Blocks:** 04-01 (App mounts both overlays and wires open/close + actions)

## Related

- **Epic:** content-surfaces-overlays
- **Related stories:** 03-01 (Projects group opens the same modal), 04-01 (state owner)
- **Spec reference:** feature doc §Components (CommandPalette, Cursor), §Data flow (custom cursor)

## Implementation Plan

### SOLID Analysis

- **S — Single Responsibility:** palette = command UI; `commands.ts` = data; cursor = pointer FX.
- **O — Open/Closed:** new commands are new `commands.ts` entries; the palette renders generically.
- **L — Liskov:** every command descriptor is dispatchable by the App action mapper.
- **I — Interface Segregation:** palette takes `{ open, onClose, onRun }`; cursor takes no props.
- **D — Dependency Inversion:** palette depends on abstract command descriptors, not App handlers.

### Subtasks

- [x] 1. Write tests for palette filter/keyboard/dispatch and cursor states (RED).
- [x] 2. Implement `commands.ts` data + descriptor types.
- [x] 3. Implement `CommandPalette` UI (GREEN).
- [x] 4. Implement `Cursor` (RAF lerp + state machine + media guard).
- [x] 5. Refactor + a11y/perf check (focus, translate3d).
- [x] 6. QA validation — map each AC, run the suite, check TypeScript.
