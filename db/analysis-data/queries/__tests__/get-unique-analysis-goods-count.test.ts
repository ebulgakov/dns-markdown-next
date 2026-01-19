import { add as cacheAdd, get as cacheGet } from "@/cache";
import { getAnalysisGoodsLinks } from "@/db/analysis-data/queries/get-analysis-goods-links";
import { getUniqueAnalysisGoodsCount } from "@/db/analysis-data/queries/get-unique-analysis-goods-count";
import { dbConnect } from "@/db/database";

jest.mock("@/db/database", () => ({ dbConnect: jest.fn() }));
jest.mock("@/cache", () => ({ get: jest.fn(), add: jest.fn() }));
jest.mock("@/db/analysis-data/queries/get-analysis-goods-links", () => ({
  getAnalysisGoodsLinks: jest.fn()
}));

const testDate = "2023-01-01";
const testCity = "TestCity";

describe("getUniqueAnalysisGoodsCount", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if city is not provided", async () => {
    await expect(getUniqueAnalysisGoodsCount("", testDate)).rejects.toThrow(
      "city|date is required"
    );
  });

  it("should throw an error if date is not provided", async () => {
    await expect(getUniqueAnalysisGoodsCount(testCity, "")).rejects.toThrow(
      "city|date is required"
    );
  });

  it("should return count from cache when available", async () => {
    const cachedCount = 10;
    (cacheGet as jest.Mock).mockResolvedValue(cachedCount);

    const result = await getUniqueAnalysisGoodsCount(testCity, testDate);

    expect(cacheGet).toHaveBeenCalledWith(`analysis:uniq-count:${testCity}-${testDate}`);
    expect(dbConnect).not.toHaveBeenCalled();
    expect(result).toBe(cachedCount);
  });

  it("should return unique links count from DB when cache is empty", async () => {
    const mockLinks = ["link1", "link2", "link3"];
    (cacheGet as jest.Mock).mockResolvedValue(null);
    (getAnalysisGoodsLinks as jest.Mock).mockResolvedValue(mockLinks);

    const result = await getUniqueAnalysisGoodsCount(testCity, testDate);

    expect(dbConnect).toHaveBeenCalled();
    expect(getAnalysisGoodsLinks).toHaveBeenCalledWith(testCity, testDate);
    expect(cacheAdd).toHaveBeenCalledWith(
      `analysis:uniq-count:${testCity}-${testDate}`,
      String(mockLinks.length),
      { ex: 86400 }
    );
    expect(result).toBe(mockLinks.length);
  });

  it("should return 0 when db returns an empty array of links", async () => {
    (cacheGet as jest.Mock).mockResolvedValue(null);
    (getAnalysisGoodsLinks as jest.Mock).mockResolvedValue([]);

    const result = await getUniqueAnalysisGoodsCount(testCity, testDate);

    expect(result).toBe(0);
    expect(cacheAdd).toHaveBeenCalledWith(`analysis:uniq-count:${testCity}-${testDate}`, "0", {
      ex: 86400
    });
  });
});
