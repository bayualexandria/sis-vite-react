import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Tambahkan basename pada folder project ketika mau di build contoh "basename="/sis"" pada <BrowserRoute> */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
