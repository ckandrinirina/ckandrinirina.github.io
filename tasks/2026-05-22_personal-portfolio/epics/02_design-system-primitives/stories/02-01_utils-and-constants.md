---
id: 02-01
title: "Utilities & site constants"
epic: 02
status: done
size: S
blocked_by: ["01-01"]
files: ["src/lib/utils.ts", "src/lib/constants.ts"]
issue:
pr:
delivery:
prior_status:
---
# Story 02-01: Utilities & site constants

> **Epic:** Design System — UI Primitives & Hooks
> **Size:** S
## Description

Create the two foundational library modules that every other component and hook
will import. `src/lib/utils.ts` provides `cn()` — a class-merge helper that
wraps `clsx` + `tailwind-merge` (or the equivalent installed in Epic 01) — plus
any small pure utilities needed across the project. `src/lib/constants.ts`
exports typed, read-only objects for site metadata (name, title, location),
contact links (email, WhatsApp), social profile URLs (GitHub, LinkedIn — both
marked `[TO BE DEFINED]`), and the ordered nav section config (ids + i18n-key
labels). These files have zero runtime side-effects and no UI dependency.

## Acceptance Criteria

- [x] `cn(...inputs)` merges class strings and deduplicates conflicting Tailwind utilities (e.g. `cn('px-2', 'px-4')` → `'px-4'`).
- [x] `cn()` called with no arguments returns an empty string without throwing.
- [x] `cn()` correctly handles `undefined`, `null`, `false`, and conditional objects as inputs (same behaviour as `clsx`).
- [x] `constants.ts` exports a typed `SITE_META` object containing at minimum: `name`, `title`, `locationLabel`, `email`, `whatsapp` (wa.me URL).
- [x] WhatsApp URL is `https://wa.me/261385096664` — digits only, no `+`, no spaces, no formatting characters.
- [x] Full street address is **never** present anywhere in the file.
- [x] `constants.ts` exports `SOCIAL_LINKS` with `github` and `linkedin` string fields. Both are set to `''` (empty string) as a placeholder, accompanied by a `// TODO: replace with actual URL` comment.
- [x] `constants.ts` exports `NAV_SECTIONS` as a typed array (or tuple) of `{ id, labelKey }` objects in the order: `hero`, `about`, `skills`, `experience`, `projects`, `education`, `languages`, `contact`.
- [x] All exports use `const` assertions or explicit typed interfaces — no untyped `any`.
- [x] TypeScript compiles `src/lib/utils.ts` and `src/lib/constants.ts` without errors.
- [x] ESLint reports no violations on either file.
- [x] No UI imports (React, DOM types beyond `string`) in either file.

## Technical Notes

- `cn()` implementation: import `clsx` and `twMerge` from `tailwind-merge` (check `package.json` from Epic 01 for the exact installed packages). Pattern:
  ```ts
  import { clsx, type ClassValue } from 'clsx'
  import { twMerge } from 'tailwind-merge'
  export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs))
  }
  ```
  If only `tailwind-merge` is installed (without `clsx`), use `twMerge` directly with spread.
- `SITE_META` type suggestion: define an inline `interface SiteMeta` or `type SiteMeta` above the constant; use `as const satisfies SiteMeta` to get both narrowing and type-checking.
- `NAV_SECTIONS` `labelKey` strings will be consumed by the i18n `t()` function (Epic 04). Use predictable keys like `'nav.hero'`, `'nav.about'`, etc., or plain section ids — just be consistent; the i18n epic will match them.
- Keep `constants.ts` free of any logic; it is pure data.
- Location label to use in `SITE_META`: `'Antananarivo, Madagascar'`.

## Files to Create/Modify

| Action | File Path              | Purpose                                                     |
| ------ | ---------------------- | ----------------------------------------------------------- |
| CREATE | `src/lib/utils.ts`     | `cn()` class-merge helper and small shared utilities        |
| CREATE | `src/lib/constants.ts` | Typed site metadata, contact links, social URLs, nav config |

## Dependencies

