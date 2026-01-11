import { formatDate, formatDateShort, formatTime } from "../format";

// Test suite for date and time formatting functions
describe("Formatting Functions", () => {
  // Test suite for the formatDate function
  describe("formatDate", () => {
    // Test case to ensure date is formatted correctly in Russian locale
    it("should format the date correctly", () => {
      const date = new Date("2024-01-15T12:30:00");
      // The expected format for "ru" locale is "DD MMMM YYYY г."
      expect(formatDate(date)).toBe("15 января 2024 г.");
    });

    // Another test case with a different date
    it("should format another date correctly", () => {
      const date = new Date("2025-03-28T00:00:00");
      expect(formatDate(date)).toBe("28 марта 2025 г.");
    });

    // Another test case with a different format
    it("should not throw a RangeError", async () => {
      expect(() => formatDate("2026-01-06T01:00:00+09:00" as unknown as number)).not.toThrow(
        "Invalid time value"
      );
      expect(formatDate("2026-01-06T01:00:00+09:00" as unknown as number)).toBe("5 января 2026 г.");
    });
  });

  // Test suite for the formatDateShort function
  describe("formatDateShort", () => {
    // Test case to ensure date is formatted correctly in short format
    it("should format the date correctly in short format", () => {
      const date = new Date("2024-01-15T12:30:00");
      // The expected format is "DD.MM.YY"
      expect(formatDateShort(date)).toBe("15.01.24");
    });

    // Another test case with a different date
    it("should format another date correctly", () => {
      const date = new Date("2025-12-05T00:00:00");
      expect(formatDateShort(date)).toBe("05.12.25");
    });
  });

  // Test suite for the formatTime function
  describe("formatTime", () => {
    // Test case to ensure time is formatted correctly
    it("should format the time correctly", () => {
      const date = new Date("2024-01-15T12:30:45");
      // The expected format for "ru" locale is "HH:MM:SS"
      expect(formatTime(date)).toBe("12:30:45");
    });

    // Test case for midnight
    it("should handle midnight correctly", () => {
      const date = new Date("2024-01-15T00:00:00");
      // In some environments, it might be "0:00:00", in others "24:00:00" for the previous day.
      // Intl.DateTimeFormat is context-dependent, so we check for one of the valid options.
      const possibleTimes = ["0:00:00", "24:00:00", "00:00:00"];
      expect(possibleTimes).toContain(formatTime(date));
    });

    // Another test case with a different format
    it("should not throw a RangeError", async () => {
      expect(() => formatTime("2026-01-06T01:00:00+09:00" as unknown as number)).not.toThrow(
        "Invalid time value"
      );
      expect(formatTime("2026-01-06T01:00:00+09:00" as unknown as number)).toBe("20:00:00");
    });
  });
});
