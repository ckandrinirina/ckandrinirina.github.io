---
id: 02-07
title: "useReveal hook"
epic: 02
status: done
size: M
blocked_by: ["01-01"]
files: ["src/hooks/useReveal.ts"]
issue:
pr:
delivery: direct
prior_status:
---
# Story 02-07: useReveal hook

> **Epic:** Design System — UI Primitives & Hooks
> **Size:** M
## Description

Create `src/hooks/useReveal.ts` — a custom React hook that uses
`IntersectionObserver` to detect when a DOM element enters the viewport and
exposes an `isVisible` boolean alongside a `ref` to attach to that element.
`Section` (Story 02-09) attaches this ref to its root element and uses
`isVisible` to apply entrance animation classes. The hook is one-shot: once
visible, it stays visible and the observer is disconnected to avoid unnecessary
callbacks. Under `prefers-reduced-motion: reduce`, the hook skips the observer
entirely and returns `isVisible = true` immediately, ensuring content is always
accessible regardless of animation preference.

## Acceptance Criteria

- [x] The hook returns `{ ref, isVisible }` where `ref` is a `React.RefObject<Element>` and `isVisible` is a `boolean`.
- [x] On first mount, `isVisible` is `false` when reduced-motion is **not** active.
- [x] When the attached element intersects the viewport (`threshold` ≥ 0.1 or similar), `isVisible` becomes `true` and remains `true`.
- [x] After `isVisible` becomes `true`, the `IntersectionObserver` is disconnected (one-shot behaviour — no further callbacks are fired).
- [x] The observer is also disconnected on component unmount (cleanup in `useEffect` return).
- [x] When `window.matchMedia('(prefers-reduced-motion: reduce)').matches` is `true`:
  - [x] `isVisible` is `true` immediately (on mount), without waiting for intersection.
  - [x] No `IntersectionObserver` instance is created.
- [x] The hook handles the case where `ref.current` is `null` at effect time without throwing.
- [x] The hook is a named export from `src/hooks/useReveal.ts` (i.e. `export function useReveal()`).
- [x] TypeScript compiles without errors; return type is explicitly annotated or correctly inferred.
- [x] ESLint reports no violations.
- [x] **Test notes (for the implementer; tests are not strictly required by this story but are encouraged):** Mock `IntersectionObserver` and `window.matchMedia` in `src/test/setup.ts` or at the top of the test file. Verify: (a) `isVisible` starts `false`, becomes `true` after simulated intersection; (b) under mocked `prefers-reduced-motion: reduce`, `isVisible` is `true` immediately; (c) cleanup disconnects the observer.

## Technical Notes

- `IntersectionObserver` is not available in the Vitest/jsdom environment by default. Add a mock in `src/test/setup.ts`:
  ```ts
  const mockObserve = vi.fn()
  const mockDisconnect = vi.fn()
  vi.stubGlobal(
    'IntersectionObserver',
    vi.fn(() => ({
      observe: mockObserve,
      disconnect: mockDisconnect,
      unobserve: vi.fn(),
    })),
  )
  ```
  Similarly stub `window.matchMedia` if not already done.
- Hook implementation pattern:
  ```ts
  export function useReveal(options?: IntersectionObserverInit) {
    const ref = useRef<Element>(null)
    const [isVisible, setIsVisible] = useState(
      () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    )
    useEffect(() => {
      if (isVisible) return // already true (reduced-motion)
      if (!ref.current) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        },
        { threshold: 0.1, ...options },
      )
      observer.observe(ref.current)
      return () => observer.disconnect()
    }, [])
    return { ref, isVisible }
  }
  ```
- Default threshold: `0.1` (10% of element visible). Make it configurable via an optional `options` argument.
- The `isVisible` state initialiser reads `matchMedia` at call time. If `matchMedia` is not available (SSR/jsdom without stub), guard with `typeof window !== 'undefined'`.

## Files to Create/Modify

| Action | File Path                | Purpose                                                            |
| ------ | ------------------------ | ------------------------------------------------------------------ |
| CREATE | `src/hooks/useReveal.ts` | IntersectionObserver-based reveal hook with reduced-motion support |

## Dependencies

- **Blocked by:** 01-01 (project scaffold — `src/hooks/` directory must exist)
- **Blocks:** 02-09 (Section uses useReveal), 09-03 (if a dedicated animation story references useReveal)

