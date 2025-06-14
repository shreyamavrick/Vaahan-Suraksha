import { Menu, X, PhoneCall } from "lucide-react";
import { useState } from "react";
import logo from "../assets/logo.avif";
import { navItems } from "../constants";

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  return (
    <nav className="sticky top-0 z-50 py-3 border-b border-gray-200 bg-white">
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <img
              className="h-16 w-auto mr-2 hover:scale-105 transition-transform duration-300"
              src={logo}
              alt="Logo"
            />
          </div>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex ml-14 space-x-12 transition-all duration-300">
            {navItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className="relative group transition-colors duration-200 text-black hover:text-[#49AEFE]"
                >
                  {item.label}
                  <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#49AEFE] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex justify-center space-x-6 items-center">
            <a
              href="#"
              className="py-2 px-3 border border-black rounded-md text-black hover:bg-black hover:text-white transition-all duration-300"
            >
              Sign In
            </a>
            <a
              href="#"
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
          <div className="fixed inset-0 z-50 bg-white p-12 flex flex-col justify-center items-center lg:hidden transition-all duration-300 ease-in-out animate-slide-in">
            {/* Close Button */}
            <button
              onClick={toggleNavbar}
              className="absolute top-6 right-6 text-black"
            >
              <X size={28} />
            </button>

            <ul className="space-y-6 mb-8 text-center">
              {navItems.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className="text-black text-lg hover:text-[#49AEFE] transition-all duration-300"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex flex-col items-center space-y-4">
              <a
                href="#"
                className="py-2 px-3 border border-black rounded-md text-black hover:bg-black hover:text-white transition"
              >
                Sign In
              </a>
              <a
                href="#"
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
