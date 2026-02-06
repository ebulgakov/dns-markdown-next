import { X, Funnel } from "lucide-react";

import { Button } from "@/app/components/ui/button";

type FilterToggleProps = {
  isActive?: boolean;
  onToggle?: () => void;
};
function FilterToggle({ isActive, onToggle }: FilterToggleProps) {
  return (
    <Button
      onClick={onToggle}
      type="button"
      aria-label="Toggle filter visibility"
      name="toggle-visibility"
      variant="secondary"
      size="flex"
      className="rounded-full p-4"
    >
      {isActive ? <X className="size-full" /> : <Funnel className="size-full" />}
    </Button>
  );
}

export { FilterToggle };
