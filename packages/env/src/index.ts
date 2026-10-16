import { existsSync } from "node:fs";
import path from "node:path";

import * as dotenv from "dotenv";

const MODES = ["development", "test", "production"];

// Destructured on purpose: `bun build` inlines a literal `process.env.NODE_ENV` at build time
// ("development" without --production), destructuring keeps it a runtime read
const nodeEnv = () => {
  const { NODE_ENV } = process.env;
  return NODE_ENV;
};

export const isProd = () => nodeEnv() === "production";
export const isDev = () => nodeEnv() === "development";
export const isTestEnv = () => nodeEnv() === "test";

// Monorepo root = the closest parent dir with bun.lock. Resolved from this file rather than cwd,
// so it works the same from sources and from a bundled dist/.
const findWorkspaceRoot = (from: string) => {
  let dir = from;
  while (!existsSync(path.join(dir, "bun.lock"))) {
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
  return dir;
};

// Loads env files shared by all workspaces from the monorepo root: `.env.<NODE_ENV>` first,
// then the common `.env` (dotenv never overrides already set variables, so the mode file wins).
// Missing files are skipped silently: in production (Vercel, Fly) variables come from the
// platform, not from files. Validation stays in each app's own schema.
export const loadEnv = () => {
  const workspaceRoot = findWorkspaceRoot(import.meta.dirname);
  if (!workspaceRoot) return;

  const mode = nodeEnv();
  if (mode && MODES.includes(mode)) {
    dotenv.config({ path: path.join(workspaceRoot, `.env.${mode}`), quiet: true });
  }
  dotenv.config({ path: path.join(workspaceRoot, ".env"), quiet: true });
};
