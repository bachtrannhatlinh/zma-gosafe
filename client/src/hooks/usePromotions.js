import { useState, useMemo, useCallback } from 'react';
import { MOCK_PROMOTIONS, PROMOTION_CATEGORIES } from '../constants/promotions';

const usePromotions = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Get all promotions (could be from API in the future)
  const allPromotions = useMemo(() => MOCK_PROMOTIONS, []);

  // Get categories
  const categories = useMemo(() => PROMOTION_CATEGORIES, []);

  // Filter promotions based on selected category
  const filteredPromotions = useMemo(() => {
    if (selectedCategory === "all") {
      return allPromotions;
    }
    return allPromotions.filter((promo) => promo.category === selectedCategory);
  }, [allPromotions, selectedCategory]);

  // Get current category label
  const currentCategoryLabel = useMemo(() => {
    if (selectedCategory === "all") {
      return "Tất cả khuyến mãi";
    }
    return categories.find((c) => c.id === selectedCategory)?.label || "";
  }, [categories, selectedCategory]);

  // Handle category change
  const handleCategoryChange = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
  }, []);

  // Handle promotion click
  const handlePromotionClick = useCallback((promo) => {
    console.log(`Clicked on promo: ${promo.title}`);
    // TODO: Navigate to promotion detail page
    // navigate(`/promotion-detail/${promo.id}`);
  }, []);

  return {
    selectedCategory,
    categories,
    filteredPromotions,
    currentCategoryLabel,
    handleCategoryChange,
    handlePromotionClick,
  };
};

export default usePromotions;
