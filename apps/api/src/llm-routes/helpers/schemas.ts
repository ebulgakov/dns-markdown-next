import { z } from "zod";

import type { RouteDoc } from "@src/openapi/types";

export const compareProductsQuerySchema = z.object({
  links: z
    .string()
    .min(1)
    .transform((val, ctx) => {
      try {
        return decodeURIComponent(val);
      } catch {
        ctx.addIssue({ code: "custom", message: "Malformed 'links' query parameter" });
        return z.NEVER;
      }
    })
    .transform((val, ctx) => {
      try {
        return JSON.parse(val) as unknown;
      } catch {
        ctx.addIssue({ code: "custom", message: "Input must be a JSON array of strings" });
        return z.NEVER;
      }
    })
    .pipe(
      z
        .array(z.string())
        .min(2, "At least two product links are required for comparison (max five)")
        .max(5, "At least two product links are required for comparison (max five)")
    )
});

export const describeProductQuerySchema = z.object({
  link: z
    .string()
    .min(1)
    .transform((val, ctx) => {
      try {
        return decodeURIComponent(val);
      } catch {
        ctx.addIssue({ code: "custom", message: "Malformed 'link' query parameter" });
        return z.NEVER;
      }
    })
});

export const llmRouteDocs: RouteDoc[] = [
  {
    method: "get",
    path: "/api/llm/compare-products",
    summary: "Compare 2-5 products via an LLM-generated report",
    tags: ["LLM"],
    security: ["clerkAndApiSecret"],
    query: z.object({
      links: z
        .string()
        .describe(
          "URL-encoded JSON array of 2-5 product links, e.g. " +
            "links=%5B%22https%3A%2F%2Fexample.com%2Fa%22%2C%22https%3A%2F%2Fexample.com%2Fb%22%5D"
        )
    })
  },
  {
    method: "get",
    path: "/api/llm/describe-product",
    summary: "Describe a product via an LLM-generated report",
    tags: ["LLM"],
    security: ["clerkAndApiSecret"],
    query: z.object({
      link: z.string().describe("URL-encoded product link, e.g. link=https%3A%2F%2Fexample.com%2Fa")
    })
  }
];
