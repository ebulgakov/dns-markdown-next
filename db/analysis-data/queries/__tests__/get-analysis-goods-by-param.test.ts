import { add as cacheAdd, get as cacheGet } from "@/cache";
import { mockAnalysisData } from "@/db/analysis-data/queries/__mocks__/mock-data";
import { getAnalysisGoodsByParam } from "@/db/analysis-data/queries/get-analysis-goods-by-param";
import { dbConnect } from "@/db/database";
import { AnalysisData } from "@/db/models/analysis-data-model";

jest.mock("@/db/database", () => ({ dbConnect: jest.fn() }));
jest.mock("@/cache", () => ({ get: jest.fn(), add: jest.fn() }));
jest.mock("@/db/models/analysis-data-model", () => ({
  AnalysisData: {
    find: jest.fn()
  }
}));

describe("getAnalysisGoodsByParam", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return sorted data from DB when cache is empty", async () => {
    const param = "category";
    const value = "test";
    const city = "TestCity";
    const date = "2023-01-01";

    (cacheGet as jest.Mock).mockResolvedValue(null);
    (AnalysisData.find as jest.Mock).mockReturnValue({
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockAnalysisData.filter(d => d.category === value))
    });

    const result = await getAnalysisGoodsByParam({ param, value, city, date });

    expect(dbConnect).toHaveBeenCalled();
    expect(AnalysisData.find).toHaveBeenCalledWith({ [param]: value, city });
    expect(cacheAdd).toHaveBeenCalled();
    expect(result).toEqual(
      [mockAnalysisData[0], mockAnalysisData[1]].sort(
        (a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
      )
    );
  });

  it("should return data from cache when available", async () => {
    const param = "category";
    const value = "test";
    const city = "TestCity";
    const date = "2023-01-01";
    const cachedData = mockAnalysisData.filter(d => d.category === value);

    (cacheGet as jest.Mock).mockResolvedValue(cachedData);

    const result = await getAnalysisGoodsByParam({ param, value, city, date });

    expect(cacheGet).toHaveBeenCalledWith(`analysis-goods-by-${param}-${value}-${city}-${date}`);
    expect(dbConnect).not.toHaveBeenCalled();
    expect(result).toEqual(cachedData);
  });

  it("should throw an error if no analysis goods are found", async () => {
    const param = "inStock";
    const value = true;
    const city = "NonExistentCity";
    const date = "2023-01-01";

    (cacheGet as jest.Mock).mockResolvedValue(null);
    (AnalysisData.find as jest.Mock).mockReturnValue({
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null)
    });

    await expect(getAnalysisGoodsByParam({ param, value, city, date })).rejects.toThrow(
      "No analysis goods found"
    );
  });

  it("should return an empty array when db returns an empty array", async () => {
    const param = "inStock";
    const value = false;
    const city = "AnotherCity";
    const date = "2023-01-01";

    (cacheGet as jest.Mock).mockResolvedValue(null);
    (AnalysisData.find as jest.Mock).mockReturnValue({
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([])
    });

    const result = await getAnalysisGoodsByParam({ param, value, city, date });

    expect(result).toEqual([]);
    expect(cacheAdd).toHaveBeenCalledWith(
      `analysis-goods-by-${param}-${value}-${city}-${date}`,
      "[]",
      {
        ex: 60 * 60 * 24
      }
    );
  });
});
