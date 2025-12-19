import { useState, useEffect, useContext, useCallback } from "react";
import { CacheContext } from "./context/CacheProvider.jsx";
import ArticleCard from "./components/ArticleCard.jsx";
import NetworkIndicator from "./components/NetworkIndicator.jsx";
import SearchBar from "./components/SearchBar.jsx";
import CachePanel from "./components/CachePanel.jsx";
import { fetchNews, searchNews } from "./lib/api.js";
import { getBookmarks, addBookmark, removeBookmark, cacheArticle, getCachedArticles } from "./lib/database.js";
import { Newspaper, Bookmark, RefreshCw, Inbox, Filter } from "lucide-react";

function App() {
  const [articles, setArticles] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pullToRefresh, setPullToRefresh] = useState(false);

  const { cacheStatus, updateCacheStatus, isOnline } = useContext(CacheContext);

  // Initial load
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load bookmarks from IndexedDB
  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [newsData, cachedArticles] = await Promise.all([
        fetchNews(1),
        getCachedArticles()
      ]);
      
      setArticles(newsData.articles || []);
      
      // Update cache status for loaded articles
      const cachedUrls = cachedArticles.map(article => article.url);
      newsData.articles?.forEach(article => {
        updateCacheStatus(article.url, cachedUrls.includes(article.url));
      });
      
      setHasMore((newsData.articles?.length || 0) > 0);
    } catch (error) {
      console.error("Error loading initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadBookmarks = async () => {
    try {
      const savedBookmarks = await getBookmarks();
      setBookmarks(savedBookmarks);
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    }
  };

  const loadArticles = async (pageNum = 1, query = "") => {
    try {
      let data;
      if (query) {
        data = await searchNews(query, pageNum);
      } else {
        data = await fetchNews(pageNum);
      }
      
      if (pageNum === 1) {
        setArticles(data.articles || []);
      } else {
        setArticles(prev => [...prev, ...(data.articles || [])]);
      }
      
      // Cache new articles
      if (data.articles) {
        data.articles.forEach(article => {
          cacheArticle(article);
          updateCacheStatus(article.url, true);
        });
      }
      
      setHasMore((data.articles?.length || 0) > 0);
    } catch (error) {
      console.error("Error loading articles:", error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
    loadArticles(1, query);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await loadArticles(1, searchQuery);
    setRefreshing(false);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadArticles(nextPage, searchQuery);
    }
  };

  const toggleBookmark = async (article) => {
    try {
      const isCurrentlyBookmarked = bookmarks.some(b => b.url === article.url);
      
      if (isCurrentlyBookmarked) {
        await removeBookmark(article.url);
        setBookmarks(prev => prev.filter(b => b.url !== article.url));
      } else {
        const bookmarkedArticle = await addBookmark(article);
        setBookmarks(prev => [...prev, bookmarkedArticle]);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  // Pull to refresh implementation
  useEffect(() => {
    let startY = 0;
    let pullDistance = 0;

    const handleTouchStart = (e) => {
      startY = e.touches[0].clientY;
      pullDistance = 0;
    };

    const handleTouchMove = (e) => {
      if (window.scrollY === 0) {
        pullDistance = e.touches[0].clientY - startY;
        if (pullDistance > 0) {
          e.preventDefault();
          setPullToRefresh(Math.min(pullDistance, 100));
        }
      }
    };

    const handleTouchEnd = async () => {
      if (pullDistance > 60) {
        await handleRefresh();
      }
      setPullToRefresh(0);
    };

    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  // Determine displayed articles
  const displayedArticles = activeTab === "bookmarks" 
    ? bookmarks 
    : articles.filter(article => 
        !searchQuery || 
        article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Infinite scroll observer
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
        !loading &&
        hasMore &&
        activeTab === "all"
      ) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Pull to refresh indicator */}
      {pullToRefresh > 0 && (
        <div 
          className="pull-to-refresh"
          style={{ transform: `translateY(${pullToRefresh}px)` }}
        >
          <RefreshCw className={`w-6 h-6 mr-2 ${pullToRefresh > 60 ? "animate-spin" : ""}`} />
          {pullToRefresh > 60 ? "Refreshing..." : "Pull to refresh"}
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-xl">
                <Newspaper className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">News Reader</h1>
                <p className="text-sm text-gray-500">Offline-first PWA</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <NetworkIndicator />
              <CachePanel />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${
                activeTab === "all" 
                  ? "bg-blue-500 text-white shadow-lg" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span className="font-medium">All News</span>
              {activeTab === "all" && articles.length > 0 && (
                <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                  {articles.length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab("bookmarks")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${
                activeTab === "bookmarks" 
                  ? "bg-blue-500 text-white shadow-lg" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span className="font-medium">Bookmarks</span>
              {bookmarks.length > 0 && (
                <span className={`${activeTab === "bookmarks" ? "bg-white/20" : "bg-blue-500 text-white"} text-xs px-2 py-1 rounded-full`}>
                  {bookmarks.length}
                </span>
              )}
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-2">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Status Indicators */}
        {!isOnline && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Inbox className="w-5 h-5 text-yellow-700" />
              </div>
              <div>
                <p className="font-medium text-yellow-800">You're offline</p>
                <p className="text-sm text-yellow-700">
                  Reading from cache. {bookmarks.length} bookmarked articles available.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Refreshing Indicator */}
        {refreshing && (
          <div className="flex justify-center mb-6">
            <div className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Refreshing articles...</span>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        {displayedArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedArticles.map((article, index) => (
              <ArticleCard
                key={`${article.url}-${index}`}
                article={article}
                isBookmarked={bookmarks.some(b => b.url === article.url)}
                onBookmark={toggleBookmark}
                isCached={cacheStatus[article.url] || false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Newspaper className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-3">
              {activeTab === "bookmarks" ? "No bookmarks yet" : "No articles found"}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {activeTab === "bookmarks"
                ? "Bookmark articles to read them offline later"
                : searchQuery
                ? "Try a different search term or browse all news"
                : "Pull down to refresh or check your connection"}
            </p>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && activeTab === "all" && (
          <div className="flex justify-center my-12">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && activeTab === "all" && !loading && displayedArticles.length > 0 && (
          <div className="flex justify-center mt-10">
            <button
              onClick={loadMore}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-xl hover:shadow-lg transition-all hover:scale-105"
            >
              Load More Articles
            </button>
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{displayedArticles.length}</div>
              <div className="text-sm text-gray-600">Showing</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {isOnline ? "🟢" : "🔴"}
              </div>
              <div className="text-sm text-gray-600">Network</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{bookmarks.length}</div>
              <div className="text-sm text-gray-600">Bookmarks</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">PWA</div>
              <div className="text-sm text-gray-600">Ready</div>
            </div>
          </div>
          
          <div className="text-center mt-8 text-sm text-gray-500">
            <p>
              Offline News Reader • Built with React + Vite • 
              {isOnline ? " 📶 Online Mode" : " 📴 Offline Mode"} • 
              Cache: {Object.keys(cacheStatus).length} items
            </p>
            <p className="mt-2">
              {!isOnline && "🔋 Battery optimized for offline reading"}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
