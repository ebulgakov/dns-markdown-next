"use client";

import { X } from "lucide-react";

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
          data-testid="search-input"
          inputSize="xl"
          role="search"
          type="text"
          value={searchTerm}
          onChange={e => {
            window.scrollTo({ top: 0 });
            onChange(e.target.value);
          }}
          placeholder="Поиск по названию..."
        />
      </div>

      {searchTerm.trim().length > 0 && (
        <div className="size-11">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button
                  data-testid="clear-search-button"
                  type="button"
                  aria-label="Очистить поиск"
                  onClick={() => {
                    window.scrollTo({ top: 0 });
                    onChange("");
                  }}
                  variant="secondary"
                  size="flex"
                  className="cursor-pointer p-2"
                >
                  <X className="size-full" />
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent side="left">Очистить поиск</TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  );
}

export { Search };
