---
epic: 08
slug: deployment
title: "Deployment Pipeline"
description: "This epic automates the end-to-end build and publish cycle for the portfolio."
issue:
pr: 21
delivery: pr
---
# Epic 08: Deployment Pipeline

## Description

This epic automates the end-to-end build and publish cycle for the portfolio. A single `git push origin main` must trigger a GitHub Actions workflow that installs dependencies, compiles the static site with Vite, and publishes the resulting `dist/` directory to GitHub Pages — with no manual steps after the one-time repository configuration.

The two stories in this epic are tightly sequenced: the workflow file must exist and be confirmed working before the README can accurately document the live URL and the every-deploy flow. Together they deliver a fully operational continuous deployment pipeline and the human-readable runbook that lets any contributor understand and reproduce the deployment without prior context.

Beyond automation, this epic ensures deployment correctness: the `base: '/'` path set in Epic 01 must match the user-page target (`ckandrinirina.github.io`), concurrency is controlled so overlapping pushes cannot produce a partially deployed state, and the live URL is surfaced in the Actions run summary for immediate verification.

## Goals

- Automate the build and publish cycle so that every push to `main` deploys the latest portfolio to GitHub Pages.
- Prevent overlapping deployments with a concurrency group that cancels in-progress runs.
- Expose the deployed page URL in the Actions run summary after each successful deploy.
- Document the one-time repository setup and the every-deploy flow so any contributor can onboard without additional guidance.

## Scope

### In Scope

- `.github/workflows/deploy.yml` with a `build` job (checkout, Node 20, npm ci, npm run build, configure-pages, upload-pages-artifact) and a `deploy` job (needs build, github-pages environment, deploy-pages).
- Workflow triggers: push to `main` and `workflow_dispatch`.
- Permissions block: `contents: read`, `pages: write`, `id-token: write`.
- Concurrency group `pages` with `cancel-in-progress: true`.
- `README.md` covering project intro, local dev commands, one-time GitHub Pages setup instructions, and the every-deploy flow.

### Out of Scope

- Custom domain configuration (can be added later as a GitHub Pages CNAME setting).
- Staging or preview deployments on pull requests.
- Visitor analytics or monitoring integrations.
- Any changes to application source code, components, or content modules.
- Lighthouse CI integration in the workflow (covered by Epic 09).

## Dependencies

- **Depends on:** Epic 01 story 01-05 (correct `base: '/'` and build scripts), Epic 06 story 06-09 (working app compiles without errors)
- **Blocks:** Epic 09 story 09-05 (Lighthouse audit runs against the live/preview build published by this epic)

## Acceptance Criteria

- [ ] Pushing a commit to `main` automatically triggers the workflow and the site is live at `https://ckandrinirina.github.io/` within minutes.
- [ ] The Actions run summary displays the deployed page URL after a successful run.
- [ ] A second push while a deploy is in progress cancels the earlier run; only the latest commit is deployed.
- [ ] `workflow_dispatch` allows a manual re-deploy from the Actions tab without a new commit.
- [ ] `README.md` documents all local dev commands, the one-time Pages setup steps, and the every-deploy flow.

## Technical Notes

- The workflow uses only the auto-provided `GITHUB_TOKEN`; no repository secrets need to be created.
- The `id-token: write` permission is required for OIDC-based deployment authentication used by `actions/deploy-pages@v4`.
- For a GitHub user page (`ckandrinirina.github.io`), the repository must be named exactly `ckandrinirina.github.io` and `vite.config.ts` `base` must be `'/'`. A project-page deployment would require `base: '/<repo-name>/'`.
- The one-time Pages configuration (Settings → Pages → Source = GitHub Actions) must be applied before the first workflow run; the workflow will fail with a Pages 404 error if this setting is not set.
- Node 20 LTS is pinned in the workflow via `node-version: 20`; the `npm` cache is enabled on `actions/setup-node@v4` to speed up subsequent runs.
