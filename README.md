# ck-portfolio

Erick Andrinirina's personal portfolio — a static, bilingual (French by default,
English on demand) single-page site with four themes, built as the "Atelier
Terminal" UI.

**Live site:** [https://ckandrinirina.github.io/](https://ckandrinirina.github.io/)

Stack: Vite 7 · React 19 · TypeScript · Tailwind CSS v4 · Vitest. No backend,
no database, no runtime environment variables — everything is built at compile
time and served by GitHub Pages.

Architecture notes live in [`docs/architecture/`](docs/architecture/README.md);
the developer reference is
[`docs/architecture/dev-guide.md`](docs/architecture/dev-guide.md).

## Prerequisites

- Node.js 20 LTS or newer (npm 10+ ships with it)
- Git

## Local development

```bash
npm ci          # install the locked dependencies
npm run dev     # start the dev server with HMR at http://localhost:5173
```

### npm scripts

| Script                  | Command                                 | What it does                                                    |
| ----------------------- | --------------------------------------- | --------------------------------------------------------------- |
| `npm run dev`           | `vite`                                  | Dev server with hot module replacement                          |
| `npm run build`         | `tsc -b && vite build`                  | Type-check, then produce the static site in `dist/`             |
| `npm run preview`       | `vite preview`                          | Serve `dist/` locally to verify the production build            |
| `npm run test`          | `vitest`                                | Run the test suite in watch mode (`npm run test -- --run` once) |
| `npm run lint`          | `eslint .`                              | Lint the whole project                                          |
| `npm run format`        | `prettier --write .`                    | Format every file with Prettier                                 |
| `npm run check:privacy` | `node scripts/check-privacy.mjs ./dist` | Scan `dist/` for address leaks; needs a prior `npm run build`   |

`npm run build` is preceded by a `prebuild` hook (`node scripts/check-assets.mjs`)
that verifies the required `public/` assets exist before building.

## Deployment (GitHub Pages)

The site is published at [https://ckandrinirina.github.io/](https://ckandrinirina.github.io/)
as a **user page**: the repository is named `ckandrinirina.github.io`, so GitHub
serves it from the domain root.

### One-time setup

These steps are done once, when the repository is created. Repeating them on
later pushes is unnecessary and does not trigger a deploy — only the workflow
trigger below does.

1. Create the GitHub repository named `ckandrinirina.github.io` (a user page).
2. Push the code to `main`.
3. In the repository, open **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**.
4. Confirm `vite.config.ts` has `base` set to `'/'` (the user-page value).

### Every deploy

```bash
git push origin main   # triggers .github/workflows/deploy.yml
```

Pushing to `main` runs `.github/workflows/deploy.yml`, which:

1. checks out the code and installs Node 20 with the npm cache,
2. runs `npm ci` then `npm run build` (type-check + Vite build to `dist/`),
3. runs `npm run check:privacy` on `dist/`, which reads the `PRIVACY_FRAGMENTS`
   Actions secret (or `scripts/privacy-fragments.local` when run locally), so a
   leak fails the deploy before anything is uploaded,
4. uploads `dist/` as the Pages artifact and publishes it with
   `actions/deploy-pages`.

The workflow can also be started by hand from the **Actions** tab
(`workflow_dispatch`). A newer push cancels an in-flight deploy (`concurrency:
pages`), so a rapid second push never leaves a half-published site. The live
URL appears in the run summary of the `deploy` job.

### Base path: user page vs project page

`base` in `vite.config.ts` must match where GitHub Pages serves the site, or
every asset 404s:

| Deployment   | Repository name           | Served at                                       | `vite.config.ts`         |
| ------------ | ------------------------- | ----------------------------------------------- | ------------------------ |
| User page    | `ckandrinirina.github.io` | `https://ckandrinirina.github.io/`              | `base: '/'` (current)    |
| Project page | e.g. `ck-portfolio`       | `https://ckandrinirina.github.io/ck-portfolio/` | `base: '/ck-portfolio/'` |

The live URL therefore follows the repository name. If the repository is ever
renamed to something other than `ckandrinirina.github.io`, GitHub Pages serves
it at `https://ckandrinirina.github.io/<repo>/` and `base` must be updated to
`'/<repo>/'`.

Changing `base` away from `'/'` also means any absolute reference to a file in
`public/` (the OG image in `index.html`, the CV PDF link, `sitemap.xml`
entries) must be built from `import.meta.env.BASE_URL` rather than a hardcoded
`/` prefix, otherwise those links break on the project-page URL.
