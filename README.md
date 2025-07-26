# 🚗 GoSafe - Zalo Mini App

GoSafe là một ứng dụng Zalo Mini App cung cấp dịch vụ thuê xe và các tiện ích liên quan.

## 📁 Cấu trúc dự án

```
zma-gosafe/
├── client/          # Frontend - Zalo Mini App
├── server/          # Backend - Express.js API
├── start-dev.ps1    # Script khởi động development
└── test-server-simple.html  # Test server connection
```

## 🚀 Quick Start

### 1. Khởi động cả client và server (Development)
```powershell
.\start-dev.ps1
```

### 2. Khởi động riêng lẻ

#### Backend Server
```bash
cd server
npm install
npm start
```

#### Frontend Client
```bash
cd client
npm install
npm start
```

## 📱 Chức năng chính

### ✅ Đã hoàn thành
- **Lấy số điện thoại người dùng**: Client gửi request đến server để decode token Zalo và nhận số điện thoại
- **Dashboard**: Hiển thị các dịch vụ và khuyến mãi
- **Navigation**: Điều hướng giữa các trang
- **Responsive UI**: Giao diện thích ứng mobile

### 🔧 Luồng hoạt động lấy số điện thoại

1. **Client**: User nhấn đăng nhập → Yêu cầu quyền `scope.userPhonenumber` từ Zalo
2. **Client**: Lấy token từ Zalo API
3. **Client**: Gửi token đến server endpoint `/api/decode-phone`
4. **Server**: Decode token và trả về số điện thoại
5. **Client**: Hiển thị số điện thoại cho user

## 🌐 Deployment

### Server (Vercel)
- URL Production: `https://zma-gosafe-c2pee8u0f-bachtrannhatlinhs-projects.vercel.app`
- Deploy: `cd server && vercel --prod`

### Client (Zalo Mini App)
- Build: `cd client && npm run build`
- Upload build files lên Zalo Developer Console

## 🧪 Testing

### Test Server Connection
Mở file `test-server-simple.html` trong browser để test:
- Health check endpoint
- Phone decode với mock data

### Test Phone Feature
1. Mở app trong Zalo
2. Click vào service "Test SĐT" 
3. Hoặc navigation trực tiếp đến `/phone-test`

## 📂 File quan trọng

### Client
- `src/hooks/useServerAuth.js` - Hook xử lý authentication và lấy số điện thoại
- `src/components/UserHeader.jsx` - Component chính xử lý login và hiển thị info
- `src/components/PhoneTest.jsx` - Component test chức năng số điện thoại

### Server
- `server.js` - Main server file với endpoint `/api/decode-phone`
- `vercel.json` - Cấu hình deploy Vercel

## 🔧 Environment Variables

### Server (.env)
```
ZALO_APP_ID=your_zalo_app_id
ZALO_APP_SECRET=your_zalo_app_secret
```

### Client
Server URL được cấu hình tự động:
- Development: `http://localhost:5000`
- Production: URL Vercel

## 🐛 Debug

- Check console logs trong browser dev tools
- Server logs trong Vercel dashboard
- Test connection với file `test-server-simple.html`

## 📞 Liên hệ

- Developer: [Your Name]
- Repository: zma-gosafe
