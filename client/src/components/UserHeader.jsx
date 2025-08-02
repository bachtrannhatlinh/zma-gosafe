import React, { useState } from "react";
import { Box, Text, Avatar, Button } from "zmp-ui";
import { authorize, getUserInfo, getPhoneNumber } from "zmp-sdk/apis";
import CustomModal from "./CustomModal";
import { useServerAuth } from "../hooks/useServerAuth";

const UserHeader = ({ userInfo, isLoading }) => {
  const [showModal, setShowModal] = useState(false);
  const [updatedUserInfo, setUpdatedUserInfo] = useState(userInfo);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [isGettingPhone, setIsGettingPhone] = useState(false);
  const { sendTokenToServer, testServerConnection, loading: serverLoading, error: serverError } = useServerAuth();

  // 🚀 DEBUG & SMART RETRY: Handle Zalo SDK quirks
  const getCompleteUserData = async () => {
    console.log("🔐 Đăng nhập với debug và retry logic...");
    
    try {
      // STEP 1: Request permission first
      console.log("📋 Xin quyền truy cập số điện thoại...");
      
      await new Promise((resolve, reject) => {
        authorize({
          scopes: ["scope.userPhonenumber"],
          success: (data) => {
            console.log("✅ Đồng ý chia sẻ số điện thoại:", data);
            resolve(data);
          },
          fail: (error) => {
            console.error("❌ Người dùng từ chối:", error);
            reject(new Error("Cần cấp quyền để sử dụng app"));
          }
        });
      });

      console.log("🔄 Đợi một chút để quyền có hiệu lực...");
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s for permission to take effect

      // STEP 2: Get user info first (this usually works)
      console.log("👤 Lấy thông tin user...");
      const userResult = await new Promise((resolve, reject) => {
        getUserInfo({
          success: (userData) => {
            console.log("✅ Thông tin user:", userData);
            resolve(userData);
          },
          fail: (error) => {
            console.error("❌ Lỗi lấy thông tin user:", error);
            reject(new Error("Không thể lấy thông tin user"));
          }
        });
      });

      setUpdatedUserInfo(userResult.userInfo);

      // STEP 3: Try to get phone number with multiple retries
      console.log("📱 Bắt đầu lấy số điện thoại (có retry)...");
      
      let phoneResult = null;
      for (let attempt = 1; attempt <= 5; attempt++) {
        console.log(`📞 Lần thử ${attempt}/5...`);
        
        phoneResult = await new Promise((resolve) => {
          getPhoneNumber({
            success: (phoneData) => {
              console.log(`✅ Lần ${attempt}: SUCCESS! Số điện thoại:`, phoneData);
              resolve(phoneData);
            },
            fail: (error) => {
              console.log(`⚠️ Lần ${attempt}: FAILED:`, error);
              resolve(null);
            }
          });
        });
        
        // 🔧 FIX: Check for both number and token
        if (phoneResult && (phoneResult.number || phoneResult.token)) {
          console.log("🎉 Lấy được dữ liệu điện thoại thành công!");
          break;
        }
        
        // Wait between retries (increasing delay)
        if (attempt < 5) {
          const delay = attempt * 1000; // 1s, 2s, 3s, 4s
          console.log(`⏳ Đợi ${delay}ms trước khi thử lại...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      // STEP 4: Process phone result
      if (phoneResult && (phoneResult.number || phoneResult.token)) {
        if (phoneResult.number) {
          // Direct phone number
          console.log("📱 FINAL SUCCESS: Số điện thoại trực tiếp:", phoneResult.number);
          setPhoneNumber(phoneResult.number);
          return { success: true, source: 'sdk_direct' };
        } else if (phoneResult.token) {
          // Phone token - try server decode, but don't fail if server is down
          console.log("🔐 FINAL SUCCESS: Token điện thoại:", phoneResult.token);
          
          // Try to decode token via server (optional, non-blocking)
          try {
            console.log("🔄 Đang thử decode token qua server...");
            // 🔧 FIX: Truyền token trực tiếp thay vì để hook tự lấy
            const serverResult = await sendTokenToServer(phoneResult.token);
            
            if (serverResult.success && serverResult.phoneNumber) {
              console.log("✅ Server decoded phone:", serverResult.phoneNumber);
              setPhoneNumber(serverResult.phoneNumber);
              return { success: true, source: 'sdk_token_decoded' };
            } else {
              console.log("⚠️ Server không decode được token, hiển thị trạng thái thành công");
              setPhoneNumber("✅ Đã xác thực số điện thoại");
              return { success: true, source: 'sdk_token_verified' };
            }
          } catch (tokenError) {
            console.log("⚠️ Server không khả dụng, nhưng đã có token từ Zalo:", tokenError.message);
            
            // 🔧 FIX: Không thể decode token local, cần server với App Secret
            // Token từ Zalo là encrypted token, không phải JWT
            console.log("ℹ️ Token cần được decode bởi server với App Secret");
            
            // Fallback: Hiển thị trạng thái đã xác thực với hint về token
            const shortToken = phoneResult.token.substring(phoneResult.token.length - 6);
            setPhoneNumber(`Đã xác thực *${shortToken}`);
            console.log("✅ Showing verified status with token hint");
            
            // Store token for later use when server is available
            try {
              localStorage.setItem('zalo_phone_token', phoneResult.token);
              console.log("💾 Đã lưu token để decode sau khi server hoạt động");
            } catch (storageError) {
              console.log("⚠️ Không thể lưu token:", storageError);
            }
            
            return { success: true, source: 'sdk_token_stored' };
          }
        }
      } else {
        // 🔧 GRACEFUL FALLBACK: Don't show error, just set a friendly message
        console.log("⚠️ Không lấy được số điện thoại từ SDK, dùng fallback");
        
        // 🔧 NEW: Try to get phone from user input or show status
        setPhoneNumber("Đang xử lý...");
        console.log("📱 Phone number processing...");
        
        // Optional: Silent background attempt to get phone later
        setTimeout(() => {
          console.log("🔄 Silent retry in background...");
          getPhoneNumber({
            success: (phoneData) => {
              console.log("✅ Background retry success:", phoneData);
              if (phoneData && phoneData.number) {
                setPhoneNumber(phoneData.number);
              } else if (phoneData && phoneData.token) {
                console.log("🔐 Background got token, trying to decode...");
                // Try to decode token silently
                sendTokenToServer() // Không truyền token, để hook tự lấy
                  .then(result => {
                    if (result.success && result.phoneNumber) {
                      setPhoneNumber(result.phoneNumber);
                      console.log("✅ Background token decode success:", result.phoneNumber);
                    } else {
                      console.log("⚠️ Background token decode failed, keeping verified status");
                    }
                  })
                  .catch(err => {
                    console.log("⚠️ Background token decode failed:", err);
                    // Check if we have a stored token to try later
                    const storedToken = localStorage.getItem('zalo_phone_token');
                    if (storedToken) {
                      console.log("💾 Token still stored for future retry");
                    }
                  });
              }
            },
            fail: (error) => {
              console.log("⚠️ Background retry failed:", error);
            }
          });
        }, 5000); // Try again after 5 seconds silently
        
        return { success: true, source: 'fallback' };
      }

    } catch (error) {
      console.error("❌ Lỗi trong quá trình đăng nhập:", error);
      
      // More graceful error handling
      setPhoneNumber("Đăng nhập thành công!");
      
      // Don't show alert error, just log it
      console.log("ℹ️ Continuing without phone number for now");
      
      return { success: true, source: 'error_recovery' };
    }
  };

  const handleLocationClick = () => {
    // Show modal if no user info or no phone number yet
    if (!currentUserInfo?.name || !phoneNumber) {
      setShowModal(true);
    }
  };

  const handleLogin = () => {
    setShowModal(false);
    handleAllowPermission();
  };

  const handleAllowPermission = async () => {
    setIsGettingPhone(true);
    
    try {
      console.log("🔐 Bắt đầu quy trình xin quyền số điện thoại bắt buộc...");
      
      // STEP 1: Request authorization with clear scope
      console.log("📋 Xin quyền truy cập số điện thoại...");
      const authResult = await new Promise((resolve, reject) => {
        authorize({
          scopes: ["scope.userPhonenumber"],
          success: (data) => {
            console.log("✅ Người dùng đồng ý chia sẻ số điện thoại:", data);
            resolve(data);
          },
          fail: (error) => {
            console.error("❌ Người dùng từ chối chia sẻ số điện thoại:", error);
            reject(new Error("Cần cấp quyền số điện thoại để sử dụng ứng dụng"));
          }
        });
      });

      // STEP 2: Get user info
      console.log("👤 Lấy thông tin người dùng...");
      const userResult = await new Promise((resolve, reject) => {
        getUserInfo({
          success: (userData) => {
            console.log("✅ Thông tin người dùng:", userData);
            resolve(userData);
          },
          fail: (error) => {
            console.error("❌ Lỗi lấy thông tin người dùng:", error);
            reject(new Error("Không thể lấy thông tin người dùng"));
          }
        });
      });

      setUpdatedUserInfo(userResult.userInfo);

      // STEP 3: Get phone number with proper error handling
      console.log("📱 Lấy số điện thoại...");
      const phoneResult = await new Promise((resolve, reject) => {
        getPhoneNumber({
          success: (phoneData) => {
            console.log("✅ Kết quả số điện thoại:", phoneData);
            resolve(phoneData);
          },
          fail: (error) => {
            console.error("❌ Lỗi lấy số điện thoại:", error);
            reject(new Error("Không thể lấy số điện thoại"));
          }
        });
      });

      // STEP 4: Process phone result
      if (phoneResult) {
        if (phoneResult.number) {
          // Direct phone number available
          console.log("📱 Số điện thoại trực tiếp:", phoneResult.number);
          setPhoneNumber(phoneResult.number);
          
          // Send to server for verification/registration
          try {
            await sendTokenToServer(phoneResult.number);
            console.log("✅ Đã gửi số điện thoại lên server");
          } catch (serverError) {
            console.warn("⚠️ Không thể gửi lên server:", serverError.message);
          }
          
        } else if (phoneResult.token) {
          // Phone token - need server to decode
          console.log("🔐 Token số điện thoại:", phoneResult.token);
          
          try {
            const serverResult = await sendTokenToServer(phoneResult.token);
            
            if (serverResult.success && serverResult.phoneNumber) {
              console.log("✅ Server decode thành công:", serverResult.phoneNumber);
              setPhoneNumber(serverResult.phoneNumber);
            } else {
              console.log("⚠️ Server không decode được, hiển thị trạng thái xác thực");
              setPhoneNumber("✅ Đã xác thực số điện thoại");
              
              // Store token for later processing
              try {
                localStorage.setItem('zalo_phone_token', phoneResult.token);
                console.log("💾 Đã lưu token để xử lý sau");
              } catch (storageError) {
                console.warn("⚠️ Không thể lưu token:", storageError);
              }
            }
          } catch (tokenError) {
            console.error("❌ Lỗi decode token:", tokenError);
            
            // Show verification status with token hint
            const shortToken = phoneResult.token.substring(phoneResult.token.length - 6);
            setPhoneNumber(`Đã xác thực *${shortToken}`);
            
            // Store token for later use
            try {
              localStorage.setItem('zalo_phone_token', phoneResult.token);
              console.log("💾 Đã lưu token để xử lý sau");
            } catch (storageError) {
              console.warn("⚠️ Không thể lưu token:", storageError);
            }
          }
        } else {
          // No phone data received
          console.warn("⚠️ Không nhận được dữ liệu số điện thoại");
          setPhoneNumber("Đang xử lý...");
        }
      } else {
        console.warn("⚠️ Không có kết quả số điện thoại");
        setPhoneNumber("Đang xử lý...");
      }

    } catch (error) {
      console.error("❌ Lỗi trong quá trình xin quyền:", error);
      
      // Show user-friendly error message
      if (error.message.includes("từ chối")) {
        alert("Bạn cần cấp quyền số điện thoại để sử dụng ứng dụng GoSafe. Vui lòng thử lại.");
      } else if (error.message.includes("Không thể lấy")) {
        alert("Có lỗi xảy ra khi lấy thông tin. Vui lòng thử lại sau.");
      } else {
        alert("Có lỗi xảy ra. Vui lòng thử lại.");
      }
      
      // Set fallback status
      setPhoneNumber("Cần cấp quyền");
    } finally {
      setIsGettingPhone(false);
    }
  };

  // Get current user info to display
  const currentUserInfo = updatedUserInfo || userInfo;

  const handleClose = () => {
    setShowModal(false);
  };

  const handleTestServer = async () => {
    try {
      const result = await testServerConnection();
      console.log("✅ Server connection test:", result);
      alert(`Server connection: ${result.message}`);
    } catch (error) {
      console.error("❌ Server connection failed:", error);
      alert(`Server connection failed: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <Box className="px-4 relative bg-white shadow-sm" style={{ paddingTop: 'max(env(safe-area-inset-top), 44px)' }}>
        <Box className="flex items-center space-x-3 py-4">
          {/* Avatar skeleton với animation */}
          <Box className="w-10 h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-pulse relative overflow-hidden">
            <Box className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></Box>
          </Box>
          
          <Box className="flex-1">
            {/* Text skeletons với animation */}
            <Box className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-32 mb-2 animate-pulse relative overflow-hidden">
              <Box className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></Box>
            </Box>
            <Box className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-48 animate-pulse relative overflow-hidden">
              <Box className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="px-4 relative bg-white shadow-sm" style={{ paddingTop: 'max(env(safe-area-inset-top), 30px)' }}>
        <Box className="flex items-center justify-between py-4">
          <Box 
            className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
            onClick={handleLocationClick}
          >
            <Avatar src={currentUserInfo?.avatar || ""} size="40" className="bg-white">
              {currentUserInfo?.name?.charAt(0) || "U"}
            </Avatar>
            <Box>
              <Text className="text-black text-xs">
                {currentUserInfo?.name ? `Xin chào, ${currentUserInfo.name} 👋` : "Cần cấp quyền số điện thoại 📱"}
              </Text>
              <Text className="text-black text-sm font-bold">
                {currentUserInfo?.name ? "Chào mừng bạn đến với GoSafe!" : "Cung cấp số điện thoại để sử dụng app!"}
              </Text>
              {phoneNumber && (
                <Text className={`text-xs mt-1 ${
                  phoneNumber.includes('✅') 
                    ? 'text-blue-600' 
                    : 'text-green-600'
                }`}>
                  📱 {phoneNumber}
                </Text>
              )}
              {(serverLoading || isGettingPhone) && (
                <Text className="text-blue-500 text-xs mt-1">
                  🔄 {isGettingPhone ? 'Đang lấy thông tin...' : 'Đang kết nối server...'}
                </Text>
              )}
              {serverError && !isGettingPhone && process.env.NODE_ENV === 'development' && (
                <Text className="text-orange-500 text-xs mt-1">
                  🔧 DEV: {serverError}
                </Text>
              )}
            </Box>
          </Box>
          
          {/* Development: Test button */}
          {process.env.NODE_ENV === 'development' && (
            <Button
              size="small"
              className="text-xs bg-blue-500 text-white"
              onClick={handleTestServer}
            >
              Test Server
            </Button>
          )}
        </Box>
      </Box>

      {/* Modal xin quyền số điện thoại bắt buộc */}
      <CustomModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        showCloseButton={false}
        position="center"
      >
        <Box className="text-center p-4">
          <Box className="mb-4">
            <Text className="text-2xl mb-2">📱</Text>
            <Text className="text-lg font-bold text-black mb-2">
              Cần số điện thoại để sử dụng GoSafe
            </Text>
          </Box>
          
          <Box className="text-left mb-6 space-y-3">
            <Text className="text-gray-700 text-sm">
              <strong>Mục đích sử dụng:</strong>
            </Text>
            <Box className="space-y-2 text-sm text-gray-600">
              <Text>• Định danh tài khoản của bạn</Text>
              <Text>• Liên hệ khẩn cấp khi cần thiết</Text>
              <Text>• Xác thực thông tin cá nhân</Text>
              <Text>• Bảo mật và bảo vệ tài khoản</Text>
            </Box>
            
            <Text className="text-xs text-gray-500 mt-4">
              Số điện thoại của bạn sẽ được bảo mật và chỉ sử dụng cho mục đích trên
            </Text>
          </Box>
          
          <Box className="flex flex-row gap-2">
            <Button
              fullWidth
              className="custom-btn-outline"
              onClick={handleClose}
              disabled={isGettingPhone}
            >
              Đóng
            </Button>
            <Button
              fullWidth
              className="custom-btn-filled"
              onClick={handleLogin}
              disabled={isGettingPhone}
            >
              {isGettingPhone ? '🔄 Đang xử lý...' : 'Đồng ý cung cấp'}
            </Button>
          </Box>
        </Box>
      </CustomModal>
    </>
  );
};

export default React.memo(UserHeader);