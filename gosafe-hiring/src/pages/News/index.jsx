import { Page, Box, Text, Header, useNavigate } from "zmp-ui";

// Components
import { NewsList, NewsDetail, BottomNavigation } from "../../components";

// Hooks
import { useNewsData, useNewsNavigation } from "../../hooks/useNews";

const News = () => {
  const navigate = useNavigate();
  
  // Custom hooks
  const {
    selectedCategory,
    selectedNews,
    filteredNews,
    handleNewsClick,
    handleBackToList
  } = useNewsData();
  
  const { handleBackClick } = useNewsNavigation(navigate);

  // Render news detail view
  if (selectedNews) {
    return (
      <NewsDetail 
        news={selectedNews} 
        onBack={() => handleBackClick(selectedNews, handleBackToList)} 
      />
    );
  }

  // Render news list view
  return (
    <Page className="bg-gray-50 min-h-screen relative smooth-page">
      <Header
        title="Tin tức"
        showBackIcon={true}
        onBackClick={() => handleBackClick(selectedNews, handleBackToList)}
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
        {/* Header section with count */}
        <Box className="mb-6">
          <Box className="flex items-center justify-between mb-2">
            <Text className="font-bold text-xl text-gray-800">
              {selectedCategory === "Tất cả" ? "Tất cả tin tức" : selectedCategory}
            </Text>
          </Box>
          <Text className="text-gray-600 text-sm">
            Cập nhật thông tin mới nhất từ GoSafe
          </Text>
        </Box>

        {/* News List */}
        <NewsList 
          news={filteredNews} 
          onNewsClick={handleNewsClick} 
        />
      </Box>
    </Page>
  );
};

export default News;
