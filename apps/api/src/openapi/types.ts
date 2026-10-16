import type { ZodObject, ZodRawShape } from "zod";

export type SecuritySchemeName = "clerkAndApiSecret" | "serviceBearer" | "svixWebhook";

export interface RouteDoc {
  method: "get" | "post" | "delete";
  path: string;
  summary: string;
  tags: string[];
  security: SecuritySchemeName[];
  query?: ZodObject<ZodRawShape>;
  params?: ZodObject<ZodRawShape>;
  body?: ZodObject<ZodRawShape>;
  responseDescription?: string;
}
