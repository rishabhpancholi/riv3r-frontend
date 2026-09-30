# RIV3R Frontend Agent Guide

These instructions apply to every task in this repository. This is the RIV3R
web frontend, built with Next.js App Router, React, TypeScript, and Tailwind CSS.

## Required context before edits

Before changing application code, tests, configuration, CI, dependencies, or
documentation:

1. Read `docs/TRUTH.md` completely for current behavior, contracts, constraints,
   and known limitations.
2. Read `docs/STRUCTURE.md` for routes, components, libraries, tests, and data
   flow.
3. Read `docs/README.md` for setup, environment variables, and commands.
4. Read `docs/CHANGELOG.md` when the task depends on repository history.
5. Inspect the affected source files. Documentation guides the work, but the
   current code is the final evidence of implemented behavior.

If documentation and code disagree, verify the behavior in code, correct the
documentation in the same change, and report any unresolved contract ambiguity.

## Frontend constraints

### Responsive behavior

- Design mobile-first, then verify the existing `sm`, `md`, and `lg` layouts.
- Do not add fixed widths that overflow narrow screens. Prefer `w-full` with an
  appropriate `max-w-*` constraint and responsive padding.
- Keep controls reachable without horizontal scrolling or hover-only behavior.
- When changing a screen, check loading, error, disabled, empty, authenticated,
  and unauthenticated states that the change can affect.

### Visual consistency

- Preserve the established RIV3R language: white/zinc and pale-blue surfaces,
  blue text and borders, rounded cards, restrained shadows, Lucide icons, and
  the sky-to-pink brand gradient.
- Reuse existing components and Tailwind class patterns before creating new
  variants. Extract a shared primitive when a pattern starts repeating.
- Keep onboarding controls consistent through `FieldError`, `fieldClasses`,
  `PasswordField`, and `SkillsInput` where applicable.
- Reuse the branded toast helpers and `Riv3rLoader` for matching feedback and
  full-screen loading states.

### Accessibility

- Use semantic elements and associate every form control with a visible label.
- Preserve keyboard access, visible focus states, meaningful button text, and
  useful `aria-label` or `aria-invalid` attributes.
- Do not communicate status or validation through color alone.
- Internal navigation uses Next.js `Link`; external links opened in a new tab
  must retain safe `rel` attributes.

### Application boundaries

- Pages in `src/app` should stay thin. Put interactive feature behavior in
  domain components under `src/components`.
- Pages are server components by default. Add `"use client"` only when browser
  state, effects, navigation hooks, or interactive libraries require it.
- Keep API access and response contracts in `src/lib`, not inline in pages or
  presentation components.
- Use the shared Axios client and preserve `withCredentials: true`. Convert
  failures to user-facing messages through `getErrorMessage`.
- Keep validation centralized in `src/lib/schemas.ts` and use React Hook Form
  with the Zod resolver for forms.
- Normalize form values at the API boundary. Continue converting blank optional
  strings to `null`, joining phone country codes correctly, and converting
  numeric strings where the backend payload requires numbers.

### Authentication and security

- Do not weaken the existing session flow: initial `/auth/me`, one refresh
  attempt after a 401, credentialed cookies, periodic/focus/visibility checks,
  and redirect to `/login` when an authenticated session expires.
- Treat the login form's local five-attempt lockout as a UX throttle, not a
  security control.
- Never expose server configuration through `NEXT_PUBLIC_*` variables. The
  server-only `BACKEND_API_URL` supplies the complete backend API URL, while
  browser requests use the same-origin `/api` rewrite.
- Do not introduce user identifiers in route URLs or trust client-provided
  authorization state without an explicit product and backend-contract change.

## Code conventions

- TypeScript is strict. Prefer `.ts` and `.tsx` for new files and use the `@/*`
  alias for imports from `src`.
- Keep components small and grouped by domain under `src/components/<domain>`.
- Use the interfaces in `src/lib/auth.ts` and `src/lib/onboarding.ts` as the
  frontend API contracts. Update their tests and `docs/TRUTH.md` together when
  those contracts change.
- Use programmatic `useRouter` navigation only when a user action or completed
  asynchronous flow requires it.
- Preserve the App Router and Tailwind v4 setup unless a requested architectural
  change explicitly requires otherwise.
- Avoid unrelated reformatting, dependency replacement, and lockfile churn.

## Validation and testing

- Add or update tests for changed API wrappers and non-trivial library logic.
- Run `npm test` after relevant changes.
- Run `npm run build` to validate the production bundle and TypeScript.
- There is currently no lint script, component-test suite, or end-to-end suite;
  do not claim those checks passed.
- On Windows PowerShell environments where `npm.ps1` is blocked, use
  `npm.cmd test` and `npm.cmd run build`.

## Keep documentation synchronized

Review the documentation after every meaningful change and update only the files
affected:

- `docs/TRUTH.md`: current behavior, business rules, API/session contracts,
  responsive constraints, and known limitations.
- `docs/STRUCTURE.md`: routes, directories, component responsibilities, data
  flow, and test organization.
- `docs/README.md`: setup, commands, dependencies, environment variables, and
  operational instructions.
- `docs/CHANGELOG.md`: a concise dated or Unreleased entry for meaningful
  behavior, structure, dependency, or documentation changes.

Documentation must describe the resulting implementation, not planned future
behavior. Before handoff, state which documentation files changed or confirm
that none required an update.

## Definition of done

- The requested behavior is implemented without breaking established contracts.
- Affected screens work at narrow mobile and desktop widths without clipping or
  overflow.
- Accessibility and relevant UI states have been considered.
- `npm test` and `npm run build` pass, or the exact pre-existing/environmental
  blocker is reported.
- Relevant documentation matches the resulting code.
