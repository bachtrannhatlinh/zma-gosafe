// Global error handler for Zalo Mini App
export const initErrorHandler = () => {
  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.warn('Unhandled promise rejection:', event.reason);
    event.preventDefault();
  });

  // Catch script errors
  window.addEventListener('error', (event) => {
    if (event.filename && event.filename.includes('eruda')) {
      console.warn('Eruda script error ignored:', event.message);
      event.preventDefault();
      return;
    }
    
    if (event.message && event.message.includes('store')) {
      console.warn('Store error ignored:', event.message);
      event.preventDefault();
      return;
    }
    
    console.error('Script error:', event.message, event.filename, event.lineno);
  });

  // Initialize global store if missing
  if (!window.store) {
    window.store = {};
  }
};