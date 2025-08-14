// src/components/landing/Navbar.jsx
import { Menu, X, PhoneCall, Home, Info, Phone, Briefcase, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { navItems } from "../../constants";
import { useUser } from "../../context/UserContext";

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { user, logout } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleNavbar = () => setMobileDrawerOpen((v) => !v);

  const handleLogout = () => {
    logout();
    toggleNavbar();
    navigate("/login");
  };

  const navWithIcons = [
    { label: "Home", href: "/", icon: <Home size={20} /> },
    { label: "About", href: "/about", icon: <Info size={20} /> },
    { label: "Contact", href: "/contact", icon: <Phone size={20} /> },
    { label: "Services", href: "/services", icon: <Briefcase size={20} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 py-3 border-b border-gray-200 bg-white shadow-md">
      <div className="container mx-auto px-4 lg:px-8 relative lg:text-sm">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/">
            <img
              className="h-20 w-auto hover:scale-105 transition-transform duration-300"
              src={logo}
              alt="Logo"
            />
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex ml-10 space-x-8">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.href}
                  className="text-black hover:text-[#49AEFE] font-medium transition-colors duration-200"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <>
                {/* Profile Icon */}
                <Link to="/profile" className="flex items-center gap-2 hover:text-[#49AEFE]">
                  <UserIcon size={24} className="text-gray-700" />
                  <span className="text-sm font-semibold text-gray-700">
                    {user.name || user.fullName || user.email}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm px-4 py-2 border border-black rounded-md hover:bg-black hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-sm px-4 py-2 border border-black rounded-md hover:bg-black hover:text-white"
              >
                Sign In
              </Link>
            )}

            {/* Call Button */}
            <a
              href="tel:9999999999"
              className="flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold rounded-md bg-[#49AEFE] hover:bg-blue-500 transition"
            >
              <PhoneCall size={16} /> Call Us Now
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button onClick={toggleNavbar}>
              <Menu size={28} />
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="w-72 bg-white h-full p-6 shadow-md relative">
              <button onClick={toggleNavbar} className="absolute top-5 right-5">
                <X size={28} />
              </button>

              {/* Mobile Nav Links */}
              <ul className="mt-14 space-y-5">
                {navWithIcons.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.href}
                      onClick={toggleNavbar}
                      className={`flex items-center gap-3 px-4 py-3 rounded-md font-medium ${
                        location.pathname === item.href
                          ? "bg-black text-white"
                          : "text-gray-800 hover:text-[#49AEFE]"
                      }`}
                    >
                      {item.icon} {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Profile in Mobile Menu */}
              {user && (
                <Link
                  to="/profile"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 mt-6 px-4"
                >
                  <UserIcon size={28} className="text-gray-700" />
                  <span className="text-sm font-semibold text-gray-700">
                    {user.name || user.fullName || user.email}
                  </span>
                </Link>
              )}

              {/* Auth Button in Mobile Menu */}
              <div className="absolute bottom-6 left-6 right-6">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full py-2 text-center text-white bg-red-600 rounded-md hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={toggleNavbar}
                    className="w-full py-2 text-center text-white bg-red-600 rounded-md hover:bg-red-700 transition block"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>

            {/* Backdrop */}
            <div className="flex-1 bg-black/40" onClick={toggleNavbar}></div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
