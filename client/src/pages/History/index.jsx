import React, { useState } from "react";
import { Page, Box, Text, Button } from "zmp-ui";

// Components
import BottomNavigation from "../../components/BottomNavigation";
import EmptyState from "../../components/EmptyState";
import HistoryItem from "../../components/HistoryItem";
import { useEffect } from "react";

const History = () => {
  // Sample data - trong thực tế sẽ fetch từ API
  const [historyData, setHistoryData] = useState([]);

  // Ngăn scroll khi vào trang này
  useEffect(() => {
    const preventScroll = (e) => {
      e.preventDefault();
    };
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('wheel', preventScroll, { passive: false });
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('wheel', preventScroll);
      document.body.style.overflow = '';
    };
  }, []);

  const sampleData = [
    {
      id: 1,
      type: "Tài xế ô tô",
      pickup: "3 Nguyễn Thông, An Hải Trung, Sơn Trà",
      destination: "Sân bay Đà Nẵng",
      price: "150.000 VNĐ",
      date: "15/07/2025",
      status: "completed",
      driver: "Nguyễn Văn A"
    },
    {
      id: 2,
      type: "Tài xế xe máy",
      pickup: "Chợ Hàn, Hải Châu",
      destination: "Trường ĐH Duy Tân",
      price: "50.000 VNĐ",
      date: "12/07/2025",
      status: "pending",
      driver: "Trần Văn B"
    },
    {
      id: 3,
      type: "Thuê tài xế theo ngày",
      pickup: "Khách sạn Mường Thanh",
      destination: "Bà Nà Hills",
      price: "800.000 VNĐ",
      date: "10/07/2025", 
      status: "cancelled",
      driver: "Lê Văn C"
    }
  ];

  const handleLoadSampleData = () => {
    setHistoryData(sampleData);
  };

  const handleClearData = () => {
    setHistoryData([]);
  };

  return (
    <Page style={{ 
      height: '100vh',
      backgroundColor: '#f9fafb',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      touchAction: 'none'
    }}>
      {/* Content - NO SCROLL */}
      <Box style={{ 
        flex: 1,
        overflow: 'hidden', // Thay đổi từ overflowY: 'auto' thành 'hidden'
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <Box style={{
          backgroundColor: 'white',
          padding: '16px',
          borderBottom: '1px solid #e5e7eb',
          paddingTop: 'calc(24px + env(safe-area-inset-top))',
          zIndex: 10
        }}>
        <Text style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#374151',
          textAlign: 'center'
        }}>
          Lịch sử chuyến đi
        </Text>
      </Box>

      {/* Main Content - Fixed height */}
      <Box style={{ 
        flex: 1,
        padding: '16px',
        overflow: 'hidden' // Không cho scroll
      }}>
        {historyData.length === 0 ? (
          // Empty State
          <Box style={{ 
            padding: '40px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px'
          }}>
            <EmptyState
              icon="📋"
              title="Không có dữ liệu"
              subtitle="Bạn chưa có chuyến đi nào. Hãy đặt chuyến đầu tiên của bạn!"
            />
            {/* Button để test dữ liệu mẫu */}
            <Box style={{ padding: '0 20px', width: '100%', maxWidth: '300px' }}>
              <Button
                fullWidth
                onClick={handleLoadSampleData}
                style={{
                  backgroundColor: '#f97316',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Tải dữ liệu mẫu (Demo)
              </Button>
            </Box>
          </Box>
        ) : (
          // History List - hiển thị khi có dữ liệu
          <Box>
            {/* Clear button */}
            <Box style={{ padding: '16px 16px 0' }}>
              <Button
                size="small"
                onClick={handleClearData}
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
              >
                Xóa dữ liệu mẫu
              </Button>
            </Box>
            
            <Box style={{ padding: '16px' }}>
              {historyData.map((trip) => (
                <HistoryItem key={trip.id} trip={trip} />
              ))}
            </Box>
          </Box>
        )}
      </Box>
      </Box>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="history" />
    </Page>
  );
};

export default History;
