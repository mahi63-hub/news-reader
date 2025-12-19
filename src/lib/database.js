import { openDB } from "idb";

const DB_NAME = "news-reader-db";
const DB_VERSION = 1;

const STORES = {
  BOOKMARKS: "bookmarks",
  ARTICLES: "articles",
  SYNC_QUEUE: "sync_queue"
};

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Bookmark store
      if (!db.objectStoreNames.contains(STORES.BOOKMARKS)) {
        const bookmarkStore = db.createObjectStore(STORES.BOOKMARKS, { keyPath: "url" });
        bookmarkStore.createIndex("timestamp", "bookmarkedAt");
      }
      
      // Article cache store
      if (!db.objectStoreNames.contains(STORES.ARTICLES)) {
        const articleStore = db.createObjectStore(STORES.ARTICLES, { keyPath: "url" });
        articleStore.createIndex("timestamp", "cachedAt");
      }
      
      // Sync queue store
      if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
        db.createObjectStore(STORES.SYNC_QUEUE, { autoIncrement: true });
      }
    }
  });
}

// Bookmark operations
export async function getBookmarks() {
  const db = await initDB();
  return db.getAll(STORES.BOOKMARKS);
}

export async function addBookmark(article) {
  const db = await initDB();
  const bookmark = {
    ...article,
    bookmarkedAt: new Date().toISOString()
  };
  await db.put(STORES.BOOKMARKS, bookmark);
  return bookmark;
}

export async function removeBookmark(url) {
  const db = await initDB();
  await db.delete(STORES.BOOKMARKS, url);
}

export async function isBookmarked(url) {
  const db = await initDB();
  return !!(await db.get(STORES.BOOKMARKS, url));
}

// Article cache operations
export async function cacheArticle(article) {
  const db = await initDB();
  const cachedArticle = {
    ...article,
    cachedAt: new Date().toISOString()
  };
  await db.put(STORES.ARTICLES, cachedArticle);
  return cachedArticle;
}

export async function getCachedArticle(url) {
  const db = await initDB();
  return db.get(STORES.ARTICLES, url);
}

export async function getCachedArticles() {
  const db = await initDB();
  return db.getAll(STORES.ARTICLES);
}

export async function clearArticleCache() {
  const db = await initDB();
  const tx = db.transaction(STORES.ARTICLES, "readwrite");
  await tx.store.clear();
  await tx.done;
}

// Sync queue operations
export async function addToSyncQueue(action) {
  const db = await initDB();
  await db.add(STORES.SYNC_QUEUE, {
    ...action,
    timestamp: Date.now(),
    status: "pending"
  });
}

export async function getSyncQueue() {
  const db = await initDB();
  return db.getAll(STORES.SYNC_QUEUE);
}

export async function clearSyncQueue() {
  const db = await initDB();
  const tx = db.transaction(STORES.SYNC_QUEUE, "readwrite");
  await tx.store.clear();
  await tx.done;
}

// Statistics
export async function getStorageStats() {
  const db = await initDB();
  const [bookmarks, articles] = await Promise.all([
    db.getAll(STORES.BOOKMARKS),
    db.getAll(STORES.ARTICLES)
  ]);
  
  const totalSize = JSON.stringify([...bookmarks, ...articles]).length;
  
  return {
    bookmarks: bookmarks.length,
    articles: articles.length,
    estimatedSize: Math.round(totalSize / 1024) // KB
  };
}
