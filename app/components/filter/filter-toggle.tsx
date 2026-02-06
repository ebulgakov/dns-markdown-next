import { X, Funnel } from "lucide-react";

type FilterToggleProps = {
  isActive?: boolean;
  onToggle?: () => void;
};
function FilterToggle({ isActive, onToggle }: FilterToggleProps) {
  return (
    <button
      onClick={onToggle}
      type="button"
      aria-label="Toggle filter visibility"
      name="toggle-visibility"
      className="size-full cursor-pointer rounded-full bg-orange-400 p-4 text-white hover:bg-orange-500"
    >
      {isActive ? <X /> : <Funnel />}
    </button>
  );
}

export { FilterToggle };
