import "server-only";

import { z } from "zod";

// Next.js loads apps/web/.env* itself (not @dns-markdown/env). Server-only:
// these are secrets, never import this module from a client component.
// NEXT_PUBLIC_* vars are inlined by Next at build time and stay on process.env.
const envSchema = z.object({
  // API (apps/api)
  API_URL: z.string().startsWith("http"),
  API_SECRET_KEY: z.string().min(10, "API_SECRET_KEY must be at least 10 characters long"),

  // Cache revalidation webhook (called by apps/parser)
  WEBHOOK_SECRET_KEY: z.string().min(1),

  // Guest storage (Upstash Redis)
  UPSTASH_REDIS_REST_URL: z.string().startsWith("https://"),
  UPSTASH_REDIS_REST_TOKEN: z
    .string()
    .min(10, "UPSTASH_REDIS_REST_TOKEN must be at least 10 characters long"),

  // City for guests and users without one
  DEFAULT_CITY: z.string().min(1),

  // Google Analytics, disabled when unset
  GA_ID: z.string().optional()
});

export type Env = z.infer<typeof envSchema>;

// `next build` imports server modules to collect page data, and CI builds run
// without the full runtime env: warn there, fail everywhere else.
const isBuild = process.env.NEXT_PHASE === "phase-production-build";

const parseEnv = (): Env => {
  const result = envSchema.safeParse(process.env);
  if (result.success) return result.data;

  const details = result.error.issues
    .map(issue => `  ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");

  if (isBuild) {
    console.warn(`⚠️ Invalid environment variables (ignored during build):\n${details}`);
    return process.env as unknown as Env;
  }

  console.log(process.env);

  // No process.exit here: Next.js reports the thrown error on the first request
  throw new Error(`❌ Invalid environment variables:\n${details}`);
};

export const env = parseEnv();
