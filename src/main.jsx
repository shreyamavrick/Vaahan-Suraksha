import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { UserProvider } from "./context/UserContext";
import { VehicleProvider } from "./context/vehicleContext.jsx";
import { CartProvider } from "./context/cartContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <VehicleProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </VehicleProvider>
    </UserProvider>
  </StrictMode>
);
