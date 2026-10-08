---
id: 04-04
title: "UI micro-labels map"
epic: 04
status: done
size: S
blocked_by: ["04-01"]
files: ["src/i18n/ui.ts"]
issue:
pr:
delivery:
prior_status:
---
# Story 04-04: UI micro-labels map

> **Epic:** Internationalization & Content Data
> **Size:** S
## Description

Create `src/i18n/ui.ts`, a small typed map of all UI chrome micro-labels — strings that are not part of the portfolio content narrative but are needed to render the site's navigation, buttons, and accessible controls. These include nav item labels for the eight sections, the primary button texts (View projects, Download CV, Contact), the language switcher aria-label, the theme toggle aria-label, and the footer "built with" note. This file is separate from the content modules because these strings belong to the UI shell rather than the portfolio data, and because the `LanguageProvider` exposes them through the `t(key)` function rather than the `content` object.

## Acceptance Criteria

- [x] `src/i18n/ui.ts` exports a typed map (`UiLabels` type/interface) and a `ui` constant of shape `Record<'fr' | 'en', UiLabels>` (or an equivalent typed structure).
- [x] The `UiLabels` type is exported so other files can reference it.
- [x] FR and EN entries are present for every key in the following categories:
  - **Navigation labels** (8 keys, one per section): hero/home, about, skills, experience, projects, education, languages, contact.
  - **Button texts**: `viewProjects`, `downloadCv`, `contact` (or equivalent key names matching what components will use).
  - **Aria-labels**: `languageSwitcher` (describing the EN/FR toggle), `themeToggle` (describing the light/dark button).
  - **Footer**: `builtWith` (short "Built with …" or "Créé avec …" string).
- [x] All keys defined in `UiLabels` have both FR and EN values — a missing value for either locale is a TypeScript error (enforce via `Record<'fr' | 'en', UiLabels>`).
- [x] The key names used in `ui.ts` match the keys that `t(key)` will accept in `LanguageProvider` (story 04-05) — this contract should be established here so 04-05 can implement `t()` against it.
- [x] No JSX, no component imports, no presentation logic in this file.
- [x] `npm run build` exits 0 after this file is introduced.

### Edge Cases

- Key naming must be consistent and agreed before 04-05 implements `t()`. If a key is added later (e.g., for a new aria-label), it must be added to both locales simultaneously — the typed `Record` enforces this.
- Nav label for "languages" section must not conflict with the "language switcher" UI label — use distinct keys (e.g., `navLanguages` vs `languageSwitcher`).

## Technical Notes

- Suggested type structure:
  ```ts
  export type UiLabels = {
    navHero: string;
    navAbout: string;
    navSkills: string;
    navExperience: string;
    navProjects: string;
    navEducation: string;
    navLanguages: string;
    navContact: string;
    viewProjects: string;
    downloadCv: string;
    contact: string;
    languageSwitcher: string;
    themeToggle: string;
    builtWith: string;
  };
  export const ui: Record<'fr' | 'en', UiLabels> = { fr: { ... }, en: { ... } };
  ```
  The exact key names are a design decision for this story; once fixed, they must not change without updating all call sites.
- The `t(key: keyof UiLabels)` function in `LanguageProvider` will be `ui[locale][key]`. The typing should make calling `t` with an invalid key a compile-time error.
- Keep values short — these are micro-labels, not sentences. Exception: `languageSwitcher` and `themeToggle` aria-labels may be slightly more descriptive for accessibility.

## Files to Create/Modify

| Action | File Path        | Purpose                                 |
| ------ | ---------------- | --------------------------------------- |
| CREATE | `src/i18n/ui.ts` | Typed per-locale map of UI micro-labels |

## Dependencies

- **Blocked by:** 04-01 (the type system is in place; `ui.ts` does not import from `types.ts` but conceptually belongs after the content model is understood)
- **Blocks:** 04-05

## Related

- **Epic:** 04_i18n-content
- **Related stories:** 04-05, 04-06
- **Spec reference:** components.md §LanguageProvider (`t`); tech-stack.md §Internationalization

## Implementation Summary

### Overview

Created `src/i18n/ui.ts` exporting a typed, bilingual map of all UI chrome micro-labels. The `UiLabels` type defines 14 string fields covering navigation (8), buttons (3), aria-labels (2), and footer (1). The `ui` constant has shape `Record<'fr' | 'en', UiLabels>`, which enforces at compile time that both locales provide every key.

### Files Created

- `src/i18n/ui.ts` — Main implementation: `UiLabels` type and `ui` constant (CREATED)
- `src/i18n/ui.test.ts` — Unit tests validating structure and parity (CREATED)

### Key Decisions

1. **Key naming:** Followed the story's suggested structure exactly (e.g., `navHero`, `navAbout`, etc.) to establish a clear contract for story 04-05.
2. **Locale parity:** Used `Record<'fr' | 'en', UiLabels>` to enforce compile-time verification — TypeScript will error if either locale omits a key.
3. **String values:** Chose short, idiomatic French and English labels following the story's guidance (e.g., `navAbout: 'À propos' / 'About'`, `downloadCv: 'Télécharger le CV' / 'Download CV'`).
4. **Aria-labels:** Made slightly more descriptive for accessibility (e.g., `languageSwitcher: 'Changer de langue' / 'Switch language'`).

### Testing

- **6 new tests** in `src/i18n/ui.test.ts`:
  - Exports `ui` constant with both `fr` and `en` properties
  - Both locales contain all 14 required keys as non-empty strings
  - Both locales have identical key sets
  - `navLanguages` and `languageSwitcher` keys are distinct (no collision)
  - All values are truthy strings
- **All 149 tests pass** (full suite, no regressions)

### Build Verification

- `npm run build` exits 0 with no TypeScript errors
- Type checking confirms `Record<'fr' | 'en', UiLabels>` enforces parity

### Notes for Story 04-05

The `t(key: keyof UiLabels)` function in `LanguageProvider` should resolve to `ui[locale][key]`. All key names used here are the final contract.
