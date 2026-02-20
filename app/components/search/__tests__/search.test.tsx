import { cleanup, render, fireEvent, within } from "@testing-library/react";
import { afterEach, describe, it, expect, beforeEach, vi } from "vitest";

import { useSearchStore } from "@/app/stores/search-store";

import { Search } from "../search";

beforeEach(() => {
  useSearchStore.setState({ searchTerm: "" });
  window.scrollTo = vi.fn();
});

afterEach(() => {
  cleanup();
});

function renderSearch() {
  const result = render(<Search />);
  const view = within(result.container);
  return { ...result, view };
}

describe("Search", () => {
  it("renders search input with placeholder", () => {
    const { view } = renderSearch();
    expect(view.getByTestId("search-input")).toBeDefined();
  });

  it("renders search input with role 'search'", () => {
    const { view } = renderSearch();
    expect(view.getByTestId("search-input").getAttribute("role")).toBe("search");
  });

  it("displays the current search term from the store", () => {
    useSearchStore.setState({ searchTerm: "Ноутбук" });
    const { view } = renderSearch();
    expect(view.getByTestId("search-input")).toHaveProperty("value", "Ноутбук");
  });

  it("updates the store when typing in the input", () => {
    const { view } = renderSearch();
    const input = view.getByTestId("search-input");
    fireEvent.change(input, { target: { value: "Смартфон" } });
    expect(useSearchStore.getState().searchTerm).toBe("Смартфон");
  });

  it("scrolls to top when typing", () => {
    const { view } = renderSearch();
    const input = view.getByTestId("search-input");
    fireEvent.change(input, { target: { value: "test" } });
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0 });
  });

  it("does not show the clear button when search term is empty", () => {
    const { view } = renderSearch();
    expect(view.queryByTestId("clear-search-button")).toBeNull();
  });

  it("does not show the clear button when search term contains only spaces", () => {
    useSearchStore.setState({ searchTerm: "   " });
    const { view } = renderSearch();
    expect(view.queryByTestId("clear-search-button")).toBeNull();
  });

  it("shows the clear button when search term is not empty", () => {
    useSearchStore.setState({ searchTerm: "Ноутбук" });
    const { view } = renderSearch();
    expect(view.getByTestId("clear-search-button")).toBeDefined();
  });

  it("clears the search term when the clear button is clicked", () => {
    useSearchStore.setState({ searchTerm: "Ноутбук" });
    const { view } = renderSearch();
    fireEvent.click(view.getByTestId("clear-search-button"));
    expect(useSearchStore.getState().searchTerm).toBe("");
  });

  it("scrolls to top when the clear button is clicked", () => {
    useSearchStore.setState({ searchTerm: "Ноутбук" });
    const { view } = renderSearch();
    fireEvent.click(view.getByTestId("clear-search-button"));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0 });
  });

  it("hides the clear button after clearing the search", () => {
    useSearchStore.setState({ searchTerm: "Ноутбук" });
    const { view } = renderSearch();
    fireEvent.click(view.getByTestId("clear-search-button"));
    expect(view.queryByTestId("clear-search-button")).toBeNull();
  });

  it("allows typing after clearing the search", () => {
    useSearchStore.setState({ searchTerm: "Ноутбук" });
    const { view } = renderSearch();
    fireEvent.click(view.getByTestId("clear-search-button"));
    const input = view.getByTestId("search-input");
    fireEvent.change(input, { target: { value: "Планшет" } });
    expect(useSearchStore.getState().searchTerm).toBe("Планшет");
  });
});
