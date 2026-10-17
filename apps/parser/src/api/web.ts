import { webClient } from "./client";

export const clearWebCache = async (tag: string): Promise<null> => {
  await webClient.post("/api/revalidate", { tag });
  return null;
};
