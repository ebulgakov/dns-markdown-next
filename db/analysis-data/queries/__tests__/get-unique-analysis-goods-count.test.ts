import { add as cacheAdd, get as cacheGet } from "@/cache";
import { getAnalysisGoodsLinks } from "@/db/analysis-data/queries/get-analysis-goods-links";
import { getUniqueAnalysisGoodsCount } from "@/db/analysis-data/queries/get-unique-analysis-goods-count";
import { dbConnect } from "@/db/database";

jest.mock("@/db/database", () => ({ dbConnect: jest.fn() }));
jest.mock("@/cache", () => ({ get: jest.fn(), add: jest.fn() }));
jest.mock("@/db/analysis-data/queries/get-analysis-goods-links", () => ({
  getAnalysisGoodsLinks: jest.fn()
}));

const testCity = "TestCity";

describe("getUniqueAnalysisGoodsCount", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if city is not provided", async () => {
    await expect(getUniqueAnalysisGoodsCount("")).rejects.toThrow("city is required");
  });

  it("should return count from cache when available", async () => {
    const cachedCount = 10;
    (cacheGet as jest.Mock).mockResolvedValue(cachedCount);

    const result = await getUniqueAnalysisGoodsCount(testCity);

    expect(cacheGet).toHaveBeenCalledWith(`analysis:uniq-count:${testCity}`);
    expect(dbConnect).not.toHaveBeenCalled();
    expect(result).toBe(cachedCount);
  });

  it("should return unique links count from DB when cache is empty", async () => {
    const mockLinks = ["link1", "link2", "link3"];
    (cacheGet as jest.Mock).mockResolvedValue(null);
    (getAnalysisGoodsLinks as jest.Mock).mockResolvedValue(mockLinks);

    const result = await getUniqueAnalysisGoodsCount(testCity);

    expect(dbConnect).toHaveBeenCalled();
    expect(getAnalysisGoodsLinks).toHaveBeenCalledWith(testCity);
    expect(cacheAdd).toHaveBeenCalledWith(
      `analysis:uniq-count:${testCity}`,
      String(mockLinks.length),
      { ex: 86400 }
    );
    expect(result).toBe(mockLinks.length);
  });

  it("should return 0 when db returns an empty array of links", async () => {
    (cacheGet as jest.Mock).mockResolvedValue(null);
    (getAnalysisGoodsLinks as jest.Mock).mockResolvedValue([]);

    const result = await getUniqueAnalysisGoodsCount(testCity);

    expect(result).toBe(0);
    expect(cacheAdd).toHaveBeenCalledWith(`analysis:uniq-count:${testCity}`, "0", {
      ex: 86400
    });
  });
});
