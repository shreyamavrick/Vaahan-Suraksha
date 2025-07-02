import { createContext, useContext, useState } from "react";

const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
  // initially empty
  const [vehicle, setVehicle] = useState({
    location: "",
    mobile: "",
    manufacturer: "",
    model: "",
    fuel: "",
  });

  // call this once form is submitted
  const saveVehicle = (details) => {
    setVehicle(details);
  };

  return (
    <VehicleContext.Provider value={{ vehicle, saveVehicle }}>
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicle = () => useContext(VehicleContext);
