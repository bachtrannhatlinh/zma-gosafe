import { useState, useCallback } from 'react';
import { authorize, getPhoneNumber } from 'zmp-sdk/apis';

export const usePhonePermission = () => {
  const [isGettingPhone, setIsGettingPhone] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("Chưa có số điện thoại");

  const requestPhonePermission = useCallback(async () => {
    setIsGettingPhone(true);
    
    try {
      // Step 1: Request authorization
      const authResult = await new Promise((resolve, reject) => {
        authorize({
          scopes: ["scope.userPhonenumber"],
          success: resolve,
          fail: reject
        });
      });
      
      // Step 2: Get phone number với token
      const phoneResult = await new Promise((resolve, reject) => {
        getPhoneNumber({
          success: resolve,
          fail: reject
        });
      });
      
      // Xử lý kết quả
      if (phoneResult?.token) {
        // Có token - cần gửi lên server để lấy số thật
        setPhoneNumber("Đã có token");
        return { 
          success: true, 
          token: phoneResult.token,
          phoneNumber: "Đã có token" 
        };
      } else if (phoneResult?.number) {
        // Có số trực tiếp (ít khi xảy ra)
        const formattedPhone = phoneResult.number.startsWith('+84') 
          ? phoneResult.number 
          : `+84${phoneResult.number.substring(1)}`;
        
        setPhoneNumber(formattedPhone);
        return { success: true, phoneNumber: formattedPhone };
      }

      throw new Error("Không nhận được token hoặc số điện thoại");
      
    } catch (error) {
      console.error("❌ Phone permission error:", error);
      
      let errorMessage = "Không thể lấy số điện thoại";
      if (error.message?.includes("User denied") || error.message?.includes("denied")) {
        errorMessage = "Bạn đã từ chối cấp quyền số điện thoại";
      } else if (error.message?.includes("not supported")) {
        errorMessage = "Thiết bị không hỗ trợ tính năng này";
      }
      
      setPhoneNumber("Cần cấp quyền");
      return { success: false, error: errorMessage };
    } finally {
      setIsGettingPhone(false);
    }
  }, []);

  return {
    phoneNumber,
    isGettingPhone,
    requestPhonePermission,
    setPhoneNumber
  };
};

