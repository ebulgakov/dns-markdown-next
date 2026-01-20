import { create } from "zustand";

type SearchStore = {
  searchTerm: string;
  updateSearchTerm: (term: string) => void;
};
export const useSearchStore = create<SearchStore>(set => ({
  searchTerm: "",
  updateSearchTerm: (term: string) => {
    set(state => ({ ...state, searchTerm: term }));
  }
}));
