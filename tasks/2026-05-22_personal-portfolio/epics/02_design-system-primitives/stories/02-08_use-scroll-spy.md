---
id: 02-08
title: "useScrollSpy hook"
epic: 02
status: done
size: M
blocked_by: ["01-01"]
files: ["src/hooks/useScrollSpy.ts"]
issue:
pr:
delivery:
prior_status:
---
# Story 02-08: useScrollSpy hook

> **Epic:** Design System — UI Primitives & Hooks
> **Size:** M
## Description

Create `src/hooks/useScrollSpy.ts` — a custom React hook that accepts an array
of DOM element ids (matching the `<section id="…">` elements), observes each
with an `IntersectionObserver`, and returns the id of the section currently most
visible in the viewport. The `Header` component (Epic 05, Story 05-02) passes
the `NAV_SECTIONS` ids to this hook and uses the returned active id to highlight
the correct nav link. The hook is read-only and stateless with respect to
content; it only tracks the viewport intersection state.

## Acceptance Criteria

- [x] The hook signature is `useScrollSpy(sectionIds: string[]): string` (returns the active section id as a string).
- [x] Before any section intersects the viewport, the hook returns the first element of `sectionIds` (default to first section).
- [x] When a section enters the viewport, the hook updates the returned id to that section's id.
- [x] When multiple sections are partially visible, the hook returns the id of the one with the greatest intersection ratio (or the topmost one in DOM order — document the chosen tie-breaking rule).
- [x] All `IntersectionObserver` instances are disconnected on component unmount (cleanup in `useEffect` return).
- [x] Passing an empty array does not throw; the hook returns an empty string or handles it gracefully.
- [x] Ids that do not match any DOM element at the time the effect runs are silently skipped (no `null`-ref crash).
- [x] The hook re-runs observers when `sectionIds` changes (the effect dependency includes `sectionIds`).
- [x] The hook is a named export from `src/hooks/useScrollSpy.ts`.
- [x] TypeScript compiles without errors; the return type is `string`.
- [x] ESLint reports no violations.
- [x] **Test notes:** Mock `IntersectionObserver` (same approach as 02-07). Verify: (a) initial return is first id; (b) simulating an intersection event for a given id updates the returned value; (c) cleanup disconnects all observers; (d) non-existent id does not crash.

## Technical Notes

- `IntersectionObserver` mock: same global stub as in Story 02-07. If the stub is added to `src/test/setup.ts` by 02-07, it will be available here automatically.
- Implementation pattern — one observer per section:
  ```ts
  export function useScrollSpy(sectionIds: string[]): string {
    const [activeId, setActiveId] = useState(sectionIds[0] ?? '')
    useEffect(() => {
      if (!sectionIds.length) return
      const observers: IntersectionObserver[] = []
      sectionIds.forEach((id) => {
        const el = document.getElementById(id)
        if (!el) return
        const obs = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) setActiveId(id)
          },
          { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
        )
        obs.observe(el)
        observers.push(obs)
      })
      return () => observers.forEach((o) => o.disconnect())
    }, [sectionIds])
    return activeId
  }
  ```
- `rootMargin: '-40% 0px -55% 0px'` is a common pattern that activates the section when its top third crosses the vertical centre of the viewport — adjust based on actual UX testing.
- The `sectionIds` array reference should be stable at the call site (pass a memoised or module-level constant) to avoid infinite re-render loops. Document this expectation in a JSDoc comment on the hook.
- Alternative: use a single observer with multiple targets and pick the entry with the highest `intersectionRatio` — simpler observer management but slightly different tie-breaking. Either approach is acceptable; document the choice.

## Files to Create/Modify

| Action | File Path                   | Purpose                                                                |
| ------ | --------------------------- | ---------------------------------------------------------------------- |
| CREATE | `src/hooks/useScrollSpy.ts` | IntersectionObserver-based active section tracker for nav highlighting |

## Dependencies

- **Blocked by:** 01-01 (project scaffold)
- **Blocks:** 05-02 (Header uses useScrollSpy to highlight nav links)

## Related

- **Epic:** design-system-primitives
- **Related stories:** 02-01 (NAV_SECTIONS constant provides the ids array), 05-02 (Header imports useScrollSpy)
- **Spec reference:** data-flow.md §5 Navigation & scroll spy; components.md §Hooks (useScrollSpy)

## Implementation Plan

### Subtasks

- [x] Write failing tests (RED) — `src/hooks/useScrollSpy.test.ts`
- [x] Implement hook (GREEN) — `src/hooks/useScrollSpy.ts`
- [x] Refactor (SOLID review + cleanup)
- [x] QA validation (acceptance criteria check)
- [x] Completion (story file update, mark DONE)

### SOLID Analysis

- **S:** Hook has one job — track which section id is most visible via IntersectionObserver.
- **O:** Accepts generic `sectionIds[]`; options (rootMargin, threshold) are encapsulated; consumers extend behavior by changing ids, not modifying the hook.
- **L:** Always returns `string` (empty string for empty input) — no `undefined` or `null`.
- **I:** Minimal surface: `useScrollSpy(sectionIds: string[]): string` — no extra state exposed.
- **D:** Global `IntersectionObserver` is the dependency; tests inject a mock via `vi.stubGlobal` in `setup.ts`.

### Design Decision

Using one `IntersectionObserver` per section (as per Technical Notes pattern). Tie-breaking rule: **first-intersection wins** — when a section's observer fires with `isIntersecting: true`, that section becomes active. With `rootMargin: '-40% 0px -55% 0px'` and `threshold: 0`, only one section occupies the activation zone at a time in normal scroll usage, making tie-breaking moot in practice. This rule is documented in JSDoc on the hook.

## Implementation Summary

### Files Touched

| Action | File | Lines |
|--------|------|-------|
| CREATED | `src/hooks/useScrollSpy.ts` | 45 lines |
| CREATED | `src/hooks/useScrollSpy.test.ts` | 303 lines |

### QA Results

- **Tests:** 16/16 pass (all acceptance criteria covered)
- **TypeScript:** No errors in our files (`tsc --noEmit` clean for `src/hooks/useScrollSpy.ts` and `src/hooks/useScrollSpy.test.ts`)
- **ESLint:** No violations (`eslint src/hooks/useScrollSpy.ts src/hooks/useScrollSpy.test.ts` — no issues found)

### Key Decisions

- One `IntersectionObserver` per section (not a single observer with multiple targets) — cleaner cleanup, one callback per section id
- `rootMargin: '-40% 0px -55% 0px'` — activates sections when they cross the vertical centre; only one section in the activation zone at normal scroll speeds
- Tie-breaking: first-intersection wins (documented in JSDoc)
- `sectionIds[0] ?? ''` default — empty string for empty array; first id otherwise
- Null-safe element lookup via `if (!el) return` — silently skips missing DOM elements

### IntersectionObserver Mock Note

The global `IntersectionObserver` stub already in `src/test/setup.ts` (added by story 02-07) was reused as the baseline. Tests override it per-test with a controllable `MockIOInstance` that captures callbacks and exposes a `triggerIntersect()` method for simulating intersection events. `src/test/setup.ts` was NOT modified.
