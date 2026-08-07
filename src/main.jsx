import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <Toaster
  position="top-right"
  toastOptions={{
    duration: 3000,
    style: {
      borderRadius: "12px",
      background: "#fff",
      color: "#1f2937",
    },
  }}
/>
  </React.StrictMode>
);