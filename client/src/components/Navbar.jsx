import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaUtensils,
  FaChartLine,
  FaHeart,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { logoutUser } from "../features/auth/authSlice";
import { selectCartCount } from "../features/cart/cartSlice";
import { toggleTheme } from "../features/ui/uiSlice";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/reservation", label: "Reserve a Table" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const cartCount = useSelector(selectCartCount);
  const theme = useSelector((state) => state.ui.theme);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success("Signed out successfully");
    setProfileOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/90 backdrop-blur-md dark:border-ink-800 dark:bg-ink-950/90">
      <div className="container-app flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-brand-600">
          <FaUtensils />
          Restro<span className="text-ink-900 dark:text-white">Foods</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-50 text-brand-600 dark:bg-brand-900/30"
                    : "text-ink-600 hover:text-brand-600 dark:text-ink-300"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch(toggleTheme())}
            aria-label="Toggle theme"
            className="btn-ghost !p-2.5"
          >
            {theme === "dark" ? <FaSun size={16} /> : <FaMoon size={16} />}
          </button>

          <Link to="/cart" className="btn-ghost relative !p-2.5" aria-label="Cart">
            <FaShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full border border-ink-200 py-1 pl-1 pr-3 hover:border-brand-400 dark:border-ink-700"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                  {user.name?.[0]?.toUpperCase()}
                </span>
                <span className="hidden text-sm font-medium sm:inline">{user.name.split(" ")[0]}</span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-ink-100 bg-white py-1 shadow-lg dark:border-ink-800 dark:bg-ink-900">
                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50 dark:text-ink-200 dark:hover:bg-ink-800"
                  >
                    <FaUserCircle /> My Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50 dark:text-ink-200 dark:hover:bg-ink-800"
                  >
                    <FaShoppingCart /> My Orders
                  </Link>
                  <Link
                    to="/my-reservations"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50 dark:text-ink-200 dark:hover:bg-ink-800"
                  >
                    <FaUtensils /> My Reservations
                  </Link>
                  <Link
                    to="/favorites"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50 dark:text-ink-200 dark:hover:bg-ink-800"
                  >
                    <FaHeart /> My Favorites
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50 dark:text-ink-200 dark:hover:bg-ink-800"
                    >
                      <FaChartLine /> Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 border-t border-ink-100 px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:border-ink-800 dark:hover:bg-red-900/20"
                  >
                    <FaSignOutAlt /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link to="/login" className="btn-ghost text-sm">
                Login
              </Link>
              <Link to="/register" className="btn-primary text-sm">
                Sign Up
              </Link>
            </div>
          )}

          <button
            className="btn-ghost !p-2.5 md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menu"
          >
            {mobileOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-ink-100 bg-white px-4 py-3 dark:border-ink-800 dark:bg-ink-950 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50 dark:text-ink-200 dark:hover:bg-ink-800"
              >
                {link.label}
              </NavLink>
            ))}
            {!user && (
              <div className="mt-2 flex gap-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-outline flex-1 text-sm">
                  Login
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary flex-1 text-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
