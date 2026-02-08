import { Input } from "@/app/components/ui/input";
import { useSearchStore } from "@/app/stores/search-store";

function Search() {
  const onChange = useSearchStore(state => state.updateSearchTerm);
  const searchTerm = useSearchStore(state => state.searchTerm);

  return (
    <div className="bg-background sticky top-14 z-20 mb-4 flex h-[var(--nav-bar-height)] items-center">
      <Input
        inputSize="xl"
        role="search"
        type="search"
        value={searchTerm}
        onChange={e => {
          window.scrollTo({ top: 0 });
          onChange(e.target.value);
        }}
        placeholder="Быстрый поиск по названию товара"
      />
    </div>
  );
}

export { Search };
