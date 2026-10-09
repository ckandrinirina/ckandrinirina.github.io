---
id: 13-01
title: "App.tsx integration, view routing & obsolete-file teardown"
epic: 13
status: done
size: M
blocked_by: ["11-01", "11-03", "12-01", "12-02", "12-03", "12-04"]
files: ["src/App.tsx", "src/App.test.tsx", "src/components/layout/Header.tsx", "src/components/layout/Footer.tsx", "src/components/layout/Section.tsx", "src/components/sections/*", "ThemeToggle", "useScrollSpy"]
issue:
pr:
delivery:
prior_status:
---
# Story 04-01: App.tsx integration, view routing & obsolete-file teardown

> **Epic:** Integration & QA
> **Size:** XL
## Description

Rewrite `App.tsx` to be the orchestrator of the Atelier Terminal shell, then remove every
obsolete file from the old section-based design. This is the convergence story — it brings
together the hooks (02-01), chrome (02-03), views (03-01/03-03/03-04), and overlays (03-02)
into the running application, and ensures the new shell is the only UI left.

`App.tsx` owns the cross-cutting state and wiring:

- **State:** current `route`, navigation `direction` (`'up' | 'down'`), the open `project`
  for the modal, and the command-palette `open` flag, plus the 850 ms `locked` flag.
- **Navigation:** a single `navigate(idOrDir)` that resolves the next route from `ROUTE_ORDER`,
  sets direction, calls `history.replaceState(null, '', '#' + id)`, resets the view’s
  `scrollTop`, and engages the lock. Wires `useHashRoute`, `useScrollToNavigate`,
  `useKeyboardArrows`, `useCmdK`, and `useScrollReveal` against the view ref.
- **View shell:** renders `<aside>` Sidebar + `<main>` (Topbar + the re-keyed `.view`
  container with the active view + `ScrollHint`). The `.view` is keyed by route so React
  remounts it, and gets `view-enter-down`/`-up` from `direction`.
- **Overlays:** renders `CommandPalette` (mapping command descriptors to handlers — nav,
  theme cycle, language toggle, CV download, open project) and `ProjectModal` (controlled by
  the `project` state) and `Cursor`.

**Teardown (run last):** delete `Header`, `Footer`, `Section`, all `components/sections/*`,
and any remaining `ThemeToggle`/`useScrollSpy` files and their tests; remove all imports of
them. The tree must contain only the new shell.

## Acceptance Criteria

- [x] `App.tsx` renders `<aside>` (Sidebar), `<main>` (Topbar + `.view` + `ScrollHint`), and the
      overlays (`CommandPalette`, `ProjectModal`, `Cursor`).
- [x] The correct view renders for the active route; an unknown/empty hash defaults to `home`.
- [x] Clicking a sidebar row navigates and sets the enter-direction from `ROUTE_ORDER` position.
- [x] Scroll-gesture, arrow/Page keys, hash changes, and ⌘K all drive navigation/overlays via the
      wired hooks.
- [x] On every nav: the hash updates via `history.replaceState`, the view `scrollTop` resets to 0,
      the `.view` remounts (re-keyed) with `view-enter-down`/`-up` per direction, and a 850 ms lock
      blocks re-entrant navs.
- [x] Opening a project (from a card or the cmdk Projects group) sets the modal state; closing
      clears it and restores focus.
- [x] Command-palette items run: Navigation navigates, Quick actions fire (theme cycle / language
      toggle / CV download), Projects open the modal or link.
- [x] `Header.tsx`, `Footer.tsx`, `Section.tsx`, `components/sections/*` (all 8), and any remaining
      `ThemeToggle`/`useScrollSpy` files + tests are deleted, with no dangling imports anywhere.
- [x] `npm run build` passes and the **entire** test suite is green (no references to removed files).
- [x] Provider order remains `ThemeProvider → LanguageProvider → App` (in `main.tsx`).

## Technical Notes

- `navigate` accepts either a concrete route id (sidebar/cmdk/hash) or a direction (`'up'`/`'down'`
  from gestures/keys); resolve direction to the neighbouring route via `ROUTE_ORDER`, clamping at ends.
