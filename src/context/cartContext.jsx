import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);

 
  useEffect(() => {
    const stored = localStorage.getItem("autocare_cart");
    setCartItems(stored ? JSON.parse(stored) : []);
    setCartLoaded(true);
  }, []);

 
  useEffect(() => {
    if (!cartLoaded) return; 
    localStorage.setItem("autocare_cart", JSON.stringify(cartItems));
  }, [cartItems, cartLoaded]);

 
  const addToCart = (service) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((c) => c.service.id === service.id);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].qty += 1;
        return updated;
      }
      return [...prev, { service, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((c) => c.service.id !== id));
  };

  const changeQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev
        .map((c) =>
          c.service.id === id
            ? { ...c, qty: Math.max(1, c.qty + delta) }
            : c
        )
        .filter((c) => c.qty > 0)
    );
  };

  const isInCart = (id) => cartItems.some((c) => c.service.id === id);

  const subtotal = cartItems.reduce(
    (sum, c) => sum + c.service.newPrice * c.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        changeQuantity,
        isInCart,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
