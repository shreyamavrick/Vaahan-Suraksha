import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

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

  const login = (authPayload) => {
    setAuth(authPayload);
    localStorage.setItem("auth", JSON.stringify(authPayload));

    // ✅ Add these lines
    if (authPayload.accessToken) {
      localStorage.setItem("token", authPayload.accessToken);
    }
    if (authPayload.user) {
      localStorage.setItem("user", JSON.stringify(authPayload.user));
    }
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem("auth");

    // ✅ Remove token and user on logout
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
