import { createContext, useState, useEffect, useCallback } from "react";
import { Workbox } from "workbox-window";

export const CacheContext = createContext();

export function CacheProvider({ children }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cacheStatus, setCacheStatus] = useState({});
  const [syncQueue, setSyncQueue] = useState([]);
  const [workbox, setWorkbox] = useState(null);

  // Initialize Workbox
  useEffect(() => {
    if ("serviceWorker" in navigator && import.meta.env.PROD) {
      const wb = new Workbox("/sw.js");
      setWorkbox(wb);
      
      wb.register().then((registration) => {
        console.log("Service Worker registered:", registration);
      }).catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
    }
  }, []);

  // Network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Update cache status
  const updateCacheStatus = useCallback((url, isCached) => {
    setCacheStatus(prev => ({
      ...prev,
      [url]: isCached
    }));
  }, []);

  // Add to sync queue
  const addToSyncQueue = useCallback((action) => {
    setSyncQueue(prev => [...prev, { ...action, timestamp: Date.now() }]);
  }, []);

  // Process sync queue when online
  useEffect(() => {
    if (isOnline && syncQueue.length > 0) {
      const processQueue = async () => {
        const successful = [];
        const failed = [];
        
        for (const action of syncQueue) {
          try {
            // Implement actual sync logic here
            console.log("Syncing:", action);
            successful.push(action);
          } catch (error) {
            failed.push(action);
          }
        }
        
        // Remove successfully synced items
        if (successful.length > 0) {
          setSyncQueue(prev => 
            prev.filter(item => 
              !successful.some(s => s.timestamp === item.timestamp)
            )
          );
        }
      };
      
      processQueue();
    }
  }, [isOnline, syncQueue]);

  // Clear cache
  const clearCache = useCallback(async () => {
    try {
      const cache = await caches.open("news-reader-v1");
      const keys = await cache.keys();
      await Promise.all(keys.map(key => cache.delete(key)));
      setCacheStatus({});
      return true;
    } catch (error) {
      console.error("Failed to clear cache:", error);
      return false;
    }
  }, []);

  const value = {
    isOnline,
    cacheStatus,
    syncQueue,
    workbox,
    updateCacheStatus,
    addToSyncQueue,
    clearCache
  };

  return (
    <CacheContext.Provider value={value}>
      {children}
    </CacheContext.Provider>
  );
}
