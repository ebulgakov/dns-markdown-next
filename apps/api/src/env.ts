import * as dotenv from "dotenv";
import { z } from "zod";

export const isProd = () => process.env.NODE_ENV === "production";
export const isDev = () => process.env.NODE_ENV === "development";
export const isTestEnv = () => process.env.NODE_ENV === "test";

if (isDev()) {
  dotenv.config({ path: ".env.development" });
} else if (isTestEnv()) {
  dotenv.config({ path: ".env.test" });
} else if (isProd()) {
  dotenv.config({ path: ".env.production" });
}

const envSchema = z.object({
  OTEL_SERVICE_NAME: z.string().default("Dns-Markdown-API"),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().startsWith("https://"),
  OTEL_EXPORTER_OTLP_HEADERS: z.string().default(""),
  OTEL_METRICS_EXPORTER: z.string().default(""),
  OTEL_SERVICE_VERSION: z.string().default("1.0.0"),
  CLERK_PUBLISHABLE_KEY: z
    .string()
    .min(10, "CLERK_PUBLISHABLE_KEY must be at least 10 characters long"),
  CLERK_SECRET_KEY: z.string().min(10, "CLERK_SECRET_KEY must be at least 10 characters long"),
  CLERK_WEBHOOK_SIGNING_SECRET: z
    .string()
    .min(10, "CLERK_WEBHOOK_SIGNING_SECRET must be at least 10 characters long"),
  CITY: z.string().default("samara"),
  PORT: z.string().default("4000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().startsWith("mongodb"),

  // Auth
  API_SECRET_KEY: z.string().min(10, "API_SECRET_KEY must be at least 10 characters long"),
  API_SERVICE_KEY: z.string().min(10, "API_SERVICE_KEY must be at least 10 characters long"),

  // AI
  OPENAI_API_KEY: z.string().min(10, "OPENAI_API_KEY must be at least 10 characters long"),
  UPSTASH_VECTOR_REST_URL: z.string().startsWith("https://"),
  UPSTASH_VECTOR_REST_TOKEN: z
    .string()
    .min(10, "UPSTASH_VECTOR_REST_TOKEN must be at least 10 characters long"),

  // Upstash Redis
  CACHE_PREFIX: z.string().default(""),
  UPSTASH_REDIS_REST_URL: z.string().startsWith("https://"),
  UPSTASH_REDIS_REST_TOKEN: z
    .string()
    .min(10, "UPSTASH_REDIS_REST_TOKEN must be at least 10 characters long"),

  // CORS
  CORS_ORIGIN: z
    .string()
    .or(z.array(z.string()))
    .transform(val => {
      if (typeof val === "string") {
        return val.split(",").map(origin => origin.trim());
      }
      return val;
    })
    .default([])
});

export type Env = z.infer<typeof envSchema>;

let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  console.error("⚠️  Environment variable validation error:", process.env);
  if (error instanceof z.ZodError) {
    console.error("❌ Invalid environment variables:");
    const { fieldErrors } = z.flattenError(error);
    console.error(JSON.stringify(fieldErrors, null, 2));

    // More detailed error messages
    error.issues.forEach(err => {
      const path = err.path.join(".");
      console.error(`  ${path}: ${err.message}`);
    });

    process.exit(1);
  }
  console.error(error);
  throw error;
}

export { env };
