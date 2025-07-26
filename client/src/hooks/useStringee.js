import { useState, useEffect, useRef } from "react";

// Khai báo biến global cho Stringee SDK
let StringeeClient, StringeeCall;

// Import Stringee SDK từ npm package
const loadStringeeSDK = async () => {
  try {
    const StringeeSDK = await import('stringee');
    
    if (StringeeSDK.StringeeClient && StringeeSDK.StringeeCall) {
      StringeeClient = StringeeSDK.StringeeClient;
      StringeeCall = StringeeSDK.StringeeCall;
      console.log('✅ Stringee SDK loaded from npm');
      return;
    }
    
    // Fallback to global variables if available
    if (window.StringeeClient && window.StringeeCall) {
      StringeeClient = window.StringeeClient;
      StringeeCall = window.StringeeCall;
      console.log('✅ Stringee SDK loaded from window');
      return;
    }
    
    throw new Error('Stringee classes not found');
    
  } catch (error) {
    console.error('❌ Failed to load Stringee SDK:', error);
    throw error;
  }
};

const generateMockStringeeToken = () => {
  const header = btoa(JSON.stringify({
    typ: 'JWT',
    alg: 'HS256',
    cty: 'stringee-api;v=1'
  }));
  
  const payload = btoa(JSON.stringify({
    jti: 'mock-' + Date.now(),
    iss: 'mock-api-key', 
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
    userId: 'mock_user_' + Date.now()
  }));
  
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
};

const getTokenViaXHR = (serverUrl) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("POST", `${serverUrl}/api/stringee/token`, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.timeout = 15000;

    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          const result = JSON.parse(xhr.responseText);
          console.log("✅ XHR success:", result);
          if (result.success) {
            resolve(result.token);
          } else {
            reject(new Error(result.error || "XHR failed"));
          }
        } catch (e) {
          reject(new Error("Invalid JSON response"));
        }
      } else {
        reject(new Error(`XHR failed: ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error("XHR network error"));
    xhr.ontimeout = () => reject(new Error("XHR timeout"));

    xhr.send(JSON.stringify({ userId: "demo_user_" + Date.now() }));
  });
};

const getStringeeToken = async () => {
  try {
    console.log('🔗 Getting token via XHR (bypass Zalo API)');
    
    const SERVER_URL = 'https://server-weld-mu-76.vercel.app';
    const token = await getTokenViaXHR(SERVER_URL);
    console.log('✅ Got token via XHR');
    return token;
    
  } catch (error) {
    console.error('❌ XHR failed:', error);
    console.log('🔄 Using mock token for testing');
    
    // Return mock token ngay lập tức khi XHR fail
    return generateMockStringeeToken();
  }
};

export const useStringee = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [currentCall, setCurrentCall] = useState(null);
  const [callState, setCallState] = useState("idle");
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [error, setError] = useState(null);
  const clientRef = useRef(null);

  useEffect(() => {
    initStringee();
    return () => {
      if (clientRef.current) {
        try {
          clientRef.current.disconnect();
        } catch (e) {
          console.warn("Cleanup error:", e);
        }
      }
    };
  }, []);

  const initStringee = async () => {
    try {
      console.log("🚀 Initializing Stringee...");
      setError(null);

      // Load SDK first
      await loadStringeeSDK();
      setSdkLoaded(true);

      // Get access token from server
      const token = await getStringeeToken();

      if (!StringeeClient) {
        throw new Error("StringeeClient not available");
      }

      clientRef.current = new StringeeClient();

      clientRef.current.on("connect", () => {
        console.log("✅ Stringee connected");
        setIsConnected(true);
        setError(null);
      });

      clientRef.current.on("disconnect", () => {
        console.log("❌ Stringee disconnected");
        setIsConnected(false);
      });

      // Thêm event handler cho authen
      clientRef.current.on("authen", (res) => {
        console.log("🔐 Stringee authen:", res);
        if (res.r === 0) {
          console.log("✅ Authentication successful");
        } else {
          console.error("❌ Authentication failed:", res.message);
          setError("Authentication failed: " + res.message);
        }
      });

      clientRef.current.on("incomingcall", (incomingCall) => {
        console.log("📞 Incoming call:", incomingCall);
        handleIncomingCall(incomingCall);
      });

      clientRef.current.on("error", (error) => {
        console.error("❌ Stringee error:", error);
        setIsConnected(false);
        setError(error.message || "Stringee connection error");
      });

      // Connect with retry logic
      clientRef.current.connect(token);

      // Set timeout for connection
      setTimeout(() => {
        if (!isConnected) {
          console.warn("⚠️ Stringee connection timeout");
          setError("Connection timeout - please try again");
        }
      }, 15000);
    } catch (error) {
      console.error("❌ Stringee init error:", error);
      setIsConnected(false);
      setError(error.message || "Failed to initialize Stringee");
    }
  };

  const makeCall = (phoneNumber) => {
    if (!clientRef.current || !isConnected) {
      console.error("❌ Stringee not connected");
      setError("Not connected to Stringee");
      return;
    }

    if (!StringeeCall) {
      console.error("❌ StringeeCall not available");
      setError("StringeeCall not loaded");
      return;
    }

    try {
      const call = new StringeeCall(
        clientRef.current,
        phoneNumber,
        phoneNumber
      );

      call.on("addlocalstream", (stream) => {
        console.log("🎤 Local stream added");
      });

      call.on("addremotestream", (stream) => {
        console.log("🔊 Remote stream added");
      });

      call.on("signalingstate", (state) => {
        console.log("📡 Signaling state:", state.code, state.reason);
        setCallState(state.code === 3 ? "answered" : "calling");
      });

      call.on("mediastate", (state) => {
        console.log("🎵 Media state:", state.code, state.reason);
      });

      call.on("info", (info) => {
        console.log("ℹ️ Call info:", info);
      });

      setCurrentCall(call);
      setCallState("calling");
      call.makeCall();
    } catch (error) {
      console.error("❌ Make call error:", error);
      setError("Failed to make call: " + error.message);
    }
  };

  const answerCall = () => {
    if (currentCall) {
      currentCall.answer();
      setCallState("answered");
    }
  };

  const hangupCall = () => {
    if (currentCall) {
      currentCall.hangup();
      setCurrentCall(null);
      setCallState("idle");
    }
  };

  const handleIncomingCall = (incomingCall) => {
    setCurrentCall(incomingCall);
    setCallState("ringing");
  };

  const retry = () => {
    setError(null);
    setIsConnected(false);
    setSdkLoaded(false);
    initStringee();
  };

  return {
    isConnected,
    currentCall,
    callState,
    sdkLoaded,
    error,
    makeCall,
    answerCall,
    hangupCall,
    retry,
  };
};











