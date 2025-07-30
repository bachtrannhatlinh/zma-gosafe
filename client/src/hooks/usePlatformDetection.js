import { useState, useEffect } from 'react';

export const usePlatformDetection = () => {
  const [platformInfo, setPlatformInfo] = useState({
    isIOS: false,
    isZalo: false,
    isRealDevice: false,
    userAgent: ''
  });

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isIOS = /iPhone|iOS|iPad|iPod/.test(userAgent);
    const isZalo = /zalo/i.test(userAgent);
    const isRealDevice = !userAgent.includes('Chrome') || isZalo;
    
    setPlatformInfo({
      isIOS,
      isZalo,
      isRealDevice,
      userAgent: userAgent.substring(0, 50) + '...'
    });
  }, []);

  return platformInfo;
};