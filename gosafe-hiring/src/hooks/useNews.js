import { useState, useCallback, useMemo } from "react";
import { NEWS_DATA } from "../constants/news";

export const useNewsData = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedNews, setSelectedNews] = useState(null);

  // Memoize filtered news để tránh re-calculation không cần thiết
  const filteredNews = useMemo(() => {
    if (selectedCategory === "Tất cả") {
      return NEWS_DATA;
    }
    return NEWS_DATA.filter(item => item.category === selectedCategory);
  }, [selectedCategory]);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  const handleNewsClick = useCallback((news) => {
    setSelectedNews(news);
  }, []);

  const handleBackToList = useCallback(() => {
    setSelectedNews(null);
  }, []);

  return {
    selectedCategory,
    selectedNews,
    filteredNews,
    handleCategoryChange,
    handleNewsClick,
    handleBackToList
  };
};

export const useNewsNavigation = (navigate) => {
  const handleBackClick = useCallback((selectedNews, handleBackToList) => {
    if (selectedNews) {
      handleBackToList();
    } else {
      navigate(-1);
    }
  }, [navigate]);

  return { handleBackClick };
};
