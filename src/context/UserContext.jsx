import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/config";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({ uid: firebaseUser.uid, email: firebaseUser.email, name: firebaseUser.displayName });
      } else {
        setUser(null);
      }
    });
    return () => unsub();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
