// src/context/UserContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  // Load auth from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("auth");
    if (saved) {
      try {
        setAuth(JSON.parse(saved));
      } catch {
        localStorage.removeItem("auth");
      }
    }
  }, []);

  // ✅ Login or update user
  const login = (authPayload) => {
    setAuth((prev) => {
      const updatedUser = {
        ...prev?.user,
        ...authPayload.user,
        currentPlan:
          authPayload.user?.currentPlan ||
          prev?.user?.currentPlan ||
          null,
        isSubscribed:
          (authPayload.user?.isSubscribed ?? prev?.user?.isSubscribed) ||
          false,
      };

      const updatedPayload = {
        ...prev,
        ...authPayload,
        user: updatedUser,
      };

      // Save to localStorage
      localStorage.setItem("auth", JSON.stringify(updatedPayload));
      if (updatedPayload.accessToken)
        localStorage.setItem("token", updatedPayload.accessToken);
      if (updatedPayload.user)
        localStorage.setItem("user", JSON.stringify(updatedPayload.user));

      return updatedPayload;
    });
  };

  // ✅ Logout clears only auth (cart is cleared outside in components)
  const logout = () => {
    setAuth(null);
    localStorage.removeItem("auth");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const user = auth?.user || null;

  return (
    <UserContext.Provider
      value={{
        user,
        auth,
        isAuthenticated: !!auth?.accessToken,
        login,
        logout,
        setAuth, // optional
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
