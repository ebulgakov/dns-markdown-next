import { renderHook, act } from "@testing-library/react";
import axios from "axios";
import { useFavoriteActions } from "../useFavoriteActions";
import { Goods } from "@/types/pricelist";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock goods data
const mockGoods: Goods = {
  _id: "1",
  link: "/product/1",
  image: "image.jpg",
  title: "Test Product",
  price: "100",
  city: "Test City",
  description: "",
  reasons: [],
  priceOld: "",
  profit: "",
  code: "",
  available: ""
};

describe("useFavoriteActions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("addToFavorites", () => {
    it("should add an item to favorites and return true on success", async () => {
      // Mock the successful API response
      mockedAxios.post.mockResolvedValue({ data: { success: true } });

      const { result } = renderHook(() => useFavoriteActions(mockGoods));
      let added: boolean = false;
      await act(async () => {
        added = await result.current.addToFavorites();
      });

      // Expect axios.post to have been called with the correct data
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "/api/favorites",
        { goods: mockGoods },
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8"
          }
        }
      );

      // Expect the function to return true
      expect(added).toBe(true);
    });

    it("should throw an error when the API call fails", async () => {
      const errorMessage = "Failed to add";
      // Mock the failed API response
      mockedAxios.post.mockRejectedValue({
        response: { data: { error: errorMessage } }
      });

      const { result } = renderHook(() => useFavoriteActions(mockGoods));

      // Expect the function to throw an error
      await act(async () => {
        await expect(result.current.addToFavorites()).rejects.toThrow(errorMessage);
      });
    });

    it("should throw a generic error for unexpected issues", async () => {
      const genericError = "An unexpected error occurred";
      // Mock a generic error
      mockedAxios.post.mockRejectedValue(new Error("Network Error"));

      const { result } = renderHook(() => useFavoriteActions(mockGoods));

      // Expect the function to throw a generic error
      await act(async () => {
        await expect(result.current.addToFavorites()).rejects.toThrow(genericError);
      });
    });
  });

  describe("removeFromFavorites", () => {
    it("should remove an item from favorites and return true on success", async () => {
      // Mock the successful API response
      mockedAxios.delete.mockResolvedValue({ data: { success: true } });

      const { result } = renderHook(() => useFavoriteActions(mockGoods));
      let removed: boolean = false;
      await act(async () => {
        removed = await result.current.removeFromFavorites();
      });

      // Expect axios.delete to have been called with the correct data
      expect(mockedAxios.delete).toHaveBeenCalledWith("/api/favorites", {
        data: { link: mockGoods.link },
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        }
      });

      // Expect the function to return true
      expect(removed).toBe(true);
    });

    it("should throw an error when the API call fails", async () => {
      const errorMessage = "Failed to remove";
      // Mock the failed API response
      mockedAxios.delete.mockRejectedValue({
        response: { data: { error: errorMessage } }
      });

      const { result } = renderHook(() => useFavoriteActions(mockGoods));

      // Expect the function to throw an error
      await act(async () => {
        await expect(result.current.removeFromFavorites()).rejects.toThrow(errorMessage);
      });
    });

    it("should throw a generic error for unexpected issues", async () => {
      const genericError = "An unexpected error occurred";
      // Mock a generic error
      mockedAxios.delete.mockRejectedValue(new Error("Network Error"));

      const { result } = renderHook(() => useFavoriteActions(mockGoods));

      // Expect the function to throw a generic error
      await act(async () => {
        await expect(result.current.removeFromFavorites()).rejects.toThrow(genericError);
      });
    });
  });
});
