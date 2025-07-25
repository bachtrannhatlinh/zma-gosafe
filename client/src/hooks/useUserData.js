import { useState, useEffect } from "react";
import { getUserInfo } from "zmp-sdk/apis";
import { STORAGE_KEYS } from "../constants/dashboard";

export const useUserData = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [userPhone, setUserPhone] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = async () => {
    try {
      setError(null);
      console.log("🔄 Bắt đầu fetch user data...");

      // Get user phone from localStorage
      const phone = localStorage.getItem(STORAGE_KEYS.USER_PHONE);
      setUserPhone(phone || "");

      // Get user info from Zalo
      const info = await getUserInfo({});
      setUserInfo(info);
      console.log("✅ Fetch user data thành công:", info);
    } catch (error) {
      console.error("❌ Không thể lấy thông tin user:", error);
      setError(error.message || "Không thể lấy thông tin user");
      throw error;
    }
  };

  const refetch = async () => {
    await fetchUserData();
  };

  useEffect(() => {
    const initializeUser = async () => {
      try {
        console.log("🚀 Bắt đầu initialize user...");
        setIsLoading(true);
        
        // Thêm minimum loading time để user thấy được loading state
        const dataPromise = fetchUserData();
        const minDelayPromise = new Promise(resolve => setTimeout(resolve, 1000));
        
        await Promise.all([dataPromise, minDelayPromise]);
        console.log("✅ Initialize user hoàn thành");
      } catch (error) {
        console.error("❌ Lỗi khi initialize user:", error);
      } finally {
        setIsLoading(false);
        console.log("🏁 Loading state = false");
      }
    };

    initializeUser();
  }, []);

  const updateUserPhone = (phone) => {
    setUserPhone(phone);
    localStorage.setItem(STORAGE_KEYS.USER_PHONE, phone);
  };

  return {
    userInfo,
    userPhone,
    isLoading,
    error,
    updateUserPhone,
    refetch,
  };
};
