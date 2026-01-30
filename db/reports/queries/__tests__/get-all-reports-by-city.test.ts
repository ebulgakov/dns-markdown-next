import { add as cacheAdd, get as cacheGet } from "@/cache";
import { dbConnect } from "@/db/database";
import { Reports } from "@/db/models/reports-model";
import { getAllReportsByCity } from "@/db/reports/queries/get-all-reports-by-city";

jest.mock("@/db/database", () => ({ dbConnect: jest.fn() }));
jest.mock("@/cache", () => ({ get: jest.fn(), add: jest.fn() }));
jest.mock("@/db/models/reports-model", () => ({
  Reports: {
    find: jest.fn()
  }
}));

const mockReports = [
  { city: "TestCity", report: "report1" },
  { city: "TestCity", report: "report2" }
];

describe("getAllReportsByCity", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if city is not provided", async () => {
    await expect(getAllReportsByCity("")).rejects.toThrow("city is required");
  });

  it("should return reports from cache when available", async () => {
    const city = "TestCity";
    (cacheGet as jest.Mock).mockResolvedValue(mockReports);

    const result = await getAllReportsByCity(city);

    expect(cacheGet).toHaveBeenCalledWith(`analytics-reports:all:${city}`);
    expect(dbConnect).not.toHaveBeenCalled();
    expect(result).toEqual(mockReports);
  });

  it("should return reports from DB when cache is empty", async () => {
    const city = "TestCity";
    (cacheGet as jest.Mock).mockResolvedValue(null);
    (Reports.find as jest.Mock).mockReturnValue(mockReports);

    const result = await getAllReportsByCity(city);

    expect(dbConnect).toHaveBeenCalled();
    expect(Reports.find).toHaveBeenCalledWith({ city }, {}, { sort: { dateAdded: -1 } });
    expect(cacheAdd).toHaveBeenCalledWith(
      `analytics-reports:all:${city}`,
      JSON.stringify(mockReports),
      { ex: 60 * 60 * 24 }
    );
    expect(result).toEqual(mockReports);
  });

  it("should return an empty array when db returns an empty array", async () => {
    const city = "AnotherCity";
    (cacheGet as jest.Mock).mockResolvedValue(null);
    (Reports.find as jest.Mock).mockReturnValue([]);

    const result = await getAllReportsByCity(city);

    expect(result).toEqual([]);
    expect(cacheAdd).toHaveBeenCalledWith(`analytics-reports:all:${city}`, "[]", {
      ex: 60 * 60 * 24
    });
  });
});
