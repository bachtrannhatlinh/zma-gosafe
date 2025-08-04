import React from "react";
import { App, ZMPRouter, AnimationRoutes, SnackbarProvider } from "zmp-ui";
import { RecoilRoot } from "recoil";
import { useAppLifecycle } from "./hooks/useAppLifecycle";
import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";

const MyApp = () => {
  useAppLifecycle();

  return (
    <RecoilRoot>
      <AuthProvider>
        <UserProvider>
          <App>
            <SnackbarProvider>
              <ZMPRouter>
                <AnimationRoutes>
                </AnimationRoutes>
              </ZMPRouter>
            </SnackbarProvider>
          </App>
        </UserProvider>
      </AuthProvider>
    </RecoilRoot>
  );
};

export default MyApp;