import { useState, useCallback } from "react";
import { authorize, getUserInfo, getPhoneNumber, getAccessToken } from "zmp-sdk/apis";
import { useServerAuth } from "./useServerAuth";
import axios from "axios";

export const usePhoneAuth = () => {
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [isGettingPhone, setIsGettingPhone] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  
  const { sendTokenToServer } = useServerAuth();

  const checkPhoneExists = useCallback(() => {
    const storedPhone = localStorage.getItem("user_phone");
    if (storedPhone && 
        storedPhone !== "Chưa có số điện thoại" && 
        storedPhone !== "Cần cấp quyền" &&
        storedPhone !== "null" &&
        storedPhone !== "undefined") {
      return true;
    }
    
    setPhoneNumber(null);
    return false;
  }, []);

  const clearPhoneData = useCallback(() => {
    setPhoneNumber(null);
    setUserInfo(null);
    localStorage.removeItem("user_phone");
    localStorage.removeItem("zalo_phone_token");
  }, []);

  const requestPhonePermission = useCallback(async () => {
    setIsGettingPhone(true);

    try {
      const accessToken = await requestAccessToken();
      const userInfo = await fetchUserInfo();
      setUserInfo(userInfo);

      const phoneResult = await fetchPhoneResult();
      await handlePhoneResult(phoneResult, accessToken);
      
      return { success: true, phoneNumber, userInfo };
    } catch (error) {
      handlePermissionError(error);
      return { success: false, error: error.message };
    } finally {
      setIsGettingPhone(false);
    }
  }, [phoneNumber]);

  // Helper functions from UserHeader
  const requestAccessToken = async () => {
    const authResult = await new Promise((resolve, reject) => {
      authorize({
        scopes: ["scope.userPhonenumber"],
        success: resolve,
        fail: () => reject(new Error("Cần cấp quyền số điện thoại để sử dụng ứng dụng")),
      });
    });
    console.log("✅ Authorization success:", authResult);

    const accessToken = await new Promise((resolve, reject) => {
      getAccessToken({ success: resolve, fail: reject });
    });

    return accessToken;
  };

  const fetchUserInfo = async () => {
    const result = await new Promise((resolve, reject) => {
      getUserInfo({
        success: resolve,
        fail: () => reject(new Error("Không thể lấy thông tin người dùng")),
      });
    });

    return result.userInfo;
  };

  const fetchPhoneResult = async () => {
    return await new Promise((resolve, reject) => {
      getPhoneNumber({
        success: resolve,
        fail: () => reject(new Error("Không thể lấy số điện thoại")),
      });
    });
  };

  const handlePhoneResult = async (phoneResult, accessToken) => {
    if (!phoneResult) return;

    if (phoneResult.number) {
      await handleDirectPhone(phoneResult.number);
      return;
    }

    if (phoneResult.token) {
      await handlePhoneToken(phoneResult.token, accessToken);
    }
  };

  const handleDirectPhone = async (number) => {
    setPhoneNumber(number);
    localStorage.setItem("user_phone", number);

    try {
      await sendTokenToServer(number);
    } catch (err) {
    }
  };

  const handlePhoneToken = async (token, accessToken) => {
    try {
      const result = await getZaloPhoneNumber(accessToken, token, "j3MVFN1NJAZOcBWQ2w5E");

      if (result?.phoneNumber) {
        setPhoneNumber(result.phoneNumber);
        localStorage.setItem("user_phone", result.phoneNumber);
      }
    } catch (err) {
      const fallbackPhone = `${userInfo?.name || "Người dùng Zalo"} - Đã xác thực`;
      setPhoneNumber(fallbackPhone);
      localStorage.setItem("user_phone", fallbackPhone);
      
      try {
        localStorage.setItem("zalo_phone_token", token);
      } catch (storageErr) {
        console.warn("⚠️ Không thể lưu token:", storageErr);
      }
    }
  };

  const getZaloPhoneNumber = async (accessToken, token, secretKey) => {
    try {
      const response = await axios.get("https://graph.zalo.me/v2.0/me/info", {
        headers: {
          access_token: accessToken,
          code: token,
          secret_key: secretKey,
        },
      });

      const data = response.data;
      if (data?.data?.number) {
        return { success: true, phoneNumber: data?.data?.number };
      }

      return { success: false, error: "Không có số điện thoại" };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const handlePermissionError = (error) => {
    console.error("❌ Lỗi xin quyền:", error);
    setPhoneNumber("Cần cấp quyền");
  };

  return {
    phoneNumber,
    userInfo,
    isGettingPhone,
    checkPhoneExists,
    requestPhonePermission,
    clearPhoneData,
  };
};