## Related

- **Epic:** design-system-primitives
- **Related stories:** 02-09 (Section attaches useReveal ref to its root)
- **Spec reference:** data-flow.md §6 Reveal-on-scroll; components.md §Hooks (useReveal)

## Implementation Plan

### SOLID Analysis

- **S:** `useReveal.ts` has one responsibility — expose `{ ref, isVisible }` backed by `IntersectionObserver` with reduced-motion guard.
- **O:** Options param (`IntersectionObserverInit`) lets callers extend threshold/rootMargin without modifying the hook.
- **L:** Not applicable (no inheritance hierarchy).
- **I:** Return type exposes only `{ ref, isVisible }` — no extra state leaked.
- **D:** Browser globals (`matchMedia`, `IntersectionObserver`) are guarded by `typeof window !== 'undefined'`; injectable via options for testability.

### Subtasks

- [x] 1. Write failing tests for `useReveal` (RED phase)
- [x] 2. Implement `src/hooks/useReveal.ts` (GREEN phase)
- [x] 3. Refactor and SOLID review (REFACTOR phase)
- [x] 4. QA validation
- [x] 5. Completion (story file, status update)

## Implementation Summary

### Files Touched

| Action  | File                          | Notes                                                                           |
| ------- | ----------------------------- | ------------------------------------------------------------------------------- |
| CREATED | `src/hooks/useReveal.ts`      | Named export `useReveal(options?)` — IntersectionObserver + reduced-motion hook |
| CREATED | `src/hooks/useReveal.test.ts` | 13 tests covering all acceptance criteria                                       |

`src/test/setup.ts` was NOT modified — the existing `MockIntersectionObserver` and `matchMedia` stubs were already present and sufficient. Per-test class-based mocks were used inside the test file for controllable callback triggering.

### QA Results

- Tests: 55/55 pass (13 new + 42 pre-existing)
- TypeScript: no errors (`npx tsc --noEmit`)
- ESLint: no violations (`npx eslint src/`)
- All 10 acceptance criteria: PASS

### Key Design Decisions

- `useState` initializer reads `matchMedia` at call time (synchronous, no effect needed).
- `useEffect` deps = `[]` (intentional one-shot; `eslint-disable` comment explains the conscious omission of `isVisible` from deps to avoid double-effect).
- Return type uses `React.RefObject<Element | null>` to match TypeScript 5.7+ `useRef<Element>(null)` inference.
- `typeof window !== 'undefined'` guard for SSR safety.

---

## Bug Report — BUG-20260602-01

> **Status:** FIXED
> **Reported:** 2026-06-02
> **Scope:** Multi-story (verdict B) — primary record in story 06-01.

### Symptom

Home (`accueil`) entrance animations from the reveal primitives were missing /
degraded: the tech marquee popped in instantly, and the hero name faded as a
block instead of cascading letter-by-letter.

### Root cause (primitive layer)

- **`Reveal`** (`src/components/ui/Reveal.tsx`): the container carried the
  `.reveal` scroll-reveal class (`opacity:0` + transform until `useScrollReveal`
  adds `.in`). Layered over the per-character `charIn` animation it washed out
  the letter cascade. The reference gives the wrapper no `.reveal` class.
- **`Marquee`** (`src/components/ui/Marquee.tsx`): wrapper omitted `reveal r-fade`
  so `useScrollReveal` never faded it in.

`useReveal.ts` itself was **not** at fault — the defect was in the consuming
`Reveal` / `Marquee` primitives' class wiring.

### Fix

- `Reveal` container no longer prepends `reveal` to its class string.
- `Marquee` wrapper gains `reveal r-fade`.

### Resolution

- SOLID (bounded to diff): S/O/L/I/D all PASS — className placement only.
- Regression tests added in `Reveal.test.tsx` and `Marquee.test.tsx`.
- Full suite: **748 passed**. Build + ESLint clean.

### Files Touched

- MODIFIED `src/components/ui/Reveal.tsx:14-17,45`
- MODIFIED `src/components/ui/Marquee.tsx:40`
- MODIFIED `src/components/ui/Reveal.test.tsx`
- MODIFIED `src/components/ui/Marquee.test.tsx`
