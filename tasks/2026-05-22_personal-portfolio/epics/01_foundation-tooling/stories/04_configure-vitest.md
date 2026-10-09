---
id: 01-04
title: "Configure Vitest + Testing Library + test setup"
epic: 01
status: done
size: M
blocked_by: ["01-01", "01-02"]
files: ["vite.config.ts", "src/test/setup.ts", "src/test/setup.test.ts", "tsconfig.json", "package.json"]
issue:
pr:
delivery:
prior_status:
---
# Story 01-04: Configure Vitest + Testing Library + test setup

> **Epic:** Project Foundation & Tooling
> **Size:** M
## Description

Install Vitest 3, `@testing-library/react`, `@testing-library/jest-dom`, and `jsdom`. Configure Vitest inside `vite.config.ts` (or a dedicated `vitest.config.ts`) with `environment: 'jsdom'`, `globals: true`, and `setupFiles: './src/test/setup.ts'`. Create `src/test/setup.ts` that imports `@testing-library/jest-dom` to register its matchers. Update `tsconfig.json` to include `"vitest/globals"` and `"@testing-library/jest-dom"` in `compilerOptions.types`. Add the `test` npm script. Write a trivial smoke test to verify the full pipeline passes.

## Acceptance Criteria

- [x] `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, and `jsdom` are listed as dev dependencies in `package.json`.
- [x] A Vitest config exists (either the `test` block in `vite.config.ts` or a `vitest.config.ts` file).
- [x] Vitest config sets `environment: 'jsdom'`.
- [x] Vitest config sets `globals: true`.
- [x] Vitest config sets `setupFiles` to `'./src/test/setup.ts'` (or equivalent relative path).
- [x] `src/test/setup.ts` exists and imports `'@testing-library/jest-dom'`.
- [x] `tsconfig.json` `compilerOptions.types` array includes both `"vitest/globals"` and `"@testing-library/jest-dom"`.
- [x] `package.json` `scripts` contains `"test": "vitest"`.
- [x] `npm run test -- --run` exits with code 0 and reports at least one passing test.
- [x] In a test file, `describe`, `it`, and `expect` are available without any import statement and TypeScript does not report them as unknown identifiers.
- [x] `@testing-library/jest-dom` matchers (e.g. `toBeInTheDocument()`, `toHaveTextContent()`) are available in test files without importing from `@testing-library/jest-dom` directly (they are registered via `setup.ts`).
- [x] A component test using `render` from `@testing-library/react` runs successfully and can query the rendered DOM.
- [x] `npm run build` (which runs `tsc -b && vite build`) still exits code 0 after the tsconfig changes.

### Edge Cases

- Vitest and Vite share the same config when using the `test` block inside `vite.config.ts` — ensure the `test` block does not interfere with production build settings (the `test.environment` key is ignored during `vite build`).
- If using a separate `vitest.config.ts`, it must also import the Tailwind and React plugins so tests can resolve CSS and JSX correctly; ensure it extends or merges the base `vite.config.ts`.
- The `types` array in `tsconfig.json` may already contain other entries (e.g. `"vite/client"` from the scaffold); append the two new entries rather than replacing the array.
- Some versions of `@testing-library/jest-dom` require the import to be `import '@testing-library/jest-dom'` (side-effect import, not a named import); verify the correct form for the installed version.
- Running tests with `globals: true` without the matching `tsconfig` types causes TypeScript errors in test files (`Cannot find name 'describe'`). Verify by running `tsc --noEmit` after the config update.

### Test Note

A trivial smoke test that satisfies the "at least one passing test" criterion is sufficient at this stage. For example, a file `src/test/setup.test.ts` with:

```ts
it('test harness is configured', () => {
  expect(true).toBe(true)
})
```

This test validates that globals work, the runner executes, and the setup file loads without errors.

## Technical Notes

- Vitest config block (inside `vite.config.ts`):
  ```ts
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  }
  ```
- `src/test/setup.ts` content:
  ```ts
  import '@testing-library/jest-dom'
  ```
- `tsconfig.json` types addition:
  ```jsonc
  "compilerOptions": {
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  }
  ```
- Vitest 3 ships with first-class Vite 7 support; no compatibility shims are needed.
- The `src/test/` directory is the designated home for test infrastructure files per `folder-structure.md`. Component-specific tests live co-located with their components (e.g. `src/components/ui/ThemeToggle.test.tsx`), but the setup infrastructure lives in `src/test/`.
- `jsdom` version: install `jsdom@latest`; Vitest 3 may bundle a compatible version automatically — check that the installed version satisfies Vitest's peer dependency before installing separately.

## Files to Create/Modify

| Action | File Path                | Purpose                                                              |
| ------ | ------------------------ | -------------------------------------------------------------------- |
| MODIFY | `vite.config.ts`         | Add `test` block (or create `vitest.config.ts` as alternative)       |
| CREATE | `src/test/setup.ts`      | Import `@testing-library/jest-dom` to register matchers globally     |
| CREATE | `src/test/setup.test.ts` | Trivial smoke test to validate the harness                           |
| MODIFY | `tsconfig.json`          | Add `"vitest/globals"` and `"@testing-library/jest-dom"` to types    |
| MODIFY | `package.json`           | Add `test` script and install vitest/testing-library devDependencies |

## Dependencies

- **Blocked by:** 01-01, 01-02
- **Blocks:** All test stories: 02-04, 03-03, 04-06, 04-07, 06-01

## Related

- **Epic:** 01_foundation-tooling
- **Related stories:** 01-01, 01-02, 01-05
- **Spec reference:** tech-stack.md (Tooling section), dev-guide.md §3 Quality checks

## Implementation Plan

TDD order: tests → implementation → refactor → QA → completion.

- [x] **RED** — Create `src/test/setup.test.ts` covering: smoke (`expect(true)`), globals (`describe`/`it`/`expect` with no import), jest-dom matcher (`toBeInTheDocument`), RTL `render` + DOM query, and jsdom polyfills (`window.matchMedia`, `IntersectionObserver`) defined. Run `npm run test -- --run` → RED (runner not yet installed/configured).
- [x] **GREEN** —
  - Install devDeps: `vitest @testing-library/react @testing-library/jest-dom jsdom`.
  - `vite.config.ts`: switch `defineConfig` import to `vitest/config`; add `test: { environment: 'jsdom', globals: true, setupFiles: './src/test/setup.ts' }`.
  - Create `src/test/setup.ts`: `import '@testing-library/jest-dom'` + `matchMedia`/`IntersectionObserver` mocks (per `expert-qa`; jsdom lacks them — needed by downstream hook/component tests).
  - `tsconfig.json`: append `"vitest/globals"`, `"@testing-library/jest-dom"` to `compilerOptions.types` (keep `"vite/client"`).
  - `package.json`: `"test": "vitest"` (already present from 01-05) — verify only.
  - Run tests → GREEN.
- [x] **REFACTOR** — SOLID/quality review of config; tests stay green.
- [x] **QA** — `npm run test -- --run`, `tsc --noEmit` (globals resolve), `npm run lint`, `npm run build` all pass; map each acceptance criterion.
- [x] **COMPLETION** — Implementation Summary, statuses → DONE, manual-test gate.

### SOLID Analysis

- **S** — One responsibility per artifact: `setup.ts` = matcher registration + jsdom polyfills; `test` block = runner config; `tsconfig.types` = global type visibility.
- **O/L/I/D** — N/A for static tooling config (no classes, interfaces, or injected dependencies). Config is additive (open for extension via more `setupFiles`/types without modifying test logic).

### Unplanned Changes

- `src/test/setup.ts` — added `matchMedia` + `IntersectionObserver` mocks beyond the bare jest-dom import — `expert-qa` mandates them (jsdom lacks both) and the already-built `useReveal`/`useScrollSpy`/theme components depend on them; covered by a test in `setup.test.ts`.
- `src/test/setup.ts` — added `afterEach(cleanup)` to unmount React trees between tests (prevents cross-test DOM leakage per `expert-qa`).

## Implementation Summary

**Status:** DONE (manual-test PASS).

Configured the Vitest 3+ test harness (Vitest 4.1.7 installed — latest, Vite 7 first-class support) with React Testing Library, jest-dom, and jsdom. `defineConfig` now imports from `vitest/config` so the `test` block is typed without a triple-slash directive. The shared `src/test/setup.ts` registers jest-dom matchers and polyfills `matchMedia` + `IntersectionObserver` (absent in jsdom) so downstream theme/hook/component tests run without per-file boilerplate.

**QA:** 13/13 acceptance criteria PASS · 3/3 tests pass · `tsc --noEmit` 0 · `eslint` 0 · `vite build` 0.

### Files Touched

- **CREATED** `src/test/setup.ts` — jest-dom registration + jsdom polyfills (matchMedia, IntersectionObserver) + `afterEach` cleanup.
- **CREATED** `src/test/setup.test.ts` — smoke test, RTL render + jest-dom matcher assertions, polyfill availability test.
- **MODIFIED** `vite.config.ts:1-3,16-21` — `defineConfig` from `vitest/config`; added `test` block (jsdom, globals, setupFiles).
- **MODIFIED** `tsconfig.json:7` — appended `"vitest/globals"`, `"@testing-library/jest-dom"` to `compilerOptions.types`.
- **MODIFIED** `package.json:21-22,30,37` — added `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom` devDependencies (`test` script already present from 01-05).
- **MODIFIED** `package-lock.json` — lockfile for the new devDependencies (82 packages).
