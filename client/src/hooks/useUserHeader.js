import { useState, useEffect } from "react";
import { usePhoneAuth } from "./usePhoneAuth";

export const useUserHeader = () => {
  const [showModal, setShowModal] = useState(false);
  const [updatedUserInfo, setUpdatedUserInfo] = useState(null);

  const {
    phoneNumber,
    userInfo,
    isGettingPhone,
    checkPhoneExists,
    requestPhonePermission,
  } = usePhoneAuth();

  const handleLocationClick = () => {
    if (
      phoneNumber === "Chưa có số điện thoại" ||
      phoneNumber === "Cần cấp quyền" ||
      !phoneNumber
    ) {
      setShowModal(true);
    }
  };

  const handleLogin = async () => {
    console.log("🔥 handleLogin được gọi"); // Thêm log này
    setShowModal(false);
    const result = await requestPhonePermission();
    
    if (result.success) {
      setUpdatedUserInfo(result.userInfo);
    }
  };

  // Check phone on mount
  useEffect(() => {
    checkPhoneExists();
  }, [checkPhoneExists]);

  return {
    showModal,
    setShowModal,
    updatedUserInfo: updatedUserInfo || userInfo,
    phoneNumber,
    isGettingPhone,
    handleLogin,
    handleLocationClick,
  };
};
