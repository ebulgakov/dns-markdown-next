import { describe, it, expect, vi, afterEach } from "bun:test";

import { getAnalysisData } from "../get-analysis-data";

import type { AnalysisDiffReport } from "@dns-markdown/types/analysis-diff";
import type { PriceListsArchiveCount } from "@dns-markdown/types/pricelist";
import type { ReportsResponse } from "@dns-markdown/types/reports";

// bun:test does not hoist vi.mock, so the factories can close over these mocks.
const mockedGetPriceListCity = vi.fn();
const mockedGetArchiveGoodsCount = vi.fn();
const mockedGetAllDiffsReportByCity = vi.fn();
const mockedGetAllReportsByCity = vi.fn();
const mockedGetUniqueAnalysisGoodsCount = vi.fn();
const mockedGetArchiveListDates = vi.fn();

vi.mock("@/entities/product", () => ({
  getLast30DiffsReportByCity: mockedGetAllDiffsReportByCity,
  getLast30ArchiveProductsCount: mockedGetArchiveGoodsCount,
  getLast30ReportsByCity: mockedGetAllReportsByCity,
  getTotalUniqProductsCount: mockedGetUniqueAnalysisGoodsCount,
  getArchiveListDates: mockedGetArchiveListDates
}));

vi.mock("@/entities/user", () => ({
  getPriceListCity: mockedGetPriceListCity
}));

console.error = vi.fn();

describe("getAnalysisData", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return analysis data successfully", async () => {
    const city = "TestCity";
    const goodsCountByDates: PriceListsArchiveCount[] = [{ date: "01.01.2023", count: 1 }];
    const diffs: AnalysisDiffReport[] = [];
    const reports: ReportsResponse = [
      {
        _id: "1",
        city: "TestCity",
        dateAdded: `${new Date()}`,
        report: "Report content"
      }
    ];
    const countUniqueGoods = 10;

    mockedGetPriceListCity.mockResolvedValue(city);
    mockedGetArchiveListDates.mockResolvedValue(goodsCountByDates);
    mockedGetArchiveGoodsCount.mockResolvedValue(goodsCountByDates);
    mockedGetAllDiffsReportByCity.mockResolvedValue(diffs);
    mockedGetAllReportsByCity.mockResolvedValue(reports);
    mockedGetUniqueAnalysisGoodsCount.mockResolvedValue(countUniqueGoods);

    const result = await getAnalysisData();

    expect(result.city).toBe(city);
    expect(result.goodsCountByDates).toEqual(goodsCountByDates);
    expect(result.goodsChangesByDates).toEqual(diffs);
    expect(result.reports).toEqual(reports);
    expect(result.countUniqueGoods).toBe(countUniqueGoods);
  });

  it("should throw an error if goods count by dates are not found", async () => {
    mockedGetPriceListCity.mockResolvedValue("TestCity");
    mockedGetArchiveGoodsCount.mockRejectedValue(new Error("DB error"));
    await expect(getAnalysisData()).rejects.toThrow("Not able to get analyzed goods by date");
  });

  it("should throw an error if goods changes by dates are not found", async () => {
    mockedGetPriceListCity.mockResolvedValue("TestCity");
    mockedGetArchiveGoodsCount.mockResolvedValue([]);
    mockedGetAllDiffsReportByCity.mockRejectedValue(new Error("DB error"));
    await expect(getAnalysisData()).rejects.toThrow("Analysis goods changes by dates not found");
  });

  it("should throw an error if reports are not found", async () => {
    mockedGetPriceListCity.mockResolvedValue("TestCity");
    mockedGetArchiveGoodsCount.mockResolvedValue([]);
    mockedGetAllDiffsReportByCity.mockResolvedValue([]);
    mockedGetAllReportsByCity.mockRejectedValue(new Error("DB error"));
    await expect(getAnalysisData()).rejects.toThrow("Reports data not found");
  });

  it("should throw an error if unique goods count is not found", async () => {
    mockedGetPriceListCity.mockResolvedValue("TestCity");
    mockedGetArchiveGoodsCount.mockResolvedValue([]);
    mockedGetAllDiffsReportByCity.mockResolvedValue([]);
    mockedGetAllReportsByCity.mockResolvedValue([]);
    mockedGetUniqueAnalysisGoodsCount.mockRejectedValue(new Error("DB error"));
    await expect(getAnalysisData()).rejects.toThrow("Analysis goods count not found");
  });
});
