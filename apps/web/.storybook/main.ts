import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import path from "path";

import { mswWorkerPlugin } from "./msw-worker-plugin";

import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  stories: [
    "../app/**/*.mdx",
    "../app/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
    "@storybook/addon-docs",
    "msw-storybook-addon"
  ],
  framework: "@storybook/nextjs-vite",
  async viteFinal(config) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        mongoose: path.resolve(__dirname, "mock-backend-module.ts"),
        "@clerk/nextjs/server": path.resolve(__dirname, "mock-backend-module.ts"),
        "@/shared/config": path.resolve(__dirname, "mock-env-module.ts")
      };
    }

    config.plugins = [...(config.plugins ?? []), mswWorkerPlugin()];

    return config;
  }
};
export default config;
