---
slug: project-showcase
design: planned
---

# Project Showcase

> Feature doc — self-contained. A story for this feature reads THIS file
> (+ ../../folder-structure.md, + ../../\_shared.md when noted), not the other feature docs.

## Summary

The project cards in the Work grid, the detail modal, and the inline-SVG artwork. The
boundary: this feature owns the **card / modal / artwork presentation and the modal
open/close interaction**; the `Project` data shape and the project list belong to
[i18n-content](../i18n-content/index.md), and the Work grid layout that hosts the cards
is rendered by `WorkView` in [content-views](../content-views/index.md).

## Components

| Component      | File                                             | Responsibility                                                                                                                                                   |
| -------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ProjectCard`  | `src/components/projects/ProjectCard.tsx`        | Card in the Work grid: artwork header (`ProjectArt`), category/year chips, num · client, name, role, desc, tags, actions. Diagonal white-6% shine swept on hover |
| `ProjectModal` | `src/components/projects/ProjectModal.tsx`       | Detail overlay: hero artwork, role/impact/stack columns, action buttons; `Escape` closes; locks body scroll                                                      |
| `ProjectArt`   | `src/components/projects/artwork/ProjectArt.tsx` | Inline-SVG artwork dispatcher; one branch/component per project id                                                                                               |

Per-project artwork components live in `src/components/projects/artwork/`: `SokaArt`,
`SokaLiveArt`, `LudokaArt`, `EerArt`, `ShoyoArt`, `OcrArt`, `HappyArt`, `TheseisArt`
(one per `Project.id`).

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

- 2026-06-02 · doc-optimizer upgrade — feature doc created from `components.md`,
  `data-flow.md`, and the Atelier Terminal UI design record.
