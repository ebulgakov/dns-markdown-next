import axios from "axios";
import { create } from "zustand";

type CompareGoodsLink = {
  link: string;
  sectionTitle: string;
};

type llmStore = {
  isReportLoading: boolean;
  compareGoodsLinks: CompareGoodsLink[];
  updateCompareGoodsLinks: (link: CompareGoodsLink) => void;
  setCompareGoodsLinks: (links: CompareGoodsLink[]) => void;
  compareGoods: (links: CompareGoodsLink[]) => Promise<void>;
  describeGoods: (link: CompareGoodsLink) => Promise<void>;
  setReport: (report: string) => void;
  report: string;
};

export const useLlmStore = create<llmStore>(set => ({
  isReportLoading: false,
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
      const { report } = await axios
        .get("/api/compare-products", {
          params: { links: payloadLinks }
        })
        .then(res => res.data);

      set(state => ({ ...state, report, compareGoodsLinks: [] }));
    } finally {
      set(state => ({ ...state, isReportLoading: false }));
    }
  },
  describeGoods: async link => {
    set(state => ({ ...state, report: "", isReportLoading: true }));
    try {
      const { report } = await axios
        .get("/api/describe-product", {
          params: { link: link.link }
        })
        .then(res => res.data);
      set(state => ({ ...state, report, compareGoodsLinks: [] }));
    } finally {
      set(state => ({ ...state, isReportLoading: false }));
    }
  }
}));
