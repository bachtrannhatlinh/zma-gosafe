import React from "react";
import { Box, Text, Avatar, Button } from "zmp-ui";
import CustomModal from "./CustomModal";
import { useUserHeader } from "../hooks/useUserHeader";
import { useUserInfo } from "../contexts/UserContext";

const UserHeader = () => {
  const { userInfo, isLoading } = useUserInfo();
  const {
    showModal,
    setShowModal,
    updatedUserInfo,
    phoneNumber,
    isGettingPhone,
    handleLogin,
    handleLocationClick,
  } = useUserHeader();

  // Get current user info to display
  const currentUserInfo = updatedUserInfo || userInfo;

  if (isLoading) {
    return (
      <Box
        className="px-4 relative bg-white shadow-sm"
        style={{ paddingTop: "max(env(safe-area-inset-top), 44px)" }}
      >
        <Box className="flex items-center space-x-3 py-4">
          <Box className="w-10 h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-pulse relative overflow-hidden">
            <Box className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></Box>
          </Box>
          <Box className="flex-1">
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
                {currentUserInfo?.name &&
                phoneNumber &&
                phoneNumber !== "Chưa có số điện thoại" &&
                phoneNumber !== "Cần cấp quyền"
                  ? `Xin chào, ${currentUserInfo.name} - ${phoneNumber} 👋`
                  : "Cần cấp quyền số điện thoại 📱"}
              </Text>
              <Text className="text-black text-sm font-bold">
                {currentUserInfo?.name &&
                phoneNumber &&
                phoneNumber !== "Chưa có số điện thoại" &&
                phoneNumber !== "Cần cấp quyền"
                  ? "Chào mừng bạn đến với GoSafe!"
                  : "Cung cấp số điện thoại để sử dụng app!"}
              </Text>
              {isGettingPhone && (
                <Text className="text-blue-500 text-xs mt-1">
                  🔄 Đang lấy thông tin...
                </Text>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

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
              style={{ 
                backgroundColor: 'red',
                zIndex: 9999,
                position: 'relative'
              }}
              onClick={() => {
                if (handleLogin) {
                  handleLogin();
                } else {
                  console.error("❌ handleLogin is undefined!");
                }
              }}
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