// React core
import React from "react";
import { createRoot } from "react-dom/client";

// ZaUI stylesheet
import "zmp-ui/zaui.css";

// Tailwind stylesheet
import "./css/tailwind.scss";

// Your stylesheet
import "./css/app.scss";

// Simple overscroll behavior fix for mobile
(function() {
  'use strict';
  
  // Minimal CSS injection for overscroll behavior
  const style = document.createElement('style');
  style.textContent = `
    html, body {
      overscroll-behavior-y: none;
      background-color: white;
      -webkit-overflow-scrolling: touch;
    }
    #app {
      overscroll-behavior-y: none;
      background-color: white;
    }
  `;
  document.head.appendChild(style);
})();

// Expose app configuration
import appConfig from "../app-config.json";
if (!window.APP_CONFIG) {
  window.APP_CONFIG = appConfig;
}

// Comment tạm thời Stringee initialization nếu có
// import { StringeeClient } from 'stringee';

// Comment tạm thời Stringee setup code
// const initStringee = () => {
//   // Stringee initialization code
// };

// Mount the app
import Layout from "./components/layout";
const root = createRoot(document.getElementById("app"));
root.render(React.createElement(Layout));
