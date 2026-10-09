---
id: 02-04
title: "Button component + test"
epic: 02
status: done
size: M
blocked_by: ["02-01", "01-04"]
files: ["src/components/ui/Button.tsx", "src/components/ui/Button.test.tsx"]
issue:
pr:
delivery:
prior_status:
---
# Story 02-04: Button component + test

> **Epic:** Design System — UI Primitives & Hooks
> **Size:** M
## Description

Create `src/components/ui/Button.tsx` — a polymorphic, styled interactive
element that renders either a `<button>` element or an `<a>` anchor depending on
the `as` prop. It supports three visual variants: `primary` (filled brand
colour), `secondary` (outlined), and `ghost` (minimal / text-level). This
component is used for all primary calls to action (Hero CTAs, contact links) and
for nav-style links that require button-level accessibility semantics. Accompany
it with `Button.test.tsx` to verify variant classes and element rendering.

## Acceptance Criteria

- [ ] When `as` is omitted or `as="button"`, the component renders a `<button>` element.
- [ ] When `as="a"` and `href` is provided, the component renders an `<a>` element with the given `href`.
- [ ] When `as="a"` but no `href` is provided, the component still renders an `<a>` without throwing (graceful degradation).
- [ ] The `primary` variant applies distinct filled styles using a brand colour token (e.g. `bg-brand-500 text-white`).
- [ ] The `secondary` variant applies an outlined style visually distinct from `primary` (e.g. `border border-brand-500 text-brand-500 bg-transparent`).
- [ ] The `ghost` variant applies a minimal style (e.g. no background, no border, styled text colour) visually distinct from both other variants.
- [ ] All three variants have a visible focus ring (e.g. `focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none`) for keyboard accessibility.
- [ ] All three variants include hover styles.
- [ ] An optional `className` prop is merged via `cn()` and does not override the focus-ring or variant classes unintentionally.
- [ ] The component is a default export from `src/components/ui/Button.tsx`.
- [ ] TypeScript compiles without errors; prop types cover `variant`, `as`, `href?`, `children`, `className?`, and standard button/anchor HTML attributes.
- [ ] **Tests (Button.test.tsx):**
  - [ ] Renders a `<button>` element when `as` is omitted.
  - [ ] Renders an `<a>` element (not a `<button>`) when `as="a"` is passed.
  - [ ] The rendered `<a>` has the correct `href` attribute when one is provided.
  - [ ] Each of the three variants applies its distinctive class (or at minimum a non-overlapping class) — use `getByRole` + class assertion or snapshot.
  - [ ] The component is keyboard-accessible: `getByRole('button')` or `getByRole('link')` finds the element.
  - [ ] Tests pass under `vitest run`.
- [ ] ESLint reports no violations on both files.

## Technical Notes

- Polymorphic `as` prop: keep the TypeScript type simple. Rather than a full generic `ComponentPropsWithRef<T>`, use a discriminated union or a conditional approach:
  ```ts
  type ButtonProps = {
    variant?: 'primary' | 'secondary' | 'ghost'
    className?: string
    children: React.ReactNode
  } & (
    | ({ as?: 'button' } & React.ButtonHTMLAttributes<HTMLButtonElement>)
    | ({
        as: 'a'
        href?: string
      } & React.AnchorHTMLAttributes<HTMLAnchorElement>)
  )
  ```
  This gives correct IntelliSense without overly complex generics.
- Variant class map pattern: define a `variantClasses` record outside the component function to avoid re-creating it on every render:
  ```ts
  const variantClasses: Record<Required<ButtonProps>['variant'], string> = {
    primary: '...',
    secondary: '...',
    ghost: '...',
  }
  ```
- Test file location: `src/components/ui/Button.test.tsx` (co-located with the component, per project convention).
- Test setup: Vitest + `@testing-library/react` configured in `src/test/setup.ts` (Epic 01, story 01-04). Import `render`, `screen` from `@testing-library/react`.
- Do not test visual pixel accuracy in unit tests — test element type, presence of role, and presence of key class substrings.

## Files to Create/Modify

| Action | File Path                           | Purpose                                                              |
| ------ | ----------------------------------- | -------------------------------------------------------------------- |
| CREATE | `src/components/ui/Button.tsx`      | Polymorphic styled button/link with primary/secondary/ghost variants |
| CREATE | `src/components/ui/Button.test.tsx` | Unit tests: element type, variant classes, href, keyboard role       |

## Dependencies

- **Blocked by:** 02-01 (needs `cn()`), 01-04 (test tooling — Vitest + Testing Library configured)
- **Blocks:** 03-03 (ThemeToggle), 04-08 (DownloadCvButton), 06-01 (Hero CTAs)

## Related

- **Epic:** design-system-primitives
- **Related stories:** 02-01 (`cn` helper), 06-01 (Hero uses Button for CTAs), 06-08 (Contact uses Button-style links)
- **Spec reference:** components.md §UI components; spec §6 (navigation, CTAs)
