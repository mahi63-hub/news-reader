import { Bookmark, Download, Globe, Clock } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

export default function ArticleCard({ article, isBookmarked, onBookmark, isCached }) {
  const [imageError, setImageError] = useState(false);
  
  const handleBookmark = () => {
    onBookmark(article);
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch {
      return "Recent";
    }
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all duration-300 overflow-hidden">
      {/* Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {article.urlToImage && !imageError ? (
          <img
            src={article.urlToImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
            <Globe className="w-12 h-12 text-gray-400" />
          </div>
        )}
        
        {/* Status badges */}
        <div className="absolute top-3 right-3 flex gap-2">
          {isCached && (
            <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Download className="w-3 h-3" />
              <span>Cached</span>
            </div>
          )}
          <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full">
            {article.source?.name || "News"}
          </span>
          <button
            onClick={handleBookmark}
            className={clsx(
              "p-2 rounded-full transition-colors",
              isBookmarked
                ? "text-yellow-500 bg-yellow-50 hover:bg-yellow-100"
                : "text-gray-400 hover:text-yellow-500 hover:bg-gray-100"
            )}
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark article"}
          >
            <Bookmark className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} />
          </button>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {article.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {article.description || "No description available."}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
          >
            Read full article →
          </a>
          <span className="text-xs text-gray-500">
            {Math.ceil((article.content?.length || 0) / 500) || 3} min read
          </span>
        </div>
      </div>
    </div>
  );
}
