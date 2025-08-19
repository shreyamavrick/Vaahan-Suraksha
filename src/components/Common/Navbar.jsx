import {
  Menu,
  X,
  PhoneCall,
  Home,
  Info, 
  Phone,
  Briefcase,
  User as UserIcon,
  ArrowUpRight,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useUser } from "../../context/UserContext";
import {
  FaUser,
  FaClipboardList,
  FaCar,
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaStar,
} from "react-icons/fa";

const navWithIcons = [
  { label: "Home", href: "/", icon: <Home size={20} /> },
  { label: "About", href: "/about", icon: <Info size={20} /> },
  { label: "Services", href: "/allservices", icon: <Briefcase size={20} /> },
  { label: "Contact", href: "/contact", icon: <Phone size={20} /> },
];

export default function Navbar() {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { user, logout } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const toggleNavbar = () => setMobileDrawerOpen((v) => !v);
  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileDrawerOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#FFEBC5]">
      <div className="w-full px-4 sm:px-8">
        <div className="flex items-center py-2 md:py-2.5 min-h-[70px]">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex-shrink-0">
              <img
                src={logo}
                alt="Logo"
                className="h-24 w-auto object-contain sm:h-20"
                draggable={false}
              />
            </Link>
            <ul className="hidden lg:flex items-center space-x-2">
              {navWithIcons.map((item, i) => (
                <li key={item.label} className="flex items-center">
                  {i > 0 && (
                    <span className="text-[#49AEFE] text-xl font-bold mx-1 pb-1">
                      •
                    </span>
                  )}
                  <Link
                    to={item.href}
                    className={`px-2 py-1 font-medium text-sm transition-colors ${
                      location.pathname === item.href
                        ? "text-[#232E3A] font-semibold"
                        : "text-[#232E3A] hover:text-[#49AEFE]"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex-1" />

          {/* Right: Contact + User/Login */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-11 h-11 flex items-center justify-center rounded-full bg-[#49AEFE]">
                <PhoneCall size={22} className="text-white" />
              </span>
              <div>
                <div className="text-xs text-gray-500">we are always 24/7</div>
                <a
                  href="tel:7217747633"
                  className="block font-extrabold text-base text-[#1956E0] tracking-wide hover:underline"
                >
                  +(91)7217747633
                </a>
              </div>
            </div>

            {/* Desktop User Dropdown */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 transition"
                  onClick={() => setDropdownOpen((v) => !v)}
                  type="button"
                >
                  <UserIcon size={22} className="text-gray-700" />
                  <span className="text-sm font-semibold text-gray-700">
                    {user.name || user.fullName || user.email}
                  </span>
                  <svg
                    className={`w-3 h-3 ml-1 transition-transform ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 z-40 mt-2 w-64 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <ul className="text-gray-900 py-2">
                      <li>
                        <Link
                          to="/dashboard/profile"
                          className="flex items-center gap-2 px-5 py-2 hover:bg-gray-100"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <FaUser /> My Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/dashboard/coins"
                          className="flex items-center gap-2 px-5 py-2 hover:bg-gray-100"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <FaStar className="text-yellow-400" /> Coins
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/dashboard/orders"
                          className="flex items-center gap-2 px-5 py-2 hover:bg-gray-100"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <FaClipboardList /> Order History
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/dashboard/cars"
                          className="flex items-center gap-2 px-5 py-2 hover:bg-gray-100"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <FaCar /> My Cars
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/dashboard/addresses"
                          className="flex items-center gap-2 px-5 py-2 hover:bg-gray-100"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <FaMapMarkerAlt /> Addresses
                        </Link>
                      </li>
                    </ul>
                    <div className="border-t">
                      <button
                        className="w-full text-left flex items-center gap-2 px-5 py-2 text-red-600 hover:bg-gray-100"
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="group relative flex items-center rounded-full pl-8 pr-14 py-2 border-2 border-[#49AEFE] font-semibold text-[#49AEFE] text-base transition-all duration-200 hover:bg-[#49AEFE] hover:text-white outline-none"
              >
                Login
                <span className="ml-2 w-8 h-8 bg-white group-hover:bg-[#49AEFE] border-2 border-[#49AEFE] group-hover:border-white rounded-full flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 transition-colors">
                  <ArrowUpRight
                    className="text-[#49AEFE] group-hover:text-white transition-colors"
                    size={22}
                  />
                </span>
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden p-2 ml-auto"
            onClick={toggleNavbar}
            aria-label="Open menu"
          >
            <Menu size={30} className="text-[#232E3A]" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="flex-1 bg-black/40" onClick={toggleNavbar}></div>
          <div className="w-60 max-w-full bg-white h-full shadow-lg relative flex flex-col right-drawer pt-16">
            <button
              className="absolute right-4 top-4 p-2"
              onClick={toggleNavbar}
              aria-label="Close menu"
            >
              <X size={32} className="text-[#232E3A]" />
            </button>

            <ul className="flex-1 flex flex-col gap-2 mt-2 px-3">
              {navWithIcons.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    onClick={toggleNavbar}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-lg transition
                      ${
                        location.pathname === item.href
                          ? "bg-black text-white"
                          : "text-[#232E3A] hover:bg-gray-50"
                      }`}
                  >
                    <span
                      className={`${
                        location.pathname === item.href
                          ? "bg-white text-black"
                          : "bg-[#E7F5FF] text-[#49AEFE]"
                      } w-9 h-9 flex items-center justify-center rounded-lg`}
                    >
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}

              {/* User Items */}
              {user && (
                <>
                  <li>
                    <Link
                      to="/dashboard/profile"
                      onClick={toggleNavbar}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-lg text-[#232E3A] hover:bg-gray-50"
                    >
                      <FaUser /> My Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/coins"
                      onClick={toggleNavbar}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-lg text-[#232E3A] hover:bg-gray-50"
                    >
                      <FaStar className="text-yellow-400" /> Coins
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/orders"
                      onClick={toggleNavbar}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-lg text-[#232E3A] hover:bg-gray-50"
                    >
                      <FaClipboardList /> Order History
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/cars"
                      onClick={toggleNavbar}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-lg text-[#232E3A] hover:bg-gray-50"
                    >
                      <FaCar /> My Cars
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/addresses"
                      onClick={toggleNavbar}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-lg text-[#232E3A] hover:bg-gray-50"
                    >
                      <FaMapMarkerAlt /> Addresses
                    </Link>
                  </li>
                </>
              )}
            </ul>

            {/* Bottom Login/Logout */}
            <div className="absolute bottom-6 left-6 right-6">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full py-2 text-center text-white bg-red-600 rounded-md font-semibold text-base shadow-md hover:bg-red-700 transition"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={toggleNavbar}
                  className="w-full py-2 text-center text-white bg-red-600 rounded-md font-semibold text-base shadow-md hover:bg-red-700 transition block"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
