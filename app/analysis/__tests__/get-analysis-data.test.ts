import { getAnalysisGoodsByParam, getAnalysisGoodsLinks } from "@/db/analysis-data/queries";
import { getAllDiffsByCity } from "@/db/analysis-diff/queries";
import { getArchiveListDates, getLastPriceList, getPriceListCity } from "@/db/pricelist/queries";
import { getAllReportsByCity } from "@/db/reports/queries";

import { getAnalysisData } from "../get-analysis-data";

import type { AnalysisData } from "@/types/analysis-data";
import type { AnalysisDiff } from "@/types/analysis-diff";
import type { PriceList, PriceListDates } from "@/types/pricelist";
import type { ReportsResponse } from "@/types/reports";

jest.mock("@/app/helpers/format", () => ({
  formatDate: jest.fn(date => new Date(date).toISOString().split("T")[0]),
  formatDateShort: jest.fn(date => new Date(date).toLocaleDateString("ru-RU"))
}));

jest.mock("@/db/analysis-data/queries", () => ({
  getAnalysisGoodsLinks: jest.fn(),
  getAnalysisGoodsByParam: jest.fn()
}));

jest.mock("@/db/analysis-diff/queries", () => ({
  getAllDiffsByCity: jest.fn()
}));

jest.mock("@/db/reports/queries", () => ({
  getAllReportsByCity: jest.fn()
}));

jest.mock("@/db/pricelist/queries", () => ({
  getArchiveListDates: jest.fn(),
  getLastPriceList: jest.fn(),
  getPriceListCity: jest.fn()
}));

const mockedGetPriceListCity = getPriceListCity as jest.Mock;
const mockedGetAnalysisGoodsLinks = getAnalysisGoodsLinks as jest.Mock;
const mockedGetArchiveListDates = getArchiveListDates as jest.Mock;
const mockedGetLastPriceList = getLastPriceList as jest.Mock;
const mockedGetAnalysisGoodsByParam = getAnalysisGoodsByParam as jest.Mock;
const mockedGetAllDiffsByCity = getAllDiffsByCity as jest.Mock;
const mockedGetAllReportsByCity = getAllReportsByCity as jest.Mock;

console.error = jest.fn();

