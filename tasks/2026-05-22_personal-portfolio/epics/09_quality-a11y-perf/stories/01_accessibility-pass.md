---
id: 09-01
title: "Accessibility Pass"
epic: 09
status: todo
size: M
blocked_by: ["06-09"]
files: ["src/components/Header.tsx", "src/components/ThemeToggle.tsx", "src/components/LanguageSwitcher.tsx", "src/components/SocialLinks.tsx", "src/components/Section.tsx", "src/sections/Hero.tsx", "src/index.css", "src/components/Button.tsx"]
issue:
pr:
delivery:
prior_status:
---
# Story 09-01: Accessibility Pass

> **Epic:** Quality, Accessibility & Performance
> **Size:** M
## Description

Audit the fully assembled site for WCAG 2.1 AA compliance and fix every issue
found. The audit covers heading hierarchy, landmark structure, keyboard
navigation, visible focus rings, ARIA attributes on interactive controls,
correct `<html lang>` on language switch, and color contrast in both light and
dark themes. The goal is a Lighthouse accessibility score of ≥ 95 and a clean
axe-DevTools pass, with no known AA violations remaining.

This story focuses on correct semantics and operability — not cosmetic styling —
so changes should be the minimum needed to satisfy WCAG requirements and the
architecture's stated accessibility contract.

## Acceptance Criteria

- [ ] There is exactly one `<h1>` on the page (inside the Hero section); no
      other element uses the `h1` tag.
- [ ] Every section rendered by the `Section` component exposes a visible
      `<h2>` heading (About, Skills, Experience, Projects, Education, Languages,
      Contact).
- [ ] The four landmark elements `<header>`, `<main>`, `<nav>`, and `<footer>`
      are present and unique (or correctly labelled with `aria-label` if there are
      multiple `<nav>` elements).
- [ ] Every interactive control (nav links, ThemeToggle, LanguageSwitcher,
      DownloadCvButton, contact links, mobile-menu trigger) is reachable via
      sequential Tab navigation without a mouse.
- [ ] Visible focus rings appear on all focusable elements in both light and
      dark themes (no `outline: none` without a replacement).
- [ ] `ThemeToggle` has `aria-pressed` set to `"true"` when dark mode is active
      and `"false"` when light mode is active.
- [ ] `LanguageSwitcher` has an `aria-label` describing its purpose (e.g.,
      "Language / Langue") and updates `document.documentElement.lang` to `"en"` or
      `"fr"` when the locale is switched.
- [ ] `<html lang>` is `"fr"` on initial load and switches to `"en"` when the
      visitor selects English — verifiable by inspecting the DOM after switching.
- [ ] All text/background color pairs pass WCAG 2.1 AA contrast ratio (≥ 4.5:1
      for normal text, ≥ 3:1 for large text) in both light and dark themes;
      this includes body text, headings, Badge text, Card text, and nav links.
- [ ] Lighthouse accessibility score on `npm run preview` is ≥ 95 in both
      light and dark modes.
- [ ] axe-DevTools browser-extension scan reports zero critical or serious
      violations.

## Technical Notes

- Run Lighthouse via Chrome DevTools → Lighthouse tab against `http://localhost:4173`
  (the Vite preview server). Do not run against the Vite dev server (`localhost:5173`)
  as it does not represent the production build.
- Run axe-DevTools (free browser extension) alongside Lighthouse — axe often
  surfaces contrast and label issues that Lighthouse misses.
- Common failure modes to check proactively:
  - Icon-only buttons (ThemeToggle, mobile-menu toggle) need an accessible name
    via `aria-label` or a visually hidden `<span>`.
  - Social link icons (`SocialLinks`) need `aria-label` or a visually hidden
    label; bare `<a>` wrapping an SVG with no text is an empty-link violation.
  - `LanguageSwitcher`: if rendered as two `<button>` elements, the active one
    should carry `aria-pressed="true"` or an equivalent selection indicator.
  - Color contrast: Tailwind v4's default gray palette often passes AA for body
    text but can fail on muted/secondary text (e.g., role subtitles in Cards,
    Badge chips). Check each individually.
- Focus rings: Tailwind's `focus-visible:ring-*` utilities are the recommended
  approach. Ensure `focus:outline-none focus-visible:ring-2` or equivalent is
  applied consistently and the ring color has sufficient contrast against both
  light and dark backgrounds.
- The `<html lang>` update is handled by `LanguageProvider`; verify the effect
  runs correctly on mount and on locale change, not just statically.
- For the mobile menu: if the menu is hidden/shown by a `<button>`, add
  `aria-expanded` toggled with open/closed state, and `aria-controls` pointing
  to the menu container's `id`.

## Files to Create/Modify

| Action | File Path                             | Purpose                                                                                     |
| ------ | ------------------------------------- | ------------------------------------------------------------------------------------------- |
| MODIFY | `src/components/Header.tsx`           | Add `aria-expanded`/`aria-controls` to mobile-menu trigger; ensure `<nav>` has `aria-label` |
| MODIFY | `src/components/ThemeToggle.tsx`      | Confirm `aria-pressed` reflects live state; add `aria-label` if button is icon-only         |
| MODIFY | `src/components/LanguageSwitcher.tsx` | Confirm `aria-label` and active-state indicator; confirm `lang` attribute update            |
| MODIFY | `src/components/SocialLinks.tsx`      | Add `aria-label` to each anchor so icon links have accessible names                         |
| MODIFY | `src/components/Section.tsx`          | Verify `<h2>` is always rendered for the section title                                      |
| MODIFY | `src/sections/Hero.tsx`               | Confirm single `<h1>` and no duplicate headings                                             |
| MODIFY | `src/index.css`                       | Ensure global focus-visible styles are defined and not overridden                           |
| MODIFY | `src/components/Button.tsx`           | Ensure focus-visible ring applied for all variants                                          |

## Dependencies

- **Blocked by:** Story 06-09 (fully assembled site)
- **Blocks:** Story 09-05 (Lighthouse audit depends on a11y fixes being in place)

## Related

- **Epic:** quality-a11y-perf
- **Related stories:** 09-02 (responsiveness), 09-05 (Lighthouse audit)
- **Spec reference:** `docs/architecture/components.md` §Accessibility notes;
  `docs/architecture/overview.md` §Non-functional requirements;
  `docs/architecture/dev-guide.md` §Definition of done
