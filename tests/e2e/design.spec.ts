import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const publicRoutes = [
  { path: "/", heading: "Better work starts" },
  { path: "/login", heading: "Log in to RIV3R" },
  { path: "/onboarding", heading: "How will you use RIV3R?" },
  { path: "/onboarding/organization", heading: "Create your organization profile" },
  { path: "/onboarding/resource", heading: "Create your professional profile" },
  { path: "/missing-page", heading: "This page has drifted away." },
];

test.beforeEach(async ({ page }) => {
  await page.route("**/api/auth/me", route => route.fulfill({ status: 401, contentType: "application/json", body: "{}" }));
  await page.route("**/api/auth/refresh", route => route.fulfill({ status: 401, contentType: "application/json", body: "{}" }));
});

for (const route of publicRoutes) {
  test(`${route.path} is responsive and accessible`, async ({ page }) => {
    await page.goto(route.path);
    await expect(page.getByRole("heading", { name: new RegExp(route.heading) })).toBeVisible({ timeout: 20_000 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBe(false);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}

test("login exposes inline validation", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Log In" }).click();
  await expect(page.getByText("Email is required")).toBeVisible();
});

const authenticatedUser = {
  id: "user-1",
  email: "alex@example.com",
  name: "Alex Morgan",
  verification_status: "approved",
  is_resource: false,
  account_role: "client",
  permissions: ["projects.read", "projects.create"],
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

test("authenticated project routes provide project navigation", async ({ page }) => {
  await page.route("**/api/auth/me", route => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(authenticatedUser) }));
  await page.goto("/projects");
  await expect(page.getByRole("heading", { name: "Projects", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Dashboard" }).first()).toHaveAttribute("href", "/");
  await expect(page.getByRole("link", { name: "Create project" }).first()).toHaveAttribute("href", "/projects/create");
});

test("account menu logs out and redirects to login", async ({ page }) => {
  await page.route("**/api/auth/me", route => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(authenticatedUser) }));
  let logoutCalled = false;
  await page.route("**/api/auth/logout", route => { logoutCalled = true; return route.fulfill({ status: 204 }); });
  await page.goto("/projects");
  await page.getByRole("button", { name: "Open account menu" }).click();
  await page.getByRole("menuitem", { name: "Log out" }).click();
  await expect(page).toHaveURL(/\/login$/);
  expect(logoutCalled).toBe(true);
});

for (const account of [
  { label: "agency", account_role: "agency", is_resource: false },
  { label: "resource", account_role: "resource", is_resource: true },
] as const) {
  test(`${account.label} accounts do not receive project access`, async ({ page }) => {
    const deniedUser = { ...authenticatedUser, ...account, permissions: [] };
    await page.route("**/api/auth/me", route => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(deniedUser) }));
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Projects" })).toHaveCount(0);
    await page.goto("/projects");
    await expect(page.getByRole("heading", { name: "Projects aren’t available for this account." })).toBeVisible();
    await expect(page.getByRole("link", { name: /Create project/ })).toHaveCount(0);
  });
}

test("read-only project access hides and blocks project creation", async ({ page }) => {
  const readOnlyUser = { ...authenticatedUser, permissions: ["projects.read"] };
  await page.route("**/api/auth/me", route => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(readOnlyUser) }));
  await page.goto("/projects");
  await expect(page.getByRole("heading", { name: "Projects", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: /Create project/ })).toHaveCount(0);
  await page.goto("/projects/create");
  await expect(page.getByRole("heading", { name: "Projects aren’t available for this account." })).toBeVisible();
});

test("project routes redirect guests to login", async ({ page }) => {
  await page.goto("/projects");
  await expect(page).toHaveURL(/\/login$/);
});
