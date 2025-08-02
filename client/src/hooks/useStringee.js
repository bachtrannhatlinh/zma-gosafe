import { useState, useEffect, useRef } from "react";
import { getServerUrl } from '../config/server';
// import StringeeClient from "stringee";

// Function để lấy Stringee token từ server
const getStringeeToken = async () => {
  try {
    const SERVER_URL = getServerUrl();
    
    console.log('🔑 Getting Stringee token from server...');
    
    const response = await fetch(`${SERVER_URL}/api/stringee/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: `user_${Date.now()}`
      }),
      timeout: 10000
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success || !result.token) {
      throw new Error(result.error || 'No token received');
    }

    console.log('✅ Stringee token received');
    return result.token;
    
  } catch (error) {
    console.error('❌ Failed to get Stringee token:', error);
    
    // Fallback: tạo mock token để test
    console.log('🔄 Using mock token for testing...');
    return 'mock_token_for_testing';
  }
};

// Load Stringee SDK từ npm package
const loadStringeeSDK = async () => {
  try {
    console.log('✅ Stringee SDK loaded from npm package');
    return {
      StringeeClient: StringeeClient.StringeeClient,
      StringeeCall: StringeeClient.StringeeCall2
    };
  } catch (error) {
    console.error('❌ Failed to load Stringee SDK:', error);
    throw error;
  }
};

export const useStringee = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [currentCall, setCurrentCall] = useState(null);
  const [callState, setCallState] = useState("idle");
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [error, setError] = useState(null);
  const clientRef = useRef(null);
  const StringeeClientClass = useRef(null);
  const StringeeCallClass = useRef(null);

  useEffect(() => {
    // initStringee();
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

      // Load SDK
      const { StringeeClient, StringeeCall } = await loadStringeeSDK();
      StringeeClientClass.current = StringeeClient;
      StringeeCallClass.current = StringeeCall;
      setSdkLoaded(true);

      // Get token từ server
      const token = await getStringeeToken();

      // Tạo client instance
      clientRef.current = new StringeeClient();

      // Setup event listeners
      clientRef.current.on("connect", () => {
        console.log("✅ Stringee connected");
        setIsConnected(true);
        setError(null);
      });

      clientRef.current.on("disconnect", () => {
        console.log("❌ Stringee disconnected");
        setIsConnected(false);
      });

      clientRef.current.on("authen", (res) => {
        console.log("🔐 Stringee authen:", res);
        if (res.r !== 0) {
          console.error("❌ Authentication failed:", res.message);
          setError("Authentication failed: " + res.message);
        }
      });

      clientRef.current.on("incomingcall2", (incomingCall) => {
        console.log("📞 Incoming call:", incomingCall);
        handleIncomingCall(incomingCall);
      });

      // Connect
      clientRef.current.connect(token);

    } catch (error) {
      console.error("❌ Stringee init error:", error);
      setError(error.message || "Failed to initialize Stringee");
    }
  };

  const makeCall = (phoneNumber) => {
    if (!clientRef.current || !isConnected) {
      setError("Not connected to Stringee");
      return;
    }

    if (!StringeeCallClass.current) {
      setError("StringeeCall not loaded");
      return;
    }

    try {
      // Sử dụng Call2 cho voice call (false = voice only)
      const call = new StringeeCallClass.current(
        clientRef.current,
        `user_${Date.now()}`, // fromUserId
        phoneNumber, // toUserId (số điện thoại)
        false // isVideoCall
      );

      // Setup call events
      call.on("addlocalstream", (stream) => {
        console.log("🎤 Local stream added");
      });

      call.on("addremotestream", (stream) => {
        console.log("🔊 Remote stream added");
      });

      call.on("signalingstate", (state) => {
        console.log("📡 Signaling state:", state);
        if (state.code === 3) {
          setCallState("answered");
        } else if (state.code === 1) {
          setCallState("calling");
        }
      });

      call.on("mediastate", (state) => {
        console.log("🎵 Media state:", state);
      });

      setCurrentCall(call);
      setCallState("calling");
      
      // Make call
      call.makeCall((res) => {
        console.log("📞 Make call result:", res);
        if (res.r !== 0) {
          setError("Call failed: " + res.message);
          setCallState("idle");
        }
      });

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















