import { Menu, X, PhoneCall, Home, Info, Book, Phone, Briefcase } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.avif";
import { navItems } from "../../constants";
import { useUser } from "../../context/UserContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { user } = useUser();
  const location = useLocation();

  const toggleNavbar = () => setMobileDrawerOpen(!mobileDrawerOpen);

  const handleLogout = () => {
    signOut(auth);
    toggleNavbar();
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
          <Link to="/">
            <img
              className="h-14 w-auto hover:scale-105 transition-transform duration-300"
              src={logo}
              alt="Logo"
            />
          </Link>

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

          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm font-semibold text-gray-700">Hello, {user.name || user.displayName}</span>
                <button
                  onClick={() => signOut(auth)}
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

            <a
              href="tel:9999999999"
              className="flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold rounded-md bg-[#49AEFE] hover:bg-blue-500 transition"
            >
              <PhoneCall size={16} /> Call Us Now
            </a>
          </div>

          <div className="lg:hidden">
            <button onClick={toggleNavbar}>
              <Menu size={28} />
            </button>
          </div>
        </div>

        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Sidebar */}
            <div className="w-72 bg-white h-full p-6 shadow-md relative">
              <button onClick={toggleNavbar} className="absolute top-5 right-5">
                <X size={28} />
              </button>

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

            {/* Optional backdrop */}
            <div className="flex-1 bg-black/40" onClick={toggleNavbar}></div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
