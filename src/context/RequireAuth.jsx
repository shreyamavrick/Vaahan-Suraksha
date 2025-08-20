// src/components/RequireAuth.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function RequireAuth() {
  const { isAuthenticated } = useUser();

  if (!isAuthenticated) {
    alert("Please login first");
    return <Navigate to="/" replace />;
  }

  return <Outlet />; // Render child routes only if authenticated
}
