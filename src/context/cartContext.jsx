import React, { createContext, useContext, useState, useEffect } from "react";
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [cartLoaded, setCartLoaded] = useState(false); // for avoiding overwriting merged cart

  // 🔐 Listen for auth changes (no need for custom context)
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // 📥 Load cart on user change
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        const localCart =
          JSON.parse(localStorage.getItem("autocare_cart")) || [];

        const ref = doc(db, "carts", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const firebaseCart = snap.data().items || [];

          // Merge localStorage cart into Firebase cart
          const mergedCart = mergeCarts(firebaseCart, localCart);
          setCartItems(mergedCart);
          await setDoc(ref, { items: mergedCart });

          localStorage.removeItem("autocare_cart"); // clear guest cart after merge
        } else {
          // No Firestore cart, use local or start fresh
          const initialCart = localCart.length > 0 ? localCart : [];
          setCartItems(initialCart);
          await setDoc(ref, { items: initialCart });
        }

        // Live sync with Firestore
        const unsubscribe = onSnapshot(ref, (snap) => {
          if (snap.exists()) {
            setCartItems(snap.data().items || []);
          }
        });

        setCartLoaded(true);
        return () => unsubscribe();
      } else {
        // Guest user: load from localStorage
        const stored = localStorage.getItem("autocare_cart");
        setCartItems(stored ? JSON.parse(stored) : []);
        setCartLoaded(true);
      }
    };

    loadCart();
  }, [user]);

  // 💾 Save cart on change
  useEffect(() => {
    if (!cartLoaded) return; // wait until initial load finishes

    if (user) {
      const ref = doc(db, "carts", user.uid);
      setDoc(ref, { items: cartItems });
    } else {
      localStorage.setItem("autocare_cart", JSON.stringify(cartItems));
    }
  }, [cartItems, user, cartLoaded]);

  // 🔁 Merge function
  const mergeCarts = (firebaseCart, localCart) => {
    const merged = [...firebaseCart];

    localCart.forEach((localItem) => {
      const index = merged.findIndex(
        (item) => item.service.id === localItem.service.id
      );
      if (index > -1) {
        merged[index].qty += localItem.qty;
      } else {
        merged.push(localItem);
      }
    });

    return merged;
  };

  // 🛒 Cart functions
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