- Re-key the `.view` (e.g. `key={route}`) so the remount triggers the entrance keyframe; pick
  `view-enter-down`/`-up` from `direction`.
- Keep leaf components prop-driven: pass `route`, `navigate`, `onOpenCmdK`, `onOpenProject`, etc.
- Map `commands.ts` descriptors to handlers here (the data file stays App-agnostic, per 03-02).
- Do the teardown **after** the new shell renders and tests pass, so the build is never left with
  two half-wired designs. After deleting, grep for stale imports and dead `ui` keys.
- This story’s tests are integration-level: render `App`, drive navigation/overlays, assert the
  right view/overlay shows. Mock `matchMedia`/RAF/clipboard as the child components require.

## Files to Create/Modify

| Action | File Path                                   | Purpose                                   |
| ------ | ------------------------------------------- | ----------------------------------------- |
| MODIFY | `src/App.tsx`                               | Route/view shell + overlays orchestration |
| MODIFY | `src/App.test.tsx`                          | Rewritten integration tests               |
| DELETE | `src/components/layout/Header.tsx` (+test)  | Replaced by Sidebar + Topbar              |
| DELETE | `src/components/layout/Footer.tsx` (+test)  | No footer in new design                   |
| DELETE | `src/components/layout/Section.tsx` (+test) | Replaced by view-level layout             |
| DELETE | `src/components/sections/*` (8 + tests)     | Replaced by `views/`                      |
| DELETE | residual `ThemeToggle`/`useScrollSpy` files | Already superseded (01-02 / 02-01)        |

## Dependencies

- **Blocked by:** 02-01 (hooks), 02-03 (chrome), 03-01 (WorkView + modal), 03-02 (overlays),
  03-03 (HomeView), 03-04 (remaining views)
- **Blocks:** 04-02 (a11y/responsive pass runs against the assembled shell)

## Related

- **Epic:** integration-qa
- **Related stories:** all of Epics 02–03 (consumed here), 04-02 (validates this)
- **Spec reference:** feature doc §Components (App), §Data flow (Route navigation), §Folder
  structure (delta — deletions), §Layout shell

## Implementation Plan

### SOLID Analysis

- **S — Single Responsibility:** App owns orchestration only; rendering/motion live in the leaves
  and CSS; data lives in content/commands.
- **O — Open/Closed:** adding a route = a view entry + `ROUTE_ORDER`/metadata; App’s render map
  iterates rather than hardcoding.
- **L — Liskov:** any view component slots into the `.view` container the same way.
- **I — Interface Segregation:** each child receives only the props it needs.
- **D — Dependency Inversion:** App depends on hook/command abstractions; it maps descriptors to
  handlers rather than children reaching into App state.

### Subtasks

- [x] 1. Write integration tests for routing, transitions, overlays, and defaults (RED).
- [x] 2. Implement App state + `navigate` + hook wiring (GREEN).
- [x] 3. Render chrome + re-keyed view shell + ScrollHint.
- [x] 4. Wire overlays + command/project action mapping.
- [x] 5. Teardown obsolete files; grep for dangling imports/keys.
- [x] 6. QA validation — map each AC, run the full suite, check TypeScript.

### Build Notes (concrete decisions)

- **`navigate(target: string)`** — single param typed `string` so it is assignable to
  every consumer contract (`HomeView` `(route: string)`, hooks `(dir: 'up'|'down')`,
  `Sidebar` `(id: RouteId)`). Internally narrows: `'up'|'down'` → neighbour via
  `ROUTE_ORDER` (clamped, boundary no-op); otherwise `isRouteId()` guard → that route
  (direction derived from index delta); unknown → ignored. Stable (`useCallback([])`),
  reads current route from a `routeRef` updated inside handlers (no render-time ref writes).
- **View ref → `.view-inner`** — views own their `.view-inner` scroller (cannot modify
  them; only `App.tsx` is in scope). App puts a **callback ref** on the re-keyed `.view`
  container that resolves `node.querySelector('.view-inner')` into a stable `viewRef`,
  which all four ref-driven hooks consume. Ref callbacks run pre-effect, so `viewRef` is
  current when the route-keyed hook effects re-run.
