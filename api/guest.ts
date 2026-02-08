"use server";

import { Redis } from "@upstash/redis";
import { cookies } from "next/headers";

import { Goods } from "@/types/pricelist";

import type {
  CityStatusResponse,
  FavoritesResponse,
  FavoritesStatusResponse,
  SectionsResponse
} from "@/api/user";
import type { Favorite, User } from "@/types/user";

const GUEST_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
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
  const guestId = cookieStore.get("guestId")?.value;

  if (guestId) {
    const data = await redis.get<User>(`guest:${guestId}`);
    if (data) {
      return data;
    } else {
      return defaultGuest;
    }
  } else {
    return defaultGuest;
  }
};

export const setGuest = async (guest: User) => {
  const cookieStore = await cookies();
  const guestId = cookieStore.get("guestId")?.value;

  if (guestId) {
    await redis.set(`guest:${guestId}`, guest, { ex: GUEST_TTL_SECONDS });
  } else {
    const newGuestId = crypto.randomUUID();
    cookieStore.set("guestId", newGuestId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: GUEST_TTL_SECONDS
    });

    await redis.set(`guest:${newGuestId}`, guest, { ex: GUEST_TTL_SECONDS });
  }
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

export const addToFavorites = async (product: Goods, city: string): Promise<FavoritesResponse> => {
  const guest = await getGuest();
  if (!guest.favorites.some(fav => fav.item.link === product.link)) {
    const newFavorite: Favorite = {
      id: crypto.randomUUID(),
      item: product,
      status: {
        city,
        deleted: false,
        createdAt: `${new Date()}`,
        updatedAt: `${new Date()}`
      }
    };

    guest.favorites.push(newFavorite);
    await setGuest(guest);
  }

  return {
    message: "OK",
    favorites: guest.favorites
  };
};

export const removeFromFavorites = async (link: string): Promise<FavoritesResponse> => {
  const guest = await getGuest();
  guest.favorites = guest.favorites.filter(fav => fav.item.link !== link);
  await setGuest(guest);

  return {
    message: "OK",
    favorites: guest.favorites
  };
};

export const toggleShownBoughtFavorites = async (
  shownBoughtFavorites: boolean
): Promise<FavoritesStatusResponse> => {
  const guest = await getGuest();
  guest.shownBoughtFavorites = shownBoughtFavorites;
  await setGuest(guest);

  return {
    message: "OK",
    shownBoughtFavorites: guest.shownBoughtFavorites
  };
};

export const changeCity = async (city: string): Promise<CityStatusResponse> => {
  const guest = await getGuest();
  guest.city = city;
  await setGuest(guest);

  return {
    message: "OK",
    city: guest.city
  };
};
