import { add as cacheAdd, get as cacheGet } from "@/cache";
import { getLastDiffByCity } from "@/db/analysis-diff/queries/get-last-diff-by-city";
import { dbConnect } from "@/db/database";
import { AnalysisDiff } from "@/db/models/analysis-diff-model";

jest.mock("@/db/database", () => ({ dbConnect: jest.fn() }));
jest.mock("@/cache", () => ({ get: jest.fn(), add: jest.fn() }));
jest.mock("@/db/models/analysis-diff-model", () => ({
  AnalysisDiff: {
    findOne: jest.fn()
  }
}));

const mockDiff = {
  city: "TestCity",
  diff: { added: [], removed: [] },
  dateAdded: new Date().toISOString()
};

const city = "TestCity";
const date = "2023-01-01";

describe("getLastDiffByCity", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if city or date is not provided", async () => {
    await expect(getLastDiffByCity("", "")).rejects.toThrow("city|date is required");
    await expect(getLastDiffByCity("city", "")).rejects.toThrow("city|date is required");
    await expect(getLastDiffByCity("", "date")).rejects.toThrow("city|date is required");
  });

  it("should not query cache if city or date is not provided", async () => {
    await expect(getLastDiffByCity("", "")).rejects.toThrow("city|date is required");
    expect(cacheGet).not.toHaveBeenCalled();
  });

  it("should return diff from cache when available", async () => {
    (cacheGet as jest.Mock).mockResolvedValue(mockDiff);

    const result = await getLastDiffByCity(city, date);

    expect(cacheGet).toHaveBeenCalledWith(`analysisdiff:last:${city}-${date}`);
    expect(dbConnect).not.toHaveBeenCalled();
    expect(result).toEqual(mockDiff);
  });

  it("should return diff from DB when cache is empty", async () => {
    (cacheGet as jest.Mock).mockResolvedValue(null);
    (AnalysisDiff.findOne as jest.Mock).mockResolvedValue(mockDiff);

    const result = await getLastDiffByCity(city, date);

    expect(dbConnect).toHaveBeenCalled();
    expect(AnalysisDiff.findOne).toHaveBeenCalledWith({ city }, {}, { sort: { dateAdded: -1 } });
    expect(cacheAdd).toHaveBeenCalledWith(
      `analysisdiff:last:${city}-${date}`,
      JSON.stringify(mockDiff),
      { ex: 60 * 60 * 24 }
    );
    expect(result).toEqual(mockDiff);
  });

  it("should throw an error when no diffs are found in the DB", async () => {
    const nonExistentCity = "NonExistentCity";
    (cacheGet as jest.Mock).mockResolvedValue(null);
    (AnalysisDiff.findOne as jest.Mock).mockResolvedValue(null);

    await expect(getLastDiffByCity(nonExistentCity, date)).rejects.toThrow(
      "No analysis diffs found"
    );
    expect(dbConnect).toHaveBeenCalled();
    expect(cacheAdd).not.toHaveBeenCalled();
  });
});
