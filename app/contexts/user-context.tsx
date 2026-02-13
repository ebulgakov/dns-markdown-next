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
  postAddToFavorites,
  postAddToFavoriteSections,
  postAddToHiddenSections,
  postRemoveFromFavorites,
  postRemoveFromFavoriteSection,
  postRemoveFromHiddenSections
} from "@/services/post";
import { Goods } from "@/types/pricelist";

import type { Favorite, UserSections } from "@/types/user";

type FilterContextType = {
  hiddenSections: UserSections;
  favoriteSections: UserSections;
  favorites: Favorite[];
  city: string;
  onToggleHiddenSection?: (title: string) => void;
  onToggleFavoriteSection?: (title: string) => void;
  onAddFavorite?: (goods: Goods) => Promise<void>;
  onRemoveFavorite?: (link: string) => Promise<void>;
};

const UserContext = createContext<FilterContextType>({
  hiddenSections: [],
  favoriteSections: [],
  favorites: [],
  city: "",
  onToggleHiddenSection: () => {},
  onToggleFavoriteSection: () => {},
  onAddFavorite: () => Promise.resolve(),
  onRemoveFavorite: () => Promise.resolve()
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
  const [favorites, setFavorites] = useState(value.favorites);

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
      return [...state, title];
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

        if (result?.sections) {
          startTransition(() => {
            setHiddenSections(result.sections);
          });
        }
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

        if (result?.sections) {
          startTransition(() => {
            setFavoriteSections(result.sections);
          });
        }
      } catch (error) {
        console.error("Failed to update favorite sections:", error);
      }
    });
  };

  const onAddFavorite = async (goods: Goods) => {
    try {
      const result = await postAddToFavorites(goods);

      if (result) {
        setFavorites(result.favorites);
      }
    } catch (error) {
      console.error("Failed to add favorite:", error);
      throw error;
    }
  };

  const onRemoveFavorite = async (link: string) => {
    try {
      const result = await postRemoveFromFavorites(link);

      if (result) {
        setFavorites(result.favorites);
      }
    } catch (error) {
      console.error("Failed to remove favorite:", error);
      throw error;
    }
  };

  const contextValue: FilterContextType = {
    ...value,
    favorites,
    hiddenSections: optimisticHiddenSections,
    favoriteSections: optimisticFavoriteSections,
    onToggleHiddenSection,
    onToggleFavoriteSection,
    onAddFavorite,
    onRemoveFavorite
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
}

export { UserContext };
