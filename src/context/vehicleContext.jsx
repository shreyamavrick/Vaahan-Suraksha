// src/context/VehicleContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
  const [vehicle, setVehicle] = useState({
    brand: "",
    model: "",
    id: "",
  });

  // Load from localStorage on first load
  useEffect(() => {
    const saved = localStorage.getItem("vehicle");
    if (saved) {
      setVehicle(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever vehicle changes
  useEffect(() => {
    if (vehicle.brand && vehicle.model) {
      localStorage.setItem("vehicle", JSON.stringify(vehicle));
    }
  }, [vehicle]);

  return (
    <VehicleContext.Provider value={{ vehicle, setVehicle }}>
      {children}
    </VehicleContext.Provider>
  );
};

// Hook to use vehicle context
export const useVehicle = () => useContext(VehicleContext);
