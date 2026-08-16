import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { useSortGoodsStore } from "@/app/stores/sort-goods-store";
import { usePriceListStore } from "@/entities/product";
import { UserContext } from "@/entities/user";

import { useFilteredGoods } from "../use-filtered-goods";

import type { Goods, PriceList } from "@/entities/product";
import type { ComponentProps, ReactNode } from "react";

const goods = (overrides: Partial<Goods> & Pick<Goods, "_id" | "title" | "link">): Goods => ({
  description: "",
  reasons: [],
  priceOld: "0",
  price: "0",
  profit: "0",
  code: "",
  image: "",
  available: "1",
  ...overrides
});

const priceList: PriceList = {
  _id: "list-1",
  city: "samara",
  createdAt: "2026-01-01",
  positions: [
    {
      _id: "pos-1",
      title: "Ноутбуки",
      items: [
        goods({
          _id: "1",
          title: "Ноутбук Cheap",
          link: "/1",
          price: "10000",
          priceOld: "20000",
          profit: "5",
          dateAdded: "2026-01-01"
        }),
        goods({
          _id: "2",
          title: "Ноутбук Expensive",
          link: "/2",
          price: "50000",
          priceOld: "0",
          profit: "20",
          dateAdded: "2026-01-03"
        })
      ]
    },
    {
      _id: "pos-2",
      title: "Смартфоны",
      items: [
        goods({
          _id: "3",
          title: "Смартфон",
          link: "/3",
          price: "30000",
          priceOld: "40000",
          profit: "0",
          dateAdded: "2026-01-02"
        })
      ]
    }
  ]
};

function renderUseFilteredGoods(
  params: Parameters<typeof useFilteredGoods>[0],
  contextValue?: Partial<ComponentProps<typeof UserContext.Provider>["value"]>
) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <UserContext.Provider
      value={{ hiddenSections: [], favoriteSections: [], favorites: [], city: "samara", ...contextValue }}
    >
      {children}
    </UserContext.Provider>
  );
  return renderHook(() => useFilteredGoods(params), { wrapper });
}

afterEach(() => {
  usePriceListStore.setState({ priceList: undefined });
  useSortGoodsStore.setState({ sortGoods: "default" });
});

describe("useFilteredGoods", () => {
  it("returns empty lists when there is no price list yet", () => {
    const { result } = renderUseFilteredGoods({ filterTerm: "" });

    expect(result.current.flattenList).toEqual([]);
    expect(result.current.flattenTitles).toEqual([]);
  });

  it("hasNoModifyOutput bypasses sorting/filtering and returns the raw sectioned output", () => {
    usePriceListStore.setState({ priceList });

    const { result } = renderUseFilteredGoods(
      { filterTerm: "", hasNoModifyOutput: true },
      { favoriteSections: ["Ноутбуки"] }
    );

    expect(result.current.flattenTitles.map(t => t.title)).toEqual(["Ноутбуки", "Смартфоны"]);
    const goodsIds = result.current.flattenList
      .filter(item => item.type === "goods")
      .map(item => item._id);
    expect(goodsIds).toEqual(["1", "2", "3"]);
  });

  it("filters goods by search term and derives titles only from matches", () => {
    usePriceListStore.setState({ priceList });

    const { result } = renderUseFilteredGoods({ filterTerm: "Смартфон" });

    const goodsItems = result.current.flattenList.filter(item => item.type === "goods");
    expect(goodsItems.map(item => item._id)).toEqual(["3"]);
  });

  it("sorts by price ascending", () => {
    usePriceListStore.setState({ priceList });
    useSortGoodsStore.setState({ sortGoods: "price" });

    const { result } = renderUseFilteredGoods({ filterTerm: "" });

    expect(result.current.flattenList.map(item => (item.type === "goods" ? item._id : item.type))).toEqual([
      "1",
      "3",
      "2"
    ]);
    expect(result.current.flattenTitles).toEqual([]);
  });

  it("sorts by discount, putting items without an old price last", () => {
    usePriceListStore.setState({ priceList });
    useSortGoodsStore.setState({ sortGoods: "discount" });

    const { result } = renderUseFilteredGoods({ filterTerm: "" });

    const ids = result.current.flattenList.map(item => (item.type === "goods" ? item._id : item.type));
    // item "1": 10000/20000 = 50%, item "3": 30000/40000 = 75%, item "2" has no old price -> last
    expect(ids).toEqual(["1", "3", "2"]);
  });

  it("sorts by profit descending, putting non-profitable items last", () => {
    usePriceListStore.setState({ priceList });
    useSortGoodsStore.setState({ sortGoods: "profit" });

    const { result } = renderUseFilteredGoods({ filterTerm: "" });

    const ids = result.current.flattenList.map(item => (item.type === "goods" ? item._id : item.type));
    // profit: "2"=20, "1"=5, "3"=0 (non-profitable, goes last)
    expect(ids).toEqual(["2", "1", "3"]);
  });

  it("sorts by date, newest first", () => {
    usePriceListStore.setState({ priceList });
    useSortGoodsStore.setState({ sortGoods: "date" });

    const { result } = renderUseFilteredGoods({ filterTerm: "" });

    const ids = result.current.flattenList.map(item => (item.type === "goods" ? item._id : item.type));
    expect(ids).toEqual(["2", "3", "1"]);
  });

  it("prepends a noFavsAlert when there is no filter and no favorite sections", () => {
    usePriceListStore.setState({ priceList });

    const { result } = renderUseFilteredGoods({ filterTerm: "" }, { favoriteSections: [] });

    expect(result.current.flattenList[0]).toEqual({ type: "noFavsAlert" });
  });

  it("prepends a foundTitle summary when a filter term is active", () => {
    usePriceListStore.setState({ priceList });

    const { result } = renderUseFilteredGoods({ filterTerm: "Ноутбук" });

    expect(result.current.flattenList[0]).toMatchObject({ type: "foundTitle" });
  });
});
