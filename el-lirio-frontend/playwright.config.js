import { defineConfig, devices } from "@playwright/test";
const startPreview = process.env.PLAYWRIGHT_START_SERVER === "1";
export default defineConfig({
  testDir: "./e2e",
  workers: 1,
  timeout: 45000,
  expect: { timeout: 10000 },
  reporter: [["list"]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || (startPreview ? "http://127.0.0.1:4173" : "http://127.0.0.1:5173"),
    headless: true,
    launchOptions: process.env.PLAYWRIGHT_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH }
      : {},
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: startPreview ? {
    command: "npm run preview -- --host 127.0.0.1 --port 4173 --strictPort",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  } : undefined,
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 } } },
    {
      name: "mobile",
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 1,
      },
    },
    {
      name: "mobile-safari",
      testMatch: "mobile-layout.spec.js",
      use: {
        ...devices["iPhone 17"],
        browserName: "webkit",
        launchOptions: {},
      },
    },
  ],
});
