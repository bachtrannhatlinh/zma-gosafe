import { useState, useCallback } from "react";
import { authorize, getUserInfo, getPhoneNumber, getAccessToken } from "zmp-sdk/apis";
import { useServerAuth } from "./useServerAuth";
import { useUserInfo } from "../contexts/UserContext";
import axios from "axios";

export const usePhoneAuth = () => {
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [isGettingPhone, setIsGettingPhone] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  
  const { sendTokenToServer } = useServerAuth();
  const { updatePhoneNumber, fetchUserInfo, userInfo: contextUserInfo } = useUserInfo();

  const checkPhoneExists = useCallback(() => {
    // Lấy phoneNumber từ UserContext
    const userPhone = contextUserInfo?.phoneNumber;
    
    if (userPhone && 
        userPhone !== "Chưa có số điện thoại" && 
        userPhone !== "Cần cấp quyền" &&
        userPhone !== "null" &&
        userPhone !== "undefined") {
      setPhoneNumber(userPhone);
      return true;
    }
    
    setPhoneNumber(null);
    return false;
  }, [contextUserInfo?.phoneNumber]);

  const clearPhoneData = useCallback(() => {
    console.log("🧹 Clearing phone data...");
    setPhoneNumber(null);
    setUserInfo(null);
    localStorage.removeItem("zalo_phone_token");
    // Chỉ clear phoneNumber trong UserContext, không clear toàn bộ userInfo
    // updatePhoneNumber(null); // Commented out để không làm mất userInfo khi navigate
  }, []);

  // Method riêng để clear toàn bộ data khi logout
  const clearAllData = useCallback(() => {
    console.log("🧹 Clearing all user data...");
    setPhoneNumber(null);
    setUserInfo(null);
    localStorage.removeItem("zalo_phone_token");
    updatePhoneNumber(null);
  }, [updatePhoneNumber]);

  const requestPhonePermission = useCallback(async () => {
    setIsGettingPhone(true);

    try {
      const accessToken = await requestAccessToken();
      const userInfo = await fetchZaloUserInfo();
      setUserInfo(userInfo);

      const phoneResult = await fetchPhoneResult();
      await handlePhoneResult(phoneResult, accessToken);
      
      // Đợi một chút để state được cập nhật
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log("✅ Phone permission completed, current phoneNumber:", phoneNumber);
      
      return { success: true, phoneNumber, userInfo };
    } catch (error) {
      console.error("❌ Phone permission error:", error);
      handlePermissionError(error);
      return { success: false, error: error.message };
    } finally {
      setIsGettingPhone(false);
    }
  }, [phoneNumber, updatePhoneNumber, fetchUserInfo]);

  // Helper functions from UserHeader
  const requestAccessToken = async () => {
    const authResult = await new Promise((resolve, reject) => {
      authorize({
        scopes: ["scope.userPhonenumber"],
        success: resolve,
        fail: () => reject(new Error("Cần cấp quyền số điện thoại để sử dụng ứng dụng")),
      });
    });

    const accessToken = await new Promise((resolve, reject) => {
      getAccessToken({ success: resolve, fail: reject });
    });

    return accessToken;
  };

  const fetchZaloUserInfo = async () => {
    return await new Promise((resolve, reject) => {
      getUserInfo({
        success: resolve,
        fail: () => reject(new Error("Không thể lấy thông tin người dùng")),
      });
    });
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
    console.log("✅ Got phone number:", number);
    setPhoneNumber(number);
    
    // Lưu vào localStorage
    try {
      localStorage.setItem("user_phone", number);
      console.log("💾 Saved phone to localStorage:", number);
    } catch (err) {
      console.warn("⚠️ Failed to save phone to localStorage:", err);
    }
    
    // Cập nhật UserContext
    updatePhoneNumber(number);
    
    // Re-fetch user info để đảm bảo data được cập nhật
    try {
      await fetchUserInfo();
      console.log("🔄 Refreshed user info after phone update");
    } catch (err) {
      console.warn("⚠️ Failed to refresh user info:", err);
    }

    try {
      await sendTokenToServer(number);
    } catch (err) {
      console.warn("⚠️ Failed to send token to server:", err);
    }
  };

  // Thêm method để verify phone với server
  const verifyPhoneWithServer = async (token, secretKey) => {
    try {
      const response = await axios.post(`${process.env.URL_SERVER}/auth/verify-phone`, {
        token: token,
        secretKey: secretKey
      });

      if (response.data.success) {
        const { jwtToken, user } = response.data;
        
        // Lưu JWT token
        localStorage.setItem('gosafe_jwt_token', jwtToken);
        
        // Cập nhật user info với role
        setUserInfo(prev => ({
          ...prev,
          ...user,
          isAdmin: user.role === 'admin'
        }));
        
        updatePhoneNumber(user.phoneNumber);
        
        console.log(`✅ Phone verified with server: ${user.phoneNumber}, Role: ${user.role}`);
        
        return { success: true, user };
      }
      
      throw new Error(response.data.error || 'Server verification failed');
    } catch (error) {
      console.error('❌ Server phone verification failed:', error);
      return { success: false, error: error.message };
    }
  };

  // Cập nhật handlePhoneToken method
  const handlePhoneToken = async (token, accessToken) => {
    try {
      // Thử verify với server trước
      const serverResult = await verifyPhoneWithServer(token, "j3MVFN1NJAZOcBWQ2w5E");
      
      if (serverResult.success) {
        setPhoneNumber(serverResult.user.phoneNumber);
        return;
      }
      
      // Fallback về cách cũ nếu server fail
      const result = await getZaloPhoneNumber(accessToken, token, "j3MVFN1NJAZOcBWQ2w5E");
      
      if (result?.phoneNumber) {
        console.log("✅ Got phone number from token:", result.phoneNumber);
        setPhoneNumber(result.phoneNumber);
        
        // Cập nhật UserContext
        updatePhoneNumber(result.phoneNumber);
        
        // Refresh user info
        await fetchUserInfo();
      }
    } catch (err) {
      console.warn("⚠️ Phone token failed:", err);
      // Handle fallback
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
    setPhoneNumber("Cần cấp quyền");
  };

  return {
    phoneNumber,
    userInfo,
    isGettingPhone,
    checkPhoneExists,
    requestPhonePermission,
    clearPhoneData,
    clearAllData,
  };
};