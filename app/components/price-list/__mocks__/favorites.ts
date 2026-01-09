import type { Favorite } from "@/types/user";

export const mockFavorites: Favorite[] = [
  {
    id: "fav1",
    item: {
      _id: "g1",
      code: "123",
      title: "Ноутбук Apple MacBook Air",
      price: "99999",
      link: "#",
      description: "",
      reasons: [],
      priceOld: "",
      profit: "",
      image: "https://placehold.co/400",
      available: "В наличии"
    },
    status: {
      city: "Москва",
      updatedAt: new Date(),
      createdAt: new Date(),
      deleted: false,
      updates: []
    }
  }
];
