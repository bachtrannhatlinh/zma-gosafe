// React core
import React from "react";
import { createRoot } from "react-dom/client";

// ZaUI stylesheet
import "zmp-ui/zaui.css";
import "./css/tailwind.scss";
import "./css/app.scss";

// Simple overscroll behavior fix
(function() {
  'use strict';
  const style = document.createElement('style');
  style.textContent = `
    html, body, #app {
      overscroll-behavior-y: none;
      background-color: white;
      -webkit-overflow-scrolling: touch;
    }
  `;
  document.head.appendChild(style);
})();

// App configuration
import appConfig from "../app-config.json";
if (!window.APP_CONFIG) {
  window.APP_CONFIG = appConfig;
}

// Mount the app
import Layout from "./components/layout";
const root = createRoot(document.getElementById("app"));
root.render(React.createElement(Layout));
