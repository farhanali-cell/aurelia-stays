// src/components/Home/Navbar.jsx
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Hotels", path: "/hotels" },
  { name: "Reviews", path: "/reviews" },
  { name: "Wishlist", path: "/wishlist" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `relative font-inter text-[13px] font-medium tracking-[0.04em] uppercase transition-colors duration-300 py-1 ${
      isActive ? "text-gold" : "text-neutral-600 hover:text-neutral-900"
    } after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[1.5px] after:bg-gold after:transition-all after:duration-300 after:ease-out ${
      isActive ? "after:w-full" : "after:w-0 hover:after:w-full"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-300 ${
        scrolled
          ? "bg-parchment/95 shadow-[0_1px_0_0_rgba(200,155,60,0.25),0_8px_24px_-16px_rgba(42,33,24,0.25)]"
          : "bg-parchment/70"
      } border-b border-gold/15`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-fraunces text-[26px] leading-none tracking-tight text-neutral-900 group-hover:text-gold-dark transition-colors duration-300">
            Aurelia
          </span>
          <span className="font-fraunces italic text-[26px] leading-none bg-linear-to-r from-gold to-gold-dark bg-clip-text text-transparent">
            Stays
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-9">
          {navLinks.map((link) => (
            <NavLink key={link.path} to={link.path} className={navLinkClass}>
              {link.name}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/hotels"
          className="hidden lg:block px-5 py-2.5 rounded-full bg-ink text-white text-sm font-medium hover:bg-gold-dark hover:text-ink transition-all duration-300"
        >
          Book Now
        </Link>

        {/* Auth Buttons / User Menu */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-full border border-transparent hover:border-gold/30 hover:bg-white/60 transition-all duration-300 font-inter text-sm text-neutral-800"
              >
                <span className="w-8 h-8 rounded-full bg-linear-to-br from-gold/25 to-gold-dark/20 border border-gold/40 flex items-center justify-center text-gold-dark text-[13px] font-fraunces font-medium">
                  {user.username?.[0]?.toUpperCase()}
                </span>
                <span className="font-medium">{user.username}</span>
                <svg
                  className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-300 ${userMenuOpen ? "rotate-180" : ""}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 9l6 6 6-6"
                  />
                </svg>
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-[0_12px_32px_-8px_rgba(42,33,24,0.18)] border border-gold/15 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-gold/10">
                      <p className="font-inter text-xs text-muted">
                        Signed in as
                      </p>
                      <p className="font-inter text-sm text-neutral-900 font-medium truncate">
                        {user.username}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-4 py-3 text-sm font-inter text-neutral-700 hover:bg-parchment hover:text-gold-dark transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Profile
                    </Link>

                    <Link
                      to="/my-bookings"
                      className="flex items-center gap-2.5 px-4 py-3 text-sm font-inter text-neutral-700 hover:bg-parchment hover:text-gold-dark transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      My Bookings
                    </Link>

                    {user.role === "admin" && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-2.5 px-4 py-3 text-sm font-inter text-neutral-700 hover:bg-parchment hover:text-gold-dark transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 13h4v8H3v-8zM10 3h4v18h-4V3zM17 8h4v13h-4V8z"
                          />
                        </svg>
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 text-left px-4 py-3 text-sm font-inter text-danger hover:bg-[#F6E7E2] transition-colors border-t border-gold/10"
                    >
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                        />
                      </svg>
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="font-inter text-sm font-medium text-neutral-700 hover:text-gold-dark transition-colors duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="font-inter text-sm font-medium px-5 py-2.5 rounded-full bg-linear-to-r from-gold to-gold-dark text-white hover:shadow-md hover:shadow-gold/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 w-8"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span
            className={`h-0.5 bg-neutral-800 rounded-full transition-transform duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`h-0.5 bg-neutral-800 rounded-full transition-opacity duration-300 ${mobileOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`h-0.5 bg-neutral-800 rounded-full transition-transform duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden bg-parchment border-t border-gold/20"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className="font-inter text-base font-medium text-neutral-800 hover:text-gold-dark"
                >
                  {link.name}
                </NavLink>
              ))}
              <hr className="border-gold/20" />
              {user ? (
                <>
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold-dark text-[13px] font-fraunces font-medium">
                      {user.username?.[0]?.toUpperCase()}
                    </span>
                    <span className="font-inter text-sm text-neutral-900 font-medium">
                      {user.username}
                    </span>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="font-inter text-base text-neutral-800"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/my-bookings"
                    onClick={() => setMobileOpen(false)}
                    className="font-inter text-base text-neutral-800"
                  >
                    My Bookings
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="font-inter text-base text-neutral-800"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="font-inter text-base text-left text-danger"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="font-inter text-base text-neutral-800"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="font-inter text-base font-medium text-center px-5 py-2.5 rounded-full bg-linear-to-r from-gold to-gold-dark text-white"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
