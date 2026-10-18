import { HttpResponse, http } from "msw";

import { makeAnalysisData, makeAnalysisDiff } from "./fixtures";

// MSW request handlers for apps/web's own `/api/*` route handlers (the BFF the client components
// call). Relative paths match against the current origin, so the same handlers serve
// `setupServer` in bun:test (happy-dom location) and `setupWorker` in Storybook. Pure: no bun:test
// import. Override per test with `server.use(...)`, per story with `parameters.msw`.
export const webApiHandlers = [
  http.get("/api/today-diff", ({ request }) => {
    const city = new URL(request.url).searchParams.get("city") ?? "samara";
    return HttpResponse.json(
      makeAnalysisDiff({
        city,
        newItems: [
          makeAnalysisData({ _id: "new", city, title: "Ноутбук", link: "/product/notebook/" })
        ],
        removedItems: [
          makeAnalysisData({ _id: "removed", city, title: "Смартфон", link: "/product/phone/" })
        ]
      })
    );
  }),
  http.get("/api/compare-products", () => HttpResponse.json({ report: "Сравнение товаров" })),
  http.get("/api/describe-product", () => HttpResponse.json({ report: "Описание товара" }))
];
