"use client";

import clsx from "clsx";
import { Search, X } from "lucide-react";
import { useState } from "react";

import { Input } from "@/app/components/ui/input";
import { sendGAEvent } from "@/app/lib/sendGAEvent";
import { useSearchStore } from "@/app/stores/search-store";

function SearchInput() {
  const [hidden, setHidden] = useState<boolean>(true);
  const onChange = useSearchStore(state => state.updateSearchTerm);
  const searchTerm = useSearchStore(state => state.searchTerm);

  const handleSearchVisibility = () => {
    onChange("");
    setHidden(!hidden);

    sendGAEvent({
      event: "toggle_click",
      value: !hidden ? "show" : "hide",
      category: "SearchInput",
      action: "click"
    });
  };

  return (
    <>
      {!hidden && (
        <div
          className={clsx(
            "dark:bg-background fixed right-0 bottom-0 left-0 z-10 border-t border-gray-200 bg-white py-5 pr-22 pl-4 lg:pl-22",
            {
              hidden: hidden
            }
          )}
        >
          <div className="mx-auto md:container">
            <Input
              inputSize="lg"
              role="search"
              type="search"
              value={searchTerm}
              onChange={e => onChange(e.target.value)}
              placeholder="Поиск по названию товара..."
            />
          </div>
        </div>
      )}
      <button
        onClick={handleSearchVisibility}
        type="button"
        aria-label={`Search ${hidden}`}
        name="toggle-visibility"
        className="fixed right-3 bottom-3 z-20 size-14 cursor-pointer rounded-full bg-orange-400 p-4 text-white hover:bg-orange-500"
      >
        {hidden ? <Search /> : <X />}
      </button>
    </>
  );
}

export { SearchInput };
