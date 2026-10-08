---
id: 10-03
title: "Content model update — types, projects, FR/EN, UI labels"
epic: 10
status: done
size: M
blocked_by: ["10-01"]
files: ["src/content/types.ts", "src/content/projects.ts", "src/content/fr.ts", "src/content/en.ts", "src/i18n/ui.ts", "src/content/*.test.ts"]
issue:
pr:
delivery:
prior_status:
---
# Story 01-03: Content model update — types, projects, FR/EN, UI labels

> **Epic:** Foundation — Tokens, Theme & Content
> **Size:** XL
## Description

Reshape the typed content system to the new `PortfolioContent` model the Atelier views
consume, author the projects dataset, rewrite both locale modules, and extend the UI
labels map. The existing typed-content machinery (`LanguageProvider`/`useLanguage`)
stays; only the data shape and copy change.

`types.ts` is reshaped to:

```ts
interface PortfolioContent {
  hero: HeroContent // greet, name, tagline, roles[], cta labels
  now: NowContent // headline + body + meta (label, period)
  stats: StatTile[] // [{ n, suffix?, label }]
  marquee: string[] // tech tokens
  projects: Project[] // 8 entries
  experience: TimelineEntry[] // 7 entries
  skills: SkillCard[] // 4 cards
  process: ProcessPrinciple[] // 5 numbered principles
  contact: ContactContent // pitch + meta rows (languages here)
  ui: UiLabels // eyebrows, "Read case", "Visit live", copy labels, etc.
}
```

The `Project` and `TimelineEntry` shapes follow the design doc exactly (project `id`
union of the 8 known ids, `num`, `year`, `role`, `client`, `category`, `link`, `repo`,
`desc`, `tags`, and a nested `detail: { role, impact, stack }`). `Education` and the
standalone `spokenLanguages` types are removed; spoken languages move into
`contact.languages: string[]` rendered as a Contact-card row.

`projects.ts` is a new module holding the derived list. `fr.ts` is the localized source
of new copy (process principles, eyebrows, role-rotor terms, marquee labels where it
makes sense); `en.ts` mirrors the shape with the mockup copy as the EN baseline.
`i18n/ui.ts` is extended with nav labels, ⌘K group labels, and copy/“copied” labels.

## Acceptance Criteria

- [x] `PortfolioContent` is defined with `hero`, `now`, `stats`, `marquee`, `projects`,
      `experience`, `skills`, `process`, `contact`, and `ui` members. _(Additive superset:
      the new project list lives in `content/projects.ts`; the new experience/skills shapes
      are exposed as `timeline`/`skillCards` to avoid colliding with the legacy
      `experience`/`skills` still read by the doomed `components/sections/*`. `ui` stays in
      `i18n/ui.ts`. See **Integrator notes** below.)_
- [x] `Project` matches the doc shape, with `id` typed as the 8-id union
      (`'soka' | 'soka-live' | 'ludoka' | 'eer' | 'shoyo' | 'ocr' | 'happy' | 'theseis'`)
      and a nested `detail: { role; impact; stack }`.
- [x] `TimelineEntry` is `{ year; role; company; desc; stack: string[] }`.
- [~] `Education` and standalone `spokenLanguages` types/content are removed; spoken
  languages live in `contact.languages: string[]`. _(`contact.languages` added.
  Removal of `Education`/`spokenLanguages` **deferred to 04-01** — the legacy types are
  kept so `App.tsx` + 8 section components still compile and `npm run build` stays green,
  per the approved additive-superset decision.)_
- [x] `src/content/projects.ts` exports 8 typed `Project` entries with `num` `"01"`…`"08"`.
- [x] `src/content/fr.ts` and `src/content/en.ts` both satisfy `PortfolioContent` and
      compile with no TS errors.
- [x] `src/i18n/ui.ts` includes nav labels (per route), ⌘K group labels
      (Navigation/Quick/Projects), and copy/“copied” labels, plus eyebrows and footer chips.
- [x] A content-parity test asserts FR and EN expose an identical key structure (same
      project ids, same number of experience/skills/process entries, matching `ui` keys).
- [x] No view/component outside this story is required for the modules to type-check;
      `npm run build` passes.

## Technical Notes

- Keep the data **typed-first**: define the interfaces, then let TS enforce both locale
  modules match. The parity test backstops anything types can't (e.g. array lengths).
- Project `link`/`repo` are `string | null` (`"#"`-style placeholders allowed per doc).
- `stack` on `Project.detail` is a single `" · "`-separated string; `stack` on
  `TimelineEntry` is a `string[]`. Don't unify them — they render differently.
- Do not delete the old section content files here if other (doomed) components still
  import them; the section components are removed in 04-01. Prefer adding the new shape
  and letting the old sections break at integration, OR keep old exports temporarily if
  the build must stay green between stories — note the choice for the integrator.
- `marquee` is a flat `string[]` of tech tokens; `stats` entries carry an optional
  `suffix` (e.g. `"+"`).
