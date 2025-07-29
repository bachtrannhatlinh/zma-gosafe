export const getServerUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5000';
  }
  return 'https://zma-gosafe-git-develop-bachtrannhatlinhs-projects.vercel.app';
};

export const getRequestHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'ngrok-skip-browser-warning': 'true',
  'User-Agent': navigator.userAgent || 'ZaloMiniApp'
});