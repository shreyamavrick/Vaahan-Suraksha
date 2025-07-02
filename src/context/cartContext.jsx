import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 1) On init, read from localStorage (or empty array)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem("autocare_cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // 2) Whenever cartItems change, write back to localStorage
  useEffect(() => {
    localStorage.setItem("autocare_cart", JSON.stringify(cartItems));
  }, [cartItems]);

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
          c.service.id === id ? { ...c, qty: Math.max(1, c.qty + delta) } : c
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

export const useCart = () => useContext(CartContext);
