import { useUserInfo } from "../contexts/UserContext";

/**
 * Hook để dễ dàng truy cập phoneNumber từ UserContext
 * @returns {Object} - { phoneNumber, updatePhoneNumber, hasPhoneNumber }
 */
export const usePhoneNumber = () => {
  const { userInfo, updatePhoneNumber } = useUserInfo();
  
  const phoneNumber = userInfo?.phoneNumber || null;
  const hasPhoneNumber = Boolean(
    phoneNumber && 
    phoneNumber !== "Chưa có số điện thoại" && 
    phoneNumber !== "Cần cấp quyền" &&
    phoneNumber !== "null" &&
    phoneNumber !== "undefined"
  );

  return {
    phoneNumber,
    updatePhoneNumber,
    hasPhoneNumber
  };
};
