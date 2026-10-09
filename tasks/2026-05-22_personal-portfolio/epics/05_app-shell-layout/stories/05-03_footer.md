---
id: 05-03
title: "Footer component"
epic: 05
status: done
size: M
blocked_by: ["02-10"]
files: ["src/components/layout/Footer.tsx"]
issue:
pr:
delivery:
prior_status:
---
# Story 05-03: Footer component

> **Epic:** App Shell & Layout
> **Size:** M
## Description

Build `src/components/layout/Footer.tsx`, the page-wide footer that sits below the last section. The Footer renders a `<footer>` HTML landmark containing three elements: the `SocialLinks` component (GitHub + LinkedIn icon links built in Epic 02), a dynamic copyright notice whose year is computed at runtime, and a short "built with" note (e.g. "Built with React + Vite"). All text and icon colours must be legible against both the light and dark theme backgrounds using Tailwind `dark:` variants. The Footer has no interactive state of its own and requires no props.

## Acceptance Criteria

- [x] The Footer renders a `<footer>` HTML landmark element as its root.
- [x] The `SocialLinks` component is rendered inside the Footer and displays GitHub and LinkedIn icon links.
- [x] A copyright line is present, formatted as `© <year> Erick Andrinirina` (or equivalent), where `<year>` is computed via `new Date().getFullYear()` — not a hardcoded string.
- [x] A "built with" note is present (e.g. "Built with React & Vite").
- [x] In light theme, all Footer text and icon colours are legible against the light background.
- [x] In dark theme, all Footer text and icon colours are legible against the dark background (verified by toggling ThemeToggle).
- [x] Toggling the theme while the footer is visible updates its colours without a page reload.
- [x] The Footer is full-width (spans the page), visually separated from the section above it (border, spacing, or background contrast).
- [x] No TypeScript errors on `npm run build`.
- [x] The `<footer>` element is present in the DOM and can be located by `role="contentinfo"` in a test or accessibility audit.

## Technical Notes

- The Footer is a pure presentational component — no context consumption beyond what `SocialLinks` handles internally. Do not call `useTheme()` or `useLanguage()` directly in `Footer.tsx` unless a localised string is needed (e.g. a translated "built with" note); in that case use `useLanguage().t('builtWith')` and ensure the key exists in `src/i18n/ui.ts`.
- Copyright year: `{new Date().getFullYear()}` inside JSX. This evaluates once per render/bundle; for a static build this is acceptable — it will reflect the year at build time in production, which is correct behaviour.
- Social link URLs come from `src/lib/constants.ts` via `SocialLinks` — Footer does not need to pass URLs as props.
- Use `Container` (from Epic 02) to centre and pad the Footer content consistently with the rest of the page.
- The `<footer>` element implicitly has `role="contentinfo"` when it is a direct child of `<body>` or the page root — no explicit role attribute is needed.
- Prefer a single horizontal flex row for desktop (SocialLinks left or centred, copyright centred or right, "built with" note) and stack vertically on mobile. Exact layout is at implementer discretion; legibility is the acceptance bar.
- If the "built with" note references Vite and React, ensure the text is in English (or localised if `t()` supports it) — do not leave it in only one language for a bilingual site.

## Files to Create/Modify

| Action | File Path                          | Purpose                                                             |
| ------ | ---------------------------------- | ------------------------------------------------------------------- |
| CREATE | `src/components/layout/Footer.tsx` | Footer landmark with social links, copyright, and "built with" note |

## Dependencies

- **Blocked by:** 02-10 (`SocialLinks` component must exist).
- **Blocks:** 05-04 (`App.tsx` page shell imports and renders `<Footer/>`).

## Related

- **Epic:** app-shell-layout
- **Related stories:** 05-04 (App.tsx renders Footer)
- **Spec reference:** components.md §Footer

## Implementation Summary

### Files Touched

| Action   | File                                            | Lines (modified) |
| -------- | ----------------------------------------------- | ---------------- |
| CREATED  | `src/components/layout/Footer.tsx`              | —                |
| CREATED  | `src/components/layout/Footer.test.tsx`         | —                |

### Summary

Implemented `Footer.tsx` as a pure presentational component with no props. The component renders a `<footer>` landmark (implicit `role="contentinfo"`) wrapping a responsive flex layout inside `Container`. It renders `SocialLinks` for icon links, a dynamic copyright line using `{new Date().getFullYear()}` and `SITE_META.name`, and a localised "built with" note via `useLanguage().t('builtWith')` (key `builtWith` already existed in `src/i18n/ui.ts` for both `fr` and `en` locales). Light/dark theme colours use Tailwind `dark:` variants on background, border, and text. Ten tests cover all acceptance criteria. Build and TypeScript type-check pass clean.

### Test Results

- Tests: 291 passed, 0 failed (10 new Footer tests)
- TypeScript: 0 errors
- ESLint: 0 issues
- Build: success

## Implementation Plan

### SOLID Analysis

- **S** — `Footer.tsx` has one responsibility: render the footer landmark with social links, copyright, and built-with note. No state, no side effects.
- **O** — Open for extension via Tailwind class composition; closed for modification (uses `SocialLinks` and `Container` as-is).
- **L** — Not applicable (no inheritance).
- **I** — Footer takes no props; minimal interface.
- **D** — Uses `useLanguage().t('builtWith')` for the localized label; `SocialLinks` resolves its own URLs from constants.

### Subtasks

- [x] 1. Write failing tests (Footer.test.tsx) — RED phase
- [x] 2. Implement Footer.tsx — GREEN phase
- [x] 3. Refactor + SOLID compliance check
- [x] 4. QA validation
- [x] 5. Completion (story file updates)
