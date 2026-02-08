import { useContext } from "react";

import { UserContext } from "@/app/contexts/user-context";
import { cn } from "@/app/lib/utils";
import { useSearchStore } from "@/app/stores/search-store";

type JumpToSectionContainerProps = {
  sections?: string[];
  onClose: () => void;
  foundCount?: number;
};

function JumpToSectionContainer({ sections, onClose }: JumpToSectionContainerProps) {
  const { favoriteSections, hiddenSections, onToggleHiddenSection } = useContext(UserContext);
  const onChange = useSearchStore(state => state.updateSearchTerm);

  const handleScrollToLink = (section: string) => {
    if (hiddenSections.includes(section)) {
      onToggleHiddenSection?.(section);
    }

    onChange("");
    onClose();
    window.location.assign(`#${encodeURIComponent(section)}`);
  };

  return (
    <div className="flex h-full flex-col justify-between gap-4 p-4">
      <div className="text-xl font-medium">Переход к категории</div>
      <div className="overflow-auto">
        <div>
          {sections?.map(section => (
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
