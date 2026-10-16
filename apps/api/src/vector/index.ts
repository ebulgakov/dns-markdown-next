import { env } from "@src/env.ts";
import { Index } from "@upstash/vector";

import type { Goods } from "@dns-markdown/db/types/pricelist";

const vector = new Index({
  url: env.UPSTASH_VECTOR_REST_URL,
  token: env.UPSTASH_VECTOR_REST_TOKEN
});

const getVectorItemsByIds = async (
  ids: string[]
): Promise<
  {
    id: string;
    metadata: Goods;
  }[]
> => {
  // @ts-expect-error - Upstash Vector REST API does not currently support TypeScript types for the fetch method with includeMetadata option
  return vector.fetch({ ids, includeMetadata: true });
};

export { getVectorItemsByIds };