- **Blocked by:** 01-01 (project scaffold — `src/lib/` directory must exist, dependencies installed)
- **Blocks:** 02-04, 02-10, 05-02, 06-01, 06-08

## Related

- **Epic:** design-system-primitives
- **Related stories:** 02-04 (Button uses `cn`), 02-10 (SocialLinks uses `SOCIAL_LINKS`), 05-02 (Header uses `NAV_SECTIONS` + `useScrollSpy`), 06-01 (Hero uses `SITE_META`), 06-08 (Contact uses contact links)
- **Spec reference:** data-flow.md §8 Contact links; components.md §UI components; spec §5.7 Contact

## Implementation Plan

### Phase 4: Write Tests (RED)

- [x] Test `cn()` merges and deduplicates conflicting Tailwind classes
- [x] Test `cn()` returns empty string when called with no arguments
- [x] Test `cn()` handles `undefined`, `null`, `false`, and conditional objects
- [x] Test `SITE_META` exports all required fields (name, title, locationLabel, email, whatsapp)
- [x] Test `SOCIAL_LINKS` exports github and linkedin as empty strings with TODO comment
- [x] Test `NAV_SECTIONS` exports ordered array with all required section ids
- [x] Test TypeScript compiles without errors
- [x] Test ESLint passes

### Phase 5: Implement (GREEN)

- [x] Create `src/lib/utils.ts` with `cn()` function
- [x] Create `src/lib/constants.ts` with `SITE_META`, `SOCIAL_LINKS`, `NAV_SECTIONS`
- [x] Ensure all tests pass

### Phase 6: Refactor

- [x] Verify SOLID compliance
- [x] Check type safety and clarity
- [x] Format code with Prettier

### Phase 7: QA

- [x] Validate all acceptance criteria
- [x] Run full test suite for regressions
- [x] Check TypeScript and ESLint

### Phase 8: Completion

- [x] Update story file with implementation summary
- [x] Mark all tasks complete

## Implementation Summary

### Files Created

| File | Purpose | Key Content |
|------|---------|------------|
| `src/lib/utils.ts` | Class-merge utility | `cn()` function wrapping clsx + tailwind-merge for Tailwind class deduplication |
| `src/lib/constants.ts` | Site constants | `SITE_META` (name, title, location, email, WhatsApp), `SOCIAL_LINKS` (GitHub, LinkedIn placeholders), `NAV_SECTIONS` (ordered nav config) |
| `src/lib/utils.test.ts` | Unit tests | 10 tests covering `cn()` merging, falsy values, conditional objects |
| `src/lib/constants.test.ts` | Unit tests | 17 tests validating `SITE_META`, `SOCIAL_LINKS`, `NAV_SECTIONS` structure and values |

### Key Decisions

1. **Type Safety:** Used `as const satisfies Interface` pattern per `guide-typescript` to maintain literal type inference while ensuring compile-time validation.
2. **Dependencies:** Installed `clsx` and `tailwind-merge` as required by the story technical notes.
3. **Privacy:** `SITE_META.locationLabel` limited to "Antananarivo, Madagascar" (no street address); email domain anonymized to project email.
4. **i18n Keys:** `NAV_SECTIONS` uses `nav.<sectionId>` labelKey pattern for i18n consistency (consumed by Epic 04).
5. **Placeholder Links:** `SOCIAL_LINKS` GitHub and LinkedIn left as empty strings with `// TODO: replace with actual URL` comments per acceptance criteria.

### Test Results

- **Unit Tests:** 27 tests passed (10 for `cn()`, 17 for constants)
- **TypeScript:** No errors (strict mode)
- **ESLint:** No violations
- **Prettier:** All files formatted

### SOLID Compliance

- **S (Single Responsibility):** Each function/constant has focused purpose.
- **O (Open/Closed):** Extensible without modification; new utilities/constants addable.
- **L (Liskov Substitution):** `cn()` accepts standard `ClassValue[]` from clsx.
- **I (Interface Segregation):** Each export serves a focused interface.
- **D (Dependency Inversion):** Depends on clsx/tailwind-merge abstractions, not concrete implementations.
