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
            { find: "@/app/components/ui", replacement: path.resolve(dirname, "./src/shared/ui") },
            {
              find: "@/app/components/page-loader",
              replacement: path.resolve(dirname, "./src/shared/ui/page-loader")
            },
            {
              find: "@/app/components/scroll-to-top",
              replacement: path.resolve(dirname, "./src/shared/ui/scroll-to-top")
            },
            {
              find: "@/app/components/clerk-error",
              replacement: path.resolve(dirname, "./src/shared/ui/clerk-error")
            },
            {
              find: "@/app/components/change-theme-selector",
              replacement: path.resolve(dirname, "./src/shared/ui/change-theme-selector")
            },
            { find: "@/app/lib", replacement: path.resolve(dirname, "./src/shared/lib") },
            { find: "@/services/client", replacement: path.resolve(dirname, "./src/shared/api/client") },
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
