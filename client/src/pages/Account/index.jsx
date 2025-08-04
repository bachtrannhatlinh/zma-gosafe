import React, { useState, useEffect } from "react";
import { Page, Box, Text, Button, Avatar } from "zmp-ui";
import { useNavigate } from "zmp-ui";
import { useUserInfo } from "../../contexts/UserContext";
import { useAuth } from "../../contexts/AuthContext";
import { usePhoneAuth } from "../../hooks/usePhoneAuth";

// Components
import BottomNavigation from "../../components/BottomNavigation";
import CustomModal from "../../components/CustomModal";

const Account = () => {
  const navigate = useNavigate();
  const { userInfo, isLoading, clearUserInfo } = useUserInfo();
  const { clearPhoneData } = usePhoneAuth();
  const { logout: jwtLogout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    try {
      localStorage.clear();
      clearUserInfo();
      if (jwtLogout) {
        jwtLogout();
      }
      clearPhoneData();
      setShowLogoutModal(false);
      navigate("/");
    } catch (error) {
      setShowLogoutModal(false);
      navigate("/");
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Prevent scroll
  useEffect(() => {
    const preventScroll = (e) => {
      e.preventDefault();
    };
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("wheel", preventScroll, { passive: false });
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("wheel", preventScroll);
      document.body.style.overflow = "";
    };
  }, []);

  if (isLoading) {
    return (
      <Page style={{ height: "100vh", backgroundColor: "#f9fafb" }}>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Text>Đang tải thông tin...</Text>
        </Box>
        <BottomNavigation activeTab="account" />
      </Page>
    );
  }

  return (
    <Page
      style={{
        height: "100vh",
        backgroundColor: "#f9fafb",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        touchAction: "none",
      }}
    >
      {/* Header */}
      <Box
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "20px",
          paddingTop: "calc(20px + env(safe-area-inset-top))",
          color: "white",
          textAlign: "center",
        }}
      >
        <Text
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          Thông tin tài khoản
        </Text>

        {/* User Avatar */}
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "16px",
          }}
        >
          {userInfo?.userInfo?.avatar ? (
            <Avatar
              src={userInfo.userInfo.avatar}
              size={80}
              style={{
                border: "3px solid rgba(255,255,255,0.3)",
              }}
            />
          ) : (
            <Box
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "3px solid rgba(255,255,255,0.3)",
              }}
            >
              <Text style={{ fontSize: "32px" }}>👤</Text>
            </Box>
          )}
        </Box>

        {/* User Name */}
        <Text
          style={{
            fontSize: "18px",
            fontWeight: "600",
            marginBottom: "8px",
          }}
        >
          {userInfo?.userInfo?.name || "Người dùng Zalo"}
        </Text>

        {/* User ID */}
        <Text
          style={{
            fontSize: "14px",
            opacity: 0.8,
          }}
        >
          ID: {userInfo?.userInfo?.id || "Không có thông tin"}
        </Text>
      </Box>

      {/* User Details Card */}
      <Box
        style={{
          margin: "20px",
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Text
          style={{
            fontSize: "16px",
            fontWeight: "600",
            marginBottom: "16px",
            color: "#333",
          }}
        >
          Chi tiết thông tin
        </Text>

        {/* Info Items */}
        <Box style={{ marginBottom: "12px" }}>
          <Text
            style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}
          >
            Tên hiển thị
          </Text>
          <Text style={{ fontSize: "14px", color: "#333" }}>
            {userInfo?.userInfo?.name || "Chưa có thông tin"}
          </Text>
        </Box>

        <Box style={{ marginBottom: "12px" }}>
          <Text
            style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}
          >
            Zalo ID
          </Text>
          <Text style={{ fontSize: "14px", color: "#333" }}>
            {userInfo?.userInfo?.id || "Chưa có thông tin"}
          </Text>
        </Box>

        <Box style={{ marginBottom: "12px" }}>
          <Text
            style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}
          >
            Trạng thái
          </Text>
          <Text style={{ fontSize: "14px", color: "#10b981" }}>
            Đã xác thực qua Zalo
          </Text>
        </Box>

        <Box style={{ marginBottom: "12px" }}>
          <Text
            style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}
          >
            Số điện thoại
          </Text>
          <Text>{userInfo?.phoneNumber || "Chưa cấp quyền số điện thoại"}</Text>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box
        style={{
          flex: 1,
          padding: "0 20px",
          paddingBottom: "100px",
        }}
      >
        <Button
          onClick={() => navigate("/")}
          style={{
            width: "100%",
            backgroundColor: "#667eea",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "16px",
            fontSize: "16px",
            fontWeight: "500",
            marginBottom: "12px",
          }}
        >
          🏠 Về trang chủ
        </Button>

        <Button
          onClick={handleLogoutClick}
          style={{
            width: "100%",
            backgroundColor: "transparent",
            border: "2px solid #ef4444",
            color: "#ef4444",
            borderRadius: "8px",
            padding: "16px",
            fontSize: "16px",
            fontWeight: "500",
          }}
        >
          🚪 Đăng xuất
        </Button>
      </Box>

      <BottomNavigation activeTab="account" />

      {/* Modal xác nhận đăng xuất */}
      <CustomModal
        visible={showLogoutModal}
        onClose={handleCancelLogout}
        showCloseButton={false}
        position="center"
      >
        <Box className="text-center p-6">
          <Box className="mb-4">
            <Text className="text-3xl mb-3">⚠️</Text>
            <Text className="text-lg font-bold text-black mb-2">
              Xác nhận đăng xuất
            </Text>
            <Text className="text-sm text-gray-600">
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?
            </Text>
          </Box>

          <Box className="flex flex-row gap-3 mt-6">
            <Button
              fullWidth
              onClick={handleCancelLogout}
              style={{
                backgroundColor: "transparent",
                border: "2px solid #6b7280",
                color: "#6b7280",
                borderRadius: "8px",
                padding: "12px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Từ chối
            </Button>
            <Button
              fullWidth
              onClick={handleConfirmLogout}
              style={{
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "12px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Đồng ý
            </Button>
          </Box>
        </Box>
      </CustomModal>
    </Page>
  );
};

export default Account;
