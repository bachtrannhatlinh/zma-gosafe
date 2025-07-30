export const getServerUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5000';
  }
  return process.env.URL_SERVER;
};

export const getRequestHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'ngrok-skip-browser-warning': 'true',
  'User-Agent': navigator.userAgent || 'ZaloMiniApp'
});
