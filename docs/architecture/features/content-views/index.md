---
slug: content-views
design: planned
---

# Content Views

> Feature doc — self-contained. A story for this feature reads THIS file
> (+ ../../folder-structure.md, + ../../\_shared.md when noted), not the other feature docs.

## Summary

The six per-route view components rendered inside the shell's `.view` container, plus
the Home-only animation primitives (Reveal, CountUp, Marquee) and the Contact
copy-to-clipboard interaction. The boundary: this feature owns the **view bodies and
how they present content**; the content data/types belong to
[i18n-content](../i18n-content/index.md), the shell/routing to
[app-shell](../app-shell/index.md), and the project cards/modal to
[project-showcase](../project-showcase/index.md). Each view consumes `useLanguage()`
and renders its content slice.

## Components

| Component        | File                           | Renders                                                                                                                    |
| ---------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `HomeView`       | `src/views/HomeView.tsx`       | Hero (greet · letter-reveal name · tagline · role rotor · CTAs) · Avatar frame · "Now building" card · 2×2 stats · marquee |
| `WorkView`       | `src/views/WorkView.tsx`       | Eyebrow + section title; 2-col grid of `ProjectCard`s; opens `ProjectModal` on click                                       |
| `ExperienceView` | `src/views/ExperienceView.tsx` | Eyebrow + section title; reverse-chrono vertical timeline (`.tl-item` with dot marker)                                     |
| `SkillsView`     | `src/views/SkillsView.tsx`     | Eyebrow + section title; 2×2 skill cards (Frontend / Backend / Data & Cloud / AI & Craft) with lead pills + chips          |
| `ProcessView`    | `src/views/ProcessView.tsx`    | Eyebrow + section title; 5 numbered principles (`.process-item`)                                                           |
| `ContactView`    | `src/views/ContactView.tsx`    | Eyebrow + section title; two-card grid: copy-able key/value card + pitch card                                              |

See [../../folder-structure.md](../../folder-structure.md) for the view ↔ content map.

### Home animation primitives & CTA

| Component          | File                                     | Responsibility                                                                                                                                   |
| ------------------ | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Reveal`           | `src/components/ui/Reveal.tsx`           | Letter-by-letter animated text (per-char delays). Props: `text`, `delay?`, `italic?`, `perChar?`                                                 |
| `CountUp`          | `src/components/ui/CountUp.tsx`          | Eased number counter on mount. Props: `to`, `suffix?`, `duration?`                                                                               |
| `Marquee`          | `src/components/ui/Marquee.tsx`          | Looping horizontal track with hover-pause + edge fade. Props: `items[]`. Fade edges via mask-image gradient transparent→solid 8%→92%→transparent |
| `DownloadCvButton` | `src/components/ui/DownloadCvButton.tsx` | Anchor to the CV PDF with `download`; rendered as the 3rd Home CTA                                                                               |

> **Generalised by [scroll-motion](../scroll-motion/index.md):** `Reveal` and `CountUp`
> are no longer Home-only — that feature promotes them site-wide (`CountUp` via the new
> `useInView` hook) and adds the `data-reveal` reveal vocabulary used in these views.

## Flows

### CV download (Home CTA)

```
HomeView <DownloadCvButton/>  →  <a href={BASE_URL + 'cv/erick-andrinirina-cv.pdf'} download>
  └─ Browser downloads the static PDF (served by GitHub Pages from public/)
```

`href` respects Vite's `base` via `import.meta.env.BASE_URL` so it works under both
root (`/`) and project sub-path bases.

### Contact links + copy-to-clipboard

```
ContactView card rows:
  Email     → <a href="mailto:ckandrinirina@gmail.com"> + copy button
  WhatsApp  → <a href="https://wa.me/261385096664">     + copy button
  Based in  → text (Antananarivo · UTC+3)
  Languages → text (Malagasy · Français · English)
  Available → text (● open · remote, contract or full-time)

Copy button click → navigator.clipboard?.writeText(value)
  → setCopied('email' | 'phone') → render "✓ copied" (success color)
  → setTimeout 1400ms → setCopied(null)
```

| State         | Where                     | Persisted | Default                      |
| ------------- | ------------------------- | --------- | ---------------------------- |
| Copy feedback | `ContactView` (transient) | no        | `null` (clears after 1400ms) |

## Shared dependencies

- Content data + types (`hero`, `now`, `stats`, `marquee`, `experience`, `skills`,
  `process`, `contact`): [i18n-content](../i18n-content/index.md).
- Project cards/modal opened by `WorkView`: [project-showcase](../project-showcase/index.md).
- Shell, `ScrollHint`, scroll-reveal observer (`.reveal`/`.proj-card`/`.skill-card`/
  `.tl-item`/`.process-item`/`.now-card`/`.stats-grid` → `.in`): [app-shell](../app-shell/index.md).
- [Card / Badge / SocialLinks primitives](../../_shared.md#ui-primitives).
- [Accessibility & reduced-motion conventions](../../_shared.md#accessibility--reduced-motion) —
  single `<h1>` (Hero name); each other view leads with `<h2>` `.section-title`;
  role rotor is `aria-live="polite"`.

## Changelog

- 2026-06-02 · doc-optimizer upgrade — feature doc created from `components.md`,
  `data-flow.md`, and the Atelier Terminal UI design record.
