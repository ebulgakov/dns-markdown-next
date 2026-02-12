"use client";

import { ChevronDown, X } from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@/app/components/ui/button";
import { useLlmStore } from "@/app/stores/llm-store";

import styles from "./llm-report.module.css";

function LLMReport() {
  const { llmReport, setReport } = useLlmStore(
    useShallow(state => ({
      llmReport: state.report,
      setReport: state.setReport
    }))
  );
  const [shownReport, setShownReport] = useState<boolean>(!!llmReport);

  useEffect(() => {
    if (shownReport) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [shownReport]);

  useEffect(() => {
    if (!llmReport) {
      setShownReport(false);
    } else {
      setShownReport(true);
    }
  }, [llmReport]);

  if (!llmReport) return null;

  if (!shownReport) {
    return (
      <div className="bg-background fixed right-0 bottom-0 left-0 z-10 p-4">
        <div className="absolute inset-0 -z-1 rotate-180 shadow-2xl" />
        <div className="mx-auto flex justify-between md:container">
          <button
            className="flex cursor-pointer items-center gap-2 md:gap-4"
            type="button"
            onClick={() => setShownReport(true)}
          >
            <span className="bg-secondary hover:bg-secondary size-8 rounded-full p-1 text-white">
              <ChevronDown className="size-full rotate-180" />
            </span>
            <b>Раскрыть отчёт</b>
          </button>
          <button
            className="mr-13 flex cursor-pointer items-center gap-2 md:gap-4"
            type="button"
            onClick={() => setReport("")}
          >
            <b>Закрыть</b>
            <span className="bg-secondary hover:bg-secondary size-8 rounded-full p-1 text-white">
              <X className="size-full rotate-180" />
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background fixed inset-0 z-20 max-h-full overflow-auto px-4 py-12">
      <Button
        variant="secondary"
        className="fixed top-4 right-4"
        size="icon"
        type="button"
        onClick={() => setShownReport(false)}
      >
        <ChevronDown />
      </Button>
      <div className="mx-auto md:container">
        <div className={styles.wrapper}>
          <ReactMarkdown
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            remarkPlugins={[remarkGfm]}
            remarkRehypeOptions={{ passThrough: ["link"] }}
          >
            {llmReport}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export { LLMReport };
