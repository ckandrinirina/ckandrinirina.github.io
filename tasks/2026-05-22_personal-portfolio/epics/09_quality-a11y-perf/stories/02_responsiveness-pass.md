---
id: 09-02
title: "Responsiveness Pass"
epic: 09
status: skip
size: M
blocked_by: ["06-09"]
files: ["src/components/Header.tsx", "src/components/Container.tsx", "src/sections/Hero.tsx", "src/sections/Skills.tsx", "src/sections/Experience.tsx", "src/sections/Projects.tsx", "src/sections/Education.tsx", "src/sections/Contact.tsx", "src/components/Footer.tsx"]
issue:
pr:
delivery:
prior_status:
---
# Story 09-02: Responsiveness Pass

> **Epic:** Quality, Accessibility & Performance
> **Size:** M
## Description

Verify and fix the layout across all breakpoints for every section and the
header. The site must read well, overflow nowhere, and provide properly sized
tap targets on mobile. Representative test widths are 375 px (small phone),
768 px (tablet), and 1280 px (desktop). This includes the header's mobile-menu
collapse behavior, card and grid reflow, and image scaling.

The goal is not a pixel-perfect redesign but a functional, readable layout at
every breakpoint with no horizontal scroll, no clipped content, and no elements
that are unreachable on touch devices because their tap area is too small.

## Acceptance Criteria

- [ ] At 375 px viewport width, all sections are readable: text is not clipped,
      no horizontal scrollbar appears, and no content is hidden behind other elements.
- [ ] At 375 px, the header collapses to a mobile menu; the menu trigger is
      visible, tappable (≥ 44 × 44 px touch target), and opens/closes correctly.
- [ ] At 768 px viewport width, layout transitions between mobile and tablet
      states as expected; grids and card rows reflow to an appropriate column count.
- [ ] At 1280 px viewport width, the desktop layout is shown; the nav links are
      visible inline in the header and no mobile-menu trigger is rendered.
- [ ] Skills badges wrap cleanly and do not overflow their container at any
      breakpoint.
- [ ] Experience and Projects cards stack to a single column on mobile and
      expand to a multi-column grid on tablet/desktop.
- [ ] Hero section text, CTA buttons, and social links are visible and usable at
      375 px without any truncation or overlap.
- [ ] Images (profile photo if present, og-image) scale with `max-width: 100%`
      or equivalent and do not overflow their parent.
- [ ] Container max-width and horizontal padding provide readable line lengths
      (≤ ~75 characters) on large viewports and comfortable margins on small ones.
- [ ] Footer is readable and not overflowing at any breakpoint.
- [ ] No Tailwind overflow utility (e.g., `overflow-x: hidden` on `body`) is
      used as a band-aid to hide a real overflow bug; root cause is fixed instead.

## Technical Notes

- Use Chrome DevTools Device Toolbar for quick breakpoint testing. For final
  verification, also test by resizing the browser window manually and at the
  exact pixel widths: 375, 768, 1280.
- The `Container` component controls max-width and horizontal padding — changes
  there affect all sections; adjust carefully and verify against every section.
- Tailwind v4 breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`) should be used
  consistently; avoid magic pixel values in inline styles.
- Mobile-menu pattern: the Header should show a hamburger/close button below the
  `md` breakpoint and hide it above. The nav links should be hidden on mobile
  until the menu is open, using Tailwind's responsive display utilities or a
  state-controlled class.
- Tap-target size: buttons and links must be at least 44 × 44 CSS pixels on
  mobile per WCAG 2.5.5. Icon-only controls (ThemeToggle, LanguageSwitcher,
  menu trigger) are most at risk — add padding or `min-h`/`min-w` utilities.
- The Education section often renders as a table; verify the table is scrollable
  horizontally on mobile (wrap in `overflow-x-auto`) rather than being cut off.
- Experience section role/period metadata and project bullet lists should wrap
  gracefully rather than overflow.

## Files to Create/Modify

| Action | File Path                      | Purpose                                                          |
| ------ | ------------------------------ | ---------------------------------------------------------------- |
| MODIFY | `src/components/Header.tsx`    | Implement mobile-menu collapse/expand; responsive nav visibility |
| MODIFY | `src/components/Container.tsx` | Verify/adjust max-width and responsive padding                   |
| MODIFY | `src/sections/Hero.tsx`        | Fix any layout issues at small breakpoints                       |
| MODIFY | `src/sections/Skills.tsx`      | Ensure badge grid wraps correctly at all widths                  |
| MODIFY | `src/sections/Experience.tsx`  | Card reflow: single column mobile → multi-column desktop         |
| MODIFY | `src/sections/Projects.tsx`    | Card reflow: single column mobile → multi-column desktop         |
| MODIFY | `src/sections/Education.tsx`   | Wrap table in `overflow-x-auto` for mobile                       |
| MODIFY | `src/sections/Contact.tsx`     | Verify link list layout at 375 px                                |
| MODIFY | `src/components/Footer.tsx`    | Verify footer layout at all breakpoints                          |

## Dependencies

- **Blocked by:** Story 06-09 (fully assembled site)
- **Blocks:** Story 09-05 (Lighthouse audit; performance and a11y scores can be
  affected by layout shifts caused by responsiveness bugs)

## Related

- **Epic:** quality-a11y-perf
- **Related stories:** 09-01 (accessibility — tap targets overlap), 09-05
  (Lighthouse audit)
- **Spec reference:** `docs/architecture/overview.md` §Non-functional requirements
  (Responsiveness); `docs/specs/2026-05-22_personal-portfolio/pre-spec.md` §6
  (How the site behaves — Responsiveness)
