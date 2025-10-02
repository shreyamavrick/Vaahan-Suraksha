import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaClipboardList,
  FaCar,
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaBars,
  FaChevronLeft,
  FaBoxOpen,
  FaFileInvoice,
} from "react-icons/fa";
import { useUser } from "../../context/UserContext";

const menu = [
  { label: "My Profile", to: "/dashboard/profile", icon: <FaUser /> },
  { label: "Orders", to: "/dashboard/orders", icon: <FaClipboardList /> },
  { label: "My Cars", to: "/dashboard/cars", icon: <FaCar /> },
  { label: "Addresses", to: "/dashboard/addresses", icon: <FaMapMarkerAlt /> },
  { label: "My Plans", to: "/dashboard/myplan", icon: <FaBoxOpen /> },
  { label: "Billing History", to: "/dashboard/billingHistory", icon: <FaFileInvoice /> },
];

const getInitials = (name, email) => {
  if (name) {
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
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
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-md transform transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        aria-hidden={!sidebarOpen && window.innerWidth < 768}
      >
        <div className="flex flex-col h-screen">
          <div className="flex justify-end md:hidden p-3">
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-600 hover:text-gray-900"
              aria-label="Close sidebar"
            >
              <FaChevronLeft size={18} />
            </button>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3 px-6 py-6 border-b">
            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold text-blue-600 select-none">
              {getInitials(user?.name, user?.email)}
            </div>
            <div className="truncate">
              <div className="font-semibold text-gray-800 text-base truncate max-w-[11rem]">
                {user?.name || user?.email || "Guest"}
              </div>
              <div className="text-gray-400 text-xs">Welcome</div>
            </div>
          </div>

          {/* Nav (scrollable) */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1">
              {menu.map((item) => (
                <li key={item.label}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-6 py-3 rounded transition-colors duration-150 font-medium ${
                        isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                </li>
              ))}

              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-6 py-3 text-red-600 font-semibold hover:bg-gray-100 transition w-full"
                >
                  <FaSignOutAlt /> <span>Logout</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
      <div className="md:pl-64">
        <div className="md:hidden flex items-center bg-white shadow p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-gray-900"
            aria-label="Open sidebar"
          >
            <FaBars size={20} />
          </button>
          <span className="ml-4 font-semibold text-gray-800 text-lg">Dashboard</span>
        </div>

        <main className="min-h-screen p-6 md:p-12 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
 