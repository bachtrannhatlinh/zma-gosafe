import React, { useState } from "react";
import { Page, Box, Text } from "zmp-ui";
import { useNavigate } from "zmp-ui";

// Import banner image
import bannerImage from "../../static/img/banner_GOSafe.jpg";

// Components
import LoadingScreen from "../../components/LoadingScreen";
import ServiceSection from "../../components/ServiceSection";
import BottomNavigation from "../../components/BottomNavigation";
import PullToRefresh from "../../components/PullToRefresh";
import DevFeatureToast from "../../components/DevFeatureToast";
import PhonePermissionModal from "../../components/PhonePermissionModal"; // Thêm dòng này

// Hooks
import { usePhoneAuth } from "../../hooks/usePhoneAuth";
import { useServiceNavigation } from "../../hooks/useNavigation";

// Constants
import { DRIVER_SERVICES, OTHER_SERVICES } from "../../constants/dashboard";

// Danh sách services đã phát triển
const DEVELOPED_SERVICES = ["sms-brandname", "zalo-chat"];

const Dashboard = () => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false); // Thêm state này
  const [pendingServiceId, setPendingServiceId] = useState(null); // Để lưu serviceId đang chờ

  const {
    phoneNumber,
    isGettingPhone,
    checkPhoneExists,
    requestPhonePermission,
  } = usePhoneAuth();

  // Custom hooks
  const { handleServiceClick } = useServiceNavigation(navigate);

  // Function xử lý click service - nhận showToast từ DevFeatureToast
  const handleServiceClickWithToast = (showToast) => (serviceId) => {
    if (DEVELOPED_SERVICES.includes(serviceId)) {
      // Nếu chưa có số điện thoại thì hiện modal xin quyền
      if (
        !checkPhoneExists() ||
        !phoneNumber ||
        phoneNumber === "Chưa có số điện thoại" ||
        phoneNumber === "Cần cấp quyền" ||
        phoneNumber === "null" ||
        phoneNumber === "undefined"
      ) {
        setPendingServiceId(serviceId);
        setShowPhoneModal(true);
        return;
      }
      // Service đã phát triển - navigate trực tiếp
      handleServiceClick(serviceId);
    } else {
      // Service chưa phát triển - hiển thị toast
      showToast();
    }
  };

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

  // Xử lý khi người dùng đồng ý cấp quyền số điện thoại
  const handlePhonePermission = async () => {
    const result = await requestPhonePermission();
    if (result.success) {
      setShowPhoneModal(false);
      setTimeout(() => {
        const recheckPhone = localStorage.getItem("user_phone");
        const recheckHasPhone = checkPhoneExists();
        if (
          pendingServiceId &&
          recheckHasPhone &&
          recheckPhone &&
          recheckPhone !== "Chưa có số điện thoại" &&
          recheckPhone !== "Cần cấp quyền" &&
          recheckPhone !== "null" &&
          recheckPhone !== "undefined"
        ) {
          handleServiceClick(pendingServiceId);
          setPendingServiceId(null);
        }
      }, 100);
    }
  };

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
      <DevFeatureToast>
        {(showToast) => (
          <PullToRefresh onRefresh={handleRefresh} refreshing={isRefreshing}>
            {/* Hero Banner */}
            <Box
              style={{
                background: "linear-gradient(to right, #fb923c, #ef4444)",
                paddingTop: "env(safe-area-inset-top, 32px)", // tránh Dynamic Island che mất
              }}
            >
              <img
                src={bannerImage}
                alt="GOSafe Banner"
                style={{
                  width: "100%",
                  height: "270px",
                  objectFit: "contain",
                  userSelect: "none",
                  pointerEvents: "none",
                  display: "block",
                }}
              />
            </Box>
            {/* <UserHeader userInfo={userInfo} isLoading={isLoading} /> */}

            {/* Main Content */}
            <Box
              style={{
                background: "linear-gradient(to bottom, #fb923c, #ef4444)",
                minHeight: "calc(100vh - 192px)",
                paddingBottom: "120px",
              }}
            >
              <ServiceSection
                title="DỊCH VỤ TÀI XẾ"
                services={DRIVER_SERVICES}
                onServiceClick={handleServiceClickWithToast(showToast)}
                columns={3}
              />
              <ServiceSection
                title="CÁC DỊCH VỤ KHÁC CỦA GOSAFE"
                services={OTHER_SERVICES}
                onServiceClick={handleServiceClickWithToast(showToast)}
                columns={3}
              />
            </Box>
          </PullToRefresh>
        )}
      </DevFeatureToast>

      <BottomNavigation activeTab="home" />

      {/* Modal xin quyền số điện thoại */}
      <PhonePermissionModal
        visible={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        onAgree={handlePhonePermission}
        isGettingPhone={isGettingPhone}
      />
    </Page>
  );
};

export default Dashboard;
