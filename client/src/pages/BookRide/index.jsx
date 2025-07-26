import React, { useState } from "react";
import { Page, Box, Text, Input, Button } from "zmp-ui";

// Components
import BottomNavigation from "../../components/BottomNavigation";
import LocationInput from "../../components/LocationInput";

import { useEffect } from "react";

const BookRide = () => {
  console.log("BookRide component rendered");
  const [pickupLocation, setPickupLocation] = useState("3 Nguyễn Thông, An Hải Trung, Sơn Trà, Đà Nẵng 550000, Vietnam");
  const [destination, setDestination] = useState("");
  const [stopCount, setStopCount] = useState(5);

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

  const handleContinue = () => {
    console.log("Continuing with:", { pickupLocation, destination, stopCount });
  };

  const handleAddStop = () => {
    setStopCount(prev => prev + 1);
  };

  return (
    <Page style={{ 
      height: '100vh',
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      touchAction: 'none' // Ngăn thao tác vuốt trên mobile
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
          background: 'linear-gradient(to right, #fb923c, #ef4444)', 
          padding: '24px 16px 32px',
          paddingTop: 'calc(24px + env(safe-area-inset-top))',
          color: 'white'
        }}>
          <Box style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginBottom: '16px' 
          }}>
            <Box style={{
              width: '64px',
              height: '64px',
              backgroundColor: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}>
              <Text style={{ fontSize: '24px' }}>🚗</Text>
            </Box>
          </Box>
          <Text style={{ 
            color: 'white', 
            fontSize: '20px', 
            fontWeight: 'bold', 
            textAlign: 'center' 
          }}>
            Bạn nhấn - Tôi lái
          </Text>
        </Box>

        {/* Main Content - Fixed height */}
        <Box style={{ 
          flex: 1,
          padding: '16px',
          overflow: 'hidden' // Không cho scroll
        }}>
          {/* Service Title */}
          <Box style={{
            backgroundColor: 'white',
            margin: '16px',
            marginTop: '-16px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <Text style={{ 
              color: '#f97316', 
              fontSize: '18px', 
              fontWeight: 'bold', 
              textAlign: 'center' 
            }}>
              ĐẶT TÀI XẾ
            </Text>
          </Box>

          {/* Location Form */}
          <Box style={{ padding: '0 16px' }}>
            <Text style={{ 
              color: '#374151', 
              fontWeight: '600', 
              marginBottom: '16px' 
            }}>
              Vị trí của bạn
            </Text>
            
            {/* Pickup Location */}
            <Box style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
              marginBottom: '12px',
              padding: '16px'
            }}>
              <Box style={{ display: 'flex', alignItems: 'flex-start' }}>
                <Box style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#10b981',
                  borderRadius: '50%',
                  marginTop: '8px',
                  marginRight: '12px',
                  flexShrink: 0
                }}></Box>
                <Box style={{ flex: 1 }}>
                  <Input
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="Vị trí đón"
                    style={{ 
                      border: 'none',
                      boxShadow: 'none',
                      padding: 0,
                      fontSize: '14px',
                      backgroundColor: 'transparent'
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Destination */}
            <Box style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
              marginBottom: '16px',
              padding: '16px'
            }}>
              <Box style={{ display: 'flex', alignItems: 'flex-start' }}>
                <Box style={{
                  width: '12px',
                  height: '12px',
                  border: '2px solid #ef4444',
                  borderRadius: '50%',
                  marginTop: '8px',
                  marginRight: '12px',
                  flexShrink: 0,
                  backgroundColor: 'transparent'
                }}></Box>
                <Box style={{ flex: 1 }}>
                  <Input
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Nhập điểm đến..."
                    style={{ 
                      border: 'none',
                      boxShadow: 'none',
                      padding: 0,
                      fontSize: '14px',
                      backgroundColor: 'transparent'
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Add Stop Button */}
            <Box style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              marginBottom: '24px' 
            }}>
              <Text style={{ color: '#6b7280', fontSize: '14px' }}>
                Tôi đã có {stopCount} điểm dừng
              </Text>
              <Button
                variant="tertiary"
                size="small"
                onClick={handleAddStop}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  color: '#f97316',
                  backgroundColor: 'transparent',
                  border: 'none'
                }}
              >
                <Box style={{
                  width: '24px',
                  height: '24px',
                  border: '1px solid #f97316',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '8px'
                }}>
                  <Text style={{ color: '#f97316', fontSize: '14px' }}>+</Text>
                </Box>
                <Text style={{ color: '#f97316', fontSize: '14px', fontWeight: '500' }}>
                  Thêm điểm dừng
                </Text>
              </Button>
            </Box>

            {/* Continue Button */}
            <Button
              fullWidth
              onClick={handleContinue}
              disabled={!destination.trim()}
              style={{
                backgroundColor: destination.trim() ? '#f97316' : '#d1d5db',
                color: 'white',
                border: 'none',
                padding: '16px',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: '600'
              }}
            >
              Tiếp tục
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Bottom Navigation - Fixed */}
      <BottomNavigation activeTab="book" />
    </Page>
  );
};

export default BookRide;