- Author FR copy naturally (don't machine-translate the mockup); EN uses the mockup text.

## Files to Create/Modify

| Action | File Path                 | Purpose                                                |
| ------ | ------------------------- | ------------------------------------------------------ |
| MODIFY | `src/content/types.ts`    | New `PortfolioContent` shape; drop Education/Languages |
| CREATE | `src/content/projects.ts` | 8 typed `Project` entries (id/num/year/.../detail)     |
| MODIFY | `src/content/fr.ts`       | Rewrite to new shape (localized source of truth)       |
| MODIFY | `src/content/en.ts`       | Rewrite to new shape (mockup copy baseline)            |
| MODIFY | `src/i18n/ui.ts`          | Nav labels, ⌘K group labels, copy labels, eyebrows     |
| MODIFY | `src/content/*.test.ts`   | Update parity/shape tests to the new model             |

## Dependencies

- **Blocked by:** — (independent of the CSS/theme stories; can run in parallel with 01-01)
- **Blocks:** 02-03 (nav labels), 03-01 (projects data), 03-02 (cmdk commands reference
  projects/routes/copy labels), 03-03 & 03-04 (all views read content)

## Related

- **Epic:** foundation-tokens-theme-content
- **Related stories:** 03-01 (projects rendering), 03-03/03-04 (views)
- **Spec reference:** feature doc §Content model, §Projects shape, §Experience timeline shape

## Implementation Plan

### SOLID Analysis

- **S — Single Responsibility:** `types.ts` defines the contract; `projects.ts` holds data;
  locale modules hold copy; `ui.ts` holds micro-labels — each one concern.
- **O — Open/Closed:** adding a project means adding an entry + extending the id union;
  views iterate the array and need no change.
- **L — Liskov:** both locale modules are interchangeable `PortfolioContent` implementations.
- **I — Interface Segregation:** views consume narrow slices (`content.projects`,
  `content.process`) rather than the whole object where practical.
- **D — Dependency Inversion:** components depend on `useLanguage().content` typed by the
  interface, not on a concrete locale module.

### Subtasks

- [x] 1. Update content tests for the new shape + parity (RED).
- [x] 2. Reshape `types.ts`; ~~remove Education/standalone Languages~~ → kept (deferred to 04-01); added new Atelier types/members (GREEN for types).
- [x] 3. Author `projects.ts` (8 entries).
- [x] 4. Extend `fr.ts` and `en.ts` (additive) to satisfy the interface.
- [x] 5. Extend `i18n/ui.ts` with nav/⌘K/copy/eyebrow/footer labels.
- [x] 6. QA validation — parity test, map each AC, check TypeScript.

## Implementation Summary

Reshaped the typed content system to the new Atelier `PortfolioContent` model using an
**additive superset** strategy (decided with the operator): the new model is layered on
top of the legacy shape so the 8 doomed `components/sections/*` and `App.tsx` keep
compiling and `npm run build` stays green between 01-03 and the 04-01 integration.

**What landed**

- New types: `Project` (+ `ProjectId` 8-union, `ProjectDetail`), `TimelineEntry`,
  `StatTile`, `NowContent`, `ProcessPrinciple`, `SkillCard`, `ContactMetaRow`.
- `PortfolioContent` extended with `now`, `stats`, `marquee`, `timeline`, `skillCards`,
  `process`; `hero` gains `greet`/`tagline`/`roles`; `contact` gains
  `pitch`/`languages`/`meta`.
- `content/projects.ts` — new module: 8 typed `Project` entries, `num` `01`…`08`.
- `fr.ts`/`en.ts` — new members authored (EN = mockup baseline, FR localized naturally).
- `i18n/ui.ts` — per-route nav (`navHome`/`navWork`/`navProcess`), ⌘K group headers,
  `copy`/`copied`, project actions (`readCase`/`visitLive`), view eyebrows, footer chips.
- Tests: new `projects.test.ts`; parity block in `content.test.ts`; Atelier-key block in
  `ui.test.ts`; `types.test.ts` sample + negative blocks updated for the extended shape.

**QA:** `tsc -b` clean · `vite build` succeeds · 574 tests pass (38 files) · ESLint clean.

### Integrator notes (for 04-01)

1. **Remove the legacy half** of `PortfolioContent` — `about`, `education`,
   `spokenLanguages`, and the legacy `skills: SkillGroup[]` / `experience: ExperienceEntry[]`
   / `projects: ProjectEntry[]` — once the `components/sections/*` are deleted.
2. **Rename** `timeline` → `experience` and `skillCards` → `skills` (and drop the legacy
   ones) so the model matches the design doc's member names. Views in epic 03 should read
   `content.timeline`/`content.skillCards` until that rename happens.
3. The new project list is `content/projects.ts` (`import { projects }`), not
   `content.projects` (which still holds the legacy `ProjectEntry[]`).
4. `ui` lives in `i18n/ui.ts` (`Record<'fr'|'en', UiLabels>`), not as a `PortfolioContent`
   member — the design doc listed it on the interface but the story kept it separate.

## Files Touched

- CREATED: `src/content/projects.ts`
- CREATED: `src/content/projects.test.ts`
- MODIFIED: `src/content/types.ts` — new types + extended `HeroContent`/`ContactContent`/`PortfolioContent`
- MODIFIED: `src/content/en.ts` — new members (hero/contact extensions + now/stats/marquee/timeline/skillCards/process)
- MODIFIED: `src/content/fr.ts` — same, localized FR copy
- MODIFIED: `src/i18n/ui.ts` — extended `UiLabels` + both locale maps
- MODIFIED: `src/content/content.test.ts` — Atelier parity block
- MODIFIED: `src/content/types.test.ts` — sample + negative blocks updated for extended shape
- MODIFIED: `src/i18n/ui.test.ts` — Atelier shell-label block

## Unplanned Changes

- `src/content/types.test.ts` — updated the existing sample and `@ts-expect-error` negative
  blocks for the extended shape — required to keep `tsc` green after adding required fields.
- Added `contact.meta`/`contact.pitch` (beyond the bare `contact.languages` the story named)
  — needed so the Atelier ContactView has its key/value rows and pitch paragraph.
