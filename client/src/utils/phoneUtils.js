export const clearAllPhoneData = () => {
  console.log("🧹 Clearing ALL phone data...");
  
  // List all possible keys that might store phone data
  const phoneKeys = [
    'user_phone',
    'zalo_phone_token',
    'phoneNumber',
    'userPhone',
    'phone_number'
  ];
  
  phoneKeys.forEach(key => {
    const value = localStorage.getItem(key);
    if (value) {
      console.log(`🧹 Removing ${key}:`, value);
      localStorage.removeItem(key);
    }
  });
  
  console.log("🧹 All phone data cleared");
};

export const debugPhoneStorage = () => {
  console.log("🔍 Current localStorage phone data:");
  const phoneKeys = [
    'user_phone',
    'zalo_phone_token', 
    'phoneNumber',
    'userPhone',
    'phone_number'
  ];
  
  phoneKeys.forEach(key => {
    const value = localStorage.getItem(key);
    if (value) {
      console.log(`  ${key}:`, value);
    }
  });
};