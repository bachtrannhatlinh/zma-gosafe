import React from "react";
import { Box, Text, Button, Icon } from "zmp-ui";
import { useNavigate } from "zmp-ui";

const BottomNavigation = ({ activeTab = "home" }) => {
  const navigate = useNavigate();

  const navItems = [
    { id: "home", icon: <Icon icon="zi-home" style={{ fontSize: 24 }} />, label: "Trang chủ", isActive: activeTab === "home", path: "/" },
    { id: "activity", icon: <Icon icon="zi-call" style={{ fontSize: 24 }} />, label: "Gọi", isActive: activeTab === "call", path: "/call-to-user" },
    { id: "notification", icon: <Icon icon="zi-notif" style={{ fontSize: 24 }} />, label: "Lịch sử", isActive: activeTab === "history", path: "/history" },
    { id: "account", icon: <Icon icon="zi-user" style={{ fontSize: 24 }} />, label: "Tài khoản", isActive: activeTab === "account", path: "/account" },
  ];

  const handleNavClick = (item) => {
    console.log("Navigation clicked:", item.id, "Path:", item.path);
    if (item.path) {
      console.log("Navigating to:", item.path);
      navigate(item.path);
    } else {
      console.log("No path defined for:", item.id);
    }
  };

  return (
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
        touchAction: 'manipulation', // Prevent gesture interference
        userSelect: 'none', // Prevent text selection
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        height: '70px', // Fixed height for consistency
        minHeight: '70px'
      }}
      onTouchStart={(e) => {
        // Stop propagation to prevent pull-to-refresh
        e.stopPropagation();
      }}
      onTouchMove={(e) => {
        // Stop propagation to prevent pull-to-refresh
        e.stopPropagation();
      }}
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
                opacity: 1, // Ensure label is always visible
                visibility: 'visible'
              }}
            >
              {item.label}
            </Text>
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default React.memo(BottomNavigation);
