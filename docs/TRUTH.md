# Project Truth

Last verified against `0a349dd` and the working tree on 2026-09-30.

This file records what the RIV3R frontend does now. It is not a roadmap. When a
fact changes, update this file in the same change as the code.

## Product scope

RIV3R currently provides:

- a public landing page with entry points to login and onboarding;
- organization onboarding and individual resource onboarding;
- cookie-based login and session restoration;
- a minimal authenticated dashboard with verification-status states; and
- authenticated project list and create-placeholder routes;
- a branded 404 experience.

There is no full project/resource marketplace or authenticated application
shell in this repository yet.

## Current routes

| Route | Current behavior |
| --- | --- |
| `/` | Shows the landing page to guests. `SessionCheck` replaces it with the dashboard when `/auth/me` returns a user. |
| `/login` | Login form with Zod validation, password visibility, toast feedback, and a client-side five-attempt lockout. |
| `/onboarding` | Lets the visitor choose organization or resource onboarding. |
| `/onboarding/organization` | Creates an organization and its owner. |
| `/onboarding/resource` | Creates an individual resource profile. |
| `/projects` | Shows an authenticated project empty state with a create-project action. |
| `/projects/create` | Shows the authenticated project-creation placeholder. |
| Any unknown route | Uses the custom App Router 404 page. |

The old `/dashboard/[user_id]` route was removed. The dashboard is rendered on
`/` by `SessionCheck`; do not reintroduce URL user IDs without an explicit
product and authorization decision.

## API and environment contract

The shared Axios client lives in `src/lib/axios.ts`:

- browser API path: `NEXT_PUBLIC_API_URL`, falling back to `/api`;
- cookies: `withCredentials: true`;
- request timeout: 15 seconds;
- content type: JSON.

`next.config.ts` uses the same `NEXT_PUBLIC_API_URL` path as the rewrite source
and appends it to `BACKEND_API_URL`. With the defaults, a browser request to
`/api/auth/me` is forwarded to `http://localhost:8000/api/auth/me`. Leading and
trailing slashes are normalized by the rewrite configuration. Keep
`BACKEND_API_URL` server-only and keep `NEXT_PUBLIC_API_URL` as a relative path
such as `/api` so requests remain same-origin and credentialed cookies work.

Implemented endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/auth/login` | Authenticate and return a `User`. |
| `GET` | `/auth/me` | Return the current cookie-authenticated user. |
| `POST` | `/auth/refresh` | Refresh the session cookies; no response body is consumed. |
| `POST` | `/auth/logout` | Clear the access and refresh cookie session. |
| `POST` | `/onboarding/organization` | Create an organization and owner. |
| `POST` | `/onboarding/resource` | Create a resource profile. |

Optional form strings are normalized to `null` before onboarding requests.
Phone numbers are sent as country code plus the 10-digit national number.

## Authentication behavior

- On `/`, `SessionCheck` calls `/auth/me`.
- A 401 triggers one `/auth/refresh` attempt followed by another `/auth/me`.
- A guest remains on the landing page if refresh fails.
- An authenticated user is rechecked every 30 minutes, on window focus, and
  when the document becomes visible.
- If a previously authenticated session can no longer refresh, the user is
  redirected to `/login`.
- Dashboard output depends on `verification_status`: `in_progress`, `rejected`,
  or the approved welcome view.
- The authenticated account menu logs out through `/auth/logout` and redirects
  to `/login`; tokens remain in credentialed browser cookies.
- The root in-memory session provider preserves the verified user across
  authenticated client navigation, avoiding full-screen loaders between the
  dashboard and project routes. Direct protected-route loads still verify the
  cookie session before showing private content.
- Login blocks the current browser for five minutes after five failed attempts.
  The deadline is stored in `localStorage`; this is a UX throttle, not a
  security boundary.

## Validation truth

- Passwords require at least eight characters, uppercase, lowercase, number,
  and a supported special character.
- Organization and owner email addresses must use the same domain.
- Organization type is `client` or `agency`.
- The only phone-country option currently exposed is India (`+91`); the phone
  itself is optional but, when present, must contain exactly 10 digits.
- Resource onboarding requires at least one skill and a non-negative whole-
  number experience value controlled by the UI.
- Portfolio and LinkedIn URLs are optional valid URLs and cannot be identical
  when both are supplied.
- Resource bio is authored as TipTap HTML. The UI enforces a 500-character
  plain-text limit while preserving rich-text markup in the payload.

## UI and responsive constraints

- Styling is Tailwind CSS v4 imported from `src/app/globals.css`.
- The light editorial palette uses warm off-white surfaces, navy text, cobalt
  actions, teal accents, and semantic amber/red status colors.
- Geist and Instrument Serif are self-hosted through `next/font/local`; builds
  do not fetch fonts from an external service.
- Shared UI primitives provide buttons, cards, badges, the RIV3R logo, and
  public headers. Controls have at least 44px targets and visible focus rings.
- Public marketing surfaces do not use decorative glare behind navigation
  actions.
- Layouts are mobile-first and verified without horizontal overflow at 320px.
- The approved dashboard is an honest application shell with coming-soon empty
  states; it does not present unsupported marketplace data.
- All new work must remain usable on narrow screens, with no horizontal
  clipping, unreachable controls, or hover-only behavior.

## Quality and operational truth

- TypeScript runs in strict, no-emit mode and maps `@/*` to `src/*`.
- Tests use Vitest in a Node environment. Current tests mock Axios and cover the
  auth and onboarding API wrapper contracts and error propagation.
- GitHub Actions uses Node 22, `npm ci`, and `npm test` for pushes to `main` and
  pull requests.
- CI does not currently run `npm run build`.
- There is no `lint` script or component-test suite. Playwright and axe provide
  browser-level responsive and accessibility coverage.
- `RouteTransitionLoader` is implemented but not mounted, so route changes do
  not currently use it.
- The root `README.md` is still the create-next-app template; use
  `docs/README.md` for accurate project setup until it is replaced.
