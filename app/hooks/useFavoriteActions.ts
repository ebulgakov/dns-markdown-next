import axios, { type AxiosError } from "axios";
import { Goods } from "@/types/pricelist";

export const useFavoriteActions = (goods: Goods) => {
  const removeFromFavorites = async () => {
    try {
      const { data } = await axios.delete("/api/favorites", {
        data: { link: goods.link },
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        }
      });

      if (!data.success) {
        window.alert(data.error);
        throw new Error("Failed to delete");
      }
    } catch (e) {
      const error = e as AxiosError;
      if (error.response) {
        const { error: err } = error.response.data as { error: string };
        window.alert(err);
      } else {
        window.alert("An unexpected error occurred");
      }
    }
  };

  const addToFavorites = async () => {
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

      if (!data.success) {
        window.alert(data.error);
        throw new Error("Failed to add");
      }
    } catch (e) {
      const error = e as AxiosError;
      if (error.response) {
        const { error: err } = error.response.data as { error: string };
        window.alert(err);
      } else {
        window.alert("An unexpected error occurred");
      }
    }
  };

  return { addToFavorites, removeFromFavorites };
};
