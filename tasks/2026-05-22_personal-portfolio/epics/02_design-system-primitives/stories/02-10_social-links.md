---
id: 02-10
title: "SocialLinks component"
epic: 02
status: done
size: S
blocked_by: ["02-01"]
files: ["src/components/ui/SocialLinks.tsx"]
issue:
pr:
delivery: direct
prior_status:
---
# Story 02-10: SocialLinks component

> **Epic:** Design System — UI Primitives & Hooks
> **Size:** S
## Description

Create `src/components/ui/SocialLinks.tsx` — a compact component that renders
icon anchor links for GitHub and LinkedIn using the URLs from
`lib/constants.ts`. It is used in three places: the Hero section (alongside
CTAs), the Footer, and the Contact section. An optional `size` prop scales the
icons. Because the GitHub and LinkedIn URLs are currently `[TO BE DEFINED]`
placeholders, the component must handle empty URL values gracefully by omitting
the corresponding anchor from the DOM rather than rendering a broken or
misleading link.

## Acceptance Criteria

- [ ] `SocialLinks` renders an anchor (`<a>`) for GitHub when `SOCIAL_LINKS.github` is a non-empty string.
- [ ] `SocialLinks` renders an anchor (`<a>`) for LinkedIn when `SOCIAL_LINKS.linkedin` is a non-empty string.
- [ ] When `SOCIAL_LINKS.github` is `''` (empty string / placeholder), **no** anchor for GitHub is rendered (null/undefined child or conditional render).
- [ ] When `SOCIAL_LINKS.linkedin` is `''`, **no** anchor for LinkedIn is rendered.
- [ ] Each rendered anchor has `target="_blank"` and `rel="noopener noreferrer"`.
- [ ] Each rendered anchor has a descriptive `aria-label` (e.g. `aria-label="GitHub profile"`, `aria-label="LinkedIn profile"`).
- [ ] The `size` prop is optional; when provided, it scales the icon dimensions (e.g. `size="sm"` → 16px, `size="md"` → 20px (default), `size="lg"` → 24px).
- [ ] Icon elements (SVG or icon component) are hidden from assistive technology (`aria-hidden="true"`) because the accessible name is on the anchor.
- [ ] The component renders without crashing when both URLs are empty (renders nothing or an empty wrapper).
- [ ] The component is a default export from `src/components/ui/SocialLinks.tsx`.
- [ ] TypeScript compiles without errors; `size` is typed as a union literal or a number.
- [ ] ESLint reports no violations.

## Technical Notes

- Icon strategy: use inline SVG paths for GitHub and LinkedIn icons (avoids an external icon library dependency). Copy the SVG path data from the official brand resources. Wrap each in a `<svg>` with `aria-hidden="true"` and `focusable="false"`.
- Size prop implementation: define a size map:
  ```ts
  const sizeMap = { sm: 16, md: 20, lg: 24 } as const
  type Size = keyof typeof sizeMap
  ```
  Apply `width` and `height` attributes to the `<svg>` from the map.
- Guard condition for empty URLs:
  ```tsx
  {
    SOCIAL_LINKS.github && (
      <a
        href={SOCIAL_LINKS.github}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub profile"
      >
        <GitHubIcon aria-hidden="true" size={resolvedSize} />
      </a>
    )
  }
  ```
- The anchors should not receive a `download` attribute — they open in a new tab.
- Wrap both anchors in a `<div>` or `<nav>` with `role="list"` / `<ul>` depending on how many links are shown — a simple `<div className="flex gap-4">` is acceptable for two icons.
- If an icon library (`lucide-react`, `react-icons`, etc.) was installed during Epic 01, prefer using it over raw SVG to reduce maintenance; but inline SVG is always acceptable.

## Files to Create/Modify

| Action | File Path                           | Purpose                                                                         |
| ------ | ----------------------------------- | ------------------------------------------------------------------------------- |
| CREATE | `src/components/ui/SocialLinks.tsx` | GitHub + LinkedIn icon anchors from constants, with graceful empty-URL handling |

## Dependencies

- **Blocked by:** 02-01 (needs `SOCIAL_LINKS` from constants)
- **Blocks:** 05-03 (Footer uses SocialLinks), 06-01 (Hero uses SocialLinks), 06-08 (Contact uses SocialLinks)

## Related

- **Epic:** design-system-primitives
- **Related stories:** 02-01 (SOCIAL_LINKS constant), 06-01 (Hero), 06-08 (Contact), 05-03 (Footer)
- **Spec reference:** components.md §UI components (SocialLinks); data-flow.md §8 Contact links; spec §4 social links, §5.7 Contact
