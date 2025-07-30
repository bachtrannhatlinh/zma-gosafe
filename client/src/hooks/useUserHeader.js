import { useState, useEffect, useCallback } from "react";
import { useServerAuth } from "./useServerAuth";

export const useUserHeader = () => {
  const [showModal, setShowModal] = useState(false);
  const [updatedUserInfo, setUpdatedUserInfo] = useState(null);
  const [isGettingPhone, setIsGettingPhone] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(null);

  const {
    sendTokenToServer,
    loading: serverLoading,
    error: serverError,
  } = useServerAuth();

  const handleLocationClick = useCallback(() => {
    if (
      phoneNumber === "Chưa có số điện thoại" ||
      phoneNumber === "Cần cấp quyền"
    ) {
      setShowModal(true);
    }
  }, [phoneNumber]);

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
      console.error("❌ Lỗi gọi API Zalo:", err.response?.data || err.message);
      return { success: false, error: err.message };
    }
  };

  const handlePhoneToken = async (token, accessToken) => {
    console.log("🔐 Token số điện thoại:", token);

    try {
      const result = await getZaloPhoneNumber(
        accessToken,
        token,
        "j3MVFN1NJAZOcBWQ2w5E"
      );

      console.log("🔍 Kết quả: ", result);

      if (result) {
        console.log("✅ Server giải mã thành công:", result);
        setPhoneNumber(result?.phoneNumber);
      } else {
        setPhoneNumber(null);
      }
    } catch (err) {
      console.error("❌ Lỗi decode token:", err);
      setPhoneNumber(
        `👤 ${currentUserInfo?.name || "Người dùng Zalo"} - Đã xác thực`
      );

      try {
        localStorage.setItem("zalo_phone_token", token);
        console.log("💾 Đã lưu token để xử lý sau");
      } catch (storageErr) {
        console.warn("⚠️ Không thể lưu token:", storageErr);
      }
    }
  };

  const handlePhoneResult = async (phoneResult, accessToken) => {
    if (!phoneResult) {
      return;
    }

    if (phoneResult.number) {
      await handleDirectPhone(phoneResult.number);
      return;
    }

    if (phoneResult.token) {
      await handlePhoneToken(phoneResult.token, accessToken);
    }
  };

  const handleAllowPermission = async () => {
    setIsGettingPhone(true);

    try {
      const accessToken = await requestAccessToken();
      const userInfo = await fetchUserInfo();
      setUpdatedUserInfo(userInfo);

      const phoneResult = await fetchPhoneResult();
      await handlePhoneResult(phoneResult, accessToken);
    } catch (error) {
      handlePermissionError(error);
    } finally {
      setIsGettingPhone(false);
    }
  };

  const handlePermissionError = (error) => {
    console.error("❌ Lỗi xin quyền:", error);

    if (error.message.includes("từ chối")) {
      alert(
        "Bạn cần cấp quyền số điện thoại để sử dụng GoSafe. Vui lòng thử lại."
      );
    } else if (error.message.includes("Không thể lấy")) {
      alert("Có lỗi khi lấy thông tin. Vui lòng thử lại sau.");
    } else {
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    }

    setPhoneNumber("Cần cấp quyền");
  };

  const handleLogin = () => {
    setShowModal(false);
    handleAllowPermission();
  };

  return {
    showModal,
    setShowModal,
    updatedUserInfo,
    phoneNumber,
    isGettingPhone,
    serverLoading,
    serverError,
    handleLogin,
    handleLocationClick,
  };
};
