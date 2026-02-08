import { X, Menu } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/app/components/ui/tooltip";

type JumpToSectionToggleProps = {
  isActive?: boolean;
  onToggle?: () => void;
};
function JumpToSectionToggle({ isActive, onToggle }: JumpToSectionToggleProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={onToggle}
          type="button"
          aria-label="Скрыть/показать категории"
          name="toggle-visibility"
          variant="secondary"
          size="flex"
          className="cursor-pointer rounded-full p-2 md:p-4"
        >
          {isActive ? <X className="size-full" /> : <Menu className="size-full" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left">Быстрый переход к категории</TooltipContent>
    </Tooltip>
  );
}

export { JumpToSectionToggle };
