import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  use: { baseURL: "http://localhost:3107", trace: "on-first-retry" },
  webServer: { command: "npx next dev -p 3107", url: "http://localhost:3107", reuseExistingServer: false, timeout: 120_000 },
  projects: [
    { name: "mobile-chromium", use: { ...devices["iPhone 13"], browserName: "chromium" } },
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } },
  ],
});
