import { create } from "zustand";

type llmStore = {
  isAvailableCompare: boolean;
  changeAvailabilityCompare: (isAvailable: boolean) => void;
  compareGoodsLinks: string[];
  toggleCompareGoodsLinks: (link: string) => void;
  //compareGoods: (links: string[]) => Promise<string>;
  report: string;
};

export const useLlmStore = create<llmStore>(set => ({
  isAvailableCompare: false,
  changeAvailabilityCompare: (isAvailable: boolean) => {
    set(state => ({ ...state, compareGoodsLinks: [], isAvailableCompare: isAvailable }));
  },
  compareGoodsLinks: [],
  toggleCompareGoodsLinks: (link: string) => {
    set(state => ({
      ...state,
      compareGoodsLinks: state.compareGoodsLinks.includes(link)
        ? state.compareGoodsLinks.filter(l => l !== link)
        : [...state.compareGoodsLinks, link]
    }));
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
