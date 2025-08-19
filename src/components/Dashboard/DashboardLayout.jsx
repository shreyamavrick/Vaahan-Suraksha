import { NavLink, Outlet } from "react-router-dom";
import {
  FaUser,
  FaClipboardList,
  FaCar,
  FaMapMarkerAlt,
  FaDollarSign,
  FaSignOutAlt
} from "react-icons/fa";
import { useUser } from "../../context/UserContext";

const menu = [
  { label: "My Profile", to: "/dashboard/profile", icon: <FaUser /> },
  { label: "Orders", to: "/dashboard/orders", icon: <FaClipboardList /> },
  { label: "My Cars", to: "/dashboard/cars", icon: <FaCar /> },
  { label: "Addresses", to: "/dashboard/addresses", icon: <FaMapMarkerAlt /> },
  { label: "Coins", to: "/dashboard/coins", icon: <FaDollarSign /> },
];

export default function DashboardLayout() {
  const { user, logout } = useUser();

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "G"; // Guest fallback
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0][0]; // Single name
    return parts[0][0] + parts[1][0]; // First + last initial
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-md flex flex-col">
        <div className="flex items-center gap-3 px-6 py-8 border-b">
          {/* Avatar with initials */}
          <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold text-blue-600 select-none">
            {user?.name ? getInitials(user.name) : (user?.email ? user.email[0].toUpperCase() : "G")}
          </div>
          {/* Name + welcome */}
          <div>
            <div className="font-semibold text-gray-800 text-base truncate max-w-[9rem]">
              {user?.name || user?.email || "Guest"}
            </div>
            <div className="text-gray-400 text-xs">Welcome</div>
          </div>
        </div>

        {/* Menu */}
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
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-2 px-6 py-4 text-red-600 font-semibold hover:bg-gray-100 transition"
        >
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-12 bg-gray-50 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
