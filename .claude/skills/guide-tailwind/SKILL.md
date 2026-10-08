---
name: guide-tailwind
description: Tailwind CSS v4 best-practices reference for the ck-portfolio project — CSS-first config, @theme tokens, class-based dark mode, responsive utilities. Auto-loaded during build/fix; not user-invocable.
user-invocable: false
---

# Tailwind CSS v4 Guide — ck-portfolio

Current Tailwind **v4** conventions. Sourced from the official Tailwind docs.
v4 is a significant change from v3 — there is **no `tailwind.config.js`** and
configuration is CSS-first. Reject v3 patterns.

## Project relevance

The Claude Design governs the visual look; you implement it with Tailwind v4
utilities. The site has a class-based light/dark toggle (`dark` on `<html>`),
managed by `ThemeProvider`.

## Setup (v4 with Vite)

```bash
npm install tailwindcss @tailwindcss/vite
```

```ts
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({ plugins: [react(), tailwindcss()] })
```

```css
/* src/index.css */
@import 'tailwindcss';
```

No PostCSS config, no `content` array — Tailwind v4 auto-detects sources.

## Class-based dark mode (this project)

Default `dark` follows `prefers-color-scheme`. We need a manual class toggle, so
override the variant in CSS:

```css
@import 'tailwindcss';
@custom-variant dark (&:where(.dark, .dark *));
```

Then `ThemeProvider` toggles `dark` on `<html>`, and you style with paired utilities:

```html
<div class="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100"></div>
```

> Do **not** use the v3 JS `darkMode: 'class'` config — it doesn't exist in v4.

## Design tokens with `@theme`

Define the design's colors/fonts/breakpoints as CSS variables; they generate utilities:

```css
@theme {
  --color-brand-500: #c0492f; /* → bg-brand-500, text-brand-500 */
  --font-display: 'Your Font', sans-serif; /* → font-display */
  --breakpoint-3xl: 120rem; /* → 3xl: variants */
}
```

Use these tokens instead of magic hex values so light/dark and the design stay consistent. To replace the default palette entirely: `--color-*: initial;` then declare your own.

## Responsive & state utilities

- Mobile-first: base styles, then `sm: md: lg: xl:` (and custom `3xl:` if defined).
  ```html
  <section class="px-4 md:px-8 lg:px-16"></section>
  ```
- Combine variants: `dark:hover:bg-zinc-800`, `md:dark:grid-cols-2`.
- Use `focus-visible:` for accessible focus rings.
- Gate animations on motion preference with the `motion-reduce:` variant
  (complements the JS `prefers-reduced-motion` check in `useReveal`):
  ```html
  <div class="transition-opacity motion-reduce:transition-none"></div>
  ```

## Conventions for this project

- Keep utility lists readable; rely on `prettier-plugin-tailwindcss` to sort classes.
- Every color/bg/border that differs by theme needs a `dark:` counterpart — don't leave half-themed elements.
- Extract repeated class clusters into a component (e.g. `Card`, `Badge`), not `@apply`, unless a class string is reused widely.
- Container/spacing scale comes from the design tokens, not arbitrary values, where possible.

## Anti-patterns

- `tailwind.config.js`, `postcss.config.js`, `@tailwind base/components/utilities` (all v3).
- `darkMode: 'class'` JS config (use `@custom-variant`).
- Magic hex/inline styles instead of `@theme` tokens.
- Half-themed components (light styles with no `dark:` variant).
- Overusing `@apply` to recreate component frameworks.

## Cross-references

- Component structure: `/expert-frontend`.
- Theme toggle wiring: `guide-react` (context) + `data-flow.md`.
- Build integration: `/expert-devops`.
