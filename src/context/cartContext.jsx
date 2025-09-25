import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useUser();

  const storageKey = user ? `autocare_cart_${user.uid}` : "autocare_cart_guest";


  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem(storageKey);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(cart));
  }, [cart, storageKey]);

 
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(storageKey);
      setCart(savedCart ? JSON.parse(savedCart) : []);
    } catch {
      setCart([]);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!user) {
      setCart([]);
      localStorage.removeItem("autocare_cart_guest");
    }
  }, [user]);

      
  const addToCart = (service) => {
    setCart((prev) => {
      if (!prev.some((item) => item._id === service._id)) {
        return [...prev, service];
      }
      return prev;
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const clearCart = () => setCart([]);

  const isInCart = (id) => cart.some((item) => item._id === id);

  const subtotal = cart.reduce(
    (sum, item) => sum + (item.newPrice || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, isInCart, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}; 

export const useCart = () => useContext(CartContext);
