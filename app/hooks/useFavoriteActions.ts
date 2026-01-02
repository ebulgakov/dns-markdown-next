import axios, { type AxiosError } from "axios";
import { Goods } from "@/types/pricelist";

export const useFavoriteActions = (goods: Goods) => {
  const removeFromFavorites = async (): Promise<boolean> => {
    let removed = false;

    try {
      const { data } = await axios.delete("/api/favorites", {
        data: { link: goods.link },
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        }
      });

      if (data.success) {
        removed = true;
      }
    } catch (e) {
      const error = e as AxiosError;
      if (error.response) {
        const { error: err } = error.response.data as { error: string };
        throw new Error(err);
      } else {
        throw new Error("An unexpected error occurred", { cause: e });
      }
    }

    return removed;
  };

  const addToFavorites = async (): Promise<boolean> => {
    let added = false;

    try {
      const { data } = await axios.post(
        "/api/favorites",
        { goods },
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8"
          }
        }
      );

      if (data.success) {
        added = true;
      }
    } catch (e) {
      const error = e as AxiosError;
      if (error.response) {
        const { error: err } = error.response.data as { error: string };
        throw new Error(err);
      } else {
        throw new Error("An unexpected error occurred", { cause: e });
      }
    }

    return added;
  };

  return { addToFavorites, removeFromFavorites };
};
