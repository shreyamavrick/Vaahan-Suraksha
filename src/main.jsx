import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { UserProvider } from "./context/UserContext";
import { CartProvider } from "./context/cartContext";
import { VehicleProvider } from "./context/vehicleContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <CartProvider>
        <VehicleProvider>
        <App />
        </VehicleProvider>
      </CartProvider>
    </UserProvider>
  </StrictMode>
);
