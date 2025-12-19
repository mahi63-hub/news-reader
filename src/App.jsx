import { useState, useEffect } from "react";

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Simulate loading
    setTimeout(() => {
      setMessage("Offline News Reader is Ready!");
    }, 1000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📰 Offline News Reader
          </h1>
          <p className="text-lg text-gray-600 mb-6">{message}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className={`p-6 rounded-xl ${isOnline ? "bg-green-100" : "bg-red-100"}`}>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Network Status:</span>
              <span className={`px-3 py-1 rounded-full ${isOnline ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
                {isOnline ? "🟢 Online" : "🔴 Offline"}
              </span>
            </div>
          </div>

          <div className="bg-blue-100 p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="font-semibold">App Type:</span>
              <span className="px-3 py-1 rounded-full bg-blue-200 text-blue-800">
                📱 Progressive Web App
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Features:</h2>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center">✓</span>
              <span>Works offline with cached articles</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center">✓</span>
              <span>Bookmark articles for later reading</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center">✓</span>
              <span>Install as a native app on your device</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center">✓</span>
              <span>Fast loading with smart caching</span>
            </li>
          </ul>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Built with React + Vite + Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
}

export default App;
