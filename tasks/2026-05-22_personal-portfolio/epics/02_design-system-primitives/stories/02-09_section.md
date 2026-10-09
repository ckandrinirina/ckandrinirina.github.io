---
id: 02-09
title: "Section layout wrapper"
epic: 02
status: done
size: M
blocked_by: ["02-03", "02-07"]
files: ["src/components/layout/Section.tsx"]
issue:
pr:
delivery:
prior_status:
---
# Story 02-09: Section layout wrapper

> **Epic:** Design System — UI Primitives & Hooks
> **Size:** M
## Description

Create `src/components/layout/Section.tsx` — the semantic wrapper used by every
content section of the portfolio (About, Skills, Experience, Projects,
Education, Languages, Contact). It renders a `<section>` element with a given
`id` (used for anchor navigation), an `<h2>` heading, and wraps its children
in `Container` for consistent max-width alignment. It attaches `useReveal`'s
`ref` to its root element and applies entrance animation classes when
`isVisible` becomes `true`. Under `prefers-reduced-motion: reduce`, `useReveal`
returns `true` immediately and no animation classes are applied, ensuring
content is always visible and accessible.

## Acceptance Criteria

- [ ] `Section` renders a `<section>` element as its root with `id={id}`.
- [ ] Inside the `<section>`, an `<h2>` renders `title` as its text content.
- [ ] The `children` are rendered inside `<Container>` (or below the `<h2>` inside the Container — layout detail to match the approved design).
- [ ] The `<section>` root has `ref` from `useReveal()` attached.
- [ ] When `isVisible` is `false`, the section has hidden/pre-animation classes (e.g. `opacity-0 translate-y-4`).
- [ ] When `isVisible` is `true`, the section has visible/post-animation classes (e.g. `opacity-100 translate-y-0 transition-all duration-500`).
- [ ] Under `prefers-reduced-motion: reduce` (mocked in tests), the section renders without animation classes and content is fully visible on initial render.
- [ ] The `<h2>` is the **only** heading inside `Section`; the `<h1>` is reserved for `Hero`. Consuming section components must not add a second `<h2>` for the same section title.
- [ ] Props `id`, `title`, and `children` are all required; no optional prop is missing from the type definition.
- [ ] The component is a default export from `src/components/layout/Section.tsx`.
- [ ] TypeScript compiles without errors.
- [ ] ESLint reports no violations.

## Technical Notes

- Import `useReveal` from `src/hooks/useReveal` and `Container` from `src/components/layout/Container`.
- Animation class strategy using Tailwind: use a conditional class approach, not inline style transforms. Example:
  ```tsx
  const { ref, isVisible } = useReveal()
  const animationClasses = isVisible
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 translate-y-4'
  return (
    <section
      id={id}
      ref={ref as React.RefObject<HTMLElement>}
      className={`transition-all duration-500 ease-out ${animationClasses}`}
    >
      <Container>
        <h2>{title}</h2>
        {children}
      </Container>
    </section>
  )
  ```
- The `ref` from `useReveal` is typed as `React.RefObject<Element>`. Cast to `React.RefObject<HTMLElement>` or `React.RefObject<HTMLDivElement>` as needed to satisfy the `<section>` ref prop type.
- Accessibility: the `<h2>` provides the accessible name for the `<section>` landmark. Do not add `aria-labelledby` unless the design calls for it (implicit labelling via first heading is sufficient).
- Vertical padding on the section (e.g. `py-16 md:py-24`) should be applied here or left to the consuming caller via `className` — decide based on the design. If uniform, add it to the `<section>` base classes.

## Files to Create/Modify

| Action | File Path                           | Purpose                                                                       |
| ------ | ----------------------------------- | ----------------------------------------------------------------------------- |
| CREATE | `src/components/layout/Section.tsx` | Semantic section wrapper with id, h2 heading, Container, and reveal animation |

## Dependencies

- **Blocked by:** 02-03 (Container), 02-07 (useReveal)
- **Blocks:** 06-01, 06-02, 06-03, 06-04, 06-05, 06-06, 06-07, 06-08 (all section components wrap their content in Section)

## Related

- **Epic:** design-system-primitives
- **Related stories:** 02-03 (Container used inside Section), 02-07 (useReveal used inside Section), 06-\* (all section components)
- **Spec reference:** components.md §Layout components (Section); data-flow.md §6 Reveal-on-scroll; components.md §Accessibility notes
