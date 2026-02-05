import { cookies } from "next/headers";
import { z } from "zod";

import { Favorite, User } from "@/types/user";

import type { SectionsResponse } from "@/api/user";

const goodsSchema = z.object({
  _id: z.string(),
  title: z.string(),
  link: z.string(),
  description: z.string(),
  reasons: z.array(
    z.object({
      _id: z.string(),
      label: z.string(),
      text: z.string()
    })
  ),
  priceOld: z.string(),
  price: z.string(),
  profit: z.string(),
  code: z.string(),
  image: z.string(),
  available: z.string(),
  city: z.string().optional()
});

const guestSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  city: z.string(),
  favorites: z.array(
    z.object({
      item: goodsSchema,
      status: z.object({
        deleted: z.boolean(),
        createdAt: z.string()
      })
    })
  ),
  hiddenSections: z.array(z.string()),
  favoriteSections: z.array(z.string()),
  notifications: z.object({
    updates: z.object({
      enabled: z.boolean()
    })
  }),
  shownBoughtFavorites: z.boolean()
});

export const getGuest = async (): Promise<User> => {
  const defaultGuest: User = {
    _id: "0",
    userId: "0",
    email: "guest@example.com",
    city: "samara",
    favorites: [],
    notifications: { updates: { enabled: false } },
    hiddenSections: [],
    favoriteSections: [],
    shownBoughtFavorites: true
  };

  const cookieStore = await cookies();
  const guestSource = cookieStore.get("guest");

  if (!guestSource) {
    console.log("No guest cookie found, returning default guest.");
    return defaultGuest;
  }

  const validationResult = guestSchema.safeParse(JSON.parse(guestSource.value));

  if (!validationResult.success) {
    console.log("Guest cookie validation failed, returning default guest.", validationResult.error);
    return defaultGuest;
  }

  return validationResult.data as unknown as User;
};

export const setGuest = async (guest: User) => {
  const cookieStore = await cookies();
  cookieStore.set("guest", JSON.stringify(guest));
};

export const addToHiddenSections = async (title: string): Promise<SectionsResponse> => {
  const guest = await getGuest();
  if (!guest.hiddenSections.includes(title)) {
    guest.hiddenSections.push(title);
    await setGuest(guest);
  }

  return {
    message: "OK",
    sections: guest.hiddenSections
  };
};

export const removeFromHiddenSections = async (title: string): Promise<SectionsResponse> => {
  const guest = await getGuest();
  guest.hiddenSections = guest.hiddenSections.filter(section => section !== title);
  await setGuest(guest);

  return {
    message: "OK",
    sections: guest.hiddenSections
  };
};

export const addToFavoriteSections = async (title: string) => {
  const guest = await getGuest();
  if (!guest.favoriteSections.includes(title)) {
    guest.favoriteSections.push(title);
    await setGuest(guest);
  }

  return {
    message: "OK",
    sections: guest.favoriteSections
  };
};

export const removeFromFavoriteSections = async (title: string) => {
  const guest = await getGuest();
  guest.favoriteSections = guest.favoriteSections.filter(section => section !== title);
  await setGuest(guest);

  return {
    message: "OK",
    sections: guest.favoriteSections
  };
};

export const addToFavorites = async (product: z.infer<typeof goodsSchema>) => {
  const guest = await getGuest();
  if (!guest.favorites.some(fav => fav.item.link === product.link)) {
    const newFavorite: Favorite = {
      id: `${Date.now()}`,
      item: product,
      status: { deleted: false, createdAt: `${new Date()}`, updatedAt: `${new Date()}` }
    };

    guest.favorites.push(newFavorite);
    await setGuest(guest);

    return {
      message: "OK",
      sections: guest.favorites
    };
  }
};

export const removeFromFavorites = async (link: string) => {
  const guest = await getGuest();
  guest.favorites = guest.favorites.filter(fav => fav.item.link !== link);
  await setGuest(guest);

  return {
    message: "OK",
    sections: guest.favorites
  };
};

export const toggleShownBoughtFavorites = async (
  shownBoughtFavorites: boolean
): Promise<{
  message: string;
  shownBoughtFavorites: boolean;
}> => {
  const guest = await getGuest();
  guest.shownBoughtFavorites = shownBoughtFavorites;
  await setGuest(guest);

  return {
    message: "OK",
    shownBoughtFavorites: guest.shownBoughtFavorites
  };
};
