"use client";

import {
  createContext,
  type ReactNode,
  startTransition,
  useOptimistic,
  useEffect,
  useState
} from "react";

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
  const [hiddenSections, setHiddenSections] = useState(value.hiddenSections);
  const [favoriteSections, setFavoriteSections] = useState(value.favoriteSections);

  useEffect(() => {
    setHiddenSections(value.hiddenSections);
  }, [value.hiddenSections]);

  useEffect(() => {
    setFavoriteSections(value.favoriteSections);
  }, [value.favoriteSections]);

  type OptimisticAction = {
    action: "add" | "remove";
    title: string;
  };

  const [optimisticHiddenSections, setOptimisticHiddenSection] = useOptimistic(
    hiddenSections,
    (state: string[], { action, title }: OptimisticAction) => {
      if (action === "remove") return state.filter(section => section !== title);
      return [...state, title];
    }
  );

  const [optimisticFavoriteSections, setOptimisticFavoriteSection] = useOptimistic(
    favoriteSections,
    (state: string[], { action, title }: OptimisticAction) => {
      if (action === "remove") return state.filter(section => section !== title);
      return [...state, title].sort();
    }
  );

  const onToggleHiddenSection = (title: string) => {
    const isCurrentlyHidden = optimisticHiddenSections.includes(title);
    const action = isCurrentlyHidden ? "remove" : "add";

    startTransition(async () => {
      setOptimisticHiddenSection({ action, title });

      try {
        let result;
        if (isCurrentlyHidden) {
          result = await postRemoveFromHiddenSections(title);
        } else {
          result = await postAddToHiddenSections(title);
        }

        if (result?.sections) setHiddenSections(result.sections);
      } catch (error) {
        console.error("Failed to update hidden sections:", error);
      }
    });
  };

  const onToggleFavoriteSection = (title: string) => {
    const isCurrentlyFavorite = optimisticFavoriteSections.includes(title);
    const action = isCurrentlyFavorite ? "remove" : "add";

    startTransition(async () => {
      setOptimisticFavoriteSection({ action, title });

      try {
        let result;
        if (isCurrentlyFavorite) {
          result = await postRemoveFromFavoriteSection(title);
        } else {
          result = await postAddToFavoriteSections(title);
        }

        if (result?.sections) setFavoriteSections(result.sections);
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
    onToggleFavoriteSection,
    onFavorite: value.onFavorite ?? (() => {})
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
}

export { UserContext };
