import { add as cacheAdd, get as cacheGet } from "@/cache";
import { mockAnalysisData } from "@/db/analysis-data/queries/__mocks__/mock-data";
import { getAllDiffsReportByCity } from "@/db/analysis-diff/queries/get-all-diffs-report-by-city";
import { dbConnect } from "@/db/database";
import { AnalysisDiff } from "@/db/models/analysis-diff-model";
import { AnalysisDiff as AnalysisDiffType } from "@/types/analysis-diff";

jest.mock("@/db/database", () => ({ dbConnect: jest.fn() }));
jest.mock("@/cache", () => ({ get: jest.fn(), add: jest.fn() }));
jest.mock("@/db/models/analysis-diff-model", () => ({
  AnalysisDiff: {
    find: jest.fn()
  }
}));

const mockAnalysisDiff: AnalysisDiffType[] = [
  {
    city: "TestCity",
    dateAdded: `${new Date()}`,
    newItems: [mockAnalysisData[0]],
    removedItems: [mockAnalysisData[1]],
    changesPrice: [
      {
        item: mockAnalysisData[2],
        diff: {
          priceOld: "100",
          price: "150",
          profit: "50"
        }
      }
    ],
    changesProfit: [
      {
        item: mockAnalysisData[1],
        diff: {
          priceOld: "100",
          price: "150",
          profit: "50"
        }
      }
    ]
  }
];

describe("getAllDiffsReportByCity", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if city or date is not provided", async () => {
    await expect(getAllDiffsReportByCity("", "2024-01-01")).rejects.toThrow(
      "city|date is required"
    );
    await expect(getAllDiffsReportByCity("TestCity", "")).rejects.toThrow("city|date is required");
  });

  it("should return diffs from cache when available", async () => {
    const city = "TestCity";
    const date = "2024-01-01";
    const cacheKey = `analysisdiffreport:all:${city}-${date}`;
    const cachedData = [
      { ...mockAnalysisDiff[0], newItems: 1, removedItems: 1, changesPrice: 1, changesProfit: 1 }
    ];
    (cacheGet as jest.Mock).mockResolvedValue(cachedData);

    const result = await getAllDiffsReportByCity(city, date);

    expect(cacheGet).toHaveBeenCalledWith(cacheKey);
    expect(dbConnect).not.toHaveBeenCalled();
    expect(result).toEqual(cachedData);
  });

  it("should return diffs from DB when cache is empty and create a report", async () => {
    const city = "TestCity";
    const date = "2024-01-01";
    const cacheKey = `analysisdiffreport:all:${city}-${date}`;
    (cacheGet as jest.Mock).mockResolvedValue(null);
    (AnalysisDiff.find as jest.Mock).mockResolvedValue(mockAnalysisDiff);

    const result = await getAllDiffsReportByCity(city, date);

    const expectedReport = [
      {
        ...mockAnalysisDiff[0],
        newItems: 1,
        removedItems: 1,
        changesPrice: 1,
        changesProfit: 1
      }
    ];

    expect(dbConnect).toHaveBeenCalled();
    expect(AnalysisDiff.find).toHaveBeenCalledWith({ city }, {}, { sort: { dateAdded: -1 } });
    expect(cacheAdd).toHaveBeenCalledWith(cacheKey, JSON.stringify(expectedReport), {
      ex: 60 * 60 * 24
    });
    expect(result).toEqual(expectedReport);
  });

  it("should return an empty array when db returns an empty array", async () => {
    const city = "AnotherCity";
    const date = "2024-01-01";
    const cacheKey = `analysisdiffreport:all:${city}-${date}`;
    (cacheGet as jest.Mock).mockResolvedValue(null);
    (AnalysisDiff.find as jest.Mock).mockResolvedValue([]);

    const result = await getAllDiffsReportByCity(city, date);

    expect(result).toEqual([]);
    expect(cacheAdd).toHaveBeenCalledWith(cacheKey, "[]", { ex: 60 * 60 * 24 });
  });
});
