import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest";

import { useCatalogVirtualizer } from "../use-catalog-virtualizer";

import type { VisualizationGoods, VisualizationOutputList } from "@/types/visualization";
import type { RefObject } from "react";

vi.mock("@tanstack/react-virtual", () => ({
  useWindowVirtualizer: vi.fn()
}));

const mockedUseWindowVirtualizer = useWindowVirtualizer as Mock;
const emptyRef = { current: null } as RefObject<HTMLDivElement | null>;

const goods = (id: string): VisualizationGoods => ({
  _id: id,
  title: `Товар ${id}`,
  link: `/${id}`,
  description: "",
  reasons: [],
  priceOld: "0",
  price: "0",
  profit: "0",
  code: "",
  image: "",
  available: "1",
  type: "goods",
  sectionTitle: "Ноутбуки",
  titleInvertTranslation: ""
});

const flattenList: VisualizationOutputList = [
  { type: "header", title: "Ноутбуки", itemsCount: 2 },
  goods("1"),
  goods("2"),
  { type: "title", category: "favorite" }
];

let currentUnmount: (() => void) | undefined;

function renderVirtualizer(withStickySearch = false) {
  let options: Record<string, unknown> = {};
  mockedUseWindowVirtualizer.mockImplementation(opts => {
    options = opts;
    return { getOffsetForIndex: vi.fn().mockReturnValue([500, 700]) };
  });

  const view = renderHook(() =>
    useCatalogVirtualizer({ flattenList, listRef: emptyRef, withStickySearch })
  );
  currentUnmount = view.unmount;

  return { ...view, getOptions: () => options };
}

beforeEach(() => {
  // Fake timers must be active before the hook's effect runs, otherwise its
  // internal setTimeout is a real timer that can fire after this test (and
  // jsdom) has already been torn down, throwing "window is not defined".
  vi.useFakeTimers();
  window.scrollTo = vi.fn();
  window.location.hash = "";
});

afterEach(() => {
  // Unmount so the hook's effect cleanup clears any pending timeout/listener
  // before we switch timer implementations.
  currentUnmount?.();
  currentUnmount = undefined;
  vi.clearAllMocks();
  vi.useRealTimers();
});

describe("useCatalogVirtualizer", () => {
  it("passes item count and per-type size estimates to the virtualizer", () => {
    const { getOptions } = renderVirtualizer();
    const options = getOptions() as { count: number; estimateSize: (i: number) => number };

    expect(options.count).toBe(flattenList.length);
    expect(options.estimateSize(0)).toBe(60); // header
    expect(options.estimateSize(1)).toBe(220); // goods
  });

  it("derives a stable key per item type, falling back to the index for out-of-range items", () => {
    const { getOptions } = renderVirtualizer();
    const options = getOptions() as { getItemKey: (i: number) => string | number };

    expect(options.getItemKey(0)).toBe("header-Ноутбуки");
    expect(options.getItemKey(1)).toBe("1");
    expect(options.getItemKey(3)).toBe("title-favorite");
    expect(options.getItemKey(99)).toBe(99);
  });

  it("scrolls to the matching header when the URL hash matches a section title", async () => {
    window.location.hash = "#Ноутбуки";

    renderVirtualizer();
    await vi.advanceTimersByTimeAsync(100);

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 454 }); // 500 + 0 - 56 + 10
  });

  it("doubles the nav-height offset when a sticky search bar is also present", async () => {
    window.location.hash = "#Ноутбуки";

    renderVirtualizer(true);
    await vi.advanceTimersByTimeAsync(100);

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 398 }); // 500 + 0 - 112 + 10
  });

  it("does not scroll when the hash does not match any section", async () => {
    window.location.hash = "#DoesNotExist";

    renderVirtualizer();
    await vi.advanceTimersByTimeAsync(100);

    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it("stops re-checking the scroll position once the hash is cleared", async () => {
    window.location.hash = "#Ноутбуки";

    renderVirtualizer();
    await vi.advanceTimersByTimeAsync(100);
    await vi.advanceTimersByTimeAsync(100);
    const callsAfterSettling = (window.scrollTo as Mock).mock.calls.length;
    expect(window.location.hash).toBe("");

    await vi.advanceTimersByTimeAsync(1000);
    expect(window.scrollTo).toHaveBeenCalledTimes(callsAfterSettling);
  });
});
