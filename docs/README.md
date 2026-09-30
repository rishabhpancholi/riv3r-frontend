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

The repository includes a local `.env` with the development defaults below.
Change the values for your environment, and do not commit secrets.

| Variable | Scope | Default | Meaning |
| --- | --- | --- | --- |
| `BACKEND_API_URL` | Next.js server/config | `http://localhost:8000` | Backend origin used by the API rewrite. Do not include the API path. |
| `NEXT_PUBLIC_API_URL` | Browser and Next.js config | `/api` | Relative API path used by Axios and appended to the backend origin by the rewrite. |

Local configuration:

```dotenv
BACKEND_API_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=/api
```

The browser sends credentialed requests to the relative API path. For example,
`/api/auth/login` is rewritten to
`http://localhost:8000/api/auth/login`. Keep `NEXT_PUBLIC_API_URL` relative;
put the protocol and host only in `BACKEND_API_URL`.

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
