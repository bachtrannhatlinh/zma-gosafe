import React, { useState } from "react";
import { Page, Box, Text } from "zmp-ui";
import { useNavigate } from "zmp-ui";

// Import banner image
import bannerImage from "../../static/img/banner_GOSafe.jpg";

// Components
import LoadingScreen from "../../components/LoadingScreen";
import UserHeader from "../../components/UserHeader";
import ServiceSection from "../../components/ServiceSection";
import BottomNavigation from "../../components/BottomNavigation";
import PullToRefresh from "../../components/PullToRefresh";

// Hooks
import { useUserData } from "../../hooks/useUserData";
import { useServiceNavigation } from "../../hooks/useNavigation";

// Constants
import { DRIVER_SERVICES, OTHER_SERVICES } from "../../constants/dashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Custom hooks
  const { userInfo, isLoading, error, refetch } = useUserData();
  const { handleServiceClick } = useServiceNavigation(navigate);

  // Handle pull-to-refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Simulate network delay for better UX
      const refreshPromise = refetch();
      const minDelayPromise = new Promise((resolve) =>
        setTimeout(resolve, 800)
      );

      // Wait for both data refresh and minimum delay
      await Promise.all([refreshPromise, minDelayPromise]);
    } catch (error) {
      console.error("Error refreshing data:", error);
      // Still wait minimum time even on error for consistent UX
      await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
      setIsRefreshing(false);
    }
  };

  // Early return for loading state
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Early return for error state
  if (error) {
    return (
      <Page className="bg-gray-50 min-h-screen flex items-center justify-center">
        <Box className="text-center p-4">
          <Text className="text-red-600 mb-2">Đã xảy ra lỗi</Text>
          <Text className="text-gray-600 text-sm">{error}</Text>
        </Box>
      </Page>
    );
  }

  return (
    <Page
      className="dashboard-page"
      style={{
        height: "100vh",
        backgroundColor: "#fb923c",
        background: "linear-gradient(to bottom, #fb923c, #ef4444)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <PullToRefresh onRefresh={handleRefresh} refreshing={isRefreshing}>
        {/* Header with user info */}
        <UserHeader userInfo={userInfo} isLoading={isLoading} />

        {/* Hero Banner */}
        <Box
          style={{
            position: "relative",
            background: "linear-gradient(to right, #fb923c, #ef4444)",
          }}
        >
          <img
            src={bannerImage}
            alt="GOSafe Banner"
            style={{
              width: "100%",
              height: "192px",
              objectFit: "cover",
              opacity: 0.9,
              userSelect: "none",
              pointerEvents: "none",
              display: "block",
            }}
          />
        </Box>

        {/* Main Content */}
        <Box
          style={{
            background: "linear-gradient(to bottom, #fb923c, #ef4444)",
            minHeight: "calc(100vh - 192px)", // Trừ đi chiều cao banner
            paddingBottom: "120px", // Space cho bottom nav
          }}
        >
          <ServiceSection
            title="DỊCH VỤ TÀI XẾ"
            services={DRIVER_SERVICES}
            onServiceClick={handleServiceClick}
            columns={3}
          />

          <ServiceSection
            title="CÁC DỊCH VỤ KHÁC CỦA GOSAFE"
            services={OTHER_SERVICES}
            onServiceClick={handleServiceClick}
            columns={3}
          />
        </Box>
      </PullToRefresh>

      {/* Bottom Navigation - Fixed */}
      <BottomNavigation activeTab="home" />
    </Page>
  );
};

export default Dashboard;
