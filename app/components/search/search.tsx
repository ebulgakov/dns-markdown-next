import { Funnel } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/app/components/ui/tooltip";
import { useSearchStore } from "@/app/stores/search-store";

function Search() {
  const onChange = useSearchStore(state => state.updateSearchTerm);
  const searchTerm = useSearchStore(state => state.searchTerm);

  return (
    <div className="bg-background sticky top-14 z-20 mb-4 flex h-[var(--nav-bar-height)] items-center gap-4">
      <div className="flex-1">
        <Input
          inputSize="xl"
          role="search"
          type="search"
          value={searchTerm}
          onChange={e => {
            window.scrollTo({ top: 0 });
            onChange(e.target.value);
          }}
          placeholder="Поиск по названию..."
        />
      </div>

      <div className="size-11">
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Button
                type="button"
                aria-label="Скрыть/показать категории"
                name="toggle-visibility"
                variant="secondary"
                size="flex"
                disabled
                className="cursor-pointer p-2"
              >
                <Funnel className="size-full" />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent side="left">Фильтры ещё в разработке</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

export { Search };
