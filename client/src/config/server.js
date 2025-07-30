export const getServerUrl = () => {
  let url;
  if (process.env.NODE_ENV === 'development') {
    url = 'http://localhost:5000';
  } else {
    url = process.env.URL_SERVER || 'https://zma-gosafe-git-develop-bachtrannhatlinhs-projects.vercel.app';
  }
  
  console.log('🌐 Server URL:', url);
  console.log('🌐 NODE_ENV:', process.env.NODE_ENV);
  console.log('🌐 URL_SERVER:', process.env.URL_SERVER);
  
  return url;
};

export const getRequestHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'ngrok-skip-browser-warning': 'true',
  'User-Agent': navigator.userAgent || 'ZaloMiniApp'
});

