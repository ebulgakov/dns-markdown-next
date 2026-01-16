import { add as cacheAdd, get as cacheGet } from "@/cache";
import { mockAnalysisData } from "@/db/analysis-data/queries/__mocks__/mock-data";
import { getAllDiffsByCity } from "@/db/analysis-diff/queries/get-all-diffs-by-city";
import { dbConnect } from "@/db/database";
import { AnalysisDiff } from "@/db/models/analysis-diff-model";

jest.mock("@/db/database", () => ({ dbConnect: jest.fn() }));
jest.mock("@/cache", () => ({ get: jest.fn(), add: jest.fn() }));
jest.mock("@/db/models/analysis-diff-model", () => ({
  AnalysisDiff: {
    find: jest.fn()
  }
}));

describe("getAllDiffsByCity", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if city is not provided", async () => {
    await expect(getAllDiffsByCity("")).rejects.toThrow("city is required");
  });

  it("should return diffs from cache when available", async () => {
    const city = "TestCity";
    (cacheGet as jest.Mock).mockResolvedValue(mockAnalysisData);

    const result = await getAllDiffsByCity(city);

    expect(cacheGet).toHaveBeenCalledWith(`analysisdiff:all:${city}`);
    expect(dbConnect).not.toHaveBeenCalled();
    expect(result).toEqual(mockAnalysisData);
  });

  it("should return diffs from DB when cache is empty", async () => {
    const city = "TestCity";
    (cacheGet as jest.Mock).mockResolvedValue(null);
    (AnalysisDiff.find as jest.Mock).mockResolvedValue(mockAnalysisData);

    const result = await getAllDiffsByCity(city);

    expect(dbConnect).toHaveBeenCalled();
    expect(AnalysisDiff.find).toHaveBeenCalledWith({ city }, {}, { sort: { dateAdded: -1 } });
    expect(cacheAdd).toHaveBeenCalledWith(
      `analysisdiff:all:${city}`,
      JSON.stringify(mockAnalysisData)
    );
    expect(result).toEqual(mockAnalysisData);
  });

  it("should return an empty array when db returns an empty array", async () => {
    const city = "AnotherCity";
    (cacheGet as jest.Mock).mockResolvedValue(null);
    (AnalysisDiff.find as jest.Mock).mockResolvedValue([]);

    const result = await getAllDiffsByCity(city);

    expect(result).toEqual([]);
    expect(cacheAdd).toHaveBeenCalledWith(`analysisdiff:all:${city}`, "[]");
  });
});
