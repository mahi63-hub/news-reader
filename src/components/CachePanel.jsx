import React, { useState, useEffect } from "react";
import { getStorageStats, getBookmarks, clearArticleCache } from "../lib/database";

export default function CachePanel() {
  const [stats, setStats] = useState({ bookmarks: 0, articles: 0, estimatedSize: 0 });
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [storageStats, bookmarkList] = await Promise.all([
        getStorageStats(),
        getBookmarks()
      ]);
      setStats(storageStats);
      setBookmarks(bookmarkList);
    } catch (error) {
      console.error("Error loading cache data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // Refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleClearCache = async () => {
    if (confirm("Clear all cached articles?")) {
      await clearArticleCache();
      await loadData();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Storage & Cache</h3>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-xl">
          <p className="text-sm text-blue-700 mb-1">Bookmarks</p>
          <p className="text-2xl font-bold text-blue-900">{stats.bookmarks}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl">
          <p className="text-sm text-green-700 mb-1">Cached Articles</p>
          <p className="text-2xl font-bold text-green-900">{stats.articles}</p>
        </div>
      </div>

      {/* Size Info */}
      <div className="mb-6">
        <p className="text-gray-600 mb-2">Storage used: <span className="font-medium">{stats.estimatedSize} KB</span></p>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full" 
            style={{ width: `${Math.min(stats.estimatedSize / 10, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Bookmarks List */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-800 mb-3">Recent Bookmarks</h4>
        {loading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : bookmarks.length === 0 ? (
          <p className="text-gray-500 text-sm">No bookmarks yet</p>
        ) : (
          <div className="space-y-3">
            {bookmarks.slice(0, 3).map((bookmark, index) => (
              <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                <div className="text-yellow-500 mr-2">★</div>
                <p className="text-sm text-gray-700 line-clamp-2">{bookmark.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={loadData}
          className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
        >
          Refresh Stats
        </button>
        <button
          onClick={handleClearCache}
          className="w-full px-4 py-2 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors font-medium border border-red-200"
        >
          Clear Article Cache
        </button>
      </div>

      {/* Status */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          {loading ? "Updating..." : "Data updated just now"}
        </p>
      </div>
    </div>
  );
}
