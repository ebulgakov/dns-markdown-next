import { z } from "zod";

import type { RouteDoc, SecuritySchemeName } from "./types";
import type { ZodObject, ZodRawShape } from "zod";

const securitySchemes: Record<SecuritySchemeName, object> = {
  clerkAndApiSecret: {
    type: "apiKey",
    in: "header",
    name: "X-Internal-API-Secret",
    description: "Requires an active Clerk session cookie plus this shared secret header."
  },
  serviceBearer: {
    type: "http",
    scheme: "bearer",
    description: "Internal service-to-service token (API_SERVICE_KEY)."
  },
  svixWebhook: {
    type: "apiKey",
    in: "header",
    name: "svix-signature",
    description: "Verified via svix; not usable from Swagger UI's Try it out."
  }
};

function paramsFromZodObject(schema: ZodObject<ZodRawShape>, location: "query" | "path") {
  const jsonSchema = z.toJSONSchema(schema, { target: "openapi-3.0" }) as {
    properties?: Record<string, object>;
    required?: string[];
  };
  const required = new Set(jsonSchema.required ?? []);

  return Object.entries(jsonSchema.properties ?? {}).map(([name, propSchema]) => ({
    name,
    in: location,
    required: location === "path" ? true : required.has(name),
    schema: propSchema
  }));
}

export function buildOpenApiSpec(routes: RouteDoc[]) {
  const paths: Record<string, Record<string, object>> = {};

  for (const route of routes) {
    const parameters = [
      ...(route.params ? paramsFromZodObject(route.params, "path") : []),
      ...(route.query ? paramsFromZodObject(route.query, "query") : [])
    ];

    const requestBody = route.body
      ? {
          required: true,
          content: {
            "application/json": {
              schema: z.toJSONSchema(route.body, { target: "openapi-3.0" })
            }
          }
        }
      : undefined;

    paths[route.path] ??= {};
    paths[route.path]![route.method] = {
      summary: route.summary,
      tags: route.tags,
      security: route.security.map(name => ({ [name]: [] })),
      ...(parameters.length ? { parameters } : {}),
      ...(requestBody ? { requestBody } : {}),
      responses: {
        "200": { description: route.responseDescription ?? "Successful response" },
        "400": { description: "Validation error" }
      }
    };
  }

  return {
    openapi: "3.0.3",
    info: {
      title: "DNS Markdown API",
      version: "1.0.0",
      description: "Generated from zod request schemas. See API.md for auth/CORS/error format."
    },
    components: { securitySchemes },
    paths
  };
}
