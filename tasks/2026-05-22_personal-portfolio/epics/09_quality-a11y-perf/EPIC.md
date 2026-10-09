---
epic: 09
slug: quality-a11y-perf
title: "Quality, Accessibility & Performance"
description: "This epic is the final quality gate for the assembled portfolio site."
issue:
pr: 22
delivery: pr
---
# Epic 09: Quality, Accessibility & Performance

## Description

This epic is the final quality gate for the assembled portfolio site. It covers
every cross-cutting concern that must be verified and corrected before the site
can be considered done: semantic accessibility, keyboard and screen-reader
support, full responsive-layout correctness, reduced-motion compliance, privacy
enforcement, and a recorded Lighthouse audit confirming the performance and
accessibility score targets.

Because the work targets the fully assembled site (all eight sections integrated
with the header, footer, theme toggle, and language switcher), this epic depends
on Epic 06 (assembled site), Epic 07 (SEO meta tags), and Epic 08
(GitHub Pages deploy and preview URL). No other epic depends on this one — it
is the terminal gate before the project is marked complete.

Stories in this epic are intentionally ordered so that accessibility (09-01) and
responsiveness (09-02) fixes land first, then the final Lighthouse audit (09-05)
measures the site in its corrected state. Reduced-motion (09-03) and privacy
verification (09-04) are independent and can run in parallel with 09-01/09-02.

## Goals

- Ensure the site meets WCAG 2.1 AA intent across landmarks, headings, keyboard
  navigation, color contrast, and ARIA attributes in both light and dark themes.
- Confirm the layout reads correctly and overflows nowhere at the three
  representative breakpoints: mobile (~375 px), tablet (~768 px), and desktop
  (~1280 px).
- Verify that all animated reveals are suppressed and content is fully visible
  when the visitor has `prefers-reduced-motion: reduce` set.
- Guarantee that the full home street address never appears in the built output,
  with an automated guard to keep that invariant enforced.
- Record a Lighthouse audit showing performance ≥ 95 and accessibility ≥ 95 on
  the production build, with SEO checks passing.

## Scope

### In Scope

- Accessibility audit and fix pass across Header, ThemeToggle, LanguageSwitcher,
  Section, and all section components.
- Heading hierarchy verification (single `<h1>`, `<h2>` per section).
- Landmark structure: `<header>`, `<main>`, `<nav>`, `<footer>` present and
  unique where required.
- Keyboard focus: every interactive control reachable by Tab, with visible focus
  rings in both themes.
- ARIA: `aria-pressed` and `aria-label` on ThemeToggle and LanguageSwitcher;
  correct `<html lang>` attribute after language switch.
- Color-contrast check in both light and dark modes.
- Responsive layout verification and fixes at mobile/tablet/desktop widths.
- Mobile-menu collapse behavior in the Header.
- `useReveal` and `Section` reduced-motion compliance.
- Privacy check: grep of built `dist/` for street-address fragments; automated
  guard script or CI step.
- Lighthouse performance ≥ 95, accessibility ≥ 95, and passing SEO checks on
  the production build.
- Asset optimization (image sizes, og-image dimensions) as required to hit
  performance targets.

### Out of Scope

- New features, sections, or content changes.
- Changes to CI pipelines beyond adding a privacy-check step.
- Screen-reader deep-dive beyond what Lighthouse and axe surface.
- Custom-domain or CDN configuration.
- Visitor analytics or error tracking.

## Dependencies

- **Depends on:** Epic 06 story 06-09 (assembled site), Epic 07 story 07-03
  (SEO meta tags), Epic 08 story 08-01 (GitHub Pages deploy / preview URL).
- **Blocks:** None — this is the final epic.

## Acceptance Criteria

- [ ] Lighthouse accessibility score ≥ 95 on the production build in both light
      and dark modes.
- [ ] Lighthouse performance score ≥ 95 on the production build.
- [ ] Lighthouse SEO checks pass (title, description, OG/Twitter tags, `lang`).
- [ ] No horizontal overflow at 375 px, 768 px, or 1280 px viewport widths.
- [ ] Full home street address is absent from every file in `dist/`; an
      automated check enforces this.
- [ ] All content is fully visible without animation when
      `prefers-reduced-motion: reduce` is active.
- [ ] Single `<h1>` on the page; every section has a visible `<h2>`.
- [ ] All interactive controls are keyboard-reachable with visible focus rings.
- [ ] `<html lang>` reflects the active locale in both FR and EN.
- [ ] Lighthouse performance ≥ 95 score result is documented (screenshot or
      JSON report committed to the repo).

## Technical Notes

- Run accessibility checks with the axe DevTools browser extension and Lighthouse
  (built-in to Chrome DevTools). Both must be run on `npm run preview` output
  targeting the production build.
- Lighthouse runs on the production build (`npm run build && npm run preview`),
  not the dev server.
- Color-contrast failures often appear on placeholder text, icon fills, and
  disabled states — check those specifically in both themes.
- The `prefers-reduced-motion` OS setting on macOS is under System Settings →
  Accessibility → Display → Reduce Motion. On Windows it is under Display →
  Visual Effects → Animation Effects.
- The privacy guard script should be runnable as `npm run check:privacy` and
  should exit non-zero if any address fragment is found, so it blocks CI if
  accidentally introduced.
- Lighthouse performance of ≥ 95 on a static Vite site is achievable; the most
  common blockers are unoptimized og-image (use a compressed JPEG/WebP ≤ 200 KB)
  and render-blocking resources (Vite handles JS splitting; verify no third-party
  scripts are added).
