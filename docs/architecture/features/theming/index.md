---
slug: theming
design: planned
---

# Theming

> Feature doc — self-contained. A story for this feature reads THIS file
> (+ ../../folder-structure.md, + ../../\_shared.md when noted), not the other feature docs.

## Summary

Four-palette theming via a `[data-theme]` attribute on `<html>`. The boundary:
this feature owns the palette token definitions, the `ThemeProvider`/`useTheme`
context, the anti-FOUC bootstrap, and the `ThemeSwitcher` control. It does **not**
own routing, content, or the views that consume the tokens — those just read the
CSS custom properties it defines.

## Components

### `ThemeProvider`

- **Type:** React context provider — `src/theme/ThemeProvider.tsx`
- **State:** `theme: 'default' | 'paper' | 'ocean' | 'forest'` (4 palettes).
- **Init:** `localStorage['theme']` → else `matchMedia('(prefers-color-scheme: dark)')`
  → `'default'` (Ember dark) if dark preferred, else `'paper'` (light).
- **Effect:** sets `data-theme` on `document.documentElement` (removes it when theme
  is `'default'` so the `:root` palette applies); persists the choice.
- **Exposes (via `useTheme`):** `{ theme, setTheme, cycle }` where `cycle()` walks
  `default → ocean → forest → paper → default`.
- **Edge case:** an inline script in `index.html` applies the stored theme before
  React hydrates, to avoid a flash of incorrect theme (FOUC).

### `ThemeSwitcher`

- **Type:** UI control — `src/components/ui/ThemeSwitcher.tsx` (replaces the old `ThemeToggle`).
- **Purpose:** Cycles or segments the 4 palettes; reflects the current theme; exposes
  `aria-pressed`.

### `useTheme()` hook

Context accessor returning `{ theme, setTheme, cycle }`.

## Design tokens (verbatim from the Atelier mockup)

Tokens are CSS custom properties on `:root` and `[data-theme="..."]`, living in
`src/index.css`. **The mockup is the source of truth — match values verbatim, no
re-interpretation.**

### Ember (default — `:root`)

| Token           | Value                       |     | Token           | Value                             |
| --------------- | --------------------------- | --- | --------------- | --------------------------------- |
| `--bg`          | `#16130F`                   |     | `--muted-deep`  | `#5E5645`                         |
| `--bg-deep`     | `#100E0B`                   |     | `--accent`      | `#E08660` (warm orange)           |
| `--bg-2`        | `#1C1813`                   |     | `--accent-soft` | `rgba(224, 134, 96, 0.14)`        |
| `--surface`     | `#221E18`                   |     | `--accent-deep` | `#C56E48`                         |
| `--surface-2`   | `#2A251E`                   |     | `--gold`        | `#E8C547`                         |
| `--line`        | `rgba(245, 235, 220, 0.07)` |     | `--success`     | `#88C481`                         |
| `--line-strong` | `rgba(245, 235, 220, 0.16)` |     | `--info`        | `#7FB0DC`                         |
| `--fg`          | `#F4ECDC`                   |     | `--shadow-soft` | `0 8px 32px rgba(0, 0, 0, 0.35)`  |
| `--fg-soft`     | `#E3D9C5`                   |     | `--shadow-lift` | `0 18px 48px rgba(0, 0, 0, 0.45)` |
| `--fg-dim`      | `#C5BAA2`                   |     | `--muted`       | `#948870`                         |

### Paper (`[data-theme="paper"]`)

| Token           | Value                   |     | Token           | Value                                  |
| --------------- | ----------------------- | --- | --------------- | -------------------------------------- |
| `--bg`          | `#F2EDDD`               |     | `--muted-deep`  | `#968B73`                              |
| `--bg-deep`     | `#ECE5D2`               |     | `--accent`      | `#B5491C`                              |
| `--bg-2`        | `#EFE8D5`               |     | `--accent-soft` | `rgba(181, 73, 28, 0.10)`              |
| `--surface`     | `#F7F2E2`               |     | `--accent-deep` | `#8A3712`                              |
| `--surface-2`   | `#ECE5D2`               |     | `--gold`        | `#9A7100`                              |
| `--line`        | `rgba(20, 14, 8, 0.07)` |     | `--success`     | `#2C7D43`                              |
| `--line-strong` | `rgba(20, 14, 8, 0.20)` |     | `--info`        | `#1F5F9E`                              |
| `--fg`          | `#1A140C`               |     | `--shadow-soft` | `0 8px 32px rgba(120, 100, 60, 0.16)`  |
| `--fg-soft`     | `#2A2316`               |     | `--shadow-lift` | `0 18px 48px rgba(120, 100, 60, 0.22)` |
| `--fg-dim`      | `#4B4332`               |     | `--muted`       | `#6D6451`                              |

### Ocean (`[data-theme="ocean"]`)

