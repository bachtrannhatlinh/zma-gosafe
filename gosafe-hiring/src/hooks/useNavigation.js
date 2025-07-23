import { useCallback } from "react";
import { SERVICE_ROUTES } from "../constants/dashboard";

export const useServiceNavigation = (navigate) => {
  const handleServiceClick = useCallback(
    (service) => {
      console.log(`Clicked on ${service}`);
      
      const route = SERVICE_ROUTES[service];
      
      if (route) {
        navigate(route);
      } else {
        console.log(`${service} service coming soon`);
        // Có thể show toast notification ở đây
      }
    },
    [navigate]
  );

  return { handleServiceClick };
};

export const usePromotionNavigation = (navigate) => {
  const handlePromoClick = useCallback((promo) => {
    console.log(`Clicked on promo: ${promo}`);
    // Có thể navigate đến trang chi tiết promotion
  }, []);

  const handleViewAllPromotions = useCallback(() => {
    navigate("/promotions");
  }, [navigate]);

  const handleViewAllNews = useCallback(() => {
    navigate("/news");
  }, [navigate]);

  return {
    handlePromoClick,
    handleViewAllPromotions,
    handleViewAllNews,
  };
};
