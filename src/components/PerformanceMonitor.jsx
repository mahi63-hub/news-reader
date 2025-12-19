import { useEffect, useState } from "react";

export default function PerformanceMonitor() {
  const [loadTime, setLoadTime] = useState(0);
  const [cached, setCached] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const simulatedLoadTime = cached ? 120 + Math.random() * 100 : 800 + Math.random() * 400;
      setLoadTime(Math.round(simulatedLoadTime));
    }, 100);

    return () => clearTimeout(timer);
  }, [cached]);

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-6">
      <h3 className="text-xl font-bold text-green-900 mb-4">Performance Metrics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Load Time</span>
            <span className={`text-lg font-bold ${loadTime < 500 ? 'text-green-600' : 'text-amber-600'}`}>
              {loadTime}ms
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full ${loadTime < 300 ? 'bg-green-500' : loadTime < 500 ? 'bg-green-400' : 'bg-amber-400'}`}
              style={{ width: `${Math.min(loadTime / 10, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {loadTime < 500 ? '✓ Meets <500ms target' : 'Working to optimize...'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Cache Status</span>
            <span className="text-lg font-bold text-green-600">Active</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Assets</span>
              <span className="font-medium">92% cached</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Articles</span>
              <span className="font-medium">87% cached</span>
            </div>
            <button 
              onClick={() => setCached(!cached)}
              className="w-full mt-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
            >
              {cached ? 'Simulate First Load' : 'Simulate Cached Load'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
