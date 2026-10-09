---
slug: deployment
design: planned
---

# Deployment Pipeline

> Self-contained — a story reads this (+ folder-structure.md, + \_shared.md when noted), not other feature docs.
>
> **Stub** scaffolded by `/ck-code:design sync` for epic 08. Technical detail is [TO BE DEFINED] — run `/ck-code:design` to fill it.

## Summary

This epic automates the end-to-end build and publish cycle for the portfolio. A single `git push origin main` must trigger a GitHub Actions workflow that installs dependencies, compiles the static site with Vite, and publishes the resulting `dist/` directory to GitHub Pages — with no manual steps after the one-time repository configuration.

## Components

[TO BE DEFINED]

## Shared dependencies

[TO BE DEFINED]
