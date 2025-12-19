import { Settings, Database, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Switch from "@radix-ui/react-switch";

export default function CachePanel() {
  const [cacheStats, setCacheStats] = useState({
    total: 0,
    used: 0,
    articles: 0,
    images: 0
  });
  const [autoCache, setAutoCache] = useState(true);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    // Fetch cache statistics
    updateCacheStats();
  }, []);

  const updateCacheStats = async () => {
    // Mock stats - implement actual cache API calls
    setCacheStats({
      total: 50, // MB
      used: 24, // MB
      articles: 156,
      images: 89
    });
  };

  const handleClearCache = async () => {
    setIsClearing(true);
    try {
      // Clear cache logic
      await caches.delete("news-reader-v1");
      await updateCacheStats();
      setTimeout(() => setIsClearing(false), 1000);
    } catch (error) {
      console.error("Failed to clear cache:", error);
      setIsClearing(false);
    }
  };

  const calculatePercentage = () => {
    return Math.round((cacheStats.used / cacheStats.total) * 100);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Cache Settings">
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
          <Dialog.Title className="text-xl font-semibold text-gray-900 mb-2">
            Cache Management
          </Dialog.Title>
          <Dialog.Description className="text-gray-600 mb-6">
            Manage offline storage and caching settings
          </Dialog.Description>

          {/* Storage Usage */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Storage Usage</span>
              </div>
              <span className="text-sm text-gray-500">{cacheStats.used}MB / {cacheStats.total}MB</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${calculatePercentage()}%` }}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{cacheStats.articles}</div>
                <div className="text-sm text-gray-600">Articles</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{cacheStats.images}</div>
                <div className="text-sm text-gray-600">Images</div>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Auto-cache articles</div>
                <div className="text-sm text-gray-500">Cache articles automatically while browsing</div>
              </div>
              <Switch.Root
                checked={autoCache}
                onCheckedChange={setAutoCache}
                className="w-11 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-blue-500"
              >
                <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform duration-100 translate-x-0.5 data-[state=checked]:translate-x-6" />
              </Switch.Root>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                Clearing cache will remove all offline content. Bookmarked articles will be preserved.
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleClearCache}
              disabled={isClearing}
              className="flex-1 bg-red-50 text-red-700 hover:bg-red-100 px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              {isClearing ? "Clearing..." : "Clear Cache"}
            </button>
            
            <Dialog.Close asChild>
              <button className="flex-1 bg-blue-500 text-white hover:bg-blue-600 px-4 py-3 rounded-lg font-medium">
                Done
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
