import { create } from "zustand";

export type CompareGoodsLink = {
  link: string;
  sectionTitle: string;
};

type llmStore = {
  shownReport: boolean;
  compareGoodsLinks: CompareGoodsLink[];
  updateCompareGoodsLinks: (link: CompareGoodsLink) => void;
  setCompareGoodsLinks: (links: CompareGoodsLink[]) => void;
  clearReport: () => void;
  setShownReport: (status: boolean) => void;
  report: string;
  setReport: (report: string) => void;
};

export const useLlmStore = create<llmStore>(set => ({
  shownReport: false,
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
  clearReport: () => {
    set(state => ({ ...state, report: "", shownReport: false }));
  },
  setShownReport: shownReport => {
    set(state => ({ ...state, shownReport }));
  },
  setReport: report => {
    set(state => ({ ...state, report }));
  }
}));
