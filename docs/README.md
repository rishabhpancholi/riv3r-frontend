# RIV3R Frontend

RIV3R is a Next.js frontend for onboarding organizations and resources,
cookie-based authentication, and verification-aware account entry.

For implementation facts read `TRUTH.md`; for the code map read
`STRUCTURE.md`; for repository history read `CHANGELOG.md`.

## Requirements

- Node.js 22 (the version used by CI)
- npm
- A compatible RIV3R backend, normally available at `http://localhost:8000`

## Install and run

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

For a production-style local run:

```bash
npm run build
npm start
```

`npm start` requires a successful build first.

## Environment variables

The repository includes a local `.env` with the development default below.
Change the value for your environment, and do not commit secrets.

| Variable | Scope | Default | Meaning |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Browser | `http://localhost:8000/api` | Complete backend API base URL used by Axios. |

Local configuration:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

The browser calls this URL directly with credentials. The backend must allow the
frontend origin (normally `http://localhost:3000`) and credentialed CORS
requests. Do not put secrets in this variable because `NEXT_PUBLIC_*` values are
included in browser code.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Create a production build and perform Next.js/TypeScript checks. |
| `npm start` | Serve the existing production build. |
| `npm test` | Run all Vitest tests once. |

There is currently no lint command or watch-mode test command.

## Development checklist

1. Read `../AGENTS.md` and the relevant docs before editing.
2. Keep API calls and contracts in `src/lib` and validation in
   `src/lib/schemas.ts`.
3. Check affected UI at narrow mobile and desktop widths, including loading,
   error, disabled, and keyboard-focus states.
4. Run `npm test` and `npm run build`.
5. Update project docs and add a changelog entry when behavior or structure
   changes.

## CI

`.github/workflows/ci.yml` runs on every pull request and pushes to `main`. It
installs dependencies with `npm ci` on Node 22 and runs `npm test`. A local
production build is still required because CI does not currently build.
