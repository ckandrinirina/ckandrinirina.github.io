---
slug: app-shell
design: planned
---

# App Shell & Interaction Layer

> Feature doc — self-contained. A story for this feature reads THIS file
> (+ ../../folder-structure.md, + ../../\_shared.md when noted), not the other feature docs.

## Summary

The fixed sidebar + main view container, hash-based route navigation (one view at a
time), and all the interaction hooks that drive it — scroll-to-navigate, keyboard
arrows, scroll-reveal, view-enter transitions — plus the custom cursor. The boundary:
this feature owns the **shell, routing, and global interaction**; the per-route view
bodies belong to [content-views](../content-views/index.md), the ⌘K palette to
[command-palette](../command-palette/index.md), and project overlays to
[project-showcase](../project-showcase/index.md).

## Component tree

```
main.tsx
└── ThemeProvider                    (see ../theming/index.md)
    └── LanguageProvider             (see ../i18n-content/index.md)
        └── App                      (route + modal + cmd state)
            ├── Cursor               (fixed dot + ring, hover devices only)
            ├── Sidebar
            │   ├── brand button     (E mark → home)
            │   ├── nav groups       (workspace · connect)
            │   └── status block     (available · tnr · claude-code)
            ├── main
            │   ├── Topbar           (breadcrumb · ⌘K · TNR clock)
            │   ├── nav-lock         (per-transition top sweep)
            │   └── view             (keyed by route → remounts)
            │       └── view-inner   (view-enter-up | -down)
            │           ├── HomeView … ContactView  (→ content-views)
            │           └── ScrollHint
            ├── ProjectModal         (→ project-showcase, when state.openProject set)
            └── CommandPalette       (→ command-palette, ⌘K)
```

## Components

### `App`

- **File:** `src/App.tsx`
- **Owns:** route state, transition `direction`, modal/cmd-palette open state,
  scroll-to-navigate listeners, the scroll-reveal observer, keyboard arrows, and
  theme bootstrap wiring.

### `Sidebar`

- **File:** `src/components/layout/Sidebar.tsx`
- **Responsibility:** 240px aside — brand mark + grouped route buttons + live status
  block (available · tnr · claude-code).
- **Key props:** `active`, `onSelect(id)`, `onCmd()`.

### `Topbar`

- **File:** `src/components/layout/Topbar.tsx`
- **Responsibility:** breadcrumb (`~/portfolio / current`) + `⌘K` button +
  auto-updating TNR clock (every 30s). Also hosts the `ScrollProgress` bar (see
  [scroll-motion](../scroll-motion/index.md)).
- **Key props:** `active`, `onCmd()`.

### `ScrollHint`

- **File:** `src/components/ui/ScrollHint.tsx`
- **Responsibility:** sticky chip at the bottom of each view — "Scroll for {next view}".
- **Key props:** `visible`, `nextLabel`, `onClick()`.

### `Cursor`

- **File:** `src/components/cursor/Cursor.tsx`
- **Responsibility:** custom fixed dot + lerped ring; reads `[data-cursor]` /
  `[data-cursor-label]` to switch states (`default | hover | label | text`); disabled
  on touch / small screens. Does **not** replace native focus rings.

## Layout shell

```
┌──────────┬─────────────────────────────────────────────┐
│ Sidebar  │ Topbar  (~/portfolio · current · ⌘K · clock) │
│  240px   │─────────────────────────────────────────────│
│  Brand   │                                             │
│  ─group─ │           VIEW (scrollable inner)           │
│  Home    │           max-width 1100px                  │
│  Work    │                                             │
│  Exper.  │           [scroll-hint] (sticky bottom)     │
│  Skills  │                                             │
│  Process │                                             │
│  Contact │                                             │
│  ─stat─  │                                             │
└──────────┴─────────────────────────────────────────────┘
```

- Outer `.app`: `display: grid; grid-template-columns: 240px 1fr; height: 100vh;
overflow: hidden`.
- Below `880px`: stacks vertically (`grid-template-rows: 56px 1fr`); sidebar becomes a
  horizontal scrollable strip.
- View padding: `56px 80px 80px` desktop → `40px 40px 60px` ≤1100px →
  `24px 18px 60px` ≤600px.

## Routes

| ID           | Sidebar label | Glyph | Badge | Breadcrumb      |
| ------------ | ------------- | ----- | ----- | --------------- |
| `home`       | Home          | `◇`   | —     | `home`          |
| `work`       | Selected work | `▸`   | `8`   | `selected-work` |
| `experience` | Experience    | `≡`   | —     | `experience`    |
| `skills`     | Skills        | `⌬`   | —     | `skills`        |
| `process`    | How I work    | `✦`   | —     | `how-i-work`    |
| `contact`    | Contact       | `@`   | —     | `contact`       |

- Sidebar groups: `workspace` (home/work/experience/skills/process), `connect` (contact).
- Status block (desktop): `status: available` (green dot), `region: tnr · utc+3`,
  `paired with: claude-code` (accent).
- **Order** (`ROUTE_ORDER`, in `src/lib/constants.ts`) for forward/back nav:
  `home → work → experience → skills → process → contact`.

## Hooks

| Hook                                                    | Responsibility                                                                                                                         |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `useScrollReveal(viewRef, route)`                       | IntersectionObserver over `.reveal, .proj-card, .skill-card, .tl-item, .process-item, .now-card, .stats-grid`; adds `.in` with stagger |
| `useScrollToNavigate(viewRef, route, locked, navigate)` | Wheel + touch; advances route only when a gesture **starts** at the boundary and exceeds 90px accumulated; locks 850 ms after a nav    |
| `useKeyboardArrows(navigate, locked)`                   | Arrow / Page keys → route nav when at scroll boundary                                                                                  |
| `useHashRoute(setRoute)`                                | Reads `window.location.hash` on mount + on `hashchange`                                                                                |

