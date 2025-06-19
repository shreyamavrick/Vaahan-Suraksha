import { Menu, X, PhoneCall } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.avif";
import { navItems } from "../../constants";
import { useUser } from "../../context/UserContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { user } = useUser();

  const toggleNavbar = () => setMobileDrawerOpen(!mobileDrawerOpen);

  const handleLogout = () => {
    signOut(auth);
    toggleNavbar();
  };

  return (
    <nav className="sticky top-0 z-50 py-3 border-b border-gray-200 bg-white">
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/">
              <img
                className="h-16 w-auto mr-2 hover:scale-105 transition-transform duration-300"
                src={logo}
                alt="Logo"
              />
            </Link>
          </div>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex ml-14 space-x-12">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.href}
                  className="relative group text-black hover:text-[#49AEFE] transition-colors duration-200"
                >
                  {item.label}
                  <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#49AEFE] group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex space-x-6 items-center">
            {user ? (
              <>
                <span className="font-medium">Hello, {user.name || user.displayName}</span>
                <button
                  onClick={() => signOut(auth)}
                  className="py-2 px-3 border border-black rounded-md hover:bg-black hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="py-2 px-3 border border-black rounded-md hover:bg-black hover:text-white"
              >
                Sign In
              </Link>
            )}

            <a
              href="tel:9999999999"
              className="flex items-center gap-2 py-2 px-4 text-white font-semibold text-sm rounded-md bg-[#49AEFE] shadow-md hover:shadow-xl hover:brightness-110 transition duration-300 animate-pulse"
            >
              <PhoneCall size={18} />
              Call Us Now
            </a>
          </div>

          {/* Mobile Hamburger */}
          <div className="lg:hidden flex items-center">
            <button onClick={toggleNavbar}>
              <Menu size={28} />
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 bg-white p-12 flex flex-col justify-center items-center lg:hidden animate-slide-in">
            <button
              onClick={toggleNavbar}
              className="absolute top-6 right-6 text-black"
            >
              <X size={28} />
            </button>

            <ul className="space-y-6 mb-8 text-center">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.href}
                    onClick={toggleNavbar}
                    className="text-black text-lg hover:text-[#49AEFE] transition-all duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex flex-col items-center space-y-4">
              {user ? (
                <>
                  <span className="text-black font-semibold">Hello, {user.name || user.displayName}</span>
                  <button
                    onClick={handleLogout}
                    className="py-2 px-3 border border-red-500 rounded-md text-red-600 hover:bg-red-600 hover:text-white transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={toggleNavbar}
                  className="py-2 px-3 border border-black rounded-md text-black hover:bg-black hover:text-white transition"
                >
                  Sign In
                </Link>
              )}

              <a
                href="tel:9999999999"
                className="flex items-center gap-2 py-2 px-4 text-white font-semibold text-sm rounded-md bg-[#49AEFE] shadow-md hover:shadow-xl hover:brightness-110 transition duration-300"
              >
                <PhoneCall size={18} />
                Call Us Now
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
