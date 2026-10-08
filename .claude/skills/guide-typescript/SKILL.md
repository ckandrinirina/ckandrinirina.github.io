---
name: guide-typescript
description: TypeScript 5.7+ best-practices reference for the ck-portfolio project — strict typing, component props, discriminated unions, satisfies, typed content. Auto-loaded during build/fix; not user-invocable.
user-invocable: false
---

# TypeScript Guide — ck-portfolio

Current TypeScript conventions for this project. Sourced from the official
TypeScript handbook/release notes. The project runs in `strict` mode.

## Project relevance

The portfolio's data model is the heart of its type safety: `PortfolioContent`
(`src/content/types.ts`) defines the shape that both `fr.ts` and `en.ts` must
implement, guaranteeing EN/FR parity at compile time.

## Strictness baseline

- `"strict": true` (implies `noImplicitAny`, `strictNullChecks`, etc.).
- Avoid `any`; prefer `unknown` + narrowing. Avoid non-null `!` — narrow instead.
- `"moduleResolution": "bundler"`, `"jsx": "react-jsx"`, `"verbatimModuleSyntax"` for clean imports.

## Typing the content model

```ts
// content/types.ts
export interface ExperienceEntry {
  company: string
  role: string
  period: string
  tech: string[]
  projects: { name: string; description: string; tags: string[] }[]
}

export interface PortfolioContent {
  hero: { name: string; title: string; tagline: string; location: string }
  about: string
  skills: { group: string; items: string[] }[]
  experience: ExperienceEntry[]
  education: {
    qualification: string
    institution: string | null
    year: string
  }[]
  spokenLanguages: { name: string; level: string }[]
  contact: { email: string; whatsapp: string }
}
```

```ts
// content/fr.ts
import type { PortfolioContent } from './types'
export const fr = {
  /* ... */
} satisfies PortfolioContent
```

### Use `satisfies` for literal data

`satisfies` validates the object against the type **while keeping the precise
literal types** for inference (so `fr.skills[0].group` stays a string literal,
and typos/missing fields are caught):

```ts
const palette = {
  red: [255, 0, 0],
  green: '#00ff00',
} satisfies Record<string, string | [number, number, number]>
```

Prefer `satisfies PortfolioContent` over `: PortfolioContent` for `fr`/`en` so
extra/typo'd keys are flagged and literal types survive.

## Component props

- Type props with an explicit `type Props = { ... }` (or `interface` when meant to be extended).
- Use `React.ReactNode` for children, `React.Ref<T>` for refs (React 19 ref-as-prop).
- **Discriminated unions** for variant components:
  ```ts
  type ButtonProps =
    | { as: 'link'; href: string; variant?: 'primary' | 'ghost' }
    | { as: 'button'; onClick: () => void; variant?: 'primary' | 'ghost' }
  ```
  Narrow on the `as` discriminant; the compiler enforces the right fields.

## Narrowing

```ts
function area(
  shape: { kind: 'circle'; r: number } | { kind: 'square'; s: number },
) {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.r ** 2
    case 'square':
      return shape.s ** 2
  }
}
```

Use `switch` on a `kind`/`as` discriminant; add an exhaustiveness `never` check
in switches that must cover all cases.

## type vs interface (project rule)

- **`type`** for unions, tuples, mapped/conditional types, and component props.
- **`interface`** for object shapes meant to be implemented/extended (e.g. `PortfolioContent`).

## Anti-patterns

- `any`, `as` casts to silence errors, non-null `!` without a guard.
- Annotating literal data with `:Type` (loses literal inference) instead of `satisfies`.
- Optional-everything props that hide missing data.
- Duplicating the content shape in `fr`/`en` instead of sharing `PortfolioContent`.

## Cross-references

- React typing idioms: `guide-react`.
- Lint enforcement: ESLint 9 + typescript-eslint (see `/expert-devops`).
- Reviewing type rigor: `/expert-analyst`.
