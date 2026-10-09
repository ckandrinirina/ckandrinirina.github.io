---
id: 08-02
title: "README + Pages setup docs"
epic: 08
status: in-progress
size: S
blocked_by: ["08-01"]
files: ["README.md"]
issue:
pr:
delivery:
prior_status:
---
# Story 08-02: README + Pages setup docs

> **Epic:** Deployment Pipeline
> **Size:** S
## Description

Write (or extend) `README.md` at the repository root with a complete project introduction, all local development commands, and the full deployment runbook. The README must cover two deployment concerns that are frequently misunderstood: the one-time GitHub Pages source setting that must be applied before the first workflow run, and the base-path decision that determines whether the site is served as a user page (`'/'`) or a project page (`'/<repo>/'`). After this story any contributor — including the owner returning to the project months later — can clone, develop, and deploy without consulting any other documentation.

## Acceptance Criteria

- [ ] `README.md` exists at the repository root and renders correctly as Markdown on GitHub.
- [ ] The README includes a brief project description that identifies the site as Erick Andrinirina's personal portfolio and mentions the live URL `https://ckandrinirina.github.io/`.
- [ ] The README documents the local development prerequisite (Node.js 20 LTS or newer).
- [ ] The README documents all six npm scripts with their exact commands and a one-line description of each: `dev`, `build`, `preview`, `test`, `lint`, `format`.
- [ ] The README includes a dedicated deployment section that lists the one-time setup steps in order:
  1. Create the GitHub repository named `ckandrinirina.github.io` (for a user page).
  2. Push the code to `main`.
  3. Navigate to repo Settings → Pages → Build and deployment → Source = GitHub Actions.
  4. Confirm `vite.config.ts` `base` is `'/'` for a user page.
- [ ] The README explains the every-deploy flow: `git push origin main` triggers `.github/workflows/deploy.yml`, which builds and publishes the site automatically.
- [ ] The README includes a note explaining the base-path choice: user page (`ckandrinirina.github.io`) uses `base: '/'`; a project page (e.g. `ckandrinirina.github.io/ck-portfolio`) would require `base: '/ck-portfolio/'` in `vite.config.ts`.
- [ ] The README links to the live URL `https://ckandrinirina.github.io/`.
- [ ] The README does not expose the owner's full home address or any other private information.

### Edge Cases

- If `README.md` already exists with partial content from story 01-01 (scaffold generates a default Vite README), the story modifies and extends it rather than replacing it wholesale — preserving any intentional existing content.
- The one-time Pages setup note must make clear that it is genuinely one-time: repeating it on every push is not necessary and does not trigger a re-deploy; only the workflow trigger (push to `main` or `workflow_dispatch`) does.
- The base-path explanation must warn that changing `base` from `'/'` to a repo path also requires updating any absolute asset references in `public/` (e.g. the OG image, CV PDF links) to use `import.meta.env.BASE_URL` rather than a hardcoded `/` prefix.
- The deployed URL `https://ckandrinirina.github.io/` pattern assumes the repository is named `ckandrinirina.github.io`. If the repository name differs, GitHub Pages would serve the site at `https://ckandrinirina.github.io/<repo>/` and the base path must be updated accordingly — the README should note this linkage.

### Test Notes

- Open the rendered `README.md` on the GitHub repository page (after merging) and verify all sections render correctly: headings, code blocks, numbered lists, and the live URL hyperlink.
- Click the live URL link in the README and confirm it opens the portfolio.
- Verify the README does not contain the owner's home address by searching for street/city/postal-code patterns.

## Technical Notes

- Keep the README concise and developer-focused; detailed architectural rationale lives in `docs/architecture/`. The README should link to `docs/architecture/dev-guide.md` for deeper reference rather than duplicating its content.
- Use fenced code blocks (` ```bash `) for all shell commands so they render with syntax highlighting on GitHub.
- The npm scripts section may reference `dev-guide.md §npm scripts` as the authoritative source; the README can present a condensed version.
- Bilingual content (FR/EN) in the site is a runtime concern handled by `LanguageProvider`; the README itself is written in English as it targets contributors and the owner's technical audience.

## Files to Create/Modify

| Action          | File Path   | Purpose                                                                                                    |
| --------------- | ----------- | ---------------------------------------------------------------------------------------------------------- |
| CREATE / MODIFY | `README.md` | Project intro, local dev commands, one-time Pages setup, every-deploy flow, base-path decision explanation |

## Dependencies

- **Blocked by:** 08-01 (workflow must exist and the live URL must be known before documenting it)
- **Blocks:** None

## Related

- **Epic:** 08_deployment
- **Related stories:** 08-01
- **Spec reference:** dev-guide.md §5 Deploy, dev-guide.md §npm scripts, configuration.md §vite.config.ts, configuration.md (Configuration matrix)
