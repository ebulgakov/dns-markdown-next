import { dbConnect } from "@/db/database";
import { Pricelist } from "@/db/models/pricelist-model";

import { getArchiveList } from "../get-archive-list";

jest.mock("@/db/database", () => ({ dbConnect: jest.fn() }));
jest.mock("@/cache", () => ({ __esModule: true, default: { get: jest.fn(), set: jest.fn() } }));
jest.mock("@/db/models/pricelist-model", () => ({
  Pricelist: {
    find: jest.fn()
  }
}));

describe("getArchiveList", () => {
  const city = "TestCity";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a list of pricelists for a valid city", async () => {
    const mockPriceLists = [
      { createdAt: `${new Date("2023-01-01")}` },
      { createdAt: `${new Date("2023-01-02")}` }
    ];

    (Pricelist.find as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(mockPriceLists)
    });

    const result = await getArchiveList(city);

    expect(dbConnect).toHaveBeenCalledTimes(1);
    expect(Pricelist.find).toHaveBeenCalledWith({ city }, {}, { sort: { updatedAt: 1 } });
    expect(result).toEqual(mockPriceLists);
  });

  it("should return an empty array if no pricelists are found", async () => {
    (Pricelist.find as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue([])
    });

    const result = await getArchiveList(city);

    expect(dbConnect).toHaveBeenCalledTimes(1);
    expect(Pricelist.find).toHaveBeenCalledWith({ city }, {}, { sort: { updatedAt: 1 } });
    expect(result).toEqual([]);
  });
});
