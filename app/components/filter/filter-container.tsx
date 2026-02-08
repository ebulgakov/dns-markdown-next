import { Search } from "lucide-react";
import { useContext } from "react";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Separator } from "@/app/components/ui/separator";
import { UserContext } from "@/app/contexts/user-context";
import { cn } from "@/app/lib/utils";
import { useSearchStore } from "@/app/stores/search-store";

type FilterContainerProps = {
  sections?: string[];
  onClose: () => void;
  foundCount?: number;
};

function FilterContainer({ sections, onClose }: FilterContainerProps) {
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
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="mb-2 text-xl font-medium">Переход к категории</div>
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
    </div>
  );
}

export { FilterContainer };
