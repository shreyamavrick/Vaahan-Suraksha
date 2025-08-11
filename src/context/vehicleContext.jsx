import { createContext, useContext, useState } from "react";

const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
  
  const [vehicle, setVehicle] = useState({
    location: "",
    mobile: "",
    manufacturer: "",
    model: "",
    fuel: "",
  });
 
 
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
