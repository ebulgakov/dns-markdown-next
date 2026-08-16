import { afterEach, describe, expect, it } from "vitest";

import { useLlmStore } from "../llm-store";

const initialState = useLlmStore.getState();

afterEach(() => {
  useLlmStore.setState(initialState, true);
});

describe("useLlmStore", () => {
  it("starts with an empty report and no compare links", () => {
    const state = useLlmStore.getState();
    expect(state.report).toBe("");
    expect(state.shownReport).toBe(false);
    expect(state.compareGoodsLinks).toEqual([]);
  });

  describe("updateCompareGoodsLinks", () => {
    it("adds a link that is not already selected", () => {
      useLlmStore.getState().updateCompareGoodsLinks({ link: "/a", sectionTitle: "Ноутбуки" });

      expect(useLlmStore.getState().compareGoodsLinks).toEqual([
        { link: "/a", sectionTitle: "Ноутбуки" }
      ]);
    });

    it("removes a link that is already selected (toggle off)", () => {
      useLlmStore.setState({ compareGoodsLinks: [{ link: "/a", sectionTitle: "Ноутбуки" }] });

      useLlmStore.getState().updateCompareGoodsLinks({ link: "/a", sectionTitle: "Ноутбуки" });

      expect(useLlmStore.getState().compareGoodsLinks).toEqual([]);
    });

    it("appends to existing links instead of replacing them", () => {
      useLlmStore.setState({ compareGoodsLinks: [{ link: "/a", sectionTitle: "Ноутбуки" }] });

      useLlmStore.getState().updateCompareGoodsLinks({ link: "/b", sectionTitle: "Ноутбуки" });

      expect(useLlmStore.getState().compareGoodsLinks).toEqual([
        { link: "/a", sectionTitle: "Ноутбуки" },
        { link: "/b", sectionTitle: "Ноутбуки" }
      ]);
    });
  });

  it("setCompareGoodsLinks replaces the whole selection", () => {
    useLlmStore.setState({ compareGoodsLinks: [{ link: "/a", sectionTitle: "Ноутбуки" }] });

    useLlmStore.getState().setCompareGoodsLinks([{ link: "/c", sectionTitle: "Смартфоны" }]);

    expect(useLlmStore.getState().compareGoodsLinks).toEqual([
      { link: "/c", sectionTitle: "Смартфоны" }
    ]);
  });

  it("setReport stores the report text", () => {
    useLlmStore.getState().setReport("Товар А лучше по цене");

    expect(useLlmStore.getState().report).toBe("Товар А лучше по цене");
  });

  it("setShownReport toggles report visibility", () => {
    useLlmStore.getState().setShownReport(true);
    expect(useLlmStore.getState().shownReport).toBe(true);

    useLlmStore.getState().setShownReport(false);
    expect(useLlmStore.getState().shownReport).toBe(false);
  });

  it("clearReport resets the report and hides it, but keeps compare links untouched", () => {
    useLlmStore.setState({
      report: "some report",
      shownReport: true,
      compareGoodsLinks: [{ link: "/a", sectionTitle: "Ноутбуки" }]
    });

    useLlmStore.getState().clearReport();

    const state = useLlmStore.getState();
    expect(state.report).toBe("");
    expect(state.shownReport).toBe(false);
    expect(state.compareGoodsLinks).toEqual([{ link: "/a", sectionTitle: "Ноутбуки" }]);
  });
});
