import { useContext } from "react";
import { useShallow } from "zustand/react/shallow";

import { usePriceListStore } from "@/entities/product";
import { UserContext } from "@/entities/user";
import { cn } from "@/shared/lib";

type JumpToSectionContainerProps = {
  onClose: () => void;
  onReset: () => void;
  foundCount?: number;
};

function JumpToSectionContainer({ onClose, onReset }: JumpToSectionContainerProps) {
  const { favoriteSections, hiddenSections, onToggleHiddenSection } = useContext(UserContext);
  const priceListSections = usePriceListStore(
    useShallow(state => state.getPriceListSections(favoriteSections, hiddenSections))
  );

  const handleScrollToLink = (section: string) => {
    if (hiddenSections.includes(section)) {
      onToggleHiddenSection?.(section);
    }

    onReset();
    onClose();
    window.location.assign(`#${encodeURIComponent(section)}`);
  };

  return (
    <div className="flex h-full flex-col justify-between gap-4 p-4">
      <div className="text-xl font-medium">Переход к категории</div>
      <div className="overflow-auto">
        <div>
          {priceListSections.map(section => (
            <div key={section}>
              <a
                href={`#${encodeURIComponent(section)}`}
                className={cn("hover:text-primary block w-full cursor-pointer py-1 text-left", {
                  "text-muted-foreground": hiddenSections.includes(section),
                  "text-favorite-section": favoriteSections.includes(section)
                })}
                onClick={e => {
                  e.preventDefault();
                  handleScrollToLink(section);
                }}
              >
                {section}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { JumpToSectionContainer };
