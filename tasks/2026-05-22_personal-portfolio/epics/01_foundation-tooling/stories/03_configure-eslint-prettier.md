---
id: 01-03
title: "Configure ESLint 9 (flat) + Prettier"
epic: 01
status: done
size: S
blocked_by: ["01-01"]
files: ["eslint.config.js", ".prettierrc", "package.json"]
issue:
pr:
delivery: direct
prior_status:
---
# Story 01-03: Configure ESLint 9 (flat) + Prettier

> **Epic:** Project Foundation & Tooling
> **Size:** S
## Description

Set up ESLint 9 with a flat `eslint.config.js` combining `@eslint/js` recommended, `typescript-eslint`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh`. Set up Prettier 3 with a `.prettierrc` file that disables semicolons, enables single quotes, and loads `prettier-plugin-tailwindcss` for automatic class sorting. Add the `lint` and `format` npm scripts to `package.json`. Prettier owns all formatting decisions; ESLint must have no stylistic rules that conflict with Prettier.

## Acceptance Criteria

- [x] `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh` are listed as dev dependencies in `package.json`.
- [x] `prettier`, `prettier-plugin-tailwindcss` are listed as dev dependencies in `package.json`.
- [x] An `eslint.config.js` file exists at the project root using the ESLint 9 flat config format (i.e. it exports an array, not an object with `extends`).
- [x] `eslint.config.js` includes the `@eslint/js` recommended config, `typescript-eslint` rules, `eslint-plugin-react-hooks` recommended rules, and `eslint-plugin-react-refresh` rules.
- [x] `eslint.config.js` does NOT include any stylistic or formatting rules (indentation, quote style, semicolons) — Prettier owns those.
- [x] A `.prettierrc` file exists at the project root containing `"semi": false`, `"singleQuote": true`, and `"plugins": ["prettier-plugin-tailwindcss"]`.
- [x] `package.json` `scripts` contains `"lint": "eslint ."`.
- [x] `package.json` `scripts` contains `"format": "prettier --write ."`.
- [x] `npm run lint` exits with code 0 on the scaffold files (no errors and no warnings that would cause a non-zero exit).
- [x] `npm run format` runs without errors and produces output indicating files were written or already formatted.
- [x] After running `npm run format` on a component file that has unsorted Tailwind classes, the classes are reordered to follow the canonical Tailwind sort order (demonstrating `prettier-plugin-tailwindcss` is active).
- [x] Running `npm run lint` immediately after `npm run format` still exits code 0 — the two tools do not conflict.
- [x] No `.eslintrc.js`, `.eslintrc.json`, `.eslintrc.yml`, `.eslintignore`, or legacy ESLint config file exists.

### Edge Cases

- ESLint 9 flat config ignores `node_modules` by default; confirm `node_modules/` is not linted by spot-checking that `npm run lint` does not attempt to parse files inside it.
- `eslint-plugin-react-refresh` may produce a warning for the scaffold's `App.tsx` if it only exports non-component values; ensure the plugin config is set to `warn` (not `error`) so `npm run lint` still exits 0 on the clean scaffold.
- Prettier and `eslint-plugin-prettier` should NOT both be installed — `eslint-plugin-prettier` is not listed in scope for this story. If it exists, remove it to avoid duplicate formatting enforcement.
- TypeScript files in `vite.config.ts` and `eslint.config.js` should be handled by the config (not excluded by accident); run `npm run lint vite.config.ts` separately to confirm.

## Technical Notes

- ESLint 9 requires a flat `eslint.config.js` (or `.mjs`). The legacy `.eslintrc.*` format is not supported by default in ESLint 9. The file must export an array of config objects.
- Recommended flat config shape:

  ```js
  import js from '@eslint/js'
  import tseslint from 'typescript-eslint'
  import reactHooks from 'eslint-plugin-react-hooks'
  import reactRefresh from 'eslint-plugin-react-refresh'

  export default tseslint.config(
    { ignores: ['dist'] },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
      plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
      rules: {
        ...reactHooks.configs.recommended.rules,
        'react-refresh/only-export-components': [
          'warn',
          { allowConstantExport: true },
        ],
      },
    },
  )
  ```

- `.prettierrc` configuration:
  ```json
  {
    "semi": false,
    "singleQuote": true,
    "plugins": ["prettier-plugin-tailwindcss"]
  }
  ```
- Prettier processes `.tsx`, `.ts`, `.js`, `.json`, `.css`, and `.md` files in the project root and `src/` by default. No explicit `--parser` flag is needed.
- A `.prettierignore` file can be added to exclude `dist/` and `node_modules/` from formatting if Prettier processes them by default (it usually skips `node_modules`).

## Files to Create/Modify

| Action | File Path          | Purpose                                                              |
| ------ | ------------------ | -------------------------------------------------------------------- |
| CREATE | `eslint.config.js` | ESLint 9 flat config with TS, React Hooks, React Refresh rules       |
| CREATE | `.prettierrc`      | Prettier options: no semis, single quotes, Tailwind class sorting    |
| MODIFY | `package.json`     | Add `lint` and `format` scripts; add ESLint/Prettier devDependencies |

## Dependencies

- **Blocked by:** 01-01
- **Blocks:** None (quality gate — other stories should pass lint/format but are not blocked waiting for this)

## Related

- **Epic:** 01_foundation-tooling
- **Related stories:** 01-01
- **Spec reference:** configuration.md §eslint.config.js, configuration.md §.prettierrc

## Implementation Summary

### Completed

- Updated `package.json` with ESLint 9, Prettier 3, and plugin dependencies
- Added `lint` and `format` npm scripts
- Created `eslint.config.js` with ESLint 9 flat config format
- Created `.prettierrc` with Prettier configuration (no semicolons, single quotes, Tailwind plugin)
- All acceptance criteria verified and passing

### Files Touched

- CREATED: `eslint.config.js` — ESLint 9 flat config with TS, React Hooks, React Refresh
- CREATED: `.prettierrc` — Prettier options with Tailwind class sorting
- MODIFIED: `package.json:6-29` — Added scripts and devDependencies

### QA Results

**npm run lint:** PASS (0 issues, node_modules correctly ignored)
**npm run format:** PASS (files formatted without conflicts)
**Prettier + Tailwind plugin:** PASS (Tailwind classes automatically sorted)
**Lint after format:** PASS (no conflicts between tools)
**No legacy configs:** PASS (no .eslintrc.\* or .eslintignore files)
