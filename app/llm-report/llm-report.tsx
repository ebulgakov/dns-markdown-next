"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@/app/components/ui/button";
import { useLlmStore } from "@/app/stores/llm-store";

import cssModule from "./llm-report.module.css";

function LllmReport() {
  const { llmReport, setReport } = useLlmStore(
    useShallow(state => ({
      llmReport: state.report,
      setReport: state.setReport
    }))
  );

  useEffect(() => {
    if (llmReport) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [llmReport]);

  if (!llmReport) return null;

  return (
    <div className="bg-background fixed right-0 bottom-0 left-0 z-20 max-h-full overflow-auto px-4">
      <Button
        variant="secondary"
        className="fixed top-4 right-4"
        size="icon"
        type="button"
        onClick={() => setReport("")}
      >
        <X />
      </Button>
      <div className="mx-auto md:container">
        <div className={cssModule.textWrapper}>
          <ReactMarkdown>{llmReport}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export { LllmReport };
