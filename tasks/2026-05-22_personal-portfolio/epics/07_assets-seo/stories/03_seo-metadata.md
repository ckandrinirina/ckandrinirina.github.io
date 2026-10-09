---
id: 07-03
title: "index.html SEO metadata"
epic: 07
status: done
size: M
blocked_by: ["07-02"]
files: ["index.html"]
issue:
pr: 18
delivery: merged
prior_status:
---
# Story 07-03: index.html SEO metadata

> **Epic:** Assets, SEO & Social Sharing
> **Size:** M
## Description

Populate the `<head>` section of `index.html` with the full set of SEO and social-sharing tags so that search engines index the page correctly and a shared link on LinkedIn, Twitter/X, or any messaging app renders a professional preview card. Tags to add include: `<title>`, `<meta name="description">`, Open Graph (`og:title`, `og:description`, `og:image`, `og:type`, `og:url`), Twitter Card (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`), and `<link rel="icon">`. The default `<html lang="fr">` attribute must be set; `LanguageProvider` updates it at runtime when the visitor switches language. The anti-FOUC inline theme script introduced in story 03-02 must remain intact and in its correct position.

## Acceptance Criteria

- [x] `<html>` element has `lang="fr"` as the default attribute.
- [x] `<title>` reads `Erick Andrinirina — Fullstack JavaScript Engineer`.
- [x] `<meta name="description">` reads `Erick Andrinirina — Fullstack JavaScript Engineer with 7 years of experience building performant, scalable web applications.` (124 characters, under 160).
- [x] `<meta property="og:title">` is present and matches the `<title>` text.
- [x] `<meta property="og:description">` is present and matches the meta description text.
- [x] `<meta property="og:image">` is present and its `content` is the absolute URL `https://ckandrinirina.github.io/og-image.png`.
- [x] `<meta property="og:type" content="website">` is present.
- [x] `<meta property="og:url">` is present with `content="https://ckandrinirina.github.io/"`.
- [x] `<meta name="twitter:card" content="summary_large_image">` is present.
- [x] `<meta name="twitter:title">` and `<meta name="twitter:description">` are present with the same values as the OG equivalents.
- [x] `<meta name="twitter:image">` is present with the same absolute URL as `og:image`.
- [x] `<link rel="icon" href="/favicon.svg" type="image/svg+xml">` is present and points to the asset added in story 07-02.
- [x] The anti-FOUC inline `<script>` block (reading `localStorage['theme']` and setting `<html class="dark">`) is present and unchanged from its state after story 03-02.
- [x] `<meta charset="UTF-8">` and `<meta name="viewport" content="width=device-width, initial-scale=1.0">` are present (Vite scaffold defaults; verify they were not accidentally removed).
- [ ] Validating the page URL in a social-card validator (e.g., https://www.opengraph.xyz or LinkedIn Post Inspector) shows the correct title, description, and preview image. **DEFERRED** — requires the site deployed to https://ckandrinirina.github.io/ first; validates as a post-deploy step (or under Epic 09 Lighthouse audit).

### Edge Cases

- **`og:image` absolute URL:** Open Graph requires an absolute URL for `og:image`; a root-relative path (`/og-image.png`) is not recognized by crawlers. Hardcode `https://ckandrinirina.github.io/og-image.png` in `index.html` and add a comment `<!-- Absolute URL required for OG; update if domain changes -->`. Document this assumption.
- **`lang` runtime update:** `LanguageProvider` calls `document.documentElement.lang = locale` on every locale change. The `<html lang="fr">` in `index.html` is the static default; verify in the browser that switching to EN updates `document.documentElement.lang` to `"en"` (this is a behavior check, not a change to `index.html`).
- **Anti-FOUC script position:** The theme bootstrap script must appear before any stylesheet or component script in `<head>` to prevent a flash of the wrong theme. Do not move it below the Vite script injection point.
- **Character limit:** The `<meta name="description">` value must be under 160 characters for Google not to truncate it in search results. Verify the final string length before committing.
- **`og:url` trailing slash:** Use a consistent canonical URL with a trailing slash (`https://ckandrinirina.github.io/`) to avoid duplicate-content issues if the site is ever indexed under both variants.
- **Twitter/X card image ratio:** `summary_large_image` displays images at ~2:1; the 1200×630 `og-image.png` from story 07-02 satisfies this. If the image is absent at validation time, Twitter will show a plain link; re-validate after deploying 07-02.

## Technical Notes

- `index.html` is the single HTML file for this SPA; there are no per-route HTML files. All SEO metadata is therefore static and describes the site as a whole.
- Vite injects the bundled JS/CSS into `index.html` at build time by appending `<script type="module">` tags; do not manually add a `<script src="...">` for the app — Vite's injection will handle it. The only manual `<script>` is the anti-FOUC theme snippet.
- The `BASE_URL` environment variable is `'/'` for the user-page deployment and is not needed for `index.html` tag values, which use hardcoded absolute URLs for OG and root-relative paths for the favicon.
- If the site is later moved to a custom domain, two values need updating: `og:image` and `og:url` absolute URLs. Add a comment in `index.html` flagging both.
- There is no server-side rendering; search engines that execute JavaScript will see the full rendered page, but the static `<head>` tags are sufficient for social-card crawlers (which typically do not execute JavaScript).

## Files to Create/Modify

| Action | File Path    | Purpose                                                                                                                                  |
| ------ | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| MODIFY | `index.html` | Add `lang="fr"` to `<html>`, `<title>`, meta description, full OG and Twitter Card tags, and favicon `<link>`; preserve anti-FOUC script |

## Dependencies

- **Blocked by:** 07-02 (brand assets — `favicon.svg` and `og-image.png` must exist before the `<head>` tags that reference them are added)
- **Blocks:** None (supports Epic 09 Lighthouse SEO audit indirectly — valid meta tags are a prerequisite for a passing SEO score)

## Related

- **Epic:** 07_assets-seo
- **Related stories:** 03-02 (anti-FOUC theme script that must be preserved), 07-02 (brand assets consumed by these tags), 09-xx (Lighthouse SEO audit)
- **Spec reference:** configuration.md §index.html SEO/OG; pre-spec.md §6 discoverability (social preview, page title, meta description)

## Implementation Summary

### Outcome

`index.html` now ships a complete SEO + social-sharing `<head>`: French default lang, portfolio title, 124-char meta description, full Open Graph set (title, description, image, type, url), full Twitter Card set (`summary_large_image` + image + title + description), and the favicon link to the asset added in 07-02. The anti-FOUC theme bootstrap script from 03-02 is preserved unchanged.

OG/Twitter image and url use **hardcoded absolute URLs** to `https://ckandrinirina.github.io/...` as required by social-card crawlers. A `<!-- Absolute URL required for OG; update og:image and og:url if domain changes -->` comment flags the two values that need updating if the site ever moves to a custom domain.

### Files Touched

**MODIFIED:**

- `index.html` — full rewrite of `<head>`: `lang="en"` → `lang="fr"`, title set, description meta added, OG block (5 tags), Twitter block (4 tags), favicon link reordered into the asset group; charset/viewport and anti-FOUC `<script>` preserved.

**CREATED (test-only):**

- `src/test/index-html.test.ts` — 15 vitest assertions covering every AC tag (lang, title, description, OG x5, Twitter x4, favicon, anti-FOUC preservation, charset/viewport).

### Verification

- `npx vitest run`: PASS (460) FAIL (0) — includes 15 new tests for index.html structure
- `npx eslint .`: no issues
- `npm run build`: succeeds; `dist/index.html` size grew from 1.06 kB to 2.40 kB (still tiny, 0.92 kB gzipped) — confirms all meta tags are emitted to production
- Production `dist/index.html` inspected: every AC tag present with the expected `content` values

### Deferred (post-deploy)

- The social-card validator AC requires the actual deployed URL; verifiable once `8_deployment` ships and the page is live at `https://ckandrinirina.github.io/`.
