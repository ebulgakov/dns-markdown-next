import { create } from "zustand";

type CompareGoodsLink = {
  link: string;
  sectionTitle: string;
};

type llmStore = {
  isAvailableCompare: boolean;
  changeAvailabilityCompare: (isAvailable: boolean) => void;
  compareGoodsLinks: CompareGoodsLink[];
  updateCompareGoodsLinks: (link: CompareGoodsLink) => void;
  setCompareGoodsLinks: (links: CompareGoodsLink[]) => void;
  //compareGoods: (links: string[]) => Promise<string>;
  report: string;
};

export const useLlmStore = create<llmStore>(set => ({
  isAvailableCompare: false,
  changeAvailabilityCompare: isAvailable => {
    set(state => ({ ...state, compareGoodsLinks: [], isAvailableCompare: isAvailable }));
  },
  compareGoodsLinks: [],
  updateCompareGoodsLinks: item => {
    set(state => ({
      ...state,
      compareGoodsLinks: state.compareGoodsLinks.some(link => link.link === item.link)
        ? state.compareGoodsLinks.filter(l => l.link !== item.link)
        : [...state.compareGoodsLinks, item]
    }));
  },
  setCompareGoodsLinks: links => {
    set(state => ({ ...state, compareGoodsLinks: links }));
  },
  report: ""
  // compareGoods: async (links: string[]) => {
  //   const response = await fetch("/api/compare-goods", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({ links })
  //   });
  //   const data = await response.json();
  //   set(state => ({ ...state, report: data.report }));
  //   return data.report;
  // }
}));
