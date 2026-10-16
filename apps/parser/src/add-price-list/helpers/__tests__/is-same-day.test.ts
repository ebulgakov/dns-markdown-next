import { describe, expect, test } from "bun:test";

import isSameDay from "../is-same-day";

describe("isSameDay", () => {
  test("returns true for different times on the same day", () => {
    expect(isSameDay(new Date(2026, 9, 16, 0, 5), new Date(2026, 9, 16, 23, 55))).toBe(true);
  });

  test("returns false for adjacent days", () => {
    expect(isSameDay(new Date(2026, 9, 16, 23, 59), new Date(2026, 9, 17, 0, 1))).toBe(false);
  });

  test("returns false for the same day of a different month", () => {
    expect(isSameDay(new Date(2026, 8, 16), new Date(2026, 9, 16))).toBe(false);
  });

  test("returns false for the same day and month of a different year", () => {
    expect(isSameDay(new Date(2025, 9, 16), new Date(2026, 9, 16))).toBe(false);
  });
});
