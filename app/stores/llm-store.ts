import axios from "axios";
import axiosRetry from "axios-retry";
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

const client = axios.create();
axiosRetry(client, { retries: 3, retryDelay: retryCount => retryCount * 1000 });

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
      const { report } = await client
        .get("/api/compare-products", {
          params: { links: payloadLinks }
        })
        .then(res => res.data);

      set(state => ({ ...state, report, compareGoodsLinks: [] }));
    } catch (error) {
      console.error("Failed to compare products:", error);
      set(state => ({ ...state, report: "Failed to compare products. Please try again later." }));
    } finally {
      set(state => ({ ...state, isReportLoading: false }));
    }
  },
  describeGoods: async link => {
    set(state => ({ ...state, report: "", isReportLoading: true }));
    try {
      const { report } = await client
        .get("/api/describe-product", {
          params: { link: link.link }
        })
        .then(res => res.data);
      set(state => ({ ...state, report, compareGoodsLinks: [] }));
    } catch (error) {
      console.error("Failed to describe product:", error);
      set(state => ({ ...state, report: "Failed to describe product. Please try again later." }));
    } finally {
      set(state => ({ ...state, isReportLoading: false }));
    }
  }
}));
