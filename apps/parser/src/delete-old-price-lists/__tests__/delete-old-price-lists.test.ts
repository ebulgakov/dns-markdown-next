import { apiPost, env, resetMocks } from "@src/__tests__/setup";
import { beforeEach, describe, expect, test } from "bun:test";

import { deleteOldPriceLists } from "../delete-old-price-lists";

describe("deleteOldPriceLists", () => {
  beforeEach(() => {
    resetMocks();
  });

  test("throws without CITY", async () => {
    env.CITY = undefined;

    await expect(deleteOldPriceLists()).rejects.toThrow("No city found");
    expect(apiPost).not.toHaveBeenCalled();
  });

  test("deletes old price lists of the city", async () => {
    await deleteOldPriceLists();

    expect(apiPost).toHaveBeenCalledWith("/service/delete-old-price-lists", { city: "samara" });
  });
});
