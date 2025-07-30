// UserHeader.js
import { useState } from "react";
import { authorize, getPhoneNumber, getAccessToken } from "zmp-sdk/apis";
import { getServerUrl } from "../config/server";

const UserHeader = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(false);

  const requestPhoneNumber = async () => {
    try {
      setLoading(true);
      
      // STEP 1: Authorize
      console.log('🔐 Step 1: Requesting authorization...');
      const authResult = await new Promise((resolve, reject) => {
        authorize({
          scopes: ["scope.userPhonenumber"],
          success: resolve,
          fail: reject
        });
      });

      // STEP 2: Get phone number token
      console.log('📱 Step 2: Getting phone number...');
      const phoneResult = await new Promise((resolve, reject) => {
        getPhoneNumber({
          success: resolve,
          fail: reject
        });
      });

      const token = phoneResult.token || phoneResult;
      console.log('🎫 Token received:', token);

      // STEP 3: Send to server với error handling tốt hơn
      const SERVER_URL = getServerUrl();
      console.log('🚀 Step 3: Sending to server:', SERVER_URL);
      
      const response = await fetch(`${SERVER_URL}/api/decode-phone`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify({ token }),
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Server error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Server response:', data);
      
      if (data.success === false) {
        throw new Error(data.error || 'Server returned error');
      }
      
      setPhoneNumber(data.phoneNumber || data.phone || "Không lấy được SĐT");
      
    } catch (error) {
      console.error("❌ Full error:", error);
      console.error("❌ Error name:", error.name);
      console.error("❌ Error message:", error.message);
      console.error("❌ Error stack:", error.stack);
      
      // Hiển thị lỗi chi tiết hơn
      let errorMessage = "Lỗi không xác định";
      if (error.message) {
        errorMessage = error.message;
      } else if (error.name) {
        errorMessage = error.name;
      }
      
      alert(`Lỗi: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const testServerConnection = async () => {
    try {
      const SERVER_URL = getServerUrl();
      console.log('🔍 Testing server:', SERVER_URL);
      
      const response = await fetch(`${SERVER_URL}/api/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      });
      
      console.log('📡 Health check status:', response.status);
      const data = await response.json();
      console.log('📡 Health check data:', data);
      
      alert(`Server OK: ${data.message}`);
    } catch (error) {
      console.error('❌ Server test failed:', error);
      alert(`Server lỗi: ${error.message}`);
    }
  };

  return (
    <div>
      <button onClick={testServerConnection}>Test Server</button>
      <button onClick={requestPhoneNumber}>
        {loading ? "Đang xử lý..." : "Lấy số điện thoại"}
      </button>
      {phoneNumber && <p>Số điện thoại: {phoneNumber}</p>}
    </div>
  );
};

export default UserHeader;
