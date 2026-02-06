import { Search } from "lucide-react";
import Link from "next/link";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Separator } from "@/app/components/ui/separator";
import { cn } from "@/app/lib/utils";
import { useSearchStore } from "@/app/stores/search-store";

import type { UserSections } from "@/types/user";

type FilterContainerProps = {
  sections?: string[];
  hiddenSections: UserSections;
  onClose: () => void;
  foundCount?: number;
};

function FilterContainer({
  sections,
  hiddenSections,
  onClose,
  foundCount = 0
}: FilterContainerProps) {
  const onChange = useSearchStore(state => state.updateSearchTerm);
  const searchTerm = useSearchStore(state => state.searchTerm);

  return (
    <div className="flex h-full flex-col justify-between gap-4 p-4">
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="mb-2 text-xl font-medium">Переход к категории</div>
        <div className="overflow-auto">
          <div>
            {sections?.map(section => (
              <div
                key={section}
                className={cn("py-1", hiddenSections.includes(section) && "text-muted-foreground")}
              >
                <Link
                  onClick={() => {
                    onChange("");
                    onClose();
                  }}
                  href={`#${section}`}
                >
                  {section}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="text-xl font-medium">Поиск по названию товара</div>
        <div className="flex gap-4">
          <Input
            inputSize="lg"
            role="search"
            type="search"
            value={searchTerm}
            onChange={e => onChange(e.target.value)}
            placeholder="Минимум 3 буквы"
          />

          <Button type="button" variant="secondary" size="lg" onClick={onClose}>
            <Search />
          </Button>
        </div>

        <div className="h-6">
          {searchTerm.length >= 3 && <div className="italic">Найдено товаров: {foundCount}</div>}
        </div>
      </div>
    </div>
  );
}

export { FilterContainer };
