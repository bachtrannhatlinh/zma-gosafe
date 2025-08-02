export const getServerUrl = () => {
  let url;
  if (process.env.NODE_ENV === 'development') {
    url = 'http://localhost:5000';
  } else {
    // Đảm bảo có https:// prefix
    url = process.env.URL_SERVER || 'zma-gosafe.vercel.app';
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }
  }
  
  console.log('🌐 Server URL:', url);
  return url;
};

export const getRequestHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'ngrok-skip-browser-warning': 'true',
  'User-Agent': 'ZaloMiniApp/iOS',
  'X-Requested-With': 'XMLHttpRequest'
});

