import { useEffect } from 'react';
import { usePhoneAuth } from './usePhoneAuth';

export const useAppLifecycle = () => {
  const { clearPhoneData } = usePhoneAuth();

  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log("🚪 App is closing, clearing phone data...");
      clearPhoneData();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("📱 App went to background");
        // Optionally clear data when app goes to background
        // clearPhoneData();
      } else {
        console.log("📱 App came to foreground");
      }
    };

    const handlePageHide = () => {
      console.log("🚪 Page hide, clearing phone data...");
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