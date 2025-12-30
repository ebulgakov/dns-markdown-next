"use client";
import { useSearchStore } from "@/app/stores/searchStore";

export default function SearchInput() {
  const onChange = useSearchStore(state => state.updateSearchTerm);
  const searchTerm = useSearchStore(state => state.searchTerm);

  return (
    <div className="fixed left-0 right-0 bottom-0 z-10 bg-white p-5 border-t border-gray-200">
      <input
        type="search"
        value={searchTerm}
        className="block w-full rounded-md border-2 border-blue-400 p-2 focus:border-blue-500 disabled:border-blue-300 disabled:bg-blue-50"
        onChange={e => onChange(e.target.value)}
        placeholder="Поиск по названию товара..."
      />
    </div>
  );
}
