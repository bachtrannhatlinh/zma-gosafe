// Constants for main driver services - DỊCH VỤ TÀI XẾ
export const DRIVER_SERVICES = [
  { 
    id: "car-driver", 
    icon: "🚗", 
    label: "Tài xế ô tô", 
    bgColor: "bg-orange-500",
  },
  { 
    id: "bike-driver", 
    icon: "🏍️", 
    label: "Tài xế xe máy", 
    bgColor: "bg-orange-500",
  },
  { 
    id: "daily-rental", 
    icon: "📅", 
    label: "Thuê tài xế theo ngày", 
    bgColor: "bg-orange-500",
  },
];

// Constants for other GoSafe services - CÁC DỊCH VỤ KHÁC CỦA GOSAFE
export const OTHER_SERVICES = [
  { 
    id: "vehicle-registration", 
    icon: "📋", 
    label: "Đăng kiểm hộ", 
    bgColor: "bg-blue-500",
  },
  { 
    id: "bike-rental", 
    icon: "🛵", 
    label: "Cho thuê xe máy", 
    bgColor: "bg-green-500",
  },
  { 
    id: "car-rental", 
    icon: "🚙", 
    label: "Cho thuê xe ô tô", 
    bgColor: "bg-red-500",
  },
  { 
    id: "sms-brandname", 
    icon: "💬", 
    label: "SMS Brandname", 
    bgColor: "bg-purple-500",
  },
  { 
    id: "flight-tickets", 
    icon: "✈️", 
    label: "Vé máy bay", 
    bgColor: "bg-purple-500",
  },
  { 
    id: "travel-tours", 
    icon: "🌍", 
    label: "Vé khu vui chơi toàn quốc", 
    bgColor: "bg-teal-500",
  },
];


// Service route mapping
export const SERVICE_ROUTES = {
  "car-driver": "/book-ride",
  "bike-driver": "/book-ride", 
  "daily-rental": "/book-ride",
  "vehicle-registration": null, // Coming soon
  "bike-rental": null, // Coming soon
  "car-rental": null, // Coming soon
  "sms-brandname": "/sms-brandname", // SMS Brandname route
  "flight-tickets": null, // Coming soon
  "travel-tours": null, // Coming soon
  food: "/food",
  vehicle: "/vehicle",
  delivery: null, // Coming soon
  gift: null, // Coming soon
  gas: null, // Coming soon
  car: "/vehicle",
  bike: "/vehicle",
  market: null, // Coming soon
};

export const OTHER_SERVICES_ACTIVE = OTHER_SERVICES.filter(s => SERVICE_ROUTES[s.id]);
export const OTHER_SERVICES_COMING_SOON = OTHER_SERVICES.filter(s => !SERVICE_ROUTES[s.id]);

// Local storage keys
export const STORAGE_KEYS = {
  USER_PHONE: "userPhone",
};
