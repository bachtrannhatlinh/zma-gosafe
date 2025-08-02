import { getSystemInfo } from "zmp-sdk";
import {
  AnimationRoutes,
  App,
  Route,
  SnackbarProvider,
  ZMPRouter,
} from "zmp-ui";
import { Provider } from "jotai";
import { UserProvider } from "../contexts/UserContext";

import Dashboard from "../pages/Dashboard";
import SMSBrandnamePage from "../pages/SMSBrandname";
import History from "../pages/History";
import Account from "../pages/Account";
import VehicleManagement from "../pages/VehicleManagement";
import AddVehicle from "../pages/AddVehicle";
import ChangePassword from "../pages/ChangePassword";
import VNPayPolicy from "../pages/VNPayPolicy";
import Promotions from "../pages/Promotions";
import PromotionDetail from "../pages/PromotionDetail";
import CallToUser from "../pages/CallToUser";
import LiveChat from "../pages/Chat/ChatPage";

const Layout = () => {
  return (
    <Provider>
      <UserProvider>
        <App theme={getSystemInfo().zaloTheme}>
          <SnackbarProvider>
            <ZMPRouter>
              <AnimationRoutes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/call-to-user" element={<CallToUser />} />
                <Route path="/sms-brandname" element={<SMSBrandnamePage />} />
                <Route path="/zalo-chat" element={<LiveChat />} />
                <Route path="/history" element={<History />} />
                <Route path="/account" element={<Account />} />
                <Route path="/vehicle-management" element={<VehicleManagement />} />
                <Route path="/add-vehicle" element={<AddVehicle />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/vnpay-policy" element={<VNPayPolicy />} />
                <Route path="/promotions" element={<Promotions />} />
                <Route path="/promotion-detail/:id" element={<PromotionDetail />} />
                <Route path="*" element={
                  <div style={{padding: '20px', textAlign: 'center'}}>
                    <h2>Page not found</h2>
                    <p>Current path: {window.location.pathname}</p>
                  </div>
                } />
              </AnimationRoutes>
            </ZMPRouter>
          </SnackbarProvider>
        </App>
      </UserProvider>
    </Provider>
  );
};
export default Layout;
