import React, { useState } from "react";
import { Box, Text, Avatar, Button } from "zmp-ui";
import {
  authorize,
  getUserInfo,
  getPhoneNumber,
  getAccessToken,
} from "zmp-sdk/apis";
import CustomModal from "./CustomModal";
import { useServerAuth } from "../hooks/useServerAuth";
import axios from "axios";

const UserHeader = ({ userInfo, isLoading }) => {
  const [showModal, setShowModal] = useState(false);
  const [updatedUserInfo, setUpdatedUserInfo] = useState(userInfo);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [isGettingPhone, setIsGettingPhone] = useState(false);
  const {
    sendTokenToServer,
    loading: serverLoading,
    error: serverError,
  } = useServerAuth();

  const handleLocationClick = () => {
    // Show modal if no user info or no phone number yet
    if (!currentUserInfo?.name || !phoneNumber) {
      setShowModal(true);
    }
  };

  const handleLogin = () => {
    setShowModal(false);
    handleAllowPermission();
  };

  const handleAllowPermission = async () => {
    setIsGettingPhone(true);

    try {
      console.log("🔐 Bắt đầu xin quyền số điện thoại...");

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

  // --- Helper functions ---
  const requestAccessToken = async () => {
    const authResult = await new Promise((resolve, reject) => {
      authorize({
        scopes: ["scope.userPhonenumber"],
        success: resolve,
        fail: () =>
          reject(new Error("Cần cấp quyền số điện thoại để sử dụng ứng dụng")),
      });
    });

    console.log("✅ Đã cấp quyền:", authResult);

    const accessToken = await new Promise((resolve, reject) => {
      getAccessToken({ success: resolve, fail: reject });
    });

    console.log("🔑 Access Token:", accessToken);
    return accessToken;
  };

  const fetchUserInfo = async () => {
    const result = await new Promise((resolve, reject) => {
      getUserInfo({
        success: resolve,
        fail: () => reject(new Error("Không thể lấy thông tin người dùng")),
      });
    });

    console.log("👤 Thông tin user:", result);
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
    if (!phoneResult) {
      console.warn("⚠️ Không có kết quả số điện thoại");
      // setPhoneNumber(
      //   `👤 ${currentUserInfo?.name || "Người dùng Zalo"} - Đang xử lý`
      // );
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

  const handleDirectPhone = async (number) => {
    console.log("📞 Số trực tiếp:", number);
    // setPhoneNumber(
    //   `👤 ${currentUserInfo?.name || "Người dùng Zalo"} - Đã xác thực`
    // );

    try {
      await sendTokenToServer(number);
      console.log("✅ Đã gửi số lên server");
    } catch (err) {
      console.warn("⚠️ Không thể gửi lên server:", err);
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

  // Get current user info to display
  const currentUserInfo = updatedUserInfo || userInfo;

  const handleClose = () => {
    setShowModal(false);
  };

  if (isLoading) {
    return (
      <Box
        className="px-4 relative bg-white shadow-sm"
        style={{ paddingTop: "max(env(safe-area-inset-top), 44px)" }}
      >
        <Box className="flex items-center space-x-3 py-4">
          {/* Avatar skeleton với animation */}
          <Box className="w-10 h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-pulse relative overflow-hidden">
            <Box className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></Box>
          </Box>

          <Box className="flex-1">
            {/* Text skeletons với animation */}
            <Box className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-32 mb-2 animate-pulse relative overflow-hidden">
              <Box className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></Box>
            </Box>
            <Box className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-48 animate-pulse relative overflow-hidden">
              <Box className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box
        className="!px-4 relative bg-white shadow-sm"
        style={{ paddingTop: "max(env(safe-area-inset-top), 30px)" }}
      >
        <Box className="flex items-center justify-between py-4 mt-[-20px] px-4 bg-white">
          <Box
            className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
            onClick={handleLocationClick}
          >
            <Avatar
              src={currentUserInfo?.avatar || ""}
              size="40"
              className="bg-white"
            >
              {currentUserInfo?.name?.charAt(0) || "U"}
            </Avatar>
            <Box>
              <Text className="text-black text-xs">
                {currentUserInfo?.name
                  ? `Xin chào, ${currentUserInfo.name} - ${phoneNumber} 👋`
                  : "Cần cấp quyền số điện thoại 📱"}
              </Text>
              <Text className="text-black text-sm font-bold">
                {currentUserInfo?.name
                  ? "Chào mừng bạn đến với GoSafe!"
                  : "Cung cấp số điện thoại để sử dụng app!"}
              </Text>
              {/* {phoneNumber && (
                <Text
                  className={`text-xs mt-1 ${
                    phoneNumber.includes("✅")
                      ? "text-blue-600"
                      : "text-green-600"
                  }`}
                >
                  📱 {phoneNumber}
                </Text>
              )} */}
              {(serverLoading || isGettingPhone) && (
                <Text className="text-blue-500 text-xs mt-1">
                  🔄{" "}
                  {isGettingPhone
                    ? "Đang lấy thông tin..."
                    : "Đang kết nối server..."}
                </Text>
              )}
              {serverError &&
                !isGettingPhone &&
                process.env.NODE_ENV === "development" && (
                  <Text className="text-orange-500 text-xs mt-1">
                    🔧 DEV: {serverError}
                  </Text>
                )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Modal xin quyền số điện thoại bắt buộc */}
      <CustomModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        showCloseButton={false}
        position="center"
      >
        <Box className="text-center p-4">
          <Box className="mb-4">
            <Text className="text-2xl mb-2">📱</Text>
            <Text className="text-lg font-bold text-black mb-2">
              Cần số điện thoại để sử dụng GoSafe
            </Text>
          </Box>

          <Box className="text-left mb-6 space-y-3">
            <Text className="text-gray-700 text-sm">
              <strong>Mục đích sử dụng:</strong>
            </Text>
            <Box className="space-y-2 text-sm text-gray-600">
              <Text>• Định danh tài khoản của bạn</Text>
              <Text>• Liên hệ khẩn cấp khi cần thiết</Text>
              <Text>• Xác thực thông tin cá nhân</Text>
              <Text>• Bảo mật và bảo vệ tài khoản</Text>
            </Box>

            <Text className="text-xs text-gray-500 mt-4">
              Số điện thoại của bạn sẽ được bảo mật và chỉ sử dụng cho mục đích
              trên
            </Text>
          </Box>

          <Box className="flex flex-row gap-2">
            <Button
              fullWidth
              className="custom-btn-outline"
              onClick={handleClose}
              disabled={isGettingPhone}
            >
              Đóng
            </Button>
            <Button
              fullWidth
              className="custom-btn-filled"
              onClick={handleLogin}
              disabled={isGettingPhone}
            >
              {isGettingPhone ? "🔄 Đang xử lý..." : "Đồng ý cung cấp"}
            </Button>
          </Box>
        </Box>
      </CustomModal>
    </>
  );
};

export default React.memo(UserHeader);
