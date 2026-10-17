import type { Request } from "../request";
import type { LLMResponse } from "@dns-markdown/types/responses";

export const createLLMApi = (request: Request) => ({
  // The API expects the links as one JSON-encoded query param
  compareProducts: (links: string[]) =>
    request.get<LLMResponse>("/api/llm/compare-products", { links: JSON.stringify(links) }),
  describeProduct: (link: string) => request.get<LLMResponse>("/api/llm/describe-product", { link })
});
