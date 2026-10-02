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
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

test("authenticated project routes provide project navigation", async ({ page }) => {
  await page.route("**/api/auth/me", route => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(authenticatedUser) }));
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Welcome, Alex/ })).toBeVisible();
  await page.getByRole("link", { name: "Projects" }).first().click();
  await expect(page.getByRole("heading", { name: "Projects", exact: true })).toBeVisible();
  await expect(page.getByLabel("Loading RIV3R")).toHaveCount(0);
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
