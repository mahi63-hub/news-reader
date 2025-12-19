// Add to src/hooks/useOfflineStorage.js
export function useOfflineStorage() {
  const saveLastArticles = (articles) => {
    localStorage.setItem('lastArticles', JSON.stringify(articles.slice(0, 5)));
  };
  
  const getLastArticles = () => {
    const stored = localStorage.getItem('lastArticles');
    return stored ? JSON.parse(stored) : [];
  };
  
  return { saveLastArticles, getLastArticles };
}
