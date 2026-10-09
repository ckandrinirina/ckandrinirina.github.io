---
epic: 07
slug: assets-seo
title: "Assets, SEO & Social Sharing"
description: "This epic provides the static brand assets and document-level metadata that make the portfolio both downloadable and discoverable."
issue:
pr: 18
delivery: pr
---
# Epic 07: Assets, SEO & Social Sharing

## Description

This epic provides the static brand assets and document-level metadata that make the portfolio both downloadable and discoverable. It covers the three building blocks that must be in place before any SEO audit can be meaningful: the CV PDF served at a stable public URL, the visual brand assets (favicon, profile photo, Open Graph image) that identify the site, and the `<head>` tags in `index.html` that wire those assets to search engines and social-sharing previews.

Because all assets live in `public/` they are copied verbatim into `dist/` by Vite and served as-is by GitHub Pages. No runtime processing or API call is involved. The CV is French-only for now (an English version is out of scope); the OG image must resolve correctly under the user-page `base: '/'` deployment and must degrade gracefully if the image is referenced relative to `BASE_URL`.

By the end of this epic a shared link to `ckandrinirina.github.io` will display a professional social-card preview, the browser tab will show the correct favicon and title, and a visitor who clicks "Download CV" will receive a valid PDF — all verifiable without deploying to production.

## Goals

- Place the downloadable CV PDF at a stable, predictable public URL (`/cv/erick-andrinirina-cv.pdf`) and guard against a missing file reaching production.
- Provide all brand image assets (favicon, profile photo, OG image) in the formats and dimensions required by browsers and social platforms.
- Populate `index.html` `<head>` with a complete, valid set of SEO and Open Graph / Twitter Card tags so a shared link renders a professional preview.

## Scope

### In Scope

- Copy and rename the existing French CV (`docs/CV_ANDRINIRINA_ERICK_FULLSTACK.pdf`) to `public/cv/erick-andrinirina-cv.pdf`.
- Add a build-time npm prebuild script (or CI step) that fails loudly if the CV PDF is missing from `public/cv/`.
- Add `public/favicon.svg`, `public/profile.jpg`, and `public/og-image.png` (1200×630).
- Populate `index.html` `<head>` with `<title>`, `meta description`, Open Graph tags (`og:title`, `og:description`, `og:image`, `og:type`), and Twitter Card tags.
- Set `<html lang="fr">` as the default; `LanguageProvider` updates `document.documentElement.lang` at runtime.
- Preserve the anti-FOUC theme bootstrap inline script introduced in story 03-02.

### Out of Scope

- An English-language CV PDF (deferred; FR served for both locales).
- Per-section or per-route Open Graph tags (single-page SPA, one `<head>`).
- `robots.txt` or `sitemap.xml` (not required for this project phase).
- Animated or generated OG images.
- Any backend or CDN image optimization pipeline.

## Dependencies

- **Depends on:** Epic 01 (scaffold / `public/` directory, `package.json`, `index.html` entry)
- **Blocks:** Epic 09 (Lighthouse SEO audit — requires valid meta tags, favicon, and OG image)

## Acceptance Criteria

- [ ] `public/cv/erick-andrinirina-cv.pdf` exists in the repository and is the French CV.
- [ ] `npm run build` fails with a descriptive error message when `public/cv/erick-andrinirina-cv.pdf` is absent.
- [ ] `public/favicon.svg`, `public/profile.jpg`, and `public/og-image.png` all exist in the repository.
- [ ] `og-image.png` is 1200×630 pixels and visually represents the portfolio.
- [ ] `index.html` contains `<html lang="fr">`, a `<title>`, `meta description`, `og:title`, `og:description`, `og:image`, `og:type`, `twitter:card`, and a `<link rel="icon">` pointing to `favicon.svg`.
- [ ] `og:image` resolves to a valid URL when the site is deployed at `https://ckandrinirina.github.io/`.
- [ ] The anti-FOUC inline theme script from story 03-02 remains intact in `index.html`.
- [ ] A social-card validator (e.g., LinkedIn Post Inspector or opengraph.xyz) shows the correct title, description, and image for the deployed URL.

## Technical Notes

- All public assets must be referenced in components and `index.html` via `import.meta.env.BASE_URL` (or `<base href>`) so they resolve correctly under both root (`/`) and project-page (`/<repo>/`) deployments.
- The OG image absolute URL requires the full origin. For a static SPA this is typically hardcoded in `index.html` as `https://ckandrinirina.github.io/og-image.png` (user-page deployment, `base: '/'`). Document this assumption in the file.
- `favicon.svg` is preferred over `.ico` for modern browsers; add a fallback `<link rel="icon" href="/favicon.ico" sizes="any">` only if browser-compat testing warrants it.
- The presence-check script must not require any extra npm dependency — a plain Node.js `fs.existsSync` check in a small script (e.g. `scripts/check-assets.mjs`) is sufficient.
