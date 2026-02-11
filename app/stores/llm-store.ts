import { create } from "zustand";

import { getLLMCompareProducts } from "@/api/get";

type CompareGoodsLink = {
  link: string;
  sectionTitle: string;
};

type llmStore = {
  isAvailableCompare: boolean;
  isCompareGoodsLoading: boolean;
  changeAvailabilityCompare: (isAvailable: boolean) => void;
  compareGoodsLinks: CompareGoodsLink[];
  updateCompareGoodsLinks: (link: CompareGoodsLink) => void;
  setCompareGoodsLinks: (links: CompareGoodsLink[]) => void;
  compareGoods: (links: CompareGoodsLink[]) => Promise<void>;
  report: string;
};

export const useLlmStore = create<llmStore>(set => ({
  isAvailableCompare: false,
  isCompareGoodsLoading: false,
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
  report: "",
  compareGoods: async links => {
    set(state => ({ ...state, isCompareGoodsLoading: true }));
    const payloadLinks = links.map(link => link.link);
    try {
      const response = await getLLMCompareProducts(payloadLinks);
      set(state => ({ ...state, report: response }));
    } finally {
      set(state => ({ ...state, isCompareGoodsLoading: false }));
    }
  }
}));
