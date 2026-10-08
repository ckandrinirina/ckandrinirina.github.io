---
epic: 02
slug: design-system-primitives
title: "Design System — UI Primitives & Hooks"
description: "This epic establishes the reusable, content-agnostic building blocks that all section and layout components consume."
issue:
pr:
delivery:
---
# Epic 02: Design System — UI Primitives & Hooks

## Description

This epic establishes the reusable, content-agnostic building blocks that all
section and layout components consume. It covers utility modules, site-wide
constants, design tokens, layout wrapper components, interactive UI primitives,
and the two behaviour hooks that drive scroll-based features. Nothing here
renders portfolio content directly — this layer is purely about shared
infrastructure, styling, and interactivity.

Every artefact follows the project conventions: one React 19 function component
per `PascalCase.tsx` file with a default export; hooks live in `useXxx.ts` files
with named exports; all styling is expressed through Tailwind utility classes
inline, with shared colour, typography, and spacing tokens declared in the
`@theme` block of `src/index.css`.

This epic depends on Epic 01 (scaffolding, tooling, and the Tailwind/dark-mode
baseline) being complete, and is itself a hard prerequisite for Epic 05 (layout
shell: Header, Footer) and Epic 06 (all section components). No section or
layout code should be written until the stories here are done and merged.

## Goals

- Provide a `cn()` helper and typed site-constants (contact links, nav config) consumed everywhere.
- Declare all design tokens (colours, fonts, optional spacing/radii) in `@theme` so Tailwind utility classes are consistent and theme-aware across light and dark.
- Deliver four content-agnostic components — `Container`, `Button`, `Badge`, `Card` — each usable as a standalone composable unit.
- Deliver two layout wrapper components — `Section` and `SocialLinks` — that bring together tokens, primitives, and hooks.
- Implement `useReveal` and `useScrollSpy` hooks backed by `IntersectionObserver`, both accessibility-safe under `prefers-reduced-motion`.

## Scope

### In Scope

- `src/lib/utils.ts` — `cn()` class-merge helper and small utilities.
- `src/lib/constants.ts` — typed site metadata, contact info, social URLs, nav section config.
- `src/index.css` — design tokens in `@theme` block (colours, fonts, spacing/radii as needed).
- `src/components/layout/Container.tsx` — centred max-width wrapper.
- `src/components/layout/Section.tsx` — semantic `<section>` with id, `<h2>` heading, `Container`, and reveal via `useReveal`.
- `src/components/ui/Button.tsx` + `Button.test.tsx` — polymorphic styled button/link with primary / secondary / ghost variants.
- `src/components/ui/Badge.tsx` — skill/tech chip.
- `src/components/ui/Card.tsx` — experience/project card shell.
- `src/components/ui/SocialLinks.tsx` — GitHub + LinkedIn icon anchors from constants.
- `src/hooks/useReveal.ts` — `IntersectionObserver`-based reveal hook.
- `src/hooks/useScrollSpy.ts` — `IntersectionObserver`-based active-section tracker.

### Out of Scope

- Any component that renders portfolio content (`Hero`, `About`, `Skills`, etc.).
- `ThemeToggle`, `LanguageSwitcher`, `DownloadCvButton` (covered in Epic 03 / 04).
- `ThemeProvider`, `LanguageProvider`, and their hooks (covered in Epic 03).
- Content files (`src/content/`), i18n plumbing (covered in Epic 04).
- Header / Footer (covered in Epic 05).
- Test coverage for `Badge`, `Card`, `Container`, `Section`, `SocialLinks` (light visual components; only `Button` requires a test in this epic).
- Any form, animation library, or third-party icon library beyond what is approved in Epic 01.

## Dependencies

- **Depends on:** Epic 01 (project scaffold, Vite config, Tailwind v4 + dark variant, Vitest tooling)
- **Blocks:** Epic 05 (layout shell — Header, Footer), Epic 06 (all section components)

## Acceptance Criteria

- [ ] `cn()` correctly merges and deduplicates Tailwind classes (including conflicting utilities).
- [ ] `constants.ts` exports typed objects for site metadata, contact links, and nav config; GitHub/LinkedIn URLs are marked `[TO BE DEFINED]` with a `// TODO` comment.
- [ ] Design tokens are available as Tailwind utilities (e.g. `text-brand-500`, `bg-surface`) and resolve correctly in both light and dark.
- [ ] `Container` centres content with a consistent max-width and responsive horizontal padding on all breakpoints.
- [ ] `Button` renders `<button>` or `<a>` based on the `as` prop; each of three variants (primary, secondary, ghost) has visually distinct styles; focus rings are visible; tests pass.
- [ ] `Badge` renders a legible, rounded chip in light and dark.
- [ ] `Card` renders a surface with appropriate border/elevation in light and dark.
- [ ] `useReveal` exposes `{ ref, isVisible }`; under `prefers-reduced-motion: reduce`, `isVisible` is `true` on mount and no observer is created; observer disconnects after first reveal.
- [ ] `useScrollSpy` returns the active section id based on viewport intersection; defaults to first section before any intersection; cleans up observers on unmount.
- [ ] `Section` renders a `<section id>` with an `<h2>` heading inside `Container`; reveal animation classes are applied (or skipped under reduced-motion); heading hierarchy is respected (h2 only).
- [ ] `SocialLinks` renders GitHub and LinkedIn anchors with `target="_blank" rel="noopener noreferrer"` and meaningful `aria-label`s; gracefully omits or disables links whose URL is still `[TO BE DEFINED]`.
- [ ] No component in this epic imports portfolio content or calls `useLanguage` / `useTheme`.
- [ ] TypeScript compiles without errors; ESLint reports no violations.

## Technical Notes

- Use `clsx` + `tailwind-merge` (or the equivalent already installed in Epic 01) for `cn()`. If only one is available, match that choice.
- Design tokens go in the `@theme { }` block inside `src/index.css` _after_ the `@import "tailwindcss"` and the `@custom-variant dark` lines established in Epic 01. Do not scatter raw hex values into component files.
- `Button`'s `as` prop pattern: use a conditional render (`as === 'a'` → render `<a>`, default → render `<button>`) rather than a full generic polymorphic type to keep TypeScript complexity low at this stage.
- `useReveal` and `useScrollSpy` both rely on `IntersectionObserver`. In the Vitest environment, mock both `IntersectionObserver` and `window.matchMedia` in `src/test/setup.ts` (or per-test). One-shot observer in `useReveal`: call `observer.disconnect()` inside the callback once `isVisible` becomes `true`.
- `SocialLinks` should treat an empty string or `[TO BE DEFINED]` constant value as a signal to omit the corresponding anchor from the DOM (rather than rendering a broken link).
- WhatsApp link format: `https://wa.me/261385096664` (digits only, no `+`, no spaces).
- Nav section id order in constants: `hero`, `about`, `skills`, `experience`, `projects`, `education`, `languages`, `contact`.
