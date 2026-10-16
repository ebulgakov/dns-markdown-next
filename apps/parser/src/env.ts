import { loadEnv } from "@dns-markdown/env";
import { z } from "zod";

loadEnv();

const envSchema = z.object({
  // Set by the `start` script (overrides the API's PORT from the shared .env)
  PORT: z.string().default("3100"),

  // API (apps/api)
  API_URL: z.string().startsWith("http"),
  API_SECRET_KEY: z.string().min(10, "API_SECRET_KEY must be at least 10 characters long"),
  API_SERVICE_KEY: z.string().min(10, "API_SERVICE_KEY must be at least 10 characters long"),

  // Web app cache revalidation
  WEB_URL: z.string().startsWith("http"),
  WEBHOOK_SECRET_KEY: z.string().min(1),

  // Upstash Vector
  UPSTASH_VECTOR_REST_URL: z.string().startsWith("https://"),
  UPSTASH_VECTOR_REST_TOKEN: z
    .string()
    .min(10, "UPSTASH_VECTOR_REST_TOKEN must be at least 10 characters long"),

  // Email
  RESEND_API_KEY: z.string().min(1),

  // Pipeline stage options, set by the package.json scripts.
  // CITY has no default on purpose: every stage throws "No city found" without it.
  CITY: z.string().optional(),
  WRITE_STRATEGY: z.enum(["insert", "replace"]).default("insert"),
  KEYS: z.string().default("daily:*")
});

export type Env = z.infer<typeof envSchema>;

let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error("❌ Invalid environment variables:");
    error.issues.forEach(err => {
      console.error(`  ${err.path.join(".")}: ${err.message}`);
    });
    process.exit(1);
  }
  throw error;
}

export { env };
