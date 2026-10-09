---
id: 08-01
title: "GitHub Actions Pages workflow"
epic: 08
status: in-progress
size: M
blocked_by: ["01-05", "06-09"]
files: [.github/workflows/deploy.yml, package-lock.json, package.json, src/test/deploy-workflow.test.ts]
issue:
pr:
delivery:
prior_status:
---
# Story 08-01: GitHub Actions Pages workflow

> **Epic:** Deployment Pipeline
> **Size:** M
## Description

Create `.github/workflows/deploy.yml` to automate the full build-and-publish cycle for the portfolio. The workflow must run on every push to `main` (and on manual `workflow_dispatch`) and execute two sequential jobs: a `build` job that installs dependencies, compiles the static site, and uploads the Pages artifact; and a `deploy` job that publishes the artifact to GitHub Pages and exposes the live URL in the run summary. A concurrency group prevents overlapping deploys so a rapid second push never produces a partially deployed state.

This story is the core automation deliverable of the project. Once merged, every subsequent content change or feature push reaches the live site at `https://ckandrinirina.github.io/` with no manual intervention.

## Acceptance Criteria

- [x] `.github/workflows/deploy.yml` exists at the repository root and is valid YAML that GitHub Actions parses without syntax errors.
- [x] The workflow triggers on `push` to the `main` branch.
- [x] The workflow triggers on `workflow_dispatch`, allowing a manual re-deploy from the GitHub Actions tab without a new commit.
- [x] `permissions` block at workflow level specifies exactly: `contents: read`, `pages: write`, `id-token: write`.
- [x] `concurrency` block specifies `group: pages` and `cancel-in-progress: true`; a second push while a deploy is in progress cancels the earlier run and only the latest commit is deployed.
- [x] The `build` job runs on `ubuntu-latest`.
- [x] The `build` job checks out the repository with `actions/checkout@v4`.
- [x] The `build` job sets up Node 20 with `actions/setup-node@v4` and enables the `npm` cache.
- [x] The `build` job runs `npm ci` (clean, reproducible install) — not `npm install`.
- [x] The `build` job runs `npm run build`, which executes `tsc -b && vite build` and emits `dist/` without errors.
- [x] The `build` job runs `actions/configure-pages@v5` to prepare the Pages environment.
- [x] The `build` job uploads the Pages artifact using `actions/upload-pages-artifact@v3` with `path: ./dist`.
- [x] The `deploy` job declares `needs: build` and only runs after the `build` job succeeds.
- [x] The `deploy` job targets the `github-pages` environment with `url: ${{ steps.deployment.outputs.page_url }}`.
- [x] The `deploy` job runs `actions/deploy-pages@v4` and the step has `id: deployment`.
- [ ] After a successful run, the Actions run summary displays the live page URL (`https://ckandrinirina.github.io/`).
- [ ] The live site correctly serves the portfolio (no 404 for `index.html`, JS bundles, or CSS); asset URLs are rooted at `/` matching `base: '/'` in `vite.config.ts`.

### Edge Cases

- If `vite.config.ts` `base` were changed to a repo sub-path (e.g. `/ck-portfolio/`), all asset URLs in `dist/` would change and the workflow would publish correctly to a project page — but the `deploy.yml` file itself requires no changes; only `vite.config.ts` would change. The current value `'/'` is correct for the user page and must not be altered.
- A push while a previous deploy job is in the `deploy` phase (not just `build`) must still be cancelled by the concurrency guard. Confirm `cancel-in-progress: true` is at the workflow level (not per-job) so it applies to both jobs.
- If the one-time Pages source setting (Settings → Pages → Source = GitHub Actions) has not been applied, the `deploy-pages` step will fail with a 404 or permissions error. This is a prerequisite documented in story 08-02, not a workflow bug.
- `npm run build` calls `tsc -b` before `vite build`; any TypeScript errors introduced before this story is implemented will surface here and must be resolved in the relevant story before this workflow can pass.
- The CV PDF (`public/cv/erick-andrinirina-cv.pdf`, story 07-01) is copied into `dist/cv/` by Vite at build time. If the file is absent, the build still succeeds but the CV download link returns 404 on the live site. A post-deploy smoke-test should verify the CV URL responds with 200.

