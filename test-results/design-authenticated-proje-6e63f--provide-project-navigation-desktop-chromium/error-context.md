# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: design.spec.ts >> authenticated project routes provide project navigation
- Location: tests\e2e\design.spec.ts:47:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Projects', exact: true })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('heading', { name: 'Projects', exact: true }) with timeout 5000ms
  - waiting for getByRole('heading', { name: 'Projects', exact: true })

```

```yaml
- main:
  - link "RIV3R home":
    - /url: /
    - text: RIV3R
  - button "Open account menu":
    - paragraph: Alex Morgan
    - paragraph: alex@example.com
  - complementary:
    - navigation "Workspace":
      - link "Dashboard":
        - /url: /
      - link "Projects":
        - /url: /projects
  - text: Verified profile
  - heading "Welcome, Alex." [level=1]
  - paragraph: Your RIV3R workspace is ready for what comes next.
  - heading "Manage your work from one place." [level=2]
  - paragraph: Projects are available from your workspace navigation. Create and organize client work as the project experience expands.
  - paragraph: Projects
  - paragraph: Available in your workspace navigation
  - paragraph: Account
  - paragraph: Profile type
  - paragraph: Client
  - paragraph: Email
  - paragraph: alex@example.com
  - paragraph: Verification
  - paragraph: Approved
- alert
```

# Test source

```ts
  1  | import AxeBuilder from "@axe-core/playwright";
  2  | import { expect, test } from "@playwright/test";
  3  | 
  4  | const publicRoutes = [
  5  |   { path: "/", heading: "Better work starts" },
  6  |   { path: "/login", heading: "Log in to RIV3R" },
  7  |   { path: "/onboarding", heading: "How will you use RIV3R?" },
  8  |   { path: "/onboarding/organization", heading: "Create your organization profile" },
  9  |   { path: "/onboarding/resource", heading: "Create your professional profile" },
  10 |   { path: "/missing-page", heading: "This page has drifted away." },
  11 | ];
  12 | 
  13 | test.beforeEach(async ({ page }) => {
  14 |   await page.route("**/api/auth/me", route => route.fulfill({ status: 401, contentType: "application/json", body: "{}" }));
  15 |   await page.route("**/api/auth/refresh", route => route.fulfill({ status: 401, contentType: "application/json", body: "{}" }));
  16 | });
  17 | 
  18 | for (const route of publicRoutes) {
  19 |   test(`${route.path} is responsive and accessible`, async ({ page }) => {
  20 |     await page.goto(route.path);
  21 |     await expect(page.getByRole("heading", { name: new RegExp(route.heading) })).toBeVisible({ timeout: 20_000 });
  22 |     const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  23 |     expect(overflow).toBe(false);
  24 |     const results = await new AxeBuilder({ page }).analyze();
  25 |     expect(results.violations).toEqual([]);
  26 |   });
  27 | }
  28 | 
  29 | test("login exposes inline validation", async ({ page }) => {
  30 |   await page.goto("/login");
  31 |   await page.getByRole("button", { name: "Log In" }).click();
  32 |   await expect(page.getByText("Email is required")).toBeVisible();
  33 | });
  34 | 
  35 | const authenticatedUser = {
  36 |   id: "user-1",
  37 |   email: "alex@example.com",
  38 |   name: "Alex Morgan",
  39 |   verification_status: "approved",
  40 |   is_resource: false,
  41 |   account_role: "client",
  42 |   permissions: ["projects.read", "projects.create"],
  43 |   created_at: "2026-01-01T00:00:00Z",
  44 |   updated_at: "2026-01-01T00:00:00Z",
  45 | };
  46 | 
  47 | test("authenticated project routes provide project navigation", async ({ page }) => {
  48 |   await page.route("**/api/auth/me", route => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(authenticatedUser) }));
  49 |   await page.goto("/");
  50 |   await expect(page.getByRole("heading", { name: /Welcome, Alex/ })).toBeVisible();
  51 |   await page.getByRole("link", { name: "Projects" }).first().click();
> 52 |   await expect(page.getByRole("heading", { name: "Projects", exact: true })).toBeVisible();
     |                                                                              ^ Error: expect(locator).toBeVisible() failed
  53 |   await expect(page.getByLabel("Loading RIV3R")).toHaveCount(0);
  54 |   await expect(page.getByRole("link", { name: "Dashboard" }).first()).toHaveAttribute("href", "/");
  55 |   await expect(page.getByRole("link", { name: "Create project" }).first()).toHaveAttribute("href", "/projects/create");
  56 | });
  57 | 
  58 | test("account menu logs out and redirects to login", async ({ page }) => {
  59 |   await page.route("**/api/auth/me", route => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(authenticatedUser) }));
  60 |   let logoutCalled = false;
  61 |   await page.route("**/api/auth/logout", route => { logoutCalled = true; return route.fulfill({ status: 204 }); });
  62 |   await page.goto("/projects");
  63 |   await page.getByRole("button", { name: "Open account menu" }).click();
  64 |   await page.getByRole("menuitem", { name: "Log out" }).click();
  65 |   await expect(page).toHaveURL(/\/login$/);
  66 |   expect(logoutCalled).toBe(true);
  67 | });
  68 | 
  69 | for (const account of [
  70 |   { label: "agency", account_role: "agency", is_resource: false },
  71 |   { label: "resource", account_role: "resource", is_resource: true },
  72 | ] as const) {
  73 |   test(`${account.label} accounts do not receive project access`, async ({ page }) => {
  74 |     const deniedUser = { ...authenticatedUser, ...account, permissions: [] };
  75 |     await page.route("**/api/auth/me", route => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(deniedUser) }));
  76 |     await page.goto("/");
  77 |     await expect(page.getByRole("link", { name: "Projects" })).toHaveCount(0);
  78 |     await page.goto("/projects");
  79 |     await expect(page.getByRole("heading", { name: "Projects aren’t available for this account." })).toBeVisible();
  80 |     await expect(page.getByRole("link", { name: /Create project/ })).toHaveCount(0);
  81 |   });
  82 | }
  83 | 
  84 | test("read-only project access hides and blocks project creation", async ({ page }) => {
  85 |   const readOnlyUser = { ...authenticatedUser, permissions: ["projects.read"] };
  86 |   await page.route("**/api/auth/me", route => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(readOnlyUser) }));
  87 |   await page.goto("/projects");
  88 |   await expect(page.getByRole("heading", { name: "Projects", exact: true })).toBeVisible();
  89 |   await expect(page.getByRole("link", { name: /Create project/ })).toHaveCount(0);
  90 |   await page.goto("/projects/create");
  91 |   await expect(page.getByRole("heading", { name: "Projects aren’t available for this account." })).toBeVisible();
  92 | });
  93 | 
  94 | test("project routes redirect guests to login", async ({ page }) => {
  95 |   await page.goto("/projects");
  96 |   await expect(page).toHaveURL(/\/login$/);
  97 | });
  98 | 
```
