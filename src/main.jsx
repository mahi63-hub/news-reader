if ("serviceWorker" in navigator && import.meta.env.PROD) {
  // Try both paths to fix GitHub Pages issue
  const swPath = window.location.pathname.includes('/news-reader') 
    ? "/sw.js" 
    : "/sw.js";
    
  navigator.serviceWorker.register(swPath).then(
    (registration) => {
      console.log("SW registered: ", registration);
    },
    (error) => {
      console.error("SW registration failed: ", error);
    }
  );
}
