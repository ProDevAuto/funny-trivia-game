// Separate service worker registration kept minimal for CSP compliance
(function(){
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js').catch(err => {
        console.warn('Service worker registration failed', err);
      });
    });
  }
})();