- **Re-key + animation** — `<div className="view … {dir==='down'?'view-enter-down':'view-enter-up'}" key={route}>`;
  remount replays the entrance keyframe and yields a fresh `scrollTop:0` view-inner.
- **`<main>` pane** — index.css has no `.main` rule, so the Topbar+view column is laid out
  with Tailwind utilities (`flex min-w-0 flex-col overflow-hidden`; `.view` gets
  `flex-1 min-h-0`) — no stylesheet edits (out of scope).
- **Overlays** — `CommandPalette`/`ProjectModal`/`Cursor` render as fixed-position siblings
  outside `.app`. `runCommand` maps descriptors: nav→`navigate`, quick→`cycle`/`setLocale`
  toggle/CV-download anchor, project→open modal. Modal focus-return captures
  `document.activeElement` at open into `projectTriggerRef`.
- **Hash routing** — `useHashRoute(applyHash)`; `applyHash` normalises unknown/empty hash
  to `home` and derives direction from the index delta. `navigate` uses
  `history.replaceState` (no `hashchange`), so no feedback loop.

## Implementation Summary

The Atelier Terminal shell is now the only UI. `App.tsx` was rewritten from the old
8-section page into the route orchestrator: it owns `route` / `direction` / `cmdOpen` /
`activeProject` / `locked` state, exposes one `navigate(target)` that accepts a route id
(sidebar/cmdk) or a direction (gestures/keys), and wires all five interaction hooks against
a `viewRef` resolved (via callback ref) to the active view's `.view-inner`. The chrome
(Sidebar + Topbar), the re-keyed `.view` with directional entrance animation + ScrollHint,
and the global overlays (CommandPalette, ProjectModal, Cursor) all render from App state;
`runCommand` maps cmdk descriptors to real handlers (nav / theme-cycle / language-toggle /
CV-download / open-project). The old section-based design was torn down.

**Outcome:** all 10 acceptance criteria PASS (independent QA validation). `tsc -b` clean,
`eslint` clean, `prettier` clean, `npm run build` passes, full suite **715/715 green**.

### Files Touched

- **MODIFIED** `src/App.tsx:1-244` — full rewrite: shell orchestration, `navigate`, hook
  wiring, view render map, overlay handlers + command/project action mapping.
- **MODIFIED** `src/App.test.tsx:1-252` — rewritten as 22 integration tests (shell, routing,
  default-to-home, sidebar/keyboard/wheel/hash nav, ⌘K palette, project modal, cursor).
- **DELETED** `src/components/layout/Header.tsx` (+ `Header.test.tsx`)
- **DELETED** `src/components/layout/Footer.tsx` (+ `Footer.test.tsx`)
- **DELETED** `src/components/layout/Section.tsx` (+ `Section.test.tsx`)
- **DELETED** `src/components/sections/` — About, Contact, Education, Experience, Hero,
  Languages, Projects, Skills (8 components + 8 tests)
- **DELETED** `src/hooks/useScrollSpy.ts` (+ `useScrollSpy.test.ts`)

24 files deleted, 2 rewritten · 426 insertions / 3227 deletions.

### Notes / deviations

- `useReveal` was **kept** (orphaned but retained per the feature arch doc's Hooks table —
  "still useful for one-off section reveals"); its test stays green.
- `ThemeToggle` was already removed in 01-02 (0 files) — nothing to delete.
- The story's deletion list mentioned `ThemeToggle`; the live control is `ThemeSwitcher`,
  which is **used by Sidebar** and therefore correctly retained.
- `constants.ts` `NAV_SECTIONS`/`SITE_META` are now unused exports (no longer imported);
  left in place (out of scope, not dangling imports). Stale doc-comments in
  `test/setup.ts` / `content/types.ts` reference removed files but are comments, not imports.
- `<main>` pane laid out with Tailwind utilities (no `index.css` edits — out of scope).
