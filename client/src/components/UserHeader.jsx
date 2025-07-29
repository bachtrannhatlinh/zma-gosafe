import React, { useState } from "react";
import { Box, Text, Avatar, Button } from "zmp-ui";
import { authorize, getUserInfo, getPhoneNumber } from "zmp-sdk/apis";
import CustomModal from "./CustomModal";
import { useServerAuth } from "../hooks/useServerAuth";
// import { useStringeeAuth } from "../hooks/useStringeeAuth";

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
      console.log("🔐 Bắt đầu quy trình xin quyền số điện thoại bắt buộc...");

      // STEP 1: Request authorization with clear scope
      console.log("📋 Xin quyền truy cập số điện thoại...");
      const authResult = await new Promise((resolve, reject) => {
        authorize({
          scopes: ["scope.userPhonenumber"],
          success: (data) => {
            console.log("✅ Người dùng đồng ý chia sẻ số điện thoại:", data);
            resolve(data);
          },
          fail: (error) => {
            console.error(
              "❌ Người dùng từ chối chia sẻ số điện thoại:",
              error
            );
            reject(
              new Error("Cần cấp quyền số điện thoại để sử dụng ứng dụng")
            );
          },
        });
      });

      // STEP 2: Get user info
      console.log("👤 Lấy thông tin người dùng...");
      const userResult = await new Promise((resolve, reject) => {
        getUserInfo({
          success: (userData) => {
            console.log("✅ Thông tin người dùng:", userData);
            resolve(userData);
          },
          fail: (error) => {
            console.error("❌ Lỗi lấy thông tin người dùng:", error);
            reject(new Error("Không thể lấy thông tin người dùng"));
          },
        });
      });

      setUpdatedUserInfo(userResult.userInfo);

      // STEP 3: Get phone number with proper error handling
      console.log("📱 Lấy số điện thoại...");
      const phoneResult = await new Promise((resolve, reject) => {
        getPhoneNumber({
          success: (phoneData) => {
            console.log("✅ Kết quả số điện thoại:", phoneData);
            resolve(phoneData);
          },
          fail: (error) => {
            console.error("❌ Lỗi lấy số điện thoại:", error);
            reject(new Error("Không thể lấy số điện thoại"));
          },
        });
      });

      // STEP 4: Process phone result - tạm thời không hiển thị số điện thoại
      if (phoneResult) {
        if (phoneResult.number) {
          // Hiển thị số điện thoại thực
          console.log("📱 Số điện thoại trực tiếp:", phoneResult.number);
          setPhoneNumber(phoneResult.number); // Hiển thị số thật
          
          // Send to server for verification
          try {
            await sendTokenToServer(phoneResult.number);
            console.log("✅ Đã gửi số điện thoại lên server");
          } catch (serverError) {
            console.warn("⚠️ Không thể gửi lên server:", serverError.message);
          }
        } else if (phoneResult.token) {
          // Xử lý token và hiển thị số thật từ server
          try {
            const serverResult = await sendTokenToServer(phoneResult.token);
            
            if (serverResult.success && serverResult.phoneNumber) {
              // Hiển thị số điện thoại thực từ server
              setPhoneNumber(serverResult.phoneNumber);
            } else {
              setPhoneNumber(`👤 ${currentUserInfo?.name || 'Người dùng Zalo'} - Đang xử lý`);
            }
          } catch (tokenError) {
            console.error("❌ Lỗi decode token:", tokenError);
            setPhoneNumber(`👤 ${currentUserInfo?.name || 'Người dùng Zalo'} - Lỗi xử lý`);
          }
        }
      } else {
        console.warn("⚠️ Không có kết quả số điện thoại");
        setPhoneNumber(`👤 ${currentUserInfo?.name || 'Người dùng Zalo'} - Đang xử lý`);
      }
    } catch (error) {
      console.error("❌ Lỗi trong quá trình xin quyền:", error);

      // Show user-friendly error message
      if (error.message.includes("từ chối")) {
        alert(
          "Bạn cần cấp quyền số điện thoại để sử dụng ứng dụng GoSafe. Vui lòng thử lại."
        );
      } else if (error.message.includes("Không thể lấy")) {
        alert("Có lỗi xảy ra khi lấy thông tin. Vui lòng thử lại sau.");
      } else {
        alert("Có lỗi xảy ra. Vui lòng thử lại.");
      }

      // Set fallback status
      setPhoneNumber("Cần cấp quyền");
    } finally {
      setIsGettingPhone(false);
    }
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
        className="px-4 relative bg-white shadow-sm"
        style={{ paddingTop: "max(env(safe-area-inset-top), 30px)" }}
      >
        <Box className="flex items-center justify-between py-4">
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
                  ? `Xin chào, ${currentUserInfo.name} 👋`
                  : "Cần cấp quyền số điện thoại 📱"}
              </Text>
              <Text className="text-black text-sm font-bold">
                {currentUserInfo?.name
                  ? "Chào mừng bạn đến với GoSafe!"
                  : "Cung cấp số điện thoại để sử dụng app!"}
              </Text>
              {phoneNumber && (
                <Text
                  className={`text-xs mt-1 ${
                    phoneNumber.includes("✅") || phoneNumber.includes("👤")
                      ? "text-green-600"
                      : "text-blue-600"
                  }`}
                >
                  📱 {phoneNumber}
                </Text>
              )}
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

      {/* Modal xin quyền thông tin người dùng */}
      <CustomModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        showCloseButton={false}
        position="center"
      >
        <Box className="text-center p-4">
          <Box className="mb-4">
            <img
              src={process.env.PUBLIC_URL + "/logo_gosafe.jpg"}
              alt="GoSafe Logo"
              style={{ width: 64, height: 64, margin: "0 auto" }}
            />
            <Text className="text-lg font-bold text-black mb-2">
              Cần thông tin người dùng để sử dụng GoSafe
            </Text>
          </Box>

          <Box className="text-left mb-6 space-y-3">
            <Text className="text-gray-700 text-sm">
              <strong>Mục đích sử dụng:</strong>
            </Text>
            <Box className="space-y-2 text-sm text-gray-600">
              <Text>• Hiển thị tên và avatar của bạn</Text>
              <Text>• Cá nhân hóa trải nghiệm sử dụng</Text>
              <Text>• Xác thực danh tính người dùng</Text>
              <Text>• Bảo mật và bảo vệ tài khoản</Text>
            </Box>

            <Text className="text-xs text-gray-500 mt-4">
              Thông tin của bạn sẽ được bảo mật và chỉ sử dụng cho mục đích
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
