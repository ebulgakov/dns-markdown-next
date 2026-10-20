import { loadEnv } from '@dns-markdown/env';
import { z } from 'zod';

loadEnv();

const envSchema = z.object({
  CITY: z.string().default('samara'),
  PORT: z.string().default('4000'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  DATABASE_URL: z.string().startsWith('postgresql'),

  // Auth
  API_SECRET_KEY: z
    .string()
    .min(10, 'API_SECRET_KEY must be at least 10 characters long'),
  API_SERVICE_KEY: z
    .string()
    .min(10, 'API_SERVICE_KEY must be at least 10 characters long'),

  // AI
  OPENAI_API_KEY: z
    .string()
    .min(10, 'OPENAI_API_KEY must be at least 10 characters long'),
  UPSTASH_VECTOR_REST_URL: z.string().startsWith('https://'),
  UPSTASH_VECTOR_REST_TOKEN: z
    .string()
    .min(10, 'UPSTASH_VECTOR_REST_TOKEN must be at least 10 characters long'),

  // Upstash Redis
  CACHE_PREFIX: z.string().default(''),
  UPSTASH_REDIS_REST_URL: z.string().startsWith('https://'),
  UPSTASH_REDIS_REST_TOKEN: z
    .string()
    .min(10, 'UPSTASH_REDIS_REST_TOKEN must be at least 10 characters long'),
});

export type Env = z.infer<typeof envSchema>;

let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Invalid environment variables:');
    const { fieldErrors } = z.flattenError(error);
    console.error(JSON.stringify(fieldErrors, null, 2));

    // More detailed error messages
    error.issues.forEach((err) => {
      const path = err.path.join('.');
      console.error(`  ${path}: ${err.message}`);
    });

    process.exit(1);
  }
  console.error(error);
  throw error;
}

export { env };
