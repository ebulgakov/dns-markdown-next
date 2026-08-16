import { ChevronUp } from "lucide-react";
import ReactScrollUp from "react-scroll-up";

import { Button } from "@/app/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/app/components/ui/tooltip";
import { cn } from "@/app/lib/utils";

type ScrollToTopProps = {
  variant?: "with-jump-to-search";
};

function ScrollToTop({ variant }: ScrollToTopProps) {
  return (
    <div
      className={cn("fixed right-3 bottom-3 z-11 size-10 md:size-14", {
        "bottom-15 md:bottom-20": variant === "with-jump-to-search"
      })}
    >
      <ReactScrollUp showUnder={160} style={{ position: "static" }}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              aria-label="Scroll to top"
              name="scroll-to-top"
              variant="secondary"
              size="flex"
              className="cursor-pointer rounded-full p-2 md:p-3"
            >
              <ChevronUp className="size-full" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">Наверх</TooltipContent>
        </Tooltip>
      </ReactScrollUp>
    </div>
  );
}

export { ScrollToTop };
