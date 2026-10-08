---
id: 12-04
title: "Remaining views — Experience, Skills, Process, Contact"
epic: 12
status: done
size: M
blocked_by: ["10-01", "10-03", "11-02"]
files: ["src/views/ExperienceView.tsx", "src/views/SkillsView.tsx", "src/views/ProcessView.tsx", "src/views/ContactView.tsx", "src/views/*.test.tsx"]
issue:
pr:
delivery:
prior_status:
---
# Story 03-04: Remaining views — Experience, Skills, Process, Contact

> **Epic:** Content Surfaces & Overlays
> **Size:** XL
## Description

Build the four remaining route views, each reading its slice from `useLanguage().content`,
applying the Epic 01 classes, and starting with an `<h2>` `.section-title` + eyebrow.

- **`ExperienceView`** (`experience`) — a `.timeline` of `.tl-item`s with dot markers,
  rendering each `TimelineEntry`’s year, role, company, description, and stack chips in
  reverse-chronological order.
- **`SkillsView`** (`skills`) — a 2×2 `.skill-cards` grid of `.skill-card`s, each with a title,
  lead pills, and secondary chips from the `skills` content.
- **`ProcessView`** (`process`) — the `.process-list` of 5 numbered `.process-item`s, each with
  a `.process-num` and content (title + body) from `process`.
- **`ContactView`** (`contact`) — a two-card `.contact-grid`: a key/value card (email, WhatsApp,
  region, **languages row**) with per-value copy buttons that show "✓ copied", plus the
  pitch card. Uses `SocialLinks` where appropriate.

## Acceptance Criteria

- [x] Each of the four views renders an `<h2>` `.section-title` and its eyebrow.
- [x] `ExperienceView` renders all `experience` entries in reverse-chronological order as
      `.tl-item`s with year/role/company/desc and stack chips, with dot markers.
- [x] `SkillsView` renders a 2×2 grid of `.skill-card`s, each with title, lead pills, and
      secondary chips from `skills`.
- [x] `ProcessView` renders 5 numbered `.process-item`s with `.process-num` and content from
      `process`.
- [x] `ContactView` renders the key/value card including the languages row and the pitch card.
- [x] Each copyable value has a copy button that writes the value via `navigator.clipboard` and
      shows the "✓ copied" state (success colour) for ~1400 ms, then reverts.
- [x] Copy buttons are accessible (the success state is announced; buttons have labels).
- [x] Revealable items carry the classes `useScrollReveal` targets (`.tl-item`, `.skill-card`,
      `.process-item`, `.reveal`).
- [x] All four views are unit-tested (incl. clipboard mock + timer for the copied state);
      `npm run build` passes.

## Technical Notes

- Copy-to-clipboard: `await navigator.clipboard?.writeText(value)`, then
  `setCopied(key)` → render "✓ copied" → `setTimeout(() => setCopied(null), 1400)`. Mock
  `navigator.clipboard` and use fake timers in tests; guard for environments without clipboard.
- Languages move here from the dropped standalone section — render `contact.languages` as a row
  in the key/value card (per the design decision).
- Reuse `SocialLinks` (kept) in the Contact view if it matches the mockup; otherwise render the
  contact links inline with copy buttons.
- Views are presentational and take only content (via hook) — no routing/modal ownership.
- Keep each view in its own file for parallel-friendliness and clear test scoping.

## Files to Create/Modify

| Action | File Path                      | Purpose                            |
| ------ | ------------------------------ | ---------------------------------- |
| CREATE | `src/views/ExperienceView.tsx` | Timeline of roles                  |
| CREATE | `src/views/SkillsView.tsx`     | 2×2 skill cards                    |
| CREATE | `src/views/ProcessView.tsx`    | 5 numbered principles              |
| CREATE | `src/views/ContactView.tsx`    | Key/value card (copy) + pitch card |
| CREATE | `src/views/*.test.tsx`         | Unit tests for the four views      |

## Dependencies

- **Blocked by:** 01-01 (`.timeline`/`.tl-*`/`.skill-card`/`.process-*`/`.contact-*` classes),
  01-03 (`experience`/`skills`/`process`/`contact` content), 02-02 (`Reveal`, `ScrollHint` if used)
- **Blocks:** 04-01 (App renders these for their routes)

## Related

- **Epic:** content-surfaces-overlays
- **Related stories:** 03-03 (sibling Home view), 04-01 (consumer)
- **Spec reference:** feature doc §Components (Experience/Skills/Process/Contact views),
  §Data flow (copy-to-clipboard), §Decisions (Languages → Contact card)

## Implementation Plan

### SOLID Analysis

- **S — Single Responsibility:** each view renders one route’s content; copy logic is a small
  local helper.
- **O — Open/Closed:** all four are data-driven over arrays; adding an entry needs no view change.
- **L — Liskov:** each renders for any valid content slice.
- **I — Interface Segregation:** views take only their content slice (via hook).
- **D — Dependency Inversion:** depend on `useLanguage()` content + the clipboard API abstraction.

### Subtasks

- [x] 1. Write tests for the four views incl. clipboard + copied-state timer (RED).
- [x] 2. Implement `ExperienceView` + `SkillsView` (GREEN).
- [x] 3. Implement `ProcessView`.
- [x] 4. Implement `ContactView` (copy buttons, languages row, pitch).
- [x] 5. Wire reveal classes; refactor + a11y check.
- [x] 6. QA validation — map each AC, run the suite, check TypeScript.
