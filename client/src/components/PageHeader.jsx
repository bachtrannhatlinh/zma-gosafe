import React from "react";
import { Box, Text, Icon } from "zmp-ui";
import { useNavigate } from "zmp-ui";

const PageHeader = ({ 
  title, 
  onBack, 
  showBackButton = true,
  backgroundColor = "white",
  textColor = "#374151",
  borderBottom = "1px solid #f3f4f6"
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <Box
      style={{
        display: "flex",
        alignItems: "center",
        padding: "12px 16px",
        paddingTop: "calc(12px + env(safe-area-inset-top))",
        backgroundColor,
        borderBottom,
        position: "relative",
        minHeight: "60px",
        zIndex: 10
      }}
    >
      {showBackButton && (
        <Box
          onClick={handleBack}
          style={{
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            borderRadius: "8px",
            backgroundColor: "transparent",
            marginRight: title ? "8px" : "0"
          }}
        >
          <Icon 
            icon="zi-chevron-left-header" 
            style={{ fontSize: "30px", color: textColor }} 
          />
        </Box>
      )}
      
      {title && (
        <Text
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: textColor,
            flex: 1,
            textAlign: showBackButton ? "left" : "center"
          }}
        >
          {title}
        </Text>
      )}
    </Box>
  );
};

export default PageHeader;