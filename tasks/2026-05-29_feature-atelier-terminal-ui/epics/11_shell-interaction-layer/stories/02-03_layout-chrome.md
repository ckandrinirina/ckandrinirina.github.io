---
id: 11-03
title: "Layout chrome — Sidebar + Topbar"
epic: 11
status: done
size: M
blocked_by: ["10-01", "10-02", "10-03"]
files: ["src/components/layout/Sidebar.tsx", "src/components/layout/Topbar.tsx", "src/lib/constants.ts", "src/components/layout/*.test.tsx"]
issue:
pr:
delivery: direct
prior_status:
---
# Story 02-03: Layout chrome — Sidebar + Topbar

> **Epic:** Shell & Interaction Layer
> **Size:** L
## Description

Build the persistent chrome that frames every view: the fixed 240px `Sidebar` and the
`Topbar`. Both are presentational and prop-driven — they reflect the active route and
emit navigation intents; App owns the route state (wired in 04-01).

**`Sidebar`** renders, as an `<aside>` landmark: the brand mark; grouped nav rows
(`workspace`: home/work/experience/skills/process, and `connect`: contact) where each row
shows its glyph, label, and optional badge (e.g. Work `8`); a desktop-only status block
(`status: available` with green dot, `region: tnr · utc+3`, `paired with: claude-code` in
accent); and the `ThemeSwitcher`/`LanguageSwitcher` controls. The active route row is
visually marked.

**`Topbar`** renders the breadcrumb for the active route (e.g. `~/portfolio · selected-work`),
a `⌘K` button that opens the command palette, and a TNR clock that auto-updates every 30s
(UTC+3).

Route/label/glyph/badge/breadcrumb metadata and `ROUTE_ORDER` live in `src/lib/constants.ts`
so the chrome and the navigation hooks share one source of truth.

## Acceptance Criteria

- [ ] `Sidebar` renders an `<aside>` landmark containing a `<nav>` with the two groups in the
      documented order, each row showing glyph + label and (where defined) a badge.
- [ ] Each nav row is a focusable control (button/anchor) that invokes the `navigate` prop
      with its route id; the row matching the active route is visually distinguished.
- [ ] The desktop-only status block renders the three status lines with the green availability
      dot and accent-coloured `paired with` value; it is hidden at the mobile breakpoint.
- [ ] `Sidebar` renders the `ThemeSwitcher` and `LanguageSwitcher`, both functional.
- [ ] `Topbar` renders the breadcrumb text for the active route, sourced from route metadata.
- [ ] `Topbar` renders a `⌘K` button that calls the supplied palette-open callback.
- [ ] `Topbar` shows a TNR (UTC+3) clock that updates every 30 s; the interval is cleaned up
      on unmount.
- [ ] Route metadata (id, label, glyph, badge, breadcrumb) and `ROUTE_ORDER` are defined in
      `src/lib/constants.ts` and consumed by both components.
- [ ] Both components are keyboard-accessible with visible focus rings; nav glyphs are
      decorative (`aria-hidden`) with text labels providing the accessible name.
- [ ] Unit tests cover rendering, active-route marking, navigate callbacks, and the clock
      tick (fake timers); `npm run build` passes.

## Technical Notes

- Props, not global state: `Sidebar`/`Topbar` take `{ route, navigate, onOpenCmdK }` plus the
  metadata (or import it from `constants.ts`). App owns the route in 04-01.
- Reuse the existing `LanguageSwitcher` (restyled in 01-02’s sibling work is not required;
  restyle minimally if needed) and the new `ThemeSwitcher` from 01-02.
- The TNR clock: compute UTC+3 from `new Date()` inside an effect with a 30 s `setInterval`;
  in tests, drive it with fake timers and assert it re-renders. Avoid reading the system clock
  at module scope.
- Below `880px` the `.app` grid stacks (per 01-01) and the sidebar becomes a horizontal
  scrollable strip; ensure the markup degrades to that layout via the existing classes
  (no JS branch needed) and the status block hides.
- Keep the breadcrumb format from the route table (e.g. `home`, `selected-work`, `how-i-work`).

## Files to Create/Modify

| Action | File Path                           | Purpose                                           |
| ------ | ----------------------------------- | ------------------------------------------------- |
| CREATE | `src/components/layout/Sidebar.tsx` | Brand, grouped nav rows, status block, controls   |
| CREATE | `src/components/layout/Topbar.tsx`  | Breadcrumb, ⌘K button, TNR clock                  |
| MODIFY | `src/lib/constants.ts`              | `ROUTE_ORDER` + per-route label/glyph/badge/crumb |
| CREATE | `src/components/layout/*.test.tsx`  | Unit tests for Sidebar/Topbar                     |

## Dependencies

- **Blocked by:** 01-01 (`.sidebar`/`.sb-*`/`.topbar`/`.tb-*` classes), 01-02 (`ThemeSwitcher`),
  01-03 (nav labels in `ui.ts`)
- **Blocks:** 04-01 (App renders Sidebar + Topbar and supplies route state/handlers)

## Related

- **Epic:** shell-interaction-layer
- **Related stories:** 02-01 (hooks reflect the same route metadata), 04-01 (consumer)
- **Spec reference:** feature doc §Layout shell, §Routes, §Components (Sidebar, Topbar)

## Implementation Plan

### SOLID Analysis

- **S — Single Responsibility:** Sidebar = nav + status; Topbar = breadcrumb + ⌘K + clock; each
  delegates theme/language to existing controls.
- **O — Open/Closed:** adding a route means a new entry in `constants.ts`; the chrome iterates
  metadata and needs no edits.
- **L — Liskov:** both render correctly for any valid route id.
- **I — Interface Segregation:** components take only `{ route, navigate, onOpenCmdK }` + metadata.
- **D — Dependency Inversion:** chrome depends on the route-metadata abstraction and a `navigate`
  callback, not on the routing hooks’ internals.

### Subtasks

- [ ] 1. Add route metadata + `ROUTE_ORDER` to `constants.ts` (with tests, RED).
- [ ] 2. Write Sidebar/Topbar tests incl. active-route + clock tick (RED).
- [ ] 3. Implement `Sidebar` (groups, status, controls) (GREEN).
- [ ] 4. Implement `Topbar` (breadcrumb, ⌘K, clock).
- [ ] 5. Refactor + a11y/focus check.
- [ ] 6. QA validation — map each AC, run the suite, check TypeScript.
