---
id: 02-03
title: "Container component"
epic: 02
status: done
size: S
blocked_by: ["01-02", "02-01"]
files: ["src/components/layout/Container.tsx"]
issue:
pr:
delivery:
prior_status:
---
# Story 02-03: Container component

> **Epic:** Design System — UI Primitives & Hooks
> **Size:** S
## Description

Create `src/components/layout/Container.tsx`, a simple centred max-width wrapper
that provides consistent horizontal padding across all breakpoints. It is a
presentational component with no logic, used by `Section` (Story 02-09) and
potentially by other layout components to constrain content width to a readable
line length on large screens while remaining full-width on small ones.

## Acceptance Criteria

- [ ] `Container` renders its `children` inside a single `<div>`.
- [ ] The `<div>` is horizontally centred (`mx-auto`) with a defined `max-w-*` (e.g. `max-w-5xl` or `max-w-7xl` — match the approved design).
- [ ] Responsive horizontal padding is applied: a smaller `px-*` on mobile, increasing at `sm:` or `md:` breakpoints (e.g. `px-4 sm:px-6 lg:px-8`).
- [ ] An optional `className` prop is accepted and merged via `cn()` so callers can override or extend styles.
- [ ] Passing no `className` renders without error.
- [ ] Passing `className="w-full"` applies the extra class alongside the default classes (not instead of them).
- [ ] The component is a default export from `src/components/layout/Container.tsx`.
- [ ] TypeScript compiles without errors; prop types are explicitly typed (`children: React.ReactNode`, `className?: string`).
- [ ] ESLint reports no violations.

## Technical Notes

- Keep the component minimal — one `<div>` with Tailwind utility classes.
- Use `cn()` from `src/lib/utils.ts` to merge the default classes with the incoming `className` prop.
- Do not add any padding-top / padding-bottom here; vertical rhythm is the responsibility of each caller (`Section`, sections, etc.).
- Example implementation shape (not prescriptive):
  ```tsx
  import { cn } from '@/lib/utils'
  export default function Container({ children, className }: Props) {
    return (
      <div className={cn('mx-auto max-w-5xl px-4 sm:px-6 lg:px-8', className)}>
        {children}
      </div>
    )
  }
  ```
- The `max-w` value should match the design's content column width. If uncertain, default to `max-w-5xl` and adjust when the layout epic reviews it.

## Files to Create/Modify

| Action | File Path                             | Purpose                                      |
| ------ | ------------------------------------- | -------------------------------------------- |
| CREATE | `src/components/layout/Container.tsx` | Centred max-width responsive padding wrapper |

## Dependencies

- **Blocked by:** 01-02 (Tailwind installed), 02-01 (for `cn()` utility) — but 02-01 must also be done before 02-03 can use `cn`.

  > Note: the epic instruction lists 01-02 as the direct blocker; `cn` from 02-01 is needed at implementation time, so ensure 02-01 is merged first.

- **Blocks:** 02-09 (Section wraps children in Container)

## Related

- **Epic:** design-system-primitives
- **Related stories:** 02-09 (Section imports Container), 05-01 (Header may use Container), 05-03 (Footer may use Container)
- **Spec reference:** components.md §Layout components
