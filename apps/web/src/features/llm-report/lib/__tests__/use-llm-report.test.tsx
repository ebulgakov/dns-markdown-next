import { advanceTimersByTimeAsync } from "@dns-markdown/tests/timers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "bun:test";
import { HttpResponse, delay, http } from "msw";

import { server } from "@/test/msw-server";

import { useLlmStore } from "../../model/llm-store";
import { useLlmReport } from "../use-llm-report";

import type { ReactNode } from "react";

const llmStoreInitialState = useLlmStore.getState();

function renderUseLlmReport() {
  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return renderHook(() => useLlmReport(), { wrapper });
}

// Resolves a pending response from the test once it has checked the in-flight state.
function deferredReport() {
  let release: () => void = () => {};
  const released = new Promise<void>(resolve => {
    release = resolve;
  });
  const handler = http.get("/api/describe-product", async () => {
    await released;
    return HttpResponse.json({ report: "готово" });
  });
  return { handler, release };
}

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

beforeEach(() => {
  useLlmStore.setState(llmStoreInitialState, true);
});

afterEach(() => {
  server.resetHandlers();
  vi.useRealTimers();
});

afterAll(() => {
  server.close();
});

describe("useLlmReport", () => {
  it("compareGoods requests a comparison for the selected links and stores the report", async () => {
    let searchParams: URLSearchParams | undefined;
    server.use(
      http.get("/api/compare-products", ({ request }) => {
        searchParams = new URL(request.url).searchParams;
        return HttpResponse.json({ report: "Товар А выгоднее" });
      })
    );
    const { result } = renderUseLlmReport();

    result.current.compareGoods([
      { link: "/a", sectionTitle: "Ноутбуки" },
      { link: "/b", sectionTitle: "Ноутбуки" }
    ]);

    await waitFor(() => expect(useLlmStore.getState().report).toBe("Товар А выгоднее"));

    // The route handler reads `links[]`: axios' default array serialization.
    expect(searchParams?.getAll("links[]")).toEqual(["/a", "/b"]);
    expect(useLlmStore.getState().shownReport).toBe(true);
    expect(useLlmStore.getState().compareGoodsLinks).toEqual([]);
  });

  it("describeGoods requests a description for a single link and stores the report", async () => {
    let link: string | null | undefined;
    server.use(
      http.get("/api/describe-product", ({ request }) => {
        link = new URL(request.url).searchParams.get("link");
        return HttpResponse.json({ report: "Описание товара" });
      })
    );
    const { result } = renderUseLlmReport();

    result.current.describeGoods({ link: "/a", sectionTitle: "Ноутбуки" });

    await waitFor(() => expect(useLlmStore.getState().report).toBe("Описание товара"));

    expect(link).toBe("/a");
    expect(useLlmStore.getState().shownReport).toBe(true);
  });

  it("clears the previous report as soon as a new request starts", async () => {
    useLlmStore.setState({ report: "старый отчёт" });
    const { handler, release } = deferredReport();
    server.use(handler);
    const { result } = renderUseLlmReport();

    result.current.describeGoods({ link: "/a", sectionTitle: "Ноутбуки" });

    await waitFor(() => expect(useLlmStore.getState().report).toBe(""));

    release();
    await waitFor(() => expect(useLlmStore.getState().report).toBe("готово"));
  });

  it("reports isReportLoading while a request is in flight", async () => {
    const { handler, release } = deferredReport();
    server.use(handler);
    const { result } = renderUseLlmReport();

    expect(result.current.isReportLoading).toBe(false);

    result.current.describeGoods({ link: "/a", sectionTitle: "Ноутбуки" });

    await waitFor(() => expect(result.current.isReportLoading).toBe(true));

    release();
    await waitFor(() => expect(result.current.isReportLoading).toBe(false));
  });

  it("retries a failing request before giving up and shows a friendly error", async () => {
    let attempts = 0;
    server.use(
      http.get("/api/compare-products", async () => {
        attempts++;
        await delay(0);
        return HttpResponse.error();
      })
    );
    vi.useFakeTimers();
    const { result } = renderUseLlmReport();

    result.current.compareGoods([
      { link: "/a", sectionTitle: "Ноутбуки" },
      { link: "/b", sectionTitle: "Ноутбуки" }
    ]);

    await advanceTimersByTimeAsync(10_000);

    expect(useLlmStore.getState().report).toBe(
      "Failed to compare products. Please try again later."
    );
    // 1 initial attempt + 3 retries
    expect(attempts).toBe(4);
  });
});
