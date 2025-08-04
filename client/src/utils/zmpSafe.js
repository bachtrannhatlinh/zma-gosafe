// Safe ZMP SDK utilities
export const safeZMPImport = async (apiName) => {
  try {
    const apis = await import('zmp-sdk/apis');
    return apis[apiName];
  } catch (error) {
    console.warn(`Failed to import ${apiName} from ZMP SDK:`, error);
    return null;
  }
};

export const isZMPAvailable = () => {
  return typeof window !== 'undefined' && 
         (window.ZaloJavaScriptInterface || window.zmp);
};

export const getZMPUserInfo = async () => {
  try {
    if (isZMPAvailable()) {
      const getUserInfo = await safeZMPImport('getUserInfo');
      if (getUserInfo) {
        return await getUserInfo({});
      }
    }
    
    // Return mock data for development
    return {
      id: 'dev_user_123',
      name: 'Development User',
      avatar: ''
    };
  } catch (error) {
    console.error('ZMP getUserInfo failed:', error);
    return null;
  }
};

export const getZMPPhoneNumber = async () => {
  try {
    if (isZMPAvailable()) {
      const getPhoneNumber = await safeZMPImport('getPhoneNumber');
      if (getPhoneNumber) {
        return await getPhoneNumber({});
      }
    }
    
    return null;
  } catch (error) {
    console.error('ZMP getPhoneNumber failed:', error);
    return null;
  }
};