import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import path from "path";

import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  stories: ["../app/**/*.mdx", "../app/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
    "@storybook/addon-docs"
  ],
  framework: "@storybook/nextjs-vite",
  async viteFinal(config) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        mongoose: path.resolve(__dirname, "mock-backend-module.ts"),
        "@clerk/nextjs/server": path.resolve(__dirname, "mock-backend-module.ts")
      };
    }

    return config;
  }
};
export default config;
