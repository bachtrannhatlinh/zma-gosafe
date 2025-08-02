import { useState } from "react";
import { getUserInfo } from "zmp-sdk/apis";
import { STORAGE_KEYS } from "../constants/dashboard";

export const useUserData = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [userPhone, setUserPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getUserData = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
      console.log("🏁 Loading state = false");
    }
  };

  const refetch = async () => {
    await getUserData();
  };



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
    getUserData, // export hàm này để gọi khi muốn fetch user info
  };
};
