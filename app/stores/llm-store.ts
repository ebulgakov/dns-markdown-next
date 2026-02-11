import { create } from "zustand";

import { getLLMCompareProducts, getLLMDescribeProduct } from "@/api/get";

type CompareGoodsLink = {
  link: string;
  sectionTitle: string;
};

type llmStore = {
  isAvailableCompare: boolean;
  isReportLoading: boolean;
  changeAvailabilityCompare: (isAvailable: boolean) => void;
  compareGoodsLinks: CompareGoodsLink[];
  updateCompareGoodsLinks: (link: CompareGoodsLink) => void;
  setCompareGoodsLinks: (links: CompareGoodsLink[]) => void;
  compareGoods: (links: CompareGoodsLink[]) => Promise<void>;
  describeGoods: (link: CompareGoodsLink) => Promise<void>;
  setReport: (report: string) => void;
  report: string;
};

export const useLlmStore = create<llmStore>(set => ({
  isAvailableCompare: false,
  isReportLoading: false,
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
  setReport: report => {
    set(state => ({ ...state, report }));
  },
  compareGoods: async links => {
    set(state => ({ ...state, report: "", isReportLoading: true }));
    const payloadLinks = links.map(link => link.link);
    try {
      const { report } = await getLLMCompareProducts(payloadLinks);
      set(state => ({ ...state, report }));
    } finally {
      set(state => ({ ...state, isReportLoading: false }));
    }
  },
  describeGoods: async link => {
    set(state => ({ ...state, report: "", isReportLoading: true }));
    try {
      const { report } = await getLLMDescribeProduct(link.link);
      set(state => ({ ...state, report }));
    } finally {
      set(state => ({ ...state, isReportLoading: false }));
    }
  }
}));
