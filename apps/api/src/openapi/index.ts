import { analysisRouteDocs } from "@src/analysis-routes/helpers/schemas";
import { llmRouteDocs } from "@src/llm-routes/helpers/schemas";
import { pricelistRouteDocs } from "@src/pricelist-routes/helpers/schemas";
import { productsRouteDocs } from "@src/products-routes/helpers/schemas";
import { serviceRouteDocs } from "@src/service-routes/helpers/schemas";
import { userRouteDocs } from "@src/user-routes/helpers/schemas";

import { buildOpenApiSpec } from "./build-spec";

import type { RouteDoc } from "./types";

const clerkRouteDocs: RouteDoc[] = [
  {
    method: "post",
    path: "/clerk/create-user",
    summary: "Clerk user.created webhook (svix-signed)",
    tags: ["Clerk"],
    security: ["svixWebhook"]
  }
];

const allRouteDocs = [
  ...pricelistRouteDocs,
  ...productsRouteDocs,
  ...analysisRouteDocs,
  ...llmRouteDocs,
  ...userRouteDocs,
  ...serviceRouteDocs,
  ...clerkRouteDocs
];

export const openApiSpec = buildOpenApiSpec(allRouteDocs);
