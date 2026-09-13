import { defineConfig, devices } from "@playwright/test";

const production = process.env.SITE_TEST_PRODUCTION === "true";

const isCI = process.env.CI === "true";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://127.0.0.1:3107",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "Desktop Chrome",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],
  webServer: {
    command: production
      ? "npm start"
      : "npm run dev -- --host 127.0.0.1 --port 3107 --strictPort",
    env: { PORT: "3107" },
    url: "http://127.0.0.1:3107",
    reuseExistingServer: false,
  },
});
