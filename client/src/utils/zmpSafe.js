// Safe ZMP SDK utilities
export const safeZMPImport = async (apiName) => {
  try {
    const apis = await import("zmp-sdk/apis");
    return apis[apiName];
  } catch (error) {
    console.warn(`Failed to import ${apiName} from ZMP SDK:`, error);
    return null;
  }
};

export const isZMPAvailable = () => {
  return (
    typeof window !== "undefined" &&
    (window.ZaloJavaScriptInterface || window.zmp)
  );
};

// Fix: Wrap ZMP getUserInfo callback trong Promise với timeout
export const getZMPUserInfo = async () => {
  try {
    console.log("🔍 Calling ZMP getUserInfo API...");

    const getUserInfo = await safeZMPImport("getUserInfo");
    if (!getUserInfo) throw new Error("getUserInfo is not available");

    // Wrap callback-based API trong Promise với timeout
    return new Promise((resolve, reject) => {
      // Timeout sau 10 giây
      const timeout = setTimeout(() => {
        console.warn("⏰ ZMP getUserInfo timeout after 10s");
        reject(new Error("getUserInfo timeout"));
      }, 10000);

      getUserInfo({
        success: (data) => {
          clearTimeout(timeout);
          console.log("✅ ZMP getUserInfo success:", data);
          resolve(data);
        },
        fail: (error) => {
          clearTimeout(timeout);
          console.error("❌ ZMP getUserInfo failed:", error);
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error("❌ Error in getZMPUserInfo:", error);
    throw error;
  }
};

export const getZMPPhoneNumber = async () => {
  try {
    if (isZMPAvailable()) {
      const getPhoneNumber = await safeZMPImport("getPhoneNumber");
      if (getPhoneNumber) {
        return await getPhoneNumber({});
      }
    }

    return null;
  } catch (error) {
    console.error("ZMP getPhoneNumber failed:", error);
    return null;
  }
};
