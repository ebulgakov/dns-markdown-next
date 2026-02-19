import { describe, it, expect, vi, afterEach, type Mock } from "vitest";

import {
  getPriceListCity,
  getLast30ArchiveProductsCount,
  getLast30DiffsReportByCity,
  getLast30ReportsByCity,
  getTotalUniqProductsCount,
  getArchiveListDates
} from "@/services/get";

import { getAnalysisData } from "../get-analysis-data";

import type { AnalysisDiffReport } from "@/types/analysis-diff";
import type { PriceListsArchiveCount } from "@/types/pricelist";
import type { ReportsResponse } from "@/types/reports";

vi.mock("@/app/helpers/format", () => ({
  formatDate: vi.fn(date => new Date(date).toISOString().split("T")[0]),
  formatDateShort: vi.fn(date => new Date(date).toLocaleDateString("ru-RU"))
}));

vi.mock("@/services/get", () => ({
  getPriceListCity: vi.fn(),
  getLast30DiffsReportByCity: vi.fn(),
  getLast30ArchiveProductsCount: vi.fn(),
  getLast30ReportsByCity: vi.fn(),
  getTotalUniqProductsCount: vi.fn(),
  getArchiveListDates: vi.fn()
}));

const mockedGetPriceListCity = getPriceListCity as Mock;
const mockedGetArchiveGoodsCount = getLast30ArchiveProductsCount as Mock;
const mockedGetAllDiffsReportByCity = getLast30DiffsReportByCity as Mock;
const mockedGetAllReportsByCity = getLast30ReportsByCity as Mock;
const mockedGetUniqueAnalysisGoodsCount = getTotalUniqProductsCount as Mock;
const mockedGetArchiveListDates = getArchiveListDates as Mock;

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
