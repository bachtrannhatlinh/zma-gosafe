import React, { useCallback } from "react";
import { Page, Box, Text, useNavigate, Header } from "zmp-ui";
import { EmptyState, PromoCard, BottomNavigation } from "../../components";
import usePromotions from "../../hooks/usePromotions";

const Promotions = () => {
  const navigate = useNavigate();
  const {
    filteredPromotions,
    currentCategoryLabel,
    handlePromotionClick,
  } = usePromotions();

  const handleBackClick = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <Page className="bg-gray-50 min-h-screen relative smooth-page">
      <Header
        title="Khuyến mãi"
        showBackIcon={true}
        onBackClick={handleBackClick}
        className="bg-white shadow-sm"
        style={{ 
          marginTop: 0, 
          paddingTop: 'max(0.5rem, env(safe-area-inset-top))', 
          paddingBottom: 8, 
          height: 'auto', 
          minHeight: 'auto'
        }}
      />

      <Box className="px-4 page-with-header-nav">
        {/* Section Header */}
        <Box className="mb-4 flex items-center justify-between">
          <Text className="font-bold text-lg text-gray-800">
            {currentCategoryLabel}
          </Text>
        </Box>

        {/* Promotions Grid */}
        {filteredPromotions.length > 0 ? (
          <Box className="grid grid-cols-2 gap-4">
            {filteredPromotions.map((promo) => (
              <PromoCard
                key={promo.id}
                promo={promo}
                onClick={handlePromotionClick}
              />
            ))}
          </Box>
        ) : (
          <EmptyState
            icon="😔"
            title="Không có khuyến mãi"
            subtitle="Hiện tại chưa có ưu đãi nào trong danh mục này"
          />
        )}
      </Box>
    </Page>
  );
};

export default Promotions;
