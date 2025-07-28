import React from "react";
import { Page, Header } from "zmp-ui";
import OpenPhoneDemo from "../components/OpenPhoneDemo";
import BottomNavigation from "../components/BottomNavigation";

const OpenPhoneTest = () => {
  return (
    <Page>
      <Header title="📱 Test Open Phone API" showBackIcon />
      <OpenPhoneDemo />
      <BottomNavigation activeTab="other" />
    </Page>
  );
};

export default OpenPhoneTest;