(`useReveal()` — legacy one-off reveal — is kept in `src/hooks/` for reference; may be
unused. `useCmdK` lives in [command-palette](../command-palette/index.md).)

> **Extended by [scroll-motion](../scroll-motion/index.md):** `useScrollReveal`'s
> `REVEAL_SELECTOR` also matches `[data-reveal]`, and CSS variants
> (`data-reveal="fade|blur|scale|left|right|mask"`) decide the look of each reveal. That
> feature also adds `useInView` and `useScrollProgress` (+ the `ScrollProgress` bar in the
> Topbar). The engine and stagger here are unchanged.

## Flows

### Route navigation

```
Sources of route change:
  • Sidebar row click   → setRoute(id) with computed direction
  • ⌘K item             → setRoute(id) with direction='down'
  • hashchange          → setRoute(hash)
  • Wheel/touch gesture → useScrollToNavigate → next/prev
  • Arrow / PageUp/Down → useKeyboardArrows  → next/prev

On change:
  history.replaceState(null, '', '#' + id)   // back button walks route history
  viewRef.current.scrollTop = 0
  navLock = true (auto-clears after 850 ms)
  the .view container is re-keyed on `route` → React remounts → fresh
  view-enter animation in the chosen direction ('up' or 'down').
```

### Scroll-to-navigate (the trickiest piece)

```
Boundary detection:
  atTop = view.scrollTop <= 1
  atBot = view.scrollTop + view.clientHeight >= view.scrollHeight - 2
  boundary = atTop ? 'top' : atBot ? 'bot' : null

Wheel gesture state machine:
  • A gesture starts when a wheel event arrives and `inGesture` is false.
  • The gesture remembers the boundary it STARTED at (`startedAtBoundary`).
  • Only a gesture that started at a boundary AND continues to push past it
    can accumulate toward navigation.
  • Accumulator resets on direction change or when no wheel event arrives for 180 ms.
  • Threshold 90px → cur ± 1 in ROUTE_ORDER; clamp to [0, len-1].

Touch:
  touchstart: { y: clientY, scrollTop, t: now }
  touchend:   dy = startY - endY
              if |dy| > 70 AND dt < 700ms AND view didn't scroll (Δ<8px):
                dy > 0 && atBot → next ;  dy < 0 && atTop → prev
```

### Scroll-reveal

```
useScrollReveal:
  on route change, wait 30ms, then:
    Strip .in from .reveal, .proj-card, .skill-card, .tl-item, .process-item, .now-card, .stats-grid
    Create IntersectionObserver(root: viewRef, threshold: 0.08, rootMargin: '0px 0px -8% 0px')
    On enter:
      el.style.transitionDelay = Math.min(siblingIndex, 8) * 90 + 'ms'
      el.classList.add('in'); io.unobserve(el)
  prefers-reduced-motion: opacity:1; transform:none everywhere.
```

### Custom cursor

- Disabled when `(hover: none) or (max-width: 880px)` matches.
- Two fixed divs at `z-index: 9999`; `pointer-events: none`.
- Dot follows `mousemove` directly; ring lerps at 0.18 per RAF tick.
- `mouseover` inspects `e.target.closest(...)`:
  - `[data-cursor]` + `data-cursor-label` → state `label` (ring expands into a labeled pill).
  - `a, button, [role=button], .proj-card, .sb-row, .tb-search` → state `hover`.
  - `input, textarea, [contenteditable]` → state `text` (thin vertical bar).
  - else → state `default`.
- `mouseleave`/`mouseenter` on `document` toggle opacity for fade out/in.

## State summary

| State             | Where                 | Persisted          | Default             |
| ----------------- | --------------------- | ------------------ | ------------------- |
| Active route      | `App`                 | URL hash (history) | `home` (or on load) |
| Direction         | `App` (transient)     | no                 | `down`              |
| Cmd-K open        | `App` (transient)     | no                 | `false`             |
| Reveal `.in` flag | DOM class (transient) | no                 | unset until in view |
| Cursor state      | `Cursor` (transient)  | no                 | `default`           |

(Theme/locale state → see [theming](../theming/index.md) /
[i18n-content](../i18n-content/index.md); modal state → see
[project-showcase](../project-showcase/index.md).)

## Configuration

`src/index.css` holds the shell/interaction classes (`.app`, `.sidebar`, `.sb-*`,
`.topbar`, `.tb-*`, `.view`, `.view-inner`, `.view-enter*`, `.nav-lock`, `.scroll-hint`,
`.cursor-dot`, `.cursor-ring`) and the `@keyframes viewEnter*`, `navSweep`, `orbit`,
`blink`. `vite.config.ts` `base` is deployment-dependent (no change for the shell).

## Shared dependencies

- [Accessibility & reduced-motion conventions](../../_shared.md#accessibility--reduced-motion) —
  landmarks (`<aside>`/`<main>`/`<nav>`), focus rings, reduced-motion overrides,
  cursor disabled on touch / ≤880px.
- [Failure modes & resilience](../../_shared.md#failure-modes--resilience).
- Theme bootstrap: [theming](../theming/index.md).

## Changelog

- 2026-06-02 · doc-optimizer upgrade — feature doc created from `components.md`,
  `data-flow.md`, and the Atelier Terminal UI design record.
