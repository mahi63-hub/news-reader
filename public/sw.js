const CACHE_NAME = "news-reader-v1";
const STATIC_ASSETS = [
  "/news-reader/",
  "/news-reader/index.html",
  "/news-reader/manifest.json"
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching static assets");
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  
  // Cache-first for static assets
  if (url.pathname.includes("/assets/") || STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(cacheFirst(event.request));
  }
  // Network-first for API calls
  else if (url.pathname.includes("/api/")) {
    event.respondWith(networkFirst(event.request));
  }
  // Stale-while-revalidate for images
  else if (url.pathname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
    event.respondWith(staleWhileRevalidate(event.request));
  }
  // Network-first with cache fallback for everything else
  else {
    event.respondWith(networkFirst(event.request));
  }
});

// Cache-first strategy
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return new Response("Network error", { status: 408 });
  }
}

// Network-first strategy
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    return new Response("Network error and no cache", { status: 503 });
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  // Return cached version immediately
  const fetchPromise = fetch(request).then(async (response) => {
    if (response.ok) {
      await cache.put(request, response.clone());
    }
    return response;
  }).catch(() => {
    // Ignore fetch errors
  });
  
  return cached || fetchPromise;
}

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-actions") {
    event.waitUntil(syncOfflineActions());
  }
});

async function syncOfflineActions() {
  // Implement background sync logic
  console.log("Syncing offline actions...");
}

// Push notifications
self.addEventListener("push", (event) => {
  const options = {
    body: event.data?.text() || "New news articles available!",
    icon: "/news-reader/icon-192.png",
    badge: "/news-reader/icon-192.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  
  event.waitUntil(
    self.registration.showNotification("News Reader", options)
  );
});
