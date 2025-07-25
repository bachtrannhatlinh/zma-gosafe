import React from "react";
import { Box } from "zmp-ui";
import NewsCard from "./NewsCard";
import EmptyState from "./EmptyState";

const NewsList = ({ news, onNewsClick }) => {
  if (news.length === 0) {
    return (
      <EmptyState 
        icon="📰"
        title="Không có tin tức"
        subtitle="Không có tin tức nào trong danh mục này"
      />
    );
  }

  return (
    <Box className="space-y-4">
      {news.map((newsItem) => (
        <NewsCard
          key={newsItem.id}
          news={newsItem}
          onClick={onNewsClick}
        />
      ))}
    </Box>
  );
};

export default React.memo(NewsList);
