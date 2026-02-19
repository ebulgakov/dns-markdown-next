import { describe, it, test, expect } from "vitest";

import { formatDate, formatDateShort, formatTime } from "../format";

describe("Formatting Functions", () => {
  describe("formatDate", () => {
    test.each([
      [new Date("2024-01-15T12:30:00"), "15 января 2024 г."],
      [new Date("2025-03-28T00:00:00"), "28 марта 2025 г."],
      ["2026-01-06T01:00:00+09:00", "5 января 2026 г."]
    ])("should format %p to %p", (date, expected) => {
      expect(() => formatDate(date)).not.toThrow("Invalid time value");
      expect(formatDate(date)).toBe(expected);
    });
  });

  describe("formatDateShort", () => {
    test.each([
      [new Date("2024-01-15T12:30:00"), "15.01.24"],
      [new Date("2025-12-05T00:00:00"), "05.12.25"]
    ])("should format %p to %p", (date, expected) => {
      expect(formatDateShort(date)).toBe(expected);
    });
  });

  describe("formatTime", () => {
    test.each([
      [new Date("2024-01-15T12:30:45"), "12:30:45"],
      ["2026-01-06T01:00:00+09:00", "16:00:00"]
    ])("should format %p to %p", (date, expected) => {
      expect(() => formatTime(date)).not.toThrow("Invalid time value");
      expect(formatTime(date)).toBe(expected);
    });

    it("should handle midnight correctly", () => {
      const date = new Date("2024-01-15T00:00:00");
      const possibleTimes = ["0:00:00", "24:00:00", "00:00:00"];
      expect(possibleTimes).toContain(formatTime(date));
    });
  });
});
