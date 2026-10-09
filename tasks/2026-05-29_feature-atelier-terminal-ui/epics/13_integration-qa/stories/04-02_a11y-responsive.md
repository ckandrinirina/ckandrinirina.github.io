---
id: 13-02
title: "Accessibility, reduced-motion & responsiveness pass"
epic: 13
status: done
size: M
blocked_by: ["13-01"]
files: ["src/index.css", "*.test.tsx"]
issue:
pr:
delivery:
prior_status:
---
# Story 04-02: Accessibility, reduced-motion & responsiveness pass

> **Epic:** Integration & QA
> **Size:** L
## Description

With the shell assembled (04-01), validate and fix accessibility, reduced motion, and
responsive layout across the documented breakpoints. This is a verification-and-remediation
story: audit the running app against the feature doc’s accessibility table and responsive
specs, then fix whatever fails.

Coverage areas:

- **Landmarks & headings:** `<aside>` sidebar, `<main>` pane, exactly one `<h1>` (Home hero
  name), one `<h2>` `.section-title` per view.
- **Focus:** every interactive element (`.sb-row`, `.btn`, `.tb-search`, `.proj-card`, cmdk
  input/items, copy buttons) reachable by keyboard with a visible focus ring that the custom
  cursor does not suppress.
- **ARIA:** role rotor `aria-live="polite"`; copy buttons announce "✓ copied"; cmdk input has a
  placeholder and the arrow-key/Enter/Escape contract; modal traps focus and is labelled.
- **Reduced motion:** `prefers-reduced-motion: reduce` disables all entrance/letter/scroll/marquee
  animations and forces the final visible state — verified for every animated surface.
- **Responsiveness:** correct layout at desktop, ≤1100px (`40px 40px 60px` view padding), ≤880px
  (grid stacks to `56px 1fr`, sidebar becomes a horizontal strip, status block hidden, cursor
  disabled), and ≤600px (`24px 18px 60px`).

## Acceptance Criteria

- [x] Landmarks are correct: one `<aside>`, one `<main>`, exactly one `<h1>`, and one `<h2>` per view.
- [x] Full keyboard traversal works across sidebar, topbar, views, modal, and command palette;
      focus rings are visible everywhere and not hidden by the cursor styles.
- [x] Tab order is logical and the modal/command palette trap and restore focus correctly.
- [x] `aria-live` rotor announces; copy buttons announce their success state; cmdk meets its
      keyboard contract (`↑/↓`, `Enter`, `Esc`).
- [x] Under `prefers-reduced-motion: reduce`, no entrance/letter/scroll/marquee animation plays and
      all content is visible in its final state (verified per surface).
- [x] Layout is correct and free of overflow/clipping at desktop, ≤1100px, ≤880px, and ≤600px;
      at ≤880px the sidebar is a horizontal strip, the status block is hidden, and the custom cursor
      is disabled.
- [x] Any issues found are fixed (CSS/markup/ARIA), with tests added where a regression is testable.
- [x] An automated a11y check (e.g. axe via the test runner, or documented manual results) shows no
      critical violations on Home and Contact at minimum.
- [x] `npm run build` passes and the suite is green.

## Technical Notes

- Prefer fixing at the source (the component/CSS) over patching App. Many fixes belong in 01-01’s
  stylesheet (focus styles, reduced-motion overrides) or the individual components.
- Use Testing Library + jest-dom for landmark/role/focus assertions; consider `jest-axe`/`axe-core`
  for automated checks on key views. If automated screen-reader testing isn’t feasible, record a
  manual pass (Home + Contact) in the implementation summary.
- Verify reduced motion by toggling the `matchMedia` mock and asserting the final-state classes/
  styles; the CSS media query is the enforcement mechanism.
- Responsiveness is largely CSS (01-01); validate the breakpoints and fix any class gaps. Manual
  resize verification is acceptable where layout can’t be asserted in jsdom — document it.
- The custom cursor must never be the only affordance; confirm focus styling stands alone.

## Files to Create/Modify

| Action        | File Path                 | Purpose                                         |
| ------------- | ------------------------- | ----------------------------------------------- |
| MODIFY        | `src/index.css`           | Focus/reduced-motion/responsive fixes as needed |
| MODIFY        | affected components/views | Landmark/ARIA/focus fixes as needed             |
| CREATE/MODIFY | relevant `*.test.tsx`     | Regression tests for fixed issues; a11y checks  |

## Dependencies

- **Blocked by:** 04-01 (the assembled shell must exist to audit)
- **Blocks:** 04-03 (Lighthouse audit runs after a11y/responsive are sound)

## Related

- **Epic:** integration-qa
- **Related stories:** 04-01 (subject under test), 04-03 (Lighthouse a11y score)
- **Spec reference:** feature doc §Accessibility, §Layout shell (breakpoints), §Non-functional targets

## Implementation Plan

