import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import axios from "axios";
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest";

import { useLlmStore } from "../../model/llm-store";
import { useLlmReport } from "../use-llm-report";

import type { ReactNode } from "react";

vi.mock("axios", () => ({
  default: { get: vi.fn() }
}));

const mockedGet = axios.get as Mock;
const llmStoreInitialState = useLlmStore.getState();

function renderUseLlmReport() {
  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return renderHook(() => useLlmReport(), { wrapper });
}

beforeEach(() => {
  useLlmStore.setState(llmStoreInitialState, true);
});

afterEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
});

describe("useLlmReport", () => {
  it("compareGoods requests a comparison for the selected links and stores the report", async () => {
    mockedGet.mockResolvedValueOnce({ data: { report: "Товар А выгоднее" } });
    const { result } = renderUseLlmReport();

    result.current.compareGoods([
      { link: "/a", sectionTitle: "Ноутбуки" },
      { link: "/b", sectionTitle: "Ноутбуки" }
    ]);

    await waitFor(() => expect(useLlmStore.getState().report).toBe("Товар А выгоднее"));

    expect(mockedGet).toHaveBeenCalledWith("/api/compare-products", {
      params: { links: ["/a", "/b"] }
    });
    expect(useLlmStore.getState().shownReport).toBe(true);
    expect(useLlmStore.getState().compareGoodsLinks).toEqual([]);
  });

  it("describeGoods requests a description for a single link and stores the report", async () => {
    mockedGet.mockResolvedValueOnce({ data: { report: "Описание товара" } });
    const { result } = renderUseLlmReport();

    result.current.describeGoods({ link: "/a", sectionTitle: "Ноутбуки" });

    await waitFor(() => expect(useLlmStore.getState().report).toBe("Описание товара"));

    expect(mockedGet).toHaveBeenCalledWith("/api/describe-product", { params: { link: "/a" } });
    expect(useLlmStore.getState().shownReport).toBe(true);
  });

  it("clears the previous report as soon as a new request starts", async () => {
    useLlmStore.setState({ report: "старый отчёт" });
    let resolveRequest: (value: { data: { report: string } }) => void = () => {};
    mockedGet.mockReturnValueOnce(
      new Promise(resolve => {
        resolveRequest = resolve;
      })
    );
    const { result } = renderUseLlmReport();

    result.current.describeGoods({ link: "/a", sectionTitle: "Ноутбуки" });

    await waitFor(() => expect(useLlmStore.getState().report).toBe(""));

    resolveRequest({ data: { report: "готово" } });
    await waitFor(() => expect(useLlmStore.getState().report).toBe("готово"));
  });

  it("reports isReportLoading while a request is in flight", async () => {
    let resolveRequest: (value: { data: { report: string } }) => void = () => {};
    mockedGet.mockReturnValueOnce(
      new Promise(resolve => {
        resolveRequest = resolve;
      })
    );
    const { result } = renderUseLlmReport();

    expect(result.current.isReportLoading).toBe(false);

    result.current.describeGoods({ link: "/a", sectionTitle: "Ноутбуки" });

    await waitFor(() => expect(result.current.isReportLoading).toBe(true));

    resolveRequest({ data: { report: "готово" } });
    await waitFor(() => expect(result.current.isReportLoading).toBe(false));
  });

  it("retries a failing request before giving up and shows a friendly error", async () => {
    vi.useFakeTimers();
    mockedGet.mockRejectedValue(new Error("network error"));
    const { result } = renderUseLlmReport();

    result.current.compareGoods([
      { link: "/a", sectionTitle: "Ноутбуки" },
      { link: "/b", sectionTitle: "Ноутбуки" }
    ]);

    await vi.advanceTimersByTimeAsync(10_000);

    expect(useLlmStore.getState().report).toBe(
      "Failed to compare products. Please try again later."
    );
    // 1 initial attempt + 3 retries
    expect(mockedGet).toHaveBeenCalledTimes(4);
  });
});
