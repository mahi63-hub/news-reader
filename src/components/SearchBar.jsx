import { Search, X, Filter } from "lucide-react";
import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [isActive, setIsActive] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
    setIsActive(false);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
            isActive ? "text-blue-500" : "text-gray-400"
          }`} />
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsActive(true)}
            onBlur={() => setIsActive(false)}
            placeholder="Search news articles..."
            className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-lg"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
          
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
            disabled={!query.trim()}
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
        
        {/* Filters (optional) */}
        <div className="flex items-center gap-3 mt-3">
          <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
          <div className="text-sm text-gray-500">
            Press Enter to search
          </div>
        </div>
      </form>
    </div>
  );
}
