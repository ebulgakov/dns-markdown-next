import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persist, createJSONStorage } from "zustand/middleware";

type SearchStore = {
  searchTerm: string;
  updateSearchTerm: (term: string) => void;
};
export const useSearchStore = create<SearchStore>()(
  persist(
    set => ({
      searchTerm: "",
      updateSearchTerm: (term: string) => {
        set(state => ({ ...state, searchTerm: term }));
      }
    }),
    {
      name: "search-store",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
