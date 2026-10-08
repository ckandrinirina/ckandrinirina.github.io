---
id: 09-04
title: "Privacy Verification"
epic: 09
status: todo
size: S
blocked_by: ["06-09"]
files: ["scripts/check-privacy.sh", "package.json", ".github/workflows/deploy.yml"]
issue:
pr:
delivery:
prior_status:
---
# Story 09-04: Privacy Verification

> **Epic:** Quality, Accessibility & Performance
> **Size:** S
## Description

Verify that the full home street address from Erick's CV is never present in
the built site output, and add an automated guard that enforces this invariant
going forward. Only "Antananarivo, Madagascar" may appear as a location
reference. Email and WhatsApp number are intentionally public and must not be
flagged.

The guard should be a script runnable via `npm run check:privacy` that greps
the contents of `dist/` for known street-address fragments and exits non-zero
if any are found, so the check can block a CI deploy if the address is
accidentally re-introduced.

## Acceptance Criteria

- [ ] A full-text search of every file in `dist/` (HTML, JS chunks, CSS,
      inlined SVGs, any JSON assets) returns no matches for the street-address
      fragments from the CV (specific fragment list defined in the script based on
      the actual address known to the developer — not stored in this file per the
      privacy policy).
- [ ] The location text visible on the page is exactly "Antananarivo, Madagascar"
      (city and country only) in both French and English locales — not a street
      name, district, postal code, or other sub-city detail.
- [ ] The email address (`ckandrinirina@gmail.com`) and WhatsApp number
      (`+261385096664` or equivalent formatted form) are present in the built
      output — confirming those intentionally public details are not accidentally
      stripped.
- [ ] A script at `scripts/check-privacy.sh` (or equivalent `scripts/check-privacy.js`)
      accepts a path argument (defaulting to `./dist`) and:
  - Exits `0` if no address fragments are found.
  - Exits `1` and prints the matching file(s) and line(s) if any fragment is
    found.
- [ ] `package.json` includes a `check:privacy` script that runs the guard
      against `./dist`.
- [ ] The GitHub Actions deploy workflow runs `npm run check:privacy` after
      `npm run build` and before uploading the Pages artifact, so a leak blocks
      the deploy.
- [ ] Manual check noted: if a CV PDF is present at `public/cv/`, the developer
      has manually confirmed that the PDF's embedded text metadata does not contain
      the street address (this is a one-time human check and does not need to be
      automated, but the result should be noted in a comment in the workflow or
      script).

## Technical Notes

- The street-address fragments to search for are known to the developer from
  the physical CV. They should be stored only inside the guard script itself
  (not in any documentation file, for privacy). The script should search for
  at least: the street/lot number, the district or quartier name, and the postal
  code if present on the CV.
- Shell script approach (simple, no Node dependency):
  ```sh
  #!/usr/bin/env sh
  DIST="${1:-./dist}"
  # Patterns are stored only here, not in docs
  if grep -rq "FRAGMENT_1\|FRAGMENT_2\|FRAGMENT_3" "$DIST"; then
    echo "PRIVACY VIOLATION: street address found in dist/"
    grep -rn "FRAGMENT_1\|FRAGMENT_2\|FRAGMENT_3" "$DIST"
    exit 1
  fi
  echo "Privacy check passed."
  exit 0
  ```
- Node/JS approach alternative: use a `.js` script with `fs.readdirSync` +
  `String.prototype.includes` for cross-platform compatibility (Windows CI).
- The GitHub Actions workflow file is likely at `.github/workflows/deploy.yml`.
  The check step should be inserted after the `npm run build` step:
  ```yaml
  - name: Check privacy (no street address in dist)
    run: npm run check:privacy
  ```
- Edge case — minified JS: Vite minifies JS in the production build, but string
  literals from content modules are not obfuscated. A grep for the literal
  address string will match even inside a minified bundle. Verify this by
  temporarily including a known string in `dist/` during development and
  confirming the script catches it.
- Edge case — source maps: if source maps are generated for production (they
  should not be by default), they may embed original source including content
  strings. Confirm `vite.config.ts` has `build.sourcemap: false` (the default)
  or that the privacy check also scans `.map` files.

## Files to Create/Modify

| Action | File Path                      | Purpose                                                                  |
| ------ | ------------------------------ | ------------------------------------------------------------------------ |
| CREATE | `scripts/check-privacy.sh`     | Guard script; greps dist/ for address fragments; exits non-zero on match |
| MODIFY | `package.json`                 | Add `"check:privacy": "sh scripts/check-privacy.sh"` to scripts          |
| MODIFY | `.github/workflows/deploy.yml` | Add privacy-check step after build, before artifact upload               |

## Dependencies

- **Blocked by:** Story 06-09 (assembled site must exist to have a dist/ to scan)
- **Blocks:** None

## Related

- **Epic:** quality-a11y-perf
- **Related stories:** 09-05 (Lighthouse audit — runs after build, so privacy
  check is in place before auditing the deployed URL)
- **Spec reference:** `docs/specs/2026-05-22_personal-portfolio/pre-spec.md` §7
  Privacy & confidentiality rules; `docs/architecture/overview.md`
  §Non-functional requirements (Privacy); `docs/architecture/dev-guide.md`
  §Definition of done
