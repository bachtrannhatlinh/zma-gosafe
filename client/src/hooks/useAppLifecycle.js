import { useEffect } from 'react';
import { usePhoneAuth } from './usePhoneAuth';

export const useAppLifecycle = () => {
  const { clearPhoneData } = usePhoneAuth();

  useEffect(() => {
    const handleBeforeUnload = () => {
      clearPhoneData();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
      } else {
        console.log("📱 App came to foreground");
      }
    };

    const handlePageHide = () => {
      clearPhoneData();
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