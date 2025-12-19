import React, { useState, useEffect } from "react";
import { addBookmark, removeBookmark, isBookmarked } from "../lib/database";

export default function ArticleCard({ article }) {
  const [bookmarked, setBookmarked] = useState(false);

  // Check if article is bookmarked on load
  useEffect(() => {
    checkBookmarkStatus();
  }, [article.url]);

  const checkBookmarkStatus = async () => {
    const status = await isBookmarked(article.url);
    setBookmarked(status);
  };

  const handleBookmark = async () => {
    if (bookmarked) {
      await removeBookmark(article.url);
      setBookmarked(false);
    } else {
      await addBookmark(article);
      setBookmarked(true);
    }
  };

  const handleReadArticle = () => {
    window.open(article.url, "_blank");
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Article Image */}
      {article.urlToImage && (
        <div className="h-48 overflow-hidden">
          <img
            src={article.urlToImage}
            alt={article.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-6">
        {/* Source & Bookmark */}
        <div className="flex justify-between items-start mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            {article.source?.name || "News"}
          </span>
          <button
            onClick={handleBookmark}
            className={`p-2 rounded-full hover:bg-gray-100 ${
              bookmarked ? "text-yellow-500" : "text-gray-400"
            }`}
            aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            {bookmarked ? "★" : "☆"}
          </button>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          {article.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {article.description}
        </p>

        {/* Author & Time */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
          <span>By {article.author || "Unknown"}</span>
          <span>1 min read</span>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleReadArticle}
            className="px-5 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-md"
          >
            Read full article →
          </button>
          
          <button
            onClick={handleBookmark}
            className={`px-4 py-2 rounded-xl font-medium ${
              bookmarked
                ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {bookmarked ? "Bookmarked" : "Bookmark"}
          </button>
        </div>
      </div>
    </div>
  );
}
