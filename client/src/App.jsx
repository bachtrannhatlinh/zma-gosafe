import React from "react";
import { App, ZMPRouter, AnimationRoutes, SnackbarProvider } from "zmp-ui";
import { RecoilRoot } from "recoil";
import { useAppLifecycle } from "./hooks/useAppLifecycle";
import { UserProvider } from "./contexts/UserContext";

const MyApp = () => {
  useAppLifecycle();

  return (
    <RecoilRoot>
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
    </RecoilRoot>
  );
};

export default MyApp;