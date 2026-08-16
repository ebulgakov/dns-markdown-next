import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { useLlmStore } from "../model/llm-store";

import type { CompareGoodsLink } from "../model/llm-store";

type LLMReportResponse = { report: string };

const RETRY_COUNT = 3;
const retryDelay = (failureCount: number) => failureCount * 1000;

export function useLlmReport() {
  const setReport = useLlmStore(state => state.setReport);
  const setShownReport = useLlmStore(state => state.setShownReport);
  const setCompareGoodsLinks = useLlmStore(state => state.setCompareGoodsLinks);

  const onReportReady = (report: string) => {
    setReport(report);
    setShownReport(true);
    setCompareGoodsLinks([]);
  };

  const compareMutation = useMutation({
    mutationFn: (links: CompareGoodsLink[]) =>
      axios
        .get<LLMReportResponse>("/api/compare-products", {
          params: { links: links.map(link => link.link) }
        })
        .then(res => res.data.report),
    retry: RETRY_COUNT,
    retryDelay,
    onMutate: () => setReport(""),
    onSuccess: onReportReady,
    onError: () => setReport("Failed to compare products. Please try again later.")
  });

  const describeMutation = useMutation({
    mutationFn: (link: CompareGoodsLink) =>
      axios
        .get<LLMReportResponse>("/api/describe-product", { params: { link: link.link } })
        .then(res => res.data.report),
    retry: RETRY_COUNT,
    retryDelay,
    onMutate: () => setReport(""),
    onSuccess: onReportReady,
    onError: () => setReport("Failed to describe product. Please try again later.")
  });

  return {
    compareGoods: compareMutation.mutate,
    describeGoods: describeMutation.mutate,
    isReportLoading: compareMutation.isPending || describeMutation.isPending
  };
}
