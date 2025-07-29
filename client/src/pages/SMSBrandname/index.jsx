import React, { useState, useEffect } from "react";
import { Page, Box, Button, Input, Text, Icon, useNavigate } from "zmp-ui";
import { openSMS } from "zmp-sdk/apis";

const SMSBrandname = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [testInfo, setTestInfo] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Detect environment và platform
    const userAgent = navigator.userAgent;
    const isIOS = /iPhone|iOS|iPad|iPod/.test(userAgent);
    const isZalo = /zalo/i.test(userAgent);
    const isRealDevice = !userAgent.includes('Chrome') || isZalo;
    
    setTestInfo({
      platform: isIOS ? 'iOS' : 'Android',
      isZalo,
      isRealDevice,
      userAgent: userAgent.substring(0, 50) + '...'
    });
    
    console.log('📱 Test Environment:', { isIOS, isZalo, isRealDevice });
  }, []);

  const handleSendSMS = async () => {
    if (!phoneNumber.trim() || !message.trim()) {
      alert("Vui lòng nhập đầy đủ số điện thoại và nội dung tin nhắn!");
      return;
    }

    // Validate phone number format
    const phoneRegex = /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/;
    if (!phoneRegex.test(phoneNumber.trim())) {
      alert("Số điện thoại không đúng định dạng! VD: 0901234567");
      return;
    }

    setIsLoading(true);

    try {
      // Option 1: Gửi qua server với SMS Gateway
      if (testInfo.isRealDevice && testInfo.isZalo) {
        console.log("📱 Gửi SMS qua server với Brandname");
        
        const confirmed = confirm(
          `Gửi SMS Brandname "GoSafe" đến ${phoneNumber}?\n\nLưu ý: Tin nhắn sẽ hiển thị từ "GoSafe" thay vì số điện thoại.`
        );
        
        if (!confirmed) {
          setIsLoading(false);
          return;
        }

        // Gửi qua server API
        const SERVER_URL = process.env.NODE_ENV === 'development' 
          ? 'http://localhost:5000' 
          : 'https://zma-gosafe-4vsall7u5-bachtrannhatlinhs-projects.vercel.app/';
        
        const response = await fetch(`${SERVER_URL}/api/sms/send-brandname`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            'User-Agent': navigator.userAgent || 'ZaloMiniApp'
          },
          body: JSON.stringify({
            phoneNumber: phoneNumber.trim(),
            message: message.trim(),
            brandname: 'GoSafe'
          })
        });

        const result = await response.json();
        
        if (result.success) {
          alert("✅ SMS Brandname đã gửi thành công!\nNgười nhận sẽ thấy tin nhắn từ 'GoSafe'");
          setPhoneNumber("");
          setMessage("");
        } else {
          throw new Error(result.error);
        }
        
      } else {
        // Option 2: Fallback - mở Messages app (không có brandname)
        console.log("📱 Fallback: Mở Messages app");
        
        const confirmed = confirm(
          `Sẽ mở Messages app để gửi SMS đến ${phoneNumber}.\n\nLưu ý: Tin nhắn sẽ gửi từ số điện thoại của bạn (không phải brandname).`
        );
        
        if (!confirmed) {
          setIsLoading(false);
          return;
        }

        await new Promise((resolve, reject) => {
          openSMS({
            phoneNumber: phoneNumber.trim(),
            content: message.trim(),
            success: (data) => {
              alert("Đã mở Messages app! Nhấn Send để gửi tin nhắn.");
              resolve(data);
            },
            fail: reject
          });
        });
      }

    } catch (error) {
      console.error("❌ Lỗi gửi SMS:", error);
      alert("Gửi SMS thất bại: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Page style={{ background: "#f6f8fa", minHeight: "100vh" }}>
      {/* Header */}
      <Box
        style={{
          display: "flex",
          alignItems: "center",
          padding: "8px 12px",
          paddingTop: "calc(4px + env(safe-area-inset-top))",
          backgroundColor: "white",
          borderBottom: "1px solid #f3f4f6",
          position: "relative",
        }}
      >
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
          }}
        >
          <Icon
            icon="zi-chevron-left-header"
            style={{ fontSize: "30px", color: "#374151" }}
          />
        </Box>
      </Box>

      <Box
        p={4}
        className="space-y-6"
        style={{
          maxWidth: 400,
          margin: "32px auto",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        }}
      >
        <Text
          size="xLarge"
          bold
          align="center"
          className="block mb-2"
          style={{ display: "block" }}
        >
          Gửi SMS GOSafe
        </Text>

        <Box>
          <Text className="mb-2" style={{ fontWeight: 500 }}>
            Số điện thoại người nhận:
          </Text>
          <Input
            type="tel"
            placeholder="Nhập số điện thoại (VD: 0901234567)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={{
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              background: "#f9fafb",
              padding: "12px",
            }}
          />
        </Box>

        <Box>
          <Text className="mb-2" style={{ fontWeight: 500 }}>
            Nội dung tin nhắn:
          </Text>
          <Input.TextArea
            placeholder="Nhập nội dung tin nhắn..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            maxLength={160}
            style={{
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              background: "#f9fafb",
              padding: "12px",
            }}
          />
          <Text
            size="xSmall"
            className="text-gray-500 mt-1"
            style={{ float: "right" }}
          >
            {message.length}/160 ký tự
          </Text>
        </Box>

        <Button
          fullWidth
          variant="primary"
          loading={isLoading}
          disabled={!phoneNumber.trim() || !message.trim()}
          onClick={handleSendSMS}
          style={{
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 16,
            background: "linear-gradient(90deg, #0072ff 0%, #00c6ff 100%)",
            border: "none",
            boxShadow: "0 2px 8px rgba(0,114,255,0.08)",
          }}
        >
          {isLoading ? "Đang xử lý..." : `Gửi SMS (${testInfo.platform})`}
        </Button>
      </Box>
    </Page>
  );
};

export default SMSBrandname;






