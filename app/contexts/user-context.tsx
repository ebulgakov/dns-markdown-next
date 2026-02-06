"use client";

import { createContext, type ReactNode, startTransition, useOptimistic } from "react";

import {
  postAddToFavoriteSections,
  postAddToHiddenSections,
  postRemoveFromFavoriteSection,
  postRemoveFromHiddenSections
} from "@/api/post";

import type { Favorite, UserSections } from "@/types/user";

type FilterContextType = {
  hiddenSections: UserSections;
  favoriteSections: UserSections;
  favorites: Favorite[];
  onToggleHiddenSection?: (title: string) => void;
  onToggleFavoriteSection?: (title: string) => void;
  onFavorite?: (title: string) => void;
};

const UserContext = createContext<FilterContextType>({
  hiddenSections: [],
  favoriteSections: [],
  favorites: [],
  onToggleHiddenSection: () => {},
  onToggleFavoriteSection: () => {},
  onFavorite: () => {}
});

export function UserProvider({
  children,
  value
}: {
  children: ReactNode;
  value: FilterContextType;
}) {
  const [optimisticHiddenSections, setOptimisticHiddenSection] = useOptimistic(
    value.hiddenSections,
    (state: string[], title: string) =>
      state.includes(title) ? state.filter(section => section !== title) : [...state, title]
  );

  const [optimisticFavoriteSections, setOptimisticFavoriteSection] = useOptimistic(
    value.favoriteSections,
    (state: string[], title: string) =>
      state.includes(title) ? state.filter(section => section !== title) : [...state, title].sort()
  );

  const onToggleHiddenSection = (title: string) => {
    startTransition(async () => {
      setOptimisticHiddenSection(title);

      try {
        const isCurrentlyHidden = optimisticHiddenSections.includes(title);

        let result;
        if (isCurrentlyHidden) {
          result = await postRemoveFromHiddenSections(title);
        } else {
          result = await postAddToHiddenSections(title);
        }
      } catch (error) {
        console.error("Failed to update hidden sections:", error);
      }
    });
  };

  const onToggleFavoriteSection = (title: string) => {
    startTransition(async () => {
      setOptimisticFavoriteSection(title);

      try {
        const isCurrentlyFavorite = optimisticFavoriteSections.includes(title);

        if (isCurrentlyFavorite) {
          await postRemoveFromFavoriteSection(title);
        } else {
          await postAddToFavoriteSections(title);
        }
      } catch (error) {
        console.error("Failed to update favorite sections:", error);
      }
    });
  };

  const contextValue: FilterContextType = {
    ...value,
    hiddenSections: optimisticHiddenSections,
    favoriteSections: optimisticFavoriteSections,
    onToggleHiddenSection,
    onToggleFavoriteSection
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
}

export { UserContext };
