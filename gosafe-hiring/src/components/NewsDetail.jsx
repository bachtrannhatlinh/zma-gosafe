import React from "react";
import { Page, Box, Text, Header } from "zmp-ui";

const NewsDetail = ({ news, onBack }) => {
  return (
    <Page className="bg-gray-50 min-h-screen" style={{ padding: 0, margin: 0 }}>
      <Header
        title="Chi tiết tin tức"
        showBackIcon={true}
        onBackClick={onBack}
        className="bg-white shadow-sm"
        style={{ 
          marginTop: 0, 
          paddingTop: 'max(0.5rem, env(safe-area-inset-top))', 
          paddingBottom: 8, 
          height: 'auto', 
          minHeight: 'auto' 
        }}
      />
      
      <Box className="page-with-header-nav p-4">
        {/* Hero Image */}
        <Box className={`${news.bgColor} rounded-xl p-6 mb-4 relative shadow-lg`}>
          <Text className="text-white text-2xl font-bold mb-2 pr-12">
            {news.title}
          </Text>
          <Text className="text-white text-sm opacity-90">
            {news.subtitle}
          </Text>
          <Text className="absolute right-4 top-4 text-4xl">
            {news.image}
          </Text>
        </Box>

        {/* Meta info */}
        <Box className="flex items-center justify-between mb-4 p-3 bg-white rounded-lg shadow-sm">
          <Box className="flex items-center space-x-2">
            <Text className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">
              {news.category}
            </Text>
            <Text className="text-xs text-gray-500">
              {news.date}
            </Text>
          </Box>
        </Box>

        {/* Content */}
        <Box className="bg-white rounded-lg p-6 shadow-sm">
          <Text className="text-gray-800 leading-relaxed text-sm">
            {news.content}
          </Text>
        </Box>

        {/* Bottom spacing for better UX */}
        <Box className="h-8"></Box>
      </Box>
    </Page>
  );
};

export default React.memo(NewsDetail);
