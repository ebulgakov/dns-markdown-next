import { mockFavorites } from "@/app/components/price-list/__mocks__/favorites";

export const defaultContext = {
  hiddenSections: [],
  favoriteSections: [],
  favorites: [],
  onToggleHiddenSection: () => {},
  onToggleFavoriteSection: () => {},
  onFavorite: () => {}
};

export const filledWithFavoritesContext = {
  hiddenSections: [],
  favoriteSections: [],
  favorites: mockFavorites,
  onToggleHiddenSection: () => {},
  onToggleFavoriteSection: () => {},
  onFavorite: () => {}
};

export const filledWithFavoritesSectionsContext = {
  hiddenSections: [],
  favoriteSections: ["Ноутбуки"],
  favorites: [],
  onToggleHiddenSection: () => {},
  onToggleFavoriteSection: () => {},
  onFavorite: () => {}
};

export const filledWithHiddenSectionsContext = {
  hiddenSections: ["Ноутбуки"],
  favoriteSections: [],
  favorites: [],
  onToggleHiddenSection: () => {},
  onToggleFavoriteSection: () => {},
  onFavorite: () => {}
};

export const filledWithHiddenAndFavoritesSectionsContext = {
  hiddenSections: ["Ноутбуки"],
  favoriteSections: ["Смартфоны"],
  favorites: [],
  onToggleHiddenSection: () => {},
  onToggleFavoriteSection: () => {},
  onFavorite: () => {}
};
