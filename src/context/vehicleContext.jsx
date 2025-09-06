import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";

const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
  const { user } = useUser(); 
  const [vehicle, setVehicle] = useState({ brand: "", model: "", fuel: "" });

  
  useEffect(() => {
    if (!user?._id) {
      setVehicle({ brand: "", model: "", fuel: "" });
      return;
    }

    const savedCar = localStorage.getItem(`car_${user._id}`);
    if (savedCar) {
      try {
        setVehicle(JSON.parse(savedCar));
      } catch {
        localStorage.removeItem(`car_${user._id}`);
        setVehicle({ brand: "", model: "", fuel: "" });
      }
    } else {
      setVehicle({ brand: "", model: "", fuel: "" });
    }
  }, [user]);

  
  useEffect(() => {
    if (user?._id && vehicle?.brand && vehicle?.model) {
      localStorage.setItem(`car_${user._id}`, JSON.stringify(vehicle));
    }
  }, [user, vehicle]);

  return (
    <VehicleContext.Provider value={{ vehicle, setVehicle }}>
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicle = () => useContext(VehicleContext);
