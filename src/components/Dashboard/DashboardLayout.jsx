import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaClipboardList,
  FaCar,
  FaMapMarkerAlt,
  FaDollarSign,
  FaSignOutAlt,
  FaBars,
  FaChevronLeft
} from "react-icons/fa";
import { useUser } from "../../context/UserContext";

const menu = [
  { label: "My Profile", to: "/dashboard/profile", icon: <FaUser /> },
  { label: "Orders", to: "/dashboard/orders", icon: <FaClipboardList /> },
  { label: "My Cars", to: "/dashboard/cars", icon: <FaCar /> },
  { label: "Addresses", to: "/dashboard/addresses", icon: <FaMapMarkerAlt /> },
  { label: "Coins", to: "/dashboard/coins", icon: <FaDollarSign /> },
];

const getInitials = (name, email) => {
  if (name) {
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return "G";
};

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-20 w-64 bg-white shadow-md flex flex-col h-full transition-transform transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex justify-end md:hidden p-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-600 hover:text-gray-900"
          >
            <FaChevronLeft size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3 px-6 py-8 border-b">
          <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold text-blue-600 select-none">
            {getInitials(user?.name, user?.email)}
          </div>
          <div>
            <div className="font-semibold text-gray-800 text-base truncate max-w-[9rem]">
              {user?.name || user?.email || "Guest"}
            </div>
            <div className="text-gray-400 text-xs">Welcome</div>
          </div>
        </div>

        <nav className="flex-1 py-6">
          <ul className="space-y-1">
            {menu.map((item) => (
              <li key={item.label}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-6 py-3 rounded transition font-medium ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                  onClick={() => setSidebarOpen(false)} // close sidebar on mobile
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-6 py-4 text-red-600 font-semibold hover:bg-gray-100 transition"
        >
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center bg-white shadow p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-gray-900"
          >
            <FaBars size={20} />
          </button>
          <span className="ml-4 font-semibold text-gray-800 text-lg">
            Dashboard
          </span>
        </div>

        <main className="flex-1 p-6 md:p-12 bg-gray-50 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
