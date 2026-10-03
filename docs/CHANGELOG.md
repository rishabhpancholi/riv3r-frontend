# Changelog

This changelog was reconstructed from the complete Git history on 2026-09-30.
It describes meaningful source changes rather than lockfile churn. Dates are
commit dates in repository history.

## Unreleased

### Design

- Rebuilt the landing, authentication, onboarding, dashboard, loading, toast,
  and 404 experiences around an editorial SaaS design system with semantic
  Tailwind tokens and self-hosted Geist and Instrument Serif fonts.
- Added shared visual primitives, improved mobile form sizing and semantics,
  bio character feedback, and verification-aware dashboard states.
- Replaced the animated landing split-screen with a complete product narrative
  and removed the typewriter dependency.
- Simplified the RIV3R wordmark, clarified the public Get started action, and
  added Dashboard/Projects workspace navigation with protected project routes.
- Removed the landing-header glare and route-level branded loading screen; an
  in-memory session provider now keeps authenticated navigation immediate.

### Authentication

- Added a user account dropdown that calls the credentialed `/auth/logout`
  endpoint and redirects successful logouts to `/login`.
- Added server-authoritative account roles and permissions, centralized access
  policies, permission-filtered navigation, fail-closed project guards, and a
  dedicated 403 state.
- Switched the identity contract to backend-provided `org_type` and
  `permissions`, moved project routes to `/client/projects`, and limited project
  visibility and creation to clients with `projects.view` and
  `projects.create` respectively.
- Moved periodic, focus, and visibility session refresh into the root provider
  so permission changes update navigation and protected screens without reloads.

### Testing

- Added Playwright and axe coverage for public routes at mobile and desktop
  viewports, including accessibility, overflow, and login validation checks.

### Configuration

- Added a local `.env` containing the single server-only `BACKEND_API_URL`.
- Configured Axios to use the fixed same-origin `/api` path and Next.js to
  forward it to the complete backend API URL without exposing an environment
  variable to browser code.

### Documentation

- Replaced the empty/root backend-oriented agent placeholder with frontend-
  specific working rules.
- Added maintained project truth, structure, setup, and history documents under
  `docs/`.

## 2026-09-30 — Onboarding UI refinement (`0a349dd`)

### Added

- Added Radix UI and replaced the organization-type native select with an
  accessible Radix Select.
- Added the production `npm start` command.

### Changed

- Reworked both onboarding forms into a compact two-column layout at `lg` and
  retained a single-column layout below it.
- Reduced form control, card, editor, toolbar, and spacing dimensions so the
  onboarding flows fit more comfortably on screen.
- Changed password-rule feedback to a responsive grid.

## 2026-08-16 — Onboarding and supporting pages (`b5ee4f5`)

### Added

- Added organization and resource onboarding routes, forms, Zod validation,
  API wrappers, and tests.
- Added reusable onboarding controls for errors, passwords, and skills.
- Added a TipTap rich-text editor for resource biographies.
- Added role selection at `/onboarding` and a branded custom 404 page.
- Added a route-transition loader component.
- Expanded the dashboard with pending and rejected verification states and an
  admin contact link.

### Changed

- Moved the typewriter component into its own domain directory.
- Added redirect loading states and navigation between login/onboarding flows.
- Extended the user contract with `is_resource` and optional organization/owner
  fields.

## 2026-08-15 — Tests, CI, and session refactor (`f56cfda`)

### Added

- Added Vitest configuration and auth API-wrapper tests.
- Added GitHub Actions CI using Node 22, `npm ci`, and `npm test`.
- Added the branded full-screen loader, `SessionCheck`, `LoginScreen`, and the
  initial `DashboardView`.

### Changed

- Replaced the dedicated dynamic dashboard route and `SessionHeartbeat` with
  session detection on `/`: authenticated users see dashboard content there,
  while guests see the landing page.
- Added session refresh/retry, periodic checks, focus/visibility checks, and
  redirect handling for expired authenticated sessions.
- Added initial-load and route-transition animation styles.

### Removed

- Removed `/dashboard/[user_id]`, its dashboard layout, and the original
  `SessionHeartbeat` component.

## 2026-08-12 — Initial frontend (`1adf879`)

### Added

- Bootstrapped the Next.js App Router application with React, TypeScript,
  Tailwind CSS, the React Compiler, and the `@/*` source alias.
- Added the RIV3R landing page and animated taglines.
- Added login UI, Zod validation, Axios auth functions, toast notifications,
  local failed-attempt lockout, and authenticated session heartbeat behavior.
- Added the initial dynamic dashboard route and placeholder onboarding page.
- Added the `/api/:path*` backend rewrite with a localhost backend default.
