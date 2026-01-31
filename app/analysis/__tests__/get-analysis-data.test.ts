import {
  getPriceListCity,
  getLast30ArchiveProductsCount,
  getLast30DiffsReportByCity,
  getLast30ReportsByCity
} from "@/api";
import { getUniqueAnalysisGoodsCount } from "@/db/analysis-data/queries";

import { getAnalysisData } from "../get-analysis-data";

import type { AnalysisDiffReport } from "@/types/analysis-diff";
import type { PriceListsArchiveCount } from "@/types/pricelist";
import type { ReportsResponse } from "@/types/reports";

jest.mock("@/app/helpers/format", () => ({
  formatDate: jest.fn(date => new Date(date).toISOString().split("T")[0]),
  formatDateShort: jest.fn(date => new Date(date).toLocaleDateString("ru-RU"))
}));

jest.mock("@/db/analysis-data/queries", () => ({
  getUniqueAnalysisGoodsCount: jest.fn()
}));

jest.mock("@/api", () => ({
  getPriceListCity: jest.fn(),
  getLast30DiffsReportByCity: jest.fn(),
  getLast30ArchiveProductsCount: jest.fn(),
  getLast30ReportsByCity: jest.fn()
}));

const mockedGetPriceListCity = getPriceListCity as jest.Mock;
const mockedGetArchiveGoodsCount = getLast30ArchiveProductsCount as jest.Mock;
const mockedGetAllDiffsReportByCity = getLast30DiffsReportByCity as jest.Mock;
const mockedGetAllReportsByCity = getLast30ReportsByCity as jest.Mock;
const mockedGetUniqueAnalysisGoodsCount = getUniqueAnalysisGoodsCount as jest.Mock;

console.error = jest.fn();

describe("getAnalysisData", () => {
  afterEach(() => {
    jest.clearAllMocks();
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