### Test Notes

- Confirm end-to-end by pushing a trivial commit (e.g. whitespace change in `README.md`) to `main` and observing the Actions run in the GitHub UI. Both jobs must show green, and clicking the summary URL must open the live portfolio.
- Verify the concurrency guard by pushing two commits in rapid succession; only the second run should complete the `deploy` job.
- Manually trigger `workflow_dispatch` from the GitHub Actions tab and confirm it produces a successful deploy.
- Verify the deployed site serves `https://ckandrinirina.github.io/` and that asset paths in the rendered HTML are rooted at `/` (inspect page source).

## Technical Notes

- Use the official GitHub-maintained actions at the pinned major versions specified: `checkout@v4`, `setup-node@v4`, `configure-pages@v5`, `upload-pages-artifact@v3`, `deploy-pages@v4`. These are the versions documented in `configuration.md §deploy.yml`.
- The `id-token: write` permission is required for the OIDC token used by `deploy-pages@v4` to authenticate with GitHub Pages. Without it the deploy step fails with a 403.
- `actions/configure-pages@v5` sets environment variables consumed by `upload-pages-artifact@v3` and must run before the upload step.
- No repository secrets need to be created; `GITHUB_TOKEN` is provided automatically by GitHub Actions and is sufficient for Pages deployment.
- The `deploy` job's `environment.url` field wires the page URL into the GitHub deployment environment UI and the run summary. The URL is read from `steps.deployment.outputs.page_url`, which is set by `actions/deploy-pages@v4`.

## Files to Create/Modify

| Action | File Path                      | Purpose                                                        |
| ------ | ------------------------------ | -------------------------------------------------------------- |
| CREATE | `.github/workflows/deploy.yml` | Full build-and-deploy GitHub Actions workflow for GitHub Pages |

## Dependencies

- **Blocked by:** 01-05 (correct `base: '/'` and build scripts verified), 06-09 (complete application compiles without TypeScript or build errors)
- **Blocks:** 08-02 (README documents the live URL and workflow), 09-05 (Lighthouse audit targets the live site published by this workflow)

## Related

- **Epic:** 08_deployment
- **Related stories:** 01-05, 06-09, 08-02, 09-05
- **Spec reference:** configuration.md §deploy.yml, configuration.md (Configuration matrix), overview.md §Build & deploy pipeline

## Unplanned Changes

- package.json — added `yaml` devDependency — parse the workflow in its structural test (ships its own types, unlike transitive `js-yaml`)
- package-lock.json — lockfile entry for `yaml` — keeps `npm ci` reproducible

---

## Implementation Summary

**Completed:** 2026-10-09
**TDD Iterations:** 1
**QA Iterations:** 1
**Manual-test bugs:** none
**Tests written:** 8
**Files created:** 2
**Files modified:** 2
**Unplanned changes:** 2

### What Was Implemented

`.github/workflows/deploy.yml` with a `build` job (checkout, Node 20 with npm cache, `npm ci`, `npm run build`, configure-pages, upload-pages-artifact) and a `deploy` job (`needs: build`, `github-pages` environment, deploy-pages with `id: deployment`). Workflow-level triggers (push to `main`, `workflow_dispatch`), minimal permissions and a `pages` concurrency group. `src/test/deploy-workflow.test.ts` asserts the parsed structure.

### Not verified locally

The run-summary URL and the live site serving criteria need a real deploy, which requires the repo rename and Settings -> Pages -> Source = GitHub Actions. Local `npm run build` is green and `dist/` references assets rooted at `/`.
