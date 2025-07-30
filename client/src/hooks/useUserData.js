import { useState, useCallback } from 'react';
import { getUserInfo } from 'zmp-sdk/apis';

const STORAGE_KEYS = {
  USER_PHONE: 'user_phone'
};

export const useUserData = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [userPhone, setUserPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Đổi thành false
  const [error, setError] = useState(null);

  const fetchUserData = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      console.log("🔄 Bắt đầu fetch user data...");

      const phone = localStorage.getItem(STORAGE_KEYS.USER_PHONE);
      setUserPhone(phone || "");

      const info = await getUserInfo({});
      setUserInfo(info);
      console.log("✅ Fetch user data thành công:", info);
      
      return info;
    } catch (error) {
      console.error("❌ Không thể lấy thông tin user:", error);
      setError(error.message || "Không thể lấy thông tin user");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUserPhone = useCallback((phone) => {
    setUserPhone(phone);
    localStorage.setItem(STORAGE_KEYS.USER_PHONE, phone);
  }, []);

  // Xóa useEffect - không tự động chạy

  return {
    userInfo,
    userPhone,
    isLoading,
    error,
    fetchUserData,
    updateUserPhone
  };
};
