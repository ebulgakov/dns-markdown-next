import path from "node:path";
import { fileURLToPath } from "node:url";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const dirname =
  typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reportsDirectory: "coverage"
    },
    clearMocks: true,

    projects: [
      {
        plugins: [react()],
        test: {
          name: "unit",
          environment: "jsdom",
          include: ["**/*.test.{ts,tsx}"],
          exclude: ["**/node_modules/**", "**/playwright/**", "**/.next/**"],
          alias: [
            { find: "@/shared", replacement: path.resolve(dirname, "./src/shared") },
            { find: "@/entities/user", replacement: path.resolve(dirname, "./src/entities/user") },
            { find: "@/entities/product", replacement: path.resolve(dirname, "./src/entities/product") },
            {
              find: "@/features/favorite-toggle",
              replacement: path.resolve(dirname, "./src/features/favorite-toggle")
            },
            {
              find: "@/features/product-catalog",
              replacement: path.resolve(dirname, "./src/features/product-catalog")
            },
            { find: "@/features/search", replacement: path.resolve(dirname, "./src/features/search") },
            { find: "@/features/sort-goods", replacement: path.resolve(dirname, "./src/features/sort-goods") },
            {
              find: "@/features/jump-to-section",
              replacement: path.resolve(dirname, "./src/features/jump-to-section")
            },
            { find: "@/features/llm-report", replacement: path.resolve(dirname, "./src/features/llm-report") },
            { find: "@/features/change-city", replacement: path.resolve(dirname, "./src/features/change-city") },
            { find: "@/widgets/navbar", replacement: path.resolve(dirname, "./src/widgets/navbar") },
            { find: "@/widgets/footer", replacement: path.resolve(dirname, "./src/widgets/footer") },
            { find: "@", replacement: path.resolve(dirname, "./") }
          ]
        }
      },

      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({ configDir: path.join(dirname, ".storybook") })
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }]
          },
          setupFiles: [".storybook/vitest.setup.ts"]
        }
      }
    ]
  }
});
