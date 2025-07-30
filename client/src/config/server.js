export const getServerUrl = () => {
  let url;
  if (process.env.NODE_ENV === 'development') {
    url = 'http://localhost:5000';
  } else {
    // Domain mới từ nhánh feature-live-chat
    url = process.env.URL_SERVER || 'zma-gosafe-git-feature-live-chat-bachtrannhatlinhs-projects.vercel.app';
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }
  }
  
  console.log('🌐 Server URL:', url);
  return url;
};

// Export SERVER_URL để dùng chung
export const SERVER_URL = getServerUrl();

export const getRequestHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'ngrok-skip-browser-warning': 'true',
  'User-Agent': 'ZaloMiniApp/iOS',
  'X-Requested-With': 'XMLHttpRequest'
});


