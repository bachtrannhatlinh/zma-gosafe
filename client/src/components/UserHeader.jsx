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
      
      // STEP 1: Authorize với error handling tốt hơn
      console.log('🔐 Step 1: Requesting authorization...');
      const authResult = await new Promise((resolve, reject) => {
        authorize({
          scopes: ["scope.userPhonenumber"],
          success: (res) => {
            console.log('✅ Authorization success:', res);
            resolve(res);
          },
          fail: (error) => {
            console.error('❌ Authorization failed:', error);
            reject(new Error(`Authorization failed: ${error.message || JSON.stringify(error)}`));
          }
        });
      });

      // STEP 2: Get phone number token
      console.log('📱 Step 2: Getting phone number...');
      const phoneResult = await new Promise((resolve, reject) => {
        getPhoneNumber({
          success: (res) => {
            console.log('✅ Phone number success:', res);
            resolve(res);
          },
          fail: (error) => {
            console.error('❌ Phone number failed:', error);
            reject(new Error(`Get phone failed: ${error.message || JSON.stringify(error)}`));
          }
        });
      });

      const token = phoneResult.token || phoneResult;
      console.log('🎫 Token received:', token);

      // STEP 3: Send to server
      const SERVER_URL = getServerUrl();
      console.log('🚀 Step 3: Sending to server:', SERVER_URL);
      
      const response = await fetch(`${SERVER_URL}/api/decode-phone`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Server response:', data);
      
      setPhoneNumber(data.phoneNumber || data.phone || "Không lấy được SĐT");
      
    } catch (error) {
      console.error("❌ Full error:", error);
      alert(`Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={requestPhoneNumber}>
        {loading ? "Đang xử lý..." : "Lấy số điện thoại"}
      </button>
      {phoneNumber && <p>Số điện thoại: {phoneNumber}</p>}
      {accessToken && <p>Access Token: {accessToken.substring(0, 20)}...</p>}
    </div>
  );
};

export default UserHeader;
