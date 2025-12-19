const CACHE_NAME = "news-reader-v1";
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json"
];

// ... rest of your service worker code ...

const options = {
  body: event.data?.text() || "New news articles available!",
  icon: "./icon-192.png",
  badge: "./icon-192.png",
  vibrate: [100, 50, 100],
  data: {
    dateOfArrival: Date.now(),
    primaryKey: 1
  }
};