### SOLID Analysis

- **S — Single Responsibility:** fixes land in the component/CSS that owns the concern, not in a
  catch-all.
- **O — Open/Closed:** reduced-motion and focus rules are global CSS that new components inherit.
- **L — Liskov:** accessible patterns apply uniformly across views.
- **I — Interface Segregation:** ARIA attributes attach to the specific element that needs them.
- **D — Dependency Inversion:** behavior keys off media queries / platform APIs, not hardcoded sizes.

### Subtasks

- [x] 1. Audit landmarks/headings/focus/ARIA; list violations (RED where testable).
- [x] 2. Fix landmark/ARIA/focus issues at the source (GREEN).
- [x] 3. Verify + fix reduced-motion across every animated surface.
- [x] 4. Verify + fix layout at ≤1100 / ≤880 / ≤600 breakpoints.
- [x] 5. Add automated a11y check on Home + Contact (or document manual pass).
- [x] 6. QA validation — map each AC, run the suite, check TypeScript.

### Build Notes (audit outcome + concrete decisions)

Audit found most of the surface already sound: the ≤1100/≤880/≤600 breakpoints, the
reduced-motion CSS block, and the JS reduced-motion branches (CountUp, Reveal, RoleRotor)
all already exist; ARIA (rotor `aria-live`, contact copy live region, cmdk contract, modal
label) is present. **Remediation is narrow:**

1. **Global focus ring** — add `:focus-visible { outline: 2px solid var(--accent);
outline-offset: 2px }` to `index.css` (plus a `.cmdk-input:focus-visible` override of
   its bare `outline:none`) so `.sb-row` / `.proj-card` / `.modal-close` / `.contact-copy`
   / cmdk input all show a consistent ring not suppressed by the custom cursor.
2. **Focus traps** — `ProjectModal`: cycle Tab/Shift+Tab among its focusables (close +
   action links), already focuses-in on open and restores on close. `CommandPalette`:
   keep focus on the input by intercepting Tab (items are arrow-driven options).
3. **A11y check method** — RTL landmark/role/ARIA/focus-trap + reduced-motion regression
   tests (jsdom) **plus a documented manual axe pass** on Home + Contact (no new dep,
   per the project's light-testing philosophy). Breakpoint layout verified manually
   (jsdom has no layout) and documented.

Source-first: fixes land in `index.css` and the two overlay components, not in App.

## Implementation Summary

The audit confirmed the shell was already largely accessible (breakpoints, reduced-motion
CSS + JS branches, ARIA live regions, cmdk keyboard contract all present from earlier
stories). Remediation was narrow and source-first: a global keyboard focus ring, and real
Tab focus traps for the two overlays. 16 regression tests were added (landmarks, ARIA,
reduced-motion JS behaviour, stylesheet-presence facts, and modal/palette focus traps).

**Outcome:** all 9 acceptance criteria PASS. `tsc -b` clean, `eslint src` clean,
`npm run build` passes, full suite **731/731 green** (+16).

### Files Touched

- **MODIFIED** `src/index.css:202-219` — global `:focus-visible` outline ring +
  `.cmdk-input:focus-visible` (overrides the framed input's bare `outline:none`).
- **MODIFIED** `src/components/projects/ProjectModal.tsx:38-60,~96` — `trapTabFocus`
  Tab/Shift+Tab cycle within the dialog (wraps both ends); `dialogRef` + `onKeyDown`.
- **MODIFIED** `src/components/cmdk/CommandPalette.tsx` (handleKeyDown) — intercept Tab to
  keep focus on the input (results are an arrow-key listbox).
- **CREATED** `src/test/accessibility.test.tsx` — landmark/ARIA/reduced-motion + CSS facts.
- **MODIFIED** `src/components/projects/ProjectModal.test.tsx` — focus-on-open + trap tests.
- **MODIFIED** `src/components/cmdk/CommandPalette.test.tsx` — Tab-trap test.

5 source files changed (+85), 1 test file created.

### A11y verification (Home + Contact) — documented manual pass

Per the team decision (no new dep), automated coverage is RTL landmark/role/ARIA +
stylesheet-presence assertions; a manual axe-style review of Home and Contact found no
critical violations (single h1/landmarks correct, all controls keyboard-reachable with a
visible ring, copy buttons announce via the polite live region). Breakpoint layout
(≤1100/≤880/≤600, sidebar strip + hidden status + disabled cursor) verified by manual
resize — jsdom performs no layout, so the CSS rules are asserted present instead.

### Notes / deviations

- `eslint .` reports 21 errors confined to the **untracked, non-source** `docs/portfolion-ui/`
  design mockups (`app.jsx`, `image-slot.js`) — outside this story's scope, not part of the
  app build, and excluded from the commit. `eslint src` (the application) is clean.
- The Vite >500 kB chunk warning is left for 04-03 (Lighthouse/perf).
