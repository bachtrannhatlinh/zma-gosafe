import React, { useState, useEffect } from "react";
import { Box, Text, Button, Icon } from "zmp-ui";
import { useNavigate } from "zmp-ui";
import { usePhoneAuth } from "../hooks/usePhoneAuth";
import { debugPhoneStorage } from "../utils/phoneUtils";
import PhonePermissionModal from "./PhonePermissionModal";

const BottomNavigation = ({ activeTab = "home" }) => {
  const navigate = useNavigate();
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [pendingPath, setPendingPath] = useState(null);

  const {
    phoneNumber,
    isGettingPhone,
    checkPhoneExists,
    requestPhonePermission,
  } = usePhoneAuth();

  // Debug khi component mount
  useEffect(() => {
    console.log("🔍 BottomNavigation mounted");
    debugPhoneStorage();
  }, []);

  const navItems = [
    {
      id: "home",
      icon: <Icon icon="zi-home" style={{ fontSize: 24 }} />,
      label: "Trang chủ",
      isActive: activeTab === "home",
      path: "/",
    },
    {
      id: "activity",
      icon: <Icon icon="zi-call" style={{ fontSize: 24 }} />,
      label: "Gọi",
      isActive: activeTab === "call",
      path: "/call-to-user",
      requirePhone: true,
    },
    {
      id: "notification",
      icon: <Icon icon="zi-notif" style={{ fontSize: 24 }} />,
      label: "Lịch sử",
      isActive: activeTab === "history",
      path: "/history",
    },
    {
      id: "account",
      icon: <Icon icon="zi-user" style={{ fontSize: 24 }} />,
      label: "Tài khoản",
      isActive: activeTab === "account",
      path: "/account",
      requirePhone: true,
    },
  ];

  const handleNavClick = async (item) => {
    console.log("Navigation clicked:", item.id, "Path:", item.path);

    // Check if this navigation requires phone number
    if (item.requirePhone) {
      // Luôn lấy số điện thoại mới nhất từ localStorage
      const currentPhone = localStorage.getItem("user_phone");
      const hasPhone = checkPhoneExists();

      debugPhoneStorage();
      console.log("📱 Phone check result:", {
        hasPhone,
        currentPhone,
        phoneNumber,
        phoneNumberType: typeof phoneNumber,
      });

      // Prioritize currentPhone over phoneNumber
      const displayPhone = currentPhone || phoneNumber;

      if (
        !hasPhone ||
        !displayPhone ||
        displayPhone === "Chưa có số điện thoại" ||
        displayPhone === "Cần cấp quyền" ||
        displayPhone === "null" ||
        displayPhone === "undefined"
      ) {
        // Kiểm tra lại lần cuối trước khi show modal (tránh race condition)
        setTimeout(() => {
          const recheckPhone = localStorage.getItem("user_phone");
          const recheckDisplayPhone = recheckPhone || phoneNumber;
          const recheckHasPhone = checkPhoneExists();

          if (
            !recheckHasPhone ||
            !recheckDisplayPhone ||
            recheckDisplayPhone === "Chưa có số điện thoại" ||
            recheckDisplayPhone === "Cần cấp quyền" ||
            recheckDisplayPhone === "null" ||
            recheckDisplayPhone === "undefined"
          ) {
            setPendingPath(item.path);
            setShowPhoneModal(true);
          } else {
            setShowPhoneModal(false);
            setPendingPath(null);
            navigate(item.path);
          }
        }, 50);
        return;
      } else {
        setShowPhoneModal(false);
        setPendingPath(null);
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
      // Đợi localStorage cập nhật, sau đó kiểm tra lại số điện thoại
      setTimeout(() => {
        const recheckPhone = localStorage.getItem("user_phone");
        const recheckHasPhone = checkPhoneExists();
        if (
          pendingPath &&
          recheckHasPhone &&
          recheckPhone &&
          recheckPhone !== "Chưa có số điện thoại" &&
          recheckPhone !== "Cần cấp quyền" &&
          recheckPhone !== "null" &&
          recheckPhone !== "undefined"
        ) {
          navigate(pendingPath);
          setPendingPath(null);
        }
      }, 100);
    }
  };

  return (
    <>
      <Box
        className="fixed bottom-0 left-0 right-0 w-full bg-white border-t border-gray-200 px-2 sm:px-4 py-2 z-50 shadow-lg"
        data-fixed-element="true"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: "white",
          borderTop: "1px solid #e5e7eb",
          touchAction: "manipulation",
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitTouchCallout: "none",
          height: "70px",
          minHeight: "70px",
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
                touchAction: "manipulation",
                userSelect: "none",
                WebkitUserSelect: "none",
                backgroundColor: "transparent",
                border: "none",
              }}
            >
              <Text
                className="text-lg sm:text-xl mb-1 transition-all duration-200"
                style={{ userSelect: "none" }}
              >
                {item.icon}
              </Text>
              <Text
                className={`text-xs truncate font-medium transition-all duration-200 ${
                  item.isActive ? "text-orange-500" : "text-gray-500"
                }`}
                style={{
                  userSelect: "none",
                  opacity: 1,
                  visibility: "visible",
                }}
              >
                {item.label}
              </Text>
            </Button>
          ))}
        </Box>
      </Box>

      {/* Modal xin quyền số điện thoại */}
      <PhonePermissionModal
        visible={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        onAgree={handlePhonePermission}
        isGettingPhone={isGettingPhone}
      />
    </>
  );
};

export default React.memo(BottomNavigation);