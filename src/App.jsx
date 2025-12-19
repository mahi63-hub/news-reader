import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import ArticleCard from "./components/ArticleCard";
import NetworkIndicator from "./components/NetworkIndicator";
import CachePanel from "./components/CachePanel";
import { fetchNews, searchNews } from "./lib/api";

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load initial articles
  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async (query = "") => {
    setLoading(true);
    try {
      let data;
      if (query) {
        data = await searchNews(query);
      } else {
        data = await fetchNews();
      }
      setArticles(data.articles || []);
    } catch (error) {
      console.error("Error loading articles:", error);
    }
    setLoading(false);
  };

  const handleSearch = (query) => {
    loadArticles(query);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">News Reader</h1>
          <p className="text-gray-600 text-lg">Offline-First PWA</p>
        </div>

        {/* Network Status */}
        <div className="mb-6">
          <NetworkIndicator />
        </div>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Articles Section */}
          <div className="lg:w-3/4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">All News</h2>
            
            {loading ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading articles...</p>
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-2xl shadow-sm">
                <p className="text-gray-500">No articles found. Try a different search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article, index) => (
                  <ArticleCard key={index} article={article} />
                ))}
              </div>
            )}
          </div>

          {/* Cache Panel Sidebar */}
          <div className="lg:w-1/4">
            <CachePanel />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
