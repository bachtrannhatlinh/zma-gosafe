import React, { useState } from "react";
import { Page, Box, Text } from "zmp-ui";
import { useNavigate } from "zmp-ui";

// Import banner image
import bannerImage from "../../static/img/banner_GOSafe.jpg";

// Components
import LoadingScreen from "../../components/LoadingScreen";
import UserHeader from "../../components/UserHeader";
import ServiceGrid from "../../components/ServiceGrid";
import SectionHeader from "../../components/SectionHeader";
import CardSlider from "../../components/CardSlider";
import BottomNavigation from "../../components/BottomNavigation";
import PullToRefresh from "../../components/PullToRefresh";
import ServerTest from "../../components/ServerTest";

// Hooks
import { useUserData } from "../../hooks/useUserData";
import { useServiceNavigation, usePromotionNavigation } from "../../hooks/useNavigation";

// Constants
import { SERVICES, PROMOTIONS, NEWS_DATA } from "../../constants/dashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Custom hooks
  const { userInfo, isLoading, error, refetch } = useUserData();
  const { handleServiceClick } = useServiceNavigation(navigate);
  const { handlePromoClick, handleViewAllPromotions, handleViewAllNews } = usePromotionNavigation(navigate);

  // Handle pull-to-refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Simulate network delay for better UX
      const refreshPromise = refetch();
      const minDelayPromise = new Promise(resolve => setTimeout(resolve, 800));
      
      // Wait for both data refresh and minimum delay
      await Promise.all([refreshPromise, minDelayPromise]);
      
    } catch (error) {
      console.error("Error refreshing data:", error);
      // Still wait minimum time even on error for consistent UX
      await new Promise(resolve => setTimeout(resolve, 500));
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
    <Page className="bg-white relative flex flex-col" style={{ height: '100vh', overflow: 'hidden' }}>
      {/* Content with Pull to Refresh */}
      <Box className="flex-1 overflow-hidden">
        <PullToRefresh onRefresh={handleRefresh} refreshing={isRefreshing}>
          {/* Header with user info - with safe area padding */}
          <UserHeader userInfo={userInfo} isLoading={isLoading} />
          
          {/* Hero Banner */}
          <Box className="relative">
            <img 
              src={bannerImage} 
              alt="GOSafe Banner" 
              className="w-full h-48 object-cover"
              style={{ userSelect: 'none', pointerEvents: 'none' }}
            />
          </Box>

          {/* Main Content */}
          <Box className="pb-4">
            {/* Services Grid */}
            <Box className="pt-6">
              <ServiceGrid services={SERVICES} onServiceClick={handleServiceClick} />
            </Box>

            {/* Promotions Section */}
            <Box className="px-2 py-6 mb-6">
              <SectionHeader 
                title="Khuyến mãi" 
                onViewAll={handleViewAllPromotions}
              />
              <CardSlider 
                items={PROMOTIONS} 
                onItemClick={handlePromoClick}
                testId="promotions-slider"
              />
            </Box>

            {/* News Section */}
            <Box className="px-2 py-6">
              <SectionHeader 
                title="Tin tức" 
                onViewAll={handleViewAllNews}
              />
              <CardSlider 
                items={NEWS_DATA} 
                onItemClick={handlePromoClick}
                testId="news-slider"
              />
            </Box>

            {/* Development: Server Test Component */}
            {process.env.NODE_ENV === 'development' && <ServerTest />}
          </Box>
        </PullToRefresh>
      </Box>

      {/* Bottom Navigation - Fixed outside of PullToRefresh */}
      <BottomNavigation activeTab="home" />
    </Page>
  );
};

export default Dashboard;
