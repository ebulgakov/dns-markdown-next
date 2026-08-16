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
            { find: "@/services/post", replacement: path.resolve(dirname, "./src/entities/user/api/post") },
            { find: "@/services/user", replacement: path.resolve(dirname, "./src/entities/user/api/user") },
            { find: "@/services/guest", replacement: path.resolve(dirname, "./src/entities/user/api/guest") },
            { find: "@/types/user", replacement: path.resolve(dirname, "./src/entities/user/model/user") },
            {
              find: "@/app/contexts/user-context",
              replacement: path.resolve(dirname, "./src/entities/user/model/user-context")
            },
            { find: "@/services/get", replacement: path.resolve(dirname, "./src/entities/product/api/get") },
            {
              find: "@/types/product",
              replacement: path.resolve(dirname, "./src/entities/product/model/product")
            },
            {
              find: "@/types/pricelist",
              replacement: path.resolve(dirname, "./src/entities/product/model/pricelist")
            },
            {
              find: "@/app/stores/pricelist-store",
              replacement: path.resolve(dirname, "./src/entities/product/model/pricelist-store")
            },
            {
              find: "@/app/components/product-card",
              replacement: path.resolve(dirname, "./src/entities/product/ui")
            },
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
