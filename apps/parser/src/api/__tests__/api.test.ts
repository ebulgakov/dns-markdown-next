import { apiPost, resetMocks, webPost } from "@src/__tests__/setup";
import { beforeEach, describe, expect, spyOn, test } from "bun:test";

import { api } from "../client";
import { clearWebCache } from "../web";

describe("api", () => {
  beforeEach(() => {
    resetMocks();
  });

  test("clearWebCache posts the tag to the web app revalidate endpoint", async () => {
    await clearWebCache("daily-data");

    expect(webPost).toHaveBeenCalledWith("/api/revalidate", { tag: "daily-data" });
    expect(apiPost).not.toHaveBeenCalled();
  });

  test("logs and rethrows client errors", async () => {
    const error = spyOn(console, "error").mockImplementation(() => {});
    apiPost.mockImplementation(async () => {
      throw new Error("Network down");
    });

    await expect(api.service.deleteOldPriceLists("samara")).rejects.toThrow("Network down");
    expect(error).toHaveBeenCalledWith(
      "Error fetching data from /service/delete-old-price-lists:",
      expect.any(Error)
    );
    error.mockRestore();
  });
});
