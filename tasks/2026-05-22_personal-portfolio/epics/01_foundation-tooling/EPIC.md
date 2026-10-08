---
epic: 01
slug: foundation-tooling
title: "Project Foundation & Tooling"
description: "This epic establishes every structural prerequisite the rest of the project depends on."
issue:
pr:
delivery:
---
# Epic 01: Project Foundation & Tooling

## Description

This epic establishes every structural prerequisite the rest of the project depends on. It covers scaffolding the Vite 7 + React 19 + TypeScript 5.7 application inside the existing repository (which already contains `docs/`), wiring in Tailwind CSS v4 via the `@tailwindcss/vite` plugin, configuring ESLint 9 flat config with Prettier, and setting up Vitest with Testing Library and jsdom so the test harness is ready before any component work begins.

The second concern of this epic is deployment correctness. The Vite `base` path must be set to `'/'` for the GitHub user-page deployment at `ckandrinirina.github.io`, and all canonical npm scripts (`dev`, `build`, `preview`, `test`, `lint`, `format`) must be present and passing before any product work starts.

By the time this epic is complete, a developer can clone the repository, run `npm install`, and immediately use every quality gate and the dev server — with zero red flags from the type checker, linter, test runner, or build pipeline. This clean baseline is the contract every subsequent epic assumes.

## Goals

- Scaffold a compilable Vite + React 19 + TypeScript 5.7 project without overwriting existing `docs/` content.
- Integrate Tailwind CSS v4 in CSS-first mode (no `tailwind.config.js`, no PostCSS config).
- Enforce code quality with ESLint 9 (flat config) and Prettier 3, with no conflicts between the two tools.
- Provide a working Vitest 3 + Testing Library setup with jsdom, globals, and `@testing-library/jest-dom` matchers.
- Set the correct Vite `base` path for the user-page deployment and document the project-page alternative.

## Scope

### In Scope

- Running `npm create vite@latest . -- --template react-ts` in the repo root.
- Installing all runtime and dev dependencies listed in `tech-stack.md`.
- Configuring `vite.config.ts` with the `@vitejs/plugin-react` and `@tailwindcss/vite` plugins and `base: '/'`.
- Replacing the scaffolded `src/index.css` with the Tailwind v4 import and the custom dark variant.
- Creating `eslint.config.js` (flat config) and `.prettierrc`.
- Adding the `test` block to `vite.config.ts` (or a separate `vitest.config.ts`) and creating `src/test/setup.ts`.
- Updating `tsconfig.json` with Vitest and jest-dom types.
- Ensuring all five npm scripts compile and exit cleanly on the scaffold.

### Out of Scope

- Any application components, sections, providers, or content modules (those belong to epics 02–09).
- GitHub Actions deployment workflow (epic 08).
- Custom design tokens or `@theme` block beyond the dark variant (epic 02).
- `public/` assets such as `og-image.png`, `favicon.svg`, or the CV PDF.

## Dependencies

- **Depends on:** None
- **Blocks:** All subsequent epics (02 through 09) — no story in any other epic may begin before 01-01 is complete.

## Acceptance Criteria

- [ ] `npm run dev` starts the Vite dev server on `http://localhost:5173` without errors.
- [ ] `npm run build` completes without type errors and emits a `dist/` directory with correct asset URLs under `base: '/'`.
- [ ] `npm run lint` exits with code 0 on the scaffold files (no ESLint errors or warnings).
- [ ] `npm run test -- --run` exits with code 0; at least one trivial test passes.
- [ ] `npm run format` runs without errors; Tailwind utility classes are sorted by `prettier-plugin-tailwindcss`.
- [ ] `npm run preview` serves the production build from `dist/` without errors.
- [ ] A `dark:` Tailwind utility class responds to the `dark` class on `<html>` (verified in dev).
- [ ] `docs/` directory and all its contents are untouched after scaffold.
- [ ] No `tailwind.config.js` or `postcss.config.*` file exists in the project root.
- [ ] `tsconfig.json` has `"strict": true` and includes `"vitest/globals"` and `"@testing-library/jest-dom"` in types.

## Technical Notes

- Vite 7 scaffolds with `npm create vite@latest . -- --template react-ts`; running this in a non-empty directory will prompt — choose to keep existing files so `docs/` is preserved.
- Tailwind v4 is CSS-first: configuration lives in `src/index.css` using `@import "tailwindcss"` and `@custom-variant`; no JS config file is created.
- ESLint 9 uses a flat `eslint.config.js` (not `.eslintrc.*`). Prettier owns all formatting concerns; ESLint has no stylistic rules to avoid conflicts.
- Vitest globals (`describe`, `it`, `expect`) are enabled via `globals: true` in the Vitest config AND by adding `"vitest/globals"` to `tsconfig.json` `compilerOptions.types` so TypeScript resolves them without explicit imports.
- `base: '/'` applies to the user-page deployment (`ckandrinirina.github.io`). A comment in `vite.config.ts` documents the alternative `'/<repo-name>/'` for project-page deployments. Downstream stories reference assets via `import.meta.env.BASE_URL`.
