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
      updatedAt: new Date("2024-06-10T10:00:00Z").toISOString(),
      createdAt: new Date("2024-06-01T10:00:00Z").toISOString(),
      deleted: false,
      updates: []
    }
  }
];
