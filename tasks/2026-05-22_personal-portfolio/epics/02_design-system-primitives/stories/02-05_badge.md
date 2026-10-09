---
id: 02-05
title: "Badge component"
epic: 02
status: done
size: S
blocked_by: ["01-02", "02-02", "02-01"]
files: ["src/components/ui/Badge.tsx"]
issue:
pr:
delivery:
prior_status:
---
# Story 02-05: Badge component

> **Epic:** Design System — UI Primitives & Hooks
> **Size:** S
## Description

Create `src/components/ui/Badge.tsx` — a small, rounded chip component used to
display skill and technology labels. The `Skills` section renders an array of
`Badge` components, one per technology entry. The component is purely
presentational: it applies chip-style visual treatment to its `children` and
accepts an optional `className` for overrides.

## Acceptance Criteria

- [ ] `Badge` renders its `children` inside a single inline-level element (e.g. `<span>`).
- [ ] The rendered element has rounded corners (e.g. `rounded-full` or `rounded-md`), horizontal padding, and a subtle background colour that visually identifies it as a chip/tag.
- [ ] The text is legible (sufficient contrast) in **light mode**.
- [ ] The text is legible (sufficient contrast) in **dark mode** — background and text colour both update when the `.dark` class is applied to `<html>`.
- [ ] An optional `className` prop is accepted and merged via `cn()`.
- [ ] Passing `className` does not suppress the base chip styles.
- [ ] `children` accepts any React node (typically a string, but also JSX).
- [ ] The component is a default export from `src/components/ui/Badge.tsx`.
- [ ] TypeScript compiles without errors; `children` is typed as `React.ReactNode`, `className` as `string?`.
- [ ] ESLint reports no violations.

## Technical Notes

- Use design tokens from Story 02-02 for background and text colours (e.g. a `bg-surface-elevated` with `text-text-secondary`) so the chip respects the theme automatically.
- Keep the element semantic: `<span>` is appropriate for inline chips inside text/flex containers. Do not use `<div>` as it would break inline flow.
- Example base classes (adjust to match the approved design): `inline-flex items-center rounded-full px-3 py-1 text-sm font-medium`.
- No interaction states (hover, focus) are required — `Badge` is a display element, not an interactive control.

## Files to Create/Modify

| Action | File Path                     | Purpose                                 |
| ------ | ----------------------------- | --------------------------------------- |
| CREATE | `src/components/ui/Badge.tsx` | Skill/technology chip display component |

## Dependencies

- **Blocked by:** 01-02 (Tailwind installed), 02-02 (design tokens for colours) — and 02-01 for `cn()` at implementation time
- **Blocks:** 06-03 (Skills section renders Badge[])

## Related

- **Epic:** design-system-primitives
- **Related stories:** 02-02 (tokens), 02-01 (`cn`), 06-03 (Skills consumes Badge)
- **Spec reference:** components.md §UI components (Badge — skill/tech chip); spec §5.3 Skills
