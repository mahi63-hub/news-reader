export function registerServiceWorker() {
  if ("serviceWorker" in navigator && import.meta.env.PROD) {
    // Get correct path based on current location
    const basePath = window.location.pathname.startsWith('/news-reader') 
      ? '/news-reader' 
      : '';
    const swPath = `\${basePath}/sw.js`;
    
    console.log('Registering service worker at:', swPath);
    
    navigator.serviceWorker.register(swPath)
      .then(registration => {
        console.log("SW registered successfully: ", registration);
      })
      .catch(error => {
        console.error("SW registration failed: ", error);
      });
  }
}
