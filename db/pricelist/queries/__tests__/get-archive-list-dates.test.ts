import { get as cacheGet, add as cacheAdd } from "@/cache";
import { dbConnect } from "@/db/database";
import { Pricelist } from "@/db/models/pricelist-model";

import { getArchiveListDates } from "../get-archive-list-dates";

jest.mock("@/db/database", () => ({ dbConnect: jest.fn() }));
jest.mock("@/cache", () => ({ get: jest.fn(), add: jest.fn() }));
jest.mock("@/db/models/pricelist-model", () => ({
  Pricelist: {
    find: jest.fn()
  }
}));

describe("getArchiveListDates", () => {
  const city = "TestCity";
  const date = "2023-01-01";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a list of pricelists for a valid city and date", async () => {
    const mockPriceLists = [
      { createdAt: `${new Date("2023-01-01")}` },
      { createdAt: `${new Date("2023-01-02")}` }
    ];
    (cacheGet as jest.Mock).mockResolvedValue(null);
    (Pricelist.find as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(mockPriceLists)
    });

    const result = await getArchiveListDates(city, date);

    expect(dbConnect).toHaveBeenCalledTimes(1);
    expect(Pricelist.find).toHaveBeenCalledWith({ city }, {}, { sort: { updatedAt: 1 } });
    expect(cacheAdd).toHaveBeenCalledWith(
      `pricelist:archive:${city}-${date}`,
      JSON.stringify(mockPriceLists),
      { ex: 86400 }
    );
    expect(result).toEqual(mockPriceLists);
  });

  it("should return cached data if available", async () => {
    const mockPriceLists = [
      { createdAt: `${new Date("2023-01-01")}` },
      { createdAt: `${new Date("2023-01-02")}` }
    ];
    (cacheGet as jest.Mock).mockResolvedValue(mockPriceLists);

    const result = await getArchiveListDates(city, date);

    expect(cacheGet).toHaveBeenCalledWith(`pricelist:archive:${city}-${date}`);
    expect(dbConnect).not.toHaveBeenCalled();
    expect(Pricelist.find).not.toHaveBeenCalled();
    expect(result).toEqual(mockPriceLists);
  });

  it("should throw an error if city or date is not provided", async () => {
    // @ts-expect-error -- testing invalid input
    await expect(getArchiveListDates(null, date)).rejects.toThrow("city|date is required");
    // @ts-expect-error -- testing invalid input
    await expect(getArchiveListDates(city, null)).rejects.toThrow("city|date is required");
  });

  it("should throw an error if no pricelists are found", async () => {
    (cacheGet as jest.Mock).mockResolvedValue(null);
    (Pricelist.find as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    });

    await expect(getArchiveListDates(city, date)).rejects.toThrow("No archived price lists found");
  });
});
