import Link from "next/link";
import { Input } from "@/app/components/ui/input";
import { useSearchStore } from "@/app/stores/search-store";
import type { UserSections } from "@/types/user";
import { cn } from "@/app/lib/utils";

type FilterContainerProps = {
  sections?: string[];
  hiddenSections: UserSections;
};

function FilterContainer({ sections, hiddenSections }: FilterContainerProps) {
  const onChange = useSearchStore(state => state.updateSearchTerm);
  const searchTerm = useSearchStore(state => state.searchTerm);

  return (
    <div className="flex h-full flex-col items-start justify-between gap-4 p-4">
      <div>Переход к категории</div>
      <div className="overflow-auto">
        <div>
          {sections?.map(section => (
            <div
              key={section}
              className={cn("py-1", hiddenSections.includes(section) && "text-muted-foreground")}
            >
              <Link href={`#${section}`}>{section}</Link>
            </div>
          ))}
        </div>
      </div>

      <div>
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
  );
}

export { FilterContainer };
