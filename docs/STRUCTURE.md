# Repository Structure

Last verified on 2026-09-30.

## Top level

```text
.
|-- .github/workflows/ci.yml    # Node 22 test workflow
|-- docs/                       # Maintained project context
|-- src/
|   |-- app/                    # Next.js App Router routes and global CSS
|   |-- components/             # Domain-oriented UI components
|   `-- lib/                    # API clients, contracts, and schemas
|-- tests/                      # Vitest API-wrapper tests
|-- next.config.ts              # React Compiler and backend API rewrite
|-- package.json                # Dependencies and npm commands
|-- tsconfig.json               # Strict TS and @/* alias
|-- vitest.config.ts            # Node test environment and alias
`-- playwright.config.ts        # Mobile/desktop browser test configuration
```

Generated directories such as `.next/` and `node_modules/` are not source and
must not be edited.

## App Router

```text
src/app/
|-- layout.tsx                         # Metadata, global CSS, ToastProvider
|-- page.tsx                           # Guest landing + SessionCheck
|-- login/page.tsx                     # LoginScreen route
|-- onboarding/page.tsx                # Role selection
|-- onboarding/organization/page.tsx   # Organization form route
|-- onboarding/resource/page.tsx       # Resource form route
|-- client/projects/page.tsx           # Client project empty state
|-- client/projects/create/page.tsx    # Client project creation placeholder
|-- not-found.tsx                      # App Router 404 entry
|-- errors/NotFound.tsx                # 404 presentation
`-- globals.css                        # Tailwind import, loader/editor CSS
```

Route files stay thin. Interactive behavior belongs in client components under
`src/components`; reusable requests and contracts belong in `src/lib`.

## Components by domain

- `auth/`
  - `SessionProvider.tsx` keeps the verified user in memory and refreshes the
    server session periodically and on focus/visibility changes.
  - `SessionCheck.tsx` owns initial session restoration on `/`.
  - `Riv3rLoader.tsx` is used for initial/direct session restoration, not normal
    route transitions.
  - `RouteTransitionLoader.tsx` provides a timed route overlay but is currently
    unused.
- `dashboard/DashboardView.tsx` renders approved, pending, and rejected user
  states. `dashboard/AppShell.tsx` owns Dashboard/Projects navigation and the
  logout account menu.
- `client/projects/` supplies the client-scoped, permission-protected project
  list and create-placeholder views.
- `login/`
  - `LoginScreen.tsx` supplies the page shell.
  - `LoginForm.tsx` owns validation, login, local lockout, toast, and redirect.
- `onboarding/`
  - The organization and resource form components own field-to-payload mapping.
  - `FormControls.tsx`, `PasswordField.tsx`, and `SkillsInput.tsx` are shared
    onboarding controls.
- `tiptap/RichTextEditor.tsx` is the controlled rich-text bio editor.
- `toast/` mounts `react-hot-toast` and supplies branded success/error content.
- `ui/` contains the shared logo, header, button, card, and badge primitives.
- `onboarding/OnboardingShell.tsx` provides the shared branded two-step form
  frame.

## Library layer

- `src/lib/axios.ts`: configured Axios instance plus normalized error and 401
  helpers.
- `src/lib/auth.ts`: `User` contract and login/me/refresh/logout calls.
- `src/lib/access-control.ts`: account-role and permission types, route policies,
  permission helpers, and the declarative workspace navigation registry.
- `src/lib/onboarding.ts`: organization/resource payload contracts and POST
  wrappers.
- `src/lib/schemas.ts`: Zod schemas, inferred form types, and shared password
  rules.

Dependency direction should remain:

```text
route -> feature component -> schema/API wrapper -> shared Axios client
                         \-> shared UI component
```

Do not import page components into the library layer or make raw Axios calls in
routes/forms when a domain wrapper can express the contract.

## Main flows

### Session flow

```text
GET /auth/me
|-- user -> DashboardView -> verification-specific state
`-- 401 -> POST /auth/refresh -> GET /auth/me
          |-- user -> DashboardView
          `-- failure -> guest landing (initial check) or /login (expired user)
```

### Form flow

```text
user input
-> React Hook Form
-> Zod schema
-> form-to-API normalization (trim, null, phone prefix, numeric conversion)
-> src/lib API wrapper
-> shared Axios client
-> toast
-> redirect to /
```

## Where changes belong

| Change | Primary location | Also review |
| --- | --- | --- |
| New route | `src/app/<route>/page.tsx` | navigation, auth behavior, 404, docs |
| Form field/rule | `src/lib/schemas.ts` and feature form | payload interface, backend contract, tests |
| API endpoint/shape | `src/lib/*.ts` | callers, mocks/tests, `docs/TRUTH.md` |
| Shared visual pattern | relevant `src/components` domain | mobile states, accessibility, consistency |
| Global styling/animation | `src/app/globals.css` | reduced motion and all consumers |
| Session behavior | `src/components/auth/SessionCheck.tsx` | login flow, backend cookie contract, tests |
| Dependency or command | `package.json` and lockfile | CI and `docs/README.md` |

## Tests

`tests/auth.test.ts`, `tests/onboarding.test.ts`, and
`tests/access-control.test.ts` cover request contracts, payload mapping, and the
role/permission matrix. The API tests cover request paths, payload
forwarding, successful return values, and propagated failures. Add focused tests
beside this pattern for library logic. `tests/e2e/design.spec.ts` uses Playwright
and axe to cover every public route at mobile and desktop sizes, check horizontal
overflow and accessibility, login validation, permission-filtered navigation,
403 states, project creation access, and logout.
