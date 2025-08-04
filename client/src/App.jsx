import React from "react";
import { useAppLifecycle } from "./hooks/useAppLifecycle";
import Layout from "./components/layout";

const MyApp = () => {
  useAppLifecycle();

  return <Layout />;
};

export default MyApp;