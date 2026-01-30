import { add as cacheAdd, get as cacheGet } from "@/cache";
import { getAnalysisGoodsLinks } from "@/db/analysis-data/queries/get-analysis-goods-links";
import { dbConnect } from "@/db/database";
import { AnalysisData } from "@/db/models/analysis-data-model";

jest.mock("@/db/database", () => ({ dbConnect: jest.fn() }));
jest.mock("@/cache", () => ({ get: jest.fn(), add: jest.fn() }));
jest.mock("@/db/models/analysis-data-model", () => ({
  AnalysisData: {
    find: jest.fn()
  }
}));

const mockLinksData = [{ link: "link1" }, { link: "link2" }, { link: "link1" }];

describe("getAnalysisGoodsLinks", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if city is not provided", async () => {
    await expect(getAnalysisGoodsLinks("")).rejects.toThrow("city is required");
  });

  it("should return links from cache when available", async () => {
    const city = "TestCity";
    const cachedData = ["link1", "link2"];
    (cacheGet as jest.Mock).mockResolvedValue(cachedData);

    const result = await getAnalysisGoodsLinks(city);

    expect(cacheGet).toHaveBeenCalledWith(`analysis:links:${city}`);
    expect(dbConnect).not.toHaveBeenCalled();
    expect(result).toEqual(cachedData);
  });

  it("should return unique links from DB when cache is empty", async () => {
    const city = "TestCity";
    (cacheGet as jest.Mock).mockResolvedValue(null);
    (AnalysisData.find as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(mockLinksData)
    });

    const result = await getAnalysisGoodsLinks(city);

    expect(dbConnect).toHaveBeenCalled();
    expect(AnalysisData.find).toHaveBeenCalledWith({ city }, {}, { sort: { updatedAt: 1 } });
    expect(cacheAdd).toHaveBeenCalledWith(
      `analysis:links:${city}`,
      JSON.stringify(["link1", "link2"]),
      { ex: 86400 }
    );
    expect(result).toEqual(["link1", "link2"]);
  });

  it("should return an empty array when db returns an empty array", async () => {
    const city = "AnotherCity";
    (cacheGet as jest.Mock).mockResolvedValue(null);
    (AnalysisData.find as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue([])
    });

    const result = await getAnalysisGoodsLinks(city);

    expect(result).toEqual([]);
    expect(cacheAdd).toHaveBeenCalledWith(`analysis:links:${city}`, "[]", {
      ex: 86400
    });
  });
});
