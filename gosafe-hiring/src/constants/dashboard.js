// Constants for services
export const SERVICES = [
  { id: "vehicle", icon: "🚗", label: "Thuê xe", bgColor: "bg-blue-500" },
  { id: "car", icon: "🚙", label: "Ô tô", bgColor: "bg-blue-600" },
  { id: "bike", icon: "🏍️", label: "Xe máy", bgColor: "bg-cyan-500" },
  { id: "food", icon: "🍔", label: "Đồ ăn", bgColor: "bg-green-500" },
];

// Constants for promotions
export const PROMOTIONS = [
  {
    id: 1,
    title: "Deal Hè Của Đá",
    subtitle: "Món Ngon Giảm Giá Cực Sốc",
    bgColor: "bg-green-500",
    image: "🧊",
  },
  {
    id: 2,
    title: "DEAL HÈ CỰC ĐÃ",
    subtitle: "ĐẢ - MÓN NGON...",
    bgColor: "bg-orange-500",
    image: "☀️",
  },
  {
    id: 3,
    title: "ĐẶT MÓN VIP",
    subtitle: "GIAO - KHAO...",
    bgColor: "bg-red-500",
    image: "👑",
  },
  {
    id: 4,
    title: "Món Ngon Mỗi Ngày",
    subtitle: "Giảm Giá Đặc Biệt",
    bgColor: "bg-purple-500",
    image: "🍽️",
  },
];

// Constants for news
export const NEWS_DATA = [
  {
    id: 1,
    title: "Deal Hè Của Đá",
    subtitle: "Món Ngon Giảm Giá Cực Sốc",
    bgColor: "bg-green-500",
    image: "🧊",
  },
  {
    id: 2,
    title: "DEAL HÈ CỰC ĐÃ",
    subtitle: "ĐẢ - MÓN NGON...",
    bgColor: "bg-orange-500",
    image: "☀️",
  },
  {
    id: 3,
    title: "ĐẶT MÓN VIP",
    subtitle: "GIAO - KHAO...",
    bgColor: "bg-red-500",
    image: "👑",
  },
];

// Service route mapping
export const SERVICE_ROUTES = {
  food: "/food",
  vehicle: "/vehicle",
  delivery: null, // Coming soon
  gift: null, // Coming soon
  gas: null, // Coming soon
  car: "/vehicle",
  bike: "/vehicle",
  market: null, // Coming soon
};

// Local storage keys
export const STORAGE_KEYS = {
  USER_PHONE: "userPhone",
};
