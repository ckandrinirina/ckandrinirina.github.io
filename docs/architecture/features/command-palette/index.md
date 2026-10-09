---
slug: command-palette
design: planned
---

# Command Palette (⌘K)

> Feature doc — self-contained. A story for this feature reads THIS file
> (+ ../../folder-structure.md, + ../../\_shared.md when noted), not the other feature docs.

## Summary

The `⌘/Ctrl+K` command palette: a modal with a filtered, grouped command list
(Navigation, Quick actions, Projects) and full keyboard navigation. The boundary:
this feature owns the palette UI, its command data, and the `useCmdK` toggle hook;
the open/close state is held by `App` ([app-shell](../app-shell/index.md)), and the
commands it runs delegate to routing, theming, and contact actions owned elsewhere.

## Components

### `CommandPalette`

- **File:** `src/components/cmdk/CommandPalette.tsx`
- **Responsibility:** modal with an input, grouped + filtered results (Navigation,
  Quick, Projects), arrow + enter navigation, `⌘K` toggle.

### `commands.ts`

- **File:** `src/components/cmdk/commands.ts`
- **Responsibility:** the `COMMANDS` data — each item has `cmd`, `label`, `desc`,
  `group`, and a `run()`.

### `useCmdK(toggle)` hook

- **File:** `src/hooks/useCmdK.ts`
- **Responsibility:** binds `⌘/Ctrl+K` to toggle the palette open state.

## Flows

### Command palette

```
Keyboard ⌘/Ctrl+K toggles open state (useCmdK → App).
Open:
  filter = items.filter(i => (cmd + label + desc).toLowerCase().includes(q.toLowerCase()))
  group by item.group → Navigation, Quick, Projects
  ArrowUp/Down moves active; Enter runs active item; Escape closes.
Items run() →
  • route   → setRoute(id)   [home, work, experience, skills, process, contact]  (→ app-shell)
  • action 'copyEmail'  → clipboard write
  • action 'whatsapp'   → window.open(WA link)
  • action 'cycleTheme' → theme cycle  (→ theming)
```

## Shared dependencies

- Open/close state + routing target: [app-shell](../app-shell/index.md).
- `cycleTheme` action: [theming](../theming/index.md).
- `copyEmail` / `whatsapp` actions mirror the Contact rows:
  [content-views](../content-views/index.md).
- [Accessibility & reduced-motion conventions](../../_shared.md#accessibility--reduced-motion) —
  cmdk input has a `placeholder` and the arrow-key contract; `Escape` closes.

## Changelog

- 2026-06-02 · doc-optimizer upgrade — feature doc created from `components.md`,
  `data-flow.md`, and the Atelier Terminal UI design record.
