import { X, Menu } from "lucide-react";

import { Button } from "@/app/components/ui/button";

type JumpToSectionToggleProps = {
  isActive?: boolean;
  onToggle?: () => void;
};
function JumpToSectionToggle({ isActive, onToggle }: JumpToSectionToggleProps) {
  return (
    <Button
      onClick={onToggle}
      type="button"
      aria-label="Скрыть/показать категории
      "
      name="toggle-visibility"
      variant="secondary"
      size="flex"
      className="cursor-pointer rounded-full p-2 md:p-4"
    >
      {isActive ? <X className="size-full" /> : <Menu className="size-full" />}
    </Button>
  );
}

export { JumpToSectionToggle };
