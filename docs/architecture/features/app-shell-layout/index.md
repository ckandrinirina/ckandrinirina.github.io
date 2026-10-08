---
slug: app-shell-layout
design: planned
---

# App Shell & Layout

> Self-contained — a story reads this (+ folder-structure.md, + \_shared.md when noted), not other feature docs.
>
> **Stub** scaffolded by `/ck-code:design sync` for epic 05. Technical detail is [TO BE DEFINED] — run `/ck-code:design` to fill it.

## Summary

This epic assembles the application shell that ties together every provider and layout component built in Epics 02–04. It begins at the React entry point (`main.tsx`), where the full provider stack (`ThemeProvider` → `LanguageProvider` → `App`) is wired up so that theme and language state are available to every component in the tree from the very first render — and so that `ThemeProvider` reconciles cleanly with the anti-FOUC inline script already placed in `index.html` by Epic 03.

## Components

[TO BE DEFINED]

## Shared dependencies

[TO BE DEFINED]