describe("getAnalysisData", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return analysis data successfully", async () => {
    const city = "TestCity";
    const links = ["link1", "link2"];
    const archiveDates: PriceListDates = [
      {
        createdAt: `${new Date("2023-01-01")}`,
        _id: ""
      }
    ];
    const lastPriceList: PriceList = {
      _id: "1",
      city,
      createdAt: new Date(),
      positions: [
        {
          _id: "1",
          title: "section",
          items: [
            {
              code: "1",
              title: "item",
              price: "100",
              link: "link1",
              _id: "",
              description: "",
              reasons: [],
              priceOld: "",
              profit: "",
              image: "",
              available: ""
            }
          ]
        }
      ]
    };
    const goodsByDate: AnalysisData[] = [
      {
        code: "1",
        category: "section",
        city: "TestCity",
        title: "item",
        price: "100",
        link: "link1",
        _id: "",
        description: "",
        reasons: [],
        priceOld: "",
        profit: "",
        image: "",
        available: "",
        dateAdded: `${new Date("2023-01-01")}`
      }
    ];
    const diffs: AnalysisDiff[] = [];
    const reports: ReportsResponse = [
      {
        _id: "1",
        city: "TestCity",
        dateAdded: `${new Date()}`,
        report: "Report content"
      }
    ];

    mockedGetPriceListCity.mockResolvedValue(city);
    mockedGetAnalysisGoodsLinks.mockResolvedValue(links);
    mockedGetArchiveListDates.mockResolvedValue(archiveDates);
    mockedGetLastPriceList.mockResolvedValue(lastPriceList);
    mockedGetAnalysisGoodsByParam.mockResolvedValue(goodsByDate);
    mockedGetAllDiffsByCity.mockResolvedValue(diffs);
    mockedGetAllReportsByCity.mockResolvedValue(reports);

    const result = await getAnalysisData();

    expect(result.city).toBe(city);
    expect(result.countUniqueGoods).toBe(links.length);
    expect(result.startFrom).toBe("2023-01-01");
    expect(result.currentCountGoods).toBe(1);
    expect(result.goodsCountByDates).toEqual([{ date: "01.01.2023", count: 1 }]);
    expect(result.goodsChangesByDates).toEqual(diffs);
    expect(result.reports).toEqual(reports);
  });

  it("should throw an error if city is not found", async () => {
    mockedGetPriceListCity.mockResolvedValue(undefined);
    await expect(getAnalysisData()).rejects.toThrow("City not found");
  });

  it("should throw an error if links are not found", async () => {
    mockedGetPriceListCity.mockResolvedValue("TestCity");
    mockedGetAnalysisGoodsLinks.mockResolvedValue(undefined);
    await expect(getAnalysisData()).rejects.toThrow("Analysis goods links not found");
  });

  it("should throw an error if archive dates are not found", async () => {
    mockedGetPriceListCity.mockResolvedValue("TestCity");
    mockedGetAnalysisGoodsLinks.mockResolvedValue(["link1"]);
    mockedGetArchiveListDates.mockResolvedValue([]);
    await expect(getAnalysisData()).rejects.toThrow("Archive of price lists not found");
  });

  it("should throw an error if last price list is not found", async () => {
    mockedGetPriceListCity.mockResolvedValue("TestCity");
    mockedGetAnalysisGoodsLinks.mockResolvedValue(["link1"]);
    mockedGetArchiveListDates.mockResolvedValue([{ createdAt: new Date() }]);
    mockedGetLastPriceList.mockResolvedValue(undefined);
    await expect(getAnalysisData()).rejects.toThrow("Price list not found");
  });

  it("should throw an error if goods by date are not found", async () => {
    mockedGetPriceListCity.mockResolvedValue("TestCity");
    mockedGetAnalysisGoodsLinks.mockResolvedValue(["link1"]);
    mockedGetArchiveListDates.mockResolvedValue([{ createdAt: new Date() }]);
    mockedGetLastPriceList.mockResolvedValue({ positions: [] });
    mockedGetAnalysisGoodsByParam.mockResolvedValue(undefined);
    await expect(getAnalysisData()).rejects.toThrow("Not able to get analyzed goods by date");
  });

  it("should throw an error if diffs are not found", async () => {
    mockedGetPriceListCity.mockResolvedValue("TestCity");
    mockedGetAnalysisGoodsLinks.mockResolvedValue(["link1"]);
    mockedGetArchiveListDates.mockResolvedValue([{ createdAt: new Date() }]);
    mockedGetLastPriceList.mockResolvedValue({ positions: [] });
    mockedGetAnalysisGoodsByParam.mockResolvedValue([]);
    mockedGetAllDiffsByCity.mockResolvedValue(undefined);
    await expect(getAnalysisData()).rejects.toThrow("Analysis goods changes by dates not found");
  });

  it("should throw an error if reports are not found", async () => {
    mockedGetPriceListCity.mockResolvedValue("TestCity");
    mockedGetAnalysisGoodsLinks.mockResolvedValue(["link1"]);
    mockedGetArchiveListDates.mockResolvedValue([{ createdAt: new Date(), _id: "1" }]);
    mockedGetLastPriceList.mockResolvedValue({ positions: [{ items: [""] }] });
    mockedGetAnalysisGoodsByParam.mockResolvedValue([[]]);
    mockedGetAllDiffsByCity.mockResolvedValue([]);
    mockedGetAllReportsByCity.mockResolvedValue(undefined);
    await expect(getAnalysisData()).rejects.toThrow("Reports data not found");
  });
});
