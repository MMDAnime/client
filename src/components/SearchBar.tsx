interface SearchBarProps {
  searchText: string;
  onSearch: (value: string) => void;
}

function SearchBar({ searchText, onSearch }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-xl text-purple-400">
        ⌕
      </span>

      <input
        type="text"
        value={searchText}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Tìm kiếm tên Anime..."
        aria-label="Tìm kiếm Anime"
        className="search-glass w-full rounded-2xl border border-purple-500/25 py-4 pl-14 pr-5 text-base text-white outline-none transition placeholder:text-gray-500 focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10"
      />
    </div>
  );
}

export default SearchBar;
