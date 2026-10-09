---
slug: integration-qa
design: planned
---

# Integration & QA

> Self-contained — a story reads this (+ folder-structure.md, + \_shared.md when noted), not other feature docs.
>
> **Stub** scaffolded by `/ck-code:design sync` for epic 13. Technical detail is [TO BE DEFINED] — run `/ck-code:design` to fill it.

## Summary

This epic assembles the Atelier Terminal shell and proves it meets the Definition of Done. It is the convergence point: `App.tsx` is rewritten to own all cross-cutting state (route, direction, modal, command-palette), wire every interaction hook, render the Sidebar/Topbar chrome and the active view, mount the global overlays, and tear down every obsolete file from the old section-based design. Two QA stories then validate the result — accessibility, reduced motion, and responsiveness, followed by a final Lighthouse performance/SEO audit.

The design for the pieces this epic delivers is documented in [app-shell](../app-shell/index.md).

## Components

[TO BE DEFINED]

## Shared dependencies

[TO BE DEFINED]
