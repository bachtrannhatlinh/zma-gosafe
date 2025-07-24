import React, { useState } from "react";
import { Box, Text, Avatar, Button } from "zmp-ui";
import { authorize, getUserInfo, getPhoneNumber } from "zmp-sdk/apis";
import CustomModal from "./CustomModal";

const UserHeader = ({ userInfo, isLoading }) => {
  const [showModal, setShowModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [updatedUserInfo, setUpdatedUserInfo] = useState(userInfo);
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleLocationClick = () => {
    // Chỉ hiển thị modal nếu chưa có thông tin user
    if (!currentUserInfo?.name) {
      setShowModal(true);
    }
    // Nếu đã có user info, không làm gì (hoặc có thể navigate đến trang khác)
  };

  const handleLogin = () => {
    // Đóng modal đầu tiên và hiển thị modal yêu cầu quyền
    setShowModal(false);
    setShowPermissionModal(true);
  };

  const handleAllowPermission = () => {
    // Yêu cầu quyền truy cập số điện thoại từ Zalo
    authorize({
      scopes: ["scope.userPhonenumber"],
      success: (data) => {
        console.log("Đồng ý chia sẻ số điện thoại:", data);
        // Sau khi được cấp quyền, có thể lấy thông tin user
        getUserInfo({
          success: (userData) => {
            console.log("Thông tin user:", userData);
            // Cập nhật thông tin user vào state
            setUpdatedUserInfo(userData.userInfo);
            
            // Lấy số điện thoại sau khi có quyền
            getPhoneNumber({
              success: (phoneData) => {
                console.log("Số điện thoại:", phoneData);
                setPhoneNumber(phoneData.number);
              },
              fail: (error) => {
                console.error("Lỗi lấy số điện thoại:", error);
              }
            });
          },
          fail: (error) => {
            console.error("Lỗi lấy thông tin user:", error);
          }
        });
        setShowPermissionModal(false);
      },
      fail: (error) => {
        console.error("Người dùng từ chối hoặc lỗi:", error);
        setShowPermissionModal(false);
      }
    });
  };

  const handleRejectPermission = () => {
    setShowPermissionModal(false);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  // Sử dụng updatedUserInfo nếu có, nếu không thì dùng userInfo từ props
  const currentUserInfo = updatedUserInfo || userInfo;
  if (isLoading) {
    return (
      <Box className="px-4 relative bg-white shadow-sm" style={{ paddingTop: 'max(env(safe-area-inset-top), 44px)' }}>
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
      <Box className="px-4 relative bg-white shadow-sm" style={{ paddingTop: 'max(env(safe-area-inset-top), 30px)' }}>
        <Box className="flex items-center justify-between py-4">
          <Box 
            className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
            onClick={handleLocationClick}
          >
            <Avatar src={currentUserInfo?.avatar || ""} size="40" className="bg-white">
              {currentUserInfo?.name?.charAt(0) || "U"}
            </Avatar>
            <Box>
              <Text className="text-black text-xs">
                {currentUserInfo?.name ? `Xin chào, ${currentUserInfo.name} 👋` : "Địa điểm của tôi 📍"}
              </Text>
              <Text className="text-black text-sm font-bold">
                {currentUserInfo?.name ? "Chào mừng bạn đến với GOSafe!" : "Cập nhật vị trí của bạn ngay!"}
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Modal cập nhật vị trí */}
      <CustomModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        showCloseButton={false}
        position="center"
      >
        <Box className="text-center p-4">
          <Text className="text-lg font-bold text-black mb-4">
            GOSafe cần số điện thoại của bạn
          </Text>
          <Text className="text-gray-600 text-sm mb-6">
            Chúng tôi cần thông tin số điện thoại, tên và ảnh đại diện của bạn để định danh tài khoản
          </Text>
          
          <Box className="flex flex-row gap-2">
            <Button
              fullWidth
              className="custom-btn-outline"
              onClick={handleClose}
            >
              Đóng
            </Button>
            <Button
              fullWidth
              className="custom-btn-filled"
              onClick={handleLogin}
            >
              Đăng nhập
            </Button>
          </Box>
        </Box>
      </CustomModal>

      {/* Custom Bottom Sheet cho quyền truy cập số điện thoại */}
      <CustomModal
        visible={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        showCloseButton={false}
        position="bottom"
      >
        <Box className="text-center p-6" style={{ paddingTop: '28px' }}>
          {/* Logo GOSafe */}
          <Box className="flex justify-center mb-4">
            <Box className="w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden">
              <img 
                src="/images/logo_GOSafe.jpg" 
                alt="GOSafe Logo" 
                className="w-full h-full object-contain"
              />
            </Box>
          </Box>

          {/* Tiêu đề */}
          <Text className="text-lg font-bold text-black mb-2">
            Cho phép GOSafe truy cập số điện thoại của bạn
          </Text>
          
          {/* Mô tả */}
          <Text className="text-gray-600 text-sm mb-6 leading-relaxed">
            Quyền truy cập số điện thoại được sử dụng để thực hiện các chức năng cần thiết như: đăng nhập ứng dụng, ...
          </Text>

          {/* Số điện thoại hiển thị */}
          <Box className="flex items-center justify-center gap-3 mb-6 p-3 bg-gray-50 rounded-lg">
            <Box className="w-6 h-6 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Box>
            <Box>
              {/* <Text className="text-base font-medium">849698**468</Text> */}
              <Text className="text-xs text-gray-500">Số điện thoại liên kết với Zalo</Text>
            </Box>
          </Box>

          {/* Ghi chú */}
          <Text className="text-xs text-gray-500 mb-6">
            Bằng cách nhấn "Cho phép", tôi đồng ý với{" "}
            <Text className="text-blue-500 underline">điều khoản sử dụng của Zalo</Text>
          </Text>

          {/* Buttons */}
          <Box className="flex flex-row gap-3">
            <Button
              fullWidth
              className="custom-btn-outline"
              onClick={handleRejectPermission}
            >
              Từ chối
            </Button>
            <Button
              fullWidth
              className="custom-btn-filled"
              onClick={handleAllowPermission}
            >
              Cho phép
            </Button>
          </Box>
        </Box>
      </CustomModal>

    </>
  );
};

export default React.memo(UserHeader);
