"use client";

import { useSearchStore } from "@/app/stores/search-store";
import { useState } from "react";
import clsx from "clsx";
import { Search, X } from "lucide-react";
import { Input } from "@/app/components/ui/input";

function SearchInput() {
  const [hidden, setHidden] = useState<boolean>(true);
  const onChange = useSearchStore(state => state.updateSearchTerm);
  const searchTerm = useSearchStore(state => state.searchTerm);

  return (
    <>
      {!hidden && (
        <div
          className={clsx(
            "fixed left-0 right-0 py-5 px-22 bottom-0 z-10 bg-white border-t border-gray-200",
            {
              hidden: hidden
            }
          )}
        >
          <div className="md:container mx-auto">
            <Input
              autoFocus={true}
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
        onClick={() => setHidden(!hidden)}
        type="button"
        aria-label={`Search ${hidden}`}
        name="toggle-visibility"
        className="fixed right-3 bottom-3 size-14 z-20 p-4 bg-orange-400 text-white rounded-full cursor-pointer hover:bg-orange-500 "
      >
        {hidden ? <Search /> : <X />}
      </button>
    </>
  );
}

export { SearchInput };
