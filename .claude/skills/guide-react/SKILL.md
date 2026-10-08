---
name: guide-react
description: React 19 best-practices reference for the ck-portfolio project — function components, hooks, context, ref-as-prop, performance. Auto-loaded during build/fix; not user-invocable.
user-invocable: false
---

# React 19 Guide — ck-portfolio

Current React 19 conventions for this project. Sourced from the official React 19
release notes and react.dev. Use these exact idioms; reject pre-19 patterns.

## Project relevance

ck-portfolio is a React 19 + TypeScript SPA. The interactive surface is small:
two context providers (`ThemeProvider`, `LanguageProvider`), section components
that read content, and a couple of IntersectionObserver hooks. Favor simple,
correct components over abstraction.

## What changed in React 19 (apply these)

### 1. `ref` is a regular prop — no `forwardRef`

```tsx
function MyInput({
  placeholder,
  ref,
}: {
  placeholder?: string
  ref?: React.Ref<HTMLInputElement>
}) {
  return <input placeholder={placeholder} ref={ref} />
}
// usage: <MyInput ref={inputRef} />
```

`forwardRef` still works but is no longer needed; don't introduce it in new code.

### 2. Context: render the context as the provider

```tsx
const ThemeContext = createContext<ThemeApi | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const api = useThemeState()
  return <ThemeContext value={api}>{children}</ThemeContext> // not ThemeContext.Provider
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
```

## Core hook rules

- Call hooks unconditionally, at the top level.
- **`useEffect` must clean up** observers/listeners:
  ```tsx
  useEffect(() => {
    const obs = new IntersectionObserver(cb)
    obs.observe(node)
    return () => obs.disconnect()
  }, [node])
  ```
- Prefer **deriving during render** over storing derived state in `useEffect`.
  (e.g. `content = locale === 'en' ? en : fr` — compute it, don't sync it.)
- `useCallback`/`useMemo` only to stabilize references for memoized children or
  expensive computations — not by default.
- **Stabilize context provider values** (memoize the object) so consumers don't
  re-render on every parent render.

## Patterns used in this project

| Need                         | Pattern                                                                   |
| ---------------------------- | ------------------------------------------------------------------------- |
| Theme / language state       | Context + typed `useX()` hook that throws outside provider                |
| Active nav link              | `useScrollSpy` wrapping `IntersectionObserver`, cleaned up on unmount     |
| Reveal on scroll             | `useReveal` returning `{ ref, isVisible }`; bail out under reduced-motion |
| Lists (experience, projects) | `.map()` with stable string keys (slug/id), never array index             |
| Anti-FOUC theme              | inline script in `index.html` sets `dark` class before hydration          |

## Anti-patterns

- `forwardRef`, `<Context.Provider>` (use `<Context value>`).
- Effects that recompute render-derivable values.
- Index keys for reorderable/translatable lists.
- Reading/writing refs during render (only in effects/handlers).
- Over-memoization that adds noise without measured benefit.

## Cross-references

- Component specifics: `/expert-frontend`.
- Typing components: `guide-typescript`.
- Styling: `guide-tailwind`.
- Testing hooks/components: `/expert-qa`.