| Token           | Value                       |     | Token           | Value                       |
| --------------- | --------------------------- | --- | --------------- | --------------------------- |
| `--bg`          | `#0E1820`                   |     | `--fg-dim`      | `#B4C5D7`                   |
| `--bg-deep`     | `#0A1218`                   |     | `--muted`       | `#6E8499`                   |
| `--bg-2`        | `#131F28`                   |     | `--accent`      | `#7AB7FF`                   |
| `--surface`     | `#182531`                   |     | `--accent-soft` | `rgba(122, 183, 255, 0.16)` |
| `--surface-2`   | `#1F2E3C`                   |     | `--accent-deep` | `#5E9CE0`                   |
| `--line`        | `rgba(220, 235, 248, 0.07)` |     | `--gold`        | `#F0D27A`                   |
| `--line-strong` | `rgba(220, 235, 248, 0.17)` |     | `--success`     | `#79CDA2`                   |
| `--fg`          | `#ECF3FA`                   |     | `--fg-soft`     | `#DAE6F2`                   |

### Forest (`[data-theme="forest"]`)

| Token           | Value                       |     | Token           | Value                       |
| --------------- | --------------------------- | --- | --------------- | --------------------------- |
| `--bg`          | `#0C140E`                   |     | `--fg-dim`      | `#B4C9BA`                   |
| `--bg-deep`     | `#080F0A`                   |     | `--muted`       | `#708A78`                   |
| `--bg-2`        | `#111B14`                   |     | `--accent`      | `#94D49A`                   |
| `--surface`     | `#15211A`                   |     | `--accent-soft` | `rgba(148, 212, 154, 0.14)` |
| `--surface-2`   | `#1B2A21`                   |     | `--accent-deep` | `#74B47D`                   |
| `--line`        | `rgba(220, 240, 225, 0.07)` |     | `--gold`        | `#DCB658`                   |
| `--line-strong` | `rgba(220, 240, 225, 0.17)` |     | `--success`     | `#94D49A`                   |
| `--fg`          | `#ECF5EE`                   |     | `--fg-soft`     | `#D8E5DC`                   |

### Typography & motion tokens

| Token          | Value                                                                |
| -------------- | -------------------------------------------------------------------- |
| `--font-mono`  | `"JetBrains Mono", "Geist Mono", "SF Mono", ui-monospace, monospace` |
| `--font-serif` | `"Instrument Serif", "Cormorant Garamond", "Times New Roman", serif` |
| `--ease`       | `cubic-bezier(0.22, 1, 0.36, 1)`                                     |

Base font: `font-mono` at `14px / 1.6`; OpenType features `"ss01", "cv11"`. Section/hero
titles use `--font-serif` italic — `clamp(32px, 4.5vw, 52px)` for section titles,
`clamp(48px, 7vw, 88px)` for the Hero name.

### Ambient effects (token-driven)

- **Body radial glow** (fixed, `pointer-events: none`, `z-index: 0`): two radial
  gradients — accent-soft top-right, gold 5% bottom-left.
- **Body grid overlay** (fixed, behind everything): two perpendicular
  `linear-gradient(var(--line) 1px, transparent 1px)` at `64px 64px`, `opacity: 0.5`.

## Flows

### Theme cycle (4 palettes)

```
User clicks ThemeSwitcher (or runs `theme` in ⌘K)
  └─ cycle() — walks default → ocean → forest → paper → default
       ├─ next === 'default' → html.removeAttribute('data-theme')
       │  else                → html.setAttribute('data-theme', next)
       ├─ CSS custom properties recompute; Tailwind utilities + custom classes
       │  all pull from the new --bg / --fg / --accent / etc. tokens
       └─ localStorage['theme'] = next
```

Initial precedence: `localStorage['theme']` → `prefers-color-scheme: dark` →
`'default'` (Ember dark), else `'paper'` (light).

### Anti-FOUC bootstrap (runs before React)

Inline `<script>` in `index.html`, before any render:

```html
<script>
  /* Anti-FOUC theme bootstrap — runs before React */
  ;(function () {
    try {
      var stored = localStorage.getItem('theme')
      var prefersDark = matchMedia('(prefers-color-scheme: dark)').matches
      var t = stored || (prefersDark ? 'default' : 'paper')
      if (t !== 'default')
        document.documentElement.setAttribute('data-theme', t)
    } catch (e) {}
  })()
</script>
```

`src/theme/themeBootstrap.ts` keeps the script string co-located with the provider.
`ThemeProvider` reconciles with whatever the early script applied.

## Configuration

`src/index.css` declares the Tailwind v4 `@theme` bridge plus all `:root` /
`[data-theme="..."]` token blocks:

```css
@import 'tailwindcss';

@theme {
  --color-bg: var(--bg);
  --color-fg: var(--fg);
  --color-accent: var(--accent);
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
  --font-serif: 'Instrument Serif', serif;
}
/* + all :root and [data-theme="..."] custom properties from the mockup */
```

`index.html` sets `<html lang="fr">` by default and hosts the bootstrap script above.

## Shared dependencies

- [Provider/context conventions](../../_shared.md#providers--context) — the
  context pattern `ThemeProvider` follows.
- [Reduced-motion & accessibility conventions](../../_shared.md#accessibility--reduced-motion) —
  theme switch sets `<html data-theme>`; switch exposes `aria-pressed`.

## Changelog

- 2026-06-02 · doc-optimizer upgrade — feature doc created from `components.md`,
  `data-flow.md`, and the Atelier Terminal UI design record.
