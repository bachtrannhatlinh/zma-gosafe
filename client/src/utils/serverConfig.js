export const getServerUrl = () => {
  // Development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3001';
  }
  
  // Production - adjust based on your deployment
  return 'https://your-production-server.com';
};

export const getRequestHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
};