---
id: 07-04
title: "SEO for Name and Fullstack Developer Searches"
epic: 07
status: in-progress
size: M
blocked_by: []
files: ["index.html", "public/robots.txt", "public/sitemap.xml", "src/test/index-html.test.ts", "src/test/seo-files.test.ts"]
issue:
pr:
delivery:
prior_status:
---

# Story 07-04: SEO for Name and Fullstack Developer Searches

> **Epic:** Assets & SEO
> **Size:** M

## Description

Make the published portfolio easy to find for searches on the name "Erick Andrinirina" and on "développeur fullstack / fullstack developer". The site is a client-rendered SPA, so crawlers must get everything that matters — title, description, identity, links — from the static `index.html` and from `robots.txt` / `sitemap.xml`.

## Acceptance Criteria

- [ ] `<title>` contains "Erick Andrinirina", "Développeur Fullstack" and "Fullstack Developer"; `<meta name="description">` is ≤ 160 characters and mentions fullstack, React, Next.js, NestJS and Madagascar; `og:title`/`og:description` and `twitter:title`/`twitter:description` match them; `og:locale` is `fr_FR` with an `og:locale:alternate` of `en_US`.
- [ ] `index.html` has `<link rel="canonical" href="https://ckandrinirina.github.io/">`; a `<script type="application/ld+json">` block parses as valid JSON describing a schema.org `Person` with `name`, `jobTitle`, `url`, `image`, `address` (Antananarivo, MG), `knowsAbout` and `sameAs` listing `https://github.com/ckandrinirina` and `https://www.linkedin.com/in/andrinirina-erick-2aa6b0184/`; a `<noscript>` block contains the name, the title, a short bio and links to GitHub, LinkedIn and the CV PDF.
- [ ] `public/robots.txt` allows all crawlers and declares `Sitemap: https://ckandrinirina.github.io/sitemap.xml`; `public/sitemap.xml` is valid XML listing `https://ckandrinirina.github.io/` and `https://ckandrinirina.github.io/cv/erick-andrinirina-cv.pdf`; both files are present in `dist/` after `npm run build`.
- [ ] Human check: `npm run build && npm run preview`, view the page source — the new title, description, canonical, JSON-LD and noscript are there; `/robots.txt` and `/sitemap.xml` open in the browser.

### Edge Cases

- The anti-FOUC theme `<script>` must stay byte-identical (a test enforces it against `THEME_BOOTSTRAP`).
- The JSON-LD must stay valid JSON — no trailing commas, no unescaped quotes; the test parses it.
- The `<noscript>` content must not render for JS-enabled visitors (it never does by spec) and must not break the `#root` mount.

## Implementation Tasks

1. Extend `src/test/index-html.test.ts` with failing assertions for the title keywords, description length/keywords, canonical, `og:locale`, the JSON-LD `Person` (parsed) and the `<noscript>` block; update the assertions that pinned the old title/description text.
2. Rewrite the `<head>` title, description, Open Graph and Twitter tags; add the canonical link and `og:locale` / `og:locale:alternate`.
3. Add the JSON-LD `Person` block and the `<noscript>` fallback.
4. Add `public/robots.txt` and `public/sitemap.xml`, with `src/test/seo-files.test.ts` parsing both.
5. Run the build and confirm both files and the new tags are in `dist/`.

## Technical Notes

- hreflang is intentionally skipped: FR and EN share one URL (the language toggles client-side), so alternates pointing at the same page add nothing; `og:locale` covers social previews.
- No `<meta name="keywords">` — search engines ignore it; keywords belong in the title, description, JSON-LD and noscript text.
- Submitting the sitemap in Google Search Console is a post-deploy manual step for the site owner (needs their Google account) — not part of this story.
- Supersedes the exact title/description text pinned by 07-03; everything else 07-03 set stays.

## Related

- **Epic:** 07_assets-seo
- **Related stories:** 07-03 (SEO metadata baseline), 12-05 (same GitHub/LinkedIn URLs on the page), 08-01 (deploys to the canonical host)
