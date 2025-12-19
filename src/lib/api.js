import axios from "axios";

const NEWS_API_KEY = "YOUR_API_KEY_HERE"; // Get from https://newsapi.org
const BASE_URL = "https://newsapi.org/v2";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "X-Api-Key": NEWS_API_KEY
  }
});

// Fallback data if API fails or no key
const fallbackArticles = [
  {
    source: { id: "fallback-1", name: "Tech News" },
    author: "AI Assistant",
    title: "Progressive Web Apps Transforming Web Development",
    description: "Learn how PWAs are changing the way we build web applications with offline capabilities and native-like features.",
    url: "https://example.com/pwa-article",
    urlToImage: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=200&fit=crop",
    publishedAt: new Date().toISOString(),
    content: "Progressive Web Applications combine the best of web and mobile apps..."
  },
  {
    source: { id: "fallback-2", name: "Web Dev" },
    author: "Web Expert",
    title: "Service Workers: The Key to Offline-First Applications",
    description: "Service workers enable background sync, push notifications, and offline functionality for web apps.",
    url: "https://example.com/service-workers",
    urlToImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w-400&h=200&fit=crop",
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    content: "Service workers act as a proxy between your application and the network..."
  },
  // Add more fallback articles...
];

export async function fetchNews(page = 1, pageSize = 9) {
  try {
    // If no API key, return fallback data
    if (!NEWS_API_KEY || NEWS_API_KEY === "YOUR_API_KEY_HERE") {
      return {
        articles: fallbackArticles.slice((page - 1) * pageSize, page * pageSize),
        totalResults: fallbackArticles.length
      };
    }

    const response = await api.get("/everything", {
      params: {
        q: "technology OR programming OR web development",
        language: "en",
        sortBy: "publishedAt",
        page,
        pageSize
      }
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching news:", error);
    return {
      articles: fallbackArticles.slice((page - 1) * pageSize, page * pageSize),
      totalResults: fallbackArticles.length
    };
  }
}

export async function searchNews(query, page = 1, pageSize = 9) {
  try {
    if (!NEWS_API_KEY || NEWS_API_KEY === "YOUR_API_KEY_HERE") {
      const filtered = fallbackArticles.filter(article =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.description.toLowerCase().includes(query.toLowerCase())
      );
      return {
        articles: filtered.slice((page - 1) * pageSize, page * pageSize),
        totalResults: filtered.length
      };
    }

    const response = await api.get("/everything", {
      params: {
        q: query,
        language: "en",
        sortBy: "relevancy",
        page,
        pageSize
      }
    });
    
    return response.data;
  } catch (error) {
    console.error("Error searching news:", error);
    const filtered = fallbackArticles.filter(article =>
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.description.toLowerCase().includes(query.toLowerCase())
    );
    return {
      articles: filtered.slice((page - 1) * pageSize, page * pageSize),
      totalResults: filtered.length
    };
  }
}
