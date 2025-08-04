import { useEffect } from 'react';
import { usePhoneAuth } from './usePhoneAuth';

export const useAppLifecycle = () => {
  const { clearPhoneData } = usePhoneAuth();

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // Chỉ clear khi thực sự đóng app/tab, không phải navigate
      if (e.persisted === false) {
        clearPhoneData();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("📱 App went to background");
      } else {
        console.log("📱 App came to foreground");
      }
    };

    // Chỉ clear khi thực sự đóng page, không phải navigate
    const handlePageHide = (e) => {
      // e.persisted = true nghĩa là page được cache (bfcache), không phải đóng thật
      if (e.persisted === false) {
        console.log("📱 Page is being closed (not cached)");
        clearPhoneData();
      }
    };

    // Listen for app close/refresh
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handlePageHide);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handlePageHide);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [clearPhoneData]);
};