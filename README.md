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

| Script            | Command                | What it does                                                    |
| ----------------- | ---------------------- | --------------------------------------------------------------- |
| `npm run dev`     | `vite`                 | Dev server with hot module replacement                          |
| `npm run build`   | `tsc -b && vite build` | Type-check, then produce the static site in `dist/`             |
| `npm run preview` | `vite preview`         | Serve `dist/` locally to verify the production build            |
| `npm run test`    | `vitest`               | Run the test suite in watch mode (`npm run test -- --run` once) |
| `npm run lint`    | `eslint .`             | Lint the whole project                                          |
| `npm run format`  | `prettier --write .`   | Format every file with Prettier                                 |

`npm run build` is preceded by a `prebuild` hook (`node scripts/check-assets.mjs`)
that verifies the required `public/` assets exist before building.
