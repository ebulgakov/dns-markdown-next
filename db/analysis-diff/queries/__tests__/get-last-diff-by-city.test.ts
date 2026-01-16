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

describe("getLastDiffByCity", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if city is not provided", async () => {
    await expect(getLastDiffByCity("")).rejects.toThrow("city is required");
  });

  it("should not query cache if city is not provided", async () => {
    await expect(getLastDiffByCity("")).rejects.toThrow("city is required");
    expect(cacheGet).not.toHaveBeenCalled();
  });

  it("should return diff from cache when available", async () => {
    const city = "TestCity";
    (cacheGet as jest.Mock).mockResolvedValue(mockDiff);

    const result = await getLastDiffByCity(city);

    expect(cacheGet).toHaveBeenCalledWith(`analysisdiff:last:${city}`);
    expect(dbConnect).not.toHaveBeenCalled();
    expect(result).toEqual(mockDiff);
  });

  it("should return diff from DB when cache is empty", async () => {
    const city = "TestCity";
    (cacheGet as jest.Mock).mockResolvedValue(null);
    (AnalysisDiff.findOne as jest.Mock).mockResolvedValue(mockDiff);

    const result = await getLastDiffByCity(city);

    expect(dbConnect).toHaveBeenCalled();
    expect(AnalysisDiff.findOne).toHaveBeenCalledWith({ city }, {}, { sort: { dateAdded: -1 } });
    expect(cacheAdd).toHaveBeenCalledWith(`analysisdiff:last:${city}`, JSON.stringify(mockDiff));
    expect(result).toEqual(mockDiff);
  });

  it("should throw an error when no diffs are found in the DB", async () => {
    const city = "NonExistentCity";
    (cacheGet as jest.Mock).mockResolvedValue(null);
    (AnalysisDiff.findOne as jest.Mock).mockResolvedValue(null);

    await expect(getLastDiffByCity(city)).rejects.toThrow("No analysis diffs found");
    expect(dbConnect).toHaveBeenCalled();
    expect(cacheAdd).not.toHaveBeenCalled();
  });
});
