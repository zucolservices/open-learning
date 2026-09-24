import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  use: { baseURL: "http://localhost:3100" },
  webServer: {
    command: "pnpm build && pnpm dlx serve@14 out -l 3100",
    url: "http://localhost:3100",
    timeout: 180_000,
    reuseExistingServer: !process.env.CI,
  },
});
