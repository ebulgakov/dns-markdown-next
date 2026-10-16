import { describe, expect, mock, spyOn, test } from "bun:test";

import getPerformance from "../get-performance";

describe("getPerformance", () => {
  test("runs the function and logs the execution time", async () => {
    const log = spyOn(console, "log").mockImplementation(() => {});
    const fn = mock(async () => {});

    await getPerformance(fn);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledWith(expect.stringMatching(/^Execution time: \d+\.\d{2} ms$/));
    log.mockRestore();
  });

  test("propagates errors of the function", async () => {
    await expect(
      getPerformance(async () => {
        throw new Error("boom");
      })
    ).rejects.toThrow("boom");
  });
});
