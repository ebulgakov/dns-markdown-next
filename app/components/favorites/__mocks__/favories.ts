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
      priceOld: "119999",
      profit: "20000",
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
  },
  {
    id: "fav2",
    item: {
      _id: "g2",
      code: "456",
      title: "Смартфон Samsung Galaxy S23",
      price: "79999",
      link: "#",
      description: "",
      reasons: [],
      priceOld: "89999",
      profit: "10000",
      image: "https://placehold.co/400",
      available: "В наличии"
    },
    status: {
      city: "Москва",
      updatedAt: new Date("2024-06-11T10:00:00Z").toISOString(),
      createdAt: new Date("2024-06-02T10:00:00Z").toISOString(),
      deleted: false,
      updates: []
    }
  },
  {
    id: "fav3",
    item: {
      _id: "g3",
      code: "789",
      title: "Планшет Apple iPad Pro",
      price: "129999",
      link: "#",
      description: "",
      reasons: [],
      priceOld: "149999",
      profit: "20000",
      image: "https://placehold.co/400",
      available: "В наличии"
    },
    status: {
      city: "Москва",
      updatedAt: new Date("2024-06-12T10:00:00Z").toISOString(),
      createdAt: new Date("2024-06-03T10:00:00Z").toISOString(),
      deleted: true,
      updates: []
    }
  }
];
