import { AxiosError, AxiosHeaders } from "axios";
import { describe, expect, test } from "bun:test";

import describeError from "../describe-error";

describe("describeError", () => {
  test("keeps only non-secret fields of an Axios error", () => {
    const config = {
      method: "get",
      url: "/api/pricelist",
      headers: new AxiosHeaders({ "X-Internal-API-Secret": "secret" })
    };
    const error = new AxiosError("Request failed", "ERR_BAD_RESPONSE", config, null, {
      status: 500,
      statusText: "Internal Server Error",
      data: { message: "boom" },
      headers: {},
      config
    });

    const described = describeError(error);

    expect(described).toEqual({
      message: "Request failed",
      code: "ERR_BAD_RESPONSE",
      method: "get",
      url: "/api/pricelist",
      status: 500,
      data: { message: "boom" }
    });
    expect(JSON.stringify(described)).not.toContain("secret");
  });

  test("returns other errors as is", () => {
    const error = new Error("Network down");

    expect(describeError(error)).toBe(error);
  });
});
