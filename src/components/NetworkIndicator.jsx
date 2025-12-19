import { Wifi, WifiOff, RefreshCw, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import clsx from "clsx";

export default function NetworkIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotification, setShowNotification] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowNotification(true);
      setLastSync(new Date());
      setTimeout(() => setShowNotification(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleManualSync = () => {
    // Trigger sync logic here
    setShowNotification(true);
    setLastSync(new Date());
    setTimeout(() => setShowNotification(false), 2000);
  };

  return (
    <div className="relative">
      {/* Notification */}
      {showNotification && (
        <div className="absolute top-12 right-0 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">
              {isOnline ? "Back online! Syncing..." : "Synced offline actions"}
            </span>
          </div>
        </div>
      )}

      {/* Indicator */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleManualSync}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Sync now"
        >
          <RefreshCw className="w-4 h-4 text-gray-600" />
        </button>
        
        <div className={clsx(
          "flex items-center gap-2 px-3 py-2 rounded-full",
          isOnline
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        )}>
          {isOnline ? (
            <Wifi className="w-4 h-4" />
          ) : (
            <WifiOff className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>
        
        {lastSync && (
          <div className="text-xs text-gray-500 hidden md:block">
            Synced: {lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </div>
  );
}
