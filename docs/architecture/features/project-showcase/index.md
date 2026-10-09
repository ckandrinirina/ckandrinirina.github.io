---
slug: project-showcase
design: planned
---

# Project Showcase

> Feature doc — self-contained. A story for this feature reads THIS file
> (+ ../../folder-structure.md, + ../../\_shared.md when noted), not the other feature docs.

## Summary

The project cards in the Work grid, the detail modal, and each project's visual — a real
screenshot when one exists, else the inline-SVG artwork. The
boundary: this feature owns the **card / modal / artwork presentation and the modal
open/close interaction**; the `Project` data shape and the project list belong to
[i18n-content](../i18n-content/index.md), and the Work grid layout that hosts the cards
is rendered by `WorkView` in [content-views](../content-views/index.md).

## Components

| Component      | File                                             | Responsibility                                                                                                                                                   |
| -------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ProjectCard`  | `src/components/projects/ProjectCard.tsx`        | Card in the Work grid: visual header (`ProjectMedia`), category/year chips, num · client, name, role, desc, tags, actions. Diagonal white-6% shine swept on hover |
| `ProjectModal` | `src/components/projects/ProjectModal.tsx`       | Detail overlay: hero visual (`ProjectMedia`), role/impact/stack columns, action buttons; `Escape` closes; locks body scroll                                                      |
| `ProjectMedia` | `src/components/projects/ProjectMedia.tsx`       | `<img class="shot">` (alt = project name, lazy) when `projectImage(id)` resolves, else `ProjectArt`                                                            |
| `projectImage` | `src/components/projects/projectImages.ts`       | `import.meta.glob` over `src/assets/projects/*.{webp,png,jpg,jpeg}`; maps file basename → hashed URL; `null` when absent                                         |
| `ProjectArt`   | `src/components/projects/artwork/ProjectArt.tsx` | Inline-SVG artwork dispatcher (fallback); one branch/component per project id                                                                                    |

Per-project artwork components live in `src/components/projects/artwork/`: `SokaArt`,
`SokaLiveArt`, `LudokaArt`, `IntranetArt`, `EerArt`, `ShoyoArt`, `OcrArt`, `HappyArt`, `TheseisArt`
(one per `Project.id`).

## Screenshots

- **Convention:** `src/assets/projects/<project-id>.webp` (png/jpg accepted) — the file
  name IS the wiring; no code change per image. Vite fingerprints it and applies the
  deploy base path.
- **Capture:** 1600×900 (16:9, the card ratio) of the live site's landing view; the
  modal crops 16:8 from the top (`object-position: top center`). WebP, target < 200 KB.
- **Styling:** `.proj-card .art .shot` / `.modal .art .shot` — `object-fit: cover`, same
  hover zoom as the SVG; reduced motion handled by the global transition override.
- A project without a file keeps its SVG artwork — never a broken image.

## Flows

### Modal open / close

```
WorkView ProjectCard click → App.setOpenProject(project)
  └─ ProjectModal renders when state.openProject is set
       ├─ body scroll lock while open
       ├─ hero artwork + role/impact/stack columns + action buttons
       └─ Escape (or backdrop) → setOpenProject(null) → unlock scroll
```

| State         | Where             | Persisted | Default |
| ------------- | ----------------- | --------- | ------- |
| Modal project | `App` (transient) | no        | `null`  |

## Shared dependencies

- `Project` shape + `content/projects.ts` list: [i18n-content](../i18n-content/index.md).
- Hosting Work grid + open trigger (`WorkView`): [content-views](../content-views/index.md).
- Modal open state held by `App`: [app-shell](../app-shell/index.md).
- [Button / Badge primitives](../../_shared.md#ui-primitives) for action buttons + chips.
- [Accessibility & reduced-motion conventions](../../_shared.md#accessibility--reduced-motion) —
  `Escape` closes; focus management; card shine disabled under reduced motion.

## Changelog

- 2026-10-08 · real screenshots — `ProjectMedia` + `projectImages` (file-name lookup,
  SVG fallback); `IntranetArt` added for the new `bmoi-intranet` project.

- 2026-06-02 · doc-optimizer upgrade — feature doc created from `components.md`,
  `data-flow.md`, and the Atelier Terminal UI design record.
