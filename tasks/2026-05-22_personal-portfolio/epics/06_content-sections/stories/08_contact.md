---
id: 06-08
title: "Contact section"
epic: 06
status: done
size: M
blocked_by: ["04-05", "02-10"]
files: ["src/components/sections/Contact.tsx"]
issue:
pr:
delivery:
prior_status:
---
# Story 06-08: Contact section

> **Epic:** Content Sections
> **Size:** M
## Description

Implement `src/components/sections/Contact.tsx`, the contact section. Per the key design
decision in spec §4, this section uses **direct links only** — no contact form, no input
elements. It renders an email `mailto:` link, a WhatsApp `wa.me` link, GitHub and
LinkedIn links via the `SocialLinks` component, and the owner's location as plain text
(city and country only). The section uses the shared `Section` wrapper with `id="contact"`.
All outbound links open in a new tab with `rel="noopener noreferrer"`. The full street
address is never shown.

## Acceptance Criteria

- [x] The component renders inside a `<section id="contact">` (provided by the `Section` wrapper).
- [x] An `<h2>` heading is rendered by the `Section` wrapper with the locale-appropriate label (e.g. "Contact").
- [x] An email link is present: `<a href="mailto:ckandrinirina@gmail.com">` with the address visible as link text or alongside a label.
- [x] A WhatsApp link is present: `<a href="https://wa.me/261385096664">` with a human-readable label (e.g. "+261 38 50 966 64" or "WhatsApp").
- [x] `SocialLinks` renders GitHub and LinkedIn icon links.
- [x] The location text "Antananarivo, Madagascar" appears — city and country only; the full street address is absent.
- [x] The component contains **no** `<form>`, `<input>`, `<textarea>`, or `<button type="submit">` elements.
- [x] All outbound links (WhatsApp, GitHub, LinkedIn) have `target="_blank"` and `rel="noopener noreferrer"`.
- [x] The email mailto link does not need `target="_blank"` (it opens the mail client, not a new tab).
- [x] The section renders correctly in both French and English; any surrounding labels or call-to-action text are locale-aware.
- [x] No TypeScript errors on `npm run build`.

## Technical Notes

- Email and WhatsApp contact details should be sourced from `src/lib/constants.ts` (e.g. `CONTACT.email`, `CONTACT.whatsApp`) to keep them in a single place; do not hard-code them inline in the component.
- `SocialLinks` from Epic 02 (story 02-10) reads GitHub and LinkedIn URLs from `src/lib/constants.ts` internally — just render `<SocialLinks />` (optionally with a `size` prop).
- The WhatsApp number format for `wa.me`: no spaces, no `+`, no dashes — `261385096664`. The display text may be formatted as "+261 38 50 966 64" for readability.
- Locale-aware text: any intro copy ("Reach me at:", "Get in touch", "Contactez-moi", etc.) must come from `t()` or the UI labels, not from hard-coded strings.
- Privacy check: review the rendered output before marking the story done — confirm the full street address from the original CV is nowhere in the DOM.

## Files to Create/Modify

| Action | File Path                             | Purpose                           |
| ------ | ------------------------------------- | --------------------------------- |
| CREATE | `src/components/sections/Contact.tsx` | Direct-links-only contact section |

## Dependencies

- **Blocked by:** 04-05 (LanguageProvider — `useLanguage()` must exist), 02-10 (SocialLinks).
- **Blocks:** 06-09 (wire sections into App).

## Related

- **Epic:** content-sections
- **Related stories:** 06-01 (Hero — also uses SocialLinks), 06-09 (App wiring)
- **Spec reference:** spec §5.7 (Contact), §4 (direct links only), §7 (privacy — no full address, WhatsApp number intentionally public)

## Implementation Plan

- [x] Write failing tests (`Contact.test.tsx`) covering all acceptance criteria
- [x] Implement `Contact.tsx` using `Section` wrapper, `useLanguage()`, `SITE_META`, and `SocialLinks`
- [x] Refactor for SOLID compliance and code clarity
- [x] QA: run full test suite, verify acceptance criteria, build check

## Implementation Summary

**Status:** DONE

### What was built

`Contact.tsx` — a direct-links-only contact section. Uses the `Section` wrapper (id="contact", h2 heading), reads locale-aware `content.contact.intro` and `content.contact.location` via `useLanguage()`, and renders:
- An email `mailto:` link (`SITE_META.email`) — no `target="_blank"` (opens mail client)
- A WhatsApp `wa.me` link (`SITE_META.whatsapp`) with `target="_blank" rel="noopener noreferrer"` and formatted display text "+261 38 50 966 64"
- `<SocialLinks />` for GitHub and LinkedIn icon links
- Location text "Antananarivo, Madagascar" (city + country only; no full address)
- No form, input, or submit elements

Contact details sourced from `SITE_META` in `lib/constants.ts` (single source of truth).

### Files Touched

| Action | File | Lines |
|--------|------|-------|
| CREATED | `src/components/sections/Contact.tsx` | 64 lines |
| CREATED | `src/components/sections/Contact.test.tsx` | 101 lines |

### Test Results

- 11 new tests written and passing
- 340 total tests across 26 test files — all passing
- `npm run build` passes with no TypeScript errors
