import React, { useState, useEffect } from "react";
import { Box, Text, Button, Icon } from "zmp-ui";
import { useNavigate } from "zmp-ui";
import { usePhoneAuth } from "../hooks/usePhoneAuth";
import { debugPhoneStorage, clearAllPhoneData } from "../utils/phoneUtils";
import CustomModal from "./CustomModal";

const BottomNavigation = ({ activeTab = "home" }) => {
  const navigate = useNavigate();
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  
  const { 
    phoneNumber, 
    isGettingPhone, 
    checkPhoneExists, 
    requestPhonePermission 
  } = usePhoneAuth();

  // Debug khi component mount
  useEffect(() => {
    console.log("🔍 BottomNavigation mounted");
    debugPhoneStorage();
  }, []);

  const navItems = [
    { id: "home", icon: <Icon icon="zi-home" style={{ fontSize: 24 }} />, label: "Trang chủ", isActive: activeTab === "home", path: "/" },
    { id: "activity", icon: <Icon icon="zi-call" style={{ fontSize: 24 }} />, label: "Gọi", isActive: activeTab === "call", path: "/call-to-user", requirePhone: true },
    { id: "notification", icon: <Icon icon="zi-notif" style={{ fontSize: 24 }} />, label: "Lịch sử", isActive: activeTab === "history", path: "/history" },
    { id: "account", icon: <Icon icon="zi-user" style={{ fontSize: 24 }} />, label: "Tài khoản", isActive: activeTab === "account", path: "/account" },
  ];

  const handleNavClick = async (item) => {
    console.log("Navigation clicked:", item.id, "Path:", item.path);
    
    // Check if this navigation requires phone number
    if (item.requirePhone) {
      // Debug trước khi check
      debugPhoneStorage();
      
      const hasPhone = checkPhoneExists();
      const currentPhone = localStorage.getItem("user_phone");
      
      console.log("📱 Phone check result:", { 
        hasPhone, 
        currentPhone, 
        phoneNumber,
        phoneNumberType: typeof phoneNumber
      });
      
      if (!hasPhone || 
          !currentPhone || 
          currentPhone === "Chưa có số điện thoại" || 
          currentPhone === "Cần cấp quyền" ||
          currentPhone === "null" ||
          currentPhone === "undefined") {
        console.log("📱 Cần số điện thoại để truy cập:", item.label);
        setShowPhoneModal(true);
        return;
      }
      
      console.log("✅ Phone exists, navigating to:", item.path);
    }
    
    if (item.path) {
      console.log("Navigating to:", item.path);
      navigate(item.path);
    }
  };

  const handlePhonePermission = async () => {
    const result = await requestPhonePermission();
    
    if (result.success) {
      setShowPhoneModal(false);
      // Navigate to call page after getting phone
      navigate("/call-to-user");
    }
  };

  return (
    <>
      <Box 
        className="fixed bottom-0 left-0 right-0 w-full bg-white border-t border-gray-200 px-2 sm:px-4 py-2 z-50 shadow-lg"
        data-fixed-element="true"
        style={{ 
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: 'white',
          borderTop: '1px solid #e5e7eb',
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
          height: '70px',
          minHeight: '70px'
        }}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <Box className="flex justify-around items-center h-full">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="tertiary"
              className="flex flex-col items-center justify-center py-1 px-1 min-w-0 flex-1 transition-all duration-200 h-full"
              onClick={() => handleNavClick(item)}
              style={{
                touchAction: 'manipulation',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                backgroundColor: 'transparent',
                border: 'none'
              }}
            >
              <Text 
                className="text-lg sm:text-xl mb-1 transition-all duration-200" 
                style={{ userSelect: 'none' }}
              >
                {item.icon}
              </Text>
              <Text 
                className={`text-xs truncate font-medium transition-all duration-200 ${
                  item.isActive ? "text-orange-500" : "text-gray-500"
                }`}
                style={{ 
                  userSelect: 'none',
                  opacity: 1,
                  visibility: 'visible'
                }}
              >
                {item.label}
              </Text>
            </Button>
          ))}
        </Box>
      </Box>

      {/* Modal xin quyền số điện thoại */}
      <CustomModal
        visible={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        showCloseButton={false}
        position="center"
      >
        <Box className="text-center p-4">
          <Box className="mb-4">
            <Text className="text-2xl mb-2">📱</Text>
            <Text className="text-lg font-bold text-black mb-2">
              Cần số điện thoại để sử dụng tính năng Gọi
            </Text>
            <Text className="text-sm text-gray-600">
              Vui lòng cấp quyền số điện thoại để có thể sử dụng tính năng gọi điện
            </Text>
          </Box>

          <Box className="flex flex-row gap-2">
            <Button
              fullWidth
              className="custom-btn-outline"
              onClick={() => setShowPhoneModal(false)}
              disabled={isGettingPhone}
            >
              Đóng
            </Button>
            <Button
              fullWidth
              className="custom-btn-filled"
              onClick={handlePhonePermission}
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

export default React.memo(BottomNavigation);
