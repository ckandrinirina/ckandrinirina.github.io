---
slug: content-sections
design: planned
---

# Content Sections

> Self-contained — a story reads this (+ folder-structure.md, + \_shared.md when noted), not other feature docs.
>
> **Stub** scaffolded by `/ck-code:design sync` for epic 06. Technical detail is [TO BE DEFINED] — run `/ck-code:design` to fill it.

## Summary

This epic implements the eight visible content sections that make up the portfolio's single-page body: Hero, About, Skills, Experience, Projects, Education, Languages, and Contact. Each section component calls `useLanguage()` to retrieve its slice from the active-locale content object, then renders that slice inside the shared `Section` wrapper (which provides the `<section id>`, the `<h2>` heading, and the `useReveal` scroll animation). Hero is the sole exception — it owns the page's single `<h1>` element and does not delegate heading rendering to `Section`.

## Components

[TO BE DEFINED]

## Shared dependencies

[TO BE DEFINED]
