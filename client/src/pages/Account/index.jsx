import React, { useState } from "react";
import { Page, Box, Text, Button } from "zmp-ui";
import { useNavigate } from "zmp-ui";

// Components
import BottomNavigation from "../../components/BottomNavigation";
import MenuItem from "../../components/MenuItem";
import UserProfile from "../../components/UserProfile";
import CustomModal from "../../components/CustomModal";

const Account = () => {
  console.log("Account component rendered");
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // User data - trong thực tế sẽ fetch từ API hoặc context
  const [userInfo] = useState({
    name: "a a",
    email: "sieutronkid325@gmail.com",
    phone: "0969897468",
    avatar: null,
  });

  const menuItems = [
    {
      id: "payment",
      icon: "🚗",
      title: "Quản lý phương tiện",
      hasArrow: true,
    },
    {
      id: "password",
      icon: "🔒",
      title: "Đổi mật khẩu",
      hasArrow: true,
    },
    {
      id: "vnpay",
      icon: "💳",
      title: "Chính sách thanh toán VNPAY-QR",
      hasArrow: true,
    },
    {
      id: "terms",
      icon: "⚖️",
      title: "Điều khoản sử dụng",
      hasArrow: true,
    },
    {
      id: "privacy",
      icon: "🛡️",
      title: "Chính sách bảo mật",
      hasArrow: true,
    },
    {
      id: "promotions",
      icon: "🎁",
      title: "Danh sách khuyến mãi",
      hasArrow: true,
    },
    {
      id: "delete",
      icon: "🗑️",
      title: "Yêu cầu xóa tài khoản",
      hasArrow: true,
      isDestructive: true,
    },
  ];

  const handleMenuClick = (itemId) => {
    console.log("Menu clicked:", itemId);
    switch (itemId) {
      case "payment":
        navigate("/vehicle-management");
        break;
      case "password":
        navigate("/change-password");
        break;
      case "vnpay":
        navigate("/vnpay-policy");
        break;
      case "terms":
        // Navigate to terms of service
        break;
      case "privacy":
        // Navigate to privacy policy
        break;
      case "promotions":
        navigate("/promotions");
        break;
      case "delete":
        setShowDeleteModal(true);
        break;
      default:
        break;
    }
  };

  const handleDeleteAccount = () => {
    console.log("Account deletion confirmed");
    setShowDeleteModal(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    console.log("User logged out");
    setShowLogoutModal(false);
    // Implement logout logic here
    // navigate("/login") or clear user data
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <Page
      style={{
        height: "100vh",
        backgroundColor: "#f9fafb",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden", // Prevent scroll
      }}
    >
      {/* User Profile Section - Tăng chiều cao */}
      <Box
        style={{
          background: "linear-gradient(to right, #fb923c, #ef4444)",
          padding: "0 16px",
          paddingTop: "calc(20px + env(safe-area-inset-top))",
          paddingBottom: "30px",
          color: "white",
          position: "relative",
          flexShrink: 0,
          minHeight: "100px",
        }}
      >
        {/* Settings Icon */}
        <Box
          style={{
            position: "absolute",
            top: "calc(16px + env(safe-area-inset-top))",
            right: "16px",
            cursor: "pointer",
          }}
        >
          <Text style={{ fontSize: "18px", color: "white" }}>⚙️</Text>
        </Box>

        {/* User Info Layout - Tăng khoảng cách */}
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px", // Tăng gap từ 12px lên 16px
            paddingTop: "12px", // Tăng padding top
            paddingBottom: "8px", // Thêm padding bottom
          }}
        >
          {/* Avatar - Tăng size */}
          <Box
            style={{
              width: "50px", // Tăng từ 40px lên 50px
              height: "50px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Text style={{ fontSize: "22px", color: "white" }}>👤</Text>
          </Box>

          {/* User Details - Tăng spacing */}
          <Box style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: "16px", // Tăng từ 14px lên 16px
                fontWeight: "bold",
                color: "white",
                marginBottom: "6px", // Tăng margin
              }}
            >
              {userInfo.name}
            </Text>
            <Text
              style={{
                fontSize: "12px",
                color: "white",
                opacity: 0.9,
                lineHeight: "1.4", // Tăng line height
              }}
            >
              {userInfo.email}
            </Text>
            <Text
              style={{
                fontSize: "12px",
                color: "white",
                opacity: 0.9,
                marginTop: "2px", // Thêm margin top
              }}
            >
              {userInfo.phone}
            </Text>
          </Box>
        </Box>
      </Box>

      {/* Menu Items - Fixed height */}
      <Box
        style={{
          flex: 1,
          backgroundColor: "white",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Menu List */}
        <Box style={{ flex: 1, overflow: "hidden" }}>
          {menuItems.map((item, index) => (
            <MenuItem
              key={item.id}
              icon={item.icon}
              title={item.title}
              hasArrow={item.hasArrow}
              isDestructive={item.isDestructive}
              onClick={() => handleMenuClick(item.id)}
              showBorder={index < menuItems.length - 1}
            />
          ))}
        </Box>

        {/* Logout Button - Fixed at bottom */}
        <Box
          style={{
            padding: "12px 16px",
            backgroundColor: "white",
            borderTop: "1px solid #e5e7eb",
            flexShrink: 0,
            marginBottom: "80px", // Space for bottom nav
          }}
        >
          <Button
            onClick={handleLogout}
            style={{
              width: "100%",
              backgroundColor: "transparent",
              border: "2px solid #ef4444",
              color: "#ef4444",
              borderRadius: "8px",
              padding: "10px",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            🚪 Đăng xuất
          </Button>
        </Box>
      </Box>

      {/* Logout Confirmation Modal */}
      <CustomModal
        visible={showLogoutModal}
        onClose={handleCancelLogout}
        showCloseButton={false}
        position="center"
        hideBottomNav={false}
      >
        <Box className="text-center p-6">
          <Text
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#111827",
              marginBottom: "16px",
            }}
          >
            Đăng xuất
          </Text>

          <Text
            style={{
              fontSize: "14px",
              color: "#6b7280",
              lineHeight: "1.5",
              marginBottom: "24px",
            }}
          >
            Bạn có chắc chắn muốn đăng xuất khỏi ứng dụng GOSafe không?
          </Text>

          <Box
            style={{
              display: "flex",
              gap: "12px",
            }}
          >
            <Button
              onClick={handleConfirmLogout}
              style={{
                flex: 1,
                backgroundColor: "#16a34a",
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

            <Button
              onClick={handleCancelLogout}
              style={{
                flex: 1,
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "12px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Hủy
            </Button>
          </Box>
        </Box>
      </CustomModal>

      {/* Delete Account Modal */}
      <CustomModal
        visible={showDeleteModal}
        onClose={handleCancelDelete}
        showCloseButton={false}
        position="center"
        hideBottomNav={false}
      >
        <Box className="text-center p-6">
          <Text
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#111827",
              marginBottom: "16px",
            }}
          >
            Xóa tài khoản
          </Text>

          <Text
            style={{
              fontSize: "14px",
              color: "#6b7280",
              lineHeight: "1.5",
              marginBottom: "24px",
            }}
          >
            Chúng tôi rất tiếc khi bạn muốn rời GOSafe, nhưng xin lưu ý các tài
            khoản đã xóa sẽ không hoạt động trở lại.
          </Text>

          <Box
            style={{
              display: "flex",
              gap: "12px",
            }}
          >
            <Button
              onClick={handleDeleteAccount}
              style={{
                flex: 1,
                backgroundColor: "#16a34a",
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

            <Button
              onClick={handleCancelDelete}
              style={{
                flex: 1,
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "12px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Hủy
            </Button>
          </Box>
        </Box>
      </CustomModal>

      {/* Bottom Navigation - Fixed */}
      <BottomNavigation activeTab="account" />
    </Page>
  );
};

export default Account;
